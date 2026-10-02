import { APP_URLS, SITE_CONFIG } from '../constants/siteConfig';
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

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hello Concierge! I am planning a visit to Kasar Devi / Kainchi Dham and would like to inquire about suite availability and mountain cab bookings.`
    );
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-gradient-to-b from-[#FAF6EF] via-[#F5EFE6] to-[#EFE7DA] text-[#2C2523] border-t-2 border-[#C5A059]/40 font-sans selection:bg-[#C5A059]/30 selection:text-[#7C1D23]">
      {/* 1. TOP CONCIERGE CALLOUT STRIP (Warm Ivory with Gold Border) */}
      <div className="bg-[#FDFBF7] border-b border-[#C5A059]/25 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <span className="text-xs uppercase tracking-[0.2em] text-[#7C1D23] font-cinzel font-semibold block mb-1">
              Personalized Mountain Hospitality • 24/7 Desk
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2523] font-medium tracking-tight">
              Planning your visit to Kainchi Dham or Kasar Devi?
            </h3>
            <p className="text-sm text-[#5C5350] mt-1 max-w-2xl font-normal">
              Our Almora concierge team is at your service to reserve heated chalets, arrange Kathgodam pickups, and plan custom temple tours.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 flex-shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="px-5 py-3 rounded-full text-xs uppercase tracking-wider font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-[#FFFFFF] shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-102"
              title="Chat with Concierge on WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>WhatsApp Concierge</span>
            </button>

            <a
              href={`tel:${SITE_CONFIG.conciergePhone}`}
              className="px-5 py-3 rounded-full text-xs uppercase tracking-wider font-semibold border border-[#7C1D23]/40 bg-[#FAF6EF] hover:bg-[#7C1D23] text-[#2C2523] hover:text-[#FDFBF7] transition-all flex items-center gap-2 cursor-pointer hover:scale-102 shadow-xs"
              title="Call Almora Desk"
            >
              <PhoneIcon className="w-4 h-4 text-[#7C1D23]" />
              <span className="font-numeral font-bold tracking-wide">{SITE_CONFIG.conciergePhone}</span>
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
                  <span>Crank&apos;s Ridge, Kasar Devi, Almora, Uttarakhand 263601</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CarIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0 mt-1" />
                <div>
                  <span className="text-xs uppercase font-cinzel text-[#2C2523] block font-semibold">Travel Fleet Hub</span>
                  <span>Almora Station Base Hub, Uttarakhand</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#C5A059]/25 space-y-2">
                <div className="flex items-center gap-2.5">
                  <PhoneIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0" />
                  <a
                    href={`tel:${SITE_CONFIG.conciergePhone}`}
                    className="text-[#2C2523] hover:text-[#7C1D23] font-numeral font-bold tracking-wide transition-colors"
                  >
                    {SITE_CONFIG.conciergePhone}
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2C2523] hover:text-[#7C1D23] transition-colors"
                  >
                    WhatsApp: <span className="font-numeral font-bold text-[#2C2523]">{SITE_CONFIG.whatsappDisplay}</span>
                  </a>
                </div>

                <div className="flex items-center gap-2.5">
                  <MailIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0" />
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-[#5C5350] hover:text-[#7C1D23] text-xs transition-colors break-all"
                  >
                    {SITE_CONFIG.email}
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
