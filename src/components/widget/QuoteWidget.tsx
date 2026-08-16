import { useMemo, useState } from 'react';
import {
  MapPin,
  Minus,
  Plus,
  Zap,
  CircleCheck,
  Loader2,
  Calculator,
} from 'lucide-react';
import type { PricingConfig, Trade } from '@/lib/types';
import { TRADES, calculateEstimate } from '@/lib/trades';
import { supabase } from '@/lib/supabase';

interface QuoteWidgetProps {
  companyName: string;
  trade: Trade;
  pricing: PricingConfig;
  contractorId?: string;
  persist?: boolean;
}

export default function QuoteWidget({
  companyName,
  trade,
  pricing,
  contractorId,
  persist = true,
}: QuoteWidgetProps) {
  const config = TRADES[trade];
  const [address, setAddress] = useState('');
  const [service, setService] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(config.quantityDefault);
  const [isEmergency, setIsEmergency] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimate = useMemo(
    () => calculateEstimate(pricing, quantity, isEmergency),
    [pricing, quantity, isEmergency]
  );

  const canBook = address.trim().length > 3 && !!service;
  const Icon = config.icon;

  function adjustQuantity(delta: number) {
    setQuantity((q) => Math.min(config.quantityMax, Math.max(config.quantityMin, q + delta)));
  }

  function resetWidget() {
    setAddress(''); setService(null); setQuantity(config.quantityDefault);
    setIsEmergency(false); setShowBookingForm(false);
    setName(''); setEmail(''); setPhone('');
    setSubmitted(false); setError(null);
  }

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !phone.trim() || !service) return;
    setSubmitting(true); setError(null);
    if (persist && contractorId) {
      const { error: insertError } = await supabase.from('leads').insert({
        contractor_id: contractorId, homeowner_name: name.trim(),
        email: email.trim(), phone: phone.trim(), address: address.trim(),
        service_type: service, quantity, is_emergency: isEmergency, estimated_cost: estimate,
      });
      if (insertError) { setSubmitting(false); setError('Something went wrong. Please try again.'); return; }
    } else { await new Promise((resolve) => setTimeout(resolve, 700)); }
    setSubmitting(false); setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <CircleCheck className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Request Received!</h3>
        <p className="text-slate-600 mb-6">Thanks {name.split(' ')[0] || 'there'} — {companyName} will reach out shortly to confirm your free inspection for an estimated <span className="font-semibold text-slate-900">${estimate}</span>.</p>
        <button onClick={resetWidget} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">Get another quote</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold leading-tight truncate">{companyName}</p>
          <p className="text-slate-400 text-xs leading-tight">Instant {config.label} Quote</p>
        </div>
      </div>
      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Springfield" className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Select a Service</label>
          <div className="grid grid-cols-2 gap-2">
            {config.services.map((s) => (
              <button key={s} type="button" onClick={() => setService(s)} className={`text-left px-3 py-2 rounded-lg border text-sm font-medium transition-all ${service === s ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>{s}</button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{config.quantityLabel}</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => adjustQuantity(-1)} className="w-9 h-9 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"><Minus className="w-4 h-4" /></button>
              <span className="w-14 text-center font-semibold text-slate-900">{quantity}</span>
              <button type="button" onClick={() => adjustQuantity(1)} className="w-9 h-9 rounded-lg border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
          <label className="flex-1 flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-slate-200 cursor-pointer select-none">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700"><Zap className="w-4 h-4 text-amber-500" />Rush job?</span>
            <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} className="w-4 h-4 accent-blue-600" />
          </label>
        </div>
        {service && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide"><Calculator className="w-3.5 h-3.5" />Your Instant Estimate</div>
            <div className="flex items-baseline justify-between"><span className="text-sm text-slate-600">{service}</span><span className="text-3xl font-bold text-slate-900">${estimate}</span></div>
            {isEmergency && <p className="text-xs text-amber-600 mt-1">Includes rush service surcharge</p>}
          </div>
        )}
        {!showBookingForm && (
          <button type="button" disabled={!canBook} onClick={() => setShowBookingForm(true)} className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors">Book Free Inspection</button>
        )}
        {showBookingForm && (
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-700 pt-3">Almost done — where should we send confirmation?</p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="button" disabled={submitting || !name.trim() || !email.trim() || !phone.trim()} onClick={handleSubmit} className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">{submitting && <Loader2 className="w-4 h-4 animate-spin" />}{submitting ? 'Submitting...' : 'Confirm & Request Inspection'}</button>
          </div>
        )}
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-center"><p className="text-[11px] text-slate-400">Powered by ServiceFlowAI</p></div>
    </div>
  );
}
