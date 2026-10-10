/* Formato 2026/27. Regras e adaptações da simulação: docs/fontes-champions.md. */
const ChampionsFormat=(()=>{
 const shuffle=(items,rng=Math.random)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
 function schedule(teams,rng=Math.random){
  if(teams.length!==36)throw Error('A fase de liga exige 36 clubes');
  // Dois adversários de cada pote; um como mandante e outro como visitante.
  for(let attempt=0;attempt<80;attempt++){
   const pots=Array.from({length:4},(_,p)=>shuffle(teams.slice(p*9,p*9+9),rng)),edges=[];
   for(const pot of pots)for(let i=0;i<9;i++)edges.push([pot[i],pot[(i+1)%9]]);
   for(let p=0;p<4;p++)for(let q=p+1;q<4;q++){
    const other=shuffle(pots[q],rng),shift=1+Math.floor(rng()*8);
    for(let i=0;i<9;i++){edges.push([pots[p][i],other[i]]);edges.push([other[(i+shift)%9],pots[p][i]])}
   }
   const potIndex=new Map(teams.map((t,i)=>[t,Math.floor(i/9)]));
   const cost=()=>{
    const counts=new Map(teams.map(t=>[t,{}]));let bad=0;const pairs=new Set();
    for(const [a,b] of edges){if(a===b)bad+=10;const key=[teams.indexOf(a),teams.indexOf(b)].sort((x,y)=>x-y).join(':');if(pairs.has(key))bad+=10;pairs.add(key);if(a.association&&a.association===b.association)bad+=3;
     if(b.association)counts.get(a)[b.association]=(counts.get(a)[b.association]||0)+1;
     if(a.association)counts.get(b)[a.association]=(counts.get(b)[a.association]||0)+1;
    }for(const cs of counts.values())for(const n of Object.values(cs))bad+=Math.max(0,n-2);return bad;
   };
   let bad=cost();
   const buckets=Array.from({length:16},()=>[]);
   edges.forEach(([a,b],i)=>buckets[potIndex.get(a)*4+potIndex.get(b)].push(i));
   for(let step=0;bad&&step<3000;step++){
    const i=Math.floor(rng()*edges.length),bucket=buckets[potIndex.get(edges[i][0])*4+potIndex.get(edges[i][1])],j=bucket[Math.floor(rng()*bucket.length)],side=rng()<.5?0:1;
    if(i===j)continue;
    [edges[i][side],edges[j][side]]=[edges[j][side],edges[i][side]];const next=cost();
    if(next<=bad||rng()<.015)bad=next;else [edges[i][side],edges[j][side]]=[edges[j][side],edges[i][side]];
   }
   if(bad)continue;
   const left=new Set(edges),rounds=[];
   function perfect(remaining,out){
    if(!remaining.size)return out;
    let options=null;
    for(const t of remaining){const os=[...left].filter(([a,b])=>(a===t&&remaining.has(b))||(b===t&&remaining.has(a)));if(!os.length)return null;if(!options||os.length<options.length)options=os}
    for(const edge of shuffle(options,rng)){const next=new Set(remaining);next.delete(edge[0]);next.delete(edge[1]);const found=perfect(next,[...out,edge]);if(found)return found}
    return null;
   }
   for(let r=0;r<8;r++){const pairs=perfect(new Set(teams),[]);if(!pairs)break;rounds.push(pairs);pairs.forEach(e=>left.delete(e))}
   if(rounds.length===8)return rounds;
  }
  throw Error('Não foi possível combinar os potes. Sorteie outra competição.');
 }
 function standings(teams){
  const collective=(t,key)=>t.opponents.reduce((sum,o)=>sum+(key==='sg'?o.gf-o.ga:o[key]),0);
  return [...teams].sort((a,b)=>b.pts-a.pts||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||b.awayGoals-a.awayGoals||b.v-a.v||b.awayWins-a.awayWins||collective(b,'pts')-collective(a,'pts')||collective(b,'sg')-collective(a,'sg')||collective(b,'gf')-collective(a,'gf')||a.discipline-b.discipline||b.coefficient-a.coefficient||a.seed-b.seed);
 }
 function playoffs(ranked,rng=Math.random){
  const ties=[];for(let i=0;i<4;i++){
   const seeded=shuffle(ranked.slice(8+2*i,10+2*i),rng),unseeded=shuffle(ranked.slice(22-2*i,24-2*i),rng);
   for(let j=0;j<2;j++)ties.push({a:seeded[j],b:unseeded[j],route:i*2+j,first:null});
  }return ties;
 }
 function round16(ranked,playoffWinners,rng=Math.random){
  const ties=[];
  // Each side: rank 1/2 meets 15/16 route; 7/8 meets 9/10; 3/4 meets 13/14; 5/6 meets 11/12.
  const routes=[3,0,2,1],topPairs=[0,3,1,2];
  const top=topPairs.map(p=>shuffle(ranked.slice(2*p,2*p+2),rng));
  for(let side=0;side<2;side++)for(let slot=0;slot<4;slot++){
   const a=top[slot][side],b=playoffWinners[routes[slot]*2+side];
   a.pathRank=ranked.indexOf(a)+1;b.pathRank=a.pathRank;
   ties.push({a,b,first:null});
  }return ties;
 }
 function advance(winners){
  return Array.from({length:winners.length/2},(_,i)=>{
   const pair=winners.slice(i*2,i*2+2).sort((a,b)=>a.pathRank-b.pathRank);
   pair[1].pathRank=pair[0].pathRank;
   return {a:pair[0],b:pair[1],first:null};
  });
 }
 function result(a,b,{first=null,deciding=false,goals=null,rng=Math.random}={}){
  const score=s=>Math.max(0,Math.min(5,Math.floor(rng()*3.7+(s-84)/12)));
  const r={a,b,ga:goals?goals[0]:score(a.strength),gb:goals?goals[1]:score(b.strength),extra:null,pen:null,winner:null};
  const aggregate=()=>[r.ga+(first?.gb||0),r.gb+(first?.ga||0)];
  if(deciding&&aggregate()[0]===aggregate()[1]){r.extra=[rng()<.35?1:0,rng()<.35?1:0];r.ga+=r.extra[0];r.gb+=r.extra[1];if(aggregate()[0]===aggregate()[1])r.pen=rng()<.5?[5,4]:[4,5]}
  const totals=deciding?aggregate():[r.ga,r.gb];
  r.aggregate=first?totals:null;
  r.winner=totals[0]>totals[1]?a:totals[1]>totals[0]?b:r.pen?(r.pen[0]>r.pen[1]?a:b):null;
  return r;
 }
 return {shuffle,schedule,standings,playoffs,round16,advance,result};
})();
if(typeof module!=='undefined')module.exports=ChampionsFormat;
