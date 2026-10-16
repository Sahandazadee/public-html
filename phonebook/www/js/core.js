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
  pinHash: null, pinSalt: null, bio: false, autoBackup: true, secure: true,
  lastAutoBackup: '', fails: 0, lockUntil: 0,
};
PB.settings = Object.assign({}, PB.defaults);
PB.loadSettings = function () {
  try { Object.assign(PB.settings, JSON.parse(localStorage.getItem(SKEY) || '{}')); } catch (e) {}
};
PB.saveSettings = function () {
  try { localStorage.setItem(SKEY, JSON.stringify(PB.settings)); } catch (e) {}
};

/* ---------- data ---------- */
PB.data = { entries: [], folders: [], cats: [], v: 1 };
PB.load = function () {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (d && Array.isArray(d.entries)) PB.data = Object.assign({ folders: [], cats: [] }, d);
  } catch (e) {}
  if (!PB.data.cats || !PB.data.cats.length) PB.data.cats = PB.DEFAULT_CATS.map((c) => Object.assign({}, c));
  PB.purgeOldTrash();
};
let saveTimer = null;
PB.save = function () {
  try { localStorage.setItem(KEY, JSON.stringify(PB.data)); } catch (e) { PB.toast && PB.toast('Storage full!'); }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => PB.autoBackup && PB.autoBackup(), 4000);
  PB.emit && PB.emit('data');
};
PB.purgeOldTrash = function () {
  const lim = Date.now() - 30 * 864e5;
  PB.data.entries = PB.data.entries.filter((e) => !e.deletedAt || e.deletedAt > lim);
};

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

/* ---------- hashing (PIN) ---------- */
PB.hashPin = async function (pin, salt) {
  const buf = new TextEncoder().encode(salt + ':' + pin);
  let h = await crypto.subtle.digest('SHA-256', buf);
  for (let i = 0; i < 2000; i++) h = await crypto.subtle.digest('SHA-256', h);
  return Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

/* ---------- native bridge (graceful fallback in browser) ---------- */
PB.native = function () {
  const c = window.Capacitor;
  if (!(c && c.isNativePlatform && c.isNativePlatform())) return null;
  if (c.Plugins && c.Plugins.NativeBridge) return c.Plugins.NativeBridge;
  if (!PB._np && c.registerPlugin) PB._np = c.registerPlugin('NativeBridge');
  return PB._np || null;
};
