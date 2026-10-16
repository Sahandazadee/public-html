/* forms.js — contact/note detail page and edit form. */
'use strict';
(function () {
  const h = PB.h;
  const PHONE_LABELS = ['Mobile', 'Home', 'Work', 'Main', 'Fax', 'Other'];
  const MAIL_LABELS = ['Home', 'Work', 'Other'];
  const ADDR_LABELS = ['Home', 'Work', 'Other'];

  /* ---------- detail ---------- */
  PB.openDetail = function (id) {
    const pg = PB.page('', { actions: [] });
    pg.el.querySelector('.bar').classList.add('hide');
    const wrap = pg.body;
    wrap.style.paddingTop = 'calc(var(--sat) + 10px)';
    const draw = () => {
      const e = PB.data.entries.find((x) => x.id === id);
      if (!e || e.deletedAt) { if (pg.el.isConnected) PB.closeOverlay(pg.el); return; }
      wrap.replaceChildren();
      const c = PB.cat(e.categoryId), f = PB.folder(e.folderId);
      const top = h('div', { style: 'display:flex;justify-content:space-between;align-items:center;margin-bottom:4px' },
        h('button', { class: 'ibtn', style: 'background:var(--card);color:var(--accent)', 'aria-label': 'Back', onclick: () => PB.closeOverlay(pg.el) }, '‹'),
        h('div', { style: 'display:flex;gap:8px' },
          h('button', { class: 'ibtn', style: 'background:var(--card);color:#ffb300', 'aria-label': 'Favorite', onclick: () => { e.fav = !e.fav; e.updated = Date.now(); PB.save(); draw(); } }, e.fav ? '★' : '☆'),
          h('button', { class: 'ibtn', style: 'background:var(--card)', 'aria-label': 'Edit', onclick: () => PB.openEdit(e) }, '✏️'),
          h('button', { class: 'ibtn', style: 'background:var(--card)', 'aria-label': 'Delete', onclick: async () => { if (await PB.confirm('Move to Trash?', PB.displayName(e), 'Move to Trash', true)) { e.deletedAt = Date.now(); PB.save(); PB.toast('Moved to Trash'); } } }, '🗑')));
      const hero = h('div', { class: 'hero' }, PB.avatar(e, true), h('h2', { dir: 'auto' }, PB.displayName(e)),
        e.type === 'contact' && (e.jobTitle || e.company) ? h('p', { dir: 'auto' }, [e.jobTitle, e.company].filter(Boolean).join(' · ')) : null,
        h('div', { class: 'opts', style: 'justify-content:center;margin:0' },
          c ? h('span', { class: 'opt', style: 'border-color:' + c.color + ';color:' + c.color }, c.name) : null,
          f ? h('button', { class: 'opt', onclick: () => PB.openFolder(f.id) }, (f.icon || '📁') + ' ' + f.name) : null));
      const ph = e.phones[0], em = e.emails[0], ad = e.addresses[0];
      const pickOr = (arr, fn) => (arr.length === 1 ? fn(arr[0]) : arr.length > 1 ? pickSheet(arr, fn) : null);
      const act = (i, t, on, dis) => h('button', { class: 'act' + (dis ? ' dis' : ''), onclick: on }, h('i', null, i), t);
      const actions = e.type === 'contact' ? h('div', { class: 'actions' },
        act('📞', 'Call', () => pickOr(e.phones, (p) => (location.href = 'tel:' + PB.digits(p.value))), !ph),
        act('💬', 'SMS', () => pickOr(e.phones, (p) => (location.href = 'sms:' + PB.digits(p.value))), !ph),
        act('✉️', 'Email', () => pickOr(e.emails, (p) => (location.href = 'mailto:' + p.value)), !em),
        act('📍', 'Map', () => pickOr(e.addresses, (p) => (location.href = 'geo:0,0?q=' + encodeURIComponent(p.value))), !ad),
        act('📤', 'Share', () => shareSheet(e))) : h('div', { class: 'actions' }, act('📋', 'Copy', () => PB.copy(e.text || '')), act('📤', 'Share', () => shareSheet(e)));
      const fld = (ic, k, v, extra) => h('div', { class: 'fld', onclick: () => PB.copy(v) }, h('div', { class: 'mini' }, ic), h('div', { class: 'grow' }, h('span', { class: 'k' }, k), h('span', { class: 'v', dir: 'auto' }, v)), extra);
      const boxes = [];
      if (e.type === 'note') {
        boxes.push(h('div', { class: 'box' }, h('div', { class: 'lbl' }, 'Text'), h('div', { class: 'fld' }, h('div', { class: 'grow' }, h('span', { class: 'v', dir: 'auto', style: 'font-weight:500;line-height:1.6' }, e.text || '—')))));
      } else {
        if (e.phones.length) boxes.push(h('div', { class: 'box' }, h('div', { class: 'lbl' }, 'Phone'), e.phones.map((p) => fld('📞', p.label || 'Phone', p.value, h('div', { style: 'display:flex;gap:6px' },
          h('button', { class: 'mini', onclick: (ev) => { ev.stopPropagation(); location.href = 'sms:' + PB.digits(p.value); } }, '💬'),
          h('button', { class: 'mini', onclick: (ev) => { ev.stopPropagation(); location.href = 'tel:' + PB.digits(p.value); } }, '📞'))))));
        if (e.emails.length) boxes.push(h('div', { class: 'box' }, h('div', { class: 'lbl' }, 'Email'), e.emails.map((p) => fld('✉️', p.label || 'Email', p.value, h('button', { class: 'mini', onclick: (ev) => { ev.stopPropagation(); location.href = 'mailto:' + p.value; } }, '↗')))));
        if (e.addresses.length) boxes.push(h('div', { class: 'box' }, h('div', { class: 'lbl' }, 'Address'), e.addresses.map((p) => fld('📍', p.label || 'Address', p.value, h('button', { class: 'mini', onclick: (ev) => { ev.stopPropagation(); location.href = 'geo:0,0?q=' + encodeURIComponent(p.value); } }, '↗')))));
        const more = [];
        if (e.website) more.push(fld('🌐', 'Website', e.website));
        if (e.birthday) more.push(fld('🎂', 'Birthday', e.birthday));
        if (e.notes) more.push(fld('📝', 'Notes', e.notes));
        if (more.length) boxes.push(h('div', { class: 'box' }, more));
      }
      boxes.push(h('div', { style: 'text-align:center;color:var(--muted);font-size:12px;margin-top:6px' }, 'Added ' + new Date(e.created).toLocaleDateString() + ' · Edited ' + new Date(e.updated).toLocaleDateString()));
      wrap.append(top, hero, actions, ...boxes);
    };
    PB.on('data', () => pg.el.isConnected && draw());
    draw();
  };
  function pickSheet(arr, fn) {
    const body = h('div'); const s = PB.sheet('Choose', body);
    body.append(h('div', { class: 'box' }, arr.map((p) => h('button', { class: 'link', onclick: () => { s.close(); fn(p); } }, h('div', { class: 'grow' }, p.value, h('small', null, p.label || ''))))));
  }
  function shareSheet(e) {
    const body = h('div'); const s = PB.sheet('Share', body);
    const item = (ic, t, sm, f) => h('button', { class: 'link', onclick: () => { s.close(); PB.busy(); f(); } }, h('i', null, ic), h('div', { class: 'grow' }, t, h('small', null, sm)));
    const nm = PB.displayName(e).replace(/[^\p{L}\p{N}_-]+/gu, '_').slice(0, 30) || 'contact';
    body.append(h('div', { class: 'box' },
      item('💬', 'As text', 'Send through any messenger', () => PB.shareOut({ title: PB.displayName(e), text: PB.entryToText(e) })),
      e.type === 'contact' ? item('📇', 'As contact card (.vcf)', 'Can be imported by any phone', () => PB.shareOut({ title: PB.displayName(e), name: nm + '.vcf', bytes: new TextEncoder().encode(PB.buildVCF([e])) })) : null,
      item('📋', 'Copy text', 'To clipboard', () => PB.copy(PB.entryToText(e)))));
  }

  /* ---------- edit ---------- */
  PB.openEdit = function (existing, preset) {
    const isNew = !existing;
    const e = isNew ? Object.assign(PB.newEntry('contact'), preset || {}) : JSON.parse(JSON.stringify(existing));
    if (isNew && PB.ui.filter.cat && !e.categoryId) e.categoryId = PB.ui.filter.cat;
    const root = h('div');
    const pg = PB.page(isNew ? 'New entry' : 'Edit', { actions: [h('button', { class: 'ibtn', 'aria-label': 'Save', onclick: save, style: 'width:auto;padding:0 16px;font-weight:800;font-size:15px' }, 'Save')] });
    pg.body.className = 'scroll form'; pg.body.append(root);

    const inp = (key, ph, extra) => h('input', Object.assign({ class: 'inp', dir: 'auto', placeholder: ph, value: e[key] || '', oninput: (ev) => (e[key] = ev.target.value), autocomplete: 'off' }, extra || {}));
    const rep = (key, labels, ph, type, area) => {
      const box = h('div', { class: 'box' }, h('div', { class: 'lbl' }, key === 'phones' ? 'Phone' : key === 'emails' ? 'Email' : 'Address'));
      const drawRep = () => {
        box.querySelectorAll('.rep,.addrow').forEach((n) => n.remove());
        e[key].forEach((p, i) => {
          const sel = h('select', { 'aria-label': 'Label', onchange: (ev) => (p.label = ev.target.value) }, labels.map((l) => h('option', { value: l, selected: l === p.label }, l)));
          const f = area ? h('textarea', { class: 'inp', dir: 'auto', rows: 2, placeholder: ph, oninput: (ev) => (p.value = ev.target.value) }, p.value)
            : h('input', { class: 'inp', dir: 'auto', placeholder: ph, value: p.value, inputmode: type, oninput: (ev) => (p.value = ev.target.value), autocomplete: 'off' });
          box.append(h('div', { class: 'rep' }, sel, f, h('button', { class: 'rm', 'aria-label': 'Remove', onclick: () => { e[key].splice(i, 1); drawRep(); } }, '✕')));
        });
        box.append(h('button', { class: 'addrow', onclick: () => { e[key].push({ label: labels[0], value: '' }); drawRep(); const l = box.querySelectorAll('.rep .inp'); l[l.length - 1].focus(); } }, '＋ Add ' + (key === 'phones' ? 'phone' : key === 'emails' ? 'email' : 'address')));
      };
      drawRep(); return box;
    };
    const catSel = h('select', { class: 'inp', onchange: (ev) => (e.categoryId = ev.target.value) }, h('option', { value: '' }, '— No category —'), PB.data.cats.map((c) => h('option', { value: c.id, selected: c.id === e.categoryId }, c.name)));
    const folSel = h('select', { class: 'inp', onchange: (ev) => (e.folderId = ev.target.value) }, h('option', { value: '' }, '— No folder —'), PB.data.folders.map((f) => h('option', { value: f.id, selected: f.id === e.folderId }, (f.icon || '📁') + ' ' + f.name)));
    const classify = h('div', { class: 'box' }, h('div', { class: 'lbl' }, 'Organize'), catSel, folSel,
      h('div', { class: 'fld', onclick: (ev) => { e.fav = !e.fav; ev.currentTarget.querySelector('.toggle').classList.toggle('on', e.fav); } }, h('div', { class: 'grow' }, 'Favorite ★'), h('div', { class: 'toggle' + (e.fav ? ' on' : '') })));

    const draw = () => {
      root.replaceChildren();
      if (isNew) root.append(h('div', { class: 'seg' }, [['contact', '👤 Contact'], ['note', '📝 Text note']].map(([k, t]) => h('button', { class: e.type === k ? 'on' : '', onclick: () => { e.type = k; draw(); } }, t))));
      if (e.type === 'contact') {
        root.append(
          h('div', { class: 'box' }, h('div', { class: 'lbl' }, 'Name'), inp('first', 'First name'), inp('last', 'Last name'), inp('company', 'Company'), inp('jobTitle', 'Job title')),
          rep('phones', PHONE_LABELS, 'Phone number', 'tel'), rep('emails', MAIL_LABELS, 'Email', 'email'), rep('addresses', ADDR_LABELS, 'Street, city, postal code…', 'text', true),
          h('div', { class: 'box' }, h('div', { class: 'lbl' }, 'More'), inp('website', 'Website'), h('input', { class: 'inp', type: 'date', value: /^\d{4}-\d{2}-\d{2}$/.test(e.birthday) ? e.birthday : '', 'aria-label': 'Birthday', oninput: (ev) => (e.birthday = ev.target.value) }),
            h('textarea', { class: 'inp', dir: 'auto', placeholder: 'Notes', oninput: (ev) => (e.notes = ev.target.value) }, e.notes)), classify);
      } else {
        root.append(h('div', { class: 'box' }, h('div', { class: 'lbl' }, 'Text note'), inp('title', 'Title (e.g. Home address, Wi-Fi…)'),
          h('textarea', { class: 'inp big', dir: 'auto', placeholder: 'Write or paste any text — Persian is welcome…', oninput: (ev) => (e.text = ev.target.value) }, e.text)), classify);
      }
      root.append(h('button', { class: 'btn', onclick: save }, 'Save'));
    };
    draw();

    function save() {
      const clean = (arr) => arr.filter((p) => p.value && p.value.trim()).map((p) => ({ label: p.label, value: p.value.trim() }));
      e.phones = clean(e.phones); e.emails = clean(e.emails); e.addresses = clean(e.addresses);
      if (e.type === 'contact' && PB.displayName(Object.assign({}, e, { first: e.first.trim(), last: e.last.trim() })) === '(No name)') { PB.toast('Enter a name, company or phone'); return; }
      if (e.type === 'note' && !e.title.trim() && !e.text.trim()) { PB.toast('Write a title or some text'); return; }
      if (e.type === 'contact') { e.first = e.first.trim(); e.last = e.last.trim(); }
      e.updated = Date.now();
      if (isNew) PB.data.entries.push(e); else { const i = PB.data.entries.findIndex((x) => x.id === e.id); PB.data.entries[i] = e; }
      PB.save(); PB.toast(isNew ? 'Saved' : 'Updated');
      PB.closeOverlay(pg.el);
    }
  };
})();
