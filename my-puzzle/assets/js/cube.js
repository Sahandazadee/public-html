// MY PUZZLE — interactive 10×10 cube.
// Every outer cubie is one instance of a single InstancedMesh (fast: 2 draw calls in total).
// A turn rotates every cubie whose coordinate along the turn axis equals the chosen layer.

import * as THREE from '../vendor/three.module.min.js';
import { makeRenderer, esc, getName, mountHeader, addScore, loadStore, saveStore, toast, formatTime, confetti, openModal, closeModal } from './common.js';

mountHeader('cube');

const N = 10;
const H = (N - 1) / 2;           // centre offset: cubie coordinates run from -4.5 to +4.5
const LEVELS = {
  easy:   { label: 'Easy',   moves: 3,   points: 50 },
  medium: { label: 'Medium', moves: 10,  points: 200 },
  hard:   { label: 'Hard',   moves: 40,  points: 1000 },
  master: { label: 'Master', moves: 200, points: 5000 },
};
// Face colors, keyed by outward normal: +X, -X, +Y, -Y, +Z, -Z
const FACE_COLORS = [0xff3b5c, 0xff8c1a, 0xf7f7f2, 0xffd60a, 0x00c46a, 0x2f6bff];
const AXES = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];

// ---------- Scene ----------
const canvas = document.getElementById('cube-canvas');
const renderer = makeRenderer(THREE.WebGLRenderer, { canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 500);
camera.position.set(17, 14, 22);

scene.add(new THREE.HemisphereLight(0xffffff, 0x8877aa, 1.6));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(10, 18, 14); scene.add(key);
const rim = new THREE.DirectionalLight(0xb9a8ff, 1.0); rim.position.set(-14, -6, -10); scene.add(rim);

// Camera rig: the camera circles the cube freely in every direction (no "poles"),
// so the whole cube can be spun like a ball. q = camera orientation, r = distance.
camera.lookAt(0, 0, 0);
const rig = { q: camera.quaternion.clone(), r: camera.position.length(), fitR: 40, vx: 0, vy: 0 };
const Y_AXIS = new THREE.Vector3(0, 1, 0), X_AXIS = new THREE.Vector3(1, 0, 0);
const tmpQ = new THREE.Quaternion();
function applyRig() {
  camera.position.set(0, 0, rig.r).applyQuaternion(rig.q);
  camera.quaternion.copy(rig.q);
}
// dx, dy in screen pixels: dragging right spins the cube right, dragging down tips it toward you.
function rotateView(dx, dy) {
  const k = 0.0065;
  rig.q.multiply(tmpQ.setFromAxisAngle(Y_AXIS, -dx * k)).multiply(tmpQ.setFromAxisAngle(X_AXIS, -dy * k)).normalize();
  applyRig();
}
function zoomView(factor) {
  rig.r = THREE.MathUtils.clamp(rig.r * factor, N * 1.9, rig.fitR * 2.2);
  applyRig();
}

// ---------- Geometry ----------
function roundedRect(size, r) {
  const s = size / 2, sh = new THREE.Shape();
  sh.moveTo(-s + r, -s); sh.lineTo(s - r, -s); sh.quadraticCurveTo(s, -s, s, -s + r);
  sh.lineTo(s, s - r); sh.quadraticCurveTo(s, s, s - r, s); sh.lineTo(-s + r, s);
  sh.quadraticCurveTo(-s, s, -s, s - r); sh.lineTo(-s, -s + r); sh.quadraticCurveTo(-s, -s, -s + r, -s);
  return sh;
}
const bodyGeo = new THREE.BoxGeometry(0.97, 0.97, 0.97);
const stickerGeo = new THREE.ExtrudeGeometry(roundedRect(0.82, 0.14), {
  depth: 0.02, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 4,
});
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x15131c, roughness: 0.55, metalness: 0.1 });
const stickerMat = new THREE.MeshStandardMaterial({ roughness: 0.28, metalness: 0.0 });

