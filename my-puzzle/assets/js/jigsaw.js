// MY PUZZLE — 3D jigsaw engine.
// The table is the XY plane and Z points up toward the camera. Every piece is an extruded
// jigsaw outline whose top face samples the photo at the piece's home position, so pieces
// fit together exactly. Pieces that touch correctly join into a "cluster" and move together.

import * as THREE from '../vendor/three.module.min.js';
import { makeRenderer, esc, getName, mountHeader, addScore, loadStore, saveStore, formatTime, confetti, openModal, closeModal, toast } from './common.js';
import { PUZZLES, LEVELS, imageUrl, thumbUrl } from './puzzles.js';

const nameReady = mountHeader('puzzles');

const params = new URLSearchParams(location.search);
const puzzle = PUZZLES.find(p => p.id === params.get('id')) || PUZZLES[0];
document.title = `${puzzle.title} — MY PUZZLE`;
document.getElementById('p-title').textContent = puzzle.title;
document.getElementById('p-sub').textContent = puzzle.place;

const BOARD_W = 15, BOARD_H = 10; // 3:2, matches the photos

// ---------- Renderer, scene, camera ----------
const canvas = document.getElementById('jig-canvas');
const renderer = makeRenderer(THREE.WebGLRenderer, { canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b1824);
scene.fog = new THREE.Fog(0x1b1824, 60, 140);
const camera = new THREE.PerspectiveCamera(34, 1, 1, 400);
const TILT = 0.30; // radians the camera leans back from straight-down: gives the 3D feel
const view = { target: new THREE.Vector3(), dist: 30, fitDist: 30, fitTarget: new THREE.Vector3() };
function updateCamera() {
  camera.position.set(view.target.x, view.target.y - view.dist * Math.sin(TILT), view.dist * Math.cos(TILT));
  camera.lookAt(view.target);
}

scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3150, 1.35));
const sun = new THREE.DirectionalLight(0xfff3e6, 2.1);
sun.position.set(-8, -10, 26);
sun.castShadow = true;
// Smaller shadow map on phones keeps the frame rate smooth.
const small = Math.min(screen.width, screen.height) < 600;
sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
sun.shadow.bias = -0.0015;
sun.shadow.normalBias = 0.06;
scene.add(sun, sun.target);

// ---------- Level selection ----------
let level = LEVELS.find(l => l.pieces === Number(params.get('n')));
// Wait for the player's name (asked on the first visit) before showing the level picker.
nameReady.then(() => { if (level) start(); else pickLevel(); });

function pickLevel() {
  const best = (loadStore().puzzles[puzzle.id]) || {};
  const opts = LEVELS.map(l => {
    const rec = best[l.pieces];
    const sub = rec ? `Best ${formatTime(rec.best)}` : `${l.cols} × ${l.rows} grid`;
    return `<div class="level-opt" data-n="${l.pieces}"><div><b>${l.pieces} pieces · ${l.label}</b><small>${sub}</small></div><span class="pts">+${l.points} pts</span></div>`;
  }).join('');
  const m = openModal(`
    <img class="cover" src="${thumbUrl(puzzle.id)}" alt="${puzzle.title}">
    <h2>${puzzle.title}</h2><p>${puzzle.place}</p>
    <div class="level-list">${opts}</div>`);
  document.querySelector('.modal-backdrop').onclick = null; // a level must be chosen
  m.querySelectorAll('.level-opt').forEach(el => el.onclick = () => {
    level = LEVELS.find(l => l.pieces === Number(el.dataset.n));
    history.replaceState(null, '', `?id=${puzzle.id}&n=${level.pieces}`);
    closeModal();
    start();
  });
}

