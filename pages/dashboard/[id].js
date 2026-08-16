import Head from 'next/head'
import { getServiceSupabase } from '../../lib/supabase'

export async function getServerSideProps(ctx){
  const id = ctx.params.id;
  const sb = getServiceSupabase();
  const { data: tenant } = await sb.from('tenants').select('*').eq('id', id).single().maybeSingle();
  let leads = [];
  if(tenant){
    const { data } = await sb.from('leads').select('*').eq('tenant_id', id).order('created_at', {ascending:false}).limit(200);
    leads = data || [];
  }
  return { props: { tenant: tenant || null, leads } };
}

export default function Dashboard({tenant, leads}){
  if(!tenant) return <div className="container">Tenant not found</div>;

  return (
    <div className="container">
      <Head><title>{tenant.business_name} — Dashboard</title></Head>
      <header>
        <h1>{tenant.business_name} — Dashboard</h1>
        <p>Trade: <strong>{tenant.trade}</strong></p>
      </header>

      <section>
        <h2>Pricing configuration</h2>
        <form id="pricingForm">
          <label>Business name<br/><input name="businessName" defaultValue={tenant.business_name} /></label>
          <label>Base price ($)<br/><input name="basePrice" type="number" defaultValue={tenant.pricing?.basePrice || 150} /></label>
          <label>Per unit ($)<br/><input name="perUnit" type="number" defaultValue={tenant.pricing?.perUnit || 50} /></label>
          <label>Travel fee per mile ($)<br/><input name="travelFee" type="number" defaultValue={tenant.pricing?.travelFee || 10} /></label>
          <button className="button" type="button" onClick={async()=>{
            const f = document.getElementById('pricingForm');
            const data = { businessName: f.businessName.value, basePrice: Number(f.basePrice.value), perUnit: Number(f.perUnit.value), travelFee: Number(f.travelFee.value) };
            const res = await fetch('/api/tenants/'+tenant.id, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
            const j = await res.json(); if(j.ok) alert('Saved'); else alert('Error');
          }}>Save</button>
        </form>
      </section>

      <section>
        <h2>Billing</h2>
        <p>Subscription status: <strong>{tenant.subscription?.status || 'inactive'}</strong></p>
        <p><em>Configure STRIPE keys in Vercel to enable billing.</em></p>
        <button className="button" onClick={async()=>{
          const res = await fetch('/api/create-checkout-session', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({tenantId: tenant.id})});
          const j = await res.json(); if(j.url) window.location = j.url; else alert('Error creating checkout');
        }}>Subscribe — $49 (prototype)</button>
      </section>

      <section>
        <h2>Embed</h2>
        <p>Copy this snippet to place the widget on your site:</p>
        <pre id="snippet"><code>{`<script src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-vercel-domain.com'}/api/embed.js?tenant=${tenant.id}" async></script>`}</code></pre>
        <p>Live preview:</p>
        <iframe src={`/widget/${tenant.id}`} style={{width:'100%',height:520,border:'1px solid #ddd',borderRadius:6}} />
      </section>

      <section>
        <h2>Leads</h2>
        <table className="leads">
          <thead><tr><th>When</th><th>Name</th><th>Service</th><th>Estimate</th><th>Contact</th></tr></thead>
          <tbody>
            {leads.length===0 ? <tr><td colSpan={5}>No leads yet — try the preview widget.</td></tr> : leads.map(l=> (
              <tr key={l.id}>
                <td>{new Date(l.created_at).toLocaleString()}</td>
                <td>{l.name}</td>
                <td>{l.service} ({l.units})</td>
                <td>${Number(l.estimate).toFixed(2)}</td>
                <td>{l.email} / {l.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer><p><a href="/">Home</a></p></footer>
    </div>
  )
}
