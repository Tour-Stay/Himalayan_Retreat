import { useState, useEffect } from 'react';
import { APP_URLS, SITE_CONFIG, PhoneIcon, ArrowUpRightIcon, CarIcon } from '@shared';
import Logo from '@shared/components/Logo';

const navLinks = [
  { label: 'Rooms', href: '/#rooms' },
  { label: 'Dining', href: '/#dining' },
  { label: 'Facilities', href: '/#amenities' },
  { label: 'Temples', href: '/#trails' },
  { label: 'Our Story', href: '/#philosophy' },
];

const HotelNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full font-sans transition-all duration-300">
      {/* 1. TOP SIMPLE UTILITY STRIP */}
      <div
        className={`bg-[#FAF6EF] border-b border-[#C5A059]/20 px-4 text-xs text-[#5C5350] transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 py-0 opacity-0 pointer-events-none border-b-0' : 'max-h-10 py-1.5 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] whitespace-nowrap">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
            <span className="font-semibold text-[#2C2523]">Kasar Devi, Almora</span>
            <span className="text-[#C5A059]">•</span>
            <span>6,942 Ft Height</span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href={`tel:${SITE_CONFIG.conciergePhone}`}
              className="hover:text-[#7C1D23] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
            >
              <PhoneIcon className="w-3 h-3 text-[#7C1D23]" />
              <span>Call: <strong className="text-[#2C2523] font-numeral">{SITE_CONFIG.conciergePhone}</strong></span>
            </a>
            <span className="text-[#C5A059]/40">|</span>
            <a
              href={APP_URLS.landing}
              className="text-[#7C1D23] hover:underline font-semibold whitespace-nowrap"
            >
              Dev Bhoomi Guide &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN CLEAN NAVIGATION BAR */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-md border-b border-[#C5A059]/30 py-2.5'
            : 'bg-[#FDFBF7] border-b border-[#C5A059]/20 py-3 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <a href="/" className="flex items-center gap-2.5 group flex-shrink-0 whitespace-nowrap">
            <Logo size={36} />
            <div className="flex flex-col">
              <span className="font-cinzel text-sm sm:text-base font-bold text-[#2C2523] group-hover:text-[#7C1D23] transition-colors leading-tight whitespace-nowrap">
                The Kasar Himalayan Heights
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#C5A059] font-medium font-cinzel whitespace-nowrap">
                Kasar Devi • 6,942 FT
              </span>
            </div>
          </a>

          {/* Simple Clean Desktop Menu Links (1 line always) */}
          <nav className="nav-desktop-menu items-center gap-1 sm:gap-2 lg:gap-3 flex-nowrap whitespace-nowrap flex-shrink-0">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-cinzel font-semibold uppercase tracking-wider text-[#2C2523] hover:text-[#7C1D23] hover:bg-[#FAF6EF] transition-all whitespace-nowrap flex-shrink-0"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons (1 line always) */}
          <div className="nav-actions-desktop items-center gap-2 lg:gap-2.5 flex-nowrap whitespace-nowrap flex-shrink-0">
            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full text-xs font-cinzel font-semibold uppercase tracking-wider border border-[#C5A059]/60 bg-[#FAF6EF] text-[#2C2523] hover:text-[#7C1D23] hover:border-[#7C1D23] transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <CarIcon className="w-3.5 h-3.5 text-[#7C1D23] flex-shrink-0" />
              <span className="whitespace-nowrap">Book Cab</span>
            </a>

            <a
              href="/#book"
              className="px-4 py-1.5 rounded-full text-xs font-cinzel font-semibold uppercase tracking-wider bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition-all shadow-md border border-[#C5A059]/40 flex items-center gap-1 hover:scale-102 whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <span className="whitespace-nowrap">Book Room</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="nav-mobile-btn items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#C5A059]/30 bg-[#FAF6EF] text-[#2C2523] hover:text-[#7C1D23] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3. SIMPLE MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="nav-mobile-panel bg-[#FDFBF7] border-b border-[#C5A059]/30 px-6 py-5 space-y-3 shadow-xl">
          <div className="space-y-1 pb-3 border-b border-[#C5A059]/20">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-[#2C2523] hover:text-[#7C1D23] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <a
                href={APP_URLS.travel}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-full text-center text-xs uppercase tracking-wider font-bold border border-[#C5A059]/50 bg-[#FAF6EF] text-[#2C2523] flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CarIcon className="w-3.5 h-3.5 text-[#7C1D23]" />
                <span>Book Cab</span>
              </a>

              <a
                href="/#book"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-full text-center text-xs uppercase tracking-wider font-bold bg-[#7C1D23] text-[#FDFBF7] shadow-md flex items-center justify-center gap-1"
              >
                <span>Book Room ↗</span>
              </a>
            </div>

            <a
              href={`tel:${SITE_CONFIG.conciergePhone}`}
              className="text-center text-xs text-[#5C5350] font-semibold py-1 block"
            >
              Call Us: <span className="text-[#2C2523] font-numeral">{SITE_CONFIG.conciergePhone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default HotelNavbar;
