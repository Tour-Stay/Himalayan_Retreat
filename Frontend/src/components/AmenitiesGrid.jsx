import { FlameIcon, DropletIcon, ZapIcon, MountainIcon, WifiIcon, CoffeeIcon, ShieldCheckIcon, CompassIcon } from './Icons';

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
    title: 'Secure Drive-in Parking & EV Support',
    description: 'Easy road access with secure private on-site parking, snow chain assistance, and dedicated luggage service to your suite.'
  }
];

const AmenitiesGrid = () => {
  return (
    <section id="amenities" className="py-28 px-4 bg-cream relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-18">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
            Thoughtful Hospitality
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-text-dark font-semibold mb-4 tracking-tight">
            Details That Make the Difference
          </h2>
          <p className="text-text-light text-base sm:text-lg font-light leading-relaxed">
            Engineered for mountain serenity and winter comfort — ensuring every detail of your stay feels effortless.
          </p>
        </div>

        {/* Luxury Amenities Grid with Calm Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="glass-surface p-7 rounded-3xl border border-gray-100/90 shadow-sm hover:shadow-xl hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-primary/8 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-secondary transition-all duration-300 shadow-xs">
                    <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-text-dark mb-2.5 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-light text-sm leading-relaxed font-light">
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
