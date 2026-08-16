import { useEffect, useState } from 'react';
import { Trash2, Loader2, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Lead, LeadStatus } from '@/lib/types';

interface LeadsTableProps {
  contractorId: string;
  refreshKey: number;
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  booked: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-slate-100 text-slate-500 border-slate-200',
};

const STATUSES: LeadStatus[] = ['new', 'contacted', 'booked', 'closed'];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function LeadsTable({ contractorId, refreshKey }: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase.from('leads').select('*').eq('contractor_id', contractorId).order('created_at', { ascending: false }).then(({ data }) => {
      if (!cancelled) { setLeads((data as Lead[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [contractorId, refreshKey]);

  async function handleStatusChange(lead: Lead, status: LeadStatus) {
    setUpdatingId(lead.id);
    const { error } = await supabase.from('leads').update({ status }).eq('id', lead.id);
    setUpdatingId(null);
    if (!error) setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
  }

  async function handleDelete(lead: Lead) {
    setDeletingId(lead.id);
    const { error } = await supabase.from('leads').delete().eq('id', lead.id);
    setDeletingId(null);
    if (!error) setLeads((prev) => prev.filter((l) => l.id !== lead.id));
  }

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 text-blue-600 animate-spin" /></div>;

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3"><Inbox className="w-6 h-6 text-slate-400" /></div>
        <p className="text-sm font-medium text-slate-600">No leads yet</p>
        <p className="text-xs text-slate-400 mt-1">Once homeowners start using your widget, their inquiries will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-2">Homeowner</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-2 hidden md:table-cell">Service</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-2 hidden lg:table-cell">Address</th>
            <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-2">Estimate</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-2">Status</th>
            <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide py-3 px-2 hidden sm:table-cell">Received</th>
            <th className="py-3 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <td className="py-3 px-2"><p className="text-sm font-medium text-slate-900">{lead.homeowner_name}</p><p className="text-xs text-slate-500">{lead.email}</p><p className="text-xs text-slate-500">{lead.phone}</p></td>
              <td className="py-3 px-2 hidden md:table-cell"><p className="text-sm text-slate-700">{lead.service_type}</p><p className="text-xs text-slate-400">{lead.quantity} {lead.is_emergency && <span className="text-amber-600 font-medium">Rush</span>}</p></td>
              <td className="py-3 px-2 hidden lg:table-cell"><p className="text-sm text-slate-600 max-w-[200px] truncate">{lead.address}</p></td>
              <td className="py-3 px-2 text-right"><span className="text-sm font-semibold text-slate-900">${Number(lead.estimated_cost).toLocaleString()}</span></td>
              <td className="py-3 px-2"><select value={lead.status} disabled={updatingId === lead.id} onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)} className={`text-xs font-medium rounded-full border px-2.5 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_STYLES[lead.status]}`}>{STATUSES.map((s) => (<option key={s} value={s} className="bg-white text-slate-700 capitalize">{s}</option>))}</select></td>
              <td className="py-3 px-2 hidden sm:table-cell"><span className="text-xs text-slate-500">{formatDate(lead.created_at)}</span></td>
              <td className="py-3 px-2 text-right"><button onClick={() => handleDelete(lead)} disabled={deletingId === lead.id} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50" aria-label="Delete lead">{deletingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