// ---------- State ----------
// cubie = { pos: Vector3, quat: Quaternion }
// sticker = { cubie: index, local: Matrix4 (placement on the cubie), normal: Vector3 (local), face: 0..5 }
const cubies = [], stickers = [];
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
  const idx = [i, j, k];
  if (!idx.some(v => v === 0 || v === N - 1)) continue; // hidden inner cubie
  const ci = cubies.length;
  cubies.push({ pos: new THREE.Vector3(i - H, j - H, k - H), quat: new THREE.Quaternion() });
  for (let a = 0; a < 3; a++) for (const s of [-1, 1]) {
    if (idx[a] !== (s < 0 ? 0 : N - 1)) continue;
    const normal = AXES[a].clone().multiplyScalar(s);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    const local = new THREE.Matrix4().compose(normal.clone().multiplyScalar(0.475), q, new THREE.Vector3(1, 1, 1));
    stickers.push({ cubie: ci, local, normal, face: a * 2 + (s > 0 ? 0 : 1) });
  }
}
const bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, cubies.length);
const stickerMesh = new THREE.InstancedMesh(stickerGeo, stickerMat, stickers.length);
const col = new THREE.Color();
stickers.forEach((s, i) => stickerMesh.setColorAt(i, col.setHex(FACE_COLORS[s.face])));
const cubeGroup = new THREE.Group();
cubeGroup.add(bodies, stickerMesh);
scene.add(cubeGroup);

// ---------- Rendering helpers ----------
const tmpM = new THREE.Matrix4(), tmpM2 = new THREE.Matrix4(), rotM = new THREE.Matrix4();
const ONE = new THREE.Vector3(1, 1, 1);
let anim = null; // { axis, layer, dir, t, dur, affected:Set, user }

function cubieMatrix(ci, out) {
  const c = cubies[ci];
  out.compose(c.pos, c.quat, ONE);
  if (anim && anim.affected.has(ci)) out.premultiply(rotM);
  return out;
}
function syncInstances() {
  for (let i = 0; i < cubies.length; i++) bodies.setMatrixAt(i, cubieMatrix(i, tmpM));
  for (let i = 0; i < stickers.length; i++) {
    const s = stickers[i];
    stickerMesh.setMatrixAt(i, tmpM2.multiplyMatrices(cubieMatrix(s.cubie, tmpM), s.local));
  }
  bodies.instanceMatrix.needsUpdate = true;
  stickerMesh.instanceMatrix.needsUpdate = true;
  bodies.computeBoundingSphere(); stickerMesh.computeBoundingSphere();
}

function layerOf(ci, axis) { return Math.round(cubies[ci].pos.getComponent(axis) + H); }

// Apply a finished quarter turn to the stored state.
function commitMove(m) {
  const q = new THREE.Quaternion().setFromAxisAngle(AXES[m.axis], m.dir * Math.PI / 2);
  for (const ci of m.affected) {
    const c = cubies[ci];
    c.pos.applyQuaternion(q);
    c.pos.set(Math.round(c.pos.x - 0.5) + 0.5, Math.round(c.pos.y - 0.5) + 0.5, Math.round(c.pos.z - 0.5) + 0.5);
    c.quat.premultiply(q).normalize();
  }
}

// Solved = every visible face shows a single color (inner centers may be permuted, which is fine).
function isSolved() {
  const faceColor = {};
  const n = new THREE.Vector3();
  for (const s of stickers) {
    n.copy(s.normal).applyQuaternion(cubies[s.cubie].quat).round();
    const k = `${n.x},${n.y},${n.z}`;
    if (faceColor[k] === undefined) faceColor[k] = s.face;
    else if (faceColor[k] !== s.face) return false;
  }
  return true;
}

// ---------- Move queue ----------
const queue = [];
const history = [];      // every move applied since the solved state (for auto-solve)
const userStack = [];    // user moves only (for undo)
let state = 'idle';      // idle | scrambling | playing | solving
let level = 'easy', activeLevel = null, moves = 0, startTime = 0, elapsed = 0, timerOn = false;

function enqueue(axis, layer, dir, opts = {}) { queue.push({ axis, layer, dir, dur: opts.dur ?? 0.22, kind: opts.kind ?? 'user' }); }

function startNext() {
  const m = queue.shift();
  if (!m) return;
  m.affected = new Set();
  for (let i = 0; i < cubies.length; i++) if (layerOf(i, m.axis) === m.layer) m.affected.add(i);
  m.t = 0;
  anim = m;
}

function finishAnim() {
  const m = anim;
  anim = null;
  commitMove(m);
  if (m.kind !== 'undo') history.push({ axis: m.axis, layer: m.layer, dir: m.dir });
  if (m.kind === 'user') {
    userStack.push({ axis: m.axis, layer: m.layer, dir: m.dir });
    moves++;
    if (state === 'playing' && !timerOn && activeLevel) { timerOn = true; startTime = performance.now() - elapsed * 1000; }
  } else if (m.kind === 'undo') {
    moves++;
  }
  if (queue.length === 0) onQueueEmpty(m.kind);
}

