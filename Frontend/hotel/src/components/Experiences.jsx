import { FlameIcon, MountainIcon, CompassIcon, WifiIcon, ArrowUpRightIcon } from '@shared';

const experiences = [
  {
    title: 'Snowfall & Evening Bonfires',
    category: 'Winter Magic',
    description: 'Gather around a crackling cedar fire under clear Himalayan night skies. Enjoy warm spiced beverages, acoustic mountain melodies, and roasted treats in crisp winter air.',
    icon: FlameIcon,
    image: '/chalet-suite.jpg',
    highlight: 'Daily at 7:00 PM'
  },
  {
    title: 'Sunrise Over Nanda Devi Peaks',
    category: 'Panoramic Sight',
    description: 'Witness the morning sun paint the Trishul, Panchachuli, and Nanda Devi peaks in molten gold from our private terrace while sipping handcrafted local herbal tea.',
    icon: MountainIcon,
    image: '/resort-exterior.jpg',
    highlight: '180° Peak Visibility'
  },
  {
    title: 'Pine Forest & Deodar Trails',
    category: 'Nature & Serenity',
    description: 'Wander through scented oak, cedar, and pine trails dusted with fresh winter snow. Clean alpine air, melodious mountain birds, and untouched nature at your doorstep.',
    icon: CompassIcon,
    image: '/mountain-fleet.jpg',
    highlight: 'Guided Morning Treks'
  },
  {
    title: 'Winter Workation & Mountain Quiet',
    category: 'Work & Unwind',
    description: 'High-speed dedicated Wi-Fi, cozy room heaters, quiet study nooks, and hot beverage stations. Complete peace of mind for creative focus amidst mountain serenity.',
    icon: WifiIcon,
    image: '/attic-suite.jpg',
    highlight: '100 Mbps Fiber Wi-Fi'
  }
];

const Experiences = () => {
  return (
    <section id="experiences" className="py-24 px-4 bg-slate text-ivory relative overflow-hidden border-b border-gold/20">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-slate/90 text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-gold/30 font-mono">
            Days Shaped by the Mountains
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium mb-4 leading-tight tracking-tight">
            Curated Alpine Experiences
          </h2>
          <p className="text-ivory/75 text-base sm:text-lg leading-relaxed font-light">
            Savour unhurried moments at 6,942 feet — from warm firesides amidst snowfall to dawn mountain ridge viewpoints.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, index) => {
            const IconComponent = exp.icon;
            return (
              <div
                key={index}
                className="bg-charcoal/70 rounded-3xl overflow-hidden border border-gold/20 hover:border-gold/60 transition-all duration-300 flex flex-col justify-between h-full group shadow-xl hover:-translate-y-1.5"
              >
                <div>
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-black/40">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                    <span className="absolute top-3.5 left-3.5 bg-slate/85 backdrop-blur-md text-gold text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-gold/30 font-mono">
                      {exp.category}
                    </span>

                    <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-xl bg-slate/80 backdrop-blur-md flex items-center justify-center text-gold border border-gold/30 shadow-md">
                      <IconComponent className="w-5 h-5 text-gold" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-medium text-ivory mb-2.5 group-hover:text-gold transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-ivory/70 text-sm leading-relaxed mb-4 font-light">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Tag */}
                <div className="px-6 pb-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gold font-medium font-mono">
                  <span>{exp.highlight}</span>
                  <span className="inline-flex items-center gap-1 opacity-75 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <span>Reserve</span>
                    <ArrowUpRightIcon className="w-3.5 h-3.5" />
                  </span>
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
