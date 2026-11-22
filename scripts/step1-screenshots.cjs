const puppeteer = require('puppeteer-core');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const base = 'http://localhost:3197/ar/campaign';
async function setState(page, view) {
  await page.evaluate((v) => {
    const key = 'rawaj-game-v1';
    let data = {};
    try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
    data.campaign = data.campaign || {};
    data.campaign.view = v;
    data.campaign.stage = Math.max(data.campaign.stage || 0, 7);
    data.introHidden = true; data.simpleMode = false;
    localStorage.setItem(key, JSON.stringify(data));
    sessionStorage.setItem('rawaj-intro-seen', '1');
  }, view);
}
async function snap(page, view, name) {
  await page.setViewport({ width:1440, height:900, deviceScaleFactor:1 });
  await page.goto(base, { waitUntil:'domcontentloaded', timeout:90000 });
  await setState(page, view);
  await page.goto(base, { waitUntil:'domcontentloaded', timeout:90000 });
  await page.waitForSelector('[data-hud="true"]', { timeout: 60000 });
  await new Promise(r=>setTimeout(r,2200));
  await page.screenshot({ path: `assets/inspiration/step1-${name}-desktop.png`, fullPage:false });
  await page.setViewport({ width:390, height:844, deviceScaleFactor:3, isMobile:true });
  await new Promise(r=>setTimeout(r,900));
  await page.screenshot({ path: `assets/inspiration/step1-${name}-mobile.png`, fullPage:false });
}
(async () => {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args:['--no-sandbox','--disable-gpu'] });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(90000);
  await snap(page,0,'home');
  await snap(page,3,'ads-sample');
  await snap(page,7,'contact-sample');
  await page.setViewport({ width:1440, height:900, deviceScaleFactor:1, isMobile:false });
  await page.goto(base, { waitUntil:'domcontentloaded', timeout:90000 });
  await page.evaluate(() => { const key='rawaj-game-v1'; let data={}; try{data=JSON.parse(localStorage.getItem(key)||'{}')}catch{}; data.simpleMode=true; data.introHidden=true; data.campaign=data.campaign||{}; data.campaign.view=0; localStorage.setItem(key,JSON.stringify(data)); sessionStorage.setItem('rawaj-intro-seen','1'); });
  await page.goto(base, { waitUntil:'domcontentloaded', timeout:90000 });
  await page.waitForSelector('[data-hud="true"]', { timeout: 60000 });
  await new Promise(r=>setTimeout(r,1500));
  await page.screenshot({ path: 'assets/inspiration/step1-simple-desktop.png', fullPage:false });
  await browser.close();
  console.log('ok');
})().catch(e=>{ console.error(e.stack||e.message); process.exit(1); });