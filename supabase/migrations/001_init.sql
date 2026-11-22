-- RAWAJ v2 initial schema (Supabase/Postgres)
-- Idempotent: safe to re-run.
-- Order: tables -> functions/triggers handled in 002 for is_admin/claim_owner/storage;
-- this file keeps base schema and uses public.is_admin() where available.

create extension if not exists pgcrypto;

-- Admin allowlist (owner-only writes)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
alter table public.admins add column if not exists email text;

alter table public.admins enable row level security;
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins for select to authenticated
  using (auth.uid() = user_id);

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- Site settings (single row id=1)
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
drop trigger if exists site_settings_updated on public.site_settings;
create trigger site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();
insert into public.site_settings (id, data) values (1, '{}'::jsonb) on conflict (id) do nothing;

alter table public.site_settings enable row level security;
drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "site_settings admin write" on public.site_settings;
create policy "site_settings admin write" on public.site_settings for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Reusable content table
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
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
drop trigger if exists content_items_updated on public.content_items;
create trigger content_items_updated before update on public.content_items
  for each row execute function public.set_updated_at();

alter table public.content_items enable row level security;
drop policy if exists "content_items public read published" on public.content_items;
create policy "content_items public read published" on public.content_items for select to anon, authenticated
  using (published = true and visible = true);
drop policy if exists "content_items admin read all" on public.content_items;
create policy "content_items admin read all" on public.content_items for select to authenticated
  using (public.is_admin());
drop policy if exists "content_items admin write" on public.content_items;
create policy "content_items admin write" on public.content_items for insert to authenticated
  with check (public.is_admin());
drop policy if exists "content_items admin update" on public.content_items;
create policy "content_items admin update" on public.content_items for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
drop policy if exists "content_items admin delete" on public.content_items;
create policy "content_items admin delete" on public.content_items for delete to authenticated
  using (public.is_admin());

-- Replay videos
create table if not exists public.replay_videos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  platform text,
  title_ar text,
  title_en text,
  description_ar text,
  description_en text,
  thumbnail_url text,
  category text,
  orientation text,
  service_slug text,
  sort_order int not null default 0,
  published boolean not null default false,
  visible boolean not null default true,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists replay_videos_updated on public.replay_videos;
create trigger replay_videos_updated before update on public.replay_videos
  for each row execute function public.set_updated_at();

alter table public.replay_videos enable row level security;
drop policy if exists "replay_videos public read" on public.replay_videos;
create policy "replay_videos public read" on public.replay_videos for select to anon, authenticated
  using (published = true and visible = true);
drop policy if exists "replay_videos admin read all" on public.replay_videos;
create policy "replay_videos admin read all" on public.replay_videos for select to authenticated
  using (public.is_admin());
drop policy if exists "replay_videos admin write" on public.replay_videos;
create policy "replay_videos admin write" on public.replay_videos for insert to authenticated
  with check (public.is_admin());
drop policy if exists "replay_videos admin update" on public.replay_videos;
create policy "replay_videos admin update" on public.replay_videos for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
drop policy if exists "replay_videos admin delete" on public.replay_videos;
create policy "replay_videos admin delete" on public.replay_videos for delete to authenticated
  using (public.is_admin());

-- Channels
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
  stats_source text,
  is_real_stats boolean not null default false,
  last_fetched_at timestamptz,
  fetch_status text,
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
drop trigger if exists channels_updated on public.channels;
create trigger channels_updated before update on public.channels
  for each row execute function public.set_updated_at();

alter table public.channels enable row level security;
drop policy if exists "channels public read" on public.channels;
create policy "channels public read" on public.channels for select to anon, authenticated
  using (published = true and visible = true);
drop policy if exists "channels admin read all" on public.channels;
create policy "channels admin read all" on public.channels for select to authenticated
  using (public.is_admin());
drop policy if exists "channels admin write" on public.channels;
create policy "channels admin write" on public.channels for insert to authenticated
  with check (public.is_admin());
drop policy if exists "channels admin update" on public.channels;
create policy "channels admin update" on public.channels for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
drop policy if exists "channels admin delete" on public.channels;
create policy "channels admin delete" on public.channels for delete to authenticated
  using (public.is_admin());

-- Content versions
create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text,
  snapshot jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create index if not exists content_versions_entity_idx on public.content_versions(entity_type, entity_id, created_at desc);

alter table public.content_versions enable row level security;
drop policy if exists "content_versions admin read" on public.content_versions;
create policy "content_versions admin read" on public.content_versions for select to authenticated
  using (public.is_admin());
drop policy if exists "content_versions admin write" on public.content_versions;
create policy "content_versions admin write" on public.content_versions for insert to authenticated
  with check (public.is_admin());
drop policy if exists "content_versions admin delete" on public.content_versions;
create policy "content_versions admin delete" on public.content_versions for delete to authenticated
  using (public.is_admin());