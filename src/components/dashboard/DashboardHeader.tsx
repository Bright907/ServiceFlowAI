import { Wrench, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { TRADES } from '@/lib/trades';
import type { Contractor } from '@/lib/types';

export default function DashboardHeader({ contractor }: { contractor: Contractor }) {
  const { signOut } = useAuth();
  const config = TRADES[contractor.trade];
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><Wrench className="w-4 h-4 text-white" /></div>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900 text-sm">{contractor.company_name}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1"><config.icon className="w-3 h-3" />{config.label}</p>
          </div>
        </div>
        <button onClick={signOut} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"><LogOut className="w-4 h-4" />Sign Out</button>
      </div>
    </header>
  );
}
