#!/usr/bin/env python3
"""ابزار ساخت و راستی‌آزمایی دوره C (اجرا از هر جا: python3 c-az-sefr/assets/tools/build.py <دستور>)

دستورها:
  verify [درس...]  همه کدهای دارای data-verify را با کامپایلر واقعی می‌سازد و خروجی‌های نمایش‌داده‌شده را با اجرای واقعی مقایسه می‌کند
  index            ساخت search-fa.json، تجمیع glossary.js از glossary-src/*.json و به‌روز کردن آمار صفحه خانه
  check            بررسی‌های ساختاری: لینک‌های داخلی، شناسه‌های تکراری، شماره خط‌های walk، گزینه‌های آزمون
  all              verify + index + check

قواعد data-verify روی <div class="code">:
  host        gcc -std=c11 -Wall -Wextra ؛ اجرا می‌شود و خروجی با <pre class="term" data-from="فایل"> مقایسه می‌شود
  host-fail   باید کامپایل نشود؛ خط‌های <pre class="term" data-kind="err" data-from="فایل"> باید در stderr باشند
  arm-link    ساخت و لینک کامل ELF برای Cortex-M4 (با فایل .ld در همان پروژه؛ -nostdlib)
  make        اجرای make در پوشهٔ پروژه (Makefile هم یکی از بلاک‌های data-project باشد)
  arm         arm-none-eabi-gcc -mcpu=cortex-m4 -mthumb -ffreestanding -c (فقط کامپایل)
  frag        فقط برای مستندسازی؛ بررسی نمی‌شود
ویژگی‌های اختیاری: data-project=نام (چند فایل با هم)، data-cflags، data-libs، data-stdin، data-exit=کد خروج مورد انتظار، data-nocheck (خروجی مقایسه نشود)
"""
import sys, os, re, json, subprocess, tempfile, shutil, html
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]          # c-az-sefr/
ASSETS = ROOT / "assets"
FA = "۰۱۲۳۴۵۶۷۸۹"


def fa(n):
    return "".join(FA[int(c)] if c.isdigit() else c for c in str(n))


class Page(HTMLParser):
    """استخراج بلاک‌های کد، خروجی‌ها، عنوان‌ها و متن یک صفحه"""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []; self.codes = []; self.terms = []; self.heads = []; self.text = []
        self.cur = None; self.title = ""; self.in_title = False; self.cur_h = None
        self.ids = []; self.hrefs = []; self.quizzes = []; self.walks = []; self.widgets = 0
        self.cur_quiz = None; self.cur_walk = None; self.skip = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs); cls = a.get("class", "").split()
        if "id" in a: self.ids.append(a["id"])
        if tag == "a" and "href" in a: self.hrefs.append(a["href"])
        if tag == "title": self.in_title = True
        if tag == "div" and "code" in cls:
            self.cur = {"attrs": a, "text": "", "depth": len(self.stack)}
        if tag == "pre" and "term" in cls or tag == "pre" and "serial" in cls:
            self.cur = {"attrs": a, "text": "", "depth": len(self.stack), "term": True}
        if tag in ("h1", "h2", "h3"): self.cur_h = {"id": a.get("id", ""), "t": "", "tag": tag}
        if tag == "div" and "quiz" in cls:
            self.cur_quiz = {"answer": a.get("data-answer"), "opts": 0}; self.quizzes.append(self.cur_quiz)
        if tag == "li" and self.cur_quiz is not None: self.cur_quiz["opts"] += 1
        if tag == "ol" and "walk" in cls:
            self.cur_walk = {"for": a.get("data-for"), "lines": []}; self.walks.append(self.cur_walk)
        if tag == "li" and self.cur_walk is not None and "data-lines" in a: self.cur_walk["lines"].append(a["data-lines"])
        if tag == "div" and "widget" in cls: self.widgets += 1
        if tag in ("script", "style"): self.skip += 1
        self.stack.append((tag, cls))

    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
        if tag in ("script", "style"): self.skip -= 1
        if tag in ("h1", "h2", "h3") and self.cur_h:
            self.cur_h["t"] = self.cur_h["t"].strip()
            if self.cur_h["t"]: self.heads.append(self.cur_h)
            self.cur_h = None
        if tag == "ol" and self.cur_walk is not None: self.cur_walk = None
        if self.stack: self.stack.pop()
        if self.cur is not None and len(self.stack) <= self.cur["depth"]:
            (self.terms if self.cur.get("term") else self.codes).append(self.cur); self.cur = None
        if tag == "div" and self.cur_quiz is not None and len(self.stack) and False: pass

    def handle_data(self, d):
        if self.in_title: self.title += d
        if self.cur is not None: self.cur["text"] += d
        if self.cur_h is not None: self.cur_h["t"] += d
        if not self.skip: self.text.append(d)


