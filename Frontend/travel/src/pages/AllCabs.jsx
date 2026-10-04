import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, useSiteSettings } from '@shared';
import { fleetData, mergeFleetWithSettings } from '../data/travelData';
import VehicleCard from '../components/VehicleCard';
import VehicleModal from '../components/VehicleModal';

const AllCabs = () => {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { settings } = useSiteSettings();

  const fleetList = React.useMemo(() => {
    return mergeFleetWithSettings(settings?.cabFleet);
  }, [settings?.cabFleet]);

  const handleQuickView = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleBook = (vehicleId) => {
    navigate('/calculator', { state: { vehicleId } });
  };

  return (
    <div className="min-h-screen bg-[#FAF5EC] font-sans">
      {/* 1. Devotional Header Banner */}
      <section className="bg-[#541508] text-white pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 border-b border-[#3D0F06]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#EAA722] text-[#541508] text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-xs">
            ॥ पावन तीर्थ यात्रा • MOUNTAIN FLEET &amp; TARIFFS • 6,942 FT ॥
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight mb-3 text-white">
            Our Mountain Cabs &amp; Tariffs
          </h1>
          <p className="text-[#FAF5EC]/90 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
            Clean 4-seater hill sedans, spacious 6-seater Innova Crystas, and 12-seater luxury minibuses driven by friendly local Pahadi chauffeurs.
          </p>
        </div>
      </section>

      {/* 2. Fleet Grid */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[1560px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fleetList.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onQuickView={handleQuickView}
                onBook={handleBook}
              />
            ))}
          </div>

          {/* Bottom Fast Calculator CTA */}
          <div className="mt-14 p-7 sm:p-9 rounded-3xl bg-[#073125] text-white border border-[#EAA722]/35 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs font-mono font-bold text-[#EAA722] uppercase tracking-wider block mb-1">
                ✦ 100% FIXED HONEST FARES
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Want to calculate exact fare for your route?
              </h3>
              <p className="text-xs sm:text-sm text-[#D4DDD2] mt-1 font-light max-w-xl">
                Select your pickup station, travel date, and destination to get an instant all-inclusive quote.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/calculator')}
              className="px-8 py-4 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider font-bold bg-[#EAA722] hover:bg-[#D98E16] text-[#541508] transition-all shadow-lg hover:scale-102 flex-shrink-0 cursor-pointer"
            >
              Open Fare Calculator ↗
            </button>
          </div>

          {/* Vehicle Modal */}
          <VehicleModal
            vehicle={selectedVehicle}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelectForBooking={handleBook}
          />
        </div>
      </section>
    </div>
  );
};

export default AllCabs;
