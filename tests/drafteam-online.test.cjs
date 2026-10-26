const a=require('node:assert/strict'),C=require('../drafteam-rounds.js'),{createDrafTeamService}=require('../online/drafteam-service.cjs');require('../drafteam-dados.js');const data=OPC_DRAFTEAM_DATA;
async function run(){for(let count=2;count<=5;count++){
 let now=1000000;const rooms=new Map(),store={async create(code,document){if(rooms.has(code))throw Error('collision');const r={code,version:1,document:structuredClone(document),updated:now};rooms.set(code,r);return structuredClone(r);},async get(code){return structuredClone(rooms.get(code));},async save(code,version,document){const before=rooms.get(code);if(before.version!==version)throw Error('A sala mudou.');const r={code,version:version+1,document:structuredClone(document),updated:now};rooms.set(code,r);return structuredClone(r);}};
 const service=createDrafTeamService(C,data,store,{now:()=>now,uuid:()=>crypto.randomUUID()});const rpc=(uid,input)=>service.request('user'+uid,input);
 let r=await rpc(0,{type:'create',name:'A',config:{format:count%2?'insane':'quick',duration:30,secret:'brazil'}}),code=r.code;
 a.equal(r.config.secret,undefined);for(let i=1;i<count;i++)r=await rpc(i,{type:'join',code,name:'Time '+i});
 if(count===5)await a.rejects(rpc(8,{type:'join',code,name:'Sexto'}),/cinco/);
 await a.rejects(rpc(9,{type:'get',code}),/participa/);await a.rejects(rpc(1,{type:'start',code}),/anfitrião/);await a.rejects(rpc(0,{type:'start',code}),/prontos/);
 for(let i=0;i<count;i++)await rpc(i,{type:'ready',code,value:true});r=await rpc(0,{type:'start',code});a.equal(r.game.phase,'brief');a(!('seed' in r.game));a(!('deck' in r.game));a(!('rng' in r.game));
 const move=async(i,action)=>{const current=await rpc(i,{type:'get',code});return rpc(i,{type:'move',code,version:current.version,action});};
 await Promise.all(Array.from({length:count},(_,i)=>move(i,{type:'ready'})));r=await move(0,{type:'vote',index:0});a.equal(r.game.teams[0].vote,undefined);a.equal(r.game.teams[0].voted,true);a(!('secret' in r.game));await a.rejects(move(0,{type:'vote',index:1}),/Voto/);
 for(let i=1;i<count;i++)r=await move(i,{type:'vote',index:i%2});a.equal(r.game.phase,'formation');for(let i=0;i<count;i++){const mine=await rpc(i,{type:'get',code});a.equal(mine.game.choices.length,2);a.equal(new Set(mine.game.choices).size,2);a.equal(mine.game.teams[(i+1)%count].choice,undefined);r=await move(i,{type:'formation',formation:mine.game.choices[0]});}
 const before=await rpc(0,{type:'get',code});const presence=await rpc(1,{type:'get',code});a.equal(presence.version,before.version,'presence must not invalidate a turn');const action=C.bot(data,rooms.get(code).document.game,0,'normal');r=await rpc(0,{type:'move',code,version:before.version,action});a.equal(r.game.submitted,true);a(r.game.teams.every(t=>t.slots.every(id=>id===null)));a.equal((await rpc(1,{type:'get',code})).game.submittedAction,null);for(let i=1;i<count;i++)r=await move(i,C.bot(data,rooms.get(code).document.game,i,'normal'));await a.rejects(rpc(0,{type:'move',code,version:before.version,action}),/mudou/);
 // Server timer alone can finish a game even with disconnected participants.
 let rounds=0;while(rooms.get(code).document.game.phase!=='finished'&&rounds++<300){now+=31000;r=await rpc(0,{type:'get',code});a(!('secret' in r.game)||r.game.phase==='finished');a(!('roundCards' in r.game));a(!('roundState' in r.game));}
 a.equal(r.game.phase,'finished');a(r.game.results.some(x=>x.winner));a(r.game.teams.every(t=>t.slots.every(Boolean)));a(r.game.teams[1].slots.length>0);
 // Reconnecting beyond the five-minute reservation is denied; automated team remains.
 now+=300001;await a.rejects(rpc(1,{type:'get',code}),/prazo de retorno/);
 }
 console.log('OK DrafTeam online: 2–5 membros, sexto bloqueado, autenticação, votos privados, sem seed/objetivo/pistas vazados, formações individuais, CAS e conclusão por timeout.');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
