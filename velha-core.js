/* Motor original OPC. Mesmas regras para partidas locais e integração online. */
(function(root){
 'use strict';
 const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const winner=cells=>{for(const l of lines){const p=cells[l[0]]?.owner;if(p!==undefined&&l.every(i=>cells[i]?.owner===p))return {owner:p,line:l};}return null;};
 function eligible(player,row,col){return player.categories.includes(row)&&player.categories.includes(col);}
 function answers(data,board,cell){return data.players.filter(p=>p.modes.includes(board.mode)&&eligible(p,board.rows[Math.floor(cell/3)],board.cols[cell%3]));}
 function chooseBoard(data,mode,difficulty,previous=null,rng=Math.random){const old=data.boards.find(b=>b.id===previous);const options=data.boards.filter(b=>b.mode===mode&&b.difficulty===difficulty&&b.id!==previous&&(!old||(b.rows.every((c,i)=>c!==old.rows[i])&&b.cols.every((c,i)=>c!==old.cols[i]))));if(!options.length)throw Error('Ainda não há grade auditada suficiente para esta combinação.');const fresh=old?options.filter(b=>[...b.rows,...b.cols].every(c=>![...old.rows,...old.cols].includes(c))):options;const pool=fresh.length?fresh:options;return pool[Math.floor(rng()*pool.length)];}
 function start(data,config,rng=Math.random){const board=chooseBoard(data,config.mode,config.difficulty,null,rng);return {config:{format:'wins',...config},boardId:board.id,round:1,score:[0,0],turn:0,cells:Array(9).fill(null),used:[],steals:[0,0],moves:0,roundEnded:false,matchEnded:false,matchWinner:null,result:null,version:0};}
 function finishSeries(s){if(s.roundEnded&&((s.config.format==='rounds'&&s.round>=s.config.target)||(s.config.format!=='rounds'&&Math.max(...s.score)>=s.config.target))){s.matchEnded=true;s.matchWinner=s.score[0]===s.score[1]?null:s.score[0]>s.score[1]?0:1;}return s;}
 function apply(data,state,cell,playerId,actor=state.turn){
  if(state.matchEnded||state.roundEnded)return {ok:false,error:'Esta rodada terminou.'};
  if(actor!==state.turn)return {ok:false,error:'Aguarde sua vez.'};
  if(!Number.isInteger(cell)||cell<0||cell>8)return {ok:false,error:'Escolha uma casa da grade.'};
  const occupied=state.cells[cell];
  if(occupied&&(occupied.owner===actor||!state.config.steal||state.steals[actor]>=2))return {ok:false,error:'Essa casa não pode ser usada agora.'};
  const board=data.boards.find(b=>b.id===state.boardId),p=data.players.find(p=>p.id===playerId);
  if(!p||!p.modes.includes(board.mode)||state.used.includes(playerId))return {ok:false,error:'Escolha um nome disponível e ainda não utilizado.'};
  const next=structuredClone(state);next.version++;next.moves++;
  const correct=eligible(p,board.rows[Math.floor(cell/3)],board.cols[cell%3]);
  if(correct){next.cells[cell]={owner:actor,playerId};next.used.push(playerId);if(occupied)next.steals[actor]++;}
  const win=winner(next.cells);if(win){next.roundEnded=true;next.score[actor]++;next.result={winner:actor,line:win.line};}
  else if(next.cells.every(Boolean)||next.moves>=40){next.roundEnded=true;next.result={winner:null,line:[]};}
  finishSeries(next);next.turn=1-actor;
  return {ok:true,state:next,correct,message:correct?'Cruzamento confirmado!':'Este nome não consta na base para as duas categorias. A vez passou para o adversário.'};
 }
 function pass(state,actor=state.turn){if(state.roundEnded||state.matchEnded||actor!==state.turn)return {ok:false,error:'Não é sua vez de passar.'};const next=structuredClone(state);next.turn=1-actor;next.moves++;next.version++;if(next.moves>=40){next.roundEnded=true;next.result={winner:null,line:[]};}finishSeries(next);return {ok:true,state:next,message:'Vez passada para o adversário.'};}
 function nextRound(data,state,rng=Math.random){if(!state.roundEnded||state.matchEnded)throw Error('Não é possível iniciar outra rodada.');const b=chooseBoard(data,state.config.mode,state.config.difficulty,state.boardId,rng);return {...structuredClone(state),boardId:b.id,round:state.round+1,turn:state.round%2,cells:Array(9).fill(null),used:[],steals:[0,0],moves:0,roundEnded:false,result:null,version:state.version+1};}
 function moves(data,state){const b=data.boards.find(b=>b.id===state.boardId),m=[];for(let cell=0;cell<9;cell++){const x=state.cells[cell];if(x&&(x.owner===state.turn||!state.config.steal||state.steals[state.turn]>=2))continue;for(const p of answers(data,b,cell))if(!state.used.includes(p.id))m.push({cell,playerId:p.id});}return m;}
 function bot(data,state,rng=Math.random){const m=moves(data,state);if(!m.length)return null;const actor=state.turn;const score=move=>{const after=apply(data,state,move.cell,move.playerId).state;if(after.result?.winner===actor)return 1000;let value=move.cell===4?4:[0,2,6,8].includes(move.cell)?2:0;for(const l of lines){const own=l.filter(i=>after.cells[i]?.owner===actor).length,opp=l.filter(i=>after.cells[i]?.owner===1-actor).length;if(!opp)value+=own*own;if(!own&&opp===2)value-=40;}if(state.cells[move.cell]?.owner===1-actor)value+=8;return value;};const ranked=m.map(x=>({...x,score:score(x)}));const max=Math.max(...ranked.map(x=>x.score));const best=ranked.filter(x=>x.score===max);return best[Math.floor(rng()*best.length)];}
 const api={lines,normalize,winner,eligible,answers,chooseBoard,start,apply,nextRound,moves,bot,pass};if(typeof module!=='undefined')module.exports=api;root.OPC_VELHA_CORE=api;
})(typeof globalThis!=='undefined'?globalThis:this);
