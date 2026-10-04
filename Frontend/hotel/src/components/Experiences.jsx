import { Link } from 'react-router-dom';
import { FlameIcon, MountainIcon, CompassIcon, FoodIcon, ArrowUpRightIcon } from '@shared';
import {
  hotelAtNight,
  hotelNightSky,
  trishulPeaksImg,
  captionImg,
  diningSatvikThali,
  kasarTempleImg,
  kasarTempleTrail,
} from '@shared';

const experiences = [
  {
    title: 'Evening Bonfire & Hot Pahadi Tea',
    category: 'Cozy Evenings',
    description: 'Sit around the warm pine wood fire under clear starry mountain skies. Enjoy hot herbal ginger tea, roasted snacks, and peaceful conversations.',
    icon: FlameIcon,
    image: hotelNightSky || hotelAtNight,
    highlight: 'Every Evening at 7:00 PM',
  },
  {
    title: 'Golden Sunrise on Snow Peaks',
    category: 'Snow Views',
    description: 'Watch the morning sun turn the snow peaks of Trishul and Nanda Devi into glowing gold right from your private room balcony.',
    icon: MountainIcon,
    image: trishulPeaksImg,
    highlight: 'Daily at Dawn',
  },
  {
    title: 'Fresh Home-Cooked Pure Veg Food',
    category: 'Fresh Food',
    description: 'Enjoy hot home-style meals, local Bhatt ki dal, fresh rotis, mountain honey, and refreshing herbal tea made fresh to order.',
    icon: FoodIcon,
    image: diningSatvikThali || captionImg,
    highlight: '100% Pure Vegetarian',
  },
  {
    title: "Pine Forest & Temple Walks",
    category: 'Nature Walks',
    description: 'Take quiet morning walks along pine tree trails to the historic Kasar Devi Temple and the peaceful Vivekananda meditation cave.',
    icon: CompassIcon,
    image: kasarTempleTrail || kasarTempleImg,
    highlight: '10 Min Walk',
  },
];

const Experiences = () => {
  return (
    <section id="experiences" className="py-14 sm:py-18 px-4 bg-[#F8FAF7] text-[#073125] relative overflow-hidden border-b border-[#073125]/10">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-xs">
            THINGS TO ENJOY • KASAR DEVI
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal mb-3 leading-tight tracking-tight text-[#073125]">
            Special Moments During Your Stay
          </h2>
          <p className="text-[#073125]/80 text-base sm:text-lg leading-relaxed font-light">
            Spend relaxing days taking in golden sunrises on the snow peaks, peaceful pine forest walks, warm evening fires, and fresh home-cooked meals.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {experiences.map((exp, index) => {
            const IconComponent = exp.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden border border-[#073125]/10 hover:border-[#073125]/30 transition-all duration-300 flex flex-col justify-between h-full group shadow-xs hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

                    <span className="absolute top-3.5 left-3.5 bg-black/65 backdrop-blur-xs text-[#C9F24D] text-[11px] font-mono font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-white/20">
                      {exp.category}
                    </span>

                    <div className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#073125] border border-[#073125]/15 shadow-xs">
                      <IconComponent className="w-4 h-4 text-[#073125]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-medium text-[#073125] mb-2.5 group-hover:text-[#12433B] transition-colors leading-snug">
                      {exp.title}
                    </h3>
                    <p className="text-[#073125]/75 text-sm leading-relaxed mb-4 font-light">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Tag */}
                <div className="px-6 pb-5 pt-3 border-t border-[#073125]/10 flex items-center justify-between text-xs text-[#073125] font-semibold font-mono">
                  <span>{exp.highlight}</span>
                  <Link
                    to="/book"
                    className="inline-flex items-center gap-1 text-[#073125] hover:underline transition-colors"
                  >
                    <span>Reserve Stay</span>
                    <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
