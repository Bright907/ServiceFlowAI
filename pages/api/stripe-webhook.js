import { buffer } from 'micro'
import Stripe from 'stripe'
import { getServiceSupabase } from '../../lib/supabase'

export const config = { api: { bodyParser: false } }

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  if(!stripe) return res.status(400).end('Stripe not configured');
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  let event;
  if(process.env.STRIPE_WEBHOOK_SECRET){
    try{ event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET); }catch(e){ console.error('Webhook signature error', e.message); return res.status(400).send(`Webhook Error: ${e.message}`); }
  }else{
    try{ event = JSON.parse(buf.toString()); }catch(e){ console.error('Invalid webhook payload'); return res.status(400).send('Invalid payload'); }
  }

  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    const tenantId = session.metadata && session.metadata.tenantId;
    if(tenantId){
      const sb = getServiceSupabase();
      await sb.from('tenants').update({ subscription: { status: 'active', checkoutSessionId: session.id } }).eq('id', tenantId);
      console.log('Tenant', tenantId, 'marked active');
    }
  }
  res.json({received:true});
}
