
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
const chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir=path.resolve('screenshots/step4');
await fs.mkdir(outDir,{recursive:true});
const browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--disable-gpu']});
async function shot(url, file, {w=1440,h=900,mobile=false}={}){
  const page=await browser.newPage();
  if(mobile){ await page.setViewport({width:375,height:812,deviceScaleFactor:3,isMobile:true,hasTouch:true}); }
  else { await page.setViewport({width:w,height:h,deviceScaleFactor:1}); }
  await page.goto(url,{waitUntil:'networkidle2',timeout:60000});
  await new Promise(r=>setTimeout(r,1200));
  await page.screenshot({path:path.join(outDir,file),fullPage:false});
  await page.close();
  console.log('ok',file);
}
// T10 Horror/404 page
await shot('http://localhost:3000/ar/not-found','t10-horror-404-desktop.png',{});
await shot('http://localhost:3000/ar/not-found','t10-horror-404-mobile.png',{mobile:true});
await browser.close(); console.log('all done');
