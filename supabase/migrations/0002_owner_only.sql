-- Solo el dueño (correo en private.allowed_emails) lee y decide, aunque alguien se registre.
create schema if not exists private;
revoke all on schema private from anon, authenticated;

create table private.allowed_emails (email text primary key);
alter table private.allowed_emails enable row level security;
-- Sustituye por tu correo antes de ejecutar en un proyecto nuevo:
insert into private.allowed_emails (email) values ('TU_CORREO@ejemplo.com');

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from private.allowed_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke execute on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;

drop policy "agents: leer autenticado" on public.agents;
drop policy "events: leer autenticado" on public.events;
drop policy "approvals: leer autenticado" on public.approvals;
drop policy "approvals: decidir pendiente" on public.approvals;

create policy "agents: solo el dueño lee"    on public.agents    for select to authenticated using (public.is_owner());
create policy "events: solo el dueño lee"    on public.events    for select to authenticated using (public.is_owner());
create policy "approvals: solo el dueño lee" on public.approvals for select to authenticated using (public.is_owner());
create policy "approvals: el dueño decide pendientes" on public.approvals
  for update to authenticated
  using (public.is_owner() and status = 'pending')
  with check (public.is_owner() and status in ('approved', 'rejected'));
