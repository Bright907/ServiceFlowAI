import { Wrench } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center"><Wrench className="w-3.5 h-3.5 text-white" /></div>
          <span className="font-semibold text-white text-sm">ServiceFlowAI</span>
        </div>
        <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} ServiceFlowAI. All rights reserved.</p>
      </div>
    </footer>
  );
}
