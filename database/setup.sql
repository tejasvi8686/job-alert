-- ╔══════════════════════════════════════════════════════════════════════════════╗
-- ║  JobAlert — Consolidated Database Setup                                    ║
-- ║                                                                            ║
-- ║  This file combines the four individual migration scripts into a single    ║
-- ║  setup file that can be run in the Supabase SQL editor to bootstrap or     ║
-- ║  update the database in one shot.                                          ║
-- ║                                                                            ║
-- ║  Safe to re-run: every statement is idempotent (IF NOT EXISTS, DO blocks   ║
-- ║  with existence checks, etc.).                                             ║
-- ║                                                                            ║
-- ║  Source files (preserved alongside this file):                             ║
-- ║    1. job-preferences.sql                                                  ║
-- ║    2. saved-jobs.sql                                                       ║
-- ║    3. product-upgrade.sql                                                  ║
-- ║    4. performance-indexes.sql                                              ║
-- ╚══════════════════════════════════════════════════════════════════════════════╝


-- ═══════════════════════════════════════════════════════════════════════════════
-- Section 1: Job Preferences
-- Adds richer matching preference columns to user_roles.
-- (source: job-preferences.sql)
-- ═══════════════════════════════════════════════════════════════════════════════

alter table public.user_roles
  add column if not exists experience_level text not null default 'Mid',
  add column if not exists years_experience integer not null default 2,
  add column if not exists job_type text not null default 'Full-time',
  add column if not exists min_salary integer,
  add column if not exists salary_currency text not null default 'USD',
  add column if not exists alert_frequency text not null default 'Daily',
  add column if not exists min_match_score integer not null default 60,
  add column if not exists max_jobs_per_email integer not null default 5,
  add column if not exists alerts_paused boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'user_roles_years_experience_check'
  ) then
    alter table public.user_roles
      add constraint user_roles_years_experience_check
      check (years_experience >= 0 and years_experience <= 50) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'user_roles_min_match_score_check'
  ) then
    alter table public.user_roles
      add constraint user_roles_min_match_score_check
      check (min_match_score >= 0 and min_match_score <= 100) not valid;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'user_roles_max_jobs_per_email_check'
  ) then
    alter table public.user_roles
      add constraint user_roles_max_jobs_per_email_check
      check (max_jobs_per_email >= 1 and max_jobs_per_email <= 20) not valid;
  end if;
end $$;


-- ═══════════════════════════════════════════════════════════════════════════════
-- Section 2: Saved Jobs
-- Creates the saved_jobs table with RLS policies.
-- (source: saved-jobs.sql)
-- ═══════════════════════════════════════════════════════════════════════════════

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


-- ═══════════════════════════════════════════════════════════════════════════════
-- Section 3: Product Upgrade
-- Adds feedback, tracker status, richer profile fields, and
-- multiple-profile foundations.
-- (source: product-upgrade.sql)
-- ═══════════════════════════════════════════════════════════════════════════════

alter table public.user_roles
  add column if not exists profile_name text not null default 'Main profile',
  add column if not exists is_active boolean not null default true,
  add column if not exists resume_text text,
  add column if not exists linkedin_url text,
  add column if not exists github_url text,
  add column if not exists portfolio_url text,
  add column if not exists preferred_keywords text,
  add column if not exists excluded_keywords text,
  add column if not exists hidden_companies text;

do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'user_roles'
      and con.contype = 'u'
      and pg_get_constraintdef(con.oid) = 'UNIQUE (email)'
  loop
    execute format('alter table public.user_roles drop constraint %I', constraint_name);
  end loop;
end $$;

create index if not exists user_roles_user_id_active_idx
  on public.user_roles (user_id, is_active);

alter table public.saved_jobs
  add column if not exists status text not null default 'saved',
  add column if not exists last_action_at timestamptz not null default now(),
  add column if not exists notes text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'saved_jobs_status_check'
  ) then
    alter table public.saved_jobs
      add constraint saved_jobs_status_check
      check (status in ('saved', 'applied', 'interviewing', 'rejected', 'offer')) not valid;
  end if;
end $$;

create index if not exists saved_jobs_user_id_status_idx
  on public.saved_jobs (user_id, status, saved_at desc);

create table if not exists public.job_feedback (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  alert_history_id bigint references public.job_alert_history(id) on delete set null,
  saved_job_id bigint references public.saved_jobs(id) on delete set null,
  apply_link text not null,
  company text,
  title text,
  feedback_type text not null,
  created_at timestamptz not null default now(),
  unique (user_id, apply_link, feedback_type)
);

alter table public.job_feedback enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'job_feedback'
      and policyname = 'Users can read own job feedback'
  ) then
    create policy "Users can read own job feedback"
      on public.job_feedback
      for select
      to authenticated
      using ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'job_feedback'
      and policyname = 'Users can create own job feedback'
  ) then
    create policy "Users can create own job feedback"
      on public.job_feedback
      for insert
      to authenticated
      with check ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'job_feedback'
      and policyname = 'Users can update own job feedback'
  ) then
    create policy "Users can update own job feedback"
      on public.job_feedback
      for update
      to authenticated
      using ((select auth.uid()) = user_id)
      with check ((select auth.uid()) = user_id);
  end if;
end $$;

create index if not exists job_feedback_user_id_type_idx
  on public.job_feedback (user_id, feedback_type, created_at desc);


-- ═══════════════════════════════════════════════════════════════════════════════
-- Section 4: Performance Indexes
-- Speeds up dashboard reads (user profile lookups, recent alert history).
-- (source: performance-indexes.sql)
-- ═══════════════════════════════════════════════════════════════════════════════

create index if not exists user_roles_user_id_idx
  on public.user_roles (user_id);

create index if not exists job_alert_history_user_id_sent_at_idx
  on public.job_alert_history (user_id, sent_at desc);
