"""Proteções compartilhadas, reaplicáveis às páginas estáticas e ao blog."""
import base64
import hashlib
import html
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

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
    handlers = Handlers()
    handlers.feed(page)
    scripts = [body for attrs, body in re.findall(r'<script\b([^>]*)>(.*?)</script\s*>', page, re.I | re.S)
               if not re.search(r'\bsrc\s*=', attrs, re.I) and not re.search(r'application/(?:ld\+)?json', attrs, re.I)]
    hashes = sorted(set(digest(value) for value in scripts + handlers.values))
    policy = "; ".join([
        "default-src 'self'", "base-uri 'self'", "object-src 'none'",
        "script-src 'self' " + ("'unsafe-hashes' " if handlers.values else '') + ' '.join(hashes),
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:", "img-src 'self' https: data: blob:",
        "connect-src 'self' https://lygpkgdpvxilfxoywcal.supabase.co",
        "frame-src https://strawpoll.com https://www.youtube.com https://www.youtube-nocookie.com",
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
    return page

def public_pages():
    return sorted(path for path in ROOT.rglob('*.html') if not any(part.startswith(('_', '.')) for part in path.relative_to(ROOT).parts))

if __name__ == '__main__':
    for path in public_pages():
        prefix = '../' * (len(path.relative_to(ROOT).parts) - 1)
        path.write_text(protect(path.read_text(encoding='utf-8'), prefix), encoding='utf-8', newline='\n')
    print('Proteções atualizadas nas páginas públicas.')
