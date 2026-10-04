import React, { useState } from 'react';
import { Container, ArrowUpRightIcon, useSiteSettings } from '@shared';
import { fleetData, mergeFleetWithSettings } from '../data/travelData';
import VehicleCard from '../components/VehicleCard';
import VehicleModal from '../components/VehicleModal';

const AllCabs = () => {
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
    window.location.href = `/#calculator`;
  };

  return (
    <div className="py-16 sm:py-24 px-4 bg-[#FDFBF7] min-h-screen font-sans">
      <Container size="lg">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C84B0F]/10 border border-[#C84B0F]/30 text-[#C84B0F] text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="text-amber-500 animate-pulse text-xs">🪔</span>
            <span>Chauffeured Mountain Fleet • Almora Base</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2C2523] font-medium tracking-tight mb-4">
            Our Mountain Cabs &amp; Tariffs
          </h1>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C84B0F] to-transparent mx-auto my-4"></div>

          <p className="text-[#5C5350] text-base sm:text-lg leading-relaxed font-normal">
            Choose from clean 4-seater sedans, spacious 6-seater Innova Crystas, and 12-seater luxury minibuses driven by friendly local Pahadi chauffeurs.
          </p>
        </div>

        {/* Fleet Grid */}
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

        {/* Vehicle Modal */}
        <VehicleModal
          vehicle={selectedVehicle}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectForBooking={handleBook}
        />
      </Container>
    </div>
  );
};

export default AllCabs;
