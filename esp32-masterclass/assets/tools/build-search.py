#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ساخت نمایه جستجوی سایت (فقط کتابخانه استاندارد پایتون).

همه صفحه‌های فارسی (ریشه) و انگلیسی (پوشه en/) را می‌خواند و دو فایل می‌سازد:
  assets/search-fa.json  و  assets/search-en.json
هر ردیف: {"u": "3-1.html#serial-input", "t": "عنوان بخش", "p": "عنوان صفحه", "x": "حدود ۳۰۰ نویسه اول متن",
          "k": "واژه‌های بیشتر همان بخش (برای پیدا کردن)", "y": "s|p|f|g"}
  y: s = بخش (h2/h3)، p = خود صفحه، f = نام فایل کد (data-file)، g = اصطلاح واژه‌نامه
اجرا (از هر جایی):  python3 assets/tools/build-search.py
هر بار که صفحه‌ای اضافه یا عوض شد دوباره اجرا کن.
"""
import glob
import html
import json
import os
import re
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASSETS = os.path.join(ROOT, "assets")
X_LEN = 300          # طول خلاصه نمایش داده‌شده
K_LEN = 900         # سقف طول واژه‌های اضافه هر بخش (برای کوچک ماندن فایل)
SKIP_TAGS = {"script", "style", "pre", "svg", "noscript", "template", "button"}
BLOCK_TAGS = {"p", "li", "div", "td", "th", "tr", "br", "h1", "h2", "h3", "h4", "figcaption", "summary", "section", "ul", "ol", "table", "details"}
VOID = {"br", "img", "hr", "input", "meta", "link", "source", "wbr", "col", "area", "base", "embed", "param", "track"}


def norm_space(s):
    return re.sub(r"\s+", " ", s).strip()


class PageParser(HTMLParser):
    """متن داخل <article class="page"> را به بخش‌های h2/h3 می‌شکند."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_article = 0      # عمق تگ‌ها داخل article
        self.skip = 0            # عمق تگ‌های نادیده (script/pre/svg...)
        self.heading = None      # {"tag","id","text"} وقتی داخل h2/h3 هستیم
        self.sections = [{"level": 1, "id": None, "title": None, "text": [], "files": []}]
        self.h2_count = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if not self.in_article:
            if tag == "article" and "page" in (a.get("class") or "").split():
                self.in_article = 1
            return
        if tag not in VOID:
            self.in_article += 1
        if a.get("data-file") and self.sections:
            self.sections[-1]["files"].append(a["data-file"])
        if self.skip:
            if tag not in VOID:
                self.skip += 1
            return
        if tag in SKIP_TAGS or "mermaid" in (a.get("class") or "").split():
            self.skip = 1
            return
        if tag in ("h2", "h3"):
            if tag == "h2":
                self.h2_count += 1
            self.heading = {"tag": tag, "id": a.get("id"), "text": [], "n2": self.h2_count}
            return
        if tag in BLOCK_TAGS:
            self._add(" ")

    def handle_endtag(self, tag):
        if not self.in_article:
            return
        if tag not in VOID:
            self.in_article -= 1
        if self.skip:
            self.skip -= 1
            return
        if self.heading and tag == self.heading["tag"]:
            h = self.heading
            self.heading = None
            self.sections.append({"level": 2 if h["tag"] == "h2" else 3, "id": h["id"], "n2": h["n2"],
                                  "title": norm_space("".join(h["text"])), "text": [], "files": []})
            return
        if tag in BLOCK_TAGS:
            self._add(" ")

    def handle_data(self, data):
        if not self.in_article or self.skip:
            return
        if self.heading is not None:
            self.heading["text"].append(data)
        else:
            self._add(data)

    def _add(self, s):
        self.sections[-1]["text"].append(s)


def page_title(src):
    m = re.search(r"<title>(.*?)</title>", src, re.S)
    t = html.unescape(m.group(1)).strip() if m else ""
    # «عنوان درس · مستر کلاس ESP32» → فقط عنوان درس
    if " · " in t:
        t = t.rsplit(" · ", 1)[0].strip()
    return t


def words(text):
    return re.findall(r"[\w؀-ۿ‌.+#-]{2,}", text.lower())


def build(lang):
    folder = ROOT if lang == "fa" else os.path.join(ROOT, "en")
    files = sorted(glob.glob(os.path.join(folder, "*.html")))
    out = []
    for path in files:
        name = os.path.basename(path)
        src = open(path, encoding="utf-8").read()
        if 'class="page"' not in src:
            continue
        ptitle = page_title(src)
        p = PageParser()
        p.feed(src)
        h2_total = p.h2_count
        anchor = None
        for i, sec in enumerate(p.sections):
            text = norm_space("".join(sec["text"]))
            if sec["level"] == 1:
                u, title, kind = name, ptitle, "p"
            else:
                sid = sec["id"]
                # همان شناسه‌ای که app.js به h2 بی‌شناسه می‌دهد: s1، s2، ...
                if not sid and sec["level"] == 2 and h2_total > 1:
                    sid = "s%d" % sec["n2"]
                if sid:
                    anchor = sid
                elif sec["level"] == 2:
                    anchor = None
                u = name + ("#" + (sid or anchor) if (sid or anchor) else "")
                title, kind = sec["title"], "s"
            if not title:
                continue
            x = text[:X_LEN]
            # واژه‌های یکتای بقیه بخش تا جستجو فقط به ۳۰۰ نویسه اول محدود نشود
            seen, extra = set(words(x + " " + title)), []
            for w in words(text[X_LEN:]):
                if w not in seen:
                    seen.add(w)
                    extra.append(w)
            k = " ".join(extra)[:K_LEN]
            row = {"u": u, "t": title, "p": ptitle, "x": x, "y": kind}
            if k:
                row["k"] = k
            out.append(row)
            for f in dict.fromkeys(sec["files"]):
                out.append({"u": u, "t": f, "p": ptitle, "x": title, "y": "f"})
    # اصطلاح‌های واژه‌نامه
    gfile = os.path.join(ASSETS, "glossary.js" if lang == "fa" else "glossary-en.js")
    gsrc = open(gfile, encoding="utf-8").read()
    gpage = os.path.join(folder, "glossary.html")
    gtitle = page_title(open(gpage, encoding="utf-8").read()) if os.path.exists(gpage) else "Glossary"
    S = r'"((?:[^"\\]|\\.)*)"'
    for m in re.finditer(r'^\s*' + S + r'\s*:\s*\[\s*' + S + r'\s*,\s*' + S + r'\s*\]', gsrc, re.M):
        key, full, desc = (json.loads('"' + g + '"') for g in m.groups())
        out.append({"u": "glossary.html", "t": full if key.lower() in full.lower() else key + " — " + full,
                    "p": gtitle, "x": desc[:X_LEN], "y": "g"})
    dest = os.path.join(ASSETS, "search-%s.json" % lang)
    with open(dest, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(",", ":"))
    print("%s: %d pages, %d entries, %d KB -> %s" % (lang, len(files), len(out), os.path.getsize(dest) // 1024, os.path.relpath(dest, ROOT)))


if __name__ == "__main__":
    build("fa")
    build("en")
