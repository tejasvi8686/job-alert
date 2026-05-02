-- Run this once in the Supabase SQL editor before using Saved Jobs.

create table if not exists public.saved_jobs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  alert_history_id bigint references public.job_alert_history(id) on delete set null,
  title text not null,
  company text not null,
  location text,
  apply_link text not null,
  match_score integer,
  reason text,
  role text,
  status text not null default 'saved',
  last_action_at timestamptz not null default now(),
  notes text,
  saved_at timestamptz not null default now(),
  unique (user_id, apply_link)
);

alter table public.saved_jobs enable row level security;

create policy "Users can read own saved jobs"
  on public.saved_jobs
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can save own jobs"
  on public.saved_jobs
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own saved jobs"
  on public.saved_jobs
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can remove own saved jobs"
  on public.saved_jobs
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create index if not exists saved_jobs_user_id_saved_at_idx
  on public.saved_jobs (user_id, saved_at desc);
