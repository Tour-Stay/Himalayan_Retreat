import { useState } from 'react';
import { Container, CheckCircleIcon, APP_URLS } from '@shared';
import { fleetData } from '../data/landingData';

const TravelGatewaySection = () => {
  const [activeFleetIdx, setActiveFleetIdx] = useState(0);

  return (
    <section id="travel-gateway" className="py-20 sm:py-28 px-4 bg-[#12433B] border-b border-[#0D332D] text-white relative overflow-hidden">
      <Container size="lg">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 relative z-10">
          <div className="max-w-2xl">
            <span className="font-serif text-sm uppercase tracking-widest text-[#EAA722] font-semibold block mb-2">
              Devbhoomi Pilgrimage Fleet • Almora Base Hub
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-tight">
              Chauffeured Mountain Cabs <br />
              <span className="italic text-[#EAA722] font-normal">&amp; Sacred Shrines Yatra</span>
            </h2>
            <p className="font-serif text-lg sm:text-xl text-[#FAF5EC]/90 leading-relaxed mt-4 font-normal">
              Travel comfortably with courteous, experienced hill drivers. Clean 4-seater sedans, 6-seater Innova Crystas, and 12-seater Urbania cruisers for sacred temple yatras, Kainchi Dham darshan, and station pickups.
            </p>
          </div>

          <div className="flex-shrink-0">
            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noreferrer"
              className="btn-nkb-gold px-8 py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Mountain Fleet</span>
              <span className="text-base leading-none">↗</span>
            </a>
          </div>
        </div>

        {/* Traditional Fleet Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10 bg-[#0D332D] p-8 sm:p-10 rounded-3xl border border-[#EAA722]/30 shadow-2xl">
          {/* Left: Vehicle Image */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 shadow-lg border border-[#EAA722]/30 bg-[#092420]">
              <img
                src={fleetData[activeFleetIdx].image}
                alt={fleetData[activeFleetIdx].name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
              />
              <div className="absolute bottom-4 right-4 px-5 py-2 rounded-full bg-[#541508]/90 text-white shadow-xl border border-[#EAA722]/40 flex items-center gap-2">
                <span className="text-[#EAA722] font-serif text-sm font-semibold uppercase tracking-wider">
                  {fleetData[activeFleetIdx].tag}
                </span>
              </div>
            </div>

            {/* Fleet Selector Buttons */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {fleetData.map((vehicle, vIdx) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setActiveFleetIdx(vIdx)}
                  className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                    activeFleetIdx === vIdx
                      ? 'border-[#EAA722] bg-[#12433B] shadow-md'
                      : 'border-[#EAA722]/20 bg-[#0D332D] hover:border-[#EAA722]/50'
                  }`}
                >
                  <span className="font-serif text-base font-semibold text-white block truncate">
                    {vehicle.name}
                  </span>
                  <span className="text-sm text-[#EAA722] block font-bold mt-0.5">
                    {vehicle.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Fleet Details */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-serif text-sm uppercase tracking-widest text-[#EAA722] font-semibold block mb-2">
                {fleetData[activeFleetIdx].type}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white mb-6">
                {fleetData[activeFleetIdx].name}
              </h3>

              <div className="space-y-4 mb-8">
                {fleetData[activeFleetIdx].specs.map((spec, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-3.5 text-base sm:text-lg text-[#FAF5EC]/90 font-serif">
                    <CheckCircleIcon className="w-5 h-5 text-[#EAA722] flex-shrink-0 mt-1" />
                    <span className="leading-snug">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAA722]/20 flex items-center justify-between">
              <span className="text-base text-[#FAF5EC]/70 font-serif">
                Experienced Mountain Drivers
              </span>
              <a
                href={APP_URLS.travel}
                target="_blank"
                rel="noreferrer"
                className="text-base font-serif font-bold text-[#EAA722] hover:text-white flex items-center gap-1.5"
              >
                <span>Book Cab Online</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TravelGatewaySection;
