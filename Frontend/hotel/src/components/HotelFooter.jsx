import { useSiteSettings, SITE_CONFIG } from '@shared';

const HotelFooter = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const company = settings?.company;
  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const email = company?.email || SITE_CONFIG.email;

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#073125] text-white/85 font-sans border-t border-white/10 pt-16 pb-24 md:pb-14">
      <div className="w-[min(1120px,calc(100%-36px))] mx-auto pb-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Brand info */}
        <div className="md:col-span-5 space-y-4">
          <a
            href="#top"
            onClick={(e) => scrollToSection(e, 'top')}
            className="inline-flex items-center gap-3 text-inherit no-underline group"
            aria-label="Return to top"
          >
            <img
              src="/logo.svg"
              alt="The Kasar Himalayan Heights"
              className="h-12 sm:h-14 w-auto object-contain filter drop-shadow brightness-110 group-hover:scale-105 transition-transform"
            />
            <span className="flex flex-col leading-tight">
              <strong className="font-serif text-[1.25rem] font-medium text-white tracking-wide">The Kasar</strong>
              <span className="text-[#C9F24D] text-[0.62rem] tracking-[0.2em] uppercase font-sans font-semibold">
                Himalayan Heights · Satya’s
              </span>
            </span>
          </a>
          <p className="max-w-[360px] text-white/70 text-sm leading-relaxed font-light font-sans">
            A mountain pause for peace, faith, and a little more room to breathe. Kasar Devi, Almora, Uttarakhand (6,942 FT).
          </p>
          <div className="pt-2 text-xs text-[#C9F24D] font-serif italic">
            ॥ शान्तिः शान्तिः शान्तिः • Solitude &amp; Peace at Crank’s Ridge ॥
          </div>
        </div>

        {/* Explore links */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-[#C9F24D] text-[0.68rem] tracking-[0.18em] uppercase font-bold font-sans">
            Explore
          </h3>
          <ul className="space-y-2 text-sm font-sans">
            <li>
              <a
                href="#story"
                onClick={(e) => scrollToSection(e, 'story')}
                className="text-white/80 hover:text-[#C9F24D] transition-colors"
              >
                Our spirit
              </a>
            </li>
            <li>
              <a
                href="#rooms"
                onClick={(e) => scrollToSection(e, 'rooms')}
                className="text-white/80 hover:text-[#C9F24D] transition-colors"
              >
                The rooms
              </a>
            </li>
            <li>
              <a
                href="#experiences"
                onClick={(e) => scrollToSection(e, 'experiences')}
                className="text-white/80 hover:text-[#C9F24D] transition-colors"
              >
                Pahadi moments
              </a>
            </li>
            <li>
              <a
                href="#gallery"
                onClick={(e) => scrollToSection(e, 'gallery')}
                className="text-white/80 hover:text-[#C9F24D] transition-colors"
              >
                Gallery
              </a>
            </li>
          </ul>
        </div>

        {/* Plan a stay */}
        <div className="md:col-span-4 space-y-3 font-sans">
          <h3 className="text-[#C9F24D] text-[0.68rem] tracking-[0.18em] uppercase font-bold">
            Plan a stay
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#booking"
                onClick={(e) => scrollToSection(e, 'booking')}
                className="text-white/80 hover:text-[#C9F24D] transition-colors"
              >
                Request an enquiry
              </a>
            </li>
            <li>
              <a
                href="#location"
                onClick={(e) => scrollToSection(e, 'location')}
                className="text-white/80 hover:text-[#C9F24D] transition-colors"
              >
                Google Map &amp; Directions
              </a>
            </li>
            {conciergePhone && (
              <li className="pt-1">
                <a
                  href={`tel:${conciergePhone}`}
                  className="text-white/80 hover:text-[#C9F24D] transition-colors text-xs"
                >
                  Phone: <span className="text-[#C9F24D] font-mono">{conciergePhone}</span>
                </a>
              </li>
            )}
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-white/80 hover:text-[#C9F24D] transition-colors text-xs"
                >
                  Email: <span className="text-white/90">{email}</span>
                </a>
              </li>
            )}
          </ul>
          <p className="text-[0.72rem] text-white/50 leading-relaxed pt-1">
            Crank&apos;s Ridge, Kasar Devi, Almora, Uttarakhand 263601
          </p>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="w-[min(1120px,calc(100%-36px))] mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[0.72rem] text-white/60 font-sans">
        <span>© {currentYear} The Kasar Himalayan Heights (Satya’s)</span>
        <span className="text-center sm:text-right text-white/50 max-w-[560px]">
          Luxury Boutique Mountain Chalet &amp; Heated Suites • Kasar Devi, Almora
        </span>
      </div>
    </footer>
  );
};

export default HotelFooter;
