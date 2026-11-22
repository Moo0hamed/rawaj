/**
 * Converts videos-to-upload.csv -> videos.json in the shape consumed by content/showcase.ts.
 * - Reads ./videos-to-upload.csv (UTF-8 with optional BOM). Columns: file,title,category,orientation,url
 * - Outputs ./videos.json (array of ShowcaseVideo-like objects).
 * - Items WITHOUT a non-empty url are EXCLUDED (not shown) per showcase rules.
 * - Does NOT modify content/showcase.ts and does not add unverified media.
 *
 * Usage:
 *   node scripts/csv-to-showcase-json.js
 *   node scripts/csv-to-showcase-json.js input.csv output.json
 */
const fs = require('fs');
const path = require('path');

const input = process.argv[2] || path.join(process.cwd(), 'videos-to-upload.csv');
const output = process.argv[3] || path.join(process.cwd(), 'videos.json');

function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { inQuotes = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    field += c; i++;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'item';
}

const raw = fs.readFileSync(input, 'utf8');
const table = parseCsv(raw);
if (!table.length) { console.error('Empty CSV'); process.exit(1); }
const header = table[0].map(h => h.trim());
const idx = (name) => header.indexOf(name);
const fi = idx('file'), ti = idx('title'), ci = idx('category'), oi = idx('orientation'), ui = idx('url');

const items = [];
let skipped = 0;
for (let r = 1; r < table.length; r++) {
  const cols = table[r];
  if (!cols || cols.every(c => !String(c || '').trim())) continue;
  const file = (cols[fi] || '').trim();
  const title = (cols[ti] || '').trim() || (file ? path.basename(file, path.extname(file)) : '');
  const category = (cols[ci] || '').trim();
  const orientation = (cols[oi] || '').trim();
  const url = (cols[ui] || '').trim();
  if (!url) { skipped++; continue; } // عنصر بدون url لا يظهر
  const id = slugify(title) + '-' + r;
  items.push({
    id,
    title: { ar: title, en: title },
    url,
    // thumbnail: '', // optional: fill when available (e.g. /thumbnails/<name>.webp)
    // duration: '',  // optional
    category: category ? { ar: category, en: category } : undefined,
    _meta: { file, orientation }
  });
}

fs.writeFileSync(output, JSON.stringify(items, null, 2), 'utf8');
console.log(`Wrote ${items.length} item(s) to ${output} (skipped ${skipped} without url).`);