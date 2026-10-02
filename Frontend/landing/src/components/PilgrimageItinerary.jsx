import React from 'react';
import { Container, SectionHeading } from '@shared';

const PilgrimageItinerary = () => {
  return (
    <section id="itinerary" className="py-16 sm:py-24 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20">
      <Container size="lg">
        <SectionHeading
          subtitle="Sample 3-Day Plan"
          title="A 3-Day Trip to Kasar Devi & Kainchi Dham"
          description="A comfortable, easy itinerary covering Kainchi Dham darshan, Jageshwar temples, Kasar Devi sunrise, and relaxing heated room stays."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Day 1 */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 sm:p-7 border border-[#C5A059]/30 relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-9 h-9 rounded-full bg-[#7C1D23] text-[#FDFBF7] flex items-center justify-center font-numeral font-bold text-sm mb-4 shadow-sm">
                01
              </div>
              <span className="text-xs font-sans text-[#C5A059] uppercase tracking-wider font-semibold block mb-1">
                Day 1 • Arrival <span className="font-sans font-light">&</span> Kainchi Darshan
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523] mb-3">
                Kathgodam to Kainchi Dham <span className="font-sans font-light">&</span> Kasar
              </h3>
              <ul className="space-y-2 text-sm text-[#5C5350] leading-relaxed mb-4">
                <li>• On-time pickup from Kathgodam Railway Station by your private cab.</li>
                <li>• Scenic drive through pine hills with a stop at Kainchi Dham Ashram for evening aarti.</li>
                <li>• Arrive at The Kasar Himalayan Heights with a warm cup of herbal tea.</li>
                <li>• Warm heated room check-in and fresh vegetarian dinner.</li>
              </ul>
            </div>
            <div className="pt-3 border-t border-[#C5A059]/20 text-xs font-sans text-[#6B615E] font-medium">
              Distance: 85 km • ~ 3 hrs drive
            </div>
          </div>

          {/* Day 2 */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 sm:p-7 border border-[#C5A059]/30 relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-9 h-9 rounded-full bg-[#7C1D23] text-[#FDFBF7] flex items-center justify-center font-numeral font-bold text-sm mb-4 shadow-sm">
                02
              </div>
              <span className="text-xs font-sans text-[#C5A059] uppercase tracking-wider font-semibold block mb-1">
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
            <div className="pt-3 border-t border-[#C5A059]/20 text-xs font-sans text-[#6B615E] font-medium">
              Day trip: 70 km round-trip
            </div>
          </div>

          {/* Day 3 */}
          <div className="bg-[#FAF6EF] rounded-2xl p-6 sm:p-7 border border-[#C5A059]/30 relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-9 h-9 rounded-full bg-[#7C1D23] text-[#FDFBF7] flex items-center justify-center font-numeral font-bold text-sm mb-4 shadow-sm">
                03
              </div>
              <span className="text-xs font-sans text-[#C5A059] uppercase tracking-wider font-semibold block mb-1">
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
            <div className="pt-3 border-t border-[#C5A059]/20 text-xs font-sans text-[#6B615E] font-medium">
              Return: 85 km • On-time station drop
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PilgrimageItinerary;
