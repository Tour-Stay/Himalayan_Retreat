import { FlameIcon, MountainIcon, CompassIcon, WifiIcon, ArrowUpRightIcon } from './Icons';

const experiences = [
  {
    title: 'Snowfall & Evening Bonfires',
    category: 'Winter Magic',
    description: 'Gather around a crackling cedar fire under clear Himalayan night skies. Enjoy warm spiced beverages, acoustic mountain melodies, and roasted treats in crisp winter air.',
    icon: FlameIcon,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    highlight: 'Daily at 7:00 PM'
  },
  {
    title: 'Sunrise Over Nanda Devi Peaks',
    category: 'Panoramic Sight',
    description: 'Witness the morning sun paint the Trishul, Panchachuli, and Nanda Devi peaks in molten gold from our private terrace while sipping handcrafted local herbal tea.',
    icon: MountainIcon,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    highlight: '180° Peak Visibility'
  },
  {
    title: 'Pine Forest & Deodar Trails',
    category: 'Nature & Serenity',
    description: 'Wander through scented oak, cedar, and pine trails dusted with fresh winter snow. Clean alpine air, melodious mountain birds, and untouched nature at your doorstep.',
    icon: CompassIcon,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    highlight: 'Guided Morning Treks'
  },
  {
    title: 'Winter Workation & Mountain Quiet',
    category: 'Work & Unwind',
    description: 'High-speed dedicated Wi-Fi, cozy room heaters, quiet study nooks, and hot beverage stations. Complete peace of mind for creative focus amidst mountain serenity.',
    icon: WifiIcon,
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    highlight: '100 Mbps Fiber Wi-Fi'
  }
];

const Experiences = () => {
  return (
    <section id="experiences" className="py-28 px-4 bg-primary text-white relative overflow-hidden">
      {/* 3D Ambient Glowing Orbs */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-forest/25 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-18">
          <span className="inline-block px-3.5 py-1 rounded-full glass-pill-dark text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30">
            Days Shaped by the Mountains
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-semibold mb-5 leading-tight tracking-tight">
            Curated Winter Experiences
          </h2>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed font-light">
            Savour unhurried moments at 7,500 feet — from warm firesides amidst snowfall to dawn mountain ridge viewpoints.
          </p>
        </div>

        {/* 4 Cards Grid with Smooth Luxury Elevation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp, index) => {
            const IconComponent = exp.icon;
            return (
              <div
                key={index}
                className="glass-surface-dark rounded-3xl overflow-hidden border border-white/12 hover:border-secondary/50 transition-all duration-300 flex flex-col justify-between h-full group shadow-xl hover:shadow-2xl hover:-translate-y-1.5"
              >
                <div>
                  {/* Image with zoom and gradient */}
                  <div className="relative h-52 overflow-hidden bg-black/40">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>

                    <span className="absolute top-3.5 left-3.5 glass-pill-dark text-secondary text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-secondary/30">
                      {exp.category}
                    </span>

                    <div className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-xl glass-pill-dark flex items-center justify-center text-secondary border border-white/20 shadow-md">
                      <IconComponent className="w-5 h-5 text-secondary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-white mb-2.5 group-hover:text-secondary transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-4 font-light">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Tag */}
                <div className="px-6 pb-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-secondary font-medium">
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
