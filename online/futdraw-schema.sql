-- FutDraw OPC v1. Estruturas novas e isoladas; não modifica o Jogo da Velha.
begin;
create table if not exists public.opc_futdraw_catalog(id boolean primary key default true check(id),data jsonb not null);
create table if not exists public.opc_futdraw_rooms(
 code text primary key default upper(substr(replace(gen_random_uuid()::text,'-',''),1,6)),
 host uuid not null,config jsonb not null,state jsonb not null,secret jsonb not null default '{}',drawing jsonb not null default '[]',
 created_at timestamptz not null default now(),expires_at timestamptz not null default now()+interval '6 hours'
);
create table if not exists public.opc_futdraw_members(
 code text references public.opc_futdraw_rooms(code) on delete cascade,uid uuid not null,name text not null,
 seat integer not null,score integer not null default 0,active boolean not null default true,
 seen_at timestamptz not null default now(),guess_at timestamptz not null default '2000-01-01',primary key(code,uid),unique(code,seat)
);
alter table public.opc_futdraw_catalog enable row level security;
alter table public.opc_futdraw_rooms enable row level security;
alter table public.opc_futdraw_members enable row level security;
revoke all on public.opc_futdraw_catalog,public.opc_futdraw_rooms,public.opc_futdraw_members from anon,authenticated;

create or replace function public.opc_futdraw_normalize(s text) returns text language sql immutable set search_path=public,pg_temp as $$
 select regexp_replace(lower(translate(lower(s),'àáâãäåçèéêëìíîïñòóôõöùúûüýÿāăąćĉċčďēĕėęěĝğġģĥĩīĭįĵķĺļľńņňōŏőŕŗřśŝşšţťũūŭůűųŵŷźżžơưǎǐǒǔǖǘǚǜǟǡǧǩǫǭǰǵǹǻȁȃȅȇȉȋȍȏȑȓȕȗșțȟȧȩȫȭȯȱȳ','aaaaaaceeeeiiiinooooouuuuyyaaaccccdeeeeegggghiiiijklllnnnooorrrssssttuuuuuuwyzzzouaiouuuuuaagkoojgnaaaeeiioorruusthaeooooy')),'[^a-z0-9]','','g');
$$;
create or replace function public.opc_futdraw_turn(r public.opc_futdraw_rooms) returns public.opc_futdraw_rooms language plpgsql security definer set search_path=public,pg_temp as $$
declare opts jsonb; n integer:=(r.state->>'index')::integer; total integer:=jsonb_array_length(r.state->'order')*(r.config->>'rounds')::integer; drawer text; tries integer:=0;
begin
 while n<total loop
  drawer:=r.state->'order'->>(n%jsonb_array_length(r.state->'order'));
  exit when exists(select 1 from public.opc_futdraw_members where code=r.code and uid::text=drawer and active);
  n:=n+1;tries:=tries+1;
 end loop;
 r.drawing:='[]';r.secret:='{}';
 if n>=total or (select count(*) from public.opc_futdraw_members where code=r.code and active)<2 then
  r.state:=r.state||jsonb_build_object('phase','finished','index',n,'deadline',null,'solved','[]'::jsonb,'message','Fim de jogo! Confira o placar.');return r;
 end if;
 select jsonb_agg(w) into opts from (select w from jsonb_array_elements((select data->'words' from public.opc_futdraw_catalog where id=true)) w
 where w->'modes' ? (r.config->>'mode') and r.config->'categories' ? (w->>'category') and not (coalesce(r.state->'used','[]') ? (w->>'id')) order by random() limit 3) t;
 if jsonb_array_length(coalesce(opts,'[]'))<3 then
  -- Longas partidas com uma só categoria renovam o repertório sem travar.
  r.state:=r.state||jsonb_build_object('used','[]'::jsonb);
  select jsonb_agg(w) into opts from (select w from jsonb_array_elements((select data->'words' from public.opc_futdraw_catalog where id=true)) w where w->'modes' ? (r.config->>'mode') and r.config->'categories' ? (w->>'category') order by random() limit 3) t;
 end if;
 if jsonb_array_length(coalesce(opts,'[]'))<3 then raise exception 'Não há três opções nesta configuração.';end if;
 r.secret:=jsonb_build_object('options',opts);
 r.state:=r.state-'answer'||jsonb_build_object('phase','choose','index',n,'drawer',drawer,'solved','[]'::jsonb,'hints',0,'mask',null,'letters',null,'deadline',extract(epoch from now()+interval '20 seconds')*1000,'category',null,'message','Quem desenha está escolhendo entre três nomes.');
 return r;
