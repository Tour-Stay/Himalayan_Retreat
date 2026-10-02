import { useState } from 'react';
import { Container, CheckCircleIcon, APP_URLS } from '@shared';
import { fleetData } from '../data/landingData';

const TravelGatewaySection = () => {
  const [activeFleetIdx, setActiveFleetIdx] = useState(0);

  return (
    <section id="travel-gateway" className="py-16 sm:py-24 px-4 bg-[#FAF6EF]/60 border-b border-[#C5A059]/20">
      <Container size="lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-sans text-[#C5A059] uppercase tracking-wider font-semibold block mb-2">
              Private Mountain Cabs • Almora Base
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2523] font-medium">
              Reliable Cabs <span className="font-sans font-light">&</span> Mountain Travel
            </h2>
            <p className="text-[#5C5350] text-base leading-relaxed mt-2 max-w-xl font-normal">
              Choose from clean 4-seater sedans, 6-seater Innova Crystas, and 12-seater minibuses driven by friendly, experienced hill drivers. Transparent fixed rates with no hidden surprises.
            </p>
          </div>

          <div>
            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold border border-[#C5A059] bg-[#FDFBF7] text-[#2C2523] hover:text-[#7C1D23] hover:bg-[#C5A059]/20 transition-all shadow-xs inline-flex items-center gap-2"
            >
              <span>Explore Cabs & Tours</span>
              <span className="text-sm leading-none">↗</span>
            </a>
          </div>
        </div>

        {/* Interactive Fleet Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FDFBF7] p-6 sm:p-8 rounded-3xl border border-[#C5A059]/35 shadow-md">
          {/* Left: Vehicle Image */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 shadow-lg border border-[#C5A059]/30">
              <img
                src={fleetData[activeFleetIdx].image}
                alt={fleetData[activeFleetIdx].name}
                className="w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute bottom-4 right-4 px-4 py-1.5 rounded-full bg-[#FAF6EF]/95 text-[#2C2523] shadow-md border border-[#C5A059]/40 flex items-center gap-1.5">
                <span className="text-xs text-[#6B615E]">Kathgodam: </span>
                <span className="text-[#7C1D23] font-numeral text-sm font-bold">{fleetData[activeFleetIdx].rateKathgodam}</span>
              </div>
            </div>

            {/* Fleet Selector Buttons */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
              {fleetData.map((vehicle, vIdx) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setActiveFleetIdx(vIdx)}
                  className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    activeFleetIdx === vIdx
                      ? 'border-[#7C1D23] bg-[#FAF6EF] shadow-xs'
                      : 'border-[#C5A059]/30 bg-[#FDFBF7] hover:bg-[#FAF6EF]'
                  }`}
                >
                  <span className="font-serif text-sm font-semibold text-[#2C2523] block truncate">
                    {vehicle.name.split(' ')[1] || vehicle.name.split(' ')[0]}
                  </span>
                  <span className="text-xs text-[#C5A059] block font-semibold mt-0.5">
                    {vehicle.type.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Fleet Real Details & Tariffs */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-sans text-[#C5A059] uppercase tracking-wider font-semibold block mb-1">
                {fleetData[activeFleetIdx].type}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#2C2523] mb-4">
                {fleetData[activeFleetIdx].name}
              </h3>

              <div className="space-y-3 mb-6">
                {fleetData[activeFleetIdx].specs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#2C2523]">
                    <CheckCircleIcon className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-1" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>

              {/* Transparent Pricing Card */}
              <div className="p-4 rounded-xl bg-[#FAF6EF] border border-[#C5A059]/25 mb-6 text-sm text-[#2C2523] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#6B615E]">Kathgodam to Kasar Devi:</span>
                  <strong className="text-[#7C1D23] font-numeral text-base font-bold">{fleetData[activeFleetIdx].rateKathgodam}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6B615E]">Delhi to Kasar Devi:</span>
                  <strong className="text-[#2C2523] font-numeral text-base font-bold">{fleetData[activeFleetIdx].rateDelhi}</strong>
                </div>
                <p className="text-xs text-[#6B615E] pt-1.5 border-t border-[#C5A059]/15">
                  Includes driver allowance, toll, fuel, and parking.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`${APP_URLS.travel}#calculator`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-full text-center text-xs font-sans uppercase tracking-wider font-semibold bg-[#7C1D23] text-[#FDFBF7] hover:bg-[#5C151A] transition-all shadow-md"
              >
                Calculate Trip Fare ↗
              </a>
              <a
                href={APP_URLS.travel}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-full text-center text-xs font-sans uppercase tracking-wider font-semibold border border-[#C5A059] bg-[#FAF6EF] text-[#2C2523] hover:text-[#7C1D23] hover:bg-[#C5A059]/20 transition-all"
              >
                View All Vehicles ↗
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TravelGatewaySection;