def load(path):
    p = Page(); p.feed(Path(path).read_text(encoding="utf-8")); return p


def course_ids():
    js = (ASSETS / "course.js").read_text(encoding="utf-8")
    lessons = re.findall(r'\{\s*id:\s*"(\d+-\d+)"', js)
    extras = re.findall(r'\{\s*id:\s*"([a-z]+)"\s*,\s*title', js)
    return lessons, extras


def clean(t):
    return t.lstrip("\n").rstrip()


def run(cmd, cwd, stdin=None, timeout=10):
    return subprocess.run(cmd, cwd=cwd, input=stdin, capture_output=True, text=True, timeout=timeout, env=dict(os.environ, LC_ALL="C"))


def norm_out(s):
    return "\n".join(l.rstrip() for l in s.strip("\n").split("\n")).strip()


# ---------------------------------------------------------------- verify
def verify(only):
    lessons, _ = course_ids(); bad = 0; total = 0
    files = sorted(ROOT.glob("[0-9]-[0-9]*.html"))
    for f in files:
        lid = f.stem
        if only and lid not in only: continue
        pg = load(f)
        outdir = ROOT / "code" / lid; outdir.mkdir(parents=True, exist_ok=True)
        blocks = [c for c in pg.codes if c["attrs"].get("data-verify") and c["attrs"].get("data-verify") != "frag"]
        projects = {}
        singles = []
        for c in blocks:
            (projects.setdefault(c["attrs"]["data-project"], []).append(c) if c["attrs"].get("data-project") else singles.append(c))
        groups = [(c["attrs"].get("data-file", "x.c"), [c]) for c in singles] + list(projects.items())
        with tempfile.TemporaryDirectory() as td:
            for name, cs in groups:
                total += 1
                mode = cs[0]["attrs"]["data-verify"]; work = Path(td) / re.sub(r"\W", "_", name + "_" + str(total)); work.mkdir()
                srcs = []
                for c in cs:
                    fn = c["attrs"].get("data-file")
                    if not fn: print(f"[{lid}] ✗ بلاک بدون data-file"); bad += 1; continue
                    (work / fn).write_text(clean(c["text"]) + "\n", encoding="utf-8")
                    dst = (outdir / c["attrs"]["data-project"]) if c["attrs"].get("data-project") else outdir
                    dst.mkdir(parents=True, exist_ok=True)
                    (dst / fn).write_text(clean(c["text"]) + "\n", encoding="utf-8")
                    if fn.endswith(".c"): srcs.append(fn)
                if mode == "make":
                    r = run(["make"], work, timeout=60)
                    if r.returncode != 0 or (r.stderr.strip() and "data-warn-ok" not in cs[0]["attrs"]): print(f"[{lid}] ✗ {name}: make\n{r.stdout}{r.stderr}"); bad += 1
                    else: print(f"[{lid}] ✓ {name} (make)")
                    continue
                if not srcs: continue
                cflags = cs[0]["attrs"].get("data-cflags", "").split()
                libs = cs[0]["attrs"].get("data-libs", "-lm").split()
                exp_exit = int(cs[0]["attrs"].get("data-exit", "0"))
                try:
                    if mode.startswith("host"):
                        r = run(["gcc", "-std=c11", "-Wall", "-Wextra", *cflags, "-o", "prog", *srcs, *libs], work)
                        if mode == "host-fail":
                            if r.returncode == 0: print(f"[{lid}] ✗ {name}: باید کامپایل نشود ولی شد"); bad += 1; continue
                            for t in pg.terms:
                                if t["attrs"].get("data-from") == name:
                                    for line in clean(t["text"]).split("\n"):
                                        if line.strip() and not line.startswith("$ ") and line.strip() not in r.stderr:
                                            print(f"[{lid}] ✗ {name}: این خط خطا در stderr واقعی نیست:\n   {line}\n   --- واقعی ---\n{r.stderr}"); bad += 1; break
                            print(f"[{lid}] ✓ {name} (خطای کامپایل تأیید شد)"); continue
                        if r.returncode != 0: print(f"[{lid}] ✗ {name}: کامپایل نشد\n{r.stderr}"); bad += 1; continue
                        if r.stderr.strip() and "data-warn-ok" not in cs[0]["attrs"]: print(f"[{lid}] ⚠ {name}: هشدار کامپایلر:\n{r.stderr}"); bad += 1
                        rr = run(["./prog"], work, stdin=cs[0]["attrs"].get("data-stdin", "").replace("\\n", "\n") or None)
                        if rr.returncode != exp_exit: print(f"[{lid}] ✗ {name}: کد خروج {rr.returncode} (انتظار {exp_exit})"); bad += 1
                        for t in pg.terms:
                            if t["attrs"].get("data-from") == name and "data-nocheck" not in t["attrs"]:
                                shown = [l for l in clean(t["text"]).split("\n") if not l.startswith("$ ")]
                                if norm_out("\n".join(shown)) != norm_out(rr.stdout):
                                    print(f"[{lid}] ✗ {name}: خروجی نمایش‌داده‌شده با اجرای واقعی فرق دارد\n--- نمایش‌داده‌شده ---\n{norm_out(chr(10).join(shown))}\n--- واقعی ---\n{norm_out(rr.stdout)}"); bad += 1
                        print(f"[{lid}] ✓ {name}")
                    elif mode == "arm-link":
                        lds = [c["attrs"]["data-file"] for c in cs if c["attrs"].get("data-file", "").endswith(".ld")]
                        asm = [c["attrs"]["data-file"] for c in cs if c["attrs"].get("data-file", "").endswith(".S")]
                        cmd = ["arm-none-eabi-gcc", "-mcpu=cortex-m4", "-mthumb", "-std=gnu11", "-Wall", "-Wextra", "-ffreestanding", "-nostdlib", *cflags, *(["-T", lds[0]] if lds else []), "-o", "out.elf", *srcs, *asm]
                        r = run(cmd, work)
                        if r.returncode != 0 or (r.stderr.strip() and "data-warn-ok" not in cs[0]["attrs"]): print(f"[{lid}] ✗ {name}: (arm-link) {r.stderr}"); bad += 1
                        else: print(f"[{lid}] ✓ {name} (arm-link)")
                    elif mode == "arm":
                        r = run(["arm-none-eabi-gcc", "-mcpu=cortex-m4", "-mthumb", "-std=gnu11", "-Wall", "-Wextra", "-ffreestanding", *cflags, "-c", *srcs], work)
                        if r.returncode != 0 or (r.stderr.strip() and "data-warn-ok" not in cs[0]["attrs"]): print(f"[{lid}] ✗ {name}: (arm) {r.stderr}"); bad += 1
                        else: print(f"[{lid}] ✓ {name} (arm)")
                except subprocess.TimeoutExpired:
                    print(f"[{lid}] ✗ {name}: بیش از ۱۰ ثانیه طول کشید"); bad += 1
    print(f"\nراستی‌آزمایی: {total} گروه کد، {bad} مشکل"); return bad