// ---------- Jigsaw outline ----------
// One tab as four cubic Bézier segments in (t, n): t runs along the edge 0→1, n points out of the piece.
const TAB = [
  [[0, 0], [0.20, 0.00], [0.42, -0.04], [0.40, 0.05]],
  [[0.40, 0.05], [0.37, 0.13], [0.30, 0.27], [0.50, 0.27]],
  [[0.50, 0.27], [0.70, 0.27], [0.63, 0.13], [0.60, 0.05]],
  [[0.60, 0.05], [0.58, -0.04], [0.80, 0.00], [1, 0]],
];
function randomEdge() {
  return { sign: Math.random() < 0.5 ? 1 : -1, shift: (Math.random() - 0.5) * 0.10, h: 0.88 + Math.random() * 0.22, w: 0.9 + Math.random() * 0.18 };
}
// Canonical tab points (t, n) for one edge, with its random variation applied.
function tabPoints(e) {
  const out = [];
  const v = new THREE.Vector2();
  TAB.forEach((seg, si) => {
    const P = seg.map(([t, n], i) => {
      const fixed = (si === 0 && i === 0) || (si === 3 && i === 3);
      return fixed ? new THREE.Vector2(t, n) : new THREE.Vector2(0.5 + (t - 0.5) * e.w + e.shift, n * e.h);
    });
    const curve = new THREE.CubicBezierCurve(P[0], P[1], P[2], P[3]);
    for (let k = si === 0 ? 0 : 1; k <= 10; k++) out.push(curve.getPoint(k / 10, v.clone()));
  });
  return out;
}
// Points along an edge from A to B in world space; normal = direction the tab grows when sign = +1.
function edgeWorld(e, A, B, normal, s) {
  if (!e) return [A.clone(), B.clone()];
  const dir = B.clone().sub(A);
  return e.pts.map(p => A.clone().addScaledVector(dir, p.x).addScaledVector(normal, p.y * s * e.sign));
}

// ---------- Game state ----------
let pieces = [], clusters = [], textures = {}, layout = null, ghost = null;
let placed = 0, moves = 0, timerOn = false, startTime = 0, elapsed = 0, finished = false, topLayer = 0;
const tweens = [];

function start() {
  document.getElementById('loader-text').textContent = 'Loading the picture…';
  new THREE.TextureLoader().load(imageUrl(puzzle.id), (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.photo = tex;
    document.getElementById('preview-img').src = imageUrl(puzzle.id);
    build();
    document.getElementById('loader').classList.add('hide');
  }, undefined, () => {
    document.getElementById('loader-text').textContent = 'The picture could not be loaded. Please check your connection and reload.';
  });
}

