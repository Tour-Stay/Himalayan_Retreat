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
      tagline: '॥ माँ कासार देवी शक्तिपीठ • 6,942 FT ॥',
      distance: '800m Walking Trail from Retreat',
      image: kasarTempleImg,
      desc: 'A sacred hilltop temple and meditation caves blessed by Swami Vivekananda, famous for deep silence and grand views of snow-capped Mount Trishul and Nanda Devi.',
      timing: 'Open Daily for Silent Dhyan & Aarti',
    },
    {
      id: 'golu-devta',
      title: 'Chitai Golu Devta Temple',
      tagline: '॥ श्री गोलू देवता न्याय के देवता • अल्मोड़ा ॥',
      distance: '6 km from Retreat • ~15 mins Drive',
      image: goluDevtaImg,
      desc: 'Celebrated as the revered God of Justice across Kumaon. Devotees tie sacred brass bells and heartfelt petitions, filling the holy pine grove with divine vibrations.',
      timing: 'Open Daily 6:00 AM – 8:00 PM • Temple of Bells',
    },
    {
      id: 'jageshwar',
      title: 'Jageshwar Dham Temples',
      tagline: '॥ जागेश्वर महामृत्युंजय ज्योतिर्लिंग ॥',
      distance: '35 km from Almora • ~1.2 hrs Drive',
      image: jageshwarImg,
      desc: 'An ancient group of 124 sacred stone Shiva temples nestled inside tall deodar pine woods. Revered as a holy Mahamrityunjaya Dham filled with divine peace.',
      timing: 'Rudrabhishek 6:00 AM • Maha Aarti 7:00 PM',
    },
    {
      id: 'kainchi',
      title: 'Kainchi Dham Ashram',
      tagline: '॥ श्री नीब करौरी महाराज धाम ॥',
      distance: '45 km from Almora • ~1.5 hrs Drive',
      image: kainchiImg,
      desc: 'Established by Sri Neem Karoli Baba Maharaj in 1962 beside a quiet river valley. A beloved holy home of unconditional love, daily aarti, and sacred bhandara prasad.',
      timing: 'Morning Aarti 5:30 AM • Evening Sandhya 6:30 PM',
    },
  ];

  return (
    <section id="uttarakhand" className="py-20 sm:py-28 px-4 bg-[#12433B] border-b border-[#0D332D] text-white relative overflow-hidden">
      <Container size="lg">
        {/* Section Header with Golden Traditional Typography */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <p className="font-serif text-sm uppercase tracking-widest text-[#EAA722] font-semibold mb-3">
            ॥ देवभूमि उत्तराखण्ड • Sacred Pilgrim Realm ॥
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-tight mb-4">
            Holy Shrines of Kumaon
          </h2>

          <div className="w-20 h-0.5 bg-[#EAA722] mx-auto my-4"></div>

          <p className="font-serif text-lg sm:text-xl text-[#FAF5EC]/90 leading-relaxed font-normal">
            For generations, devotees and families have visited Devbhoomi Uttarakhand for peace and spiritual blessings. Kasar Devi sits peacefully at the heart of these holy temple journeys.
          </p>
        </div>

        {/* 4 Traditional Shrine Cards Arranged 2 Per Row for Majestic Presentation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 relative z-10 mb-16">
          {holyShrines.map((shrine) => (
            <div
              key={shrine.id}
              className="bg-[#0D332D] rounded-3xl p-6 sm:p-8 border border-[#EAA722]/30 hover:border-[#EAA722] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Traditional Image Frame */}
                <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 lg:h-80 mb-6 border border-[#EAA722]/30 bg-[#092420]">
                  <img
                    src={shrine.image}
                    alt={shrine.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 text-xs sm:text-sm font-serif text-[#FAF5EC]">
                    <span className="font-medium bg-[#541508]/90 px-3.5 py-1.5 rounded-full border border-[#EAA722]/40 backdrop-blur-xs shadow-md">
                      {shrine.distance}
                    </span>
                  </div>
                </div>

                {/* Tagline & Title */}
                <span className="font-devanagari text-sm sm:text-base font-semibold text-[#EAA722] block mb-1.5">
                  {shrine.tagline}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-3">
                  {shrine.title}
                </h3>

                <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/85 leading-relaxed mb-6 font-normal">
                  {shrine.desc}
                </p>
              </div>

              {/* Darshan & Aarti Ribbon */}
              <div className="pt-4 border-t border-[#EAA722]/20 text-sm sm:text-base font-serif text-[#EAA722] flex items-center gap-2.5">
                <span>🪔</span>
                <span>{shrine.timing}</span>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};

export default DevBhoomiSection;
