import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { Contractor, PricingConfig } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import OnboardingForm from '@/components/dashboard/OnboardingForm';
import PricingConfigPanel from '@/components/dashboard/PricingConfigPanel';
import EmbedScriptPanel from '@/components/dashboard/EmbedScriptPanel';
import WidgetPreviewPanel from '@/components/dashboard/WidgetPreviewPanel';
import LeadsTable from '@/components/dashboard/LeadsTable';

export default function DashboardPage() {
  const { user } = useAuth();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from('contractors')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data) {
          setContractor(data as Contractor);
          setPricing((data as Contractor).pricing);
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!contractor || !pricing) {
    return <OnboardingForm onCreated={(c) => { setContractor(c); setPricing(c.pricing); }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader contractor={contractor} />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Configure your widget, grab your embed code, and track incoming leads.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <PricingConfigPanel
            contractor={contractor}
            onSaved={(p) => {
              setPricing(p);
              setContractor((c) => (c ? { ...c, pricing: p } : c));
            }}
          />
          <EmbedScriptPanel contractorId={contractor.id} />
        </div>

        <WidgetPreviewPanel contractor={contractor} pricing={pricing} />

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-slate-900">Leads</h2>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Refresh
            </button>
          </div>
          <p className="text-sm text-slate-500 mb-5">
            Every homeowner who submits the booking form lands here.
          </p>
          <LeadsTable contractorId={contractor.id} refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
