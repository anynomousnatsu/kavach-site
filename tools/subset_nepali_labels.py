"""Refresh the small Nepali face used only for fixed labels on English pages.
The complete Nepali pages keep the full Devanagari font. Uses free Google Fonts.
Run this, then tools/build_css.py, after changing Nepali labels on English HTML.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlencode
import hashlib,re,urllib.request
ROOT=Path(__file__).resolve().parents[1]
class Text(HTMLParser):
    def __init__(self):super().__init__();self.skip=0;self.parts=[]
    def handle_starttag(self,t,a):
        if t in ['script','style']:self.skip+=1
    def handle_endtag(self,t):
        if t in ['script','style']:self.skip=max(0,self.skip-1)
    def handle_data(self,d):
        if not self.skip:self.parts.append(d)
text=Text()
for file in ROOT.glob('*.html'):
    if file.stem not in ['nepali','contact-nepali']:text.feed(file.read_text(encoding='utf-8'))
chars=''.join(sorted(set(c for c in ''.join(text.parts) if 0x900<=ord(c)<=0x97f)))+' '
url='https://fonts.googleapis.com/css2?'+urlencode({'family':'Noto Sans Devanagari:wght@400..800','text':chars,'display':'swap'})
ua='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
def fetch(u):return urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':ua}),timeout=30).read()
css=fetch(url).decode();source=re.search(r'url\((https://[^)]+)\)',css).group(1);data=fetch(source);assert data[:4]==b'wOF2'
name='noto-sans-devanagari-labels-'+hashlib.sha256(data).hexdigest()[:8]+'.woff2';(ROOT/'assets/fonts'/name).write_bytes(data)
target=ROOT/'assets/css/fonts.css';original=target.read_text(encoding='utf-8').split('/* Fixed Nepali labels on English pages */')[0].rstrip()
original=original.replace("font-family: 'Noto Sans Devanagari';","font-family: 'Kavach Devanagari';")
target.write_text(original+'\n\n/* Fixed Nepali labels on English pages */\n'+css.replace(source,'/assets/fonts/'+name)+'\n',encoding='utf-8')
print(f'Nepali fixed-label subset: {len(data)} bytes; full Nepali font retained')
