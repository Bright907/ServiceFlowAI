import QuoteWidget from '@/components/widget/QuoteWidget';
import type { Contractor, PricingConfig } from '@/lib/types';

interface WidgetPreviewPanelProps {
  contractor: Contractor;
  pricing: PricingConfig;
}

export default function WidgetPreviewPanel({ contractor, pricing }: WidgetPreviewPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Live Widget Preview</h2>
      <p className="text-sm text-slate-500 mb-5">This is exactly what homeowners will see. Try it out — submissions here won't create real leads.</p>
      <div className="max-w-md mx-auto">
        <QuoteWidget companyName={contractor.company_name} trade={contractor.trade} pricing={pricing} persist={false} />
      </div>
    </div>
  );
}
