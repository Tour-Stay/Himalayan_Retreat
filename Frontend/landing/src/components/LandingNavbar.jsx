import { useState, useEffect } from 'react';
import { APP_URLS, SITE_CONFIG, useSiteSettings } from '@shared';

const LOGO_SVG = '/logo.svg';

const LandingNavbar = () => {
  const { settings } = useSiteSettings();
  const company = settings?.company || SITE_CONFIG;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full relative z-40">
      {/* 1. TOP MAROON DEVOTIONAL UTILITY BAR (Exact like nkbashram.org) */}
      <div className="w-full bg-[#541508] text-white border-b border-[#3D0F06]">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2 py-2 sm:py-0 min-h-[46px] text-xs sm:text-sm font-serif tracking-widest uppercase">
          {/* Company Name */}
          <div className="flex items-center gap-2.5">
            <span className="font-serif tracking-widest text-[#EAA722] font-bold text-base sm:text-lg uppercase">
              The Kasar Himalayan Heights
            </span>
            <span className="hidden lg:inline text-white/30 text-sm">•</span>
            <span className="hidden lg:inline text-[#FAF5EC]/85 text-sm sm:text-[15px] normal-case tracking-normal">
              Trishul &amp; Nanda Devi Vistas • 6,942 FT Ridge • Kasar Devi
            </span>
          </div>

          {/* Quick Guidance Tabs (Desktop/Tablet) */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm">
            <a
              href="#about-retreat"
              className="px-3.5 py-1 font-bold text-[#EAA722] border-2 border-[#EAA722] bg-[#3D0F06]/50 transition-colors tracking-wider"
            >
              ABOUT RETREAT
            </a>
            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 font-semibold text-white hover:text-[#EAA722] transition-colors tracking-wider"
            >
              RETREAT ROOMS ↗
            </a>
            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 font-semibold text-white hover:text-[#EAA722] transition-colors tracking-wider"
            >
              YATRA CABS ↗
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN DEEP GREEN NAV BAR (New Rich Dark Green) */}
      <div className="w-full bg-gradient-to-r from-[#081E1A] via-[#0D332D] to-[#081E1A] border-b border-[#051713] py-3 sm:py-4 px-3 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 sm:gap-6">

          {/* Left: Authentic NKB Ashram Logo & Arch */}
          <a href="#maharajji" className="flex items-center gap-3 flex-shrink-0 group">
            <img
              src={LOGO_SVG}
              alt="The Kasar Himalayan Heights & Expeditions"
              className="h-16 sm:h-20 w-auto object-contain filter drop-shadow brightness-110 group-hover:scale-105 transition-transform"
            />
          </a>

          {/* Center: Modern Luxury Navigation Links */}
          <nav className="hidden lg:flex flex-col items-center justify-center gap-2 flex-1 px-4">
            {/* Top Tier: Main Sections */}
            <div className="flex items-center gap-6 xl:gap-9 text-base xl:text-lg font-heading text-[#FAF5EC] tracking-normal">
              <a href="#maharajji" className="hover:text-[#EAA722] transition-colors font-medium">
                Home
              </a>
              <a href="#kasar-devi" className="hover:text-[#EAA722] transition-colors font-medium">
                About Kasar Devi
              </a>
              <a href="#uttarakhand" className="hover:text-[#EAA722] transition-colors font-medium">
                Sacred Shrines
              </a>
              <a href="#about-retreat" className="hover:text-[#EAA722] transition-colors font-medium">
                Sanctuary &amp; Cabs
              </a>
            </div>

            {/* Bottom Tier: Guidance & Contact */}
            <div className="flex items-center gap-6 xl:gap-9 text-xs sm:text-[13px] xl:text-[15px] text-[#FAF5EC]/85 tracking-wider uppercase font-medium">
              <a href="#things-to-do" className="hover:text-[#EAA722] transition-colors">
                Things to Do &amp; Circuit
              </a>
              <a href="#faq" className="hover:text-[#EAA722] transition-colors">
                Visitor FAQs
              </a>
              <a href="#enquiry" className="hover:text-[#EAA722] transition-colors">
                Concierge &amp; Booking
              </a>
            </div>
          </nav>

          {/* Right: Social Icons + Big Gold Pill Button */}
          <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
            {/* Social Icons (SVG) */}
            <div className="flex items-center gap-4 text-[#EAA722]">
              <a
                href="https://www.facebook.com/61555816868523/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-all transform hover:scale-110 p-1"
                title="Facebook: The Kasar Himalayan Heights"
                aria-label="Facebook"
              >
                <svg className="w-7 h-7 fill-current drop-shadow" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/the_kasar_himalyan_heights/?hl=en"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-all transform hover:scale-110 p-1"
                title="Instagram: @the_kasar_himalyan_heights"
                aria-label="Instagram"
              >
                <svg className="w-7 h-7 fill-current drop-shadow" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            {/* Exact Golden Oval Pill Button */}
            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noreferrer"
              className="btn-nkb-gold btn-shimmer px-8 py-2.5 text-sm sm:text-base font-bold tracking-widest whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              BOOK STAY
            </a>
          </div>

          {/* Mobile Actions: Direct Stay Button + Hamburger */}
          <div className="lg:hidden flex items-center gap-2.5">
            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noreferrer"
              className="btn-nkb-gold px-3.5 py-1.5 text-xs font-bold tracking-wider shadow-md"
            >
              BOOK STAY
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#061814] text-[#EAA722] hover:text-white border border-[#EAA722]/30 hover:border-[#EAA722] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer (Glassmorphic & Fully Responsive) */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 sm:p-6 rounded-2xl bg-[#061814]/98 backdrop-blur-xl border border-[#EAA722]/30 shadow-2xl animate-dropdown text-left font-sans">
            <div className="space-y-1 pb-3 border-b border-[#EAA722]/20">
              <a
                href="#maharajji"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-white hover:text-[#EAA722] hover:bg-[#081E1A] text-base font-medium transition-colors"
              >
                <span>Home</span>
                <span className="text-[#EAA722] text-xs">➔</span>
              </a>
              <a
                href="#kasar-devi"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-white hover:text-[#EAA722] hover:bg-[#081E1A] text-base font-medium transition-colors"
              >
                <span>About Kasar Devi Ridge</span>
                <span className="text-[#EAA722] text-xs">➔</span>
              </a>
              <a
                href="#uttarakhand"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-white hover:text-[#EAA722] hover:bg-[#081E1A] text-base font-medium transition-colors"
              >
                <span>Holy Shrines of Kumaon</span>
                <span className="text-[#EAA722] text-xs">➔</span>
              </a>
              <a
                href="#about-retreat"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-white hover:text-[#EAA722] hover:bg-[#081E1A] text-base font-medium transition-colors"
              >
                <span>The Retreat &amp; Travel Fleet</span>
                <span className="text-[#EAA722] text-xs">➔</span>
              </a>
              <a
                href="#things-to-do"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-white hover:text-[#EAA722] hover:bg-[#081E1A] text-base font-medium transition-colors"
              >
                <span>Things to Do &amp; Circuit</span>
                <span className="text-[#EAA722] text-xs">➔</span>
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-white hover:text-[#EAA722] hover:bg-[#081E1A] text-base font-medium transition-colors"
              >
                <span>Visitor FAQs</span>
                <span className="text-[#EAA722] text-xs">➔</span>
              </a>
              <a
                href="#enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-white hover:text-[#EAA722] hover:bg-[#081E1A] text-base font-medium transition-colors"
              >
                <span>Concierge &amp; Booking</span>
                <span className="text-[#EAA722] text-xs">➔</span>
              </a>
            </div>

            {/* Direct Booking Dual Buttons in Mobile Drawer */}
            <div className="pt-4 grid grid-cols-2 gap-3">
              <a
                href={APP_URLS.hotel}
                target="_blank"
                rel="noreferrer"
                className="btn-nkb-gold py-2.5 text-xs text-center font-bold tracking-wider block"
              >
                HOTEL SUITES ↗
              </a>
              <a
                href={APP_URLS.travel}
                target="_blank"
                rel="noreferrer"
                className="btn-outline-gold py-2.5 text-xs text-center font-bold tracking-wider block"
              >
                YATRA CABS ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingNavbar;
