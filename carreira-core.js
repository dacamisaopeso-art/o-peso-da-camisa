(function(root){'use strict';
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
 function rng(seed){let h=2166136261;for(const c of String(seed)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return()=>{h+=0x6d2b79f5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
 function pool(data,mode,difficulty='all',universe='all'){return data.people.filter(p=>p.mode===mode&&(mode==='coach'||universe==='all'||p.universes.includes(universe))&&(difficulty==='all'||p.difficulty===difficulty));}
 function choose(data,config,used,random=Math.random){const options=pool(data,config.mode,config.difficulty,config.universe||'world').filter(p=>!used.includes(p.id));return options.length?options[Math.floor(random()*options.length)]:null;}
 function start(person,universe='all'){if(!person?.career?.length)throw Error('Trajetória indisponível.');return {personId:person.id,universe,attempt:1,revealed:1,ended:false,won:false,score:0,guesses:[],skips:0};}
 function score(attempt,total){if(total===1)return 500;return Math.round(1000*(1-.75*(attempt-1)/(total-1)));}
 function signature(p){return JSON.stringify(p.career.map(s=>[s.wiki,s.start,s.end,s.loan]));}
 function answer(data,state,id,skip=false){if(state.ended)return {ok:false,error:'Esta rodada já terminou.'};const target=data.people.find(p=>p.id===state.personId);if(!target)return {ok:false,error:'Trajetória indisponível.'};const candidate=skip?null:pool(data,target.mode,'all',state.universe||'all').find(p=>p.id===id);if(!skip&&!candidate)return {ok:false,error:'Selecione um nome das sugestões.'};if(candidate&&state.guesses.includes(id))return {ok:false,error:'Você já tentou esse nome. Escolha outro ou pule.'};const next=structuredClone(state);if(skip)next.skips++;else next.guesses.push(id);
  if(candidate&&(candidate.id===target.id||signature(candidate)===signature(target))){next.ended=true;next.won=true;next.score=score(next.attempt,target.career.length);next.revealed=target.career.length;return {ok:true,state:next,correct:true};}
  if(next.revealed===target.career.length){next.ended=true;next.revealed=target.career.length;return {ok:true,state:next,correct:false};}
  next.revealed++;next.attempt++;return {ok:true,state:next,correct:false};
 }
 function search(data,mode,text,universe='all'){const q=normalize(text);if(q.length<2)return [];return pool(data,mode,'all',universe).filter(p=>p.aliases.some(a=>normalize(a).includes(q))).sort((a,b)=>Number(!a.aliases.some(s=>normalize(s)===q))-Number(!b.aliases.some(s=>normalize(s)===q))||a.name.localeCompare(b.name,'pt-BR')).slice(0,12);}
 function resolve(data,mode,text,universe='all'){const matches=pool(data,mode,'all',universe).filter(p=>p.aliases.some(a=>normalize(a)===normalize(text)));return matches.length===1?matches[0]:null;}
 function age(p,date=new Date()){if(!/^\d{4}-\d{2}-\d{2}$/.test(p.birth||'')||(p.deceased&&!p.death))return '';const [y,m,d]=p.birth.split('-').map(Number),end=p.death?p.death.split('-').map(Number):[date.getFullYear(),date.getMonth()+1,date.getDate()];return end[0]-y-(end[1]<m||(end[1]===m&&end[2]<d)?1:0);}
 const api={normalize,rng,pool,choose,start,score,signature,answer,search,resolve,age};root.OPC_CAREER_CORE=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
