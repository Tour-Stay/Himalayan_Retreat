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

  const waypoints =
    settings?.landingContent?.mandirMala && settings.landingContent.mandirMala.length > 0
      ? settings.landingContent.mandirMala
      : WAYPOINTS;

  const activeStop = waypoints[activeIdx] || waypoints[0];

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

      <Container size="xl" className="relative z-10 max-w-[1380px] px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER: Things To Do */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white font-medium tracking-normal leading-tight">
            Things To Do
          </h2>

          <div className="flex items-center justify-center gap-3 my-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#EAA722]/60" />
            <span className="text-[#EAA722] text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#EAA722]/60" />
          </div>

          <p className="font-sans text-sm sm:text-base text-[#FAF5EC]/85 leading-relaxed font-normal max-w-2xl mx-auto">
            Explore the sacred 7-stop Himalayan pilgrimage ordered by distance from Haldwani (pickup) to the crown snow peak of Adi Kailash, with our luxury retreat at Kasar Devi as your central base.
          </p>
        </div>

        {/* MAIN BALANCED 2-COLUMN STAGE: 7 cols Map, 5 cols Detail with EQUAL HEIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mx-auto mb-6 relative z-10">

          {/* ==========================================================
              LEFT: ILLUSTRATED MANDIR MALA EXPEDITION MAP (7 Cols)
              ========================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <div className="w-full max-w-full lg:max-w-[590px] mx-auto flex flex-col h-full">
              {/* Column Heading: Mandir Mala */}
              <div className="w-full mb-3.5 flex items-center justify-between border-b border-[#EAA722]/25 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#EAA722] text-base">✦</span>
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#EAA722] font-medium tracking-wide">
                    Mandir Mala
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#2A0803] border border-[#EAA722]/30 text-[11px] sm:text-xs uppercase tracking-widest text-[#FAF5EC]/75 font-sans font-medium">
                  Sacred 7-Stop Circuit
                </span>
              </div>

              {/* The 2D Interactive Illustrated Map */}
              <MandirMalaMap2D
                activeIdx={activeIdx}
                onSelectStop={setActiveIdx}
                waypoints={waypoints}
              />
            </div>
          </div>

          {/* ==========================================================
              RIGHT: DYNAMIC WAYPOINT DETAIL DRAWER (5 Cols)
              ========================================================== */}
          <div className="lg:col-span-5 flex flex-col h-full justify-start">
            {/* Column Heading: Safe Nature Journey */}
            <div className="w-full mb-3.5 flex items-center justify-between border-b border-[#EAA722]/25 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-[#EAA722] text-base">✦</span>
                <h3 className="font-heading text-2xl sm:text-3xl text-[#EAA722] font-medium tracking-wide">
                  Safe Nature Journey
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#2A0803] border border-[#EAA722]/30 text-[11px] sm:text-xs uppercase tracking-widest text-[#FAF5EC]/75 font-sans font-medium">
                Stop {activeStop.num} of 07
              </span>
            </div>

            {/* Horizontal Scrollable Stop Selector Tabs */}
            <div className="w-full flex-shrink-0 mb-3.5">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full">
                {waypoints.map((wp, idx) => {
                  const isActive = activeIdx === idx;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => setActiveIdx(idx)}
                      className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-200 border cursor-pointer flex items-center gap-2 flex-shrink-0 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#EAA722] via-[#F5CA68] to-[#D4931A] text-[#240702] font-bold border-[#FFE394] shadow-[0_4px_16px_rgba(234,167,34,0.35)] scale-[1.02]'
                          : 'bg-[#2B0A04]/90 text-[#FAF5EC]/80 border-[#EAA722]/25 hover:border-[#EAA722]/70 hover:text-white hover:bg-[#3D0F06]'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-heading text-xs font-bold ${
                          isActive ? 'bg-[#240702]/25 text-[#240702]' : 'bg-[#EAA722]/15 text-[#EAA722]'
                        }`}
                      >
                        {wp.num}
                      </span>
                      <span className="font-sans font-medium">{wp.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTIVE WAYPOINT MASTER CARD */}
            <div className="bg-gradient-to-b from-[#340C04]/95 via-[#230602]/98 to-[#160301] rounded-3xl p-5 sm:p-7 border border-[#EAA722]/35 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(234,167,34,0.2)] relative overflow-hidden flex-1 flex flex-col justify-between">

              {/* Waypoint Content */}
              <div className="flex-1 flex flex-col justify-start">

                {/* Structured Specs Grid Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 pb-4 border-b border-[#EAA722]/20">
                  <div className="bg-[#1C0401]/85 border border-[#EAA722]/20 rounded-xl p-2 text-center flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#FAF5EC]/55 font-sans font-medium mb-0.5">
                      Waypoint
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#EAA722] font-sans">
                      Stop {activeStop.num} / 07
                    </span>
                  </div>

                  <div className="bg-[#1C0401]/85 border border-[#EAA722]/20 rounded-xl p-2 text-center flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#FAF5EC]/55 font-sans font-medium mb-0.5">
                      Altitude
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#FAF5EC] font-sans truncate">
                      {activeStop.altitude}
                    </span>
                  </div>

                  <div className="bg-[#1C0401]/85 border border-[#EAA722]/20 rounded-xl p-2 text-center flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#FAF5EC]/55 font-sans font-medium mb-0.5">
                      From Gateway
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#FAF5EC] font-sans truncate">
                      {activeStop.distance.split('•')[0].trim()}
                    </span>
                  </div>

                  <div className="bg-[#1C0401]/85 border border-[#EAA722]/20 rounded-xl p-2 text-center flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-wider text-[#FAF5EC]/55 font-sans font-medium mb-0.5">
                      From Kasar
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#EAA722] font-sans truncate">
                      {activeStop.fromHotel.replace('★ Your Retreat Base ★', 'Central Base')}
                    </span>
                  </div>
                </div>

                {/* Title & Artwork Subtitle */}
                <div className="mb-3">
                  <h3 className="font-heading text-2xl sm:text-3xl font-medium text-white mb-1.5 leading-snug">
                    {activeStop.name}
                  </h3>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-[#EAA722] font-sans tracking-[0.16em] uppercase font-semibold">
                      {activeStop.artworkLabel}
                    </p>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAA722]/10 border border-[#EAA722]/25 text-[11px] sm:text-xs text-[#FAF5EC]/85 font-serif">
                      {activeStop.shrineBlessing}
                    </span>
                  </div>
                </div>

                {/* Narrative Summary */}
                <p className="font-sans text-sm sm:text-[15px] text-[#FAF5EC]/90 leading-relaxed font-normal mb-4">
                  {activeStop.desc}
                </p>

                {/* Curated Highlights */}
                <div className="space-y-2.5 pt-3.5 border-t border-[#EAA722]/15 mb-4 flex-1">
                  <h4 className="text-xs sm:text-sm uppercase tracking-wider font-semibold text-[#EAA722] flex items-center gap-2 font-heading mb-2">
                    <span>✦</span>
                    <span>Curated Experiences &amp; Sacred Darshan</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#FAF5EC]/90 leading-relaxed font-sans">
                    {activeStop.highlights.map((item, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-[#EAA722] font-bold text-xs mt-0.5 flex-shrink-0">◆</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Actions and Safety Tip */}
              <div className="space-y-3.5 pt-3 mt-auto flex-shrink-0 border-t border-[#EAA722]/15">
                {/* Safe Nature Journey Tip Box */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#1C0401]/90 border border-[#EAA722]/25 flex items-start gap-3 shadow-inner">
                  <span className="text-lg sm:text-xl flex-shrink-0 text-[#EAA722] mt-0.5">🛡️</span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-semibold text-[#EAA722] uppercase tracking-wider mb-0.5 font-heading">
                      Mountain Concierge Advisory
                    </h5>
                    <p className="text-xs text-[#FAF5EC]/85 leading-relaxed font-sans">
                      {activeStop.safetyTip}
                    </p>
                  </div>
                </div>

                {/* Vehicle Booking Option: Stop 01 */}
                {activeStop.id === 'base-camp' && (
                  <div>
                    <a
                      href={APP_URLS.travel}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full btn-nkb-gold btn-shimmer py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <span>Book Chauffeured 4x4 Fleet</span>
                      <span className="text-base leading-none">↗</span>
                    </a>
                  </div>
                )}

                {/* Hotel Retreat Stay Option: Stop 03 */}
                {activeStop.id === 'kasar-devi' && (
                  <div>
                    <a
                      href={APP_URLS.hotel}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#EAA722] to-[#D4931A] text-[#240702] hover:brightness-110 text-center text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <span>Reserve Kasar Sanctuary Suite</span>
                      <span className="text-base leading-none">↗</span>
                    </a>
                  </div>
                )}

                {/* Excursion Booking Option: All other Stops (02, 04, 05, 06, 07) */}
                {activeStop.id !== 'base-camp' && activeStop.id !== 'kasar-devi' && (
                  <div>
                    <a
                      href={APP_URLS.travel}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 px-4 rounded-xl border border-[#EAA722]/70 text-[#EAA722] hover:bg-[#EAA722] hover:text-[#240702] text-center text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <span>Book Chauffeured Excursion to {activeStop.shortName}</span>
                      <span className="text-base leading-none">↗</span>
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ThingsToDoSection;
