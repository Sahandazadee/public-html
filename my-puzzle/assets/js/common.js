// MY PUZZLE — shared header, score store, toast, confetti and helpers.

const STORE_KEY = 'mypuzzle:v1';

// Read saved progress. Storage can be blocked (private mode), so always fall back safely.
export function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return Object.assign({ score: 0, puzzles: {}, cube: {} }, JSON.parse(raw));
  } catch (e) { /* ignore */ }
  return { score: 0, puzzles: {}, cube: {} };
}

export function saveStore(store) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
}

export function addScore(points) {
  const store = loadStore();
  store.score = (store.score || 0) + points;
  saveStore(store);
  renderScore(store.score, true);
  return store;
}

function renderScore(value, bump) {
  const el = document.querySelector('.score-pill');
  if (!el) return;
  el.querySelector('b').textContent = Number(value).toLocaleString('en-US');
  if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
}

// Creates the 3D renderer. If the phone or browser has no WebGL, show a clear message instead of a blank page.
export function makeRenderer(Renderer, opts) {
  try {
    return new Renderer(opts);
  } catch (e) {
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;inset:0;display:grid;place-items:center;padding:24px;text-align:center;z-index:200;background:var(--bg);color:var(--text)';
    box.innerHTML = '<div><h2>3D is not available</h2><p style="color:var(--muted)">This browser could not start 3D graphics. Please update it, or try Chrome or Safari.</p><a class="btn" href="./">Back to MY PUZZLE</a></div>';
    document.body.appendChild(box);
    throw e;
  }
}

// Escape text typed by the player before it goes into HTML.
export function esc(text) {
  return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Player name: kept in the saved store. `memoryName` is the fallback when storage is blocked.
let memoryName = '';
export function getName() { return loadStore().name || memoryName || 'Player'; }
function hasName() { return !!(loadStore().name || memoryName); }
function setName(name) {
  memoryName = name;
  const store = loadStore(); store.name = name; saveStore(store);
  const el = document.querySelector('.pname');
  if (el) el.textContent = name;
  const av = document.querySelector('.avatar');
  if (av) av.textContent = [...name][0].toUpperCase();
}

// Asks for the name. First time it cannot be skipped; later it is an "edit" dialog.
export function askName(required) {
  return new Promise((resolve) => {
    const current = hasName() ? getName() : '';
    const m = openModal(`
      <div class="welcome-mark"><i></i><i></i><i></i><i></i></div>
      <h2>${required ? 'Welcome to MY PUZZLE' : 'Change your name'}</h2>
      <p>${required ? 'What should we call you?' : 'This name appears at the top of every page.'}</p>
      <form class="name-form" autocomplete="off">
        <input id="name-input" type="text" maxlength="20" placeholder="Your name" value="${esc(current)}" dir="auto"
               autocomplete="nickname" autocapitalize="words" enterkeyhint="go" required aria-label="Your name">
        <button class="btn grad" type="submit">${required ? 'Let’s play' : 'Save'}</button>
      </form>`);
    const bd = document.querySelector('.modal-backdrop');
    if (required) bd.onclick = null; // must enter a name first
    const input = m.querySelector('#name-input');
    setTimeout(() => input.focus(), 60);
    m.querySelector('form').onsubmit = (e) => {
      e.preventDefault();
      const name = input.value.replace(/\s+/g, ' ').trim().slice(0, 20);
      if (!name) { input.focus(); return; }
      setName(name);
      closeModal();
      resolve(name);
    };
  });
}

// Header is the same on every page; `active` highlights the current nav link.
// Returns a promise that resolves once the player has a name.
export function mountHeader(active) {
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="brand" href="./" aria-label="MY PUZZLE home">
      <span class="brand-mark"><i></i><i></i><i></i><i></i></span>
      <span class="brand-text">MY PUZZLE</span>
    </a>
    <nav class="nav">
      <a href="./" class="${active === 'puzzles' ? 'active' : ''}">Puzzles</a>
      <a href="cube.html" class="${active === 'cube' ? 'active' : ''}">Cube<span class="long"> 10×10</span></a>
    </nav>
    <button class="score-pill" type="button" title="Your name and total score. Tap to change your name.">
      <span class="avatar">?</span><span class="pname" dir="auto"></span>
      <span class="sep"></span>
      <span class="star">★</span><b>0</b>
    </button>`;
  document.body.prepend(header);
  renderScore(loadStore().score, false);
  header.querySelector('.score-pill').onclick = () => {
    if (!document.querySelector('.modal-backdrop.open')) askName(false);
  };
  if (hasName()) { setName(getName()); return Promise.resolve(getName()); }
  return askName(true);
}

let toastTimer;
export function toast(msg, ms = 2200) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

export function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  const mm = String(m).padStart(2, '0'), ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

// Lightweight 2D confetti burst, drawn on a full-screen canvas.
export function confetti(duration = 3200) {
  let canvas = document.getElementById('confetti');
  if (!canvas) { canvas = document.createElement('canvas'); canvas.id = 'confetti'; document.body.appendChild(canvas); }
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = canvas.width = innerWidth * dpr, H = canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
  const colors = ['#ff4d6d', '#ff9a3c', '#ffd23f', '#7b5cff', '#00c2a8', '#3fa7ff', '#ffffff'];
  const parts = Array.from({ length: 220 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.3, y: H * 0.55,
    vx: (Math.random() - 0.5) * 26 * dpr, vy: (-Math.random() * 26 - 10) * dpr,
    w: (6 + Math.random() * 8) * dpr, h: (4 + Math.random() * 6) * dpr,
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
    c: colors[(Math.random() * colors.length) | 0],
  }));
  const start = performance.now();
  (function frame(now) {
    const t = now - start;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.7 * dpr; p.vx *= 0.985; p.vy *= 0.985;
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, 1 - t / duration);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
      ctx.restore();
    }
    if (t < duration) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
  })(start);
}

// Opens a simple modal. `html` is trusted markup built by our own code.
export function openModal(html) {
  let bd = document.querySelector('.modal-backdrop');
  if (!bd) { bd = document.createElement('div'); bd.className = 'modal-backdrop'; document.body.appendChild(bd); }
  bd.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  bd.classList.add('open');
  bd.onclick = (e) => { if (e.target === bd) closeModal(); };
  return bd.querySelector('.modal');
}
export function closeModal() {
  const bd = document.querySelector('.modal-backdrop');
  if (bd) bd.classList.remove('open');
}
