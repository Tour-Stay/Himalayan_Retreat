import React from 'react';
import { Container, CompassIcon, SparklesIcon, MountainIcon, TempleIcon, BedIcon, FoodIcon, CarIcon, APP_URLS } from '@shared';

import kasarTempleImg from '@shared/assets/images/kasar-devi-temple.jpg';
import kainchiImg from '@shared/assets/images/Kainchi-Dham.webp';
import jageshwarImg from '@shared/assets/images/Jageshwar-Mahamrityunjaya-Dham.jpg';
import trishulPeaksImg from '@shared/assets/images/Trishul-&-Nanda-Devi.jpg';
import hotelBestPic from '@shared/assets/images/hotel-best-pic.jpg';
import hotelInSnow from '@shared/assets/images/hotel-in-snow.jpg';

const DevBhoomiSection = () => {
  const spiritualPillars = [
    {
      id: 'kainchi',
      badge: 'Divine Grace & Service',
      saffronTag: '॥ श्री नीब करौरी महाराज धाम ॥',
      aartiSchedule: 'Mangala Aarti: 5:30 AM • Sandhya Aarti: 6:30 PM • Daily Prasad',
      title: 'Kainchi Dham Ashram',
      subtitle: '45 km from Almora • ~1.5 hrs Drive',
      icon: <SparklesIcon className="w-5 h-5 text-[#C84B0F]" />,
      image: kainchiImg,
      desc: 'Founded by Sri Neem Karoli Baba Maharaj in 1962 beside a quiet mountain river, Kainchi Dham is beloved across the world as a sanctuary of pure love, selfless service, and transformative grace. Pilgrims and seekers from all walks of life come for the peaceful daily aarti and blessed prasadam.',
      projectLink: 'Our private cabs arrange early morning transfers to reach the ashram in time for peaceful morning prayers and aarti.',
    },
    {
      id: 'jageshwar',
      badge: '124 Ancient Shiva Temples',
      saffronTag: '॥ जागेश्वर महामृत्युंजय ज्योतिर्लिंग ॥',
      aartiSchedule: 'Rudrabhishek: 6:00 AM • Sandhya Maha Aarti: 7:00 PM',
      title: 'Jageshwar Mahamrityunjaya Dham',
      subtitle: '35 km from Almora • ~1.2 hrs Drive',
      icon: <TempleIcon className="w-5 h-5 text-[#C84B0F]" />,
      image: jageshwarImg,
      desc: 'Hidden in a breathtaking valley of ancient, giant deodar trees, Jageshwar Dham is an 8th-century stone temple complex dedicated to Lord Shiva. As one of the ancient Jyotirlinga shrines, the air here is filled with the scent of wet cedar, mountain streams, and centuries of quiet devotion.',
      projectLink: 'Enjoy a scenic day trip through deodar forests with our experienced local drivers.',
    },
    {
      id: 'kasar',
      badge: 'Cosmic Energy & Silence',
      saffronTag: '॥ माँ कासार देवी शक्तिपीठ ॥',
      aartiSchedule: 'Daily Aarti: 7:00 AM & 6:30 PM • Dhyan Kendra Open All Day',
      title: 'Kasar Devi & Crank’s Ridge',
      subtitle: 'Altitude 6,942 FT • 800m Walk',
      icon: <CompassIcon className="w-5 h-5 text-[#C84B0F]" />,
      image: kasarTempleImg,
      desc: 'Known worldwide for its unique peaceful energy, Kasar Devi rests on a rare geomagnetic belt shared only with Stonehenge and Machu Picchu. In 1890, Swami Vivekananda walked here to meditate in deep silence. Today, travelers and families still find an extraordinary natural calm along its fragrant pine ridge.',
      projectLink: 'Our chalets are located directly on this peaceful ridge, just steps away from the temple footpath.',
    },
    {
      id: 'peaks',
      badge: 'Sacred Himalayan Crests',
      saffronTag: '॥ त्रिशूल एवं नन्दा देवी दर्शन ॥',
      aartiSchedule: 'Brahma Muhurta Darshan: 5:00 AM – 6:30 AM Golden Peak Glow',
      title: 'Trishul & Nanda Devi Panoramas',
      subtitle: '180° Snow Peak Horizon',
      icon: <MountainIcon className="w-5 h-5 text-[#C84B0F]" />,
      image: trishulPeaksImg,
      desc: 'The northern skyline is crowned by Mount Trishul (7,120m — the trident of Lord Shiva) and Mount Nanda Devi (7,816m — the revered goddess mountain of Uttarakhand). Watching the dawn sun turn these eternal snow giants into glowing gold is a deeply moving experience.',
      projectLink: 'Every room and private balcony at our retreat faces directly toward this sacred 180° Himalayan view.',
    },
  ];

  return (
    <section id="uttarakhand" className="py-20 sm:py-28 px-4 bg-gradient-to-b from-[#FDFBF7] via-[#FFF6EC]/70 to-[#FDFBF7] border-b border-[#C5A059]/20 relative overflow-hidden">
      {/* Subtle ambient lighting with warm saffron glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#C84B0F]/[0.07] rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-[#7C1D23]/[0.04] rounded-full blur-[120px] pointer-events-none"></div>

      {/* Subtle sacred symbols watermark (understated & serene) */}
      <div className="absolute top-20 -left-6 text-[#C84B0F]/[0.035] text-[180px] font-devanagari select-none pointer-events-none leading-none z-0">
        🔱
      </div>
      <div className="absolute bottom-24 -right-6 text-[#C84B0F]/[0.035] text-[200px] font-devanagari select-none pointer-events-none leading-none z-0">
        ॐ
      </div>

      <Container size="lg">
        {/* Section Devotional Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C84B0F]/15 via-[#C5A059]/20 to-[#C84B0F]/15 border border-[#C84B0F]/35 text-[#C84B0F] text-xs font-sans font-bold tracking-wider uppercase mb-4 shadow-xs">
            <span className="text-amber-500 animate-pulse text-xs">🪔</span>
            <span>॥ ॐ • देवभूमि उत्तराखण्ड • The Sacred Himalayan Realm • ॐ ॥</span>
            <span className="text-amber-500 animate-pulse text-xs">🪔</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2523] font-medium tracking-tight leading-tight mb-4">
            Dev Bhoomi — The Spiritual Heart of the Himalayas
          </h2>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C84B0F] to-transparent mx-auto my-4"></div>

          <p className="text-[#5C5350] text-base sm:text-lg leading-relaxed font-normal">
            For thousands of years, Uttarakhand has been revered as <em>Dev Bhoomi</em> — the Land of the Gods. It is the birthplace of sacred rivers, the abode of ancient Shiva shrines, and the mountain sanctuary where saints, yogis, and travelers come to find peace. Nestled high in Kumaon, Kasar Devi is the quiet, scenic center of this divine landscape.
          </p>
        </div>

        {/* 4 Spiritual Pillars Grid with Authentic Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 mb-16">
          {spiritualPillars.map((pillar) => (
            <div
              key={pillar.id}
              className="card-hover bg-[#FDFBF7] rounded-3xl p-6 sm:p-7 border border-[#C5A059]/25 hover:border-[#C84B0F]/40 flex flex-col justify-between shadow-xs relative group overflow-hidden transition-all duration-300"
            >
              <div>
                {/* Authentic Picture */}
                <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56 mb-5 border border-[#C5A059]/20 shadow-xs bg-[#FAF6EF]">
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B2838]/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-sans text-[#FDFBF7]">
                    <span className="font-medium tracking-wide bg-[#2C2523]/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {pillar.subtitle}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-[#DFCA9B] font-semibold">
                      {pillar.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#C84B0F]/10 border border-[#C84B0F]/30 flex items-center justify-center text-[#C84B0F] flex-shrink-0">
                      {pillar.icon}
                    </div>
                    <h3 className="font-serif text-2xl font-medium text-[#2C2523]">
                      {pillar.title}
                    </h3>
                  </div>
                </div>

                {/* Saffron Aarti & Darshan Schedule Ribbon */}
                <div className="mt-2.5 mb-3 p-2.5 rounded-xl bg-gradient-to-r from-[#C84B0F]/10 via-[#FAF6EF] to-[#C84B0F]/5 border border-[#C84B0F]/25 flex items-start gap-2 text-xs">
                  <span className="text-[#C84B0F] font-bold flex-shrink-0 mt-0.5">🪔</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#C84B0F] font-semibold text-[11px] font-sans uppercase tracking-wider">
                        Darshan & Aarti Timings:
                      </span>
                      <span className="text-[11px] text-[#C84B0F] font-devanagari font-semibold">
                        {pillar.saffronTag}
                      </span>
                    </div>
                    <span className="text-[#2C2523] font-medium text-xs leading-tight block mt-0.5">
                      {pillar.aartiSchedule}
                    </span>
                  </div>
                </div>

                <p className="text-[#5C5350] text-sm sm:text-base leading-relaxed mb-5 mt-2">
                  {pillar.desc}
                </p>
              </div>

              {/* How it relates to our project */}
              <div className="pt-4 border-t border-[#C5A059]/15 flex items-start gap-2.5 bg-[#FAF6EF]/60 -mx-6 -mb-6 sm:-mx-7 sm:-mb-7 p-4 sm:p-5 rounded-b-3xl">
                <SparklesIcon className="w-4 h-4 text-[#C84B0F] flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#2C2523] font-medium leading-snug">
                  <strong>At Our Retreat:</strong> {pillar.projectLink}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* The Devotional + Luxury Bridge Banner (Featuring Real Resort Photos) */}
        <div className="bg-gradient-to-r from-[#FAF6EF] via-[#FDFBF7] to-[#FAF6EF] rounded-3xl p-7 sm:p-10 lg:p-12 border border-[#C5A059]/40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="text-xs font-sans text-[#C5A059] uppercase tracking-wider font-semibold block mb-2">
                Devotional Reverence • Alpine Luxury
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2C2523] font-medium mb-4 leading-snug">
                Your Peaceful Home in Dev Bhoomi
              </h3>

              <p className="text-[#5C5350] text-base leading-relaxed mb-8">
                We created The Kasar Himalayan Heights so pilgrims, couples, and families can visit the sacred temples of Uttarakhand with complete peace of mind. Enjoy peaceful mountain silence with warm heated rooms and friendly service.
              </p>

              {/* 3 Luxury Touches */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#C5A059]/20">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059]/12 border border-[#C5A059]/30 flex items-center justify-center text-[#7C1D23] mb-3">
                    <BedIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#2C2523] mb-1">
                    Heated Chalet Suites
                  </h4>
                  <p className="text-xs text-[#6B615E] leading-relaxed">
                    Electric bed warmers, stone fireplaces, and 24/7 hot water for chilly mountain nights.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#C5A059]/20">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059]/12 border border-[#C5A059]/30 flex items-center justify-center text-[#7C1D23] mb-3">
                    <FoodIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#2C2523] mb-1">
                    Fresh Satvik Food
                  </h4>
                  <p className="text-xs text-[#6B615E] leading-relaxed">
                    Wholesome vegetarian meals, hot rotis, local mountain honey, and herbal evening teas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#C5A059]/20">
                  <div className="w-9 h-9 rounded-xl bg-[#C5A059]/12 border border-[#C5A059]/30 flex items-center justify-center text-[#7C1D23] mb-3">
                    <CarIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-serif text-base font-semibold text-[#2C2523] mb-1">
                    Private Hill Cabs
                  </h4>
                  <p className="text-xs text-[#6B615E] leading-relaxed">
                    Comfortable, clean cabs with respectful hill drivers for seamless Kainchi & Jageshwar darshan.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <a
                  href={APP_URLS.hotel}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] hover:from-[#E05A1B] hover:to-[#9E3304] text-[#FDFBF7] transition-all shadow-md inline-flex items-center gap-2 border border-[#C5A059]/40"
                >
                  <span>Explore Heated Suites</span>
                  <span className="text-sm leading-none text-[#DFCA9B]">↗</span>
                </a>

                <a
                  href="#routes"
                  className="px-6 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold border border-[#C84B0F]/40 bg-[#FDFBF7] text-[#2C2523] hover:text-[#C84B0F] hover:border-[#C84B0F] transition-all inline-flex items-center gap-2"
                >
                  <span>View Route Distances</span>
                  <span className="text-sm leading-none text-[#C84B0F]">↓</span>
                </a>
              </div>
            </div>

            {/* Right: Resort Showcase Photos */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 shadow-lg border border-[#C5A059]/30 group">
                <img
                  src={hotelBestPic}
                  alt="The Kasar Himalayan Heights Resort Exterior"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2838]/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#FDFBF7]">
                  <span className="font-serif text-sm font-medium">The Kasar Himalayan Heights</span>
                  <span className="bg-[#7C1D23]/80 px-2.5 py-0.5 rounded-full text-[11px] font-sans">6,942 FT</span>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden h-32 shadow-sm border border-[#C5A059]/25 group">
                <img
                  src={hotelInSnow}
                  alt="The Kasar Himalayan Heights in Winter Snow"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2838]/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-2.5 left-3 text-xs text-[#FDFBF7] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                  <span>Winter Snowfall at Our Kasar Ridge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default DevBhoomiSection;
