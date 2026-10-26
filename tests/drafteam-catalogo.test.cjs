const a=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),{loadDrafTeamCatalog}=require('../online/drafteam-catalogo-loader.js');
const directory='online/drafteam-catalogo-v2/',manifest=fs.readFileSync(directory+'manifest.json','utf8'),meta=JSON.parse(manifest),sha=text=>crypto.createHash('sha256').update(text).digest('hex');
const config={baseUrl:'https://raw.githubusercontent.com/dacamisaopeso-art/o-peso-da-camisa/'+'a'.repeat(40)+'/'+directory,manifestSha256:sha(manifest),version:meta.version,players:25742};
(async()=>{
 let corrupt=false;const fetcher=async url=>{const file=url.slice(config.baseUrl.length);let body=fs.readFileSync(directory+file,'utf8');if(corrupt&&file!=='manifest.json')body+=' ';return new Response(body);};
 const data=await loadDrafTeamCatalog(config,fetcher);a.equal(data.players.length,25742);a.equal(data.cards.length,120);require('../drafteam-dados.js');a.deepEqual(data.players,OPC_DRAFTEAM_DATA.players.map(({id,name,position,categories,regions,fame})=>({id,name,position,categories,regions,fame})));
 corrupt=true;await a.rejects(loadDrafTeamCatalog(config,fetcher),/integridade/);await a.rejects(loadDrafTeamCatalog({...config,baseUrl:'https://evil.example/'},fetcher),/não configurado/);await a.rejects(loadDrafTeamCatalog({...config,version:'other'},fetcher),/Versão/);
 console.log('OK DrafTeam catálogo: 25.742 identidades, partes idênticas, commit imutável e integridade obrigatória.');
})().catch(e=>{console.error(e);process.exitCode=1;});
