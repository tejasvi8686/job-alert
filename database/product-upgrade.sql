-- Run this once in the Supabase SQL editor for the paid-product feature set.
-- It adds feedback, tracker status, richer profile fields, and multiple-profile foundations.

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
