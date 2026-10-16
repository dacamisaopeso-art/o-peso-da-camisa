"""Registro explícito de direitos: a presença em um domínio não autoriza uma imagem."""
from pathlib import Path
import json, html, re
from urllib.parse import urlsplit, unquote
ROOT = Path(__file__).resolve().parent.parent
REGISTRY = json.loads((ROOT/'dados/licencas-imagens.json').read_text(encoding='utf-8'))
IMAGES = {row['key']: row for row in REGISTRY['images']}

def cover_record(value):
    if not value:
        value = 'imagens/blog-capa-padrao.svg'
    key = value if urlsplit(value).scheme else unquote(urlsplit(value).path).removeprefix('/o-peso-da-camisa/')
    row = IMAGES.get(key)
    if not row or not row.get('verified') or row.get('commercial') is not True:
        raise ValueError(f'Capa sem licença comercial conferida no registro: {value}')
    if row['kind'] == 'photo' and not (re.fullmatch(r'CC BY(?:-SA)? [1-4]\.[0-9](?: [a-z]{2})?', row['license']) or row['license'] in ('CC0', 'Public domain')):
        raise ValueError(f'Licença de fotografia não aceita para uso comercial: {value}')
    return row

def attribution(row, prefix='', compact=False):
    esc = lambda s: html.escape(str(s), quote=True)
    author = row.get('displayAuthor') or row['author']
    label = 'Foto' if row['kind'] == 'photo' else 'Ilustração'
    if compact:
        return f'<p class="image-credit">{label}: {esc(author)} · <a href="{prefix}creditos-imagens.html#{row["id"]}">Créditos e licença</a></p>'
    source = f'<a href="{esc(row["page"])}" rel="noopener noreferrer">Fonte e autoria</a>'
    license = f'<a href="{esc(row["licenseUrl"])}" rel="license noopener noreferrer">{esc(row["license"])}</a>' if row['licenseUrl'] else esc(row['license'])
    return f'<figcaption class="image-credit">{label}: {esc(author)} · {source} · {license}. {esc(row["changes"])} <a href="{prefix}creditos-imagens.html#{row["id"]}">Condições de uso</a>.</figcaption>'
