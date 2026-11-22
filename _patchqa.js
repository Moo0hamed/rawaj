const fs = require("fs");
const path = "scripts/campaign-qa.js";
let s = fs.readFileSync(path, "utf8");

const oldCal = `  // Stage 2: Social/calendar (+20 XP)
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
  );`;

const newCal = `  // Stage 2: Social/calendar (+20 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(900);
  const pairs = [
    ["ريل: نصيحة سريعة", "الأحد"],
    ["ستوري: استطلاع", "الاثنين"],
    ["بوست: عرض محدود", "الثلاثاء"],
    ["ريل: خلف الكواليس", "الأربعاء"],
    ["ستوري: إطلاق منتج", "الخميس"],
  ];
  for (let attempt = 0; attempt < 2; attempt++) {
    // clear if retry
    if (attempt > 0) { await clickButton(page, "تفريغ الأسبوع"); await sleep(300); }
    for (const [itemLabel, dayLabel] of pairs) {
      await page.evaluate((it) => {
        const btns = Array.from(document.querySelectorAll("button")).filter((b) => (b.textContent || "").includes(it));
        const item = btns.find((b) => b.getAttribute("draggable") === "true") || btns[0];
        if (item) item.click();
      }, itemLabel);
      await sleep(350);
      await page.evaluate((dy) => {
        const day = Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").trim().startsWith(dy) && (b.className || "").includes("min-h"));
        if (day) day.click();
      }, dayLabel);
      await sleep(400);
    }
    state = await readState(page);
    if (Object.keys(state?.campaign?.calendar || {}).length === 5) break;
  }
  await clickButton(page, "جدول الأسبوع");
  await sleep(1200);
  state = await readState(page);
  log(
    state?.campaign?.stage === 3 && Object.keys(state?.campaign?.calendar || {}).length === 5 && state?.xp === 60,
    "stage 2 social calendar (+20 XP)",
    \`cal=\${Object.keys(state?.campaign?.calendar || {}).length} engagement=\${state?.campaign?.engagement} xp=\${state?.xp}\`,
  );`;

if (!s.includes(oldCal)) { console.error("CAL_NOT_FOUND"); process.exit(1); }
s = s.replace(oldCal, newCal);

const oldBoss = `  // Stage 7: Boss (#boss anchor, location, contact awards +30 XP)
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
  );`;

const newBoss = `  // Stage 7: Boss (#boss anchor, location, contact awards +30 XP)
  await clickButton(page, "المرحلة التالية");
  await sleep(1300);
  const bossCheck = await page.evaluate(() => {
    const el = document.getElementById("boss");
    const txt = document.body.innerText || "";
    return { hasAnchor: Boolean(el), hasTitle: txt.includes("ابدأ مشروعك الحقيقي"), hasLocation: txt.includes("شبين الكوم"), hasWaReport: txt.includes("ابعتلنا التقرير على واتساب") };
  });
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => {
      const root = document.getElementById("boss") || document;
      const tel = Array.from(root.querySelectorAll("a")).find((a) => (a.getAttribute("href") || "").startsWith("tel:"));
      if (tel) tel.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    });
    await sleep(700);
    state = await readState(page);
    if (state?.campaign?.bossDone) break;
  }
  log(
    bossCheck.hasAnchor && bossCheck.hasTitle && bossCheck.hasLocation && bossCheck.hasWaReport && state?.campaign?.bossDone === true && state?.xp === 160,
    "stage 7 boss (#boss, contact +30 XP)",
    \`bossDone=\${state?.campaign?.bossDone} xp=\${state?.xp} checks=\${JSON.stringify(bossCheck)}\`,
  );`;

if (!s.includes(oldBoss)) { console.error("BOSS_NOT_FOUND"); process.exit(1); }
s = s.replace(oldBoss, newBoss);

fs.writeFileSync(path, s, "utf8");
console.log("patched");