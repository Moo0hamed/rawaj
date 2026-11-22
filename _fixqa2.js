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
  await sleep(800);

  // Stage 0: Identity (+20 XP, 3 coins)
  await page.type("#brand-name", "نقطة");
  await clickButton(page, "أزرق رَواج");
  await sleep(120);
  await clickButton(page, "أصفر رَواج");
  await sleep(180);
  await clickButton(page, "اعتمد الهوية");
  await sleep(1000);
  let state = await readState(page);
  log(
    state?.campaign?.stage === 1 && state?.campaign?.brandName === "نقطة" && (state?.campaign?.palette || []).length >= 2 && state?.xp === 20 && state?.coins === 3,
    "stage 0 identity (+20 XP, 3 coins)",
    \`stage=\${state?.campaign?.stage} xp=\${state?.xp} coins=\${state?.coins}\`,
  );

  // Stage 1: Strategy order audience, goal, channel, budget (+20 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(700);
  async function stratOrder() {
    return page.evaluate(() => {
      const want = [["audience", "الجمهور"], ["goal", "الهدف"], ["channel", "القناة"], ["budget", "الميزانية"]];
      const lis = Array.from(document.querySelectorAll("ol li")).filter((li) => want.some(([, kw]) => (li.textContent || "").includes(kw)));
      return lis.map((li) => { const t = li.textContent || ""; const m = want.find(([, kw]) => t.includes(kw)); return m ? m[0] : null; }).filter(Boolean);
    });
  }
  async function moveUpLabel(label) {
    const clicked = await page.evaluate((lbl) => {
      const lis = Array.from(document.querySelectorAll("ol li"));
      const li = lis.find((el) => (el.textContent || "").includes(lbl));
      if (!li) return false;
      const btn = li.querySelector('button[aria-label="تحريك لأعلى"]') || li.querySelector('button[aria-label*="Move up"]');
      if (!btn || btn.disabled) return false;
      btn.click();
      return true;
    }, label);
    await sleep(280);
    return clicked;
  }
  const targetOrder = ["audience", "goal", "channel", "budget"];
  const labelMap = { audience: "الجمهور المستهدف", goal: "الهدف", channel: "القناة", budget: "الميزانية" };
  for (let round = 0; round < 16; round++) {
    const ord = await stratOrder();
    if (JSON.stringify(ord) === JSON.stringify(targetOrder)) break;
    let moved = false;
    for (let i = 0; i < targetOrder.length; i++) {
      const id = targetOrder[i];
      const o = await stratOrder();
      const cur = o.indexOf(id);
      if (cur > i) { await moveUpLabel(labelMap[id]); moved = true; break; }
    }
    if (!moved) break;
  }
  const ordBeforeSubmit = await stratOrder();
  await clickButton(page, "اختبر الخطة");
  await sleep(1000);
  state = await readState(page);
  log(
    state?.campaign?.stage === 2 && (state?.campaign?.strategy || []).join(",") === "audience,goal,channel,budget" && state?.xp === 40,
    "stage 1 strategy (+20 XP)",
    \`order=\${JSON.stringify(ordBeforeSubmit)} saved=\${JSON.stringify(state?.campaign?.strategy)} xp=\${state?.xp}\`,
  );

  // Stage 2: Social/calendar (+20 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(800);
  const pairs = [
    ["ريل: نصيحة سريعة", "الأحد"],
    ["ستوري: استطلاع", "الاثنين"],
    ["بوست: عرض محدود", "الثلاثاء"],
    ["ريل: خلف الكواليس", "الأربعاء"],
    ["ستوري: إطلاق منتج", "الخميس"],
  ];
  for (const [itemLabel, dayLabel] of pairs) {
    await page.evaluate((it, dy) => {
      const item = Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").includes(it) && b.getAttribute("draggable") === "true");
      if (item) item.click();
      const day = Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").trim().startsWith(dy) && (b.className || "").includes("min-h"));
      if (day) day.click();
    }, itemLabel, dayLabel);
    await sleep(220);
  }
  await clickButton(page, "جدول الأسبوع");
  await sleep(1000);
  state = await readState(page);
  log(
    state?.campaign?.stage === 3 && Object.keys(state?.campaign?.calendar || {}).length === 5 && state?.xp === 60,
    "stage 2 social calendar (+20 XP)",
    \`engagement=\${state?.campaign?.engagement} xp=\${state?.xp}\`,
  );

  // Stage 3: Ads (+20 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(800);
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
  await sleep(350);
  await clickButton(page, "أطلق الحملة");
  await sleep(1000);
  state = await readState(page);
  log(
    state?.campaign?.stage === 4 && state?.campaign?.reach > 0 && state?.campaign?.clicks > 0 && state?.xp === 80,
    "stage 3 ads simulation (+20 XP)",
    \`reach=\${state?.campaign?.reach} clicks=\${state?.campaign?.clicks} sales=\${state?.campaign?.sales}\`,
  );

  // Stage 4: Replay auto-pass when empty (no XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(1300);
  state = await readState(page);
  const replayText = await page.evaluate(() => document.body.innerText || "");
  log(
    state?.campaign?.stage === 5 && state?.xp === 80 && replayText.includes("الفيديوهات الجاية قريب") && replayText.includes("تم تجاوز المرحلة تلقائيًا"),
    "stage 4 replay auto-pass when empty (no XP)",
    \`stage=\${state?.campaign?.stage} xp=\${state?.xp}\`,
  );

  // Stage 5: Team (+10 XP on opening both cards)
  await clickButton(page, "المرحلة التالية");
  await sleep(800);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const sobhi = btns.find((b) => (b.textContent || "").includes("صبحي"));
    const mo = btns.find((b) => (b.textContent || "").includes("محمد عامر"));
    if (sobhi) sobhi.click();
  });
  await sleep(300);
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const mo = btns.find((b) => (b.textContent || "").includes("محمد عامر"));
    if (mo) mo.click();
  });
  await sleep(900);
  state = await readState(page);
  log(
    state?.campaign?.stage === 6 && (state?.campaign?.teamOpened || []).length >= 2 && state?.xp === 90,
    "stage 5 team (+10 XP, both cards)",
    \`teamOpened=\${JSON.stringify(state?.campaign?.teamOpened)} xp=\${state?.xp}\`,
  );

  // Stage 6: Launch + report + WhatsApp (+40 XP, 5 coins)
  await clickButton(page, "المرحلة التالية");
  await sleep(800);
  await clickButton(page, "أطلق براندك");
  await sleep(1400);
  state = await readState(page);
  const launchInfo = await page.evaluate(() => {
    const wa = Array.from(document.querySelectorAll("a")).find((a) => (a.getAttribute("href") || "").startsWith("https://wa.me/"));
    return { hasReport: (document.body.innerText || "").includes("تقرير براندك"), wa: wa ? wa.getAttribute("href") : "" };
  });
  log(
    state?.campaign?.stage === 7 && Boolean(state?.campaign?.report?.serviceSlug) && launchInfo.hasReport && (launchInfo.wa || "").includes("wa.me/201024345291") && state?.xp === 130 && state?.coins === 11,
    "stage 6 launch report + WhatsApp (+40 XP, 5 coins)",
    \`xp=\${state?.xp} coins=\${state?.coins} service=\${state?.campaign?.report?.serviceSlug}\`,
  );

  // Stage 7: Boss (#boss anchor, location, contact awards +30 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(900);
  const bossCheck = await page.evaluate(() => {
    const el = document.getElementById("boss");
    const txt = document.body.innerText || "";
    return { hasAnchor: Boolean(el), hasTitle: txt.includes("ابدأ مشروعك الحقيقي"), hasLocation: txt.includes("شبين الكوم"), hasWaReport: txt.includes("ابعتلنا التقرير على واتساب") };
  });
  await page.evaluate(() => {
    const root = document.getElementById("boss") || document;
    const wa = Array.from(root.querySelectorAll("a")).find((a) => (a.getAttribute("href") || "").includes("wa.me/201024345291"));
    if (wa) wa.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
  await sleep(900);
  state = await readState(page);
  log(
    bossCheck.hasAnchor && bossCheck.hasTitle && bossCheck.hasLocation && state?.campaign?.bossDone === true && state?.xp === 160,
    "stage 7 boss (#boss, contact +30 XP)",
    \`bossDone=\${state?.campaign?.bossDone} xp=\${state?.xp} checks=\${JSON.stringify(bossCheck)}\`,
  );

  // HUD boss one-click + #boss hash scroll
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.history.replaceState(null, "", window.location.pathname);
  });
  await sleep(200);
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button[aria-label]')).find((b) => (b.getAttribute("aria-label") || "").includes("ابدأ مشروعك الحقيقي"));
    if (btn) btn.click();
  });
  await sleep(800);
  const hudBoss = await page.evaluate(() => {
    const el = document.getElementById("boss");
    if (!el) return { ok: false, reason: "no-anchor" };
    const r = el.getBoundingClientRect();
    const view = (JSON.parse(localStorage.getItem("rawaj-game-v1") || "{}").campaign || {}).view;
    return { ok: r.top < window.innerHeight && r.bottom > 0, hash: window.location.hash, view, top: Math.round(r.top) };
  });
  log(hudBoss.ok && hudBoss.view === 7, "HUD one-click to boss (#boss)", JSON.stringify(hudBoss));

  // Persistence after reload
  await page.goto(BASE + "/ar", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(900);
  const persisted = await readState(page);
  log(
    persisted?.campaign?.brandName === "نقطة" && persisted?.campaign?.stage >= 7 && persisted?.campaign?.bossDone === true && persisted?.xp === 160,
    "persistence after reload",
    \`brand=\${persisted?.campaign?.brandName} stage=\${persisted?.campaign?.stage} boss=\${persisted?.campaign?.bossDone} xp=\${persisted?.xp}\`,
  );

  log(errors.length === 0, "no console/page errors during campaign flow", errors.slice(0, 4).join(" | "));
  await page.close();

  // Mobile overflow spot checks
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
console.log("rewrote campaign-qa");