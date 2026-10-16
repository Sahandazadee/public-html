/* main.js — boot sequence, auto-lock (wipes decrypted data from memory when locked). */
'use strict';
(function () {
  let hiddenAt = 0, locked = true;
  async function lockNow() {
    if (locked) return; locked = true;
    await PB.flush();
    PB.closeAll();
    PB.wipeMemory();
    PB.ui.sel.clear(); PB.ui.q = ''; PB.ui.searchOpen = false;
    document.getElementById('app').replaceChildren();
    PB.refresh = null;
    await unlockAndLoad();
    locked = false; PB.renderMain();
  }
  async function unlockAndLoad() {
    for (;;) {
      await PB.unlock();
      try { await PB.load(); return; } catch (e) {
        PB.dek = null;
        PB.toast('Could not decrypt data: ' + e.message);
      }
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (!PB.hasKeys() || locked) return;
    if (document.hidden) { hiddenAt = Date.now(); PB.flush(); return; }
    if (Date.now() < (PB.busyUntil || 0)) return;
    if (hiddenAt && Date.now() - hiddenAt >= (PB.settings.lockDelay || 0)) lockNow();
  });
  window.addEventListener('pagehide', () => { PB.flush && PB.flush(); });

  async function boot() {
    PB.loadSettings(); PB.applyTheme();
    if (!PB.hasKeys() && !PB.isLegacy()) {
      // first run: choose PIN → create encryption keys
      const pin = await PB.setupPin(true);
      await PB.setPin(pin);
      PB.data = { entries: [], folders: [], cats: PB.DEFAULT_CATS.map((c) => Object.assign({}, c)), v: 1 };
      await PB.persistNow();
      const n = PB.native();
      if (n) {
        try {
          const r = await n.biometricAvailable();
          if (r.available && await PB.confirm('Use fingerprint?', 'Unlock faster with your fingerprint. The key is sealed in the phone\'s secure hardware. Your PIN always works too.', 'Enable')) {
            const raw = new Uint8Array(await crypto.subtle.exportKey('raw', PB.dek));
            const res = await n.biometricEnroll({ dek: PB.b64e(raw) });
            PB.settings.bioBlob = res.blob; PB.settings.bio = true; PB.saveSettings();
          }
        } catch (e) { /* skipped */ }
      }
      locked = false;
      PB.renderMain();
      if (await PB.confirm('Encrypted backups', 'Set a backup password to keep an encrypted copy of your phonebook in Documents/PhoneBook (it survives uninstalling the app). You can do this later in Settings.', 'Set password')) {
        await PB.setupBackupPassword(false); PB.refresh && PB.refresh();
      }
      return;
    }
    await unlockAndLoad();
    locked = false;
    PB.renderMain();
    if (PB.isLegacyMigrated) PB.toast('Your data is now encrypted');
    if (PB.native()) PB.autoBackup();
  }
  window.PB_boot = boot;
  boot();
})();
