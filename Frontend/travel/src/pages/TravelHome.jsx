import React, { useState, useEffect } from 'react';
import {
  Container,
  CarIcon,
  MountainIcon,
  initAutoScrollReveal,
  kausaniImg,
  APP_URLS,
  ArrowUpRightIcon,
} from '@shared';
import HeroCabBar from '../components/HeroCabBar';
import VehicleFleet from '../components/VehicleFleet';
import VehicleModal from '../components/VehicleModal';
import PilgrimageCircuits from '../components/PilgrimageCircuits';
import SafetyStandardsGrid from '../components/SafetyStandardsGrid';
import FareCalculator from '../components/FareCalculator';
import TravelReviews from '../components/TravelReviews';
import TravelFaqSection from '../components/TravelFaqSection';

const TravelHome = () => {
  const [selectedFleetId, setSelectedFleetId] = useState('6-seater');
  const [selectedDestId, setSelectedDestId] = useState('kainchi-dham');
  const [selectedPickup, setSelectedPickup] = useState('Kathgodam Railway Station');
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVehicle, setModalVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cleanup = initAutoScrollReveal();
    return cleanup;
  }, []);

  const handleHeroSearch = (searchData) => {
    if (searchData.vehicle) setSelectedFleetId(searchData.vehicle);
    if (searchData.destination) setSelectedDestId(searchData.destination);
    if (searchData.pickup) setSelectedPickup(searchData.pickup);
    if (searchData.date) setSelectedDate(searchData.date);
  };

  const handleQuickView = (vehicle) => {
    setModalVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleBookFleet = (vehicleId) => {
    setSelectedFleetId(vehicleId);
    const calcEl = document.getElementById('calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCircuit = (destId) => {
    setSelectedDestId(destId);
    const calcEl = document.getElementById('calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#2C2523] font-sans selection:bg-[#C5A059]/20 selection:text-[#7C1D23]">
      {/* 1. Hero: Bright Scenic Mountain Highway & Local Drivers */}
      <section className="relative min-h-[82vh] flex items-center justify-center bg-[#151D28] text-[#FDFBF7] overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 z-0">
          <img
            src={kausaniImg}
            alt="Scenic Himalayan Valleys and Snow Peaks"
            className="w-full h-full object-cover opacity-85 scale-102"
          />
          {/* Subtle balanced gradient for clear contrast without darkening the mountains */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#151D28]/85 via-[#151D28]/35 to-black/20"></div>
        </div>

        {/* Ambient Warm Glow */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#E05A1B]/[0.08] rounded-full blur-[160px] pointer-events-none"></div>

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
          {/* Sacred Kesariya Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1817]/85 border border-[#C5A059]/40 text-[#DFCA9B] text-xs font-semibold uppercase tracking-wider mb-6 shadow-xl backdrop-blur-md">
            <span className="text-amber-500 animate-pulse text-xs">🪔</span>
            <span className="font-devanagari">॥ ॐ नमः शिवाय • 🔱 जय श्री नीब करौरी महाराज ॥</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.12] text-[#FDFBF7] max-w-5xl drop-shadow-md">
            Himalayan Cabs <span className="font-sans font-light">&</span>{' '}
            <br className="hidden sm:inline" />
            <span className="italic text-[#DFCA9B] font-light">Scenic Mountain Tours</span>
          </h1>

          <p className="mt-4 font-serif text-lg sm:text-2xl text-[#DFCA9B]/90 italic max-w-2xl font-light">
            Comfortable hill travel to Kainchi Dham, Jageshwar, and Himalayan valleys
          </p>

          <p className="mt-4 text-sm sm:text-base text-[#FAF6EF]/85 max-w-2xl font-normal leading-relaxed">
            Friendly local Pahadi drivers, clean heated vehicles, and honest fixed fares with zero surprises. Pickups from Kathgodam Railway Station, Pantnagar Airport, and Almora.
          </p>

          {/* Trust Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-[#FAF6EF] font-medium">
              ✓ Local Pahadi Drivers
            </span>
            <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-[#FAF6EF] font-medium">
              ✓ 100% Fixed Upfront Fares
            </span>
            <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-[#FAF6EF] font-medium">
              ✓ On-Time Station Pickup
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="#calculator"
              className="bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] hover:from-[#E05A1B] hover:to-[#9E3304] text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg transition-all border border-[#C5A059]/40 cursor-pointer flex items-center gap-1.5 hover:scale-102"
            >
              <span>Calculate Trip Fare</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </a>

            <a
              href="#cabs"
              className="border border-[#C5A059]/60 hover:bg-[#C5A059]/20 text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full transition-all cursor-pointer"
            >
              Explore Our Cabs
            </a>
          </div>
        </div>
      </section>

      {/* 2. Hero Floating Quick Cab Bar */}
      <HeroCabBar onSearch={handleHeroSearch} />

      {/* 3. Fleet Showcase (Sedan, Innova Crysta, Minibus) */}
      <VehicleFleet
        onBookFleet={handleBookFleet}
        onQuickView={handleQuickView}
      />

      {/* 4. Popular Pilgrimage Circuits (Kainchi Dham, Jageshwar, Kasar, Kausani, Nainital) */}
      <PilgrimageCircuits onSelectDestination={handleSelectCircuit} />

      {/* 5. Live Transparent Fare Calculator */}
      <section className="py-20 sm:py-28 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20">
        <Container size="lg">
          <FareCalculator
            selectedFleetId={selectedFleetId}
            selectedDestId={selectedDestId}
            initialPickup={selectedPickup}
            initialDate={selectedDate}
            onSelectFleet={(id) => setSelectedFleetId(id)}
          />
        </Container>
      </section>

      {/* 6. Safety & Mountain Standards (6 Trust Pillars) */}
      <SafetyStandardsGrid />

      {/* 7. Real Guest Reviews */}
      <TravelReviews />

      {/* 8. Mountain Travel FAQs */}
      <TravelFaqSection />

      {/* 9. Quick View Vehicle Modal */}
      <VehicleModal
        vehicle={modalVehicle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectForBooking={handleBookFleet}
      />
    </div>
  );
};

export default TravelHome;
