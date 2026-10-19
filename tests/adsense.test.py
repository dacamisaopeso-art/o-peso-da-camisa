"""Integração publicitária: cobertura, idempotência e preservação da CSP."""
import sys,re,html,unittest
from pathlib import Path
from xml.etree import ElementTree as ET
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'scripts'))
from site_policies import protect,public_pages,adsense_eligible,ADSENSE_URL

class Scripts(HTMLParser):
 def __init__(self):super().__init__();self.in_head=False;self.ads=[]
 def handle_starttag(self,tag,attrs):
  if tag=='head':self.in_head=True
  attrs=dict(attrs)
  if tag=='script' and 'adsbygoogle.js' in attrs.get('src',''):self.ads.append((self.in_head,attrs))
 def handle_endtag(self,tag):
  if tag=='head':self.in_head=False

class AdSenseTests(unittest.TestCase):
 def test_games_and_catalogue_never_load_adsense(self):
  for route in ['jogos.html','adivinhe-pela-carreira.html','desafio-da-champions.html','desafio-das-lendas.html','escalacao-historica.html','intruso-da-camisa.html','jogo-da-velha.html','forja-de-craques/index.html','fontes-jogo-da-velha.html']:
   with self.subTest(route=route):
    text=(ROOT/route).read_text(encoding='utf-8')
    self.assertNotIn('adsbygoogle.js',text)
    self.assertNotIn('adsbygoogle.js',protect(text))
    self.assertNotIn("https: 'unsafe-eval'",html.unescape(text))
 def test_editorial_coverage_independent_of_eligibility(self):
  for path in [ROOT/'index.html',ROOT/'kaka-da-superacao-a-bola-de-ouro.html',ROOT/'robinho-da-promessa-a-queda.html',*(ROOT/'publicacoes').glob('*.html')]:
   if 'noindex' in path.read_text(encoding='utf-8'):continue
   with self.subTest(page=path.name):self.assertEqual(path.read_text(encoding='utf-8').count(ADSENSE_URL),1)
 def test_future_article_and_duplicate_loader(self):
  page='<html><head><meta charset="utf-8"><link rel="canonical" href="https://dacamisaopeso-art.github.io/o-peso-da-camisa/publicacoes/nova-materia.html"></head><body>Nova matéria</body></html>'
  first=protect(page,'../');self.assertEqual(first.count(ADSENSE_URL),1)
  duplicate=first.replace('</head>',f'<script async src="{ADSENSE_URL}" crossorigin="anonymous"></script></head>')
  self.assertEqual(protect(duplicate,'../'),first)
 def test_exactly_one_official_loader_in_head(self):
  for path in public_pages():
   text=path.read_text(encoding='utf-8');parser=Scripts();parser.feed(text)
   with self.subTest(page=str(path.relative_to(ROOT))):
    self.assertEqual(len(parser.ads),int(adsense_eligible(text)))
    if parser.ads:
     in_head,attrs=parser.ads[0];self.assertTrue(in_head);self.assertEqual(attrs['src'],ADSENSE_URL);self.assertIn('async',attrs);self.assertEqual(attrs['crossorigin'],'anonymous')
 def test_generation_is_idempotent_and_excludes_noindex(self):
  for text in ['<!doctype html><html><head><meta charset="utf-8"></head><body>Conteúdo</body></html>','<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"></head><body>Antiga</body></html>','<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=fontes-jogo-da-velha.html"></head><body>Redirecionando</body></html>']:
   first=protect(text);self.assertEqual(first,protect(first));self.assertEqual(first.count(ADSENSE_URL),int(adsense_eligible(text)))
 def test_sitemap_pages_are_indexable_and_integrated(self):
  for loc in ET.parse(ROOT/'sitemap.xml').getroot().iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
   route=loc.text.removeprefix('https://dacamisaopeso-art.github.io/o-peso-da-camisa/');p=ROOT/route
   if p.is_dir():p=p/'index.html'
   text=p.read_text(encoding='utf-8');self.assertNotIn('noindex',text);self.assertEqual(text.count(ADSENSE_URL),int(adsense_eligible(text)))
 def test_csp_allows_loader_and_keeps_inline_protection(self):
  for path in public_pages():
   text=path.read_text(encoding='utf-8')
   if not adsense_eligible(text):continue
   csp=html.unescape(re.search(r'http-equiv="Content-Security-Policy" content="([^"]+)"',text)[1]);scripts=csp.split('script-src ')[1].split(';')[0]
   self.assertIn('https:',scripts);self.assertNotIn("'unsafe-inline'",scripts);self.assertIn("object-src 'none'",csp)
 def test_ads_txt(self):
  self.assertEqual((ROOT/'ads.txt').read_text().strip(),'google.com, pub-9262477198650799, DIRECT, f08c47fec0942fa0')

if __name__=='__main__':unittest.main()
