const fs=require('node:fs'),path=require('node:path');
require('../velha-dados.js');const d=globalThis.OPC_VELHA_DATA;
const catalog={version:d.version,boards:d.boards,players:d.players.map(p=>({id:p.id,modes:p.modes,categories:p.categories}))};
const json=JSON.stringify(catalog);if(json.includes('$opc_catalog$')||!/^[a-zA-Z0-9-]+$/.test(d.version))throw Error('Versão ou delimitador inválido.');
fs.writeFileSync(path.join(__dirname,'../online/velha-catalogo.sql'),`-- Catálogo auditado. Executar após velha-schema.sql.\ninsert into public.opc_velha_catalog(id,version,data) values(true,'${d.version}',$opc_catalog$${json}$opc_catalog$::jsonb) on conflict(id) do update set version=excluded.version,data=excluded.data;\n`);
console.log('Catálogo online gerado a partir da base do jogo.');
