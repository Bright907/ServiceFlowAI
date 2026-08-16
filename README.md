# ServiceFlowAI

This prototype implements a minimal multi-tenant SaaS for contractors to create an embeddable quote widget.

Run:

1. npm install
2. Set environment variables for Stripe (optional, to enable billing):
   - STRIPE_SECRET_KEY — your Stripe secret key (starts with sk_test_... for test)
   - STRIPE_WEBHOOK_SECRET — webhook signing secret (optional locally if using stripe CLI)
3. npm start

Open http://localhost:3000

What it includes:
- Landing page
- Contractor signup form that creates a tenant and default services
- Dashboard where contractor edits 3 pricing variables and gets embed snippet
- Live preview (iframe) of the widget
- Widget that computes a demo estimate and posts leads to the server
- Leads table in the dashboard
- Prototype Stripe checkout flow and webhook to mark tenants as subscribed

Embed snippet example:
<script src="https://your-domain.com/embed.js?tenant=TENANT_ID" async></script>

Notes:
- This is a simple prototype using a JSON file (db.json) as a datastore. Replace with a proper DB for production.
- Stripe keys must be provided via environment variables. DO NOT hard-code secrets into the repo.
- The webhook endpoint /stripe-webhook expects raw JSON for signature verification.

Local testing with Stripe CLI (recommended for webhook testing):
1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli
2. Start your app: npm start
3. In another terminal, forward webhooks and use test mode (replace with your own webhook secret once created):
   stripe listen --forward-to localhost:3000/stripe-webhook
4. Trigger a test checkout or use the test card numbers in the Stripe docs.

Security & next steps:
- Add authentication for contractor dashboards (email/password or OAuth).
- Replace db.json with a proper DB (Postgres) and add migrations.
- Harden webhook validation and server-side checks.
- Add billing plans and recurring subscriptions using Stripe Products & Prices for production usage.

