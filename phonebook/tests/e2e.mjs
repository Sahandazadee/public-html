// Browser smoke test: node tests/e2e.mjs  (needs playwright + a static server on :8123 serving www/)
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)(process.env.PW_PATH || 'playwright');
import fs from 'fs';
const out = process.env.SHOTS || '/tmp/pbshots'; fs.mkdirSync(out, { recursive: true });
const errors = []; let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2, acceptDownloads: true, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push('pageerror ' + e.message));
page.on('console', (m) => m.type() === 'error' && errors.push('console ' + m.text()));
await page.goto('http://localhost:8123/index.html');
const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });
const pin = async (p) => { for (const d of p) await page.click(`#lock .pad button:text-is("${d}")`); };

// --- setup PIN
await shot('01-setup');
await pin('1234'); await page.click('#lock .btn');
await page.waitForSelector('#lock h2:text("Confirm PIN")');
await pin('1234'); await page.click('#lock .btn');
await page.waitForSelector('.top');
ok(true, 'PIN setup → main screen');
await shot('02-empty');

// --- add Persian contact
const addContact = async (first, last, phone, email, addr, company) => {
  await page.click('.fab');
  await page.fill('input[placeholder="First name"]', first);
  await page.fill('input[placeholder="Last name"]', last);
  if (company) await page.fill('input[placeholder="Company"]', company);
  await page.click('text=＋ Add phone'); await page.fill('input[placeholder="Phone number"]', phone);
  if (email) { await page.click('text=＋ Add email'); await page.fill('input[placeholder="Email"]', email); }
  if (addr) { await page.click('text=＋ Add address'); await page.fill('textarea[placeholder^="Street"]', addr); }
  await page.click('.ov .btn:text-is("Save")');
  await page.waitForSelector('.top');
};
await addContact('علی', 'رضایی', '۰۹۱۲۳۴۵۶۷۸۹', 'ali@example.com', 'تهران، خیابان آزادی، پلاک ۱۲', 'شرکت نمونه');
await addContact('Sara', 'Miller', '+1 555 123 4567', 'sara@work.com', '12 Main St, Springfield', 'Acme');
await addContact('Bob', 'Zed', '0935 111 2222', '', '', '');
ok((await page.locator('.row-item').count()) === 3, '3 contacts listed');
await shot('03-list');

// --- search (Persian digits ↔ latin digits, Arabic yeh)
await page.click('button[aria-label="Search"]');
await page.fill('.search input', '0912');
ok((await page.locator('.row-item').count()) === 1, 'search latin digits finds Persian-digit phone');
await page.fill('.search input', '۰۹۳۵');
ok((await page.locator('.row-item').count()) === 1, 'search Persian digits finds latin phone');
await page.fill('.search input', 'رضايي'); // Arabic yeh
ok((await page.locator('.row-item').count()) === 1, 'search Arabic yeh matches Persian yeh');
await page.fill('.search input', 'springfield');
ok((await page.locator('.row-item').count()) === 1, 'search address text');
await shot('04-search');
await page.fill('.search input', ''); await page.click('button[aria-label="Search"]');

// --- detail
await page.click('.row-item:has-text("علی")');
await page.waitForSelector('.hero h2');
await shot('05-detail');
ok(await page.locator('.hero h2').innerText() === 'علی رضایی', 'detail shows Persian name');
await page.click('button[aria-label="Back"]:visible');
await page.waitForSelector('.top');

// --- views
await page.click('button[aria-label="Change view"]'); await shot('06-cards');
await page.click('button[aria-label="Change view"]'); await shot('07-table');
ok((await page.locator('table th').count()) === 6, 'table view has 6 columns');
await page.click('button[aria-label="Change view"]');

// --- folders + note
await page.click('.nav button[data-tab=folders]');
await page.click('.fab');
await page.fill('.sheet input', 'Family'); await page.click('.sheet .btn');
await page.waitForSelector('.fcard:has-text("Family")');
await page.click('.fcard:has-text("Family")');
await page.click('button[aria-label="Add here"]');
await page.click('.seg button:has-text("Text note")');
await page.fill('input[placeholder^="Title"]', 'آدرس خانه');
await page.fill('textarea[placeholder^="Write"]', 'تهران، خیابان ولیعصر\nکوچه ۵');
await page.click('.ov .btn:text-is("Save")');
await page.waitForSelector('#flist .row-item');
ok((await page.locator('#flist .row-item').count()) === 1, 'note saved inside folder');
await shot('08-folder');
await page.click('button[aria-label="Back"]:visible');
await shot('09-folders');

