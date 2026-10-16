/* screens.js — lock screen, main screen (tabs, search, filter, list/cards/table), selection. */
'use strict';
(function () {
  const h = PB.h;
  PB.ui = { tab: 'contacts', q: '', searchOpen: false, sel: new Set(), filter: { cat: '', folder: '', fav: false, phone: false, email: false, addr: false, type: '' } };
  const coll = new Intl.Collator(['en', 'fa'], { sensitivity: 'base', numeric: true });

  /* =============== LOCK / PIN =============== */
  PB.pinScreen = function (o) {
    return new Promise((resolve) => {
      let pin = '';
      const dots = h('div', { class: 'dots' });
      const msg = h('p', null, o.sub || '');
      const okBtn = h('button', { class: 'btn', style: 'margin-top:18px;min-width:230px' }, o.okText || 'Unlock');
      const draw = () => {
        dots.replaceChildren(...Array.from({ length: Math.max(4, pin.length) }, (_, i) => h('i', { class: i < pin.length ? 'f' : '' })));
        okBtn.style.opacity = pin.length >= 4 ? 1 : 0.4;
      };
      const wrong = (t) => { msg.textContent = t || 'Wrong PIN'; dots.classList.remove('shake'); void dots.offsetWidth; dots.classList.add('shake'); pin = ''; draw(); };
      const submit = async () => {
        if (pin.length < 4) return;
        const locked = (PB.settings.lockUntil || 0) - Date.now();
        if (o.verify && locked > 0) { wrong('Too many attempts. Wait ' + Math.ceil(locked / 1000) + 's'); return; }
        const r = o.verify ? await o.verify(pin) : true;
        if (r === true) { el.remove(); resolve(pin); } else wrong(typeof r === 'string' ? r : undefined);
      };
      okBtn.onclick = submit;
      const key = (d) => h('button', { onclick: () => { if (pin.length < 6) { pin += d; draw(); msg.textContent = o.sub || ''; if (pin.length === 6) submit(); } } }, d);
      const bioBtn = h('button', { class: 't', onclick: () => tryBio(), 'aria-label': 'Fingerprint' }, o.bio ? '🖐' : '');
      const tryBio = async () => {
        const n = PB.native(); if (!n || !o.bio) return;
        try { await n.biometricAuth({ title: 'Unlock PhoneBook' }); el.remove(); resolve('bio'); } catch (e) { /* use PIN */ }
      };
      const pad = h('div', { class: 'pad' }, ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(key), bioBtn, key('0'),
        h('button', { class: 't', 'aria-label': 'Delete', onclick: () => { pin = pin.slice(0, -1); draw(); } }, '⌫'));
      const el = h('div', { id: 'lock' },
        h('div', { class: 'logo' }, '📒'), h('h2', null, o.title), msg, dots, pad, okBtn,
        o.forgot ? h('button', { style: 'margin-top:18px;color:var(--muted);font-size:14px', onclick: o.forgot }, 'Forgot PIN?') : null,
        o.cancel ? h('button', { style: 'margin-top:14px;color:var(--muted)', onclick: () => { el.remove(); resolve(null); } }, 'Cancel') : null);
      document.body.append(el); draw();
      if (o.bio) setTimeout(tryBio, 350);
      document.addEventListener('keydown', function kd(ev) {
        if (!el.isConnected) return document.removeEventListener('keydown', kd);
        if (/^[0-9]$/.test(ev.key)) key(ev.key).click(); else if (ev.key === 'Backspace') { pin = pin.slice(0, -1); draw(); } else if (ev.key === 'Enter') submit();
      });
    });
  };

  PB.unlock = function () {
    return PB.pinScreen({
      title: 'PhoneBook', sub: 'Enter your PIN', bio: PB.settings.bio,
      verify: async (pin) => {
        const hsh = await PB.hashPin(pin, PB.settings.pinSalt);
        if (hsh === PB.settings.pinHash) { PB.settings.fails = 0; PB.settings.lockUntil = 0; PB.saveSettings(); return true; }
        PB.settings.fails = (PB.settings.fails || 0) + 1;
        if (PB.settings.fails >= 5) PB.settings.lockUntil = Date.now() + 30000 * (PB.settings.fails - 4);
        PB.saveSettings();
        return PB.settings.fails >= 5 ? 'Too many attempts. Try again soon.' : 'Wrong PIN (' + PB.settings.fails + '/5)';
      },
      forgot: async () => {
        if (await PB.confirm('Reset app?', 'Without the PIN the only way in is to erase everything inside the app.\nYour backup files in Documents/PhoneBook stay safe and can be restored.', 'Erase & reset', true)) {
          localStorage.clear(); location.reload();
        }
      },
    });
  };
  /* ask for a new PIN twice → resolves with pin or null */
  PB.setupPin = async function (first) {
    for (;;) {
      const a = await PB.pinScreen({ title: first ? 'Welcome to PhoneBook' : 'New PIN', sub: 'Choose a PIN (4–6 digits)', okText: 'Next', cancel: !first });
      if (a == null) return null;
      const b = await PB.pinScreen({ title: 'Confirm PIN', sub: 'Enter the same PIN again', okText: 'Save PIN', cancel: !first, verify: async (p) => (p === a ? true : 'PINs do not match') });
      if (b != null) return a;
      if (!first) return null;
    }
  };

  /* =============== QUERY =============== */
  PB.query = function (o) {
    o = o || {};
    const f = o.filter || {};
    const q = PB.norm(o.q || ''), qd = PB.digits(o.q || '');
    let list = PB.data.entries.filter((e) => !e.deletedAt);
    if (o.folderId) list = list.filter((e) => e.folderId === o.folderId);
    if (o.fav || f.fav) list = list.filter((e) => e.fav);
    if (f.cat) list = list.filter((e) => e.categoryId === f.cat);
    if (f.folder) list = list.filter((e) => (f.folder === '_none' ? !e.folderId : e.folderId === f.folder));
    if (f.type) list = list.filter((e) => e.type === f.type);
    if (f.phone) list = list.filter((e) => e.phones.length);
    if (f.email) list = list.filter((e) => e.emails.length);
    if (f.addr) list = list.filter((e) => e.addresses.length);
    if (q) {
      const words = q.split(/\s+/).filter(Boolean);
      list = list.filter((e) => {
        const t = PB.searchText(e);
        return words.every((w) => t.includes(w)) || (qd.length >= 3 && t.includes(qd));
      });
    }
    const s = PB.settings.sort;
    if (s === 'new') list.sort((a, b) => b.created - a.created);
    else if (s === 'edited') list.sort((a, b) => b.updated - a.updated);
    else { list.sort((a, b) => coll.compare(PB.sortKey(a), PB.sortKey(b))); if (s === 'za') list.reverse(); }
    return list;
  };

  const letterOf = (e) => {
    const k = PB.sortKey(e); const c = Array.from(k)[0] || '#';
    if (/[a-z]/i.test(c)) return c.toUpperCase();
    if (/[آ-ی]/.test(c)) return c;
    return '#';
  };
  const phoneOf = (e) => (e.type === 'note' ? (e.text || '').split('\n')[0] : (e.phones[0] ? e.phones[0].value : e.emails[0] ? e.emails[0].value : e.company || ''));

  /* =============== LIST RENDERING (shared) =============== */
  PB.renderList = function (box, list, o) {
    o = o || {};
    box.replaceChildren();
    const view = o.view || PB.settings.view;
    if (!list.length) {
      box.append(h('div', { class: 'empty' }, h('span', { class: 'big' }, o.emptyIcon || '📭'), h('b', null, o.emptyTitle || 'Nothing here yet'), h('div', null, o.emptyText || 'Tap + to add your first entry')));
      return;
    }
    const open = (e) => { if (PB.ui.sel.size && o.selectable) toggleSel(e.id); else PB.openDetail(e.id); };
    const press = (node, e) => {
      let t, moved = false;
      node.addEventListener('touchstart', () => { moved = false; if (o.selectable) t = setTimeout(() => { if (!moved) { toggleSel(e.id); navigator.vibrate && navigator.vibrate(15); node._lp = true; } }, 480); }, { passive: true });
      node.addEventListener('touchmove', () => { moved = true; clearTimeout(t); }, { passive: true });
      node.addEventListener('touchend', () => clearTimeout(t));
      node.addEventListener('contextmenu', (ev) => { ev.preventDefault(); if (o.selectable) toggleSel(e.id); });
      node.addEventListener('click', () => { if (node._lp) { node._lp = false; return; } open(e); });
      if (PB.ui.sel.has(e.id)) node.classList.add('sel');
      node.dataset.id = e.id;
      return node;
    };
    if (view === 'table') {
      const th = (t) => h('th', null, t);
      const rows = list.map((e) => press(h('tr', null,
        h('td', null, PB.displayName(e)),
        h('td', { dir: 'auto' }, e.type === 'note' ? '—' : e.phones.map((p) => p.value).join(' · ')),
        h('td', null, e.emails.map((p) => p.value).join(' · ')),
        h('td', { dir: 'auto' }, e.addresses.map((p) => p.value).join(' · ') || (e.type === 'note' ? (e.text || '').split('\n')[0] : '')),
        h('td', null, (PB.cat(e.categoryId) || {}).name || ''),
        h('td', null, (PB.folder(e.folderId) || {}).name || '')), e));
      box.append(h('div', { class: 'tbl-wrap' }, h('table', null, h('thead', null, h('tr', null, ['Name', 'Phone', 'Email', 'Address', 'Category', 'Folder'].map(th))), h('tbody', null, rows))));
      return;
    }
    const catDot = (e) => { const c = PB.cat(e.categoryId); return c ? h('i', { class: 'dot', title: c.name, style: 'background:' + c.color }) : null; };
    if (view === 'cards') {
      box.append(h('div', { class: 'cards' }, list.map((e, i) => press(h('div', { class: 'cardx', style: 'animation-delay:' + Math.min(i, 12) * 25 + 'ms' },
        h('div', { style: 'display:flex;width:100%;justify-content:space-between;align-items:flex-start' }, PB.avatar(e), h('div', { style: 'display:flex;gap:6px;align-items:center' }, e.fav ? h('span', { class: 'star' }, '★') : null, catDot(e))),
        h('div', { class: 'meta' }, h('b', { dir: 'auto' }, PB.displayName(e)), h('span', { dir: 'auto' }, phoneOf(e)), h('span', { dir: 'auto' }, e.type === 'contact' ? (e.emails[0] ? e.emails[0].value : '') : ''))), e))));
      return;
    }
    const grouped = !o.noLetters && ['az', 'za'].includes(PB.settings.sort);
    let last = '';
    const letters = [];
    list.forEach((e, i) => {
      if (grouped) {
        const L = letterOf(e);
        if (L !== last) { last = L; letters.push(L); box.append(h('div', { class: 'letter', id: 'L-' + letters.length }, L)); }
      }
      box.append(press(h('div', { class: 'row-item', style: 'animation-delay:' + Math.min(i, 12) * 20 + 'ms' },
        PB.avatar(e),
        h('div', { class: 'meta' }, h('b', { dir: 'auto' }, PB.displayName(e)), h('span', { dir: 'auto' }, phoneOf(e) || ' ')),
        e.fav ? h('span', { class: 'star' }, '★') : null, catDot(e)), e));
    });
    if (grouped && letters.length > 4 && o.rail !== false) {
      const rail = h('div', { class: 'rail' }, letters.map((L, i) => h('span', { 'data-i': i + 1 }, L)));
      const go = (x, y) => { const t = document.elementFromPoint(x, y); if (t && t.dataset && t.dataset.i) { const target = document.getElementById('L-' + t.dataset.i); if (target) box.parentElement.scrollTop = target.offsetTop - 8; } };
      rail.addEventListener('touchstart', (ev) => go(ev.touches[0].clientX, ev.touches[0].clientY), { passive: true });
      rail.addEventListener('touchmove', (ev) => go(ev.touches[0].clientX, ev.touches[0].clientY), { passive: true });
      rail.addEventListener('click', (ev) => go(ev.clientX, ev.clientY));
      box.parentElement.append(rail);
      rail._owner = box;
    }
  };

  /* =============== SELECTION =============== */
  function toggleSel(id) {
    const s = PB.ui.sel; s.has(id) ? s.delete(id) : s.add(id);
    PB.refresh(); renderSelbar();
  }
  PB.clearSel = () => { PB.ui.sel.clear(); PB.refresh(); renderSelbar(); };
  function renderSelbar() {
    document.querySelector('.selbar') && document.querySelector('.selbar').remove();
    const n = PB.ui.sel.size;
    document.querySelector('.nav').classList.toggle('hide', n > 0);
    document.querySelector('.fab').classList.toggle('hide', n > 0);
    if (!n) return;
    const ids = () => [...PB.ui.sel];
    const btn = (i, t, f) => h('button', { onclick: f }, h('i', null, i), t);
    document.getElementById('app').append(h('div', { class: 'selbar' },
      h('button', { onclick: PB.clearSel, style: 'font-weight:800' }, '✕ ' + n),
      btn('☑', 'All', () => { PB.ui.sel = new Set(currentList().map((e) => e.id)); PB.refresh(); renderSelbar(); }),
      btn('📤', 'Share', () => { const l = PB.data.entries.filter((e) => PB.ui.sel.has(e.id)); PB.busy(); PB.shareOut({ title: 'Contacts', text: l.map(PB.entryToText).join('\n\n') }); }),
      btn('📁', 'Folder', () => PB.chooseFolder((fid) => { PB.data.entries.forEach((e) => { if (PB.ui.sel.has(e.id)) { e.folderId = fid; e.updated = Date.now(); } }); PB.save(); PB.toast('Moved'); PB.clearSel(); })),
      btn('🏷', 'Category', () => PB.chooseCategory((cid) => { PB.data.entries.forEach((e) => { if (PB.ui.sel.has(e.id)) { e.categoryId = cid; e.updated = Date.now(); } }); PB.save(); PB.toast('Updated'); PB.clearSel(); })),
      btn('🗑', 'Delete', async () => { if (await PB.confirm('Move ' + n + ' item(s) to Trash?', 'You can restore them within 30 days.', 'Move to Trash', true)) { PB.data.entries.forEach((e) => { if (PB.ui.sel.has(e.id)) e.deletedAt = Date.now(); }); PB.save(); PB.clearSel(); PB.toast('Moved to Trash'); } })));
  }
  PB.chooseFolder = function (cb) {
    const body = h('div');
    const s = PB.sheet('Move to folder', body);
    const item = (ic, t, f) => h('button', { class: 'link', onclick: () => { s.close(); f(); } }, h('i', null, ic), h('div', { class: 'grow' }, t));
    body.append(h('div', { class: 'box' }, item('🚫', 'No folder', () => cb('')), PB.data.folders.map((f) => item(f.icon || '📁', f.name, () => cb(f.id))),
      item('➕', 'New folder…', async () => { const n = await PB.prompt('New folder name', '', 'e.g. Family'); if (n) { const f = { id: PB.uid(), name: n, color: PB.COLORS[PB.data.folders.length % PB.COLORS.length], icon: '📁' }; PB.data.folders.push(f); cb(f.id); } })));
  };
  PB.chooseCategory = function (cb) {
    const body = h('div'); const s = PB.sheet('Set category', body);
    body.append(h('div', { class: 'box' }, h('button', { class: 'link', onclick: () => { s.close(); cb(''); } }, h('i', null, '🚫'), h('div', { class: 'grow' }, 'No category')),
      PB.data.cats.map((c) => h('button', { class: 'link', onclick: () => { s.close(); cb(c.id); } }, h('i', { style: 'background:' + c.color + '33' }, h('span', { class: 'dot', style: 'background:' + c.color }), ''), h('div', { class: 'grow' }, c.name)))));
  };

  /* =============== MAIN SCREEN =============== */
  const currentList = () => PB.query({ q: PB.ui.q, filter: PB.ui.filter, fav: PB.ui.tab === 'favs' });
  const filterCount = () => Object.values(PB.ui.filter).filter(Boolean).length;
  const VIEWS = { list: ['☰', 'List'], cards: ['▦', 'Cards'], table: ['▤', 'Table'] };

  PB.renderMain = function () {
    const app = document.getElementById('app'); app.replaceChildren();
    const ui = PB.ui;
    const title = h('h1');
    const searchIn = h('input', { type: 'search', dir: 'auto', placeholder: 'Search name, phone, address, text…', value: ui.q, 'aria-label': 'Search', oninput: (e) => { ui.q = e.target.value; PB.refresh(); }, autocomplete: 'off' });
    const searchBox = h('div', { class: 'search' }, h('span', null, '🔍'), searchIn, h('button', { 'aria-label': 'Clear', onclick: () => { ui.q = ''; searchIn.value = ''; PB.refresh(); searchIn.focus(); } }, '✕'));
    const chips = h('div', { class: 'chips' });
    const bSearch = h('button', { class: 'ibtn', 'aria-label': 'Search', onclick: () => { ui.searchOpen = !ui.searchOpen; PB.refresh(); if (ui.searchOpen) setTimeout(() => searchIn.focus(), 50); else { ui.q = ''; searchIn.value = ''; PB.refresh(); } } }, '🔍');
    const bView = h('button', { class: 'ibtn', 'aria-label': 'Change view', onclick: () => { const ks = Object.keys(VIEWS); PB.settings.view = ks[(ks.indexOf(PB.settings.view) + 1) % ks.length]; PB.saveSettings(); PB.toast(VIEWS[PB.settings.view][1] + ' view'); PB.refresh(); } });
    const bFilt = h('button', { class: 'ibtn', 'aria-label': 'Filter and sort', onclick: PB.openFilter }, '⚙︎');
    const top = h('div', { class: 'top' }, h('div', { class: 'row' }, title, bSearch, bView, bFilt), searchBox, chips);
    const main = h('div', { class: 'main' }, h('div', { id: 'list' }));
    const nav = h('div', { class: 'nav' }, [['contacts', '📒', 'Contacts'], ['folders', '🗂', 'Folders'], ['favs', '⭐', 'Favorites'], ['settings', '⚙️', 'Settings']].map(([k, i, t]) =>
      h('button', { 'data-tab': k, onclick: () => { ui.tab = k; ui.sel.clear(); PB.refresh(); renderSelbar(); main.scrollTop = 0; } }, h('i', null, i), t)));
    const fab = h('button', { class: 'fab', 'aria-label': 'Add' }, '+');
    app.append(top, main, nav, fab);

    PB.refresh = function () {
      const box = document.getElementById('list'); if (!box) return;
      main.querySelectorAll('.rail').forEach((r) => r.remove());
      const tab = ui.tab, live = PB.data.entries.filter((e) => !e.deletedAt);
      nav.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
      const isList = tab === 'contacts' || tab === 'favs';
      bSearch.classList.toggle('hide', !isList); bView.classList.toggle('hide', !isList); bFilt.classList.toggle('hide', !isList);
      bSearch.classList.toggle('on', ui.searchOpen);
      bView.textContent = VIEWS[PB.settings.view][0];
      searchBox.classList.toggle('hide', !(isList && ui.searchOpen));
      fab.classList.toggle('hide', tab === 'settings' || ui.sel.size > 0);
      fab.onclick = () => (tab === 'folders' ? PB.editFolder() : PB.openEdit(null, { fav: tab === 'favs' }));
      title.replaceChildren(tab === 'contacts' ? 'Contacts' : tab === 'folders' ? 'Folders' : tab === 'favs' ? 'Favorites' : 'Settings',
        h('small', null, tab === 'settings' ? 'Private · Offline · Yours' : tab === 'folders' ? PB.data.folders.length + ' folder(s)' : live.length + ' item(s) · ' + (tab === 'favs' ? 'starred' : 'all saved')));
      chips.replaceChildren();
      if (isList) {
        const F = ui.filter, add = (t, f) => chips.append(h('button', { class: 'chip x', onclick: f }, t));
        if (ui.q) add('“' + ui.q + '”', () => { ui.q = ''; searchIn.value = ''; PB.refresh(); });
        if (F.cat) add((PB.cat(F.cat) || {}).name || 'Category', () => { F.cat = ''; PB.refresh(); });
        if (F.folder) add(F.folder === '_none' ? 'No folder' : (PB.folder(F.folder) || {}).name || 'Folder', () => { F.folder = ''; PB.refresh(); });
        if (F.type) add(F.type === 'note' ? 'Notes' : 'Contacts', () => { F.type = ''; PB.refresh(); });
        if (F.fav) add('★ Starred', () => { F.fav = false; PB.refresh(); });
        if (F.phone) add('Has phone', () => { F.phone = false; PB.refresh(); });
        if (F.email) add('Has email', () => { F.email = false; PB.refresh(); });
        if (F.addr) add('Has address', () => { F.addr = false; PB.refresh(); });
      }
      chips.classList.toggle('hide', !chips.children.length);
      bFilt.classList.toggle('on', filterCount() > 0);
      if (tab === 'folders') return PB.renderFolders(box);
      if (tab === 'settings') return PB.renderSettings(box);
      const list = currentList();
      PB.renderList(box, list, { selectable: true,
        emptyIcon: tab === 'favs' ? '⭐' : ui.q || filterCount() ? '🔎' : '📒',
        emptyTitle: ui.q || filterCount() ? 'No matches' : tab === 'favs' ? 'No favorites yet' : 'Your PhoneBook is empty',
        emptyText: ui.q || filterCount() ? 'Try a different search or clear the filters' : tab === 'favs' ? 'Open a contact and tap the star' : 'Tap + to add a contact or a text note' });
    };
    PB.refresh();
  };
  PB.on('data', () => PB.refresh && PB.refresh());

  /* =============== FILTER / SORT SHEET =============== */
  PB.openFilter = function () {
    const F = PB.ui.filter, body = h('div');
    const s = PB.sheet('Sort & filter', body);
    const render = () => {
      const opts = (items, cur, set) => h('div', { class: 'opts' }, items.map(([k, t]) => h('button', { class: 'opt' + (cur === k ? ' on' : ''), onclick: () => { set(k); render(); PB.refresh(); } }, t)));
      const tog = (t, k) => h('button', { class: 'opt' + (F[k] ? ' on' : ''), onclick: () => { F[k] = !F[k]; render(); PB.refresh(); } }, t);
      body.replaceChildren(
        h('div', { class: 'sec' }, 'Sort by'),
        opts([['az', 'Name A→Z'], ['za', 'Name Z→A'], ['new', 'Newest'], ['edited', 'Recently edited']], PB.settings.sort, (k) => { PB.settings.sort = k; PB.saveSettings(); }),
        h('div', { class: 'sec' }, 'Type'),
        opts([['', 'All'], ['contact', 'Contacts'], ['note', 'Text notes']], F.type, (k) => (F.type = k)),
        h('div', { class: 'sec' }, 'Category'),
        opts([['', 'All']].concat(PB.data.cats.map((c) => [c.id, c.name])), F.cat, (k) => (F.cat = k)),
        h('div', { class: 'sec' }, 'Folder'),
        opts([['', 'All'], ['_none', 'No folder']].concat(PB.data.folders.map((f) => [f.id, (f.icon || '📁') + ' ' + f.name])), F.folder, (k) => (F.folder = k)),
        h('div', { class: 'sec' }, 'Only show'),
        h('div', { class: 'opts' }, tog('★ Starred', 'fav'), tog('Has phone', 'phone'), tog('Has email', 'email'), tog('Has address', 'addr')),
        h('div', { style: 'display:flex;gap:10px' },
          h('button', { class: 'btn ghost', onclick: () => { Object.assign(F, { cat: '', folder: '', fav: false, phone: false, email: false, addr: false, type: '' }); render(); PB.refresh(); } }, 'Reset'),
          h('button', { class: 'btn', onclick: () => s.close() }, 'Done')));
    };
    render();
  };

  /* =============== FOLDERS TAB =============== */
  PB.renderFolders = function (box) {
    box.replaceChildren();
    const live = PB.data.entries.filter((e) => !e.deletedAt);
    const unf = live.filter((e) => !e.folderId).length;
    const grid = h('div', { class: 'fgrid' });
    PB.data.folders.forEach((f, i) => {
      const n = live.filter((e) => e.folderId === f.id).length;
      grid.append(h('button', { class: 'fcard', style: 'background:linear-gradient(135deg,' + f.color + ',' + f.color + 'aa);animation-delay:' + i * 40 + 'ms', onclick: () => PB.openFolder(f.id) },
        h('div', { class: 'ic' }, f.icon || '📁'), h('div', null, h('b', { dir: 'auto' }, f.name), h('span', null, n + ' item' + (n === 1 ? '' : 's')))));
    });
    grid.append(h('button', { class: 'fcard add', onclick: () => PB.editFolder() }, h('div', { style: 'text-align:center' }, h('div', { style: 'font-size:34px' }, '+'), 'New folder')));
    box.append(grid);
    if (unf) box.append(h('div', { class: 'sec' }, 'Not in any folder'), h('button', { class: 'box link', style: 'width:100%', onclick: () => { PB.ui.filter.folder = '_none'; PB.ui.tab = 'contacts'; PB.refresh(); } }, h('i', null, '🗃'), h('div', { class: 'grow' }, unf + ' item(s) without a folder', h('small', null, 'Tap to view them'))));
    if (!PB.data.folders.length) box.append(h('div', { class: 'empty' }, h('span', { class: 'big' }, '🗂'), h('b', null, 'Organize with folders'), h('div', null, 'Create a folder, then keep related contacts and texts inside it.')));
  };

  PB.openFolder = function (fid) {
    const f = PB.folder(fid); if (!f) return;
    const box = h('div', { id: 'flist' });
    const pg = PB.page((f.icon || '📁') + ' ' + f.name, { actions: [
      h('button', { class: 'ibtn', 'aria-label': 'Add here', onclick: () => PB.openEdit(null, { folderId: fid }) }, '+'),
      h('button', { class: 'ibtn', 'aria-label': 'Folder options', onclick: () => folderMenu(fid, pg) }, '⋯')] });
    pg.body.append(box);
    const draw = () => { const cur = PB.folder(fid); if (!cur) return; pg.bar.textContent = (cur.icon || '📁') + ' ' + cur.name; PB.renderList(box, PB.query({ folderId: fid }), { emptyIcon: cur.icon || '📁', emptyTitle: 'Folder is empty', emptyText: 'Tap + to add a contact or text here', rail: false }); };
    const fn = () => { if (pg.el.isConnected) draw(); else PB.off && 0; };
    PB.on('data', fn); draw();
  };
  function folderMenu(fid, pg) {
    const body = h('div'); const s = PB.sheet('Folder options', body);
    const item = (ic, t, sm, f, red) => h('button', { class: 'link' + (red ? ' red' : ''), onclick: () => { s.close(); f(); } }, h('i', null, ic), h('div', { class: 'grow' }, t, sm ? h('small', null, sm) : null));
    body.append(h('div', { class: 'box' },
      item('✏️', 'Rename / color / icon', '', () => PB.editFolder(fid)),
      item('📤', 'Share folder as text', '', () => { PB.busy(); PB.shareOut({ title: PB.folder(fid).name, text: PB.folder(fid).name + '\n\n' + PB.query({ folderId: fid }).map(PB.entryToText).join('\n\n') }); }),
      item('💾', 'Export folder as PDF', 'Saved in Documents/PhoneBook', async () => { const p = await PB.exportAs('pdf', PB.query({ folderId: fid })); p.length && PB.toast('Saved: ' + p[0]); }),
      item('🗑', 'Delete folder', 'Items are kept, just unfiled', async () => { if (await PB.confirm('Delete this folder?', 'The items inside stay in your PhoneBook.', 'Delete', true)) { PB.data.entries.forEach((e) => { if (e.folderId === fid) e.folderId = ''; }); PB.data.folders = PB.data.folders.filter((f) => f.id !== fid); PB.save(); PB.closeOverlay(pg.el); } }, true)));
  }
  PB.editFolder = function (fid) {
    const f = fid ? PB.folder(fid) : { id: PB.uid(), name: '', color: PB.COLORS[PB.data.folders.length % PB.COLORS.length], icon: '📁' };
    const draft = Object.assign({}, f);
    const body = h('div'); const s = PB.sheet(fid ? 'Edit folder' : 'New folder', body);
    const name = h('input', { class: 'inp', dir: 'auto', placeholder: 'Folder name', value: draft.name, style: 'border:1.5px solid var(--line);border-radius:14px;margin-bottom:12px' });
    const sw = h('div', { class: 'swatches', style: 'padding:6px 0' }), ic = h('div', { class: 'opts' });
    const draw = () => {
      sw.replaceChildren(...PB.COLORS.map((c) => h('button', { class: 'sw' + (draft.color === c ? ' on' : ''), style: 'background:' + c, 'aria-label': c, onclick: () => { draft.color = c; draw(); } })));
      ic.replaceChildren(...PB.ICONS.map((i) => h('button', { class: 'opt' + (draft.icon === i ? ' on' : ''), onclick: () => { draft.icon = i; draw(); } }, i)));
    };
    draw();
    body.append(name, h('div', { class: 'sec' }, 'Color'), sw, h('div', { class: 'sec' }, 'Icon'), ic,
      h('button', { class: 'btn', onclick: () => {
        const n = name.value.trim(); if (!n) { PB.toast('Enter a name'); return; }
        draft.name = n;
        if (fid) Object.assign(f, draft); else PB.data.folders.push(draft);
        PB.save(); s.close();
      } }, 'Save'));
    setTimeout(() => !fid && name.focus(), 200);
  };
})();
