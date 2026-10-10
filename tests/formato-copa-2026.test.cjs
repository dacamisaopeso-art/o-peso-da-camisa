const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync(path.join(__dirname,'..','formato-copa-2026.js'),'utf8'),ctx);
const mappings=vm.runInContext('worldCupThirdPairs',ctx);
assert.equal(Object.keys(mappings).length,495);
const allowed={A:'CEFHI',B:'EFGIJ',D:'BEFIJ',E:'ABCDF',G:'AEHIJ',I:'CDFGH',K:'DEIJL',L:'EHIJK'};
for(const [key,value] of Object.entries(mappings)){
 assert.equal(new Set(key).size,8);assert.equal([...value].sort().join(''),key);
 [...'ABDEGIKL'].forEach((winner,i)=>assert.ok(allowed[winner].includes(value[i])));
 const ranked=Array.from({length:12},(_,g)=>Array.from({length:4},(_,r)=>({seed:g*4+r,groupIndex:g,rank:r})));
 const thirds=[...key].map(c=>ranked[c.charCodeAt(0)-65][2]);const pairs=ctx.buildRound32(ranked,thirds);
 assert.equal(pairs.length,16);assert.equal(new Set(pairs.flat()).size,32);
 assert.equal(pairs.flat().filter(t=>t.rank===2).length,8);
 assert.ok(pairs.every(([a,b])=>a.groupIndex!==b.groupIndex));
 assert.equal(pairs[0].map(t=>t.seed).join(','),'1,5');assert.equal(pairs[2].map(t=>t.seed).join(','),'20,9');
}
const winners=Array.from({length:16},(_,i)=>73+i);
assert.equal(JSON.stringify(ctx.advanceWorldCupBracket(winners,1)),JSON.stringify([[74,77],[73,75],[76,78],[79,80],[83,84],[81,82],[86,88],[85,87]]));
assert.equal(JSON.stringify(ctx.advanceWorldCupBracket(Array.from({length:8},(_,i)=>89+i),2)),JSON.stringify([[89,90],[93,94],[91,92],[95,96]]));
console.log('PASS: 495 combinações oficiais, 32 classificados sem duplicatas e cruzamentos FIFA.');
