const fs=require('fs');
const b=fs.readFileSync('_portfolio_bundle.js','utf8');
// try to find project objects
const idx = b.indexOf('drive.google.com');
console.log('first drive idx', idx);
if(idx>-1) console.log(b.slice(Math.max(0,idx-120), idx+200));
// find all drive file/folder ids
const re=/https?:\/\/(?:drive\.google\.com\/[^\s\"'\\,)}\]]+|docs\.google\.com\/[^\s\"'\\,)}\]]+)/g;
const urls=[...new Set(b.match(re)||[])];
console.log('DRIVE_COUNT', urls.length);
urls.forEach((u,i)=>console.log(i+1, u));
// hosted media
const re2=/https?:\/\/mohamed-amer-portfolio\.pages\.dev[^\s\"'\\,)}\]]*/g;
const h=[...new Set(b.match(re2)||[])];
console.log('HOSTED_COUNT', h.length);
h.forEach(u=>console.log('H',u));
