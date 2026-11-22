const puppeteer = require('puppeteer-core');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const base = 'http://localhost:3199/ar/campaign';
async function setView(page, view) {
  await page.evaluate((v) => {
    const key = 'rawaj-game-v1';
    let data = {};
    try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
    data.campaign = data.campaign || {};
    data.campaign.view = v;
    data.campaign.stage = Math.max(data.campaign.stage || 0, v);
    data.introHidden = true;
    localStorage.setItem(key, JSON.stringify(data));
    sessionStorage.setItem('rawaj-intro-seen', '1');
  }, view);
}
(async () => {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  for (const [view, name] of [[0,'stage1'],[1,'stage2'],[2,'stage3']]) {
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await setView(page, view);
    await page.goto(base, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r=>setTimeout(r,1800));
    await page.screenshot({ path: `assets/inspiration/pixel-${name}-desktop.png`, fullPage: false });
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true });
    await new Promise(r=>setTimeout(r,700));
    await page.screenshot({ path: `assets/inspiration/pixel-${name}-mobile.png`, fullPage: false });
  }
  await browser.close();
  console.log('ok');
})().catch(e=>{ console.error(e); process.exit(1); });
