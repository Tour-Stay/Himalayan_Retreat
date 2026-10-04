import React, { useState } from 'react';
import { Container, ArrowUpRightIcon, useSiteSettings } from '@shared';
import { fleetData, mergeFleetWithSettings } from '../data/travelData';
import VehicleCard from './VehicleCard';

const VehicleFleet = ({ onBookFleet, onQuickView }) => {
  const [filter, setFilter] = useState('all');
  const { settings } = useSiteSettings();

  const fleetList = React.useMemo(() => {
    return mergeFleetWithSettings(settings?.cabFleet);
  }, [settings?.cabFleet]);

  const filteredFleet = filter === 'all'
    ? fleetList
    : fleetList.filter((v) => {
        if (filter === 'small') return v.seats <= 4;
        if (filter === 'suv') return v.seats === 6;
        if (filter === 'group') return v.seats > 6;
        return true;
      });

  return (
    <section id="cabs" className="py-20 sm:py-28 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20 relative overflow-hidden">
      {/* Subtle background sacred watermark */}
      <div className="absolute top-10 right-8 text-[#C84B0F]/[0.025] text-[180px] font-devanagari select-none pointer-events-none leading-none z-0">
        🔱
      </div>

      <Container size="lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
          <div className="max-w-xl">
            <span className="text-xs font-sans text-[#C84B0F] uppercase tracking-wider font-semibold block mb-2 flex items-center gap-1.5">
              <span className="text-sm">🪔</span> Verified Mountain Fleet • Almora Base
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2523] font-medium leading-tight">
              Our Clean Mountain Cabs
            </h2>
            <p className="text-[#5C5350] text-base leading-relaxed mt-2 font-normal">
              High-clearance vehicles inspected for hill roads, driven by friendly local Pahadi drivers who know every mountain turn. Transparent fixed rates with no hidden costs.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Cabs' },
              { id: 'small', label: '4-Seater Sedan' },
              { id: 'suv', label: '6-Seater SUV' },
              { id: 'group', label: '12-Seater Minibus' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] text-[#FDFBF7] shadow-sm'
                    : 'bg-[#FAF6EF] text-[#5C5350] border border-[#C5A059]/30 hover:border-[#C84B0F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {filteredFleet.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onQuickView={onQuickView}
              onBook={onBookFleet}
            />
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFF5EC] via-[#FAF6EF] to-[#FFF5EC] border border-[#C84B0F]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative z-10 shadow-xs">
          <div>
            <h4 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523] flex items-center justify-center sm:justify-start gap-2">
              <span>Looking for a Custom Multi-Day Tour?</span>
              <span className="text-xs font-devanagari text-[#C84B0F]">॥ शुभ यात्रा ॥</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#5C5350] mt-1 leading-relaxed">
              We arrange customized temple itineraries, airport pickups from Delhi/Pantnagar, and Chardham Yatra escorts with dedicated hill drivers.
            </p>
          </div>

          <a
            href="#calculator"
            className="px-6 py-3 rounded-full text-xs uppercase tracking-wider font-bold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition-all shadow-md flex-shrink-0 flex items-center gap-1.5 border border-[#C5A059]/30"
          >
            <span>Plan Custom Trip ↗</span>
          </a>
        </div>
      </Container>
    </section>
  );
};

export default VehicleFleet;
