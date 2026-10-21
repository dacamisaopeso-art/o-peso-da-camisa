(function(root){'use strict';
const key='opc-preferences-v1';let raw={};try{raw=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{}
function normalize(value){return {text:['normal','large','extra'].includes(value?.text)?value.text:'normal',reduceMotion:value?.reduceMotion===true,saveData:typeof value?.saveData==='boolean'?value.saveData:root.navigator?.connection?.saveData===true};}
let preferences=normalize(raw);const economyApplied=preferences.saveData;
function apply(){document.documentElement.dataset.opcText=preferences.text;document.documentElement.classList.toggle('opc-reduce-motion',preferences.reduceMotion);document.documentElement.classList.add('opc-feedback-symbols');root.dispatchEvent(new Event('opc-preferences'));}
const api={get:()=>({...preferences}),reducedMotion:()=>preferences.reduceMotion||!!root.matchMedia?.('(prefers-reduced-motion: reduce)').matches,economyApplied,save(value){preferences=normalize(value);let saved=true;try{localStorage.setItem(key,JSON.stringify(preferences));}catch{saved=false;}apply();return saved;}};
root.OPC_PREFS=api;apply();
if(economyApplied){
 document.documentElement.classList.add('opc-save-data');
 const placeholder='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" rx="16" fill="#101417"/><text x="60" y="68" text-anchor="middle" font-family="Arial" font-size="27" fill="#d8a83e">OPC</text></svg>');
 document.addEventListener('error',event=>{const image=event.target;if(image?.tagName!=='IMG')return;try{const url=new URL(image.currentSrc||image.src,location.href);if(/^https?:$/.test(url.protocol)&&url.origin!==location.origin){image.onerror=null;image.srcset='';image.src=placeholder;}}catch{}},true);
 const policy=document.createElement('meta');policy.httpEquiv='Content-Security-Policy';policy.content="img-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; media-src 'self' data: blob:";document.head.append(policy);
}
})(globalThis);
