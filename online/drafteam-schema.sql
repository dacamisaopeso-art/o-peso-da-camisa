-- New isolated storage. No change to any existing game's tables or RPCs.
begin;
create table if not exists public.opc_drafteam_catalog(singleton boolean primary key default true check(singleton),data jsonb not null,staging jsonb);
create table if not exists public.opc_drafteam_rooms(code text primary key check(code ~ '^[A-F0-9]{8}$'),version integer not null default 1,document jsonb not null,updated_at timestamptz not null default now());
alter table public.opc_drafteam_catalog add column if not exists staging jsonb;
alter table public.opc_drafteam_catalog enable row level security;
alter table public.opc_drafteam_rooms enable row level security;
revoke all on public.opc_drafteam_catalog,public.opc_drafteam_rooms from public,anon,authenticated;
create or replace function public.opc_drafteam_storage(payload jsonb) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare r public.opc_drafteam_rooms;k text:=payload->>'type';u text:=payload->>'uid';
begin
 if k='catalog' then return (select data from opc_drafteam_catalog where singleton);end if;
 if k='create' then
  perform pg_advisory_xact_lock(hashtext(u));
  if (select count(*) from opc_drafteam_rooms where updated_at>now()-interval '1 hour' and document->>'host'=u)>=3 then raise exception 'Você já tem três salas recentes. Reutilize uma delas ou aguarde uma hora.';end if;
  insert into opc_drafteam_rooms(code,document) values(payload->>'code',payload->'document') returning * into r;
 elsif k='get' then select * into r from opc_drafteam_rooms where code=payload->>'code';
 elsif k='save' then
  update opc_drafteam_rooms set document=payload->'document',version=version+1,updated_at=now() where code=payload->>'code' and version=(payload->>'version')::integer returning * into r;
  if not found then raise exception 'A sala mudou. Atualize antes de jogar.';end if;
 else raise exception 'Operação inválida.';end if;
 if r.code is null then return null;end if;
 return jsonb_build_object('code',r.code,'version',r.version,'document',r.document,'updated',extract(epoch from r.updated_at)*1000);
end $$;
revoke all on function public.opc_drafteam_storage(jsonb) from public,anon,authenticated;
grant execute on function public.opc_drafteam_storage(jsonb) to service_role;
commit;