function build() {
  const { cols, rows } = level;
  const s = BOARD_W / cols; // piece size in world units
  const X0 = -BOARD_W / 2, Y0 = BOARD_H / 2; // top-left corner of the board

  // Shared edges, so neighbours get exactly the same curve.
  const hE = [], vE = [];
  for (let r = 0; r <= rows; r++) { hE[r] = []; for (let c = 0; c < cols; c++) hE[r][c] = (r === 0 || r === rows) ? null : randomEdge(); }
  for (let r = 0; r < rows; r++) { vE[r] = []; for (let c = 0; c <= cols; c++) vE[r][c] = (c === 0 || c === cols) ? null : randomEdge(); }
  [...hE.flat(), ...vE.flat()].forEach(e => { if (e) e.pts = tabPoints(e); });

  const thick = s * 0.11, bevel = s * 0.028;
  const uvGen = {
    generateTopUV(g, v, a, b, c) {
      return [a, b, c].map(i => new THREE.Vector2((v[i * 3] + BOARD_W / 2) / BOARD_W, (v[i * 3 + 1] + BOARD_H / 2) / BOARD_H));
    },
    generateSideWallUV() { return [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]; },
  };
  const photoMat = new THREE.MeshStandardMaterial({ map: textures.photo, roughness: 0.48, metalness: 0.0 });
  const sideMat = new THREE.MeshStandardMaterial({ color: 0xefe6d6, roughness: 0.85 });

  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const xL = X0 + c * s, xR = xL + s, yT = Y0 - r * s, yB = yT - s;
    const up = new THREE.Vector2(0, 1), right = new THREE.Vector2(1, 0);
    const bottom = edgeWorld(hE[r + 1][c], new THREE.Vector2(xL, yB), new THREE.Vector2(xR, yB), up.clone().negate(), s);
    // bottom edge: a +1 tab on hE[r+1] grows downward into row r+1 … flip so tabs point from row r into r+1
    const rightE = edgeWorld(vE[r][c + 1], new THREE.Vector2(xR, yB), new THREE.Vector2(xR, yT), right, s);
    const top = edgeWorld(hE[r][c], new THREE.Vector2(xL, yT), new THREE.Vector2(xR, yT), up.clone().negate(), s).reverse();
    const left = edgeWorld(vE[r][c], new THREE.Vector2(xL, yB), new THREE.Vector2(xL, yT), right, s).reverse();
    const pts = [...bottom, ...rightE.slice(1), ...top.slice(1), ...left.slice(1, -1)];

    const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts), {
      depth: thick, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel,
      bevelSegments: 2, curveSegments: 1, UVGenerator: uvGen,
    });
    const home = new THREE.Vector2(xL + s / 2, yB + s / 2);
    geo.translate(-home.x, -home.y, bevel);
    const mesh = new THREE.Mesh(geo, [photoMat, sideMat]);
    mesh.castShadow = true; mesh.receiveShadow = true;
    const piece = { mesh, c, r, home, pos: home.clone(), edge: r === 0 || c === 0 || r === rows - 1 || c === cols - 1, index: pieces.length };
    mesh.userData.piece = piece;
    const cl = { pieces: [piece], locked: false, layer: 0 };
    piece.cluster = cl;
    clusters.push(cl);
    pieces.push(piece);
    scene.add(mesh);
  }

  // Table, board tray and faint guide picture.
  const s2 = s;
  layout = computeLayout(s2);
  const table = new THREE.Mesh(new THREE.PlaneGeometry(layout.w * 4, layout.h * 4), new THREE.MeshStandardMaterial({ color: 0x252130, roughness: 0.95 }));
  table.position.z = -0.03; table.receiveShadow = true; scene.add(table);
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(BOARD_W + 0.5, BOARD_H + 0.5), new THREE.MeshStandardMaterial({ color: 0x3a3449, roughness: 0.7 }));
  frame.position.z = -0.015; frame.receiveShadow = true; scene.add(frame);
  const tray = new THREE.Mesh(new THREE.PlaneGeometry(BOARD_W, BOARD_H), new THREE.MeshStandardMaterial({ color: 0x1d1a26, roughness: 0.9 }));
  tray.receiveShadow = true; scene.add(tray);
  ghost = new THREE.Mesh(new THREE.PlaneGeometry(BOARD_W, BOARD_H), new THREE.MeshBasicMaterial({ map: textures.photo, transparent: true, opacity: 0.16, depthWrite: false }));
  ghost.position.z = 0.006; scene.add(ghost);

  const sc = sun.shadow.camera;
  sc.left = -layout.w / 2 - 2; sc.right = layout.w / 2 + 2; sc.top = layout.h / 2 + 2; sc.bottom = -layout.h / 2 - 2;
  sc.near = 1; sc.far = 80; sc.updateProjectionMatrix();

  scatter(false, true);
  fitView(true);
  updateHud();
}

// Size the table so every loose piece has a free slot around the board, matching the screen shape.
function computeLayout(s) {
  const r = canvas.getBoundingClientRect();
  const aspect = Math.max(0.45, Math.min(2.4, r.width / Math.max(1, r.height)));
  const slot = s * 1.42;
  const need = pieces.length;
  let h = BOARD_H + slot * 3;
  for (let tries = 0; tries < 60; tries++) {
    const w = Math.max(BOARD_W + slot * 3, h * aspect);
    const slots = [];
    const nx = Math.floor(w / slot), ny = Math.floor(h / slot);
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const x = -w / 2 + (i + 0.5) * (w / nx), y = -h / 2 + (j + 0.5) * (h / ny);
      if (Math.abs(x) < BOARD_W / 2 + slot * 0.62 && Math.abs(y) < BOARD_H / 2 + slot * 0.62) continue;
      slots.push(new THREE.Vector2(x, y));
    }
    if (slots.length >= need) return { w, h, slots, slot };
    h *= 1.06;
  }
  return null;
}

function rand(a) { return (Math.random() - 0.5) * a; }

