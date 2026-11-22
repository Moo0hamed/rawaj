const sharp = require("sharp");
const fs = require("fs");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#071A2F"/>
<stop offset="0.55" stop-color="#040B14"/>
<stop offset="1" stop-color="#0A2647"/>
</linearGradient>
<pattern id="p" width="72" height="72" patternUnits="userSpaceOnUse">
<path d="M72 0H0V72" fill="none" stroke="#ffffff" stroke-opacity="0.05"/>
</pattern>
</defs>
<rect width="1200" height="630" fill="url(#g)"/>
<rect width="1200" height="630" fill="url(#p)"/>
<circle cx="980" cy="-80" r="420" fill="#2391FF" opacity="0.18"/>
<circle cx="120" cy="640" r="280" fill="#FFF83F" opacity="0.06"/>
<rect x="80" y="88" width="56" height="56" rx="16" fill="#2391FF"/>
<path d="M108 100l5.6 13.6L127 120l-13.4 5.6L108 140l-5.6-14.4L89 120l13.4-6.4L108 100Z" fill="#FFF83F"/>
<circle cx="108" cy="120" r="4.4" fill="#040B14"/>
<text x="154" y="128" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="800" fill="#FFFFFF">RAWAJ</text>
<text x="80" y="296" font-family="Segoe UI, Arial, sans-serif" font-size="62" font-weight="800" fill="#FFFFFF">Digital marketing that</text>
<text x="80" y="368" font-family="Segoe UI, Arial, sans-serif" font-size="62" font-weight="800" fill="#FFF83F">makes brands matter.</text>
<text x="80" y="432" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#ffffff" fill-opacity="0.6">Strategy · Content · Identity · Ads · Production</text>
<rect x="80" y="492" width="196" height="52" rx="26" fill="#FFF83F"/>
<text x="110" y="526" font-family="Segoe UI, Arial, sans-serif" font-size="19" font-weight="800" fill="#040B14">rawaj.agency</text>
<text x="1120" y="560" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="26" font-weight="700" fill="#ffffff" fill-opacity="0.35">RAWAJ</text>
</svg>`;

fs.mkdirSync("public", { recursive: true });
sharp(Buffer.from(svg)).png().toFile("public/og.png").then(() => {
  console.log("og.png created");
});
