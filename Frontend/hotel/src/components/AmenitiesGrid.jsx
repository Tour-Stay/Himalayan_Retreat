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
    <section id="amenities" className="py-10 sm:py-14 px-4 bg-[#FAF6EF]/60 relative border-b border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FAF6EF] text-[#7C1D23] text-xs font-semibold tracking-[0.2em] uppercase mb-4 border border-[#C5A059]/30 font-cinzel">
            Hotel Facilities &amp; Comforts
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2523] font-medium mb-4 tracking-tight leading-tight">
            Everything You Need for a Comfortable Stay
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059]/60 mx-auto my-4"></div>
          <p className="text-[#5C5350] text-base sm:text-lg font-normal leading-relaxed">
            We make sure your stay is warm, cozy, and hassle-free even in the cold mountain winter.
          </p>
        </div>

        {/* Luxury Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {amenities.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="bg-[#FDFBF7] p-7 rounded-3xl border border-[#C5A059]/25 shadow-xs hover:shadow-lg hover:border-[#7C1D23]/35 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF6EF] text-[#7C1D23] flex items-center justify-center mb-5 group-hover:bg-[#7C1D23] group-hover:text-[#FDFBF7] transition-all duration-300 border border-[#C5A059]/30 shadow-xs">
                    <IconComponent className="w-6 h-6 transition-transform group-hover:scale-105" />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#2C2523] mb-2 group-hover:text-[#7C1D23] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[#5C5350] text-sm leading-relaxed font-normal">
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