// Place every loose single piece on a free slot. `edgesFirst` puts border pieces on the slots nearest the board.
function scatter(edgesFirst, instant) {
  const loose = clusters.filter(cl => !cl.locked && cl.pieces.length === 1).map(cl => cl.pieces[0]);
  const slots = layout.slots.slice();
  const boardDist = (p) => Math.max(Math.abs(p.x) - BOARD_W / 2, Math.abs(p.y) - BOARD_H / 2);
  if (edgesFirst) {
    slots.sort((a, b) => boardDist(a) - boardDist(b));
    loose.sort((a, b) => (b.edge - a.edge) || (Math.random() - 0.5));
  } else {
    for (let i = slots.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [slots[i], slots[j]] = [slots[j], slots[i]]; }
  }
  loose.forEach((p, i) => {
    const sl = slots[i];
    const to = new THREE.Vector3(sl.x + rand(layout.slot * 0.14), sl.y + rand(layout.slot * 0.14), 0);
    setLayer(p.cluster);
    to.z = p.cluster.z;
    p.pos.set(to.x, to.y);
    if (instant) p.mesh.position.copy(to); else tween(p.mesh, to, 0.45 + Math.random() * 0.2);
  });
}

function setLayer(cl) {
  if (cl.locked) { cl.z = 0; return; }
  topLayer++;
  if (topLayer > 220) { // keep the stack low: renumber every loose cluster
    const loose = clusters.filter(c => !c.locked).sort((a, b) => a.layer - b.layer);
    loose.forEach((c, i) => { c.layer = i + 1; c.z = c.layer * 0.003; c.pieces.forEach(p => p.mesh.position.z = c.z); });
    topLayer = loose.length + 1;
  }
  cl.layer = topLayer;
  cl.z = cl.layer * 0.003;
}

function tween(mesh, to, dur = 0.16) {
  const i = tweens.findIndex(t => t.mesh === mesh);
  if (i >= 0) tweens.splice(i, 1);
  tweens.push({ mesh, from: mesh.position.clone(), to: to.clone(), t: 0, dur });
}

// ---------- Camera fit ----------
function fitView(instant) {
  const r = canvas.getBoundingClientRect();
  const aspect = r.width / Math.max(1, r.height);
  const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const w = layout.w + layout.slot * 0.6, h = layout.h + layout.slot * 0.6;
  // extra room for the top bar and the toolbar
  const d = Math.max((h / 2) / tanH, (w / 2) / (tanH * aspect)) * 1.16;
  view.fitDist = d;
  view.fitTarget.set(0, -h * 0.015, 0);
  if (instant) { view.dist = d; view.target.copy(view.fitTarget); updateCamera(); }
  else cameraTween = { fromD: view.dist, toD: d, fromT: view.target.clone(), toT: view.fitTarget.clone(), t: 0, dur: 0.6 };
}
let cameraTween = null;

// ---------- Pointer input ----------
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const pointers = new Map();
let drag = null, pan = null, pinch = null;

function setNdc(x, y) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
}
function worldAt(x, y) {
  setNdc(x, y);
  const p = new THREE.Vector3();
  return raycaster.ray.intersectPlane(plane, p) ? p : null;
}

canvas.addEventListener('pointerdown', (ev) => {
  if (!layout || finished) return;
  canvas.setPointerCapture(ev.pointerId);
  pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  if (pointers.size === 2) {
    if (drag) dropDrag();
    pan = null;
    const [a, b] = [...pointers.values()];
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), dist: view.dist };
    return;
  }
  setNdc(ev.clientX, ev.clientY);
  const loose = pieces.filter(p => !p.cluster.locked).map(p => p.mesh);
  const hit = raycaster.intersectObjects(loose, false)[0];
  if (hit) {
    const cl = hit.object.userData.piece.cluster;
    drag = { cl, last: worldAt(ev.clientX, ev.clientY), id: ev.pointerId };
    const lift = topLayer * 0.003 + 0.45;
    cl.pieces.forEach(p => { tween(p.mesh, new THREE.Vector3(p.mesh.position.x, p.mesh.position.y, lift), 0.12); });
    canvas.classList.add('dragging');
    if (!timerOn && !finished) { timerOn = true; startTime = performance.now() - elapsed * 1000; }
  } else {
    pan = { x: ev.clientX, y: ev.clientY, id: ev.pointerId };
  }
});

