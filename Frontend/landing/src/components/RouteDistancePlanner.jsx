import React, { useState } from 'react';
import { Container, SITE_CONFIG, useSiteSettings } from '@shared';
import { routeData } from '../data/landingData';

const RouteDistancePlanner = () => {
  const { settings } = useSiteSettings();
  const company = settings?.company || SITE_CONFIG;
  const [activeRouteTab, setActiveRouteTab] = useState('dhams');

  const handleRouteBookClick = (routeName) => {
    const message = encodeURIComponent(
      `*Pilgrimage Cab Booking*\n` +
      `Route: ${routeName}\n` +
      `Please provide available vehicles and driver details.`
    );
    window.open(`https://wa.me/${company.whatsappNumber}?text=${message}`, '_blank');
  };

  const tabs = [
    { key: 'dhams', label: 'Holy Temples & Ashrams' },
    { key: 'transit', label: 'Railway & Airport Hubs' },
    { key: 'excursions', label: 'Scenic Day Circuits' },
  ];

  const currentRoutes = (routeData && routeData[activeRouteTab]) || [];

  return (
    <section id="routes" className="py-20 sm:py-28 px-4 bg-[#541508] border-b border-[#3D0F06] text-white relative overflow-hidden">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 relative z-10">
          <p className="font-serif text-sm uppercase tracking-widest text-[#EAA722] font-semibold mb-3">
            ॥ मार्ग एवं दूरियां • Pilgrim Route Guide ॥
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-tight mb-4">
            Distances &amp; Driving Times
          </h2>

          <div className="w-20 h-0.5 bg-[#EAA722] mx-auto my-4"></div>

          <p className="font-serif text-lg sm:text-xl text-[#FAF5EC]/90 leading-relaxed font-normal">
            Realistic road distances and scenic mountain driving times from our base at Crank’s Ridge, Kasar Devi, Almora.
          </p>

          {/* Category Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveRouteTab(tab.key)}
                className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-serif uppercase tracking-widest font-bold transition-all cursor-pointer ${
                  activeRouteTab === tab.key
                    ? 'btn-nkb-gold'
                    : 'bg-[#3D0F06] text-[#FAF5EC]/90 border border-[#EAA722]/30 hover:border-[#EAA722]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Route Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {currentRoutes.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#3D0F06] rounded-3xl p-7 sm:p-8 border border-[#EAA722]/30 hover:border-[#EAA722] transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white leading-snug">
                      {item.name}
                    </h3>
                    <span className="text-sm font-serif text-[#EAA722] font-semibold block mt-1">
                      {item.dedication}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-numeral text-3xl sm:text-4xl font-bold text-[#EAA722] block leading-tight tracking-tight">
                      {item.distance}
                    </span>
                    <span className="text-sm font-serif text-[#FAF5EC]/70 block mt-0.5">
                      ~ {item.time} drive
                    </span>
                  </div>
                </div>

                <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/85 leading-relaxed mb-6 font-normal">
                  {item.highlight}
                </p>
              </div>

              <div className="pt-5 border-t border-[#EAA722]/20 flex items-center justify-between">
                <span className="text-sm text-[#FAF5EC]/70 font-serif">
                  Local mountain chauffeur available
                </span>
                <button
                  type="button"
                  onClick={() => handleRouteBookClick(item.name)}
                  className="text-xs sm:text-sm font-serif font-bold text-[#EAA722] hover:text-white flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <span>Book Cab on WhatsApp</span>
                  <span>↗</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default RouteDistancePlanner;