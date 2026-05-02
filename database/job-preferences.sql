-- Run this once in the Supabase SQL editor to add richer matching preferences.

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
