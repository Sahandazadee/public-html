/* ui.js — DOM helpers, overlays (with Android back-button support), toast, confirm, theme. */
'use strict';
(function () {
  PB.h = function (tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style') el.style.cssText = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v; // only used with trusted static strings
      else if (k === 'value') el.value = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(Infinity).forEach((c) => { if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(c)); });
    return el;
  };
  const h = PB.h;
  PB.$ = (s, r) => (r || document).querySelector(s);

  /* ---------- toast ---------- */
  let tt;
  PB.toast = function (msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 2600);
  };

  /* ---------- overlay stack ----------
     One history "sentinel" entry exists while any overlay is open, so Android Back closes the top
     overlay instead of leaving the app. Programmatic closes never touch history unless the last
     overlay closes (then the sentinel is removed with one history.back()). */
  const stack = [];
  let sentinel = false, expected = 0;
  function pushSentinel() { history.pushState({ pb: 1 }, ''); sentinel = true; }
  PB.openOverlay = function (el, onClose) {
    document.getElementById('overlays').append(el);
    stack.push({ el, onClose });
    if (!sentinel && !expected) pushSentinel();
    return el;
  };
  function removeEntry(el) {
    const i = stack.findIndex((s) => s.el === el);
    if (i < 0) return false;
    const [s] = stack.splice(i, 1);
    s.el.remove(); s.onClose && s.onClose();
    return true;
  }
  function dropSentinelIfIdle() {
    if (!stack.length && sentinel) { sentinel = false; expected++; history.back(); }
  }
  PB.closeOverlay = function (el) {
    el = el || (stack.length && stack[stack.length - 1].el);
    if (!el || !removeEntry(el)) return;
    dropSentinelIfIdle();
  };
  window.addEventListener('popstate', () => {
    if (expected > 0) { expected--; if (stack.length && !sentinel && !expected) pushSentinel(); return; }
    sentinel = false; // the user's Back consumed it
    const s = stack.pop();
    if (s) { s.el.remove(); s.onClose && s.onClose(); }
    if (stack.length) pushSentinel();
  });
  PB.closeAll = function () {
    while (stack.length) { const s = stack.pop(); s.el.remove(); }
    dropSentinelIfIdle();
  };

  /* full screen page with gradient bar */
  PB.page = function (title, opts) {
    opts = opts || {};
    const body = h('div', { class: 'scroll' });
    const right = h('div', { style: 'display:flex;gap:6px' }, opts.actions || []);
    const el = h('div', { class: 'ov' },
      h('div', { class: 'bar' },
        h('button', { class: 'ibtn', 'aria-label': 'Back', onclick: () => PB.closeOverlay(el) }, '‹'),
        h('h2', null, title), right),
      body);
    PB.openOverlay(el, opts.onClose);
    return { el, body, bar: PB.$('h2', el), right };
  };

  /* bottom sheet */
  PB.sheet = function (title, content) {
    const sheet = h('div', { class: 'sheet' }, h('div', { class: 'grab' }), title ? h('h3', null, title) : null, content);
    const wrap = h('div', { class: 'ov sheetwrap', onclick: (e) => { if (e.target === wrap) PB.closeOverlay(wrap); } }, sheet);
    PB.openOverlay(wrap);
    return { el: wrap, sheet, close: () => PB.closeOverlay(wrap) };
  };

  /* confirm dialog → Promise<boolean> */
  PB.confirm = function (title, msg, okText, danger) {
    return new Promise((res) => {
      let done = false;
      const fin = (v) => { if (done) return; done = true; PB.closeOverlay(wrap); res(v); };
      const wrap = h('div', { class: 'ov sheetwrap', style: 'justify-content:center;z-index:60', onclick: (e) => e.target === wrap && fin(false) },
        h('div', { class: 'dlg' }, h('h3', null, title), msg ? h('p', null, msg) : null,
          h('div', { class: 'btns' },
            h('button', { class: 'btn ghost', onclick: () => fin(false) }, 'Cancel'),
            h('button', { class: 'btn' + (danger ? ' danger' : ''), onclick: () => fin(true) }, okText || 'OK'))));
      PB.openOverlay(wrap, () => fin(false));
    });
  };
  /* text prompt → Promise<string|null> */
  PB.prompt = function (title, value, placeholder, type) {
    return new Promise((res) => {
      let done = false;
      const inp = h('input', { class: 'inp', type: type || 'text', autocomplete: 'off', dir: 'auto', value: value || '', placeholder: placeholder || '', style: 'border:1.5px solid var(--line);border-radius:14px;margin-bottom:14px' });
      const fin = (v) => { if (done) return; done = true; PB.closeOverlay(wrap); res(v); };
      const wrap = h('div', { class: 'ov sheetwrap', style: 'justify-content:center;z-index:60', onclick: (e) => e.target === wrap && fin(null) },
        h('div', { class: 'dlg' }, h('h3', null, title), inp,
          h('div', { class: 'btns' },
            h('button', { class: 'btn ghost', onclick: () => fin(null) }, 'Cancel'),
            h('button', { class: 'btn', onclick: () => fin(inp.value.trim()) }, 'Save'))));
      PB.openOverlay(wrap, () => fin(null));
      setTimeout(() => inp.focus(), 150);
    });
  };

  /* ---------- theme ---------- */
  PB.applyTheme = function () {
    const s = PB.settings, r = document.documentElement;
    const dark = s.theme === 'dark' || (s.theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    r.dataset.eff = dark ? 'dark' : 'light';
    const a = PB.ACCENTS[s.accent] || PB.ACCENTS.violet;
    r.style.setProperty('--accent', a);
    const alt = { violet: '#00c8be', ocean: '#7c4dff', teal: '#2979ff', rose: '#ff9100', amber: '#ff4081', forest: '#00b8d4' }[s.accent] || '#00c8be';
    r.style.setProperty('--accent2', alt);
    const n = PB.native && PB.native();
    n && n.setSecure && n.setSecure({ enabled: s.secure !== false }).catch(() => {});
  };
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => PB.applyTheme());

  /* misc */
  PB.avatar = (e, big) => h('div', { class: 'av' + (big ? ' lg' : ''), style: 'background:linear-gradient(135deg,hsl(' + PB.hue(PB.displayName(e)) + ',70%,58%),hsl(' + ((PB.hue(PB.displayName(e)) + 40) % 360) + ',75%,48%))' }, PB.initials(e));
  PB.copy = async function (t) {
    try { await navigator.clipboard.writeText(t); PB.toast('Copied'); } catch (e) {
      const ta = h('textarea', { style: 'position:fixed;opacity:0' }, t); document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove(); PB.toast('Copied');
    }
  };
  PB.busy = () => { PB.busyUntil = Date.now() + 90000; }; // grace for pickers / share sheet (skip auto-lock)
})();
