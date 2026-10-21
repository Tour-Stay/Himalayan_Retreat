import { APP_URLS, SITE_CONFIG } from '../constants/siteConfig';
import { useSiteSettings } from '../context/SiteSettingsContext';
import Logo from '../components/Logo';
import {
  PhoneIcon,
  MailIcon,
  WhatsAppIcon,
  MapPinIcon,
  MountainIcon,
  BedIcon,
  CarIcon,
  SparklesIcon,
} from '../components/Icons';

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();
  let company = SITE_CONFIG;

  try {
    const { settings } = useSiteSettings();
    if (settings?.company) {
      company = { ...SITE_CONFIG, ...settings.company };
    }
  } catch (e) {
    // If not wrapped in SiteSettingsProvider, gracefully use SITE_CONFIG
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hello Concierge! I am planning a visit to Kasar Devi / Kainchi Dham and would like to inquire about suite availability and mountain cab bookings.`
    );
    window.open(`https://wa.me/${company.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-[#081E1A] text-white border-t border-[#051713] font-sans">
      {/* 1. TOP CONCIERGE CALLOUT STRIP */}
      <div className="bg-[#061814] border-b border-[#EAA722]/20 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left max-w-2xl space-y-2">
            <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl text-white font-semibold leading-snug">
              Where the Himalayas Meet Stillness
            </h3>
            <p className="text-base sm:text-lg text-[#FAF5EC]/90 font-normal leading-[1.8]">
              Perched on the ancient pine crest of Crank&apos;s Ridge. Our Almora Concierge desk is at your service 24/7 to reserve heated chalets, arrange Kathgodam railhead pickups, and guide your journey across Kumaon.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="btn-nkb-gold px-7 py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center gap-2.5 cursor-pointer shadow-lg hover:shadow-xl"
              title="Chat with Concierge Desk on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#12433B]" />
              <span>WhatsApp Concierge</span>
            </button>

            <a
              href={`tel:${company.conciergePhone}`}
              className="btn-outline-gold px-7 py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center gap-2.5 cursor-pointer shadow-md"
              title="Call Almora Desk"
            >
              <PhoneIcon className="w-4 h-4 text-[#EAA722]" />
              <span className="font-sans font-bold tracking-wider">{company.conciergePhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN EDITORIAL FOOTER GRID */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Col 1: Brand & Philosophy (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <a href={APP_URLS.landing} className="flex items-center gap-3 group inline-flex">
              <Logo size={50} />
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-[#EAA722] transition-colors leading-tight">
                  The Kasar Himalayan Heights
                </span>
                <span className="text-xs tracking-[0.18em] uppercase text-[#EAA722] font-bold font-serif mt-0.5">
                  Kasar Devi, Almora • 6,942 FT
                </span>
              </div>
            </a>

            <p className="text-base sm:text-lg text-[#FAF5EC]/90 leading-[1.8] font-normal">
              An authentic high-altitude boutique retreat and chauffeured mountain travel service nestled along the quiet pine ridges of Crank’s Ridge in Kumaon, Uttarakhand.
            </p>

            {/* Feature Pills with Subtle Hover Lift */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#061814] border border-[#EAA722]/40 text-xs sm:text-sm font-serif text-[#FAF5EC] hover:border-[#EAA722] transition-all shadow-xs cursor-default">
                <MountainIcon className="w-4 h-4 text-[#EAA722]" />
                <span className="font-semibold tracking-wide">6,942 FT Altitude</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#061814] border border-[#EAA722]/40 text-xs sm:text-sm font-serif text-[#FAF5EC] hover:border-[#EAA722] transition-all shadow-xs cursor-default">
                <SparklesIcon className="w-4 h-4 text-[#EAA722]" />
                <span className="font-semibold tracking-wide">180° Snow Peaks</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#061814] border border-[#EAA722]/40 text-xs sm:text-sm font-serif text-[#FAF5EC] hover:border-[#EAA722] transition-all shadow-xs cursor-default">
                <BedIcon className="w-4 h-4 text-[#EAA722]" />
                <span className="font-semibold tracking-wide">Heated Chalets</span>
              </span>
            </div>

            <div className="text-xs sm:text-sm text-[#EAA722] tracking-wider uppercase font-medium">
              Peace, Hospitality &amp; Quiet Solitude
            </div>
          </div>

          {/* Col 2: Resort & Rooms (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm sm:text-base font-bold uppercase tracking-widest text-[#EAA722] border-b border-[#EAA722]/30 pb-2">
              Resort &amp; Stay
            </h4>
            <ul className="space-y-3 text-sm sm:text-base font-normal text-[#FAF5EC]/85">
              <li>
                <a
                  href={`${APP_URLS.hotel}/rooms`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:translate-x-1.5 transition-all flex items-start gap-2 group"
                >
                  <span className="text-[#EAA722] text-xs font-bold flex-shrink-0 mt-1">›</span>
                  <span className="leading-snug group-hover:text-[#EAA722] transition-colors">Heated Chalet Suites</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.hotel}/rooms`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:translate-x-1.5 transition-all flex items-start gap-2 group"
                >
                  <span className="text-[#EAA722] text-xs font-bold flex-shrink-0 mt-1">›</span>
                  <span className="leading-snug group-hover:text-[#EAA722] transition-colors">Nanda Devi Suite</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.hotel}/#dining`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:translate-x-1.5 transition-all flex items-start gap-2 group"
                >
                  <span className="text-[#EAA722] text-xs font-bold flex-shrink-0 mt-1">›</span>
                  <span className="leading-snug group-hover:text-[#EAA722] transition-colors">Satvik Mountain Dining</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.hotel}/book`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#EAA722] hover:text-white hover:translate-x-1.5 transition-all flex items-start gap-2 group font-semibold"
                >
                  <span className="text-[#EAA722] text-xs font-bold flex-shrink-0 mt-1">›</span>
                  <span className="leading-snug underline-offset-4 group-hover:underline">Check Availability ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Mountain Cabs & Tours (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm sm:text-base font-bold uppercase tracking-widest text-[#EAA722] border-b border-[#EAA722]/30 pb-2">
              Cabs &amp; Tours
            </h4>
            <ul className="space-y-3 text-sm sm:text-base font-normal text-[#FAF5EC]/85">
              <li>
                <a
                  href={`${APP_URLS.travel}#circuits`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:translate-x-1.5 transition-all flex items-start gap-2 group"
                >
                  <span className="text-[#EAA722] text-xs font-bold flex-shrink-0 mt-1">›</span>
                  <span className="leading-snug group-hover:text-[#EAA722] transition-colors">Kainchi Dham Tour (45 km)</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.travel}#circuits`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:translate-x-1.5 transition-all flex items-start gap-2 group"
                >
                  <span className="text-[#EAA722] text-xs font-bold flex-shrink-0 mt-1">›</span>
                  <span className="leading-snug group-hover:text-[#EAA722] transition-colors">Jageshwar Dham (35 km)</span>
                </a>
              </li>
              <li>
                <a
                  href={APP_URLS.travel}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white hover:translate-x-1.5 transition-all flex items-start gap-2 group"
                >
                  <span className="text-[#EAA722] text-xs font-bold flex-shrink-0 mt-1">›</span>
                  <span className="leading-snug group-hover:text-[#EAA722] transition-colors">Kathgodam Station Pickup</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.travel}#circuits`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#EAA722] hover:text-white hover:translate-x-1.5 transition-all flex items-start gap-2 group font-semibold"
                >
                  <span className="text-[#EAA722] text-xs font-bold flex-shrink-0 mt-1">›</span>
                  <span className="leading-snug underline-offset-4 group-hover:underline">Mountain Cab Circuits ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Direct Contact (Span 3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-serif text-sm sm:text-base font-bold uppercase tracking-widest text-[#EAA722] border-b border-[#EAA722]/30 pb-2">
              Concierge &amp; Location
            </h4>

            {/* Address */}
            <div className="flex items-start gap-2.5 text-sm sm:text-base text-[#FAF5EC]/90 font-normal leading-relaxed">
              <MapPinIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0 mt-1" />
              <span className="leading-snug">
                {company.hotelAddress || "Crank's Ridge, Kasar Devi, Almora, Uttarakhand 263601"}
              </span>
            </div>

            {/* Compact Map Preview Card */}
            <a
              href={company.mapsUrl || "https://maps.google.com/?q=The+Kasar+Himalayan+Heights,+Kasar+Devi,+Almora,+Uttarakhand"}
              target="_blank"
              rel="noreferrer"
              className="group relative block w-full h-28 rounded-xl overflow-hidden border border-[#EAA722]/35 hover:border-[#EAA722] shadow-md transition-all duration-300 cursor-pointer bg-[#3D0F06]"
              title="Click to open location in Google Maps"
            >
              <iframe
                title="The Kasar Himalayan Heights Location Map"
                src="https://maps.google.com/maps?q=The+Kasar+Himalayan+Heights+Kasar+Devi+Almora&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 pointer-events-none filter contrast-105 opacity-85 group-hover:opacity-100 group-hover:scale-106 transition-all duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end justify-between p-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-serif font-semibold text-[#FAF5EC] bg-[#541508]/90 group-hover:bg-[#EAA722] group-hover:text-[#541508] px-2.5 py-1 rounded-md border border-[#EAA722]/40 transition-colors">
                  <MapPinIcon className="w-3.5 h-3.5 text-[#EAA722] group-hover:text-[#541508]" />
                  <span>Open in Google Maps ↗</span>
                </span>
                <span className="text-xs font-sans font-medium text-[#FAF5EC]/80">
                  Kasar Devi
                </span>
              </div>
            </a>

            {/* Direct Contact Row */}
            <div className="pt-2 border-t border-[#EAA722]/20 flex flex-wrap items-center gap-3.5 text-sm sm:text-base">
              <a
                href={`tel:${company.conciergePhone}`}
                className="inline-flex items-center gap-1.5 text-white hover:text-[#EAA722] font-sans font-bold transition-colors"
                title="Call Almora Concierge"
              >
                <PhoneIcon className="w-4 h-4 text-[#EAA722]" />
                <span>{company.conciergePhone}</span>
              </a>

              <span className="text-[#EAA722]/40">•</span>

              <a
                href={`https://wa.me/${company.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#FAF5EC]/90 hover:text-white transition-colors"
                title="WhatsApp Concierge"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 text-[#EAA722] pt-1">
              <span className="text-xs uppercase font-serif tracking-wider text-[#FAF5EC]/70 font-semibold">Social:</span>
              <a
                href={company.socials?.facebook || 'https://www.facebook.com/61555816868523/'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white hover:scale-115 transition-all p-1 text-[#EAA722]"
                title="Facebook: The Kasar Himalayan Heights"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href={company.socials?.instagram || 'https://www.instagram.com/the_kasar_himalyan_heights/?hl=en'}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white hover:scale-115 transition-all p-1 text-[#EAA722]"
                title="Instagram: @the_kasar_himalyan_heights"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

          </div>

        </div>

        {/* 3. REVERENT HIMALAYAN PEAKS STRIP */}
        <div className="mt-10 pt-5 border-t border-[#EAA722]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm lg:text-[15px] text-[#FAF5EC]/85 font-normal text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-[#EAA722] font-serif font-semibold tracking-wider uppercase text-xs sm:text-sm">
              Peaks Viewed from Kasar:
            </span>
            <span className="text-white">
              Trishul (7,120m) • Nanda Devi (7,816m) • Panchachuli • Chaukhamba
            </span>
          </div>
          <div className="text-[#EAA722] font-serif font-bold tracking-widest uppercase text-xs sm:text-sm flex-shrink-0">
            Dev Bhoomi Uttarakhand
          </div>
        </div>

        {/* 4. BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="mt-5 pt-5 border-t border-[#EAA722]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#FAF5EC]/75 font-normal text-center sm:text-left">
          <p>
            &copy; {currentYear} The Kasar Himalayan Heights. All rights reserved.
          </p>

          <p className="text-[#EAA722] text-xs sm:text-sm tracking-wider uppercase font-medium">
            Kasar Devi &bull; Almora &bull; 6,942 FT
          </p>

          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-sans">
            <a href="#faq" className="hover:text-white transition-colors">
              Visitor FAQs
            </a>
            <span className="text-[#EAA722]/40">•</span>
            <a href="#enquiry" className="hover:text-white transition-colors">
              Concierge Desk
            </a>
            <span className="text-[#EAA722]/40">•</span>
            <a
              href={APP_URLS.admin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Staff Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
