import React from 'react';
import { Container, ShieldCheckIcon, CarIcon, CheckCircleIcon, kathgodamStationImg } from '@shared';
import { safetyStandards } from '../data/travelData';

const SafetyStandardsGrid = () => {
  return (
    <section id="safety" className="py-20 sm:py-28 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20">
      <Container size="lg">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-sans text-[#C84B0F] uppercase tracking-wider font-semibold block mb-2">
            Why Ride With Us • Almora Fleet
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2523] font-medium tracking-tight mb-4">
            Safe, Respectful Mountain Travel
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C84B0F] to-transparent mx-auto my-3"></div>
          <p className="text-[#5C5350] text-base leading-relaxed font-normal">
            Driving in the Himalayas requires local road experience, calm driving, and well-maintained vehicles. Here is our promise to you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safetyStandards.map((std, idx) => (
            <div
              key={idx}
              className="card-luxury p-7 rounded-3xl bg-[#FAF6EF]/60 border border-[#C5A059]/25 hover:border-[#C84B0F]/35 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C84B0F]/15 to-[#7C1D23]/10 border border-[#C84B0F]/30 flex items-center justify-center text-[#C84B0F] font-serif font-bold text-lg mb-5 shadow-xs">
                  {idx + 1}
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523] mb-2 leading-snug">
                  {std.title}
                </h3>
                <p className="text-sm text-[#5C5350] leading-relaxed font-normal">
                  {std.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#C5A059]/15 flex items-center gap-1.5 text-xs text-[#C84B0F] font-semibold">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Verified Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Kathgodam Station On-Time Pickup Guarantee Banner */}
        <div className="mt-14 rounded-3xl overflow-hidden bg-gradient-to-r from-[#1C1817] to-[#2C2523] border border-[#C5A059]/40 shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-7 sm:p-10 text-[#FDFBF7]">
            <span className="text-[11px] uppercase tracking-wider text-[#DFCA9B] font-bold block mb-2 font-cinzel">
              Kathgodam Station Meet &amp; Greet Hub
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium mb-3 leading-snug">
              Direct Railway Station &amp; Airport Pickups
            </h3>
            <p className="text-sm text-[#FAF6EF]/85 leading-relaxed mb-6 font-normal">
              Whether arriving on the Shatabdi Express, Ranikhet Express, or Lucknow Mail at Kathgodam, or landing at Pantnagar Airport, our driver waits at the exit gate with a personalized nameboard. We assist with all heavy luggage and provide a smooth, scenic drive up the hills.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
                ✓ No extra waiting charges for delayed trains
              </span>
              <span className="bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
                ✓ Fixed rate starting at ₹2,499
              </span>
            </div>
          </div>
          <div className="lg:col-span-5 h-64 sm:h-80 relative overflow-hidden">
            <img
              src={kathgodamStationImg}
              alt="Kathgodam Railway Station Pickup"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#1C1817] lg:via-transparent lg:to-transparent"></div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SafetyStandardsGrid;
