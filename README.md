# ServiceFlowAI

This prototype implements a minimal multi-tenant SaaS for contractors to create an embeddable quote widget.

Run:

1. npm install
2. npm start

Open http://localhost:3000

What it includes:
- Landing page
- Contractor signup form that creates a tenant and default services
- Dashboard where contractor edits 3 pricing variables and gets embed snippet
- Live preview (iframe) of the widget
- Widget that computes a demo estimate and posts leads to the server
- Leads table in the dashboard

Embed snippet example:
<script src="https://your-domain.com/embed.js?tenant=TENANT_ID" async></script>

Notes:
- This is a simple prototype using a JSON file (db.json) as a datastore. Replace with a proper DB for production.
- The estimate calculation is a demonstrative formula (base + perUnit * units + travelFee * estimatedDistance).
