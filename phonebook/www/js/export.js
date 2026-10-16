/* export.js — backup/export (JSON, TXT, CSV, VCF, PDF, JPG), import (JSON, VCF, CSV), save & share. */
'use strict';
(function () {
  const enc = new TextEncoder();
  const stamp = () => {
    const d = new Date(), p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes());
  };
  PB.stamp = stamp;
  const live = () => PB.data.entries.filter((e) => !e.deletedAt);
  PB.liveEntries = live;

  function toB64(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  const MIME = { json: 'application/json', txt: 'text/plain', csv: 'text/csv', vcf: 'text/x-vcard', pdf: 'application/pdf', jpg: 'image/jpeg' };

  /* ---------- save / share ---------- */
  PB.saveOut = async function (name, bytes) {
    const ext = name.split('.').pop().toLowerCase();
    const n = PB.native();
    if (n) {
      const r = await n.saveFile({ name, mime: MIME[ext] || 'application/octet-stream', base64: toB64(bytes) });
      return r.path;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([bytes], { type: MIME[ext] }));
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    return 'Downloads/' + name;
  };
  PB.shareOut = async function (opts) {
    const n = PB.native();
    if (n) {
      const o = { title: opts.title || 'Share', text: opts.text || undefined };
      if (opts.name && opts.bytes) { o.name = opts.name; o.mime = MIME[opts.name.split('.').pop()] || 'text/plain'; o.base64 = toB64(opts.bytes); }
      return n.share(o);
    }
    if (navigator.share) {
      try { return await navigator.share({ title: opts.title, text: opts.text }); } catch (e) { return; }
    }
    if (opts.text) { await (navigator.clipboard && navigator.clipboard.writeText(opts.text)); PB.toast('Copied to clipboard'); }
  };

  /* ---------- text builders ---------- */
  const lab = (p) => (p.label ? p.label + ': ' : '');
  PB.entryToText = function (e) {
    const L = [];
    if (e.type === 'note') {
      L.push('📝 ' + PB.displayName(e));
      if (e.text) L.push(e.text);
    } else {
      L.push(PB.displayName(e));
      if (e.company || e.jobTitle) L.push([e.jobTitle, e.company].filter(Boolean).join(' @ '));
      e.phones.forEach((p) => L.push('☎ ' + lab(p) + p.value));
      e.emails.forEach((p) => L.push('✉ ' + lab(p) + p.value));
      e.addresses.forEach((p) => L.push('📍 ' + lab(p) + p.value));
      if (e.website) L.push('🌐 ' + e.website);
      if (e.birthday) L.push('🎂 ' + e.birthday);
      if (e.notes) L.push('📝 ' + e.notes);
    }
    const c = PB.cat(e.categoryId), f = PB.folder(e.folderId);
    const meta = [c && 'Category: ' + c.name, f && 'Folder: ' + f.name].filter(Boolean).join(' | ');
    if (meta) L.push(meta);
    return L.join('\n');
  };
  PB.buildTXT = (list) =>
    'PhoneBook — ' + list.length + ' item(s) — ' + new Date().toLocaleString() + '\n' + '='.repeat(40) + '\n\n' +
    list.slice().sort((a, b) => PB.sortKey(a).localeCompare(PB.sortKey(b))).map(PB.entryToText).join('\n\n' + '-'.repeat(30) + '\n\n') + '\n';

  const csvCell = (v) => {
    v = String(v == null ? '' : v);
    return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  };
  const CSV_HEAD = ['Type', 'First Name', 'Last Name', 'Company', 'Job Title', 'Phones', 'Emails', 'Addresses', 'Website', 'Birthday', 'Notes', 'Note Title', 'Note Text', 'Category', 'Folder', 'Favorite'];
  const joinL = (arr) => arr.map((p) => (p.label ? p.label + ': ' : '') + p.value).join(' | ');
  PB.buildCSV = function (list) {
    const rows = [CSV_HEAD.map(csvCell).join(',')];
    list.forEach((e) => {
      const c = PB.cat(e.categoryId), f = PB.folder(e.folderId);
      rows.push([e.type, e.first, e.last, e.company, e.jobTitle, joinL(e.phones), joinL(e.emails), joinL(e.addresses), e.website, e.birthday,
        e.notes, e.title, e.text, c ? c.name : '', f ? f.name : '', e.fav ? 'yes' : ''].map(csvCell).join(','));
    });
    return '\ufeff' + rows.join('\r\n') + '\r\n';
  };

  const vEsc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\;').replace(/,/g, '\\,');
  const TYPEMAP = { mobile: 'CELL', cell: 'CELL', home: 'HOME', work: 'WORK', fax: 'FAX', main: 'PREF' };
  PB.buildVCF = function (list) {
    const out = [];
    list.filter((e) => e.type === 'contact').forEach((e) => {
      out.push('BEGIN:VCARD', 'VERSION:3.0');
      out.push('N:' + vEsc(e.last) + ';' + vEsc(e.first) + ';;;', 'FN:' + vEsc(PB.displayName(e)));
      if (e.company) out.push('ORG:' + vEsc(e.company));
      if (e.jobTitle) out.push('TITLE:' + vEsc(e.jobTitle));
      e.phones.forEach((p) => out.push('TEL;TYPE=' + (TYPEMAP[(p.label || '').toLowerCase()] || 'VOICE') + ':' + p.value));
      e.emails.forEach((p) => out.push('EMAIL;TYPE=' + (/work/i.test(p.label) ? 'WORK' : 'HOME') + ':' + p.value));
      e.addresses.forEach((p) => out.push('ADR;TYPE=' + (/work/i.test(p.label) ? 'WORK' : 'HOME') + ':;;' + vEsc(p.value) + ';;;;'));
      if (e.website) out.push('URL:' + e.website);
      if (e.birthday) out.push('BDAY:' + e.birthday);
      if (e.notes) out.push('NOTE:' + vEsc(e.notes));
      const c = PB.cat(e.categoryId); if (c) out.push('CATEGORIES:' + vEsc(c.name));
      out.push('END:VCARD');
    });
    return out.join('\r\n') + '\r\n';
  };
  /* ---------- encrypted backups (AES-256-GCM, key from the backup password) ---------- */
  PB.envelope = async function (plainText, key, saltB64, iter) {
    const ct = await PB.seal(key, PB.te.encode(plainText));
    return JSON.stringify({ app: 'PhoneBookEnc', v: 1, cipher: 'AES-256-GCM', kdf: 'PBKDF2-SHA256', iter, salt: saltB64, data: PB.b64e(ct) });
  };
  PB.buildEncryptedJSON = () => {
    if (!PB.bk) throw new Error('Set a backup password first');
    return PB.envelope(PB.buildJSON(), PB.bk, PB.settings.bsalt, PB.settings.biter);
  };
  PB.decryptEnvelope = async function (text, password) {
    const j = JSON.parse(text);
    if (j.app !== 'PhoneBookEnc') throw new Error('Not an encrypted PhoneBook file');
    try {
      const key = await PB.kdf(password, PB.b64d(j.salt), j.iter);
      return PB.td.decode(await PB.open(key, PB.b64d(j.data)));
    } catch (e) { throw new Error('Wrong password or damaged file'); }
  };
  /* Set / change the backup password. Resolves true when set. */
  PB.setupBackupPassword = async function (changing) {
    const ok = await PB.confirm(changing ? 'Change backup password?' : 'Backup password',
      'Your backup files are encrypted with this password.\n\n• Use at least 8 characters (a phrase is best).\n• If you forget it, backups can NOT be opened — nobody can recover them, not even the developer.\n• Write it down and keep it somewhere safe.' + (changing ? '\n• Older backups still need the OLD password.' : ''), 'Continue');
    if (!ok) return false;
    for (;;) {
      const a = await PB.prompt('Backup password', '', 'At least 8 characters', 'password');
      if (a == null) return false;
      if (a.length < 8) { PB.toast('Too short — use 8 or more characters'); continue; }
      const b = await PB.prompt('Repeat backup password', '', 'Type it again', 'password');
      if (b == null) return false;
      if (a !== b) { PB.toast('Passwords do not match'); continue; }
      const salt = PB.rand(16), key = await PB.kdf(a, salt, PB.ITER);
      const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
      PB.settings.bsalt = PB.b64e(salt); PB.settings.biter = PB.ITER;
      PB.settings.wbk = PB.b64e(await PB.seal(PB.dek, raw));
      PB.saveSettings(); PB.bk = key;
      PB.toast('Backup password set');
      PB.autoBackup && PB.autoBackup();
      return true;
    }
  };

  PB.buildJSON = () => JSON.stringify({ app: 'PhoneBook', version: 1, exported: new Date().toISOString(), data: PB.data }, null, 1);

  /* ---------- PDF / JPG (canvas → JPEG; Persian shaping handled by the WebView) ---------- */
  const rtl = (s) => /[֐-ࣿ]/.test(s);
  function renderPages(list) {
    const W = 1240, H = 1754, M = 90, LH = 40;
    const pages = [];
    let cv, g, y;
    const FONT = (b, sz) => (b ? 'bold ' : '') + sz + 'px sans-serif';
    const newPage = () => {
      cv = document.createElement('canvas'); cv.width = W; cv.height = H; g = cv.getContext('2d');
      g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
      const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#6a3de8'); gr.addColorStop(1, '#00c8be');
      g.fillStyle = gr; g.fillRect(0, 0, W, 14);
      g.fillStyle = '#6a3de8'; g.font = FONT(true, 30); g.textAlign = 'left'; g.direction = 'ltr';
      g.fillText('PhoneBook', M, 62);
      g.fillStyle = '#888'; g.font = FONT(false, 22); g.textAlign = 'right';
      g.fillText(new Date().toLocaleDateString() + ' · page ' + (pages.length + 1), W - M, 62);
      y = 120; pages.push(cv);
    };
    const wrap = (txt, font, maxW) => {
      g.font = font; const out = [];
      String(txt).split('\n').forEach((para) => {
        let line = '';
        para.split(/(\s+)/).forEach((w) => {
          if (g.measureText(line + w).width > maxW && line) { out.push(line.trim()); line = w.trimStart(); } else line += w;
        });
        out.push(line.trim());
      });
      return out;
    };
    const put = (txt, font, color, indent) => {
      wrap(txt, font, W - 2 * M - indent).forEach((ln) => {
        if (y + LH > H - M) newPage();
        g.font = font; g.fillStyle = color; g.direction = rtl(ln) ? 'rtl' : 'ltr';
        if (rtl(ln)) { g.textAlign = 'right'; g.fillText(ln, W - M, y); } else { g.textAlign = 'left'; g.fillText(ln, M + indent, y); }
        y += LH;
      });
    };
    newPage();
    list.slice().sort((a, b) => PB.sortKey(a).localeCompare(PB.sortKey(b))).forEach((e) => {
      const est = 3 + e.phones.length + e.emails.length + e.addresses.length;
      if (y + est * LH > H - M && y > 200) newPage();
      y += 14;
      g.fillStyle = 'hsl(' + PB.hue(PB.displayName(e)) + ',65%,55%)'; g.fillRect(M - 22, y - 30, 8, LH + 4);
      put(PB.displayName(e), FONT(true, 30), '#1a1a2e', 0);
      const sub = e.type === 'contact' ? [e.jobTitle, e.company].filter(Boolean).join(' @ ') : '';
      if (sub) put(sub, FONT(false, 24), '#666', 0);
      if (e.type === 'note') put(e.text, FONT(false, 25), '#333', 0);
      e.phones.forEach((p) => put('☎  ' + lab(p) + p.value, FONT(false, 26), '#222', 0));
      e.emails.forEach((p) => put('✉  ' + lab(p) + p.value, FONT(false, 26), '#222', 0));
      e.addresses.forEach((p) => put('⌂  ' + lab(p) + p.value, FONT(false, 25), '#222', 0));
      if (e.notes) put('✎  ' + e.notes, FONT(false, 23), '#555', 0);
      const c = PB.cat(e.categoryId), f = PB.folder(e.folderId);
      const meta = [c && c.name, f && f.name].filter(Boolean).join('  ·  ');
      if (meta) put(meta, FONT(false, 21), '#999', 0);
      y += 10;
      g.strokeStyle = '#eee'; g.beginPath(); g.moveTo(M, y - 14); g.lineTo(W - M, y - 14); g.stroke();
    });
    return pages;
  }
  const dataUrlToBytes = (u) => Uint8Array.from(atob(u.split(',')[1]), (c) => c.charCodeAt(0));
  PB.buildJPGs = (list) => renderPages(list).map((cv) => dataUrlToBytes(cv.toDataURL('image/jpeg', 0.88)));
  PB.buildPDF = function (list) {
    const jpgs = PB.buildJPGs(list), parts = [], offs = [];
    let len = 0;
    const push = (x) => { const b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); len += b.length; };
    const obj = (n, body) => { offs[n] = len; push(n + ' 0 obj\n'); push(body); push('\nendobj\n'); };
    push('%PDF-1.4\n%âãÏÓ\n');
    const n = jpgs.length;
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Count ' + n + ' /Kids [' + jpgs.map((_, i) => 3 + i * 3 + ' 0 R').join(' ') + '] >>');
    jpgs.forEach((j, i) => {
      const p = 3 + i * 3, c = p + 1, im = p + 2;
      obj(p, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ' + im + ' 0 R >> >> /Contents ' + c + ' 0 R >>');
      const cs = 'q 595 0 0 842 0 0 cm /Im0 Do Q';
      obj(c, '<< /Length ' + cs.length + ' >>\nstream\n' + cs + '\nendstream');
      offs[im] = len; push(im + ' 0 obj\n<< /Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + j.length + ' >>\nstream\n');
      push(j); push('\nendstream\nendobj\n');
    });
    const total = 3 + n * 3, xref = len;
    let x = 'xref\n0 ' + total + '\n0000000000 65535 f \n';
    for (let i = 1; i < total; i++) x += String(offs[i]).padStart(10, '0') + ' 00000 n \n';
    push(x + 'trailer\n<< /Size ' + total + ' /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF');
    const out = new Uint8Array(len); let o = 0;
    parts.forEach((b) => { out.set(b, o); o += b.length; });
    return out;
  };

  /* ---------- export entry point ---------- */
  PB.exportAs = async function (fmt, list) {
    list = list || live();
    if (!list.length) { PB.toast('Nothing to export'); return []; }
    const base = 'PhoneBook-' + stamp();
    const paths = [];
    if (fmt === 'json') {
      if (!PB.bk && !(await PB.setupBackupPassword(false))) return [];
      paths.push(await PB.saveOut(base + '-ENCRYPTED.json', enc.encode(await PB.buildEncryptedJSON())));
    }
    else if (fmt === 'txt') paths.push(await PB.saveOut(base + '.txt', enc.encode(PB.buildTXT(list))));
    else if (fmt === 'csv') paths.push(await PB.saveOut(base + '.csv', enc.encode(PB.buildCSV(list))));
    else if (fmt === 'vcf') paths.push(await PB.saveOut(base + '.vcf', enc.encode(PB.buildVCF(list))));
    else if (fmt === 'pdf') paths.push(await PB.saveOut(base + '.pdf', PB.buildPDF(list)));
    else if (fmt === 'jpg') { const js = PB.buildJPGs(list); for (let i = 0; i < js.length; i++) paths.push(await PB.saveOut(base + '-p' + (i + 1) + '.jpg', js[i])); }
    return paths;
  };

  /* ---------- auto backup (native only; survives uninstall in Documents/PhoneBook) ---------- */
  PB.autoBackup = async function () {
    if (!PB.settings.autoBackup || !PB.native() || !PB.bk || !PB.data.entries.length) return;
    try {
      const d = new Date(), p = (n) => String(n).padStart(2, '0');
      const day = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
      await PB.saveOut('PhoneBook-auto-' + day + '-ENCRYPTED.json', enc.encode(await PB.buildEncryptedJSON()));
      PB.settings.lastAutoBackup = d.toLocaleString(); PB.saveSettings(); PB.emit('backupstatus');
    } catch (e) { /* ignore */ }
  };

  /* ---------- import ---------- */
  PB.mergeJSON = function (text, mode) {
    const j = JSON.parse(text);
    const d = j.data || j;
    if (!d || !Array.isArray(d.entries)) throw new Error('Not a PhoneBook backup');
    if (mode === 'replace') {
      PB.data = { entries: d.entries, folders: d.folders || [], cats: d.cats && d.cats.length ? d.cats : PB.DEFAULT_CATS.slice(), v: 1 };
      PB.save(); return d.entries.length;
    }
    const byId = new Map(PB.data.entries.map((e) => [e.id, e]));
    let n = 0;
    d.entries.forEach((e) => {
      const cur = byId.get(e.id);
      if (!cur) { PB.data.entries.push(e); n++; } else if ((e.updated || 0) > (cur.updated || 0)) { Object.assign(cur, e); n++; }
    });
    (d.folders || []).forEach((f) => { if (!PB.folder(f.id)) PB.data.folders.push(f); });
    (d.cats || []).forEach((c) => { if (!PB.cat(c.id)) PB.data.cats.push(c); });
    PB.save(); return n;
  };

  function qp(s) {
    const bytes = [];
    s = s.replace(/=\r?\n/g, '');
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '=' && /^[0-9A-Fa-f]{2}$/.test(s.substr(i + 1, 2))) { bytes.push(parseInt(s.substr(i + 1, 2), 16)); i += 2; }
      else bytes.push(s.charCodeAt(i) & 255);
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  }
  const vUn = (s) => s.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');
  const lbl = (t) => (/cell|mobile/i.test(t) ? 'Mobile' : /home/i.test(t) ? 'Home' : /work/i.test(t) ? 'Work' : /fax/i.test(t) ? 'Fax' : /other/i.test(t) ? 'Other' : 'Phone');
  PB.parseVCF = function (text) {
    text = text.replace(/\r\n[ \t]/g, '').replace(/\r?\n(?==)/g, '');
    const lines = text.split(/\r?\n/), out = [];
    let cur = null;
    lines.forEach((raw) => {
      const line = raw.trim();
      if (/^BEGIN:VCARD/i.test(line)) { cur = PB.newEntry('contact'); return; }
      if (/^END:VCARD/i.test(line)) { if (cur) out.push(cur); cur = null; return; }
      if (!cur) return;
      const i = line.indexOf(':'); if (i < 0) return;
      const head = line.slice(0, i), key = head.split(';')[0].toUpperCase();
      let val = line.slice(i + 1);
      if (/ENCODING=QUOTED-PRINTABLE/i.test(head)) val = qp(val);
      const parts = val.split(/(?<!\\);/).map(vUn);
      if (key === 'N') { cur.last = parts[0] || ''; cur.first = [parts[1], parts[2]].filter(Boolean).join(' '); }
      else if (key === 'FN' && !cur.first && !cur.last) { const w = vUn(val).split(' '); cur.first = w.shift() || ''; cur.last = w.join(' '); }
      else if (key === 'ORG') cur.company = parts.filter(Boolean).join(' / ');
      else if (key === 'TITLE') cur.jobTitle = vUn(val);
      else if (key === 'TEL') cur.phones.push({ label: lbl(head), value: val.trim() });
      else if (key === 'EMAIL') cur.emails.push({ label: /work/i.test(head) ? 'Work' : 'Home', value: val.trim() });
      else if (key === 'ADR') cur.addresses.push({ label: /work/i.test(head) ? 'Work' : 'Home', value: parts.filter(Boolean).join(', ') });
      else if (key === 'URL') cur.website = val.trim();
      else if (key === 'BDAY') cur.birthday = val.trim();
      else if (key === 'NOTE') cur.notes = vUn(val);
    });
    return out;
  };

  function parseCSVRows(text) {
    text = text.replace(/^\ufeff/, '');
    const rows = []; let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (c !== '\r') cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((x) => x.trim()));
  }
  const splitL = (s) => String(s || '').split(' | ').map((x) => x.trim()).filter(Boolean).map((x) => {
    const m = x.match(/^([A-Za-z ]{2,12}):\s*(.+)$/); return m ? { label: m[1], value: m[2] } : { label: '', value: x };
  });
  PB.parseCSV = function (text) {
    const rows = parseCSVRows(text); if (rows.length < 2) return [];
    const head = rows[0].map((h) => PB.norm(h));
    const col = (...names) => head.findIndex((h) => names.some((n) => h === n || h.includes(n)));
    const ix = {
      type: col('type'), first: col('first name', 'given name', 'first'), last: col('last name', 'family name', 'last', 'surname'), name: col('name'),
      company: col('company', 'organization'), job: col('job title', 'title'), phones: col('phones', 'phone', 'mobile', 'tel'),
      emails: col('emails', 'email', 'e-mail'), addr: col('addresses', 'address'), web: col('website', 'url'), bday: col('birthday'),
      notes: col('notes'), nt: col('note title'), tx: col('note text'), cat: col('category'), fol: col('folder'), fav: col('favorite'),
    };
    const get = (r, k) => (ix[k] >= 0 ? (r[ix[k]] || '').trim() : '');
    return rows.slice(1).map((r) => {
      const e = PB.newEntry(get(r, 'type') === 'note' ? 'note' : 'contact');
      e.first = get(r, 'first'); e.last = get(r, 'last');
      if (!e.first && !e.last && ix.name >= 0 && ix.name !== ix.first) { const w = get(r, 'name').split(' '); e.first = w.shift() || ''; e.last = w.join(' '); }
      e.company = get(r, 'company'); e.jobTitle = ix.job >= 0 && ix.job !== ix.nt ? get(r, 'job') : '';
      e.phones = splitL(get(r, 'phones')); e.emails = splitL(get(r, 'emails')); e.addresses = splitL(get(r, 'addr'));
      e.website = get(r, 'web'); e.birthday = get(r, 'bday'); e.notes = get(r, 'notes');
      e.title = get(r, 'nt'); e.text = get(r, 'tx'); e.fav = !!get(r, 'fav');
      const cn = get(r, 'cat'); if (cn) { let c = PB.data.cats.find((x) => PB.norm(x.name) === PB.norm(cn)); if (!c) { c = { id: PB.uid(), name: cn, color: PB.COLORS[PB.data.cats.length % PB.COLORS.length] }; PB.data.cats.push(c); } e.categoryId = c.id; }
      const fn = get(r, 'fol'); if (fn) { let f = PB.data.folders.find((x) => PB.norm(x.name) === PB.norm(fn)); if (!f) { f = { id: PB.uid(), name: fn, color: PB.COLORS[PB.data.folders.length % PB.COLORS.length], icon: '📁' }; PB.data.folders.push(f); } e.folderId = f.id; }
      return e;
    }).filter((e) => PB.displayName(e) !== '(No name)' && PB.displayName(e) !== '(Untitled note)');
  };

  PB.importFile = async function (file, mode) {
    let text = await file.text();
    const name = file.name.toLowerCase();
    if (name.endsWith('.json') || text.trim().startsWith('{')) {
      if (/"app"\s*:\s*"PhoneBookEnc"/.test(text)) {
        const pw = await PB.prompt('Backup password', '', 'Password used for this backup', 'password');
        if (pw == null) return { kind: 'json', count: 0, cancelled: true };
        text = await PB.decryptEnvelope(text, pw);
      }
      return { kind: 'json', count: PB.mergeJSON(text, mode || 'merge') };
    }
    let list = name.endsWith('.csv') ? PB.parseCSV(text) : PB.parseVCF(text);
    if (!list.length && /BEGIN:VCARD/i.test(text)) list = PB.parseVCF(text);
    const have = new Set(PB.data.entries.filter((e) => !e.deletedAt).flatMap((e) => e.phones.map((p) => PB.digits(p.value))).filter(Boolean));
    let added = 0, skipped = 0;
    list.forEach((e) => {
      const nums = e.phones.map((p) => PB.digits(p.value)).filter(Boolean);
      if (nums.length && nums.every((n) => have.has(n))) { skipped++; return; }
      nums.forEach((n) => have.add(n)); PB.data.entries.push(e); added++;
    });
    PB.save();
    return { kind: name.endsWith('.csv') ? 'csv' : 'vcf', count: added, skipped };
  };
})();
