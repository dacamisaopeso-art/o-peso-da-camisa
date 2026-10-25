const a=require('node:assert/strict'),C=require('../drafteam-core.js');require('../drafteam-dados.js');const d=OPC_DRAFTEAM_DATA;
for(const f of Object.values(C.formats))for(const formation of f.formations){const slots=C.positions(formation);a.equal(slots.length,f.size);a.equal(slots.filter(x=>x==='GOL').length,1);}
const allCards=new Set();let played=0;
for(const format of Object.keys(C.formats))for(let seed=0;seed<35;seed++){
 let s=C.setup({format},['A','B','C','D','E'].slice(0,1+seed%5),'test'+seed),steps=0;
 a.equal(s.candidates.length,5);a.equal(new Set(s.deck).size,5);a(!JSON.stringify(C.view(s)).includes('"rng"'));a(!('seed' in C.view(s)));
 const start=structuredClone(s);a.deepEqual(start,C.setup({format},s.teams.map(t=>t.name),'test'+seed));
 while(s.phase!=='finished'&&steps++<450){
  const actor=['brief','vote','formation'].includes(s.phase)?s.teams.findIndex(t=>s.phase==='brief'?!t.ready:s.phase==='vote'?t.vote===null:!t.formation):s.actor;
  const action=C.bot(d,s,actor,['easy','normal','hard','expert'][seed%4]);
  if(s.card)allCards.add(s.card.type);
  try{s=C.step(d,s,actor,action);}catch(e){console.error({format,seed,phase:s.phase,round:s.round,actor,card:s.card,action,slots:s.teams[actor].slots});throw e;}
  const ids=s.teams.flatMap(t=>t.slots.filter(Boolean));a.equal(ids.length,new Set(ids).size,'exclusivity');if(s.phase!=='finished'){const v=C.view(s);a(!('secret' in v));a(!('tiebreaks' in v));}
 }
 a.equal(s.phase,'finished');a(s.results.some(r=>r.winner));a(s.teams.every(t=>t.slots.length===C.formats[format].size&&t.slots.every(Boolean)));played++;
}
a(allCards.has('joker'));a(allCards.has('swap'));a(allCards.has('red'));a(allCards.has('shield'));
let s=C.setup({},['A','B'],'privacy');for(let i=0;i<2;i++)s=C.step(d,s,i,{type:'ready'});s=C.step(d,s,0,{type:'vote',index:0});a.throws(()=>C.step(d,s,0,{type:'vote',index:1}),/Voto/);a(!('vote' in C.view(s,1).teams[0]));s=C.step(d,s,1,{type:'vote',index:0});for(let i=0;i<2;i++)s=C.step(d,s,i,{type:'formation',formation:s.teams[i].choice[0]});
const actor=s.actor,action=C.bot(d,s,actor);a.throws(()=>C.step(d,s,1-actor,action),/vez/);s=C.step(d,s,actor,action);const next=s.actor;const duplicate=s.teams[actor].slots.find(Boolean);a.throws(()=>C.step(d,s,next,{type:'play',slot:0,player:duplicate}),/indisponível|carta/);
s.card={type:'joker'};s.actor=0;a(C.view(s,0).hint);a(!C.view(s,1).hint);a(!('secret' in C.view(s,1)));
console.log('OK DrafTeam: '+played+' carreiras de draft completas; 1–5 times, 3 formatos, exclusividade, serpentina, cartas, coringa, votos e sigilo.');