end $$;

create or replace function public.opc_futdraw_reply(r public.opc_futdraw_rooms,who uuid,cursor integer default 0,turn integer default -1) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare members jsonb; ops jsonb; reset boolean:=turn is distinct from (r.state->>'index')::integer or cursor<0 or cursor>jsonb_array_length(r.drawing);
begin
 if not exists(select 1 from public.opc_futdraw_members where code=r.code and uid=who and active) then raise exception 'Você não participa desta sala.';end if;
 select jsonb_agg(jsonb_build_object('id',uid,'name',name,'score',score,'seat',seat,'active',active) order by seat) into members from public.opc_futdraw_members where code=r.code;
 select coalesce(jsonb_agg(o order by n),'[]') into ops from jsonb_array_elements(r.drawing) with ordinality t(o,n) where reset or n>cursor;
 return jsonb_build_object('code',r.code,'self',who,'host',r.host,'config',r.config,'state',r.state-'used','members',members,'serverNow',extract(epoch from now())*1000,'reset',reset,'ops',ops,'cursor',jsonb_array_length(r.drawing),
 'options',case when r.state->>'phase'='choose' and r.state->>'drawer'=who::text then r.secret->'options' else null end,
 'word',case when r.state->>'drawer'=who::text and r.state->>'phase'='draw' then r.secret->'word'->>'label' else null end,
 'hintLimit',case when r.state->>'drawer'=who::text then r.secret->'hintLimit' else null end);
end $$;

create or replace function public.opc_futdraw(payload jsonb) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare who uuid:=auth.uid();kind text:=payload->>'type';r public.opc_futdraw_rooms;m public.opc_futdraw_members;cfg jsonb;s jsonb;w jsonb;op jsonb;q jsonb;
 code_in text:=upper(left(coalesce(payload->>'code',''),6));nick text;cat text;categories jsonb;chosen text;phase text;secs integer;idx integer;cursor integer:=0;turn integer:=-1;
 guess text;correct boolean;points integer;hints integer;lim integer;label text;pattern text;ch text;i integer;letters integer;li integer;order_count integer;outcome text;late boolean:=false;
