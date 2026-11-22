const fs = require("fs");
const inv = JSON.parse(fs.readFileSync("_local_inventory.json","utf8"));
const roots = [
  {key:"E:\\ملفات المواقع\\بورتفوليو", label:"E:\\ملفات المواقع\\بورتفوليو"},
  {key:"E:\\ملفات المواقع\\بورتفوليو.before-desktop-move-20261018", label:"E:\\ملفات المواقع\\بورتفوليو.before-desktop-move-20261018"},
  {key:"E:\\ملفات المواقع\\mohamed-amer-portfolio", label:"E:\\ملفات المواقع\\mohamed-amer-portfolio"},
  {key:"E:\\ملفات المواقع\\mohamed-amer-portfolio-google-drive", label:"E:\\ملفات المواقع\\mohamed-amer-portfolio-google-drive"},
];
const media = inv.filter(x => x.isMedia || /\.(zip|md|js|html|css|json)$/i.test(x.ext));
// focus on meaningful portfolio items: media + key content/data files
const rows = inv.filter(x => x.isMedia || /projects\.js$|app\.js$|index\.html$|README\.md$/i.test(x.rel));
rows.sort((a,b)=> (a.root+a.rel).localeCompare(b.root+b.rel,'ar'));
console.log("COUNT", rows.length);
for(const r of rows){
  console.log([r.root, r.rel, r.ext, r.size].join(" | "));
}