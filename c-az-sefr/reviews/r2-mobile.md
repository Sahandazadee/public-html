# ریویو دور ۲ · شاگرد مجازی «موبایل + دسترس‌پذیری» (بازآزمایی اصلاحات دور ۱)

روش: Playwright/Chromium روی همه ۴۵ صفحه، ۳۶۰×۷۴۰ و ۱۲۸۰×۸۰۰، روشن و تاریک (۱۸۰ بارگذاری) + آزمون تعاملی (کشو، Esc، پاپ‌آپ اصطلاح، یادداشت خط کد، آزمون، بزرگ‌نمایی، چاپ) + اسکرین‌شات صفحه‌های ۳-۱، ۵-۵، ۲-۸، ۴-۵ و ۳-۴ و index و بلوک «برای کنجکاوها» (۱-۴). اسکریپت‌ها: `/tmp/claude-0/-home-user/c5351c70-9277-5023-b91f-9d9e67aa2701/scratchpad/r2a11y/`.

## ۰) تأیید اصلاحات دور ۱ (سالم)
- سرریز افقی صفحه: صفر در هر ۱۸۰ ترکیب. خطای JS: صفر (فقط یک ۴۰۴ تکراری و غیرقطعی در glossary موبایل، احتمالا favicon).
- متن SVG زیر ۹px مؤثر: دور ۱ حدود ۵٬۹۰۰ مورد، اکنون **صفر**.
- کشو: Enter روی منو فوکوس را به لینک فعال می‌برد؛ `main` و دکمه‌های topbar `inert` می‌شوند؛ ۶۰ بار Tab فوکوس را از کشو بیرون نمی‌برد؛ Esc کشو را می‌بندد، فوکوس به دکمه منو برمی‌گردد و inert برداشته می‌شود؛ کلیک روی backdrop هم همین‌طور.
- پاپ‌آپ اصطلاح: Enter باز (`role=tooltip`)، Esc می‌بندد و فوکوس به `.term` برمی‌گردد؛ در ۳۶۰px داخل صفحه می‌ماند.
- یادداشت خط کد: Space/Enter باز و بسته (`aria-expanded`)، ناحیهٔ `role=note` ساخته می‌شود. آزمون: پاسخ غلط در `aria-live="polite"` اعلام می‌شود.
- `:focus-visible`: در ۴۰ Tab اول روی ۱-۱ (تاریک) همه عناصر outline دارند. ناحیه‌های اسکرول (`pre`، `table-wrap`) برچسب و tabindex دارند.
- برخورد کلاس‌ها: `.vh` و `.has` فقط همان کاربرد خود را دارند؛ جایی در درس‌ها با معنی دیگر استفاده نشده.
- بلوک `details.deep-asm` («برای کنجکاوها: متن اسمبلی hello.c…») در ۱-۴ هر دو تم: حاشیه و خوانایی خوب، هدف لمسی summary بزرگ، کد داخلش درست اسکرول می‌شود. (در CSS قاعدهٔ اختصاصی ندارد و از `details` عمومی می‌گیرد؛ مشکلی ندارد.)

## ۱) یافته‌ها (گروه‌بندی بر اساس علت ریشه‌ای)

### B1 · حاد · لینک آبی روی جعبهٔ زردِ «خلاصه» (`.sum`) در حالت تاریک ناخوانا است
- ۲۳ صفحه (مثلا 1-1، 1-2، 2-2…): لینک «درس بعدی/مرتبط» داخل `div.sum` (زمینه `--yellow` ثابت) در تاریک رنگ `#7ea3ff` می‌گیرد: کنتراست **۱٫۷۴:۱**. در روشن هم ۴٫۰۵ (زیر ۴٫۵).
- علت: `.sum` زمینهٔ زرد ثابت دارد و فقط `color` و `code` را بازنویسی کرده، رنگ `a` را نه.
- راه‌حل (`assets/style.css`، انتهای فایل):
```css
.sum a{color:#0b2a8a;text-decoration:underline}   /* ۸٫۷:۱ روی زرد، هر دو تم */
.sum a:hover{background:#15120a;color:#ffd60a}
```

