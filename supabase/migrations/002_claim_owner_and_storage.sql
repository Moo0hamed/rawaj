-- Claim owner + storage (idempotent). Depends on public.admins and public.is_admin() from 001_init.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

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

revoke all on function public.claim_owner() from public;
revoke all on function public.claim_owner() from anon;
grant execute on function public.claim_owner() to authenticated;

revoke all on function public.is_admin() from public;
revoke all on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

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

-- Public helper: allows setup page to know owner exists without exposing admin rows.
create or replace function public.has_owner()
returns boolean
language sql
security definer
set search_path = public
stable
as $
  select exists (select 1 from public.admins limit 1);
$;

revoke all on function public.has_owner() from public;
grant execute on function public.has_owner() to anon, authenticated;