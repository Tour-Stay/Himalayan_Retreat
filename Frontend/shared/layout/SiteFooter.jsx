import { APP_URLS, SITE_CONFIG } from '../constants/siteConfig';
import { useSiteSettings } from '../context/SiteSettingsContext';
import Logo from '../components/Logo';
import {
  PhoneIcon,
  WhatsAppIcon,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Col 1: Brand & Philosophy (Span 6) */}
          <div className="lg:col-span-6 space-y-5">
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

            <p className="text-base sm:text-lg text-[#FAF5EC]/90 leading-[1.8] font-normal max-w-xl">
              An authentic high-altitude boutique retreat and chauffeured mountain travel service nestled along the quiet pine ridges of Crank’s Ridge in Kumaon, Uttarakhand.
            </p>

            <div className="text-xs sm:text-sm text-[#EAA722] tracking-wider uppercase font-medium pt-1">
              Peace, Hospitality &amp; Quiet Solitude
            </div>
          </div>

          {/* Col 2: Resort & Rooms (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
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
