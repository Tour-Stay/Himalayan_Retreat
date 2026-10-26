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
    <section id="circuits" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F4F7F3] border-b border-[#D5E0D8] relative">
      <div className="max-w-[1560px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 reveal">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#073125] text-[#C9F24D] text-[11px] font-sans font-bold tracking-widest uppercase mb-2.5 shadow-xs">
            <span>POPULAR MOUNTAIN CIRCUITS</span>
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#073125] font-normal">
            Sacred Pilgrimage &amp; Mountain Circuits
          </h2>
          <p className="mt-2 text-[#4A635A] text-sm sm:text-base font-light">
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
                className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#073125] text-[#C9F24D] font-bold shadow-md'
                    : 'bg-white border border-[#D5E0D8] text-[#073125] hover:bg-[#EDF2EC] font-medium'
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
              className="bg-white rounded-3xl overflow-hidden border border-[#D5E0D8] hover:border-[#073125]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
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
                    <span className="bg-[#073125] text-[#C9F24D] text-xs font-sans uppercase tracking-wider font-bold px-3.5 py-1.5 rounded-full shadow-md">
                      {dest.categoryLabel || 'Mountain Tour'}
                    </span>
                    {dest.saffronTag && (
                      <span className="bg-black/65 backdrop-blur-md text-[#C9F24D] text-xs font-sans px-3.5 py-1.5 rounded-full border border-white/20 font-semibold">
                        {dest.saffronTag}
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Specs */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-white">
                    <span className="bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 font-sans font-medium flex items-center gap-1.5 text-xs">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                      <span>{dest.distance}</span>
                    </span>
                    <span className="bg-black/65 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 font-sans font-medium text-[#C9F24D] text-xs">
                      {dest.elevationProfile || 'High-Altitude Ghat'}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7">
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#073125] mb-2 leading-snug">
                    {dest.name}
                  </h3>

                  <p className="text-[#4A635A] text-sm leading-relaxed mb-5 font-light">
                    {dest.description}
                  </p>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {dest.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-xs text-[#073125] bg-[#F4F7F3] px-3 py-1 rounded-lg border border-[#D5E0D8] font-medium"
                      >
                        ✦ {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Tariff & Action Bar */}
              <div className="p-6 sm:p-7 pt-4 border-t border-[#D5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto bg-[#F8FAF7]">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[10px] text-[#4A635A] block leading-none mb-1 uppercase tracking-wider font-sans">
                      Sedan (4-Seater)
                    </span>
                    <span className="text-[#073125] font-serif text-xl sm:text-2xl font-semibold font-numeral">
                      {dest.typicalFareSedan}
                    </span>
                  </div>
                  <div className="pl-4 border-l border-[#D5E0D8]">
                    <span className="text-[10px] text-[#4A635A] block leading-none mb-1 uppercase tracking-wider font-sans">
                      Innova SUV (6-Seater)
                    </span>
                    <span className="text-[#073125] font-serif text-xl sm:text-2xl font-semibold font-numeral">
                      {dest.typicalFareInnova}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBookCircuit(dest)}
                  className="px-6 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-bold bg-[#C9F24D] hover:bg-[#bde63d] text-[#073125] flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer group/btn hover:scale-102"
                >
                  <span>Select &amp; Check Fare</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300 text-[#073125]" />
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
