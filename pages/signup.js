import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Signup(){
  const [form, setForm] = useState({businessName:'', email:'', trade:'Plumber', basePrice:150, perUnit:50, travelFee:10});
  const router = useRouter();

  async function submit(e){
    e.preventDefault();
    const res = await fetch('/api/tenants', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)});
    const j = await res.json();
    if(j.id) router.push('/dashboard/' + j.id);
    else alert('Error creating tenant');
  }

  return (
    <div className="container narrow">
      <h1>Create your quote widget</h1>
      <form onSubmit={submit}>
        <label>Business name<br/><input required value={form.businessName} onChange={e=>setForm({...form, businessName:e.target.value})} /></label>
        <label>Email<br/><input type="email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})} /></label>
        <label>Trade<br/>
          <select value={form.trade} onChange={e=>setForm({...form, trade:e.target.value})}>
            <option>Plumber</option>
            <option>HVAC</option>
            <option>Roofer</option>
          </select>
        </label>
        <h3>Pricing variables</h3>
        <label>Base price ($)<br/><input type="number" value={form.basePrice} onChange={e=>setForm({...form, basePrice:Number(e.target.value)})} /></label>
        <label>Per unit price ($)<br/><input type="number" value={form.perUnit} onChange={e=>setForm({...form, perUnit:Number(e.target.value)})} /></label>
        <label>Travel fee per mile ($)<br/><input type="number" value={form.travelFee} onChange={e=>setForm({...form, travelFee:Number(e.target.value)})} /></label>
        <div style={{marginTop:12}}><button className="button" type="submit">Create account & open dashboard</button></div>
      </form>

      <p><a href="/">Back to home</a></p>
    </div>
  )
}
