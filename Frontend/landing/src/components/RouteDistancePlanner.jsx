import React, { useState } from 'react';
import { Container, SectionHeading, SITE_CONFIG, useSiteSettings } from '@shared';
import { routeData } from '../data/landingData';

const cleanAmp = (text) => {
  if (typeof text !== 'string') return text;
  const parts = text.split('&');
  if (parts.length === 1) return text;
  return parts.reduce((acc, part, idx) => {
    if (idx === 0) return [part];
    return [...acc, <span key={idx} className="font-sans font-light">&amp;</span>, part];
  }, []);
};

const RouteDistancePlanner = () => {
  const { settings } = useSiteSettings();
  const company = settings?.company || SITE_CONFIG;
  const [activeRouteTab, setActiveRouteTab] = useState('dhams');

  const handleRouteBookClick = (routeName) => {
    const message = encodeURIComponent(
      `*Inquiry for Private Cab*\n` +
      `Route: ${routeName}\n` +
      `Please share available cabs (Innova / Sedan) and prices.`
    );
    window.open(`https://wa.me/${company.whatsappNumber}?text=${message}`, '_blank');
  };

  const tabs = [
    { key: 'dhams', label: 'Temples & Holy Sites' },
    { key: 'transit', label: 'Train & Airport Hubs' },
    { key: 'excursions', label: 'Day Sightseeing' },
  ];

  const currentRoutes = (routeData && routeData[activeRouteTab]) || [];

  return (
    <section id="routes" className="py-16 sm:py-24 px-4 bg-gradient-to-b from-[#FDFBF7] via-[#FFF6EC]/50 to-[#FDFBF7] relative overflow-hidden">
      {/* Subtle sacred symbol watermark */}
      <div className="absolute top-12 left-6 text-[#C84B0F]/[0.025] text-[160px] font-devanagari select-none pointer-events-none leading-none z-0">
        🔱
      </div>

      <Container size="lg">
        <SectionHeading
          subtitle="॥ 🪔 Distances & Travel Times 🪔 ॥"
          title="Popular Routes & Driving Times from Almora"
          description="Clear road distances, driving times, and reliable cab options for popular places around Kasar Devi and Almora."
        />

        {/* Category Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveRouteTab(tab.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer ${
                activeRouteTab === tab.key
                  ? 'bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] text-[#FDFBF7] shadow-md border border-[#C5A059]/30'
                  : 'bg-transparent text-[#5C5350] border border-[#C5A059]/25 hover:border-[#C84B0F]/40 hover:text-[#C84B0F]'
              }`}
            >
              {cleanAmp(tab.label)}
            </button>
          ))}
        </div>

        {/* Route Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentRoutes.map((item, idx) => (
            <div
              key={idx}
              className="card-hover bg-[#FDFBF7] rounded-2xl p-6 sm:p-7 border border-[#C5A059]/20 hover:border-[#C84B0F]/35 flex flex-col justify-between transition-all duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-serif text-xl sm:text-[1.35rem] font-medium text-[#2C2523] leading-snug">
                      {cleanAmp(item.name)}
                    </h4>
                    <span className="text-xs font-sans text-[#C84B0F] font-medium block mt-1">
                      {cleanAmp(item.dedication)}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-numeral text-2xl sm:text-3xl font-bold text-[#C84B0F] block leading-tight tracking-tight">
                      {item.distance}
                    </span>
                    <span className="text-xs font-sans text-[#6B615E] font-medium block mt-0.5">
                      ~ {item.time} drive
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#5C5350] leading-relaxed mb-4">
                  {item.highlight}
                </p>

                <div className="space-y-1.5 text-xs text-[#2C2523] bg-[#FAF6EF] p-3 rounded-xl border border-[#C5A059]/15 font-sans">
                  <div>
                    <span className="text-[#C84B0F] font-semibold uppercase tracking-wider text-[11px]">Route: </span>
                    <span>{item.route}</span>
                  </div>
                  <div>
                    <span className="text-[#C84B0F] font-semibold uppercase tracking-wider text-[11px]">Recommended: </span>
                    <span>{item.recommendedVehicle}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-[#C5A059]/12 flex items-center justify-between">
                <span className="text-xs text-[#6B615E] font-sans">
                  Road: {item.roadCondition}
                </span>
                <button
                  type="button"
                  onClick={() => handleRouteBookClick(item.name)}
                  className="group px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-[#C84B0F] hover:bg-gradient-to-r hover:from-[#C84B0F] hover:to-[#7C1D23] hover:text-[#FDFBF7] transition-all duration-300 flex items-center gap-1.5 cursor-pointer border border-[#C84B0F]/30 hover:border-transparent"
                >
                  <span>Book Cab</span>
                  <span className="text-xs leading-none group-hover:translate-x-0.5 transition-transform">↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-[#6B615E] font-sans">
            Need a custom route or pilgrimage itinerary? Call our Almora team at{' '}
            <a href={`tel:${company.conciergePhone}`} className="text-[#C84B0F] font-numeral font-bold hover:underline tracking-wide">
              {company.conciergePhone}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default RouteDistancePlanner;