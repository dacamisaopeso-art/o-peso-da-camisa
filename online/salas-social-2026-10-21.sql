-- Sala v2: consentimento, prontidão e moderação. Não altera partidas legadas.
begin;
alter table public.opc_futdraw_members add column if not exists ready boolean not null default false;
alter table public.opc_futdraw_members add column if not exists rematch_vote boolean not null default false;
alter table public.opc_futdraw_members add column if not exists kicked boolean not null default false;
alter table public.opc_futdraw_rooms add column if not exists kicked_users uuid[] not null default '{}';
alter table public.opc_velha_rooms add column if not exists social boolean not null default false;
alter table public.opc_velha_rooms add column if not exists started boolean not null default false;
alter table public.opc_velha_rooms add column if not exists ready_flags jsonb not null default '[false,false]';
alter table public.opc_velha_rooms add column if not exists rematch_flags jsonb not null default '[false,false]';
alter table public.opc_velha_rooms add column if not exists kicked_users uuid[] not null default '{}';
do $$ begin
 if to_regprocedure('public.opc_futdraw_social_base(jsonb)') is null then alter function public.opc_futdraw(jsonb) rename to opc_futdraw_social_base;end if;
 if to_regprocedure('public.opc_velha_social_base(jsonb)') is null then alter function public.opc_velha(jsonb) rename to opc_velha_social_base;end if;
end $$;
revoke all on function public.opc_futdraw_social_base(jsonb),public.opc_velha_social_base(jsonb) from public,anon,authenticated;

create or replace function public.opc_futdraw_social_reply(r public.opc_futdraw_rooms,who uuid,cursor_num integer default 0,turn_num integer default -1) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare reply jsonb;
begin
 reply:=public.opc_futdraw_reply(r,who,cursor_num,turn_num);
 if r.config->>'lobbyVersion'='2' then
  reply:=reply||jsonb_build_object('lobbyVersion',2,'members',(select jsonb_agg(jsonb_build_object('id',uid,'name',name,'score',score,'seat',seat,'active',active,'ready',ready,'rematch',rematch_vote,'present',seen_at>now()-interval '45 seconds') order by seat) from public.opc_futdraw_members where code=r.code));
 end if;
 return reply;
end $$;
create or replace function public.opc_futdraw_social_start(r public.opc_futdraw_rooms) returns public.opc_futdraw_rooms language plpgsql security definer set search_path=public,pg_temp as $$
declare members jsonb;
begin
 select jsonb_agg(uid::text order by seat) into members from public.opc_futdraw_members where code=r.code and active;
 if coalesce(jsonb_array_length(members),0)<2 then raise exception 'A sala precisa de pelo menos duas pessoas.';end if;
 update public.opc_futdraw_members set score=0,ready=false,rematch_vote=false where code=r.code;
 r.state:=jsonb_build_object('phase','choose','index',0,'order',members,'used','[]'::jsonb,'messages','[]'::jsonb);
 r:=public.opc_futdraw_turn(r);
 update public.opc_futdraw_rooms set state=r.state,secret=r.secret,drawing=r.drawing where code=r.code;
 return r;
