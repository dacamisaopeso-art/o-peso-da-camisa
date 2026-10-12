/* Busca local por identidade. Nunca muda elegibilidade, nomes exibidos ou fatos. */
(function(root){
 'use strict';
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ').replace(/^(cr|r) (\d+)$/,'$1$2');
 function createIndex(players,aliases={}){return new Map(players.map(p=>{const name=normalize(p.name),extra=[...new Set((aliases[p.id]?.names||[]).map(normalize))].filter(n=>n&&n!==name);return[p.id,{name,extra,nameWords:name.split(' '),allWords:[name,...extra].flatMap(n=>n.split(' '))}];}));}
 function score(entry,q){if(entry.name===q)return 0;if(entry.extra.includes(q))return 1;if(entry.name.startsWith(q))return 2;
  const tokens=q.split(' ');if(tokens.every(t=>entry.nameWords.includes(t)))return 3;
  if(entry.extra.some(n=>n.startsWith(q)))return 4;
  if(tokens.every(t=>entry.nameWords.some(w=>w.startsWith(t))))return 5;
  if(tokens.every(t=>entry.allWords.includes(t)))return 6;
  if(tokens.every(t=>entry.allWords.some(w=>w.startsWith(t))))return 7;
  if(entry.name.includes(q))return 8;if(entry.extra.some(n=>n.includes(q)))return 9;return Infinity;
 }
 function search(players,index,query,{mode,used=[],limit=30}={}){const q=normalize(query);if(!q)return[];const unavailable=new Set(used),hits=[];
  for(const p of players){if((mode&&!p.modes.includes(mode))||unavailable.has(p.id))continue;const entry=index.get(p.id);if(!entry)continue;const rank=score(entry,q);if(Number.isFinite(rank))hits.push({p,rank});}
  hits.sort((a,b)=>a.rank-b.rank||(b.p.botFame||0)-(a.p.botFame||0)||a.p.name.localeCompare(b.p.name,'pt-BR')||a.p.id.localeCompare(b.p.id));return hits.slice(0,limit).map(x=>x.p);
 }
 const api={normalize,createIndex,search};root.OPC_VELHA_SEARCH=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
