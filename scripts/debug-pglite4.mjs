import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
const rawSql = fs.readFileSync('supabase/all-in-one.sql','utf8');
const sql = rawSql.replace('create extension if not exists pgcrypto;', '-- pgcrypto shimmed for PGlite test');
const db = new PGlite();
await db.exec(`
  do $$ begin
    if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
    if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
  end $$;
  create schema if not exists auth; create schema if not exists storage;
  create table if not exists auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}'::jsonb, created_at timestamptz default now());
  create or replace function auth.uid() returns uuid language sql stable as $f$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid; $f$;
  create or replace function auth.jwt() returns jsonb language sql stable as $f$ select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb); $f$;
  create table if not exists storage.buckets (id text primary key, name text not null, public boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
  create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text, owner uuid, created_at timestamptz default now(), updated_at timestamptz default now(), path_tokens text[] generated always as (string_to_array(name, '/')) stored);
`);

// smart splitter: track $$ dollar quotes and single quotes
function splitSql(text) {
  const out=[]; let cur=''; let inSingle=false; let dollarTag=null;
  for (let i=0;i<text.length;i++) {
    const ch=text[i]; const next=text.slice(i,i+1);
    if (dollarTag) {
      if (text.startsWith(dollarTag,i)) { cur+=dollarTag; i+=dollarTag.length-1; dollarTag=null; continue; }
      cur+=ch; continue;
    }
    if (inSingle) { cur+=ch; if (ch==="'") { if (text[i+1]==="'") { cur+="'"; i++; } else inSingle=false; } continue; }
    if (ch==="'") { inSingle=true; cur+=ch; continue; }
    if (ch==='$') {
      const m=text.slice(i).match(/^\$[A-Za-z_0-9]*\$/);
      if (m) { dollarTag=m[0]; cur+=dollarTag; i+=dollarTag.length-1; continue; }
    }
    if (ch===';') { out.push(cur.trim()); cur=''; continue; }
    cur+=ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}
const statements = splitSql(sql);
for (let i=0;i<statements.length;i++) {
  try { await db.exec(statements[i]); }
  catch(e){ console.error('FAIL at',i); console.error(statements[i].slice(0,300)); console.error(e.message); process.exit(1); }
}
console.log('ok', statements.length);
await db.close();