end $$;
create or replace function public.opc_futdraw(payload jsonb) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare who uuid:=auth.uid();kind text:=payload->>'type';r public.opc_futdraw_rooms;reply jsonb;target uuid;cursor_num integer:=0;turn_num integer:=-1;
begin
 if who is null or jsonb_typeof(payload) is distinct from 'object' or octet_length(payload::text)>64000 then raise exception 'Solicitação inválida.';end if;
 if coalesce(payload->>'cursor','') ~ '^[0-9]{1,6}$' then cursor_num:=(payload->>'cursor')::integer;end if;
 if coalesce(payload->>'turn','') ~ '^-?[0-9]{1,6}$' then turn_num:=(payload->>'turn')::integer;end if;
 if kind='create' then
  reply:=public.opc_futdraw_social_base(payload);
  if payload->>'lobbyVersion'='2' then
   update public.opc_futdraw_rooms set config=config||'{"lobbyVersion":2}'::jsonb where code=reply->>'code' returning * into r;
   return public.opc_futdraw_social_reply(r,who);
  end if;
  return reply;
 end if;
 select * into r from public.opc_futdraw_rooms where code=upper(left(payload->>'code',6)) and expires_at>now() for update;
 if r.code is not null and (who=any(r.kicked_users) or exists(select 1 from public.opc_futdraw_members where code=r.code and uid=who and kicked)) then raise exception 'Você foi removido desta sala.';end if;
 if r.config->>'lobbyVersion' is distinct from '2' then return public.opc_futdraw_social_base(payload);end if;
 if kind='join' and payload->>'lobbyVersion' is distinct from '2' then raise exception 'Atualize o aplicativo ou abra o site para entrar nesta sala.';end if;
 if kind='join' and (select count(*) from public.opc_futdraw_members where code=r.code)>=8 and not exists(select 1 from public.opc_futdraw_members where code=r.code and uid=who) then delete from public.opc_futdraw_members where code=r.code and not active;end if;
 if kind in ('ready','kick','rematch','start') then
  perform public.opc_futdraw_social_base(jsonb_build_object('type','get','code',r.code,'cursor',cursor_num,'turn',turn_num));
  select * into r from public.opc_futdraw_rooms where code=r.code;
  if kind in ('ready','rematch') and jsonb_typeof(payload->'value') is distinct from 'boolean' then raise exception 'Confirmação inválida.';end if;
  if kind='ready' then
   if r.state->>'phase'<>'lobby' then raise exception 'Confirme prontidão na sala de espera.';end if;
   update public.opc_futdraw_members set ready=(payload->>'value')::boolean where code=r.code and uid=who and active;
  elsif kind='kick' then
   if who<>r.host or r.state->>'phase' not in ('lobby','finished') then raise exception 'Somente o anfitrião pode remover na espera ou no fim.';end if;
   if coalesce(payload->>'member','') !~ '^[0-9a-fA-F-]{36}$' then raise exception 'Participante inválido.';end if;
   target:=(payload->>'member')::uuid;
   if target=who then raise exception 'Use Sair para deixar a sala.';end if;
   update public.opc_futdraw_members set active=false,kicked=true,ready=false,rematch_vote=false where code=r.code and uid=target and active;
   if not found then raise exception 'Participante não encontrado.';end if;
   update public.opc_futdraw_rooms set kicked_users=array_append(kicked_users,target) where code=r.code;
  elsif kind='rematch' then
   if r.state->>'phase'<>'finished' then raise exception 'A revanche só pode ser votada ao final.';end if;
   update public.opc_futdraw_members set rematch_vote=(payload->>'value')::boolean where code=r.code and uid=who and active;
   if (select count(*) from public.opc_futdraw_members where code=r.code and active)>=2 and not exists(select 1 from public.opc_futdraw_members where code=r.code and active and not rematch_vote) then r:=public.opc_futdraw_social_start(r);end if;
  else
   if who<>r.host or r.state->>'phase'<>'lobby' then raise exception 'No fim, use a votação de revanche.';end if;
   if exists(select 1 from public.opc_futdraw_members where code=r.code and active and not ready) then raise exception 'Aguarde todos confirmarem que estão prontos.';end if;
   r:=public.opc_futdraw_social_start(r);
  end if;
 else
  reply:=public.opc_futdraw_social_base(payload);
  if kind='leave' then return reply;end if;
  select * into r from public.opc_futdraw_rooms where code=r.code;
 end if;
 return public.opc_futdraw_social_reply(r,who,cursor_num,turn_num);
end $$;

create or replace function public.opc_velha_social_restart(r public.opc_velha_rooms) returns public.opc_velha_rooms language plpgsql security definer set search_path=public,pg_temp as $$
declare board jsonb;opening integer:=0;
begin
 board:=public.opc_velha_pick(r.config->>'mode',r.config->>'difficulty',r.state->>'boardId');
 if coalesce((r.state->>'matchEnded')::boolean,false) then opening:=1-coalesce((r.state->>'openingTurn')::integer,0);end if;
 r.state:=jsonb_build_object('config',r.config,'boardId',board->>'id','round',1,'score',jsonb_build_array(0,0),'turn',opening,'openingTurn',opening,'cells','[null,null,null,null,null,null,null,null,null]'::jsonb,'used','[]'::jsonb,'steals','[0,0]'::jsonb,'pendingDraw',null,'moves',0,'roundEnded',false,'matchEnded',false,'matchWinner',null,'result',null,'version',(r.state->>'version')::integer+1);
 r.started:=true;r.ready_flags:='[true,true]';r.rematch_flags:='[false,false]';
 update public.opc_velha_rooms set state=r.state,started=true,ready_flags=r.ready_flags,rematch_flags=r.rematch_flags,touched_at=now() where code=r.code;
 return r;
