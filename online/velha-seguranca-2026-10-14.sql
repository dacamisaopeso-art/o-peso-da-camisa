-- Reforço sem alterar regras, catálogo, identidades ou salas em andamento.
-- Aplicar após velha-schema.sql e atualizações de critérios. Transação atômica.
begin;
do $$
begin
 if to_regprocedure('public.opc_velha_internal(jsonb)') is null then
  alter function public.opc_velha(jsonb) rename to opc_velha_internal;
 end if;
end $$;
revoke all on function public.opc_velha_internal(jsonb) from public, anon, authenticated;

create table if not exists public.opc_velha_request_limits (
 user_id uuid not null,
 bucket text not null check(bucket in ('rpc','entry')),
 window_start timestamptz not null,
 requests integer not null check(requests>0),
 primary key(user_id,bucket)
);
alter table public.opc_velha_request_limits enable row level security;
revoke all on public.opc_velha_request_limits from public, anon, authenticated;
create index if not exists opc_velha_limits_window_idx on public.opc_velha_request_limits(window_start);
create index if not exists opc_velha_rooms_created_idx on public.opc_velha_rooms(created_at);

create or replace function public.opc_velha(payload jsonb)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
 who uuid:=auth.uid(); kind text; requests_now integer; moment timestamptz:=clock_timestamp();
begin
 if who is null then raise exception 'Identificação anônima necessária.'; end if;
 if jsonb_typeof(payload) is distinct from 'object' or octet_length(payload::text)>4096 then
  raise exception 'Solicitação inválida ou grande demais.';
 end if;
 kind:=payload->>'type';
 if kind is null or kind not in ('create','join','queue','get','move','pass','next','draw','draw-answer','leave') then
  raise exception 'Ação inválida.';
 end if;
 if kind not in ('create','queue') and (coalesce(payload->>'code','') !~ '^[A-Za-z0-9]{10}$') then
  raise exception 'Código de sala inválido.';
 end if;
 if payload ? 'name' and (jsonb_typeof(payload->'name') is distinct from 'string' or length(payload->>'name')>24 or payload->>'name' ~ '[[:cntrl:]]') then
  raise exception 'Use um nome de até 24 caracteres.';
 end if;
 if kind in ('move','pass','next','draw','draw-answer') and (coalesce(payload->>'expectedVersion','') !~ '^[0-9]{1,9}$') then
  raise exception 'Versão da rodada inválida.';
 end if;
 if kind='move' and (length(coalesce(payload->>'playerId','')) not between 1 and 120 or coalesce(payload->>'cell','') !~ '^[0-8]$') then
  raise exception 'Jogada inválida.';
 end if;
 -- Serializa apenas solicitações da mesma identificação; salas seguem suas travas próprias.
 perform pg_advisory_xact_lock(hashtextextended(who::text||':opc-limit',0));
 insert into public.opc_velha_request_limits(user_id,bucket,window_start,requests) values(who,'rpc',moment,1)
 on conflict(user_id,bucket) do update set
  requests=case when opc_velha_request_limits.window_start<=moment-interval '1 minute' then 1 else opc_velha_request_limits.requests+1 end,
  window_start=case when opc_velha_request_limits.window_start<=moment-interval '1 minute' then moment else opc_velha_request_limits.window_start end
 returning requests into requests_now;
 if requests_now>90 then raise sqlstate 'PT429' using message='Muitas solicitações. Aguarde um minuto para continuar.'; end if;
 if kind in ('create','join','queue') then
  insert into public.opc_velha_request_limits(user_id,bucket,window_start,requests) values(who,'entry',moment,1)
  on conflict(user_id,bucket) do update set
   requests=case when opc_velha_request_limits.window_start<=moment-interval '10 minutes' then 1 else opc_velha_request_limits.requests+1 end,
   window_start=case when opc_velha_request_limits.window_start<=moment-interval '10 minutes' then moment else opc_velha_request_limits.window_start end
  returning requests into requests_now;
  if requests_now>12 then raise sqlstate 'PT429' using message='Muitas entradas em salas. Aguarde alguns minutos.'; end if;
  delete from public.opc_velha_request_limits where window_start<moment-interval '2 days';
 end if;
 return public.opc_velha_internal(payload);
end $$;
revoke all on function public.opc_velha(jsonb) from public, anon;
grant execute on function public.opc_velha(jsonb) to authenticated;
notify pgrst,'reload schema';
commit;
