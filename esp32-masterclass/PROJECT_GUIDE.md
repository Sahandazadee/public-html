# ESP32 Masterclass: project guide for future sessions

Read this file first in any new chat about this site. It replaces the old chat history.
Live site: https://sahandazadee.github.io/public-html/esp32-masterclass/ (GitHub Pages from `master`).

## 1. Rules that never change
- **Git:** commit and push straight to `master` (repo root `CLAUDE.md`). Never create a branch.
- **Audience:** absolute beginners living in Canada, the US and Europe, reading Persian (RTL) or English (LTR). No Iran-specific wording (shops, ISPs, VPN, تومان, 220 V). Use "120 V in North America, 230 V in Europe". Use DigiKey, Mouser, Amazon or AliExpress as shop examples, and POSIX TZ strings with DST.
- **Quality first:** every fact, number and expected output must be checked. Sketches must compile and walks must point at the right lines.
- **Twins:** every content change goes into BOTH `X.html` (Persian) and `en/X.html` (English). Keep ids, `data-answer`, `data-lines`, `data-for` and option order identical. No Persian characters in `en/`.
- **Persian text on the site** uses correct half-spaces (ZWNJ: می‌کنی، دکمه‌ها). This is the site's style; the user's "no ZWNJ" preference applies to chat replies only.
- **Lists of parts:** always A, B, C, D (both languages), never الف/ب/ج.
- **Chat with the user:** Persian, RTL, a strict coach. Ask 4-option questions before big decisions. Explain code piece by piece. Report honestly what was verified and what was only counted.

## 2. Files
```
esp32-masterclass/
  index.html                 home: hero, stepper roadmap, chapter cards, progress panel (built by app.js)
  1-1 … 6-4.html             24 lessons (chapter-lesson). 5-4 FreeRTOS, 5-5 OTA+LittleFS, 5-6 APIs + big project
  pinout.html glossary.html troubleshooting.html tools.html cheatsheet.html credits.html   extras
  en/                        English twins of all 31 pages (same file names)
  assets/app.js              the whole UI engine (one file, Persian comments)
  assets/style.css           one stylesheet for both directions (logical properties inline-start/end)
  assets/course.js           window.COURSE: chapters, lessons (title, title_en, minutes, level), extras. Single source of truth for menu, prev/next, roadmap
  assets/glossary.js / glossary-en.js   tooltip terms (auto-highlight first occurrence; explicit <span class="term" data-t="KEY">)
  assets/search-fa.json / search-en.json   generated search index (do not edit by hand)
  assets/esp32-cheatsheet.pdf / -en.pdf     generated from cheatsheet.html
  assets/img/ fonts/ vendor/
  assets/tools/build-search.py   rebuild search index
  assets/tools/dev/              verification scripts (section 6)
```
Head of every page: `<html lang="fa" dir="rtl">` (en: `lang="en" dir="ltr"`), title "… · مستر کلاس ESP32" / "… · ESP32 Masterclass", meta description, `hreflang` alternates for both, then `style.css`, `course.js`, `glossary(-en).js`, `app.js` (`../assets/` in `en/`). No Google Fonts (fonts are self-hosted). In `en/`, links to the KiCad course are `../../kicad-9-tutorial/...`.

## 3. How app.js works (key facts)
- Builds the shell around `<article class="page" data-page="ID">`: top bar (search `/`, language toggle, theme, progress "n/24"), drawer menu, "On this page", prev/next, done box, footer.
- `LANG`/`EN` come from `<html lang>`. UI strings live in the `I18N` dict (`fa` and `en`), read with `t(key)`. Add every new UI string in both.
- Drawer: always starts closed and opens/closes only with the hamburger (`setNav(open)` toggles `body.nav-open` and `html.nav-lock`). Esc closes it, and clicking a link closes it. In Persian it sits at `right:0`.
- Code blocks: clicking a line with a note (`.has-note`) opens a `span.ln-note` under that range. There is also a "show all notes" button. "Copy code" and the Wokwi copy use `block._raw`, which holds code only.
- Quiz: `data-answer` is **1-based**. Wrong options may carry `data-why`. Picks are saved and replayed. Letters are A–D. The "I finished" box stays locked until every quiz on the page is solved.
- localStorage keys (never rename): `esp32mc-done`, `esp32mc-quiz`, `esp32mc-quizpick`, `esp32mc-lang`, `esp32mc-theme`. Users can export and import progress as JSON.
- In Persian, separators use `SEP = ' | '`, because a middot next to a Persian digit reads as zero.
- `pinNote()` has a `ROLE` map holding the course pin plan (section 5). Update it if the plan changes.
- "Report a mistake" (footer + end of lesson) opens a prefilled issue at `https://github.com/Sahandazadee/public-html/issues/new`. User reports arrive as GitHub issues: read them with the GitHub tools, fix, and close the issue with a comment.

