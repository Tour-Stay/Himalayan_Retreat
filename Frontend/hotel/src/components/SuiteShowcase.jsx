import { useState } from 'react';
import { BedIcon, SnowIcon, ArrowUpRightIcon, SparklesIcon, CheckCircleIcon } from '@shared';
import { mockRooms } from '../data/mockRooms';

const SuiteShowcase = ({ onSelectSuite, onOpenQuickView }) => {
  const [activeSuiteIndex, setActiveSuiteIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const activeSuite = mockRooms[activeSuiteIndex] || mockRooms[0];
  const images = activeSuite.imageURLs || ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'];

  const handleTabChange = (index) => {
    setActiveSuiteIndex(index);
    setActiveImgIndex(0);
  };

  return (
    <section id="rooms" className="py-24 px-4 bg-ivory relative overflow-hidden border-b border-gold/15">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ivory text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-gold/30 shadow-xs font-mono">
              <SparklesIcon className="w-3.5 h-3.5 text-gold" />
              <span>Editorial Suite Collection</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal font-medium tracking-tight">
              Cozy Luxury, Framed by Peaks
            </h2>
          </div>
          <p className="text-charcoal-muted text-sm sm:text-base max-w-md font-light leading-relaxed">
            With only 12 exclusive suites, every retreat is handcrafted with fragrant local deodar pine, central heating, and deep-soaking bathtubs facing the sunrise.
          </p>
        </div>

        {/* Suite Selection Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {mockRooms.map((suite, idx) => (
            <button
              key={suite._id}
              onClick={() => handleTabChange(idx)}
              className={`px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2.5 cursor-pointer ${activeSuiteIndex === idx
                  ? 'bg-maroon text-ivory shadow-lg scale-[1.02] border border-gold/40'
                  : 'bg-ivory-warm text-charcoal/75 hover:bg-ivory hover:text-charcoal border border-gold/25'
                }`}
            >
              <span className="font-mono text-gold text-[11px] opacity-90">
                0{idx + 1}.
              </span>
              <span>{suite.name}</span>
            </button>
          ))}
        </div>

        {/* Split Editorial Suite Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Imagery */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative h-[380px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-xl bg-slate group">
              <img
                src={images[activeImgIndex] || images[0]}
                alt={activeSuite.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"></div>

              {/* Floating Badges */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                <span className="bg-slate/85 backdrop-blur-md text-ivory text-xs font-semibold px-4 py-1.5 rounded-full border border-gold/30 flex items-center gap-1.5 shadow-md">
                  <SnowIcon className="w-3.5 h-3.5 text-gold" />
                  <span>{activeSuite.view || '180° Snow Peak View'}</span>
                </span>
                {activeSuite.badge && (
                  <span className="bg-maroon text-ivory text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-gold/30">
                    {activeSuite.badge}
                  </span>
                )}
              </div>

              {/* Bottom Specs Pill */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-ivory text-xs">
                <div className="flex items-center gap-3">
                  <span className="bg-slate/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                    📐 {activeSuite.area || '42 m²'}
                  </span>
                  <span className="bg-slate/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5">
                    <BedIcon className="w-3.5 h-3.5 text-gold" />
                    <span>{activeSuite.bedType || 'King Bed'}</span>
                  </span>
                </div>

                <span className="bg-slate/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
                  👤 {activeSuite.capacity?.adults || 2} Adults
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`h-20 w-28 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${activeImgIndex === i
                        ? 'border-maroon scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-ivory-warm p-8 sm:p-10 rounded-3xl border border-gold/30 shadow-md">
            <div>
              <span className="text-gold text-xs uppercase tracking-[0.25em] font-bold block mb-2 font-mono">
                Boutique Living at 6,942 FT
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-medium text-charcoal mb-4">
                {activeSuite.name}
              </h3>
              <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed font-light mb-8">
                {activeSuite.description}
              </p>

              {/* Features List */}
              <div className="space-y-3 mb-8 pb-8 border-b border-gold/20">
                {(activeSuite.amenities || []).slice(0, 5).map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-charcoal">
                    <CheckCircleIcon className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block font-mono">
                    Nightly Rate
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-semibold text-maroon">
                    ₹{activeSuite.pricePerNight?.toLocaleString()}
                  </span>
                  <span className="text-xs text-charcoal-muted ml-1 font-light">/ night + taxes</span>
                </div>
                <span className="text-xs text-charcoal bg-gold/15 border border-gold/30 px-3 py-1 rounded-full font-mono">
                  Breakfast Included
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onOpenQuickView && onOpenQuickView(activeSuite)}
                  className="px-4 py-3 rounded-2xl text-xs uppercase tracking-wider font-semibold border border-gold/40 text-charcoal hover:bg-gold/10 transition-colors"
                >
                  Quick View
                </button>
                <button
                  onClick={() => {
                    if (onSelectSuite) onSelectSuite(activeSuite._id);
                    const bookEl = document.getElementById('book');
                    if (bookEl) bookEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-3 rounded-2xl text-xs uppercase tracking-wider font-semibold bg-maroon hover:bg-maroon-dark text-ivory transition-colors shadow-md flex items-center justify-center gap-1 group"
                >
                  <span>Book Suite</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuiteShowcase;
