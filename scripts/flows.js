const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const log = (ok, name, extra = "") => console.log((ok ? "PASS " : "FAIL ") + name + (extra ? " -> " + extra : ""));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox"],
  });

  const openPage = async () => {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      try {
        sessionStorage.setItem("rawaj-intro-seen", "1");
      } catch (error) {}
    });
    return page;
  };

  // 1. Mobile menu
  {
    const page = await openPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE + "/ar", { waitUntil: "networkidle2" });
    await page.click('button[aria-label="Open menu"]');
    await new Promise((r) => setTimeout(r, 700));
    const visible = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Mobile"]');
      return Boolean(nav && nav.getBoundingClientRect().height > 100);
    });
    const links = await page.evaluate(
      () => document.querySelectorAll('nav[aria-label="Mobile"] a').length,
    );
    log(visible && links >= 7, "mobile menu opens", links + " links");
    await page.close();
  }

  // 2. Locale switch
  {
    const page = await openPage();
    await page.goto(BASE + "/ar/services", { waitUntil: "networkidle2" });
    await page.click('a[hrefLang="en"]');
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    const url = page.url();
    log(url.endsWith("/en/services"), "locale switch keeps route", url);
    await page.close();
  }

  // 3. Work filters
  {
    const page = await openPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(BASE + "/ar/work", { waitUntil: "networkidle2" });
    const countAll = await page.evaluate(
      () => document.querySelectorAll("main article").length,
    );
    const locked = await page.evaluate(
      () => (document.body.textContent.match(/LOCKED/g) || []).length,
    );
    const buttons = await page.$$('button[role="tab"]');
    await buttons[1].click();
    await new Promise((r) => setTimeout(r, 900));
    const countBranding = await page.evaluate(
      () => document.querySelectorAll("main article").length,
    );
    log(
      countAll === 6 && countBranding === 2 && locked === 6,
      "work mission board",
      "all=" + countAll + " branding=" + countBranding + " locked=" + locked,
    );
    await page.close();
  }

  // 4. Pricing toggle
  {
    const page = await openPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(BASE + "/ar/pricing", { waitUntil: "networkidle2" });
    const readFirstPrice = () =>
      page.evaluate(() => {
        const el = document.querySelector("article span.tabular-nums");
        return el ? el.textContent : "";
      });
    const monthly = await readFirstPrice();
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("سنوي"),
      );
      btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    const yearly = await readFirstPrice();
    log(monthly !== yearly && monthly.length > 0, "pricing toggle", monthly + " -> " + yearly);
    await page.close();
  }

  // 5. Testimonials slider
  {
    const page = await openPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(BASE + "/ar", { waitUntil: "networkidle2" });
    await page.goto(BASE + "/ar/work/qahwa-house", { waitUntil: "networkidle2" });
    const lockedPage = await page.evaluate(() => ({
      banner: document.body.textContent.includes("مهمة مقفولة"),
      hasResults: document.body.textContent.includes("أرقام من تقارير الأداء"),
    }));
    log(
      lockedPage.banner && !lockedPage.hasResults,
      "locked mission detail hides results",
      JSON.stringify(lockedPage),
    );
    await page.close();
  }

  // 6. Contact form validation + success
  {
    const page = await openPage();
    await page.setViewport({ width: 1280, height: 1000 });
    await page.goto(BASE + "/en/contact", { waitUntil: "networkidle2" });
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 500));
    const errors = await page.evaluate(
      () => document.querySelectorAll('[role="alert"]').length,
    );
    log(errors >= 2, "contact validation shows errors", errors + " alerts");

    await page.type("#name", "QA Tester");
    await page.type("#email", "qa@example.com");
    await page.type("#message", "Automated QA message for the contact form.");
    await page.select("#service", "Brand identity");
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 1500));
    const success = await page.evaluate(
      () => document.body.textContent.includes("We've received your request"),
    );
    log(success, "contact form submits", "");
    await page.close();
  }

  // 7. Service link and CTA navigation
  {
    const page = await openPage();
    await page.goto(BASE + "/ar/services/branding", { waitUntil: "networkidle2" });
    const h1 = await page.evaluate(() => document.querySelector("h1").textContent.trim());
    log(
      page.url().includes("/ar/services/branding") && h1.length > 0,
      "service page renders",
      h1,
    );
    await page.close();
  }

  // 8. Play hub, modal and prank XP persistence
  {
    const page = await openPage();
    await page.setViewport({ width: 1280, height: 1000 });
    await page.goto(BASE + "/ar/play", { waitUntil: "networkidle2" });

    await page.click(".quest-card");
    await new Promise((r) => setTimeout(r, 600));
    const dialog = await page.evaluate(
      () => Boolean(document.querySelector('[role="dialog"][aria-modal="true"]')),
    );
    log(dialog, "game modal opens");
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="إغلاق / Close"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const invite = Array.from(document.querySelectorAll("button")).find((b) =>
        b.textContent.includes("اضغط واكسب"),
      );
      if (invite) invite.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => {
      const scope = document.querySelector('[role="dialog"]');
      const btn = Array.from(scope.querySelectorAll("button")).find((b) =>
        b.textContent.includes("اضغط واكسب"),
      );
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 2600));
    const revealed = await page.evaluate(() => {
      const scope = document.querySelector('[role="dialog"]');
      return Boolean(scope && /النتيجة النهائية|مقلب/.test(scope.textContent));
    });
    const savedXp = await page.evaluate(() => {
      const raw = window.localStorage.getItem("rawaj-game-v1");
      return raw ? JSON.parse(raw).xp : 0;
    });
    log(revealed && savedXp > 0, "prank reveals and awards XP", "xp=" + savedXp);
    await page.close();
  }

  // 9. XP persists after reload
  {
    const page = await openPage();
    await page.goto(BASE + "/ar", { waitUntil: "networkidle2" });
    const xpBefore = await page.evaluate(() => {
      const raw = window.localStorage.getItem("rawaj-game-v1");
      return raw ? JSON.parse(raw).xp : 0;
    });
    await page.evaluate(() => window.localStorage.setItem("rawaj-game-v1", JSON.stringify({ xp: 150, completed: ["quiz"], trapsSeen: [], soundOn: false, motionOn: true, introHidden: false })));
    await page.reload({ waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1200));
    const hudState = await page.evaluate(() => {
      const raw = window.localStorage.getItem("rawaj-game-v1");
      const parsed = raw ? JSON.parse(raw) : null;
      return {
        xp: parsed ? parsed.xp : 0,
        settings: Boolean(document.querySelector('button[aria-label*="الإعدادات"]')),
      };
    });
    log(
      hudState.xp === 150 && hudState.settings,
      "HUD keeps stored XP after reload",
      JSON.stringify(hudState),
    );
    await page.evaluate(() => window.localStorage.removeItem("rawaj-game-v1"));
    await page.close();
  }

  // 10. No horizontal overflow on mobile
  for (const path of ["/ar", "/ar/play"]) {
    const page = await openPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(BASE + path, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 900));
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    log(overflow <= 2, "no horizontal overflow " + path, overflow + "px");
    await page.close();
  }
  await browser.close();
})();
