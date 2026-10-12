"""Check crawlable static pages, metadata, JSON-LD, links and language pairs.
Run from the repo root: python tools/check_site.py [http://localhost:8737]
"""
import json, re, sys, urllib.request, urllib.error
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, urljoin
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
BASE=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8737'
DOMAIN='https://kavachpest.com'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.links=[];self.assets=[];self.ids=[];self.labels=[];self.controls=[];self.head={};self.h1=0;self.headings=[];self.alternates={};self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if re.fullmatch(r'h[1-6]',tag):self.headings.append(int(tag[1]))
        if tag=='a':self.links.append(a.get('href',''))
        if tag=='meta':self.head[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.head['canonical']=a.get('href')
        if tag=='link' and a.get('rel')=='alternate':self.alternates[a.get('hreflang')]=a.get('href')
        if tag=='link' and a.get('rel') in ['stylesheet','icon','preload']:self.assets.append(a.get('href',''))
        if tag=='script' and a.get('src'):self.assets.append(a['src'])
        if tag in ['img','source']:
            if a.get('src'):self.assets.append(a['src'])
            for entry in a.get('srcset','').split(','):
                if entry.strip():self.assets.append(entry.strip().split()[0])
        if tag=='label':self.labels.append(a.get('for'))
        if tag in ['input','textarea','select'] and a.get('type')!='hidden':self.controls.append(a.get('id'))
cache={}
def fetch(path):
    if path in cache:return cache[path]
    try:
        with urllib.request.urlopen(BASE+path,timeout=10) as r:result=r.status,r.read()
    except urllib.error.HTTPError as e:result=e.code,e.read()
    cache[path]=result
    return result
errors=[];pages={};seen_titles=set();indexed=[]
for file in ROOT.glob('*.html'):
    s=file.read_text(encoding='utf-8');p=Page(s);path='/' if file.stem=='index' else '/'+file.stem;pages[path]=p
    assert p.head.get('canonical'),file
    if p.h1!=1:errors.append(f'{path}: H1 count {p.h1}')
    if any(b>a+1 for a,b in zip(p.headings,p.headings[1:])):errors.append(f'{path}: skipped heading level')
    title=re.search(r'<title>(.*?)</title>',s).group(1)
    if title in seen_titles:errors.append(f'{path}: duplicate title')
    seen_titles.add(title)
    if '\ufffd' in s or re.search(r'\?{3,}',s):errors.append(f'{path}: text encoding corruption')
    if len(p.ids)!=len(set(p.ids)):errors.append(f'{path}: duplicate IDs')
    if any(c not in p.labels for c in p.controls):errors.append(f'{path}: control without explicit label')
    for block in re.findall(r'<script type="application/ld\+json">([\s\S]*?)</script>',s):
        graph=json.loads(block).get('@graph',[])
        business=[n for n in graph if n.get('@type')=='LocalBusiness']
        if not business or business[0].get('@id')!=DOMAIN+'/#business':errors.append(f'{path}: inconsistent business ID')
        if any(n.get('@type')=='FAQPage' for n in graph):errors.append(f'{path}: retired FAQ markup')
        if business and any(k in business[0] for k in ['address','aggregateRating','review','openingHoursSpecification']):errors.append(f'{path}: unconfirmed business detail')
    if 'noindex' not in p.head.get('robots',''):indexed.append(p.head['canonical'])
    if fetch(path)[0]!=200:errors.append(f'{path}: not 200')
    for asset in p.assets:
        if asset.startswith('/') and fetch(asset)[0]!=200:errors.append(f'{path}: broken asset {asset}')
for path,p in pages.items():
    for href in p.links:
        if not href or href.startswith(('tel:','mailto:')):continue
        u=urlsplit(urljoin(DOMAIN+path,href))
        if u.netloc!='kavachpest.com':continue
        if '.html' in u.path:errors.append(f'{path}: redirecting HTML link {href}')
        dest=pages.get(u.path)
        if dest and u.fragment and u.fragment not in dest.ids:errors.append(f'{path}: missing fragment {href}')
        if fetch(u.path)[0]!=200:errors.append(f'{path}: broken link {href}')
    for lang,url in p.alternates.items():
        target=pages.get(urlsplit(url).path)
        if not target or target.alternates!=p.alternates:errors.append(f'{path}: missing hreflang reciprocity {lang}')
    if p.alternates and p.head['canonical'] not in p.alternates.values():errors.append(f'{path}: no self alternate')
sitemap=ET.parse(ROOT/'sitemap.xml');listed=[n.text for n in sitemap.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
if set(listed)!=set(indexed) or len(listed)!=len(set(listed)):errors.append('Sitemap/indexable URL mismatch')
if fetch('/missing-site-check')[0]!=404:errors.append('Missing URL does not return 404')
for private in ['/README.md','/tools/check_site.py','/.git/config']:
    if fetch(private)[0]!=404:errors.append('Private path publicly served: '+private)
print(json.dumps({'html_pages':len(pages),'indexable_pages':len(indexed),'sitemap_urls':len(listed),'errors':sorted(set(errors))},indent=2))
sys.exit(bool(errors))
