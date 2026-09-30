# ریویو دور ۱ · شاگرد مجازی «موبایل + دسترس‌پذیری» (۳۶۰px، RTL، شب، کیبورد، صفحه‌خوان، کم‌بینا)

روش: Playwright/Chromium روی همه ۴۵ صفحه (index، glossary، tools، cheatsheet، troubleshooting، references و ۳۹ درس) در ۳۶۰×۷۴۰ و ۱۲۸۰×۸۰۰، روشن و تاریک (۱۸۰ بار بارگذاری) + آزمون تعاملی روی ۱-۱ و چند صفحه. اسکریپت‌ها: `/tmp/claude-0/-home-user/c5351c70-9277-5023-b91f-9d9e67aa2701/scratchpad/r1a11y/` (audit.py، inter.py).

## ۰) آنچه سالم بود (برای ثبت)
- سرریز افقی صفحه (scrollWidth > innerWidth): **صفر** مورد در هر ۱۸۰ ترکیب. با زوم ۲۰۰٪ فونت در ۳۲۰px هم سرریز نداشت.
- خطای JS: صفر. (یک ۴۰۴ در glossary فقط یک بار در کانتکست موبایل دیده شد؛ احتمالا favicon.ico، تکرارنشد.)
- کلیک روی خط کد: یادداشت درست زیر همان خط باز می‌شود؛ `aria-expanded` درست عوض می‌شود؛ Enter/Space کار می‌کند.
- آزمون: پاسخ غلط → رنگ + `why-msg`؛ درست → solved؛ بعد از reload هم پاسخ درست و غلط‌های قبلی باقی است. دکمه «تمام کردم» تا حل همه آزمون‌ها `disabled` است و بعد از آن باز می‌شود و در localStorage ذخیره می‌شود.
- جستجو با `/`: دیالوگ با `role=dialog aria-modal`، فوکوس روی input، ۱۲ نتیجه برای «متغیر»، Esc می‌بندد. landmarkها (header/aside/main/nav/footer)، یک `h1` در هر صفحه، skip-link، `alt` و aria-label دکمه‌ها موجود است. چاپ: topbar/sidebar/done-box/یادداشت‌ها پنهان و پس‌زمینه سفید است.

## ۱) یافته‌ها، گروه‌بندی‌شده بر اساس علت ریشه‌ای

### A1 · حاد · متن SVG شکل‌ها روی موبایل ۵ تا ۷px می‌شود (خوانا نیست)
- اندازه: ۴۱ صفحه، در مجموع ≈۵٬۹۰۰ عنصر متن زیر ۹px مؤثر در ۳۶۰px. بدترین: 3-1 (۶۷۴)، 5-5 (۲۶۰)، 5-1 (۲۲۲)، 2-8 (۲۰۰)، 4-5 (۱۹۴)، 6-1 (۱۸۰)، 7-1 (۱۷۶)، 3-2 (۱۷۲).
- مثال واقعی: شکل رجیستر RGB در 3-1 با مقیاس ۰٫۳۸ نمایش داده می‌شود؛ برچسب‌های بیت (۱۵ … ۰) ≈۵٫۴px و «R: 8 بیت» ≈۷px. در شکل مسیر کار ابزارها (۱-۴/۷-۱) متن‌ها ۴٫۸–۶٫۵px. (اسکرین‌شات: `tinysvg.png`)
- علت: `img,svg{max-width:100%}` و `figure svg{height:auto;max-width:100%}` (style.css خط ۴۶ و ۱۴۶) شکل را کوچک می‌کند، در حالی که `.frame` خودش `overflow-x:auto` دارد و `tabindex=0` هم گرفته.
- راه‌حل (CSS): به‌جای کوچک‌کردن، در قاب اسکرول شود:
  ```css
  figure .frame svg{max-width:none;width:auto;min-width:var(--svg-min,560px)}
  @media (min-width:700px){figure .frame svg{min-width:0;max-width:100%}}
  ```
  و در app.js بعد از بارگذاری: برای هر `figure svg` با viewBox، `svg.style.setProperty('--svg-min', Math.round(vb.width*0.8)+'px')` (نسبت ≥۰٫۸ یعنی فونت ۱۱px → ≥۹px). شکل‌های خیلی عریض با اسکرول افقی دیده می‌شوند و `.frame` کیبورد‌پذیر است؛ یک `aria-label` مثل «شکل قابل اسکرول» هم اضافه شود. جایگزین: برای شکل‌های پرمتن دو نسخه (موبایل عمودی) یا افزایش font-size داخل SVG.

