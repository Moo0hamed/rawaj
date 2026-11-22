
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
const chrome='C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir=path.resolve('screenshots/step4');
await fs.mkdir(outDir,{recursive:true});
const browser=await puppeteer.launch({executablePath:chrome,headless:'new',args:['--no-sandbox','--disable-gpu']});
async function setStage(page, stage){
  await page.evaluate((stage)=>{
    const raw=localStorage.getItem('rawaj-game-v1');
    const base=raw?JSON.parse(raw):{xp:0,coins:0,completed:[],trapsSeen:[],soundOn:true,motionOn:true,trapsOn:true,introHidden:true,simpleMode:false,campaign:{}};
    base.campaign=base.campaign||{};
    base.campaign.stage=stage; base.campaign.view=stage;
    base.campaign.brandName=base.campaign.brandName||'';
    base.campaign.palette=base.campaign.palette?.length?base.campaign.palette:[];
    base.campaign.strategy=base.campaign.strategy?.length===4?base.campaign.strategy:['audience','goal','channel','budget'];
    base.campaign.calendar=base.campaign.calendar||{};
    base.campaign.budget=base.campaign.budget||{meta:0,tiktok:0,google:0};
    base.completed=base.completed||[];
    localStorage.setItem('rawaj-game-v1',JSON.stringify(base));
  },stage);
  await page.goto('http://localhost:3000/ar/campaign',{waitUntil:'networkidle2',timeout:60000});
  await new Promise(r=>setTimeout(r,1500));
}
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
// T2 Home/Identity (stage 0)
await shot('http://localhost:3000/ar/campaign','t2-home-desktop.png',{before:async(p)=>{await setStage(p,0);}});
await shot('http://localhost:3000/ar/campaign','t2-home-mobile.png',{mobile:true,before:async(p)=>{await setStage(p,0);}});
// Also home page
await shot('http://localhost:3000/ar','t2-home-page-desktop.png',{});
await shot('http://localhost:3000/ar','t2-home-page-mobile.png',{mobile:true});
await browser.close(); console.log('all done');
