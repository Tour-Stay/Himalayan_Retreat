import {
  Container,
  captionImg,
  diningSatvikThali,
  diningHearthCafe,
  CoffeeIcon,
  CheckCircleIcon,
  SparklesIcon,
  FlameIcon,
} from '@shared';

const diningFeatures = [
  {
    title: 'Authentic Mountain Food',
    desc: 'Traditional Kumaoni dishes: hot Bhatt ki Churkani dal, stone-ground Mandua rotis, and fresh seasonal Pahadi vegetables made with local herbs.',
  },
  {
    title: '100% Pure Vegetarian',
    desc: 'Clean pure veg food. No-onion and no-garlic meals are freshly prepared on request for pilgrims, sadhaks, and fasting guests.',
  },
  {
    title: 'Clean Mountain Water & Pure Ghee',
    desc: 'All meals are cooked with clean filtered mountain water, pure desi ghee, and served hot in traditional brass plates.',
  },
  {
    title: 'Herbal Mountain Teas',
    desc: 'Hot fresh ginger tea, wild Rhododendron (Buransh) flower juice, Tulsi green tea, and pure mountain honey.',
  },
];

const SatvikDining = () => {
  return (
    <section id="dining" className="py-10 sm:py-14 px-4 bg-[#FAF6EF]/60 border-b border-[#C5A059]/20 relative">
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-6 reveal">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#C5A059]/35 bg-[#FAF6EF] group">
              <img
                src={diningSatvikThali || captionImg}
                alt="Fresh Satvik Vegetarian Thali at The Kasar Himalayan Heights"
                className="w-full h-[440px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1817]/85 via-transparent to-transparent"></div>

              {/* Floating Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-[#7C1D23] text-[#FDFBF7] text-xs font-cinzel uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-full shadow-md border border-[#C5A059]/30 flex items-center gap-1.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>100% Pure Vegetarian Food</span>
                </span>
              </div>

              {/* Bottom Quote Banner */}
              <div className="absolute bottom-6 left-6 right-6 text-[#FDFBF7]">
                <p className="font-serif italic text-lg sm:text-xl text-[#FAF6EF] mb-1">
                  &ldquo;Fresh, wholesome home-style food that warms your heart in the cold mountain air.&rdquo;
                </p>
                <span className="text-[11px] text-[#C5A059] uppercase tracking-widest font-cinzel block">
                  Restaurant Timings • Breakfast: 7:30 - 10:30 AM | Dinner: 7:30 - 10:00 PM
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Food Description */}
          <div className="lg:col-span-6 space-y-6 reveal">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#FAF6EF] text-[#7C1D23] text-xs font-semibold tracking-[0.2em] uppercase mb-3 border border-[#C5A059]/30 font-cinzel">
                Fresh &amp; Healthy Dining
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2C2523] font-medium leading-tight">
                Fresh Pure Veg Food &amp; Mountain Tea
              </h2>
              <div className="w-16 h-0.5 bg-[#C5A059]/60 my-4"></div>
            </div>

            <p className="text-sm sm:text-base text-[#5C5350] font-normal leading-relaxed">
              Nothing feels better than a hot, fresh meal in the cool mountain breeze. Our kitchen prepares simple, flavorful home-style food using fresh local vegetables, pure desi ghee, and clean mountain water.
            </p>

            {/* 4 Feature Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {diningFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#C5A059]/25 shadow-xs"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircleIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0" />
                    <h3 className="font-serif text-sm font-semibold text-[#2C2523]">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#5C5350] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#book"
                className="px-6 py-3 rounded-full text-xs font-sans uppercase tracking-widest font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition-all shadow-md border border-[#C5A059]/40 hover:scale-102"
              >
                Book Room with Free Breakfast
              </a>
              <span className="text-xs text-[#6B615E] italic">
                *Hot breakfast is included free with every room booking
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SatvikDining;
