import React from 'react';
import { APP_URLS, SITE_CONFIG, PhoneIcon, MailIcon, WhatsAppIcon, MapPinIcon, CarIcon, MountainIcon, BedIcon, SparklesIcon, useSiteSettings } from '@shared';
import Logo from '@shared/components/Logo';

const TravelFooter = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const company = settings?.company;

  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;
  const whatsappDisplay = company?.whatsappDisplay || SITE_CONFIG.whatsappDisplay;
  const travelAddress = company?.travelHubAddress || "Station Base Hub, Almora / Kasar Devi, Uttarakhand 263601";
  const elevation = company?.elevation || '6,942 FT';

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `*॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥*\n` +
      `Hello Almora Cab Desk! I need assistance with a private mountain cab booking / Kathgodam station pickup.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-[#541508] text-white border-t-2 border-[#EAA722]/40 font-sans selection:bg-[#EAA722]/30 selection:text-white">
      {/* MAIN TRAVEL FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Col 1: Brand & Heritage (Span 4) */}
          <div className="lg:col-span-4 space-y-3.5">
            <a href="/" className="flex items-center gap-3 group inline-flex">
              <Logo size={42} />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-white tracking-tight group-hover:text-[#EAA722] transition-colors leading-tight">
                  The Kasar Himalayan Heights
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#EAA722] font-semibold font-mono">
                  पावन तीर्थ यात्रा • Almora Fleet • 6,942 FT
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-[#FAF5EC]/85 leading-relaxed font-light">
              Trusted, comfortable mountain cabs with respectful local Pahadi drivers. Dedicated pilgrimage transfers to Kainchi Dham, Jageshwar Dham, and on-time Kathgodam train station meet &amp; greet pickups.
            </p>

            {/* Quiet Luxury Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D0F06] border border-[#EAA722]/30 text-[11px] text-[#FAF5EC]">
                <CarIcon className="w-3.5 h-3.5 text-[#EAA722]" />
                <span className="font-semibold">Local Pahadi Drivers</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D0F06] border border-[#EAA722]/30 text-[11px] text-[#FAF5EC]">
                <MountainIcon className="w-3.5 h-3.5 text-[#EAA722]" />
                <span className="font-semibold">100% Fixed Upfront Fares</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3D0F06] border border-[#EAA722]/30 text-[11px] text-[#FAF5EC]">
                <SparklesIcon className="w-3.5 h-3.5 text-[#EAA722]" />
                <span className="font-semibold">Kathgodam On-Time Pickup</span>
              </span>
            </div>

            <div className="pt-1 text-xs text-[#EAA722] font-serif italic">
              ॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥
            </div>
          </div>

          {/* Col 2: Our Mountain Cabs (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#EAA722] border-b border-[#EAA722]/25 pb-2">
              Our Mountain Fleet
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FAF5EC]/85">
              <li>
                <a href="#cabs" className="hover:text-[#EAA722] transition-colors flex items-center gap-2 group">
                  <span className="text-[#EAA722] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>4-Seater Mountain Sedan (Dzire)</span>
                </a>
              </li>
              <li>
                <a href="#cabs" className="hover:text-[#EAA722] transition-colors flex items-center gap-2 group">
                  <span className="text-[#EAA722] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>6-Seater SUV (Innova Crysta)</span>
                </a>
              </li>
              <li>
                <a href="#cabs" className="hover:text-[#EAA722] transition-colors flex items-center gap-2 group">
                  <span className="text-[#EAA722] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>12-Seater Luxury Minibus (Urbania)</span>
                </a>
              </li>
              <li>
                <a href="/calculator" className="hover:text-[#EAA722] transition-colors flex items-center gap-2 group">
                  <span className="text-[#EAA722] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Fare Calculator &amp; Honest Rates</span>
                </a>
              </li>
              <li className="pt-2 border-t border-[#EAA722]/20 flex items-center gap-3">
                <a href="/cabs" className="text-[#EAA722] hover:underline font-semibold font-mono text-xs inline-flex items-center gap-1">
                  <span>Explore All Cabs &rarr;</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Sacred Pilgrimage Circuits (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#EAA722] border-b border-[#EAA722]/25 pb-2">
              Holy Circuits
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FAF5EC]/85">
              <li>
                <a href="#circuits" className="hover:text-[#EAA722] transition-colors flex items-center gap-2 group">
                  <span className="text-[#EAA722] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Kainchi Dham (45 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="hover:text-[#EAA722] transition-colors flex items-center gap-2 group">
                  <span className="text-[#EAA722] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Jageshwar Dham (35 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="hover:text-[#EAA722] transition-colors flex items-center gap-2 group">
                  <span className="text-[#EAA722] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Kasar Devi Ridge (8 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="hover:text-[#EAA722] transition-colors flex items-center gap-2 group">
                  <span className="text-[#EAA722] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Kathgodam Pickup</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="hover:text-[#EAA722] transition-colors flex items-center gap-2 group">
                  <span className="text-[#EAA722] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Kausani Peaks (52 km)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Fleet Hub & Location with Google Maps (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#EAA722] border-b border-[#EAA722]/25 pb-2">
              Cab Desk &amp; Location
            </h4>

            {/* Address */}
            <div className="flex items-start gap-2 text-xs sm:text-sm text-[#FAF5EC]/85 font-light">
              <MapPinIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0 mt-0.5" />
              <span className="leading-snug">
                {travelAddress}
              </span>
            </div>

            {/* Compact Google Map Preview Card */}
            <a
              href="https://maps.google.com/?q=The+Kasar+Himalayan+Heights,+Kasar+Devi,+Almora,+Uttarakhand"
              target="_blank"
              rel="noreferrer"
              className="group relative block w-full h-24 rounded-xl overflow-hidden border border-[#EAA722]/30 hover:border-[#EAA722] shadow-sm transition-all duration-300 cursor-pointer bg-[#3D0F06]"
              title="Click to open location in Google Maps"
            >
              <iframe
                title="The Kasar Himalayan Heights Location Map"
                src="https://maps.google.com/maps?q=The+Kasar+Himalayan+Heights+Kasar+Devi+Almora&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 pointer-events-none filter contrast-105 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-white bg-[#541508]/90 group-hover:bg-[#EAA722] group-hover:text-[#541508] px-2 py-0.5 rounded border border-[#EAA722]/40 transition-colors">
                  <MapPinIcon className="w-3 h-3 text-[#EAA722] group-hover:text-[#541508]" />
                  <span>Open in Google Maps ↗</span>
                </span>
                <span className="text-[10px] font-mono text-[#FAF5EC]/70">
                  Almora Base
                </span>
              </div>
            </a>

            {/* Direct Contact Row */}
            <div className="pt-1 border-t border-[#EAA722]/20 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <a
                href={`tel:${conciergePhone}`}
                className="inline-flex items-center gap-1.5 text-white hover:text-[#EAA722] font-mono font-bold transition-colors"
                title="Call Almora Cab Desk"
              >
                <PhoneIcon className="w-3.5 h-3.5 text-[#EAA722]" />
                <span>{conciergePhone}</span>
              </a>

              <span className="text-white/30">•</span>

              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-1.5 text-[#FAF5EC]/85 hover:text-white transition-colors cursor-pointer"
                title="WhatsApp Cab Desk"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Direct Link to Hotel Retreat */}
            <div className="pt-1">
              <a
                href={APP_URLS.hotel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#EAA722] hover:underline flex items-center gap-1.5 font-mono"
              >
                <BedIcon className="w-3.5 h-3.5" />
                <span>The Kasar Himalayan Heights (Hotel Suites) ↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t border-[#3D0F06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF5EC]/75">
          <p>
            &copy; {currentYear} The Kasar Himalayan Heights &amp; Expeditions. All rights reserved.
          </p>

          <p className="font-serif italic text-[#EAA722] text-center text-xs font-semibold">
            ॥ ॐ श्री नीब करौरी महाराजाय नमः • सुरक्षित यात्रा ॥
          </p>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <a href="#faq" className="hover:text-white transition-colors">
              Cab FAQs
            </a>
            <span>•</span>
            <a href={APP_URLS.landing} className="hover:text-white transition-colors">
              Dev Bhoomi Guide
            </a>
            <span>•</span>
            <a href={APP_URLS.admin} className="hover:text-white transition-colors">
              Driver Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TravelFooter;