## 4. Content markup (copy from an existing lesson, e.g. 3-1.html)
- Callouts: `<div class="callout TYPE"><div class="ct">title</div>…</div>`, where TYPE is analogy, why, tip, warn, info, example or coach. Every new idea gets an everyday example (analogy).
- Code: `<div class="code" data-file="Name.ino" id="x"><pre>…</pre></div>`. Escape `&lt; &gt; &amp;` inside `<pre>`. It is followed by `<ol class="walk" data-for="x">` with `<li data-lines="3-5">`, explaining **what + why** for every piece.
- Quiz: `<div class="quiz" data-answer="N"><p class="q">…</p><ol><li data-why="…">…</li>…</ol><div class="fb">…</div></div>`.
- Exercise: `.exercise` holds the statement (parts as `ol.parts`, one coloured row each, A–D), then `details.hint`, then `details.expect` (Persian summary «چه باید ببینی؟», English "What should you see?") with exact Serial output in `pre.serial` and self-check bullets, then `details.answer` («جواب کامل با توضیح» / "Full answer with explanation") with a full compilable sketch plus its walk.
- Practice project at the end of each lesson: `<h2 id="project">` and `div.project` (ids `project-req`, `project-parts`, `project-start`, code `projStart`, answer code `projAns`). The chapter capstone sits at the end of the last lesson of each chapter, under `<h2 id="capstone">`, with ids `capStart` and `capAns`. Each has a story, requirements, parts, wiring, starter code with `// TODO`, Wokwi (or "build it on your board"), hints, expect and answer.
- Wiring: `.wiring` holds a JSON spec, and `spec.board` sets the chip label (C3, S3, C6). Wokwi: `.wokwi` holds `<script type="application/json">` with diagram.json, and pin names must be valid (wokcheck).
- Diagrams are pre-rendered inline SVG in `figure.mermaid-svg`. The Mermaid library was removed, so never add `class="mermaid"`.
- Troubleshooting: lessons link to `troubleshooting.html` (213 rows grouped by symptom). Add new symptom rows there in both languages.

## 5. Course pin plan (use everywhere)
| Part | GPIO |
|---|---|
| Status LED (+220 Ω) | 4 |
| Button 1 / Button 2 (INPUT_PULLUP to GND) | 27 / 33 |
| Potentiometer / LDR divider | 34 / 35 (ADC1) |
| DHT22 | 13 |
| Passive buzzer | 25 |
| I2C (OLED, sensors) | SDA 21, SCL 22 |
| SD card (VSPI) | CS 5, SCK 18, MISO 19, MOSI 23 |
| UART2 | RX 16, TX 17 |
| Servo / NeoPixel data | 32 |
| Relay / motor / MOSFET gate / STEP | 26 (second motor input 14) |

Documented exceptions: deep-sleep ext1 (32/33), chip porting in 6-4, intentionally buggy AI code in 6-2, ESP32-CAM pins, built-in LED GPIO2.
Toolchain stated in the course: Arduino ESP32 core **3.3.12**. Wi-Fi + BLE sketches need the "Huge APP" partition.

## 6. Verify before every commit
One-time setup in a fresh container (about 5–10 min; Chromium is preinstalled):
```bash
cd /home/user/public-html/esp32-masterclass
bash assets/tools/dev/setup.sh                       # arduino-cli + core 3.3.12 + libraries + playwright + wokwi pin data, in /tmp/esp32mc
setsid nohup python3 -m http.server 8765 >/dev/null 2>&1 &   # local server (restart it if it dies)
```
Per changed lesson, both languages:
```bash
assets/tools/dev/check_lesson.sh 3-1      # JS errors [], no UNESCAPED, no WALK RANGE, every sketch OK, Wokwi issues: 0
assets/tools/dev/check_lesson.sh en/3-1
diff <(grep -o 'id="[^"]*"' 3-1.html) <(grep -o 'id="[^"]*"' en/3-1.html)                    # must be empty
diff <(grep -o 'data-answer="[^"]*"' 3-1.html) <(grep -o 'data-answer="[^"]*"' en/3-1.html)  # must be empty
grep -P '[\x{0600}-\x{06FF}]' en/3-1.html                                                    # must print nothing
```
Known and expected: two sketches in 6-2 are intentionally wrong core-2.x examples and FAIL in both languages.
Screenshots, to look at the result yourself before claiming it works:
```bash
node assets/tools/dev/shot.js 3-1.html /tmp/esp32mc/shots/a.png 390 full        # page (width, full height); prints JS errors
node assets/tools/dev/el.js 3-1.html '.wiring' /tmp/esp32mc/shots/w.png 1300    # one element
```
(Run them with `NODE_PATH=/tmp/esp32mc/node_modules`.) Check phone width 390 and desktop 1300, light and dark.
After content edits: `python3 assets/tools/build-search.py`. After editing cheatsheet.html: `node assets/tools/dev/pdf.js` and `node assets/tools/dev/pdf-en.js`. Check JS syntax with `node --check assets/app.js`.

## 7. State at handoff (2026-10-10)
- Done: 24 lessons + 7 extra pages, fa + en. Every exercise has expect + answer; there is one project per lesson and a capstone per chapter. Search, troubleshooting, report-a-mistake, progress export/import, inline code notes, quiz persistence, A–D parts and the closed-by-default drawer are all in place.
- Last full check: 302 sketches compile (only the 2 intentional 6-2 failures), 62 pages have no JS errors, links are clean and fa/en ids match.
- Open: issue #3 belongs to the other course (`c-az-sefr`, arrows on dark images), not this one.
- Idea discussed but not built: an interactive dashboard and continuous animated lessons. Ask the user before starting.
