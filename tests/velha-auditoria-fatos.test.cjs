'use strict';
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
require('../velha-dados.js');require('../velha-champions.js');const d=OPC_VELHA_DATA,core=require('../velha-core.js'),daily=require('../velha-diario.js'),audit=require('../dados/velha-auditoria-2026-10-14.json');
const players=new Map(d.players.map(p=>[p.id,p])),has=(id,cat)=>players.get(id)?.categories.includes(cat);
// Independent regressions from the user's examples and primary match/title reports.
for(const id of ['Q142794','Q19709176','Q210453','Q197565','Q1982869']){
 a(has(id,'with:Q39444'),players.get(id)?.name+' jogou com Ronaldinho');a(has(id,'award:copabrasil'),players.get(id)?.name+' venceu a Copa do Brasil');
 const b={id:'regressao-relatada',mode:'bra.1',difficulty:'normal',rows:['with:Q39444','club:flamengo','club:fluminense'],cols:['award:copabrasil','country:Brazil','role:Meio-campista']};
 const x={...d,boards:[b]},s=core.start(x,{mode:'bra.1',difficulty:'normal',target:1},()=>0),result=core.apply(x,s,0,id);a(result.ok&&result.correct,id+' deve ocupar a casa relatada');
 a(players.get(id).evidence['with:Q39444'].some(u=>!u.includes('wikipedia.org')));a(players.get(id).evidence['award:copabrasil'].some(u=>!u.includes('wikipedia.org')));
}
a(has('Q20048828','award:copabrasil'),'Rodinei ganhou em 2022');a(!has('Q20048828','with:Q39444'),'passagens diferentes no Flamengo não provam uma partida juntos');
a(!has('Q39444','award:copabrasil'),'Ronaldinho não recebe a conquista de 2014 apenas por ter jogado no Atlético naquele ano');
for(const id of ['Q11948','Q295512','Q216312','Q314078','Q817228'])a(!has(id,'award:worldcup'),'não confundir vice, terceiro ou prêmio individual com campeão mundial: '+id);
for(const id of ['Q184946','Q180649','Q131529','Q295732'])a(!has(id,'award:ballondor'),'indicação, colocação ou retrospectiva não é Ballon d’Or anual: '+id);
a(has('Q230046','award:ballondor'),'Gianni/Giovanni Rivera ganhou em 1969');a(!has('Q648744','award:copaamerica'),'seleção do torneio não torna Cueva campeão');
for(const id of ['Q146907','Q80306','Q1917'])a(!has(id,'award:champions'),'não confundir uma campanha ou nomeação com título: '+id);
a(has('Q142794','with:Q615')&&has('Q615','with:Q142794'),'Messi e Neymar têm testemunho comum no Barcelona');
a(has('Q529207','with:Q39444')&&has('Q39444','with:Q529207'),'relação é recíproca para as duas lendas na mesma partida');
a(has('Q1982869','award:brasileiro'),'Vampeta campeão brasileiro em 1998/1999');
for(const id of ['Q62786','Q905206','Q314099','Q455557','Q23771470','Q15966749','Q55081204','Q56876908'])a(has(id,'award:brtop'),'não limitar artilharia aos seis nomes originais: '+id);
for(const id of ['Q368441','Q80471','Q189217','Q295746','Q295307','Q47778','Q83006','Q124086','Q261534'])a(has(id,'award:wctop'),'artilharia por edição inclui empates em gols: '+id);
a(!has('Q7132241','award:worldcup')&&!has('Q7132241','award:wctop'),'o Paolo Rossi nascido em 1982 não é o campeão/artilheiro de 1982');
const keys=new Set(d.categories.map(c=>c.id));for(const p of d.players){a.equal(new Set(p.categories).size,p.categories.length);for(const cat of p.categories)a(keys.has(cat));a(!p.categories.includes('with:'+p.id),'ninguém é companheiro de si mesmo');}
for(const change of audit.changes.filter(x=>x.category.startsWith('with:')&&x.matchId)){
 const m=audit.matches.find(m=>m.id===change.matchId),p=m?.players.find(p=>p.id===change.id),anchor=m?.players.find(p=>p.id===change.category.slice(5));
 a(p&&anchor&&p.id!==anchor.id);a(Math.max(p.on,anchor.on)<Math.min(p.off,anchor.off),'exige intervalo simultâneo, não substituição direta');a(has(change.id,change.category));
}
const scarpa=audit.matches.find(m=>m.id==='fluminense-gremio-2015');a(scarpa.players.find(p=>p.id==='Q19709176').on>0,'Scarpa entrou durante o jogo; não era titular');
// Simulate moves against a separate set-intersection index, across every published grid.
const byMode=new Map();for(const mode of Object.keys(d.modes)){const m=new Map();for(const p of d.players.filter(p=>p.modes.includes(mode)))for(const cat of p.categories){if(!m.has(cat))m.set(cat,new Set());m.get(cat).add(p.id);}byMode.set(mode,m);}
let checked=0;for(const b of d.boards){const m=byMode.get(b.mode);for(let cell=0;cell<9;cell++){const r=b.rows[Math.floor(cell/3)],c=b.cols[cell%3],expected=[...(m.get(r)||[])].filter(id=>m.get(c)?.has(id)).sort(),actual=core.answers(d,b,cell).map(p=>p.id).sort();a.deepEqual(actual,expected);a.equal(actual.length,b.counts[cell]);checked+=actual.length;}}
for(const mode of Object.keys(d.modes))for(const difficulty of ['normal','hard'])for(let i=0;i<12;i++){const rng=daily.rng('audit-'+mode+'-'+difficulty+'-'+i);let s=core.start(d,{mode,difficulty,botLevel:i%2?'normal':'easy',target:1},rng);for(let move=0;move<40&&!s.roundEnded;move++){const turn=s.turn,choice=core.bot(d,s,rng),r=choice?core.apply(d,s,choice.cell,choice.playerId):core.pass(s);a(r.ok);if(choice){a(r.correct);a.equal(r.state.cells[choice.cell].owner,turn);}s=r.state;}a(s.roundEnded);}
// Server catalog and browser bank must expose exactly the same accepted criteria.
const sql=fs.readFileSync(path.join(__dirname,'../online/velha-catalogo.sql'),'utf8'),catalog=JSON.parse(sql.split('$opc_catalog$')[1]);a.equal(catalog.version,d.onlineVersion);a.deepEqual(catalog.boards,d.boards);a.deepEqual(catalog.players,d.players.map(p=>({id:p.id,modes:p.modes,categories:p.categories})));
console.log('OK: casos relatados, títulos independentes, homônimos, intervalos simultâneos, '+checked+' respostas cruzadas, 168 partidas simuladas e catálogo online idêntico.');
