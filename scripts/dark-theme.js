const fs = require("fs");
const path = require("path");

const root = process.cwd();
const dirs = ["app", "components", "content"];
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(tsx|ts|css)$/.test(entry.name)) files.push(full);
  }
}
dirs.forEach((d) => walk(path.join(root, d)));

const accentFixes = [
  ["bg-accent px-6 py-5 text-ink", "bg-accent px-6 py-5 text-onAccent"],
  ["bg-accent text-ink", "bg-accent text-onAccent"],
  ["bg-accent px-2.5 py-1 text-[11px] font-black text-ink", "bg-accent px-2.5 py-1 text-[11px] font-black text-onAccent"],
  ["bg-accent px-4 py-3 text-ink", "bg-accent px-4 py-3 text-onAccent"],
  ["bg-accent text-ink", "bg-accent text-onAccent"],
  ["focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink", "focus:bg-accent focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-onAccent"],
  ["bg-accent px-3.5 py-1.5 text-[11px] font-black text-ink", "bg-accent px-3.5 py-1.5 text-[11px] font-black text-onAccent"],
  ["bg-accent px-2 py-0.5 text-[10.5px] font-black text-ink", "bg-accent px-2 py-0.5 text-[10.5px] font-black text-onAccent"],
  ["group-open:bg-accent group-open:text-ink", "group-open:bg-accent group-open:text-onAccent"],
  ["group-hover:bg-accent group-hover:text-ink", "group-hover:bg-accent group-hover:text-onAccent"],
  ["bg-accent text-ink hover:bg-accent-400", "bg-accent text-onAccent hover:bg-accent-400"],
  ['bg-accent text-ink",', 'bg-accent text-onAccent",'],
  ['bg-accent text-ink"', 'bg-accent text-onAccent"'],
  ["hover:bg-accent\"", "hover:bg-accent hover:text-onAccent\""],
  ["hover:bg-accent,", "hover:bg-accent hover:text-onAccent,"],
  ["hover:bg-accent ", "hover:bg-accent hover:text-onAccent "],
];

let touched = 0;

for (const file of files) {
  if (file.endsWith("globals.css")) continue;
  let src = fs.readFileSync(file, "utf8");
  const before = src;

  for (const [from, to] of accentFixes) src = src.split(from).join(to);

  src = src.replace(/\bbg-white\b/g, "bg-surface");
  src = src.replace(/\bbg-ink\b/g, "bg-abyss");
  src = src.replace(/\bfrom-ink\b/g, "from-abyss");
  src = src.replace(/\bvia-ink\b/g, "via-abyss");
  src = src.replace(/\bto-ink\b/g, "to-abyss");
  src = src.replace(/\btext-brand-600\b/g, "text-brand-300");
  src = src.replace(/\btext-brand-700\b/g, "text-brand-300");
  src = src.replace(/\bborder-brand-200\b/g, "border-brand-400/40");

  if (src !== before) {
    fs.writeFileSync(file, src);
    touched++;
  }
}

console.log("files updated:", touched);