// --- settings + exports
await page.click('.nav button[data-tab=settings]');
await shot('10-settings');
await page.click('.link:has-text("Backup & export")');
await shot('11-backup');
const exp = async (label) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.fmt:has(b:text-is("${label}")) .two button:first-child`)]); const p = `${out}/${d.suggestedFilename()}`; await d.saveAs(p); return p; };
const pj = await exp('JSON'); const j = JSON.parse(fs.readFileSync(pj, 'utf8'));
ok(j.data.entries.length === 4 && j.data.entries.some((e) => e.first === 'علی'), 'JSON backup has 4 entries incl. Persian');
const pt = await exp('TXT'); ok(fs.readFileSync(pt, 'utf8').includes('۰۹۱۲۳۴۵۶۷۸۹'), 'TXT contains Persian digits');
const pc = await exp('CSV'); ok(fs.readFileSync(pc, 'utf8').includes('Sara'), 'CSV has rows');
const pv = await exp('VCF'); ok(fs.readFileSync(pv, 'utf8').split('BEGIN:VCARD').length === 4, 'VCF has 3 cards');
const pp = await exp('PDF'); const pb = fs.readFileSync(pp); ok(pb.slice(0, 5).toString() === '%PDF-' && pb.includes('%%EOF'), 'PDF structure ok (' + pb.length + ' bytes)');
const pg = await exp('JPG'); const jb = fs.readFileSync(pg); ok(jb[0] === 0xff && jb[1] === 0xd8, 'JPG magic bytes (' + jb.length + ' bytes)');
fs.writeFileSync(`${out}/_page1.jpg`, jb);

// --- restore (replace) round trip after erasing
await page.click('button[aria-label="Back"]:visible');
await page.click('.link:has-text("Restore / import")');
await page.click('.seg button:has-text("Replace all")');
await page.setInputFiles('input[type=file]', pj);
await page.click('.dlg .btn:text-is("Replace")');
await page.waitForSelector('.top');
await page.click('.nav button[data-tab=contacts]');
ok((await page.locator('.row-item').count()) === 4, 'restore from JSON keeps 4 items');

// --- vcf import: round trip dedupe
await page.click('.nav button[data-tab=settings]');
await page.click('.link:has-text("Restore / import")');
await page.setInputFiles('input[type=file]', pv);
await page.waitForSelector('.top');
await page.click('.nav button[data-tab=contacts]');
ok((await page.locator('.row-item').count()) === 4, 'VCF re-import skips duplicates');

// --- trash
await page.click('.row-item:has-text("Bob")'); await page.click('button[aria-label="Delete"]');
await page.click('.dlg .btn:text-is("Move to Trash")'); await page.waitForSelector('.top');
ok((await page.locator('.row-item').count()) === 3, 'delete moves to trash');
await page.click('.nav button[data-tab=settings]'); await page.click('.link:has-text("Trash")');
await shot('12-trash');
await page.click('button.btn.sm:text-is("Restore")'); await page.click('button[aria-label="Back"]:visible');
await page.click('.nav button[data-tab=contacts]');
ok((await page.locator('.row-item').count()) === 4, 'restore from trash');

// --- dark theme + filter sheet
await page.click('button[aria-label="Filter and sort"]'); await shot('13-filter'); await page.click('.sheet .btn:text-is("Done")');
await page.click('.nav button[data-tab=settings]'); await page.click('.seg button:text-is("Dark")'); await shot('14-dark-settings');
await page.click('.nav button[data-tab=contacts]'); await shot('15-dark-list');

// --- lock on reload, wrong then right PIN
await page.reload(); await page.waitForSelector('#lock');
await pin('9999'); await page.click('#lock .btn'); await page.waitForSelector('#lock p:has-text("Wrong")');
await shot('16-wrong-pin');
await pin('1234'); await page.click('#lock .btn'); await page.waitForSelector('.top');
ok((await page.locator('.row-item').count()) === 4, 'data persists after reload + unlock');

ok(errors.length === 0, 'no console/page errors ' + (errors.length ? JSON.stringify(errors) : ''));
await browser.close();
console.log(fails ? `${fails} FAILED` : 'ALL PASSED'); process.exit(fails ? 1 : 0);
