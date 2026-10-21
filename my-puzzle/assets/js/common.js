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

// Header is the same on every page; `active` highlights the current nav link.
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
      <a href="cube.html" class="${active === 'cube' ? 'active' : ''}">Cube 10×10</a>
    </nav>
    <div class="score-pill" title="Total score">
      <span class="star">★</span><b>0</b><small>pts</small>
    </div>`;
  document.body.prepend(header);
  renderScore(loadStore().score, false);
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
