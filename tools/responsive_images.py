"""Create responsive delivery variants of the measured oversized gallery files.
Original illustrations, captions and fallbacks remain unchanged. Requires Pillow.
"""
from pathlib import Path
from PIL import Image
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
report=[]
version=sys.argv[1] if len(sys.argv)>1 else 'v2'
assert re.fullmatch(r'[a-z0-9-]+',version), 'Use a simple version suffix for fresh cache URLs'
sizes='(max-width: 759px) calc(100vw - 40px), (max-width: 819px) calc(100vw - 64px), (max-width: 1139px) calc((100vw - 96px) / 2), (max-width: 1279px) calc((100vw - 112px) / 2), 584px'
for stem in ['work-kitchen','work-hotel','work-warehouse']:
    original=ROOT/'assets/img'/(stem+'.jpg')
    with Image.open(original) as image:
        options={k:image.info[k] for k in ['exif','xmp','icc_profile'] if k in image.info}
        variants=[]
        for width in [480,800,1200]:
            target=ROOT/'assets/img'/f'{stem}-{width}-{version}.webp'
            resized=image.resize((width,round(image.height*width/image.width)),Image.Resampling.LANCZOS)
            resized.save(target,'WEBP',quality=80,method=6,**options)
            variants.append({'width':width,'bytes':target.stat().st_size,'file':target.name})
    source=f'<source srcset="/assets/img/{stem}.webp" type="image/webp">'
    replacement='<source srcset="'+', '.join(f'/assets/img/{v["file"]} {v["width"]}w' for v in variants)+'" sizes="'+sizes+'" type="image/webp">'
    for file in ROOT.glob('*.html'):
        content=file.read_text(encoding='utf-8')
        updated=re.sub(r'<source\b[^>]*srcset="[^"]*/'+stem+r'[^\"]*"[^>]*type="image/webp">',replacement,content)
        if updated!=content:file.write_text(updated,encoding='utf-8',newline='\n')
    report.append({'image':stem,'original_webp_bytes':(ROOT/'assets/img'/(stem+'.webp')).stat().st_size,'variants':variants})
for file in ROOT.glob('*.html'):
    content=file.read_text(encoding='utf-8')
    content=re.sub(r'<img\b[^>]*loading="lazy"[^>]*>',lambda m:m.group(0) if 'decoding=' in m.group(0) else m.group(0)[:-1]+' decoding="async">',content)
    file.write_text(content,encoding='utf-8',newline='\n')
print(json.dumps(report,indent=2))
