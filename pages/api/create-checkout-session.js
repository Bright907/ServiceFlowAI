import Stripe from 'stripe'
import { getServiceSupabase } from '../../lib/supabase'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export default async function handler(req,res){
  if(req.method !== 'POST') return res.status(405).end();
  if(!stripe) return res.status(500).json({error:'Stripe not configured'});
  const { tenantId } = req.body;
  const sb = getServiceSupabase();
  try{
    const host = (process.env.NEXT_PUBLIC_BASE_URL) || (req.headers.origin || (req.protocol+'://'+req.headers.host));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{ price_data: { currency: 'usd', product_data: { name: `ServiceFlowAI subscription` }, unit_amount: 4900 }, quantity: 1 }],
      success_url: `${host}/dashboard/${tenantId}?checkout=success`,
      cancel_url: `${host}/dashboard/${tenantId}?checkout=cancel`,
      metadata: { tenantId }
    });
    res.json({url: session.url});
  }catch(e){ console.error(e); res.status(500).json({error:e.message}); }
}
