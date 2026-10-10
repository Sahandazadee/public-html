const { chromium } = require('playwright');
(async () => {
  const [,, page, out, w, fullH, clickSel] = process.argv;
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(()=>chromium.launch());
  const p = await b.newPage({viewport:{width:+w||1300,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
  await p.goto('http://localhost:8765/'+page,{waitUntil:'load',timeout:20000}).catch(e=>errs.push(e.message));
  await p.waitForTimeout(800);
  if (clickSel) { await p.click(clickSel).catch(e=>errs.push('click '+e.message)); await p.waitForTimeout(300); }
  await p.screenshot({path:out,fullPage:fullH==='full'});
  console.log(JSON.stringify(errs.filter(e=>!/fonts|ERR_|Failed to load/.test(e)).slice(0,10)));
  await b.close();
})();
