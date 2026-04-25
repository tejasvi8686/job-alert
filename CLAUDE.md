# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Build & Development Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — run ESLint (flat config, Next.js core-web-vitals + TypeScript rules)
- No test runner is configured

## Stack

- **Next.js 16.2.4** with App Router (not Pages Router)
- **React 19.2.4** — server components by default
- **TypeScript** (strict mode) — path alias `@/*` maps to project root
- **Tailwind CSS v4** via `@tailwindcss/postcss` plugin
- **Geist font family** (sans + mono) loaded via `next/font`
- **Supabase** — database (project ref: `kkqumtgmwfbzrafjrhkz`)
- **OpenAI** (gpt-4o-mini) — AI job filtering
- **Resend** — transactional email delivery
- **Vercel Cron** — daily job alert scheduling

## Critical: Next.js 16 Breaking Changes

This project uses Next.js 16.2.4 which has breaking changes from earlier versions. **Always consult the bundled docs before writing code:**

- App Router docs: `node_modules/next/dist/docs/01-app/`
- API reference: `node_modules/next/dist/docs/01-app/03-api-reference/`
- Guides (auth, caching, forms, i18n, etc.): `node_modules/next/dist/docs/01-app/02-guides/`

Do not rely on memorized Next.js APIs — verify against these docs first.

## Architecture

Uses **route groups** to separate auth pages (no sidebar) from dashboard pages (with sidebar).

- `app/` — App Router
  - `layout.tsx` — root layout with Geist fonts, metadata
  - `globals.css` — Tailwind + CSS custom properties for theming (includes sidebar tokens)
  - `(auth)/` — route group: no sidebar
    - `login/page.tsx` — login page
    - `login/login-form.tsx` — client component: Google OAuth + Email OTP
  - `(dashboard)/` — route group: sidebar layout with auth guard
    - `layout.tsx` — sidebar + main content area, redirects to /login if unauthenticated
    - `page.tsx` — dashboard home: subscription status cards, test email button, recent alerts
    - `subscribe-form.tsx` — client component: email, role, skill, location inputs
    - `test-email-button.tsx` — client component: triggers test email
    - `settings/page.tsx` — update preferences (role, skill, location)
    - `settings/settings-form.tsx` — client component: pre-populated preferences form
    - `history/page.tsx` — past job alert history with job details and match scores
  - `auth/callback/route.ts` — OAuth/email callback handler
  - `actions/auth.ts` — server actions: sendOtp, verifyOtp, logOut
  - `actions/preferences.ts` — server action: updatePreferences
  - `api/subscribe/route.ts` — POST: validates + inserts subscriber into Supabase
  - `api/unsubscribe/route.ts` — GET: deletes subscriber by ID (from email link)
  - `api/cron/route.ts` — GET: fetches jobs, AI-filters per subscriber, sends emails, stores history (protected by CRON_SECRET)
  - `api/test-email/route.ts` — POST: sends test email for current user (1/hour rate limit)
- `components/` — shared components
  - `sidebar-nav.tsx` — client component: sidebar navigation with active link highlighting
  - `logout-button.tsx` — client component: logout form
  - `ui/` — shadcn/ui components (button, input, card, label, separator)
- `lib/` — shared utilities
  - `supabase-server.ts` — server-side Supabase client (cookie-based auth via @supabase/ssr)
  - `supabase-browser.ts` — browser-side Supabase client
  - `supabase.ts` — legacy basic client
  - `jobs.ts` — RemoteOK job fetcher + OpenAI filtering (top 5 with match scores)
  - `email.ts` — Resend HTML email sender with styled template
- `vercel.json` — cron schedule (daily 9 AM UTC)
- Dark mode via `prefers-color-scheme` media query and CSS custom properties

## Database (Supabase)

Table: `user_roles`
- `id` (bigint, auto-increment PK)
- `email` (text, unique, not null)
- `role` (text, not null)
- `skill` (text, not null)
- `location` (text, not null)
- `user_id` (uuid, references auth.users)
- `created_at` (timestamptz, default now())

Table: `job_alert_history`
- `id` (bigint, auto-increment PK)
- `user_id` (uuid, not null, references auth.users, cascade delete)
- `subscriber_id` (bigint, not null, references user_roles, cascade delete)
- `email` (text, not null)
- `role` (text, not null)
- `jobs` (jsonb, not null — array of FilteredJob objects)
- `job_count` (integer, not null)
- `sent_at` (timestamptz, default now())

RLS enabled on both tables. `user_roles` has public insert/select + user-scoped update. `job_alert_history` has user-scoped select only (inserts via service role).

## Environment Variables (.env.local)

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase publishable key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-only)
- `OPENAI_API_KEY` — OpenAI API key
- `RESEND_API_KEY` — Resend API key
- `CRON_SECRET` — protects cron endpoint in production
