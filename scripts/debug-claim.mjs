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
  grant usage on schema auth to anon, authenticated;
  grant execute on all functions in schema auth to anon, authenticated;
  create table if not exists auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}'::jsonb, created_at timestamptz default now());
  create or replace function auth.uid() returns uuid language sql stable as $f$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid; $f$;
  create or replace function auth.jwt() returns jsonb language sql stable as $f$ select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb); $f$;
  grant execute on function auth.uid() to anon, authenticated;
  grant execute on function auth.jwt() to anon, authenticated;
  create table if not exists storage.buckets (id text primary key, name text not null, public boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
  create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text, owner uuid, created_at timestamptz default now(), updated_at timestamptz default now(), path_tokens text[] generated always as (string_to_array(name, '/')) stored);
  grant usage on schema storage to anon, authenticated;
  grant select on storage.buckets, storage.objects to anon, authenticated;
`);
await db.exec(sql);
const owner = { id: '11111111-1111-1111-1111-111111111111', email: '123onetwo123123@gmail.com' };
await db.exec(`insert into auth.users(id,email) values ('${owner.id}','${owner.email}') on conflict do nothing;`);
const claims = JSON.stringify({ sub: owner.id, email: owner.email, role: 'authenticated' });
await db.exec(`select set_config('request.jwt.claim.sub', '${owner.id}', false);`);
await db.exec(`select set_config('request.jwt.claims', '${claims.replace(/'/g,"''")}', false);`);
await db.exec(`set role authenticated;`);
const r = await db.query(`select auth.uid() as uid, public.is_admin() as admin`);
console.log(r.rows[0]);
try { await db.query('select public.claim_owner()'); console.log('claimed'); } catch(e){ console.error('err', e.message); }
await db.close();
