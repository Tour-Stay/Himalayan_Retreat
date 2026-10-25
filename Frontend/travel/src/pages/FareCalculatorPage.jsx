import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, CheckCircleIcon, PhoneIcon, WhatsAppIcon, ArrowUpRightIcon, SITE_CONFIG, useSiteSettings } from '@shared';
import FareCalculator from '../components/FareCalculator';

const FareCalculatorPage = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const company = settings?.company;
  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Pre-selected parameters if navigated from Hero search, Vehicle card, or Circuit
  const passedVehicle = location.state?.vehicle || location.state?.vehicleId;
  const passedDest = location.state?.destination || location.state?.destinationId;
  const passedPickup = location.state?.pickup;
  const passedDate = location.state?.date;

  return (
    <div className="min-h-screen bg-[#FAF5EC] font-sans selection:bg-[#EAA722] selection:text-[#541508]">
      {/* 1. Devotional Header Banner */}
      <section className="bg-[#541508] text-white pt-10 sm:pt-14 pb-8 sm:pb-10 px-4 sm:px-6 border-b border-[#3D0F06] relative overflow-hidden">
        <div className="w-full max-w-[1720px] mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EAA722] text-[#541508] text-xs font-mono font-bold tracking-widest uppercase mb-3 shadow-xs">
              <span>FARE CALCULATOR &amp; INSTANT BOOKING • 6,942 FT</span>
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mb-3 text-white">
              Mountain Cab Fare Calculator
            </h1>

            <p className="text-[#FAF5EC]/90 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Select your pickup, destination, and vehicle for an instant fixed fare. Toll, parking, and temple halts included.
            </p>

            {/* Quick Guarantees Strip */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#FAF5EC]/90">
              <span className="inline-flex items-center gap-1.5 bg-[#3D0F06] border border-[#EAA722]/35 px-3.5 py-1.5 rounded-full shadow-xs">
                <CheckCircleIcon className="w-4 h-4 text-[#EAA722]" />
                <span>100% Fixed Upfront Fares</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#3D0F06] border border-[#EAA722]/35 px-3.5 py-1.5 rounded-full shadow-xs">
                <CheckCircleIcon className="w-4 h-4 text-[#EAA722]" />
                <span>Local Pahadi Chauffeurs</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#3D0F06] border border-[#EAA722]/35 px-3.5 py-1.5 rounded-full shadow-xs">
                <CheckCircleIcon className="w-4 h-4 text-[#EAA722]" />
                <span>Free Train Delay Waiting</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#3D0F06] border border-[#EAA722]/35 px-3.5 py-1.5 rounded-full shadow-xs">
                <CheckCircleIcon className="w-4 h-4 text-[#EAA722]" />
                <span>Kainchi Dham Darshan Halt Included</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Calculator Container (Full Screen Width) */}
      <section className="py-6 sm:py-10 px-3 sm:px-6 lg:px-10 xl:px-14 w-full">
        <div className="w-full max-w-[1720px] mx-auto">
          <FareCalculator
            selectedFleetId={passedVehicle}
            selectedDestId={passedDest}
            initialPickup={passedPickup}
            initialDate={passedDate}
          />
        </div>
      </section>

      {/* 3. Help & Questions Callout Strip */}
      <section className="pb-16 px-3 sm:px-6 lg:px-10 xl:px-14 w-full">
        <div className="w-full max-w-[1720px] mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-9 border border-[#EAA722]/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h4 className="font-serif text-2xl sm:text-3xl text-[#541508] font-normal">
                Need a Custom Route or Group Package?
              </h4>
              <p className="text-sm sm:text-base text-[#5C5350] mt-1.5 font-light">
                Our Almora concierge assists with custom circuits, Chardham Yatras, and group vans.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href={`tel:${conciergePhone}`}
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider font-bold border border-[#541508]/25 text-[#541508] hover:bg-[#FAF0E6] transition-all flex items-center gap-2"
              >
                <PhoneIcon className="w-4 h-4 text-[#EAA722]" />
                <span>Call Desk</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const msg = encodeURIComponent(
                    `Hello! I need a custom quote for a mountain cab trip / temple yatra.`
                  );
                  window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
                }}
                className="px-6 py-3 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider font-bold bg-[#EAA722] hover:bg-[#D98E16] text-[#541508] shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#541508]" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FareCalculatorPage;
