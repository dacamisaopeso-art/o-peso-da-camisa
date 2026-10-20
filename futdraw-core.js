/* Regras originais OPC. Compartilhadas pelos testes e pelo treino. */
(function(root){
 'use strict';
 const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 const letters=s=>Array.from(s).filter(c=>normalize(c).length>0);
 const hintLimit=s=>Math.min(4,1+Math.floor(Math.max(0,letters(s).length-3)/4));
 function mask(s,hints){let i=0;return Array.from(s).map((c,n)=>{if(!normalize(c))return c;const reveal=hints>=2&&(n===0||s[n-1]===' ')||hints>=3&&i===Math.floor(letters(s).length/2)||hints>=4&&i===Math.floor(letters(s).length/3);i++;return reveal?c.toUpperCase():'_';}).join(' ');}
 function score({remaining,duration,order=0,hints=0}){return Math.floor((500+500*Math.max(0,Math.min(1,remaining/duration))+Math.max(0,150-order*25))*Math.max(.45,1-hints*.15));}
 function options(bank,{mode,categories},used=[],random=Math.random){return bank.filter(w=>w.modes.includes(mode)&&categories.includes(w.category)&&!used.includes(w.id)).map(w=>({w,key:random()})).sort((a,b)=>a.key-b.key).slice(0,3).map(x=>x.w);}
 function invitation(base,code){if(!/^[a-f0-9]{6}$/i.test(code))throw Error('Código de convite inválido.');const url=new URL('futdraw.html',base);url.searchParams.set('sala',code.toUpperCase());return url.href;}
 const api={normalize,hintLimit,mask,score,options,invitation};root.OPC_FUTDRAW_CORE=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(globalThis);
