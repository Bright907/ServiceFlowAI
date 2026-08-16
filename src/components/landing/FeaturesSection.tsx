import { Zap, Code2, Table2, Smartphone, SlidersHorizontal, ShieldCheck } from 'lucide-react';

const FEATURES = [
  { icon: Zap, title: 'Instant Estimates', description: 'Homeowners get a real price in seconds instead of waiting for a callback.' },
  { icon: Code2, title: 'Embeddable Widget', description: 'One script tag drops a fully interactive calculator right onto your site.' },
  { icon: Table2, title: 'Lead Capture Dashboard', description: 'Every inquiry lands in your dashboard with contact info and estimated value.' },
  { icon: SlidersHorizontal, title: 'Trade-Specific Pricing', description: 'Configure the exact pricing model that fits how you quote jobs.' },
  { icon: Smartphone, title: 'Mobile Friendly', description: 'The widget looks and feels great on any device your customers use.' },
  { icon: ShieldCheck, title: 'Secure & Reliable', description: 'Your pricing data and customer leads are private to your account only.' },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">Everything you need to convert visitors into jobs</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="p-6 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4"><feature.icon className="w-5 h-5 text-blue-600" /></div>
              <h3 className="font-semibold text-slate-900 mb-1.5">{feature.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
