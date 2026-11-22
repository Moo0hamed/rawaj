-- RAWAJ all-in-one migration (001_init + 002_claim_owner_and_storage)
-- Safe to run in Supabase SQL Editor (Run). Fully idempotent: safe to re-run.
-- Project: cbbytmcocumjbntzopjx
--
-- Order: extensions -> tables -> functions -> triggers -> RLS/policies -> storage -> grants
-- public.is_admin() is defined near top after public.admins and before any policy uses it.

create extension if not exists pgcrypto;

-- =====================
-- TABLES
-- =====================

-- Admin allowlist (owner-only writes)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
alter table public.admins add column if not exists email text;

-- Admin check: used by RLS policies and admin gating.
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.admins a
    where a.user_id = auth.uid()
  );
end;
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- Site settings (single row id=1)
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Reusable content table for structured entities
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null, -- service|project|team|offer|pricing|testimonial|industry|process|value|game|question|prank|event|achievement|text|faq
  slug text,
  sort_order int not null default 0,
  published boolean not null default true,
  visible boolean not null default true,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_items_kind_idx on public.content_items(kind, sort_order);
create index if not exists content_items_slug_idx on public.content_items(slug);

-- Replay videos (added from admin only)
create table if not exists public.replay_videos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  platform text, -- youtube|vimeo|facebook|tiktok|instagram|drive|mp4|other
  title_ar text,
  title_en text,
  description_ar text,
  description_en text,
  thumbnail_url text,
  category text,
  orientation text, -- horizontal|vertical|unknown
  service_slug text,
  sort_order int not null default 0,
  published boolean not null default false,
  visible boolean not null default true,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Managed channels/accounts
create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  platform text,
  name text,
  description text,
  avatar_url text,
  cover_url text,
  latest_posts jsonb not null default '[]'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  stats_source text, -- official_api|og_oembed|manual|none
  is_real_stats boolean not null default false,
  last_fetched_at timestamptz,
  fetch_status text, -- ok|error|pending
  fetch_error text,
  linked_service_slug text,
  linked_stage text,
  sort_order int not null default 0,
  published boolean not null default false,
  visible boolean not null default true,
  manual jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Content versions for rollback (store snapshots)
create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null, -- site_settings|content_items|replay_videos|channels
  entity_id text,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create index if not exists content_versions_entity_idx on public.content_versions(entity_type, entity_id, created_at desc);

-- =====================
-- FUNCTIONS (defined before policies that use them)
-- =====================

-- Generic updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- public.is_admin() defined near top after public.admins table.

-- Claim owner: one-time bootstrap. Only first authenticated user can become owner when no admins exist.
create or replace function public.claim_owner()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_count integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select count(*) into admin_count from public.admins;
  if admin_count > 0 then
    raise exception 'owner_already_exists';
  end if;

  insert into public.admins (user_id, email)
  values (auth.uid(), coalesce(auth.jwt() ->> 'email', null))
  on conflict (user_id) do nothing;
end;
$$;

-- =====================
-- TRIGGERS
-- =====================

drop trigger if exists site_settings_updated on public.site_settings;
create trigger site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists content_items_updated on public.content_items;
create trigger content_items_updated before update on public.content_items
  for each row execute function public.set_updated_at();

drop trigger if exists replay_videos_updated on public.replay_videos;
create trigger replay_videos_updated before update on public.replay_videos
  for each row execute function public.set_updated_at();

drop trigger if exists channels_updated on public.channels;
create trigger channels_updated before update on public.channels
  for each row execute function public.set_updated_at();

-- =====================
-- SEED / DEFAULT ROWS
-- =====================

