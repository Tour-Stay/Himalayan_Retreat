import { useState, useEffect, useRef } from 'react';
import {
  APP_URLS,
  SITE_CONFIG,
  TempleIcon,
  SparklesIcon,
  CompassIcon,
  MountainIcon,
  BedIcon,
  CalendarIcon,
  CoffeeIcon,
  CarIcon,
  CalculatorIcon,
  TrainIcon,
  MapIcon,
  HelpCircleIcon,
} from '@shared';
import Logo from '@shared/components/Logo';

const navItems = [
  {
    id: 'devbhoomi',
    label: 'Holy Sites',
    subtitle: 'Temples & Holy Sites',
    badge: 'पावन तीर्थ',
    dropdown: [
      {
        title: 'Kainchi Dham Ashram',
        desc: 'Neem Karoli Baba Ashram, Darshan & Daily Aarti (45 km)',
        href: '#maharajji',
        icon: <TempleIcon className="w-4 h-4" />,
      },
      {
        title: 'Jageshwar Dham Temples',
        desc: '124 Ancient Shiva Stone Temples in Pine Valley (35 km)',
        href: '#uttarakhand',
        icon: <SparklesIcon className="w-4 h-4" />,
      },
      {
        title: "Kasar Devi & Crank's Ridge",
        desc: 'Quiet Mountain Ridge & Swami Vivekananda Meditation Caves',
        href: '#uttarakhand',
        icon: <CompassIcon className="w-4 h-4" />,
      },
      {
        title: 'Himalayan Snow Peaks',
        desc: 'Morning Sunrise Views of Mount Trishul & Nanda Devi',
        href: '#uttarakhand',
        icon: <MountainIcon className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'hotel',
    label: 'Rooms & Stay',
    subtitle: 'Heated Chalets at 6,942 FT',
    dropdown: [
      {
        title: 'The Kasar Himalayan Heights',
        desc: "Boutique Chalet Resort in Kasar Devi, Almora",
        href: APP_URLS.hotel,
        external: true,
        icon: <MountainIcon className="w-4 h-4" />,
      },
      {
        title: 'Heated Rooms & Chalets',
        desc: 'Electric Blankets, Private Balconies & Cozy Fireplaces',
        href: `${APP_URLS.hotel}/rooms`,
        external: true,
        icon: <BedIcon className="w-4 h-4" />,
      },
      {
        title: 'Check Room Availability',
        desc: 'View Live Room Rates, Dates & Easy Booking',
        href: `${APP_URLS.hotel}#book`,
        external: true,
        icon: <CalendarIcon className="w-4 h-4" />,
      },
      {
        title: 'Home-Style Food & Bonfire',
        desc: 'Fresh Vegetarian Meals, Mountain Tea & Evening Bonfire',
        href: `${APP_URLS.hotel}#experiences`,
        external: true,
        icon: <CoffeeIcon className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'travel',
    label: 'Cabs & Travel',
    subtitle: 'Private Mountain Cabs',
    dropdown: [
      {
        title: 'Private Mountain Cabs',
        desc: 'Clean 4, 6 & 12-Seater Cabs (Dzire, Innova Crysta, Urbania)',
        href: APP_URLS.travel,
        external: true,
        icon: <CarIcon className="w-4 h-4" />,
      },
      {
        title: 'Trip Fare Calculator',
        desc: 'Calculate Exact Trip Cost with Fair, Fixed Rates',
        href: `${APP_URLS.travel}#calculator`,
        external: true,
        icon: <CalculatorIcon className="w-4 h-4" />,
      },
      {
        title: 'Kathgodam Station Pickup',
        desc: 'On-Time Station Meet & Direct Cab Drop to Kasar Devi',
        href: APP_URLS.travel,
        external: true,
        icon: <TrainIcon className="w-4 h-4" />,
      },
      {
        title: 'Sightseeing & Temple Tours',
        desc: 'Custom Kainchi Dham, Jageshwar & Almora Day Tours',
        href: `${APP_URLS.travel}#circuits`,
        external: true,
        icon: <MapIcon className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'heritage',
    label: 'About Kasar',
    subtitle: 'Travel Guide & History',
    dropdown: [
      {
        title: 'Kasar Devi Peaceful Ridge',
        desc: 'Natural Peace & Unique Energy Shared with Stonehenge',
        href: '#uttarakhand',
        icon: <CompassIcon className="w-4 h-4" />,
      },
      {
        title: 'Swami Vivekananda Caves',
        desc: 'Historic Meditation Caves from 1890',
        href: '#uttarakhand',
        icon: <SparklesIcon className="w-4 h-4" />,
      },
      {
        title: 'Distances & Driving Times',
        desc: 'Real Travel Times from Kathgodam, Pantnagar & Delhi',
        href: '#routes',
        icon: <MapIcon className="w-4 h-4" />,
      },
      {
        title: '3-Day Sample Trip Plan',
        desc: 'Easy Itinerary for Kainchi Dham, Jageshwar & Kasar',
        href: '#itinerary',
        icon: <CalendarIcon className="w-4 h-4" />,
      },
      {
        title: 'Frequently Asked Questions',
        desc: 'Helpful Answers on Room Heating, Food & Cabs',
        href: '#faq',
        icon: <HelpCircleIcon className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'concierge',
    label: 'Contact',
    href: '#enquiry',
  },
];

const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState(null);

  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleToggleClick = (index, e) => {
    e.stopPropagation();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full font-sans transition-all duration-300">
      {/* 1. TOP UTILITY BAR (Editorial Luxury Strip — gently collapses on scroll) */}
      <div
        className={`bg-gradient-to-r from-[#FFF5EC] via-[#FAF6EF] to-[#FFF5EC] border-b border-[#C84B0F]/20 px-4 text-xs text-[#6B615E] transition-all duration-300 overflow-hidden ${
          isScrolled ? 'max-h-0 py-0 opacity-0 pointer-events-none border-b-0' : 'max-h-12 py-1.5 opacity-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] font-sans">
            <span className="text-[#C84B0F] font-serif font-bold tracking-wider flex items-center gap-1.5">
              <span className="text-amber-500 animate-pulse text-xs">🪔</span>
              <span className="hidden sm:inline">॥ ॐ नमः शिवाय • 🔱 जय श्री नीब करौरी महाराज ॥</span>
              <span className="sm:hidden">॥ ॐ जय बाबा नीम करौरी ॥</span>
            </span>
            <span className="hidden md:inline text-[#C5A059]/40">|</span>
            <span className="text-[#C5A059] font-cinzel font-semibold tracking-[0.16em] hidden md:flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C84B0F]"></span>
              6,942 FT • ALMORA HUB
            </span>
            <span className="hidden lg:inline text-[#C5A059]/40">|</span>
            <a
              href={`tel:${SITE_CONFIG.conciergePhone}`}
              className="hidden lg:inline hover:text-[#C84B0F] transition-colors"
            >
              Yatra Helpline: <strong className="text-[#2C2523] font-numeral font-bold tracking-wide">{SITE_CONFIG.conciergePhone}</strong>
            </a>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-sans">
            <a
              href="#hotel-gateway"
              className="text-[#7C1D23] hover:underline font-semibold tracking-wider uppercase flex items-center gap-1"
            >
              <span>View Heated Rooms</span>
              <span>&rarr;</span>
            </a>
            <span className="text-[#C5A059]/40">|</span>
            <a
              href={APP_URLS.admin}
              className="text-[#6B615E] hover:text-[#7C1D23] uppercase font-semibold tracking-wider"
            >
              Staff Portal
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN LIVE HORIZONTAL NAVIGATION BAR */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-lg border-b border-[#C5A059]/30 py-2.5'
            : 'bg-[#FDFBF7] border-b border-[#C5A059]/20 py-3 shadow-xs'
        }`}
      >
        <div className="w-full max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 xl:gap-6">

          {/* Brand Logo & Editorial Title */}
          <a href="#maharajji" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <Logo size={38} />
            <div className="flex flex-col">
              <span className="font-cinzel text-sm sm:text-base lg:text-lg font-bold tracking-tight text-[#2C2523] group-hover:text-[#7C1D23] transition-colors whitespace-nowrap">
                The Kasar Himalayan Heights
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-[#C5A059] font-semibold font-cinzel whitespace-nowrap">
                Kasar Devi, Almora • 6,942 FT
              </span>
            </div>
          </a>

          {/* DESKTOP LIVE HORIZONTAL NAVIGATION LINKS */}
          <nav className="nav-desktop-menu items-center gap-0.5 xl:gap-2 flex-shrink-0">
            {navItems.map((item, idx) => {
              const isOpen = activeDropdown === idx;

              return (
                <div
                  key={item.id}
                  className="relative py-1"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.dropdown ? (
                    <button
                      type="button"
                      onClick={(e) => handleToggleClick(idx, e)}
                      aria-expanded={isOpen}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-cinzel font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer focus:outline-none ${isOpen
                          ? 'bg-[#C5A059]/15 text-[#7C1D23]'
                          : 'text-[#2C2523] hover:text-[#7C1D23] hover:bg-[#FAF6EF]'
                        }`}
                    >
                      <span>{item.id === 'devbhoomi' ? '🪔 ' + item.label : item.label}</span>
                      <svg
                        className={`w-3 h-3 text-[#C5A059] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-[#7C1D23]' : ''
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="px-2.5 py-1.5 rounded-full text-xs font-cinzel font-semibold uppercase tracking-wider whitespace-nowrap text-[#2C2523] hover:text-[#7C1D23] hover:bg-[#FAF6EF] transition-all"
                    >
                      {item.label}
                    </a>
                  )}

                  {/* LUXURY FLOATING DROPDOWN CARD (Opens on Hover AND on Click) */}
                  {item.dropdown && isOpen && (
                    <div
                      className="absolute top-full left-0 pt-2 z-50 animate-dropdown"
                      style={{ width: '360px' }}
                      onMouseEnter={() => handleMouseEnter(idx)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="bg-[#FDFBF7] rounded-2xl shadow-[0_20px_50px_rgba(44,37,35,0.18)] border border-[#C5A059]/40 p-3 overflow-hidden backdrop-blur-md">
                        {/* Header of Dropdown */}
                        <div className="px-3 py-2 border-b border-[#C5A059]/20 mb-1.5 flex items-center justify-between bg-[#FAF6EF]/60 rounded-xl">
                          <div>
                            <span className="text-[10px] font-cinzel text-[#C5A059] uppercase tracking-widest font-bold block">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-[#6B615E] font-serif italic block">
                              {item.subtitle}
                            </span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-sans px-2 py-0.5 rounded-full bg-[#7C1D23]/10 text-[#7C1D23] font-bold border border-[#7C1D23]/20 tracking-wider uppercase">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* List of Sub-links */}
                        <div className="space-y-1">
                          {item.dropdown.map((subItem, subIdx) => (
                            <a
                              key={subIdx}
                              href={subItem.href}
                              target={subItem.external ? '_blank' : undefined}
                              rel={subItem.external ? 'noreferrer' : undefined}
                              onClick={() => setActiveDropdown(null)}
                              className="group/item flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#C5A059]/12 hover:border-[#C5A059]/30 border border-transparent transition-all"
                            >
                              <span className="mt-0.5 text-[#C5A059] group-hover/item:text-[#7C1D23] transition-colors flex-shrink-0 flex items-center justify-center w-5 h-5">
                                {subItem.icon}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-serif text-sm font-medium text-[#2C2523] group-hover/item:text-[#7C1D23] transition-colors">
                                    {subItem.title}
                                  </span>
                                  {subItem.external && (
                                    <span className="text-[#C5A059] group-hover/item:text-[#7C1D23] text-xs font-sans font-semibold">
                                      ↗
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-[#6B615E] leading-relaxed mt-0.5 font-light">
                                  {subItem.desc}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* TWO DIRECT ACTION BUTTONS (COMPACT, SLEEK & NO OVERFLOW) */}
          <div className="nav-actions-desktop items-center gap-2 flex-shrink-0">
            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider font-semibold bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] hover:from-[#E05A1B] hover:to-[#9E3304] text-[#FDFBF7] transition-all shadow-md border border-[#C5A059]/40 cursor-pointer flex items-center gap-1.5 whitespace-nowrap hover:scale-102"
              title="Book Room at The Kasar Himalayan Heights"
            >
              <span>Book Room</span>
              <span className="text-[#DFCA9B] text-xs leading-none">↗</span>
            </a>

            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider font-semibold border border-[#C84B0F]/40 bg-[#FAF6EF] hover:bg-[#C84B0F]/10 text-[#2C2523] hover:text-[#C84B0F] transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap hover:scale-102"
              title="Book Cab / Mountain Tour"
            >
              <span>Book Cab</span>
              <span className="text-[#C84B0F] text-xs leading-none">↗</span>
            </a>
          </div>

          {/* Mobile Menu Hamburger Button (Hidden on Desktop via CSS) */}
          <div className="nav-mobile-btn items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-[#C5A059]/35 bg-[#FAF6EF] text-[#2C2523] hover:text-[#7C1D23] transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="landing-mobile-navigation"
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

      {/* 3. MOBILE COLLAPSIBLE DRAWER (Guaranteed hidden on desktop via .nav-mobile-panel) */}
      {mobileMenuOpen && (
        <div id="landing-mobile-navigation" className="nav-mobile-panel bg-[#FDFBF7] border-b border-[#C5A059]/35 px-6 py-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl animate-dropdown">
          {/* Two clean action buttons without port numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-4 border-b border-[#C5A059]/20">
            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-full text-center text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] text-[#FDFBF7] shadow-md border border-[#C5A059]/40 block"
            >
              Stay at Kasar Resort ↗
            </a>
            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-full text-center text-xs uppercase tracking-wider font-bold border border-[#C84B0F]/40 bg-[#FAF6EF] text-[#2C2523] hover:text-[#C84B0F] block"
            >
              Mountain Expeditions ↗
            </a>
          </div>

          {/* Accordion Navigation Groups */}
          <div className="space-y-3">
            {navItems.map((item, idx) => (
              <div key={item.id} className="border-b border-[#C5A059]/15 pb-2.5">
                {item.dropdown ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMobileAccordion(mobileAccordion === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left py-2 font-serif text-base font-semibold text-[#2C2523]"
                      aria-expanded={mobileAccordion === idx}
                      aria-controls={`mobile-nav-panel-${item.id}`}
                    >
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        <span className="text-[11px] font-sans text-[#6B615E] font-normal">{item.subtitle}</span>
                      </div>
                      <svg
                        className={`w-3.5 h-3.5 text-[#C5A059] transition-transform duration-200 ${
                          mobileAccordion === idx ? 'rotate-180 text-[#7C1D23]' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileAccordion === idx && (
                      <div id={`mobile-nav-panel-${item.id}`} className="pl-3 space-y-2 py-2 bg-[#FAF6EF]/60 rounded-xl p-3 border border-[#C5A059]/20">
                        {item.dropdown.map((sub, sIdx) => (
                          <a
                            key={sIdx}
                            href={sub.href}
                            target={sub.external ? '_blank' : undefined}
                            rel={sub.external ? 'noreferrer' : undefined}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 border-b border-[#C5A059]/10 last:border-0"
                          >
                            <span className="font-serif text-sm font-medium text-[#7C1D23] flex items-center gap-2">
                              <span className="text-[#C5A059] flex-shrink-0 flex items-center justify-center w-4 h-4">{sub.icon}</span>
                              <span>{sub.title}</span>
                              {sub.external && <span className="text-[10px] font-sans">↗</span>}
                            </span>
                            <span className="text-xs text-[#6B615E] block mt-0.5">
                              {sub.desc}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 font-serif text-base font-semibold text-[#2C2523] hover:text-[#7C1D23]"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 text-center text-xs text-[#6B615E] font-sans">
            Direct Helpline: <strong className="text-[#2C2523] font-numeral font-bold tracking-wide">{SITE_CONFIG.conciergePhone}</strong>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
