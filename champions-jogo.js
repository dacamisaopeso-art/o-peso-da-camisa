/* Montagem do time compartilhada visualmente com Desafio das Lendas; competição própria. */
let cup=null,cupTimer=null,cupTick=null,cupTickDelay=0;
const cupStages=['Playoffs','Oitavas de final','Quartas de final','Semifinal','Final'];
const difficultyBonus={easy:-6,normal:0,hard:6},speedFactor={slow:2,normal:1,fast:.35};
const matchDelay=base=>window.matchMedia('(prefers-reduced-motion: reduce)').matches?60:Math.max(40,Math.round(base*speedFactor[el('matchSpeed').value]));
function scheduleCup(fn,base){clearInterval(cupTimer);cupTick=fn;cupTickDelay=base;cupTimer=setInterval(fn,matchDelay(base))}
function changeSpeed(){const control=el('cup-speed');if(control)control.value=el('matchSpeed').value;if(cupTimer&&cupTick)scheduleCup(cupTick,cupTickDelay)}
function cancelCup(){clearInterval(cupTimer);cupTimer=null;cupTick=null;cup=null}
const cupFlag=t=>t.clubId?'<img class="cup-flag" src="'+championsBadges[t.clubId]+'" alt="">':'⭐';
const cupName=t=>t.user?'Seu esquadrão':t.country+' '+t.year;
function cupScorer(t,attempt){const players=(t.user?team:t.players).filter(p=>p[0]!=='GOL');return players[(attempt??rand(players.length))%players.length][1]}
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cupRecord(r){const {a,b,ga,gb}=r;a.j++;b.j++;a.gf+=ga;a.ga+=gb;b.gf+=gb;b.ga+=ga;b.awayGoals+=gb;a.opponents.push(b);b.opponents.push(a);if(ga===gb){a.e++;b.e++;a.pts++;b.pts++}else{const w=ga>gb?a:b,l=ga>gb?b:a;w.v++;l.d++;w.pts+=3;if(w===b)b.awayWins++}}
function cupScore(r){return cupFlag(r.a)+safe(cupName(r.a))+' <b>'+r.ga+' × '+r.gb+'</b> '+safe(cupName(r.b))+cupFlag(r.b)+(r.aggregate?' <small>Agregado: '+r.aggregate.join(' × ')+'</small>':'')+(r.extra?' <small>Após prorrogação</small>':'')+(r.pen?' <small>Pênaltis: '+r.pen.join(' × ')+'</small>':'')}
function cupTables(){
 const final=cup.round===8;
 el('league-table').innerHTML='<table><thead><tr><th>Clube</th><th>POS</th><th>PTS</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th><th>GP</th></tr></thead><tbody>'+ChampionsFormat.standings(cup.teams).map((t,i)=>'<tr class="'+(t.user?'your-team ':'')+(i<8?'qualified':i<24?'playoff-zone':'')+'"><th scope="row">'+cupFlag(t)+safe(cupName(t))+'<small>'+(i<8?(final?'Oitavas':'Zona de oitavas'):i<24?(final?'Playoffs':'Zona de playoffs'):(final?'Eliminado':'Fora da classificação'))+'</small></th><td>'+(i+1)+'</td><td>'+t.pts+'</td><td>'+t.j+'</td><td>'+t.v+'</td><td>'+t.e+'</td><td>'+t.d+'</td><td>'+(t.gf-t.ga)+'</td><td>'+t.gf+'</td></tr>').join('')+'</tbody></table>';
 const own=cup.teams.find(t=>t.user);
 el('your-fixtures').innerHTML=cup.schedule.map((pairs,i)=>{const [a,b]=pairs.find(p=>p.includes(own));return '<div class="cup-result">Rodada '+(i+1)+' • '+cupFlag(a)+safe(cupName(a))+' × '+safe(cupName(b))+cupFlag(b)+' <small>'+(a.user?'Em casa':'Fora de casa')+(i<cup.round?' • Concluída':'')+'</small></div>'}).join('');
}
function cupHistory(){el('cup-history').innerHTML=cup.history.map(h=>'<details '+(h===cup.history.at(-1)?'open':'')+'><summary>'+h.title+'</summary>'+h.results.map(r=>'<div class="cup-result '+(r.a.user||r.b.user?'your-result':'')+'">'+cupScore(r)+'</div>').join('')+'</details>').join('')}
function cupFinish(text){cup.over=true;cup.busy=false;el('headline').textContent=text;el('cup-next').hidden=true;el('cup-stage').textContent='Campanha encerrada';el('cup-progress').textContent='Monte outro time para viver uma nova noite de Champions.'}
function cupPairs(){return cup.round<8?cup.schedule[cup.round]:cup.ties.map(t=>cup.stage===4||cup.leg===1?[t.a,t.b]:[t.b,t.a])}
function cupPrepare(){
 cup.busy=false;if(cup.over)return;
 const league=cup.round<8,title=league?'Fase de liga • Rodada '+(cup.round+1)+'/8':cupStages[cup.stage]+(cup.stage<4?' • '+(cup.leg===0?'Ida':'Volta'):'');
 el('cup-stage').textContent=title;
 el('cup-progress').textContent=league?'36 clubes, oito adversários diferentes, quatro jogos em casa e quatro fora. Os oito primeiros avançam às oitavas; do 9º ao 24º disputam os playoffs.':cup.stage===4?'Final em campo neutro e jogo único. Empate leva à prorrogação e, se necessário, aos pênaltis.':'Ida e volta. A soma dos gols decide a classificação, sem vantagem por gols fora. Empate no agregado leva à prorrogação e aos pênaltis.';
 const btn=el('cup-next'),pair=cupPairs().find(p=>p.some(t=>t.user));btn.disabled=false;btn.textContent=pair?'▶ Jogar '+(league?'rodada '+(cup.round+1):title.toLowerCase()):'▶ Acompanhar '+title.toLowerCase();
 if(!pair){el('cup-clock').textContent='CLASSIFICADO DIRETAMENTE';el('cup-home').textContent='Seu esquadrão';el('cup-away').textContent='Aguardando as oitavas';el('cup-score').textContent='★';el('cup-aggregate').textContent='';el('cup-feed').innerHTML='<p>Seu time está entre os oito primeiros. Acompanhe os playoffs para descobrir seu adversário.</p>'}
 else if(!cup.history.length){el('cup-home').innerHTML=cupFlag(pair[0])+safe(cupName(pair[0]));el('cup-away').innerHTML=cupFlag(pair[1])+safe(cupName(pair[1]));el('cup-score').textContent='×';el('cup-clock').textContent='PRÉ-JOGO';el('cup-feed').innerHTML='<p>Seu esquadrão está pronto para a primeira noite de Champions.</p>'}
}
function play(){
 if(team.length!==11||cup)return;
 const candidates=ChampionsFormat.shuffle(squads),selected=[],used=new Set(),associations={};
 for(const s of candidates){const association=championsClubs[s.clubId].association;if(used.has(s.clubId)||(associations[association]||0)>=4)continue;selected.push(s);used.add(s.clubId);associations[association]=(associations[association]||0)+1;if(selected.length===35)break}
 if(selected.length!==35){el('headline').textContent='Não foi possível completar os 36 clubes. Tente novamente.';return}
 const user={country:'',user:true,strength:team.reduce((sum,p)=>sum+adjusted(p),0)/11,association:'',clubId:null};
 const entrants=[user,...selected.map(s=>({country:s.country,clubId:s.clubId,year:s.year,players:s.players,association:championsClubs[s.clubId].association,strength:Math.max(1,s.players.map(p=>p[2]).sort((a,b)=>b-a).slice(0,11).reduce((a,b)=>a+b,0)/11+difficultyBonus[el('difficulty').value])}))].sort((a,b)=>b.strength-a.strength).map((t,seed)=>({...t,seed,pts:0,j:0,v:0,e:0,d:0,gf:0,ga:0,awayGoals:0,awayWins:0,discipline:0,coefficient:t.strength,opponents:[]}));
 let schedule;try{schedule=ChampionsFormat.schedule(entrants)}catch(e){el('tournament').hidden=false;el('headline').textContent=e.message;return}
 cup={teams:entrants,schedule,round:0,stage:0,leg:0,ties:[],ranked:[],history:[],busy:false,over:false,difficulty:el('difficulty').value};
 el('play').disabled=true;el('tournament').hidden=false;el('headline').textContent='';
 el('matches').innerHTML='<div class="cup-heading"><span class="cup-kicker">⭐ DESAFIO DA CHAMPIONS</span><h3 id="cup-stage"></h3><p id="cup-progress"></p><div class="cup-speed"><label for="cup-speed">Ritmo da partida</label><select id="cup-speed"></select></div></div><div class="match-arena"><div id="cup-clock" class="cup-clock"></div><div class="scoreboard"><div id="cup-home"></div><strong id="cup-score"></strong><div id="cup-away"></div></div><p id="cup-aggregate" class="aggregate"></p><div id="cup-feed" class="cup-feed" role="log" aria-live="polite" aria-relevant="additions"></div></div><button id="cup-next"></button><h3 class="cup-section-title">Tabela da fase de liga</h3><p class="muted">1º ao 8º: oitavas • 9º ao 24º: playoffs • 25º ao 36º: eliminação. Desempates: saldo, gols, gols fora, vitórias, vitórias fora, desempenho dos adversários, fair play e força histórica.</p><div class="table-scroll" id="league-table"></div><h3 class="cup-section-title">Seus oito adversários</h3><div id="your-fixtures"></div><h3 class="cup-section-title">Caminho até a taça</h3><div id="cup-bracket">O mata-mata será definido após as oito rodadas da fase de liga.</div><h3 class="cup-section-title">Resultados da Champions</h3><div id="cup-history"></div>';
 el('cup-next').onclick=cupNext;el('cup-speed').innerHTML=el('matchSpeed').innerHTML;el('cup-speed').value=el('matchSpeed').value;el('cup-speed').onchange=()=>{el('matchSpeed').value=el('cup-speed').value;changeSpeed()};cupTables();cupPrepare();el('tournament').scrollIntoView({behavior:'smooth',block:'start'});
}
function cupBracket(){el('cup-bracket').innerHTML='<div class="cup-bracket">'+cup.history.filter(h=>h.knockout).map(h=>'<div class="bracket-round"><h4>'+h.title+'</h4>'+h.results.map(r=>'<div class="bracket-game">'+cupScore(r)+'</div>').join('')+'</div>').join('')+(cup.over?'':'<div class="bracket-round"><h4>'+cupStages[cup.stage]+'</h4>'+cup.ties.map(t=>'<div class="bracket-game">'+cupFlag(t.a)+safe(cupName(t.a))+' × '+safe(cupName(t.b))+cupFlag(t.b)+(t.first?'<div class="muted">Ida: '+t.first.gb+' × '+t.first.ga+'</div>':'')+'</div>').join('')+'</div>')+'</div>'}
function cupComplete(results){
 const league=cup.round<8,title=league?'Fase de liga • Rodada '+(cup.round+1):cupStages[cup.stage]+(cup.stage<4?' • '+(cup.leg===0?'Ida':'Volta'):'');
 cup.history.push({title,results,knockout:!league});const own=results.find(r=>r.a.user||r.b.user);cupHistory();
 if(league){results.forEach(cupRecord);cup.round++;cupTables();
  if(cup.round===8){cup.ranked=ChampionsFormat.standings(cup.teams);const pos=cup.ranked.findIndex(t=>t.user)+1;cup.ties=ChampionsFormat.playoffs(cup.ranked);if(pos>24){cupFinish('Fim da campanha. Seu esquadrão terminou em '+pos+'º e caiu na fase de liga.');cupBracket();return}el('headline').textContent=pos<=8?'🔥 '+pos+'º lugar! Classificado diretamente às oitavas.':'🔥 '+pos+'º lugar! Seu esquadrão vai disputar os playoffs.';cupBracket()}
  else el('headline').textContent=own.winner?.user?'Vitória! Mais três pontos na caminhada.':own.winner?'Ainda há noites de Champions pela frente. Hora de reagir.':'Um ponto conquistado. A disputa continua.';
 }else if(cup.stage<4&&cup.leg===0){results.forEach((r,i)=>cup.ties[i].first=r);cup.leg=1;el('headline').textContent='Primeiro jogo encerrado. A classificação será decidida na volta.';cupBracket()}
 else{
  if(own&&!own.winner.user){cupFinish(cup.stage===4?'🥈 Vice-campeão! Seu esquadrão chegou à grande final.':'Fim da campanha '+['nos playoffs','nas oitavas de final','nas quartas de final','na semifinal'][cup.stage]+'. Seu esquadrão se despede da Champions.');cupBracket();return}
  if(cup.stage===4){cupFinish('🏆 CAMPEÕES! Seu esquadrão conquistou a Champions!');cupBracket();return}
  const winners=results.map(r=>r.winner);
  cup.ties=cup.stage===0?ChampionsFormat.round16(cup.ranked,winners):ChampionsFormat.advance(winners);cup.stage++;cup.leg=0;
  el('headline').textContent=cup.stage===4?'🏟️ É FINAL! Uma noite para entrar na história.':'🔥 Classificado! Próxima fase: '+cupStages[cup.stage]+'.';cupBracket();
 }
 cupPrepare();
}
function cupNext(){
 if(!cup||cup.busy||cup.over)return;
 cup.busy=true;el('cup-next').disabled=true;el('headline').textContent='';
 const results=cupPairs().map(([a,b],i)=>ChampionsFormat.result(a,b,{first:cup.round>=8&&cup.leg===1?cup.ties[i].first:null,deciding:cup.round>=8&&(cup.leg===1||cup.stage===4)}));
 const r=results.find(r=>r.a.user||r.b.user),active=cup;
 if(!r){scheduleCup(()=>{clearInterval(cupTimer);cupTimer=null;if(cup===active)cupComplete(results)},500);return}
 const events=[];
 for(const [side,count] of [['a',r.ga-(r.extra?.[0]||0)],['b',r.gb-(r.extra?.[1]||0)]])for(let i=0;i<count;i++)events.push({minute:5+rand(85),side});
 if(r.extra)for(const [side,count] of [['a',r.extra[0]],['b',r.extra[1]]])for(let i=0;i<count;i++)events.push({minute:95+rand(25),side});
 events.sort((a,b)=>a.minute-b.minute);let minute=0,ga=0,gb=0;const last=r.extra?120:90;
 el('cup-home').innerHTML=cupFlag(r.a)+safe(cupName(r.a));el('cup-away').innerHTML=cupFlag(r.b)+safe(cupName(r.b));el('cup-score').textContent='0 × 0';el('cup-feed').innerHTML='<p>0′ • A bola está rolando! Começa mais uma noite de Champions.</p>';
 const first=cup.round>=8&&cup.leg===1?cup.ties[results.indexOf(r)].first:null;
 function update(){el('cup-score').textContent=ga+' × '+gb;el('cup-clock').textContent=(minute>90?'PRORROGAÇÃO':'AO VIVO')+' • '+minute+'′';el('cup-aggregate').textContent=first?'Agregado: '+(ga+first.gb)+' × '+(gb+first.ga):'';el('cup-feed').scrollTop=el('cup-feed').scrollHeight}
 update();
 scheduleCup(()=>{
  if(cup!==active){clearInterval(cupTimer);return}minute=Math.min(last,minute+5);
  while(events.length&&events[0].minute<=minute){const e=events.shift(),t=e.side==='a'?r.a:r.b;if(e.side==='a')ga++;else gb++;const scorer=cupScorer(t);el('cup-feed').insertAdjacentHTML('beforeend','<p class="goal-event">⚽ '+e.minute+'′ • GOOOL! '+safe(scorer)+' ('+safe(cupName(t))+') balança a rede. '+ga+' × '+gb+'</p>')}
  if(minute===45)el('cup-feed').insertAdjacentHTML('beforeend','<p>45′ • Intervalo. Os treinadores ajustam as equipes.</p>');
  if(minute===90&&r.extra)el('cup-feed').insertAdjacentHTML('beforeend','<p>90′ • Tudo igual na decisão. Começa a prorrogação, sem vantagem por gols fora.</p>');
  update();if(minute!==last)return;
  clearInterval(cupTimer);cupTimer=null;el('cup-clock').textContent=r.pen?'DECISÃO NOS PÊNALTIS':'FIM DE JOGO';
  el('cup-feed').insertAdjacentHTML('beforeend','<p>'+last+'′ • Apita o árbitro! Placar: '+r.ga+' × '+r.gb+'.</p>');
  if(!r.pen){cupComplete(results);return}
  let kick=0,pa=0,pb=0;scheduleCup(()=>{
   if(cup!==active){clearInterval(cupTimer);return}const side=kick%2===0?'a':'b',attempt=Math.floor(kick/2)+1,scored=attempt<=r.pen[side==='a'?0:1];if(scored){if(side==='a')pa++;else pb++}
   const t=side==='a'?r.a:r.b;el('cup-clock').textContent='PÊNALTIS • '+pa+' × '+pb;el('cup-feed').insertAdjacentHTML('beforeend','<p class="goal-event">'+(scored?'⚽':'✋')+' Cobrança '+attempt+' de '+safe(cupScorer(t,attempt-1))+' ('+safe(cupName(t))+'): '+(scored?'na rede!':'defesa do goleiro!')+'</p>');el('cup-feed').scrollTop=el('cup-feed').scrollHeight;kick++;
   if(kick===10){clearInterval(cupTimer);cupTimer=null;el('cup-feed').insertAdjacentHTML('beforeend','<p>🏁 '+safe(cupName(r.winner))+' vence nos pênaltis.</p>');cupComplete(results)}
  },450);
 },260);
}
document.querySelectorAll('input[name="overallMode"]').forEach(r=>r.onchange=()=>{el('showOverall').checked=document.querySelector('input[name="overallMode"]:checked').value==='show';render()});
el('matchSpeed').onchange=changeSpeed;el('formation').onchange=()=>{if(team.length)return;offered=[];el('selection').textContent='Formação definida: '+el('formation').value;render()};el('draw').onclick=draw;el('reset').onclick=reset;el('again').onclick=()=>{reset();scrollTo({top:0,behavior:'smooth'})};el('play').onclick=play;render();
