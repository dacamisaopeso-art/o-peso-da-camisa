from pathlib import Path
import html, re, json, yaml, markdown
from datetime import date as Date
from urllib.parse import urlsplit, unquote, quote
import posixpath
from blog_security import clean_article, safe_image_url
from site_policies import protect
from image_rights import cover_record, attribution
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "posts"
OUT = ROOT / "publicacoes"
OUT.mkdir(exist_ok=True)
cards = []
post_urls = []
# Lista editorial para navegação estática, inclusive sem JavaScript.
post_catalogue = []
for source_path in POSTS.glob('*.md'):
    source_text = source_path.read_text(encoding='utf-8')
    if source_text.startswith('---'):
        data = yaml.safe_load(source_text.split('---', 2)[1]) or {}
        post_catalogue.append((source_path.stem, str(data.get('title') or source_path.stem), str(data.get('category') or 'Blog')))
def publication_date(path):
    source = path.read_text(encoding="utf-8")
    if not source.startswith("---"):
        return ("", path.stem)
    meta = yaml.safe_load(source.split("---", 2)[1]) or {}
    value = str(meta.get("date") or "")
    if value:
        Date.fromisoformat(value)
    return (value, path.stem)

def cover_url(value, prefix=""):
    value = safe_image_url(value)
    if not value or urlsplit(value).scheme:
        return value
    parsed = urlsplit(value)
    route = unquote(parsed.path).removeprefix("/o-peso-da-camisa/")
    route = posixpath.normpath(route)
    if route.startswith("/") or route == ".." or route.startswith("../"):
        raise ValueError(f"Caminho de capa fora do site: {value}")
    if not (ROOT / route).is_file():
        raise ValueError(f"Capa inexistente: {value}")
    return prefix + quote(route, safe="/-._~") + ("?" + parsed.query if parsed.query else "")

