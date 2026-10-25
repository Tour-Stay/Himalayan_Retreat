import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APP_URLS, SITE_CONFIG, useSiteSettings } from '@shared';

const navLinks = [
  { label: 'Our Cabs', href: '/cabs' },
  { label: 'Holy Shrines', href: '/#circuits' },
  { label: 'Fare Calculator', href: '/calculator' },
  { label: 'Why Us', href: '/#safety' },
  { label: 'Reviews', href: '/#reviews' },
];

const TravelNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const company = settings?.company;
  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e, href) => {
    if (mobileMenuOpen) setMobileMenuOpen(false);

    if (href.startsWith('/#')) {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      if (location.pathname !== '/') {
        navigate('/' + '#' + targetId);
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full font-sans site-header">
      {/* 1. TOPLINE BANNER — Matches Hotel Topline */}
      <div className="topline">
        Chauffeured Himalayan Fleet · Kasar Devi &amp; Almora · Kainchi Dham Yatra
      </div>

      {/* 2. MAIN HEADER NAVBAR — Matches Hotel Deep Teal #073125 Style */}
      <div className="w-full bg-[#073125] text-white border-b border-white/10 shadow-md">
        <div className="w-[min(1240px,calc(100%-36px))] min-h-[76px] sm:min-h-[82px] mx-auto flex items-center justify-between gap-6 py-2">
          {/* Brand Logo & Name */}
          <Link to="/" className="inline-flex items-center gap-3 text-inherit no-underline flex-shrink-0 group">
            <img
              src="/logo.svg"
              alt="The Kasar Himalayan Expeditions"
              className="h-12 sm:h-14 w-auto object-contain filter drop-shadow brightness-110 group-hover:scale-105 transition-transform"
            />
            <span className="flex flex-col leading-tight">
              <strong className="font-serif text-[1.22rem] sm:text-[1.32rem] font-medium text-white tracking-wide">
                The Kasar
              </strong>
              <span className="text-[#C9F24D] text-[0.62rem] tracking-[0.2em] uppercase font-sans font-semibold">
                Himalayan Expeditions · Satya’s
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isRoute = link.href.startsWith('/') && !link.href.startsWith('/#');
              const isActive = (link.href === '/cabs' && location.pathname === '/cabs') ||
                (link.href === '/calculator' && (location.pathname === '/calculator' || location.pathname === '/fare-calculator'));

              return isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-[0.78rem] font-semibold tracking-wider uppercase transition-colors no-underline ${
                    isActive ? 'text-[#C9F24D]' : 'text-white/85 hover:text-[#C9F24D]'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-white/85 hover:text-[#C9F24D] text-[0.78rem] font-semibold tracking-wider uppercase transition-colors no-underline"
                >
                  {link.label}
                </a>
              );
            })}

            {/* Book Cab Pill CTA */}
            <Link
              to="/calculator"
              className="px-5 py-2.5 rounded-full bg-[#C9F24D] text-[#073125] hover:bg-[#bde63d] font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 no-underline hover:scale-102 flex-shrink-0"
            >
              <span>Book Cab</span>
              <span aria-hidden="true">&nbsp;↗</span>
            </Link>

            {/* Hotel Stay Secondary Link */}
            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 no-underline flex-shrink-0"
            >
              <span>Hotel Stay</span>
              <span aria-hidden="true">&nbsp;↗</span>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center cursor-pointer active:scale-95"
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileMenuOpen}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE MENU DRAWER — Deep Forest Green matches Hotel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#052219] border-b border-white/15 px-6 py-5 space-y-3.5 text-white animate-fade-up">
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/10">
            {navLinks.map((link) => {
              const isRoute = link.href.startsWith('/') && !link.href.startsWith('/#');
              return isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-[0.88rem] font-medium text-white/90 hover:text-[#C9F24D] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="py-2 text-[0.88rem] font-medium text-white/90 hover:text-[#C9F24D] transition-colors"
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-[#C9F24D] text-[#073125] font-bold text-xs tracking-wider uppercase text-center block shadow-md"
            >
              Book Cab ↗
            </Link>

            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-full border border-white/20 bg-white/10 text-white font-semibold text-xs tracking-wider uppercase text-center block"
            >
              Hotel Stay ↗
            </a>

            {conciergePhone && (
              <a
                href={`tel:${conciergePhone}`}
                className="text-center text-xs text-white/80 font-medium pt-1 block"
              >
                Call Cab Desk: <span className="text-[#C9F24D] font-bold">{conciergePhone}</span>
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default TravelNavbar;
