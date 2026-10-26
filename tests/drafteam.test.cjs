const a=require('node:assert/strict'),C=require('../drafteam-rounds.js');require('../drafteam-dados.js');const d=OPC_DRAFTEAM_DATA;
a.equal(d.players.length,25742);a.equal(new Set(d.players.map(p=>p.id)).size,d.players.length);a.equal(C.criteria.length,62);a.equal(d.cards.length,120);for(const c of C.criteria)a(d.coverage.criteria[c.id]>=15,c.id);
for(const f of Object.values(C.formats))for(const formation of f.formations){const slots=C.positions(formation);a.equal(slots.length,f.size);a.equal(slots.filter(x=>x==='GOL').length,1);}
function toDraft(names=['A','B'],seed='privacy'){let s=C.setup({format:'quick'},names,seed);for(let i=0;i<names.length;i++)s=C.step(d,s,i,{type:'ready'});for(let i=0;i<names.length;i++)s=C.step(d,s,i,{type:'vote',index:i%5});for(let i=0;i<names.length;i++)s=C.step(d,s,i,{type:'formation',formation:s.teams[i].choice[0]});return s;}
const free={type:'hire',kind:'special',label:'Teste',detail:'Livre'};
let s=toDraft();s.roundCards=[{...free},{...free}];const first=d.players[0].id;
s=C.step(d,s,1,{type:'play',slot:0,player:first});a.equal(s.round,0);a(s.teams.every(t=>t.slots.every(id=>id===null)),'no premature roster change');a.equal(C.view(s,1).submitted,true);a.equal(C.view(s,0).submittedAction,null);a(!('roundCards' in C.view(s,0)));a(!('roundState' in C.view(s,0)));
a.throws(()=>C.step(d,s,1,{type:'play',slot:0,player:first}),/pronta/);s=C.step(d,s,1,{type:'cancel'});a.equal(C.view(s,1).submitted,false);
s=C.step(d,s,1,{type:'play',slot:0,player:first});s=C.step(d,s,0,{type:'play',slot:0,player:first});a.equal(s.round,0);a.equal(s.wave,1);a.equal(s.teams[0].slots[0],first);a.equal(s.teams[1].slots[0],null);a(C.view(s,1).conflict.includes('prioridade'));a.throws(()=>C.step(d,s,0,{type:'play',slot:1,player:d.players[1].id}),/resolvida/);
s=C.step(d,s,1,{type:'play',slot:0,player:d.players[1].id});a.equal(s.round,1);a.equal(C.view(s,0).priority[0],1);
s.roundCards=[{...free},{...free}];const repeat=d.players[2].id;const left=C.step(d,C.step(d,s,0,{type:'play',slot:1,player:repeat}),1,{type:'play',slot:1,player:repeat});const right=C.step(d,C.step(d,s,1,{type:'play',slot:1,player:repeat}),0,{type:'play',slot:1,player:repeat});a.deepEqual(left,right,'submission speed does not decide priority');a.equal(left.teams[1].slots[1],repeat);
let shield=toDraft();shield.round=5;shield.teams.forEach((t,i)=>{t.slots=d.players.slice(i*5,i*5+5).map(p=>p.id);t.shields=t.slots.map(()=>false);});shield.roundCards=[{type:'red',kind:'sabotage',label:'Vermelho'},{type:'shield',kind:'special',label:'Imunidade'}];const protectedId=shield.teams[1].slots[0];shield=C.step(d,shield,0,{type:'play',target:1,targetSlot:0});shield=C.step(d,shield,1,{type:'play',slot:0});a.equal(shield.teams[1].slots[0],protectedId);a(shield.log.some(l=>l.blocked));
const allCards=new Set();let played=0;
for(const format of Object.keys(C.formats))for(let seed=0;seed<20;seed++){
 let game=C.setup({format},['A','B','C','D','E'].slice(0,1+seed%5),'test-v2-'+seed),steps=0;
 a.equal(game.candidates.length,5);a.equal(new Set(game.deck).size,5);a(!('rng' in C.view(game)));a(!('seed' in C.view(game)));
 a.deepEqual(game,C.setup({format},game.teams.map(t=>t.name),'test-v2-'+seed));
 while(game.phase!=='finished'&&steps++<450){const actor=C.pendingActors(game)[0];a.notEqual(actor,undefined);const card=game.roundCards[actor];if(card)allCards.add(card.type);const action=C.bot(d,game,actor,['easy','normal','hard','expert'][seed%4]);try{game=C.step(d,game,actor,action);}catch(e){console.error({format,seed,phase:game.phase,round:game.round,actor,card,action});throw e;}const ids=game.teams.flatMap(t=>t.slots.filter(Boolean));a.equal(ids.length,new Set(ids).size);const v=C.view(game,actor);a(!('roundCards' in v));a(!('roundState' in v));if(game.phase!=='finished'){a(!('secret' in v));a(!('tiebreaks' in v));}}
 a.equal(game.phase,'finished');a(game.results.some(r=>r.winner));a(game.teams.every(t=>t.slots.length===C.formats[format].size&&t.slots.every(Boolean)));played++;
}
for(const type of ['joker','swap','red','shield','tactic','blind','dismiss','keeper','defender','striker','replace'])a(allCards.has(type),type);
console.log('OK DrafTeam v2: '+played+' drafts completos; 25.742 atletas, 62 objetivos, 120 cartas, decisões simultâneas privadas, prioridade rotativa, conflitos sem perda e proteção.');
