from pathlib import Path
import html, re, yaml, markdown
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "posts"
OUT = ROOT / "publicacoes"
OUT.mkdir(exist_ok=True)
cards = []
post_urls = []
for path in sorted(POSTS.glob("*.md"), reverse=True):
    source = path.read_text(encoding="utf-8")
    if not source.startswith("---"):
        continue
    _, front, body = source.split("---", 2)
    meta = yaml.safe_load(front) or {}
    title = str(meta.get("title") or path.stem)
    description = str(meta.get("description") or "")
    category = str(meta.get("category") or "Blog")
    image = str(meta.get("image") or "")
    date = str(meta.get("date") or "")
    slug = re.sub(r"[^a-z0-9-]", "", path.stem.lower())
    if not slug:
        continue
    url = "publicacoes/" + slug + ".html"
    post_urls.append(url)
    esc = lambda s: html.escape(str(s), quote=True)
    image_tag = f'<img src="{esc(image)}" alt="Capa de {esc(title)}" loading="lazy">' if image else ""
    cards.append(f'<article class="article-card"><a href="{url}">{image_tag}<div class="article-content"><div class="real-kicker">{esc(category)} • {esc(date)}</div><h3>{esc(title)}</h3><p>{esc(description)}</p><span class="real-link">LER POST COMPLETO →</span></div></a></article>')
    article = markdown.markdown(body, extensions=["extra", "sane_lists"])
    page = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)} | O Peso da Camisa</title><meta name="description" content="{esc(description)}"><link rel="canonical" href="https://dacamisaopeso-art.github.io/o-peso-da-camisa/{url}"><meta name="robots" content="index,follow,max-image-preview:large"><style>body{{background:#07090b;color:#eee;font:17px/1.85 Arial,sans-serif;margin:0}}header,main,footer{{max-width:840px;margin:auto;padding:25px}}a{{color:#d8a83e}}h1{{font-size:clamp(32px,5vw,54px);line-height:1.15}}h2{{margin-top:40px}}p{{color:#ddd}}img{{max-width:100%;height:auto;border-radius:10px}}.tag{{color:#d8a83e;text-transform:uppercase;letter-spacing:2px;font-size:13px}}</style></head><body><header><a href="../">← O PESO DA CAMISA</a></header><main><div class="tag">{esc(category)} • {esc(date)}</div><h1>{esc(title)}</h1><p>{esc(description)}</p>{image_tag}<article>{article}</article><p><a href="../#blog">← Voltar ao blog</a></p></main><footer>O PESO DA CAMISA</footer></body></html>'''
    (OUT / (slug + ".html")).write_text(page, encoding="utf-8")

index_path = ROOT / "index.html"
index = index_path.read_text(encoding="utf-8")
start = "<!-- CMS_POSTS_START -->"
end = "<!-- CMS_POSTS_END -->"
if start not in index or end not in index:
    raise RuntimeError("Marcadores de publicações ausentes em index.html")
index = index.split(start)[0] + start + '<div class="article-grid">' + "".join(cards) + "</div>" + end + index.split(end, 1)[1]
index_path.write_text(index, encoding="utf-8")
print(f"Geradas {len(cards)} publicações")

# Sitemap atualizado a cada publicação, preservando as páginas institucionais e os artigos fixos.
base_url = "https://dacamisaopeso-art.github.io/o-peso-da-camisa/"
fixed_urls = ["", "kaka-da-superacao-a-bola-de-ouro.html", "robinho-da-promessa-a-queda.html", "sobre-nos.html", "contato.html", "politica-de-privacidade.html", "jogos.html", "desafio-das-lendas.html", "desafio-da-champions.html", "jogo-da-velha.html", "forja-de-craques/", "creditos-jogo-da-velha.html", "fontes-jogo-da-velha.html"]
namespace = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", namespace)
urlset = ET.Element(f"{{{namespace}}}urlset")
for relative_url in fixed_urls + sorted(post_urls):
    ET.SubElement(ET.SubElement(urlset, f"{{{namespace}}}url"), f"{{{namespace}}}loc").text = base_url + relative_url
ET.indent(urlset, space="  ")
ET.ElementTree(urlset).write(ROOT / "sitemap.xml", encoding="utf-8", xml_declaration=True)
print(f"Sitemap atualizado com {len(fixed_urls) + len(post_urls)} URLs")
