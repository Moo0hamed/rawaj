const BASE = process.env.BASE_URL || "http://localhost:3000";

const seeds = ["/ar", "/en", "/ar/about", "/ar/services", "/ar/work", "/ar/team", "/ar/pricing", "/ar/contact", "/ar/campaign", "/en/campaign"];

(async () => {
  const seen = new Set();
  const queue = [...seeds];
  const results = [];

  while (queue.length) {
    const path = queue.shift();
    const key = path.split("#")[0].replace(/\/$/, "") || "/";
    if (seen.has(key)) continue;
    seen.add(key);

    try {
      const res = await fetch(BASE + key, { redirect: "manual" });
      results.push([key, res.status]);

      if (res.status === 200 && (key.startsWith("/ar") || key.startsWith("/en"))) {
        const html = await res.text();
        const hrefs = [...html.matchAll(/href="(\/(?:ar|en)[^"#?]*)"/g)].map((m) => m[1]);
        for (const href of hrefs) {
          if (!seen.has(href)) queue.push(href);
        }
      }
    } catch (error) {
      results.push([key, "ERR " + error.message]);
    }
  }

  const bad = results.filter(([, status]) => status !== 200);
  console.log("Crawled:", results.length, "internal routes");
  console.log("OK:", results.length - bad.length);
  if (bad.length) {
    console.log("Problems:");
    for (const [path, status] of bad) console.log(" ", status, path);
  }

  // 404 + locale fallback
  for (const path of ["/ar/nonexistent", "/en/nonexistent", "/fr"]) {
    const res = await fetch(BASE + path, { redirect: "manual" });
    console.log(path, "->", res.status, res.headers.get("location") ?? "");
  }
})();
