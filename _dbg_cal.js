const puppeteer = require("puppeteer-core");
(async()=>{
 const b=await puppeteer.launch({executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:"new",args:["--no-sandbox","--disable-gpu"]});
 const p=await b.newPage();
 await p.evaluateOnNewDocument(()=>{try{sessionStorage.setItem("rawaj-intro-seen","1");sessionStorage.setItem("rawaj-mascot-off","1");localStorage.setItem("rawaj-intro-hidden","1")}catch(e){}});
 await p.goto("http://localhost:3015/ar",{waitUntil:"networkidle2"});
 await p.evaluate(()=>{try{localStorage.removeItem("rawaj-game-v1")}catch(e){}});
 await p.reload({waitUntil:"networkidle2"});
 await new Promise(r=>setTimeout(r,800));
 const clickBtn = async (t)=> p.evaluate((label)=>{const b=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").includes(label)); if(b){b.click();return true} return false;},t);
 await p.type("#brand-name","نقطة");
 await clickBtn("أزرق رَواج"); await clickBtn("أصفر رَواج");
 await new Promise(r=>setTimeout(r,150));
 await clickBtn("اعتمد الهوية");
 await new Promise(r=>setTimeout(r,900));
 await clickBtn("المرحلة التالية");
 await new Promise(r=>setTimeout(r,700));
 // strategy
 await p.evaluate(()=>{
   function up(label,times){ for(let i=0;i<times;i++){ const li=[...document.querySelectorAll("li")].find(el=>(el.textContent||"").includes(label)); const btn=li&&li.querySelector('button[aria-label="تحريك لأعلى"]'); if(btn) btn.click(); } }
   up("الجمهور المستهدف",4); up("الهدف",3);
 });
 await new Promise(r=>setTimeout(r,300));
 await clickBtn("اختبر الخطة");
 await new Promise(r=>setTimeout(r,900));
 await clickBtn("المرحلة التالية");
 await new Promise(r=>setTimeout(r,800));
 const items=["ريل: نصيحة سريعة","ستوري: استطلاع","بوست: عرض محدود","ريل: خلف الكواليس","ستوري: إطلاق منتج"];
 const days=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس"];
 for(let i=0;i<5;i++){
   await p.evaluate((it)=>{ const b=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").includes(it) && x.getAttribute("draggable")==="true"); if(b) b.click(); }, items[i]);
   await new Promise(r=>setTimeout(r,180));
   await p.evaluate((dy)=>{ const d=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").trim().startsWith(dy) && (x.className||"").includes("min-h")); if(d) d.click(); }, days[i]);
   await new Promise(r=>setTimeout(r,220));
 }
 const before=await p.evaluate(()=>{const r=localStorage.getItem("rawaj-game-v1"); const st=r?JSON.parse(r):null; return {stage:st?.campaign?.stage,xp:st?.xp,cal:st?.campaign?.calendar,eng:st?.campaign?.engagement, body:(document.body.innerText||"").slice(-800)};});
 console.log("BEFORE_SUBMIT", JSON.stringify(before));
 await clickBtn("جدول الأسبوع");
 await new Promise(r=>setTimeout(r,1200));
 const after=await p.evaluate(()=>{const r=localStorage.getItem("rawaj-game-v1"); const st=r?JSON.parse(r):null; return {stage:st?.campaign?.stage,xp:st?.xp,cal:st?.campaign?.calendar,eng:st?.campaign?.engagement, alert:(document.querySelector('[role="alert"]')||{}).textContent||null};});
 console.log("AFTER_SUBMIT", JSON.stringify(after));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});