for path in sorted(POSTS.glob("*.md"), key=publication_date, reverse=True):
    source = path.read_text(encoding="utf-8")
    if not source.startswith("---"):
        continue
    _, front, body = source.split("---", 2)
    meta = yaml.safe_load(front) or {}
    title = str(meta.get("title") or path.stem)
    description = str(meta.get("description") or "")
    category = str(meta.get("category") or "Blog")
    image = cover_url(meta.get("image") or "")
    rights = cover_record(image)
    date = str(meta.get("date") or "")
    slug = re.sub(r"[^a-z0-9-]", "", path.stem.lower())
    if not slug:
        continue
    url = "publicacoes/" + slug + ".html"
    post_urls.append(url)
    esc = lambda s: html.escape(str(s), quote=True)
    def cover_tag(prefix=""):
        src = cover_url(image, prefix) if image else prefix + "imagens/blog-capa-padrao.svg"
        alt = meta.get("image_alt") or ("Capa de " + title if image else "Ilustração editorial O Peso da Camisa")
        return f'<img data-blog-cover src="{esc(src)}" alt="{esc(alt)}" loading="lazy">'
    image_tag = cover_tag()
    cards.append(f'<article class="article-card"><a href="{url}">{image_tag}<div class="article-content"><div class="real-kicker">{esc(category)} • {esc(date)}</div><h3>{esc(title)}</h3><p>{esc(description)}</p><span class="real-link">LER POST COMPLETO →</span></div></a>{attribution(rights, compact=True)}</article>')
    article = clean_article(markdown.markdown(body, extensions=["extra", "sane_lists"]))
    reading_minutes = max(1, (len(re.findall(r'\w+', re.sub('<[^>]+>', ' ', article))) + 199) // 200)
    editorial_meta = f'<p class="article-byline">Por <a rel="author" href="../sobre-nos.html#editorial">O Peso da Camisa</a> · Publicado em <time datetime="{esc(date)}">{esc(date)}</time> · Leitura estimada: {reading_minutes} min</p>'
    candidates = sorted((p for p in post_catalogue if p[0] != slug), key=lambda p: (p[2] != category, p[0]))[:2]
    related = '<aside class="related-reading" aria-label="Outras matérias"><h2>Continue a história</h2>' + ''.join(f'<a href="{esc(p[0])}.html">{esc(p[1])} →</a>' for p in candidates) + '</aside>'
    editorial_note = '<aside class="editorial-note"><p>As fontes e ressalvas desta matéria acompanham o texto. Encontrou uma informação que precisa de correção? <a href="../contato.html#correcoes">Envie o trecho e a fonte para conferência</a>. <a href="../sobre-nos.html#editorial">Conheça nossos critérios editoriais</a>.</p></aside>'
    image_tag = "<figure>" + cover_tag("../") + attribution(rights, "../") + "</figure>"
    page = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)} | O Peso da Camisa</title><meta name="description" content="{esc(description)}"><link rel="canonical" href="https://dacamisaopeso-art.github.io/o-peso-da-camisa/{url}"><meta name="robots" content="index,follow,max-image-preview:large"><style>body{{background:#07090b;color:#eee;font:17px/1.85 Arial,sans-serif;margin:0}}header,main,footer{{max-width:840px;margin:auto;padding:25px}}a{{color:#d8a83e}}h1{{font-size:clamp(32px,5vw,54px);line-height:1.15}}h2{{margin-top:40px}}p{{color:#ddd}}img{{max-width:100%;height:auto;border-radius:10px}}.tag{{color:#d8a83e;text-transform:uppercase;letter-spacing:2px;font-size:13px}}</style></head><body><header><a href="../">← O PESO DA CAMISA</a></header><main><div class="tag">{esc(category)} • {esc(date)}</div><h1>{esc(title)}</h1><p>{esc(description)}</p>{image_tag}<article>{article}</article><p><a href="../#blog">← Voltar ao blog</a></p></main><footer>O PESO DA CAMISA</footer></body></html>'''
    page = page.replace(f'<p>{esc(description)}</p>', editorial_meta + f'<p>{esc(description)}</p>', 1)
    page = page.replace('</article>', '</article>' + editorial_note + related, 1)
    # Metadados coerentes em todas as matérias.
    canonical = "https://dacamisaopeso-art.github.io/o-peso-da-camisa/" + url
    absolute_image = image if urlsplit(image).scheme else "https://dacamisaopeso-art.github.io/o-peso-da-camisa/" + image
    social = {"og:type": "article", "og:locale": "pt_BR", "og:site_name": "O Peso da Camisa", "og:title": title, "og:description": description, "og:url": canonical, "og:image": absolute_image, "og:image:alt": meta.get("image_alt") or title, "article:published_time": date}
    seo_tags = ''.join(f'<meta property="{esc(key)}" content="{esc(value)}">' for key, value in social.items())
    seo_tags += '<meta name="twitter:card" content="summary_large_image">'
    for key, value in {"title": title, "description": description, "image": absolute_image, "image:alt": meta.get("image_alt") or title}.items():
        seo_tags += f'<meta name="twitter:{key}" content="{esc(value)}">'
    schema = {"@context": "https://schema.org", "@type": "BlogPosting", "headline": title, "description": description, "datePublished": date, "image": absolute_image, "mainEntityOfPage": canonical, "inLanguage": "pt-BR", "author": {"@type": "Organization", "name": "O Peso da Camisa"}, "publisher": {"@type": "Organization", "name": "O Peso da Camisa"}}
    seo_tags += '<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026') + '</script>'
    page = page.replace("</head>", seo_tags + "</head>")
    page = page.replace("</head>", '<link rel="stylesheet" href="../site-ajustes.css?v=20261026"></head>').replace("</body>", '<script defer src="../site-ajustes.js?v=1"></script></body>')
    (OUT / (slug + ".html")).write_text(protect(page, '../'), encoding="utf-8", newline="\n")

index_path = ROOT / "index.html"
index = index_path.read_text(encoding="utf-8")
start = "<!-- CMS_POSTS_START -->"
end = "<!-- CMS_POSTS_END -->"
if start not in index or end not in index:
    raise RuntimeError("Marcadores de publicações ausentes em index.html")
index = index.split(start)[0] + start + '<div class="article-grid">' + "".join(cards) + "</div>" + end + index.split(end, 1)[1]
index_path.write_text(protect(index), encoding="utf-8", newline="\n")
print(f"Geradas {len(cards)} publicações")

# Sitemap atualizado a cada publicação, preservando as páginas institucionais e os artigos fixos.
base_url = "https://dacamisaopeso-art.github.io/o-peso-da-camisa/"
fixed_urls = ["", "kaka-da-superacao-a-bola-de-ouro.html", "robinho-da-promessa-a-queda.html", "sobre-nos.html", "contato.html", "politica-de-privacidade.html", "jogos.html", "desafio-das-lendas.html", "desafio-da-champions.html", "jogo-da-velha.html", "futdraw.html", "drafteam.html", "creditos-jogo-da-velha.html", "fontes-jogo-da-velha.html", "adivinhe-pela-carreira.html", "forja-de-craques/", "escalacao-historica.html", "intruso-da-camisa.html", "creditos-imagens.html"]
namespace = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", namespace)
urlset = ET.Element(f"{{{namespace}}}urlset")
for relative_url in dict.fromkeys(fixed_urls + sorted(post_urls)):
    target = ROOT / relative_url
    if not (target / "index.html" if target.is_dir() else target).is_file():
        raise ValueError(f"URL do sitemap sem página: {relative_url}")
    ET.SubElement(ET.SubElement(urlset, f"{{{namespace}}}url"), f"{{{namespace}}}loc").text = base_url + relative_url
ET.indent(urlset, space="  ")
ET.ElementTree(urlset).write(ROOT / "sitemap.xml", encoding="utf-8", xml_declaration=True)
print(f"Sitemap atualizado com {len(fixed_urls) + len(post_urls)} URLs")


# Preserva URLs antigas e seu conteúdo, retirando do índice páginas sem fonte editorial.
for stale in OUT.glob("*.html"):
    if "publicacoes/" + stale.name not in post_urls:
        page = stale.read_text(encoding="utf-8")
        page = re.sub(r'<meta name="robots" content="[^"]*">', '<meta name="robots" content="noindex,follow">', page)
        stale.write_text(page, encoding="utf-8", newline="\n")
