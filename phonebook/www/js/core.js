/* core.js — data model, storage, text normalisation. No network, no dependencies. */
'use strict';
const PB = (window.PB = window.PB || {});

PB.DEFAULT_CATS = [
  { id: 'c_phones', name: 'Phones', color: '#7c4dff' },
  { id: 'c_addr', name: 'Addresses', color: '#00bfa5' },
  { id: 'c_work', name: 'Work', color: '#2979ff' },
  { id: 'c_family', name: 'Family', color: '#ff4081' },
  { id: 'c_friends', name: 'Friends', color: '#ff9100' },
  { id: 'c_emerg', name: 'Emergency', color: '#ff1744' },
  { id: 'c_other', name: 'Other', color: '#78909c' },
];
PB.COLORS = ['#7c4dff', '#2979ff', '#00bfa5', '#00c853', '#ff9100', '#ff4081', '#ff1744', '#78909c', '#8d6e63', '#26c6da'];
PB.ICONS = ['📁', '👨‍👩‍👧', '💼', '🏠', '🚑', '🎓', '🛒', '🔧', '✈️', '❤️', '⭐', '🔒'];
PB.ACCENTS = { violet: '#7c4dff', ocean: '#2979ff', teal: '#00bfa5', rose: '#ff4081', amber: '#ff9100', forest: '#00c853' };

const KEY = 'pb_data_v1';
const SKEY = 'pb_settings_v1';

PB.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/* ---------- text normalisation (Persian/Arabic aware) ---------- */
PB.norm = function (s) {
  if (s == null) return '';
  return String(s)
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x0660))
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ً-ٰٟ‌ـ]/g, '') // harakat, tatweel, ZWNJ
    .toLowerCase()
    .trim();
};
PB.digits = (s) => PB.norm(s).replace(/[^0-9+]/g, '');

/* ---------- settings ---------- */
PB.defaults = {
  theme: 'auto', accent: 'violet', view: 'list', sort: 'az',
  pinHash: null, pinSalt: null, /* legacy v1 only */
  salt: null, iter: 0, wdek: null, bio: false, bioBlob: null,
  wbk: null, bsalt: null, biter: 0,
  autoBackup: true, secure: true, lastAutoBackup: '', fails: 0, lockUntil: 0,
};
PB.settings = Object.assign({}, PB.defaults);
PB.loadSettings = function () {
  try { Object.assign(PB.settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch (e) {}
};
PB.saveSettings = function () {
  try { localStorage.setItem(SKEY, JSON.stringify(PB.settings)); } catch (e) {}
};

/* ---------- crypto: AES-256-GCM, keys from PBKDF2-SHA256 (600k rounds) ---------- */
const te = new TextEncoder(), td = new TextDecoder();
PB.te = te; PB.td = td;
PB.b64e = (u8) => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
PB.b64d = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
PB.ITER = 600000;
PB.rand = (n) => crypto.getRandomValues(new Uint8Array(n));
PB.kdf = async function (secret, salt, iter) {
  const base = await crypto.subtle.importKey('raw', te.encode(String(secret).normalize('NFKC')), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, base, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
};
PB.rawKey = (raw) => crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt']);
PB.seal = async function (key, bytes) {
  const iv = PB.rand(12);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, bytes));
  const out = new Uint8Array(12 + ct.length); out.set(iv); out.set(ct, 12); return out;
};
PB.open = async (key, blob) => new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: blob.subarray(0, 12) }, key, blob.subarray(12)));

/* Key hierarchy:  PIN --PBKDF2--> KEK --wraps--> DEK (random, encrypts all data)
                   fingerprint --Android Keystore--> also wraps DEK (settings.bioBlob)
                   backup password --PBKDF2--> BK (wrapped by DEK as settings.wbk) encrypts backup files */
PB.dek = null; PB.bk = null;
PB.setPin = async function (pin) {
  const S = PB.settings;
  if (!PB.dek) PB.dek = await PB.rawKey(PB.rand(32));
  const salt = PB.rand(16), kek = await PB.kdf(pin, salt, PB.ITER);
  const raw = new Uint8Array(await crypto.subtle.exportKey('raw', PB.dek));
  S.salt = PB.b64e(salt); S.iter = PB.ITER; S.wdek = PB.b64e(await PB.seal(kek, raw));
  S.pinHash = null; S.pinSalt = null; S.fails = 0; S.lockUntil = 0;
  PB.saveSettings();
};
PB.unwrapPin = async function (pin) { // → CryptoKey or null
  const S = PB.settings;
  try {
    const kek = await PB.kdf(pin, PB.b64d(S.salt), S.iter || PB.ITER);
    return await PB.rawKey(await PB.open(kek, PB.b64d(S.wdek)));
  } catch (e) { return null; }
};
PB.hasKeys = () => !!PB.settings.wdek;
PB.isLegacy = () => !PB.settings.wdek && !!PB.settings.pinHash;
PB.hashPin = async function (pin, salt) { // legacy v1 verification only
  let h = await crypto.subtle.digest('SHA-256', te.encode(salt + ':' + pin));
  for (let i = 0; i < 2000; i++) h = await crypto.subtle.digest('SHA-256', h);
  return Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, '0')).join('');
};
PB.verifyOrUnwrap = async function (pin) { // sets PB.dek on success
  if (PB.isLegacy()) {
    if ((await PB.hashPin(pin, PB.settings.pinSalt)) !== PB.settings.pinHash) return false;
    PB.legacyMigrate = true; PB.dek = null; PB.legacyPin = pin; return true;
  }
  const k = await PB.unwrapPin(pin);
  if (!k) return false;
  PB.dek = k; return true;
};

