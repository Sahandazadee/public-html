import re,json,glob,html,os,sys
W=os.environ.get('ESP32MC_WORK','/tmp/esp32mc')+'/'
def board_pins(name):
    p=W+'wboards/boards/'+name+'/board.json'
    if os.path.exists(p):
        t=re.sub(r'/\*.*?\*/','',open(p).read(),flags=re.S); t=re.sub(r'(?m)^\s*//.*$','',t); t=re.sub(r'(?m)//[^"\n]*$','',t); t=re.sub(r',(\s*[}\]])',r'\1',t); return set(json.loads(t)['pins'].keys())
def elem_pins(t):
    p=W+'welem/src/'+t+'-element.ts'
    if not os.path.exists(p): return None
    s=open(p).read()
    names=set(re.findall(r"name:\s*'([^']+)'",s))|set(re.findall(r'name:\s*"([^"]+)"',s))
    # generated pin names like `${i}` patterns ignored
    return names or None
def pins_for(t):
    if t.startswith('board-'): return board_pins(t[6:])
    if t.startswith('wokwi-'): return elem_pins(t[6:])
files=sys.argv[1:] or sorted(glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../[1-6]-*.html')))
bad=0
for f in files:
    s=open(f).read()
    for k,m in enumerate(re.finditer(r'<div class="wokwi"[^>]*>(.*?)</div>\s*(?=<|$)',s,re.S)):
        js=re.search(r'<script type="application/json">(.*?)</script>',m.group(1),re.S)
        if not js: continue
        try: d=json.loads(js.group(1))
        except Exception as e: print(os.path.basename(f),k,'JSON ERROR',e); bad+=1; continue
        types={p['id']:p['type'] for p in d['parts']}
        for c in d['connections']:
            for end in c[:2]:
                if end.startswith('$'): continue
                pid,pin=end.split(':',1)
                if pid not in types: print(os.path.basename(f),k,'unknown part id',end); bad+=1; continue
                ps=pins_for(types[pid])
                if ps is None: print(os.path.basename(f),k,'? no pin info for',types[pid]); continue
                if pin not in ps: print(os.path.basename(f),k,'BAD PIN',end,'(',types[pid],') valid:',sorted(ps)[:12]); bad+=1
print('issues:',bad)
