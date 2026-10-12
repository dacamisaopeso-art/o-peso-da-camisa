(function(){
 'use strict';
 const root=new URL('.',document.currentScript.src),$=id=>document.getElementById(id);
 const poll=$('poll-details');if(poll)poll.addEventListener('toggle',()=>{const frame=poll.querySelector('iframe');if(poll.open&&!frame.hasAttribute('src'))frame.src=frame.dataset.src;});
 const shorts=$('shorts-expand');if(shorts)shorts.onclick=()=>{const expanded=shorts.getAttribute('aria-expanded')!=='true';shorts.setAttribute('aria-expanded',String(expanded));shorts.closest('.shorts-grid').classList.toggle('shorts-expanded',expanded);shorts.textContent=expanded?'Mostrar menos Shorts ↑':'Ver mais Shorts ↓';};
 // Um destaque a cada dia, sem carrossel ou movimento enquanto a pessoa lê.
 const rotation=$('home-rotation');if(rotation){const day=Math.floor(Date.now()/86400000)%3;
 const choices=[['Desafio das Lendas','desafio-lendas-banner.webp','Monte sua seleção histórica e dispute a Copa.','desafio-das-lendas.html'],['Desafio da Champions','champions-original.svg','Monte seu esquadrão e viva as grandes noites europeias.','desafio-da-champions.html'],['Forja de Craques','forja-craques-banner.svg','Oito giros para construir seu jogador e viver sua carreira.','forja-de-craques/']];
 const [name,image,text,url]=choices[day];rotation.querySelector('h3').textContent=name;const img=rotation.querySelector('img');img.src=new URL('imagens/'+image,root);img.alt='Ilustração OPC: '+name;rotation.querySelector('p:not(.real-kicker)').textContent=text;rotation.querySelector('a').href=new URL(url,root);}
 // Duas indicações no fim da leitura; não cobre texto nem abre pop-ups.
 if((document.querySelector('main article')||/kaka-da|robinho-da/.test(location.pathname))&&!$('blog')&&!document.querySelector('.related-reading')){const main=document.querySelector('main')||document.querySelector('article'),title=document.querySelector('h1')?.textContent.toLowerCase()||'';if(!main)return;const section=document.createElement('aside');section.className='related-reading';const h=document.createElement('h2');h.textContent='Continue a história';section.append(h);
 const related=title.includes('garrincha')||title.includes('pele')?['publicacoes/o-brasil-ainda-e-o-pais-do-futebol.html','O Brasil ainda é o país do futebol?']:['publicacoes/fla-flu-a-maior-rivalidade-do-rio-de-janeiro.html','Fla-Flu: uma rivalidade que atravessa gerações'];
 const entries=[[...related],['adivinhe-pela-carreira.html','Entre em campo: Adivinhe pela Carreira']];for(const [url,label]of entries){if(new URL(url,root).pathname===location.pathname)continue;const a=document.createElement('a');a.href=new URL(url,root);a.textContent=label+' →';section.append(a);}main.append(section);}
})();