function onQueueEmpty(kind) {
  if (state === 'scrambling') {
    state = 'playing'; setBusy(false);
    toast('Scrambled. Your clock starts with your first turn.');
  } else if (state === 'solving') {
    state = 'idle'; setBusy(false); history.length = 0; userStack.length = 0;
    toast('Solved by replay. Scramble again to earn points.');
  } else if (state === 'playing' && (kind === 'user' || kind === 'undo') && isSolved()) {
    win();
  }
  updateHud();
}

// ---------- Interaction ----------
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let gesture = null; // { x, y, point, cubie, normalAxis, normalSign }

function hitTest(ev) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects([stickerMesh, bodies], false);
  if (!hits.length) return null;
  const h = hits[0];
  const ci = h.object === stickerMesh ? stickers[h.instanceId].cubie : h.instanceId;
  const p = h.point;
  // The face we touched is the axis on which the hit point sits furthest out.
  const a = [Math.abs(p.x), Math.abs(p.y), Math.abs(p.z)];
  const axis = a.indexOf(Math.max(...a));
  return { point: p.clone(), cubie: ci, normalAxis: axis, normalSign: Math.sign(p.getComponent(axis)) };
}

function toScreen(v) {
  const r = canvas.getBoundingClientRect();
  const p = v.clone().project(camera);
  return new THREE.Vector2((p.x + 1) / 2 * r.width, (1 - p.y) / 2 * r.height);
}

// Gestures
// - one finger on a sticker: turn that layer
// - one finger on the background (or any finger in Rotate mode): spin the whole cube
// - two fingers anywhere: spin with the middle point, pinch to zoom
// - mouse wheel: zoom
const pts = new Map();   // pointerId -> last {x, y}
let mode = null;         // 'turn' | 'view' | 'multi'
let pinchD = 0, viewOnly = false;

function centroid() {
  let x = 0, y = 0;
  for (const p of pts.values()) { x += p.x; y += p.y; }
  return { x: x / pts.size, y: y / pts.size };
}
function spread() {
  const [a, b] = [...pts.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
}

canvas.addEventListener('pointerdown', (ev) => {
  canvas.setPointerCapture(ev.pointerId);
  pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  rig.vx = rig.vy = 0;
  if (pts.size >= 2) {
    gesture = null; // a second finger cancels a layer turn that has not happened yet
    mode = 'multi';
    pinchD = spread();
    return;
  }
  const busy = state === 'scrambling' || state === 'solving';
  const hit = (!busy && !viewOnly && ev.button !== 2) ? hitTest(ev) : null;
  if (hit) { mode = 'turn'; gesture = { x: ev.clientX, y: ev.clientY, ...hit, id: ev.pointerId }; }
  else { mode = 'view'; }
});

canvas.addEventListener('pointermove', (ev) => {
  const last = pts.get(ev.pointerId);
  if (!last) return;
  if (mode === 'multi' && pts.size >= 2) {
    const c0 = centroid();
    pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    const c1 = centroid();
    rotateView(c1.x - c0.x, c1.y - c0.y);
    const d = spread();
    if (pinchD > 0 && d > 0) zoomView(pinchD / d);
    pinchD = d;
    return;
  }
  const dx = ev.clientX - last.x, dy = ev.clientY - last.y;
  pts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  if (mode === 'view') {
    rotateView(dx, dy);
    rig.vx = dx; rig.vy = dy; // remembered for a little momentum after release
    return;
  }
  if (mode !== 'turn' || !gesture || ev.pointerId !== gesture.id) return;
  const drag = new THREE.Vector2(ev.clientX - gesture.x, ev.clientY - gesture.y);
  if (drag.length() < 12) return;
  const base = toScreen(gesture.point);
  let best = null;
  for (let a = 0; a < 3; a++) {
    if (a === gesture.normalAxis) continue;
    const sdir = toScreen(gesture.point.clone().add(AXES[a])).sub(base);
    if (sdir.lengthSq() < 1e-6) continue;
    sdir.normalize();
    const d = drag.dot(sdir) / drag.length();
    if (!best || Math.abs(d) > Math.abs(best.d)) best = { a, d };
  }
  if (best) {
    // Dragging along +u turns the layer about r = n × u by +90° (moves the touched point toward +u).
    const n = AXES[gesture.normalAxis].clone().multiplyScalar(gesture.normalSign);
    const u = AXES[best.a].clone().multiplyScalar(Math.sign(best.d));
    const r = new THREE.Vector3().crossVectors(n, u);
    const ra = [Math.abs(r.x), Math.abs(r.y), Math.abs(r.z)];
    const axis = ra.indexOf(Math.max(...ra));
    const dir = Math.sign(r.getComponent(axis));
    enqueue(axis, layerOf(gesture.cubie, axis), dir);
  }
  gesture = null;
});

function endPointer(ev) {
  pts.delete(ev.pointerId);
  if (gesture && gesture.id === ev.pointerId) gesture = null;
  if (pts.size === 1 && mode === 'multi') { mode = 'view'; rig.vx = rig.vy = 0; }
  if (pts.size === 0) { if (mode !== 'view') rig.vx = rig.vy = 0; mode = null; }
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('wheel', (ev) => { ev.preventDefault(); zoomView(Math.exp(ev.deltaY * 0.0012)); }, { passive: false });

// Rotate mode: one finger always spins the whole cube (handy on small phones).
const modeBtn = document.getElementById('b-mode');
modeBtn.addEventListener('click', () => {
  viewOnly = !viewOnly;
  modeBtn.classList.toggle('on', viewOnly);
  toast(viewOnly ? 'Rotate mode: one finger spins the whole cube.' : 'Turn mode: drag a sticker to turn its layer.');
});

// ---------- Controls ----------
const elMoves = document.getElementById('s-moves');
const elTime = document.getElementById('s-time');
const elLevel = document.getElementById('s-level');

function setBusy(b) { document.body.classList.toggle('busy', b); }
function updateHud() {
  elMoves.textContent = moves;
  elLevel.textContent = activeLevel ? LEVELS[activeLevel].label : '—';
}

document.querySelectorAll('#levels button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('#levels button').forEach(x => x.classList.toggle('on', x === b));
  level = b.dataset.level;
}));

