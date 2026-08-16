const TRADE_CARDS = [
  { name: 'Plumbing', description: 'Leak repairs, drain cleaning, water heater installs & more.', image: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'HVAC', description: 'AC repair, furnace installs, duct cleaning & system replacements.', image: 'https://images.pexels.com/photos/5463581/pexels-photo-5463581.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { name: 'Roofing', description: 'Roof repairs, full replacements, inspections & storm damage.', image: 'https://images.pexels.com/photos/33404248/pexels-photo-33404248.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

export default function TradesSection() {
  return (
    <section id="trades" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">Built for the trades that keep homes running</h2>
          <p className="text-lg text-slate-600 leading-relaxed">Pick your trade during signup and ServiceFlowAI configures the right services and pricing model for you automatically.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TRADE_CARDS.map((trade) => (
            <div key={trade.name} className="group relative rounded-2xl overflow-hidden h-72 shadow-sm hover:shadow-xl transition-shadow duration-300">
              <img src={trade.image} alt={trade.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white mb-1.5">{trade.name}</h3>
                <p className="text-sm text-slate-200 leading-relaxed">{trade.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