canvas.addEventListener('pointermove', (ev) => {
  if (!pointers.has(ev.pointerId)) return;
  pointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
  if (pinch && pointers.size >= 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    zoomTo(pinch.dist * pinch.d / Math.max(20, d), (a.x + b.x) / 2, (a.y + b.y) / 2);
    return;
  }
  if (drag && ev.pointerId === drag.id) {
    const p = worldAt(ev.clientX, ev.clientY);
    if (!p || !drag.last) return;
    let dx = p.x - drag.last.x, dy = p.y - drag.last.y;
    // keep pieces on the table
    const lim = { x: layout.w / 2 + layout.slot, y: layout.h / 2 + layout.slot };
    for (const pc of drag.cl.pieces) {
      const nx = pc.mesh.position.x + dx, ny = pc.mesh.position.y + dy;
      if (Math.abs(nx) > lim.x * 1.4) dx = 0;
      if (Math.abs(ny) > lim.y * 1.4) dy = 0;
    }
    drag.cl.pieces.forEach(pc => {
      pc.mesh.position.x += dx; pc.mesh.position.y += dy;
      pc.pos.x += dx; pc.pos.y += dy;
      const tw = tweens.find(t => t.mesh === pc.mesh);
      if (tw) { tw.to.x += dx; tw.to.y += dy; tw.from.x += dx; tw.from.y += dy; }
    });
    drag.last = p;
  } else if (pan && ev.pointerId === pan.id) {
    const a = worldAt(pan.x, pan.y), b = worldAt(ev.clientX, ev.clientY);
    if (a && b) { view.target.x += a.x - b.x; view.target.y += a.y - b.y; clampTarget(); updateCamera(); }
    pan.x = ev.clientX; pan.y = ev.clientY;
  }
});

function endPointer(ev) {
  pointers.delete(ev.pointerId);
  if (pointers.size < 2) pinch = null;
  if (drag && ev.pointerId === drag.id) dropDrag();
  if (pan && ev.pointerId === pan.id) pan = null;
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);

canvas.addEventListener('wheel', (ev) => {
  ev.preventDefault();
  zoomTo(view.dist * Math.exp(ev.deltaY * 0.0012), ev.clientX, ev.clientY);
}, { passive: false });

function zoomTo(d, x, y) {
  const before = worldAt(x, y);
  view.dist = THREE.MathUtils.clamp(d, BOARD_W / level.cols * 6, view.fitDist * 1.5);
  updateCamera();
  const after = worldAt(x, y);
  if (before && after) { view.target.x += before.x - after.x; view.target.y += before.y - after.y; clampTarget(); updateCamera(); }
}
function clampTarget() {
  view.target.x = THREE.MathUtils.clamp(view.target.x, -layout.w / 2, layout.w / 2);
  view.target.y = THREE.MathUtils.clamp(view.target.y, -layout.h / 2, layout.h / 2);
}

// ---------- Snapping ----------
function dropDrag() {
  const cl = drag.cl;
  drag = null;
  canvas.classList.remove('dragging');
  moves++;
  const s = BOARD_W / level.cols;
  const tol = s * 0.3;
  const pos = (p) => p.pos.clone();

  // 1) Close to its home on the board? Lock the whole cluster in place.
  for (const p of cl.pieces) {
    if (pos(p).distanceTo(p.home) < tol) {
      lockCluster(cl);
      sound(true);
      return afterDrop();
    }
  }
  // 2) Close to a matching neighbour? Join it (can cascade).
  let current = cl, joined = false;
  for (let guard = 0; guard < 8; guard++) {
    let merged = false;
    outer: for (const p of current.pieces) {
      for (const q of neighbours(p)) {
        if (q.cluster === current) continue;
        const expected = pos(q).add(p.home.clone().sub(q.home));
        if (pos(p).distanceTo(expected) < tol) {
          shiftCluster(current, expected.sub(pos(p)));
          current = mergeClusters(current, q.cluster);
          merged = joined = true;
          break outer;
        }
      }
    }
    if (!merged) break;
  }
  if (current.locked) lockCluster(current);
  else { setLayer(current); settle(current); }
  if (joined) sound(current.locked);
  afterDrop();
}

