import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
function log(ok,msg){ console.log(`${ok?'PASS':'FAIL'} ${msg}`); if(!ok) process.exitCode=1; }
async function setupShim(db){
  await db.exec(`
    do $$ begin
      if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
      if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
    end $$;
    create schema if not exists auth; create schema if not exists storage;
    grant usage on schema auth to anon, authenticated;
    create table if not exists auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}'::jsonb, created_at timestamptz default now());
    create or replace function auth.uid() returns uuid language sql stable as $f$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid; $f$;
    create or replace function auth.jwt() returns jsonb language sql stable as $f$ select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb); $f$;
    grant execute on function auth.uid() to anon, authenticated;
    grant execute on function auth.jwt() to anon, authenticated;
    create table if not exists storage.buckets (id text primary key, name text not null, public boolean default false, created_at timestamptz default now(), updated_at timestamptz default now());
    create table if not exists storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text, owner uuid, created_at timestamptz default now(), updated_at timestamptz default now(), path_tokens text[] generated always as (string_to_array(name, '/')) stored);
    grant usage on schema storage to anon, authenticated;
    grant all on storage.buckets, storage.objects to anon, authenticated;
  `);
}
async function asUser(db, user, fn){
  const claims = user ? JSON.stringify({ sub:user.id, email:user.email, role:'authenticated' }) : '{}';
  await db.exec(`select set_config('request.jwt.claim.sub', '${user?.id ?? ''}', false);`);
  await db.exec(`select set_config('request.jwt.claims', '${claims.replace(/'/g,"''")}', false);`);
  await db.exec(`set role ${user ? 'authenticated' : 'anon'};`);
  try { return await fn(); } finally { await db.exec('reset role;'); await db.exec(`select set_config('request.jwt.claim.sub','',false); select set_config('request.jwt.claims','',false);`); }
}
async function main(){
  const rawSql = fs.readFileSync('supabase/all-in-one.sql','utf8');
  const sql = rawSql.replace('create extension if not exists pgcrypto;', '-- pgcrypto shimmed for PGlite test');
  const db = new PGlite();
  await setupShim(db);
  await db.exec(sql);
  await db.exec(sql); // idempotent
  log(true,'Run all-in-one.sql (1st+2nd) idempotent');

  // mimic Supabase: anon/authenticated need table grants; RLS/policies do fine-grained control
  await db.exec(`
    grant usage on schema public to anon, authenticated;
    grant select, insert, update, delete on all tables in schema public to anon, authenticated;
    grant usage, select on all sequences in schema public to anon, authenticated;
  `);

  const owner = { id:'11111111-1111-1111-1111-111111111111', email:'123onetwo123123@gmail.com' };
  const other = { id:'22222222-2222-2222-2222-222222222222', email:'other@example.com' };
  await db.exec(`insert into auth.users(id,email) values ('${owner.id}','${owner.email}'),('${other.id}','${other.email}') on conflict do nothing;`);

  let r = await db.query('select public.has_owner() as v'); log(r.rows[0].v===false,'has_owner() false before claim');
  try { await asUser(db,null,()=>db.query('select public.claim_owner()')); log(false,'anon claim_owner should fail'); }
  catch(e){ log(/not_authenticated|permission denied/i.test(e.message),`anon claim_owner rejected (${String(e.message).split('\n')[0]})`); }

  await asUser(db, owner, async()=>{ await db.query('select public.claim_owner()'); });
  log(true,'owner claim_owner succeeds');
  r = await db.query('select public.has_owner() as v'); log(r.rows[0].v===true,'has_owner() true after claim');
  r = await db.query('select public.is_admin() as v'); log(r.rows[0].v===false,'is_admin() false with no auth uid');
  await asUser(db, owner, async()=>{ const rr=await db.query('select public.is_admin() as v'); log(rr.rows[0].v===true,'is_admin() true for owner'); });
  await asUser(db, other, async()=>{ const rr=await db.query('select public.is_admin() as v'); log(rr.rows[0].v===false,'is_admin() false for non-owner'); });
  try { await asUser(db, other, ()=>db.query('select public.claim_owner()')); log(false,'second claim should fail'); }
  catch(e){ log(String(e.message).includes('owner_already_exists'),`second claim_owner rejected (${String(e.message).split('\n')[0]})`); }

  const tables=['replay_videos','channels','content_items','site_settings'];
  for (const t of tables){
    try {
      await asUser(db,null, async()=>{
        if (t==='site_settings') await db.query(`insert into public.site_settings(id,data) values (1,'{"x":1}'::jsonb) on conflict (id) do update set data=excluded.data`);
        else if (t==='content_items') await db.query(`insert into public.content_items(kind,slug,data) values ('test','x','{}'::jsonb)`);
        else if (t==='replay_videos') await db.query(`insert into public.replay_videos(url) values ('https://example.com/v')`);
        else if (t==='channels') await db.query(`insert into public.channels(url) values ('https://example.com/c')`);
      });
      if (t==='site_settings'){ const s=await db.query(`select data->>'x' as x from public.site_settings where id=1`); log(s.rows[0].x!=='1','anon cannot write site_settings'); }
      else { const c=await db.query(`select count(*)::int as c from public.${t}`); log(c.rows[0].c===0,`anon cannot write ${t}`); }
    } catch(e){ log(true,`anon cannot write ${t} (${String(e.message).split('\n')[0]})`); }
  }

  await asUser(db, owner, async()=>{ await db.query(`insert into public.replay_videos(url,title_ar,published,visible) values ('https://youtube.com/watch?v=abc','t',true,true)`); });
  r = await db.query(`select count(*)::int as c from public.replay_videos`); log(r.rows[0].c===1,'owner can write replay_videos');
  await asUser(db, null, async()=>{ const rr=await db.query(`select count(*)::int as c from public.replay_videos`); log(rr.rows[0].c===1,'anon can read published replay_videos'); });
  await asUser(db, owner, async()=>{ await db.query(`delete from public.replay_videos`); });
  r = await db.query(`select count(*)::int as c from public.replay_videos`); log(r.rows[0].c===0,'owner can delete replay_videos');

  await db.close();
  console.log(process.exitCode ? 'RESULT: FAIL' : 'RESULT: PASS');
}
main().catch(e=>{ console.error('FATAL', e.message); process.exit(1); });
