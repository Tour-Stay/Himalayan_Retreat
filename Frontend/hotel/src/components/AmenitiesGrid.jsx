import { FlameIcon, DropletIcon, ZapIcon, MountainIcon, WifiIcon, CoffeeIcon, ShieldCheckIcon } from '@shared';

const amenities = [
  {
    icon: FlameIcon,
    title: 'Room Heating & Bed Warmers',
    description: 'Every room is equipped with room heaters and electric bed warmers so you stay cozy and warm during chilly mountain nights.',
  },
  {
    icon: DropletIcon,
    title: '24-Hour Hot Water',
    description: 'Dedicated water geysers in every bathroom guarantee steaming hot water whenever you need a shower.',
  },
  {
    icon: ZapIcon,
    title: '100% Power Backup',
    description: 'Generators and battery backup keep your room lights, Wi-Fi, and heaters running without power interruption.',
  },
  {
    icon: MountainIcon,
    title: 'Private Snow-View Balcony',
    description: 'Enjoy clear 180° views of snow peaks like Mount Trishul and Nanda Devi right outside your bedroom door.',
  },
  {
    icon: WifiIcon,
    title: 'Free High-Speed Wi-Fi',
    description: 'Fast and reliable internet across all rooms and common areas, perfect for staying connected with family.',
  },
  {
    icon: DropletIcon,
    title: 'Clean Mountain Water',
    description: 'Pure, multi-filtered mountain drinking water provided fresh in glass bottles in every room.',
  },
  {
    icon: CoffeeIcon,
    title: 'Electric Kettle & Tea Kit',
    description: 'In-room kettle with green tea, masala tea bags, fresh coffee, and mountain honey for a warm hot cup anytime.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Direct Car Parking',
    description: 'Drive right up to our hotel entrance with free, secure private parking and helpful staff to carry your luggage.',
  },
];

const AmenitiesGrid = () => {
  return (
    <section id="amenities" className="py-14 sm:py-18 px-4 bg-[#F8FAF7] relative border-b border-[#073125]/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-xs">
            HOTEL FACILITIES &amp; COMFORTS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#073125] font-normal mb-3 tracking-tight leading-tight">
            Everything You Need for Mountain Comfort
          </h2>
          <p className="text-[#073125]/80 text-base sm:text-lg font-light leading-relaxed">
            We make sure your stay is warm, cozy, and peaceful even during the coldest winter nights.
          </p>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {amenities.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-7 rounded-3xl border border-[#073125]/10 shadow-xs hover:shadow-md hover:border-[#073125]/30 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF2EA] text-[#073125] flex items-center justify-center mb-5 group-hover:bg-[#073125] group-hover:text-[#C9F24D] transition-all duration-300 border border-[#073125]/10 shadow-xs">
                    <IconComponent className="w-6 h-6 transition-transform group-hover:scale-105" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#073125] mb-2 group-hover:text-[#12433B] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#073125]/75 text-sm leading-relaxed font-light">
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