insert into public.site_settings (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- =====================
-- RLS + POLICIES
-- =====================

alter table public.admins enable row level security;
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins
  for select to authenticated
  using (auth.uid() = user_id);

alter table public.site_settings enable row level security;
drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings
  for select to anon, authenticated
  using (true);
drop policy if exists "site_settings admin write" on public.site_settings;
create policy "site_settings admin write" on public.site_settings
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

alter table public.content_items enable row level security;
drop policy if exists "content_items public read published" on public.content_items;
create policy "content_items public read published" on public.content_items
  for select to anon, authenticated
  using (published = true and visible = true);
drop policy if exists "content_items admin read all" on public.content_items;
create policy "content_items admin read all" on public.content_items
  for select to authenticated
  using (public.is_admin());
drop policy if exists "content_items admin write" on public.content_items;
create policy "content_items admin write" on public.content_items
  for insert to authenticated
  with check (public.is_admin());
drop policy if exists "content_items admin update" on public.content_items;
create policy "content_items admin update" on public.content_items
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
drop policy if exists "content_items admin delete" on public.content_items;
create policy "content_items admin delete" on public.content_items
  for delete to authenticated
  using (public.is_admin());

alter table public.replay_videos enable row level security;
drop policy if exists "replay_videos public read" on public.replay_videos;
create policy "replay_videos public read" on public.replay_videos
  for select to anon, authenticated
  using (published = true and visible = true);
drop policy if exists "replay_videos admin read all" on public.replay_videos;
create policy "replay_videos admin read all" on public.replay_videos
  for select to authenticated
  using (public.is_admin());
drop policy if exists "replay_videos admin write" on public.replay_videos;
create policy "replay_videos admin write" on public.replay_videos
  for insert to authenticated
  with check (public.is_admin());
drop policy if exists "replay_videos admin update" on public.replay_videos;
create policy "replay_videos admin update" on public.replay_videos
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
drop policy if exists "replay_videos admin delete" on public.replay_videos;
create policy "replay_videos admin delete" on public.replay_videos
  for delete to authenticated
  using (public.is_admin());

alter table public.channels enable row level security;
drop policy if exists "channels public read" on public.channels;
create policy "channels public read" on public.channels
  for select to anon, authenticated
  using (published = true and visible = true);
drop policy if exists "channels admin read all" on public.channels;
create policy "channels admin read all" on public.channels
  for select to authenticated
  using (public.is_admin());
drop policy if exists "channels admin write" on public.channels;
create policy "channels admin write" on public.channels
  for insert to authenticated
  with check (public.is_admin());
drop policy if exists "channels admin update" on public.channels;
create policy "channels admin update" on public.channels
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
drop policy if exists "channels admin delete" on public.channels;
create policy "channels admin delete" on public.channels
  for delete to authenticated
  using (public.is_admin());

alter table public.content_versions enable row level security;
drop policy if exists "content_versions admin read" on public.content_versions;
create policy "content_versions admin read" on public.content_versions
  for select to authenticated
  using (public.is_admin());
drop policy if exists "content_versions admin write" on public.content_versions;
create policy "content_versions admin write" on public.content_versions
  for insert to authenticated
  with check (public.is_admin());
drop policy if exists "content_versions admin delete" on public.content_versions;
create policy "content_versions admin delete" on public.content_versions
  for delete to authenticated
  using (public.is_admin());

-- =====================
-- STORAGE
-- =====================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "Admin insert media" on storage.objects;
create policy "Admin insert media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admin update media" on storage.objects;
create policy "Admin update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admin delete media" on storage.objects;
create policy "Admin delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- =====================
-- GRANTS
-- =====================

revoke all on function public.claim_owner() from public;
revoke all on function public.claim_owner() from anon;
grant execute on function public.claim_owner() to authenticated;

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

-- Public helper: allows setup page to know owner exists without exposing admin rows.
create or replace function public.has_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins limit 1);
$$;

revoke all on function public.has_owner() from public;
grant execute on function public.has_owner() to anon, authenticated;

-- =====================
-- GRANTS (003_grants.sql appended)
-- =====================

grant usage on schema public to anon, authenticated;

-- Authenticated (admin-facing): full CRUD on all content tables, subject to RLS.
grant select, insert, update, delete
  on public.admins,
  public.site_settings,
  public.content_items,
  public.replay_videos,
  public.channels,
  public.content_versions
  to authenticated;

-- Anon/public: SELECT only on read-facing tables, subject to RLS policies (published/visible only).
grant select
  on public.site_settings,
  public.content_items,
  public.replay_videos,
  public.channels
  to anon;

-- Function executes (repeated here for completeness/idempotency).
grant execute on function public.is_admin() to authenticated;
grant execute on function public.has_owner() to anon, authenticated;

-- Default privileges for future tables.
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;