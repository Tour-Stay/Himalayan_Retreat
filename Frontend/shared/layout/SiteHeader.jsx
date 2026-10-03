import { useState, useEffect } from 'react';
import { APP_URLS, SITE_CONFIG } from '../constants/siteConfig';
import Logo from '../components/Logo';
import Button from '../components/Button';

const SiteHeader = ({ currentApp = 'landing' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Context-aware navigation groups
  const hotelNavGroups = [
    { label: 'The Suites', href: '/#rooms' },
    { label: 'At a Glance', href: '/#glance' },
    { label: 'The Experience', href: '/#experiences' },
    { label: 'Amenities', href: '/#amenities' },
    { label: 'Our Story', href: '/#philosophy' },
    { label: 'Travel & Fleet', href: APP_URLS.travel },
  ];

  const landingNavGroups = [
    {
      label: 'Dev Bhoomi',
      items: [
        { name: 'Kainchi Dham Ashram', href: `${APP_URLS.landing}#uttarakhand`, desc: 'Neem Karoli Baba Ashram' },
        { name: 'Jageshwar Dham', href: `${APP_URLS.landing}#uttarakhand`, desc: '124 Ancient Jyotirlinga Shrines' },
        { name: 'Kasar Devi & Ridge', href: `${APP_URLS.landing}#uttarakhand`, desc: 'Geomagnetic Quietude & Caves' },
        { name: 'Himalayan Snow Peaks', href: `${APP_URLS.landing}#uttarakhand`, desc: 'Trishul, Nanda Devi & Panchachuli' },
      ],
    },
    {
      label: 'Stay (Hotel)',
      href: APP_URLS.hotel,
      badge: 'Boutique Hotel',
      items: [
        { name: 'The Kasar Alpine Chalet', href: `${APP_URLS.hotel}`, desc: '6,942 ft Boutique Luxury' },
        { name: 'Heated Suites Catalogue', href: `${APP_URLS.hotel}/rooms`, desc: '180° Snow Peak Balconies' },
        { name: 'Chalet Experiences', href: `${APP_URLS.hotel}#experiences`, desc: 'Bonfires, Ridge Trails & Tea' },
      ],
    },
    {
      label: 'Travel (Fleet)',
      href: APP_URLS.travel,
      badge: 'Mountain Fleet',
      items: [
        { name: 'Chauffeured Expeditions', href: `${APP_URLS.travel}`, desc: 'Kumaon & Garhwal Sacred Circuits' },
        { name: 'Almora Fare Calculator', href: `${APP_URLS.travel}#calculator`, desc: 'Real-time Distance & Vehicle Rates' },
        { name: 'Vehicle Fleet (4/6/12 Seaters)', href: `${APP_URLS.travel}#fleet`, desc: 'Sedans, Innova Crysta & Minibuses' },
        { name: 'Travel Reviews', href: `${APP_URLS.travel}#reviews`, desc: 'Verified Pilgrim & Guest Experiences' },
      ],
    },
    {
      label: 'About',
      items: [
        { name: 'Kasar Devi Heritage', href: `${APP_URLS.landing}#about-kasar`, desc: '2nd Century Temple & Sacred Ridge' },
        { name: 'Swami Vivekananda Caves', href: `${APP_URLS.landing}#about-kasar`, desc: 'Meditations of 1890' },
        { name: 'Our Philosophy', href: `${APP_URLS.landing}#philosophy`, desc: 'Reverence, Solitude & Hospitality' },
      ],
    },
    {
      label: 'Contact',
      href: `${APP_URLS.landing}#contact`,
    },
  ];

  const navGroups = currentApp === 'hotel' ? hotelNavGroups : landingNavGroups;

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Utility Bar (inspired by Postcard Resorts) */}
      <div className="bg-ivory-warm border-b border-gold/20 py-1.5 px-4 text-xs font-sans text-charcoal-muted">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-mono text-gold font-semibold tracking-wider">
              6,942 FT ELEVATION
            </span>
            <span className="hidden sm:inline text-gold/30">|</span>
            <a
              href={`tel:${SITE_CONFIG.conciergePhone}`}
              className="hover:text-maroon transition-colors flex items-center gap-1.5"
            >
              <span>Concierge:</span>
              <span className="font-semibold text-charcoal">{SITE_CONFIG.conciergePhone}</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={APP_URLS.admin}
              className="text-charcoal-muted hover:text-maroon transition-colors flex items-center gap-1 tracking-wider uppercase font-semibold text-[11px]"
            >
              Staff Portal
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 ${isScrolled ? 'bg-ivory/95 backdrop-blur-md shadow-md border-b border-gold/25 py-3' : 'bg-ivory py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <a href={APP_URLS.landing} className="flex items-center gap-3.5 group">
            <Logo size={42} />
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-charcoal group-hover:text-maroon transition-colors">
                The Kasar Himalayan Heights
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-gold font-semibold">
                Kasar Devi, Almora • 6,942 FT
              </span>
            </div>
          </a>

          {/* Desktop Navigation Groups */}
          <nav className="hidden lg:flex items-center gap-8">
            {navGroups.map((group, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => group.items && setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {group.items ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                    className={`flex items-center gap-1.5 text-xs tracking-wider uppercase font-sans font-semibold transition-colors py-2 cursor-pointer focus:outline-none ${activeDropdown === idx ? 'text-maroon' : 'text-charcoal hover:text-maroon'
                      }`}
                    aria-expanded={activeDropdown === idx}
                  >
                    <span>{group.label}</span>
                    <svg
                      className={`w-3.5 h-3.5 text-gold transition-transform duration-200 ${activeDropdown === idx ? 'rotate-180 text-maroon' : ''
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <a
                    href={group.href}
                    className="text-xs tracking-wider uppercase font-sans text-charcoal hover:text-maroon font-semibold transition-colors py-2"
                  >
                    {group.label}
                  </a>
                )}

                {/* Dropdown Menu */}
                {group.items && activeDropdown === idx && (
                  <div className="absolute top-full left-0 w-72 pt-2 z-50">
                    <div className="bg-ivory rounded-xl shadow-2xl border border-gold/30 p-3 overflow-hidden animate-fade-in">
                      {group.items.map((item, itemIdx) => (
                        <a
                          key={itemIdx}
                          href={item.href}
                          className="block p-2.5 rounded-lg hover:bg-gold/10 transition-colors group/item"
                        >
                          <div className="text-sm font-serif font-medium text-charcoal group-hover/item:text-maroon">
                            {item.name}
                          </div>
                          {item.desc && (
                            <div className="text-xs font-sans text-charcoal-muted mt-0.5">
                              {item.desc}
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Context-aware Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentApp === 'hotel' ? (
              <>
                <a
                  href="/rooms"
                  className="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border border-gold/40 hover:bg-gold/10 text-charcoal transition-all"
                >
                  All Suites
                </a>
                <a
                  href="/#book"
                  className="px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-semibold bg-maroon hover:bg-maroon-dark text-ivory border border-gold/30 shadow-md transition-all hover:scale-102"
                >
                  Reserve a Suite
                </a>
              </>
            ) : (
              <>
                <a
                  href={APP_URLS.hotel}
                  className="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold bg-maroon hover:bg-maroon-dark text-ivory border border-gold/30 shadow-xs transition-all"
                >
                  Stay at Kasar Resort ↗
                </a>
                <a
                  href={APP_URLS.travel}
                  className="px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold border border-gold/50 hover:bg-gold/15 text-charcoal hover:text-maroon transition-all"
                >
                  Mountain Travel ↗
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-maroon transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ivory border-b border-gold/30 px-6 py-6 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in shadow-xl">
          {navGroups.map((group, idx) => (
            <div key={idx} className="border-b border-gold/15 pb-3">
              <div className="font-serif text-base font-semibold text-charcoal mb-2">
                {group.label}
              </div>
              {group.items ? (
                <div className="pl-3 space-y-2">
                  {group.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.href}
                      className="block text-sm text-charcoal-muted hover:text-maroon py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  href={group.href}
                  className="block text-sm text-charcoal-muted hover:text-maroon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Visit
                </a>
              )}
            </div>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {currentApp === 'hotel' ? (
              <>
                <a
                  href="/#book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-maroon text-ivory shadow-md"
                >
                  Reserve a Suite
                </a>
                <a
                  href="/rooms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-full text-xs uppercase tracking-wider font-semibold border border-gold/50 text-charcoal hover:bg-gold/10"
                >
                  View All Heated Suites
                </a>
              </>
            ) : (
              <>
                <a
                  href={APP_URLS.hotel}
                  className="w-full text-center py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-maroon text-ivory shadow-md"
                >
                  Stay at Kasar Resort ↗
                </a>
                <a
                  href={APP_URLS.travel}
                  className="w-full text-center py-3 rounded-full text-xs uppercase tracking-wider font-semibold border border-gold/50 text-charcoal hover:bg-gold/10"
                >
                  Mountain Expeditions ↗
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
