const assert=require('node:assert/strict');
const F=require('../formato-champions.js');
let seed=729;const rng=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
for(let draw=0;draw<30;draw++){
 const teams=Array.from({length:36},(_,seed)=>({seed,association:seed===0?'':String(Math.floor((seed-1)/4))}));
 const schedule=F.schedule(teams,rng),seen=new Set();assert.equal(schedule.length,8);
 for(const round of schedule){assert.equal(round.length,18);assert.equal(new Set(round.flat()).size,36);for(const [a,b] of round){assert.notEqual(a,b);assert(!a.association||a.association!==b.association);const key=[a.seed,b.seed].sort((a,b)=>a-b).join(':');assert(!seen.has(key));seen.add(key)}}
 for(const t of teams){const home=schedule.flat().filter(p=>p[0]===t),away=schedule.flat().filter(p=>p[1]===t);assert.equal(home.length,4);assert.equal(away.length,4);const opponents=[...home.map(p=>p[1]),...away.map(p=>p[0])];for(let pot=0;pot<4;pot++)assert.equal(opponents.filter(o=>Math.floor(o.seed/9)===pot).length,2);const cs={};opponents.forEach(o=>cs[o.association]=(cs[o.association]||0)+1);assert(Object.values(cs).every(n=>n<=2))}
 assert.equal(seen.size,144);
}
const ranked=Array.from({length:36},(_,i)=>({seed:i,rank:i+1}));
for(let i=0;i<20;i++){
 const po=F.playoffs(ranked,rng);assert.equal(po.length,8);assert.equal(new Set(po.flatMap(t=>[t.a,t.b])).size,16);
 for(const t of po){assert(t.a.rank>=9&&t.a.rank<=16);assert(t.b.rank>=17&&t.b.rank<=24);assert.equal(Math.floor((t.a.rank-9)/2),Math.floor((24-t.b.rank)/2))}
 const r16=F.round16(ranked,po.map(t=>t.a),rng);assert.equal(r16.length,8);assert.equal(new Set(r16.flatMap(t=>[t.a,t.b])).size,16);
 for(const t of r16){assert(t.a.rank<=8);const bucket=Math.floor((t.a.rank-1)/2);assert.equal(Math.floor((t.b.rank-9)/2),3-bucket)}
 assert.notEqual(Math.floor(r16.findIndex(t=>t.a.rank===1)/4),Math.floor(r16.findIndex(t=>t.a.rank===2)/4));
 let ties=r16;for(const n of [4,2,1]){ties=F.advance(ties.map(t=>t.b));assert.equal(ties.length,n);assert(ties.every(t=>t.a.pathRank<=t.b.pathRank))}
}
const a={strength:90},b={strength:90};
const first=F.result(b,a,{goals:[2,1],rng:()=>.9});const second=F.result(a,b,{first,deciding:true,goals:[1,0],rng:()=>.9});assert.deepEqual(second.aggregate,[2,2]);assert(second.extra&&second.pen);assert.equal(second.winner,b);
const win=F.result(a,b,{first,deciding:true,goals:[3,0],rng:()=>.9});assert.equal(win.winner,a);assert.equal(win.extra,null);assert.deepEqual(win.aggregate,[4,2]);
const league=F.result(a,b,{goals:[1,1],rng:()=>.9});assert.equal(league.winner,null);assert.equal(league.pen,null);
const final=F.result(a,b,{deciding:true,goals:[0,0],rng:()=>.9});assert(final.pen);assert.equal(final.winner,b);
const t=(seed,overrides={})=>({seed,pts:10,gf:8,ga:4,awayGoals:2,v:3,awayWins:1,discipline:0,coefficient:80,opponents:[],...overrides});
assert.equal(F.standings([t(0),t(1,{gf:9})])[0].seed,1);
assert.equal(F.standings([t(0),t(1,{awayGoals:3})])[0].seed,1);
assert.equal(F.standings([t(0,{opponents:[t(2)]}),t(1,{opponents:[t(3,{pts:11})]})])[0].seed,1);
assert.equal(F.standings([t(0,{discipline:2}),t(1)])[0].seed,1);
assert.equal(F.standings([t(0),t(1,{coefficient:81})])[0].seed,1);
console.log('PASS: 30 league draws, 144 distinct matches, pots/home/away/associations, ranking routes, inherited seeding, aggregate, extra time, penalties and tiebreaks');
