import React, { useState } from 'react';
import { Container, ArrowUpRightIcon, SITE_CONFIG } from '@shared';
import { destinationsData } from '../data/travelData';

const PilgrimageCircuits = ({ onSelectDestination }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? destinationsData
    : destinationsData.filter((d) => d.category === activeTab);

  const handleBookCircuit = (dest) => {
    if (onSelectDestination) {
      onSelectDestination(dest.id);
    }
    const calcEl = document.getElementById('calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="circuits" className="py-20 sm:py-28 px-4 bg-gradient-to-b from-[#FAF6EF]/60 via-[#FFF5EC]/40 to-[#FAF6EF]/60 border-b border-[#C5A059]/20 relative overflow-hidden">
      {/* Subtle sacred watermark */}
      <div className="absolute top-12 left-6 text-[#C84B0F]/[0.025] text-[180px] font-devanagari select-none pointer-events-none leading-none z-0">
        ॐ
      </div>

      <Container size="lg">
        <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C84B0F]/10 border border-[#C84B0F]/30 text-[#C84B0F] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <span className="text-amber-500 animate-pulse text-xs">🪔</span>
            <span className="font-devanagari">॥ पावन तीर्थ यात्रा एवं दर्शनीय स्थल ॥</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2523] font-medium tracking-tight mb-4">
            Popular Pilgrimage &amp; Sightseeing Tours
          </h2>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C84B0F] to-transparent mx-auto my-4"></div>

          <p className="text-[#5C5350] text-base sm:text-lg leading-relaxed font-normal">
            Fixed transparent cab tours from Almora and Kasar Devi to the most sacred temples and scenic mountain viewpoints of Uttarakhand.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Tours' },
              { id: 'temple', label: 'Sacred Temples & Dhams' },
              { id: 'hillstation', label: 'Scenic Hill Stations' },
              { id: 'transfer', label: 'Station Transfers' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] text-[#FDFBF7] shadow-sm'
                    : 'bg-[#FDFBF7] text-[#5C5350] border border-[#C5A059]/30 hover:border-[#C84B0F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 relative z-10">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="card-luxury bg-[#FDFBF7] rounded-3xl overflow-hidden border border-[#C5A059]/25 hover:border-[#C84B0F]/40 shadow-xs flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                {/* Real Picture */}
                <div className="relative h-52 overflow-hidden bg-[#FAF6EF]">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1817]/75 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 bg-[#1C1817]/85 backdrop-blur-md text-[#DFCA9B] text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
                    {dest.distance}
                  </div>

                  {dest.saffronTag && (
                    <div className="absolute bottom-3 left-3 right-3 text-right">
                      <span className="font-devanagari text-[11px] text-[#FFD8B3] bg-[#7C1D23]/80 px-2.5 py-1 rounded-full backdrop-blur-xs font-semibold">
                        {dest.saffronTag}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-[11px] font-sans uppercase tracking-wider text-[#C84B0F] font-bold block mb-1">
                    {dest.categoryLabel}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-[#2C2523] mb-2 leading-snug">
                    {dest.name}
                  </h3>
                  <p className="text-sm text-[#5C5350] leading-relaxed mb-4">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#C5A059]/15">
                    {dest.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-sans bg-[#FAF6EF] text-[#2C2523] px-2.5 py-1 rounded-lg border border-[#C5A059]/20"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Tariff & Action */}
              <div className="p-6 pt-0 border-t border-[#C5A059]/15 mt-auto">
                <div className="flex items-center justify-between text-xs py-3">
                  <div>
                    <span className="text-[#6B615E] block text-[10px] uppercase">Sedan Fare</span>
                    <strong className="text-[#C84B0F] font-numeral text-sm font-bold">{dest.typicalFareSedan}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[#6B615E] block text-[10px] uppercase">Innova SUV</span>
                    <strong className="text-[#2C2523] font-numeral text-sm font-bold">{dest.typicalFareInnova}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBookCircuit(dest)}
                  className="w-full py-3 rounded-xl text-xs uppercase tracking-wider font-bold bg-[#FAF6EF] hover:bg-gradient-to-r hover:from-[#C84B0F] hover:to-[#7C1D23] text-[#2C2523] hover:text-[#FDFBF7] border border-[#C84B0F]/30 hover:border-transparent transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Book Cab for this Tour</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PilgrimageCircuits;