### B2 · متوسط · `code` داخل سرتیتر رنگی `.callout .ct` سفید روی تراشهٔ سفید (روشن) یا تیره روی تیره (تاریک)
- روشن: ۲۶ صفحه (`.callout.deep` با `--cci:#fff`). متن `code` ارث‌بری از `.ct` است ⇒ سفید روی تراشهٔ `rgba(255,255,255,.7)`، کنتراست **۱٫۶:۱** (اسکرین‌شات 2-2: «uint8_t» و «int» تقریبا نامرئی). تاریک: قاعدهٔ دور ۱ پس‌زمینهٔ تراشه را `rgba(0,0,0,.42)` می‌کند ولی `.ct` هنوز زمینهٔ روشن دارد.
- راه‌حل (بعد از همهٔ قاعده‌های `.callout code` دور ۱؛ ویژگی بالاتر از آن‌هاست):
```css
.callout .ct code,:root[data-theme="dark"] .callout .ct code{background:rgba(255,255,255,.85);color:#15120a;border-color:#15120a}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .callout .ct code{background:rgba(255,255,255,.85);color:#15120a;border-color:#15120a}}
```
- همین‌جا کنتراست متن سفید روی بنفش `.ct` برای `.callout.deep` ۴٫۲۳:۱ است (۲۶ صفحه)؛ برای رسیدن به ۵٫۴:
```css
.callout.deep{--cc:#7c4ae0}
```
(اگر `--purple` جای دیگر هم استفاده می‌شود فقط همین قاعده را بگذار تا بقیه تغییر نکند.)

### B3 · متوسط · `code` داخل `th` زرد در حالت تاریک: متن تیره روی تراشهٔ تیره (۱٫۲۸:۱)
- ۸ صفحه (3-3، 3-5، 4-1، 4-4، 5-4، 6-4…، حدود ۲۴ عنصر)، مثل ستون «مثال (p از نوع `int *`)». علت: `th` زمینهٔ زرد و متن `#15120a` دارد؛ `code` پس‌زمینهٔ `--card2` تیره می‌گیرد ولی رنگ را از `th` به ارث می‌برد. `kbd` در 2-5 همین مشکل.
- راه‌حل:
```css
th code,th kbd,.sum kbd{background:rgba(255,255,255,.75);color:#15120a;border-color:#15120a}
```

### B4 · متوسط · شکل‌های اسکرول‌شونده در موبایل هیچ سرنخ دیداری ندارند
- اسکرین‌شات‌های 3-1 و 5-5 (هر دو تم): شکل ۶۵۱px در قاب ۳۲۰px؛ لبهٔ چپ متن را برش می‌دهد («هر ستون مستقل از ستو…»، «برای هر دستگاه بی…») و نوار اسکرول روی موبایل مخفی است. یک شاگرد گمان می‌کند شکل خراب است. اسکرول با کشیدن انگشت درست کار می‌کند (قابل استفاده)، فقط کشف‌پذیر نیست. حدود ۴۰ صفحه.
- راه‌حل پیشنهادی (CSS + JS، هر دو، خنثی در دسکتاپ):

`assets/style.css`:
```css
figure .frame{scrollbar-width:thin;scrollbar-color:var(--bd) transparent}
figure .frame::-webkit-scrollbar{height:10px}
figure .frame::-webkit-scrollbar-thumb{background:var(--bd);border-radius:99px}
.fig-hint{display:none;font:700 12.5px var(--sans);text-align:center;margin:0 0 6px;color:#5b5540;direction:rtl}
.frame.scrolls .fig-hint{display:block}
:root[data-theme="dark"] .fig-hint{color:#5b5540}               /* قاب در تاریک روشن است */
.frame.scrolled .fig-hint{display:none}
@media print{.fig-hint{display:none!important}}
```
`assets/app.js` (بعد از خطی که `--svg-w` را تنظیم می‌کند، حدود خط ۴۰۶):
```js
article.querySelectorAll("figure .frame").forEach(function (f) {
  if (f.closest(".hero") || !f.querySelector("svg")) return;
  function chk() { f.classList.toggle("scrolls", f.scrollWidth > f.clientWidth + 8); }
  var h = document.createElement("div"); h.className = "fig-hint"; h.setAttribute("aria-hidden", "true");
  h.textContent = "↔ برای دیدن همهٔ شکل، آن را به چپ و راست بکش یا برای بزرگ‌نمایی بزن";
  f.insertBefore(h, f.firstChild); chk(); addEventListener("resize", chk);
  f.addEventListener("scroll", function () { f.classList.add("scrolled"); }, { once: true, passive: true });
});
```
(`.fig-hint` داخل قاب اسکرول می‌شود؛ برای ثابت‌ماندن آن را `position:sticky;inset-inline-start:0` بده، یا آن را قبل از `.frame` در `figure` بگذار.)
- قاب `tabindex=0` دارد ولی `role` و نام ندارد (صفحه‌خوان فقط «گروه» می‌گوید). اضافه کن (همان `forEach` بزرگ‌نمایی، خط ۳۹۸): `f.setAttribute("role","group"); f.setAttribute("aria-label",(s.getAttribute("aria-label")||"شکل")+" (قابل اسکرول؛ Enter برای بزرگ‌نمایی)");`

