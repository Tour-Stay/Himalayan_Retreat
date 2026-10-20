import { useState } from 'react';
import { Container, APP_URLS, useSiteSettings } from '@shared';
import MandirMalaMap2D from './MandirMalaMap2D';

// The 7 Route Stops faithfully cataloged from the Mandir Mala 2026 artwork
// Distances calculated from Haldwani (Gateway Pickup) and our Hotel at Kasar Devi
const WAYPOINTS = [
  {
    id: 'base-camp',
    num: '01',
    name: 'River Base Camp (Haldwani)',
    shortName: 'Haldwani Base',
    artworkLabel: 'EXPEDITION GATEWAY • THE JOURNEY BEGINS',
    distance: '0 km • Pickup Point',
    fromHotel: '88 km to Kasar Hotel',
    altitude: '1,450 FT',
    desc: 'The official pickup hub and journey start where the plains meet the first pine foothills. Open campfire chai, vehicle prep, and mountain briefing along rushing glacial waters.',
    highlights: [
      'Primary railway (Kathgodam) & cab pickup hub from Delhi/plains.',
      'Campfire chai orientation and mountain safety guidance.',
      'Scenic departure orientation and sacred route guidance for the Kumaon circuit.',
    ],
    safetyTip: 'Start mountain ascent in early daylight; hydrate well as elevation climbs.',
    shrineBlessing: 'ॐ तत्सत् • Om Tat Sat',
  },
  {
    id: 'kainchi-dham',
    num: '02',
    name: 'Kainchi Dham Ashram',
    shortName: 'Kainchi Dham',
    artworkLabel: 'SANCTUARY OF BABA NEEM KAROLI MAHARAJ',
    distance: '42 km from Haldwani',
    fromHotel: '46 km to Kasar Hotel',
    altitude: '4,600 FT',
    desc: 'World-renowned spiritual sanctuary of Sri Neem Karoli Baba Maharaj in the Shipra river canyon. A sacred haven of selfless love, deep stillness, and miraculous grace.',
    highlights: [
      'Darshan of Baba Neem Karoli Maharaj sanctum & Hanuman temple.',
      'Peaceful japa and contemplation along sacred Shipra stream.',
      'Participating in evening aarti and receiving satvik prasad.',
    ],
    safetyTip: 'Narrow canyon route with devotee traffic; use licensed mountain chauffeurs.',
    shrineBlessing: 'जय बाबा नीम करोली • Jai Gurudev',
  },
  {
    id: 'kasar-devi',
    num: '03',
    name: 'The Kasar Himalayan Heights',
    shortName: 'Kasar Hotel Base',
    artworkLabel: "OUR RETREAT HOTEL • CRANK'S RIDGE",
    distance: '88 km from Haldwani',
    fromHotel: '★ Your Retreat Base ★',
    altitude: '6,942 FT',
    desc: 'Our boutique heated chalet hotel perched on Crank’s Ridge with 180° Greater Himalayan snow peak panoramas and unique geomagnetic cosmic energy (Van Allen belt).',
    highlights: [
      'Heated wooden chalet suites with direct Nanda Devi sunrise views.',
      'Silent meditation inside the 1890 Swami Vivekananda Rock Cave.',
      'Central launchpad for daily excursions to Chitai, Jageshwar & beyond.',
    ],
    safetyTip: 'Central expedition base. Keep warm fleece layers ready for evening mountain breezes.',
    shrineBlessing: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे • Kasar Devi Sharanam',
  },
  {
    id: 'chitai-golu',
    num: '04',
    name: 'Chitai Golu Devta Mandir',
    shortName: 'Chitai Golu',
    artworkLabel: 'TEMPLE OF 10,000 BRASS BELLS',
    distance: '98 km from Haldwani',
    fromHotel: '10 km from Kasar Hotel (~20 min)',
    altitude: '6,200 FT',
    desc: 'The supreme spiritual court of Kumaon where Lord Golu dispenses swift justice. The hill reverberates continuously with thousands of brass bells hung by grateful devotees.',
    highlights: [
      'Ringing the sacred brass temple bells to awaken divine consciousness.',
      'Reading handwritten stamp-paper petitions hung by pilgrims.',
      'Walking beneath the ancient deodar cedar canopy surrounding the hill.',
    ],
    safetyTip: 'Just 10 km from our retreat; an effortless morning or afternoon cultural drive.',
    shrineBlessing: 'जय गोलू देवता • Nyay ke Devta',
  },
  {
    id: 'jageshwar-dham',
    num: '05',
    name: 'Jageshwar Dham Temples',
    shortName: 'Jageshwar Dham',
    artworkLabel: '124 ANCIENT 8TH-CENTURY STONE SHRINES',
    distance: '125 km from Haldwani',
    fromHotel: '36 km from Kasar Hotel (~1 hr)',
    altitude: '6,140 FT',
    desc: 'Nestled in a sheltered deodar valley along the Jata Ganga river, housing 124 monolithic stone Nagara-style temples dedicated to Lord Shiva as Mahamrityunjaya.',
    highlights: [
      'Darshan at the sacred Mahamrityunjaya Jyotirlinga sanctum.',
      'Deep deodar forest bathing (Shinrin-yoku) along the gentle river.',
      'Studying 8th-century Katyuri stone monolithic carvings and spires.',
    ],
    safetyTip: 'Valley floor is 4-6°C cooler than Almora; bring warm layers and wrap up by dusk.',
    shrineBlessing: 'ॐ नमः शिवाय • Har Har Mahadev',
  },
  {
    id: 'patal-bhuvaneshwar',
    num: '06',
    name: 'Patal Bhuvaneshwar Cave',
    shortName: 'Patal Cave',
    artworkLabel: 'SUBTERRANEAN LIMESTONE SANCTUM',
    distance: '195 km from Haldwani',
    fromHotel: '110 km from Kasar Hotel (~3.5 hrs)',
    altitude: '4,430 FT (Sanctum 90 FT Underground)',
    desc: 'An awe-inspiring underground limestone cavern entered via steep chain-assisted passages, where the Skanda Purana describes the presence of all 33 koti deities in stone.',
    highlights: [
      'Descend 90 ft underground via steep iron-chain rock passage.',
      'Darshan of natural rock formations of Sheshnag and Shiva’s locks.',
      'Suspension footbridge view over the dramatic wild mountain gorge.',
    ],
    safetyTip: 'Requires moderate agility and rubber-sole shoes; not suited for acute claustrophobia.',
    shrineBlessing: 'ॐ भुवनपतये नमः • Cave Sanctum',
  },
  {
    id: 'adi-kailash',
    num: '07',
    name: 'Adi Kailash & Om Parvat',
    shortName: 'Adi Kailash',
    artworkLabel: 'THE CROWNING HIGH-HIMALAYAN PEAK',
    distance: '365 km from Haldwani',
    fromHotel: '275 km from Kasar Hotel (High Traverse)',
    altitude: '14,750 FT',
    desc: 'The crowning jewel of the Mandir Mala circuit in the frontier borderlands. The sacred pyramidal twin of Mount Kailash with crystal Parvati Sarovar and miraculous Om Parvat.',
    highlights: [
      'Sacred parikrama circumambulation around Parvati Sarovar at 14,500+ ft.',
      'Darshan of the miraculous natural snow-formed "Om" on Om Parvat.',
      'High-altitude 4x4 traverse through Dharchula, Gunji and Kali river gorges.',
    ],
    safetyTip: 'Inner Line Permit (ILP), dedicated 4x4 SUV, and acclimatization halt at Gunji mandatory.',
    shrineBlessing: 'ॐ नमः शिवाय • Jai Badri Vishal',
  },
];