function resetSolved() {
  queue.length = 0; anim = null;
  // Rebuild the original coordinates in creation order.
  cubies.forEach(c => c.quat.identity());
  let ci = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
    if (![i, j, k].some(v => v === 0 || v === N - 1)) continue;
    cubies[ci++].pos.set(i - H, j - H, k - H);
  }
  history.length = 0; userStack.length = 0;
  moves = 0; elapsed = 0; timerOn = false; activeLevel = null; state = 'idle';
  setBusy(false); updateHud(); elTime.textContent = '00:00';
  syncInstances();
}

document.getElementById('b-scramble').addEventListener('click', () => {
  resetSolved();
  const L = LEVELS[level];
  activeLevel = level; state = 'scrambling'; setBusy(true);
  const dur = L.moves > 50 ? 0.03 : L.moves > 10 ? 0.07 : 0.16;
  let last = null;
  for (let i = 0; i < L.moves; i++) {
    let m;
    do {
      m = { axis: (Math.random() * 3) | 0, layer: (Math.random() * N) | 0, dir: Math.random() < 0.5 ? 1 : -1 };
    } while (last && last.axis === m.axis && last.layer === m.layer); // never undo the previous scramble move
    last = m;
    enqueue(m.axis, m.layer, m.dir, { dur, kind: 'scramble' });
  }
  updateHud();
});

document.getElementById('b-undo').addEventListener('click', () => {
  if (state !== 'playing' || anim || queue.length) return;
  const m = userStack.pop();
  if (!m) { toast('Nothing to undo.'); return; }
  history.pop(); // the inverse cancels it, so drop it from the replay history too
  enqueue(m.axis, m.layer, -m.dir, { kind: 'undo' });
});

document.getElementById('b-solve').addEventListener('click', () => {
  if (anim || queue.length) return;
  if (!history.length) { toast('The cube is already solved.'); return; }
  state = 'solving'; setBusy(true); timerOn = false; activeLevel = null;
  const seq = history.slice().reverse();
  const dur = seq.length > 60 ? 0.035 : seq.length > 15 ? 0.08 : 0.18;
  seq.forEach(m => enqueue(m.axis, m.layer, -m.dir, { dur, kind: 'solve' }));
  updateHud();
});

