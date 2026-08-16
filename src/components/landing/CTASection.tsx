import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 lg:py-24 bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Ready to stop losing leads to slow follow-up?</h2>
        <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto">Set up your free ServiceFlowAI account and have your quote calculator embedded before your next call ends.</p>
        <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30">Get Started Free<ArrowRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
}