### A2 · حاد · تاریک: کد درون‌خطی در کادرهای callout تقریبا نامرئی (نسبت ≈۱٫۶)
- style.css خط ۱۴۰–۱۴۱: `.callout code{background:rgba(255,255,255,.7);color:#15120a}` سپس در حالت تاریک `color:inherit` (= کرم روشن) روی پس‌زمینهٔ سفید نیمه‌شفاف → کرم روی خاکستری‌روشن. ۲۳۲+ مورد در صفحات تاریک (مثلا 2-3 مثال سوپرمارکت: `3 * 20`، `wallet >= total`، `&&`). اسکرین‌شات `dark_callout.png` تأیید کرد.
- رفع:
  ```css
  .callout code{background:rgba(255,255,255,.7);color:#15120a}
  :root:not([data-theme="light"]) .callout code{background:rgba(0,0,0,.38);color:var(--ink)}  /* داخل @media dark */
  :root[data-theme="dark"] .callout code{background:rgba(0,0,0,.38);color:var(--ink)}
  ```
  (خط ۱۴۱ فعلی را حذف کنید؛ انتخابگر دوم باید داخل `@media (prefers-color-scheme:dark)` باشد وگرنه با تم روشن دستی و سیستم تاریک اشتباه می‌شود.) وضعیت مشابه: `.callout.warn code` سفید روی pink-l (۱٫۳۲) همین ریشه.

### A3 · حاد · تاریک: متن سفید ثابت روی رنگ‌های پاستلیِ تاریک (برچسب `.ct` و دکمهٔ اصلی)
- `--cci:#fff` برای example/warn/deep و `.btn.primary{color:#fff}` در حالی که در تاریک `--blue:#7ea3ff`، `--red:#ff7a70`، `--purple:#b394ff` روشن می‌شوند. نسبت‌ها: برچسب warn ۲٫۵۴، deep ۲٫۴۴، example ۲٫۴۵، «بعدی ←» (btn primary) ۲٫۴۵ (۳۲ صفحه).
- رفع: در هر دو بلوک dark (media و data-theme) اضافه شود:
  ```css
  --cci-light:#15120a; .callout.example,.callout.warn,.callout.deep{--cci:#15120a}
  .btn.primary,.btn.primary:hover{color:#0b1020}
  ```
  (برای حالت روشن ≥۴٫۵ هست: `#fff` روی `#2f5fd0` ≈۶٫۲.)

### A4 · متوسط · روشن و تاریک: چیپ‌های رنگی با متن سفید زیر ۴٫۵
- `.lesson-head .eyebrow` (opacity .85، ۱۴px وزن ۸۰۰) سفید روی رنگ فصل: pink ۲٫۸۲، purple ۳٫۵۱، blue ۳٫۸۲ (فصل‌های ۲، ۵، ۶؛ ۲۰ درس). `.chap-title .dot` در index سفید روی pink ۳٫۳۷ و روی purple ۴٫۲۳. `.widget>.wt` سفید روی pink ۳٫۳۷ و purple ۴٫۲۳.
- رفع: برای فصل‌های pink/purple/blue متغیر `--chap-ink` تیره کنید (`#1a0010` روی pink، `#fff` فقط اگر رنگ فصل را تیره‌تر کنید مثلا blue `#2f5fd0`، purple `#6d3fd6`)، و `opacity:.85` از eyebrow حذف شود. `.dot` از `--cink` تیره روی pink بگیرد.

### A5 · متوسط · جدول حافظهٔ تعاملی (`.mem .cell`): متن با متغیر تم روی زرد/صورتی ثابت
- `.mem .cell.var{background:var(--yellow);color:#000}` ولی `.nm{color:var(--blue)}` و `.ad{color:var(--mute)}` از خود متغیر می‌گیرند: روشن ۴٫۰۵ (آبی روی زرد)؛ تاریک ۱٫۷۴ (`#7ea3ff` روی زرد) و ۱٫۵۰ (`.ad`) و روی pink حتی ۱٫۰۶–۱٫۰۹ (ناخوانا).
- رفع: `.mem .cell.var .nm,.mem .cell.ptr .nm{color:#0b2a8a}` و `.mem .cell.var .ad,.mem .cell.ptr .ad{color:#1a1a1a}`؛ (یا `.cell.var *{color:#000}` کوتاه‌تر).

