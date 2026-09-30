/* ===== C برای میکروکنترلر — موتور مشترک همه صفحه‌ها =====
   وظایف: منو و پیشرفت، سرصفحه درس، رنگ‌آمیزی کد، توضیح زیر هر خط کد، آزمون رنگی ذخیره‌شونده،
   جستجو (کلید /)، واژه‌نامه شناور، گزارش مشکل، ابزارک‌های تعاملی (بیت، حافظه، سرریز، struct، مبدل عدد).
   بدون وابستگی بیرونی. */
(function () {
  "use strict";
  var C = window.COURSE, GL = window.GLOSSARY || {};
  var article = document.querySelector("article.page");
  if (!C || !article) return;
  var pageId = article.getAttribute("data-page") || "index";

  /* ---------- ابزارهای کوچک ---------- */
  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function fa(n) { return String(n).replace(/\d/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; }); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } return null; }
  var lessons = [], byId = {};
  C.chapters.forEach(function (ch) { ch.lessons.forEach(function (l) { l.ch = ch; lessons.push(l); byId[l.id] = l; }); });
  var lesson = byId[pageId] || null, idx = lesson ? lessons.indexOf(lesson) : -1;
  var done = store("cazs-done") || [];
  var quizSolved = store("cazs-quiz") || {}, quizPick = store("cazs-pick") || {};
  document.documentElement.lang = "fa"; document.documentElement.dir = "rtl";

  /* ---------- شخصیت «بایتی»: یک تراشهٔ زرد با پایه‌های آبی (طرح اورجینال) ---------- */
  function mascot(mood) {
    var mouth = { smile: '<path d="M39 62q11 10 22 0" fill="none" stroke="#15120a" stroke-width="3.5" stroke-linecap="round"/>',
      think: '<path d="M41 64h18" fill="none" stroke="#15120a" stroke-width="3.5" stroke-linecap="round"/><text x="72" y="26" font-size="20" font-weight="900" fill="#15120a">?</text>',
      oops: '<ellipse cx="50" cy="65" rx="6" ry="7" fill="#15120a"/><path d="M74 20l4 8M82 24l-2 8" stroke="#15120a" stroke-width="3" stroke-linecap="round"/>',
      cheer: '<path d="M37 58q13 18 26 0z" fill="#15120a"/><path d="M12 22l7 6M88 22l-7 6M8 44h9M83 44h9" stroke="#15120a" stroke-width="3" stroke-linecap="round"/>' }[mood || "smile"] || "";
    var dx = { think: 2, oops: 0, cheer: 0, smile: 0 }[mood || "smile"] || 0, dy = mood === "think" ? -2 : 0, pins = "";
    for (var i = 0; i < 4; i++) { pins += '<rect x="10" y="' + (28 + i * 14) + '" width="14" height="8" rx="2" fill="#2f5fd0" stroke="#15120a" stroke-width="3"/><rect x="76" y="' + (28 + i * 14) + '" width="14" height="8" rx="2" fill="#2f5fd0" stroke="#15120a" stroke-width="3"/>'; }
    return '<svg class="mascot" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' + pins +
      '<rect x="20" y="14" width="60" height="72" rx="14" fill="#ffd60a" stroke="#15120a" stroke-width="4"/>' +
      '<path d="M41 14a9 9 0 0 0 18 0" fill="#15120a"/>' +
      '<circle cx="38" cy="42" r="9" fill="#fff" stroke="#15120a" stroke-width="3.5"/><circle cx="62" cy="42" r="9" fill="#fff" stroke="#15120a" stroke-width="3.5"/>' +
      '<circle cx="' + (39 + dx) + '" cy="' + (43 + dy) + '" r="4" fill="#15120a"/><circle cx="' + (63 + dx) + '" cy="' + (43 + dy) + '" r="4" fill="#15120a"/>' +
      mouth + '<rect x="34" y="86" width="10" height="9" rx="2" fill="#2f5fd0" stroke="#15120a" stroke-width="3"/><rect x="56" y="86" width="10" height="9" rx="2" fill="#2f5fd0" stroke="#15120a" stroke-width="3"/></svg>';
  }
  window.CazsMascot = mascot;

  /* ---------- قالب، منو، نوار بالا ---------- */
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>';
  var theme = store("cazs-theme"); if (theme === "light" || theme === "dark") document.documentElement.setAttribute("data-theme", theme);
  if (lesson) { document.documentElement.style.setProperty("--chap", lesson.ch.color); document.documentElement.style.setProperty("--chap-ink", lesson.ch.ink); }

  var top = el("header", { "class": "topbar" },
    '<button class="btn icon-btn menu-toggle" type="button" data-act="nav" aria-label="منوی درس‌ها" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>' +
    '<a class="brand" href="index.html">' + mascot("smile") + '<span><b>' + esc(C.title) + '</b><small>دوره رایگان زبان C · ESP32 و STM32</small></span></a><span class="spacer"></span>' +
    '<button class="btn icon-btn search-btn" type="button" data-act="search" aria-label="جستجو" title="جستجو (کلید /)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></button>' +
    '<a class="progress-pill" href="index.html#chapters" title="پیشرفت تو"><span class="bar" aria-hidden="true"><i></i></span><span class="pct"></span></a>' +
    '<button class="btn icon-btn theme-btn" type="button" data-act="theme" aria-label="حالت شب" aria-pressed="false"></button>');
  var themeBtn = top.querySelector(".theme-btn"), darkMQ = matchMedia("(prefers-color-scheme: dark)");
  function isDark() { var a = document.documentElement.getAttribute("data-theme"); return a ? a === "dark" : darkMQ.matches; }
  function paintTheme() { var d = isDark(); themeBtn.innerHTML = d ? SUN : MOON; themeBtn.setAttribute("aria-pressed", d ? "true" : "false"); }
  paintTheme(); if (darkMQ.addEventListener) darkMQ.addEventListener("change", paintTheme);
  themeBtn.addEventListener("click", function () { var t = isDark() ? "light" : "dark"; document.documentElement.setAttribute("data-theme", t); store("cazs-theme", t); paintTheme(); });

  var side = el("aside", { "class": "sidebar", "aria-label": "فهرست درس‌ها" });
  var sh = '<h4>صفحه‌های همراه</h4>';
  C.extras.forEach(function (x) { sh += '<a class="x' + (x.id === pageId ? " active" : "") + '" href="' + x.id + '.html">' + esc(x.title) + '</a>'; });
  C.chapters.forEach(function (ch) {
    sh += '<div class="chap"><div class="chap-title"><span class="dot" style="background:' + ch.color + ';--cink:' + ch.ink + '">' + fa(ch.n) + '</span>' + esc(ch.title) + '<span class="cnt" data-ch="' + ch.n + '"></span></div>';
    ch.lessons.forEach(function (l) { sh += '<a class="l' + (l.id === pageId ? " active" : "") + '" data-id="' + l.id + '" href="' + l.id + '.html"><span class="num">' + fa(l.id.replace("-", ".")) + '</span><span>' + esc(l.title) + '</span></a>'; });
    sh += '</div>';
  });
  side.innerHTML = sh;
  var shell = el("div", { "class": "shell" }), main = el("main", { "class": "content", id: "main", tabindex: "-1" });
  article.parentNode.insertBefore(shell, article); shell.appendChild(side); shell.appendChild(main); main.appendChild(article);
  document.body.insertBefore(top, document.body.firstChild);
  document.body.insertBefore(el("a", { "class": "skip-link", href: "#main" }, "پرش به متن اصلی"), document.body.firstChild);
  document.body.appendChild(el("div", { "class": "backdrop", "data-act": "nav" }));
  function setNav(open) {
    document.body.classList.toggle("nav-open", open); document.documentElement.classList.toggle("nav-lock", open);
    var mb = document.querySelector(".menu-toggle"); if (mb) mb.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { var cur = side.querySelector("a.active"); if (cur) cur.scrollIntoView({ block: "center" }); }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-act]");
    if (a && a.getAttribute("data-act") === "nav") setNav(!document.body.classList.contains("nav-open"));
    else if (document.body.classList.contains("nav-open") && !e.target.closest(".sidebar")) setNav(false);
    else if (e.target.closest && e.target.closest(".sidebar a")) setNav(false);
    if (a && a.getAttribute("data-act") === "search") openSearch();
  });
  var rb = el("div", { "class": "read-bar", "aria-hidden": "true" }, "<i></i>");
  var tt = el("button", { "class": "to-top", type: "button", "aria-label": "بازگشت به بالا" }, '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>');
  document.body.appendChild(rb); document.body.appendChild(tt);
  tt.addEventListener("click", function () { scrollTo({ top: 0, behavior: "smooth" }); });
  function onScroll() { var h = document.documentElement.scrollHeight - innerHeight; rb.firstChild.style.width = (h > 0 ? Math.min(100, scrollY / h * 100) : 0) + "%"; tt.classList.toggle("show", scrollY > 900); }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* سرصفحه خودکار درس */
  if (lesson && !article.querySelector("h1")) {
    article.insertBefore(el("header", { "class": "lesson-head" },
      '<span class="eyebrow">فصل ' + fa(lesson.ch.n) + ' · ' + esc(lesson.ch.title) + ' · درس ' + fa(lesson.id.replace("-", ".")) + '</span><h1>' + esc(lesson.title) + '</h1>' +
      '<div class="meta"><span>⏱ حدود ' + fa(lesson.min) + ' دقیقه</span><span>📶 سطح: ' + esc(lesson.level) + '</span><span>🧭 درس ' + fa(idx + 1) + ' از ' + fa(lessons.length) + '</span></div>' + mascot("cheer")), article.firstChild);
    document.title = lesson.title + " · " + C.title;
    store("cazs-last", lesson.id);
  } else if (!document.title || document.title === "undefined") document.title = C.title;

  /* ---------- گزارش مشکل: Issue پیش‌پر در گیت‌هاب ---------- */
  var REPORT = "https://github.com/Sahandazadee/public-html/issues/new";
  function nearestHeading() { var hs = article.querySelectorAll("h1,h2,h3"), best = null, lim = innerHeight * 0.4; for (var i = 0; i < hs.length; i++) if (hs[i].getBoundingClientRect().top < lim) best = hs[i]; return best; }
  function reportHref() {
    var h = nearestHeading(), sec = h && h.tagName !== "H1" ? h : null, parts = document.title.split(" · "), title = parts.length > 1 ? parts.slice(0, -1).join(" · ") : document.title;
    var url = location.href.split("#")[0] + (sec && sec.id ? "#" + sec.id : "");
    var body = "**صفحه:** " + url + "\n**بخش نزدیک:** " + (sec ? sec.textContent.trim() : "-") + "\n\n**نوع مشکل** (یکی را نگه دار):\n- [ ] اشتباه علمی یا فنی\n- [ ] کد کار نکرد یا خروجی فرق داشت\n- [ ] توضیح گیج‌کننده بود\n- [ ] اصطلاحی قبل از تعریف آمد\n- [ ] غلط تایپی یا ظاهری\n- [ ] مطلبی کم است\n\n**چه دیدی؟**\n\n**چه انتظاری داشتی؟**\n\n**مرورگر و دستگاه:**\n";
    return REPORT + "?title=" + encodeURIComponent("[دوره C] " + title) + "&body=" + encodeURIComponent(body);
  }
  ["mousedown", "focusin", "contextmenu", "touchstart"].forEach(function (ev) { document.addEventListener(ev, function (e) { var a = e.target.closest && e.target.closest('[data-act="report"]'); if (a) a.href = reportHref(); }, { passive: true }); });

  /* ---------- پیشرفت ---------- */
  function doneCount() { return done.filter(function (d) { return byId[d]; }).length; }
  function refreshProgress() {
    var n = doneCount(), p = Math.round(n / lessons.length * 100);
    top.querySelector(".bar i").style.width = p + "%";
    top.querySelector(".pct").innerHTML = "<bdi>" + fa(n) + " از " + fa(lessons.length) + "</bdi>";
    side.querySelectorAll("a.l").forEach(function (a) { a.classList.toggle("done", done.indexOf(a.getAttribute("data-id")) > -1); });
    document.querySelectorAll("[data-lesson-link]").forEach(function (li) { li.classList.toggle("done", done.indexOf(li.getAttribute("data-lesson-link")) > -1); });
    C.chapters.forEach(function (ch) {
      var k = ch.lessons.filter(function (l) { return done.indexOf(l.id) > -1; }).length, c = side.querySelector('.cnt[data-ch="' + ch.n + '"]');
      if (c) { c.textContent = fa(k) + " از " + fa(ch.lessons.length); c.classList.toggle("full", k === ch.lessons.length); }
    });
    document.dispatchEvent(new CustomEvent("cazs-progress"));
  }

  if (lesson) {
    var isDone = function () { return done.indexOf(lesson.id) > -1; };
    var box = el("div", { "class": "done-box" }, '<p></p><button class="btn" type="button" data-act="done"></button>');
    var quizLeft = function () { return article.querySelectorAll(".quiz").length - article.querySelectorAll(".quiz.solved").length; };
    var paint = function () {
      var left = quizLeft(), b = box.querySelector("button");
      box.querySelector("p").textContent = isDone() ? "این درس را تمام‌شده علامت زده‌ای. آفرین!" : left > 0 ? "برای باز شدن دکمه، هنوز " + fa(left) + " سؤال آزمون مانده است. (تقلب نکن، خودت را گول می‌زنی!)" : "همه آزمون‌ها را درست جواب دادی. اگر تمرین‌ها را هم انجام دادی، درس را تمام کن.";
      b.textContent = isDone() ? "✓ تمام شد (برای برداشتن بزن)" : "تمام کردم";
      b.disabled = !isDone() && left > 0; b.classList.toggle("done", isDone());
    };
    paint();
    box.insertAdjacentHTML("beforeend", '<a class="report-link" data-act="report" target="_blank" rel="noopener" href="' + REPORT + '">مشکلی در این درس دیدی؟ گزارش بده ↗</a>');
    box.querySelector("button").addEventListener("click", function () {
      if (isDone()) done.splice(done.indexOf(lesson.id), 1); else if (quizLeft() === 0) done.push(lesson.id); else return;
      store("cazs-done", done); paint(); refreshProgress();
    });
    document.addEventListener("cazs-quiz", paint);
    article.appendChild(el("section", { "class": "feedback no-print", "aria-labelledby": "fb-t" },
      '<h3 id="fb-t">🐞 مشکلی در این صفحه دیدی؟</h3><p>غلط علمی، کدی که کار نکرد، توضیحی که گیج‌ات کرد یا مطلبی که کم بود؟ دقیقا همین‌جا اعلام کن؛ با یک کلیک گزارشی با نام صفحه و بخش نزدیک آماده می‌شود و من درستش می‌کنم.</p><a class="btn" data-act="report" target="_blank" rel="noopener" href="' + REPORT + '">گزارش مشکل ↗</a>'));
    article.appendChild(box);
    var prev = lessons[idx - 1], next = lessons[idx + 1];
    article.appendChild(el("nav", { "class": "pager", "aria-label": "درس قبل و بعد" },
      (prev ? '<a class="prev" href="' + prev.id + '.html"><small>→ درس قبل</small>' + esc(prev.title) + '</a>' : '<a class="prev" href="index.html"><small>→ بازگشت</small>خانه و نقشه راه</a>') +
      (next ? '<a class="next" href="' + next.id + '.html"><small>درس بعد ←</small>' + esc(next.title) + '</a>' : '<a class="next" href="index.html"><small>پایان دوره</small>بازگشت به خانه</a>')));
  }
  main.appendChild(el("footer", { "class": "footer" }, 'دوره رایگان «C برای میکروکنترلر» · ساخته‌شده برای یادگیری، نه برای فروش · <a data-act="report" target="_blank" rel="noopener" href="' + REPORT + '">گزارش مشکل ↗</a> · <a href="references.html">منابع</a>'));

  /* ---------- خانه: فهرست فصل‌ها، ادامه دادن، پشتیبان پیشرفت ---------- */
  function download(name, text, type) {
    var url = URL.createObjectURL(new Blob([text], { type: type || "text/plain;charset=utf-8" })), a = el("a", { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  var chapBox = document.getElementById("chapters");
  if (chapBox) {
    chapBox.innerHTML = C.chapters.map(function (ch) {
      return '<section class="chapter" style="--chap:' + ch.color + ';--chap-ink:' + ch.ink + '"><h3>فصل ' + fa(ch.n) + ': ' + esc(ch.title) + '</h3><ol>' +
        ch.lessons.map(function (l) { return '<li data-lesson-link="' + l.id + '"><a href="' + l.id + '.html"><span class="n">' + fa(l.id.replace("-", ".")) + '</span><span>' + esc(l.title) + '</span><span class="m">' + fa(l.min) + ' دقیقه · ' + esc(l.level) + '</span></a></li>'; }).join("") + '</ol></section>';
    }).join("");
    var last = store("cazs-last"), rs = document.getElementById("resume");
    if (rs && last && byId[last]) { rs.href = last + ".html"; rs.hidden = false; rs.textContent = "ادامه: " + byId[last].title; }
    var pp = el("section", { "class": "progress-panel no-print" }, '<h3>📦 پیشرفتت را نگه دار</h3><p class="pp-text"></p><div class="pp-actions"><button type="button" class="btn" data-pp="save">⬇ ذخیره پیشرفت (فایل)</button><label class="btn">⬆ بازگرداندن از فایل<input type="file" accept="application/json,.json" class="vh"></label></div><p class="pp-msg" role="status" aria-live="polite"></p>');
    chapBox.parentNode.insertBefore(pp, chapBox.nextSibling);
    var ppText = function () { pp.querySelector(".pp-text").textContent = "پیشرفتت فقط در همین مرورگر ذخیره می‌شود. تا الان " + fa(doneCount()) + " درس از " + fa(lessons.length) + " را تمام کرده‌ای. برای عوض کردن دستگاه یا پاک شدن مرورگر، فایل پشتیبان بگیر."; };
    ppText(); document.addEventListener("cazs-progress", ppText);
    pp.querySelector('[data-pp="save"]').addEventListener("click", function () {
      download("c-course-progress-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify({ app: "cazs", v: 1, done: done, quiz: store("cazs-quiz") || {}, pick: store("cazs-pick") || {} }, null, 2), "application/json");
    });
    pp.querySelector("input").addEventListener("change", function () {
      var f = this.files && this.files[0], msg = pp.querySelector(".pp-msg"), inp = this; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        var d; try { d = JSON.parse(rd.result); } catch (e) { d = null; }
        if (!d || d.app !== "cazs" || !Array.isArray(d.done)) { msg.textContent = "این فایل، پشتیبان این دوره نیست."; msg.className = "pp-msg bad"; inp.value = ""; return; }
        d.done.forEach(function (id) { if (byId[id] && done.indexOf(id) < 0) done.push(id); });
        var q = store("cazs-quiz") || {}; Object.keys(d.quiz || {}).forEach(function (k) { if (byId[k] && Array.isArray(d.quiz[k])) q[k] = (q[k] || []).concat(d.quiz[k].filter(function (n) { return (q[k] || []).indexOf(n) < 0; })); });
        var pk = store("cazs-pick") || {}; Object.keys(d.pick || {}).forEach(function (k) { if (byId[k] && !pk[k]) pk[k] = d.pick[k]; });
        store("cazs-done", done); store("cazs-quiz", q); store("cazs-pick", pk);
        msg.textContent = "پیشرفت برگشت. صفحه دوباره بارگذاری می‌شود…"; msg.className = "pp-msg ok"; refreshProgress(); setTimeout(function () { location.reload(); }, 1000);
      };
      rd.readAsText(f);
    });
  }
  refreshProgress();

  /* ---------- فهرست «روی این صفحه» ---------- */
  var h2s = article.querySelectorAll("h2");
  if (lesson && h2s.length > 2) {
    var toc = '<summary>📌 روی این صفحه (' + fa(h2s.length) + ' بخش)</summary>';
    h2s.forEach(function (h, i) { if (!h.id) h.id = "s" + (i + 1); if (!h.closest(".goals,.sum")) toc += '<div><a href="#' + h.id + '">' + esc(h.textContent) + '</a></div>'; });
    var td = el("details", { "class": "toc no-print" }, toc), lede = article.querySelector(".lede");
    (lede || article.querySelector(".lesson-head")).insertAdjacentElement("afterend", td);
  }

  /* ---------- رنگ‌آمیزی کد ---------- */
  var KW = "auto break case const continue default do else enum extern for goto if inline register restrict return sizeof static struct switch typedef union volatile while _Bool _Static_assert _Alignas _Alignof _Noreturn asm __attribute__".split(" ");
  var TY = "void char short int long float double signed unsigned bool size_t ssize_t ptrdiff_t FILE uint8_t int8_t uint16_t int16_t uint32_t int32_t uint64_t int64_t uintptr_t intptr_t NULL true false esp_err_t TaskHandle_t BaseType_t TickType_t QueueHandle_t GPIO_TypeDef".split(" ");
  function mk(rules) {
    var re = new RegExp(rules.map(function (r) { return "(" + r[0] + ")"; }).join("|"), "gm");
    return function (raw, opts) {
      var out = [], last = 0, m, incl = false; re.lastIndex = 0;
      while ((m = re.exec(raw))) {
        if (m[0] === "") { re.lastIndex++; continue; }
        var gi = 1; while (gi <= rules.length && m[gi] === undefined) gi++;
        var cls = rules[gi - 1][1];
        if (typeof cls === "function") cls = cls(m[0], raw, m.index, incl);
        if (cls === "tk-angle" && !incl) { re.lastIndex = m.index + 1; continue; }
        if (m.index > last) out.push([raw.slice(last, m.index), ""]);
        if (cls === "tk-angle") cls = "tk-str";
        if (cls === "tk-pre") incl = /include/.test(m[0]); else if (cls !== "tk-com") incl = incl && /^\s+$/.test(m[0]);
        out.push([m[0], cls]); last = re.lastIndex;
      }
      if (last < raw.length) out.push([raw.slice(last), ""]);
      return out;
    };
  }
  var idCls = function (w, raw, i) { if (KW.indexOf(w) > -1) return "tk-kw"; if (TY.indexOf(w) > -1) return "tk-ty"; if (/^\s*\(/.test(raw.slice(i + w.length, i + w.length + 6))) return "tk-fn"; if (/^[A-Z][A-Z0-9_]{2,}$/.test(w)) return "tk-num"; return ""; };
  var LANGS = {
    c: mk([["\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/", "tk-com"], ['"(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])+\'', "tk-str"], ["^[ \\t]*#[ \\t]*[a-z_]+", "tk-pre"], ["<[\\w./]+>", "tk-angle"],
      ["0[xX][0-9a-fA-F_]+[uUlL]*|0[bB][01_]+[uUlL]*|\\d[\\d_]*\\.?\\d*(?:[eE][+-]?\\d+)?[fFuUlL]*", "tk-num"], ["[A-Za-z_]\\w*", idCls]]),
    sh: mk([["#[^\\n]*", "tk-com"], ['"(?:\\\\.|[^"\\\\\\n])*"|\'[^\'\\n]*\'', "tk-str"], ["^\\$ ", "tk-kw"], ["\\$\\{?[A-Za-z_@?#*0-9]+\\}?", "tk-pre"], ["(?:^|\\s)--?[A-Za-z][\\w-]*", "tk-ty"], ["\\b\\d+\\b", "tk-num"]]),
    asm: mk([["@[^\\n]*|;[^\\n]*|\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/", "tk-com"], ["^[\\w.$]+:", "tk-fn"], ["\\.[a-z_]\\w*", "tk-pre"], ["#?0[xX][0-9a-fA-F]+|#-?\\d+", "tk-num"], ["\\b(?:r\\d{1,2}|sp|lr|pc|ip|fp|[xw]\\d{1,2})\\b", "tk-ty"], ["^\\s+[a-z][\\w.]*", "tk-kw"]]),
    ld: mk([["\\/\\*[\\s\\S]*?\\*\\/", "tk-com"], ["\\b(?:MEMORY|SECTIONS|ENTRY|KEEP|ALIGN|PROVIDE|AT|ORIGIN|LENGTH|NOLOAD|INCLUDE|SORT|ASSERT)\\b", "tk-kw"], ["\\.[A-Za-z_][\\w.]*", "tk-pre"], ["0[xX][0-9a-fA-F]+|\\b\\d+[KkMm]?\\b", "tk-num"]]),
    make: mk([["#[^\\n]*", "tk-com"], ["\\$[({][^)}]+[)}]|\\$[@<^]", "tk-pre"], ["^[\\w./%-]+(?=\\s*:)", "tk-fn"], ["\\b(?:if|else|endif|include|add_executable|add_library|target_link_libraries|project|cmake_minimum_required|set|add_compile_options|target_include_directories)\\b", "tk-kw"]]),
    json: mk([['"(?:\\\\.|[^"\\\\\\n])*"', "tk-str"], ["-?\\d+\\.?\\d*", "tk-num"], ["\\b(?:true|false|null)\\b", "tk-kw"]]),
    text: function (raw) { return [[raw, ""]]; }
  };
  LANGS.cpp = LANGS.c; LANGS.ini = LANGS.sh; LANGS.cmake = LANGS.make; LANGS.gdb = LANGS.sh;
  var FA_RE = /[\u0600-\u06FF]/;
  function renderCode(block) {
    var pre = block.querySelector("pre"); if (!pre) return;
    var raw = pre.textContent.replace(/^\n+/, "").replace(/\s+$/, ""), lang = block.getAttribute("data-lang") || "c";
    var toks = (LANGS[lang] || LANGS.text)(raw), lines = [""];
    toks.forEach(function (t) {
      t[0].split("\n").forEach(function (p, i) {
        if (i > 0) lines.push(""); if (!p) return;
        if (FA_RE.test(p) && (t[1] === "tk-com" || t[1] === "tk-str" || !t[1])) {
          var mm = /^(\s*(?:\/\/|\/\*|\*|#|@|;)?\s*)([\s\S]*)$/.exec(p);
          if (t[1] === "tk-com") lines[lines.length - 1] += '<span class="tk-com">' + esc(mm[1]) + '</span><span class="tk-com fa-run" dir="rtl">' + esc(mm[2]) + '</span>';
          else lines[lines.length - 1] += '<span class="' + (t[1] || "") + '">' + p.split(/([\u0600-\u06FF][\u0600-\u06FF\u200c ]*[\u0600-\u06FF]|[\u0600-\u06FF])/).map(function (s, k) { return k % 2 ? '<span class="fa-run" dir="rtl">' + esc(s) + '</span>' : esc(s); }).join("") + '</span>';
        } else lines[lines.length - 1] += t[1] ? '<span class="' + t[1] + '">' + esc(p) + '</span>' : esc(p);
      });
    });
    pre.innerHTML = lines.map(function (l) { return '<span class="ln">' + (l || " ") + '</span>'; }).join("");
    var df = block.getAttribute("data-file") || "", dl = /^[\w.-]+\.(c|h|ld|s|S|mk|txt|cmake|json)$/.test(df) || /^(Makefile|CMakeLists\.txt)$/.test(df);
    var bar = el("div", { "class": "bar" }, '<span class="dots"><i></i><i></i><i></i></span><span class="fname">' + esc(df || lang) + '</span>' +
      (dl ? '<button type="button" class="dl">⬇ دانلود</button>' : '') + '<button type="button" class="cp">کپی</button>');
    block.insertBefore(bar, pre); block._raw = raw;
    if (dl) bar.querySelector(".dl").addEventListener("click", function () { download(df, raw + "\n"); });
    bar.querySelector(".cp").addEventListener("click", function () {
      var b = this, ok = function () { b.textContent = "کپی شد ✓"; setTimeout(function () { b.textContent = "کپی"; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(raw).then(ok, function () { fbCopy(raw); ok(); }); else { fbCopy(raw); ok(); }
    });
  }
  function fbCopy(t) { var ta = el("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) { } ta.remove(); }
  article.querySelectorAll(".code").forEach(renderCode);

  /* ---------- ترمینال: خط‌های دستور رنگی می‌شوند ---------- */
  article.querySelectorAll("pre.term, pre.serial").forEach(function (p) {
    var t = p.textContent.replace(/^\n+/, "").replace(/\s+$/, "");
    p.innerHTML = t.split("\n").map(function (l) { return /^\$ /.test(l) ? '<span class="p">$ </span>' + esc(l.slice(2)) : /^\/\/ /.test(l) ? '<span class="c">' + esc(l) + '</span>' : esc(l); }).join("\n");
  });

  /* ---------- توضیح تکه‌تکه زیر خود خط: کلیک روی خط ⇒ توضیحش همان‌جا باز می‌شود ---------- */
  article.querySelectorAll("ol.walk").forEach(function (ol) {
    var code = ol.getAttribute("data-for") ? document.getElementById(ol.getAttribute("data-for")) : null;
    if (!code) { var p = ol.previousElementSibling; while (p && !p.classList.contains("code")) p = p.previousElementSibling; code = p; }
    if (!code || !code.querySelector("pre")) return;
    var lns = code.querySelectorAll("pre .ln"), items = [];
    ol.querySelectorAll("li[data-lines]").forEach(function (li) {
      var set = []; li.getAttribute("data-lines").split(",").forEach(function (seg) { var ab = seg.split("-"), x = +ab[0], y = +(ab[1] || ab[0]); for (var i = x; i <= y; i++) if (lns[i - 1]) set.push(i); });
      if (set.length) items.push({ li: li, set: set, last: Math.max.apply(null, set), note: null, open: false });
    });
    if (!items.length) return;
    ol.classList.add("walk-inline");
    var byLine = {}; items.forEach(function (it) { it.set.forEach(function (n) { if (!byLine[n] || byLine[n].set.length > it.set.length) byLine[n] = it; }); });
    function makeNote(it) {
      var n = el("span", { "class": "ln-note" }), tmp = it.li.cloneNode(true); n.innerHTML = tmp.innerHTML;
      var after = lns[it.last - 1]; while (after.nextSibling && after.nextSibling.classList && after.nextSibling.classList.contains("ln-note")) after = after.nextSibling;
      after.parentNode.insertBefore(n, after.nextSibling); return n;
    }
    function show(it, on) {
      if (on && !it.note) it.note = makeNote(it); if (it.note) it.note.hidden = !on; it.open = on;
      items.forEach(function () { }); lns.forEach(function (l, i) { var hl = items.some(function (o) { return o.open && o.set.indexOf(i + 1) > -1; }); l.classList.toggle("hl", hl); });
      byLineAttr(it, on);
    }
    function byLineAttr(it, on) { it.set.forEach(function (n) { if (byLine[n] === it) lns[n - 1].setAttribute("aria-expanded", on ? "true" : "false"); }); }
    Object.keys(byLine).forEach(function (n) {
      var l = lns[n - 1], it = byLine[n]; l.classList.add("has"); l.setAttribute("tabindex", "0"); l.setAttribute("role", "button"); l.setAttribute("aria-expanded", "false");
      var t = function (e) { if (e.target.closest && e.target.closest(".ln-note")) return; show(it, !it.open); };
      l.addEventListener("click", t); l.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(e); } });
    });
    var bar = code.querySelector(".bar"), all = el("button", { type: "button", "class": "cp" }, "باز کردن همه توضیح‌ها");
    var allOpen = false; all.addEventListener("click", function () { allOpen = !allOpen; items.forEach(function (it) { show(it, allOpen); }); all.textContent = allOpen ? "بستن همه" : "باز کردن همه توضیح‌ها"; });
    bar.insertBefore(all, bar.querySelector(".cp"));
    if (!article.querySelector(".ln-hint")) code.insertAdjacentHTML("afterend", '<p class="ln-hint no-print" style="font-size:14px;color:var(--mute);margin-top:-10px">💡 روی هر خطِ دارای علامت <b>؟</b> کلیک کن؛ توضیحش همان‌جا زیر خودش باز می‌شود.</p>');
  });

  /* ---------- آزمون: پاسخ ذخیره و رنگی ---------- */
  var quizzes = article.querySelectorAll(".quiz");
  function quizIdx(q) { return Array.prototype.indexOf.call(quizzes, q); }
  quizzes.forEach(function (q, qi) {
    var right = +q.getAttribute("data-answer"), lis = q.querySelectorAll("ol > li"), pid = pageId;
    function markWrong(li) { li.classList.add("wrong"); var w = li.getAttribute("data-why"); if (w && !li.querySelector(".why-msg")) li.insertAdjacentHTML("beforeend", '<span class="why-msg">' + w + '</span>'); }
    function solve(save) {
      q.classList.add("solved"); lis[right - 1].classList.add("right");
      if (save) { quizSolved[pid] = quizSolved[pid] || []; if (quizSolved[pid].indexOf(qi) < 0) quizSolved[pid].push(qi); store("cazs-quiz", quizSolved); }
      updScore(); document.dispatchEvent(new CustomEvent("cazs-quiz"));
    }
    lis.forEach(function (li, oi) {
      li.setAttribute("tabindex", "0"); li.setAttribute("role", "button");
      var pick = function () {
        if (q.classList.contains("solved")) return;
        if (oi + 1 === right) { solve(true); return; }
        markWrong(li); var pk = (quizPick[pid] = quizPick[pid] || {}); pk[qi] = pk[qi] || []; if (pk[qi].indexOf(oi) < 0) pk[qi].push(oi); store("cazs-pick", quizPick);
      };
      li.addEventListener("click", pick); li.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
    });
    ((quizPick[pid] || {})[qi] || []).forEach(function (oi) { if (lis[oi]) markWrong(lis[oi]); });
    if ((quizSolved[pid] || []).indexOf(qi) > -1) solve(false);
  });
  function updScore() { var s = article.querySelector(".quiz-score"); if (s) s.textContent = fa(article.querySelectorAll(".quiz.solved").length) + " از " + fa(quizzes.length) + " سؤال را درست جواب داده‌ای."; }
  updScore();

  /* ---------- واژه‌نامه شناور ---------- */
  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  function openTerm(sp) {
    closePop(); var g = GL[sp.getAttribute("data-t")]; if (!g) return;
    pop = el("div", { "class": "tip-pop", role: "tooltip" }, '<b>' + esc(g.fa) + (g.en ? ' <span class="en">(' + esc(g.en) + ')</span>' : '') + '</b>' + esc(g.def) + (g.lesson ? ' <a href="' + g.lesson + '.html">درس ' + fa(g.lesson.replace("-", ".")) + '</a>' : '') + ' · <a href="glossary.html#' + esc(sp.getAttribute("data-t")) + '">واژه‌نامه</a>');
    document.body.appendChild(pop);
    var r = sp.getBoundingClientRect(), w = pop.offsetWidth, x = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)), y = r.bottom + 8;
    if (y + pop.offsetHeight > innerHeight - 8) y = Math.max(8, r.top - pop.offsetHeight - 8);
    pop.style.left = x + "px"; pop.style.top = y + "px";
  }
  article.querySelectorAll(".term").forEach(function (s) { s.setAttribute("tabindex", "0"); s.setAttribute("role", "button"); s.addEventListener("click", function (e) { e.stopPropagation(); openTerm(s); }); s.addEventListener("keydown", function (e) { if (e.key === "Enter") openTerm(s); }); });
  document.addEventListener("click", function (e) { if (pop && !e.target.closest(".tip-pop,.term")) closePop(); });
  addEventListener("scroll", closePop, { passive: true });
  var glBox = document.getElementById("gl");
  if (glBox) {
    var keys = Object.keys(GL).sort(function (a, b) { return GL[a].fa.localeCompare(GL[b].fa, "fa"); });
    glBox.innerHTML = '<input class="gl-filter" type="search" placeholder="جستجو در واژه‌نامه…" aria-label="جستجو در واژه‌نامه"><div class="gl-list">' + keys.map(function (k) {
      var g = GL[k]; return '<div class="gl-item" id="' + k + '"><h3>' + esc(g.fa) + (g.en ? '<span class="en">' + esc(g.en) + '</span>' : '') + '</h3><p>' + esc(g.def) + '</p>' + (g.lesson ? '<a href="' + g.lesson + '.html">بیشتر: درس ' + fa(g.lesson.replace("-", ".")) + '</a>' : '') + '</div>';
    }).join("") + '</div>';
    glBox.querySelector("input").addEventListener("input", function () { var q = this.value.trim().toLowerCase(); glBox.querySelectorAll(".gl-item").forEach(function (d) { d.hidden = q && d.textContent.toLowerCase().indexOf(q) < 0; }); });
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }

  /* ---------- جستجو ---------- */
  var SI = null, sov = null;
  function norm(s) { return String(s).replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\u200c\u064B-\u065F]/g, "").replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); }).toLowerCase(); }
  function openSearch() {
    if (!sov) {
      sov = el("div", { "class": "search-ov", role: "dialog", "aria-modal": "true", "aria-label": "جستجو" }, '<div class="search-box"><input type="search" placeholder="جستجو در همه درس‌ها… (مثلا: volatile)" aria-label="عبارت جستجو"><div class="search-res" role="listbox"></div></div>');
      document.body.appendChild(sov);
      sov.addEventListener("click", function (e) { if (e.target === sov) sov.classList.remove("open"); });
      var inp = sov.querySelector("input"), res = sov.querySelector(".search-res"), sel = -1;
      var run = function () {
        var q = norm(inp.value).trim(); if (!q) { res.innerHTML = '<p style="padding:8px 12px;color:var(--mute)">یک واژه بنویس. مثلا «اشاره‌گر»، «volatile» یا «HardFault».</p>'; return; }
        var ws = q.split(/\s+/), out = [];
        var docs = SI || lessons.map(function (l) { return { id: l.id, title: l.title, h: [], text: "" }; }).concat(C.extras.map(function (x) { return { id: x.id, title: x.title, h: [], text: "" }; }));
        docs.forEach(function (d) {
          var t = norm(d.title), best = null, score = 0;
          ws.forEach(function (w) { if (t.indexOf(w) > -1) score += 10; });
          (d.h || []).forEach(function (h) { var ht = norm(h.t), s = 0; ws.forEach(function (w) { if (ht.indexOf(w) > -1) s += 6; }); if (s > (best ? best.s : 0)) best = { s: s, h: h }; score += s ? 3 : 0; });
          var tx = norm(d.text || ""), cnt = 0, pos = -1; ws.forEach(function (w) { var i = tx.indexOf(w); if (i > -1) { cnt++; if (pos < 0) pos = i; } });
          if (cnt === ws.length && tx) score += 2 + cnt;
          if (score > 0) out.push({ d: d, score: score, best: best, snip: pos > -1 ? (d.text || "").slice(Math.max(0, pos - 30), pos + 90) : "" });
        });
        out.sort(function (a, b) { return b.score - a.score; }); out = out.slice(0, 12);
        res.innerHTML = out.length ? out.map(function (o) { var href = o.d.id + ".html" + (o.best && o.best.h.id ? "#" + o.best.h.id : ""); return '<a href="' + href + '"><b>' + esc(o.d.title) + '</b><small>' + esc(o.best ? "بخش: " + o.best.h.t : o.snip) + '</small></a>'; }).join("") : '<p style="padding:8px 12px;color:var(--mute)">چیزی پیدا نشد. املای دیگری را امتحان کن.</p>';
        sel = -1;
      };
      inp.addEventListener("input", run);
      inp.addEventListener("keydown", function (e) {
        var as = res.querySelectorAll("a"); if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!as.length) return; sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + as.length) % as.length; as.forEach(function (a, i) { a.classList.toggle("sel", i === sel); }); as[sel].scrollIntoView({ block: "nearest" }); }
        else if (e.key === "Enter" && as.length) { location.href = (as[sel < 0 ? 0 : sel]).getAttribute("href"); }
      });
      run();
      fetch("assets/search-fa.json").then(function (r) { return r.json(); }).then(function (j) { SI = j; run(); }).catch(function () { });
    }
    sov.classList.add("open"); var i2 = sov.querySelector("input"); i2.focus(); i2.select();
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (sov && sov.classList.contains("open")) sov.classList.remove("open"); closePop(); if (document.body.classList.contains("nav-open")) setNav(false); var z = document.querySelector(".zoom"); if (z) z.remove(); }
    if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || "") && !e.ctrlKey && !e.metaKey) { e.preventDefault(); openSearch(); }
  });

  /* ---------- بزرگ‌نمایی شکل‌ها ---------- */
  article.querySelectorAll("figure .frame").forEach(function (f) {
    var s = f.querySelector("svg"); if (!s || f.closest(".hero")) return; f.setAttribute("tabindex", "0"); f.setAttribute("title", "برای بزرگ‌نمایی بزن");
    var zoom = function () { var z = el("div", { "class": "zoom", role: "dialog", "aria-label": "شکل بزرگ" }, "<div></div>"); z.firstChild.appendChild(s.cloneNode(true)); z.addEventListener("click", function () { z.remove(); }); document.body.appendChild(z); };
    f.addEventListener("click", zoom); f.addEventListener("keydown", function (e) { if (e.key === "Enter") zoom(); });
  });
  article.querySelectorAll(".callout.coach").forEach(function (c) { c.insertAdjacentHTML("afterbegin", mascot("think")); });
  article.querySelectorAll(".callout.warn").forEach(function (c) { if (!c.querySelector(".mascot")) { /* هشدار بدون شخصیت می‌ماند تا شلوغ نشود */ } });

  /* ---------- ابزارک‌های تعاملی ---------- */
  function bin(n, w) { var s = (n >>> 0).toString(2); while (s.length < w) s = "0" + s; return s.slice(-w); }
  function grp(s, k) { var o = []; for (var i = s.length; i > 0; i -= k) o.unshift(s.slice(Math.max(0, i - k), i)); return o.join("_"); }
  function hex(n, w) { var s = (n >>> 0).toString(16).toUpperCase(); while (s.length < w / 4) s = "0" + s; return "0x" + s.slice(-(w / 4)); }
  function parseNum(t) { t = String(t).trim().replace(/_/g, ""); if (/^0x[0-9a-f]+$/i.test(t)) return parseInt(t, 16); if (/^0b[01]+$/i.test(t)) return parseInt(t.slice(2), 2); if (/^-?\d+$/.test(t)) return parseInt(t, 10); return NaN; }
  var W = {
    base: function (w) {
      w.innerHTML = '<div class="wt">مبدل عدد: ده‌دهی، هگز و باینری</div><div class="wb"><div class="wrow"><label><bdi>عدد را بنویس (200 یا 0xC8 یا 0b11001000):</bdi></label><input type="text" value="200" size="14" aria-label="عدد"><label>عرض:</label><select aria-label="تعداد بیت"><option>8</option><option>16</option><option selected>32</option></select></div><div class="wgrid"></div><p class="wnote"></p></div>';
      var inp = w.querySelector("input"), sel = w.querySelector("select"), g = w.querySelector(".wgrid"), note = w.querySelector(".wnote");
      if (w.getAttribute("data-width")) sel.value = w.getAttribute("data-width"); if (w.getAttribute("data-value")) inp.value = w.getAttribute("data-value");
      function run() {
        var n = parseNum(inp.value), bw = +sel.value; if (isNaN(n)) { g.innerHTML = ""; note.textContent = "این عدد را نمی‌فهمم. فقط ده‌دهی، 0x… یا 0b… بنویس."; return; }
        var mask = bw === 32 ? 0xFFFFFFFF : (1 << bw) - 1, u = (n & mask) >>> 0, sgn = (u & (1 << (bw - 1))) ? u - Math.pow(2, bw) : u; if (bw === 32) sgn = u | 0;
        g.innerHTML = '<div><small>بدون علامت (unsigned)</small><output>' + u + '</output></div><div><small>با علامت (signed، مکمل ۲)</small><output>' + sgn + '</output></div><div><small>هگز</small><output>' + hex(u, bw) + '</output></div><div><small>باینری</small><output>' + grp(bin(u, bw), 4) + '</output></div><div><small>هشت‌هشتی (octal)</small><output>0' + u.toString(8) + '</output></div>';
        note.textContent = (n < 0 || n > mask) ? "عدد در " + fa(bw) + " بیت جا نمی‌شود؛ فقط " + fa(bw) + " بیت پایینی نگه داشته شد (همان اتفاقی که در سخت‌افزار می‌افتد)." : "";
      }
      inp.addEventListener("input", run); sel.addEventListener("change", run); run();
    },
    bits: function (w) {
      var bw = +(w.getAttribute("data-width") || 8), name = w.getAttribute("data-reg") || "REG", fields = []; try { fields = JSON.parse(w.getAttribute("data-fields") || "[]"); } catch (e) { }
      var val = +(w.getAttribute("data-value") || 0);
      w.innerHTML = '<div class="wt">' + esc(w.getAttribute("data-title") || "رجیستر بازی‌کن") + '</div><div class="wb"><div class="bits"></div><div class="wgrid"></div><div class="wrow"><label>شماره بیت n:</label><input type="number" min="0" max="' + (bw - 1) + '" value="0" aria-label="شماره بیت"> <button class="btn" data-op="set" type="button">Set</button><button class="btn" data-op="clr" type="button">Clear</button><button class="btn" data-op="tog" type="button">Toggle</button><button class="btn" data-op="rst" type="button">صفر کن</button></div><div class="wmsg fa"></div></div>';
      var bx = w.querySelector(".bits"), gr = w.querySelector(".wgrid"), msg = w.querySelector(".wmsg"), nIn = w.querySelector("input");
      var draw = function () {
        var h = ""; for (var i = bw - 1; i >= 0; i--) { h += (i !== bw - 1 && i % 4 === 3 ? '</div><div class="bitgrp">' : (i === bw - 1 ? '<div class="bitgrp">' : "")) + '<div class="bitc"><small>' + i + '</small><button type="button" data-b="' + i + '" class="' + ((val >>> i) & 1 ? "on" : "") + '" aria-pressed="' + (((val >>> i) & 1) ? "true" : "false") + '" aria-label="بیت ' + i + '">' + ((val >>> i) & 1) + '</button></div>'; }
        bx.innerHTML = h + '</div>';
        var f = fields.map(function (fl) { var m = ((1 << (fl.hi - fl.lo + 1)) - 1); return '<div><small>' + esc(fl.name) + ' (بیت ' + fl.hi + (fl.hi !== fl.lo ? ".." + fl.lo : "") + ')</small><output>' + (((val >>> fl.lo) & m) >>> 0) + (fl.map ? " = " + esc(fl.map[((val >>> fl.lo) & m)] || "؟") : "") + '</output></div>'; }).join("");
        gr.innerHTML = '<div><small>' + esc(name) + ' (هگز)</small><output>' + hex(val, bw) + '</output></div><div><small>ده‌دهی</small><output>' + (val >>> 0) + '</output></div>' + f;
      };
      var mask = bw === 32 ? 0xFFFFFFFF : (1 << bw) - 1, say = function (t) { msg.innerHTML = t; };
      bx.addEventListener("click", function (e) { var b = e.target.closest("button[data-b]"); if (!b) return; val = (val ^ (1 << +b.getAttribute("data-b"))) & mask; draw(); say("با کلیک روی بیت " + fa(b.getAttribute("data-b")) + " آن را برعکس کردی."); });
      w.querySelector(".wrow").addEventListener("click", function (e) {
        var b = e.target.closest("button[data-op]"); if (!b) return; var n = Math.max(0, Math.min(bw - 1, +nIn.value || 0)), op = b.getAttribute("data-op"), old = val;
        if (op === "set") { val = (val | (1 << n)) & mask; say("<code>" + esc(name) + " |= (1U &lt;&lt; " + n + ");</code> ← بیت " + fa(n) + " یک شد و بقیه دست‌نخورده ماندند."); }
        else if (op === "clr") { val = (val & ~(1 << n)) & mask; say("<code>" + esc(name) + " &amp;= ~(1U &lt;&lt; " + n + ");</code> ← بیت " + fa(n) + " صفر شد و بقیه دست‌نخورده ماندند."); }
        else if (op === "tog") { val = (val ^ (1 << n)) & mask; say("<code>" + esc(name) + " ^= (1U &lt;&lt; " + n + ");</code> ← بیت " + fa(n) + " برعکس شد."); }
        else { val = 0; say("همه بیت‌ها صفر شدند: <code>" + esc(name) + " = 0;</code>"); }
        if (old === val && op !== "rst") say(msg.innerHTML + " (این بار مقدار عوض نشد چون بیت از قبل همین حالت را داشت.)"); draw();
      });
      draw();
    },
    overflow: function (w) {
      var T = { uint8_t: [0, 255, 8], int8_t: [-128, 127, 8], uint16_t: [0, 65535, 16], int16_t: [-32768, 32767, 16] }, cur = w.getAttribute("data-type") || "uint8_t", v = T[cur][0] === 0 ? 250 : 120;
      w.innerHTML = '<div class="wt">سرریز (overflow): عدد از دایره‌اش بیرون می‌زند</div><div class="wb"><div class="wrow"><label>نوع:</label><select aria-label="نوع متغیر">' + Object.keys(T).map(function (k) { return '<option' + (k === cur ? " selected" : "") + '>' + k + '</option>'; }).join("") + '</select></div><div class="wgrid"></div><div class="wrow"><button class="btn" data-d="1" type="button">+ ۱</button><button class="btn" data-d="10" type="button">+ ۱۰</button><button class="btn" data-d="-1" type="button">− ۱</button><button class="btn" data-d="0" type="button">برگرد</button></div><div class="wmsg fa"></div></div>';
      var g = w.querySelector(".wgrid"), msg = w.querySelector(".wmsg"), sel = w.querySelector("select");
      function draw(t) { var r = T[cur], bw = r[2]; g.innerHTML = '<div><small>مقدار در ' + cur + '</small><output>' + v + '</output></div><div><small>باینری</small><output>' + grp(bin(v & ((1 << bw) - 1), bw), 4) + '</output></div><div><small>بازه مجاز</small><output>' + r[0] + '..' + r[1] + '</output></div>'; if (t) msg.innerHTML = t; }
      sel.addEventListener("change", function () { cur = sel.value; v = T[cur][0] === 0 ? T[cur][1] - 5 : T[cur][1] - 7; draw("نوع عوض شد؛ مقدار را نزدیک بالاترین حد گذاشتم. روی «+ ۱۰» بزن."); });
      w.querySelectorAll("[data-d]").forEach(function (b) {
        b.addEventListener("click", function () {
          var d = +b.getAttribute("data-d"), r = T[cur], span = r[1] - r[0] + 1; if (d === 0) { v = r[0] === 0 ? 250 : 120; draw("برگشتیم."); return; }
          var nv = v + d, wrapped = nv > r[1] || nv < r[0]; nv = ((nv - r[0]) % span + span) % span + r[0];
          var t = wrapped ? "💥 از بازه بیرون زد و از طرف دیگر برگشت: " + v + " " + (d > 0 ? "+" : "−") + " " + Math.abs(d) + " ⇒ " + nv + ". " + (r[0] < 0 ? "این <b>سرریز عدد علامت‌دار</b> است و در C «رفتار تعریف‌نشده» حساب می‌شود، یعنی کامپایلر اجازه دارد هر کاری بکند!" : "در نوع بدون علامت، این چرخش قانونی و تضمین‌شده است (پیمانه " + fa(span) + ").") : "همه چیز در بازه است.";
          v = nv; draw(t);
        });
      }); draw("روی «+ ۱۰» بزن و ببین وقتی به سقف می‌رسیم چه می‌شود.");
    },
    struct: function (w) {
      var mem = []; try { mem = JSON.parse(w.getAttribute("data-members") || "[]"); } catch (e) { }
      var SZ = { char: 1, uint8_t: 1, int8_t: 1, bool: 1, short: 2, uint16_t: 2, int16_t: 2, int: 4, uint32_t: 4, int32_t: 4, float: 4, long: 4, "void*": 4, double: 8, uint64_t: 8, int64_t: 8 };
      var COL = ["#ffd60a", "#7ea3ff", "#ff86b3", "#3ddc97", "#ff9a4d", "#b394ff", "#3fd3e6", "#f0e68c"];
      w.innerHTML = '<div class="wt">' + esc(w.getAttribute("data-title") || "تراز حافظه و padding در struct") + '</div><div class="wb"><div class="wrow"><label><input type="checkbox" data-o="packed"> packed (بدون padding)</label><label><input type="checkbox" data-o="sort"> مرتب‌شده از بزرگ به کوچک</label></div><div class="mem"></div><div class="wgrid"></div><div class="wmsg fa"></div></div>';
      var mm = w.querySelector(".mem"), gr = w.querySelector(".wgrid"), msg = w.querySelector(".wmsg");
      function run() {
        var packed = w.querySelector('[data-o="packed"]').checked, srt = w.querySelector('[data-o="sort"]').checked, ms = mem.slice(); if (srt) ms.sort(function (a, b) { return SZ[b[0]] - SZ[a[0]]; });
        var off = 0, cells = [], maxA = 1, used = 0;
        ms.forEach(function (m, i) { var s = SZ[m[0]] || 4, a = packed ? 1 : s; maxA = Math.max(maxA, a); while (off % a) { cells.push({ pad: 1, addr: off }); off++; } for (var k = 0; k < s; k++) cells.push({ name: m[1], type: m[0], col: COL[i % COL.length], addr: off + k, first: k === 0 }); off += s; used += s; });
        if (!packed) while (off % maxA) { cells.push({ pad: 1, addr: off }); off++; }
        mm.innerHTML = cells.map(function (c) { return c.pad ? '<div class="cell" style="background:repeating-linear-gradient(45deg,#999,#999 4px,#ddd 4px,#ddd 8px);color:#000"><span class="ad">+' + c.addr + '</span><span class="vl">pad</span><span class="nm">&nbsp;</span></div>' : '<div class="cell" style="background:' + c.col + ';color:#000"><span class="ad">+' + c.addr + '</span><span class="vl">' + (c.first ? "" : "·") + '</span><span class="nm" style="color:#000">' + (c.first ? esc(c.name) : "&nbsp;") + '</span></div>'; }).join("");
        gr.innerHTML = '<div><small>اندازه واقعی (sizeof)</small><output>' + off + ' B</output></div><div><small>بایت‌های مفید</small><output>' + used + '</output></div><div><small>بایت هدررفته (padding)</small><output>' + (off - used) + '</output></div>';
        msg.textContent = packed ? "با packed هیچ فاصله‌ای نیست، ولی دسترسی به فیلدهای ناهم‌تراز روی بعضی CPUها کندتر یا حتی خطاست." : (off - used ? "کامپایلر برای هم‌تراز نگه داشتن هر فیلد بایت‌های خالی (خاکستری) گذاشته است. ترتیب فیلدها را عوض کن و اندازه را ببین!" : "این ترتیب هیچ بایت هدر نمی‌دهد.");
      }
      w.querySelectorAll("input").forEach(function (i) { i.addEventListener("change", run); }); run();
    },
    mem: function (w) {
      var cfg = {}; try { cfg = JSON.parse(w.getAttribute("data-config") || "{}"); } catch (e) { }
      var cells = cfg.cells || [], steps = cfg.steps || [], i = -1, vals = cells.map(function (c) { return c.val; });
      w.innerHTML = '<div class="wt">' + esc(cfg.title || "حافظه را قدم‌به‌قدم ببین") + '</div><div class="wb"><div class="code" style="margin:0 0 10px;box-shadow:none"><pre class="mcode" style="padding:8px 0"></pre></div><div class="mem"></div><div class="wmsg fa"></div><div class="wrow"><button class="btn" data-a="prev" type="button">→ قبلی</button><button class="btn primary" data-a="next" type="button">بعدی ←</button><button class="btn" data-a="rst" type="button">از اول</button></div></div>';
      var mm = w.querySelector(".mem"), msg = w.querySelector(".wmsg"), mc = w.querySelector(".mcode");
      mc.innerHTML = (cfg.code || []).map(function (l, n) { return '<span class="ln" data-n="' + n + '">' + esc(l) + '</span>'; }).join("");
      function apply(upto) { vals = cells.map(function (c) { return c.val; }); for (var s = 0; s <= upto; s++) { var st = steps[s], set = st.set || {}; Object.keys(set).forEach(function (k) { vals[+k] = set[k]; }); } }
      function draw() {
        var st = steps[i] || {}, hot = st.hot || [];
        mm.innerHTML = cells.map(function (c, n) { return '<div class="cell ' + (c.kind || "") + (hot.indexOf(n) > -1 ? " hot" : "") + '"><span class="ad">' + esc(c.addr) + '</span><span class="vl">' + (vals[n] === null || vals[n] === undefined ? "?" : esc(vals[n])) + '</span><span class="nm">' + esc(c.name || "") + '</span></div>'; }).join("");
        mc.querySelectorAll(".ln").forEach(function (l) { l.classList.toggle("hl", +l.getAttribute("data-n") === st.line); });
        msg.innerHTML = i < 0 ? esc(cfg.intro || "روی «بعدی» بزن و اجرای برنامه را خط‌به‌خط دنبال کن.") : (st.say || "");
      }
      w.querySelector(".wrow").addEventListener("click", function (e) {
        var b = e.target.closest("button[data-a]"); if (!b) return; var a = b.getAttribute("data-a");
        if (a === "next" && i < steps.length - 1) i++; else if (a === "prev" && i >= 0) i--; else if (a === "rst") i = -1;
        apply(i); draw();
      }); apply(-1); draw();
    }
  };
  article.querySelectorAll(".widget[data-w]").forEach(function (w) { var f = W[w.getAttribute("data-w")]; if (f) f(w); });

  /* ---------- شبکه‌های پایانی ---------- */
  if (location.hash && !glBox) { var tg = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (tg) setTimeout(function () { tg.scrollIntoView(); }, 50); }
})();
