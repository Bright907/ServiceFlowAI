import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Widget(){
  const router = useRouter();
  const { tenantId } = router.query;
  const [tenant, setTenant] = useState(null);
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState({basePrice:150,perUnit:50,travelFee:10});

  useEffect(()=>{ if(!tenantId) return; fetch('/api/tenants/'+tenantId).then(r=>r.json()).then(j=>{ setTenant(j.tenant); setPricing(j.tenant.pricing || pricing); setServices(j.services || []); }); },[tenantId]);

  function compute(svc, units, address){
    const distance = Math.min(30, Math.max(1, Math.round((address||'').length % 12)));
    const est = pricing.basePrice + pricing.perUnit * units + pricing.travelFee * distance;
    return {est, distance};
  }

  async function book(e){
    e.preventDefault();
    const form = e.target;
    const payload = { name: form.name.value, email: form.contact.value, phone: form.contact.value, address: form.address.value, service: form.service.value, units: Number(form.units.value), estimate: Number(form.estimate.value), message: form.message.value };
    const res = await fetch('/api/leads', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({tenantId, ...payload})});
    const j = await res.json(); if(j.ok) alert('Thanks — we captured your request.'); else alert('Error');
  }

  return (
    <div className="widget container">
      <Head><title>Widget</title></Head>
      <h2>{tenant?.business_name || 'Service'} — Get an estimate</h2>
      <p>Service: <strong>{tenant?.trade}</strong></p>

      <form id="calc" onSubmit={book}>
        <label>Your name<br/><input name="name" required /></label>
        <label>Phone or email<br/><input name="contact" required /></label>
        <label>Address<br/><input name="address" required /></label>
        <label>Choose service<br/>
          <select name="service" id="serviceSelect">
            {(services.length?services:[{id:'default',name:'General',unit_name:'units',default_units:1}]).map(s=>(<option key={s.id} value={s.name} data-units={s.default_units}>{s.name}</option>))}
          </select>
        </label>
        <label>Estimated units (<span id="unitName">units</span>)<br/><input name="units" id="unitsInput" type="number" defaultValue={1} /></label>

        <div className="estimate">
          <strong>Estimate:</strong> <span id="estimate">—</span>
        </div>

        <label>Message (optional)<br/><textarea name="message"></textarea></label>
        <button className="button" type="submit">Book Inspection</button>
      </form>

      <script dangerouslySetInnerHTML={{__html:`(function(){
        var pricing = ${JSON.stringify(pricing)};
        var services = ${JSON.stringify(services)};
        var serviceSelect = document.getElementById('serviceSelect');
        var unitsInput = document.getElementById('unitsInput');
        var unitName = document.getElementById('unitName');
        var estimateEl = document.getElementById('estimate');
        function compute(){
          var idx = serviceSelect.selectedIndex; var svc = services[idx] || services[0] || {default_units:1,unit_name:'units'};
          var units = Number(unitsInput.value) || svc.default_units || 1;
          unitName.textContent = svc.unit_name || 'units';
          var address = document.querySelector('input[name="address"]').value || '';
          var distance = Math.min(30, Math.max(1, Math.round(address.length % 12)));
          var est = pricing.basePrice + pricing.perUnit * units + pricing.travelFee * distance;
          estimateEl.textContent = '$' + est.toFixed(2);
          var hidden = document.querySelector('input[name="estimate"]'); if(hidden) hidden.value = est;
        }
        serviceSelect && serviceSelect.addEventListener('change', function(){ unitsInput.value = serviceSelect.selectedOptions[0].getAttribute('data-units') || 1; compute(); });
        unitsInput && unitsInput.addEventListener('input', compute);
        document.querySelector('input[name="address"]') && document.querySelector('input[name="address"]').addEventListener('input', compute);
        compute();
      })()`}} />
    </div>
  )
}
