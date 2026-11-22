const puppeteer = require("puppeteer-core");
const BASE = "http://localhost:3015";
(async()=>{
 const b=await puppeteer.launch({executablePath:"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",headless:"new",args:["--no-sandbox","--disable-gpu"]});
 const p=await b.newPage();
 await p.evaluateOnNewDocument(()=>{try{sessionStorage.setItem("rawaj-intro-seen","1");sessionStorage.setItem("rawaj-mascot-off","1");localStorage.setItem("rawaj-intro-hidden","1")}catch(e){}});
 await p.goto(BASE+"/ar",{waitUntil:"networkidle2"});
 await p.evaluate(()=>{try{localStorage.removeItem("rawaj-game-v1")}catch(e){}});
 await p.reload({waitUntil:"networkidle2"}); await new Promise(r=>setTimeout(r,800));
 const click = (t)=>p.evaluate((label)=>{const b=[...document.querySelectorAll("button")].find(x=>(x.textContent||"").includes(label)); if(b){b.click();return true}return false},t);
 const state = ()=>p.evaluate(()=>JSON.parse(localStorage.getItem("rawaj-game-v1")||"null"));
 await p.type("#brand-name","نقطة"); await click("أزرق رَواج"); await new Promise(r=>setTimeout(r,120)); await click("أصفر رَواج"); await new Promise(r=>setTimeout(r,150)); await click("اعتمد الهوية"); await new Promise(r=>setTimeout(r,1100));
 await click("المرحلة التالية"); await new Promise(r=>setTimeout(r,900));
 // strategy robust
 for(let g=0;g<40;g++){
   const cur=await p.evaluate(()=>{const map=[["audience","الجمهور المستهدف"],["goal","الهدف"],["channel","القناة"],["budget","الميزانية"]]; const ol=[...document.querySelectorAll("ol")].find(o=>map.every(m=>(o.textContent||"").includes(m[1]))); if(!ol) return []; return [...ol.querySelectorAll(":scope>li")].map(li=>{const t=li.textContent||"";return (map.find(m=>t.includes(m[1]))||[])[0]});});
   const want=["audience","goal","channel","budget"]; if(JSON.stringify(cur)===JSON.stringify(want)) break;
   let moved=false; for(let i=0;i<4;i++){ const c=await p.evaluate(()=>{const map=[["audience","الجمهور المستهدف"],["goal","الهدف"],["channel","القناة"],["budget","الميزانية"]]; const ol=[...document.querySelectorAll("ol")].find(o=>map.every(m=>(o.textContent||"").includes(m[1]))); return [...ol.querySelectorAll(":scope>li")].map(li=>{const t=li.textContent||"";return (map.find(m=>t.includes(m[1]))||[])[0]});}); const idx=c.indexOf(want[i]); if(idx>i){ const lbl={audience:"الجمهور المستهدف",goal:"الهدف",channel:"القناة",budget:"الميزانية"}[want[i]]; await p.evaluate((kw)=>{const map=["الجمهور المستهدف","الهدف","القناة","الميزانية"]; const ol=[...document.querySelectorAll("ol")].find(o=>map.every(k=>(o.textContent||"").includes(k))); const li=[...ol.querySelectorAll(":scope>li")].find(el=>(el.textContent||"").includes(kw)); const btn=li&&li.querySelector('button[aria-label*="لأعلى"]'); if(btn) btn.click();},lbl); await new Promise(r=>setTimeout(r,350)); moved=true; break; } } if(!moved) break;
 }
 await click("اختبر الخطة"); await new Promise(r=>setTimeout(r,1200));
 console.log("after strat", (await state())?.campaign?.stage, (await state())?.xp);
 await click("المرحلة التالية"); await new Promise(r=>setTimeout(r,900));
 // calendar - place by selecting then clicking day; ensure draggable item
 const pairs=[["ريل: نصيحة سريعة","الأحد"],["ستوري: استطلاع","الاثنين"],["بوست: عرض محدود","الثلاثاء"],["ريل: خلف الكواليس","الأربعاء"],["ستوري: إطلاق منتج","الخميس"]];
 for(const [it,dy] of pairs){
   await p.evaluate((label)=>{const b=[...document.querySelectorAll("button")].filter(x=>(x.textContent||"").includes(label)).find(x=>x.getAttribute("draggable")==="true") || [...document.querySelectorAll("button")].find(x=>(x.textContent||"").includes(label)); if(b) b.click();},it);
   await new Promise(r=>setTimeout(r,350));
   await p.evaluate((day)=>{const b=[...document.querySelectorAll("button")].find(x=>{const t=(x.textContent||"").trim(); return t.startsWith(day) && (x.className||"").includes("min-h");}); if(b) b.click();},dy);
   await new Promise(r=>setTimeout(r,400));
 }
 console.log("cal", JSON.stringify((await state())?.campaign?.calendar));
 await click("جدول الأسبوع"); await new Promise(r=>setTimeout(r,1200));
 console.log("after cal", (await state())?.campaign?.stage, (await state())?.xp);
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});