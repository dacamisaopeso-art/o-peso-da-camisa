const a=require('node:assert/strict'),daily=require('../velha-diario.js');
for(const input of ['null','[]','42','"texto"','{bad','{"2026-10-14":null}']){const storage={getItem:()=>input,setItem:()=>{}};a.deepEqual(daily.read(storage),{});const saved=daily.record(storage,'2026-10-14','empate');a.equal(saved.records['2026-10-14'].result,'empate');}
const storage={getItem:()=>'{"2026-10-13":{"result":"vitória"},"2026-10-14":{"result":"empate"},"__proto__":{"result":"vitória"}}'};a.equal(daily.streak(daily.read(storage),'2026-10-14'),2);a.equal(Object.keys(daily.read(storage)).length,2);
console.log('OK: dados locais corrompidos não interrompem o desafio diário; sequência válida preservada.');
