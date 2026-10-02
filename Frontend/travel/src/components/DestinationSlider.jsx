import { useState } from 'react';
import { destinationsData } from '../data/travelData';

const DestinationSlider = ({ onSelectDestination }) => {
  const [filter, setFilter] = useState('all');

  const filtered = destinationsData.filter((dest) => {
    if (filter === 'all') return true;
    if (filter === 'temple') return dest.category === 'temple';
    if (filter === 'hillstation') return dest.category === 'hillstation';
    if (filter === 'transfer') return dest.category === 'transfer';
    return true;
  });

  return (
    <section id="circuits" className="py-24 px-4 bg-ivory-warm/60 border-b border-gold/15 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3 block font-mono">
            Sacred Kumaon & Beyond
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-medium mb-4">
            Curated Circuits from Almora
          </h2>
          <p className="text-charcoal-muted text-base font-light leading-relaxed">
            All distances calculated accurately from our Almora hub. Chauffeured in luxury with temple darshan liaison.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { id: 'all', label: 'All Destinations' },
              { id: 'temple', label: 'Sacred Temples & Ashrams' },
              { id: 'hillstation', label: 'Hill Stations & Peaks' },
              { id: 'transfer', label: 'Station Transfers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-maroon text-ivory font-semibold shadow-md border border-gold/40'
                    : 'bg-ivory border border-gold/25 text-charcoal/80 hover:border-gold/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="bg-ivory rounded-3xl overflow-hidden border border-gold/25 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-luxury"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    onError={(e) => { e.currentTarget.src = '/resort-exterior.jpg'; }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <span className="absolute top-3.5 left-3.5 bg-slate/85 backdrop-blur-md text-gold text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-gold/30 font-mono">
                    {dest.distance}
                  </span>
                </div>

                <div className="p-5">
                  <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block font-mono mb-1">
                    {dest.categoryLabel}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-charcoal group-hover:text-maroon transition-colors mb-2">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-charcoal-muted font-light leading-relaxed line-clamp-2 mb-4">
                    {dest.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {dest.highlights.slice(0, 2).map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-ivory-warm px-2 py-0.5 rounded-md border border-gold/20 text-charcoal"
                      >
                        ✦ {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    if (onSelectDestination) onSelectDestination(dest.id);
                    const calcEl = document.getElementById('calculator');
                    if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold border border-gold/40 text-charcoal hover:bg-gold/15 transition-colors cursor-pointer"
                >
                  Calculate Fare
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationSlider;