### B1 · متوسط · اهداف لمسی زیر ۴۰px (روی ۳۶۰px)
بیشترین موارد (شمارش روی ۴۵ صفحه، روشن/موبایل):
- **خط‌های قابل‌کلیک کد `.code .ln.has`**: ارتفاع ≈۲۵٫۴px (۵٬۰۶۹ مورد مجموع). نزدیک‌بودن خط‌ها (۱ تا ۲ px فاصله) خطای لمس می‌سازد. رفع: `.code .ln.has{min-height:44px;display:flex;align-items:center}` یا حداقل `padding-block:9px`؛ یا فقط روی موبایل (`@media (pointer:coarse)`).
- **دکمه‌های `.code .cp/.dl`** («کپی»، «دانلود»، «باز کردن همه توضیح‌ها»): ارتفاع ۲۶px. خط ۱۷۷: `padding:1px 10px` → `padding:9px 14px;min-height:40px`.
- **آیکن‌های topbar** ۳۸×۳۸ (در ≤۴۲۰px خط ۷۶ عمدا کوچک می‌کند): `.btn.icon-btn{width:44px;height:44px}` و حذف قانون ۳۸px؛ `.progress-pill` ارتفاع ۳۵ → `min-height:40px`؛ `.brand` ۳۸.
- لینک‌های فهرست (index/مراجع/منابع/«گزارش مشکل») ۲۲–۲۶px ارتفاع: `li a{display:inline-block;padding-block:8px}`. رادیو/چک‌باکس ۱۳×۱۳ (۱۶ مورد؛ tools/cheatsheet) بدون برچسب بزرگ: `label{min-height:40px;display:inline-flex;align-items:center}` یا `input{width:22px;height:22px}`.
- `.term` (واژهٔ واژه‌نامه) ارتفاع ۲۸px: `padding-block:6px` با `display:inline-block` (حواس به line-height).
- دکمهٔ «تمام کردم» غیرفعال با `opacity:.5` نسبت ۳٫۵ دارد (معاف از WCAG ولی متن شرط «۵ سؤال مانده» در `.done-box p` باید واضح بماند؛ آن بخش خوب است).

### B2 · متوسط · کیبورد و صفحه‌خوان
1. **منوی کشویی (drawer)**: باز شدن `.nav-open` فوکوس را به داخل منو نمی‌برد (فوکوس روی دکمه می‌ماند)، پس‌زمینه `inert` نیست و با Tab فوکوس پشت لایه می‌رود؛ با Esc بسته می‌شود ولی فوکوس به دکمه برنمی‌گردد (بعد از Esc روی لینک `a.l` مانده). رفع در `setNav` (app.js ≈ خط ۷۴): هنگام باز: `side.querySelector('a.active,a').focus()` و `main.inert = true`؛ هنگام بستن: `inert=false` و `menuBtn.focus()`.
2. **واژهٔ `.term`**: فقط Enter کار می‌کند (app.js خط ۳۴۱)؛ Space نه (با `role=button`). رفع: `if(e.key==='Enter'||e.key===' '){e.preventDefault();openTerm(s)}`. همچنین `addEventListener("scroll",closePop)` باعث می‌شود پاپ‌آپ به‌محض هر اسکرول (حتی اسکرول خودکار فوکوس یا نوار آدرس موبایل) بسته شود؛ در تست خودم بعد از `focus()`+Enter پاپ‌آپ بسته شد. رفع: فقط اگر `Math.abs(scrollY-startY)>40` ببندد. پاپ‌آپ با `aria-describedby`/`aria-expanded` به `.term` وصل نیست.
3. **آزمون**: `li[role=button]` بدون `aria-pressed`/ناحیهٔ `aria-live`؛ نتیجهٔ درست/غلط (`why-msg`) برای صفحه‌خوان اعلام نمی‌شود و فقط با رنگ/متن اضافه‌شده است. رفع: به هر `.quiz` یک `<div class="vh" aria-live="polite">` و هنگام pick متن «درست»/«نادرست: …» بنویسید؛ به `li` مقدار `aria-pressed` یا بهتر `role=radio` داخل `role=radiogroup` با فلش‌ها.
4. **یادداشت خط کد**: `.ln-note` بدون `role=note`/`aria-live`؛ بعد از باز شدن خبری به صفحه‌خوان نمی‌رسد جز `aria-expanded`. رفع: `aria-controls` با id یادداشت + `role="note"`. خط‌های خالی دارای `?` (۲۳۶ مورد) نام دسترس‌پذیر خالی دارند (`<span class="ln has" role=button> </span>`): `aria-label="توضیح خط N"` اضافه شود.
5. **ناحیه‌های اسکرول‌شونده** (`pre` ≈۶۳۰، `.table-wrap` ≈۱۲۴ مورد) بدون `tabindex`/`role=region`/`aria-label`؛ کاربر کیبورد در مرورگرهای قدیمی‌تر نمی‌تواند جدول/کد عریض را اسکرول کند. رفع در app.js: `el.tabindex=0; el.setAttribute('role','region'); el.setAttribute('aria-label','جدول قابل اسکرول')`.
6. فوکوس: `:focus-visible{outline:3px solid var(--blue)}` روی خط کد دیده می‌شود (۳px آبی) ولی در تاریک آبی `#7ea3ff` روی پس‌زمینهٔ کد تیره کافی و روی `.topbar` زرد ۱٫۷ است: برای `.topbar :focus-visible{outline-color:#15120a}` قانون بگذارید.

