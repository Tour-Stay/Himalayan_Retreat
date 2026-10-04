import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_URLS, SITE_CONFIG, PhoneIcon, ArrowUpRightIcon, CarIcon, BedIcon, useSiteSettings } from '@shared';
import Logo from '@shared/components/Logo';

const navLinks = [
  { label: 'Our Cabs', href: '/cabs' },
  { label: 'Holy Shrines', href: '/#circuits' },
  { label: 'Fare Calculator', href: '/calculator' },
  { label: 'Why Us', href: '/#safety' },
  { label: 'Reviews', href: '/#reviews' },
];

const TravelNavbar = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const company = settings?.company;
  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const elevation = company?.elevation || '6,942 Ft';

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
      {/* 1. TOP DEVOTIONAL UTILITY STRIP (Sacred Maroon #541508) */}
      <div
        className={`bg-[#541508] border-b border-[#3D0F06] px-4 text-xs text-[#FAF5EC] transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 py-0 opacity-0 pointer-events-none border-b-0' : 'max-h-11 py-2 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm whitespace-nowrap">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#EAA722] text-xs">🪔</span>
            <span className="font-devanagari text-[#EAA722] font-semibold">॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-white/90">Kasar Devi ({elevation})</span>
          </div>

          <div className="flex items-center gap-3.5 flex-shrink-0">
            <a
              href={`tel:${conciergePhone}`}
              className="hover:text-[#EAA722] font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap text-white/95"
            >
              <PhoneIcon className="w-3.5 h-3.5 text-[#EAA722]" />
              <span>Call Yatra Desk: <strong className="text-white font-numeral">{conciergePhone}</strong></span>
            </a>
            <span className="text-white/30">|</span>
            <a
              href={APP_URLS.landing}
              className="text-[#EAA722] hover:underline font-semibold whitespace-nowrap"
            >
              Dev Bhoomi Guide &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN DEVOTIONAL TEAL NAVIGATION BAR (Gold Trim & Clean Links) */}
      <div
        className={`w-full transition-all duration-300 bg-[#12433B] text-white border-b border-[#EAA722]/30 shadow-lg ${
          isScrolled ? 'py-2.5 backdrop-blur-md' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0 whitespace-nowrap">
            <Logo size={42} />
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-[#EAA722] transition-colors leading-tight whitespace-nowrap">
                The Kasar Himalayan Heights
              </span>
              <span className="text-xs tracking-wider uppercase text-[#EAA722] font-semibold font-mono whitespace-nowrap">
                पावन तीर्थ यात्रा • Almora Fleet • 6,942 FT
              </span>
            </div>
          </Link>

          {/* Clean Desktop Menu Links (1 line always) */}
          <nav className="nav-desktop-menu items-center gap-1.5 sm:gap-2.5 lg:gap-3.5 flex-nowrap whitespace-nowrap flex-shrink-0">
            {navLinks.map((link, idx) => {
              const isActive = (link.href === '/cabs' && location.pathname === '/cabs') ||
                               (link.href === '/calculator' && (location.pathname === '/calculator' || location.pathname === '/fare-calculator'));
              return (
                <a
                  key={idx}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-[19px] sm:text-[20px] lg:text-[21px] font-serif font-medium transition-all whitespace-nowrap flex-shrink-0 tracking-wide ${
                    isActive
                      ? 'bg-white/15 text-[#EAA722] shadow-xs'
                      : 'text-[#FAF5EC] hover:text-[#EAA722] hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons - Book Cab Primary (Gold), View Hotel Secondary (Glass) */}
          <div className="nav-actions-desktop items-center gap-2 lg:gap-2.5 flex-nowrap whitespace-nowrap flex-shrink-0">
            <Link
              to="/calculator"
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#EAA722] hover:bg-[#D98E16] text-[#541508] transition-all shadow-md flex items-center gap-1.5 hover:scale-102 whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <CarIcon className="w-4 h-4 flex-shrink-0 text-[#541508]" />
              <span className="whitespace-nowrap">Book Cab</span>
            </Link>

            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider border border-[#EAA722]/40 bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <BedIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0" />
              <span className="whitespace-nowrap">View Hotel</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="nav-mobile-btn items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#EAA722]/30 bg-white/10 text-white hover:text-[#EAA722] transition-colors cursor-pointer"
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
        <div className="nav-mobile-panel bg-[#541508] border-b border-[#3D0F06] px-6 py-5 space-y-3.5 shadow-xl text-white">
          <div className="space-y-1.5 pb-3 border-b border-white/15">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[20px] font-serif font-medium text-white hover:text-[#EAA722] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/cabs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-[#EAA722] hover:underline"
            >
              View All Cabs &amp; Rates &rarr;
            </Link>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 rounded-full text-center text-xs uppercase tracking-wider font-bold bg-[#EAA722] text-[#541508] flex items-center justify-center gap-1.5 shadow-md"
              >
                <CarIcon className="w-4 h-4 text-[#541508]" />
                <span>Book Cab</span>
              </Link>

              <a
                href={APP_URLS.hotel}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 rounded-full text-center text-xs uppercase tracking-wider font-semibold border border-white/20 bg-white/10 text-white flex items-center justify-center gap-1.5"
              >
                <BedIcon className="w-4 h-4 text-[#EAA722]" />
                <span>View Hotel</span>
              </a>
            </div>
            <a
              href={`tel:${conciergePhone}`}
              className="text-center text-xs text-white/80 font-semibold py-1 block"
            >
              Call Cab Desk: <span className="text-white font-numeral">{conciergePhone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default TravelNavbar;
