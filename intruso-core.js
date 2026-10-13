(function(root){'use strict';
const levels={easy:{label:'Torcedor',seconds:30},normal:{label:'Normal',seconds:22},hard:{label:'Especialista',seconds:15}};
function rng(seed){let h=2166136261;for(const c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function shuffle(items,r){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function deck(questions,{group='brasil',difficulty='normal',seed='OPC'}={}){if(!levels[difficulty])throw Error('Dificuldade inválida');let pool=questions.filter(q=>group==='todos'||q.group===group);if(difficulty==='easy')pool=pool.filter(q=>q.type!=='partida');if(difficulty==='hard')pool=pool.filter(q=>q.type==='partida');if(!pool.length)throw Error('Sem critérios para essa configuração');const r=rng(seed);return shuffle(pool,r).slice(0,10).map(q=>({...q,options:shuffle(q.eligible?[...shuffle(q.eligible,r).slice(0,3),q.options.find(o=>o.id===q.correct)]:q.options,r)}))}
function start(deck){return{index:0,points:0,correct:0,streak:0,bestStreak:0,answers:[],done:false,total:deck.length}}
function answer(state,question,id){if(state.done||state.answers.length>state.index)return state;if(id!==null&&!question.options.some(o=>o.id===id))return state;const hit=id===question.correct,streak=hit?state.streak+1:0,gain=hit?100+Math.min(5,Math.max(0,streak-1))*20:0;return{...state,points:state.points+gain,correct:state.correct+Number(hit),streak,bestStreak:Math.max(state.bestStreak,streak),answers:[...state.answers,{id:question.id,chosen:id,hit,gain}]}}
function next(state){if(state.answers.length!==state.index+1)return state;return{...state,index:state.index+1,done:state.index+1>=state.total}}
const api={levels,rng,shuffle,deck,start,answer,next};root.OPC_INTRUSO_CORE=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
