/* main.js — boot sequence, auto-lock. */
'use strict';
(function () {
  let hiddenAt = 0, locked = true;
  async function showLock() {
    if (locked) return; locked = true;
    PB.closeAll();
    await PB.unlock(); locked = false;
  }
  document.addEventListener('visibilitychange', () => {
    if (!PB.settings.pinHash) return;
    if (document.hidden) { hiddenAt = Date.now(); return; }
    if (Date.now() < (PB.busyUntil || 0)) return;
    if (hiddenAt && Date.now() - hiddenAt >= (PB.settings.lockDelay || 0)) showLock();
  });
  window.addEventListener('beforeunload', () => PB.save && 0);

  async function boot() {
    PB.loadSettings(); PB.load(); PB.applyTheme();
    if (!PB.settings.pinHash) {
      const pin = await PB.setupPin(true);
      await PB.setPin(pin);
      const n = PB.native();
      if (n) { try { const r = await n.biometricAvailable(); if (r.available && await PB.confirm('Use fingerprint?', 'Unlock faster with your fingerprint. Your PIN always works too.', 'Enable')) { await n.biometricAuth({ title: 'Confirm fingerprint' }); PB.settings.bio = true; PB.saveSettings(); } } catch (e) { /* skip */ } }
    } else {
      await PB.unlock();
    }
    locked = false;
    PB.renderMain();
    if (PB.native()) PB.autoBackup();
  }
  window.PB_boot = boot;
  boot();
})();
