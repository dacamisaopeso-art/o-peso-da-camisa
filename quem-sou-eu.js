/* Original OPC game. No external game code, photographs or logos. */
(function (root) {
  'use strict';
  
  const labels = {nationality:'Nacionalidade',league:'Liga',club:'Clube',position:'Posição',age:'Idade',number:'Camisa'};
  const groups = {G:'GOL',D:'DEF',M:'MEIO',F:'ATQ'};
  const fullPositions = {GOL:'Goleiro',ZAG:'Zagueiro',LE:'Lateral esquerdo',LD:'Lateral direito',VOL:'Volante',MC:'Meia central',MEI:'Meia ofensivo',PD:'Ponta direita',PE:'Ponta esquerda',ATA:'Centroavante',DEF:'Defesa — função não informada',MEIO:'Meio — função não informada',ATQ:'Ataque — função não informada','?':'Posição não informada'};
  const countryNames = {Brazil:'Brasil',Argentina:'Argentina',England:'Inglaterra',France:'França',Germany:'Alemanha',Italy:'Itália',Spain:'Espanha',Portugal:'Portugal',Uruguay:'Uruguai',Paraguay:'Paraguai',Colombia:'Colômbia',Chile:'Chile',Ecuador:'Equador',Peru:'Peru',Venezuela:'Venezuela',Belgium:'Bélgica',Netherlands:'Países Baixos',Croatia:'Croácia',Serbia:'Sérvia',Switzerland:'Suíça',Austria:'Áustria',Denmark:'Dinamarca',Norway:'Noruega',Sweden:'Suécia',Poland:'Polônia',Ukraine:'Ucrânia',Russia:'Rússia',Morocco:'Marrocos',Senegal:'Senegal',Nigeria:'Nigéria',Ghana:'Gana',Cameroon:'Camarões',Canada:'Canadá','United States':'Estados Unidos','South Korea':'Coreia do Sul',Japan:'Japão',Turkey:'Turquia','Türkiye':'Turquia','Ivory Coast':'Costa do Marfim','Congo DR':'RD Congo',Algeria:'Argélia',Scotland:'Escócia',Wales:'País de Gales',Ireland:'Irlanda',Georgia:'Geórgia'};
  function normalize(s) { return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ø/g,'o').replace(/Ø/g,'O').replace(/ł/g,'l').replace(/ß/g,'ss').toLowerCase(); }
  function ageAt(birth, date) {
    if (!birth || !/^\d{4}-\d{2}-\d{2}$/.test(birth)) return null;
    const b = birth.split('-').map(Number), d = date.split('-').map(Number);
    return d[0]-b[0]-(d[1]<b[1] || (d[1]===b[1] && d[2]<b[2]) ? 1 : 0);
  }
  function enrich(p, updated) {
    const position = p.position || (p.group === 'G' ? 'GOL' : groups[p.group] || '?');
    return {...p, position, detailedPosition: !['DEF','MEIO','ATQ','?'].includes(position), age:ageAt(p.birth,updated)};
  }
  function fields(mode) {return Object.keys(labels).filter(f => f !== 'league' || mode === 'europe');}
  function poolFor(players,mode) {return players.filter(p=>mode==='europe' ? p.league!=='bra.1' : p.league===mode);}
  function compare(guess,target,field) {
    const g=guess[field], t=target[field];
    if (g===null || g===undefined || t===null || t===undefined || (field==='position' && (!guess.detailedPosition || !target.detailedPosition))) return {kind:'unknown',mark:'?',direction:0};
    if(g===t) return {kind:'exact',mark:'✓',direction:0};
    const numeric=field==='age'||field==='number';
    return {kind:'different',mark:numeric ? (t>g?'↑':'↓'):'≠',direction:numeric?Math.sign(t-g):0};
  }
  function blur(difficulty,used,max,ended) {return ended?0:Math.max(0,({easy:14,normal:20,hard:28}[difficulty]||20)*(1-used/max));}
  class Round {
    constructor(pool,mode,difficulty,max,random=Math.random,previous=null) {
      const choices=pool.filter(p=>p.id!==previous); this.pool=pool; this.mode=mode;this.difficulty=difficulty;this.max=max;
      this.target=(choices.length?choices:pool)[Math.floor(random()*(choices.length||pool.length))];
      if(!this.target)throw new Error('Nenhum jogador disponível.');
      this.guesses=[];this.known=new Set();this.hints=[];this.ended=false;this.won=false;
      if(difficulty==='easy'){this.reveal('nationality');this.reveal('position');}
    }
    reveal(field) {
      const value=this.target[field];
      if(value===null||value===undefined||this.known.has(field))return false;
      this.known.add(field);this.hints.push(field);return true;
    }
    hint(){
      if(this.ended||this.difficulty==='hard')return null;
      const field=fields(this.mode).find(f=>!this.known.has(f)&&this.target[f]!==null&&this.target[f]!==undefined);
      return field&&this.reveal(field)?field:null;
    }
    guess(id) {
      if(this.ended)return {error:'Esta rodada já terminou.'};
      const player=this.pool.find(p=>p.id===id);
      if(!player)return {error:'Selecione um jogador disponível neste modo.'};
      if(this.guesses.some(g=>g.player.id===id))return {error:'Você já chutou esse jogador. Escolha outro nome.'};
      const clues=fields(this.mode).map(field=>({field,...compare(player,this.target,field)}));
      clues.filter(c=>c.kind==='exact').forEach(c=>this.known.add(c.field));
      this.guesses.push({player,clues});this.won=player.id===this.target.id;this.ended=this.won||this.guesses.length>=this.max;
      return {player,clues};
    }
  }
  const api={normalize,ageAt,enrich,fields,poolFor,compare,blur,Round,fullPositions};
  if(typeof module!=='undefined')module.exports=api;
  root.OPCGuess=api;
  if(typeof document==='undefined')return;
  const $=id=>document.getElementById(id), data=root.OPC_PLAYERS;
  if(!data||!data.players.length){$('start').disabled=true;$('coverage').textContent='Não foi possível carregar a base. Atualize a página para tentar novamente.';return;}
  const players=data.players.map(p=>enrich(p,data.updated)).filter(p=>p.detailedPosition&&p.age!==null&&p.nationality&&p.club&&p.league&&p.number!==null);
  let round=null, mode='eng.1', selected=null, suggestions=[], active=-1;
  function node(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
  function display(p,f){if(p[f]===null||p[f]===undefined)return '?';if(f==='league')return data.leagues[p[f]];if(f==='nationality')return countryNames[p[f]]||p[f];return String(p[f]);}
  for(const [id,name] of [...Object.entries(data.leagues),['europe','Cinco ligas europeias combinadas']]){
    const label=node('label',undefined,'mode'), radio=node('input');radio.type='radio';radio.name='mode';radio.value=id;radio.checked=id===mode;
    label.append(radio,node('span',name));$('modes').append(label);
    radio.addEventListener('change',()=>{mode=id;$('attempts').value=id==='europe'?10:5;coverage();});
  }
  function coverage(){const p=poolFor(players,mode),clubs=new Set(p.map(x=>x.clubId));$('coverage').textContent=`${p.length.toLocaleString('pt-BR')} jogadores disponíveis · ${clubs.size} clubes · Base de ${data.updated.split('-').reverse().join('/')}. Todos os nomes da base podem ser chutados em qualquer dificuldade.`;}
  coverage();
  $('data-summary').textContent=`${new Set(players.map(p=>p.clubId)).size} clubes com atletas elegíveis e ${players.length.toLocaleString('pt-BR')} jogadores completos. Atualização: ${data.updated.split('-').reverse().join('/')}. Europa: 2026/27; Brasil: 2026. A coleta consultou ${data.clubs.length} clubes. Atletas sem qualquer categoria ou com identidade conflitante são excluídos do sorteio e da busca.`;
  for(const [id,name] of Object.entries(data.leagues)){$('club-list').append(node('p',`${name} (${data.clubs.filter(c=>c.league===id).length} clubes / ${players.filter(p=>p.league===id).length} jogadores): ${data.clubs.filter(c=>c.league===id).map(c=>c.name).join(', ')}.`,'club-group'));}
  function closeSuggestions(){suggestions=[];active=-1;$('suggestions').replaceChildren();$('suggestions').hidden=true;$('search').setAttribute('aria-expanded','false');$('search').removeAttribute('aria-activedescendant');}
  function choose(index){const p=suggestions[index];if(!p)return;selected=p.id;$('search').value=p.name;closeSuggestions();$('search').focus();}
  function search(){
    selected=null;closeSuggestions();const q=normalize($('search').value.trim());if(!q||round.ended)return;
    suggestions=round.pool.filter(p=>normalize(p.name).includes(q)&&!round.guesses.some(g=>g.player.id===p.id)).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')).slice(0,25);
    if(!suggestions.length){$('message').textContent='Nenhum nome disponível encontrado neste modo.';return;}
    $('message').textContent='';suggestions.forEach((p,i)=>{const li=node('li');li.id=`option-${i}`;li.setAttribute('role','option');li.setAttribute('aria-selected','false');const icon=node('span',p.position,'position-icon');icon.title=fullPositions[p.position];const info=node('span',p.name);info.append(node('small',p.club));li.append(icon,info);li.addEventListener('mousedown',e=>e.preventDefault());li.addEventListener('click',()=>choose(i));$('suggestions').append(li);});
    $('suggestions').hidden=false;$('search').setAttribute('aria-expanded','true');
  }
  $('search').addEventListener('input',search);
  $('search').addEventListener('keydown',e=>{
    if(e.key==='Escape'){closeSuggestions();return;}
    if(!suggestions.length)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();active=(active+(e.key==='ArrowDown'?1:-1)+suggestions.length)%suggestions.length;Array.from($('suggestions').children).forEach((li,i)=>li.setAttribute('aria-selected',String(i===active)));const li=$('suggestions').children[active];$('search').setAttribute('aria-activedescendant',li.id);li.scrollIntoView({block:'nearest'});}
    if(e.key==='Enter'&&active>=0){e.preventDefault();choose(active);}
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.autocomplete'))closeSuggestions();});
  function render(){
    $('remaining').textContent=round.max-round.guesses.length;
    $('portrait').style.filter=`blur(${blur(round.difficulty,round.guesses.length,round.max,round.ended)}px)`;
    $('shirt').textContent=round.target.number??'?';$('initials').textContent=round.target.name.split(' ').filter(Boolean).map(s=>s[0]).slice(0,3).join('');
    $('portrait').setAttribute('aria-label',round.ended?`Ilustração genérica de ${round.target.name}`:'Retrato gráfico misterioso com blur');
    $('progress').replaceChildren(...Array.from({length:round.max},(_,i)=>node('i',undefined,i<round.guesses.length?'used':'')));
    $('hints').replaceChildren(...round.hints.map(f=>node('span',`${labels[f]}: ${display(round.target,f)}`,'hint-chip')));
    $('guess').disabled=round.ended;$('search').disabled=round.ended;
    const remainingHints=fields(round.mode).some(f=>!round.known.has(f)&&round.target[f]!==null&&round.target[f]!==undefined);
    $('hint').disabled=round.ended||round.difficulty==='hard'||!remainingHints;
    $('hint').textContent=round.difficulty==='hard'?'Difícil: sem dica':remainingHints?'Revelar uma dica':'Todas as pistas já conhecidas';
    $('empty').hidden=round.guesses.length>0;$('guesses').replaceChildren();
    [...round.guesses].reverse().forEach((g,index)=>{
      const card=node('article',undefined,'guess-card');card.append(node('p',`${round.guesses.length-index}. ${g.player.name}`,'guess-name'));
      const grid=node('div',undefined,'comparison'+(round.mode==='europe'?'':' individual'));
      g.clues.forEach(c=>{const box=node('div',undefined,`clue ${c.kind}`);box.append(node('span',labels[c.field]),node('strong',`${display(g.player,c.field)} ${c.mark}`),node('em',c.kind==='unknown'?'Sem dado comparável':c.kind==='exact'?'Igual':c.direction>0?'Procure maior':c.direction<0?'Procure menor':'Diferente'));if(c.field==='position')box.title=fullPositions[g.player.position];grid.append(box);});card.append(grid);$('guesses').append(card);
    });
    $('result').hidden=!round.ended;
    if(round.ended){closeSuggestions();const t=round.target;$('result').replaceChildren(node('h3',round.won?'Você leu o jogo!':'Fim de jogo.'),node('p',t.name),node('p',fields(round.mode).map(f=>`${labels[f]}: ${display(t,f)}`).join(' · ')));const source=node('a','Conferir ficha do jogador ↗');source.href=t.source;source.target='_blank';source.rel='noopener noreferrer';$('result').append(source);$('result').focus();}
  }
  function start(previous=null){
    round=new Round(poolFor(players,mode),mode,$('difficulty').value,Number($('attempts').value),Math.random,previous);
    selected=null;closeSuggestions();$('search').value='';$('message').textContent='';$('setup').hidden=true;$('game').hidden=false;
    $('round-mode').textContent=`${mode==='europe'?'EUROPA / 5 LIGAS':data.leagues[mode]} · ${{easy:'FÁCIL',normal:'NORMAL',hard:'DIFÍCIL'}[round.difficulty]}`;
    render();$('search').focus();
  }
  $('config').addEventListener('submit',e=>{e.preventDefault();if($('config').reportValidity())start();});
  $('guess-form').addEventListener('submit',e=>{e.preventDefault();if(!selected){$('message').textContent='Selecione o jogador na lista antes de chutar.';return;}const outcome=round.guess(selected);if(outcome.error){$('message').textContent=outcome.error;return;}selected=null;$('search').value='';closeSuggestions();$('message').textContent=round.won?'Resposta correta!':round.ended?'As tentativas terminaram. Confira a resposta abaixo.':'Chute registrado. Compare as pistas e tente outro nome.';render();if(!round.ended)$('search').focus();});
  $('hint').addEventListener('click',()=>{const field=round.hint();$('message').textContent=field?'Uma informação ainda não conhecida foi revelada. A dica não consome tentativa.':'Não há novas dicas disponíveis.';render();});
  $('restart').addEventListener('click',()=>start(round.target.id));
  $('change').addEventListener('click',()=>{closeSuggestions();$('game').hidden=true;$('setup').hidden=false;coverage();$('difficulty').focus();});
})(typeof globalThis!=='undefined'?globalThis:this);
