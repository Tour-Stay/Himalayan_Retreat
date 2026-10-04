import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient, APP_URLS } from '@shared';
import { useToast } from './Toast';

export const LandingCmsManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState('hero'); // 'hero' | 'announcement' | 'itinerary' | 'faqs'

  // 1. Hero Content
  const [landingHero, setLandingHero] = useState({
    devotionalGreeting: '',
    devotionalSubGreeting: '',
    teachingQuote: '',
    quoteAttribution: '',
    welcomeStatement: '',
  });

  // 2. Announcement Ribbon
  const [announcement, setAnnouncement] = useState({
    enabled: true,
    message: '',
    linkText: '',
    linkHref: '',
  });

  // 3. Itinerary
  const [itinerary, setItinerary] = useState([
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
  ]);

  // 4. FAQs
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.landingHero) {
      setLandingHero({
        devotionalGreeting: settings.landingHero.devotionalGreeting || '',
        devotionalSubGreeting: settings.landingHero.devotionalSubGreeting || '',
        teachingQuote: settings.landingHero.teachingQuote || '',
        quoteAttribution: settings.landingHero.quoteAttribution || '',
        welcomeStatement: settings.landingHero.welcomeStatement || '',
      });
    }

    if (settings?.announcement) {
      setAnnouncement({
        enabled: settings.announcement.enabled !== false,
        message: settings.announcement.message || '',
        linkText: settings.announcement.linkText || '',
        linkHref: settings.announcement.linkHref || '',
      });
    }

    if (settings?.landingContent?.itinerary && settings.landingContent.itinerary.length > 0) {
      setItinerary(settings.landingContent.itinerary);
    }

    if (settings?.landingContent?.faqs && settings.landingContent.faqs.length > 0) {
      setFaqs(settings.landingContent.faqs);
    } else {
      // Seed initial landing faqs if empty
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

  // Itinerary helpers
  const handleUpdateDay = (index, field, value) => {
    setItinerary((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUpdateDayItem = (dayIdx, itemIdx, value) => {
    setItinerary((prev) => {
      const updated = [...prev];
      const items = [...updated[dayIdx].items];
      items[itemIdx] = value;
      updated[dayIdx] = { ...updated[dayIdx], items };
      return updated;
    });
  };

  const handleAddDayItem = (dayIdx) => {
    setItinerary((prev) => {
      const updated = [...prev];
      const items = [...updated[dayIdx].items, 'New pilgrimage highlight'];
      updated[dayIdx] = { ...updated[dayIdx], items };
      return updated;
    });
  };

  const handleRemoveDayItem = (dayIdx, itemIdx) => {
    setItinerary((prev) => {
      const updated = [...prev];
      const items = updated[dayIdx].items.filter((_, i) => i !== itemIdx);
      updated[dayIdx] = { ...updated[dayIdx], items };
      return updated;
    });
  };

  // FAQ helpers
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

  // Save all Landing CMS content
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        apiClient.patch('/settings/landingHero', landingHero),
        apiClient.patch('/settings/announcement', announcement),
        apiClient.patch('/settings/landingContent', {
          itinerary,
          faqs,
        }),
      ]);

      showToast('Landing website content successfully published!', 'success');
      await refreshSettings();
    } catch (err) {
      console.error('Error saving landing content:', err);
      showToast(err.response?.data?.message || 'Failed to update landing content', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Website Banner Header */}
      <div className="bg-[#FAF5EC] border border-[#EAA722]/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#073125] text-[#EAA722] flex items-center justify-center shadow-xs shrink-0">
            <svg className="w-5 h-5 text-[#EAA722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#073125]">
                Main Website Page Content
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-[#073125]/10 text-[#073125] border border-[#073125]/20">
                Public Website
              </span>
            </div>
            <p className="text-xs text-[#5C5350] mt-0.5">
              Edit the Neem Karoli Baba devotional quote, top notice banner, 3-day pilgrimage itinerary, and visitor FAQs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <a
            href={APP_URLS.landing}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-full text-xs font-cinzel font-semibold bg-white hover:bg-[#073125] hover:text-white text-[#073125] border border-[#073125]/30 transition shadow-2xs flex items-center gap-1.5"
            title="Open Main Website in a new tab"
          >
            <span>Open Website</span>
            <span className="text-amber-500 font-bold">↗</span>
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-full text-xs font-cinzel font-bold bg-[#073125] hover:bg-[#0C2B22] text-[#EAA722] border border-[#EAA722]/40 transition shadow-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <span className="w-3 h-3 rounded-full border-2 border-[#EAA722] border-t-transparent animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>Publish Changes</span>
                <span>✓</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#EAA722]/30 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'hero'
              ? 'bg-[#073125] text-[#EAA722] shadow-xs font-bold'
              : 'text-[#2C2523] hover:bg-[#FAF5EC]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>1. Welcome & Baba Maharaj Quote</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('announcement')}
          className={`px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'announcement'
              ? 'bg-[#073125] text-[#EAA722] shadow-xs font-bold'
              : 'text-[#2C2523] hover:bg-[#FAF5EC]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span>2. Top Notice Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('itinerary')}
          className={`px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'itinerary'
              ? 'bg-[#073125] text-[#EAA722] shadow-xs font-bold'
              : 'text-[#2C2523] hover:bg-[#FAF5EC]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>3. 3-Day Pilgrimage Plan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('faqs')}
          className={`px-4 py-2 rounded-xl text-xs font-cinzel font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeSubTab === 'faqs'
              ? 'bg-[#073125] text-[#EAA722] shadow-xs font-bold'
              : 'text-[#2C2523] hover:bg-[#FAF5EC]'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>4. Visitor Questions ({faqs.length})</span>
        </button>
      </div>

      {/* Tab 1: Devotional Hero & Ashram Tribute */}
      {activeSubTab === 'hero' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EAA722]/30 shadow-xs space-y-5">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#073125]">
                Neem Karoli Baba Maharaj Devotional Greetings
              </h4>
              <p className="text-xs text-[#5C5350] mt-0.5">
                These sacred titles, quotes, and spiritual statements appear prominently on the Landing page hero and header.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-bold text-[#073125] mb-1">
                  Primary Devotional Greeting (Hindi / Sanskrit)
                </label>
                <input
                  type="text"
                  value={landingHero.devotionalGreeting}
                  onChange={(e) =>
                    setLandingHero({ ...landingHero, devotionalGreeting: e.target.value })
                  }
                  placeholder="जय श्री बाबा नीम करोली महाराज की"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAA722]/40 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#073125] font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-[#073125] mb-1">
                  Sub-Greeting & Chants
                </label>
                <input
                  type="text"
                  value={landingHero.devotionalSubGreeting}
                  onChange={(e) =>
                    setLandingHero({ ...landingHero, devotionalSubGreeting: e.target.value })
                  }
                  placeholder="Ram Ram • Jai Sri Hanuman"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAA722]/40 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#073125] font-serif"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-bold text-[#073125] mb-1">
                  Maharaj-ji Core Teaching Quote
                </label>
                <input
                  type="text"
                  value={landingHero.teachingQuote}
                  onChange={(e) =>
                    setLandingHero({ ...landingHero, teachingQuote: e.target.value })
                  }
                  placeholder="Love. Serve. Remember."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAA722]/40 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#073125] font-serif italic"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-[#073125] mb-1">
                  Quote Attribution
                </label>
                <input
                  type="text"
                  value={landingHero.quoteAttribution}
                  onChange={(e) =>
                    setLandingHero({ ...landingHero, quoteAttribution: e.target.value })
                  }
                  placeholder="Teachings of Sri Neem Karoli Baba Maharaj"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAA722]/40 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#073125]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-cinzel font-bold text-[#073125] mb-1">
                Kasar Devi Welcome Statement
              </label>
              <textarea
                rows={3}
                value={landingHero.welcomeStatement}
                onChange={(e) =>
                  setLandingHero({ ...landingHero, welcomeStatement: e.target.value })
                }
                placeholder="Kasar Devi and the Kumaon Himalayas have welcomed spiritual seekers..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAA722]/40 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#073125] font-serif"
              />
            </div>

            {/* Live Hero Preview Box */}
            <div className="bg-[#073125] text-white p-5 rounded-2xl border border-[#EAA722]/40 relative overflow-hidden">
              <span className="text-[10px] uppercase font-cinzel font-bold tracking-widest text-[#EAA722] block mb-2">
                Live Hero Card Preview
              </span>
              <p className="font-serif text-lg sm:text-xl text-[#EAA722] font-semibold">
                {landingHero.devotionalGreeting || 'जय श्री बाबा नीम करोली महाराज की'}
              </p>
              <p className="text-xs text-[#FAF5EC]/80 font-cinzel mt-0.5">
                {landingHero.devotionalSubGreeting || 'Ram Ram • Jai Sri Hanuman'}
              </p>
              <blockquote className="my-3 pl-3 border-l-2 border-[#EAA722] text-sm italic text-[#FAF5EC]/90 font-serif">
                "{landingHero.teachingQuote || 'Love. Serve. Remember.'}"
                <cite className="block text-[11px] not-italic text-[#EAA722] mt-1 font-sans">
                  — {landingHero.quoteAttribution || 'Sri Neem Karoli Baba'}
                </cite>
              </blockquote>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full text-xs font-cinzel font-bold bg-[#073125] hover:bg-[#0C2B22] text-[#EAA722] border border-[#EAA722]/40 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Publishing...' : 'Save Devotional Hero'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Universal Announcement Ribbon */}
      {activeSubTab === 'announcement' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EAA722]/30 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#073125]">
                  Cross-Site Notice Ribbon
                </h4>
                <p className="text-xs text-[#5C5350] mt-0.5">
                  Appears at the very top of all 3 websites (Landing, Hotel, and Travel) for road updates, weather, and seasonal yatras.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-[#FAF7F2] px-3.5 py-1.5 rounded-full border border-[#EAA722]/40">
                <input
                  type="checkbox"
                  checked={announcement.enabled}
                  onChange={(e) =>
                    setAnnouncement({ ...announcement, enabled: e.target.checked })
                  }
                  className="w-4 h-4 text-[#073125] rounded focus:ring-0 cursor-pointer accent-[#073125]"
                />
                <span className="text-xs font-cinzel font-bold text-[#073125]">
                  {announcement.enabled ? 'Ribbon Active' : 'Ribbon Hidden'}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-cinzel font-bold text-[#073125] mb-1">
                Announcement Message
              </label>
              <textarea
                rows={2}
                value={announcement.message}
                onChange={(e) =>
                  setAnnouncement({ ...announcement, message: e.target.value })
                }
                placeholder="॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥ Visiting Kainchi Dham or Kasar Devi?..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAA722]/40 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#073125] font-serif"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-cinzel font-bold text-[#073125] mb-1">
                  Action Link Text (Optional)
                </label>
                <input
                  type="text"
                  value={announcement.linkText}
                  onChange={(e) =>
                    setAnnouncement({ ...announcement, linkText: e.target.value })
                  }
                  placeholder="Yatra Booking ↗"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAA722]/40 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#073125]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-bold text-[#073125] mb-1">
                  Action Link Target / URL
                </label>
                <input
                  type="text"
                  value={announcement.linkHref}
                  onChange={(e) =>
                    setAnnouncement({ ...announcement, linkHref: e.target.value })
                  }
                  placeholder="#enquiry or https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAA722]/40 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#073125]"
                />
              </div>
            </div>

            {/* Live Ribbon Preview */}
            <div className="p-4 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30">
              <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#073125] block mb-2">
                Live Ribbon Bar Preview
              </span>
              {announcement.enabled ? (
                <div className="bg-[#541508] text-white py-2 px-4 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <span className="font-serif tracking-wide">{announcement.message}</span>
                  {announcement.linkText && (
                    <span className="text-[10px] font-bold text-[#EAA722] underline underline-offset-2">
                      {announcement.linkText}
                    </span>
                  )}
                </div>
              ) : (
                <div className="py-2.5 px-4 rounded-xl text-xs bg-stone-200 text-stone-600 italic">
                  Ribbon is currently disabled. It will not render on guest websites.
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full text-xs font-cinzel font-bold bg-[#073125] hover:bg-[#0C2B22] text-[#EAA722] border border-[#EAA722]/40 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Publishing...' : 'Save Notice Ribbon'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: 3-Day Pilgrimage Itinerary */}
      {activeSubTab === 'itinerary' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EAA722]/30 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#073125]">
                  Curated 3-Day Pilgrimage Itinerary
                </h4>
                <p className="text-xs text-[#5C5350] mt-0.5">
                  Displays on the Landing page under the "3-Day Sacred Pilgrimage" section.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-[#073125] bg-[#FAF5EC] px-3 py-1 rounded-full border border-[#EAA722]/30">
                {itinerary.length} Days Configured
              </span>
            </div>

            <div className="space-y-5">
              {itinerary.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EAA722]/30 space-y-4"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-[#EAA722]/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-[#073125] text-[#EAA722] font-serif font-bold text-sm flex items-center justify-center">
                        {day.num || `0${dIdx + 1}`}
                      </span>
                      <span className="font-serif text-base font-bold text-[#073125]">
                        Day {dIdx + 1} Circuit
                      </span>
                    </div>

                    <input
                      type="text"
                      value={day.tag}
                      onChange={(e) => handleUpdateDay(dIdx, 'tag', e.target.value)}
                      placeholder="e.g. Day 1 • Arrival & Kainchi Darshan"
                      className="px-3 py-1 rounded-lg border border-[#EAA722]/40 bg-white text-xs font-serif text-[#073125] max-w-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel font-bold text-[#073125] mb-1">
                      Day Title & Main Journey
                    </label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleUpdateDay(dIdx, 'title', e.target.value)}
                      placeholder="Kathgodam to Kainchi Dham & Kasar Ridge"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#EAA722]/40 bg-white text-sm font-serif text-[#2C2523] focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-cinzel font-bold text-[#073125]">
                        Key Highlights & Stops
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddDayItem(dIdx)}
                        className="text-[11px] font-cinzel font-bold text-[#073125] hover:text-amber-700 cursor-pointer"
                      >
                        + Add Bullet Point
                      </button>
                    </div>

                    <div className="space-y-2">
                      {day.items?.map((item, iIdx) => (
                        <div key={iIdx} className="flex items-center gap-2">
                          <span className="text-[#EAA722] font-bold text-xs">•</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleUpdateDayItem(dIdx, iIdx, e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-[#EAA722]/30 bg-white text-xs text-[#2C2523] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveDayItem(dIdx, iIdx)}
                            className="text-stone-400 hover:text-red-600 text-xs px-2 py-1 cursor-pointer"
                            title="Remove bullet point"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel font-bold text-[#073125] mb-1">
                      Footer Distance / Journey Note
                    </label>
                    <input
                      type="text"
                      value={day.note}
                      onChange={(e) => handleUpdateDay(dIdx, 'note', e.target.value)}
                      placeholder="e.g. 85 km • ~3 hrs scenic mountain drive"
                      className="w-full px-3.5 py-1.5 rounded-xl border border-[#EAA722]/30 bg-white text-xs text-[#5C5350] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full text-xs font-cinzel font-bold bg-[#073125] hover:bg-[#0C2B22] text-[#EAA722] border border-[#EAA722]/40 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Publishing...' : 'Save 3-Day Itinerary'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Authentic Visitor FAQs */}
      {activeSubTab === 'faqs' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EAA722]/30 shadow-xs space-y-6">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#073125]">
                Landing Page Frequently Asked Questions
              </h4>
              <p className="text-xs text-[#5C5350] mt-0.5">
                Manage visitor guidance on Kainchi Dham, winter heating, satvik meals, and train transfers.
              </p>
            </div>

            {/* Existing FAQs List */}
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#EAA722]/30 space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#073125] text-[#EAA722] text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={faq.q}
                      onChange={(e) => handleUpdateFaq(idx, 'q', e.target.value)}
                      placeholder="Question..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#EAA722]/40 bg-white text-sm font-serif font-bold text-[#073125] focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-stone-400 hover:text-red-600 text-xs px-2.5 py-1 rounded bg-white border border-stone-200 cursor-pointer shadow-2xs"
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
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EAA722]/30 bg-white text-xs sm:text-sm text-[#2C2523] leading-relaxed focus:outline-none font-serif"
                  />
                </div>
              ))}
            </div>

            {/* Add New FAQ Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF5EC] border border-dashed border-[#EAA722]/50 space-y-3">
              <span className="text-xs font-cinzel font-bold text-[#073125] block">
                + Add New Visitor FAQ
              </span>

              <input
                type="text"
                value={newFaq.q}
                onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                placeholder="Question (e.g. Is hot water available 24 hours in all suites?)"
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAA722]/40 bg-white text-sm font-serif text-[#073125] focus:outline-none"
              />

              <textarea
                rows={2}
                value={newFaq.a}
                onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                placeholder="Detailed guidance answer..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#EAA722]/40 bg-white text-xs sm:text-sm text-[#2C2523] focus:outline-none font-serif"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddFaq}
                  disabled={!newFaq.q.trim() || !newFaq.a.trim()}
                  className="px-4 py-1.5 rounded-full text-xs font-cinzel font-bold bg-[#073125] hover:bg-[#0C2B22] text-[#EAA722] border border-[#EAA722]/40 shadow-2xs cursor-pointer disabled:opacity-40"
                >
                  Add FAQ to List
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full text-xs font-cinzel font-bold bg-[#073125] hover:bg-[#0C2B22] text-[#EAA722] border border-[#EAA722]/40 shadow-sm cursor-pointer disabled:opacity-50"
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
