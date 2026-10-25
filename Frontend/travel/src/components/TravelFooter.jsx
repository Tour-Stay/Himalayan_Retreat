import React from 'react';
import { APP_URLS, SITE_CONFIG, PhoneIcon, MailIcon, WhatsAppIcon, MapPinIcon, CarIcon, MountainIcon, BedIcon, SparklesIcon, useSiteSettings } from '@shared';

const TravelFooter = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const company = settings?.company;

  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;
  const travelAddress = company?.travelHubAddress || "Station Base Hub, Almora / Kasar Devi, Uttarakhand 263601";
  const elevation = company?.elevation || '6,942 FT';

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hello Almora Cab Desk! I need assistance with a private mountain cab booking / Kathgodam station pickup.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-[#073125] text-white/85 font-sans border-t border-white/10 pt-14 pb-20 md:pb-12 selection:bg-[#C9F24D] selection:text-[#073125]">
      {/* MAIN TRAVEL FOOTER GRID */}
      <div className="w-[min(1240px,calc(100%-36px))] mx-auto pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Col 1: Brand & Heritage (Span 4) */}
          <div className="lg:col-span-4 space-y-3.5">
            <a href="/" className="inline-flex items-center gap-3 text-inherit no-underline group">
              <img
                src="/logo.svg"
                alt="The Kasar Himalayan Expeditions"
                className="h-12 sm:h-14 w-auto object-contain filter drop-shadow brightness-110 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col leading-tight">
                <strong className="font-serif text-[1.25rem] font-medium text-white tracking-wide">
                  The Kasar
                </strong>
                <span className="text-[#C9F24D] text-[0.62rem] tracking-[0.2em] uppercase font-sans font-semibold">
                  Himalayan Expeditions · Satya’s
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              Trusted, comfortable mountain cabs with respectful local Pahadi drivers. Dedicated pilgrimage transfers to Kainchi Dham, Jageshwar Dham, and on-time Kathgodam train station meet &amp; greet pickups.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#052219] border border-white/15 text-[11px] text-white/90">
                <CarIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span className="font-medium">Local Pahadi Drivers</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#052219] border border-white/15 text-[11px] text-white/90">
                <MountainIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span className="font-medium">100% Fixed Upfront Fares</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#052219] border border-white/15 text-[11px] text-white/90">
                <SparklesIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span className="font-medium">Kathgodam Station Pickup</span>
              </span>
            </div>
          </div>

          {/* Col 2: Our Mountain Cabs (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[#C9F24D] text-[0.68rem] tracking-[0.18em] uppercase font-bold font-sans border-b border-white/10 pb-2">
              Our Mountain Fleet
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#cabs" className="text-white/80 hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>4-Seater Mountain Sedan (Dzire)</span>
                </a>
              </li>
              <li>
                <a href="#cabs" className="text-white/80 hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>6-Seater SUV (Innova Crysta)</span>
                </a>
              </li>
              <li>
                <a href="#cabs" className="text-white/80 hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>12-Seater Luxury Minibus (Urbania)</span>
                </a>
              </li>
              <li>
                <a href="/calculator" className="text-white/80 hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Fare Calculator &amp; Honest Rates</span>
                </a>
              </li>
              <li className="pt-2 border-t border-white/10">
                <a href="/cabs" className="text-[#C9F24D] hover:underline font-semibold text-xs inline-flex items-center gap-1">
                  <span>Explore All Cabs &rarr;</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Sacred Pilgrimage Circuits (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-[#C9F24D] text-[0.68rem] tracking-[0.18em] uppercase font-bold font-sans border-b border-white/10 pb-2">
              Holy Circuits
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#circuits" className="text-white/80 hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Kainchi Dham (45 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="text-white/80 hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Jageshwar Dham (35 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="text-white/80 hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Kasar Devi Ridge (8 km)</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="text-white/80 hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Kathgodam Pickup</span>
                </a>
              </li>
              <li>
                <a href="#circuits" className="text-white/80 hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Kausani Peaks (52 km)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Fleet Hub & Location with Google Maps (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[#C9F24D] text-[0.68rem] tracking-[0.18em] uppercase font-bold font-sans border-b border-white/10 pb-2">
              Cab Desk &amp; Location
            </h4>

            {/* Address */}
            <div className="flex items-start gap-2 text-xs sm:text-sm text-white/80 font-light">
              <MapPinIcon className="w-4 h-4 text-[#C9F24D] flex-shrink-0 mt-0.5" />
              <span className="leading-snug">
                {travelAddress}
              </span>
            </div>

            {/* Compact Google Map Preview Card */}
            <a
              href="https://maps.google.com/?q=The+Kasar+Himalayan+Heights,+Kasar+Devi,+Almora,+Uttarakhand"
              target="_blank"
              rel="noreferrer"
              className="group relative block w-full h-24 rounded-xl overflow-hidden border border-white/20 hover:border-[#C9F24D] shadow-sm transition-all duration-300 cursor-pointer bg-[#052219]"
              title="Click to open location in Google Maps"
            >
              <iframe
                title="The Kasar Himalayan Heights Location Map"
                src="https://maps.google.com/maps?q=The+Kasar+Himalayan+Heights+Kasar+Devi+Almora&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 pointer-events-none filter contrast-105 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-white bg-[#073125]/90 group-hover:bg-[#C9F24D] group-hover:text-[#073125] px-2 py-0.5 rounded border border-white/20 transition-colors">
                  <MapPinIcon className="w-3 h-3 text-[#C9F24D] group-hover:text-[#073125]" />
                  <span>Open in Google Maps ↗</span>
                </span>
                <span className="text-[10px] text-white/70">
                  Almora Base
                </span>
              </div>
            </a>

            {/* Direct Contact Row */}
            <div className="pt-1 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <a
                href={`tel:${conciergePhone}`}
                className="inline-flex items-center gap-1.5 text-white hover:text-[#C9F24D] font-sans font-bold transition-colors"
                title="Call Almora Cab Desk"
              >
                <PhoneIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span>{conciergePhone}</span>
              </a>

              <span className="text-white/30">•</span>

              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#C9F24D] transition-colors cursor-pointer"
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
                className="text-xs font-semibold text-[#C9F24D] hover:underline flex items-center gap-1.5 font-sans"
              >
                <BedIcon className="w-3.5 h-3.5" />
                <span>The Kasar Himalayan Heights (Hotel Suites) ↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>
            &copy; {currentYear} The Kasar Himalayan Heights &amp; Expeditions. All rights reserved.
          </p>

          <p className="font-serif text-[#C9F24D] text-center text-xs font-medium">
            Chauffeured Mountain Expeditions • Kasar Devi, Almora
          </p>

          <div className="flex items-center gap-4 text-[11px] font-sans">
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
