-- Atualiza somente o sorteio de grades. Preserva catálogo, histórico, salas e permissões.
create or replace function public.opc_velha_pick(m text, d text, previous_id text default null)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare result jsonb; old jsonb; catalog jsonb;
begin
 select data into catalog from public.opc_velha_catalog where id=true;
 select b into old from jsonb_array_elements(catalog->'boards') b where b->>'id'=previous_id;
 select b into result from jsonb_array_elements(catalog->'boards') b
 where b->>'mode'=m and b->>'difficulty'=d and (previous_id is null or b->>'id'<>previous_id)
 and (m='bra.1' or not (((b->'rows') || (b->'cols')) ?| array['award:brasileiro','award:copabrasil','award:brtop','award:libertadores']))
 and (old is null or (b->'rows'->>0<>old->'rows'->>0 and b->'rows'->>1<>old->'rows'->>1 and b->'rows'->>2<>old->'rows'->>2
 and b->'cols'->>0<>old->'cols'->>0 and b->'cols'->>1<>old->'cols'->>1 and b->'cols'->>2<>old->'cols'->>2))
 order by -ln(greatest(random(),0.000000000001))/(case when m='bra.1' and ((b->'rows') || (b->'cols')) ? 'award:europa' then 0.2 else 1 end) limit 1;
 if result is null then raise exception 'Não há grade auditada disponível.'; end if;
 return result;
end $$;
