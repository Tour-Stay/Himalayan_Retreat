import {
  Container,
  SectionHeading,
  kasarTempleImg,
  kasarTempleTrail,
  vivekanandaCave,
  jageshwarImg,
  kainchiWebp,
  ArrowUpRightIcon,
  MapPinIcon,
  CompassIcon,
} from '@shared';

const holyTrails = [
  {
    name: 'Kasar Devi Temple & Sharda Math',
    distance: '800 meters',
    duration: '10 min walk',
    significance: 'Ancient Shakti Peeth & Mountain Views',
    desc: 'Ancient cave temple where Swami Vivekananda and Buddhist scholars meditated. Nestled among pine trees with 360° views of the snow-covered Himalayas.',
    image: kasarTempleTrail || kasarTempleImg,
    badge: '10 Min Walk',
  },
  {
    name: 'Swami Vivekananda Meditation Cave',
    distance: '500 meters',
    duration: '6 min walk',
    significance: 'Historic Meditation Cave',
    desc: 'The quiet rock cave where Swami Vivekananda meditated in 1890 during his spiritual journey through the Himalayas.',
    image: vivekanandaCave || kasarTempleImg,
    badge: '6 Min Walk',
  },
  {
    name: 'Jageshwar Dham Temples',
    distance: '35 km',
    duration: '1 hr 15 min drive',
    significance: 'Cluster of 124 Ancient Stone Temples',
    desc: 'A cluster of 124 sacred stone temples dedicated to Lord Shiva, nestled deep inside dense tall deodar forests dating back to the 8th century.',
    image: jageshwarImg,
    badge: 'Day Trip (1.2 Hr Drive)',
  },
  {
    name: 'Kainchi Dham Ashram (Neem Karoli Baba)',
    distance: '45 km',
    duration: '1 hr 30 min drive',
    significance: 'Sacred Ashram of Neem Karoli Baba',
    desc: 'The world-famous temple and ashram on the bank of the river that draws devotees and visitors from across India and around the world.',
    image: kainchiWebp,
    badge: 'Day Trip (1.5 Hr Drive)',
  },
];

const TempleTrails = () => {
  return (
    <section id="trails" className="py-10 sm:py-14 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20 relative">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 reveal">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FAF6EF] text-[#7C1D23] text-xs font-semibold tracking-[0.2em] uppercase mb-3 border border-[#C5A059]/30 font-cinzel">
            Sacred Temples &amp; Nature Walks
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2523] font-medium leading-tight">
            Famous Temples Near Our Hotel
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059]/60 mx-auto my-4"></div>
          <p className="text-[#5C5350] text-sm sm:text-base font-normal leading-relaxed">
            Our hotel is located in peaceful Kasar Devi. You can easily walk to ancient temples in the morning or take a scenic day trip to Kainchi Dham and Jageshwar Dham.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
          {holyTrails.map((trail, idx) => (
            <div
              key={idx}
              className="bg-[#FAF6EF] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C5A059]/25 hover:border-[#7C1D23]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate">
                  <img
                    src={trail.image}
                    alt={trail.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1817]/80 via-transparent to-transparent"></div>

                  <span className="absolute top-3 left-3 bg-[#7C1D23] text-[#FDFBF7] text-[10px] font-cinzel uppercase tracking-wider font-bold px-2.5 py-1 rounded-full shadow-xs">
                    {trail.badge}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#FDFBF7]">
                    <span className="bg-[#1C1817]/80 px-2.5 py-1 rounded-lg border border-[#C5A059]/30 font-numeral font-bold flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3 text-[#C5A059]" />
                      <span>{trail.distance}</span>
                    </span>
                    <span className="text-[#C5A059] font-medium font-numeral">
                      {trail.duration}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] uppercase font-cinzel text-[#C5A059] font-bold block mb-1">
                    {trail.significance}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-[#2C2523] mb-2 leading-snug group-hover:text-[#7C1D23] transition-colors">
                    {trail.name}
                  </h3>
                  <p className="text-xs text-[#5C5350] leading-relaxed font-normal">
                    {trail.desc}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2 border-t border-[#C5A059]/15 flex items-center justify-between text-xs">
                <span className="text-[#7C1D23] font-cinzel font-semibold text-[11px]">
                  Taxi Available at Desk
                </span>
                <a
                  href="#book"
                  className="inline-flex items-center gap-1 text-[#7C1D23] hover:text-[#5C151A] font-semibold transition-colors"
                >
                  <span>Ask at Reception</span>
                  <ArrowUpRightIcon className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TempleTrails;
