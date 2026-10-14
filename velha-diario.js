/* Desafio diário local. Não é um ranking global nem substitui o multiplayer. */
(function(root){'use strict';
 function day(date=new Date()){return new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);}
 function rng(seed){let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619);return()=>{n+=0x6D2B79F5;let x=n;x=Math.imul(x^x>>>15,x|1);x^=x+Math.imul(x^x>>>7,x|61);return((x^x>>>14)>>>0)/4294967296;};}
 function read(storage){try{const saved=JSON.parse(storage.getItem('opc-velha-daily')||'{}');if(!saved||typeof saved!=='object'||Array.isArray(saved))return {};return Object.fromEntries(Object.entries(saved).filter(([date,value])=>/^\d{4}-\d{2}-\d{2}$/.test(date)&&['vitória','derrota','empate'].includes(value?.result)).sort(([a],[b])=>a.localeCompare(b)).slice(-400));}catch{return {};}}
 function record(storage,date,result){let saved=read(storage);if(saved[date])return{first:false,records:saved};saved[date]={result};const keys=Object.keys(saved).sort().slice(-400);saved=Object.fromEntries(keys.map(k=>[k,saved[k]]));try{storage.setItem('opc-velha-daily',JSON.stringify(saved))}catch{}return{first:true,records:saved};}
 function streak(records,date){let n=0,t=new Date(date+'T12:00:00Z');while(records[t.toISOString().slice(0,10)]){n++;t.setUTCDate(t.getUTCDate()-1);}return n;}
 const api={day,rng,read,record,streak};root.OPC_VELHA_DAILY=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
