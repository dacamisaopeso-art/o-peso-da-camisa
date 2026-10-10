(function(){
 'use strict';
 const data=globalThis.OPC_VELHA_DATA,core=globalThis.OPC_VELHA_CORE,$=id=>document.getElementById(id);
 const cats=new Map(data.categories.map(c=>[c.id,c])),players=new Map(data.players.map(p=>[p.id,p]));
 const nameCounts=new Map(),searchNames=new Map(data.players.map(p=>[p.id,core.normalize(p.name)]));for(const p of data.players){const key=core.normalize(p.name);nameCounts.set(key,(nameCounts.get(key)||0)+1);}
 const detailCounts=new Map();for(const p of data.players){const key=core.normalize(p.name)+'|'+core.playerDetails(p);detailCounts.set(key,(detailCounts.get(key)||0)+1);}
 const details=p=>nameCounts.get(core.normalize(p.name))>1?core.playerDetails(p)+(detailCounts.get(core.normalize(p.name)+'|'+core.playerDetails(p))>1?' · '+p.birth.split('-').reverse().join('/'):''):'';
 const display=p=>p.name+(details(p)?' · '+details(p):'');
 let state=null,names=['Jogador 1','Bot OPC'],opponent='bot',cell=null,selected=null,list=[],active=-1,timer=null,epoch=0,online=null;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const svg=kind=>'<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3">'+(kind==='boot'?'<path d="M13 15h18v19l20 10v9H8V40h5z"/><path d="M31 28l-9 5m15 3-8 5M8 48h43"/>':kind==='ball'?'<circle cx="32" cy="29" r="20"/><path d="m32 17 10 8-4 12H26l-4-12zM22 25l-9-4m25 16 9 7m-21-7-9 7m25-19 9-4M32 49v7H17h30"/>':kind==='shirt'?'<path d="m22 10-14 8 6 13 8-4v27h24V27l8 4 6-13-14-8-10 5z"/>':kind==='cup'?'<path d="M20 9h24v17c0 12-24 12-24 0zM20 13H10v8c0 9 9 10 12 10m22-18h10v8c0 9-9 10-12 10M32 36v15m-13 5h26m-23-5h20"/>':'<circle cx="32" cy="32" r="23"/><ellipse cx="32" cy="32" rx="10" ry="23"/><path d="M10 25h44M10 39h44"/>')+'</svg>';
 function shirt(owner){const mark=owner===0?'<path class="emblem" d="M27 24h18v10c0 9-9 14-9 14s-9-5-9-14z"/>':owner===1?'<path class="emblem" d="m36 23 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z"/>':'<path class="emblem" d="M36 27v16m-8-8h16"/>';return '<svg class="kit '+(owner===null?'kit-empty':owner===0?'kit-peso':'kit-tradicao')+'" viewBox="0 0 72 72" aria-hidden="true"><path class="fabric" d="m22 9-17 9 9 15 8-4v34h28V29l8 4 9-15-17-9-14 7z"/><path class="collar" d="m26 10 10 7 10-7"/>'+mark+'</svg>';}
 function icon(c){return svg(c.kind==='person'?'shirt':c.kind);}
 function category(c){return '<div class="category">'+icon(c)+'<strong>'+escape(c.kind==='person'?'Jogou com '+c.label:c.label)+'</strong><small>'+escape(c.kind==='person'?'Clube ou seleção':c.detail)+'</small></div>';}
 function isOnline(){return ['create','join','queue'].includes(opponent);}
 function myTurn(){return !isOnline()||online?.seat===state.turn;}
 function available(){return data.players.filter(p=>p.modes.includes(state.config.mode)&&!state.used.includes(p.id));}
 function save(){if(isOnline())return;try{localStorage.setItem('opc-velha-save',JSON.stringify({version:data.version,state,names,opponent}));}catch{}}
 function refreshSetup(){const mode=$('mode').value,diff=$('difficulty').value;const n=data.players.filter(p=>p.modes.includes(mode)).length,b=data.boards.filter(b=>b.mode===mode&&b.difficulty===diff).length;
  $('coverage').textContent=n+' jogadores com histórico conferido · '+b+' grades auditadas neste modo. Atuais e históricos; passagens coletadas em outubro de 2026 e títulos até 2025. Cobertura parcial.';
  const type=$('opponent').value,net=['create','join','queue'].includes(type),ready=globalThis.OPC_VELHA_ONLINE.ready();
  $('room-label').hidden=type!=='join';$('online-note').hidden=!net;$('online-note').textContent=ready?'Partida conectada: as jogadas são validadas pelo serviço online.':'As partidas online ainda aguardam a conexão do serviço. Contra o bot e no mesmo aparelho já estão disponíveis.';
  for(const id of ['mode','difficulty','target','series','steal'])$(id).disabled=type==='queue'||type==='join';
  if(type==='queue'){$('mode').value='europe';$('difficulty').value='normal';$('target').value='3';$('series').value='wins';$('steal').checked=false;}
  $('target-caption').textContent=$('series').value==='rounds'?'Quantidade de rodadas':'Vitórias necessárias';
  for(const option of $('target').options)option.textContent=option.value+' '+($('series').value==='rounds'?(option.value==='1'?'rodada':'rodadas'):(option.value==='1'?'vitória':'vitórias'));
  $('name2-label').hidden=type!=='local';$('start').disabled=!b||(net&&!ready);$('setup-error').textContent=b?'':'Esta seleção ainda não possui grades suficientes.';
 }
 function stop(){epoch++;clearTimeout(timer);timer=null;}
 function render(){const b=data.boards.find(b=>b.id===state.boardId);if(!b)throw Error('Grade não encontrada.');
  $('setup').hidden=true;$('game').hidden=false;$('round-label').textContent=data.modes[state.config.mode]+' / '+(state.config.difficulty==='hard'?'DIFÍCIL':'NORMAL')+' / RODADA '+state.round;
  $('p1').textContent=names[0];$('p2').textContent=names[1];$('score1').textContent=state.score[0];$('score2').textContent=state.score[1];$('series-label').textContent=state.config.format==='rounds'?state.config.target+' rodadas':'Primeiro a '+state.config.target+' vitórias';
  $('turn-label').textContent=isOnline()&&online?.abandoned?'Partida encerrada':state.matchEnded?(state.matchWinner===null?'Partida empatada':names[state.matchWinner]+' venceu a partida!'):state.roundEnded?(state.result.winner===null?'Rodada empatada':names[state.result.winner]+(state.matchEnded?' venceu a partida!':' venceu a rodada!')):'Vez de '+names[state.turn];
  let html='<div class="corner" aria-hidden="true">OPC<small>3 EM LINHA</small></div>'+b.cols.map(c=>category(cats.get(c))).join('');
  for(let row=0;row<3;row++){html+=category(cats.get(b.rows[row]));for(let col=0;col<3;col++){const i=row*3+col,c=state.cells[i],p=c&&players.get(c.playerId);const can=!state.roundEnded&&myTurn()&&!(opponent==='bot'&&state.turn===1)&&(!c||(state.config.steal&&c.owner!==state.turn&&state.steals[state.turn]<2));
   const label=cats.get(b.rows[row]).label+' + '+cats.get(b.cols[col]).label+(p?' · '+display(p)+' · '+names[c.owner]:' · Casa vazia');
   html+='<button type="button" data-cell="'+i+'" class="cell '+(c?(c.owner===0?'x':'o'):'')+(state.result?.line.includes(i)?' win':'')+'" aria-label="'+escape(label)+'"'+(!can&&!state.roundEnded?' disabled':'')+'>'+(p?shirt(c.owner)+'<span class="side-label">'+(c.owner===0?'PESO':'TRADIÇÃO')+'</span><span class="name">'+escape(p.name)+'</span>'+(details(p)?'<small class="player-meta" title="'+(p.death?'Idade ao falecer':'Idade atual')+'">'+escape(details(p))+'</small>':''):shirt(null)+'<span class="empty">ESCOLHER JOGADOR</span>')+'</button>';
  }}$('board').innerHTML=html;
  $('next').hidden=!state.roundEnded||state.matchEnded;$('rematch').hidden=!state.matchEnded||isOnline();$('pass').hidden=state.roundEnded;$('pass').disabled=!myTurn()||(opponent==='bot'&&state.turn===1);
  $('steal-status').textContent=state.config.steal?'Roubos restantes: '+names[0]+' '+(2-state.steals[0])+' · '+names[1]+' '+(2-state.steals[1]):'Roubo de casas desativado nesta partida.';
  $('room-status').hidden=!isOnline();if(isOnline())$('room-status').textContent=online?.status||'';
  save();scheduleBot();
 }
 function scheduleBot(){clearTimeout(timer);if(opponent!=='bot'||state.roundEnded||state.turn!==1)return;const tag=epoch;timer=setTimeout(()=>{if(tag!==epoch||!state||state.roundEnded||state.turn!==1)return;const move=core.bot(data,state);const r=move?core.apply(data,state,move.cell,move.playerId):core.pass(state);if(r.ok){state=r.state;$('feedback').textContent=move?'Bot OPC escolheu '+players.get(move.playerId).name+'.':'O bot passou a vez.';render();}},850);}
 function resetSearch(){selected=null;active=-1;list=[];$('search').value='';$('suggestions').replaceChildren();$('confirm').disabled=true;$('search').setAttribute('aria-expanded','false');$('search').removeAttribute('aria-activedescendant');$('choice-error').textContent='';}
 function openCell(i){cell=i;const b=data.boards.find(b=>b.id===state.boardId),a=cats.get(b.rows[Math.floor(i/3)]),z=cats.get(b.cols[i%3]);$('cell-title').textContent=a.label+' + '+z.label;resetSearch();$('solutions').hidden=!state.roundEnded;$('guess-form').hidden=state.roundEnded;
  if(state.roundEnded){const answer=core.answers(data,b,i);$('solutions').innerHTML='<div class="dialog-top"><h2>'+escape(a.label+' + '+z.label)+'</h2><button type="button" id="close-solutions" aria-label="Fechar respostas">×</button></div><p>Respostas verificadas desta casa ('+answer.length+').</p>'+answer.map(p=>'<div class="source-row"><strong>'+escape(p.name)+'</strong>'+'<small>'+[a,z].map(c=>'<a href="'+escape(p.evidence?.[c.id]?.[0]||p.sources[0])+'" target="_blank" rel="noopener noreferrer">Comprovação: '+escape(c.label)+'</a>').join(' · ')+'</small><small>'+p.sources.map((s,j)=>'<a href="'+escape(s)+'" target="_blank" rel="noopener noreferrer">Ficha '+(j+1)+'</a>').join(' · ')+'</small></div>').join('');$('close-solutions').onclick=()=>$('choice').close();}
  else $('cell-note').textContent=state.cells[i]?'Roubo: use outro nome correto. Esta ação gastará um dos seus roubos.':'O nome precisa atender às duas categorias. Um erro passa a vez.';
  $('choice').showModal();if(!state.roundEnded)$('search').focus();
 }
 $('board').addEventListener('click',e=>{const btn=e.target.closest('[data-cell]');if(btn&&!btn.disabled)openCell(Number(btn.dataset.cell));});
 $('search').addEventListener('input',()=>{selected=null;active=-1;$('confirm').disabled=true;const q=core.normalize($('search').value.trim());list=q?available().filter(p=>searchNames.get(p.id).includes(q)).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')).slice(0,30):[];
  $('suggestions').innerHTML=list.map((p,i)=>'<li role="option" aria-selected="false" tabindex="-1" id="candidate-'+i+'" data-option="'+i+'"><span>'+escape(display(p))+'<small>'+escape(cats.get('country:'+p.nationality)?.label||p.nationality)+'</small></span></li>').join('');$('search').setAttribute('aria-expanded',String(list.length>0));$('search').removeAttribute('aria-activedescendant');});
 function select(i){const p=list[i];if(!p)return;selected=p.id;list=[];active=-1;$('search').value=display(p);$('suggestions').replaceChildren();$('search').setAttribute('aria-expanded','false');$('search').removeAttribute('aria-activedescendant');$('confirm').disabled=false;}
 $('suggestions').addEventListener('click',e=>{const li=e.target.closest('[data-option]');if(li)select(Number(li.dataset.option));});
 $('search').addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp'].includes(e.key)&&list.length){e.preventDefault();active=(active+(e.key==='ArrowDown'?1:-1)+list.length)%list.length;for(const li of $('suggestions').children){const current=Number(li.dataset.option)===active;li.classList.toggle('active',current);li.setAttribute('aria-selected',String(current));if(current)li.scrollIntoView({block:'nearest'});}$('search').setAttribute('aria-activedescendant','candidate-'+active);}else if(e.key==='Enter'&&list.length&&selected===null){e.preventDefault();select(active<0?0:active);}});
 $('cancel').onclick=()=>$('choice').close();
 async function action(type,payload={}){if(isOnline()){try{const result=await globalThis.OPC_VELHA_ONLINE.action(type,payload,state.version);receive(result);}catch(e){$('feedback').textContent=e.message;}return;}
  let r;if(type==='move')r=core.apply(data,state,payload.cell,payload.playerId);else if(type==='pass')r=core.pass(state);else if(type==='next'){stop();r={ok:true,state:core.nextRound(data,state),message:'Nova grade. As duas categorias mudaram.'};}
  if(!r.ok){$('feedback').textContent=r.error;return;}state=r.state;$('feedback').textContent=r.message;render();}
 $('guess-form').addEventListener('submit',async e=>{e.preventDefault();if(!selected){$('choice-error').textContent='Selecione um nome da lista.';return;}const id=selected;selected=null;$('confirm').disabled=true;$('choice').close();await action('move',{cell,playerId:id});});
 $('pass').onclick=()=>action('pass');$('next').onclick=()=>action('next');
 $('rematch').onclick=()=>{stop();state=core.start(data,state.config);$('feedback').textContent='Uma nova partida começou.';render();};
 function receive(result){online={...online,...result};if(result.catalogVersion!==data.version)throw Error('A base online foi atualizada. Recarregue o jogo.');if(result.state){$('lobby').hidden=true;state=result.state;names=result.names;render();}else if(online?.code){$('config').hidden=true;$('lobby').hidden=false;$('lobby-code').textContent='Sala '+online.code;$('lobby-status').textContent=online.status;}$('feedback').textContent=result.message||'';}
 $('config').addEventListener('submit',async e=>{e.preventDefault();stop();opponent=$('opponent').value;names=[$('name1').value.trim()||'Jogador 1',opponent==='bot'?'Bot OPC':$('name2').value.trim()||'Jogador 2'];
  const config={mode:$('mode').value,difficulty:$('difficulty').value,format:$('series').value,target:Number($('target').value),steal:$('steal').checked};
  if(isOnline()){try{$('start').disabled=true;online=await globalThis.OPC_VELHA_ONLINE.connect({type:opponent,config,name:names[0],code:$('room-code').value.trim().toUpperCase()},receive);receive(online);}catch(e){$('setup-error').textContent=e.message;}finally{refreshSetup();}return;}
  try{state=core.start(data,config);$('feedback').textContent='Escolha uma casa e encontre o nome que atende às duas categorias.';render();}catch(e){$('setup-error').textContent=e.message;}});
 $('leave').onclick=()=>{stop();globalThis.OPC_VELHA_ONLINE.disconnect();online=null;state=null;$('game').hidden=true;$('setup').hidden=false;$('lobby').hidden=true;$('config').hidden=false;refreshSetup();};
 $('cancel-online').onclick=()=>{stop();globalThis.OPC_VELHA_ONLINE.disconnect();online=null;$('lobby').hidden=true;$('config').hidden=false;refreshSetup();};
 for(const id of ['mode','difficulty','opponent','series'])$(id).addEventListener('change',refreshSetup);
 try{const saved=JSON.parse(localStorage.getItem('opc-velha-save'));if(saved?.version===data.version&&data.boards.some(b=>b.id===saved.state?.boardId)&&!saved.state.matchEnded){$('resume').hidden=false;$('resume').onclick=()=>{stop();state=saved.state;names=saved.names;opponent=saved.opponent;render();};}}catch{}
 $('data-summary').textContent='Base de '+data.updated.split('-').reverse().join('/')+': '+data.players.length+' jogadores, '+data.boards.length+' grades auditadas. Categorias de títulos/prêmios nesta versão cobrem fatos até 2025; a expansão depende de conferência adicional.';
 refreshSetup();
})();
