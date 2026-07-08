-- Analytics events (writes via service role only; RLS enabled with no policies)
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null,
  properties jsonb not null default '{}'::jsonb
);

create index analytics_events_created_at_idx on public.analytics_events (created_at desc);

create index analytics_events_event_name_created_at_idx
  on public.analytics_events (event_name, created_at desc);

alter table public.analytics_events enable row level security;

-- Aggregates for admin dashboard (execute restricted to service_role)
create or replace function public.analytics_summary(p_since interval default interval '30 days')
returns table(event_name text, event_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select ae.event_name, count(*)::bigint as event_count
  from public.analytics_events ae
  where ae.created_at >= now() - p_since
  group by ae.event_name
  order by event_count desc;
$$;

-- See 20260604120000_analytics_top_games_pagination.sql for paginated top games RPC.

revoke all on function public.analytics_summary(interval) from public;
grant execute on function public.analytics_summary(interval) to service_role;
