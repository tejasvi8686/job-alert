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

- `app/` — App Router
  - `layout.tsx` — root layout with Geist fonts, metadata
  - `page.tsx` — home page with subscription form
  - `subscribe-form.tsx` — client component: email, role, skill, location inputs
  - `globals.css` — Tailwind + CSS custom properties for theming
  - `api/subscribe/route.ts` — POST: validates + inserts subscriber into Supabase
  - `api/cron/route.ts` — GET: fetches jobs, AI-filters per subscriber, sends emails (protected by CRON_SECRET)
- `lib/` — shared utilities
  - `supabase.ts` — Supabase client
  - `jobs.ts` — RemoteOK job fetcher + OpenAI filtering (top 5 with match scores)
  - `email.ts` — Resend email sender
- `vercel.json` — cron schedule (daily 9 AM)
- `public/` — static assets
- Dark mode via `prefers-color-scheme` media query and CSS custom properties (`--background`, `--foreground`)

## Database (Supabase)

Table: `user_roles`
- `id` (bigint, auto-increment PK)
- `email` (text, unique, not null)
- `role` (text, not null)
- `skill` (text, not null)
- `location` (text, not null)
- `created_at` (timestamptz, default now())

RLS enabled with public insert/select policies.

## Environment Variables (.env.local)

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase publishable key
- `OPENAI_API_KEY` — OpenAI API key
- `RESEND_API_KEY` — Resend API key
- `CRON_SECRET` (optional) — protects cron endpoint in production
