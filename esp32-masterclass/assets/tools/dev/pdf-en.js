const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage();
  await p.goto('http://localhost:8765/en/cheatsheet.html',{waitUntil:'load'}); await p.waitForTimeout(1200);
  await p.emulateMedia({media:'print'});
  await p.pdf({path:''+require('path').resolve(__dirname,'../..')+'/esp32-cheatsheet-en.pdf', format:'A4', printBackground:true, margin:{top:'12mm',bottom:'12mm',left:'10mm',right:'10mm'}});
  await b.close();
})();
