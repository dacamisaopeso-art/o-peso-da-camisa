"""Markdown editorial com HTML limitado e URLs sem esquemas executáveis."""
import re
from urllib.parse import urlsplit
import nh3

def safe_image_url(value):
    value = str(value).strip()
    if not value or re.search(r'[\x00-\x20\x7f\\]', value):
        return ''
    parsed = urlsplit(value)
    if parsed.scheme:
        return value if parsed.scheme == 'https' and parsed.hostname and not parsed.username else ''
    return value if not value.startswith('//') and ':' not in value.split('/')[0] else ''

def clean_article(value):
    return nh3.clean(value,
        tags={'p','br','hr','h2','h3','h4','h5','h6','strong','em','b','i','u','s','blockquote','ul','ol','li','a','img','figure','figcaption','pre','code','table','thead','tbody','tr','th','td','sup','sub'},
        clean_content_tags={'script','style','iframe','object','embed','svg','math','form','input','button'},
        attributes={'a':{'href','title'},'img':{'src','alt','title','width','height','loading'},'th':{'scope','colspan','rowspan'},'td':{'colspan','rowspan'}},
        url_schemes={'https','mailto'},link_rel='noopener noreferrer')
