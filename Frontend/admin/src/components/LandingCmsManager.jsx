import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient, APP_URLS } from '@shared';
import { useToast } from './Toast';

// Canonical 7 Sacred Stops for Mandir Mala
const DEFAULT_MANDIR_MALA = [
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

export const LandingCmsManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const toastContext = useToast();
  const showToast = toastContext.addToast || toastContext.showToast;

  const [activeSubTab, setActiveSubTab] = useState('mandirMala'); // 'mandirMala' | 'faqs'
  const [selectedStopIdx, setSelectedStopIdx] = useState(0);

  // 1. Mandir Mala 7-Stop State
  const [mandirMala, setMandirMala] = useState(DEFAULT_MANDIR_MALA);

  // 2. FAQs State
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.landingContent?.mandirMala && settings.landingContent.mandirMala.length > 0) {
      setMandirMala(settings.landingContent.mandirMala);
    }

    if (settings?.landingContent?.faqs && settings.landingContent.faqs.length > 0) {
      setFaqs(settings.landingContent.faqs);
    } else {
      setFaqs([
        {
          q: 'How do I arrange a darshan at Kainchi Dham Ashram from The Kasar Himalayan Heights?',
          a: 'Kainchi Dham Ashram is located 45 km (~1.5 hrs scenic drive). Our private cabs depart early morning for tranquil aarti and darshan.',
        },
        {
          q: 'Are the suites properly heated during the winter months (November to February)?',
          a: 'Yes. All rooms include dual-zone electric heating, radiators, 24/7 hot water, and select suites feature cozy wood-burning fireplaces.',
        },
        {
          q: 'Can your chauffeured cabs pick us up directly from Kathgodam Railway Station?',
          a: 'Yes. Our hill chauffeurs provide direct platform pickup with luggage assistance for Kathgodam trains (85 km, ~3 hrs drive) and Pantnagar Airport.',
        },
        {
          q: 'What makes Kasar Devi and Crank’s Ridge so special for peace and meditation?',
          a: 'Kasar Devi is world-famous for its natural spiritual calm and deep silence, where Swami Vivekananda and seekers from across the world came to meditate facing the Himalayas.',
        },
        {
          q: 'What kind of food is served? Is pure Satvik and vegetarian food available?',
          a: 'We serve freshly prepared North Indian and local Kumaoni dishes. Pure Satvik food (no onion, no garlic) and fasting meals are available upon request.',
        },
        {
          q: 'What is the best season to view the 180° snow peaks of Trishul and Nanda Devi?',
          a: 'October to March offers crystal-clear panoramic views of Mount Trishul and Nanda Devi right across your private balcony.',
        },
      ]);
    }
  }, [settings]);

  // Mandir Mala Stop Handlers
  const handleUpdateStop = (index, field, value) => {
    setMandirMala((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUpdateHighlight = (stopIdx, hlIdx, value) => {
    setMandirMala((prev) => {
      const updated = [...prev];
      const highlights = [...(updated[stopIdx].highlights || [])];
      highlights[hlIdx] = value;
      updated[stopIdx] = { ...updated[stopIdx], highlights };
      return updated;
    });
  };

  const handleAddHighlight = (stopIdx) => {
    setMandirMala((prev) => {
      const updated = [...prev];
      const highlights = [...(updated[stopIdx].highlights || []), 'New sacred experience'];
      updated[stopIdx] = { ...updated[stopIdx], highlights };
      return updated;
    });
  };

  const handleRemoveHighlight = (stopIdx, hlIdx) => {
    setMandirMala((prev) => {
      const updated = [...prev];
      const highlights = (updated[stopIdx].highlights || []).filter((_, i) => i !== hlIdx);
      updated[stopIdx] = { ...updated[stopIdx], highlights };
      return updated;
    });
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    if (!newFaq.q.trim() || !newFaq.a.trim()) return;
    setFaqs((prev) => [...prev, { ...newFaq }]);
    setNewFaq({ q: '', a: '' });
  };

  const handleRemoveFaq = (index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateFaq = (index, field, value) => {
    setFaqs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Save Mandir Mala and FAQ to Database
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.patch('/settings/landingContent', {
        mandirMala,
        faqs,
      });

      showToast('Mandir Mala circuit & FAQs published live to Landing Page!', 'success');
      await refreshSettings();
    } catch (err) {
      console.error('Error saving landing content:', err);
      showToast(err.response?.data?.message || 'Failed to update content', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Website Banner Header */}
      <div className="bg-white border border-[#C5A059]/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#0B1118] text-[#C5A059] flex items-center justify-center border border-[#C5A059]/40 shadow-xs shrink-0">
            <svg className="w-5 h-5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0F172A]">
                Mandir Mala &amp; Visitor FAQ CMS
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-cinzel font-bold bg-[#FAF8F5] text-[#C5A059] border border-[#C5A059]/40 tracking-wider">
                Landing Page
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage the 7-stop Mandir Mala pilgrimage circuit and visitor FAQs displayed on the main website.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <a
            href={APP_URLS.landing}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 text-xs font-cinzel font-semibold bg-[#FAF8F5] hover:bg-white text-[#0F172A] border border-slate-300 transition shadow-2xs flex items-center gap-1.5"
            title="Open Main Website in a new tab"
          >
            <span>Open Website</span>
            <span className="text-[#C5A059] font-bold">↗</span>
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 text-xs font-cinzel font-bold bg-[#0B1118] hover:bg-[#111827] text-white border border-[#C5A059]/40 transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>Publish Changes</span>
                <span className="text-[#C5A059]">✓</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#C5A059]/30 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('mandirMala')}
          className={`px-4 py-2 text-xs font-cinzel font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'mandirMala'
              ? 'bg-[#0B1118] text-white border border-[#C5A059]/50 shadow-xs font-bold'
              : 'text-slate-600 hover:text-[#0F172A] hover:bg-[#FAF8F5] border border-transparent'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>1. Mandir Mala Circuit (7 Sacred Stops)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('faqs')}
          className={`px-4 py-2 text-xs font-cinzel font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'faqs'
              ? 'bg-[#0B1118] text-white border border-[#C5A059]/50 shadow-xs font-bold'
              : 'text-slate-600 hover:text-[#0F172A] hover:bg-[#FAF8F5] border border-transparent'
          }`}
        >
          <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>2. Visitor Questions ({faqs.length})</span>
        </button>
      </div>

      {/* Tab 1: Mandir Mala Circuit (7 Stops) */}
      {activeSubTab === 'mandirMala' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-4 sm:p-6 border border-[#C5A059]/30 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C5A059]/20 pb-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#0F172A] flex items-center gap-2">
                  <span>Mandir Mala 7-Stop Sacred Himalayan Expedition</span>
                  <span className="px-2.5 py-0.5 text-[10px] font-cinzel font-bold bg-[#FAF8F5] text-[#C5A059] border border-[#C5A059]/40 tracking-wider">
                    7 Stops
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Controls the live interactive 2D map and waypoint detail drawer displayed on the Landing page.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-[#0F172A] bg-[#FAF8F5] px-3 py-1 border border-[#C5A059]/30 self-start sm:self-center">
                Stop {mandirMala[selectedStopIdx]?.num || '01'} of 07 Selected
              </span>
            </div>

            {/* Stop Selector Tabs (01 to 07) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
              {mandirMala.map((stop, sIdx) => {
                const isSelected = selectedStopIdx === sIdx;
                return (
                  <button
                    key={stop.id || sIdx}
                    type="button"
                    onClick={() => setSelectedStopIdx(sIdx)}
                    className={`px-3.5 py-2 text-xs font-cinzel font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-2 flex-shrink-0 border ${
                      isSelected
                        ? 'bg-[#0B1118] text-[#C5A059] border-[#C5A059] shadow-xs font-bold'
                        : 'bg-[#FAF8F5] text-slate-700 hover:text-[#0F172A] hover:bg-white border-slate-300'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isSelected ? 'bg-[#C5A059] text-[#0B1118]' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {stop.num || `0${sIdx + 1}`}
                    </span>
                    <span>{stop.shortName || stop.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Currently Selected Stop Editing Form */}
            {(() => {
              const stop = mandirMala[selectedStopIdx] || mandirMala[0];
              const sIdx = selectedStopIdx;
              if (!stop) return null;

              return (
                <div className="bg-[#FAF8F5] p-4 sm:p-6 border border-slate-300 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 bg-[#0B1118] text-[#C5A059] font-serif font-bold text-sm flex items-center justify-center border border-[#C5A059]/30">
                        {stop.num}
                      </span>
                      <div>
                        <span className="font-serif text-base font-bold text-[#0F172A] block">
                          Stop {stop.num}: {stop.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {stop.artworkLabel || 'MANDIR MALA WAYPOINT'}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#C5A059] bg-[#0B1118] px-3 py-1 self-start sm:self-center">
                      {stop.altitude}
                    </span>
                  </div>

                  {/* Row 1: Name, Short Name & Artwork Banner */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-cinzel font-bold text-[#0F172A] mb-1">
                        Full Stop Name
                      </label>
                      <input
                        type="text"
                        value={stop.name || ''}
                        onChange={(e) => handleUpdateStop(sIdx, 'name', e.target.value)}
                        placeholder="e.g. Kainchi Dham Ashram"
                        className="w-full px-3.5 py-2 border border-slate-300 bg-white text-sm font-serif text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-cinzel font-bold text-[#0F172A] mb-1">
                        Short Name (Map &amp; Tabs)
                      </label>
                      <input
                        type="text"
                        value={stop.shortName || ''}
                        onChange={(e) => handleUpdateStop(sIdx, 'shortName', e.target.value)}
                        placeholder="e.g. Kainchi Dham"
                        className="w-full px-3.5 py-2 border border-slate-300 bg-white text-sm font-serif text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-cinzel font-bold text-[#0F172A] mb-1">
                        Artwork Badge / Banner Label
                      </label>
                      <input
                        type="text"
                        value={stop.artworkLabel || ''}
                        onChange={(e) => handleUpdateStop(sIdx, 'artworkLabel', e.target.value)}
                        placeholder="e.g. SANCTUARY OF BABA NEEM KAROLI MAHARAJ"
                        className="w-full px-3.5 py-2 border border-slate-300 bg-white text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  {/* Row 2: Distances & Elevation */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-cinzel font-bold text-[#0F172A] mb-1">
                        Altitude (Elevation)
                      </label>
                      <input
                        type="text"
                        value={stop.altitude || ''}
                        onChange={(e) => handleUpdateStop(sIdx, 'altitude', e.target.value)}
                        placeholder="e.g. 4,600 FT"
                        className="w-full px-3.5 py-2 border border-slate-300 bg-white text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-cinzel font-bold text-[#0F172A] mb-1">
                        Distance from Gateway (Haldwani)
                      </label>
                      <input
                        type="text"
                        value={stop.distance || ''}
                        onChange={(e) => handleUpdateStop(sIdx, 'distance', e.target.value)}
                        placeholder="e.g. 42 km from Haldwani"
                        className="w-full px-3.5 py-2 border border-slate-300 bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-cinzel font-bold text-[#0F172A] mb-1">
                        Distance / Time from Kasar Hotel
                      </label>
                      <input
                        type="text"
                        value={stop.fromHotel || ''}
                        onChange={(e) => handleUpdateStop(sIdx, 'fromHotel', e.target.value)}
                        placeholder="e.g. 46 km to Kasar Hotel (~1.5 hrs)"
                        className="w-full px-3.5 py-2 border border-slate-300 bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  {/* Row 3: Description */}
                  <div>
                    <label className="block text-[11px] font-cinzel font-bold text-[#0F172A] mb-1">
                      Stop Description &amp; Spiritual Overview
                    </label>
                    <textarea
                      rows={3}
                      value={stop.desc || ''}
                      onChange={(e) => handleUpdateStop(sIdx, 'desc', e.target.value)}
                      placeholder="Detailed spiritual history and landscape overview of this waypoint..."
                      className="w-full px-3.5 py-2.5 border border-slate-300 bg-white text-sm font-serif text-[#0F172A] focus:outline-none focus:border-[#C5A059] leading-relaxed"
                    />
                  </div>

                  {/* Row 4: Key Highlights & Experiences */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-cinzel font-bold text-[#0F172A]">
                        Key Highlights &amp; Sacred Experiences (Bullet Points)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddHighlight(sIdx)}
                        className="text-[11px] font-cinzel font-bold text-[#C5A059] hover:text-[#0B1118] cursor-pointer flex items-center gap-1"
                      >
                        <span>+ Add Highlight</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(stop.highlights || []).map((hl, hlIdx) => (
                        <div key={hlIdx} className="flex items-center gap-2">
                          <span className="text-[#C5A059] font-bold text-xs shrink-0">•</span>
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => handleUpdateHighlight(sIdx, hlIdx, e.target.value)}
                            placeholder="e.g. Darshan of Baba Neem Karoli Maharaj sanctum & Hanuman temple."
                            className="flex-1 px-3 py-1.5 border border-slate-300 bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(sIdx, hlIdx)}
                            className="text-slate-400 hover:text-rose-600 text-xs px-2 py-1 cursor-pointer border border-transparent hover:border-slate-300"
                            title="Remove highlight"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 5: Sacred Chant & Safety Tip */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-cinzel font-bold text-[#0F172A] mb-1">
                        Shrine Blessing / Sacred Chant
                      </label>
                      <input
                        type="text"
                        value={stop.shrineBlessing || ''}
                        onChange={(e) => handleUpdateStop(sIdx, 'shrineBlessing', e.target.value)}
                        placeholder="e.g. जय बाबा नीम करोली • Jai Gurudev"
                        className="w-full px-3.5 py-2 border border-slate-300 bg-white text-xs font-serif text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-cinzel font-bold text-[#0F172A] mb-1">
                        Mountain Road &amp; Safety Tip
                      </label>
                      <input
                        type="text"
                        value={stop.safetyTip || ''}
                        onChange={(e) => handleUpdateStop(sIdx, 'safetyTip', e.target.value)}
                        placeholder="e.g. Narrow canyon route with devotee traffic; use licensed mountain chauffeurs."
                        className="w-full px-3.5 py-2 border border-slate-300 bg-white text-xs text-slate-700 focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 text-xs font-cinzel font-bold bg-[#0B1118] hover:bg-[#111827] text-white border border-[#C5A059]/40 shadow-xs cursor-pointer disabled:opacity-50 transition"
              >
                {isSaving ? 'Publishing...' : 'Save Mandir Mala Circuit'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Authentic Visitor FAQs */}
      {activeSubTab === 'faqs' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-4 sm:p-6 border border-[#C5A059]/30 shadow-xs space-y-6">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#0F172A]">
                Landing Page Frequently Asked Questions
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage visitor guidance on Kainchi Dham, winter heating, satvik meals, and train transfers.
              </p>
            </div>

            {/* Existing FAQs List */}
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] p-4 sm:p-5 border border-slate-200 space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-6 h-6 bg-[#0B1118] text-[#C5A059] text-xs font-bold flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => handleUpdateFaq(idx, 'q', e.target.value)}
                      placeholder="Question..."
                      className="flex-1 px-3 py-1.5 border border-slate-200 bg-white text-sm font-serif font-bold text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-slate-500 hover:text-rose-700 text-xs px-2.5 py-1 bg-white border border-slate-200 hover:border-rose-300 cursor-pointer shadow-2xs"
                      title="Delete FAQ"
                    >
                      Delete
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={faq.a}
                    onChange={(e) => handleUpdateFaq(idx, 'a', e.target.value)}
                    placeholder="Helpful answer for pilgrims and guests..."
                    className="w-full px-3.5 py-2 border border-slate-200 bg-white text-xs sm:text-sm text-[#0F172A] leading-relaxed focus:outline-none focus:border-[#C5A059] font-serif"
                  />
                </div>
              ))}
            </div>

            {/* Add New FAQ Card */}
            <div className="p-4 sm:p-5 bg-white border border-dashed border-[#C5A059]/50 space-y-3">
              <span className="text-xs font-cinzel font-bold text-[#0F172A] block">
                + Add New Visitor FAQ
              </span>

              <input
                type="text"
                value={newFaq.q}
                onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                placeholder="Question (e.g. Is hot water available 24 hours in all suites?)"
                className="w-full px-3.5 py-2 border border-slate-200 bg-[#FAF8F5] text-sm font-serif text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
              />

              <textarea
                rows={2}
                value={newFaq.a}
                onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                placeholder="Detailed guidance answer..."
                className="w-full px-3.5 py-2 border border-slate-200 bg-[#FAF8F5] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#C5A059] font-serif"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddFaq}
                  disabled={!newFaq.q.trim() || !newFaq.a.trim()}
                  className="px-4 py-1.5 text-xs font-cinzel font-bold bg-[#0B1118] hover:bg-[#111827] text-[#C5A059] border border-[#C5A059]/40 shadow-2xs cursor-pointer disabled:opacity-40 transition"
                >
                  Add FAQ to List
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 text-xs font-cinzel font-bold bg-[#0B1118] hover:bg-[#111827] text-white border border-[#C5A059]/40 shadow-xs cursor-pointer disabled:opacity-50 transition"
              >
                {isSaving ? 'Publishing...' : 'Save FAQs'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default LandingCmsManager;
