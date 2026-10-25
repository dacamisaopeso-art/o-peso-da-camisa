/* Edge entry point; SUPABASE_* are injected by Supabase, never sent to clients. */
const allowed=new Set(['https://dacamisaopeso-art.github.io','https://appassets.androidplatform.net']);
const cors=origin=>({'Access-Control-Allow-Origin':allowed.has(origin)?origin:'https://dacamisaopeso-art.github.io','Vary':'Origin','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json','Cache-Control':'no-store'});
let loaded=null;
async function initialize(){
 const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 if(!url||!key)throw Error('Serviço ainda não configurado.');
 const storage=async payload=>{const r=await fetch(url+'/rest/v1/rpc/opc_drafteam_storage',{method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({payload})});const result=await r.json();if(!r.ok)throw Error(result.message||'O servidor não aceitou a atualização.');return result;};
 const data=await storage({type:'catalog'});if(!data?.players?.length)throw Error('Base do DrafTeam ainda não instalada.');
 const service=createDrafTeamService(OPC_DRAFTEAM,data,{create:(code,document,uid)=>storage({type:'create',code,document,uid}),get:code=>storage({type:'get',code}),save:(code,version,document)=>storage({type:'save',code,version,document})});
 return {url,key,service};
}
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'',headers=cors(origin);if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST'||!allowed.has(origin))return new Response(JSON.stringify({message:'Origem ou método não permitido.'}),{status:403,headers});
 try{
  if(Number(req.headers.get('content-length')||0)>12000)throw Error('Solicitação muito grande.');const text=await req.text();if(text.length>12000)throw Error('Solicitação muito grande.');const input=JSON.parse(text);
  if(!loaded)loaded=initialize().catch(e=>{loaded=null;throw e;});const {url,key,service}=await loaded;
  const token=req.headers.get('authorization')||'';if(!/^Bearer [A-Za-z0-9_.-]+$/.test(token))throw Error('Entre novamente na sala.');
  const identity=await fetch(url+'/auth/v1/user',{headers:{apikey:key,Authorization:token}});const user=await identity.json();if(!identity.ok||!user.id)throw Error('Sessão expirada. Entre novamente.');
  return new Response(JSON.stringify(await service.request(user.id,input)),{headers});
 }catch(e){return new Response(JSON.stringify({message:e.message||'Não foi possível concluir.'}),{status:400,headers});}
});
