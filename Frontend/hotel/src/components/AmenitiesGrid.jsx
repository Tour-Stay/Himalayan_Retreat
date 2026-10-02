import { FlameIcon, DropletIcon, ZapIcon, MountainIcon, WifiIcon, CoffeeIcon, ShieldCheckIcon } from '@shared';

const amenities = [
  {
    icon: FlameIcon,
    title: 'Room Heating & Bed Warmers',
    description: 'Every suite is equipped with powerful multi-stage room heaters and dual electric bed warmers for toasty comfort during winter snowfall.'
  },
  {
    icon: DropletIcon,
    title: '24/7 Hot Running Geyser',
    description: 'Dedicated high-capacity water geysers ensure steaming hot showers whenever you step in from the crisp mountain air.'
  },
  {
    icon: ZapIcon,
    title: '100% Uninterrupted Power Backup',
    description: 'Heavy-duty silent generators and dedicated inverters safeguard your warmth, lighting, and Wi-Fi against mountain snowstorms.'
  },
  {
    icon: MountainIcon,
    title: 'Private Snow-View Balconies',
    description: 'Step out to uninterrupted 180° views of Nanda Devi and Trishul peaks right from your bedroom door.'
  },
  {
    icon: WifiIcon,
    title: 'High-Speed Fiber Wi-Fi',
    description: 'Ultra-stable 100 Mbps broadband across all suites and common areas for seamless streaming or mountain workations.'
  },
  {
    icon: DropletIcon,
    title: 'Pure Himalayan Spring Water',
    description: 'Directly sourced from pure alpine springs, multi-filtered to preserve natural mountain minerals and purity.'
  },
  {
    icon: CoffeeIcon,
    title: 'Artisanal In-Room Tea Stations',
    description: 'Electric kettle paired with local Kumaoni organic herbal teas, artisan coffee, and complimentary mountain snacks.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Drive-in Parking & Concierge',
    description: 'Easy road access with secure private on-site parking, snow chain assistance, and dedicated luggage service to your suite.'
  }
];

const AmenitiesGrid = () => {
  return (
    <section id="amenities" className="py-24 px-4 bg-ivory-warm/50 relative border-b border-gold/15">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-ivory text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-gold/30 font-mono">
            Thoughtful Hospitality
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-medium mb-4 tracking-tight">
            Details That Make the Difference
          </h2>
          <p className="text-charcoal-muted text-base sm:text-lg font-light leading-relaxed">
            Engineered for mountain serenity and winter comfort — ensuring every detail of your stay feels effortless.
          </p>
        </div>

        {/* Luxury Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="bg-ivory p-7 rounded-3xl border border-gold/25 shadow-sm hover:shadow-xl hover:border-gold/50 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group card-luxury"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gold/15 text-maroon flex items-center justify-center mb-5 group-hover:bg-maroon group-hover:text-ivory transition-all duration-300 border border-gold/30">
                    <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-charcoal mb-2.5 group-hover:text-maroon transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-charcoal-muted text-sm leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesGrid;
