import React from 'react';
import { Container, APP_URLS, useSiteSettings } from '@shared';

const defaultDays = [
  {
    num: '01',
    tag: 'Day 1 • Arrival & Kainchi Darshan',
    title: 'Kathgodam to Kainchi Dham & Kasar Ridge',
    items: [
      'Direct train station pickup from Kathgodam by private mountain cab.',
      'Sacred stop at Kainchi Dham Ashram for evening darshan and aarti.',
      'Drive up to Kasar Devi for check-in to your heated room and hot satvik dinner.',
    ],
    note: '85 km • ~3 hrs scenic mountain drive',
  },
  {
    num: '02',
    tag: 'Day 2 • Himalayan Sunrise & Jageshwar Valley',
    title: 'Trishul Peak Dawn & Ancient Shiva Temples',
    items: [
      'Enjoy golden morning sunrise over Mount Trishul from your private balcony.',
      'Peaceful morning walk to historic Kasar Devi Temple and Vivekananda Caves.',
      'Comfortable cab visit to the ancient 124 stone Shiva temples of Jageshwar Dham.',
    ],
    note: '70 km round-trip through cedar forests',
  },
  {
    num: '03',
    tag: 'Day 3 • Ridge Walk & Departure',
    title: 'Pine Forest Peace & Safe Return',
    items: [
      'Quiet morning walk along Crank’s Ridge with fresh mountain pine air.',
      'Fresh home-style satvik breakfast before departure.',
      'Safe, on-time cab drop to Kathgodam railway station for your train home.',
    ],
    note: 'Safe & relaxing return journey',
  },
];

const PilgrimageItinerary = () => {
  const { settings } = useSiteSettings();
  const days =
    settings?.landingContent?.itinerary && settings.landingContent.itinerary.length > 0
      ? settings.landingContent.itinerary
      : defaultDays;

  return (
    <section id="itinerary" className="py-20 sm:py-28 px-3 sm:px-6 bg-[#541508] border-b border-[#3D0F06] text-white relative overflow-hidden ambient-glow-gold">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 space-y-4">
          <p className="editorial-eyebrow">
            Curated Mountain Journey &bull; Sacred 3-Day Circuit
          </p>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl text-white font-semibold tracking-normal leading-tight sm:leading-snug">
            3-Day Mountain &amp; Temple Circuit
          </h2>

          <div className="w-20 h-0.5 bg-[#EAA722] mx-auto my-3"></div>

          <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/90 leading-[1.8] sm:leading-[1.85] font-normal">
            A peaceful, unhurried journey with Kainchi Dham darshan, ancient stone temples, and quiet nights on Kasar Ridge.
          </p>
        </div>

        {/* 3 Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {days.map((day, idx) => (
            <div
              key={idx}
              className="bg-[#3D0F06] rounded-3xl p-7 sm:p-8 lg:p-9 border border-[#EAA722]/30 luxury-card shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="w-13 h-13 rounded-full bg-[#EAA722] text-[#541508] flex items-center justify-center font-serif font-bold text-xl mb-5 shadow-[0_0_15px_rgba(234,167,34,0.35)] group-hover:scale-108 transition-transform">
                  {day.num}
                </div>
                <span className="editorial-eyebrow block mb-2">
                  {day.tag}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-white mb-4 leading-snug group-hover:text-[#EAA722] transition-colors">
                  {day.title}
                </h3>
                <ul className="space-y-3.5 text-base sm:text-[17px] text-[#FAF5EC]/90 leading-[1.75] font-normal">
                  {day.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2.5">
                      <span className="text-[#EAA722] mt-0.5 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {day.note && (
                <div className="mt-6 pt-4 border-t border-[#EAA722]/20 text-xs sm:text-sm text-[#EAA722] flex items-center gap-2">
                  <span>✦</span>
                  <span className="font-medium">{day.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pilgrimage Booking Guidance Box in Deep Maroon */}
        <div className="mt-14 p-7 sm:p-10 rounded-3xl bg-[#2D0B04] border-2 border-[#EAA722]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-2xl luxury-card relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <h4 className="font-heading text-xl sm:text-2xl lg:text-3xl text-white font-semibold leading-snug">
              Custom Mountain Travel &amp; Stay Guidance
            </h4>
            <p className="text-base sm:text-lg text-[#FAF5EC]/90 font-normal leading-[1.75]">
              Traveling with elders or family? Our local coordinators arrange personalized mountain itineraries and chauffeured cabs.
            </p>
          </div>
          <a
            href={APP_URLS.travel}
            target="_blank"
            rel="noreferrer"
            className="btn-nkb-gold btn-shimmer px-8 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase flex-shrink-0 inline-flex items-center gap-2 group cursor-pointer shadow-lg"
          >
            <span>Plan Your Yatra</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
          </a>
        </div>
      </Container>
    </section>
  );
};

export default PilgrimageItinerary;
