import html
import re
import sys
import unittest
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'scripts'))
from blog_security import clean_article, safe_image_url
from site_policies import public_pages, digest, Handlers

class SecurityTests(unittest.TestCase):
 def test_editorial_injections(self):
  for attack in ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>', '<a href="javascript:alert(1)">nome</a>', '<svg><a xlink:href="javascript:alert(1)">x</a></svg>', '<a href="java&#x73;cript:alert(1)">x</a>', '<iframe src="https://example.com"></iframe>']:
   result=clean_article('<h2>História</h2>'+attack+'<p>Texto preservado</p>')
   self.assertNotRegex(result,r'<(?:script|svg|iframe)|onerror=|javascript:')
   self.assertIn('<h2>História</h2>',result)
   self.assertIn('Texto preservado',result)
 def test_cover_urls(self):
  for value in ['javascript:alert(1)','data:text/html,x','//evil.example/a','https://user:pass@example.com/a','https://example.com/\nfoto','\\evil.example/a']:
   self.assertEqual(safe_image_url(value),'')
  self.assertEqual(safe_image_url('/o-peso-da-camisa/imagens/a.jpg'),'/o-peso-da-camisa/imagens/a.jpg')
  self.assertEqual(safe_image_url('https://example.com/a.jpg'),'https://example.com/a.jpg')
 def test_all_pages_and_dependencies(self):
  for path in public_pages():
   with self.subTest(page=path.name):
    page=path.read_text(encoding='utf-8')
    self.assertEqual(page.count('http-equiv="Content-Security-Policy"'),1)
    self.assertIn('site-base.js',page)
    self.assertIn('site-base.css',page)
    policy=html.unescape(re.search(r'<meta http-equiv="Content-Security-Policy" content="([^"]+)"',page)[1])
    self.assertIn("object-src 'none'",policy)
    script_policy=policy.split('script-src ')[1].split(';')[0]
    self.assertNotIn("'unsafe-inline'",script_policy)
    handlers=Handlers();handlers.feed(page)
    inline=[body for attrs,body in re.findall(r'<script\b([^>]*)>(.*?)</script\s*>',page,re.I|re.S) if not re.search(r'\bsrc\s*=',attrs,re.I) and not re.search(r'application/(?:ld\+)?json',attrs,re.I)]
    for source in inline+handlers.values:self.assertIn(digest(source),script_policy)
    class Links(HTMLParser):
     def handle_starttag(inner,tag,attrs):
      for key,value in attrs:
       if key not in ('src','href') or not value:continue
       parsed=urlsplit(value)
       if parsed.scheme or value.startswith(('#','//')):continue
       route=unquote(parsed.path)
       target=ROOT/route[len('/o-peso-da-camisa/'):] if route.startswith('/o-peso-da-camisa/') else path.parent/route
       self.assertTrue(target.exists(),str(path.relative_to(ROOT))+': '+value)
    Links().feed(page)

if __name__=='__main__':unittest.main()
