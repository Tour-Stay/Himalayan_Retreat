import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRightIcon } from './Icons';
import Logo from './Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 5 Essential, Clean Nav Links — No Clutter
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Suites', path: '/rooms' },
    { name: 'Experiences', path: '/#experiences' },
    { name: 'Gallery', path: '/#gallery' },
    { name: 'Contact', path: '/#contact' },
  ];

  const handleNavClick = (path) => {
    setIsOpen(false);
    if (path.startsWith('/#') && location.pathname === '/') {
      const element = document.querySelector(path.replace('/', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // On non-home pages (like /rooms), keep the navbar solid dark green even at the top
  const isHomePage = location.pathname === '/';
  const isSolid = !isHomePage || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isSolid
          ? 'bg-primary/95 backdrop-blur-md border-b border-secondary/25 shadow-lg shadow-black/20 py-3'
          : 'bg-primary/50 backdrop-blur-md border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* 1. Brand Logo & Title (Left) */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <Logo size={40} />
          <div className="flex flex-col">
            <span className="text-white font-heading text-xl sm:text-2xl font-normal tracking-wide group-hover:text-secondary transition-colors duration-300 leading-tight">
              The Kasar Himalayan Heights
            </span>
            <span className="text-secondary/85 text-[10px] tracking-[0.25em] uppercase font-sans font-medium">
              Kasar Devi • 7,500 FT
            </span>
          </div>
        </Link>

        {/* 2. Navigation Links (Center with generous margins) */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => {
                  if (link.path.startsWith('/#') && location.pathname === '/') {
                    e.preventDefault();
                    handleNavClick(link.path);
                  }
                }}
                className={`text-xs uppercase tracking-[0.18em] font-medium py-1 transition-colors duration-200 cursor-pointer ${
                  active
                    ? 'text-secondary font-bold border-b-2 border-secondary'
                    : 'text-white/80 hover:text-secondary'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* 3. Action CTAs (Right) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Explore Travel CTA */}
          <a
            href="/travel"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-secondary/60 text-secondary hover:bg-secondary hover:text-primary transition-all duration-300 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 group cursor-pointer"
          >
            <span>Explore Travel</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Book Stay CTA */}
          <a
            href="/#book"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                handleNavClick('/#book');
              }
            }}
            className="btn-gold px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 group cursor-pointer shadow-md shadow-secondary/20 hover:shadow-secondary/40 transition-all"
          >
            <span>Book Stay</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-primary/98 backdrop-blur-xl px-6 py-5 space-y-3 border-t border-white/10 shadow-2xl">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={(e) => {
                if (link.path.startsWith('/#') && location.pathname === '/') {
                  e.preventDefault();
                }
                handleNavClick(link.path);
              }}
              className="block text-sm font-medium tracking-wide py-1.5 text-white/90 hover:text-secondary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href="/travel"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center border border-secondary text-secondary bg-secondary/10 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Explore Tour & Travel (4, 6, 12 Seater) ↗
            </a>
            <a
              href="/#book"
              onClick={() => setIsOpen(false)}
              className="block text-center btn-gold px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              Reserve Hotel Stay
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