document.getElementById('b-reset').addEventListener('click', () => { resetSolved(); toast('Cube reset.'); });

function win() {
  timerOn = false;
  const L = LEVELS[activeLevel];
  const secs = elapsed;
  // Speed bonus: up to +50% when solved fast, fading to 0 at 30 s per scramble move (min 2 min).
  const limit = Math.max(120, L.moves * 30);
  const bonus = Math.round(L.points * 0.5 * Math.max(0, 1 - secs / limit));
  const total = L.points + bonus;
  addScore(total);
  const store = loadStore();
  const rec = store.cube[activeLevel] || { solves: 0, best: null };
  rec.solves++; rec.best = rec.best == null ? secs : Math.min(rec.best, secs);
  store.cube[activeLevel] = rec; saveStore(store);
  confetti();
  const levelLabel = L.label;
  activeLevel = null; state = 'idle'; history.length = 0; userStack.length = 0;
  openModal(`
    <h2>Perfect match, ${esc(getName())}!</h2>
    <p>${levelLabel} cube solved. Every face is a single color.</p>
    <div class="stats">
      <div class="stat"><b>${formatTime(secs)}</b><span>Time</span></div>
      <div class="stat"><b>${moves}</b><span>Moves</span></div>
      <div class="stat"><b>+${total.toLocaleString('en-US')}</b><span>Points</span></div>
    </div>
    <p style="margin:-8px 0 18px;font-size:13px">Best ${levelLabel}: ${formatTime(rec.best)} · ${rec.solves} solve${rec.solves > 1 ? 's' : ''}</p>
    <div class="actions">
      <button class="btn grad" id="m-again">Scramble again</button>
      <a class="btn" href="./">Play a puzzle</a>
    </div>`);
  document.getElementById('m-again').onclick = () => { closeModal(); document.getElementById('b-scramble').click(); };
}

// ---------- Resize & loop ----------
function resize() {
  const r = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / r.height;
  // Free area for the cube: below the stats (on portrait screens) and above the button bar.
  const hud = document.querySelector('.hud').getBoundingClientRect();
  const bar = document.querySelector('.controls').getBoundingClientRect();
  const top = camera.aspect < 1 ? hud.bottom - r.top + 8 : 8;
  const bottom = bar.top - r.top - 8;
  const freeH = Math.max(120, bottom - top);
  // Shift the picture so the cube sits in the middle of that free area.
  const shift = (top + bottom) / 2 - r.height / 2;
  camera.setViewOffset(r.width, r.height, 0, -shift, r.width, r.height);
  camera.updateProjectionMatrix();
  // Distance that keeps the whole cube (about 1.75 × N wide from any angle) inside the free area.
  const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const D = N * 1.75;
  const fit = Math.max(D * r.height / (2 * tanH * freeH), D / (2 * tanH * camera.aspect)) * 1.04;
  const zoomed = rig.r / rig.fitR;
  rig.fitR = fit;
  rig.r = resize.done ? fit * zoomed : fit;
  resize.done = true;
  applyRig();
}
addEventListener('resize', resize);
addEventListener('orientationchange', () => setTimeout(resize, 250));
resize();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(resize); // button bar size changes once the font loads
syncInstances();
updateHud();

// Small hook used by automated tests only.
window.__cubeTest = { enqueue, isSolved, scrambleMoves: () => history.slice(), rig: () => ({ r: rig.r, q: rig.q.toArray().map(v => +v.toFixed(3)) }) };

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (!anim && queue.length) startNext();
  if (anim) {
    anim.t = Math.min(1, anim.t + dt / anim.dur);
    const e = anim.t < 0.5 ? 4 * anim.t ** 3 : 1 - (-2 * anim.t + 2) ** 3 / 2; // ease in-out
    rotM.makeRotationAxis(AXES[anim.axis], anim.dir * e * Math.PI / 2);
    if (anim.t >= 1) { finishAnim(); updateHud(); }
    syncInstances();
  }
  if (timerOn) {
    elapsed = (performance.now() - startTime) / 1000;
    elTime.textContent = formatTime(elapsed);
  }
  // Momentum: the cube keeps spinning briefly after a flick, then slows down.
  if (!mode && (Math.abs(rig.vx) > 0.05 || Math.abs(rig.vy) > 0.05)) {
    rotateView(rig.vx, rig.vy);
    rig.vx *= 0.92; rig.vy *= 0.92;
  }
  renderer.render(scene, camera);
});
