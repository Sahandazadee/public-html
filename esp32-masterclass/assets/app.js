/* ===== مستر کلاس ESP32 — موتور مشترک همه صفحه‌ها =====
   این فایل از روی یک <article class="page" data-page="..."> ساده، کل صفحه را می‌سازد:
   سربرگ، منوی درس‌ها، سرصفحه درس، واژه‌نامه شناور، بلوک کد، آزمون، Wokwi، ویدیو،
   نقشه پایه‌ها، نقشه سیم‌کشی، پیشرفت درس‌ها و صفحه‌بندی. */
(function () {
  "use strict";
  var C = window.COURSE;
  /* زبان صفحه از ویژگی lang تگ html خوانده می‌شود؛ صفحه‌های انگلیسی در پوشه en/ هستند */
  var LANG = (document.documentElement.getAttribute("lang") || "fa").slice(0, 2) === "en" ? "en" : "fa";
  var EN = LANG === "en";
  /* متن‌های داخل SVG سیم‌کشی: در فارسی راست‌به‌چپ، در انگلیسی چپ‌به‌راست؛ نقطه لنگر در هر دو زبان ثابت می‌ماند */
  var RIGHT_ALIGN = EN ? 'direction="ltr" text-anchor="end"' : 'direction="rtl" text-anchor="start"', LEFT_ALIGN = EN ? 'direction="ltr" text-anchor="start"' : 'direction="rtl" text-anchor="end"';
  /* در فارسی نقطه وسط (·) کنار رقم فارسی شبیه صفر (۰) دیده می‌شود؛ پس جداکننده | است */
  var SEP = EN ? ' · ' : ' | ';
  var G = (EN ? window.GLOSSARY_EN : window.GLOSSARY) || {};
  /* مسیر پوشه assets از آدرس همین اسکریپت به دست می‌آید تا در en/ هم درست کار کند */
  var BASE = (function () { var sc = document.currentScript || document.querySelector('script[src$="app.js"]'); return sc ? sc.getAttribute("src").replace(/app\.js.*$/, "") : "assets/"; })();
  var FA = "۰۱۲۳۴۵۶۷۸۹";
  function fa(n) { return EN ? String(n) : String(n).replace(/\d/g, function (d) { return FA[d]; }); }
  function LX(o, k) { return EN ? (o[k + "_en"] || o[k]) : o[k]; }
  var I18N = {
    fa: {
      sub: "از صفر مطلق تا پروژه اینترنت اشیا", menu: "منو", progress: "پیشرفت تو", theme: "حالت روشن یا تاریک",
      lessonsNav: "فهرست درس‌ها", extras: "صفحه‌های کمکی", onPage: "روی این صفحه",
      chapter: "فصل", lesson: "درس", about: "حدود", minutes: "دقیقه", level: "سطح", of: "از",
      doneYes: "آفرین! این درس را تمام کرده‌ای. هر وقت خواستی برای مرور برگرد.",
      doneNo: "همه آزمون‌ها را درست جواب دادی. تمرین‌ها را هم انجام دادی و با «چه باید ببینی؟» مقایسه کردی؟ فقط آن وقت تیک بزن.",
      doneLocked: "هنوز %n آزمون این درس مانده. اول همه را درست جواب بده، بعد این دکمه فعال می‌شود.",
      doneBtnYes: "✓ تمام شد (برداشتن تیک)", doneBtnNo: "این درس را تمام کردم",
      prev: "→ درس قبلی", back: "→ بازگشت", home: "خانه و نقشه راه", next: "درس بعدی ←", end: "پایان دوره ←", backHome: "بازگشت به خانه",
      footer: 'مستر کلاس ESP32 فارسی · آموزش رایگان · <a href="credits.html">منابع و مجوز تصاویر</a>',
      copy: "کپی کد", copied: "✓ کپی شد", letters: ["الف", "ب", "ج", "د"],
      right: "✅ درست است!", wrong: "❌ نه، دوباره فکر کن.", hint: "راهنما: متن بالای این آزمون را دوباره بخوان.",
      score: "امتیاز:", perfect: " — عالی! 🎉",
      wokwiTitle: "همین مدار را در شبیه‌ساز Wokwi بساز", wokwiOpen: "باز کردن Wokwi ↗", copyDiagram: "کپی diagram.json", copySketch: "کپی کد sketch.ino",
      diagramSum: "محتوای diagram.json (نقشه قطعات و سیم‌ها)",
      play: "برای پخش ویدیو از یوتیوب کلیک کن", channel: "کانال", vlang: "زبان ویدیو", vdefault: "انگلیسی", openYT: "باز کردن در یوتیوب ↗",
      watchGuide: "راهنمای تماشا: به چه نکته‌هایی دقت کنی",
      pinAria: "نقشه پایه‌های ESP32 DevKitC", all: "همه", pinPick: "روی یک پایه کلیک کن",
      pinHelp: "هر پایه را انتخاب کن تا ببینی چه کاری از آن برمی‌آید و چه خطری دارد. با دکمه‌های بالا پایه‌های هم‌خانواده را جدا کن.",
      pinGold: "<b>قانون طلایی مبتدی:</b> اول از پایه‌های سبز «امن» استفاده کن.",
      wiringErr: "خطا در JSON نقشه سیم‌کشی", wiringAria: "نقشه سیم‌کشی",
      lgPower: "تغذیه (3V3 یا 5V)", lgGnd: "زمین GND", lgOut: "سیگنال خروجی", lgIn: "سیگنال ورودی / داده", lgClk: "ساعت / SCL / SCK", lgSda: "داده I2C (SDA) / TX",
      wTable: "جدول اتصال‌ها (برای چک کردن سیم به سیم)", wFrom: "از", wTo: "به", wColor: "رنگ پیشنهادی سیم",
      langBtn: "EN", langTitle: "Read this page in English", langAria: "تغییر زبان به انگلیسی",
      skip: "پرش به متن اصلی", darkMode: "حالت تاریک",
      progressOf: "%n از %t", progressAria: "پیشرفت تو: %n درس از %t درس تمام شده",
      search: "جستجو", searchKey: "جستجو (کلید /)", searchPh: "جستجو در درس‌ها: مثلا PWM، ولتاژ، brownout", searchClose: "بستن",
      searchLoading: "در حال بارگذاری نمایه جستجو…", searchErr: "نمایه جستجو بارگذاری نشد. اتصال را بررسی کن و دوباره امتحان کن.",
      searchNone: "چیزی پیدا نشد. واژه دیگری امتحان کن (فارسی یا انگلیسی).", searchCount: "%n نتیجه",
      searchHelp: "↑ ↓ برای رفتن بین نتیجه‌ها، Enter برای باز کردن، Esc برای بستن",
      kindFile: "فایل کد", kindGloss: "واژه‌نامه", kindPage: "صفحه",
      report: "گزارش اشتباه", reportLesson: "اشتباهی در این درس دیدی؟ گزارش بده ↗",
      reportTitle: "اشتباه در: %s", reportBody: "صفحه: %u\nبخش: %h\n\nچه چیزی اشتباه است:\n",
      dlIno: "دانلود فایل ino", dlDiagram: "دانلود diagram.json",
      ppTitle: "پیشرفت تو", ppText: "%n درس از %t درس را تمام کرده‌ای. پیشرفت فقط در همین مرورگر ذخیره می‌شود؛ برای پشتیبان یا بردن به دستگاه دیگر، فایلش را بگیر.",
      ppSave: "دانلود فایل پیشرفت", ppLoad: "بارگذاری فایل پیشرفت",
      ppOk: "پیشرفت بارگذاری شد: %n درس تمام‌شده. صفحه دوباره باز می‌شود…", ppBad: "این فایل، فایل پیشرفت این دوره نیست.",
      pinList: "فهرست پایه‌ها (برای لمس روی گوشی)", pinLeft: "ردیف چپ برد (از بالا به پایین)", pinRight: "ردیف راست برد (از بالا به پایین)"
    },
    en: {
      sub: "From absolute zero to real IoT projects", menu: "Menu", progress: "Your progress", theme: "Light or dark mode",
      lessonsNav: "Lessons", extras: "Reference pages", onPage: "On this page",
      chapter: "Chapter", lesson: "Lesson", about: "about", minutes: "min", level: "Level", of: "of",
      doneYes: "Well done! You finished this lesson. Come back any time to review.",
      doneNo: "Every quiz is correct. Did you also do the exercises and compare them with “What should you see?”? Only then tick this box.",
      doneLocked: "%n quiz(zes) in this lesson still to go. Answer them all correctly first; then this button unlocks.",
      doneBtnYes: "✓ Done (click to undo)", doneBtnNo: "I finished this lesson",
      prev: "← Previous lesson", back: "← Back", home: "Home & roadmap", next: "Next lesson →", end: "End of course →", backHome: "Back to home",
      footer: 'ESP32 Masterclass · free course · <a href="credits.html">Sources and image licenses</a>',
      copy: "Copy code", copied: "✓ Copied", letters: ["A", "B", "C", "D"],
      right: "✅ Correct!", wrong: "❌ Not quite, think again.", hint: "Hint: reread the text above this quiz.",
      score: "Score:", perfect: " — perfect! 🎉",
      wokwiTitle: "Build this circuit in the Wokwi simulator", wokwiOpen: "Open Wokwi ↗", copyDiagram: "Copy diagram.json", copySketch: "Copy sketch.ino",
      diagramSum: "diagram.json contents (parts and wires)",
      play: "Click to play", channel: "Channel", vlang: "Language", vdefault: "English", openYT: "Open on YouTube ↗",
      watchGuide: "Watch guide: what to look for",
      pinAria: "ESP32 DevKitC pinout", all: "All", pinPick: "Click a pin",
      pinHelp: "Select any pin to see what it can do and what can go wrong. Use the buttons above to highlight a family of pins.",
      pinGold: "<b>Beginner's golden rule:</b> start with the green “safe” pins.",
      wiringErr: "Error in the wiring diagram JSON", wiringAria: "Wiring diagram",
      lgPower: "Power (3V3 or 5V)", lgGnd: "Ground (GND)", lgOut: "Output signal", lgIn: "Input / data", lgClk: "Clock / SCL / SCK", lgSda: "I2C data (SDA) / TX",
      wTable: "Connection table (check it wire by wire)", wFrom: "From", wTo: "To", wColor: "Suggested wire color",
      langBtn: "فا", langTitle: "این صفحه را فارسی بخوان", langAria: "Switch to Persian",
      skip: "Skip to main content", darkMode: "Dark mode",
      progressOf: "%n/%t", progressAria: "Your progress: %n of %t lessons done",
      search: "Search", searchKey: "Search (press /)", searchPh: "Search the lessons: e.g. PWM, voltage, brownout", searchClose: "Close",
      searchLoading: "Loading the search index…", searchErr: "The search index could not be loaded. Check your connection and try again.",
      searchNone: "Nothing found. Try another word.", searchCount: "%n results",
      searchHelp: "↑ ↓ to move between results, Enter to open, Esc to close",
      kindFile: "Code file", kindGloss: "Glossary", kindPage: "Page",
      report: "Report a mistake", reportLesson: "Spotted a mistake in this lesson? Report it ↗",
      reportTitle: "Mistake in %s", reportBody: "Page: %u\nSection: %h\n\nWhat is wrong:\n",
      dlIno: "Download .ino", dlDiagram: "Download diagram.json",
      ppTitle: "Your progress", ppText: "You have finished %n of %t lessons. Progress is stored only in this browser; download the file as a backup or to move it to another device.",
      ppSave: "Download progress file", ppLoad: "Load progress file",
      ppOk: "Progress loaded: %n lessons done. Reloading the page…", ppBad: "This is not a progress file from this course.",
      pinList: "Pin list (easy to tap on a phone)", pinLeft: "Left edge of the board (top to bottom)", pinRight: "Right edge of the board (top to bottom)"
    }
  };
  function t(k) { return I18N[LANG][k]; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  /* ---------- زبان: صفحه متناظر، ترجیح ذخیره‌شده و انتقال خودکار ---------- */
  var FILE = (location.pathname.split("/").pop() || "index.html");
  if (!/\.html$/.test(FILE)) FILE = "index.html";
  var PAGE = FILE.replace(/\.html$/, "");
  /* صفحه انگلیسی متناظر فقط وقتی لینک می‌شود که ترجمه‌اش منتشر شده باشد (فهرست enPages در course.js) */
  var HAS_TWIN = EN || C.enPages === "all" || (C.enPages || []).indexOf(PAGE) > -1;
  var TWIN = EN ? "../" + FILE : "en/" + FILE;
  var prefLang = store("esp32mc-lang");
  if (HAS_TWIN && prefLang && prefLang !== LANG) { location.replace(TWIN + location.hash); return; }

  /* ---------- پوسته، حالت شب ---------- */
  var savedTheme = store("esp32mc-theme");
  if (savedTheme) document.documentElement.setAttribute("data-theme", savedTheme);

  var lessons = [];
  C.chapters.forEach(function (ch) { ch.lessons.forEach(function (l) { l.ch = ch; lessons.push(l); }); });
  var done = store("esp32mc-done") || [];

  var article = document.querySelector("article.page");
  if (!article) return;
  var pageId = article.getAttribute("data-page");
  var lesson = lessons.filter(function (l) { return l.id === pageId; })[0];
  var idx = lesson ? lessons.indexOf(lesson) : -1;
  if (lesson) article.style.setProperty("--chap", lesson.ch.color);

  var logo = '<svg viewBox="0 0 40 40"><rect x="3" y="3" width="34" height="34" rx="9" fill="#2f7af0"/><rect x="11" y="10" width="18" height="20" rx="3" fill="#0f1729"/><path d="M13 13h14" stroke="#9ecbff" stroke-width="2"/><g stroke="#ffd166" stroke-width="2"><path d="M7 14h4M7 19h4M7 24h4M29 14h4M29 19h4M29 24h4"/></g><circle cx="20" cy="22" r="3" fill="#3cc9a0"/></svg>';
  /* آیکون‌های حالت روشن و تاریک: آیکون همیشه حالت فعلی را نشان می‌دهد */
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  var top = el("header", { "class": "topbar" },
    '<button class="btn icon-btn menu-toggle" data-act="nav" aria-label="' + t("menu") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>' +
    '<a class="brand" href="index.html">' + logo + '<span><b>' + LX(C, "title") + '</b><small>' + t("sub") + '</small></span></a>' +
    '<span class="spacer"></span>' +
    '<button class="btn icon-btn search-btn" type="button" data-act="search" aria-label="' + t("search") + '" title="' + t("searchKey") + '" aria-haspopup="dialog" aria-keyshortcuts="/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><kbd aria-hidden="true">/</kbd></button>' +
    '<a class="progress-pill" href="index.html#chapters" title="' + t("progress") + '"><span class="bar" aria-hidden="true"><i></i></span><span class="pct"></span></a>' +
    (HAS_TWIN ? '<a class="btn lang-btn" data-act="lang" href="' + TWIN + '" hreflang="' + (EN ? "fa" : "en") + '" lang="' + (EN ? "fa" : "en") + '" title="' + t("langTitle") + '" aria-label="' + t("langAria") + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg><span>' + t("langBtn") + '</span></a>' : '') +
    '<button class="btn icon-btn theme-btn" type="button" data-act="theme" aria-label="' + t("darkMode") + '" title="' + t("theme") + '" aria-pressed="false"></button>');
  var themeBtn = top.querySelector(".theme-btn"), darkMQ = matchMedia("(prefers-color-scheme: dark)");
  function isDark() { var a = document.documentElement.getAttribute("data-theme"); return a ? a === "dark" : darkMQ.matches; }
  function paintTheme() { var d = isDark(); themeBtn.innerHTML = d ? MOON : SUN; themeBtn.setAttribute("aria-pressed", d ? "true" : "false"); }
  paintTheme();
  if (darkMQ.addEventListener) darkMQ.addEventListener("change", paintTheme);

  var side = el("aside", { "class": "sidebar", "aria-label": t("lessonsNav") });
  var sh = '<h4>' + t("extras") + '</h4>';
  C.extras.forEach(function (x) { sh += '<a class="x' + (x.id === pageId ? " active" : "") + '" href="' + x.id + '.html">' + LX(x, "title") + '</a>'; });
  C.chapters.forEach(function (ch) {
    sh += '<div class="chap"><div class="chap-title"><span class="dot" style="background:' + ch.color + '">' + fa(ch.n) + '</span>' + LX(ch, "title") + '<span class="cnt" data-ch="' + ch.n + '"></span></div>';
    ch.lessons.forEach(function (l) {
      sh += '<a class="l' + (l.id === pageId ? " active" : "") + (done.indexOf(l.id) > -1 ? " done" : "") + '" data-id="' + l.id + '" href="' + l.id + '.html"><span class="num">' + fa(l.id.replace("-", ".")) + '</span><span>' + LX(l, "title") + '</span></a>';
    });
    sh += '</div>';
  });
  side.innerHTML = sh;

  var shell = el("div", { "class": "shell" });
  var main = el("main", { "class": "content" });
  article.parentNode.insertBefore(shell, article);
  shell.appendChild(side);
  shell.appendChild(main);
  main.appendChild(article);
  document.body.insertBefore(top, document.body.firstChild);
  /* پیوند «پرش به متن اصلی»: اولین چیزی که با Tab فوکوس می‌گیرد */
  main.id = main.id || "main"; main.setAttribute("tabindex", "-1");
  document.body.insertBefore(el("a", { "class": "skip-link", href: "#" + main.id }, t("skip")), document.body.firstChild);
  document.body.appendChild(el("div", { "class": "backdrop", "data-act": "nav" }));
  /* نوار پیشرفت خواندن و دکمه بازگشت به بالا */
  var rb = el("div", { "class": "read-bar", "aria-hidden": "true" }, "<i></i>");
  var tt = el("button", { "class": "to-top", "type": "button", "aria-label": EN ? "Back to top" : "بازگشت به بالا" }, '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>');
  document.body.appendChild(rb); document.body.appendChild(tt);
  tt.addEventListener("click", function () { scrollTo({ top: 0, behavior: "smooth" }); });
  var onScroll = function () {
    var h = document.documentElement.scrollHeight - innerHeight;
    rb.firstChild.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + "%";
    tt.classList.toggle("show", scrollY > 900);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* سرصفحه خودکار درس */
  if (lesson && !article.querySelector("h1")) {
    var head = el("header", { "class": "lesson-head" },
      '<span class="eyebrow">' + t("chapter") + ' ' + fa(lesson.ch.n) + SEP + LX(lesson.ch, "title") + SEP + t("lesson") + ' ' + fa(lesson.id.replace("-", ".")) + '</span>' +
      '<h1>' + LX(lesson, "title") + '</h1>' +
      '<div class="meta"><span>⏱ ' + t("about") + ' ' + fa(lesson.min) + ' ' + t("minutes") + '</span><span>📶 ' + t("level") + ': ' + LX(lesson, "level") + '</span><span>🧭 ' + t("lesson") + ' ' + fa(idx + 1) + ' ' + t("of") + ' ' + fa(lessons.length) + '</span></div>');
    article.insertBefore(head, article.firstChild);
    document.title = LX(lesson, "title") + " · " + LX(C, "title");
  }

  /* ---------- گزارش اشتباه: یک Issue تازه در گیت‌هاب با نام صفحه، نشانی و نزدیک‌ترین عنوان ---------- */
  var REPORT = "https://github.com/Sahandazadee/public-html/issues/new";
  function nearestHeading() {
    /* آخرین عنوانی که از بالای صفحه رد شده، یعنی بخشی که خواننده الان در آن است */
    var hs = article.querySelectorAll("h1, h2, h3"), best = null, lim = innerHeight * 0.35;
    for (var i = 0; i < hs.length; i++) if (hs[i].getBoundingClientRect().top < lim) best = hs[i];
    return best;
  }
  function reportHref() {
    var h = nearestHeading(), sec = h && h.tagName !== "H1" ? h : null;
    var parts = document.title.split(" · "), title = parts.length > 1 ? parts.slice(0, -1).join(" · ") : document.title;
    var url = location.href.split("#")[0] + (sec && sec.id ? "#" + sec.id : "");
    var body = t("reportBody").replace("%u", url).replace("%h", sec ? sec.textContent.trim() : "-");
    return REPORT + "?title=" + encodeURIComponent(t("reportTitle").replace("%s", title)) + "&body=" + encodeURIComponent(body);
  }
  /* نشانی درست پیش از باز شدن ساخته می‌شود (کلیک، کلیک وسط یا منوی راست‌کلیک) */
  ["mousedown", "focusin", "contextmenu"].forEach(function (ev) {
    document.addEventListener(ev, function (e) { var a = e.target.closest && e.target.closest('[data-act="report"]'); if (a) a.href = reportHref(); });
  });

  /* ---------- پیشرفت ---------- */
  function doneCount() { return done.filter(function (d) { return lessons.some(function (l) { return l.id === d; }); }).length; }
  function fmtN(str, n) { return str.replace("%n", fa(n)).replace("%t", fa(lessons.length)); }
  function refreshProgress() {
    var n = doneCount(), p = Math.round(n / lessons.length * 100), pill = top.querySelector(".progress-pill");
    top.querySelector(".bar i").style.width = p + "%";
    /* شمارنده «چند درس از ۲۴» در همه عرض‌ها، با برچسب کامل برای صفحه‌خوان */
    top.querySelector(".pct").textContent = fmtN(t("progressOf"), n);
    pill.setAttribute("aria-label", fmtN(t("progressAria"), n));
    side.querySelectorAll("a.l").forEach(function (a) { a.classList.toggle("done", done.indexOf(a.getAttribute("data-id")) > -1); });
    document.dispatchEvent(new CustomEvent("esp32mc-progress"));
    document.querySelectorAll("[data-lesson-link]").forEach(function (li) { li.classList.toggle("done", done.indexOf(li.getAttribute("data-lesson-link")) > -1); });
    /* شمارنده «چند درس از این فصل تمام شده» کنار عنوان هر فصل */
    C.chapters.forEach(function (ch) {
      var n = ch.lessons.filter(function (l) { return done.indexOf(l.id) > -1; }).length, c = side.querySelector('.cnt[data-ch="' + ch.n + '"]');
      if (c) { c.textContent = EN ? n + "/" + ch.lessons.length : fa(n) + " از " + fa(ch.lessons.length); c.classList.toggle("full", n === ch.lessons.length); }
    });
  }

  if (lesson) {
    var isDone = function () { return done.indexOf(lesson.id) > -1; };
    var box = el("div", { "class": "done-box" }, '<p></p><button class="btn" data-act="done"></button>');
    /* تیک «تمام کردم» فقط وقتی فعال است که همه آزمون‌های درس درست جواب داده شده باشند */
    var quizLeft = function () { return article.querySelectorAll(".quiz").length - article.querySelectorAll(".quiz.solved").length; };
    var paint = function () {
      var left = quizLeft(), b = box.querySelector("button");
      box.querySelector("p").textContent = isDone() ? t("doneYes") : left > 0 ? t("doneLocked").replace("%n", fa(left)) : t("doneNo");
      b.textContent = isDone() ? t("doneBtnYes") : t("doneBtnNo");
      b.disabled = !isDone() && left > 0;
      b.classList.toggle("done", isDone());
    };
    paint();
    box.insertAdjacentHTML("beforeend", '<a class="report-link" data-act="report" target="_blank" rel="noopener" href="' + REPORT + '">' + t("reportLesson") + '</a>');
    box.querySelector("button").addEventListener("click", function () {
      if (isDone()) done.splice(done.indexOf(lesson.id), 1); else if (quizLeft() === 0) done.push(lesson.id); else return;
      store("esp32mc-done", done); paint(); refreshProgress();
    });
    document.addEventListener("esp32mc-quiz", paint);
    article.appendChild(box);
    var prev = lessons[idx - 1], next = lessons[idx + 1];
    var pg = el("nav", { "class": "pager" },
      (prev ? '<a class="prev" href="' + prev.id + '.html"><small>' + t("prev") + '</small>' + LX(prev, "title") + '</a>' : '<a class="prev" href="index.html"><small>' + t("back") + '</small>' + t("home") + '</a>') +
      (next ? '<a class="next" href="' + next.id + '.html"><small>' + t("next") + '</small>' + LX(next, "title") + '</a>' : '<a class="next" href="index.html"><small>' + t("end") + '</small>' + t("backHome") + '</a>'));
    article.appendChild(pg);
  }
  main.appendChild(el("footer", { "class": "footer" }, t("footer") + ' · <a class="report" data-act="report" target="_blank" rel="noopener" href="' + REPORT + '">' + t("report") + ' ↗</a>'));
  refreshProgress();

  /* ---------- صفحه خانه: پشتیبان‌گیری و بازگرداندن پیشرفت (فایل JSON) ----------
     کلیدهای localStorage همان قبلی‌ها هستند: esp32mc-done، esp32mc-quiz، esp32mc-lang، esp32mc-theme */
  function download(name, text, type) {
    var url = URL.createObjectURL(new Blob([text], { type: type || "text/plain;charset=utf-8" }));
    var a = el("a", { href: url, download: name }); document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  if (pageId === "index") {
    var pp = el("section", { "class": "progress-panel no-print", "aria-labelledby": "pp-title" },
      '<h3 id="pp-title">📦 ' + t("ppTitle") + '</h3><p class="pp-text"></p><div class="pp-actions">' +
      '<button type="button" class="btn" data-pp="save">⬇ ' + t("ppSave") + '</button>' +
      '<label class="btn pp-load">⬆ ' + t("ppLoad") + '<input type="file" accept="application/json,.json" class="vh"></label></div>' +
      '<p class="pp-msg" role="status" aria-live="polite"></p>');
    var ppText = function () { pp.querySelector(".pp-text").textContent = fmtN(t("ppText"), doneCount()); };
    ppText(); document.addEventListener("esp32mc-progress", ppText);
    var anchorEl = document.getElementById("chapters");
    if (anchorEl && article.contains(anchorEl)) anchorEl.parentNode.insertBefore(pp, anchorEl.nextSibling); else article.appendChild(pp);
    pp.querySelector('[data-pp="save"]').addEventListener("click", function () {
      var data = { app: "esp32mc", v: 1, saved: new Date().toISOString(), done: store("esp32mc-done") || [], quiz: store("esp32mc-quiz") || {}, lang: store("esp32mc-lang"), theme: store("esp32mc-theme") };
      download("esp32-masterclass-progress-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(data, null, 2), "application/json");
    });
    pp.querySelector("input[type=file]").addEventListener("change", function () {
      var file = this.files && this.files[0], msg = pp.querySelector(".pp-msg"), inp = this;
      if (!file) return;
      var rd = new FileReader();
      rd.onload = function () {
        var d; try { d = JSON.parse(rd.result); } catch (e) { d = null; }
        if (!d || d.app !== "esp32mc" || !Array.isArray(d.done)) { msg.textContent = t("ppBad"); msg.className = "pp-msg bad"; inp.value = ""; return; }
        /* ادغام، نه جایگزینی: درس‌ها و آزمون‌های حل‌شده این مرورگر از دست نمی‌روند */
        var ids = lessons.map(function (l) { return l.id; });
        d.done.forEach(function (id) { if (ids.indexOf(id) > -1 && done.indexOf(id) < 0) done.push(id); });
        var q = store("esp32mc-quiz") || {};
        if (d.quiz && typeof d.quiz === "object") Object.keys(d.quiz).forEach(function (k) {
          if (ids.indexOf(k) < 0 || !Array.isArray(d.quiz[k])) return;
          q[k] = (q[k] || []).concat(d.quiz[k].filter(function (n) { return typeof n === "number" && (q[k] || []).indexOf(n) < 0; }));
        });
        store("esp32mc-done", done); store("esp32mc-quiz", q);
        if (d.lang === "fa" || d.lang === "en") store("esp32mc-lang", d.lang);
        if (d.theme === "light" || d.theme === "dark") store("esp32mc-theme", d.theme);
        msg.textContent = fmtN(t("ppOk"), doneCount()); msg.className = "pp-msg ok";
        refreshProgress();
        setTimeout(function () { location.reload(); }, 1200);
      };
      rd.readAsText(file);
    });
  }

  /* فهرست «روی این صفحه» */
  var h2s = article.querySelectorAll("h2");
  if (h2s.length > 1) {
    var toc = '<h4>' + t("onPage") + '</h4>';
    /* عنوان‌های کارت «اهداف و پیش‌نیاز» شناسه می‌گیرند ولی در فهرست نمی‌آیند */
    h2s.forEach(function (h, i) { if (!h.id) h.id = "s" + (i + 1); if (!h.closest(".goals")) toc += '<a class="x" href="#' + h.id + '">' + esc(h.textContent) + '</a>'; });
    side.insertAdjacentHTML("afterbegin", toc);
  }

  /* ---------- رویدادهای عمومی ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act]");
    if (t) {
      var a = t.getAttribute("data-act");
      if (a === "nav") document.body.classList.toggle("nav-open");
      if (a === "report") t.href = reportHref();
      if (a === "search") { openSearch(); return; }
      if (a === "lang") { e.preventDefault(); store("esp32mc-lang", EN ? "fa" : "en"); location.href = TWIN + location.hash; return; }
      if (a === "theme") {
        var nt = isDark() ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nt); store("esp32mc-theme", nt); paintTheme();
      }
    }
    if (e.target.closest(".sidebar a")) document.body.classList.remove("nav-open");
    var img = e.target.closest("figure .frame img, .gallery img");
    var svg = !img && e.target.closest(".wiring .frame svg, figure .frame > svg");
    if (img || svg) {
      /* بزرگ‌نمایی: عکس یا نقشه سیم‌کشی تمام‌صفحه باز می‌شود؛ با کلیک یا Esc بسته می‌شود */
      var lb = el("div", { "class": "lightbox" });
      if (img) lb.innerHTML = '<img src="' + img.getAttribute("src") + '" alt="">';
      else { var c = svg.cloneNode(true); c.removeAttribute("width"); c.removeAttribute("height"); c.setAttribute("class", "lb-svg"); lb.appendChild(c); }
      var close = function () { lb.remove(); document.removeEventListener("keydown", onKey); };
      var onKey = function (ev) { if (ev.key === "Escape") close(); };
      lb.addEventListener("click", close);
      document.addEventListener("keydown", onKey);
      document.body.appendChild(lb);
    }
  });

  /* ---------- رنگ‌آمیزی کد ---------- */
  var KW = "if else for while do switch case default break continue return void const static volatile unsigned signed struct class public private protected new delete true false nullptr sizeof typedef enum include define ifdef ifndef endif auto using namespace template typename IRAM_ATTR RTC_DATA_ATTR".split(" ");
  var TY = "int long short char bool float double byte uint8_t uint16_t uint32_t uint64_t int8_t int16_t int32_t int64_t size_t String boolean word".split(" ");
  var CONSTS = "HIGH LOW INPUT OUTPUT INPUT_PULLUP INPUT_PULLDOWN LED_BUILTIN RISING FALLING CHANGE WIFI_STA WIFI_AP WL_CONNECTED".split(" ");
  function tokenize(src, lang) {
    var out = [], m, re;
    if (lang === "json") re = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\b\d+(?:\.\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)|([\s\S])/g;
    else if (lang === "ini" || lang === "bash" || lang === "text") re = /(#[^\n]*|;[^\n]*)|("(?:\\.|[^"\\])*")|(\[[^\]\n]*\])|(\b\d+(?:\.\d+)?\b)|([\s\S])/g;
    else re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(R"([^(\s]*)\([\s\S]*?\)\3"|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(#\s*\w+)|(\b0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?[fFuUlL]*\b)|([A-Za-z_]\w*)(?=\s*\()|([A-Za-z_]\w*)|([\s\S])/g;
    while ((m = re.exec(src))) {
      if (lang === "json") {
        if (m[1]) { out.push([m[1], m[2] ? "tk-type" : "tk-str"]); if (m[2]) out.push([m[2], ""]); }
        else if (m[3]) out.push([m[3], "tk-num"]); else if (m[4]) out.push([m[4], "tk-kw"]); else out.push([m[5], ""]);
      } else if (lang === "ini" || lang === "bash" || lang === "text") {
        if (lang === "text") { out.push([m[0], ""]); continue; }
        if (m[1]) out.push([m[1], "tk-com"]); else if (m[2]) out.push([m[2], "tk-str"]); else if (m[3]) out.push([m[3], "tk-pre"]); else if (m[4]) out.push([m[4], "tk-num"]); else out.push([m[5], ""]);
      } else {
        if (m[1]) out.push([m[1], "tk-com"]);
        else if (m[2]) out.push([m[2], "tk-str"]);
        else if (m[4]) out.push([m[4], "tk-pre"]);
        else if (m[5]) out.push([m[5], "tk-num"]);
        else if (m[6]) out.push([m[6], KW.indexOf(m[6]) > -1 ? "tk-kw" : "tk-fn"]);
        else if (m[7]) out.push([m[7], KW.indexOf(m[7]) > -1 ? "tk-kw" : TY.indexOf(m[7]) > -1 ? "tk-type" : CONSTS.indexOf(m[7]) > -1 ? "tk-num" : ""]);
        else out.push([m[8], ""]);
      }
    }
    return out;
  }
  function renderCode(block) {
    var pre = block.querySelector("pre");
    var raw = pre.textContent.replace(/^\n/, "").replace(/\s+$/, "");
    var lang = block.getAttribute("data-lang") || "cpp";
    var toks = tokenize(raw, lang), lines = [""];
    toks.forEach(function (t) {
      var parts = t[0].split("\n");
      parts.forEach(function (p, i) {
        if (i > 0) lines.push("");
        if (!p) return;
        var fa_ = /[\u0600-\u06FF]/.test(p);
        if (fa_ && t[1] === "tk-com") {
          var mm = /^(\s*(?:\/\/|\/\*|\*)?\s*)([\s\S]*)$/.exec(p);
          lines[lines.length - 1] += '<span class="tk-com">' + esc(mm[1]) + '</span><span class="tk-com fa-run" dir="rtl">' + esc(mm[2]) + '</span>';
        } else if (fa_ && t[1] === "tk-str") {
          /* فقط تکه‌های فارسی داخل رشته را جدا راست‌به‌چپ می‌کنیم تا ترتیب بقیه خط به هم نریزد */
          lines[lines.length - 1] += '<span class="tk-str">' + p.split(/([\u0600-\u06FF][\u0600-\u06FF\u200c ]*[\u0600-\u06FF]|[\u0600-\u06FF])/).map(function (seg, k) {
            return k % 2 ? '<span class="fa-run" dir="rtl">' + esc(seg) + '</span>' : esc(seg);
          }).join("") + '</span>';
        }
        else lines[lines.length - 1] += t[1] ? '<span class="' + t[1] + '">' + esc(p) + '</span>' : esc(p);
      });
    });
    pre.innerHTML = lines.map(function (l) { return '<span class="ln">' + (l || " ") + '</span>'; }).join("");
    /* برنامه کامل (setup و loop دارد) دکمه دانلود ‎.ino هم می‌گیرد؛ نام فایل از data-file یا sketch.ino */
    var df = block.getAttribute("data-file") || "", full = lang === "cpp" && /\bsetup\s*\(/.test(raw) && /\bloop\s*\(/.test(raw);
    var ino = /^[\w.-]+\.(ino|cpp)$/.test(df) ? df : "sketch.ino";
    var bar = el("div", { "class": "bar" }, '<span class="dots"><i></i><i></i><i></i></span><span class="fname">' + esc(df || lang) + '</span>' +
      (full ? '<button type="button" class="dl" aria-label="' + esc(t("dlIno") + ": " + ino) + '">⬇ ' + t("dlIno") + '</button>' : '') + '<button type="button" class="cp">' + t("copy") + '</button>');
    block.insertBefore(bar, pre);
    if (full) bar.querySelector(".dl").addEventListener("click", function () { download(ino, raw + "\n"); });
    bar.querySelector(".cp").addEventListener("click", function () {
      var b = this;
      var done = function () { b.textContent = t("copied"); setTimeout(function () { b.textContent = t("copy"); }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(raw).then(done, function () { fallbackCopy(raw); done(); });
      else { fallbackCopy(raw); done(); }
    });
  }
  function fallbackCopy(t) { var ta = el("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); }
  article.querySelectorAll(".code").forEach(renderCode);

  /* توضیح تکه‌تکه: کلیک روی هر مرحله، خط‌های مربوط را در کد پررنگ می‌کند */
  article.querySelectorAll("ol.walk").forEach(function (ol) {
    var code = ol.getAttribute("data-for") ? document.getElementById(ol.getAttribute("data-for")) : null;
    if (!code) { var p = ol.previousElementSibling; while (p && !p.classList.contains("code")) p = p.previousElementSibling; code = p; }
    ol.querySelectorAll("li[data-lines]").forEach(function (li) {
      var r = li.getAttribute("data-lines");
      li.insertAdjacentHTML("afterbegin", '<span class="lines">L' + r + '</span>');
      /* مثل گزینه‌های آزمون با صفحه‌کلید هم کار می‌کند: Tab، سپس Enter یا فاصله */
      li.setAttribute("tabindex", "0"); li.setAttribute("role", "button"); li.setAttribute("aria-pressed", "false");
      li.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target === li) { e.preventDefault(); li.click(); } });
      li.addEventListener("click", function (e) {
        if (!code || (e.target.closest && e.target.closest("a"))) return;
        var lns = code.querySelectorAll(".ln"), on = !li.classList.contains("on");
        ol.querySelectorAll("li").forEach(function (x) { x.classList.remove("on"); if (x.hasAttribute("aria-pressed")) x.setAttribute("aria-pressed", "false"); });
        lns.forEach(function (x) { x.classList.remove("hl"); });
        if (!on) return;
        li.classList.add("on"); li.setAttribute("aria-pressed", "true");
        r.split(",").forEach(function (seg) {
          var ab = seg.split("-"), a = +ab[0], b = +(ab[1] || ab[0]);
          for (var i = a; i <= b; i++) if (lns[i - 1]) lns[i - 1].classList.add("hl");
        });
        var first = code.querySelector(".ln.hl");
        if (first) { var rect = code.getBoundingClientRect(); if (rect.top < 60 || rect.bottom > innerHeight) code.scrollIntoView({ behavior: "smooth", block: "nearest" }); }
      });
    });
  });

  /* ---------- آزمون چهارگزینه‌ای ---------- */
  var quizzes = article.querySelectorAll(".quiz");
  quizzes.forEach(function (q) {
    var ans = +q.getAttribute("data-answer");
    var items = q.querySelectorAll("ol > li");
    var fb = q.querySelector(".fb");
    if (fb) fb.setAttribute("data-orig", fb.innerHTML);
    items.forEach(function (li, i) {
      li.insertAdjacentHTML("afterbegin", "<b>" + t("letters")[i] + ") </b>");
      /* با صفحه‌کلید هم بشود جواب داد: Tab برای رفتن، Enter یا فاصله برای انتخاب */
      li.setAttribute("tabindex", "0"); li.setAttribute("role", "button");
      li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); li.click(); } });
      li.addEventListener("click", function () {
        if (q.classList.contains("solved")) return;
        if (i + 1 === ans) { li.classList.add("right"); q.classList.add("solved"); saveQuiz(); }
        else li.classList.add("wrong");
        q.classList.add("answered");
        if (!fb) fb = q.appendChild(el("div", { "class": "fb", "data-orig": "" }));
        fb.setAttribute("aria-live", "polite");
        fb.style.borderInlineStart = "4px solid " + (i + 1 === ans ? "var(--green)" : "var(--red)");
        fb.innerHTML = (i + 1 === ans ? "<b>" + t("right") + "</b> " : "<b>" + t("wrong") + "</b> ") + (i + 1 === ans ? fb.getAttribute("data-orig") : (li.getAttribute("data-why") || t("hint")));
        updateScore();
      });
    });
  });
  /* آزمون‌های درست‌شده در مرورگر ذخیره می‌شوند تا با بستن صفحه از دست نروند */
  var QKEY = "esp32mc-quiz", qStore = store(QKEY) || {};
  function saveQuiz() {
    if (!lesson) return;
    qStore[lesson.id] = [];
    quizzes.forEach(function (q, k) { if (q.classList.contains("solved")) qStore[lesson.id].push(k); });
    store(QKEY, qStore);
  }
  if (lesson && qStore[lesson.id]) qStore[lesson.id].forEach(function (k) {
    var q = quizzes[k]; if (!q) return;
    var li = q.querySelectorAll("ol > li")[+q.getAttribute("data-answer") - 1];
    if (li) { q.classList.remove("solved"); li.click(); }
  });
  function updateScore() {
    document.dispatchEvent(new CustomEvent("esp32mc-quiz"));
    var s = article.querySelector(".quiz-score");
    if (!s) return;
    var solved = article.querySelectorAll(".quiz.solved").length;
    s.textContent = t("score") + " " + fa(solved) + " " + t("of") + " " + fa(quizzes.length) + (solved === quizzes.length ? t("perfect") : "");
  }
  updateScore();

  /* ---------- Wokwi ---------- */
  article.querySelectorAll(".wokwi").forEach(function (w, i) {
    var js = w.querySelector('script[type="application/json"]');
    var diagram = js ? js.textContent.trim() : "";
    var code = w.getAttribute("data-code-from") ? document.getElementById(w.getAttribute("data-code-from")) : null;
    var body = w.innerHTML.replace(/<script[\s\S]*?<\/script>/i, "");
    var board = w.getAttribute("data-board") || "esp32";
    var url = w.getAttribute("data-url") || "https://wokwi.com/projects/new/" + board;
    w.innerHTML = '<div class="wh"><b>' + (w.getAttribute("data-title") || t("wokwiTitle")) + '</b>' +
      '<a class="btn" target="_blank" rel="noopener" href="' + url + '">' + t("wokwiOpen") + '</a>' +
      (diagram ? '<button class="btn" data-copy="d">' + t("copyDiagram") + '</button><button class="btn" data-dl="d">⬇ ' + t("dlDiagram") + '</button>' : '') +
      (code ? '<button class="btn" data-copy="c">' + t("copySketch") + '</button>' : '') + '</div>' +
      '<div class="wb">' + body + (diagram ? '<details><summary>' + t("diagramSum") + '</summary><div class="code" data-lang="json" data-file="diagram.json"><pre>' + esc(diagram) + '</pre></div></details>' : '') + '</div>';
    w.querySelectorAll(".code").forEach(renderCode);
    var dlb = w.querySelector("[data-dl]");
    if (dlb) dlb.addEventListener("click", function () { download("diagram.json", diagram + "\n", "application/json"); });
    w.querySelectorAll("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var txt = b.getAttribute("data-copy") === "d" ? diagram : code.querySelector("pre").innerText;
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).catch(function () { fallbackCopy(txt); });
        var o = b.textContent; b.textContent = t("copied"); setTimeout(function () { b.textContent = o; }, 1500);
      });
    });
  });

  /* ---------- ویدیو یوتیوب ---------- */
  function tsec(t) { return t.split(":").reduce(function (a, b) { return a * 60 + (+b); }, 0); }
  article.querySelectorAll(".video[data-yt]").forEach(function (v) {
    var id = v.getAttribute("data-yt");
    var stamps = v.querySelectorAll("[data-t]");
    var sum = v.querySelector(".sum");
    var html = '<div class="ratio"><div class="poster"><div><div class="play"></div><div>' + esc(v.getAttribute("data-title") || "") + '</div><small style="opacity:.7">' + t("play") + '</small></div></div></div>' +
      '<div class="vb"><h3>🎬 ' + esc(v.getAttribute("data-title") || "") + '</h3><div class="chan">' + t("channel") + ': ' + esc(v.getAttribute("data-channel") || "") + ' · ' + t("vlang") + ': ' + esc(v.getAttribute("data-lang") || t("vdefault")) + ' · <a target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=' + id + '">' + t("openYT") + '</a></div>';
    if (stamps.length) {
      html += '<div class="stamps">';
      stamps.forEach(function (s) { html += '<button data-s="' + tsec(s.getAttribute("data-t")) + '"><span>' + s.getAttribute("data-t") + '</span>' + s.innerHTML + '</button>'; });
      html += '</div>';
    }
    if (sum) html += '<details><summary>' + esc(v.getAttribute("data-sum-label") || t("watchGuide")) + '</summary>' + sum.innerHTML + '</details>';
    html += '</div>';
    v.innerHTML = html;
    function play(s) {
      v.querySelector(".ratio").innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0' + (s ? "&start=" + s : "") + '" title="' + esc(v.getAttribute("data-title") || "") + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
    }
    v.querySelector(".poster").addEventListener("click", function () { play(0); });
    v.querySelectorAll("[data-s]").forEach(function (b) { b.addEventListener("click", function () { play(+b.getAttribute("data-s")); }); });
  });

  /* ---------- نقشه پایه‌های ESP32 DevKitC V4 (۳۸ پایه) ---------- */
  var TAGS = {
    power: ["تغذیه", "#d6453d", "Power"], gnd: ["زمین", "#222", "Ground"], safe: ["امن برای استفاده", "#12a37f", "Safe to use"], input: ["فقط ورودی", "#c99a06", "Input only"],
    adc1: ["ADC1", "#8b4fd6", "ADC1"], adc2: ["ADC2 (با Wi-Fi کار نمی‌کند)", "#b07be0", "ADC2 (not with Wi-Fi)"], touch: ["لمسی", "#e0781f", "Touch"], dac: ["DAC", "#2f7af0", "DAC"],
    strap: ["Strapping (حساس هنگام بوت)", "#d6457a", "Strapping (boot-sensitive)"], flash: ["فلش — استفاده نکن", "#7b889b", "Flash — do not use"], uart: ["UART0 (USB)", "#475569", "UART0 (USB)"],
    i2c: ["I2C پیش‌فرض", "#0f8fa8", "Default I2C"], spi: ["SPI پیش‌فرض (VSPI)", "#0ea5e9", "Default SPI (VSPI)"], rtc: ["RTC (بیدارکننده خواب)", "#65a30d", "RTC (can wake from sleep)"]
  };
  var L = [
    ["3V3", null, ["power"], "خروجی ۳٫۳ ولت تنظیم‌شده. برای تغذیه سنسورهای ۳٫۳ ولتی. حداکثر حدود ۵۰۰ میلی‌آمپر برای کل برد."],
    ["EN", null, ["power"], "Enable / ریست. اگر به زمین وصل شود برد ریست می‌شود. دکمه EN روی برد همین کار را می‌کند."],
    ["GPIO36", 36, ["input", "adc1", "rtc"], "با اسم VP یا SENSOR_VP. فقط ورودی است، مقاومت Pull-up داخلی ندارد. عالی برای خواندن سنسور آنالوگ (ADC1_CH0)."],
    ["GPIO39", 39, ["input", "adc1", "rtc"], "با اسم VN. فقط ورودی، بدون Pull-up داخلی. ADC1_CH3."],
    ["GPIO34", 34, ["input", "adc1", "rtc"], "فقط ورودی، بدون Pull-up داخلی. گزینه خوب برای پتانسیومتر (ADC1_CH6). نمی‌تواند LED روشن کند."],
    ["GPIO35", 35, ["input", "adc1", "rtc"], "فقط ورودی، بدون Pull-up داخلی. ADC1_CH7."],
    ["GPIO32", 32, ["safe", "adc1", "touch", "rtc"], "همه‌کاره و امن. ADC1_CH4 و لمسی T9. مناسب سنسور آنالوگ حتی وقتی Wi-Fi روشن است."],
    ["GPIO33", 33, ["safe", "adc1", "touch", "rtc"], "همه‌کاره و امن. ADC1_CH5 و لمسی T8."],
    ["GPIO25", 25, ["safe", "adc2", "dac", "rtc"], "خروجی DAC1 (ولتاژ آنالوگ واقعی). ADC2 است پس با Wi-Fi روشن نمی‌شود با آن آنالوگ خواند."],
    ["GPIO26", 26, ["safe", "adc2", "dac", "rtc"], "خروجی DAC2. ADC2_CH9."],
    ["GPIO27", 27, ["safe", "adc2", "touch", "rtc"], "همه‌کاره. لمسی T7."],
    ["GPIO14", 14, ["adc2", "touch", "rtc"], "هنگام بوت سیگنال PWM بیرون می‌دهد؛ برای رله یا موتور مراقب باش. لمسی T6."],
    ["GPIO12", 12, ["strap", "adc2", "touch", "rtc"], "پین Strapping (MTDI): اگر هنگام روشن شدن HIGH باشد، ولتاژ فلش را اشتباه تنظیم می‌کند و برد بوت نمی‌شود. تا جای ممکن استفاده نکن."],
    ["GND", null, ["gnd"], "زمین. همه قطعات باید به GND مشترک وصل باشند."],
    ["GPIO13", 13, ["safe", "adc2", "touch", "rtc"], "همه‌کاره و امن. لمسی T4. در SPI دوم (HSPI) نقش MOSI دارد."],
    ["GPIO9", 9, ["flash"], "به حافظه فلش داخلی وصل است (SD2). هرگز استفاده نکن، برنامه کرش می‌کند."],
    ["GPIO10", 10, ["flash"], "به حافظه فلش داخلی وصل است (SD3). استفاده نکن."],
    ["GPIO11", 11, ["flash"], "به حافظه فلش داخلی وصل است (CMD). استفاده نکن."],
    ["5V", null, ["power"], "۵ ولت مستقیم از USB (یا ورودی ۵ ولت برد). برای سروو و ماژول‌های ۵ ولتی. هرگز ۵ ولت را به GPIO نده."]
  ];
  var R = [
    ["GND", null, ["gnd"], "زمین."],
    ["GPIO23", 23, ["safe", "spi"], "همه‌کاره. پیش‌فرض MOSI در VSPI (کارت SD و نمایشگرهای SPI)."],
    ["GPIO22", 22, ["safe", "i2c"], "پیش‌فرض SCL در I2C (سیم ساعت نمایشگر OLED و سنسورها)."],
    ["GPIO1", 1, ["uart"], "TX0: پیام‌های Serial.print از اینجا به USB می‌رود. استفاده از آن Serial Monitor را خراب می‌کند."],
    ["GPIO3", 3, ["uart"], "RX0: دریافت از USB. هنگام آپلود برنامه استفاده می‌شود؛ وصل نکن."],
    ["GPIO21", 21, ["safe", "i2c"], "پیش‌فرض SDA در I2C (سیم داده)."],
    ["GND", null, ["gnd"], "زمین."],
    ["GPIO19", 19, ["safe", "spi"], "پیش‌فرض MISO در VSPI."],
    ["GPIO18", 18, ["safe", "spi"], "پیش‌فرض SCK (ساعت) در VSPI."],
    ["GPIO5", 5, ["strap", "spi"], "Strapping و پیش‌فرض CS در VSPI. هنگام بوت PWM بیرون می‌دهد. برای CS کارت SD رایج و مشکلی ندارد."],
    ["GPIO17", 17, ["safe"], "همه‌کاره. روی برد با اسم TX2 چاپ شده و انتخاب رایج برای Serial2 است، ولی در هسته نسخه 3 باید پین را صریح بدهی: Serial2.begin(9600, SERIAL_8N1, 16, 17). روی ماژول WROVER به PSRAM وصل است."],
    ["GPIO16", 16, ["safe"], "همه‌کاره. روی برد با اسم RX2 چاپ شده؛ برای Serial2 پین را صریح بده (پیش‌فرض خود هسته نسخه 3 پین‌های 4 و 25 است). روی ماژول WROVER به PSRAM وصل است."],
    ["GPIO4", 4, ["safe", "adc2", "touch", "rtc"], "همه‌کاره و امن. لمسی T0."],
    ["GPIO0", 0, ["strap", "adc2", "touch", "rtc"], "دکمه BOOT به این پین وصل است. اگر هنگام روشن شدن LOW باشد، برد به حالت دریافت برنامه می‌رود. مراقب باش."],
    ["GPIO2", 2, ["strap", "adc2", "touch", "rtc"], "روی بسیاری از بردها LED آبی داخلی به آن وصل است. Strapping است ولی برای LED مشکلی ندارد. لمسی T2."],
    ["GPIO15", 15, ["strap", "adc2", "touch", "rtc"], "Strapping (MTDO): پیام‌های لاگ بوت را کنترل می‌کند. هنگام بوت PWM بیرون می‌دهد. لمسی T3."],
    ["GPIO8", 8, ["flash"], "به حافظه فلش وصل است (SD1). استفاده نکن."],
    ["GPIO7", 7, ["flash"], "به حافظه فلش وصل است (SD0). استفاده نکن."],
    ["GPIO6", 6, ["flash"], "به حافظه فلش وصل است (CLK). استفاده نکن."]
  ];
  var L_EN = ["Regulated 3.3 V output for 3.3 V sensors. Roughly 500 mA for the whole board.", "Enable / reset. Pulling it to GND resets the board; the EN button does exactly this.", "Also called VP or SENSOR_VP. Input only, no internal pull-up. Great for an analog sensor (ADC1_CH0).", "Also called VN. Input only, no internal pull-up. ADC1_CH3.", "Input only, no internal pull-up. A good choice for a potentiometer (ADC1_CH6). It cannot drive an LED.", "Input only, no internal pull-up. ADC1_CH7.", "General purpose and safe. ADC1_CH4 and touch T9. Good for analog sensors even with Wi-Fi on.", "General purpose and safe. ADC1_CH5 and touch T8.", "DAC1 output (a real analog voltage). It is on ADC2, so no analog reads while Wi-Fi is on.", "DAC2 output. ADC2_CH9.", "General purpose. Touch T7.", "Outputs a PWM signal during boot, so be careful with relays or motors. Touch T6.", "Strapping pin (MTDI): if it is HIGH at power-up the flash voltage is set wrong and the board won't boot. Avoid it when you can.", "Ground. Every part must share this common GND.", "General purpose and safe. Touch T4. MOSI of the second SPI bus (HSPI).", "Connected to the internal flash (SD2). Never use it; the program will crash.", "Connected to the internal flash (SD3). Do not use.", "Connected to the internal flash (CMD). Do not use.", "5 V straight from USB (or the board's 5 V input). For servos and 5 V modules. Never feed 5 V into a GPIO."];
  var R_EN = ["Ground.", "General purpose. Default MOSI of VSPI (SD cards and SPI displays).", "Default I2C SCL (clock line for the OLED and sensors).", "TX0: Serial.print output goes to USB through this pin. Using it breaks the Serial Monitor.", "RX0: receives from USB and is used during upload. Leave it unconnected.", "Default I2C SDA (data line).", "Ground.", "Default MISO of VSPI.", "Default SCK (clock) of VSPI.", "Strapping pin and default VSPI CS. Outputs PWM during boot. Commonly and safely used as the SD card CS.", "General purpose. Printed TX2 on many boards and a common choice for Serial2, but on core 3.x pass the pins explicitly: Serial2.begin(9600, SERIAL_8N1, 16, 17). Used by PSRAM on WROVER modules.", "General purpose. Printed RX2; pass it explicitly to Serial2 (core 3.x defaults are GPIO4 and GPIO25). Used by PSRAM on WROVER modules.", "General purpose and safe. Touch T0.", "The BOOT button is wired here. If it is LOW at power-up the board enters download mode. Be careful.", "Many boards have a blue LED here. It is a strapping pin but fine for an LED. Touch T2.", "Strapping pin (MTDO): controls boot log output and outputs PWM during boot. Touch T3.", "Connected to the flash (SD1). Do not use.", "Connected to the flash (SD0). Do not use.", "Connected to the flash (CLK). Do not use."];
  function tagName(k) { return EN ? TAGS[k][2] : TAGS[k][0]; }
  /* رنگ متن روی برچسب: سفید یا سرمه‌ای، هر کدام که کنتراست بیشتری با رنگ برچسب دارد */
  function textOn(hex) {
    var h = hex.replace("#", ""); if (h.length === 3) h = h.replace(/./g, "$&$&");
    var c = [0, 2, 4].map(function (i) { var v = parseInt(h.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return (1.05 / (L + 0.05)) >= ((L + 0.05) / (0.0137 + 0.05)) ? "#fff" : "#152033";
  }
  /* نقش ثابت هر پایه در نقشه پایه‌های این دوره (درس ۱.۳، بخش plan) */
  var ROLE = { 4: ["LED وضعیت", "status LED"], 27: ["دکمه ۱", "button 1"], 33: ["دکمه ۲", "button 2"], 34: ["پتانسیومتر", "potentiometer"], 35: ["LDR", "LDR"], 13: ["سنسور DHT22", "DHT22 sensor"], 25: ["بازر", "buzzer"], 21: ["SDA در I2C (نمایشگر OLED)", "I2C SDA (OLED)"], 22: ["SCL در I2C (نمایشگر OLED)", "I2C SCL (OLED)"], 5: ["CS کارت SD", "SD card CS"], 18: ["SCK کارت SD", "SD card SCK"], 19: ["MISO کارت SD", "SD card MISO"], 23: ["MOSI کارت SD", "SD card MOSI"], 16: ["RX در UART2 (GPS)", "UART2 RX (GPS)"], 17: ["TX در UART2 (GPS)", "UART2 TX (GPS)"], 32: ["سروو یا NeoPixel", "servo or NeoPixel"], 26: ["رله، موتور یا ماسفت", "relay, motor or MOSFET"], 14: ["ورودی دوم موتور", "second motor input"] };
  function pinNote(side, i) {
    var n = (side ? R : L)[i][1], r = ROLE[n], base = EN ? (side ? R_EN : L_EN)[i] : (side ? R : L)[i][3];
    return r ? base + (EN ? " In this course: " + r[1] + "." : " در این دوره: " + r[0] + ".") : base;
  }
  var pinoutN = 0;
  function buildPinout(box) {
    var W = 860, pitch = 34, y0 = 300, H = y0 + pitch * 19 + 110, bx = 330, bw = 200;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + t("pinAria") + '">';
    s += '<rect x="' + bx + '" y="40" width="' + bw + '" height="' + (H - 60) + '" rx="12" fill="#1b1f2a"/>';
    s += '<rect x="' + (bx + 40) + '" y="20" width="' + (bw - 80) + '" height="70" rx="4" fill="#2a3040"/><path d="M' + (bx + 52) + ' 72 v-38 h18 v26 h18 v-26 h18 v26 h18 v-26 h18 v38" stroke="#d9b650" stroke-width="3" fill="none"/>';
    s += '<rect x="' + (bx + 36) + '" y="96" width="' + (bw - 72) + '" height="170" rx="6" fill="#c9ced8"/><text x="' + (bx + bw / 2) + '" y="175" text-anchor="middle" font-size="15" font-weight="700" fill="#333">ESP32</text><text x="' + (bx + bw / 2) + '" y="196" text-anchor="middle" font-size="12" fill="#444">WROOM-32</text>';
    s += '<rect x="' + (bx + 70) + '" y="' + (H - 120) + '" width="60" height="44" rx="4" fill="#2d3444"/><text x="' + (bx + bw / 2) + '" y="' + (H - 94) + '" text-anchor="middle" font-size="10" fill="#aab">CP2102</text>';
    s += '<rect x="' + (bx + 74) + '" y="' + (H - 40) + '" width="52" height="30" rx="5" fill="#b8bec9"/><text x="' + (bx + bw / 2) + '" y="' + (H - 20) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#333">USB</text>';
    s += '<rect x="' + (bx + 18) + '" y="' + (H - 76) + '" width="26" height="18" rx="3" fill="#ddd"/><text x="' + (bx + 31) + '" y="' + (H - 82) + '" text-anchor="middle" font-size="10" fill="#ccc">EN</text>';
    s += '<rect x="' + (bx + bw - 44) + '" y="' + (H - 76) + '" width="26" height="18" rx="3" fill="#ddd"/><text x="' + (bx + bw - 31) + '" y="' + (H - 82) + '" text-anchor="middle" font-size="10" fill="#ccc">BOOT</text>';
    function pin(p, i, side) {
      var y = y0 + i * pitch, px = side ? bx + bw - 14 : bx + 14;
      var col = TAGS[p[2][0]][1];
      var lx = side ? bx + bw + 20 : bx - 20 - 120;
      var g = '<g class="pin" data-side="' + side + '" data-i="' + i + '" data-tags="' + p[2].join(" ") + '">';
      g += '<circle cx="' + px + '" cy="' + y + '" r="7" fill="#e8c35a" stroke="#8a6d1c"/>';
      g += '<line x1="' + (side ? px + 8 : px - 8) + '" y1="' + y + '" x2="' + (side ? lx : lx + 120) + '" y2="' + y + '" stroke="#9aa4b5" stroke-width="1.5"/>';
      g += '<rect class="lbl" x="' + lx + '" y="' + (y - 13) + '" width="120" height="26" rx="7" fill="' + col + '"/>';
      g += '<text x="' + (lx + 60) + '" y="' + (y + 5) + '" text-anchor="middle" font-size="13.5" font-weight="700" fill="#fff" font-family="JetBrains Mono,monospace">' + p[0] + '</text>';
      var extra = p[2].filter(function (t) { return ["touch", "dac", "i2c", "spi", "adc1", "input"].indexOf(t) > -1; }).slice(0, 2);
      extra.forEach(function (t, k) {
        var w = 58, ex = side ? lx + 124 + k * (w + 4) : lx - 4 - (k + 1) * (w) - k * 4;
        var short = { touch: "TOUCH", dac: "DAC", i2c: p[1] === 21 ? "SDA" : "SCL", spi: { 23: "MOSI", 19: "MISO", 18: "SCK", 5: "CS" }[p[1]], adc1: "ADC1", input: "IN only" }[t];
        g += '<rect x="' + ex + '" y="' + (y - 11) + '" width="' + w + '" height="22" rx="6" fill="' + TAGS[t][1] + '" opacity=".9"/><text x="' + (ex + w / 2) + '" y="' + (y + 4) + '" text-anchor="middle" font-size="11" fill="' + textOn(TAGS[t][1]) + '" font-family="JetBrains Mono,monospace">' + short + '</text>';
      });
      return g + '</g>';
    }
    L.forEach(function (p, i) { s += pin(p, i, 0); });
    R.forEach(function (p, i) { s += pin(p, i, 1); });
    s += '</svg>';
    var f = '<div class="filters"><button type="button" class="on" aria-pressed="true" data-f="">' + t("all") + '</button>';
    ["safe", "input", "adc1", "adc2", "touch", "dac", "strap", "flash", "i2c", "spi", "uart", "rtc", "power"].forEach(function (t) { f += '<button type="button" aria-pressed="false" data-f="' + t + '">' + tagName(t) + '</button>'; });
    f += '</div>';
    /* روی گوشی (زیر ۸۰۰ پیکسل) یک فهرست لمسی هم زیر نقشه می‌آید؛ همان داده و همان pinNote() */
    function tagChips(p) { return p[2].map(function (t) { return '<span style="background:' + TAGS[t][1] + ';color:' + textOn(TAGS[t][1]) + '">' + tagName(t) + '</span>'; }).join(""); }
    function pinDetail(p, sd, i) {
      return '<p>' + pinNote(sd, i) + '</p>' + (p[1] != null ? '<p style="direction:ltr;text-align:start"><code>pinMode(' + p[1] + ', ' + (p[2].indexOf("input") > -1 ? "INPUT" : "OUTPUT") + ');</code></p>' : '');
    }
    var list = '<div class="pin-list" aria-label="' + t("pinList") + '" role="group">';
    [L, R].forEach(function (arr, sd) {
      list += '<p class="pl-h">' + t(sd ? "pinRight" : "pinLeft") + '</p><ul>';
      arr.forEach(function (p, i) {
        var id = "pl-" + pinoutN + "-" + sd + "-" + i;
        list += '<li data-tags="' + p[2].join(" ") + '"><button type="button" aria-expanded="false" aria-controls="' + id + '" data-side="' + sd + '" data-i="' + i + '"><b>' + p[0] + '</b><span class="tags">' + tagChips(p) + '</span></button><div class="pl-note" id="' + id + '" hidden>' + pinDetail(p, sd, i) + '</div></li>';
      });
      list += '</ul>';
    });
    list += '</div>';
    pinoutN++;
    box.innerHTML = f + '<div class="grid"><div>' + s + '</div><div class="info"><h4 dir="auto">' + t("pinPick") + '</h4><p>' + t("pinHelp") + '</p><p>' + t("pinGold") + '</p></div></div>' + list;
    var info = box.querySelector(".info");
    box.querySelectorAll(".pin").forEach(function (g) {
      g.addEventListener("click", function () {
        var sd = +g.getAttribute("data-side"), i = +g.getAttribute("data-i"), p = (sd ? R : L)[i];
        box.querySelectorAll(".pin").forEach(function (x) { x.classList.remove("sel"); });
        g.classList.add("sel");
        info.innerHTML = '<h4 dir="ltr">' + p[0] + '</h4><div class="tags">' + tagChips(p) + '</div>' + pinDetail(p, sd, i);
      });
    });
    box.querySelectorAll(".pin-list button").forEach(function (b) {
      b.addEventListener("click", function () {
        var open = b.getAttribute("aria-expanded") !== "true";
        b.setAttribute("aria-expanded", open ? "true" : "false");
        document.getElementById(b.getAttribute("aria-controls")).hidden = !open;
        /* همان پایه در نقشه بالا هم علامت می‌خورد */
        box.querySelectorAll(".pin").forEach(function (x) { x.classList.toggle("sel", open && x.getAttribute("data-side") === b.getAttribute("data-side") && x.getAttribute("data-i") === b.getAttribute("data-i")); });
      });
    });
    box.querySelectorAll("[data-f]").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-f");
        box.querySelectorAll("[data-f]").forEach(function (x) { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        box.querySelectorAll(".pin").forEach(function (g) { g.classList.toggle("dim", !!f && g.getAttribute("data-tags").split(" ").indexOf(f) < 0); });
        box.querySelectorAll(".pin-list li").forEach(function (li) { li.hidden = !!f && li.getAttribute("data-tags").split(" ").indexOf(f) < 0; });
      });
    });
  }
  article.querySelectorAll(".pinout").forEach(buildPinout);

  /* ---------- نقشه سیم‌کشی (Connection Map) ----------
     <div class="wiring"><script type="application/json">{
       "board":"ESP32 DevKitC",
       "parts":[{"id":"led1","name":"LED قرمز","img":"led.svg","pins":[["A","آند (+) پایه بلند"],["K","کاتد (−)"]]}],
       "wires":[["GPIO2","r1.1","orange"],["r1.2","led1.A","orange"],["led1.K","GND","black"]]
     }</script><figcaption>...</figcaption></div>  */
  var WC = { red: "#e0352b", black: "#222", orange: "#f08a24", yellow: "#e6b800", green: "#1e9e4a", blue: "#2563eb", purple: "#8b3fd6", white: "#9aa4b5", brown: "#8b5a2b", gray: "#6b7280", cyan: "#06a3c4", pink: "#e0457a" };
  function buildWiring(box) {
    var js = box.querySelector('script[type="application/json"]');
    if (!js) return;
    var spec; try { spec = JSON.parse(js.textContent); } catch (e) { box.insertAdjacentHTML("afterbegin", '<p style="color:red">' + t("wiringErr") + '</p>'); return; }
    var cap = box.querySelector("figcaption");
    var bpins = [];
    spec.wires.forEach(function (w) { [w[0], w[1]].forEach(function (e) { if (e.indexOf(".") < 0 && bpins.indexOf(e) < 0) bpins.push(e); }); });
    var pitch = 34, bx = 20, bw = 230, by = 30, bpy0 = by + 120;
    var bh = Math.max(bpy0 + bpins.length * pitch + 40 - by, 260);
    var lanes = spec.wires.length, laneGap = 13;
    var chanX = bx + bw + 30, px = chanX + lanes * laneGap + 30, pw = 330;
    var pos = {}, y = by, partsSvg = "";
    bpins.forEach(function (p, i) { pos[p] = [bx + bw, bpy0 + i * pitch]; });
    spec.parts.forEach(function (pt) {
      var n = pt.pins.length, ph = Math.max(n * pitch + 26, 120);
      partsSvg += '<rect x="' + px + '" y="' + y + '" width="' + pw + '" height="' + ph + '" rx="14" fill="#fff" stroke="#cfd6e2" stroke-width="1.5"/>';
      partsSvg += '<text x="' + (px + pw - 12) + '" y="' + (y + 24) + '" ' + RIGHT_ALIGN + ' font-size="14" font-weight="800" fill="#152033">' + esc(pt.name) + '</text>';
      if (pt.img) partsSvg += '<image href="' + BASE + 'img/' + pt.img + '" x="' + (px + pw - 118) + '" y="' + (y + 32) + '" width="106" height="' + (ph - 42) + '" preserveAspectRatio="xMidYMid meet"/>';
      pt.pins.forEach(function (pp, k) {
        var yy = y + 30 + k * pitch + (ph - 30 - n * pitch) / 2 + pitch / 2;
        pos[pt.id + "." + pp[0]] = [px, yy];
        partsSvg += '<circle cx="' + px + '" cy="' + yy + '" r="5" fill="#e8c35a" stroke="#8a6d1c"/>';
        partsSvg += '<text x="' + (px + 12) + '" y="' + (yy + 4) + '" font-size="12.5" font-weight="700" fill="#152033" font-family="JetBrains Mono,monospace">' + esc(pp[0]) + '</text>';
        if (pp[1]) partsSvg += '<text x="' + (px + pw - 124) + '" y="' + (yy + 4) + '" ' + RIGHT_ALIGN + ' font-size="12" fill="#4d5b70">' + esc(pp[1]) + '</text>';
      });
      y += ph + 18;
    });
    var H = Math.max(by + bh + 20, y + 10), W = px + pw + 20;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + t("wiringAria") + '">';
    s += '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="14" fill="#1b1f2a"/>';
    /* نام تراشه روی نقشه از نام برد می‌آید (مثلا ESP32-C3)؛ می‌شود با chip و module هم مشخصش کرد */
    var bname = spec.board || "", chipName = spec.chip || (/C3/i.test(bname) ? "ESP32-C3" : /S3/i.test(bname) ? "ESP32-S3" : /C6/i.test(bname) ? "ESP32-C6" : "ESP32"), chipMod = spec.module != null ? spec.module : (chipName === "ESP32" ? "WROOM-32" : "");
    s += '<rect x="' + (bx + 20) + '" y="' + (by + 16) + '" width="110" height="80" rx="6" fill="#c9ced8"/><text x="' + (bx + 75) + '" y="' + (by + 52) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#333">' + esc(chipName) + '</text><text x="' + (bx + 75) + '" y="' + (by + 70) + '" text-anchor="middle" font-size="10" fill="#555">' + esc(chipMod) + '</text>';
    s += '<text x="' + (bx + 20) + '" y="' + (by + bh - 16) + '" font-size="13" font-weight="700" fill="#e8eef8" ' + LEFT_ALIGN + '>' + esc(spec.board || "ESP32 DevKitC") + '</text>';
    bpins.forEach(function (p) {
      var q = pos[p];
      s += '<rect x="' + (q[0] - 96) + '" y="' + (q[1] - 12) + '" width="84" height="24" rx="6" fill="#2a3244"/><text x="' + (q[0] - 54) + '" y="' + (q[1] + 5) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#ffd166" font-family="JetBrains Mono,monospace">' + esc(p) + '</text>';
      s += '<circle cx="' + (q[0] - 4) + '" cy="' + q[1] + '" r="5.5" fill="#e8c35a" stroke="#8a6d1c"/>';
    });
    var dots = {}, labels = "";
    spec.wires.forEach(function (w, i) {
      var a = pos[w[0]], b = pos[w[1]];
      if (!a || !b) { console.warn("wire endpoint missing", w); return; }
      var lx = chanX + i * laneGap, col = WC[w[2]] || w[2] || "#f08a24";
      s += '<path d="M' + a[0] + ' ' + a[1] + ' H' + lx + ' V' + b[1] + ' H' + b[0] + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" opacity=".92"/>';
      [a, b].forEach(function (q) { var k = q.join(","); dots[k] = (dots[k] || 0) + 1; });
      if (w[3]) labels += '<text x="' + (lx + 6) + '" y="' + ((a[1] + b[1]) / 2 + 4) + '" font-size="11" fill="' + col + '" font-weight="700" stroke="#fbfcfe" stroke-width="4" paint-order="stroke" direction="ltr" unicode-bidi="plaintext">' + esc(w[3]) + '</text>';
    });
    Object.keys(dots).forEach(function (k) { if (dots[k] > 1) { var q = k.split(","); s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="6.5" fill="#152033"/>'; } });
    s += partsSvg + labels + '</svg>';
    var legend = '<div class="wire-legend"><span><i style="background:' + WC.red + '"></i>' + t("lgPower") + '</span><span><i style="background:' + WC.black + '"></i>' + t("lgGnd") + '</span><span><i style="background:' + WC.orange + '"></i>' + t("lgOut") + '</span><span><i style="background:' + WC.blue + '"></i>' + t("lgIn") + '</span><span><i style="background:' + WC.green + '"></i>' + t("lgClk") + '</span><span><i style="background:' + WC.yellow + '"></i>' + t("lgSda") + '</span></div>';
    var table = '<details><summary>' + t("wTable") + '</summary><div class="table-wrap"><table><tr><th>#</th><th>' + t("wFrom") + '</th><th>' + t("wTo") + '</th><th>' + t("wColor") + '</th></tr>' +
      spec.wires.map(function (w, i) { return '<tr><td>' + fa(i + 1) + '</td><td class="ltr">' + esc(w[0]) + '</td><td class="ltr">' + esc(w[1]) + '</td><td><i style="display:inline-block;width:22px;height:6px;border-radius:3px;background:' + (WC[w[2]] || w[2]) + '"></i> ' + esc(w[2] || "") + '</td></tr>'; }).join("") + '</table></div></details>';
    box.innerHTML = '<div class="frame">' + s + '</div>' + legend + (cap ? '<figcaption>' + cap.innerHTML + '</figcaption>' : '') + table;
  }
  article.querySelectorAll(".wiring").forEach(buildWiring);

  /* ---------- جدول‌های پهن: سایه محو در لبه‌ای که هنوز جا برای اسکرول دارد ---------- */
  article.querySelectorAll(".table-wrap").forEach(function (w) {
    if (w.parentNode.classList.contains("tw")) return;
    var o = el("div", { "class": "tw" }); w.parentNode.insertBefore(o, w); o.appendChild(w);
    var upd = function () {
      /* در راست‌به‌چپ scrollLeft منفی است؛ قدر مطلقش فاصله از ابتدای جدول است */
      var max = w.scrollWidth - w.clientWidth, x = Math.abs(w.scrollLeft), sc = max > 2;
      o.classList.toggle("more-start", sc && x > 2); o.classList.toggle("more-end", sc && x < max - 2);
      if (sc) w.setAttribute("tabindex", "0"); else w.removeAttribute("tabindex");
    };
    w.addEventListener("scroll", upd, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(upd).observe(w); else addEventListener("resize", upd);
    upd();
  });

  /* ---------- واژه‌نامه شناور ---------- */
  var pop = null;
  function showTip(t) {
    var d = G[t.getAttribute("data-t")];
    if (!d) return;
    hideTip();
    /* فرمول‌های لاتین (مثل V = I × R) در متن فارسی به‌هم می‌ریزند؛ آن‌ها را چپ‌به‌راست جدا می‌کنیم */
    var ltr = function (h) { return h.replace(/[A-Za-z][A-Za-z0-9]*\s*=\s*[A-Za-z0-9 ×\/+\-().]*[A-Za-z0-9)]/g, function (m) { return '<bdi dir="ltr" style="white-space:nowrap">' + m + '</bdi>'; }); };
    pop = el("div", { "class": "tip-pop" }, "<b>" + esc(d[0]) + "</b>" + ltr(esc(d[1])));
    document.body.appendChild(pop);
    var r = t.getBoundingClientRect(), pw = pop.offsetWidth;
    var left = Math.min(Math.max(8, r.left + r.width / 2 - pw / 2 + scrollX), scrollX + innerWidth - pw - 8);
    var topPos = r.top + scrollY - pop.offsetHeight - 10;
    if (r.top < pop.offsetHeight + 80) topPos = r.bottom + scrollY + 10;
    pop.style.left = left + "px"; pop.style.top = topPos + "px";
  }
  function hideTip() { if (pop) { pop.remove(); pop = null; } }
  var keys = Object.keys(G).sort(function (a, b) { return b.length - a.length; });
  var used = {};
  var SKIP = /^(CODE|PRE|A|H1|H2|H3|H4|SCRIPT|STYLE|BUTTON|SVG|TEXT|KBD|SUMMARY|TEXTAREA)$/;
  function isWordChar(c) { return !!c && /[A-Za-z0-9_\u0600-\u06FF]/.test(c); }
  function wrapTerms(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        for (var p = n.parentNode; p && p !== root; p = p.parentNode) {
          if (SKIP.test(p.nodeName.toUpperCase()) || (p.classList && (p.classList.contains("term") || p.classList.contains("code") || p.classList.contains("serial") || p.classList.contains("no-term") || p.classList.contains("lesson-head") || p.classList.contains("pinout") || p.classList.contains("wiring") || p.classList.contains("quiz")))) return NodeFilter.FILTER_REJECT;
        }
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k]; if (used[key]) continue;
        /* در انگلیسی حروف بزرگ و کوچک یکی حساب می‌شوند (Voltage و voltage)؛ اختصارهای تمام‌بزرگ مثل GPIO دقیق تطبیق داده می‌شوند */
        var ci = EN && key !== key.toUpperCase(), hay = ci ? text.toLowerCase() : text, needle = ci ? key.toLowerCase() : key;
        var i = hay.indexOf(needle);
        while (i > -1 && (isWordChar(text[i - 1]) || isWordChar(text[i + key.length]))) i = hay.indexOf(needle, i + 1);
        if (i < 0) continue;
        used[key] = 1;
        var after = node.splitText(i); after.nodeValue = after.nodeValue.slice(key.length);
        var span = el("span", { "class": "term", "data-t": key, tabindex: "0" }); span.textContent = text.substr(i, key.length);
        node.parentNode.insertBefore(span, after);
        wrapTerms._again = true;
        return;
      }
    });
  }
  article.querySelectorAll(".term[data-t]").forEach(function (t) { used[t.getAttribute("data-t")] = 1; });
  for (var pass = 0; pass < 6; pass++) { wrapTerms._again = false; wrapTerms(article); if (!wrapTerms._again) break; }
  document.addEventListener("mouseover", function (e) { var t = e.target.closest && e.target.closest(".term"); if (t) showTip(t); });
  document.addEventListener("mouseout", function (e) { if (e.target.closest && e.target.closest(".term")) hideTip(); });
  document.addEventListener("focusin", function (e) { if (e.target.classList && e.target.classList.contains("term")) showTip(e.target); });
  document.addEventListener("focusout", hideTip);
  document.addEventListener("touchstart", function (e) { var t = e.target.closest && e.target.closest(".term"); if (t) showTip(t); else hideTip(); }, { passive: true });
  addEventListener("scroll", hideTip, { passive: true });


  /* ---------- جستجوی سایت ----------
     نمایه با assets/tools/build-search.py ساخته می‌شود و فقط بار اول که جستجو باز شد دریافت می‌شود.
     تطبیق ساده واژه به واژه، بدون حساسیت به حروف بزرگ و کوچک؛ امتیاز: عنوان بخش > عنوان صفحه > متن.
     در فارسی ي و ك عربی به ی و ک فارسی تبدیل و نیم‌فاصله حذف می‌شود؛ رقم‌های فارسی هم انگلیسی می‌شوند. */
  var sIndex = null, sLoading = null, sDlg = null;
  function norm(x) {
    return String(x || "").toLowerCase().replace(/ي/g, "ی").replace(/ى/g, "ی").replace(/ك/g, "ک").replace(/[‌‍‎‏ً-ٟ]/g, "")
      .replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); }).replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); });
  }
  function loadIndex() {
    if (!sLoading) sLoading = fetch(BASE + "search-" + LANG + ".json").then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
      sIndex = d.map(function (r) { return { r: r, t: norm(r.t), h: norm(r.t.split(/ \(| — /)[0]), p: norm(r.p), x: norm(r.x), k: norm(r.k) }; });
      return sIndex;
    }, function (e) { sLoading = null; throw e; });
    return sLoading;
  }
  function searchIndex(q) {
    var toks = norm(q).split(/[\s,،؛;:!?؟()«»"']+/).filter(Boolean), whole = toks.join(" ");
    if (!toks.length) return [];
    var res = [];
    sIndex.forEach(function (e) {
      var score = 0, inTitle = 0;
      for (var i = 0; i < toks.length; i++) {
        var k = toks[i], sc = 0, at = e.t.indexOf(k);
        if (at > -1) { sc = 12 + (at === 0 || !/[\w\u0600-\u06ff]/.test(e.t[at - 1]) ? 6 : 0); inTitle++; }
        else if (e.p.indexOf(k) > -1) sc = 5;
        else if (e.x.indexOf(k) > -1) sc = 3;
        else if (e.k.indexOf(k) > -1) sc = 1;
        if (!sc) return;      /* همه واژه‌ها باید پیدا شوند */
        score += sc;
      }
      if (e.h === whole) score += 14;                       /* عنوان دقیقا همان عبارت (مثل اصطلاح واژه‌نامه) */
      if (inTitle === toks.length && e.r.y === "p") score += 4; /* عنوان خود صفحه */
      if (e.r.y === "f") score -= 2;
      res.push([score, e.r]);
    });
    res.sort(function (a, b) { return b[0] - a[0]; });
    var seen = {}, out = [];
    for (var j = 0; j < res.length && out.length < 40; j++) { var key = res[j][1].u + "|" + res[j][1].t; if (!seen[key]) { seen[key] = 1; out.push(res[j][1]); } }
    return out;
  }
  function hiRe(q) {
    /* الگوی پررنگ کردن: نیم‌فاصله اختیاری بین حرف‌ها و هر دو شکل ی و ک */
    var toks = norm(q).split(/[\s,،؛;:!?؟()«»"']+/).filter(function (x) { return x.length > 1; });
    if (!toks.length) return null;
    return new RegExp("(" + toks.map(function (k) {
      return k.split("").map(function (c) { return c === "ی" ? "[یيى]" : c === "ک" ? "[کك]" : c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("‌?");
    }).join("|") + ")", "gi");
  }
  function hi(text, re) { return re ? esc(text).replace(re, "<mark>$1</mark>") : esc(text); }
  function snippet(r, q) {
    var x = r.x || "", tk = norm(q).split(/\s+/).filter(Boolean)[0], at = tk ? norm(x).indexOf(tk) : -1;
    if (at > 60) x = "…" + x.slice(at - 40);
    return x.length > 170 ? x.slice(0, 170) + "…" : x;
  }
  function openSearch() {
    if (!sDlg) {
      sDlg = el("dialog", { "class": "search-dlg", "aria-labelledby": "sd-title" },
        '<div class="sd-box"><form method="dialog" class="sd-head" role="search"><h2 id="sd-title" class="vh">' + t("search") + '</h2>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>' +
        '<input type="search" autocomplete="off" spellcheck="false" aria-label="' + t("search") + '" placeholder="' + t("searchPh") + '" aria-describedby="sd-help" aria-controls="sd-list">' +
        '<button type="button" class="btn sd-close" data-sd="close">' + t("searchClose") + ' <kbd>Esc</kbd></button></form>' +
        '<p class="sd-status" role="status" aria-live="polite"></p><ul class="sd-list" id="sd-list"></ul><p class="sd-help" id="sd-help">' + t("searchHelp") + '</p></div>');
      document.body.appendChild(sDlg);
      var inp = sDlg.querySelector("input"), list = sDlg.querySelector(".sd-list"), st = sDlg.querySelector(".sd-status"), timer = 0;
      var render = function () {
        var q = inp.value.trim();
        if (!sIndex) { st.textContent = t("searchLoading"); return; }
        if (!q) { list.innerHTML = ""; st.textContent = ""; return; }
        var rs = searchIndex(q), re = hiRe(q);
        st.textContent = rs.length ? t("searchCount").replace("%n", fa(rs.length)) : t("searchNone");
        list.innerHTML = rs.map(function (r) {
          var kind = r.y === "f" ? "📄 " + t("kindFile") : r.y === "g" ? "📖 " + t("kindGloss") : r.y === "p" ? "📘 " + t("kindPage") : "§";
          return '<li><a href="' + esc(r.u) + '"><span class="sd-t"><bdi>' + hi(r.t, re) + '</bdi></span><span class="sd-p"><span class="sd-k">' + kind + '</span> ' + esc(r.p) + '</span><span class="sd-x">' + hi(snippet(r, q), re) + '</span></a></li>';
        }).join("");
      };
      inp.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(render, 90); });
      sDlg.addEventListener("keydown", function (e) {
        var links = [].slice.call(list.querySelectorAll("a")), i = links.indexOf(document.activeElement);
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          if (!links.length) return;
          e.preventDefault();
          var n = e.key === "ArrowDown" ? (i < 0 ? 0 : Math.min(i + 1, links.length - 1)) : i - 1;
          if (n < 0) inp.focus(); else links[n].focus();
        } else if (e.key === "Enter" && e.target === inp) {
          e.preventDefault(); clearTimeout(timer); render();
          var first = list.querySelector("a"); if (first) first.click();
        } else if (e.key === "Home" && i > -1) { e.preventDefault(); links[0].focus(); }
        else if (e.key === "End" && i > -1) { e.preventDefault(); links[links.length - 1].focus(); }
        else if (i > -1 && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) inp.focus();
      });
      /* رفتن به بخشی از همین صفحه: پنجره بسته شود تا پرش دیده شود */
      list.addEventListener("click", function (e) { if (e.target.closest("a")) sDlg.close(); });
      sDlg.addEventListener("click", function (e) { if (e.target === sDlg || e.target.closest('[data-sd="close"]')) sDlg.close(); });
      sDlg.addEventListener("close", function () { var b = top.querySelector(".search-btn"); if (b && document.activeElement !== b) b.focus({ preventScroll: true }); document.documentElement.classList.remove("sd-open"); });
      sDlg._render = render;
    }
    if (!sDlg.open) { if (sDlg.showModal) sDlg.showModal(); else sDlg.setAttribute("open", ""); }
    document.documentElement.classList.add("sd-open");
    var input = sDlg.querySelector("input"); input.focus(); input.select();
    loadIndex().then(function () { sDlg._render(); }, function () { sDlg.querySelector(".sd-status").textContent = t("searchErr"); });
    sDlg._render();
  }
  /* میان‌بر «/» (و Ctrl+K) برای باز کردن جستجو، وقتی در یک فیلد متنی نیستی */
  document.addEventListener("keydown", function (e) {
    var tg = e.target, typing = tg && (tg.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName));
    if ((e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) || ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K"))) { e.preventDefault(); openSearch(); }
  });

  /* قابلیت‌های صفحه خانه و واژه‌نامه */
  window.ESP32MC = { fa: fa, esc: esc, lessons: lessons, done: done, refresh: refreshProgress, L: LX, t: t, EN: EN };
  document.dispatchEvent(new Event("esp32mc-ready"));
})();