function neighbours(p) {
  const out = [];
  const { cols, rows } = level;
  const at = (c, r) => pieces[r * cols + c];
  if (p.c > 0) out.push(at(p.c - 1, p.r));
  if (p.c < cols - 1) out.push(at(p.c + 1, p.r));
  if (p.r > 0) out.push(at(p.c, p.r - 1));
  if (p.r < rows - 1) out.push(at(p.c, p.r + 1));
  return out;
}

// Logical positions (p.pos) change at once; meshes glide there with settle().
function shiftCluster(cl, d) { cl.pieces.forEach(p => p.pos.add(d)); }
function settle(cl) { cl.pieces.forEach(p => tween(p.mesh, new THREE.Vector3(p.pos.x, p.pos.y, cl.z), 0.14)); }

function mergeClusters(a, b) {
  const keep = b.locked ? b : (a.pieces.length >= b.pieces.length ? a : b);
  const other = keep === a ? b : a;
  other.pieces.forEach(p => { p.cluster = keep; keep.pieces.push(p); });
  keep.locked = a.locked || b.locked;
  clusters = clusters.filter(c => c !== other);
  return keep;
}

function lockCluster(cl) {
  cl.locked = true;
  cl.z = 0;
  cl.pieces.forEach(p => p.pos.copy(p.home));
  settle(cl);
}

function afterDrop() {
  placed = pieces.filter(p => p.cluster.locked).length;
  updateHud();
  if (placed === pieces.length && !finished) win();
}

// ---------- HUD ----------
const elPlaced = document.getElementById('p-placed');
const elMoves = document.getElementById('p-moves');
const elTime = document.getElementById('p-time');
const elBar = document.getElementById('bar');
function updateHud() {
  elPlaced.textContent = `${placed}/${pieces.length}`;
  elMoves.textContent = moves;
  elBar.style.width = `${(placed / Math.max(1, pieces.length)) * 100}%`;
}

// ---------- Toolbar ----------
const prevEl = document.getElementById('preview');
document.getElementById('t-preview').onclick = (e) => {
  prevEl.classList.toggle('show');
  e.currentTarget.classList.toggle('on', prevEl.classList.contains('show'));
};
prevEl.addEventListener('click', () => prevEl.classList.remove('show'));
document.getElementById('t-ghost').onclick = (e) => {
  if (!ghost) return;
  ghost.visible = !ghost.visible;
  e.currentTarget.classList.toggle('on', ghost.visible);
};
document.getElementById('t-edges').onclick = () => { if (layout && !finished) { scatter(true); toast('Edge pieces moved next to the board.'); } };
document.getElementById('t-scatter').onclick = () => { if (layout && !finished) scatter(false); };
document.getElementById('t-fit').onclick = () => { if (layout) fitView(false); };

// ---------- Sound: a short wooden "tock" made with Web Audio ----------
let soundOn = true;
try { soundOn = localStorage.getItem('mypuzzle:sound') !== 'off'; } catch (e) { /* ignore */ }
const soundBtn = document.getElementById('t-sound');
soundBtn.classList.toggle('on', soundOn);
soundBtn.onclick = () => {
  soundOn = !soundOn;
  soundBtn.classList.toggle('on', soundOn);
  try { localStorage.setItem('mypuzzle:sound', soundOn ? 'on' : 'off'); } catch (e) { /* ignore */ }
};
let audio;
function sound(onBoard) {
  if (!soundOn) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const t = audio.currentTime;
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(onBoard ? 720 : 980, t);
    o.frequency.exponentialRampToValueAtTime(onBoard ? 360 : 520, t + 0.08);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g).connect(audio.destination);
    o.start(t); o.stop(t + 0.13);
  } catch (e) { /* audio not available */ }
}

