const fs = require("fs");
const path = "scripts/campaign-qa.js";
const content = `const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const CHROME = "C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe";

const log = (ok, name, extra = "") =>
  console.log((ok ? "PASS " : "FAIL ") + name + (extra ? " -> " + extra : ""));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function clickButton(page, text) {
  return page.evaluate((label) => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      (b.textContent || "").includes(label),
    );
    if (!btn) return false;
    btn.click();
    return true;
  }, text);
}

async function readState(page) {
  return page.evaluate(() => {
    const raw = window.localStorage.getItem("rawaj-game-v1");
    return raw ? JSON.parse(raw) : null;
  });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 180)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text().slice(0, 180));
  });

  await page.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem("rawaj-intro-seen", "1");
      sessionStorage.setItem("rawaj-mascot-off", "1");
      localStorage.setItem("rawaj-intro-hidden", "1");
    } catch (e) {}
  });

  await page.setViewport({ width: 1280, height: 1000 });
  await page.goto(BASE + "/ar", { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => { try { localStorage.removeItem("rawaj-game-v1"); } catch (e) {} });
  await page.reload({ waitUntil: "networkidle2", timeout: 60000 });
  await sleep(900);

  // Stage 0: Identity (+20 XP, 3 coins)
  await page.type("#brand-name", "نقطة");
  await clickButton(page, "أزرق رَواج");
  await sleep(150);
  await clickButton(page, "أصفر رَواج");
  await sleep(200);
  await clickButton(page, "اعتمد الهوية");
  await sleep(1100);
  let state = await readState(page);
  log(
    state?.campaign?.stage === 1 && state?.campaign?.brandName === "نقطة" && (state?.campaign?.palette || []).length >= 2 && state?.xp === 20 && state?.coins === 3,
    "stage 0 identity (+20 XP, 3 coins)",
    \`stage=\${state?.campaign?.stage} xp=\${state?.xp} coins=\${state?.coins}\`,
  );

  // Stage 1: Strategy order audience, goal, channel, budget (+20 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(900);
  const target = ["audience", "goal", "channel", "budget"];
  const labelOf = { audience: "الجمهور المستهدف", goal: "الهدف", channel: "القناة", budget: "الميزانية" };
  async function readStrat() {
    return page.evaluate(() => {
      const map = [["audience","الجمهور المستهدف"],["goal","الهدف"],["channel","القناة"],["budget","الميزانية"]];
      const ols = Array.from(document.querySelectorAll("ol"));
      const ol = ols.find(o => map.every(([,kw]) => (o.textContent||"").includes(kw)));
      if (!ol) return [];
      return Array.from(ol.querySelectorAll(":scope > li")).map(li => {
        const t = li.textContent || "";
        const m = map.find(([,kw]) => t.includes(kw));
        return m ? m[0] : null;
      }).filter(Boolean);
    });
  }
  async function clickUp(id) {
    const lbl = labelOf[id];
    await page.evaluate((kw) => {
      const map = ["الجمهور المستهدف","الهدف","القناة","الميزانية"];
      const ols = Array.from(document.querySelectorAll("ol"));
      const ol = ols.find(o => map.every(k => (o.textContent||"").includes(k)));
      if (!ol) return;
      const li = Array.from(ol.querySelectorAll(":scope > li")).find(el => (el.textContent||"").includes(kw));
      if (!li) return;
      const btn = li.querySelector('button[aria-label*="لأعلى"], button[aria-label*="Move up"]');
      if (btn && !btn.disabled) btn.click();
    }, lbl);
    await sleep(350);
  }
  for (let guard = 0; guard < 40; guard++) {
    const cur = await readStrat();
    if (JSON.stringify(cur) === JSON.stringify(target)) break;
    let acted = false;
    for (let i = 0; i < target.length; i++) {
      const c = await readStrat();
      const idx = c.indexOf(target[i]);
      if (idx > i) { await clickUp(target[i]); acted = true; break; }
    }
    if (!acted) break;
  }
  const ordBefore = await readStrat();
  await clickButton(page, "اختبر الخطة");
  await sleep(1200);
  state = await readState(page);
  log(
    state?.campaign?.stage === 2 && (state?.campaign?.strategy || []).join(",") === "audience,goal,channel,budget" && state?.xp === 40,
    "stage 1 strategy (+20 XP)",
    \`ui=\${JSON.stringify(ordBefore)} saved=\${JSON.stringify(state?.campaign?.strategy)} xp=\${state?.xp}\`,
  );

  // Stage 2: Social/calendar (+20 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(900);
  const pairs = [
    ["ريل: نصيحة سريعة", "الأحد"],
    ["ستوري: استطلاع", "الاثنين"],
    ["بوست: عرض محدود", "الثلاثاء"],
    ["ريل: خلف الكواليس", "الأربعاء"],
    ["ستوري: إطلاق منتج", "الخميس"],
  ];
  for (const [itemLabel, dayLabel] of pairs) {
    await page.evaluate((it) => {
      const item = Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").includes(it) && b.getAttribute("draggable") === "true");
      if (item) item.click();
    }, itemLabel);
    await sleep(300);
    await page.evaluate((dy) => {
      const day = Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").trim().startsWith(dy) && (b.className || "").includes("min-h"));
      if (day) day.click();
    }, dayLabel);
    await sleep(350);
  }
  await clickButton(page, "جدول الأسبوع");
  await sleep(1200);
  state = await readState(page);
  log(
    state?.campaign?.stage === 3 && Object.keys(state?.campaign?.calendar || {}).length === 5 && state?.xp === 60,
    "stage 2 social calendar (+20 XP)",
    \`cal=\${Object.keys(state?.campaign?.calendar || {}).length} engagement=\${state?.campaign?.engagement} xp=\${state?.xp}\`,
  );

  // Stage 3: Ads (+20 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(900);
  await page.evaluate(() => {
    const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
    const values = [4000, 3000, 3000];
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    sliders.forEach((slider, index) => {
      setter.call(slider, String(values[index] || 3000));
      slider.dispatchEvent(new Event("input", { bubbles: true }));
      slider.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });
  await sleep(400);
  await clickButton(page, "أطلق الحملة");
  await sleep(1200);
  state = await readState(page);
  log(
    state?.campaign?.stage === 4 && state?.campaign?.reach > 0 && state?.campaign?.clicks > 0 && state?.xp === 80,
    "stage 3 ads simulation (+20 XP)",
    \`reach=\${state?.campaign?.reach} clicks=\${state?.campaign?.clicks} sales=\${state?.campaign?.sales}\`,
  );

  // Stage 4: Replay auto-pass when empty (no XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(1500);
  state = await readState(page);
  const replayText = await page.evaluate(() => document.body.innerText || "");
  log(
    state?.campaign?.stage === 5 && state?.xp === 80 && (replayText.includes("الفيديوهات الجاية قريب") || replayText.includes("Videos coming soon")) && (replayText.includes("تم تجاوز المرحلة تلقائيًا") || replayText.includes("Stage passed automatically")),
    "stage 4 replay auto-pass when empty (no XP)",
    \`stage=\${state?.campaign?.stage} xp=\${state?.xp}\`,
  );

  // Stage 5: Team (+10 XP on opening both cards)
  await clickButton(page, "المرحلة التالية");
  await sleep(900);
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll("button")).find(x => (x.textContent || "").includes("صبحي"));
    if (b) b.click();
  });
  await sleep(400);
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll("button")).find(x => (x.textContent || "").includes("محمد عامر"));
    if (b) b.click();
  });
  await sleep(1000);
  state = await readState(page);
  log(
    state?.campaign?.stage === 6 && (state?.campaign?.teamOpened || []).length >= 2 && state?.xp === 90,
    "stage 5 team (+10 XP, both cards)",
    \`teamOpened=\${JSON.stringify(state?.campaign?.teamOpened)} xp=\${state?.xp}\`,
  );

  // Stage 6: Launch + report + WhatsApp (+40 XP, 5 coins)
  await clickButton(page, "المرحلة التالية");
  await sleep(900);
  await clickButton(page, "أطلق براندك");
  await sleep(1600);
  state = await readState(page);
  const launchInfo = await page.evaluate(() => {
    const wa = Array.from(document.querySelectorAll("a")).find((a) => (a.getAttribute("href") || "").startsWith("https://wa.me/"));
    return { hasReport: (document.body.innerText || "").includes("تقرير براندك"), wa: wa ? wa.getAttribute("href") : "" };
  });
  log(
    state?.campaign?.stage === 7 && Boolean(state?.campaign?.report?.serviceSlug) && launchInfo.hasReport && (launchInfo.wa || "").includes("wa.me/201024345291") && state?.xp === 130 && state?.coins >= 11,
    "stage 6 launch report + WhatsApp (+40 XP, 5 coins)",
    \`xp=\${state?.xp} coins=\${state?.coins} service=\${state?.campaign?.report?.serviceSlug}\`,
  );

  // Stage 7: Boss (#boss anchor, location, contact awards +30 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(1200);
  const bossCheck = await page.evaluate(() => {
    const el = document.getElementById("boss");
    const txt = document.body.innerText || "";
    return { hasAnchor: Boolean(el), hasTitle: txt.includes("ابدأ مشروعك الحقيقي"), hasLocation: txt.includes("شبين الكوم"), hasWaReport: txt.includes("ابعتلنا التقرير على واتساب") };
  });
  // click tel link in boss (avoids popup/navigation issues)
  await page.evaluate(() => {
    const root = document.getElementById("boss") || document;
    const tel = Array.from(root.querySelectorAll("a")).find((a) => (a.getAttribute("href") || "").startsWith("tel:"));
    if (tel) tel.click();
  });
  await sleep(1100);
  state = await readState(page);
  log(
    bossCheck.hasAnchor && bossCheck.hasTitle && bossCheck.hasLocation && bossCheck.hasWaReport && state?.campaign?.bossDone === true && state?.xp === 160,
    "stage 7 boss (#boss, contact +30 XP)",
    \`bossDone=\${state?.campaign?.bossDone} xp=\${state?.xp} checks=\${JSON.stringify(bossCheck)}\`,
  );

  // HUD boss one-click + #boss hash scroll
  await page.evaluate(() => { window.scrollTo(0, 0); window.history.replaceState(null, "", window.location.pathname); });
  await sleep(300);
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button[aria-label]')).find((b) => (b.getAttribute("aria-label") || "").includes("ابدأ مشروعك الحقيقي"));
    if (btn) btn.click();
  });
  await sleep(1000);
  const hudBoss = await page.evaluate(() => {
    const el = document.getElementById("boss");
    if (!el) return { ok: false };
    const r = el.getBoundingClientRect();
    const view = (JSON.parse(localStorage.getItem("rawaj-game-v1") || "{}").campaign || {}).view;
    return { ok: r.top < window.innerHeight && r.bottom > 0, hash: window.location.hash, view, top: Math.round(r.top) };
  });
  log(hudBoss.ok && hudBoss.view === 7, "HUD one-click to boss (#boss)", JSON.stringify(hudBoss));

  // Persistence after reload
  await page.goto(BASE + "/ar", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1100);
  const persisted = await readState(page);
  log(
    persisted?.campaign?.brandName === "نقطة" && persisted?.campaign?.stage >= 7 && persisted?.campaign?.bossDone === true && persisted?.xp === 160,
    "persistence after reload",
    \`brand=\${persisted?.campaign?.brandName} stage=\${persisted?.campaign?.stage} boss=\${persisted?.campaign?.bossDone} xp=\${persisted?.xp}\`,
  );

  log(errors.length === 0, "no console/page errors during campaign flow", errors.slice(0, 4).join(" | "));
  await page.close();

  for (const path of ["/ar", "/ar/campaign", "/en"]) {
    const m = await browser.newPage();
    await m.evaluateOnNewDocument(() => {
      try { sessionStorage.setItem("rawaj-intro-seen", "1"); sessionStorage.setItem("rawaj-mascot-off", "1"); } catch (e) {}
    });
    await m.setViewport({ width: 390, height: 844 });
    await m.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    await sleep(700);
    const overflow = await m.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    log(overflow <= 2, "mobile no horizontal overflow " + path, \`overflow=\${overflow}\`);
    await m.close();
  }

  await browser.close();
  if (errors.length) process.exitCode = 1;
})();
`;
fs.writeFileSync(path, content, "utf8");
console.log("rewrote v4");