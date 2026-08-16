import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import QuoteWidget from '@/components/widget/QuoteWidget';
import { DEFAULT_PRICING } from '@/lib/trades';

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.08),_transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"><Sparkles className="w-3.5 h-3.5" />Built for Plumbers, HVAC & Roofing Pros</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">Turn website visitors into <span className="text-blue-600">booked jobs</span> automatically</h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">ServiceFlowAI gives your home service business an instant quote calculator you can embed anywhere. Homeowners get a real price in seconds — you get a qualified lead, ready to book.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">Get Started Free<ArrowRight className="w-4 h-4" /></Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">See How It Works</a>
            </div>
            <p className="text-xs text-slate-400 mt-4">No credit card required &middot; Live in minutes</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-100 to-transparent rounded-3xl blur-2xl opacity-70" />
            <div className="relative">
              <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Try the live widget</p>
              <QuoteWidget companyName="Apex Plumbing Co." trade="plumbing" pricing={DEFAULT_PRICING} persist={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
