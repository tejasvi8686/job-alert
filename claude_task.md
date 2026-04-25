# AI Job Subscription Agent

## Product Goal

A web app where users subscribe to job alerts and receive AI-filtered job listings every morning via email.

---

## Status

### Phase 1 — Subscription MVP [DONE]

- [x] Supabase table `user_roles` with email, role, skill, location, user_id
- [x] RLS policies scoped to authenticated users
- [x] Supabase client utilities (browser + server)
- [x] Subscribe API route (`app/api/subscribe/route.ts`)
- [x] Subscription form with validation, loading state, success/error messages
- [x] Landing page (`app/page.tsx`)

### Phase 2 — AI + Cron + Email [DONE]

- [x] Job fetcher from RemoteOK API (`lib/jobs.ts`)
- [x] OpenAI filtering — gpt-4o-mini, top 5 jobs with match scores
- [x] Email sender via Resend (`lib/email.ts`)
- [x] Cron API route — loops all subscribers, filters, emails (`app/api/cron/route.ts`)
- [x] Vercel cron config — daily at 9 AM (`vercel.json`)
- [x] Tested end-to-end: subscribe → AI filter → email delivery

### Phase 3 — Auth System [DONE]

- [x] Supabase Auth (Google Sign In + Email OTP)
- [x] Protect subscribe flow — linked to authenticated users via user_id
- [x] Session handling with proxy.ts (Next.js 16)
- [x] Server actions for sendOtp, verifyOtp, logOut
- [x] Auth callback route for OAuth/email confirmation
- [x] shadcn/ui components across all pages

### Phase 4 — Email Template + Deploy [NEXT]

- [ ] HTML styled email template (replace plain text)
- [ ] Unsubscribe link in email footer
- [ ] Deploy to Vercel (cron goes live)

### Phase 5 — Dashboard

- [ ] User profile, subscription status
- [ ] Past job alerts history
- [ ] Update role, skills, location
- [ ] Manage subscription (pause, cancel)

### Phase 6 — Payment Integration [LAST]

- [ ] Subscription plans (free tier vs paid)
- [ ] Stripe or Razorpay integration
- [ ] Webhooks to activate/deactivate users based on payment status
- [ ] Billing page

---

## Tech Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 + shadcn/ui
- Supabase (DB + Auth)
- OpenAI API (gpt-4o-mini)
- Resend (email)
- Vercel Cron Jobs

---

## Database (Supabase)

Table: `user_roles`

| Column     | Type         | Notes                          |
|------------|--------------|--------------------------------|
| id         | bigint       | Auto-increment PK              |
| email      | text         | Unique, not null               |
| role       | text         | Not null                       |
| skill      | text         | Not null                       |
| location   | text         | Not null                       |
| user_id    | uuid         | FK → auth.users, on delete cascade |
| created_at | timestamptz  | Default now()                  |

RLS: scoped to authenticated user's own rows. Cron uses service role to bypass.

---

## API Routes

| Route              | Method | Purpose                                      |
|--------------------|--------|----------------------------------------------|
| `/api/subscribe`   | POST   | Validate + save subscriber (auth required)   |
| `/api/cron`        | GET    | Fetch jobs, AI filter, email all subscribers  |
| `/auth/callback`   | GET    | Handle OAuth/email confirmation redirects     |

---

## Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
RESEND_API_KEY=...
CRON_SECRET=...  (optional, production)
```

---

## DO NOT BUILD (yet)

- LinkedIn scraping

---

## Important Notes

- Keep code simple and readable
- Avoid overengineering
- Focus on working end-to-end system
