import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  CarIcon,
  MountainIcon,
  initAutoScrollReveal,
  kausaniImg,
  innovaImg,
  kainchiWebp,
  kathgodamStationImg,
  APP_URLS,
  ArrowUpRightIcon,
  WhatsAppIcon,
  CheckCircleIcon,
  SITE_CONFIG,
  useSiteSettings,
} from '@shared';
import HeroCabBar from '../components/HeroCabBar';
import VehicleFleet from '../components/VehicleFleet';
import VehicleModal from '../components/VehicleModal';
import PilgrimageCircuits from '../components/PilgrimageCircuits';
import SafetyStandardsGrid from '../components/SafetyStandardsGrid';
import TravelReviews from '../components/TravelReviews';
import TravelFaqSection from '../components/TravelFaqSection';

const TravelHome = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const whatsappNumber = settings?.company?.whatsappNumber || SITE_CONFIG.whatsappNumber;

  const [modalVehicle, setModalVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const cleanup = initAutoScrollReveal();
    return cleanup;
  }, []);

  const handleHeroSearch = (searchData) => {
    navigate('/calculator', { state: searchData });
  };

  const handleQuickView = (vehicle) => {
    setModalVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleBookFleet = (vehicleId) => {
    navigate('/calculator', { state: { vehicleId } });
  };

  const handleSelectCircuit = (destId) => {
    navigate('/calculator', { state: { destinationId: destId } });
  };

  return (
    <div className="bg-[#F8FAF7] text-[#073125] font-sans selection:bg-[#C9F24D] selection:text-[#073125]">
      {/* 1. Hero: Majestic Mountain Highway & Local Drivers */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-black text-white overflow-hidden pt-20 pb-24">
        {/* Background Image — Clear, crisp visibility with natural colors */}
        <div className="absolute inset-0 z-0">
          <img
            src={kausaniImg}
            alt="Scenic Himalayan Valleys and Snow Peaks"
            className="w-full h-full object-cover opacity-85 scale-100 transition-opacity duration-700"
          />
          {/* Subtle neutral gradient for text legibility without mud tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20"></div>
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-tight text-white max-w-4xl drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)]">
            Himalayan Cabs &amp; Tours
          </h1>

          <p className="mt-3 text-xl sm:text-3xl text-[#C9F24D] font-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            Pahadi Drivers • Kainchi Dham Yatra • Fixed Fares
          </p>

          <p className="mt-4 text-base sm:text-lg text-white/95 max-w-2xl font-light leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            Reliable mountain cabs, Kathgodam station pickups, and fixed upfront fares for Kainchi Dham and holy shrines.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/calculator"
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-sans uppercase tracking-wider font-bold bg-[#C9F24D] hover:bg-[#bde63d] text-[#073125] transition-all shadow-md hover:scale-102 flex items-center gap-2 cursor-pointer"
            >
              <span>Calculate Trip Fare</span>
              <ArrowUpRightIcon className="w-4 h-4 text-[#073125]" />
            </Link>
            <Link
              to="/cabs"
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-sans uppercase tracking-wider font-semibold border border-white/30 bg-white/10 hover:bg-white/20 text-[#FAF5EC] transition-all backdrop-blur-sm hover:scale-102"
            >
              Explore Our Cabs
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Hero Floating Quick Cab Search Bar */}
      <HeroCabBar onSearch={handleHeroSearch} />

      {/* 3. Why Ride With Us (Warm Clean 4-Card Bento Grid) */}
      <section id="trust" className="pt-16 pb-16 sm:pt-20 sm:pb-20 px-4 bg-[#F4F7F3] border-b border-[#D5E0D8]">
        <Container size="full" className="max-w-[1560px]">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 reveal">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#073125] text-[#C9F24D] text-xs font-sans font-bold tracking-widest uppercase mb-2.5 shadow-xs">
              WHY TRAVELERS &amp; FAMILIES TRUST US
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#073125] font-normal">
              Safe Mountain Travel &amp; Dedicated Care
            </h2>
            <p className="mt-2 text-[#4A635A] text-base sm:text-lg font-light">
              Respectful Pahadi drivers, clean heated cabs, and peaceful shrine journeys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 reveal">
            {/* 1 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[360px] sm:h-[390px] lg:h-[410px] shadow-lg hover:shadow-xl hover:border-[#C9F24D] transition-all duration-300 border border-[#073125]/15 flex flex-col justify-end p-5 sm:p-6 group">
              <img
                src={kausaniImg}
                alt="Local Pahadi Drivers"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[#C9F24D] text-xs font-sans uppercase tracking-wider font-bold block mb-1">
                  Born In The Hills • Local Drivers
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1.5 leading-tight">
                  Local Pahadi Drivers
                </h3>
                <p className="text-[#FAF5EC]/90 text-xs sm:text-sm font-light leading-relaxed">
                  Decades of mountain road experience. Calm, safe driving on curves.
                </p>
              </div>
            </div>

            {/* 2 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[360px] sm:h-[390px] lg:h-[410px] shadow-lg hover:shadow-xl hover:border-[#C9F24D] transition-all duration-300 border border-[#073125]/15 flex flex-col justify-end p-5 sm:p-6 group">
              <img
                src={kainchiWebp}
                alt="Sacred Kainchi Dham Yatra"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[#C9F24D] text-xs font-sans uppercase tracking-wider font-bold block mb-1">
                  Kainchi Dham &amp; Shrines
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1.5 leading-tight">
                  Kainchi Dham &amp; Shrines
                </h3>
                <p className="text-[#FAF5EC]/90 text-xs sm:text-sm font-light leading-relaxed">
                  Morning aarti departures with patient darshan waiting at holy shrines.
                </p>
              </div>
            </div>

            {/* 3 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[360px] sm:h-[390px] lg:h-[410px] shadow-lg hover:shadow-xl hover:border-[#C9F24D] transition-all duration-300 border border-[#073125]/15 flex flex-col justify-end p-5 sm:p-6 group">
              <img
                src={innovaImg}
                alt="Fixed Upfront Fares"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[#C9F24D] text-xs font-sans uppercase tracking-wider font-bold block mb-1">
                  100% Transparent • Zero Hidden Charges
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1.5 leading-tight">
                  100% Fixed Honest Fares
                </h3>
                <p className="text-[#FAF5EC]/90 text-xs sm:text-sm font-light leading-relaxed">
                  Toll, parking, and driver allowance included upfront. Zero surprises.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[360px] sm:h-[390px] lg:h-[410px] shadow-lg hover:shadow-xl hover:border-[#C9F24D] transition-all duration-300 border border-[#073125]/15 flex flex-col justify-end p-5 sm:p-6 group">
              <img
                src={kathgodamStationImg}
                alt="Kathgodam Station Meet & Greet"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[#C9F24D] text-xs font-sans uppercase tracking-wider font-bold block mb-1">
                  Guaranteed • On-Time Pickup
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1.5 leading-tight">
                  Kathgodam Meet &amp; Greet
                </h3>
                <p className="text-[#FAF5EC]/90 text-xs sm:text-sm font-light leading-relaxed">
                  Driver waits at the station gate with your nameboard. Free delay waiting.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Fleet Showcase */}
      <VehicleFleet
        onBookFleet={handleBookFleet}
        onQuickView={handleQuickView}
      />

      {/* 5. Popular Pilgrimage Circuits */}
      <PilgrimageCircuits onSelectDestination={handleSelectCircuit} />

      {/* 6. Live Transparent Fare Calculator Spotlight */}
      <section id="calculator" className="py-16 sm:py-20 px-4 bg-gradient-to-b from-[#052219] via-[#073125] to-[#052219] text-white border-y border-white/10 relative overflow-hidden">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 reveal">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-xs font-sans font-bold tracking-widest uppercase mb-2.5 shadow-xs">
              TRANSPARENT PRICING &amp; ROUTES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal">
              Calculate Your Trip Fare
            </h2>
            <p className="mt-2 text-white/80 text-base sm:text-lg font-light">
              Select your route and cab to get an instant, transparent fixed fare.
            </p>
          </div>

          {/* Quick Route Highlights Grid with 1-Click Launch */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 reveal">
            {[
              { route: 'Kathgodam ➔ Kasar Devi', fare: '₹2,499', type: 'Station Pickup', desc: '88 km • Scenic hill drive • Train meetup' },
              { route: 'Kathgodam ➔ Kainchi Dham', fare: '₹2,199', type: 'Spiritual Darshan', desc: '45 km • Morning aarti & darshan halt' },
              { route: 'Almora ➔ Jageshwar 124 Temples', fare: '₹3,499', type: 'Heritage Day Tour', desc: '35 km round trip • Ancient pine forests' },
              { route: 'Delhi Airport ➔ Almora Heights', fare: '₹7,999', type: 'Expressway Drop', desc: '375 km door-to-door • Hill chauffeur' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white/[0.04] border border-white/15 hover:border-[#C9F24D] p-5 sm:p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <span className="text-xs font-sans uppercase tracking-wider text-[#C9F24D] font-bold block mb-1.5">
                    {item.type}
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl text-white font-medium mb-2 leading-snug">
                    {item.route}
                  </h4>
                  <p className="text-sm sm:text-[14.5px] text-white/80 leading-relaxed font-normal mb-4">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3.5 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block font-sans">Starts At</span>
                    <span className="font-serif text-2xl font-bold text-white font-numeral">{item.fare}</span>
                  </div>
                  <Link
                    to="/calculator"
                    className="text-xs sm:text-sm text-[#C9F24D] font-sans uppercase tracking-wider font-bold group-hover:underline flex items-center gap-1"
                  >
                    <span>Calculate ↗</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Launch Dedicated Calculator CTA Box */}
          <div className="bg-[#F4F7F3] text-[#073125] p-7 sm:p-9 rounded-3xl border border-[#D5E0D8] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 reveal">
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-sans font-bold text-[#073125] uppercase tracking-wider block mb-1">
                ✦ DEDICATED FARE CALCULATOR PAGE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#073125] font-normal leading-tight">
                Want a Customized Route with Dynamic Fares?
              </h3>
              <p className="text-base sm:text-lg text-[#4A635A] mt-2 font-normal max-w-xl">
                Choose your pickup station, vehicle, and temple halts for instant upfront pricing.
              </p>
            </div>

            <Link
              to="/calculator"
              className="px-8 py-4 rounded-full text-xs sm:text-sm font-sans uppercase tracking-wider font-bold bg-[#C9F24D] hover:bg-[#bde63d] text-[#073125] transition-all shadow-lg hover:scale-102 flex-shrink-0 flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>Open Dedicated Fare Calculator</span>
              <ArrowUpRightIcon className="w-4 h-4 text-[#073125]" />
            </Link>
          </div>
        </Container>
      </section>

      {/* 7. Safety & Mountain Standards (6 Trust Pillars) */}
      <SafetyStandardsGrid />

      {/* 8. Real Guest Reviews */}
      <TravelReviews />

      {/* 9. Mountain Travel FAQs */}
      <TravelFaqSection />

      {/* 10. Bottom Reservation Banner */}
      <section className="py-16 sm:py-20 px-4 bg-[#052219] text-white relative overflow-hidden border-t border-b border-white/10">
        <Container size="md">
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-5 bg-[#073125] p-8 sm:p-12 rounded-3xl border border-white/15 shadow-2xl backdrop-blur-sm">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-sans font-bold tracking-widest uppercase shadow-xs">
              ALMORA CAB DESK • 24/7 ASSISTANCE
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white">
              Ready for Your Sacred Pilgrimage or Mountain Journey?
            </h2>

            <p className="text-[#DCE9E4] text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
              Book your private mountain cab in advance. Kathgodam pickups, Kainchi Dham darshan, and temple tours.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/calculator"
                className="px-7 py-3.5 rounded-full text-xs font-sans uppercase tracking-wider font-bold bg-[#C9F24D] hover:bg-[#bde63d] text-[#073125] transition-all shadow-lg hover:scale-102 flex items-center gap-2 cursor-pointer"
              >
                <span>Calculate Trip Fare</span>
                <ArrowUpRightIcon className="w-3.5 h-3.5 text-[#073125]" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(
                    'Hello, I would like to inquire about booking a mountain cab / Kathgodam station pickup.'
                  );
                  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
                }}
                className="px-6 py-3.5 rounded-full text-xs font-sans uppercase tracking-wider font-semibold border border-white/25 hover:bg-white/10 text-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#C9F24D]" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Simple Perks */}
            <div className="pt-5 border-t border-white/15 flex flex-wrap items-center justify-center gap-5 text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span>100% Fixed Upfront Pricing</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span>Pahadi Hill Drivers</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span>Free Train Delay Waiting</span>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Quick View Vehicle Modal */}
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
