-- La oficina de David: estado de los agentes, historial y aprobaciones.
-- Pensado para un proyecto Supabase NUEVO, separado de Vetra y Finexa.

create table public.agents (
  id           text primary key,
  name         text not null,
  role         text not null,
  zone         text not null,
  status       text not null default 'sleeping'
               check (status in ('active', 'sleeping', 'building', 'alert')),
  now_text     text,
  bubble       text,
  mission      text,
  wakes        text,
  reads        text,
  permission   text,
  last_output  text,
  personality  text,
  updated_at   timestamptz not null default now()
);

create table public.events (
  id          bigint generated always as identity primary key,
  agent_id    text not null references public.agents(id) on delete cascade,
  kind        text not null default 'info' check (kind in ('info', 'alert', 'question')),
  text        text not null,
  created_at  timestamptz not null default now()
);
create index events_agent_created_idx on public.events (agent_id, created_at desc);

create table public.approvals (
  id          uuid primary key default gen_random_uuid(),
  agent_id    text not null references public.agents(id) on delete cascade,
  text        text not null,
  status      text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at  timestamptz not null default now(),
  decided_at  timestamptz
);
create index approvals_status_idx on public.approvals (status, created_at desc);

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger agents_touch before update on public.agents
for each row execute function public.touch_updated_at();

-- Seguridad. Solo usuarios autenticados (tú) leen; los agentes escriben con la
-- service role key desde el runner, que se salta RLS y NUNCA va al navegador.
-- Desactiva el registro público en Authentication y crea tu usuario a mano:
-- así solo tú puedes entrar.
alter table public.agents    enable row level security;
alter table public.events    enable row level security;
alter table public.approvals enable row level security;

create policy "agents: leer autenticado"    on public.agents    for select to authenticated using (true);
create policy "events: leer autenticado"    on public.events    for select to authenticated using (true);
create policy "approvals: leer autenticado" on public.approvals for select to authenticated using (true);

-- Desde el panel solo se puede decidir una aprobación pendiente, nada más.
create policy "approvals: decidir pendiente" on public.approvals
  for update to authenticated
  using (status = 'pending')
  with check (status in ('approved', 'rejected'));

-- Tiempo real para el plano.
alter publication supabase_realtime add table public.agents, public.events, public.approvals;
