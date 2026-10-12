const a=require('node:assert/strict');
require('../velha-dados.js');require('../velha-busca-nomes.js');
const s=require('../velha-busca.js'),players=globalThis.OPC_VELHA_DATA.players,aliases=globalThis.OPC_VELHA_SEARCH_NAMES,index=s.createIndex(players,aliases);
const find=(q,mode='europe',used=[])=>s.search(players,index,q,{mode,used});
for(const q of ['Rodri','rodri','  RODRI  '])a.equal(find(q)[0].id,'Q20994118',q);
for(const q of ['Fred Guedes','Frederico Guedes','fred gued'])a.equal(find(q,'bra.1')[0].id,'Q312772',q);
for(const q of ['R9','R 9','Ronaldo Fenômeno','Ronaldo fenomeno','Ronaldo Nazário'])a.equal(find(q,'bra.1')[0].id,'Q529207',q);
for(const q of ['CR7','CR 7','Cristiano Ronaldo dos Santos Aveiro'])a.equal(find(q)[0].id,'Q11571',q);
a(find('Aveiro').some(p=>p.id==='Q11571'));
a(find('Guedes','bra.1').some(p=>p.id==='Q312772'));
a(!find('CR7','bra.1').some(p=>p.id==='Q11571'));
a(!find('Rodri','europe',['Q20994118']).some(p=>p.id==='Q20994118'));
a.equal(find('  --- ').length,0);a.equal(find('').length,0);a(find('ro').length<=30);
const allRodri=s.search(players,index,'Rodri',{mode:'europe',limit:players.length});a(allRodri.findIndex(p=>p.name==='Rodri')<allRodri.findIndex(p=>s.normalize(p.name).includes('rodrigue')));
for(const [id,record] of Object.entries(aliases)){a(index.has(id));a(record.names.length);a(record.sources.every(url=>url.startsWith('https://')));a(!record.names.some(n=>['bruxo','et'].includes(s.normalize(n))));}
const sample=[{id:'a',name:'Rodríguez',modes:['x'],botFame:100},{id:'b',name:'Rodri',modes:['x'],botFame:1}];
a.equal(s.search(sample,s.createIndex(sample),'Rodri',{mode:'x',limit:1})[0].id,'b');
a.equal(players.find(p=>p.id==='Q312772').name,'Fred');
console.log('OK: nomes exatos, sobrenomes, aliases documentados, acentos, limites, liga e nomes já utilizados; '+Object.keys(aliases).length+' identidades alternativas.');
