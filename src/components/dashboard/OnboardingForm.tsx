import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TRADES } from '@/lib/trades';
import type { Contractor, Trade } from '@/lib/types';

interface OnboardingFormProps {
  onCreated: (contractor: Contractor) => void;
}

export default function OnboardingForm({ onCreated }: OnboardingFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [trade, setTrade] = useState<Trade | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!companyName.trim() || !trade) return;
    setLoading(true); setError(null);
    const { data, error: insertError } = await supabase.from('contractors').insert({ company_name: companyName.trim(), trade }).select().maybeSingle();
    setLoading(false);
    if (insertError || !data) { setError('Something went wrong creating your profile. Please try again.'); return; }
    onCreated(data as Contractor);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Set up your business</h1>
        <p className="text-sm text-slate-500 mb-6">Tell us a bit about your company so we can configure your quote calculator.</p>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Apex Plumbing Co." className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">What's your trade?</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.entries(TRADES) as [Trade, (typeof TRADES)[Trade]][]).map(([key, config]) => (
                <button key={key} type="button" onClick={() => setTrade(key)} className={`p-4 rounded-xl border-2 text-left transition-all ${trade === key ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <config.icon className={`w-5 h-5 mb-2 ${trade === key ? 'text-blue-600' : 'text-slate-500'}`} />
                  <p className="font-semibold text-sm text-slate-900">{config.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{config.tagline}</p>
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="button" disabled={loading || !companyName.trim() || !trade} onClick={handleSubmit} className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">{loading && <Loader2 className="w-4 h-4 animate-spin" />}{loading ? 'Setting up...' : 'Continue to Dashboard'}</button>
        </div>
      </div>
    </div>
  );
}
