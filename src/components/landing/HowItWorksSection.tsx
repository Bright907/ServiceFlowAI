import { UserPlus, SlidersHorizontal, Code2 } from 'lucide-react';

const STEPS = [
  { icon: UserPlus, title: 'Sign up & choose your trade', description: 'Create your contractor account and tell us whether you do plumbing, HVAC, or roofing.' },
  { icon: SlidersHorizontal, title: 'Configure your pricing', description: 'Set your base service fee, your rate per unit, and your rush-job multiplier — that\'s it.' },
  { icon: Code2, title: 'Embed on your website', description: 'Copy one snippet into your site. Your instant quote calculator goes live immediately.' },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">Live in three steps</h2>
          <p className="text-lg text-slate-600 leading-relaxed">No developers, no complicated setup. Most contractors are collecting leads within minutes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20"><step.icon className="w-5 h-5 text-white" /></div>
                <span className="text-4xl font-bold text-slate-200">0{i + 1}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
