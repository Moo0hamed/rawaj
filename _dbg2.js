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
 // strategy - read order and fix
 const beforeStrat = await p.evaluate(()=>[...document.querySelectorAll("li")].map(li=>(li.textContent||"").trim().slice(0,30)));
 console.log("STRAT_BEFORE", JSON.stringify(beforeStrat));
 await p.evaluate(()=>{
   function up(label,times){ for(let i=0;i<times;i++){ const li=[...document.querySelectorAll("li")].find(el=>(el.textContent||"").includes(label)); const btn=li&&li.querySelector('button[aria-label="تحريك لأعلى"]'); if(btn) btn.click(); } }
   up("الجمهور المستهدف",5); up("الهدف",5);
 });
 await new Promise(r=>setTimeout(r,300));
 const midStrat = await p.evaluate(()=>[...document.querySelectorAll("li")].map(li=>(li.textContent||"").trim().slice(0,30)));
 console.log("STRAT_MID", JSON.stringify(midStrat));
 await clickBtn("اختبر الخطة");
 await new Promise(r=>setTimeout(r,900));
 const afterStrat=await p.evaluate(()=>{const r=localStorage.getItem("rawaj-game-v1"); const st=r?JSON.parse(r):null; return {stage:st?.campaign?.stage,xp:st?.xp,strat:st?.campaign?.strategy, alert:(document.querySelector('[role="alert"]')||{}).textContent||null};});
 console.log("STRAT_AFTER", JSON.stringify(afterStrat));
 if(afterStrat.stage<2){
   // try different clicks
   await p.evaluate(()=>{ function up(label,times){ for(let i=0;i<times;i++){ const li=[...document.querySelectorAll("li")].find(el=>(el.textContent||"").includes(label)); const btn=li&&li.querySelector('button[aria-label="تحريك لأعلى"]'); if(btn) btn.click(); } } up("الهدف",5); up("الجمهور المستهدف",5);});
   await new Promise(r=>setTimeout(r,300));
   await clickBtn("اختبر الخطة"); await new Promise(r=>setTimeout(r,900));
   const retry=await p.evaluate(()=>{const r=localStorage.getItem("rawaj-game-v1"); const st=r?JSON.parse(r):null; return {stage:st?.campaign?.stage,strat:st?.campaign?.strategy, alert:(document.querySelector('[role="alert"]')||{}).textContent||null, order:[...document.querySelectorAll("li")].map(li=>(li.textContent||"").trim().slice(0,30))};});
   console.log("STRAT_RETRY", JSON.stringify(retry));
 }
 // go to calendar if reached
 if(afterStrat.stage>=2 || (await p.evaluate(()=>{const r=localStorage.getItem("rawaj-game-v1");return (JSON.parse(r||"{}").campaign||{}).stage>=2}))){
   await clickBtn("المرحلة التالية"); await new Promise(r=>setTimeout(r,800));
   const dayInfo = await p.evaluate(()=>[...document.querySelectorAll("button")].filter(b=>(b.className||"").includes("min-h")).map(b=>({t:(b.textContent||"").trim().slice(0,20), cls:(b.className||"").slice(0,60)})));
   const itemInfo = await p.evaluate(()=>[...document.querySelectorAll("button")].filter(b=>b.getAttribute("draggable")==="true").map(b=>({t:(b.textContent||"").trim().slice(0,30)})));
   console.log("DAYS", JSON.stringify(dayInfo));
   console.log("ITEMS", JSON.stringify(itemInfo));
   const items=["ريل: نصيحة سريعة","ستوري: استطلاع","بوست: عرض محدود","ريل: خلف الكواليس","ستوري: إطلاق منتج"];
   const days=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس"];
   for(let i=0;i<5;i++){
     await p.evaluate((it,dy)=>{
       const item=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").includes(it));
       if(item) item.click();
       const day=[...document.querySelectorAll("button")].find(x=>{ const txt=(x.textContent||"").trim(); return txt.startsWith(dy) && (x.className||"").includes("min-h"); });
       if(day) day.click();
     }, items[i], days[i]);
     await new Promise(r=>setTimeout(r,200));
   }
   const calState=await p.evaluate(()=>{const r=localStorage.getItem("rawaj-game-v1"); const st=r?JSON.parse(r):null; return {cal:st?.campaign?.calendar, stage:st?.campaign?.stage};});
   console.log("CAL_STATE", JSON.stringify(calState));
   await clickBtn("جدول الأسبوع"); await new Promise(r=>setTimeout(r,1000));
   const calAfter=await p.evaluate(()=>{const r=localStorage.getItem("rawaj-game-v1"); const st=r?JSON.parse(r):null; return {stage:st?.campaign?.stage,xp:st?.xp,alert:(document.querySelector('[role="alert"]')||{}).textContent||null};});
   console.log("CAL_AFTER", JSON.stringify(calAfter));
 }
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});