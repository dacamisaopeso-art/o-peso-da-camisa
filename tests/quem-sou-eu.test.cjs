const assert=require('node:assert/strict');
const game=require('../quem-sou-eu.js');
require('../quem-sou-eu-dados.js');
const data=global.OPC_PLAYERS,players=data.players.map(p=>game.enrich(p,data.updated));
assert.equal(data.clubs.length,116);
assert.equal(new Set(players.map(p=>p.id)).size,players.length);
assert(players.every(p=>p.nationality&&p.club&&p.league&&p.birth&&p.age!==null&&Number.isInteger(p.number)&&p.detailedPosition));
assert(players.every(p=>['GOL','ZAG','LE','LD','VOL','MC','MEI','PD','PE','ATA'].includes(p.position)));
for(const [league,count] of Object.entries({'eng.1':20,'esp.1':20,'ita.1':20,'ger.1':18,'fra.1':18,'bra.1':20})){
  assert.equal(data.clubs.filter(c=>c.league===league).length,count);
  assert(data.clubs.filter(c=>c.league===league).every(c=>players.some(p=>p.league===league&&p.clubId===c.id)));
  assert(game.poolFor(players,league).every(p=>p.league===league));
}
assert(game.poolFor(players,'europe').every(p=>p.league!=='bra.1'));
assert.equal(new Set(game.poolFor(players,'europe').map(p=>p.league)).size,5);
assert(!game.fields('bra.1').includes('league'));assert(game.fields('europe').includes('league'));
assert.equal(game.ageAt('2000-10-10','2026-10-09'),25);assert.equal(game.ageAt('2000-10-09','2026-10-09'),26);assert.equal(game.ageAt(null,data.updated),null);
assert.equal(game.normalize('Vinícius Ødegaard'),'vinicius odegaard');
assert.equal(game.compare({age:20},{age:30},'age').mark,'↑');assert.equal(game.compare({number:87},{number:42},'number').mark,'↓');
assert.equal(game.compare({number:null},{number:2},'number').kind,'unknown');
assert.equal(game.compare({position:'DEF',detailedPosition:false},{position:'ZAG',detailedPosition:true},'position').kind,'unknown');
for(const diff of ['easy','normal','hard']){const pool=game.poolFor(players,'eng.1');let r=new game.Round(pool,'eng.1',diff,5,()=>0);assert.equal(r.hints.length,diff==='easy'?2:0);const first=r.target.id;assert.equal(r.guess('invalid').error,'Selecione um jogador disponível neste modo.');assert.equal(r.guesses.length,0);r.guess(pool[1].id);assert(r.guess(pool[1].id).error);assert.equal(r.guesses.length,1);if(diff==='hard')assert.equal(r.hint(),null);else{const before=r.guesses.length;const known=new Set(r.known);const h=r.hint();assert(!known.has(h));assert.equal(r.guesses.length,before);}r.guess(first);assert(r.won&&r.ended);assert(r.guess(pool[2].id).error);assert.equal(game.blur(diff,1,5,true),0);assert(game.blur(diff,2,5,false)<game.blur(diff,1,5,false));assert.notEqual(new game.Round(pool,'eng.1',diff,5,()=>0,first).target.id,first);}
let r=new game.Round(game.poolFor(players,'europe'),'europe','normal',10,()=>0);for(const p of r.pool.filter(p=>p.id!==r.target.id).slice(0,10))r.guess(p.id);assert(r.ended&&!r.won);assert.equal(r.guesses.length,10);
assert(players.every(p=>p.source.startsWith('https://www.espn.com/')));
console.log(`OK: ${data.clubs.length} clubes, ${players.length} jogadores; ligas, comparação, dicas, vitória, derrota, reinício e blur.`);
