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
 await new Promise(r=>setTimeout(r,800));
 // strategy: desired order audience, goal, channel, budget
 async function moveUp(label){
   return p.evaluate((lbl)=>{
     const lis=[...document.querySelectorAll("li")];
     const li=lis.find(el=>(el.textContent||"").includes(lbl));
     const btn=li&&li.querySelector('button[aria-label="تحريك لأعلى"]');
     if(btn && !btn.disabled){ btn.click(); return true; } return false;
   }, label);
 }
 async function readOrder(){
   return p.evaluate(()=>[...document.querySelectorAll("li")].slice(0,4).map(li=>{const t=(li.textContent||""); if(t.includes("الجمهور")) return "audience"; if(t.includes("الهدف")) return "goal"; if(t.includes("القناة")) return "channel"; if(t.includes("الميزانية")) return "budget"; return t.slice(0,10);}));
 }
 const want=["audience","goal","channel","budget"];
 for(let iter=0; iter<20; iter++){
   const ord=await readOrder();
   if(JSON.stringify(ord)===JSON.stringify(want)) break;
   for(let i=1;i<want.length;i++){ const id=want[i]; const cur=ord.indexOf(id); const target=i; if(cur>target){ for(let k=0;k<cur-target;k++) await moveUp(id==="audience"?"الجمهور المستهدف":id==="goal"?"الهدف":id==="channel"?"القناة":"الميزانية"); } }
   await new Promise(r=>setTimeout(r,150));
 }
 console.log("ORDER", JSON.stringify(await readOrder()));
 await clickBtn("اختبر الخطة");
 await new Promise(r=>setTimeout(r,1000));
 const st1=await p.evaluate(()=>{const r=localStorage.getItem("rawaj-game-v1");return r?JSON.parse(r):null});
 console.log("ST1", JSON.stringify({stage:st1?.campaign?.stage,strat:st1?.campaign?.strategy,xp:st1?.xp,alert:(await p.evaluate(()=> (document.querySelector('[role="alert"]')||{}).textContent||null))}));
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});