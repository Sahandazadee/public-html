/* آموزش KiCad 9 — language + theme toggle, mobile nav, scroll-spy */
(function () {
  var root = document.documentElement;

  /* ---- language (fa default, RTL) ---- */
  function applyLang(lang) {
    lang = (lang === 'en') ? 'en' : 'fa';
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
    try { localStorage.setItem('kc_lang', lang); } catch (e) {}
    document.querySelectorAll('[data-lang-label]').forEach(function (el) {
      el.textContent = (lang === 'fa') ? 'EN' : 'فا';
    });
  }
  var savedLang = 'fa';
  try { savedLang = localStorage.getItem('kc_lang') || 'fa'; } catch (e) {}
  applyLang(savedLang);

  /* ---- theme ---- */
  function applyTheme(t) {
    root.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');
    try { localStorage.setItem('kc_theme', t); } catch (e) {}
  }
  var savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem('kc_theme') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  } catch (e) {}
  applyTheme(savedTheme);

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (!t) {
      if (document.body.classList.contains('nav-open') && !e.target.closest('.sidebar') && !e.target.closest('[data-action="nav"]')) {
        document.body.classList.remove('nav-open');
      }
      return;
    }
    var a = t.getAttribute('data-action');
    if (a === 'lang') applyLang(root.getAttribute('data-lang') === 'fa' ? 'en' : 'fa');
    if (a === 'theme') applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    if (a === 'nav') document.body.classList.toggle('nav-open');
    if (a === 'summary') {
      var body = t.nextElementSibling;
      if (body && body.classList.contains('summary-body')) {
        var isOpen = t.getAttribute('aria-expanded') === 'true';
        if (isOpen) { body.setAttribute('hidden',''); t.setAttribute('aria-expanded','false'); }
        else { body.removeAttribute('hidden'); t.setAttribute('aria-expanded','true'); }
      }
    }
  });

  /* ---- scroll-spy for in-page section nav ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if (links.length) {
    var map = {};
    links.forEach(function (l) {
      var id = l.getAttribute('href').slice(1);
      var s = document.getElementById(id);
      if (s) map[id] = l;
    });
    var spy = function () {
      var y = window.scrollY + 90, cur = null;
      Object.keys(map).forEach(function (id) {
        var s = document.getElementById(id);
        if (s && s.offsetTop <= y) cur = id;
      });
      links.forEach(function (l) { l.classList.remove('active'); });
      if (cur && map[cur]) map[cur].classList.add('active');
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();
    links.forEach(function (l) {
      l.addEventListener('click', function () {
        if (window.innerWidth <= 980) document.body.classList.remove('nav-open');
      });
    });
  }
})();