### B5 · متوسط · بزرگ‌نمایی شکل در موبایل کوچک‌تر از شکل اصلی است
- اسکرین‌شات `zoom_m.png` (3-1): `.zoom svg{width:min(1200px,92vw)}` ⇒ کل شکل ۷۶۰px در ۳۳۰px جا می‌شود، با متن ریزتر از حالت درون‌صفحه (که خودش اسکرول می‌شود). یعنی «بزرگ‌نمایی» عملا کوچک‌نمایی است.
- راه‌حل `assets/style.css`:
```css
@media (max-width:700px){
  .zoom svg{max-width:none;width:calc(var(--svg-w,92vw) * 1.35)}   /* --svg-w با cloneNode همراه است */
  .zoom>div{-webkit-overflow-scrolling:touch}
}
```
- دسترس‌پذیری بزرگ‌نمایی (`assets/app.js` خط ۳۹۹–۴۰۰): فوکوس به دیالوگ نمی‌رود، `aria-modal` ندارد، فقط Enter کار می‌کند (Space نه)، و بعد از Esc فوکوس هم به قاب برنمی‌گردد (روی `.frame` می‌ماند؛ در آزمون خوب بود چون فوکوس اصلا جابه‌جا نشده بود). اگر فوکوس به دیالوگ برده شود باید برگردانده شود:
```js
var zoom = function () {
  var z = el("div", { "class": "zoom", role: "dialog", "aria-modal": "true", "aria-label": "شکل بزرگ (برای بستن Esc یا لمس)", tabindex: "-1" }, "<div></div>");
  z.firstChild.appendChild(s.cloneNode(true));
  z.addEventListener("click", function () { z.remove(); f.focus(); });
  document.body.appendChild(z); z.focus();
};
f.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); zoom(); } });
```
و در کنترل‌کنندهٔ Esc (خط ۳۹۲) به جای `if (z) z.remove();`: `if (z) { z.remove(); var o = document.querySelector('.frame[data-zoomed]'); }` را نگذار؛ ساده‌تر: قبل از `zoom()` در `f` بنویس `window.__zf = f` و در Esc: `if (z) { z.remove(); if (window.__zf) window.__zf.focus(); }`.

### B6 · متوسط · جستجو (`/`) بعد از Esc فوکوس را به جای قبلی برنمی‌گرداند
- آزمون: بعد از `/` و Esc، `document.activeElement` برابر `BODY` است (کاربر کیبورد جای خود را در صفحه گم می‌کند). دیالوگ `aria-modal` است ولی `main` موقع بازبودن `inert` نمی‌شود (کشو می‌شود)، پس Tab از دیالوگ به متن پشت می‌رود.
- راه‌حل `assets/app.js` (تابع باز کردن جستجو، قبل از `sov.classList.add("open")`):
```js
var sPrev = document.activeElement;
sov.classList.add("open"); main.inert = true;
/* در هر جایی که "open" برداشته می‌شود (Esc، کلیک روی پس‌زمینه): */
function closeSearch() { sov.classList.remove("open"); main.inert = false; if (sPrev && sPrev.focus) sPrev.focus(); }
```
و Esc (خط ۳۹۲) را `if (sov && sov.classList.contains("open")) closeSearch();` کن (`main` در دامنهٔ بالاتر تعریف شده؛ در صورت نیاز با `document.getElementById("main")`).

### B7 · جزئی · چاپ
- در `@media print` قاب شکل هنوز `overflow-x:auto` و عرض `--svg-w` دارد؛ روی کاغذ A4 (≈۷۹۳px) قاعدهٔ ≤۷۰۰px اعمال نمی‌شود و مشکلی ندیدم، ولی چاپ از موبایل/صفحهٔ باریک شکل را می‌بُرد. ایمن‌سازی:
```css
@media print{figure .frame{overflow:visible!important;padding:0}figure .frame svg{width:100%!important;max-width:100%!important}.zoom{display:none!important}}
```
- ✓ جزییات (`details`) بسته در چاپ محتوا دارند (ارتفاع محتوا > ۰ در print emulate)، پس‌زمینهٔ بدنه سفید، topbar/کشو/یادداشت‌ها پنهان.

