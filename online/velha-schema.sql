-- Preparação Supabase: executar antes de velha-catalogo.sql. Integração ainda não ativada.
create table if not exists public.opc_velha_catalog (id boolean primary key default true check(id), version text not null, data jsonb not null);
create table if not exists public.opc_velha_rooms (
 code text primary key default upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),
 host uuid not null, guest uuid, catalog_version text not null, names jsonb not null, config jsonb not null,
 state jsonb not null, queue boolean not null default false,
 created_at timestamptz not null default now(), touched_at timestamptz not null default now(), abandoned boolean not null default false
);
alter table public.opc_velha_catalog enable row level security;
alter table public.opc_velha_rooms enable row level security;
revoke all on public.opc_velha_catalog, public.opc_velha_rooms from anon, authenticated;

create or replace function public.opc_velha_pick(m text, d text, previous_id text default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare result jsonb; old jsonb; catalog jsonb;
begin
 select data into catalog from public.opc_velha_catalog where id=true;
 select b into old from jsonb_array_elements(catalog->'boards') b where b->>'id'=previous_id;
 select b into result from jsonb_array_elements(catalog->'boards') b
 where b->>'mode'=m and b->>'difficulty'=d and (previous_id is null or b->>'id'<>previous_id)
 and (old is null or (b->'rows'->>0<>old->'rows'->>0 and b->'rows'->>1<>old->'rows'->>1 and b->'rows'->>2<>old->'rows'->>2
 and b->'cols'->>0<>old->'cols'->>0 and b->'cols'->>1<>old->'cols'->>1 and b->'cols'->>2<>old->'cols'->>2))
 order by random() limit 1;
 if result is null then raise exception 'Não há grade auditada disponível.'; end if;
 return result;
end $$;

create or replace function public.opc_velha_reply(r public.opc_velha_rooms, who uuid, msg text default '')
returns jsonb language sql security definer set search_path=public,pg_temp as $$
 select jsonb_build_object('code',r.code,'seat',case when r.host=who then 0 else 1 end,'names',r.names,
 'state',case when r.guest is null then null else r.state end,'message',msg,
 'status',case when r.abandoned then 'O adversário saiu. Esta partida foi encerrada.' when r.guest is null then 'Sala '||r.code||' · aguardando adversário. Compartilhe o código.' else 'Sala '||r.code||' · conexão ativa' end,
 'abandoned',r.abandoned,'catalogVersion',(select version from public.opc_velha_catalog where id=true));
$$;

create or replace function public.opc_velha(payload jsonb)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
 who uuid:=auth.uid(); kind text:=payload->>'type'; r public.opc_velha_rooms; cfg jsonb; s jsonb; b jsonb; p jsonb; c jsonb;
 catalog jsonb; ver text; nick text; actor integer; pos integer; index_num integer; owner integer; counter integer;
 good boolean; complete boolean; win_line jsonb; line jsonb; msg text:=''; n integer;
begin
 if who is null then raise exception 'Identificação anônima necessária.'; end if;
 select data,version into catalog,ver from public.opc_velha_catalog where id=true;
 if catalog is null then raise exception 'Catálogo online ainda não instalado.'; end if;
 delete from public.opc_velha_rooms where created_at<now()-interval '24 hours';
 if kind in ('create','join','queue') then
  if payload->>'catalogVersion' is distinct from ver then raise exception 'Recarregue o jogo para atualizar a base.'; end if;
  nick:=left(coalesce(nullif(btrim(payload->>'name'),''),'Jogador'),24);
  if kind='join' then
   select * into r from public.opc_velha_rooms where code=upper(payload->>'code') and not abandoned and created_at>now()-interval '15 minutes' for update;
   if not found then raise exception 'Sala não encontrada ou expirada.'; end if;
   if r.host=who or r.guest=who then return public.opc_velha_reply(r,who); end if;
   if r.guest is not null then raise exception 'Esta sala já tem duas pessoas.'; end if;
   update public.opc_velha_rooms set guest=who,names=jsonb_set(names,'{1}',to_jsonb(nick)),touched_at=now() where code=r.code returning * into r;
   return public.opc_velha_reply(r,who,'Adversário conectado. A partida começou.');
  end if;
  if kind='queue' then
   -- Serializa o pareamento para que duas solicitações simultâneas se encontrem.
   perform pg_advisory_xact_lock(628194017);
   select * into r from public.opc_velha_rooms where queue and guest is null and host<>who and not abandoned and created_at>now()-interval '15 minutes' order by created_at limit 1 for update skip locked;
   if found then
    update public.opc_velha_rooms set guest=who,names=jsonb_set(names,'{1}',to_jsonb(nick)),touched_at=now() where code=r.code returning * into r;
    return public.opc_velha_reply(r,who,'Adversário encontrado. Primeiro a três vitórias.');
   end if;
   cfg:='{"mode":"europe","difficulty":"normal","target":3,"format":"wins","steal":false}'::jsonb;
  else cfg:=payload->'config'; end if;
  if cfg is null or coalesce(cfg->>'format','wins') not in ('wins','rounds') or cfg->>'difficulty' not in ('normal','hard') or cfg->>'target' not in ('1','2','3','5')
   or jsonb_typeof(cfg->'steal') is distinct from 'boolean' then raise exception 'Configuração inválida.'; end if;
  b:=public.opc_velha_pick(cfg->>'mode',cfg->>'difficulty');
  cfg:=jsonb_build_object('mode',cfg->>'mode','difficulty',cfg->>'difficulty','format',coalesce(cfg->>'format','wins'),'target',(cfg->>'target')::integer,'steal',(cfg->>'steal')::boolean);
  s:=jsonb_build_object('config',cfg,'boardId',b->>'id','round',1,'score',jsonb_build_array(0,0),'turn',0,'cells','[null,null,null,null,null,null,null,null,null]'::jsonb,
   'used','[]'::jsonb,'steals','[0,0]'::jsonb,'moves',0,'roundEnded',false,'matchEnded',false,'matchWinner',null,'result',null,'version',0);
  -- Uma sala em espera por identidade; não deixa múltiplas entradas órfãs na fila.
  delete from public.opc_velha_rooms where host=who and guest is null;
  insert into public.opc_velha_rooms(host,catalog_version,names,config,state,queue) values(who,ver,jsonb_build_array(nick,'Adversário'),cfg,s,kind='queue') returning * into r;
  return public.opc_velha_reply(r,who);
 end if;
 select * into r from public.opc_velha_rooms where code=upper(payload->>'code') for update;
 if not found or (r.host<>who and r.guest is distinct from who) then raise exception 'Sala indisponível para esta identificação.'; end if;
 if r.catalog_version is distinct from ver then raise exception 'A base mudou. Inicie uma nova partida.'; end if;
 if kind='get' and r.guest is null and r.created_at<now()-interval '15 minutes' then raise exception 'A espera expirou. Cancele e crie outra sala.'; end if;
 if kind='get' then return public.opc_velha_reply(r,who); end if;
 if kind='leave' then
  if r.guest is null then delete from public.opc_velha_rooms where code=r.code; return jsonb_build_object('left',true); end if;
  s:=r.state||jsonb_build_object('roundEnded',true,'matchEnded',true,'result',jsonb_build_object('winner',null,'line','[]'::jsonb),'version',(r.state->>'version')::integer+1);
  update public.opc_velha_rooms set state=s,abandoned=true,touched_at=now() where code=r.code returning * into r;
  return public.opc_velha_reply(r,who,'Partida encerrada pela saída de um jogador.');
 end if;
 if r.guest is null or r.abandoned then raise exception 'A partida não está ativa.'; end if;
 s:=r.state;cfg:=r.config;
 if payload->>'expectedVersion' is distinct from s->>'version' then return public.opc_velha_reply(r,who,'A grade já foi atualizada. Confira o turno.'); end if;
 if kind='next' then
  if not (s->>'roundEnded')::boolean or (s->>'matchEnded')::boolean then raise exception 'Não é possível iniciar outra rodada.'; end if;
  b:=public.opc_velha_pick(cfg->>'mode',cfg->>'difficulty',s->>'boardId');n:=(s->>'round')::integer;
  s:=s||jsonb_build_object('boardId',b->>'id','round',n+1,'turn',n%2,'cells','[null,null,null,null,null,null,null,null,null]'::jsonb,'used','[]'::jsonb,
   'steals','[0,0]'::jsonb,'moves',0,'roundEnded',false,'result',null,'version',(s->>'version')::integer+1);
  update public.opc_velha_rooms set state=s,touched_at=now() where code=r.code returning * into r;
  return public.opc_velha_reply(r,who,'Nova rodada. Todas as posições dos critérios mudaram.');
 end if;
 actor:=case when who=r.host then 0 else 1 end;
 if (s->>'roundEnded')::boolean or actor<>(s->>'turn')::integer then raise exception 'Aguarde sua vez.'; end if;
 if kind is null or kind not in ('move','pass') then raise exception 'Ação inválida.'; end if;
 if kind='move' then
  if coalesce(payload->>'cell','') !~ '^[0-8]$' then raise exception 'Casa inválida.'; end if;
  pos:=(payload->>'cell')::integer;c:=s->'cells'->pos;
  if c<>'null'::jsonb and ((c->>'owner')::integer=actor or not (cfg->>'steal')::boolean or (s->'steals'->>actor)::integer>=2) then raise exception 'Essa casa não pode ser usada.'; end if;
  select x into p from jsonb_array_elements(catalog->'players') x where x->>'id'=payload->>'playerId';
  if p is null or not (p->'modes' ? (cfg->>'mode')) or s->'used' ? (p->>'id') then raise exception 'Nome indisponível ou já utilizado.'; end if;
  select x into b from jsonb_array_elements(catalog->'boards') x where x->>'id'=s->>'boardId';
  good:=p->'categories' ? (b->'rows'->>(pos/3)) and p->'categories' ? (b->'cols'->>(pos%3));
  if good then
   s:=jsonb_set(s,array['cells',pos::text],jsonb_build_object('owner',actor,'playerId',p->>'id'));
   s:=jsonb_set(s,'{used}',s->'used'||jsonb_build_array(p->>'id'));
   if c<>'null'::jsonb then s:=jsonb_set(s,array['steals',actor::text],to_jsonb((s->'steals'->>actor)::integer+1)); end if;
   msg:='Cruzamento confirmado!';
  else msg:='Este nome não consta na base para as duas categorias. A vez passou para o adversário.'; end if;
 else msg:='Vez passada para o adversário.'; end if;
 s:=s||jsonb_build_object('turn',1-actor,'moves',(s->>'moves')::integer+1,'version',(s->>'version')::integer+1);
 for line in select value from jsonb_array_elements('[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]'::jsonb) loop
  complete:=true;
  for index_num in select value::integer from jsonb_array_elements_text(line) loop
   if s->'cells'->index_num='null'::jsonb or (s->'cells'->index_num->>'owner')::integer<>actor then complete:=false;exit;end if;
  end loop;
  if complete then win_line:=line;exit;end if;
 end loop;
 if win_line is not null then
  counter:=(s->'score'->>actor)::integer+1;s:=jsonb_set(s,array['score',actor::text],to_jsonb(counter));
  s:=s||jsonb_build_object('roundEnded',true,'result',jsonb_build_object('winner',actor,'line',win_line));
 elsif not exists(select 1 from jsonb_array_elements(s->'cells') x where x='null'::jsonb) or (s->>'moves')::integer>=40 then
  s:=s||jsonb_build_object('roundEnded',true,'result',jsonb_build_object('winner',null,'line','[]'::jsonb));
 end if;
 if (s->>'roundEnded')::boolean and ((cfg->>'format'='rounds' and (s->>'round')::integer>=(cfg->>'target')::integer) or (cfg->>'format'<>'rounds' and greatest((s->'score'->>0)::integer,(s->'score'->>1)::integer)>=(cfg->>'target')::integer)) then
  s:=s||jsonb_build_object('matchEnded',true,'matchWinner',case when s->'score'->>0=s->'score'->>1 then null when (s->'score'->>0)::integer>(s->'score'->>1)::integer then 0 else 1 end);
 end if;
 update public.opc_velha_rooms set state=s,touched_at=now() where code=r.code returning * into r;
 return public.opc_velha_reply(r,who,msg);
end $$;
revoke all on function public.opc_velha_pick(text,text,text),public.opc_velha_reply(public.opc_velha_rooms,uuid,text),public.opc_velha(jsonb) from public,anon,authenticated;
grant execute on function public.opc_velha(jsonb) to authenticated;
-- Não publicar tabelas via Realtime: cliente consulta apenas o RPC com permissão de participante.
