
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
const chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir=path.resolve('assets/inspiration');
await fs.mkdir(outDir,{recursive:true});
const browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--disable-gpu']});
async function shot(url, file, {mobile=false, before}={}){
  const page=await browser.newPage();
  if(mobile){ await page.setViewport({width:390,height:844,deviceScaleFactor:3,isMobile:true,hasTouch:true}); }
  else { await page.setViewport({width:1440,height:900,deviceScaleFactor:1}); }
  await page.goto(url,{waitUntil:'networkidle2',timeout:60000});
  if(before) await before(page);
  await new Promise(r=>setTimeout(r,1400));
  await page.screenshot({path:path.join(outDir,file),fullPage:false});
  await page.close();
  console.log('ok',file);
}
async function setStage(page, stage){
  await page.evaluate((stage)=>{
    const raw=localStorage.getItem('rawaj-game-v1');
    const base=raw?JSON.parse(raw):{xp:200,coins:50,completed:[0,1,2,3],trapsSeen:[],soundOn:false,motionOn:true,trapsOn:false,introHidden:true,simpleMode:false,campaign:{}};
    base.campaign=base.campaign||{};
    base.campaign.stage=stage; base.campaign.view='campaign';
    base.campaign.brandName=base.campaign.brandName||'RAWAJ';
    base.campaign.palette=base.campaign.palette?.length?base.campaign.palette:['#2391FF','#FFF83F'];
    base.campaign.strategy=base.campaign.strategy?.length===4?base.campaign.strategy:['audience','goal','channel','budget'];
    base.campaign.calendar=base.campaign.calendar||[];
    base.campaign.budget=base.campaign.budget||{meta:4000,tiktok:3000,google:3000};
    base.completed=Array.from(new Set([...(base.completed||[]),0,1,2,3,4,5,6].slice(0,stage)));
    localStorage.setItem('rawaj-game-v1',JSON.stringify(base));
  },stage);
  await page.goto('http://localhost:3000/ar',{waitUntil:'networkidle2',timeout:60000});
  await page.waitForSelector('[data-stage], .campaign-shell, main', {timeout:10000}).catch(()=>{});
  await new Promise(r=>setTimeout(r,1600));
}
await shot('http://localhost:3000/ar/contact','step2-contact-desktop.png',{});
await shot('http://localhost:3000/ar/contact','step2-contact-mobile.png',{mobile:true});
await shot('http://localhost:3000/ar','step2-social-desktop.png',{before:async(p)=>{await setStage(p,2);}});
await shot('http://localhost:3000/ar','step2-social-mobile.png',{mobile:true,before:async(p)=>{await setStage(p,2);}});
await shot('http://localhost:3000/ar','step2-ads-desktop.png',{before:async(p)=>{await setStage(p,3);}});
await shot('http://localhost:3000/ar','step2-ads-mobile.png',{mobile:true,before:async(p)=>{await setStage(p,3);}});
await browser.close();
