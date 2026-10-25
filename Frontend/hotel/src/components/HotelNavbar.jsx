import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Our spirit', href: '#spirit' },
  { label: 'The rooms', href: '#rooms' },
  { label: 'Pahadi moments', href: '#experiences' },
  { label: 'Find us', href: '#location' },
];

const HotelNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCheckout = location.pathname === '/book';

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (mobileMenuOpen) setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }

    const targetId = href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isCheckout) {
    return (
      <header className="sticky top-0 z-50 w-full font-sans transition-all duration-300">
        <div className="topline">A mountain pause · peace · faith · renewal</div>
        <div className="w-full bg-[#104c46] text-[#fffefa] py-3.5 px-4 sm:px-8 border-b border-white/15 shadow-md">
          <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-4">
            <Link to="/" className="inline-flex items-center gap-3 group text-inherit no-underline">
              <img
                src="/logo.svg"
                alt="The Kasar Himalayan Heights"
                className="h-11 w-auto object-contain filter drop-shadow brightness-110"
              />
              <div className="flex flex-col leading-tight">
                <strong className="font-serif text-lg font-medium text-white tracking-wide">The Kasar</strong>
                <span className="text-[#d6e3dc] text-[0.58rem] tracking-[0.17em] uppercase">Himalayan Heights · Satya’s</span>
              </div>
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-[2px] text-xs font-sans font-bold uppercase tracking-wider border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              &larr; Back to Stay
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full font-sans site-header">
      {/* 1. TOPLINE BANNER */}
      <div className="topline">
        A mountain pause · peace · faith · renewal
      </div>

      {/* 2. MAIN HEADER NAVBAR */}
      <div className="w-full bg-[#073125] text-white border-b border-white/10 shadow-md">
        <div className="w-[min(1240px,calc(100%-36px))] min-h-[76px] sm:min-h-[82px] mx-auto flex items-center justify-between gap-6 py-2">
          {/* Brand Logo & Name */}
          <Link to="/" className="inline-flex items-center gap-3 text-inherit no-underline flex-shrink-0 group">
            <img
              src="/logo.svg"
              alt="The Kasar Himalayan Heights"
              className="h-12 sm:h-14 w-auto object-contain filter drop-shadow brightness-110 group-hover:scale-105 transition-transform"
            />
            <span className="flex flex-col leading-tight">
              <strong className="font-serif text-[1.22rem] sm:text-[1.32rem] font-medium text-white tracking-wide">The Kasar</strong>
              <span className="text-[#C9F24D] text-[0.62rem] tracking-[0.2em] uppercase font-sans font-semibold">
                Himalayan Heights · Satya’s
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-white/85 hover:text-[#C9F24D] text-[0.78rem] font-semibold tracking-wider uppercase transition-colors no-underline"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/reviews"
              className="text-white/85 hover:text-[#C9F24D] text-[0.78rem] font-semibold tracking-wider uppercase transition-colors no-underline"
            >
              Guest stories
            </Link>
            <a
              href="#booking"
              onClick={(e) => handleNavClick(e, '#booking')}
              className="px-5 py-2.5 rounded-full bg-[#C9F24D] text-[#073125] hover:bg-[#bde63d] font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center gap-1.5 no-underline hover:scale-102"
            >
              <span>Enquire to book</span>
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

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#052219] border-b border-white/15 px-6 py-5 space-y-3.5 text-white animate-fade-up">
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="py-2 text-[0.88rem] font-medium text-white/90 hover:text-[#C9F24D] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-[0.88rem] font-medium text-white/90 hover:text-[#C9F24D] transition-colors"
            >
              Guest stories
            </Link>
          </div>
          <div className="pt-2">
            <a
              href="#booking"
              onClick={(e) => handleNavClick(e, '#booking')}
              className="w-full py-3 rounded-full bg-[#C9F24D] text-[#073125] font-bold text-xs tracking-wider uppercase text-center block shadow-md"
            >
              Enquire to book ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default HotelNavbar;
