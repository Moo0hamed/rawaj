const fs = require("fs");
const path = "scripts/campaign-qa.js";
let s = fs.readFileSync(path, "utf8");

const oldStrategy = `  // Stage 1: Strategy (audience, goal, channel, budget)
  await clickButton(page, "المرحلة التالية");
  await sleep(600);
  // move audience to top and goal to second via up buttons (initial order channel,audience,budget,goal)
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("li"));
      const aud = items.find((el) => (el.textContent || "").includes("الجمهور المستهدف"));
      if (!aud) return;
      const up = aud.querySelector('button[aria-label="تحريك لأعلى"]');
      if (up) up.click();
    });
    await sleep(120);
  }
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll("li"));
      const goal = items.find((el) => (el.textContent || "").includes("الهدف"));
      if (!goal) return;
      const up = goal.querySelector('button[aria-label="تحريك لأعلى"]');
      if (up) up.click();
    });
    await sleep(120);
  }
  await clickButton(page, "اختبر الخطة");
  await sleep(900);
  state = await readState(page);
  const stratOk = (state?.campaign?.strategy || []).join(",") === "audience,goal,channel,budget";
  log(state?.campaign?.stage === 2 && stratOk && state?.xp === 40, "stage 1 strategy ordered (+20 XP)", JSON.stringify(state?.campaign?.strategy));`;

const newStrategy = `  // Stage 1: Strategy (audience, goal, channel, budget)
  await clickButton(page, "المرحلة التالية");
  await sleep(700);
  await page.evaluate(() => {
    const want = ["الجمهور المستهدف", "الهدف", "القناة", "الميزانية"];
    const root = document;
    function getLis() {
      return Array.from(root.querySelectorAll("ol li")).filter((li) => want.some((w) => (li.textContent || "").includes(w)));
    }
    function indexOf(label) {
      return getLis().findIndex((li) => (li.textContent || "").includes(label));
    }
    function moveUp(label) {
      const lis = getLis();
      const li = lis.find((el) => (el.textContent || "").includes(label));
      if (!li) return false;
      const btn = li.querySelector('button[aria-label="تحريك لأعلى"]');
      if (btn && !btn.disabled) { btn.click(); return true; }
      return false;
    }
    for (let pass = 0; pass < 12; pass++) {
      let changed = false;
      for (let target = 0; target < want.length; target++) {
        const label = want[target];
        let cur = indexOf(label);
        while (cur > target) {
          if (moveUp(label)) { changed = true; cur--; } else break;
        }
      }
      if (!changed) break;
    }
  });
  await sleep(350);
  await clickButton(page, "اختبر الخطة");
  await sleep(1000);
  state = await readState(page);
  const stratOk = (state?.campaign?.strategy || []).join(",") === "audience,goal,channel,budget";
  log(state?.campaign?.stage === 2 && stratOk && state?.xp === 40, "stage 1 strategy ordered (+20 XP)", JSON.stringify(state?.campaign?.strategy));`;

if (!s.includes(oldStrategy)) { console.error("STRAT_BLOCK_NOT_FOUND"); process.exit(1); }
s = s.replace(oldStrategy, newStrategy);

const oldCalendar = `  // Stage 2: Social/calendar
  await clickButton(page, "المرحلة التالية");
  await sleep(600);
  await dragItemToDay(page, "ريل: نصيحة سريعة", "الأحد");
  await dragItemToDay(page, "ستوري: استطلاع", "الاثنين");
  await dragItemToDay(page, "بوست: عرض محدود", "الثلاثاء");
  await dragItemToDay(page, "ريل: خلف الكواليس", "الأربعاء");
  await dragItemToDay(page, "ستوري: إطلاق منتج", "الخميس");
  await clickButton(page, "جدول الأسبوع");
  await sleep(900);
  state = await readState(page);
  log(
    state?.campaign?.stage === 3 && Object.keys(state?.campaign?.calendar || {}).length === 5 && state?.xp === 60,
    "stage 2 social calendar completes (+20 XP)",
    \`engagement=\${state?.campaign?.engagement}\`,
  );`;

const newCalendar = `  // Stage 2: Social/calendar
  await clickButton(page, "المرحلة التالية");
  await sleep(700);
  await page.evaluate(() => {
    const pairs = [
      ["ريل: نصيحة سريعة", "الأحد"],
      ["ستوري: استطلاع", "الاثنين"],
      ["بوست: عرض محدود", "الثلاثاء"],
      ["ريل: خلف الكواليس", "الأربعاء"],
      ["ستوري: إطلاق منتج", "الخميس"],
    ];
    for (const [itemLabel, dayLabel] of pairs) {
      const item = Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").includes(itemLabel));
      if (item) item.click();
      const day = Array.from(document.querySelectorAll("button")).find((b) => (b.textContent || "").trim().startsWith(dayLabel) && (b.className || "").includes("min-h"));
      if (day) day.click();
    }
  });
  await sleep(400);
  await clickButton(page, "جدول الأسبوع");
  await sleep(1000);
  state = await readState(page);
  log(
    state?.campaign?.stage === 3 && Object.keys(state?.campaign?.calendar || {}).length === 5 && state?.xp === 60,
    "stage 2 social calendar completes (+20 XP)",
    \`engagement=\${state?.campaign?.engagement}\`,
  );`;

if (!s.includes(oldCalendar)) { console.error("CAL_BLOCK_NOT_FOUND"); process.exit(1); }
s = s.replace(oldCalendar, newCalendar);

fs.writeFileSync(path, s, "utf8");
console.log("fixed-campaign-qa");