/* eslint-disable @typescript-eslint/no-unused-vars */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Serverless endpoint to accept lead submissions and write them to Supabase using a service role key.
// Deploy this function to Vercel or your serverless platform. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server not configured' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  const body = req.body;
  // basic validation
  const { widget_id, contractor_id, homeowner_name, email, phone, address, service_type, quantity, is_emergency, estimated_cost } = body || {};
  if (!contractor_id) return res.status(400).json({ error: 'contractor_id required' });
  if (!homeowner_name || !email) return res.status(400).json({ error: 'homeowner_name and email required' });

  try {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        widget_id: widget_id || null,
        contractor_id,
        homeowner_name,
        email,
        phone: phone || null,
        address: address || null,
        service_type: service_type || null,
        quantity: quantity ? Number(quantity) : null,
        is_emergency: !!is_emergency,
        estimated_cost: estimated_cost ? Number(estimated_cost) : null,
      })
      .select('*')
      .single();

    if (error) {
      console.error('supabase insert error', error);
      return res.status(500).json({ error: 'db_error', details: error });
    }

    return res.status(200).json({ ok: true, lead: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
}
