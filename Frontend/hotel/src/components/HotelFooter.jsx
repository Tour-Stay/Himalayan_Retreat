import { APP_URLS, SITE_CONFIG, PhoneIcon, MailIcon, WhatsAppIcon, MapPinIcon, MountainIcon, BedIcon, SparklesIcon, FlameIcon, CoffeeIcon, CompassIcon, useSiteSettings } from '@shared';
import Logo from '@shared/components/Logo';

const HotelFooter = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const company = settings?.company;

  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;
  const email = company?.email || SITE_CONFIG.email;
  const hotelAddress = company?.hotelAddress || "Crank's Ridge, Kasar Devi, Almora, Uttarakhand 263601";
  const elevation = company?.elevation || '6,942 FT';

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hello! I would like to inquire about booking a room at The Kasar Himalayan Heights, Kasar Devi.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <footer className="bg-[#073125] text-white border-t border-[#0C2B22] font-sans selection:bg-[#C9F24D]/30 selection:text-white">
      {/* MAIN HOTEL FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Col 1: Hotel Brand & Heritage (Span 4) */}
          <div className="lg:col-span-4 space-y-3.5">
            <a href="/" className="flex items-center gap-3 group inline-flex">
              <Logo size={40} />
              <div className="flex flex-col">
                <span className="font-cinzel text-base font-bold text-white tracking-tight group-hover:text-[#C9F24D] transition-colors">
                  The Kasar Himalayan Heights
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9F24D] font-semibold font-cinzel">
                  Boutique Heated Chalets • 6,942 FT
                </span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-[#D4DDD2] leading-relaxed font-light">
              A peaceful boutique retreat located on the ridge of Kasar Devi, Almora. Built with natural mountain stone and pine wood, featuring warm heated rooms and private balconies framing 180° views of the sacred Himalayas.
            </p>

            {/* Quiet Luxury Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2B21] border border-white/15 text-[11px] font-cinzel text-white">
                <MountainIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span className="font-semibold">6,942 FT Height</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2B21] border border-white/15 text-[11px] font-cinzel text-white">
                <BedIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span className="font-semibold">Bed Warmers</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2B21] border border-white/15 text-[11px] font-cinzel text-white">
                <SparklesIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span className="font-semibold">Snow Peak Views</span>
              </span>
            </div>

            <div className="pt-1 text-xs text-[#C9F24D] font-serif italic">
              ॥ शान्तिः शान्तिः शान्तिः • Solitude &amp; Peace at Kasar Devi ॥
            </div>
          </div>

          {/* Col 2: The Heated Suites (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#C9F24D] border-b border-white/15 pb-2">
              Chalet Suites
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#D4DDD2]">
              <li>
                <a href="/rooms" className="hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Nanda Devi Snow View Suite</span>
                </a>
              </li>
              <li>
                <a href="/rooms" className="hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Cedar Family Chalet</span>
                </a>
              </li>
              <li>
                <a href="/rooms" className="hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Crank&apos;s Ridge Attic Glass Suite</span>
                </a>
              </li>
              <li>
                <a href="/rooms" className="hover:text-[#C9F24D] transition-colors flex items-center gap-2 group">
                  <span className="text-[#C9F24D] text-xs transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Trishul Crest Luxury Terrace Suite</span>
                </a>
              </li>
              <li className="pt-2 border-t border-white/10 flex items-center gap-3">
                <a href="/rooms" className="text-[#C9F24D] hover:underline font-semibold font-cinzel text-xs inline-flex items-center gap-1">
                  <span>All Rooms &amp; Rates &rarr;</span>
                </a>
                <a href="/book" className="text-white hover:text-[#C9F24D] font-semibold font-cinzel text-xs inline-flex items-center gap-1 ml-auto">
                  <span>Book Now ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Things to Experience (Span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#C9F24D] border-b border-white/15 pb-2">
              Experiences
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#D4DDD2]">
              <li>
                <a href="/#experiences" className="hover:text-white transition-colors block">
                  Sunrise Snow Peaks
                </a>
              </li>
              <li>
                <a href="/#dining" className="hover:text-white transition-colors block">
                  Satvik Kumaoni Dining
                </a>
              </li>
              <li>
                <a href="/#trails" className="hover:text-white transition-colors block">
                  Kasar Devi Temple Walk
                </a>
              </li>
              <li>
                <a href="/#amenities" className="hover:text-white transition-colors block">
                  Evening Bonfire &amp; Chai
                </a>
              </li>
              <li>
                <a href="/#experiences" className="hover:text-white transition-colors block">
                  Dark Sky Stargazing
                </a>
              </li>
              <li className="pt-1.5 border-t border-white/10">
                <a
                  href={APP_URLS.travel}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#C9F24D] hover:underline font-semibold text-xs inline-flex items-center gap-1"
                >
                  <span>Pilgrimage Cabs ↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Desk (Span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#C9F24D] border-b border-white/15 pb-2">
              Concierge &amp; Location
            </h4>

            <div className="space-y-2.5 text-xs sm:text-sm text-[#D4DDD2]">
              <div className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 text-[#C9F24D] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs uppercase font-cinzel text-white block font-semibold">Resort Location</span>
                  <span>{hotelAddress}</span>
                  <span className="text-[11px] text-[#C9F24D] block font-numeral mt-0.5">Near Kasar Devi Temple • {elevation}</span>
                </div>
              </div>

              {/* Compact Map Preview Card */}
              <a
                href={company?.mapsUrl || "https://maps.google.com/?q=The+Kasar+Himalayan+Heights,+Kasar+Devi,+Almora,+Uttarakhand"}
                target="_blank"
                rel="noreferrer"
                className="group relative block w-full h-28 rounded-2xl overflow-hidden border border-white/20 hover:border-[#C9F24D] shadow-md transition-all duration-300 cursor-pointer bg-[#05261D]"
                title="Click to open location in Google Maps"
              >
                <iframe
                  title="The Kasar Himalayan Heights Location Map"
                  src="https://maps.google.com/maps?q=The+Kasar+Himalayan+Heights+Kasar+Devi+Almora&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 pointer-events-none filter contrast-105 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end justify-between p-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white bg-[#073125]/90 group-hover:bg-[#C9F24D] group-hover:text-[#073125] px-2.5 py-1 rounded-full border border-white/20 transition-colors shadow-xs">
                    <MapPinIcon className="w-3.5 h-3.5 text-[#C9F24D] group-hover:text-[#073125]" />
                    <span>Open in Google Maps ↗</span>
                  </span>
                  <span className="text-[11px] font-mono text-white/80">
                    Kasar Devi
                  </span>
                </div>
              </a>

              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 text-[#C9F24D] flex-shrink-0" />
                  <a
                    href={`tel:${conciergePhone}`}
                    className="text-white hover:text-[#C9F24D] font-numeral font-bold tracking-wide transition-colors"
                  >
                    {conciergePhone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <MailIcon className="w-3.5 h-3.5 text-[#C9F24D] flex-shrink-0" />
                  <a
                    href={`mailto:${email}`}
                    className="text-[#D4DDD2] hover:text-white text-xs transition-colors break-all"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. VENERATED HIMALAYAN PEAKS STRIP */}
        <div className="mt-8 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-[#D4DDD2]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#C9F24D] font-cinzel font-semibold tracking-wider uppercase text-[11px]">
              Sacred Snow Peaks Visible:
            </span>
            <span className="text-white">
              Trishul (7,120m) • Nanda Devi (7,816m) • Maiktoli • Chaukhamba • Panchachuli Range
            </span>
          </div>
          <span className="text-[#C9F24D] font-cinzel font-bold tracking-widest uppercase text-[10px]">
            Dev Bhoomi Uttarakhand
          </span>
        </div>

        {/* 4. BOTTOM COPYRIGHT & SISTER SITES */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#D4DDD2]/80">
          <p>
            &copy; {currentYear} The Kasar Himalayan Heights. All rights reserved.
          </p>

          <p className="font-serif italic text-[#C9F24D] text-center text-xs font-semibold">
            ॥ प्रेम, सेवा और शांति का हिमालयी धाम ॥
          </p>

          <div className="flex items-center gap-3 text-[11px] font-sans">
            <a href={APP_URLS.landing} className="text-[#C9F24D] hover:underline font-semibold">
              Dev Bhoomi Guide &rarr;
            </a>
            <span className="text-white/20">•</span>
            <a href="/rooms" className="hover:text-white">
              All Rooms
            </a>
            <span className="text-white/20">•</span>
            <a href="/book" className="hover:text-white">
              Book Stay
            </a>
            <span className="text-white/20">•</span>
            <a href={APP_URLS.travel} target="_blank" rel="noreferrer" className="hover:text-white">
              Cabs Portal ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HotelFooter;