/* ---------- data (encrypted at rest) ---------- */
const KEY1 = 'pb_data_v1', KEY2 = 'pb_data_v2';
PB.data = { entries: [], folders: [], cats: [], v: 1 };
const emptyData = () => ({ entries: [], folders: [], cats: PB.DEFAULT_CATS.map((c) => Object.assign({}, c)), v: 1 });
PB.load = async function () {
  let d = null;
  if (PB.legacyMigrate) { // upgrade from the unencrypted v1 build
    try { d = JSON.parse(localStorage.getItem(KEY1) || 'null'); } catch (e) {}
    PB.dek = await PB.rawKey(PB.rand(32));
    await PB.setPin(PB.legacyPin); PB.legacyPin = null; PB.legacyMigrate = false;
    PB.data = (d && Array.isArray(d.entries)) ? Object.assign({ folders: [], cats: [] }, d) : emptyData();
    if (!PB.data.cats.length) PB.data.cats = emptyData().cats;
    await PB.persistNow();
    localStorage.removeItem(KEY1);
  } else {
    const blob = localStorage.getItem(KEY2);
    if (blob) {
      try { d = JSON.parse(td.decode(await PB.open(PB.dek, PB.b64d(blob)))); }
      catch (e) { throw new Error('Data could not be decrypted'); }
    }
    PB.data = d && Array.isArray(d.entries) ? Object.assign({ folders: [], cats: [] }, d) : emptyData();
    if (!PB.data.cats.length) PB.data.cats = emptyData().cats;
  }
  PB.bk = null;
  if (PB.settings.wbk) { try { PB.bk = await PB.rawKey(await PB.open(PB.dek, PB.b64d(PB.settings.wbk))); } catch (e) {} }
  PB.purgeOldTrash();
};
let writing = null, again = false;
PB.persistNow = function () {
  if (!PB.dek) return Promise.resolve();
  if (writing) { again = true; return writing; }
  writing = (async () => {
    try {
      do {
        again = false;
        const blob = await PB.seal(PB.dek, te.encode(JSON.stringify(PB.data)));
        localStorage.setItem(KEY2, PB.b64e(blob));
      } while (again);
    } catch (e) { PB.toast && PB.toast('Could not save! Storage full?'); }
    finally { writing = null; }
  })();
  return writing;
};
PB.flush = async () => { await PB.persistNow(); if (writing) await writing; };
let saveTimer = null;
PB.save = function () {
  PB.persistNow();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => PB.autoBackup && PB.autoBackup(), 4000);
  PB.emit && PB.emit('data');
};
PB.purgeOldTrash = function () {
  const lim = Date.now() - 30 * 864e5;
  PB.data.entries = PB.data.entries.filter((e) => !e.deletedAt || e.deletedAt > lim);
};
PB.wipeMemory = function () { PB.dek = null; PB.bk = null; PB.data = { entries: [], folders: [], cats: [], v: 1 }; };

/* tiny event bus */
const listeners = {};
PB.on = (n, f) => ((listeners[n] = listeners[n] || []).push(f));
PB.emit = (n, a) => (listeners[n] || []).forEach((f) => f(a));

PB.newEntry = (type) => ({
  id: PB.uid(), type: type || 'contact', first: '', last: '', company: '', jobTitle: '',
  phones: [], emails: [], addresses: [], website: '', birthday: '', notes: '',
  title: '', text: '', categoryId: '', folderId: '', fav: false,
  created: Date.now(), updated: Date.now(), deletedAt: null,
});

PB.displayName = function (e) {
  if (e.type === 'note') return e.title || firstLine(e.text) || '(Untitled note)';
  const n = [e.first, e.last].filter(Boolean).join(' ').trim();
  return n || e.company || (e.phones[0] && e.phones[0].value) || (e.emails[0] && e.emails[0].value) || '(No name)';
};
function firstLine(t) { return (t || '').split('\n')[0].slice(0, 40); }
PB.sortKey = (e) => PB.norm(e.type === 'note' ? PB.displayName(e) : (e.last || e.first || e.company || PB.displayName(e)) + ' ' + (e.first || ''));
PB.initials = function (e) {
  if (e.type === 'note') return '✎';
  const a = (e.first || '').trim(), b = (e.last || '').trim();
  const g = (s) => (s ? Array.from(s)[0] : '');
  const r = (g(a) + g(b)).toUpperCase();
  return r || g(PB.displayName(e)).toUpperCase() || '?';
};
PB.hue = function (s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
PB.cat = (id) => PB.data.cats.find((c) => c.id === id);
PB.folder = (id) => PB.data.folders.find((f) => f.id === id);

PB.searchText = function (e) {
  const parts = [e.first, e.last, e.company, e.jobTitle, e.website, e.birthday, e.notes, e.title, e.text];
  e.phones.forEach((p) => parts.push(p.value, p.label));
  e.emails.forEach((p) => parts.push(p.value, p.label));
  e.addresses.forEach((p) => parts.push(p.value, p.label));
  const c = PB.cat(e.categoryId), f = PB.folder(e.folderId);
  if (c) parts.push(c.name);
  if (f) parts.push(f.name);
  return PB.norm(parts.filter(Boolean).join(' \n ')) + ' ' + PB.digits(e.phones.map((p) => p.value).join(' '));
};

/* ---------- native bridge (graceful fallback in browser) ---------- */
PB.native = function () {
  const c = window.Capacitor;
  if (!(c && c.isNativePlatform && c.isNativePlatform())) return null;
  if (c.Plugins && c.Plugins.NativeBridge) return c.Plugins.NativeBridge;
  if (!PB._np && c.registerPlugin) PB._np = c.registerPlugin('NativeBridge');
  return PB._np || null;
};
