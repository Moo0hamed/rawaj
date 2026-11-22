-- RAWAJ migration 003: explicit GRANTs for anon/authenticated roles
-- Idempotent: safe to re-run (GRANTs are additive and ALTER DEFAULT PRIVILEGES is cumulative).

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

-- Function executes (already granted in all-in-one, repeated here for completeness/idempotency).
grant execute on function public.is_admin() to authenticated;
grant execute on function public.has_owner() to anon, authenticated;

-- Default privileges for future tables (applies to objects created by the same role thereafter).
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;
