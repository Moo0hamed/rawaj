const puppeteer = require('puppeteer-core');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
(async () => {
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args:['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('page:'+e.message));
  page.on('console', msg => { if (msg.type()==='error') errs.push('console:'+msg.text()); });
  const res = await page.goto('http://localhost:3198/admin/setup', { waitUntil:'networkidle2', timeout: 60000 });
  await new Promise(r=>setTimeout(r,1500));
  console.log('status', res.status(), 'url', page.url());
  console.log('body', (await page.content()).slice(0,400));
  console.log('errs', errs.slice(0,5));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
