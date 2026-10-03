import React from 'react';
import { Container, SectionHeading } from '@shared';

const PilgrimageItinerary = () => {
  return (
    <section id="itinerary" className="py-16 sm:py-24 px-4 bg-gradient-to-b from-[#FDFBF7] via-[#FFF7EE]/60 to-[#FDFBF7] border-b border-[#C5A059]/20 relative overflow-hidden">
      {/* Subtle sacred symbol watermark (understated & serene) */}
      <div className="absolute top-12 right-12 text-[#C84B0F]/[0.035] text-[180px] font-devanagari select-none pointer-events-none leading-none z-0">
        ॐ
      </div>

      <Container size="lg">
        <SectionHeading
          subtitle="॥ 🪔 पावन यात्रा संस्मरण • Sacred 3-Day Yatra 🪔 ॥"
          title="A 3-Day Pilgrimage to Kasar Devi & Kainchi Dham"
          description="A comfortable, easy itinerary covering Kainchi Dham aarti darshan, ancient Jageshwar Jyotirlinga, Kasar Devi sunrise, and relaxing heated chalet stays."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Day 1 */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 sm:p-7 border border-[#C5A059]/30 hover:border-[#C84B0F]/40 transition-all relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E05A1B] to-[#C84B0F] text-[#FDFBF7] flex items-center justify-center font-numeral font-bold text-sm mb-4 shadow-md shadow-[#C84B0F]/30 border border-[#FAF6EF]">
                01
              </div>
              <span className="text-xs font-sans text-[#C84B0F] uppercase tracking-wider font-semibold block mb-1">
                Day 1 • Arrival <span className="font-sans font-light">&</span> Kainchi Darshan
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523] mb-3">
                Kathgodam to Kainchi Dham <span className="font-sans font-light">&</span> Kasar
              </h3>
              <ul className="space-y-2 text-sm text-[#5C5350] leading-relaxed mb-4">
                <li>• On-time pickup from Kathgodam Railway Station by your private cab.</li>
                <li>• Scenic drive through pine hills with a stop at Kainchi Dham Ashram for evening aarti.</li>
                <li>• Arrive at The Kasar Himalayan Heights with a warm cup of herbal tea.</li>
                <li>• Warm heated room check-in and fresh satvik vegetarian dinner.</li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#C5A059]/20 text-xs font-sans text-[#6B615E] font-medium flex items-center justify-between">
              <span>Distance: 85 km • ~ 3 hrs drive</span>
              <span className="text-[#C84B0F] font-semibold">🪔 Kainchi Aarti</span>
            </div>
          </div>

          {/* Day 2 */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 sm:p-7 border border-[#C5A059]/30 hover:border-[#C84B0F]/40 transition-all relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E05A1B] to-[#C84B0F] text-[#FDFBF7] flex items-center justify-center font-numeral font-bold text-sm mb-4 shadow-md shadow-[#C84B0F]/30 border border-[#FAF6EF]">
                02
              </div>
              <span className="text-xs font-sans text-[#C84B0F] uppercase tracking-wider font-semibold block mb-1">
                Day 2 • Sunrise <span className="font-sans font-light">&</span> Jageshwar Temples
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523] mb-3">
                Trishul Sunrise <span className="font-sans font-light">&</span> Jageshwar Dham
              </h3>
              <ul className="space-y-2 text-sm text-[#5C5350] leading-relaxed mb-4">
                <li>• Watch the golden sunrise over Trishul and Nanda Devi from your private balcony.</li>
                <li>• Morning walk to the famous Kasar Devi Temple and Vivekananda Caves.</li>
                <li>• Day trip by car through pine and cedar forests to the ancient Jageshwar Dham temples.</li>
                <li>• Cozy evening by the fireplace with hot tea and mountain views.</li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#C5A059]/20 text-xs font-sans text-[#6B615E] font-medium flex items-center justify-between">
              <span>Day trip: 70 km round-trip</span>
              <span className="text-[#C84B0F] font-semibold">🔱 Shiva Darshan</span>
            </div>
          </div>

          {/* Day 3 */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 sm:p-7 border border-[#C5A059]/30 hover:border-[#C84B0F]/40 transition-all relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E05A1B] to-[#C84B0F] text-[#FDFBF7] flex items-center justify-center font-numeral font-bold text-sm mb-4 shadow-md shadow-[#C84B0F]/30 border border-[#FAF6EF]">
                03
              </div>
              <span className="text-xs font-sans text-[#C84B0F] uppercase tracking-wider font-semibold block mb-1">
                Day 3 • Nature Walk <span className="font-sans font-light">&</span> Return
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523] mb-3">
                Forest Walk <span className="font-sans font-light">&</span> Station Drop
              </h3>
              <ul className="space-y-2 text-sm text-[#5C5350] leading-relaxed mb-4">
                <li>• Gentle morning walk along the quiet pine trails of Crank’s Ridge.</li>
                <li>• Freshly prepared mountain breakfast with hot parathas and local honey.</li>
                <li>• Relaxed check-out with friendly help from our staff.</li>
                <li>• Smooth return drive to Kathgodam in time for your train back home.</li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#C5A059]/20 text-xs font-sans text-[#6B615E] font-medium flex items-center justify-between">
              <span>Return: 85 km • On-time station drop</span>
              <span className="text-[#C84B0F] font-semibold">🪔 Shubh Yatra</span>
            </div>
          </div>
        </div>

        {/* Sacred Yatra Blessing & Assistance Banner */}
        <div className="mt-12 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#C84B0F]/10 via-[#FAF6EF] to-[#C84B0F]/10 border border-[#C84B0F]/30 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C84B0F]/15 border border-[#C84B0F]/30 flex items-center justify-center text-2xl flex-shrink-0">
              🪔
            </div>
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#2C2523] flex items-center justify-center sm:justify-start gap-2">
                <span>Dev Bhoomi Yatra Blessings & Concierge</span>
                <span className="text-xs font-devanagari text-[#C84B0F] font-semibold">॥ शुभ यात्रा ॥</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#5C5350] mt-1 leading-relaxed">
                All pilgrims and guests staying at our retreat receive morning temple flower assistance, consecrated Rudraksha, and guidance for Kainchi Dham and Jageshwar Dham aarti timings.
              </p>
            </div>
          </div>
          <a
            href="#enquiry"
            className="px-6 py-2.5 rounded-full text-xs font-sans uppercase font-bold tracking-wider bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] hover:from-[#E05A1B] hover:to-[#9E3304] text-[#FDFBF7] shadow-md hover:scale-102 transition-all flex-shrink-0 border border-[#C5A059]/30"
          >
            Plan Yatra on WhatsApp ↗
          </a>
        </div>
      </Container>
    </section>
  );
};

export default PilgrimageItinerary;
