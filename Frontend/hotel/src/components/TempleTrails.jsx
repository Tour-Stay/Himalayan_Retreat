import {
  kasarTempleImg,
  kasarTempleTrail,
  vivekanandaCave,
  jageshwarImg,
  kainchiWebp,
  MapPinIcon,
  CarIcon,
  SparklesIcon,
} from '@shared';

const holyTrails = [
  {
    name: 'Kasar Devi Temple',
    distance: '800 meters',
    duration: '10 min walk',
    significance: 'Hilltop Temple & Peak Views',
    desc: 'Ancient temple surrounded by pine trees with sweeping views of Trishul and Nanda Devi peaks.',
    image: kasarTempleTrail || kasarTempleImg,
    badge: '10 Min Walk',
    highlight: 'Walking trail starts right from hotel',
    isWalk: true,
  },
  {
    name: 'Swami Vivekananda Cave',
    distance: '500 meters',
    duration: '6 min walk',
    significance: 'Sacred Meditation Cave',
    desc: 'The peaceful rock cave where Swami Vivekananda meditated and attained deep silence in 1890.',
    image: vivekanandaCave || kasarTempleImg,
    badge: '6 Min Walk',
    highlight: 'Quiet morning walk through pine trees',
    isWalk: true,
  },
  {
    name: 'Jageshwar Dham',
    distance: '35 km',
    duration: '1 hr 15 min drive',
    significance: '124 Ancient Shiva Temples',
    desc: 'Magnificent 8th-century stone temple cluster nestled peacefully within towering Deodar cedar forests.',
    image: jageshwarImg,
    badge: 'Day Trip',
    highlight: 'Hotel reception arranges round-trip taxi',
    isWalk: false,
  },
  {
    name: 'Kainchi Dham Ashram',
    distance: '45 km',
    duration: '1 hr 30 min drive',
    significance: 'Neem Karoli Baba Ashram',
    desc: 'The revered riverside sanctuary of Maharajji Neem Karoli Baba, visited by devotees from around the world.',
    image: kainchiWebp,
    badge: 'Day Trip',
    highlight: 'Hotel reception arranges round-trip taxi',
    isWalk: false,
  },
];

const TempleTrails = () => {
  return (
    <section id="trails" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#073125] text-white border-b border-white/10 relative">
      <div className="max-w-[1560px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 reveal">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-2.5 shadow-xs">
            <SparklesIcon className="w-3 h-3 text-[#073125]" />
            <span>NEARBY SIGHTS</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal">
            Temples &amp; Places to Visit
          </h2>
          <p className="mt-2 text-white/80 text-sm sm:text-base font-light">
            Walk to Kasar Devi Temple in the morning, or take an easy day taxi to nearby temples.
          </p>
        </div>

        {/* 2 Cards in a Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 reveal">
          {holyTrails.map((trail, idx) => (
            <div
              key={idx}
              className="bg-[#0C241D] rounded-3xl overflow-hidden border border-white/15 hover:border-white/30 shadow-lg transition-colors duration-300 flex flex-col justify-between text-white"
            >
              <div>
                {/* Large Photo Showcase */}
                <div className="relative h-64 sm:h-76 lg:h-84 overflow-hidden bg-slate-900">
                  <img
                    src={trail.image}
                    alt={trail.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="bg-[#C9F24D] text-[#073125] text-xs font-mono uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-full shadow-md">
                      {trail.badge}
                    </span>
                    <span className="bg-black/65 backdrop-blur-md text-white/90 text-xs font-mono px-3.5 py-1.5 rounded-full border border-white/20">
                      {trail.significance}
                    </span>
                  </div>

                  {/* Bottom Image Specs */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 font-mono font-medium flex items-center gap-1.5 text-xs">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                      <span>{trail.distance}</span>
                    </span>
                    <span className="bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 font-mono font-medium text-[#C9F24D] text-xs">
                      {trail.duration}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7">
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2 leading-snug">
                    {trail.name}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">
                    {trail.desc}
                  </p>
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="px-6 sm:px-7 py-4 border-t border-white/12 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm bg-black/15">
                <div className="flex items-center gap-2 text-white/75">
                  <span className="w-2 h-2 rounded-full bg-[#C9F24D] flex-shrink-0 animate-pulse"></span>
                  <span>{trail.highlight}</span>
                </div>

                {!trail.isWalk ? (
                  <a
                    href="http://localhost:5175"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border border-white/25 bg-white/10 hover:bg-[#C9F24D] hover:text-[#073125] text-white transition-all shadow-xs cursor-pointer"
                  >
                    <CarIcon className="w-3.5 h-3.5" />
                    <span>Book Cab</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold text-[#C9F24D] bg-white/5 border border-white/10">
                    <span>Direct Walking Path</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TempleTrails;
