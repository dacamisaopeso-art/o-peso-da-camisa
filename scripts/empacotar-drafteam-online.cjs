const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const source=['drafteam-core.js','online/drafteam-service.cjs','online/drafteam-edge.js'].map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');
const dir=path.join(root,'outputs/drafteam-online');fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.ts'),source);console.log('Edge bundle pronto: '+dir+'/index.ts');
require(path.join(root,'drafteam-dados.js'));
const data=globalThis.OPC_DRAFTEAM_DATA;
const lean={...data,labels:undefined,regional:undefined,players:data.players.map(({id,name,position,categories,regions,fame})=>({id,name,position,categories,regions,fame}))};
const quoted=value=>'$opc$'+JSON.stringify(value)+'$opc$::jsonb';
const chunks=["alter table public.opc_drafteam_catalog add column if not exists staging jsonb;\ninsert into public.opc_drafteam_catalog(singleton,data,staging) values(true,'{}'::jsonb,"+quoted({...lean,players:[]})+") on conflict(singleton) do update set staging=excluded.staging;\n"];
let batch=[];
function flush(){if(!batch.length)return;chunks.push("update public.opc_drafteam_catalog set staging=jsonb_set(staging,'{players}',(staging->'players') || "+quoted(batch)+") where singleton=true;\n");batch=[];}
for(const player of lean.players){if(JSON.stringify([...batch,player]).length>60000)flush();batch.push(player);}flush();
chunks.push("do $$ begin if (select jsonb_array_length(staging->'players') from public.opc_drafteam_catalog where singleton=true) <> "+lean.players.length+" then raise exception 'Catálogo incompleto'; end if; update public.opc_drafteam_catalog set data=staging,staging=null where singleton=true; end $$;\nselect jsonb_array_length(data->'players') as players,data->>'version' as version from public.opc_drafteam_catalog where singleton=true;\n");
const sqlDir=path.join(dir,'sql');fs.mkdirSync(sqlDir,{recursive:true});chunks.forEach((sql,index)=>fs.writeFileSync(path.join(sqlDir,String(index).padStart(2,'0')+'.sql'),sql));
console.log(chunks.length+' lotes SQL prontos em '+sqlDir+'; executar uma única vez, em ordem, sem repetir lotes intermediários.');
