import { useState } from 'react';
import { Save, Loader2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { TRADES } from '@/lib/trades';
import type { Contractor, PricingConfig } from '@/lib/types';

interface PricingConfigPanelProps {
  contractor: Contractor;
  onSaved: (pricing: PricingConfig) => void;
}

export default function PricingConfigPanel({ contractor, onSaved }: PricingConfigPanelProps) {
  const config = TRADES[contractor.trade];
  const [pricing, setPricing] = useState<PricingConfig>(contractor.pricing);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: keyof PricingConfig, value: number) {
    setPricing((p) => ({ ...p, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true); setError(null);
    const { error: updateError } = await supabase.from('contractors').update({ pricing }).eq('id', contractor.id);
    setSaving(false);
    if (updateError) { setError('Failed to save pricing. Please try again.'); return; }
    setSaved(true); onSaved(pricing);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Pricing Configuration</h2>
      <p className="text-sm text-slate-500 mb-5">Adjust these three variables to match how you quote {config.label.toLowerCase()} jobs. The live preview updates instantly.</p>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Service Fee</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input type="number" min={0} value={pricing.base_fee} onChange={(e) => updateField('base_fee', Number(e.target.value))} className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Flat fee added to every quote</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">{config.rateLabel}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
            <input type="number" min={0} value={pricing.rate_per_unit} onChange={(e) => updateField('rate_per_unit', Number(e.target.value))} className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Multiplied by the {config.quantityUnit} count the homeowner selects</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Emergency / Rush Multiplier</label>
          <input type="number" min={1} step={0.1} value={pricing.emergency_multiplier} onChange={(e) => updateField('emergency_multiplier', Number(e.target.value))} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <p className="text-xs text-slate-400 mt-1">Applied to the total when a homeowner flags a rush job (e.g. 1.5 = 50% extra)</p>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
      <button type="button" disabled={saving} onClick={handleSave} className="mt-5 w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}{saving ? 'Saving...' : saved ? 'Saved!' : 'Save Pricing'}</button>
    </div>
  );
}
