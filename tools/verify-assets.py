"""Check resources and configured invitation actions without opening external apps."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
from urllib.parse import urlparse, unquote

root = Path(__file__).resolve().parents[1]
references = []

class Resources(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('src', 'href'):
            if key in attrs:
                references.append(attrs[key])
        for key in ('imagesrcset', 'srcset'):
            references.extend(candidate.strip().split()[0] for candidate in attrs.get(key, '').split(',') if candidate.strip())

html = (root / 'index.html').read_text(encoding='utf-8')
css = (root / 'style.css').read_text(encoding='utf-8')
script = (root / 'script.js').read_text(encoding='utf-8')
Resources().feed(html)
references.extend(re.findall(r"url\('([^']+)'\)", css))
for resource in references:
    parsed = urlparse(resource)
    if not parsed.scheme and parsed.path:
        assert (root / unquote(parsed.path)).is_file(), f'Missing asset: {resource}'
assert '5531988776013' in script
assert '22:00' in html and 'google.com/maps' in html
assert 'fonts.googleapis' not in html
assert 'effectsToggle' not in html + script
assert 'floral-background.png' not in html + css
json.loads((root / 'vercel.json').read_text())
print('OK: local assets, font preloads, responsive images, Maps, WhatsApp, 22:00 and Vercel configuration.')