const ThingsToDoSection = () => {
  const { settings } = useSiteSettings();
  const [activeIdx, setActiveIdx] = useState(0); // Starts at Base Camp (01)

  const activeStop = WAYPOINTS[activeIdx] || WAYPOINTS[0];

  return (
    <section
      id="things-to-do"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#541508] border-b border-[#3D0F06] text-white relative overflow-hidden w-full max-w-full ambient-glow-gold"
    >
      {/* Anchor for backward compatibility with #itinerary links */}
      <span id="itinerary" className="absolute -top-24 pointer-events-none" />

      {/* Ambient Mountain Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full bg-gradient-to-br from-[#EAA722]/20 via-[#7A1F0D]/30 to-transparent blur-3xl" />
      </div>

      <Container size="xl" className="relative z-10 max-w-[1520px]">
        {/* SECTION HEADER: Balanced & Elegant */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 relative z-10 space-y-2.5">
          <p className="editorial-eyebrow flex items-center justify-center gap-2 text-xs tracking-[0.2em]">
            <span className="text-[#EAA722]">✦</span>
            <span>MANDIR MALA 2026 • KUMAON EXPEDITION CIRCUIT</span>
            <span className="text-[#EAA722]">✦</span>
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight tracking-normal">
            Haldwani to Adi Kailash via Kasar Retreat
          </h2>

          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#EAA722] to-transparent mx-auto my-2" />

          <p className="font-serif text-sm sm:text-base text-[#FAF5EC]/85 leading-relaxed font-normal max-w-2xl mx-auto">
            Explore the sacred 7-stop Himalayan pilgrimage ordered by distance from Haldwani (pickup) to the crown snow peak of Adi Kailash, with our luxury retreat at Kasar Devi as your central base.
          </p>
        </div>

        {/* MAIN BALANCED 2-COLUMN STAGE: 7 cols Map, 5 cols Detail with EQUAL HEIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch max-w-[1400px] mx-auto mb-6 relative z-10">

          {/* ==========================================================
              LEFT: ILLUSTRATED MANDIR MALA EXPEDITION MAP (7 Cols)
              ========================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-start items-center">

            {/* The 2D Interactive Illustrated Map */}
            <MandirMalaMap2D
              activeIdx={activeIdx}
              onSelectStop={setActiveIdx}
              waypoints={WAYPOINTS}
            />
          </div>

          {/* ==========================================================
              RIGHT: DYNAMIC WAYPOINT DETAIL DRAWER (5 Cols)
              ========================================================== */}
          <div className="lg:col-span-5 flex flex-col h-full">

            {/* Horizontal Scrollable Stop Selector Tabs */}
            <div className="w-full flex-shrink-0 mb-3">
              <div className="text-xs sm:text-sm text-[#EAA722] uppercase tracking-wider font-semibold mb-2.5 flex items-center justify-between font-serif">
                <span>Select Expedition Waypoint</span>
                <span className="text-white/60 text-xs font-mono">Stop {activeIdx + 1} of 7</span>
              </div>

              {/* Scrollable Tab Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#EAA722]/30 w-full">
                {WAYPOINTS.map((wp, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer flex items-center gap-1.5 ${isActive
                        ? 'bg-[#EAA722] text-[#3D0F06] font-bold border-[#EAA722] shadow-[0_0_15px_rgba(234,167,34,0.4)] scale-102'
                        : 'bg-[#3D0F06]/85 text-[#FAF5EC]/85 border-[#EAA722]/30 hover:border-[#EAA722] hover:text-white'
                        }`}
                    >
                      <span className="font-serif font-bold text-xs opacity-75">{wp.num}</span>
                      <span>{wp.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTIVE WAYPOINT MASTER CARD: flex-1 to match left height perfectly */}
            <div className="bg-gradient-to-br from-[#541508] via-[#3D0F06] to-[#240702] rounded-2xl p-6 sm:p-7 lg:p-8 border border-[#EAA722]/35 luxury-card shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between">

              {/* Waypoint Content */}
              <div className="flex-1 flex flex-col justify-start">
                {/* Header Meta Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3.5">
                  <span className="px-3.5 py-1.5 rounded-full bg-[#EAA722] text-[#3D0F06] font-serif font-bold text-xs sm:text-sm shadow-md">
                    STOP {activeStop.num}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#240702] text-[#EAA722] border border-[#EAA722]/30 text-xs sm:text-sm font-medium">
                    📍 {activeStop.distance}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#240702] text-[#FAF5EC]/90 border border-[#EAA722]/20 text-xs sm:text-sm font-medium">
                    🏔️ {activeStop.altitude}
                  </span>
                  {activeStop.fromHotel && (
                    <span className="px-3.5 py-1.5 rounded-full bg-[#EAA722]/15 text-[#EAA722] border border-[#EAA722]/35 text-xs sm:text-sm font-medium">
                      🏨 {activeStop.fromHotel}
                    </span>
                  )}
                </div>

                {/* Title & Tag */}
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-1.5 leading-snug">
                  {activeStop.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#EAA722] font-serif tracking-widest uppercase mb-3.5 font-semibold">
                  {activeStop.artworkLabel}
                </p>

                {/* Narrative Summary */}
                <p className="font-serif text-base sm:text-[17px] text-[#FAF5EC]/95 leading-[1.8] font-normal mb-5">
                  {activeStop.desc}
                </p>

                {/* Curated Highlights */}
                <div className="space-y-3 pt-4 border-t border-[#EAA722]/20 mb-4 flex-1">
                  <h4 className="text-xs sm:text-sm uppercase tracking-wider font-bold text-[#EAA722] flex items-center gap-2 font-serif mb-2.5">
                    <span>✦</span>
                    <span>Curated Highlights &amp; Sacred Experiences</span>
                  </h4>
                  <ul className="space-y-2.5 text-sm sm:text-base text-[#FAF5EC]/90 leading-relaxed font-serif">
                    {activeStop.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5">
                        <span className="text-[#EAA722] font-bold text-sm mt-0.5 flex-shrink-0">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions and Safety Tip */}
              <div className="space-y-4 pt-3 mt-auto flex-shrink-0 border-t border-[#EAA722]/15">
                {/* Safe Nature Journey Tip Box */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#240702]/85 border border-[#EAA722]/30 flex items-start gap-3 shadow-inner">
                  <span className="text-xl sm:text-2xl flex-shrink-0 text-[#EAA722]">🛡️</span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#EAA722] uppercase tracking-wider mb-1 font-serif">
                      Mountain Guidance &amp; Safety Note
                    </h5>
                    <p className="text-xs sm:text-sm text-[#FAF5EC]/90 leading-relaxed font-serif">
                      {activeStop.safetyTip}
                    </p>
                  </div>
                </div>

                {/* Vehicle Booking Option: ONLY on Pickup Point (Stop 01) */}
                {activeStop.id === 'base-camp' && (
                  <div className="pt-1">
                    <a
                      href={APP_URLS.travel}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full btn-nkb-gold btn-shimmer py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap sm:whitespace-normal"
                    >
                      <span>Book Chauffeured 4x4 Fleet</span>
                      <span className="text-base leading-none">↗</span>
                    </a>
                  </div>
                )}

                {/* Hotel Retreat Stay Option: ONLY on Retreat Hotel Point (Stop 03) */}
                {activeStop.id === 'kasar-devi' && (
                  <div className="pt-1">
                    <a
                      href={APP_URLS.hotel}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 px-4 rounded-xl border border-[#EAA722]/70 text-[#EAA722] hover:bg-[#EAA722] hover:text-[#3D0F06] text-center text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap sm:whitespace-normal"
                    >
                      <span>Stay at Kasar Retreat</span>
                      <span className="text-base leading-none">↗</span>
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Quick hint centered below both columns */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#FAF5EC]/75 font-serif text-center">
          <span className="text-[#EAA722]">💡</span>
          <span>Click any sanctuary on the map or use tabs &amp; Prev/Next to explore stops.</span>
        </div>
      </Container>
    </section>
  );
};

export default ThingsToDoSection;
