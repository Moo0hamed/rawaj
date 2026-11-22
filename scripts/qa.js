const puppeteer = require("puppeteer-core");

const BASE = process.env.BASE_URL || "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const pages = [
  "/ar",
  "/en",
  "/ar/about",
  "/en/services",
  "/ar/services/branding",
  "/ar/work",
  "/en/work/lumi-skin",
  "/ar/team",
  "/ar/pricing",
  "/en/contact",
  "/ar/play",
  "/en/play",
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  let failures = 0;

  for (const path of pages) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      try {
        sessionStorage.setItem("rawaj-intro-seen", "1");
      } catch (error) {}
    });
    const errors = [];
    const failed = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text().slice(0, 180));
    });
    page.on("pageerror", (err) => errors.push("PAGEERROR: " + err.message.slice(0, 180)));
    page.on("requestfailed", (req) => failed.push(req.url().slice(0, 120)));

    const response = await page.goto(BASE + path, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = () => {
          y += 700;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(step, 60);
          else resolve();
        };
        step();
      });
    });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 1500));

    const report = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - window.innerWidth;
      const brokenImages = Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src);
      const unlabeled = Array.from(document.querySelectorAll("a,button")).filter((el) => {
        const text = (el.textContent || "").trim();
        return !text && !el.getAttribute("aria-label") && !el.getAttribute("title");
      }).length;
      const headings = Array.from(document.querySelectorAll("h1")).map((h) =>
        (h.textContent || "").trim().slice(0, 60),
      );
      const dir = doc.getAttribute("dir");
      const lang = doc.getAttribute("lang");
      const overflowingEls = Array.from(document.querySelectorAll("body *"))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > window.innerWidth + 2 || r.left < -2);
        })
        .slice(0, 5)
        .map((el) => el.tagName + "." + (el.className || "").toString().slice(0, 40));
      return { overflow, brokenImages, unlabeled, headings, dir, lang, overflowingEls };
    });

    const problems = [];
    if (response.status() !== 200) problems.push("HTTP " + response.status());
    if (report.overflow > 2) problems.push("h-overflow " + report.overflow + "px");
    if (report.brokenImages.length) problems.push("broken imgs: " + report.brokenImages.length);
    if (report.unlabeled > 0) problems.push("unlabeled controls: " + report.unlabeled);
    if (report.headings.length !== 1) problems.push("h1 count " + report.headings.length);
    if (errors.length) problems.push("console: " + errors.slice(0, 2).join(" | "));
    if (failed.length) problems.push("failed reqs: " + failed.slice(0, 2).join(" | "));

    if (problems.length) failures++;
    console.log(
      (problems.length ? "FAIL " : "PASS ") +
        path +
        " [" + report.lang + "/" + report.dir + "] " +
        (problems.length ? "=> " + problems.join(" ; ") : ""),
    );
    if (report.overflow > 2) console.log("   overflowing:", report.overflowingEls);

    await page.close();
  }

  // Mobile check
  for (const path of ["/ar", "/ar/contact"]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 900));
    const res = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      navHidden: (() => {
        const header = document.querySelector("header");
        return header ? header.getBoundingClientRect().height < 200 : false;
      })(),
    }));
    console.log(
      (res.overflow > 2 ? "FAIL " : "PASS ") + "mobile " + path + " overflow=" + res.overflow,
    );
    await page.close();
  }

  await browser.close();
  console.log(failures === 0 ? "ALL CHECKS PASSED" : failures + " pages with issues");
})();
