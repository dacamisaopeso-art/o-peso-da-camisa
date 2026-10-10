const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'clubes-champions.js'),'utf8')+fs.readFileSync(path.join(root,'escudos-champions.js'),'utf8')+';globalThis.data={championsSquads,championsClubs,championsBadges}',ctx);
const {championsSquads:squads,championsClubs:clubs,championsBadges:badges}=ctx.data;
assert.equal(squads.length,908);assert.equal(Object.keys(clubs).length,151);assert.equal(Object.keys(badges).length,151);
assert.equal(clubs['50080'].name,'Barcelona');assert.equal(clubs['50037'].name,'Bayern de Munique');
const keys=new Set();let players=0;
for(const s of squads){assert(clubs[s.clubId]);assert.equal(s.country,clubs[s.clubId].name);assert.equal(s.year,`${s.endYear-1}/${String(s.endYear).slice(-2)}`);assert(s.players.length>=11);assert.equal(new Set(s.players.map(p=>p[3])).size,s.players.length);assert.deepEqual([...new Set(s.players.map(p=>p[0]))].sort(),['ATA','DEF','GOL','MEI']);const key=s.clubId+':'+s.year;assert(!keys.has(key));keys.add(key);for(const p of s.players){assert(p[1]&&p[3]);assert(p[2]>=65&&p[2]<=99);assert(Array.isArray(p[4]));assert(!p[1].includes('\ufffd'));players++}}
for(let end=2000;end<=2027;end++)assert.equal(squads.filter(s=>s.endYear===end).length,end>=2025?36:32);
for(const id of Object.keys(clubs)){assert(badges[id].startsWith('data:image/webp;base64,'));const buf=Buffer.from(badges[id].split(',')[1],'base64');assert.equal(buf.toString('ascii',0,4),'RIFF');assert.equal(buf.toString('ascii',8,12),'WEBP')}
const messi=squads.filter(s=>s.country==='Barcelona').flatMap(s=>s.players).filter(p=>p[1]==='Lionel Messi');assert(messi.length>10);assert.equal(new Set(messi.map(p=>p[3])).size,1);
console.log('PASS: 28 seasons, 908 squads, 151 clubs/badges, '+players+' registrations, positions, persistent IDs and UTF-8');
