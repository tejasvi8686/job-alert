-- Run this once in the Supabase SQL editor to speed up dashboard reads.
-- These indexes match the app's hot paths:
-- - current user's alert profile
-- - current user's recent alert history ordered by sent_at

create index if not exists user_roles_user_id_idx
  on public.user_roles (user_id);

create index if not exists job_alert_history_user_id_sent_at_idx
  on public.job_alert_history (user_id, sent_at desc);