### B8 · جزئی · اهداف لمسی (۳۶۰px، هدف WCAG 2.2 AA ≥ ۲۴px همه رد می‌شوند؛ ۴۴ توصیه)
- لینک‌های «بیشتر: درس x.y» در glossary: ارتفاع ۲۶px (حدود ۳۸۰ مورد در صفحه). لینک‌های فوتر «منابع» ۲۲px و «گزارش مشکل ↗» ۲۲px و `a.report-link` ۲۷px. `a.brand` ۳۸px، دکمه‌های `.menu-toggle`/`icon-btn` ۴۰×۴۰ (در ≤۴۲۰px)، `.cp`/`.dl` ۴۰px، `span.term` ۴۳px، `input[type=checkbox]` 13×13 در 3-4، `.ln.has` کمی زیر ۴۴.
- راه‌حل:
```css
.footer a,.report-link{display:inline-block;padding-block:10px}
.gloss-more,.glossary a[href*="-"]{display:inline-block;padding-block:9px}  /* یا کلاس واقعی لینک «بیشتر» را بگذار */
input[type=checkbox]{width:22px;height:22px;accent-color:#2f5fd0}
.topbar .brand{min-height:44px;display:inline-flex;align-items:center}
@media (max-width:420px){.btn.icon-btn{width:42px;height:42px}}
```
(نام کلاس لینک «بیشتر» را در glossary.html با Grep روی `بیشتر:` پیدا کن؛ من قاعده‌ای که دقیقا همان را بگیرد نیاوردم.)

### B9 · جزئی · کنتراست‌های کوچک باقی‌مانده
- `.ct` سفید روی بنفش ۴٫۲۳ (در B2 حل شد)، `.mem .cell .nm` روی صورتی `#0b2a8a` ۴٫۲۳ (روشن، 9 صفحه): `.mem .cell.ptr .nm{color:#06185e}`.
- `tools.html` روشن: توکن‌های `tk-` `#1a8f5c` (۴٫۱) و `#b8860b` (۳٫۲۵) روی سفید؛ مقدارهای پیشنهادی `#157a4c` (۵٫۴) و `#8a6500` (۵٫۳) برای تم روشن.
- دکمهٔ «تمام کردم» `disabled` با opacity ۰٫۵ (۳٫۵۲) مشمول استثنا است؛ تغییر لازم نیست.
- `code` روی تراشهٔ تیل/سبز/زرد در تاریک (۴٫۴، ۴٫۳۴، ۳٫۶۱) تقریبا مرزی؛ با `rgba(0,0,0,.55)` به جای `.42` در `.callout code` تاریک بهتر می‌شود.
- مثبت کاذب: ۳٬۱۳۵ مورد «متن SVG کرم روی کرم» در تاریک که ابزار سنجش گزارش کرد، نادرست است: رنگ `color` ارث‌بری‌شده سنجیده شد ولی SVG با `fill` (که `#15120a` است) رنگ می‌شود؛ اسکرین‌شات‌های 3-1 و 5-5 تاریک خوانا هستند. اقدامی لازم نیست.

### B10 · جزئی · `.to-top` (دکمهٔ صورتی پایین‌راست) روی متن می‌نشیند
- در اسکرین‌شات‌ها (مثلا پاپ‌آپ اصطلاح، 3-1) روی چند کلمهٔ آخر خط می‌افتد. اختیاری: `body{padding-bottom:64px}` و `.to-top{opacity:.7}` که `:hover,:focus-visible` به ۱ برود.

## ۲) بررسی ویژه‌ها
- **صفحه اصلی (index):** هر دو تم تمیز؛ دکمه‌ها زیر هم می‌ایند، متن زرد روی زرد/تیره خوانا. فقط «منابع» و «گزارش مشکل» ریز (B8).
- **بلوک‌های «ادامه برای کنجکاوها»:** (۱-۱، ۱-۴، ۲-۲، ۲-۳، ۲-۸، ۳-۳، ۴-۷، ۵-۳) کلاس `deep-asm` فقط در ۱-۴ مستقل است؛ بسته به‌صورت پیش‌فرض و هدف لمسی مناسب. در تاریک مرز و پس‌زمینه کارت جدا دیده می‌شود. جعبهٔ کد داخلش عرض `-4px` margin دارد و در ۳۶۰px تمیز است.
- **قابل استفاده‌بودن اسکرول افقی شکل‌ها:** استفاده‌پذیر ولی ناپیدا (B4). برش لبهٔ متن بدون هیچ سایه/نشانگر، در هر دو تم؛ نوار اسکرول بومی موبایل مخفی.

## ۳) شمارش
- حاد: ۱ (B1)
- متوسط: ۵ (B2، B3، B4، B5، B6)
- جزئی: ۴ گروه (B7، B8، B9، B10)
