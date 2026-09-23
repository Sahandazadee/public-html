/* ===== مستر کلاس ESP32 — موتور مشترک همه صفحه‌ها =====
   این فایل از روی یک <article class="page" data-page="..."> ساده، کل صفحه را می‌سازد:
   سربرگ، منوی درس‌ها، سرصفحه درس، واژه‌نامه شناور، بلوک کد، آزمون، Wokwi، ویدیو،
   نقشه پایه‌ها، نقشه سیم‌کشی، پیشرفت درس‌ها و صفحه‌بندی. */
(function () {
  "use strict";
  var C = window.COURSE, G = window.GLOSSARY || {};
  var FA = "۰۱۲۳۴۵۶۷۸۹";
  function fa(n) { return String(n).replace(/\d/g, function (d) { return FA[d]; }); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

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
  var top = el("header", { "class": "topbar" },
    '<button class="btn icon-btn menu-toggle" data-act="nav" aria-label="منو"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>' +
    '<a class="brand" href="index.html">' + logo + '<span><b>' + C.title + '</b><small>از صفر مطلق تا پروژه اینترنت اشیا</small></span></a>' +
    '<span class="spacer"></span>' +
    '<span class="progress-pill" title="پیشرفت تو"><span class="bar"><i></i></span><span class="pct"></span></span>' +
    '<button class="btn icon-btn" data-act="theme" aria-label="حالت روشن یا تاریک" title="حالت روشن یا تاریک"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/></svg></button>');

  var side = el("aside", { "class": "sidebar", "aria-label": "فهرست درس‌ها" });
  var sh = '<h4>صفحه‌های کمکی</h4>';
  C.extras.forEach(function (x) { sh += '<a class="x' + (x.id === pageId ? " active" : "") + '" href="' + x.id + '.html">' + x.title + '</a>'; });
  C.chapters.forEach(function (ch) {
    sh += '<div class="chap"><div class="chap-title"><span class="dot" style="background:' + ch.color + '">' + fa(ch.n) + '</span>' + ch.title + '</div>';
    ch.lessons.forEach(function (l) {
      sh += '<a class="l' + (l.id === pageId ? " active" : "") + (done.indexOf(l.id) > -1 ? " done" : "") + '" data-id="' + l.id + '" href="' + l.id + '.html"><span class="num">' + fa(l.id.replace("-", ".")) + '</span><span>' + l.title + '</span></a>';
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
  document.body.appendChild(el("div", { "class": "backdrop", "data-act": "nav" }));

  /* سرصفحه خودکار درس */
  if (lesson && !article.querySelector("h1")) {
    var head = el("header", { "class": "lesson-head" },
      '<span class="eyebrow">فصل ' + fa(lesson.ch.n) + ' · ' + lesson.ch.title + ' · درس ' + fa(lesson.id.replace("-", ".")) + '</span>' +
      '<h1>' + lesson.title + '</h1>' +
      '<div class="meta"><span>⏱ حدود ' + fa(lesson.min) + ' دقیقه</span><span>📶 سطح: ' + lesson.level + '</span><span>🧭 درس ' + fa(idx + 1) + ' از ' + fa(lessons.length) + '</span></div>');
    article.insertBefore(head, article.firstChild);
    document.title = lesson.title + " · " + C.title;
  }

  /* ---------- پیشرفت ---------- */
  function refreshProgress() {
    var p = Math.round(done.filter(function (d) { return lessons.some(function (l) { return l.id === d; }); }).length / lessons.length * 100);
    top.querySelector(".bar i").style.width = p + "%";
    top.querySelector(".pct").textContent = fa(p) + "٪";
    side.querySelectorAll("a.l").forEach(function (a) { a.classList.toggle("done", done.indexOf(a.getAttribute("data-id")) > -1); });
    document.querySelectorAll("[data-lesson-link]").forEach(function (li) { li.classList.toggle("done", done.indexOf(li.getAttribute("data-lesson-link")) > -1); });
  }

  if (lesson) {
    var isDone = function () { return done.indexOf(lesson.id) > -1; };
    var box = el("div", { "class": "done-box" }, '<p></p><button class="btn" data-act="done"></button>');
    var paint = function () {
      box.querySelector("p").textContent = isDone() ? "آفرین! این درس را تمام کرده‌ای. برای مرور هر وقت خواستی برگرد." : "همه آزمون‌ها را درست جواب دادی و تمرین را انجام دادی؟ فقط آن وقت تیک بزن.";
      var b = box.querySelector("button"); b.textContent = isDone() ? "✓ تمام شد (برداشتن تیک)" : "این درس را تمام کردم";
      b.classList.toggle("done", isDone());
    };
    paint();
    box.querySelector("button").addEventListener("click", function () {
      if (isDone()) done.splice(done.indexOf(lesson.id), 1); else done.push(lesson.id);
      store("esp32mc-done", done); paint(); refreshProgress();
    });
    article.appendChild(box);
    var prev = lessons[idx - 1], next = lessons[idx + 1];
    var pg = el("nav", { "class": "pager" },
      (prev ? '<a class="prev" href="' + prev.id + '.html"><small>→ درس قبلی</small>' + prev.title + '</a>' : '<a class="prev" href="index.html"><small>→ بازگشت</small>خانه و نقشه راه</a>') +
      (next ? '<a class="next" href="' + next.id + '.html"><small>درس بعدی ←</small>' + next.title + '</a>' : '<a class="next" href="index.html"><small>پایان دوره ←</small>بازگشت به خانه</a>'));
    article.appendChild(pg);
  }
  main.appendChild(el("footer", { "class": "footer" }, 'مستر کلاس ESP32 فارسی · آموزش رایگان · <a href="credits.html">منابع و مجوز تصاویر</a>'));
  refreshProgress();

  /* فهرست «روی این صفحه» */
  var h2s = article.querySelectorAll("h2");
  if (h2s.length > 1) {
    var toc = '<h4>روی این صفحه</h4>';
    h2s.forEach(function (h, i) { if (!h.id) h.id = "s" + (i + 1); toc += '<a class="x" href="#' + h.id + '">' + h.textContent + '</a>'; });
    side.insertAdjacentHTML("afterbegin", toc);
  }

  /* ---------- رویدادهای عمومی ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act]");
    if (t) {
      var a = t.getAttribute("data-act");
      if (a === "nav") document.body.classList.toggle("nav-open");
      if (a === "theme") {
        var cur = document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        var nt = cur === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", nt); store("esp32mc-theme", nt);
      }
    }
    if (e.target.closest(".sidebar a")) document.body.classList.remove("nav-open");
    var img = e.target.closest("figure .frame img, .gallery img");
    if (img) {
      var lb = el("div", { "class": "lightbox" }, '<img src="' + img.getAttribute("src") + '" alt="">');
      lb.addEventListener("click", function () { lb.remove(); });
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
    var bar = el("div", { "class": "bar" }, '<span class="dots"><i></i><i></i><i></i></span><span class="fname">' + esc(block.getAttribute("data-file") || lang) + '</span><button type="button">کپی کد</button>');
    block.insertBefore(bar, pre);
    bar.querySelector("button").addEventListener("click", function () {
      var b = this;
      var done = function () { b.textContent = "✓ کپی شد"; setTimeout(function () { b.textContent = "کپی کد"; }, 1500); };
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
      li.addEventListener("click", function () {
        if (!code) return;
        var lns = code.querySelectorAll(".ln"), on = !li.classList.contains("on");
        ol.querySelectorAll("li").forEach(function (x) { x.classList.remove("on"); });
        lns.forEach(function (x) { x.classList.remove("hl"); });
        if (!on) return;
        li.classList.add("on");
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
      li.insertAdjacentHTML("afterbegin", "<b>" + "الف ب ج د".split(" ")[i] + ") </b>");
      li.addEventListener("click", function () {
        if (q.classList.contains("solved")) return;
        if (i + 1 === ans) { li.classList.add("right"); q.classList.add("solved"); }
        else li.classList.add("wrong");
        q.classList.add("answered");
        if (!fb) fb = q.appendChild(el("div", { "class": "fb", "data-orig": "" }));
        fb.style.borderRight = "4px solid " + (i + 1 === ans ? "var(--green)" : "var(--red)");
        fb.innerHTML = (i + 1 === ans ? "<b>✅ درست است!</b> " : "<b>❌ نه، دوباره فکر کن.</b> ") + (i + 1 === ans ? fb.getAttribute("data-orig") : (li.getAttribute("data-why") || "راهنما: متن بالای این آزمون را دوباره بخوان."));
        updateScore();
      });
    });
  });
  function updateScore() {
    var s = article.querySelector(".quiz-score");
    if (!s) return;
    var solved = article.querySelectorAll(".quiz.solved").length;
    s.textContent = "امتیاز: " + fa(solved) + " از " + fa(quizzes.length) + (solved === quizzes.length ? " — عالی! 🎉" : "");
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
    w.innerHTML = '<div class="wh"><b>' + (w.getAttribute("data-title") || "همین مدار را در شبیه‌ساز Wokwi بساز") + '</b>' +
      '<a class="btn" target="_blank" rel="noopener" href="' + url + '">باز کردن Wokwi ↗</a>' +
      (diagram ? '<button class="btn" data-copy="d">کپی diagram.json</button>' : '') +
      (code ? '<button class="btn" data-copy="c">کپی کد sketch.ino</button>' : '') + '</div>' +
      '<div class="wb">' + body + (diagram ? '<details><summary>محتوای diagram.json (نقشه قطعات و سیم‌ها)</summary><div class="code" data-lang="json" data-file="diagram.json"><pre>' + esc(diagram) + '</pre></div></details>' : '') + '</div>';
    w.querySelectorAll(".code").forEach(renderCode);
    w.querySelectorAll("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var txt = b.getAttribute("data-copy") === "d" ? diagram : code.querySelector("pre").innerText;
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).catch(function () { fallbackCopy(txt); });
        var o = b.textContent; b.textContent = "✓ کپی شد"; setTimeout(function () { b.textContent = o; }, 1500);
      });
    });
  });

  /* ---------- ویدیو یوتیوب ---------- */
  function tsec(t) { return t.split(":").reduce(function (a, b) { return a * 60 + (+b); }, 0); }
  article.querySelectorAll(".video[data-yt]").forEach(function (v) {
    var id = v.getAttribute("data-yt");
    var stamps = v.querySelectorAll("[data-t]");
    var sum = v.querySelector(".sum");
    var html = '<div class="ratio"><div class="poster"><div><div class="play"></div><div>' + esc(v.getAttribute("data-title") || "") + '</div><small style="opacity:.7">برای پخش کلیک کن (برای دیدن یوتیوب ممکن است به فیلترشکن نیاز داشته باشی)</small></div></div></div>' +
      '<div class="vb"><h4>🎬 ' + esc(v.getAttribute("data-title") || "") + '</h4><div class="chan">کانال: ' + esc(v.getAttribute("data-channel") || "") + ' · زبان ویدیو: ' + esc(v.getAttribute("data-lang") || "انگلیسی") + ' · <a target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=' + id + '">باز کردن در یوتیوب ↗</a></div>';
    if (stamps.length) {
      html += '<div class="stamps">';
      stamps.forEach(function (s) { html += '<button data-s="' + tsec(s.getAttribute("data-t")) + '"><span>' + s.getAttribute("data-t") + '</span>' + s.innerHTML + '</button>'; });
      html += '</div>';
    }
    if (sum) html += '<details><summary>' + esc(v.getAttribute("data-sum-label") || "راهنمای تماشا: به چه نکته‌هایی دقت کنی") + '</summary>' + sum.innerHTML + '</details>';
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
    power: ["تغذیه", "#d6453d"], gnd: ["زمین", "#222"], safe: ["امن برای استفاده", "#12a37f"], input: ["فقط ورودی", "#c99a06"],
    adc1: ["ADC1", "#8b4fd6"], adc2: ["ADC2 (با Wi-Fi کار نمی‌کند)", "#b07be0"], touch: ["لمسی", "#e0781f"], dac: ["DAC", "#2f7af0"],
    strap: ["Strapping (حساس هنگام بوت)", "#d6457a"], flash: ["فلش — استفاده نکن", "#7b889b"], uart: ["UART0 (USB)", "#475569"],
    i2c: ["I2C پیش‌فرض", "#0f8fa8"], spi: ["SPI پیش‌فرض (VSPI)", "#0ea5e9"], rtc: ["RTC (بیدارکننده خواب)", "#65a30d"]
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
  function buildPinout(box) {
    var W = 860, pitch = 34, y0 = 300, H = y0 + pitch * 19 + 110, bx = 330, bw = 200;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="نقشه پایه‌های ESP32 DevKitC">';
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
        g += '<rect x="' + ex + '" y="' + (y - 11) + '" width="' + w + '" height="22" rx="6" fill="' + TAGS[t][1] + '" opacity=".9"/><text x="' + (ex + w / 2) + '" y="' + (y + 4) + '" text-anchor="middle" font-size="11" fill="#fff" font-family="JetBrains Mono,monospace">' + short + '</text>';
      });
      return g + '</g>';
    }
    L.forEach(function (p, i) { s += pin(p, i, 0); });
    R.forEach(function (p, i) { s += pin(p, i, 1); });
    s += '</svg>';
    var f = '<div class="filters"><button class="on" data-f="">همه</button>';
    ["safe", "input", "adc1", "adc2", "touch", "dac", "strap", "flash", "i2c", "spi", "uart", "rtc", "power"].forEach(function (t) { f += '<button data-f="' + t + '">' + TAGS[t][0] + '</button>'; });
    f += '</div>';
    box.innerHTML = f + '<div class="grid"><div>' + s + '</div><div class="info"><h4>روی یک پایه کلیک کن</h4><p>هر پایه را انتخاب کن تا ببینی چه کاری از آن برمی‌آید و چه خطری دارد. با دکمه‌های بالا پایه‌های هم‌خانواده را جدا کن.</p><p><b>قانون طلایی مبتدی:</b> اول از پایه‌های سبز «امن» استفاده کن.</p></div></div>';
    var info = box.querySelector(".info");
    box.querySelectorAll(".pin").forEach(function (g) {
      g.addEventListener("click", function () {
        var p = (+g.getAttribute("data-side") ? R : L)[+g.getAttribute("data-i")];
        box.querySelectorAll(".pin").forEach(function (x) { x.classList.remove("sel"); });
        g.classList.add("sel");
        info.innerHTML = '<h4>' + p[0] + '</h4><div class="tags">' + p[2].map(function (t) { return '<span style="background:' + TAGS[t][1] + '">' + TAGS[t][0] + '</span>'; }).join("") + '</div><p>' + p[3] + '</p>' +
          (p[1] != null ? '<p style="direction:ltr;text-align:right"><code>pinMode(' + p[1] + ', ' + (p[2].indexOf("input") > -1 ? "INPUT" : "OUTPUT") + ');</code></p>' : '');
      });
    });
    box.querySelectorAll("[data-f]").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-f");
        box.querySelectorAll("[data-f]").forEach(function (x) { x.classList.toggle("on", x === b); });
        box.querySelectorAll(".pin").forEach(function (g) { g.classList.toggle("dim", !!f && g.getAttribute("data-tags").split(" ").indexOf(f) < 0); });
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
    var spec; try { spec = JSON.parse(js.textContent); } catch (e) { box.insertAdjacentHTML("afterbegin", '<p style="color:red">خطا در JSON نقشه سیم‌کشی</p>'); return; }
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
      partsSvg += '<text x="' + (px + pw - 12) + '" y="' + (y + 24) + '" text-anchor="start" font-size="14" font-weight="800" fill="#152033" direction="rtl">' + esc(pt.name) + '</text>';
      if (pt.img) partsSvg += '<image href="assets/img/' + pt.img + '" x="' + (px + pw - 118) + '" y="' + (y + 32) + '" width="106" height="' + (ph - 42) + '" preserveAspectRatio="xMidYMid meet"/>';
      pt.pins.forEach(function (pp, k) {
        var yy = y + 30 + k * pitch + (ph - 30 - n * pitch) / 2 + pitch / 2;
        pos[pt.id + "." + pp[0]] = [px, yy];
        partsSvg += '<circle cx="' + px + '" cy="' + yy + '" r="5" fill="#e8c35a" stroke="#8a6d1c"/>';
        partsSvg += '<text x="' + (px + 12) + '" y="' + (yy + 4) + '" font-size="12.5" font-weight="700" fill="#152033" font-family="JetBrains Mono,monospace">' + esc(pp[0]) + '</text>';
        if (pp[1]) partsSvg += '<text x="' + (px + pw - 124) + '" y="' + (yy + 4) + '" text-anchor="start" font-size="12" fill="#4d5b70" direction="rtl">' + esc(pp[1]) + '</text>';
      });
      y += ph + 18;
    });
    var H = Math.max(by + bh + 20, y + 10), W = px + pw + 20;
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="نقشه سیم‌کشی">';
    s += '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="14" fill="#1b1f2a"/>';
    s += '<rect x="' + (bx + 20) + '" y="' + (by + 16) + '" width="110" height="80" rx="6" fill="#c9ced8"/><text x="' + (bx + 75) + '" y="' + (by + 52) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#333">ESP32</text><text x="' + (bx + 75) + '" y="' + (by + 70) + '" text-anchor="middle" font-size="10" fill="#555">WROOM-32</text>';
    s += '<text x="' + (bx + 20) + '" y="' + (by + bh - 16) + '" font-size="13" font-weight="700" fill="#e8eef8" direction="rtl" text-anchor="end">' + esc(spec.board || "ESP32 DevKitC") + '</text>';
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
    var legend = '<div class="wire-legend"><span><i style="background:' + WC.red + '"></i>تغذیه (3V3 یا 5V)</span><span><i style="background:' + WC.black + '"></i>زمین GND</span><span><i style="background:' + WC.orange + '"></i>سیگنال خروجی</span><span><i style="background:' + WC.blue + '"></i>سیگنال ورودی / داده</span><span><i style="background:' + WC.green + '"></i>ساعت / SCL / SCK</span><span><i style="background:' + WC.yellow + '"></i>داده I2C (SDA) / TX</span></div>';
    var table = '<details><summary>جدول اتصال‌ها (برای چک کردن سیم به سیم)</summary><div class="table-wrap"><table><tr><th>#</th><th>از</th><th>به</th><th>رنگ پیشنهادی سیم</th></tr>' +
      spec.wires.map(function (w, i) { return '<tr><td>' + fa(i + 1) + '</td><td class="ltr">' + esc(w[0]) + '</td><td class="ltr">' + esc(w[1]) + '</td><td><i style="display:inline-block;width:22px;height:6px;border-radius:3px;background:' + (WC[w[2]] || w[2]) + '"></i> ' + esc(w[2] || "") + '</td></tr>'; }).join("") + '</table></div></details>';
    box.innerHTML = '<div class="frame">' + s + '</div>' + legend + (cap ? '<figcaption>' + cap.innerHTML + '</figcaption>' : '') + table;
  }
  article.querySelectorAll(".wiring").forEach(buildWiring);

  /* ---------- واژه‌نامه شناور ---------- */
  var pop = null;
  function showTip(t) {
    var d = G[t.getAttribute("data-t")];
    if (!d) return;
    hideTip();
    pop = el("div", { "class": "tip-pop" }, "<b>" + esc(d[0]) + "</b>" + esc(d[1]));
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
          if (SKIP.test(p.nodeName.toUpperCase()) || (p.classList && (p.classList.contains("term") || p.classList.contains("code") || p.classList.contains("serial") || p.classList.contains("no-term") || p.classList.contains("pinout") || p.classList.contains("wiring") || p.classList.contains("quiz")))) return NodeFilter.FILTER_REJECT;
        }
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      for (var k = 0; k < keys.length; k++) {
        var key = keys[k]; if (used[key]) continue;
        var i = text.indexOf(key);
        while (i > -1 && (isWordChar(text[i - 1]) || isWordChar(text[i + key.length]))) i = text.indexOf(key, i + 1);
        if (i < 0) continue;
        used[key] = 1;
        var after = node.splitText(i); after.nodeValue = after.nodeValue.slice(key.length);
        var span = el("span", { "class": "term", "data-t": key, tabindex: "0" }); span.textContent = key;
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

  /* ---------- Mermaid (در صورت نیاز) ---------- */
  if (article.querySelector(".mermaid")) {
    var sc = el("script", { src: "assets/vendor/mermaid.min.js" });
    sc.onload = function () {
      var dark = (document.documentElement.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark";
      window.mermaid.initialize({ startOnLoad: false, theme: dark ? "dark" : "default", fontFamily: "Vazirmatn, Tahoma, sans-serif" });
      window.mermaid.run({ querySelector: ".mermaid" });
    };
    document.head.appendChild(sc);
  }

  /* قابلیت‌های صفحه خانه و واژه‌نامه */
  window.ESP32MC = { fa: fa, esc: esc, lessons: lessons, done: done, refresh: refreshProgress };
  document.dispatchEvent(new Event("esp32mc-ready"));
})();
