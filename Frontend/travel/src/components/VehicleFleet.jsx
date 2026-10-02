import { UsersIcon, LuggageIcon, CheckCircleIcon, ArrowUpRightIcon } from '@shared';
import { fleetData } from '../data/travelData';

const VehicleFleet = ({ onBookFleet }) => {
  return (
    <section id="fleet" className="py-24 px-4 bg-ivory border-b border-gold/15 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3 block font-mono">
            Himalayan Fleet Collection
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-medium mb-4">
            Tailored Mountain Transports
          </h2>
          <p className="text-charcoal-muted text-base sm:text-lg font-light leading-relaxed">
            High ground-clearance vehicles inspected for mountain ghats, piloted by native Pahadi chauffeurs who know every hill curve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {fleetData.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-ivory rounded-3xl overflow-hidden border border-gold/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between card-luxury"
            >
              <div>
                {/* Vehicle Image */}
                <div className="relative h-60 overflow-hidden bg-slate">
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    onError={(e) => { e.currentTarget.src = '/mountain-fleet.jpg'; }}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
                  
                  <span className="absolute top-4 left-4 bg-maroon text-ivory text-[11px] font-semibold px-3 py-1 rounded-full border border-gold/30 shadow-md">
                    {vehicle.tag}
                  </span>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-ivory text-xs">
                    <span className="bg-slate/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5 font-mono">
                      <UsersIcon className="w-3.5 h-3.5 text-gold" />
                      <span>{vehicle.seats} Passengers</span>
                    </span>
                    <span className="bg-slate/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5 font-mono">
                      <LuggageIcon className="w-3.5 h-3.5 text-gold" />
                      <span>{vehicle.luggage.split(' ')[0]} Bags</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                  <h3 className="font-serif text-2xl font-medium text-charcoal mb-1">
                    {vehicle.title}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-gold font-mono font-semibold mb-4">
                    {vehicle.model}
                  </p>
                  <p className="text-sm text-charcoal-muted font-light leading-relaxed mb-6">
                    {vehicle.idealFor}
                  </p>

                  <div className="space-y-2.5 mb-6 pt-4 border-t border-gold/20">
                    {vehicle.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-charcoal">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-6 sm:p-8 pt-0 border-t border-gold/15 mt-auto">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block font-mono">
                      Starting At
                    </span>
                    <span className="font-serif text-3xl font-semibold text-maroon">
                      ₹{vehicle.dailyRate?.toLocaleString()}
                    </span>
                    <span className="text-xs text-charcoal-muted ml-1">/ day</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-charcoal bg-gold/15 px-3 py-1 rounded-full border border-gold/30">
                      ₹{vehicle.perKmRate}/km
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onBookFleet) onBookFleet(vehicle.id);
                    const calcEl = document.getElementById('calculator');
                    if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold bg-maroon hover:bg-maroon-dark text-ivory flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <span>Select & Calculate Fare</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleFleet;
