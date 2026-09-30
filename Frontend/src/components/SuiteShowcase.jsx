import { useState } from 'react';
import { BedIcon, SnowIcon, FlameIcon, WifiIcon, ArrowUpRightIcon, SparklesIcon, CheckCircleIcon } from './Icons';
import { mockRooms } from '../data/mockRooms';

const SuiteShowcase = ({ onSelectSuite, onOpenQuickView }) => {
  const [activeSuiteIndex, setActiveSuiteIndex] = useState(0);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const activeSuite = mockRooms[activeSuiteIndex] || mockRooms[0];
  const images = activeSuite.imageURLs || ['/placeholder-room.svg'];

  const handleTabChange = (index) => {
    setActiveSuiteIndex(index);
    setActiveImgIndex(0);
  };

  return (
    <section id="rooms" className="py-28 px-4 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
              <SparklesIcon className="w-3.5 h-3.5 text-secondary" />
              <span>Editorial Suite Collection</span>
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-text-dark font-medium tracking-tight">
              Cozy Luxury, Framed by Peaks
            </h2>
          </div>
          <p className="text-text-light text-sm sm:text-base max-w-md font-light leading-relaxed">
            With only 12 exclusive suites, every retreat is handcrafted with fragrant local deodar pine, central heating, and deep-soaking bathtubs facing the sunrise.
          </p>
        </div>

        {/* Interactive Suite Selection Pills / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {mockRooms.map((suite, idx) => (
            <button
              key={suite._id}
              onClick={() => handleTabChange(idx)}
              className={`px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2.5 cursor-pointer ${
                activeSuiteIndex === idx
                  ? 'bg-primary text-secondary shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'bg-white/80 text-text-dark/70 hover:bg-white hover:text-text-dark border border-gray-200/70'
              }`}
            >
              <span className="font-mono text-secondary text-[11px] opacity-75">
                0{idx + 1}.
              </span>
              <span>{suite.name}</span>
            </button>
          ))}
        </div>

        {/* Split Editorial Suite Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Full-Bleed Imagery with Floating Badges (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative h-[380px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-2xl bg-gray-900 group">
              <img
                src={images[activeImgIndex] || images[0]}
                alt={activeSuite.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-room.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

              {/* Floating Panorama Badges */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                <span className="glass-surface-dark text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
                  <SnowIcon className="w-3.5 h-3.5 text-secondary" />
                  <span>{activeSuite.view || '180° Snow Peak View'}</span>
                </span>
                {activeSuite.badge && (
                  <span className="bg-secondary text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {activeSuite.badge}
                  </span>
                )}
              </div>

              {/* Bottom Specs Pill */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-3">
                  <span className="glass-surface-dark px-3 py-1.5 rounded-xl border border-white/15">
                    📐 {activeSuite.area || '42 m²'}
                  </span>
                  <span className="glass-surface-dark px-3 py-1.5 rounded-xl border border-white/15 flex items-center gap-1.5">
                    <BedIcon className="w-3.5 h-3.5 text-secondary" />
                    <span>{activeSuite.bedType || 'King Bed'}</span>
                  </span>
                </div>

                <span className="glass-surface-dark px-3 py-1.5 rounded-xl border border-white/15">
                  👤 {activeSuite.capacity?.adults || 2} Adults
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      activeImgIndex === i
                        ? 'border-secondary shadow-md scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Frosted Glass Details Panel (5 cols) */}
          <div className="lg:col-span-5 glass-surface p-8 sm:p-10 rounded-3xl border border-white/80 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-secondary text-xs uppercase tracking-[0.25em] font-bold">
                  Featured Residence
                </span>
                <span className="text-forest text-xs font-semibold bg-forest/10 px-3 py-1 rounded-full">
                  Instant Confirmation
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-text-dark font-semibold mb-4 leading-snug">
                {activeSuite.name}
              </h3>

              <p className="text-text-light text-sm sm:text-base leading-relaxed mb-6 font-light">
                {activeSuite.description}
              </p>

              {/* Winter Comfort Feature Card */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-6">
                <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
                  <FlameIcon className="w-4 h-4 text-secondary" />
                  <span>Winter & Snowfall Climate Control</span>
                </div>
                <p className="text-xs text-text-dark/80 leading-relaxed font-light">
                  Dual electric bed warmers, silent multi-stage room heater, thermal blackout curtains, and 24/7 instant hot geyser.
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="mb-8">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-dark mb-3">
                  Residence Inclusions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {(activeSuite.amenities || []).slice(0, 6).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text-dark/80 font-medium">
                      <span className="text-secondary text-sm">✦</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & Action Row */}
            <div className="pt-6 border-t border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-text-light block uppercase tracking-wider">Tariff per night</span>
                <span className="text-primary font-heading text-3xl font-bold">
                  ₹{activeSuite.pricePerNight?.toLocaleString()}
                </span>
                <span className="text-xs text-text-light ml-1">/ night</span>
              </div>

              <div className="flex items-center gap-3">
                {onOpenQuickView && (
                  <button
                    onClick={() => onOpenQuickView(activeSuite)}
                    className="btn-outline-luxury px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider"
                  >
                    Quick View
                  </button>
                )}

                <button
                  onClick={() => {
                    if (onSelectSuite) onSelectSuite(activeSuite._id);
                    const bookEl = document.getElementById('book');
                    if (bookEl) bookEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group btn-gold px-6 py-3 rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>Reserve Suite</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
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