begin
 if who is null then raise exception 'É necessário identificar sua sessão.';end if;
 if payload is null or octet_length(payload::text)>64000 then raise exception 'Solicitação inválida ou muito grande.';end if;
 if coalesce(payload->>'cursor','') ~ '^[0-9]{1,6}$' then cursor:=(payload->>'cursor')::integer;end if;
 if coalesce(payload->>'turn','') ~ '^-?[0-9]{1,6}$' then turn:=(payload->>'turn')::integer;end if;
 if kind='create' then
  if (select count(*) from public.opc_futdraw_rooms where host=who and created_at>now()-interval '1 hour')>=4 then raise exception 'Você já criou várias salas. Aguarde antes de criar outra.';end if;
  cfg:=payload->'config';categories:=cfg->'categories';
  if cfg->>'mode' not in ('brasil','europa') or cfg->>'rounds' not in ('1','2','3','4','5','6','7','8','9','10') or cfg->>'duration' not in ('60','90','120') or jsonb_typeof(categories) is distinct from 'array' or jsonb_array_length(categories) not between 1 and 4 then raise exception 'Configuração inválida.';end if;
  if exists(select 1 from jsonb_array_elements_text(categories) c where c not in ('clube','estadio','jogador','treinador')) then raise exception 'Categoria inválida.';end if;
  if cfg is null or cfg->>'mode' is null or cfg->>'rounds' is null or cfg->>'duration' is null then raise exception 'Configuração incompleta.';end if;
  nick:=left(regexp_replace(btrim(coalesce(payload->>'name','')),'[[:cntrl:]]','','g'),24);if length(nick)<2 then raise exception 'Escolha um apelido de 2 a 24 caracteres.';end if;
  delete from public.opc_futdraw_rooms where expires_at<now();
  cfg:=jsonb_build_object('mode',cfg->>'mode','rounds',(cfg->>'rounds')::integer,'duration',(cfg->>'duration')::integer,'categories',categories);
  insert into public.opc_futdraw_rooms(host,config,expires_at,state) values(who,cfg,now()+interval '6 hours',jsonb_build_object('phase','lobby','index',-1,'order','[]'::jsonb,'used','[]'::jsonb,'messages','[]'::jsonb,'solved','[]'::jsonb,'hints',0,'message','Compartilhe o código e reúna de 2 a 8 pessoas.')) returning * into r;
  insert into public.opc_futdraw_members(code,uid,name,seat) values(r.code,who,nick,0);
  return public.opc_futdraw_reply(r,who);
 end if;
 select * into r from public.opc_futdraw_rooms where code=code_in and expires_at>now() for update;
 if not found then raise exception 'Sala não encontrada ou expirada.';end if;
 if kind='join' then
  if exists(select 1 from public.opc_futdraw_members where code=r.code and uid=who and active) then return public.opc_futdraw_reply(r,who,cursor,turn);end if;
  if r.state->>'phase' not in ('lobby','finished') then raise exception 'A partida já começou. Aguarde a próxima.';end if;
  if (select count(*) from public.opc_futdraw_members where code=r.code)>=8 and not exists(select 1 from public.opc_futdraw_members where code=r.code and uid=who) then raise exception 'A sala está cheia (até 8 pessoas).';end if;
  nick:=left(regexp_replace(btrim(coalesce(payload->>'name','')),'[[:cntrl:]]','','g'),24);if length(nick)<2 then raise exception 'Escolha um apelido de 2 a 24 caracteres.';end if;
  if exists(select 1 from public.opc_futdraw_members where code=r.code and active and lower(name)=lower(nick) and uid<>who) then raise exception 'Este apelido já está na sala.';end if;
  insert into public.opc_futdraw_members(code,uid,name,seat) values(r.code,who,nick,(select coalesce(max(seat),-1)+1 from public.opc_futdraw_members where code=r.code)) on conflict(code,uid) do update set active=true,name=excluded.name,seen_at=now();
  return public.opc_futdraw_reply(r,who,cursor,turn);
 end if;
 select * into m from public.opc_futdraw_members where code=r.code and uid=who and active;
 if not found then raise exception 'Você não participa desta sala.';end if;
 update public.opc_futdraw_members set seen_at=now() where code=r.code and uid=who;
 -- Ausência prolongada não prende a partida nem permite pontuar fora do prazo.
 update public.opc_futdraw_members set active=false where code=r.code and active and seen_at<now()-interval '90 seconds';
 if not exists(select 1 from public.opc_futdraw_members where code=r.code and uid=r.host and active) then select uid into r.host from public.opc_futdraw_members where code=r.code and active order by seat limit 1;end if;
 if kind='rename' then
  nick:=left(regexp_replace(btrim(coalesce(payload->>'name','')),'[[:cntrl:]]','','g'),24);
  if length(nick)<2 then raise exception 'Escolha um apelido de 2 a 24 caracteres.';end if;
  if exists(select 1 from public.opc_futdraw_members where code=r.code and active and lower(name)=lower(nick) and uid<>who) then raise exception 'Este apelido já está na sala.';end if;
  update public.opc_futdraw_members set name=nick where code=r.code and uid=who;
  kind:='get';
 end if;
 phase:=r.state->>'phase';s:=r.state;
 if phase in ('choose','draw') and (not exists(select 1 from public.opc_futdraw_members where code=r.code and uid::text=s->>'drawer' and active) or (s->>'deadline')::numeric<=extract(epoch from now())*1000) then
  late:=true;
  if phase='choose' and exists(select 1 from public.opc_futdraw_members where code=r.code and uid::text=s->>'drawer' and active) then
   r.secret:=r.secret||jsonb_build_object('word',r.secret->'options'->0);label:=r.secret->'word'->>'label';letters:=length(regexp_replace(public.opc_futdraw_normalize(label),'[^a-z0-9]','','g'));
   r.secret:=(r.secret-'options')||jsonb_build_object('hintLimit',least(4,1+greatest(0,letters-3)/4));
   r.state:=s||jsonb_build_object('phase','draw','deadline',extract(epoch from now()+make_interval(secs=>(r.config->>'duration')::integer))*1000,'category',r.secret->'word'->>'category','message','Valendo! Envie seu palpite.');
  else r.state:=s||jsonb_build_object('phase','reveal','answer',r.secret->'word'->>'label','deadline',extract(epoch from now()+interval '6 seconds')*1000,'message',case when r.secret ? 'word' then 'Tempo encerrado. Confira a resposta!' else 'Quem desenhava saiu. Próxima vez!' end);end if;
 elsif phase='reveal' and (s->>'deadline')::numeric<=extract(epoch from now())*1000 then
  r.state:=s||jsonb_build_object('index',(s->>'index')::integer+1);r:=public.opc_futdraw_turn(r);late:=true;
 end if;
 if kind='leave' then
  update public.opc_futdraw_members set active=false where code=r.code and uid=who;
  if r.host=who then select uid into r.host from public.opc_futdraw_members where code=r.code and active order by seat limit 1;end if;
  if r.host is null then r.host:=who;r.expires_at:=now();end if;
  update public.opc_futdraw_rooms set state=r.state,secret=r.secret,drawing=r.drawing,host=r.host,expires_at=r.expires_at where code=r.code;
  return jsonb_build_object('left',true);
 end if;
 if kind='start' then
  if who<>r.host or r.state->>'phase' not in ('lobby','finished') then raise exception 'Somente quem criou pode iniciar uma nova partida.';end if;
  if (select count(*) from public.opc_futdraw_members where code=r.code and active)<2 then raise exception 'A sala precisa de pelo menos duas pessoas.';end if;
  select jsonb_agg(uid::text order by seat) into q from public.opc_futdraw_members where code=r.code and active;
  update public.opc_futdraw_members set score=0 where code=r.code;
  r.state:=jsonb_build_object('phase','choose','index',0,'order',q,'used','[]'::jsonb,'messages','[]'::jsonb);r:=public.opc_futdraw_turn(r);
 elsif kind not in ('get','join','create','leave') then
  if kind not in ('choose','draw','guess','hint') then raise exception 'Ação inválida.';end if;
  if turn is distinct from (r.state->>'index')::integer or late then
   update public.opc_futdraw_rooms set state=r.state,secret=r.secret,drawing=r.drawing,host=r.host where code=r.code;
   return public.opc_futdraw_reply(r,who,cursor,turn)||jsonb_build_object('notice','A vez mudou. Confira a tela.');
  end if;
  s:=r.state;phase:=s->>'phase';
  if kind='choose' then
   if phase<>'choose' or s->>'drawer'<>who::text then raise exception 'Agora não é sua vez de escolher.';end if;
   select x into w from jsonb_array_elements(r.secret->'options') x where x->>'id'=payload->>'wordId';if w is null then raise exception 'Escolha um dos três nomes oferecidos.';end if;
   letters:=length(public.opc_futdraw_normalize(w->>'label'));r.secret:=jsonb_build_object('word',w,'hintLimit',least(4,1+greatest(0,letters-3)/4));
   r.state:=s||jsonb_build_object('phase','draw','deadline',extract(epoch from now()+make_interval(secs=>(r.config->>'duration')::integer))*1000,'category',w->>'category','message','Valendo! Envie seu palpite.');
  elsif kind='draw' then
   if phase<>'draw' or s->>'drawer'<>who::text then raise exception 'Somente quem está desenhando pode usar a tela.';end if;
   if jsonb_typeof(payload->'ops') is distinct from 'array' or jsonb_array_length(payload->'ops') not between 1 and 16 then raise exception 'Traços inválidos.';end if;
   if jsonb_array_length(r.drawing)+jsonb_array_length(payload->'ops')>2400 then raise exception 'Limite de traços desta vez atingido.';end if;
   for op in select value from jsonb_array_elements(payload->'ops') loop
    if coalesce(op->>'kind','') not in ('stroke','fill','undo','clear') or coalesce(op->>'id','') !~ '^[a-zA-Z0-9-]{1,80}$' or coalesce(op->>'group','') !~ '^[a-zA-Z0-9-]{1,80}$' then raise exception 'Ferramenta ou identificação inválida.';end if;
    if op->>'kind' in ('stroke','fill') then
     if coalesce(op->>'color','') !~ '^#[a-fA-F0-9]{6}$' or coalesce(op->>'size','') !~ '^([2-9]|[1-3][0-9]|40)$' or jsonb_typeof(op->'points') is distinct from 'array' or jsonb_array_length(op->'points') not between 1 and 64 then raise exception 'Cor, espessura ou pontos inválidos.';end if;
     if op->>'kind'='fill' and jsonb_array_length(op->'points')<>1 then raise exception 'Balde inválido.';end if;
     for q in select value from jsonb_array_elements(op->'points') loop
      if jsonb_typeof(q) is distinct from 'array' or jsonb_array_length(q)<>2 or coalesce(q->>0,'') !~ '^[0-9]{1,3}$' or coalesce(q->>1,'') !~ '^[0-9]{1,3}$' then raise exception 'Coordenada inválida.';end if;
      if (q->>0)::integer>959 or (q->>1)::integer>599 then raise exception 'Ponto fora da tela.';end if;
     end loop;
    end if;
    if not exists(select 1 from jsonb_array_elements(r.drawing) d where d->>'id'=op->>'id') then r.drawing:=r.drawing||jsonb_build_array(op);end if;
   end loop;
  elsif kind='hint' then
   if phase<>'draw' or s->>'drawer'<>who::text then raise exception 'Somente quem desenha pode dar dica.';end if;
   hints:=(s->>'hints')::integer+1;lim:=(r.secret->>'hintLimit')::integer;if hints>lim then raise exception 'Todas as dicas deste nome já foram dadas.';end if;
   label:=r.secret->'word'->>'label';letters:=length(public.opc_futdraw_normalize(label));pattern:='';li:=0;
   for i in 1..length(label) loop
    ch:=substr(label,i,1);
    if public.opc_futdraw_normalize(ch)='' then pattern:=pattern||ch||' ';
    else
     if (hints>=2 and (i=1 or substr(label,i-1,1)=' ')) or (hints>=3 and li=floor(letters/2.0)) or (hints>=4 and li=floor(letters/3.0)) then pattern:=pattern||upper(ch)||' ';else pattern:=pattern||'_ ';end if;li:=li+1;
    end if;
   end loop;
   r.state:=s||jsonb_build_object('hints',hints,'mask',btrim(pattern),'letters',letters,'message','Nova dica de quem desenha.');
  elsif kind='guess' then
   if phase<>'draw' or s->>'drawer'=who::text or s->'solved' ? who::text then raise exception 'Você não pode enviar palpite agora.';end if;
   if m.guess_at>now()-interval '800 milliseconds' then raise exception 'Aguarde um instante entre os palpites.';end if;
   guess:=btrim(coalesce(payload->>'text',''));if length(guess) not between 1 and 80 then raise exception 'Use de 1 a 80 caracteres.';end if;
   update public.opc_futdraw_members set guess_at=now() where code=r.code and uid=who;
   correct:=r.secret->'word'->'accepted' ? public.opc_futdraw_normalize(guess);
   if correct then
    points:=floor((500+500*greatest(0,least(1,((s->>'deadline')::numeric-extract(epoch from now())*1000)/((r.config->>'duration')::integer*1000)))+greatest(0,150-jsonb_array_length(s->'solved')*25))*greatest(.45,1-(s->>'hints')::integer*.15));
    update public.opc_futdraw_members set score=score+points where code=r.code and uid=who;
    update public.opc_futdraw_members set score=score+100 where code=r.code and uid::text=s->>'drawer';
    s:=s||jsonb_build_object('solved',s->'solved'||jsonb_build_array(who::text));outcome:='Acertou! +'||points||' pontos';
   else outcome:=regexp_replace(guess,'[[:cntrl:]]','','g');end if;
   q:=coalesce(s->'messages','[]')||jsonb_build_array(jsonb_build_object('id',gen_random_uuid(),'name',m.name,'text',outcome,'correct',correct));
   select coalesce(jsonb_agg(v order by n),'[]') into q from jsonb_array_elements(q) with ordinality t(v,n) where n>greatest(0,jsonb_array_length(q)-35);
   r.state:=s||jsonb_build_object('messages',q,'message',case when correct then m.name||' acertou!' else 'Continue desenhando e tentando.' end);
   if correct and not exists(select 1 from public.opc_futdraw_members where code=r.code and active and uid::text<>s->>'drawer' and not(s->'solved' ? uid::text)) then
    r.state:=r.state||jsonb_build_object('phase','reveal','answer',r.secret->'word'->>'label','deadline',extract(epoch from now()+interval '6 seconds')*1000,'message','Todos acertaram!');
   end if;
  end if;
 end if;
 if r.state->>'phase'='draw' and r.secret ? 'word' and not (coalesce(r.state->'used','[]') ? (r.secret->'word'->>'id')) then r.state:=r.state||jsonb_build_object('used',coalesce(r.state->'used','[]')||jsonb_build_array(r.secret->'word'->>'id'));end if;
 update public.opc_futdraw_rooms set state=r.state,secret=r.secret,drawing=r.drawing,host=r.host where code=r.code;
 return public.opc_futdraw_reply(r,who,cursor,turn);
end $$;
revoke all on function public.opc_futdraw_normalize(text),public.opc_futdraw_turn(public.opc_futdraw_rooms),public.opc_futdraw_reply(public.opc_futdraw_rooms,uuid,integer,integer),public.opc_futdraw(jsonb) from public,anon,authenticated;
grant execute on function public.opc_futdraw(jsonb) to authenticated;
commit;
