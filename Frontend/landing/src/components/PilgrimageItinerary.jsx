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
    <section id="itinerary" className="py-20 sm:py-28 px-4 bg-[#12433B] border-b border-[#0D332D] text-white relative overflow-hidden">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <p className="font-serif text-sm uppercase tracking-widest text-[#EAA722] font-semibold mb-3">
            ॥ पावन यात्रा संस्मरण • Sacred 3-Day Circuit ॥
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-tight mb-4">
            3-Day Sacred Pilgrimage
          </h2>

          <div className="w-20 h-0.5 bg-[#EAA722] mx-auto my-4"></div>

          <p className="font-serif text-lg sm:text-xl text-[#FAF5EC]/90 leading-relaxed font-normal">
            A peaceful, relaxing journey with Kainchi Dham darshan, ancient Shiva temples, and quiet nights on Kasar Ridge.
          </p>
        </div>

        {/* 3 Days Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {days.map((day, idx) => (
            <div
              key={idx}
              className="bg-[#0D332D] rounded-3xl p-8 border border-[#EAA722]/30 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#EAA722] text-[#12433B] flex items-center justify-center font-serif font-bold text-xl mb-5 shadow-md">
                  {day.num}
                </div>
                <span className="font-serif text-xs uppercase tracking-widest text-[#EAA722] font-semibold block mb-2">
                  {day.tag}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-5 leading-snug">
                  {day.title}
                </h3>
                <ul className="space-y-3.5 text-base sm:text-lg text-[#FAF5EC]/85 leading-relaxed mb-6 font-normal">
                  {day.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2.5">
                      <span className="text-[#EAA722] mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#EAA722]/20 text-sm font-serif text-[#FAF5EC]/70 flex items-center justify-between">
                <span>{day.note}</span>
                <span className="text-base text-[#EAA722]">🪔</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pilgrimage Booking Guidance Box in Deep Maroon */}
        <div className="mt-14 p-8 rounded-3xl bg-[#541508] border-2 border-[#EAA722]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-2xl relative z-10">
          <div>
            <h4 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-1">
              Custom Pilgrimage Guidance &amp; Bookings
            </h4>
            <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/90 font-normal">
              Traveling with elders or family? Our local coordinators arrange custom darshan schedules and chauffeured cabs.
            </p>
          </div>
          <a
            href={APP_URLS.travel}
            target="_blank"
            rel="noreferrer"
            className="btn-nkb-gold px-8 py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase flex-shrink-0 cursor-pointer"
          >
            Plan Your Yatra
          </a>
        </div>
      </Container>
    </section>
  );
};

export default PilgrimageItinerary;
