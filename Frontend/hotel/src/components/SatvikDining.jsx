import { Link } from 'react-router-dom';
import {
  Container,
  captionImg,
  diningSatvikThali,
  CheckCircleIcon,
  useSiteSettings,
} from '@shared';

const diningFeatures = [
  {
    title: 'Local Dal & Fresh Rotis',
    desc: 'Hot Bhatt dal, Mandua rotis & fresh hill veggies.',
  },
  {
    title: '100% Pure Vegetarian',
    desc: 'Pure vegetarian. Jain meals made fresh on request.',
  },
  {
    title: 'Spring Water & Desi Ghee',
    desc: 'Cooked with pure desi ghee and clean mountain water.',
  },
  {
    title: 'Hot Ginger & Herbal Tea',
    desc: 'Fresh ginger, Tulsi tea, and natural mountain honey.',
  },
];

const SatvikDining = () => {
  const { settings } = useSiteSettings();
  const diningHours = settings?.hotelPolicies?.diningHours || 'Breakfast: 7:30–10:30 AM • Dinner: 7:30–10:00 PM';

  return (
    <section id="dining" className="py-16 sm:py-20 px-4 bg-[#F8FAF7] border-b border-[#073125]/10 relative">
      <Container size="full" className="max-w-[1560px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Visual */}
          <div className="lg:col-span-6 reveal">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#073125]/15 bg-slate-900 group">
              <img
                src={diningSatvikThali || captionImg}
                alt="Fresh home-cooked food at Kasar Himalayan Heights"
                className="w-full h-[380px] sm:h-[450px] object-cover transition-transform duration-500 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

              <div className="absolute top-4 left-4">
                <span className="bg-black/65 backdrop-blur-md text-white text-xs sm:text-sm font-mono uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-full border border-white/20">
                  100% Pure Vegetarian
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="font-serif italic text-base sm:text-lg text-white mb-1">
                  &ldquo;Simple, hot food in the cold mountain air.&rdquo;
                </p>
                <span className="text-[11px] sm:text-xs text-[#C9F24D] uppercase tracking-wider font-mono block">
                  Kitchen Timings • {diningHours}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Description */}
          <div className="lg:col-span-6 space-y-5 reveal">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-2">
                FRESH FOOD
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#073125] font-normal leading-tight">
                Fresh Home-Cooked Food
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#073125]/85 font-light leading-relaxed">
              Hot, simple pure vegetarian meals cooked fresh with clean mountain water and pure desi ghee.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {diningFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#073125]/10 shadow-xs"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircleIcon className="w-4 h-4 text-[#073125] flex-shrink-0" />
                    <h3 className="font-serif text-sm sm:text-base font-semibold text-[#073125]">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#073125]/75 leading-relaxed font-light">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/book"
                className="px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[#073125] hover:bg-[#12433B] text-white transition-all shadow-md hover:scale-102"
              >
                Book with Free Breakfast
              </Link>
              <span className="text-xs text-[#073125]/70 italic">
                *Free hot breakfast included with all rooms
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SatvikDining;
