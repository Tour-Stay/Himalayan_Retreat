import React from 'react';
import { Container, APP_URLS } from '@shared';

import kasarTempleImg from '@shared/assets/images/kasar-devi-temple.jpg';
import goluDevtaImg from '@shared/assets/images/Chitai_Golu_devta_Temple.jpg';
import jageshwarImg from '@shared/assets/images/Jageshwar-Mahamrityunjaya-Dham.jpg';
import kainchiImg from '@shared/assets/images/Kainchi-Dham.webp';

const DevBhoomiSection = () => {
  const holyShrines = [
    {
      id: 'kasar',
      title: 'Kasar Devi & Crank’s Ridge',
      tagline: 'Kasar Devi Ridge • 6,942 FT Elevation',
      distance: '800m Walking Trail from Retreat',
      image: kasarTempleImg,
      desc: 'A sacred hilltop temple and meditation caves blessed by Swami Vivekananda, celebrated for deep silence and grand views of snow-capped Mount Trishul and Nanda Devi.',
      timing: 'Open Daily for Silent Dhyan & Contemplation',
    },
    {
      id: 'golu-devta',
      title: 'Chitai Golu Devta Temple',
      tagline: 'Chitai Temple of Bells • Almora',
      distance: '6 km from Retreat • ~15 mins Drive',
      image: goluDevtaImg,
      desc: 'Celebrated as the revered God of Justice across Kumaon. Devotees hang brass bells and heartfelt petitions, filling the sacred pine groves with continuous chiming bells.',
      timing: 'Open Daily 6:00 AM – 8:00 PM • Temple of Bells',
    },
    {
      id: 'jageshwar',
      title: 'Jageshwar Dham Temples',
      tagline: 'Jata Ganga Valley • 124 Ancient Shrines',
      distance: '35 km from Almora • ~1.2 hrs Drive',
      image: jageshwarImg,
      desc: 'An ancient group of 124 sacred stone Shiva temples nestled inside tall deodar cedar woods. Revered as a holy Mahamrityunjaya Jyotirlinga valley filled with stillness.',
      timing: 'Temple Sanctum Open Daily 6:00 AM – 7:30 PM',
    },
    {
      id: 'kainchi',
      title: 'Kainchi Dham Ashram',
      tagline: 'Bhowali Valley • Neem Karoli Baba',
      distance: '45 km from Almora • ~1.5 hrs Drive',
      image: kainchiImg,
      desc: 'Established by Sri Neem Karoli Baba Maharaj in 1962 beside a tranquil mountain stream. A beloved sanctuary of unconditional love, daily evening prayers, and sacred hospitality.',
      timing: 'Ashram Gates Open Daily 6:00 AM – 7:00 PM',
    },
  ];

  return (
    <section id="uttarakhand" className="py-20 sm:py-28 px-3 sm:px-6 bg-[#541508] border-b border-[#3D0F06] text-white relative overflow-hidden ambient-glow-gold">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 space-y-4">
          <p className="editorial-eyebrow">
            Sacred Sites &bull; Dev Bhoomi Heritage
          </p>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl text-white font-semibold tracking-normal leading-tight sm:leading-snug">
            Holy Shrines of Kumaon
          </h2>

          <div className="w-20 h-0.5 bg-[#EAA722] mx-auto my-3"></div>

          <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/90 leading-[1.8] sm:leading-[1.85] font-normal">
            For generations, travelers and seekers have visited Uttarakhand for quietude and sacred blessings. The Kasar Devi ridge sits at the tranquil center of these historic mountain circuits.
          </p>
        </div>

        {/* 4 Traditional Shrine Cards Arranged 2 Per Row for Majestic Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 relative z-10 mb-12">
          {holyShrines.map((shrine) => (
            <div
              key={shrine.id}
              className="bg-[#3D0F06] rounded-3xl p-6 sm:p-8 lg:p-9 border border-[#EAA722]/30 luxury-card shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Traditional Image Frame with Zoom */}
                <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 lg:h-80 mb-6 border border-[#EAA722]/30 bg-[#2D0B04]">
                  <img
                    src={shrine.image}
                    alt={shrine.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 text-xs sm:text-sm font-serif text-[#FAF5EC]">
                    <span className="font-medium glass-frosted px-3.5 py-1.5 rounded-full border border-[#EAA722]/40 shadow-md inline-block">
                      {shrine.distance}
                    </span>
                  </div>
                </div>

                {/* Tagline & Title */}
                <span className="editorial-eyebrow block mb-2">
                  {shrine.tagline}
                </span>
                <h3 className="font-heading text-xl sm:text-2xl lg:text-3xl font-semibold text-white mb-3 leading-snug group-hover:text-[#EAA722] transition-colors">
                  {shrine.title}
                </h3>

                <p className="text-base sm:text-lg text-[#FAF5EC]/90 leading-[1.75] mb-6 font-normal">
                  {shrine.desc}
                </p>
              </div>

              {/* Timing Ribbon */}
              <div className="pt-4 border-t border-[#EAA722]/20 text-xs sm:text-sm text-[#EAA722] flex items-center gap-2">
                <span>✦</span>
                <span className="font-medium">{shrine.timing}</span>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};

export default DevBhoomiSection;
