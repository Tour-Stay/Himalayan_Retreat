import { APP_URLS, SITE_CONFIG, PhoneIcon, MailIcon, WhatsAppIcon, MapPinIcon, MountainIcon, BedIcon, SparklesIcon, FlameIcon, CoffeeIcon, CompassIcon } from '@shared';
import Logo from '@shared/components/Logo';

const HotelFooter = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Pranam Concierge! I am inquiring about heated suite reservations at The Kasar Himalayan Heights, Kasar Devi.`
    );
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-[#FAF6EF] text-[#2C2523] border-t border-[#C5A059]/30 font-sans selection:bg-[#C5A059]/30 selection:text-[#7C1D23]">
      {/* 1. TOP SANCTUARY CALLOUT STRIP */}
      <div className="bg-[#FDFBF7] border-b border-[#C5A059]/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left max-w-2xl">
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#C5A059] font-cinzel font-semibold block mb-1.5">
              Warm Heated Rooms • Kasar Devi, Almora • 6,942 FT
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2523] font-medium tracking-tight">
              A Peaceful Mountain Stay with Sacred Snow Peak Views
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5350] mt-1.5 font-normal leading-relaxed">
              Facing the eternal snow peaks of Mount Trishul and Nanda Devi. All room bookings include free hot breakfast, fast Wi-Fi, room heaters, and 24-hour hot water.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FAF6EF] shadow-md transition-all flex items-center gap-2 cursor-pointer border border-[#C5A059]/40 hover:scale-102"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#C5A059]" />
              <span>Chat on WhatsApp</span>
            </button>

            <a
              href={`tel:${SITE_CONFIG.conciergePhone}`}
              className="px-5 py-3 rounded-full text-xs uppercase tracking-widest font-semibold border border-[#C5A059]/50 bg-[#FAF6EF] hover:bg-[#C5A059]/15 text-[#2C2523] transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <PhoneIcon className="w-4 h-4 text-[#7C1D23]" />
              <span className="font-numeral font-bold tracking-wider">{SITE_CONFIG.conciergePhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HOTEL FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Col 1: Hotel Brand & Heritage (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <a href="/" className="flex items-center gap-3 group inline-flex">
              <Logo size={40} />
              <div className="flex flex-col">
                <span className="font-cinzel text-base font-bold text-[#2C2523] tracking-tight group-hover:text-[#7C1D23] transition-colors">
                  The Kasar Himalayan Heights
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A059] font-semibold font-cinzel">
                  Boutique Heated Chalets • 6,942 FT
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-[#5C5350] leading-relaxed font-normal">
              A peaceful boutique hotel located on the ridge of Kasar Devi, Almora. Built with natural mountain stone and pine wood, featuring warm heated rooms and private balconies framing 180° views of the sacred Himalayas.
            </p>

            {/* Quiet Luxury & Devotional Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EF] border border-[#C5A059]/35 text-[11px] font-cinzel text-[#2C2523]">
                <MountainIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-semibold">6,942 FT Height</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EF] border border-[#C5A059]/35 text-[11px] font-cinzel text-[#2C2523]">
                <BedIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-semibold">Warm Bed Warmers</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EF] border border-[#C5A059]/35 text-[11px] font-cinzel text-[#2C2523]">
                <SparklesIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-semibold">Snow Peak Views</span>
              </span>
            </div>

            <div className="pt-1 text-xs text-[#7C1D23] font-serif italic">
              ॥ शान्तिः शान्तिः शान्तिः • Peaceful Stay at Kasar Devi ॥
            </div>
          </div>

          {/* Col 2: The Heated Suites (Span 3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#7C1D23] border-b border-[#C5A059]/30 pb-2">
              Our Rooms &amp; Suites
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C5350]">
              <li>
                <a href="/rooms" className="hover:text-[#7C1D23] transition-colors flex items-center justify-between group">
                  <span>Nanda Devi Snow View Suite</span>
                  <span className="font-numeral text-[#C5A059] font-semibold text-xs">₹8,500</span>
                </a>
              </li>
              <li>
                <a href="/rooms" className="hover:text-[#7C1D23] transition-colors flex items-center justify-between group">
                  <span>Cedar Family Chalet</span>
                  <span className="font-numeral text-[#C5A059] font-semibold text-xs">₹12,500</span>
                </a>
              </li>
              <li>
                <a href="/rooms" className="hover:text-[#7C1D23] transition-colors flex items-center justify-between group">
                  <span>Crank&apos;s Ridge Attic Suite</span>
                  <span className="font-numeral text-[#C5A059] font-semibold text-xs">₹7,200</span>
                </a>
              </li>
              <li>
                <a href="/rooms" className="hover:text-[#7C1D23] transition-colors flex items-center justify-between group">
                  <span>Trishul Crest Luxury Suite</span>
                  <span className="font-numeral text-[#C5A059] font-semibold text-xs">₹14,500</span>
                </a>
              </li>
              <li className="pt-1.5 border-t border-[#C5A059]/15">
                <a href="/rooms" className="text-[#7C1D23] hover:underline font-semibold font-cinzel text-xs inline-flex items-center gap-1">
                  <span>View All Rooms &amp; Rates</span>
                  <span>&rarr;</span>
                </a>
              </li>
            </ul>

            {/* Stay Timings & Quietude */}
            <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#C5A059]/25 text-[11px] space-y-1 text-[#6B615E]">
              <div className="flex justify-between">
                <span>Check-in: <strong className="text-[#2C2523] font-numeral">2:00 PM</strong></span>
                <span>Check-out: <strong className="text-[#2C2523] font-numeral">11:00 AM</strong></span>
              </div>
              <div className="text-[10px] text-[#7C1D23] font-medium pt-0.5">
                Quiet Hours: 10:00 PM – 6:00 AM for peaceful sleep
              </div>
            </div>
          </div>

          {/* Col 3: Things to Experience (Span 2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#7C1D23] border-b border-[#C5A059]/30 pb-2">
              Things to Experience
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#5C5350]">
              <li>
                <a href="/#experiences" className="hover:text-[#7C1D23] transition-colors block">
                  Golden Sunrise Views
                </a>
              </li>
              <li>
                <a href="/#dining" className="hover:text-[#7C1D23] transition-colors block">
                  Pure Veg Dining
                </a>
              </li>
              <li>
                <a href="/#trails" className="hover:text-[#7C1D23] transition-colors block">
                  Kasar Devi Temple Walk
                </a>
              </li>
              <li>
                <a href="/#amenities" className="hover:text-[#7C1D23] transition-colors block">
                  Evening Bonfire &amp; Tea
                </a>
              </li>
              <li>
                <a href="/#experiences" className="hover:text-[#7C1D23] transition-colors block">
                  Stargazing at Night
                </a>
              </li>
              <li className="pt-1.5 border-t border-[#C5A059]/15">
                <a
                  href={APP_URLS.travel}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#6B615E] hover:text-[#7C1D23] font-semibold text-xs inline-flex items-center gap-1"
                >
                  <span>Taxi &amp; Pickups ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Desk (Span 3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#7C1D23] border-b border-[#C5A059]/30 pb-2">
              Hotel Address &amp; Contact
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#5C5350]">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-[#7C1D23] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs uppercase font-cinzel text-[#2C2523] block font-semibold">Hotel Location</span>
                  <span>Crank&apos;s Ridge, Kasar Devi, Almora, Uttarakhand 263601</span>
                  <span className="text-[10px] text-[#C5A059] block font-numeral mt-0.5">Near Kasar Devi Temple • 6,942 FT</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#C5A059]/20 space-y-2">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 text-[#7C1D23] flex-shrink-0" />
                  <a
                    href={`tel:${SITE_CONFIG.conciergePhone}`}
                    className="text-[#2C2523] hover:text-[#7C1D23] font-numeral font-bold tracking-wide transition-colors"
                  >
                    {SITE_CONFIG.conciergePhone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <MailIcon className="w-3.5 h-3.5 text-[#7C1D23] flex-shrink-0" />
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

        {/* 3. VENERATED HIMALAYAN PEAKS STRIP */}
        <div className="mt-10 pt-5 border-t border-[#C5A059]/25 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C5350]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#7C1D23] font-cinzel font-semibold tracking-wider uppercase text-[11px]">
              Snow Peaks Visible from Our Hotel:
            </span>
            <span className="text-[#2C2523]">
              Mount Trishul (7,120m) • Nanda Devi (7,816m) • Maiktoli • Mrigthuni • Panchachuli Range
            </span>
          </div>
          <span className="text-[#C5A059] font-cinzel font-bold tracking-widest uppercase text-[10px]">
            Kasar Devi, Almora
          </span>
        </div>

        {/* 4. BOTTOM COPYRIGHT & SISTER SITES */}
        <div className="mt-5 pt-5 border-t border-[#C5A059]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B615E]">
          <p>
            &copy; {currentYear} The Kasar Himalayan Heights. All rights reserved.
          </p>

          <p className="font-serif italic text-[#7C1D23] text-center text-xs font-semibold">
            ॥ सर्वं खल्विदं ब्रह्म ॥
          </p>

          <div className="flex items-center gap-3 text-[11px] font-sans">
            <a href={APP_URLS.landing} className="text-[#7C1D23] hover:underline font-semibold">
              Dev Bhoomi Guide &rarr;
            </a>
            <span className="text-[#C5A059]/40">•</span>
            <a href={APP_URLS.travel} target="_blank" rel="noreferrer" className="text-[#6B615E] hover:text-[#7C1D23]">
              Mountain Cabs ↗
            </a>
            <span className="text-[#C5A059]/40">•</span>
            <a href={APP_URLS.admin} target="_blank" rel="noreferrer" className="text-[#6B615E] hover:text-[#7C1D23]">
              Staff Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HotelFooter;
