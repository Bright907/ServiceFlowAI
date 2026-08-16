# ServiceFlowAI — Next.js + Supabase + Stripe

This repo is a prototype multi-tenant SaaS that lets home-service contractors create an embeddable quote widget.

Key parts:
- Next.js app (pages + API routes)
- Supabase (Postgres) for tenants, services, and leads
- Stripe Checkout + webhook to mark subscriptions active
- Vercel-ready (add environment variables in Vercel dashboard)

Environment variables to set in Vercel (Project Settings -> Environment Variables):
- NEXT_PUBLIC_SUPABASE_URL — Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase anon/public key
- SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (server-only)
- STRIPE_SECRET_KEY — Stripe secret key (sk_test_...)
- STRIPE_WEBHOOK_SECRET — Stripe webhook signing secret (whsec_...)
- NEXT_PUBLIC_BASE_URL — your deployed Vercel URL (e.g. https://serviceflowai.vercel.app)

Supabase setup:
1. Create a Supabase project and copy NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
2. In the Supabase SQL editor, run supabase/migration.sql to create tenants, services, and leads tables.
3. Add SUPABASE_SERVICE_ROLE_KEY from the Supabase Project Settings -> API (Service role key).

Stripe setup (test mode):
1. Add STRIPE_SECRET_KEY to Vercel env.
2. Use Stripe CLI locally to forward webhooks when testing: `stripe listen --forward-to localhost:3000/api/stripe-webhook` and copy the whsec_... into STRIPE_WEBHOOK_SECRET.

Deploy to Vercel:
1. Connect this GitHub repo to Vercel.
2. Add the environment variables in the Vercel dashboard.
3. Deploy. The app will be available at your Vercel domain.

Security notes:
- Do not store secrets in the repo. Use Vercel env vars or a secret manager.
- SUPABASE_SERVICE_ROLE_KEY must be server-only; never expose it to the browser.