### B3 · جزئی
- forced-colors (High Contrast): ماسکات هدر درس روی چیپ «درس X از ۳۹» می‌افتد (`.lesson-head .mascot` در موبایل با `bottom:-6px` هم‌پوشانی می‌کند، در حالت عادی هم کمرنگ روی چیپ است). رفع: در ≤۵۶۰px `.lesson-head .meta{padding-inline-end:70px}` یا مخفی‌کردن ماسکات.
- دکمهٔ `.to-top` (صورتی، ثابت) روی یادداشت‌های باز شدهٔ خط کد و متن می‌افتد (`note_m.png`) و بخشی از متن را می‌پوشاند؛ با `inset-block-end:18px` ثابت. رفع: کوچک‌تر یا نیمه‌شفاف، یا فقط هنگام اسکرول رو به بالا نشان داده شود.
- یادداشت خط کد روی موبایل `margin:6px 14px 8px 52px` (حاشیهٔ ۵۲px چپ) عرض مؤثر را ≈۲۷۰px می‌کند؛ روی ≤۴۲۰px حاشیه را `margin-inline:8px` کنید.
- `.ln-hint` و چند متن کوچک با اندازهٔ ثابت ۱۴px / `.wgrid small` ۱۱٫۵px / `.ad` ۱۰٫۵px؛ برای کم‌بینا حداقل ۱۲–۱۳px و واحد rem.
- `.tk y` (۴٫۱) و `.tk m` (۳٫۲۵) در کد روشن‌شده با پس‌زمینهٔ سفید (پرینت/چیت‌شیت نسخهٔ چاپی) کم‌کنتراست: `#8a5a00`، `#17694a`.
- پرینت cheatsheet: topbar پنهان و پس‌زمینه سفید است؛ PDF تولید شد (`cheat.pdf`). `.code` در چاپ سفید ولی رنگ tokenها (`--tk-kw` زرد `#ffd60a`) روی سفید نامرئی است: در `@media print` برای `.tk` رنگ تیره بگذارید (`.code span[class^=tk]{color:#000!important}` ساده‌ترین).

## ۲) جمع‌بندی شدت
- حاد: ۳ (A1 SVG ریز، A2 کد callout شب، A3 سفید روی پاستل شب)
- متوسط: ۴ (A4، A5، B1 اهداف لمسی، B2 کیبورد/صفحه‌خوان)
- جزئی: ۱ گروه با ۶ مورد (B3)

## ۳) فایل‌های مربوط
`assets/style.css` خطوط ۴۶، ۶۴، ۷۶، ۱۰۶، ۱۲۹–۱۴۱، ۱۴۶، ۱۷۷–۱۸۶، ۳۴۶–۳۴۸، ۳۵۵–۳۶۳؛ `assets/app.js` خطوط ≈۷۴ (drawer)، ۲۹۳–۲۹۷ (یادداشت خط)، ۳۰۶–۳۲۳ (آزمون)، ۳۴۱–۳۴۳ (term/scroll).
