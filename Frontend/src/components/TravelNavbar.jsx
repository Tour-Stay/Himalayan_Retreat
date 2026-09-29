import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from './Icons';
import Logo from './Logo';

const TravelNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Clean, concise 4 single-line links — Never wraps or mashes
  const travelNavLinks = [
    { name: 'Fleet', hash: '#fleet' },
    { name: 'Calculator', hash: '#calculator' },
    { name: 'Circuits', hash: '#destinations' },
    { name: 'Safety', hash: '#safety' },
  ];

  const handleScrollToSection = (hash) => {
    setIsOpen(false);
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-primary/95 backdrop-blur-md border-b border-secondary/25 shadow-lg shadow-black/20 py-3'
          : 'bg-primary/55 backdrop-blur-md border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* 1. Travel Brand Logo & Tagline (Left) */}
        <Link to="/travel" className="flex items-center gap-3 group shrink-0">
          <Logo size={38} />
          <div className="flex flex-col">
            <span className="text-white font-heading text-lg sm:text-xl font-normal tracking-wide group-hover:text-secondary transition-colors duration-300 leading-tight">
              Devbhoomi Expeditions
            </span>
            <span className="text-secondary/85 text-[10px] tracking-[0.25em] uppercase font-sans font-medium">
              Mountain Fleet & Tours
            </span>
          </div>
        </Link>

        {/* 2. Travel Navigation Links (Center — whitespace-nowrap, clean & spacious) */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {travelNavLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleScrollToSection(link.hash)}
              className="text-xs uppercase tracking-[0.2em] font-medium text-white/80 hover:text-secondary transition-colors duration-200 cursor-pointer py-1 whitespace-nowrap"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* 3. Right Action CTAs (Clean, compact, no wrapping) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Return to Hotel Website */}
          <Link
            to="/"
            className="border border-white/25 hover:border-secondary text-white/85 hover:text-secondary transition-all duration-300 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <span>← Hotel</span>
          </Link>

          {/* Book Fleet / Calculate Fare CTA */}
          <button
            onClick={() => handleScrollToSection('#calculator')}
            className="btn-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 group cursor-pointer shadow-md shadow-secondary/20 hover:shadow-secondary/40 transition-all whitespace-nowrap"
          >
            <span>Book Fleet</span>
            <ArrowUpRightIcon className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="Toggle travel navigation"
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

      {/* Mobile Drawer for Travel Portal */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-primary/98 backdrop-blur-xl px-6 py-5 space-y-3 border-t border-white/10 shadow-2xl">
          {travelNavLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleScrollToSection(link.hash)}
              className="block w-full text-left text-sm font-medium tracking-wide py-1.5 text-white/90 hover:text-secondary transition-colors"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleScrollToSection('#calculator')}
              className="w-full btn-gold py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-center"
            >
              Calculate Fare & Reserve Fleet
            </button>
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-center border border-white/20 text-white/80 hover:text-white px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              ← Return to Hotel Retreat
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TravelNavbar;