// ---------- Win ----------
let wave = null;
function win() {
  finished = true;
  timerOn = false;
  ghost.visible = false;
  fitBoard();
  wave = { t: 0 };
  const secs = elapsed;
  const limit = level.pieces * 15;
  const bonus = Math.round(level.points * 0.5 * Math.max(0, 1 - secs / limit));
  const total = level.points + bonus;
  setTimeout(() => {
    addScore(total);
    const store = loadStore();
    store.puzzles[puzzle.id] = store.puzzles[puzzle.id] || {};
    const rec = store.puzzles[puzzle.id][level.pieces] || { solves: 0, best: null };
    rec.solves++; rec.best = rec.best == null ? secs : Math.min(rec.best, secs);
    store.puzzles[puzzle.id][level.pieces] = rec;
    saveStore(store);
    confetti();
    const idx = PUZZLES.indexOf(puzzle);
    const next = PUZZLES[(idx + 1) % PUZZLES.length];
    const credit = puzzle.credit ? `<p class="credit">Photo: ${puzzle.source ? `<a href="${puzzle.source}" target="_blank" rel="noopener">${puzzle.credit}</a>` : puzzle.credit}</p>` : '';
    openModal(`
      <h2>Bravo, ${esc(getName())}!</h2>
      <p>${puzzle.title} is complete · ${level.pieces} pieces</p>
      <div class="stats">
        <div class="stat"><b>${formatTime(secs)}</b><span>Time</span></div>
        <div class="stat"><b>${moves}</b><span>Moves</span></div>
        <div class="stat"><b>+${total.toLocaleString('en-US')}</b><span>Points</span></div>
      </div>
      <div class="actions">
        <a class="btn grad" href="play.html?id=${next.id}">Next: ${next.title}</a>
        <button class="btn" id="m-admire">Admire it</button>
      </div>${credit}`);
    document.getElementById('m-admire').onclick = closeModal;
  }, 1500);
}
function fitBoard() {
  const r = canvas.getBoundingClientRect();
  const aspect = r.width / Math.max(1, r.height);
  const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const d = Math.max((BOARD_H / 2 + 0.6) / tanH, (BOARD_W / 2 + 0.6) / (tanH * aspect)) * 1.12;
  cameraTween = { fromD: view.dist, toD: d, fromT: view.target.clone(), toT: new THREE.Vector3(0, 0, 0), t: 0, dur: 1.2 };
}

// ---------- Resize & loop ----------
function resize() {
  const r = canvas.parentElement.getBoundingClientRect();
  renderer.setSize(r.width, r.height, false);
  camera.aspect = r.width / Math.max(1, r.height);
  camera.updateProjectionMatrix();
  updateCamera();
}
addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i];
    tw.t = Math.min(1, tw.t + dt / tw.dur);
    const e = 1 - Math.pow(1 - tw.t, 3);
    tw.mesh.position.lerpVectors(tw.from, tw.to, e);
    if (tw.t >= 1) tweens.splice(i, 1);
  }
  if (cameraTween) {
    const c = cameraTween;
    c.t = Math.min(1, c.t + dt / c.dur);
    const e = c.t < 0.5 ? 4 * c.t ** 3 : 1 - (-2 * c.t + 2) ** 3 / 2;
    view.dist = THREE.MathUtils.lerp(c.fromD, c.toD, e);
    view.target.lerpVectors(c.fromT, c.toT, e);
    updateCamera();
    if (c.t >= 1) cameraTween = null;
  }
  if (wave) {
    // A ripple runs across the finished picture.
    wave.t += dt;
    let active = false;
    for (const p of pieces) {
      const d = p.home.length() * 0.12;
      const k = wave.t - 0.4 - d;
      const z = k > 0 && k < 0.6 ? Math.sin(k / 0.6 * Math.PI) * 0.35 : 0;
      if (k < 0.6) active = true;
      p.mesh.position.z = z;
    }
    if (!active) wave = null;
  }
  if (timerOn) { elapsed = (performance.now() - startTime) / 1000; elTime.textContent = formatTime(elapsed); }
  renderer.render(scene, camera);
});

// Small hook for automated tests only.
window.__jigTest = {
  // Lock every piece except the first n, so a test can finish the puzzle by hand.
  solveAllBut(n = 1) {
    pieces.slice(n).forEach(p => { p.cluster.locked = true; p.cluster.z = 0; p.pos.copy(p.home); p.mesh.position.set(p.home.x, p.home.y, 0); });
    placed = pieces.filter(p => p.cluster.locked).length; updateHud();
  },
  // Screen pixel of a piece's current spot or of its home.
  screen(i, home) {
    const p = pieces[i], r = canvas.getBoundingClientRect();
    const v = new THREE.Vector3(home ? p.home.x : p.pos.x, home ? p.home.y : p.pos.y, home ? 0 : p.mesh.position.z + 0.1).project(camera);
    return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
  },
};
