-- Add most common APK download URL per game to top games RPC
drop function if exists public.analytics_top_download_games(interval, integer, integer);

create or replace function public.analytics_top_download_games(
  p_since interval default interval '7 days',
  p_limit integer default 10,
  p_offset integer default 0
)
returns table(
  game text,
  click_count bigint,
  page_path text,
  download_url text,
  total_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with per_game as (
    select
      coalesce(ae.properties ->> 'game', '(unknown)') as game,
      count(*)::bigint as click_count,
      mode() within group (
        order by nullif(trim(ae.properties ->> 'path'), '')
      ) as page_path,
      mode() within group (
        order by nullif(trim(ae.properties ->> 'url'), '')
      ) as download_url
    from public.analytics_events ae
    where ae.event_name = 'download_click'
      and ae.created_at >= now() - p_since
    group by 1
  ),
  ordered as (
    select
      game,
      click_count,
      page_path,
      download_url,
      count(*) over ()::bigint as total_count
    from per_game
    order by click_count desc, game asc
  )
  select game, click_count, page_path, download_url, total_count
  from ordered
  limit greatest(p_limit, 1)
  offset greatest(p_offset, 0);
$$;

revoke all on function public.analytics_top_download_games(interval, integer, integer) from public;
grant execute on function public.analytics_top_download_games(interval, integer, integer) to service_role;
