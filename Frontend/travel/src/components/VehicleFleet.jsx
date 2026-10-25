import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon, useSiteSettings } from '@shared';
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
    <section id="cabs" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#073125] text-white border-b border-white/10 relative overflow-hidden">
      <div className="max-w-[1560px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6 relative z-10 reveal">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-sans font-bold tracking-widest uppercase mb-2.5 shadow-xs">
              <span>MOUNTAIN FLEET &amp; TARIFFS</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
              Our Clean Mountain &amp; Yatra Cabs
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mt-2 font-light">
              Inspected mountain cabs driven by respectful local Pahadi drivers. Kainchi Dham, Jageshwar, and station transfers at transparent fixed rates.
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
                className={`px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#C9F24D] text-[#073125] font-bold shadow-md'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 font-medium'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10 reveal">
          {filteredFleet.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onQuickView={onQuickView}
              onBook={onBookFleet}
            />
          ))}
        </div>

        {/* Bottom Custom Tour Banner */}
        <div className="mt-12 sm:mt-14 p-6 sm:p-8 rounded-3xl bg-[#052219] border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left relative z-10 backdrop-blur-sm shadow-xl">
          <div>
            <h4 className="font-serif text-xl sm:text-2xl font-normal text-white flex items-center justify-center sm:justify-start gap-2">
              <span>Looking for a Custom Multi-Day Tour or Chardham Yatra?</span>
            </h4>
            <p className="text-xs sm:text-sm text-white/80 mt-1 leading-relaxed font-light">
              Custom temple itineraries, airport/station pickups, and multi-day Chardham Yatra tours.
            </p>
          </div>

          <Link
            to="/calculator"
            className="px-6 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-bold bg-[#C9F24D] hover:bg-[#bde63d] text-[#073125] transition-all shadow-md flex-shrink-0 flex items-center gap-1.5 cursor-pointer hover:scale-102"
          >
            <span>Plan Custom Trip ↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VehicleFleet;
