#!/bin/bash
# Usage: check_lesson.sh 3-4   -> JS errors, walk ranges, <pre> escaping, compile every full sketch (core 3.3.12), Wokwi pin names
T=$(cd "$(dirname "$0")" && pwd); SITE=$(cd "$T/../../.." && pwd); W=${ESP32MC_WORK:-/tmp/esp32mc}; mkdir -p $W/shots/en; export ESP32MC_WORK=$W NODE_PATH=$W/node_modules:$NODE_PATH
L=$1; F=$SITE/$L.html; ID=${L//\//_}
echo "== JS errors:"; node $T/shot.js $L.html $W/shots/$L.png 1300 no
python3 - "$F" "$ID" <<'P'
import re,sys,html,os
f,L=sys.argv[1:]; s=open(f).read()
blocks=list(re.finditer(r'<div class="code"([^>]*)>\s*<pre>(.*?)</pre>',s,re.S))
ids={}
for i,m in enumerate(blocks):
    raw=m.group(2)
    if re.search(r'<(?!/?(span|b)\b)[a-zA-Z!/]',raw): print('UNESCAPED < in block',i)
    code=html.unescape(re.sub(r'<[^>]+>','',raw)).strip('\n'); n=code.count('\n')+1
    idm=re.search(r'id="([^"]+)"',m.group(1)); 
    if idm: ids[idm.group(1)]=n
    lang=re.search(r'data-lang="([^"]+)"',m.group(1)); lang=lang.group(1) if lang else 'cpp'
    if lang=='cpp' and 'setup(' in code and 'loop(' in code:
        W=os.environ.get('ESP32MC_WORK','/tmp/esp32mc'); os.makedirs(W+'/sk',exist_ok=True); open(f'{W}/sk/{L}_{i:02d}.cpp','w').write(code); print('SKETCH',f'{L}_{i:02d}')
for w in re.finditer(r'<ol class="walk"([^>]*)>(.*?)</ol>',s,re.S):
    fr=re.search(r'data-for="([^"]+)"',w.group(1))
    if not fr: print('walk without data-for (uses previous block)'); continue
    n=ids.get(fr.group(1))
    if n is None: print('walk data-for missing target',fr.group(1)); continue
    for r in re.findall(r'data-lines="([^"]+)"',w.group(2)):
        for seg in r.split(','):
            b=int(seg.split('-')[-1])
            if b>n: print('WALK RANGE',r,'> lines',n,'in',fr.group(1))
P
echo "== Compile:"; for id in $(ls $W/sk/${ID}_*.cpp 2>/dev/null | xargs -n1 basename | sed 's/.cpp//'); do $T/comp.sh $id; grep -E "error:" $W/skb/$id/log.txt | sed "s#$W/skb/[^/]*/##" | head -3; done
echo "== Wokwi pins:"; python3 $T/wokcheck.py $F
