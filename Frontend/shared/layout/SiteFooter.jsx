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
    <footer className="bg-[#FAF6EF] text-[#2C2523] border-t border-[#C5A059]/30 font-sans selection:bg-[#C5A059]/30 selection:text-[#7C1D23]">
      {/* 1. TOP CONCIERGE CALLOUT STRIP (Warm Ivory with Gold Border) */}
      <div className="bg-[#FDFBF7] border-b border-[#C5A059]/20 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-mono font-semibold block mb-2">
              Himalayan Reverence & Solitude • 6,942 FT Elevation
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl text-[#2C2523] font-medium tracking-tight leading-snug">
              Where silence is not emptiness, but presence.
            </h3>
            <p className="text-sm sm:text-base text-[#5C5350] mt-2 font-light leading-relaxed">
              Perched on the ancient pine crest of Crank&apos;s Ridge. Our Almora concierge is at your service 24/7 to reserve heated chalets, arrange Kathgodam railhead pickups, and guide your journey to Kainchi Dham &amp; Jageshwar.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FAF6EF] shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer border border-[#C5A059]/30 hover:scale-102"
              title="Chat with Concierge on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#C5A059]" />
              <span>WhatsApp Concierge</span>
            </button>

            <a
              href={`tel:${company.conciergePhone}`}
              className="px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold border border-[#C5A059]/50 bg-[#FAF6EF] hover:bg-[#C5A059]/15 text-[#2C2523] transition-all flex items-center gap-2.5 cursor-pointer shadow-xs"
              title="Call Almora Desk"
            >
              <PhoneIcon className="w-4 h-4 text-[#7C1D23]" />
              <span className="font-mono font-bold tracking-wider">{company.conciergePhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN EDITORIAL FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand & Philosophy (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <a href={APP_URLS.landing} className="flex items-center gap-3 group inline-flex">
              <Logo size={42} />
              <div className="flex flex-col">
                <span className="font-cinzel text-base sm:text-lg font-bold text-[#2C2523] tracking-tight group-hover:text-[#7C1D23] transition-colors">
                  The Kasar Himalayan Heights
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-[#C5A059] font-semibold font-cinzel">
                  Kasar Devi, Almora • 6,942 FT
                </span>
              </div>
            </a>

            <p className="text-sm text-[#5C5350] leading-relaxed font-normal">
              An authentic high-altitude boutique retreat and chauffeured mountain travel service nestled along the quiet pine ridges of Crank’s Ridge in Kumaon, Uttarakhand.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EF] border border-[#C5A059]/35 text-xs font-cinzel text-[#2C2523] shadow-xs">
                <MountainIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-semibold">6,942 FT Altitude</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EF] border border-[#C5A059]/35 text-xs font-cinzel text-[#2C2523] shadow-xs">
                <SparklesIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-semibold">180° Snow Peaks</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EF] border border-[#C5A059]/35 text-xs font-cinzel text-[#2C2523] shadow-xs">
                <BedIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-semibold">Heated Chalets</span>
              </span>
            </div>

            <div className="pt-2 text-xs text-[#7C1D23] font-serif italic font-medium">
              ॥ प्रेम, सेवा और शांति का हिमालयी धाम ॥
            </div>
          </div>

          {/* Col 2: Resort & Rooms (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#7C1D23] border-b border-[#C5A059]/30 pb-2">
              Resort & Stay
            </h4>
            <ul className="space-y-2.5 text-sm font-normal text-[#5C5350]">
              <li>
                <a
                  href={`${APP_URLS.hotel}/rooms`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Heated Chalet Suites</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.hotel}/rooms`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Nanda Devi Sunrise Suite</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.hotel}/rooms`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Cedar Alpine Family Chalet</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.hotel}/rooms`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Crank&apos;s Ridge Attic Glass Suite</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.hotel}#experiences`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Satvik Dining & Mountain Cafe</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.hotel}#book`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#7C1D23] hover:text-[#5C151A] hover:translate-x-1 transition-all inline-flex items-center gap-1.5 font-semibold"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Check Room Availability ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Mountain Cabs & Tours (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#7C1D23] border-b border-[#C5A059]/30 pb-2">
              Cabs & Tours
            </h4>
            <ul className="space-y-2.5 text-sm font-normal text-[#5C5350]">
              <li>
                <a
                  href={`${APP_URLS.travel}#circuits`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Kainchi Dham Tour (45 km)</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.travel}#circuits`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Jageshwar Dham (35 km)</span>
                </a>
              </li>
              <li>
                <a
                  href={APP_URLS.travel}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Kathgodam Station Pickup</span>
                </a>
              </li>
              <li>
                <a
                  href={APP_URLS.travel}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Toyota Innova Crysta Fleet</span>
                </a>
              </li>
              <li>
                <a
                  href={APP_URLS.travel}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#7C1D23] hover:translate-x-1 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Force Urbania Minibus (12S)</span>
                </a>
              </li>
              <li>
                <a
                  href={`${APP_URLS.travel}#calculator`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#7C1D23] hover:text-[#5C151A] hover:translate-x-1 transition-all inline-flex items-center gap-1.5 font-semibold"
                >
                  <span className="text-[#C5A059] text-xs font-bold">›</span>
                  <span>Trip Fare Calculator ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Direct Contact (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#7C1D23] border-b border-[#C5A059]/30 pb-2">
              Concierge & Desk
            </h4>

            <div className="space-y-3 text-sm text-[#5C5350] font-normal">
              <div className="flex items-start gap-2.5">
                <MapPinIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0 mt-1" />
                <div>
                  <span className="text-xs uppercase font-cinzel text-[#2C2523] block font-semibold">Resort Address</span>
                  <span>{company.hotelAddress || "Crank's Ridge, Kasar Devi, Almora, Uttarakhand 263601"}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CarIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0 mt-1" />
                <div>
                  <span className="text-xs uppercase font-cinzel text-[#2C2523] block font-semibold">Travel Fleet Hub</span>
                  <span>{company.travelHubAddress || "Almora Station Base Hub, Uttarakhand"}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#C5A059]/25 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <PhoneIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0" />
                  <a
                    href={`tel:${company.conciergePhone}`}
                    className="text-[#2C2523] hover:text-[#7C1D23] font-mono font-bold tracking-wide transition-colors"
                  >
                    {company.conciergePhone}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <WhatsAppIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0" />
                  <a
                    href={`https://wa.me/${company.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2C2523] hover:text-[#7C1D23] transition-colors"
                  >
                    WhatsApp: <span className="font-mono font-bold text-[#2C2523]">{company.whatsappDisplay || company.conciergePhone}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <MailIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0" />
                  <a
                    href={`mailto:${company.email}`}
                    className="text-[#5C5350] hover:text-[#7C1D23] text-xs transition-colors break-all"
                  >
                    {company.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. REVERENT HIMALAYAN PEAKS STRIP */}
        <div className="mt-12 pt-6 border-t border-[#C5A059]/30 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5C5350] font-normal">
          <div className="flex items-center gap-2">
            <span className="text-[#7C1D23] font-cinzel font-semibold tracking-wider uppercase text-[11px]">
              Venerated Peaks Viewed from Kasar:
            </span>
            <span className="text-[#2C2523]">
              Trishul (7,120m) • Nanda Devi (7,816m) • Panchachuli • Chaukhamba • Maiktoli
            </span>
          </div>
          <div className="text-[#C5A059] font-cinzel font-bold tracking-widest uppercase text-[10px]">
            Dev Bhoomi Uttarakhand
          </div>
        </div>

        {/* 4. BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="mt-6 pt-6 border-t border-[#C5A059]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B615E] font-normal">
          <p>
            &copy; {currentYear} The Kasar Himalayan Heights & Expeditions. All rights reserved.
          </p>

          <p className="font-serif italic text-[#7C1D23] text-center text-xs font-semibold">
            ॥ ॐ श्री नीब करौरी महाराजाय नमः ॥
          </p>

          <div className="flex items-center gap-4 text-[11px] font-sans">
            <a href="#faq" className="text-[#6B615E] hover:text-[#7C1D23] transition-colors">
              Visitor FAQs
            </a>
            <span className="text-[#C5A059]/40">•</span>
            <a href="#enquiry" className="text-[#6B615E] hover:text-[#7C1D23] transition-colors">
              Concierge Desk
            </a>
            <span className="text-[#C5A059]/40">•</span>
            <a
              href={APP_URLS.admin}
              target="_blank"
              rel="noreferrer"
              className="text-[#6B615E] hover:text-[#7C1D23] transition-colors"
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
