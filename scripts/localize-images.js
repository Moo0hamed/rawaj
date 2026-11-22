const fs = require("fs");
const path = require("path");

const map = {
  "1522071820081-009f0129c71c": "hero-team",
  "1552664730-d307ca884978": "about-team",
  "1497366216548-37526070297c": "about-office",
  "1460925895917-afdab827c52f": "service-digital-marketing",
  "1611162617474-5b21e879e113": "service-social-media",
  "1574717024653-61fd2cf4d44d": "service-content",
  "1492691527719-9d1e07e534b4": "service-photo",
  "1626785774573-4b799315345d": "service-branding",
  "1533750516457-a7f992034fec": "service-ads",
  "1495474472287-4d71bcdd2085": "project-qahwa-cover",
  "1442512595331-e89e73853f31": "project-qahwa-1",
  "1554118811-1e0d58224f24": "project-qahwa-2",
  "1556228720-195a672e8a03": "project-lumi-cover",
  "1571781926291-c477ebfd024b": "project-lumi-1",
  "1598440947619-2c35fc9aa908": "project-lumi-2",
  "1560518883-ce09059eeffa": "project-ofoq-cover",
  "1512917774080-9991f1c4c750": "project-ofoq-1",
  "1600585154340-be6161a56a0c": "project-ofoq-2",
  "1534438327276-14e5300c3a48": "project-nabd-cover",
  "1517836357463-d25dfeac3438": "project-nabd-1",
  "1571019613454-1cb2f99b2d8b": "project-nabd-2",
  "1441986300917-64674bd600d8": "project-dar-cover",
  "1490481651871-ab68de25d43d": "project-dar-1",
  "1483985988355-763728e1935b": "project-dar-2",
  "1517248135467-4c7edcad34c4": "project-mada-cover",
  "1414235077428-338989a2e8c0": "project-mada-1",
  "1552566626-52f8b828add9": "project-mada-2",
  "1560250097-0b93528c311a": "team-ahmed",
  "1573497019940-1c28c88b4f3e": "team-sara",
  "1507003211169-0a1dd7228f2d": "team-youssef",
  "1580489944761-15a19d654956": "team-mariam",
  "1519085360753-af0119f7cbe7": "team-karim",
};

const files = [
  "content/services.ts",
  "content/projects.ts",
  "content/team.ts",
  "components/home/Hero.tsx",
  "app/[locale]/about/page.tsx",
];

for (const file of files) {
  const full = path.join(process.cwd(), file);
  let src = fs.readFileSync(full, "utf8");
  const before = src;
  for (const [id, name] of Object.entries(map)) {
    const pattern = new RegExp(
      "https://images\\.unsplash\\.com/photo-" + id + "\\?[^\"'`\\s]+",
      "g",
    );
    src = src.replace(pattern, "/images/" + name + ".jpg");
  }
  // Hero avatar template literal form
  src = src.replace(
    /`https:\/\/images\.unsplash\.com\/\$\{id\}\?[^`]+`/g,
    "`/images/${id}.jpg`",
  );
  fs.writeFileSync(full, src);
  console.log(file + (before === src ? " (no change)" : " (updated)"));
}

// Hero avatar ids -> local file names
const heroPath = path.join(process.cwd(), "components/home/Hero.tsx");
let hero = fs.readFileSync(heroPath, "utf8");
hero = hero.replace(/"photo-1560250097-0b93528c311a"/, '"team-ahmed"')
  .replace(/"photo-1573497019940-1c28c88b4f3e"/, '"team-sara"')
  .replace(/"photo-1507003211169-0a1dd7228f2d"/, '"team-youssef"')
  .replace(/"photo-1580489944761-15a19d654956"/, '"team-mariam"');
fs.writeFileSync(heroPath, hero);
console.log("Hero avatars updated");
