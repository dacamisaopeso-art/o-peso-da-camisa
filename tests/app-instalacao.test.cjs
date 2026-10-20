'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('app.webmanifest'));
assert.equal(manifest.start_url,'./jogos.html?origem=app');assert.equal(manifest.scope,'./');assert.equal(manifest.display,'standalone');
const gameLinks=[...read('jogos.html').matchAll(/class="game-promo-button" href="([^"]+)/g)].map(x=>x[1]);
assert.equal(gameLinks.length,8,'Todos os oito jogos continuam disponíveis no site');
for(const file of gameLinks)assert(fs.existsSync(path.join(root,file)),'Jogo preservado: '+file);
for(const icon of manifest.icons){const b=fs.readFileSync(path.join(root,icon.src));const size=Number(icon.sizes.split('x')[0]);assert.equal(b.readUInt32BE(16),size);assert.equal(b.readUInt32BE(20),size);}
const html=read('aplicativo.html');for(const m of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)){if(!/^[a-z]+:/i.test(m[1]))assert(fs.existsSync(path.join(root,m[1])),m[1]);}
assert(html.includes('releases/download/android-v0.1.0/OPC-Jogos-0.1.0.apk'));assert(!html.includes('adsbygoogle'));assert(!read('app-sw.js').includes("addEventListener('fetch'"),'SW must not intercept online traffic');
const code=read('app-instalar.js');const listeners={},status={},instructions={scrollIntoView(){this.scrolled=true}},button={addEventListener(k,v){this[k]=v}};const registrations=[];
const context={URL,location:{protocol:'https:'},matchMedia:()=>({matches:false}),navigator:{serviceWorker:{register:(url,opts)=>{registrations.push([String(url),opts]);return Promise.resolve();}}},window:{addEventListener:(k,v)=>listeners[k]=v},document:{currentScript:{src:'https://example.test/o-peso-da-camisa/app-instalar.js'},head:{append(){}},createElement:()=>({}),querySelector:q=>q==='[data-install-app]'?button:q==='[data-install-status]'?status:q==='#instalacao-navegador'?instructions:null}};
vm.runInNewContext(code,context);
(async()=>{await button.click();assert(instructions.open);assert(instructions.scrolled);let prompted=0;listeners.beforeinstallprompt({preventDefault(){},prompt:async()=>prompted++,userChoice:Promise.resolve({outcome:'accepted'})});await button.click();assert.equal(prompted,1);assert(status.textContent.includes('enviado'));await button.click();assert.equal(prompted,1,'Consumed prompt is not reused');assert.equal(registrations[0][1].scope,'/o-peso-da-camisa/');assert(read('jogos.html').includes('href="aplicativo.html"'));console.log('OK: instalação — ícones, manifesto, links, prompt real/fallback e rede sem interceptação.');})().catch(e=>{console.error(e);process.exitCode=1;});
