/* Simultaneous rounds. Intentions stay private until every participant is ready. */
(function(root){'use strict';
const Base=typeof module!=='undefined'&&module.exports?require('./drafteam-core.js'):root.OPC_DRAFTEAM;
const copy=value=>structuredClone(value);
const active=s=>s.roundState?s.roundState.map((r,i)=>!r.done?i:-1).filter(i=>i>=0):(s.roundReady||[]).flatMap((ready,i)=>!ready?[i]:[]);
const pendingActors=s=>['draft','regularize'].includes(s.phase)?active(s).filter(i=>!s.roundState?.[i]?.action):s.teams.flatMap((t,i)=>s.phase==='brief'?!t.ready?[i]:[]:s.phase==='vote'?t.vote===null?[i]:[]:s.phase==='formation'?!t.formation?[i]:[]:[]);
function setup(config,names,seed){const s=Base.setup(config,names,seed);s.version=2;s.engine='simultaneous-v2';s.wave=0;s.roundState=[];s.roundCards=[];return s;}
function repairCard(data,s,i){
 const t=s.teams[i],c=s.roundCards[i];if(!c)return;
 const target=s.teams.some((other,j)=>j!==i&&!other.protected&&other.slots.some(Boolean));
 const hire=['hire','joker','replace','blind','keeper','defender','striker'].includes(c.type);
 if((['red','swap'].includes(c.type)&&(!target||c.type==='swap'&&!t.slots.some(Boolean)))||(['shield','dismiss'].includes(c.type)&&!t.slots.some(Boolean))||(hire&&!Base.available(data,s,c).length)){
  s.roundCards[i]={type:t.slots.some(id=>!id)?'hire':'replace',kind:'special',label:'Mercado de reposição',detail:'A carta anterior perdeu suas opções. Escolha qualquer atleta disponível, sem perder a rodada.'};
 }
}
function startRound(data,s){
 const f=Base.formats[s.config.format];if(s.phase!=='regularize'&&s.round>=f.rounds)s.phase='regularize';
 s.actor=null;s.card=null;s.wave=0;
 s.roundState=s.teams.map(t=>({done:s.phase==='regularize'&&!t.slots.some(id=>!id),action:null,notice:''}));
 if(s.roundState.every(r=>r.done))return Base.finish(data,s);
 s.teams.forEach(t=>t.protected=false);
 s.roundCards=s.teams.map((t,i)=>{if(s.roundState[i].done)return null;if(s.phase==='regularize')return {type:'hire',kind:'special',label:'Regularização',detail:'Complete uma vaga com qualquer atleta disponível.'};const draft={...s,actor:i};const card=Base.draw(data,draft);s.rng=draft.rng;return card;});
 return s;
}
function simulate(data,s,i,action){return Base.step(data,{...s,actor:i,card:s.roundCards[i]},i,action,false);}
function resolve(data,s){
 if(active(s).some(i=>!s.roundState[i].action))return s;
 const n=s.teams.length,rotation=Array.from({length:n},(_,j)=>(s.round+j)%n);
 // An immunity selected this round protects before an opponent's attack.
 const order=[...rotation.filter(i=>s.roundCards[i]?.type==='shield'),...rotation.filter(i=>s.roundCards[i]?.type!=='shield')];
 for(const i of order){const r=s.roundState[i];if(r.done)continue;const action=r.action;
  try{
   if(action.targetPlayer&&s.teams[action.target]?.slots[action.targetSlot]!==action.targetPlayer)throw Error('O atleta adversário mudou nesta rodada. Escolha novamente.');
   if(action.ownPlayer&&s.teams[i].slots[action.slot]!==action.ownPlayer)throw Error('Sua vaga mudou nesta rodada. Confirme outra escolha.');
   const result=simulate(data,s,i,action);s.teams=result.teams;s.log=result.log;s.turn=result.turn;s.rng=result.rng;r.done=true;r.action=null;r.notice='';
  }catch(e){r.action=null;r.notice=action.player&&Base.used(s).has(action.player)?'Outro time ficou com esse atleta pela prioridade alternada. Escolha outro nome; sua rodada continua.':e.message;repairCard(data,s,i);}
 }
 if(s.roundState.every(r=>r.done)){s.round++;return startRound(data,s);}
 s.wave++;return s;
}
function step(data,input,actor,action){
 if(!['draft','regularize'].includes(input.phase)){
  const s=Base.step(data,input,actor,action,false);return input.phase==='formation'&&s.phase==='draft'?startRound(data,s):s;
 }
 const s=copy(input),r=s.roundState[actor];if(!r||r.done)throw Error('Sua participação nesta rodada já foi resolvida.');
 if(action.type==='cancel'){if(!r.action)throw Error('Você ainda não confirmou uma escolha.');r.action=null;r.notice='';return s;}
 if(action.type!=='play'||r.action)throw Error('Sua escolha já está pronta. Aguarde os demais ou altere antes de todos confirmarem.');
 simulate(data,s,actor,action); // Validate now without changing a roster or revealing a choice.
 const planned={...action};delete planned.ownPlayer;delete planned.targetPlayer;
 if(s.teams[actor].slots[action.slot])planned.ownPlayer=s.teams[actor].slots[action.slot];
 if(['red','swap'].includes(s.roundCards[actor].type))planned.targetPlayer=s.teams[action.target].slots[action.targetSlot];
 r.action=planned;r.notice='';return resolve(data,s);
}
function view(s,actor=0){
 const v=Base.view({...s,card:s.phase==='finished'?null:s.roundCards?.[actor]||null,actor},actor);
 delete v.roundState;delete v.roundCards;v.actor=null;
 const own=s.roundState?.[actor];v.roundReady=s.teams.map((_,i)=>!!s.roundState?.[i]&&(s.roundState[i].done||!!s.roundState[i].action));
 v.roundDone=s.teams.map((_,i)=>!!s.roundState?.[i]?.done);
 if(own){v.submitted=!!own.action;v.submittedAction=own.action?copy(own.action):null;v.conflict=own.notice;v.resolved=own.done;}
 if(v.card?.type==='joker'&&s.phase!=='finished')v.hint=Base.hint(s);
 v.priority=Array.from({length:s.teams.length},(_,i)=>(s.round+i)%s.teams.length);
 return v;
}
function bot(data,s,actor,difficulty){if(!['draft','regularize'].includes(s.phase))return Base.bot(data,s,actor,difficulty);if(!pendingActors(s).includes(actor))return null;return Base.bot(data,{...s,actor,card:s.roundCards?.[actor]||s.card},actor,difficulty);}
const api={...Base,setup,step,view,bot,pendingActors};root.OPC_DRAFTEAM=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
