const puppeteer = require("puppeteer-core");
const BASE = process.env.BASE_URL || "http://localhost:3015";
(async()=>{
 const b=await puppeteer.launch({executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:"new",args:["--no-sandbox","--disable-gpu"]});
 const p=await b.newPage();
 const errs=[]; p.on("pageerror",e=>errs.push(e.message)); p.on("console",m=>{if(m.type()==="error")errs.push(m.text())});
 await p.evaluateOnNewDocument(()=>{try{sessionStorage.setItem("rawaj-intro-seen","1");sessionStorage.setItem("rawaj-mascot-off","1");localStorage.setItem("rawaj-intro-hidden","1")}catch(e){}});
 await p.goto(BASE+"/ar",{waitUntil:"networkidle2"}); await p.evaluate(()=>localStorage.removeItem("rawaj-game-v1")); await p.reload({waitUntil:"networkidle2"}); await new Promise(r=>setTimeout(r,900));
 const click = (t)=>p.evaluate((label)=>{const b=[...document.querySelectorAll("button,a")].find(x=>(x.textContent||"").includes(label)); if(b){b.click();return true}return false},t);
 const state = ()=>p.evaluate(()=>JSON.parse(localStorage.getItem("rawaj-game-v1")||"null"));
 // identity
 await p.type("#brand-name","نقطة"); await click("أزرق رَواج"); await new Promise(r=>setTimeout(r,120)); await click("أصفر رَواج"); await new Promise(r=>setTimeout(r,150)); await click("اعتمد الهوية"); await new Promise(r=>setTimeout(r,1100));
 console.log("S0", JSON.stringify({stage:(await state())?.campaign?.stage,xp:(await state())?.xp}));
 await click("المرحلة التالية"); await new Promise(r=>setTimeout(r,900));
 // strategy
 async function readStrat(){ return p.evaluate(()=>{const map=[["audience","الجمهور المستهدف"],["goal","الهدف"],["channel","القناة"],["budget","الميزانية"]]; const ol=[...document.querySelectorAll("ol")].find(o=>map.every(m=>(o.textContent||"").includes(m[1]))); if(!ol) return null; return [...ol.querySelectorAll(":scope>li")].map(li=>{const t=li.textContent||"";return (map.find(m=>t.includes(m[1]))||[])[0]});}); }
 async function up(id){ const lbl={audience:"الجمهور المستهدف",goal:"الهدف",channel:"القناة",budget:"الميزانية"}[id]; await p.evaluate((kw)=>{const map=["الجمهور المستهدف","الهدف","القناة","الميزانية"]; const ol=[...document.querySelectorAll("ol")].find(o=>map.every(k=>(o.textContent||"").includes(k))); const li=[...ol.querySelectorAll(":scope>li")].find(el=>(el.textContent||"").includes(kw)); const btn=li&&li.querySelector('button[aria-label*="لأعلى"]'); if(btn) btn.click();},lbl); await new Promise(r=>setTimeout(r,350)); }
 const want=["audience","goal","channel","budget"];
 for(let g=0;g<40;g++){ const c=await readStrat(); if(!c) {console.log("no-ol");break;} if(JSON.stringify(c)===JSON.stringify(want)) break; let acted=false; for(let i=0;i<4;i++){ const c2=await readStrat(); const idx=c2.indexOf(want[i]); if(idx>i){ await up(want[i]); acted=true; break; } } if(!acted){console.log("stuck",c); break;} }
 console.log("STRAT_UI", JSON.stringify(await readStrat()));
 await click("اختبر الخطة"); await new Promise(r=>setTimeout(r,1200));
 console.log("S1", JSON.stringify({stage:(await state())?.campaign?.stage,strat:(await state())?.campaign?.strategy,xp:(await state())?.xp, alert: await p.evaluate(()=>{const e=document.querySelector('[role="alert"]');return e?e.textContent:null})}));
 if((await state())?.campaign?.stage < 2){ await b.close(); process.exit(0); }
 await click("المرحلة التالية"); await new Promise(r=>setTimeout(r,900));
 // calendar
 const pairs=[["ريل: نصيحة سريعة","الأحد"],["ستوري: استطلاع","الاثنين"],["بوست: عرض محدود","الثلاثاء"],["ريل: خلف الكواليس","الأربعاء"],["ستوري: إطلاق منتج","الخميس"]];
 for(const [it,dy] of pairs){
   await p.evaluate((label)=>{const b=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").includes(label) && x.getAttribute("draggable")==="true"); if(b) b.click();},it);
   await new Promise(r=>setTimeout(r,250));
   await p.evaluate((day)=>{const b=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").trim().startsWith(day) && (x.className||"").includes("min-h")); if(b) b.click();},dy);
   await new Promise(r=>setTimeout(r,300));
   const c=await state(); console.log("placed", it, dy, Object.keys(c?.campaign?.calendar||{}).length);
 }
 await click("جدول الأسبوع"); await new Promise(r=>setTimeout(r,1200));
 console.log("S2", JSON.stringify({stage:(await state())?.campaign?.stage,cal:Object.keys((await state())?.campaign?.calendar||{}),xp:(await state())?.xp, alert: await p.evaluate(()=>{const e=document.querySelector('[role="alert"]');return e?e.textContent:null})}));
 if((await state())?.campaign?.stage < 3){ await b.close(); process.exit(0); }
 await click("المرحلة التالية"); await new Promise(r=>setTimeout(r,900));
 // ads
 await p.evaluate(()=>{const vals=[4000,3000,3000]; const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set; [...document.querySelectorAll('input[type="range"]')].forEach((s,i)=>{set.call(s,String(vals[i])); s.dispatchEvent(new Event("input",{bubbles:true})); s.dispatchEvent(new Event("change",{bubbles:true}));});});
 await new Promise(r=>setTimeout(r,400)); await click("أطلق الحملة"); await new Promise(r=>setTimeout(r,1200));
 console.log("S3", JSON.stringify({stage:(await state())?.campaign?.stage,reach:(await state())?.campaign?.reach,xp:(await state())?.xp, alert: await p.evaluate(()=>{const e=document.querySelector('[role="alert"]');return e?e.textContent:null})}));
 if((await state())?.campaign?.stage < 4){ await b.close(); process.exit(0); }
 await click("المرحلة التالية"); await new Promise(r=>setTimeout(r,1500));
 console.log("S4", JSON.stringify({stage:(await state())?.campaign?.stage,xp:(await state())?.xp, txt: await p.evaluate(()=>((document.body.innerText||"").includes("تم تجاوز المرحلة تلقائيًا")))}));
 if((await state())?.campaign?.stage < 5){ await b.close(); process.exit(0); }
 await click("المرحلة التالية"); await new Promise(r=>setTimeout(r,900));
 await p.evaluate(()=>{const b=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").includes("صبحي")); if(b) b.click();}); await new Promise(r=>setTimeout(r,350));
 await p.evaluate(()=>{const b=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").includes("محمد عامر")); if(b) b.click();}); await new Promise(r=>setTimeout(r,1000));
 console.log("S5", JSON.stringify({stage:(await state())?.campaign?.stage,team:(await state())?.campaign?.teamOpened,xp:(await state())?.xp}));
 if((await state())?.campaign?.stage < 6){ await b.close(); process.exit(0); }
 await click("المرحلة التالية"); await new Promise(r=>setTimeout(r,900));
 await click("أطلق براندك"); await new Promise(r=>setTimeout(r,1600));
 console.log("S6", JSON.stringify({stage:(await state())?.campaign?.stage,report:(await state())?.campaign?.report,xp:(await state())?.xp,coins:(await state())?.coins}));
 if((await state())?.campaign?.stage < 7){ await b.close(); process.exit(0); }
 await click("المرحلة التالية"); await new Promise(r=>setTimeout(r,1000));
 console.log("S7view", JSON.stringify({boss: await p.evaluate(()=>!!document.getElementById("boss")), txt: await p.evaluate(()=>((document.body.innerText||"").includes("ابدأ مشروعك الحقيقي")))}));
 await p.evaluate(()=>{const root=document.getElementById("boss")||document; const wa=[...root.querySelectorAll("a")].find(a=>(a.getAttribute("href")||"").includes("wa.me/201024345291")); if(wa) wa.click();}); await new Promise(r=>setTimeout(r,1000));
 console.log("S7", JSON.stringify({bossDone:(await state())?.campaign?.bossDone,xp:(await state())?.xp,coins:(await state())?.coins}));
 await p.reload({waitUntil:"networkidle2"}); await new Promise(r=>setTimeout(r,1000));
 console.log("PERSIST", JSON.stringify({stage:(await state())?.campaign?.stage,boss:(await state())?.campaign?.bossDone,xp:(await state())?.xp}));
 console.log("ERRS", JSON.stringify(errs.slice(0,5)));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});