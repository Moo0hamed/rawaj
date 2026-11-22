const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const log = (ok, name, extra = "") =>
  console.log((ok ? "PASS " : "FAIL ") + name + (extra ? " -> " + extra : ""));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  // 1. Intro appears on a fresh session and skips cleanly
  {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(BASE + "/ar", { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 1400));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const introVisible = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      return Boolean(dialog && dialog.textContent.includes("حملة رَواج"));
    });
    log(introVisible, "intro screen shows on first visit");
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("تخطي المقدمة"),
      );
      if (btn) btn.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const closed = await page.evaluate(() => !document.querySelector('[aria-modal="true"]'));
    const bodyScrollable = await page.evaluate(
      () => document.body.style.overflow !== "hidden",
    );
    log(closed && bodyScrollable, "intro skip closes overlay", errors.join(" | "));
    await page.close();
  }

  // 2. Reaction game survives start, play and result
  {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message.slice(0, 120)));
    await page.evaluateOnNewDocument(() => {
      try {
        sessionStorage.setItem("rawaj-intro-seen", "1");
      } catch (error) {}
    });
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto(BASE + "/ar/play", { waitUntil: "networkidle2" });

    await page.evaluate(() => {
      const card = Array.from(document.querySelectorAll(".quest-card")).find((el) =>
        el.textContent.includes("اختبار سرعة الرد"),
      );
      if (card) card.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 600));

    await page.evaluate(() => {
      const scope = document.querySelector('[role="dialog"]');
      const start = Array.from(scope.querySelectorAll("button")).find((b) =>
        b.textContent.includes("اضغط للبدء"),
      );
      if (start) start.click();
    });

    let ready = false;
    for (let i = 0; i < 30; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      ready = await page.evaluate(() => {
        const scope = document.querySelector('[role="dialog"]');
        return Boolean(scope && scope.textContent.includes("اضغط!"));
      });
      if (ready) break;
    }
    await page.evaluate(() => {
      const scope = document.querySelector('[role="dialog"]');
      const target = Array.from(scope.querySelectorAll("button")).find((b) =>
        b.textContent.includes("اضغط!"),
      );
      if (target) target.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 600));
    const result = await page.evaluate(() => {
      const scope = document.querySelector('[role="dialog"]');
      return scope ? scope.textContent : "";
    });
    const xp = await page.evaluate(() => {
      const raw = window.localStorage.getItem("rawaj-game-v1");
      return raw ? JSON.parse(raw).xp : 0;
    });
    log(
      ready && /\d+ ms/.test(result) && xp > 0 && errors.length === 0,
      "reaction game plays and grants XP",
      "xp=" + xp + (errors.length ? " errors=" + errors[0] : ""),
    );
    await page.close();
  }

  // 3. Memory game flips cards without crashing
  {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message.slice(0, 120)));
    await page.evaluateOnNewDocument(() => {
      try {
        sessionStorage.setItem("rawaj-intro-seen", "1");
      } catch (error) {}
    });
    await page.setViewport({ width: 1280, height: 960 });
    await page.goto(BASE + "/ar/play", { waitUntil: "networkidle2" });
    await page.evaluate(() => {
      const card = Array.from(document.querySelectorAll(".quest-card")).find((el) =>
        el.textContent.includes("اختبار الذاكرة"),
      );
      if (card) card.click();
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const flipped = await page.evaluate(async () => {
      const scope = document.querySelector('[role="dialog"]');
      const cards = Array.from(scope.querySelectorAll("button")).filter((b) =>
        b.className.includes("aspect-square"),
      );
      cards[0].click();
      cards[0].click();
      return cards.length;
    });
    await new Promise((resolve) => setTimeout(resolve, 900));
    log(flipped === 16 && errors.length === 0, "memory board renders 16 cards", errors[0] || "");
    await page.close();
  }

  // 4. Header fits at 1024 without overlapping the nav
  {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      try {
        sessionStorage.setItem("rawaj-intro-seen", "1");
      } catch (error) {}
    });
    await page.setViewport({ width: 1024, height: 800 });
    await page.goto(BASE + "/ar", { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const header = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Main"]');
      const logo = document.querySelector('header a[aria-label*="رَواج"]');
      if (!nav || !logo) return null;
      const navBox = nav.getBoundingClientRect();
      const logoBox = logo.getBoundingClientRect();
      const rtl = document.documentElement.dir === "rtl";
      return {
        links: nav.querySelectorAll("a").length,
        overlap: rtl ? navBox.right > logoBox.left : logoBox.right > navBox.left,
        wrapped: navBox.height > 52,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });
    log(
      Boolean(header && header.links === 7 && !header.overlap && !header.wrapped && header.overflow <= 2),
      "desktop header fits at 1024",
      header ? `links=${header.links} overlap=${header.overlap} wrapped=${header.wrapped}` : "missing header",
    );
    await page.close();
  }

  await browser.close();
})();
