import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, ArrowUpRightIcon, MapPinIcon, SparklesIcon, useSiteSettings, kainchiWebp } from '@shared';
import { destinationsData, mergeDestinationsWithSettings } from '../data/travelData';

const PilgrimageCircuits = ({ onSelectDestination }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const { settings } = useSiteSettings();

  const destinationsList = React.useMemo(() => {
    return mergeDestinationsWithSettings(settings?.destinations);
  }, [settings?.destinations]);

  const filtered = activeTab === 'all'
    ? destinationsList
    : destinationsList.filter((d) => d.category === activeTab);

  const handleBookCircuit = (dest) => {
    if (onSelectDestination) {
      onSelectDestination(dest.id);
    } else {
      navigate('/calculator', { state: { destinationId: dest.id } });
    }
  };

  return (
    <section id="circuits" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#FAF5EC] border-b border-[#EAA722]/30 relative">
      <div className="max-w-[1560px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 reveal">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAA722] text-[#541508] text-[11px] font-mono font-bold tracking-widest uppercase mb-2.5 shadow-xs">
            <span className="text-xs">🪔</span>
            <span>॥ पावन तीर्थ यात्रा एवं दर्शनीय स्थल ॥</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#541508] font-normal">
            Sacred Pilgrimage &amp; Mountain Circuits
          </h2>
          <p className="mt-2 text-[#541508]/80 text-sm sm:text-base font-light">
            Transparent fixed-fare cab tours from Almora and Kasar Devi to sacred temples and scenic viewpoints.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Circuits' },
              { id: 'temple', label: 'Sacred Temples & Dhams' },
              { id: 'hillstation', label: 'Scenic Mountain Viewpoints' },
              { id: 'transfer', label: 'Station Transfers' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#541508] text-white font-bold shadow-md'
                    : 'bg-white border border-[#541508]/20 text-[#541508] hover:bg-[#FAF0E6] font-medium'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-in-a-Row Spacious Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 reveal">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#EAA722]/30 hover:border-[#EAA722]/70 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Large Photo Showcase */}
                <div className="relative h-64 sm:h-76 lg:h-80 overflow-hidden bg-slate-900">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      const fallback = destinationsData.find((item) => item.id === dest.id)?.image || kainchiWebp;
                      e.currentTarget.src = fallback;
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="bg-[#EAA722] text-[#541508] text-xs font-mono uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-full shadow-md">
                      {dest.categoryLabel || 'Mountain Tour'}
                    </span>
                    {dest.saffronTag && (
                      <span className="bg-black/65 backdrop-blur-md text-[#EAA722] text-xs font-devanagari px-3.5 py-1.5 rounded-full border border-white/20 font-semibold">
                        {dest.saffronTag}
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Specs */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 font-mono font-medium flex items-center gap-1.5 text-xs">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#EAA722]" />
                      <span>{dest.distance}</span>
                    </span>
                    <span className="bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 font-mono font-medium text-[#EAA722] text-xs">
                      {dest.elevationProfile || 'High-Altitude Ghat'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7">
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#541508] mb-2 leading-snug">
                    {dest.name}
                  </h3>

                  <p className="text-[#5C5350] text-sm leading-relaxed mb-5 font-light">
                    {dest.description}
                  </p>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {dest.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-xs text-[#541508] bg-[#FAF5EC] px-3 py-1 rounded-lg border border-[#EAA722]/30 font-medium"
                      >
                        ✦ {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Tariff & Action Bar */}
              <div className="p-6 sm:p-7 pt-4 border-t border-[#EAA722]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto bg-[#FAFDF9]">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] text-[#5C5350] block leading-none mb-1 uppercase tracking-wider font-mono">
                      Sedan (4-Seater)
                    </span>
                    <span className="text-[#541508] font-serif text-xl sm:text-2xl font-semibold font-numeral">
                      {dest.typicalFareSedan}
                    </span>
                  </div>
                  <div className="pl-4 border-l border-[#EAA722]/20">
                    <span className="text-[10px] text-[#5C5350] block leading-none mb-1 uppercase tracking-wider font-mono">
                      Innova SUV (6-Seater)
                    </span>
                    <span className="text-[#541508] font-serif text-xl sm:text-2xl font-semibold font-numeral">
                      {dest.typicalFareInnova}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBookCircuit(dest)}
                  className="px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[#EAA722] hover:bg-[#D98E16] text-[#541508] flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer group/btn hover:scale-102"
                >
                  <span>Select &amp; Check Fare</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PilgrimageCircuits;
