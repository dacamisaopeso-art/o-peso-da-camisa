from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
ROOT=Path(__file__).resolve().parent/'app/src/main/assets/www'
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(ROOT),**kwargs)
 def end_headers(self): self.send_header('Cache-Control','no-store');super().end_headers()
 def list_directory(self,path): self.send_error(403);return None
ThreadingHTTPServer(('127.0.0.1',5202),Handler).serve_forever()
