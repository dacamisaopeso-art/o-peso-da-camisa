/* Read-only immutable catalog. Hash every byte; never evaluate downloaded code. */
async function loadDrafTeamCatalog(config,fetcher=fetch){
 if(!config||!/^https:\/\/raw\.githubusercontent\.com\/dacamisaopeso-art\/o-peso-da-camisa\/[a-f0-9]{40}\/online\/drafteam-catalogo-v2\/$/.test(config.baseUrl))throw Error('Catálogo v2 não configurado.');
 const digest=async text=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))),b=>b.toString(16).padStart(2,'0')).join('');
 async function read(file,expected){const response=await fetcher(config.baseUrl+file,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('Catálogo temporariamente indisponível.');const text=await response.text();if(text.length>2000000||await digest(text)!==expected)throw Error('A integridade do catálogo não foi confirmada.');return JSON.parse(text);}
 const meta=await read('manifest.json',config.manifestSha256);
 if(meta.version!==config.version||!Array.isArray(meta.parts)||meta.parts.length>40)throw Error('Versão de catálogo incompatível.');
 const blocks=[];
 for(let offset=0;offset<meta.parts.length;offset+=3){const batch=await Promise.all(meta.parts.slice(offset,offset+3).map(async part=>{if(!/^players-\d{2}\.json$/.test(part.file)||!Number.isInteger(part.count))throw Error('Bloco inválido.');const block=await read(part.file,part.sha256);if(!Array.isArray(block)||block.length!==part.count)throw Error('Bloco incompleto.');return block;}));blocks.push(...batch);}
 const players=blocks.flat();if(players.length!==config.players||new Set(players.map(p=>p.id)).size!==players.length||players.some(p=>!p.id||!p.name||!Array.isArray(p.categories)||!Array.isArray(p.regions)))throw Error('Catálogo incompleto.');
 const data={...meta,players};delete data.parts;return data;
}
if(typeof module!=='undefined')module.exports={loadDrafTeamCatalog};globalThis.loadDrafTeamCatalog=loadDrafTeamCatalog;
