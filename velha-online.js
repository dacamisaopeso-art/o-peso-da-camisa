/* Adaptador REST Supabase. Servidor valida turnos, critérios e placar. */
(function(root){
 'use strict';
 let token=null,refreshToken=null,expires=0,room=null,timer=null,callback=null,generation=0;
 const config=()=>root.OPC_VELHA_ONLINE_CONFIG||{},ready=()=>/^https:\/\/[^/]+\.supabase\.co\/?$/.test(config().url)&&!!config().publicKey;
 async function request(path,body,authenticated=true){const c=config(),headers={'apikey':c.publicKey,'Content-Type':'application/json'};if(authenticated)headers.Authorization='Bearer '+token;const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);try{const res=await fetch(c.url.replace(/\/$/,'')+path,{method:'POST',headers,body:JSON.stringify(body),signal:controller.signal});const result=await res.json();if(!res.ok)throw Error(result.message||result.msg||'O serviço não aceitou a solicitação.');return result;}catch(e){if(e.name==='AbortError')throw Error('A conexão demorou demais. Tente novamente.');throw e;}finally{clearTimeout(timeout);}}
 async function auth(){if(token&&Date.now()<expires-60000)return;const session=refreshToken?await request('/auth/v1/token?grant_type=refresh_token',{refresh_token:refreshToken},false):await request('/auth/v1/signup',{},false);token=session.access_token;refreshToken=session.refresh_token;expires=Date.now()+(session.expires_in||3600)*1000;if(!token)throw Error('Ative o acesso anônimo no projeto online.');}
 async function rpc(payload){await auth();return request('/rest/v1/rpc/opc_velha',{payload});}
 async function poll(tag){if(tag!==generation||!room)return;try{const result=await rpc({type:'get',code:room});if(tag!==generation)return;callback?.(result);}catch(e){if(tag===generation)callback?.({catalogVersion:root.OPC_VELHA_DATA.version,status:'Conexão interrompida. Tentando novamente…',message:e.message});}if(tag===generation)timer=setTimeout(()=>poll(tag),1800);}
 async function connect(input,onChange){if(!ready())throw Error('O serviço online ainda não foi conectado.');disconnect();const tag=generation;callback=onChange;const result=await rpc({...input,catalogVersion:root.OPC_VELHA_DATA.version});if(tag!==generation)throw Error('Solicitação cancelada.');room=result.code;timer=setTimeout(()=>poll(tag),1800);return result;}
 async function action(type,payload,version){if(!room)throw Error('Entre em uma sala antes de jogar.');return rpc({type,code:room,expectedVersion:version,...payload});}
 function disconnect(){generation++;clearTimeout(timer);timer=null;if(room&&token)request('/rest/v1/rpc/opc_velha',{payload:{type:'leave',code:room}}).catch(()=>{});room=null;callback=null;}
 root.OPC_VELHA_ONLINE={ready,connect,action,disconnect};
})(globalThis);
