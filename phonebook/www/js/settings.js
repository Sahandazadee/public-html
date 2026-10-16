/* settings.js — settings tab, backup/export page, restore, trash, categories, duplicates. */
'use strict';
(function () {
  const h = PB.h;
  const toggle = (on) => h('div', { class: 'toggle' + (on ? ' on' : '') });

  PB.renderSettings = function (box) {
    box.replaceChildren();
    const S = PB.settings, live = PB.data.entries.filter((e) => !e.deletedAt);
    const trash = PB.data.entries.length - live.length;
    const link = (ic, t, sm, f, red) => h('button', { class: 'link' + (red ? ' red' : ''), onclick: f }, h('i', null, ic), h('div', { class: 'grow' }, t, sm ? h('small', null, sm) : null));
    const sw = (ic, t, sm, on, f) => h('button', { class: 'link', onclick: f }, h('i', null, ic), h('div', { class: 'grow' }, t, sm ? h('small', null, sm) : null), toggle(on));
    const sec = (t) => h('div', { class: 'sec' }, t);

    box.append(h('div', { class: 'stat' },
      h('div', null, h('b', null, live.filter((e) => e.type === 'contact').length), h('span', null, 'Contacts')),
      h('div', null, h('b', null, live.filter((e) => e.type === 'note').length), h('span', null, 'Notes')),
      h('div', null, h('b', null, PB.data.folders.length), h('span', null, 'Folders'))));

    box.append(sec('Backup & transfer'), h('div', { class: 'box' },
      link('💾', 'Backup & export', 'JSON · TXT · CSV · VCF · PDF · JPG', PB.openBackup),
      link('📥', 'Restore / import', 'From a backup (.json) or contacts file (.vcf / .csv)', PB.openRestore),
      sw('🛡', 'Automatic backup', S.lastAutoBackup ? 'Last: ' + S.lastAutoBackup : 'Saves to Documents/PhoneBook after every change', S.autoBackup, () => { S.autoBackup = !S.autoBackup; PB.saveSettings(); PB.refresh(); if (S.autoBackup) PB.autoBackup(); })));

    box.append(sec('Organize'), h('div', { class: 'box' },
      link('🏷', 'Categories', PB.data.cats.length + ' categories', PB.openCategories),
      link('👯', 'Find duplicates', 'Same phone number', PB.openDuplicates),
      link('🗑', 'Trash', trash ? trash + ' item(s) · auto-deleted after 30 days' : 'Empty', PB.openTrash)));

    box.append(sec('Security'), h('div', { class: 'box' },
      link('🔑', 'Change PIN', '', async () => { if (await verifyPin()) { const p = await PB.setupPin(false); if (p) { await setPin(p); PB.toast('PIN changed'); } } }),
      sw('🖐', 'Fingerprint unlock', PB.native() ? 'Use biometrics instead of the PIN' : 'Available in the Android app', S.bio, async () => {
        const n = PB.native();
        if (S.bio) { S.bio = false; PB.saveSettings(); PB.refresh(); return; }
        if (!n) { PB.toast('Only on the Android app'); return; }
        const r = await n.biometricAvailable();
        if (!r.available) { PB.toast('No fingerprint enrolled on this phone'); return; }
        try { await n.biometricAuth({ title: 'Confirm fingerprint' }); S.bio = true; PB.saveSettings(); PB.refresh(); } catch (e) { PB.toast('Not enabled'); }
      }),
      sw('📵', 'Hide in Recents / block screenshots', '', S.secure !== false, () => { S.secure = S.secure === false; PB.saveSettings(); PB.applyTheme(); PB.refresh(); }),
      h('button', { class: 'link', onclick: lockDelayPicker }, h('i', null, '⏱'), h('div', { class: 'grow' }, 'Auto-lock', h('small', null, S.lockDelay ? 'After ' + S.lockDelay / 1000 + ' s in background' : 'Immediately when you leave the app')))));

    const themeBtns = h('div', { class: 'seg', style: 'margin:12px 16px' }, [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([k, t]) => h('button', { class: S.theme === k ? 'on' : '', onclick: () => { S.theme = k; PB.saveSettings(); PB.applyTheme(); PB.refresh(); } }, t)));
    const accents = h('div', { class: 'swatches' }, Object.entries(PB.ACCENTS).map(([k, c]) => h('button', { class: 'sw' + (S.accent === k ? ' on' : ''), style: 'background:' + c, 'aria-label': k, onclick: () => { S.accent = k; PB.saveSettings(); PB.applyTheme(); PB.refresh(); } })));
    box.append(sec('Appearance'), h('div', { class: 'box' }, themeBtns, accents));

    box.append(sec('About'), h('div', { class: 'box' },
      h('div', { class: 'fld' }, h('div', { class: 'mini' }, '🔒'), h('div', { class: 'grow' }, h('span', { class: 'v' }, '100% offline'), h('span', { class: 'k' }, 'This app has no internet permission. Your data never leaves this phone unless you share or export it.'))),
      link('⚠️', 'Erase all data', 'Backup files in Documents/PhoneBook are not touched', async () => {
        if (await verifyPin() && await PB.confirm('Erase everything?', 'All contacts, folders and notes inside the app will be deleted.', 'Erase', true)) { PB.data = { entries: [], folders: [], cats: PB.DEFAULT_CATS.map((c) => Object.assign({}, c)), v: 1 }; PB.save(); PB.toast('Erased'); }
      }, true),
      h('div', { style: 'text-align:center;color:var(--muted);font-size:12px;padding:12px' }, 'PhoneBook 1.0.0')));
  };

  async function verifyPin() {
    const r = await PB.pinScreen({ title: 'Enter PIN', sub: 'Confirm it is you', cancel: true,
      verify: async (p) => ((await PB.hashPin(p, PB.settings.pinSalt)) === PB.settings.pinHash ? true : 'Wrong PIN') });
    return r != null;
  }
  async function setPin(p) {
    PB.settings.pinSalt = PB.uid() + PB.uid();
    PB.settings.pinHash = await PB.hashPin(p, PB.settings.pinSalt);
    PB.settings.fails = 0; PB.saveSettings();
  }
  PB.setPin = setPin;
  function lockDelayPicker() {
    const body = h('div'); const s = PB.sheet('Auto-lock', body);
    body.append(h('div', { class: 'box' }, [[0, 'Immediately'], [30000, 'After 30 seconds'], [60000, 'After 1 minute'], [300000, 'After 5 minutes']].map(([v, t]) =>
      h('button', { class: 'link', onclick: () => { PB.settings.lockDelay = v; PB.saveSettings(); s.close(); PB.refresh(); } }, h('div', { class: 'grow' }, t), (PB.settings.lockDelay || 0) === v ? '✓' : ''))));
  }

  /* ---------- backup ---------- */
  PB.openBackup = function () {
    const pg = PB.page('Backup & export');
    const info = h('div', { class: 'box' }, h('div', { class: 'fld' }, h('div', { class: 'mini' }, '📂'), h('div', { class: 'grow' }, h('span', { class: 'v' }, PB.native() ? 'Documents/PhoneBook' : 'Downloads folder'),
      h('span', { class: 'k' }, 'Files saved here stay on your phone even if you uninstall the app. Copy them to a computer over USB or a file manager.'))));
    const fmts = [['json', 'JSON', 'Full backup · can be restored', true], ['txt', 'TXT', 'Readable text file', true], ['csv', 'CSV', 'Opens in Excel / Sheets', true], ['vcf', 'VCF', 'Import into any phonebook', true], ['pdf', 'PDF', 'Printable document', true], ['jpg', 'JPG', 'Image pages', false]];
    const N = PB.liveEntries().length;
    const grid = h('div', { class: 'fmts' }, fmts.map(([k, t, d, canShare]) => h('div', { class: 'fmt' }, h('b', null, t), h('small', null, d),
      h('div', { class: 'two' },
        h('button', { onclick: async (ev) => { const b = ev.currentTarget; b.textContent = '…'; try { await new Promise((r) => setTimeout(r, 30)); const p = await PB.exportAs(k); p.length && PB.toast('Saved → ' + p[0] + (p.length > 1 ? ' (+' + (p.length - 1) + ')' : '')); } catch (e) { PB.toast('Failed: ' + (e.message || e)); } b.textContent = 'Save'; } }, 'Save'),
        canShare ? h('button', { class: 'g', onclick: async () => { try { await shareFormat(k); } catch (e) { PB.toast('Failed: ' + (e.message || e)); } } }, 'Share') : null))));
    pg.body.append(info, h('div', { class: 'sec' }, N + ' item(s) will be exported'), grid);
  };
  async function shareFormat(k) {
    const list = PB.liveEntries(); if (!list.length) { PB.toast('Nothing to export'); return; }
    const enc = new TextEncoder(), base = 'PhoneBook-' + PB.stamp();
    const bytes = k === 'json' ? enc.encode(PB.buildJSON()) : k === 'txt' ? enc.encode(PB.buildTXT(list)) : k === 'csv' ? enc.encode(PB.buildCSV(list)) : k === 'vcf' ? enc.encode(PB.buildVCF(list)) : PB.buildPDF(list);
    PB.busy(); await PB.shareOut({ title: 'PhoneBook backup', name: base + '.' + k, bytes });
  }

  /* ---------- restore / import ---------- */
  PB.openRestore = function () {
    const pg = PB.page('Restore / import');
    let mode = 'merge';
    const file = h('input', { type: 'file', accept: '.json,.vcf,.csv,.txt,application/json,text/vcard,text/x-vcard,text/csv,text/plain', class: 'hide', onchange: async (ev) => {
      const f = ev.target.files[0]; if (!f) return;
      try {
        if (mode === 'replace' && f.name.toLowerCase().endsWith('.json') && !(await PB.confirm('Replace everything?', 'Current data will be replaced by the backup.', 'Replace', true))) return;
        const r = await PB.importFile(f, mode);
        PB.toast(r.kind === 'json' ? 'Restored ' + r.count + ' item(s)' : 'Imported ' + r.count + ' contact(s)' + (r.skipped ? ', skipped ' + r.skipped + ' duplicates' : ''));
        PB.closeOverlay(pg.el);
      } catch (e) { PB.toast('Could not read file: ' + (e.message || e)); }
      file.value = '';
    } });
    const seg = h('div', { class: 'seg' });
    const draw = () => seg.replaceChildren(...[['merge', 'Merge (keep both)'], ['replace', 'Replace all']].map(([k, t]) => h('button', { class: mode === k ? 'on' : '', onclick: () => { mode = k; draw(); } }, t)));
    draw();
    pg.body.append(
      h('div', { class: 'box' }, h('div', { class: 'fld' }, h('div', { class: 'mini' }, 'ℹ️'), h('div', { class: 'grow' }, h('span', { class: 'v' }, 'Choose a file'), h('span', { class: 'k' }, 'Backups are in Documents/PhoneBook (pick the .json file). You can also import .vcf (from your old phonebook: Contacts → Export) or .csv.')))),
      h('div', { class: 'sec' }, 'For JSON backups'), seg,
      h('button', { class: 'btn', onclick: () => { PB.busy(); file.click(); } }, '📂 Choose file…'), file);
  };

  /* ---------- trash ---------- */
  PB.openTrash = function () {
    const box = h('div');
    const pg = PB.page('Trash', { actions: [h('button', { class: 'ibtn', 'aria-label': 'Empty trash', onclick: async () => { if (PB.data.entries.some((e) => e.deletedAt) && await PB.confirm('Empty Trash?', 'This cannot be undone.', 'Delete forever', true)) { PB.data.entries = PB.data.entries.filter((e) => !e.deletedAt); PB.save(); } } }, '🧹')] });
    pg.body.append(box);
    const draw = () => {
      if (!pg.el.isConnected) return;
      const l = PB.data.entries.filter((e) => e.deletedAt).sort((a, b) => b.deletedAt - a.deletedAt);
      box.replaceChildren();
      if (!l.length) { box.append(h('div', { class: 'empty' }, h('span', { class: 'big' }, '✨'), h('b', null, 'Trash is empty'))); return; }
      box.append(h('div', { class: 'sec' }, 'Items are deleted automatically after 30 days'));
      l.forEach((e) => box.append(h('div', { class: 'row-item' }, PB.avatar(e),
        h('div', { class: 'meta' }, h('b', { dir: 'auto' }, PB.displayName(e)), h('span', null, 'Deleted ' + new Date(e.deletedAt).toLocaleDateString() + ' · ' + Math.max(0, 30 - Math.floor((Date.now() - e.deletedAt) / 864e5)) + ' days left')),
        h('button', { class: 'btn sm', onclick: () => { e.deletedAt = null; PB.save(); PB.toast('Restored'); } }, 'Restore'),
        h('button', { class: 'ibtn', style: 'color:var(--danger);background:transparent', 'aria-label': 'Delete forever', onclick: async () => { if (await PB.confirm('Delete forever?', PB.displayName(e), 'Delete', true)) { PB.data.entries = PB.data.entries.filter((x) => x.id !== e.id); PB.save(); } } }, '✕'))));
    };
    PB.on('data', draw); draw();
  };

  /* ---------- categories ---------- */
  PB.openCategories = function () {
    const box = h('div');
    const pg = PB.page('Categories', { actions: [h('button', { class: 'ibtn', 'aria-label': 'Add category', onclick: () => edit() }, '+')] });
    pg.body.append(box);
    const draw = () => {
      if (!pg.el.isConnected) return;
      box.replaceChildren(h('div', { class: 'box' }, PB.data.cats.map((c) => {
        const n = PB.data.entries.filter((e) => e.categoryId === c.id && !e.deletedAt).length;
        return h('button', { class: 'link', onclick: () => edit(c) }, h('i', { style: 'background:' + c.color + '33' }, h('span', { class: 'dot', style: 'background:' + c.color }), ''), h('div', { class: 'grow' }, c.name, h('small', null, n + ' item(s)')), '✏️');
      })));
    };
    function edit(c) {
      const d = c ? Object.assign({}, c) : { id: PB.uid(), name: '', color: PB.COLORS[PB.data.cats.length % PB.COLORS.length] };
      const body = h('div'); const s = PB.sheet(c ? 'Edit category' : 'New category', body);
      const name = h('input', { class: 'inp', dir: 'auto', value: d.name, placeholder: 'Category name', style: 'border:1.5px solid var(--line);border-radius:14px;margin-bottom:10px' });
      const sw = h('div', { class: 'swatches', style: 'padding:6px 0' });
      const dr = () => sw.replaceChildren(...PB.COLORS.map((x) => h('button', { class: 'sw' + (d.color === x ? ' on' : ''), style: 'background:' + x, onclick: () => { d.color = x; dr(); } })));
      dr();
      body.append(name, sw, h('button', { class: 'btn', onclick: () => { const n = name.value.trim(); if (!n) return PB.toast('Enter a name'); d.name = n; if (c) Object.assign(c, d); else PB.data.cats.push(d); PB.save(); s.close(); } }, 'Save'),
        c ? h('button', { class: 'btn ghost danger', style: 'color:var(--danger)', onclick: async () => { s.close(); if (await PB.confirm('Delete category?', 'Items keep their data but lose this category.', 'Delete', true)) { PB.data.entries.forEach((e) => { if (e.categoryId === c.id) e.categoryId = ''; }); PB.data.cats = PB.data.cats.filter((x) => x.id !== c.id); PB.save(); } } }, 'Delete category') : null);
    }
    PB.on('data', draw); draw();
  };

  /* ---------- duplicates ---------- */
  PB.findDuplicates = function () {
    const map = new Map();
    PB.data.entries.filter((e) => !e.deletedAt && e.type === 'contact').forEach((e) => {
      new Set(e.phones.map((p) => PB.digits(p.value).slice(-9)).filter((d) => d.length >= 7)).forEach((k) => { if (!map.has(k)) map.set(k, new Set()); map.get(k).add(e); });
    });
    const groups = [], seen = new Set();
    map.forEach((set) => { if (set.size > 1) { const g = [...set]; if (g.some((x) => seen.has(x.id))) return; g.forEach((x) => seen.add(x.id)); groups.push(g); } });
    return groups;
  };
  PB.openDuplicates = function () {
    const box = h('div'); const pg = PB.page('Duplicates'); pg.body.append(box);
    const draw = () => {
      if (!pg.el.isConnected) return;
      const gs = PB.findDuplicates(); box.replaceChildren();
      if (!gs.length) { box.append(h('div', { class: 'empty' }, h('span', { class: 'big' }, '🎉'), h('b', null, 'No duplicates found'))); return; }
      gs.forEach((g) => box.append(h('div', { class: 'box' }, h('div', { class: 'lbl' }, 'Same number'), g.map((e) => h('button', { class: 'link', onclick: () => PB.openDetail(e.id) }, PB.avatar(e), h('div', { class: 'grow' }, PB.displayName(e), h('small', null, e.phones.map((p) => p.value).join(' · '))))),
        h('div', { style: 'padding:10px 16px' }, h('button', { class: 'btn sm', onclick: () => { merge(g); PB.toast('Merged'); } }, 'Merge into one')))));
    };
    function merge(g) {
      const [main, ...rest] = g.slice().sort((a, b) => b.updated - a.updated);
      rest.forEach((o) => {
        ['first', 'last', 'company', 'jobTitle', 'website', 'birthday', 'categoryId', 'folderId'].forEach((k) => { if (!main[k] && o[k]) main[k] = o[k]; });
        ['phones', 'emails', 'addresses'].forEach((k) => o[k].forEach((p) => { if (!main[k].some((x) => PB.norm(x.value) === PB.norm(p.value))) main[k].push(p); }));
        if (o.notes && !main.notes.includes(o.notes)) main.notes = (main.notes ? main.notes + '\n' : '') + o.notes;
        main.fav = main.fav || o.fav; o.deletedAt = Date.now();
      });
      main.updated = Date.now(); PB.save();
    }
    PB.on('data', draw); draw();
  };
})();
