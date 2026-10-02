import { useState } from 'react';
import { Container, CheckCircleIcon, APP_URLS, captionImg } from '@shared';
import { suitesData } from '../data/landingData';

const HotelGatewaySection = () => {
  const [activeSuiteIdx, setActiveSuiteIdx] = useState(0);

  return (
    <section id="hotel-gateway" className="py-16 sm:py-24 px-4 bg-[#FDFBF7]">
      <Container size="lg">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-sans text-[#C5A059] uppercase tracking-wider font-semibold block mb-2">
              Boutique Mountain Stay • 6,942 FT
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2523] font-medium leading-tight">
              Cozy Heated Rooms <span className="font-sans font-light">&</span> Mountain Chalets
            </h2>
            <p className="text-[#5C5350] text-base leading-relaxed mt-2 font-normal">
              Heated alpine rooms crafted with warm wood and river stone, each with a private balcony facing the snow peaks of Trishul and Nanda Devi.
            </p>
          </div>

          <a
            href={APP_URLS.hotel}
            target="_blank"
            rel="noreferrer"
            className="group px-6 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] shadow-md hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2 flex-shrink-0"
          >
            <span>View All Rooms</span>
            <span className="text-sm leading-none group-hover:translate-x-0.5 transition-transform">↗</span>
          </a>
        </div>

        {/* Interactive Suite Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Suite Image */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-[400px] shadow-lg border border-[#C5A059]/20 flex-1">
              <img
                src={suitesData[activeSuiteIdx].image}
                alt={suitesData[activeSuiteIdx].name}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B2838]/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 right-4 px-5 py-2 rounded-full bg-[#FDFBF7]/95 text-[#2C2523] shadow-md border border-[#C5A059]/30 flex items-baseline gap-1.5">
                <span className="text-[#7C1D23] font-numeral text-xl font-bold tracking-tight">{suitesData[activeSuiteIdx].tariff}</span>
                <span className="text-xs text-[#6B615E]">{suitesData[activeSuiteIdx].unit}</span>
              </div>
            </div>

            {/* Suite Selector */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {suitesData.map((suite, sIdx) => (
                <button
                  key={suite.id}
                  type="button"
                  onClick={() => setActiveSuiteIdx(sIdx)}
                  className={`p-3 rounded-xl text-left border transition-all duration-300 cursor-pointer ${
                    activeSuiteIdx === sIdx
                      ? 'border-[#7C1D23]/60 bg-[#FAF6EF] shadow-xs'
                      : 'border-[#C5A059]/15 bg-transparent hover:border-[#C5A059]/40'
                  }`}
                >
                  <span className="font-serif text-sm font-medium text-[#2C2523] block truncate">
                    {suite.name.split(' ')[0]} {suite.name.split(' ')[1]}
                  </span>
                  <span className="text-xs font-sans text-[#7C1D23] font-semibold mt-0.5 block">
                    {suite.tariff}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-sans text-[#C5A059] uppercase tracking-wider font-semibold block mb-2">
                {suitesData[activeSuiteIdx].size} • Valley & Peak View
              </span>
              <h3 className="font-serif text-2xl font-medium text-[#2C2523] mb-4 leading-snug">
                {suitesData[activeSuiteIdx].name}
              </h3>

              <div className="space-y-2.5 mb-6">
                {suitesData[activeSuiteIdx].features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-3 text-sm sm:text-base text-[#2C2523]/90">
                    <CheckCircleIcon className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Fresh Food & Cafe Callout with Authentic Photo */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF6EF] border border-[#C5A059]/25 mb-6 flex items-center gap-4">
                <img
                  src={captionImg}
                  alt="The Kasar Himalayan Heights Cafe & Dining"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 border border-[#C5A059]/30 shadow-xs"
                />
                <div>
                  <strong className="text-[#7C1D23] font-serif text-base block mb-0.5">
                    Fresh Satvik Dining & Cafe
                  </strong>
                  <p className="text-xs text-[#5C5350] leading-relaxed">
                    Homemade vegetarian food, fresh rotis, local lentils, mountain honey, and hot herbal tea made to order in our rustic mountain cafe.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`${APP_URLS.hotel}/rooms`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-full text-center text-xs font-sans uppercase tracking-wider font-semibold bg-[#7C1D23] text-[#FDFBF7] hover:bg-[#5C151A] transition-all duration-300 shadow-md"
              >
                View Rooms & Photos ↗
              </a>
              <a
                href={`${APP_URLS.hotel}#book`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-full text-center text-xs font-sans uppercase tracking-wider font-semibold border border-[#C5A059] bg-[#FDFBF7] text-[#2C2523] hover:text-[#7C1D23] transition-all duration-300"
              >
                Check Dates ↗
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HotelGatewaySection;
