"""Combine/minify the maintained CSS sources; no runtime/build dependency.
Run after editing main.css or fonts.css: python tools/build_css.py
"""
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
def minify(css):
    tokens=[];i=0;quote=None;space=False
    while i<len(css):
        c=css[i]
        if quote:
            tokens.append(c)
            if c=='\\' and i+1<len(css):i+=1;tokens.append(css[i])
            elif c==quote:quote=None
        elif css[i:i+2]=='/*':
            end=css.find('*/',i+2)
            if end==-1:raise ValueError('Unclosed CSS comment')
            i=end+1
        elif c in ['"',"'"]:
            if space and tokens and tokens[-1] not in '{;},':tokens.append(' ')
            space=False;quote=c;tokens.append(c)
        elif c.isspace():space=True
        else:
            if space and tokens and tokens[-1] not in '{;},' and c not in '{};,':tokens.append(' ')
            space=False;tokens.append(c)
        i+=1
    if quote:raise ValueError('Unclosed CSS string')
    return ''.join(tokens).strip()
css='\n'.join((ROOT/'assets/css'/name).read_text(encoding='utf-8') for name in ['fonts.css','main.css'])
output=minify(css)
(ROOT/'assets/css/site.min.css').write_text(output+'\n',encoding='utf-8',newline='\n')
for file in ROOT.glob('*.html'):
    s=file.read_text(encoding='utf-8')
    s=s.replace('<link rel="stylesheet" href="/assets/css/fonts.css">','')
    s=s.replace('<link rel="stylesheet" href="/assets/css/main.css">','<link rel="stylesheet" href="/assets/css/site.min.css">')
    s=s.replace('rgba(255,255,255,.45)','rgba(255,255,255,.7)')
    file.write_text(s,encoding='utf-8',newline='\n')
print(f'CSS: {len(css.encode())} -> {len(output.encode())} bytes')
