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
// split by semicolons at top-level roughly? simple split on ;\n
const statements = sql.split(/;\s*\n/).map(s=>s.trim()).filter(Boolean).map(s=>s+';');
for (let i=0;i<statements.length;i++) {
  const s = statements[i];
  try { await db.exec(s); }
  catch(e){
    console.error('FAIL at statement', i);
    console.error(s.slice(0,400));
    console.error(e.message);
    process.exit(1);
  }
}
console.log('ok', statements.length);
await db.close();
