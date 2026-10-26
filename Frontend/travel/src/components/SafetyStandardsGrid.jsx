import React from 'react';
import { Container, ShieldCheckIcon, CarIcon, CheckCircleIcon, kathgodamStationImg, useSiteSettings } from '@shared';
import { safetyStandards } from '../data/travelData';

const SafetyStandardsGrid = () => {
  const { settings } = useSiteSettings();

  const standardsList = (settings?.travelPolicies?.safetyStandards && Array.isArray(settings.travelPolicies.safetyStandards) && settings.travelPolicies.safetyStandards.length > 0)
    ? settings.travelPolicies.safetyStandards
    : safetyStandards;

  return (
    <section id="safety" className="py-16 sm:py-20 px-4 bg-[#F4F7F3] border-b border-[#D5E0D8]">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 reveal">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#073125] text-[#C9F24D] text-xs font-sans font-bold tracking-widest uppercase mb-2.5 shadow-xs">
            WHY RIDE WITH US • ALMORA FLEET
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#073125] font-normal">
            Safe, Respectful Mountain Travel
          </h2>
          <p className="mt-2 text-[#4A635A] text-sm sm:text-base font-light leading-relaxed">
            Local road experience, calm driving, and well-maintained vehicles for hill travel.
          </p>
        </div>

        {/* 6 Standards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {standardsList.map((std, idx) => (
            <div
              key={idx}
              className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D5E0D8] hover:border-[#073125]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#F4F7F3] text-[#073125] border border-[#D5E0D8] font-sans font-bold text-base flex items-center justify-center mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#073125] mb-2.5 leading-snug">
                  {std.title}
                </h3>
                <p className="text-[15px] sm:text-base text-[#4A635A] leading-relaxed font-normal">
                  {std.desc}
                </p>
              </div>

              <div className="mt-6 pt-3.5 border-t border-[#D5E0D8] flex items-center gap-2 text-xs sm:text-sm text-[#073125] font-semibold">
                <CheckCircleIcon className="w-4 h-4 text-[#073125]" />
                <span>Verified Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Kathgodam Station On-Time Pickup Guarantee Banner */}
        <div className="mt-12 sm:mt-14 rounded-3xl overflow-hidden bg-[#073125] border border-white/15 shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center reveal">
          <div className="lg:col-span-7 p-7 sm:p-10 text-white">
            <span className="text-[11px] uppercase tracking-wider text-[#C9F24D] font-bold block mb-2 font-sans">
              Kathgodam Station Meet &amp; Greet Hub
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium mb-3 leading-snug text-white">
              Direct Railway Station &amp; Airport Pickups
            </h3>
            <p className="text-sm text-[#DCE9E4] leading-relaxed mb-6 font-light">
              Arriving at Kathgodam Station or Pantnagar Airport? Our driver greets you at the gate with your nameboard, assists with luggage, and ensures a peaceful drive up the hills.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 font-medium text-white">
                ✓ No extra waiting charges for delayed trains
              </span>
              <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 font-medium font-numeral text-white">
                ✓ Fixed rate starting at ₹2,499
              </span>
            </div>
          </div>
          <div className="lg:col-span-5 h-64 sm:h-80 relative overflow-hidden bg-slate-900">
            <img
              src={kathgodamStationImg}
              alt="Kathgodam Railway Station Pickup"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#073125] lg:via-transparent lg:to-transparent"></div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SafetyStandardsGrid;