# ---------------------------------------------------------------- index
def build_index():
    lessons, extras = course_ids(); docs = []; quiz_n = 0; walk_n = 0; code_n = 0; w_n = 0; ex_n = 0
    for pid in lessons + extras:
        f = ROOT / f"{pid}.html"
        if not f.exists(): continue
        raw = f.read_text(encoding="utf-8"); pg = load(f)
        title = re.sub(r"\s*·.*$", "", html.unescape(pg.title)).strip() or pid
        txt = re.sub(r"\s+", " ", " ".join(pg.text)).strip()
        docs.append({"id": pid, "title": title, "h": [{"id": h["id"], "t": h["t"]} for h in pg.heads if h["tag"] != "h1" and h["id"]], "text": txt[:14000]})
        quiz_n += len(pg.quizzes); walk_n += sum(len(w["lines"]) for w in pg.walks); code_n += len([c for c in pg.codes]); w_n += pg.widgets
        ex_n += raw.count('class="exercise"')
    (ASSETS / "search-fa.json").write_text(json.dumps(docs, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    # واژه‌نامه
    gl = {}
    for j in sorted((ASSETS / "glossary-src").glob("*.json")) if (ASSETS / "glossary-src").exists() else []:
        gl.update(json.loads(j.read_text(encoding="utf-8")))
    (ASSETS / "glossary.js").write_text("/* تولیدشده از glossary-src/*.json با build.py index؛ دستی ویرایش نکن */\nwindow.GLOSSARY = " + json.dumps(gl, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
    # آمار خانه
    idx = ROOT / "index.html"
    if idx.exists():
        h = idx.read_text(encoding="utf-8")
        for key, val in {"lessons": len(lessons), "quiz": quiz_n, "code": walk_n, "widget": w_n, "ex": ex_n, "term": len(gl)}.items():
            h = re.sub(r'(<b data-stat="%s">)[^<]*(</b>)' % key, lambda m: m.group(1) + fa(val) + m.group(2), h)
        idx.write_text(h, encoding="utf-8")
    print(f"ایندکس: {len(docs)} صفحه، {quiz_n} آزمون، {walk_n} توضیح خطی، {code_n} بلاک کد، {ex_n} تمرین، {w_n} ابزارک، {len(gl)} واژه")


# ---------------------------------------------------------------- check
def check():
    lessons, extras = course_ids(); errs = 0; allp = set(lessons + extras)
    gl_keys = set(); gj = ASSETS / "glossary-src"
    for j in gj.glob("*.json") if gj.exists() else []: gl_keys |= set(json.loads(j.read_text(encoding="utf-8")))
    for pid in sorted(allp):
        f = ROOT / f"{pid}.html"
        if not f.exists(): print(f"– {pid}: هنوز نوشته نشده"); continue
        raw = f.read_text(encoding="utf-8"); pg = load(f)
        def bad(msg):
            nonlocal errs; errs += 1; print(f"✗ {pid}: {msg}")
        dup = {i for i in pg.ids if pg.ids.count(i) > 1}
        if dup: bad(f"شناسه تکراری: {sorted(dup)}")
        for h in pg.hrefs:
            if h.startswith(("http", "mailto", "#", "data:", "javascript")): continue
            t = h.split("#")[0]
            if t and not (ROOT / t).exists(): bad(f"لینک داخلی شکسته: {h}")
            if "#" in h and t.endswith(".html") and (ROOT / t).exists():
                anchor = h.split("#")[1]
                if anchor and anchor not in load(ROOT / t).ids: bad(f"لنگر ناموجود: {h}")
        ids = set(pg.ids)
        for i, q in enumerate(pg.quizzes):
            if not q["answer"] or not q["answer"].isdigit() or not (1 <= int(q["answer"]) <= q["opts"]): bad(f"آزمون {i+1}: data-answer نامعتبر")
        codes = {c["attrs"].get("id"): c for c in pg.codes if c["attrs"].get("id")}
        for w in pg.walks:
            c = codes.get(w["for"]) if w["for"] else None
            if not c: bad(f"walk بدون کد مقصد ({w['for']})"); continue
            n = len(clean(c["text"]).split("\n"))
            for seg in w["lines"]:
                for part in seg.split(","):
                    ab = [int(x) for x in part.split("-") if x.strip().isdigit()]
                    if not ab or max(ab) > n or min(ab) < 1: bad(f"شماره خط {seg} خارج از {n} خط کد {w['for']}")
        for m in re.finditer(r'data-t="([^"]+)"', raw):
            if gl_keys and m.group(1) not in gl_keys: bad(f"واژه‌نامه ندارد: {m.group(1)}")
        if pid in lessons:
            for need in ('class="goals"', 'class="quiz"', 'class="exercise"', 'class="sum"', 'class="walk"'):
                if need not in raw: bad(f"جزء لازم نیست: {need}")
            if raw.count('class="quiz"') < 4: bad("کمتر از ۴ سؤال آزمون")
            if raw.count("<figure") < 2: bad("کمتر از ۲ شکل")
            if 'class="callout coach"' not in raw: bad("حرف مربی ندارد")
            if "<svg" not in raw: bad("SVG ندارد")
            if "youtube" in raw.lower() or "youtu.be" in raw.lower(): bad("لینک یوتیوب ممنوع است (وارسی‌پذیر نیست)")
    print(f"\nبررسی ساختاری: {errs} مشکل"); return errs


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "all"; rest = sys.argv[2:]
    if cmd == "verify": sys.exit(1 if verify(rest) else 0)
    elif cmd == "index": build_index()
    elif cmd == "check": sys.exit(1 if check() else 0)
    elif cmd == "all":
        a = verify(rest); build_index(); b = check(); sys.exit(1 if a or b else 0)
    else: print(__doc__)
