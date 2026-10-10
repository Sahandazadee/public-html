const { chromium } = require('playwright');
(async () => {
  const [,, page, sel, out, w, pre] = process.argv;
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p = await b.newPage({viewport:{width:+w||1300,height:900}});
  await p.goto('http://localhost:8765/'+page,{waitUntil:'load'}); await p.waitForTimeout(600);
  if (pre) { for (const s of pre.split('|')) { await p.click(s).catch(()=>{}); await p.waitForTimeout(250);} }
  const els = await p.$$(sel);
  const i = 0; await els[i].screenshot({path:out});
  await b.close();
})();
