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
    <section id="experiences" className="py-10 sm:py-14 px-4 bg-[#FAF6EF]/70 text-[#2C2523] relative overflow-hidden border-b border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FAF6EF] text-[#7C1D23] text-xs font-semibold tracking-[0.2em] uppercase mb-4 border border-[#C5A059]/30 font-cinzel">
            Things to Enjoy
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium mb-4 leading-tight tracking-tight text-[#2C2523]">
            Special Moments During Your Stay
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059]/60 mx-auto my-4"></div>
          <p className="text-[#5C5350] text-base sm:text-lg leading-relaxed font-normal">
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
                className="bg-[#FDFBF7] rounded-3xl overflow-hidden border border-[#C5A059]/25 hover:border-[#7C1D23]/40 transition-all duration-300 flex flex-col justify-between h-full group shadow-xs hover:shadow-lg hover:-translate-y-1"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-[#FAF6EF]">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1817]/75 via-transparent to-transparent"></div>

                    <span className="absolute top-3.5 left-3.5 bg-[#FDFBF7]/90 backdrop-blur-xs text-[#7C1D23] text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-[#C5A059]/30 font-cinzel">
                      {exp.category}
                    </span>

                    <div className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-xl bg-[#FDFBF7]/90 backdrop-blur-xs flex items-center justify-center text-[#7C1D23] border border-[#C5A059]/30 shadow-xs">
                      <IconComponent className="w-4 h-4 text-[#7C1D23]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-medium text-[#2C2523] mb-2.5 group-hover:text-[#7C1D23] transition-colors leading-snug">
                      {exp.title}
                    </h3>
                    <p className="text-[#5C5350] text-sm leading-relaxed mb-4 font-normal">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Tag */}
                <div className="px-6 pb-5 pt-3 border-t border-[#C5A059]/15 flex items-center justify-between text-xs text-[#7C1D23] font-semibold font-sans">
                  <span>{exp.highlight}</span>
                  <a
                    href="#book"
                    className="inline-flex items-center gap-1 text-[#7C1D23] hover:text-[#5C151A] transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  </a>
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
