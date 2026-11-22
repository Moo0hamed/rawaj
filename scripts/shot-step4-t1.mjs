
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
  await new Promise(r=>setTimeout(r,1500));
  await page.screenshot({path:path.join(outDir,file),fullPage:false});
  await page.close();
  console.log('ok',file);
}
// T1 Intro - need to reset intro seen to show it
const page=await browser.newPage();
await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
await page.goto('http://localhost:3000/ar',{waitUntil:'networkidle2',timeout:60000});
await page.evaluate(()=>{ sessionStorage.removeItem('rawaj-intro-seen'); localStorage.removeItem('rawaj-intro-hidden'); });
await page.reload({waitUntil:'networkidle2',timeout:60000});
await new Promise(r=>setTimeout(r,800));
await page.screenshot({path:path.join(outDir,'t1-intro-desktop.png'),fullPage:false});
await page.close();

const page2=await browser.newPage();
await page2.setViewport({width:375,height:812,deviceScaleFactor:3,isMobile:true,hasTouch:true});
await page2.goto('http://localhost:3000/ar',{waitUntil:'networkidle2',timeout:60000});
await page2.evaluate(()=>{ sessionStorage.removeItem('rawaj-intro-seen'); localStorage.removeItem('rawaj-intro-hidden'); });
await page2.reload({waitUntil:'networkidle2',timeout:60000});
await new Promise(r=>setTimeout(r,800));
await page2.screenshot({path:path.join(outDir,'t1-intro-mobile.png'),fullPage:false});
await page2.close();

await browser.close(); console.log('all done');
