import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
const sql = fs.readFileSync('supabase/all-in-one.sql','utf8');
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
try { await db.exec(sql); console.log('ok'); }
catch(e){ console.error(e.message); console.error('---'); console.error(sql.split('\n').slice(310,350).join('\n')); }
await db.close();
