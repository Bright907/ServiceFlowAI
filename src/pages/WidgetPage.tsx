import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Contractor } from '@/lib/types';
import QuoteWidget from '@/components/widget/QuoteWidget';

export default function WidgetPage() {
  const { contractorId } = useParams<{ contractorId: string }>();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!contractorId) return;
    let cancelled = false;
    supabase
      .from('contractors')
      .select('*')
      .eq('id', contractorId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setError(true);
          setLoading(false);
          return;
        }
        setContractor(data as Contractor);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [contractorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !contractor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-sm font-medium text-slate-700">Widget not found</p>
        <p className="text-xs text-slate-400 mt-1">
          This quote calculator link may be invalid or no longer active.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <QuoteWidget
          companyName={contractor.company_name}
          trade={contractor.trade}
          pricing={contractor.pricing}
          contractorId={contractor.id}
          persist
        />
      </div>
    </div>
  );
}
