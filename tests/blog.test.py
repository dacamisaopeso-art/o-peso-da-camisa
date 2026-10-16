"""Regressões do blog: ordem, capas, sitemap e preservação do conteúdo."""
import re
import subprocess
import sys
import tempfile
import shutil
import unittest
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
from xml.etree import ElementTree as ET
import yaml
ROOT = Path(__file__).resolve().parent.parent
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

class Images(HTMLParser):
    def __init__(self):
        super().__init__(); self.images = []
    def handle_starttag(self, tag, attrs):
        if tag == 'img': self.images.append(dict(attrs))

class BlogTests(unittest.TestCase):
    def test_order_and_preserved_cards(self):
        index = (ROOT/'index.html').read_text(encoding='utf-8')
        block = index.split('<!-- CMS_POSTS_START -->')[1].split('<!-- CMS_POSTS_END -->')[0]
        dates = re.findall(r' • (\d{4}-\d{2}-\d{2})', block)
        self.assertEqual(dates, sorted(dates, reverse=True))
        self.assertEqual(len(dates), len(list((ROOT/'posts').glob('*.md'))))
        for name in ['kaka-da-superacao-a-bola-de-ouro.html','robinho-da-promessa-a-queda.html']:
            self.assertIn('href="'+name+'"', index)

    def test_local_covers_resolve_from_both_depths(self):
        for page in [ROOT/'index.html', * (ROOT/'publicacoes').glob('*.html')]:
            parser = Images(); parser.feed(page.read_text(encoding='utf-8'))
            for img in parser.images:
                if 'data-blog-cover' not in img: continue
                src = img['src']
                if urlsplit(src).scheme: continue
                self.assertFalse(src.startswith('/'), src)
                self.assertTrue((page.parent/unquote(urlsplit(src).path)).is_file(), src)

    def test_sitemap_exact_current_routes(self):
        locs = [e.text for e in ET.parse(ROOT/'sitemap.xml').findall('s:url/s:loc', NS)]
        self.assertEqual(len(locs),len(set(locs)))
        for loc in locs:
            route = loc.split('/o-peso-da-camisa/',1)[1]
            target = ROOT/route
            self.assertTrue((target/'index.html' if target.is_dir() else target).is_file(), route)
            self.assertNotIn('teste-de-publicacao', route)
        for post in (ROOT/'posts').glob('*.md'):
            self.assertIn('https://dacamisaopeso-art.github.io/o-peso-da-camisa/publicacoes/'+post.stem+'.html',locs)
        self.assertIn('content="noindex,follow"',(ROOT/'publicacoes/teste-de-publicacao.html').read_text(encoding='utf-8'))

    def test_relative_cover_and_repeated_generation(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            shutil.copytree(ROOT/'scripts',root/'scripts')
            (root/'dados').mkdir()
            shutil.copy2(ROOT/'dados/licencas-imagens.json',root/'dados/licencas-imagens.json')
            shutil.copytree(ROOT/'posts',root/'posts')
            shutil.copytree(ROOT/'publicacoes',root/'publicacoes')
            (root/'imagens').mkdir()
            for p in (ROOT/'imagens').iterdir():
                if p.is_file(): shutil.copy2(p,root/'imagens'/p.name)
            shutil.copy2(ROOT/'index.html',root/'index.html')
            for e in ET.parse(ROOT/'sitemap.xml').findall('s:url/s:loc',NS):
                route=e.text.split('/o-peso-da-camisa/',1)[1]
                target=root/(route+'index.html' if not route or route.endswith('/') else route)
                if not target.exists(): target.parent.mkdir(parents=True,exist_ok=True); target.write_text('page',encoding='utf-8')
            (root/'posts/zz-regression.md').write_text('---\ntitle: Teste\ndate: 2026-10-16\nimage: imagens/blog-capa-padrao.svg\n---\nTexto **preservado**.\n',encoding='utf-8')
            def generate(): subprocess.run([sys.executable,str(root/'scripts/gerar_blog.py')],check=True,capture_output=True)
            generate()
            page=(root/'publicacoes/zz-regression.html').read_text(encoding='utf-8')
            self.assertIn('src="../imagens/blog-capa-padrao.svg"',page)
            self.assertIn('Texto <strong>preservado</strong>.',page)
            before={str(p.relative_to(root)):p.read_bytes() for p in [root/'index.html',root/'sitemap.xml',*(root/'publicacoes').glob('*.html')]}
            generate()
            self.assertEqual(before,{p:(root/p).read_bytes() for p in before})
            (root/'posts/zz-regression.md').write_text('---\ntitle: Teste\ndate: 2026-10-16\nimage: imagens/nao-existe.jpg\n---\nTexto\n',encoding='utf-8')
            with self.assertRaises(subprocess.CalledProcessError):generate()

if __name__ == '__main__': unittest.main()
