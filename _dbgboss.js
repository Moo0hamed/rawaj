const puppeteer = require("puppeteer-core");
const BASE = "http://localhost:3015";
(async()=>{
 const b=await puppeteer.launch({executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:"new",args:["--no-sandbox","--disable-gpu"]});
 const p=await b.newPage();
 await p.evaluateOnNewDocument(()=>{try{sessionStorage.setItem("rawaj-intro-seen","1");sessionStorage.setItem("rawaj-mascot-off","1");localStorage.setItem("rawaj-intro-hidden","1")}catch(e){}});
 await p.goto(BASE+"/ar",{waitUntil:"networkidle2"});
 // set state at stage 7 (after launch) ready for boss
 await p.evaluate(()=>{
   const state={xp:130,coins:11,completed:[],trapsSeen:[],soundOn:false,motionOn:false,trapsOn:false,introHidden:true,name:"نقطة",campaign:{stage:7,view:7,brandName:"نقطة",palette:["#2391FF","#FFF83F"],strategy:["audience","goal","channel","budget"],calendar:{0:"reel-tip",1:"story-poll",2:"post-offer",3:"reel-bts",4:"story-launch"},budget:{meta:4000,tiktok:3000,google:3000},engagement:50,reach:2000,clicks:50,sales:2,report:{strengthKeys:["identity","strategy","community"],serviceSlug:"promotion"},bossDone:false,replayWatched:[],teamOpened:["sobhi-saqr","mohamed-amer"]}};
   localStorage.setItem("rawaj-game-v1", JSON.stringify(state));
 });
 await p.reload({waitUntil:"networkidle2"}); await new Promise(r=>setTimeout(r,1200));
 console.log("before", await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem("rawaj-game-v1")); return {xp:s.xp,boss:s.campaign.bossDone,stage:s.campaign.stage};}));
 const boss = await p.evaluate(()=>{const el=document.getElementById("boss"); return {has:!!el, txt:(document.body.innerText||"").includes("ابدأ مشروعك الحقيقي")};});
 console.log("boss", JSON.stringify(boss));
 await p.evaluate(()=>{const root=document.getElementById("boss")||document; const tel=[...root.querySelectorAll("a")].find(a=>(a.getAttribute("href")||"").startsWith("tel:")); if(tel) tel.click();});
 await new Promise(r=>setTimeout(r,1200));
 console.log("after", await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem("rawaj-game-v1")); return {xp:s.xp,boss:s.campaign.bossDone,coins:s.coins};}));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});