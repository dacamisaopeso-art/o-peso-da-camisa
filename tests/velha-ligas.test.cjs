const a=require('node:assert/strict');require('../velha-dados.js');const d=globalThis.OPC_VELHA_DATA,c=require('../velha-core.js');
const baseline={'bra.1':4389,'eng.1':3674,'esp.1':1478,'ita.1':790,'ger.1':210,'fra.1':317,europe:5688};for(const [mode,n] of Object.entries(baseline)){const pool=d.players.filter(p=>p.modes.includes(mode));a(pool.length>n,'A revisão deve ampliar '+mode);a(new Set(pool.map(p=>p.identity)).size===pool.length);a(pool.every(p=>p.categories.some(x=>x.startsWith('club:'))));}
a.equal(d.historyStart,1960);
for(const p of d.players){a(p.lastProfessionalYear>=1960&&p.lastProfessionalYear<=2026,p.name+' deve ter carreira profissional no recorte');a(p.nationality&&!/^Q\d+$/.test(p.nationality)&&!p.nationality.includes('  '));a(p.botFame>=0&&p.botFame<=100);}const audit=require('../docs/jogo-da-velha-ampliacao.json');a.equal(audit.after,d.players.length);for(const [mode,r] of Object.entries(audit.modes)){a.equal(r.after,d.players.filter(p=>p.modes.includes(mode)).length);a.equal(r.after-r.before,r.added-r.removed.length);}
const identities=require('./velha-identidades.json');
for(const name of ['Pelé','Garrincha','Ronaldo','Romário','Ronaldinho','Neymar'])a(d.players.some(p=>p.identity===identities[name]&&p.modes.includes('bra.1')),name+' continua disponível');
a(!d.players.some(p=>p.identity==='Q6130428'),'Carreira encerrada antes de 1960 não entra');
for(const name of ['Pichichi','John Proudfoot','Nat Robinson'])a(!d.players.some(p=>p.name===name),'Ano de referência bibliográfica não é ano de carreira: '+name);
const alpay=d.players.find(p=>p.identity==='Q435749');if(alpay)a(!alpay.deceased,'Comentário de modelo não é falecimento');
for(const id of ['Q570811','Q2736254','Q6298271']){const p=d.players.find(p=>p.identity===id);if(p){a(!p.categories.includes('club:vitoria'),'Vitória de Setúbal não é Vitória da Bahia');a(!p.modes.includes('bra.1'),'Passagem por Setúbal não habilita Brasileirão');}}
for(const famous of ['Ronaldo','Ronaldinho','Romário','Neymar','Cristiano Ronaldo','Lionel Messi']){const person=d.players.find(p=>p.identity===identities[famous]);a(person);a(d.categories.some(cat=>cat.id==='with:'+person.id&&cat.label===famous),'Categoria de companheiro usa a identidade da lenda');}
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto'),manifest=require('../docs/jogo-da-velha-fontes.json');
const uncompressed=zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'../docs',manifest.file))),proofs=JSON.parse(uncompressed);a.equal(proofs.length,manifest.records);a.equal(crypto.createHash('sha256').update(uncompressed).digest('hex'),manifest.sha256);
const players=new Map(d.players.map(p=>[p.id,p]));for(const proof of proofs.filter(p=>p.dataset)){const person=players.get(proof.playerId);a(person&&person.categories.includes(proof.category));a(proof.appearances>0);a(proof.source.includes('/leistungsdatendetails/spieler/'));}
a(!d.categories.some(c=>/station/.test(c.id)),'Identificador de clube não deve vir de estação ferroviária');
console.log('OK: crescimento nas seis ligas, identidades únicas, passagens profissionais, metadados e relatório de revisão.');
