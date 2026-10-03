import React from 'react';
import { APP_URLS, SITE_CONFIG, PhoneIcon, MailIcon, WhatsAppIcon, MapPinIcon, CarIcon, MountainIcon, BedIcon } from '@shared';
import Logo from '@shared/components/Logo';

const TravelFooter = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `*॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥*\n` +
      `Hello Almora Cab Desk! I need assistance with a private cab booking / Kathgodam station pickup.`
    );
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-[#FAF6EF] text-[#2C2523] border-t border-[#C5A059]/30 font-sans">
      {/* 1. TOP CONCIERGE CALLOUT STRIP */}
      <div className="bg-[#FDFBF7] border-b border-[#C5A059]/20 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left max-w-2xl">
            <span className="text-[11px] uppercase tracking-wider text-[#C84B0F] font-bold block mb-2">
              ॥ 🪔 24/7 Almora Mountain Cab Desk 🪔 ॥
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#2C2523] font-medium tracking-tight leading-snug">
              Need a trusted hill cab or station pickup?
            </h3>
            <p className="text-sm sm:text-base text-[#5C5350] mt-2 font-normal leading-relaxed">
              Our Almora fleet base is ready 24/7 for Kathgodam Railway pickups, early morning Kainchi Dham aarti departures, and scenic hill station tours.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="px-6 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FAF6EF] shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-[#C5A059]/30"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#C5A059]" />
              <span>WhatsApp Cab Desk</span>
            </button>

            <a
              href={`tel:${SITE_CONFIG.conciergePhone}`}
              className="px-6 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold border border-[#C5A059]/50 bg-[#FAF6EF] hover:bg-[#FFF5EC] text-[#2C2523] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <PhoneIcon className="w-4 h-4 text-[#7C1D23]" />
              <span className="font-numeral font-bold">{SITE_CONFIG.conciergePhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand & Fleet Hub */}
          <div className="lg:col-span-4 space-y-4">
            <a href="/" className="flex items-center gap-3 group inline-flex">
              <Logo size={42} />
              <div className="flex flex-col">
                <span className="font-cinzel text-base sm:text-lg font-bold text-[#2C2523] tracking-tight group-hover:text-[#7C1D23] transition-colors">
                  The Kasar Mountain Cabs
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#C84B0F] font-semibold font-cinzel">
                  Chauffeured Mountain Fleet • Almora Base
                </span>
              </div>
            </a>

            <p className="text-sm text-[#5C5350] leading-relaxed font-normal">
              Reliable, clean mountain cabs with experienced Pahadi drivers. Dedicated temple yatra transfers for Kainchi Dham, Jageshwar, Kasar Devi, and scenic Uttarakhand hill stations.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDFBF7] border border-[#C5A059]/35 text-xs text-[#2C2523] font-semibold shadow-xs">
                <CarIcon className="w-3.5 h-3.5 text-[#C84B0F]" />
                <span>Pahadi Hill Drivers</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDFBF7] border border-[#C5A059]/35 text-xs text-[#2C2523] font-semibold shadow-xs">
                <MountainIcon className="w-3.5 h-3.5 text-[#C84B0F]" />
                <span>Fixed Upfront Fares</span>
              </span>
            </div>

            <div className="pt-2 text-xs text-[#7C1D23] font-serif italic font-semibold">
              ॥ प्रेम, सेवा और पावन यात्रा का संकल्प ॥
            </div>
          </div>

          {/* Col 2: Our Mountain Cabs */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#7C1D23] border-b border-[#C5A059]/30 pb-2">
              Our Mountain Fleet
            </h4>
            <ul className="space-y-2 text-sm text-[#5C5350]">
              <li>
                <a href="#cabs" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>4-Seater Mountain Sedan (Dzire)</span>
                </a>
              </li>
              <li>
                <a href="#cabs" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>6-Seater SUV (Innova Crysta)</span>
                </a>
              </li>
              <li>
                <a href="#cabs" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>12-Seater Luxury Minibus (Urbania)</span>
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>Fare Calculator & Rates</span>
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>Safety & Winter Hill Driving</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Temple Tours */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#7C1D23] border-b border-[#C5A059]/30 pb-2">
              Temple Circuits
            </h4>
            <ul className="space-y-2 text-sm text-[#5C5350]">
              <li>
                <a href="#circuits" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>Kainchi Dham Darshan (45 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>Jageshwar Dham (35 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>Kasar Devi Ridge (8 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>Nainital Lake Tour (63 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="hover:text-[#C84B0F] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C5A059]">›</span>
                  <span>Kathgodam Station Pickup</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Hub & Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#7C1D23] border-b border-[#C5A059]/30 pb-2">
              Fleet Hub & Help
            </h4>
            <div className="space-y-2.5 text-sm text-[#5C5350]">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0 mt-0.5" />
                <span>Station Base Hub, Almora / Kasar Devi, Uttarakhand 263601</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0" />
                <a href={`tel:${SITE_CONFIG.conciergePhone}`} className="text-[#2C2523] font-bold font-numeral">
                  {SITE_CONFIG.conciergePhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0" />
                <a href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`} className="text-[#2C2523] hover:underline">
                  {SITE_CONFIG.whatsappDisplay}
                </a>
              </div>
              <div className="pt-2 border-t border-[#C5A059]/20">
                <a
                  href={APP_URLS.hotel}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#7C1D23] hover:underline flex items-center gap-1.5"
                >
                  <BedIcon className="w-3.5 h-3.5" />
                  <span>The Kasar Himalayan Heights (Hotel) ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-[#C5A059]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B615E]">
          <p>
            &copy; {currentYear} The Kasar Mountain Cabs & Expeditions. All rights reserved.
          </p>

          <p className="font-serif italic text-[#7C1D23] text-center text-xs font-semibold">
            ॥ ॐ श्री नीब करौरी महाराजाय नमः ॥
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <a href="#faq" className="hover:text-[#7C1D23] transition-colors">
              Cab FAQs
            </a>
            <span>•</span>
            <a href={APP_URLS.landing} className="hover:text-[#7C1D23] transition-colors">
              Dev Bhoomi Guide
            </a>
            <span>•</span>
            <a href={APP_URLS.admin} className="hover:text-[#7C1D23] transition-colors">
              Driver Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TravelFooter;
