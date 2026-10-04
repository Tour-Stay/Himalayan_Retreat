import { useState } from 'react';
import { Container, CheckCircleIcon, APP_URLS } from '@shared';
import { suitesData } from '../data/landingData';

const HotelGatewaySection = () => {
  const [activeSuiteIdx, setActiveSuiteIdx] = useState(0);

  return (
    <section id="hotel-gateway" className="py-20 sm:py-28 px-4 bg-[#541508] border-b border-[#3D0F06] text-white relative overflow-hidden">
      <Container size="lg">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 relative z-10">
          <div className="max-w-2xl">
            <span className="font-serif text-sm uppercase tracking-widest text-[#EAA722] font-semibold block mb-2">
              The Retreat Sanctuary • 6,942 FT Altitude
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight">
              Heated Alpine Chalets <br />
              <span className="italic text-[#EAA722] font-normal">&amp; Snow Peak Views</span>
            </h2>
            <p className="font-serif text-lg sm:text-xl text-[#FAF5EC]/90 leading-relaxed mt-4 font-normal">
              Heated chalets crafted with mountain cedar and river stone. Each chalet opens to an intimate private balcony overlooking Mount Trishul and Nanda Devi.
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noreferrer"
              className="btn-nkb-gold px-8 py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Retreat Suites</span>
              <span className="text-base leading-none">↗</span>
            </a>
          </div>
        </div>

        {/* Traditional Suite Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left: Suite Photo */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden h-80 sm:h-[420px] shadow-2xl border-2 border-[#EAA722]/30 bg-[#3D0F06]">
              <img
                src={suitesData[activeSuiteIdx].image}
                alt={suitesData[activeSuiteIdx].name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-5 right-5 px-5 py-2 rounded-full bg-[#12433B]/90 text-white shadow-xl border border-[#EAA722]/40 flex items-center gap-2">
                <span className="text-[#EAA722] font-serif text-sm uppercase tracking-wider font-semibold">
                  Heated Mountain Suite
                </span>
              </div>
            </div>

            {/* Suite Selector */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-5">
              {suitesData.map((suite, sIdx) => (
                <button
                  key={suite.id}
                  type="button"
                  onClick={() => setActiveSuiteIdx(sIdx)}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                    activeSuiteIdx === sIdx
                      ? 'border-[#EAA722] bg-[#3D0F06] shadow-md'
                      : 'border-[#EAA722]/25 bg-[#541508] hover:border-[#EAA722]/60'
                  }`}
                >
                  <span className="font-serif text-base font-semibold text-white block truncate">
                    {suite.name}
                  </span>
                  <span className="text-xs font-serif text-[#EAA722] font-semibold mt-1 block tracking-wide">
                    {suite.size}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Suite Highlights */}
          <div className="lg:col-span-5 bg-[#3D0F06] p-8 sm:p-10 rounded-3xl border border-[#EAA722]/30 shadow-xl">
            <span className="font-serif text-sm uppercase tracking-widest text-[#EAA722] font-semibold block mb-2">
              {suitesData[activeSuiteIdx].size} • Valley &amp; Peak Facing
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white mb-6">
              {suitesData[activeSuiteIdx].name}
            </h3>

            <div className="space-y-4 mb-8">
              {suitesData[activeSuiteIdx].features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-start gap-3.5 text-base sm:text-lg text-[#FAF5EC]/90 font-serif">
                  <CheckCircleIcon className="w-5 h-5 text-[#EAA722] flex-shrink-0 mt-1" />
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-[#EAA722]/20 flex items-center justify-between">
              <span className="text-base text-[#FAF5EC]/70 font-serif">
                Includes Breakfast &bull; Heated Beds
              </span>
              <a
                href={`${APP_URLS.hotel}#book`}
                target="_blank"
                rel="noreferrer"
                className="text-base font-serif font-bold text-[#EAA722] hover:text-white flex items-center gap-1.5"
              >
                <span>Reserve Room</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HotelGatewaySection;
