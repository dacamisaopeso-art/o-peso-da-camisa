(function () {
  'use strict';
  const root = new URL('.', document.currentScript.src);
  if (!/^https?:$/.test(location.protocol)) return;
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifest = document.createElement('link');
    manifest.rel = 'manifest'; manifest.href = new URL('app.webmanifest', root);
    document.head.append(manifest);
  }
  let pending = null;
  const button = document.querySelector('[data-install-app]');
  const status = document.querySelector('[data-install-status]');
  const instructions = document.querySelector('#instalacao-navegador');
  const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  function reflect() {
    if (!button) return;
    button.textContent = installed() ? 'App do navegador aberto' : 'Instalar pelo navegador';
    button.disabled = installed();
    if (installed() && status) status.textContent = 'Você já está usando o app do navegador.';
  }
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault(); pending = event; reflect();
  });
  window.addEventListener('appinstalled', () => { pending = null; reflect(); if (status) status.textContent = 'Aplicativo instalado. Procure OPC Jogos na tela inicial.'; });
  button?.addEventListener('click', async () => {
    if (!pending) {
      if (instructions) { instructions.open = true; instructions.scrollIntoView({behavior: 'smooth', block: 'center'}); }
      if (status) status.textContent = 'Use o menu do navegador para instalar ou adicionar à tela inicial. Veja as instruções abaixo.';
      return;
    }
    const prompt = pending; pending = null;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (status) status.textContent = choice.outcome === 'accepted' ? 'Pedido de instalação enviado ao navegador.' : 'Instalação cancelada. Você pode continuar jogando pelo site.';
    } catch { if (status) status.textContent = 'Abra o menu do navegador e escolha Instalar aplicativo ou Adicionar à tela inicial.'; }
    reflect();
  });
  reflect();
  // No intercepting requests, caching gameplay, authentication or room state.
  if ('serviceWorker' in navigator) navigator.serviceWorker.register(new URL('app-sw.js', root), {scope: root.pathname}).catch(() => {});
})();
