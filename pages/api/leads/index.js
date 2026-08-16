import { getServiceSupabase } from '../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req,res){
  const sb = getServiceSupabase();
  if(req.method === 'POST'){
    const { tenantId, name, email, phone, address, service, units, estimate, message } = req.body;
    const id = uuidv4();
    try{
      await sb.from('leads').insert({ id, tenant_id: tenantId, name, email, phone, address, service, units, estimate, message });
      res.json({ok:true, id});
    }catch(e){ console.error(e); res.status(500).json({error:e.message}); }
  }else if(req.method === 'GET'){
    const tenantId = req.query.tenantId;
    if(!tenantId) return res.status(400).json({error:'tenantId required'});
    try{
      const { data } = await sb.from('leads').select('*').eq('tenant_id', tenantId).order('created_at',{ascending:false});
      res.json({leads: data});
    }catch(e){ res.status(500).json({error:e.message}); }
  }else{
    res.status(405).json({error:'method not allowed'});
  }
}
