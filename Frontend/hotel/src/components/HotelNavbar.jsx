import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_URLS, SITE_CONFIG, PhoneIcon, ArrowUpRightIcon, CarIcon, useSiteSettings } from '@shared';
import Logo from '@shared/components/Logo';

const navLinks = [
  { label: 'Rooms & Rates', href: '/rooms' },
  { label: 'Dining', href: '/#dining' },
  { label: 'Sights & Temples', href: '/#trails' },
  { label: 'Reviews', href: '/#reviews' },
];

const HotelNavbar = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const company = settings?.company;
  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const elevation = company?.elevation || '6,942 Ft';

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCheckout = location.pathname === '/book';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isCheckout) {
    return (
      <header className="sticky top-0 z-50 w-full font-sans transition-all duration-300">
        <div className="w-full transition-all duration-300 bg-[#073125] text-white py-3.5 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0 whitespace-nowrap">
              <Logo size={42} />
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight whitespace-nowrap">
                  The Kasar Himalayan Heights
                </span>
                <span className="text-xs tracking-wider uppercase text-[#C9F24D] font-semibold font-mono flex items-center gap-1.5 whitespace-nowrap">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" /></svg>
                  SECURE CHECKOUT
                </span>
              </div>
            </Link>
            <Link to="/rooms" className="px-4 py-2 rounded-full text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap flex-shrink-0 cursor-pointer">
              <span>&larr; Back</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full font-sans transition-all duration-300">
      {/* 1. TOP UTILITY STRIP (Dark Pine Green) */}
      <div
        className={`bg-[#05261D] border-b border-white/10 px-4 text-xs sm:text-sm text-white/90 transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 py-0 opacity-0 pointer-events-none border-b-0' : 'max-h-11 py-2 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C9F24D]"></span>
            <span className="font-semibold text-white">Kasar Devi, Almora</span>
            <span className="text-white/40">•</span>
            <span>{elevation} Height</span>
          </div>

          <div className="flex items-center gap-3.5 flex-shrink-0">
            <a
              href={`tel:${conciergePhone}`}
              className="hover:text-[#C9F24D] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap text-white/95"
            >
              <PhoneIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
              <span>Call: <strong className="text-white font-mono">{conciergePhone}</strong></span>
            </a>
            <span className="text-white/30">|</span>
            <a
              href={APP_URLS.landing}
              className="text-[#C9F24D] hover:underline font-semibold whitespace-nowrap"
            >
              Dev Bhoomi Guide &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN SOLID GREEN NAVBAR */}
      <div
        className={`w-full transition-all duration-300 bg-[#073125] text-white border-b border-white/10 shadow-lg ${
          isScrolled ? 'py-2.5 backdrop-blur-md' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0 whitespace-nowrap">
            <Logo size={42} />
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-[#C9F24D] transition-colors leading-tight whitespace-nowrap">
                The Kasar Himalayan Heights
              </span>
              <span className="text-xs tracking-wider uppercase text-[#C9F24D] font-semibold font-mono whitespace-nowrap">
                Kasar Devi • 6,942 FT
              </span>
            </div>
          </Link>

          {/* Simple Clean Desktop Menu Links (Prominent Serif Buttons) */}
          <nav className="nav-desktop-menu items-center gap-1.5 sm:gap-2.5 lg:gap-3.5 flex-nowrap whitespace-nowrap flex-shrink-0">
            {navLinks.map((link, idx) => {
              const isActive = link.href === '/rooms' && location.pathname === '/rooms';
              return (
                <a
                  key={idx}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-[19px] sm:text-[20px] lg:text-[21px] font-serif font-medium transition-all whitespace-nowrap flex-shrink-0 tracking-wide ${
                    isActive
                      ? 'bg-white/15 text-[#C9F24D] shadow-xs'
                      : 'text-white/95 hover:text-[#C9F24D] hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons - SWAPPED (Book Room first, Book Cab second) */}
          <div className="nav-actions-desktop items-center gap-2 lg:gap-2.5 flex-nowrap whitespace-nowrap flex-shrink-0">
            <Link
              to="/book"
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-mono font-bold uppercase tracking-wider bg-[#C9F24D] hover:bg-[#b8e23f] text-[#073125] transition-all shadow-md flex items-center gap-1.5 hover:scale-102 whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <span className="whitespace-nowrap">Book Room</span>
              <ArrowUpRightIcon className="w-4 h-4 flex-shrink-0" />
            </Link>

            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <CarIcon className="w-4 h-4 text-[#C9F24D] flex-shrink-0" />
              <span className="whitespace-nowrap">Book Cab</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="nav-mobile-btn items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-white/20 bg-white/10 text-white hover:text-[#C9F24D] transition-colors cursor-pointer"
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

      {/* 3. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="nav-mobile-panel bg-[#073125] border-b border-white/15 px-6 py-5 space-y-3.5 shadow-xl text-white">
          <div className="space-y-1.5 pb-3 border-b border-white/10">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[20px] font-serif font-medium text-white/95 hover:text-[#C9F24D] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {/* Swapped order in mobile drawer too */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-full text-center text-xs uppercase tracking-wider font-bold bg-[#C9F24D] text-[#073125] shadow-md flex items-center justify-center gap-1"
              >
                <span>Book Room ↗</span>
              </Link>

              <a
                href={APP_URLS.travel}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 rounded-full text-center text-xs uppercase tracking-wider font-bold border border-white/25 bg-white/10 text-white flex items-center justify-center gap-1.5 shadow-xs"
              >
                <CarIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span>Book Cab</span>
              </a>
            </div>

            <a
              href={`tel:${SITE_CONFIG.conciergePhone}`}
              className="text-center text-xs text-white/85 font-medium py-1 block"
            >
              Call Us: <span className="text-[#C9F24D] font-mono font-bold">{SITE_CONFIG.conciergePhone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default HotelNavbar;
