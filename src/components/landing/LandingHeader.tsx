import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Wrench } from 'lucide-react';

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center"><Wrench className="w-4 h-4 text-white" /></div>
          <span className="font-bold text-slate-900 tracking-tight">ServiceFlowAI</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#trades" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Trades</a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">Log In</Link>
          <Link to="/signup" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">Get Started Free</Link>
        </div>
        <button className="md:hidden text-slate-700" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 space-y-3">
          <a href="#trades" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600">Trades</a>
          <a href="#how-it-works" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600">How It Works</a>
          <a href="#features" onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600">Features</a>
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/login" className="text-sm font-medium text-slate-600 py-2">Log In</Link>
            <Link to="/signup" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2.5 rounded-lg text-center">Get Started Free</Link>
          </div>
        </div>
      )}
    </header>
  );
}
