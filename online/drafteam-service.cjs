/* Runs only on a trusted server. The browser receives Core.view, never this document. */
function createDrafTeamService(Core,data,store,{now=()=>Date.now(),uuid=()=>crypto.randomUUID()}={}){
 const formats=new Set(Object.keys(Core.formats));
 const name=n=>String(n||'Torcedor').trim().replace(/[\u0000-\u001f]/g,'').slice(0,24)||'Torcedor';
 const config=c=>({format:formats.has(c?.format)?c.format:'quick',duration:[30,45,60,90,120,180].includes(c?.duration)?c.duration:60});
 const expireMs=300000;
 function begin(doc){doc.game=Core.setup(doc.config,doc.members.map(m=>m.name),uuid());doc.game.teams.forEach(t=>t.bot=false);doc.members.forEach(m=>{m.ready=false;m.rematch=null;});doc.deadline=now()+45000;}
 function deadline(doc){doc.deadline=now()+(doc.game?.phase==='draft'||doc.game?.phase==='regularize'?doc.config.duration:45)*1000;}
 function after(doc,before){if(doc.game.phase!==before.phase||doc.game.turn!==before.turn)deadline(doc);}
 function advance(doc){const g=doc.game;if(!g||g.phase==='finished')return;const timeout=now()>=doc.deadline;let next=g;
  if(['brief','vote','formation'].includes(g.phase)){
   for(let i=0;i<g.teams.length;i++){const pending=g.phase==='brief'?!next.teams[i].ready:g.phase==='vote'?next.teams[i].vote===null:!next.teams[i].formation;
    if(pending&&(timeout||doc.members[i].autoplay)){const action=Core.bot(data,next,i,'normal');next=Core.step(data,next,i,action);if(next.phase!==g.phase)break;}}
  }else if(timeout||doc.members[g.actor].autoplay)next=Core.step(data,g,g.actor,Core.bot(data,g,g.actor,'normal'));
  if(next!==g){doc.game=next;after(doc,g);}
 }
 function reply(r,uid){const doc=r.document,seat=doc.members.findIndex(m=>m.id===uid);return {code:r.code,version:r.version,seat,host:doc.host===uid,serverNow:now(),deadline:doc.deadline,config:doc.config,catalogVersion:data.version,members:doc.members.map((m,i)=>({name:m.name,ready:m.ready,rematch:m.rematch,present:now()-m.seen<20000,autoplay:!!m.autoplay,returnUntil:m.seen+expireMs,seat:i})),game:doc.game?Core.view(doc.game,seat):null};}
 async function request(uid,input){if(!uid)throw Error('Identificação obrigatória.');if(!input||typeof input.type!=='string')throw Error('Solicitação inválida.');
  if(input.type==='create'){
   const code=uuid().replaceAll('-','').slice(0,8).toUpperCase(),document={host:uid,config:config(input.config),catalogVersion:data.version,members:[{id:uid,name:name(input.name),ready:false,rematch:null,seen:now()}],game:null,deadline:null};
   const row=await store.create(code,document,uid);return reply(row,uid);
  }
  const code=String(input.code||'').trim().toUpperCase();if(!/^[A-F0-9]{8}$/.test(code))throw Error('Código de sala inválido.');const row=await store.get(code);if(!row||now()-row.updated>86400000)throw Error('Sala encerrada ou não encontrada.');const doc=structuredClone(row.document);
  if(doc.catalogVersion!==data.version)throw Error('Esta sala usa outra versão da base. Crie uma nova sala.');let seat=doc.members.findIndex(m=>m.id===uid);
  if(input.type==='join'&&seat<0){if(doc.game)throw Error('Esta partida já começou.');if(doc.members.length>=5)throw Error('A sala já tem cinco participantes.');doc.members.push({id:uid,name:name(input.name),ready:false,rematch:null,seen:now()});doc.members.forEach(m=>m.ready=false);seat=doc.members.length-1;}
  if(seat<0)throw Error('Você não participa desta sala.');const member=doc.members[seat];
  // Human seats remain reserved. After five minutes, the server plays for the seat.
  for(const m of doc.members)if(doc.game&&now()-m.seen>expireMs)m.autoplay=true;
  if(member.left)throw Error('Você saiu desta sala.');if(member.autoplay&&now()-member.seen>expireMs)throw Error('O prazo de retorno terminou; o computador assumiu o time.');member.autoplay=false;member.seen=now();
  if(input.type==='leave'){if(doc.game){member.left=true;member.autoplay=true;}else{doc.members.splice(seat,1);if(doc.host===uid)doc.host=doc.members[0]?.id||'';doc.members.forEach(m=>m.ready=false);}}
  else if(input.type==='ready'){if(doc.game)throw Error('A partida já começou.');member.ready=input.value===true;}
  else if(input.type==='rename'){if(doc.game)throw Error('Edite o nome antes da partida.');member.name=name(input.name);}
  else if(input.type==='start'){if(doc.host!==uid||doc.game||doc.members.length<2||!doc.members.every(m=>m.ready))throw Error('O anfitrião inicia com dois a cinco participantes prontos.');begin(doc);}
  else if(input.type==='move'){if(!doc.game)throw Error('A partida ainda não começou.');if(input.version!==row.version)throw Error('A sala mudou. Confira o estado atualizado antes de jogar.');if(now()>=doc.deadline)throw Error('O tempo terminou. Atualize a sala para a jogada automática.');const before=doc.game;doc.game=Core.step(data,before,seat,input.action);after(doc,before);}
  else if(input.type==='rematch'){if(doc.game?.phase!=='finished')throw Error('Aguarde o resultado.');member.rematch=input.value===true;const active=doc.members.filter(m=>!m.left&&!m.autoplay);if(active.length>=2&&active.every(m=>m.rematch===true)&&active.length===doc.members.length)begin(doc);}
  else if(!['get','join','leave'].includes(input.type))throw Error('Ação desconhecida.');
  if(input.type!=='move')advance(doc);
  const saved=await store.save(code,row.version,doc);return input.type==='leave'?{left:true}:reply(saved,uid);
 }
 return {request};
}
if(typeof module!=='undefined')module.exports={createDrafTeamService};globalThis.createDrafTeamService=createDrafTeamService;
