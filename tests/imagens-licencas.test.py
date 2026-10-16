"""Regressões de direitos, créditos e imagens efetivamente utilizadas."""
import json,re,sys,unittest,hashlib
from pathlib import Path
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'scripts'))
from image_rights import cover_record, REGISTRY, IMAGES
class ImageRightsTests(unittest.TestCase):
 def test_all_blog_covers_have_commercial_record_and_attribution(self):
  for slug,key in REGISTRY['blog'].items():
   row=cover_record(key)
   self.assertTrue(row['verified']);self.assertIs(row['commercial'],True)
   page=(ROOT/'publicacoes'/f'{slug}.html').read_text(encoding='utf-8')
   self.assertIn('<figcaption class="image-credit">',page)
   self.assertIn(row['id'],page)
   self.assertIn(row['id'],(ROOT/'creditos-imagens.html').read_text(encoding='utf-8'))
 def test_unaudited_images_are_rejected(self):
  for value in ['https://commons.wikimedia.org/wiki/Special:FilePath/Unverified.jpg','imagens/logo-opc.jpg','imagens/unknown.jpg']:
   with self.assertRaises(ValueError):cover_record(value)
 def test_noncommercial_or_no_derivatives_are_rejected(self):
  key='https://example.com/teste.jpg'
  for license in ['CC BY-NC 4.0','CC BY-ND 4.0','Fair use','Todos os direitos reservados']:
   IMAGES[key]={'key':key,'verified':True,'commercial':True,'kind':'photo','license':license}
   with self.assertRaises(ValueError):cover_record(key)
  del IMAGES[key]
 def test_exact_licensed_local_photographs(self):
  for row in REGISTRY['images']:
   if row['key'].startswith('imagens/') and row['kind']=='photo':
    self.assertEqual(hashlib.sha1((ROOT/row['key']).read_bytes()).hexdigest(),row['sha1'])
 def test_unapproved_art_is_not_referenced(self):
  forbidden=['walter-firmopelep012','desafio-lendas-banner.webp','img.youtube.com','data:image/webp;base64']
  for p in [*ROOT.glob('*.html'),ROOT/'escudos-champions.js',ROOT/'site-ajustes.js']:
   for token in forbidden:self.assertNotIn(token,p.read_text(encoding='utf-8'),str(p))
  for file in ['walter-firmopelep012cro610f1-1-031090x1600-1024x1503.jpg','desafio-lendas-banner.webp']:
   self.assertFalse((ROOT/'imagens'/file).exists())
 def test_svg_art_has_no_remote_or_embedded_raster(self):
  for p in (ROOT/'imagens').glob('*.svg'):
   ET.fromstring(p.read_text(encoding='utf-8'))
   self.assertNotRegex(p.read_text(encoding='utf-8'),r'<(?:image|script)\b')
 def test_inventory_has_individual_sources_and_revisions(self):
  data=json.loads((ROOT/'docs/auditoria-imagens-2026-10-16.json').read_text(encoding='utf-8'))
  self.assertGreaterEqual(len(data['commons']),2135)
  self.assertEqual(len(data['localBefore']),277)
  for row in data['commons']:
   if row['verified']:
    self.assertTrue(row['author']);self.assertTrue(row['sourceCredit']);self.assertTrue(row['revision']);self.assertTrue(row['license'])
if __name__=='__main__':unittest.main()
