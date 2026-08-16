import { getServiceSupabase } from '../../lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req,res){
  const sb = getServiceSupabase();
  if(req.method === 'POST'){
    const { businessName, email, trade, basePrice, perUnit, travelFee } = req.body;
    const id = uuidv4();
    const pricing = { basePrice: Number(basePrice)||150, perUnit: Number(perUnit)||50, travelFee: Number(travelFee)||10 };
    const tenant = { id, business_name: businessName||'My Service', email, trade, pricing, subscription: {status:'inactive'} };
    try{
      await sb.from('tenants').insert(tenant);
      // insert default services
      const services = (trade === 'Plumber') ? [
        {id: id+'-leak', tenant_id:id, name:'Leak Repair', unit_name:'hours', default_units:2},
        {id: id+'-pipe', tenant_id:id, name:'Pipe Replacement', unit_name:'feet', default_units:20},
        {id: id+'-water', tenant_id:id, name:'Water Heater Install', unit_name:'units', default_units:1}
      ] : (trade === 'HVAC') ? [
        {id: id+'-repair', tenant_id:id, name:'HVAC Repair', unit_name:'hours', default_units:2},
        {id: id+'-install', tenant_id:id, name:'System Install', unit_name:'tons', default_units:3},
        {id: id+'-maint', tenant_id:id, name:'Maintenance Visit', unit_name:'visits', default_units:1}
      ] : [
        {id: id+'-shingles', tenant_id:id, name:'Shingle Repair', unit_name:'sqft', default_units:100},
        {id: id+'-replace', tenant_id:id, name:'Roof Replacement', unit_name:'sqft', default_units:1200},
        {id: id+'-inspection', tenant_id:id, name:'Roof Inspection', unit_name:'visits', default_units:1}
      ];
      await sb.from('services').insert(services);
      res.json({id});
    }catch(e){
      console.error(e);
      res.status(500).json({error: e.message});
    }
  }else if(req.method === 'GET'){
    const id = req.query.id;
    if(!id) return res.status(400).json({error:'id required'});
    try{
      const { data: tenant } = await sb.from('tenants').select('*').eq('id', id).single();
      const { data: services } = await sb.from('services').select('*').eq('tenant_id', id);
      res.json({tenant, services});
    }catch(e){ res.status(500).json({error:e.message}); }
  }else if(req.method === 'POST' && req.query.update === 'true'){
    // not used
    res.status(400).json({error:'not implemented'});
  }else{
    res.status(405).json({error:'method not allowed'});
  }
}