end $$;
create or replace function public.opc_velha_social_reply(r public.opc_velha_rooms,who uuid) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare reply jsonb;
begin
 reply:=public.opc_velha_reply(r,who);
 if r.social then reply:=reply||jsonb_build_object('lobbyVersion',2,'ready',r.ready_flags,'rematch',r.rematch_flags,'hasGuest',r.guest is not null,'state',case when r.started and r.guest is not null then r.state else null end,'status',case when r.abandoned then 'Sala encerrada.' when r.guest is null then 'Compartilhe o convite e aguarde um adversário.' when not r.started then 'Os dois precisam confirmar que estão prontos.' when coalesce((r.state->>'matchEnded')::boolean,false) then 'Partida encerrada. Votem para jogar novamente.' else 'Sala '||r.code||' · conexão ativa' end);end if;
 return reply;
end $$;
create or replace function public.opc_velha(payload jsonb) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare who uuid:=auth.uid();kind text:=payload->>'type';r public.opc_velha_rooms;reply jsonb;actor integer;
begin
 if who is null or jsonb_typeof(payload) is distinct from 'object' or octet_length(payload::text)>4096 then raise exception 'Solicitação inválida.';end if;
 if kind='create' then
  reply:=public.opc_velha_social_base(payload);
  if payload->>'lobbyVersion'='2' then update public.opc_velha_rooms set social=true where code=reply->>'code' returning * into r;return public.opc_velha_social_reply(r,who);end if;
  return reply;
 end if;
 select * into r from public.opc_velha_rooms where code=upper(payload->>'code') for update;
 if who=any(r.kicked_users) then raise exception 'Você foi removido desta sala.';end if;
 if not coalesce(r.social,false) then return public.opc_velha_social_base(payload);end if;
 if kind='join' and payload->>'lobbyVersion' is distinct from '2' then raise exception 'Atualize o aplicativo ou abra o site para entrar nesta sala.';end if;
 if kind in ('ready','kick','rematch') then
  perform public.opc_velha_social_base(jsonb_build_object('type','get','code',r.code));
  if r.abandoned then raise exception 'Esta sala foi encerrada.';end if;
  actor:=case when who=r.host then 0 else 1 end;
  if kind in ('ready','rematch') and jsonb_typeof(payload->'value') is distinct from 'boolean' then raise exception 'Confirmação inválida.';end if;
  if kind='ready' then
   if r.started then raise exception 'A partida já começou.';end if;
   r.ready_flags:=jsonb_set(r.ready_flags,array[actor::text],payload->'value');
   update public.opc_velha_rooms set ready_flags=r.ready_flags where code=r.code;
   if r.guest is not null and r.ready_flags='[true,true]'::jsonb then r:=public.opc_velha_social_restart(r);end if;
  elsif kind='kick' then
   if who<>r.host or r.guest is null or r.started and not coalesce((r.state->>'matchEnded')::boolean,false) then raise exception 'Somente o anfitrião pode remover na espera ou no fim.';end if;
   update public.opc_velha_rooms set kicked_users=array_append(kicked_users,guest),guest=null,names=jsonb_set(names,'{1}','"Adversário"'),started=false,ready_flags='[false,false]',rematch_flags='[false,false]' where code=r.code returning * into r;
  else
   if not r.started or not coalesce((r.state->>'matchEnded')::boolean,false) or r.guest is null then raise exception 'A revanche só pode ser votada ao final.';end if;
   r.rematch_flags:=jsonb_set(r.rematch_flags,array[actor::text],payload->'value');
   update public.opc_velha_rooms set rematch_flags=r.rematch_flags where code=r.code;
   if r.rematch_flags='[true,true]'::jsonb then r:=public.opc_velha_social_restart(r);end if;
  end if;
 else
  if kind not in ('get','join','leave') and not r.started then raise exception 'Confirme prontidão antes de jogar.';end if;
  reply:=public.opc_velha_social_base(payload);
  if kind='leave' then return reply;end if;
  select * into r from public.opc_velha_rooms where code=r.code;
 end if;
 return public.opc_velha_social_reply(r,who);
end $$;
revoke all on function public.opc_futdraw_social_reply(public.opc_futdraw_rooms,uuid,integer,integer),public.opc_futdraw_social_start(public.opc_futdraw_rooms),public.opc_velha_social_reply(public.opc_velha_rooms,uuid),public.opc_velha_social_restart(public.opc_velha_rooms) from public,anon,authenticated;
revoke all on function public.opc_futdraw(jsonb),public.opc_velha(jsonb) from public,anon,authenticated;
grant execute on function public.opc_futdraw(jsonb),public.opc_velha(jsonb) to authenticated;
commit;
