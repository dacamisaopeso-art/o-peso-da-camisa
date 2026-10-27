"""Proteções compartilhadas, reaplicáveis às páginas estáticas e ao blog."""
import base64
import hashlib
import html
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ADSENSE_CLIENT = 'ca-pub-9262477198650799'
ADSENSE_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT
ADSENSE_TAG = f'<script async src="{ADSENSE_URL}" crossorigin="anonymous"></script>'

def adsense_eligible(page):
    """Somente matérias completas; catálogos, apoio e jogos sem publicidade."""
    editorial = (
        bool(re.search(r'<link\b[^>]*rel=["\']canonical["\'][^>]*href=["\']https://dacamisaopeso-art.github.io/o-peso-da-camisa/publicacoes/[^"\']+\.html', page, re.I)) or
        bool(re.search(r'<link\b[^>]*rel=["\']canonical["\'][^>]*href=["\']https://dacamisaopeso-art.github.io/o-peso-da-camisa/(?:kaka-da-superacao-a-bola-de-ouro|robinho-da-promessa-a-queda)\.html', page, re.I)))
    return editorial and bool(re.search(r'<head\b', page, re.I)) and not re.search(
        r'<meta\b[^>]*name=["\']robots["\'][^>]*content=["\'][^"\']*noindex|<meta\b[^>]*http-equiv=["\']refresh["\']|Esta página saiu de campo\.', page, re.I)

def install_adsense(page):
    # Normaliza o carregador oficial antes de inserir uma única cópia no head.
    page = re.sub(r'<script\b[^>]*\bsrc=["\'][^"\']*pagead2\.googlesyndication\.com/pagead/js/adsbygoogle\.js[^"\']*["\'][^>]*>\s*</script\s*>', '', page, flags=re.I)
    if adsense_eligible(page):
        page = re.sub(r'</head\s*>', ADSENSE_TAG + '</head>', page, count=1, flags=re.I)
    return page

class Handlers(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.values = []
    def handle_starttag(self, tag, attrs):
        self.values.extend(value for key, value in attrs if key.lower().startswith('on') and value)

def digest(value):
    normalized = value.replace('\r\n', '\n').replace('\r', '\n')
    return "'sha256-" + base64.b64encode(hashlib.sha256(normalized.encode()).digest()).decode() + "'"

def protect(page, prefix=''):
    if 'Esta página saiu de campo.' in page:
        prefix = '/o-peso-da-camisa/'
    page = re.sub(r'<meta\b[^>]*http-equiv=["\']Content-Security-Policy["\'][^>]*>\s*', '', page, flags=re.I)
    page = re.sub(r'<meta\b[^>]*name=["\']referrer["\'][^>]*>\s*', '', page, flags=re.I)
    adsense = adsense_eligible(page)
    handlers = Handlers()
    handlers.feed(page)
    scripts = [body for attrs, body in re.findall(r'<script\b([^>]*)>(.*?)</script\s*>', page, re.I | re.S)
               if not re.search(r'\bsrc\s*=', attrs, re.I) and not re.search(r'application/(?:ld\+)?json', attrs, re.I)]
    hashes = sorted(set(digest(value) for value in scripts + handlers.values))
    policy = "; ".join([
        "default-src 'self'", "base-uri 'self'", "object-src 'none'",
        # GitHub Pages não gera nonces por resposta. Mantemos os hashes para
        # scripts inline; HTTPS permite dependências variáveis do AdSense.
        "script-src 'self' " + ("https: 'unsafe-eval' " if adsense else '') + ("'unsafe-hashes' " if handlers.values else '') + ' '.join(hashes),
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:", "img-src 'self' https: data: blob:",
        "connect-src 'self' " + ("https:" if adsense else "https://lygpkgdpvxilfxoywcal.supabase.co"),
        "frame-src " + ("https:" if adsense else "https://strawpoll.com https://www.youtube.com https://www.youtube-nocookie.com"),
        "media-src 'self' blob: data:", "worker-src 'self' blob:", "form-action 'self'",
    ])
    metas = '<meta http-equiv="Content-Security-Policy" content="' + html.escape(policy, quote=True) + '"><meta name="referrer" content="strict-origin-when-cross-origin">'
    # Após charset, antes de qualquer recurso ativo; nunca antes do doctype.
    page = re.sub(r'(<meta\b[^>]*charset[^>]*>)', lambda m: m[0] + metas, page, count=1, flags=re.I)
    if 'site-base.css' not in page:
        page = page.replace('</head>', f'<link rel="stylesheet" href="{prefix}site-base.css?v=20261014"></head>')
    if 'site-base.js' not in page:
        page = page.replace('</body>', f'<script defer src="{prefix}site-base.js?v=20261014"></script></body>')
    if not re.search(r'<link\b[^>]*rel=["\'](?:shortcut )?icon["\']', page, re.I):
        page = page.replace('</head>', f'<link rel="icon" href="{prefix}imagens/favicon-opc.png"></head>')
    # Acesso institucional estático também nas páginas geradas e nos jogos.
    if not re.search(r'href=["\'][^"\']*politica-de-privacidade\.html', page, re.I):
        links = [('','Início'), ('jogos.html','Jogos'), ('sobre-nos.html','Sobre nós'), ('contato.html','Contato'), ('politica-de-privacidade.html','Privacidade e cookies')]
        navigation = '<nav class="opc-institutional" aria-label="Informações do site">' + ' '.join(f'<a href="{prefix + route if route else prefix or "./"}">{label}</a>' for route,label in links) + '</nav>'
        page = page.replace('</body>', navigation + '</body>')
    # Recursos alterados recebem uma versão explícita para não reutilizar a UI antiga.
    page = re.sub(r'((?:src|href)=["\'][^"\']*(?:site-base\.(?:js|css)|futdraw\.css|app-instalar\.js))(?:\?[^"\']*)?(["\'])', r'\1?v=20261027-audit\2', page)
    return install_adsense(page)

def public_pages():
    return sorted(path for path in ROOT.rglob('*.html') if not any(part.startswith(('_', '.')) for part in path.relative_to(ROOT).parts) and not re.fullmatch(r'google[a-f0-9]+\.html', path.name))

if __name__ == '__main__':
    for path in public_pages():
        prefix = '../' * (len(path.relative_to(ROOT).parts) - 1)
        path.write_text(protect(path.read_text(encoding='utf-8'), prefix), encoding='utf-8', newline='\n')
    print('Proteções atualizadas nas páginas públicas.')
