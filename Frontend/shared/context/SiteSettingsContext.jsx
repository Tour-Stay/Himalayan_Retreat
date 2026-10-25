import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../services/apiClient';
import { SITE_CONFIG } from '../constants/siteConfig';
import { broadcastUpdate, subscribeToUpdates } from '../utils/syncBroadcaster';

// ==========================================
// RESILIENT OFFLINE FALLBACK DEFAULTS
// ==========================================
const fallbackSettings = {
  company: {
    brandName: SITE_CONFIG.brandName || 'The Kasar Himalayan Heights & Expeditions',
    hotelName: SITE_CONFIG.hotelName || 'The Kasar Himalayan Heights',
    travelName: SITE_CONFIG.travelName || 'Himalayan Expeditions',
    tagline: SITE_CONFIG.tagline || 'High-Altitude Luxury Boutique Chalet & Chauffeured Mountain Expeditions',
    elevation: SITE_CONFIG.elevation || '6,942 ft',
    conciergePhone: SITE_CONFIG.conciergePhone || '+91 96906 21247',
    whatsappNumber: SITE_CONFIG.whatsappNumber || '919690621247',
    whatsappDisplay: SITE_CONFIG.whatsappDisplay || '+91 96906 21247',
    email: SITE_CONFIG.email || 'concierge@kasarhimalayanheights.com',
    hotelAddress: SITE_CONFIG.hotelLocation || "Crank's Ridge, Kasar Devi, Almora, Uttarakhand, India (6,942 ft)",
    travelHubAddress: SITE_CONFIG.travelHub || 'Almora Station Base, Uttarakhand, India',
    instagramUrl: SITE_CONFIG.socials?.instagram || 'https://instagram.com/kasarhimalayanheights',
    facebookUrl: SITE_CONFIG.socials?.facebook || 'https://facebook.com/kasarhimalayanheights',
    upiId: 'kasarhimalayan@upi',
    googleMapsEmbedUrl: '',
  },

  landingHero: {
    devotionalGreeting: 'जय श्री बाबा नीम करोली महाराज की',
    devotionalSubGreeting: 'Ram Ram • Jai Sri Hanuman',
    teachingQuote: 'Love. Serve. Remember.',
    quoteAttribution: 'Teachings of Sri Neem Karoli Baba Maharaj',
    welcomeStatement:
      'Kasar Devi and the Kumaon Himalayas have welcomed spiritual seekers, mystics, and travelers for centuries. Surrounded by ancient deodar forests and the silent majesty of snow peaks, we welcome you with deep reverence and quiet hospitality.',
  },
  cabFleet: [
    {
      id: '4-seater',
      title: '4-Seater Mountain Sedan',
      model: 'Swift Dzire / Toyota Etios / Honda Amaze',
      seats: 4,
      luggage: '2 Large Bags + 2 Cabin Bags',
      tag: 'Best for Couples & Small Families',
      dailyRate: 2499,
      perKmRate: 14,
      rateKathgodam: '₹2,499',
      rateDelhi: '₹7,499',
      rateUnit: 'per day + fuel / transfers',
      features: [
        'Friendly local Pahadi driver with 10+ years hill experience',
        'High ground clearance for comfortable hill road driving',
        'Good heating for winter days & air-conditioning in summers',
        'Uttarakhand commercial tourist permit & FastTag installed',
        'Clean seats with bottled mineral water and first aid kit',
      ],
      idealFor: 'Kathgodam Railway Station pickup, Kainchi Dham darshan, and day trips around Almora.',
      description:
        'Clean, comfortable sedan with a skilled local hill driver. Perfect for small families and couples looking for a smooth ride to Kasar Devi and nearby temples.',
      isActive: true,
    },
    {
      id: '6-seater',
      title: '6-Seater Luxury SUV',
      model: 'Toyota Innova Crysta / Maruti Ertiga',
      seats: 6,
      luggage: '4 Large Bags + 3 Hand Bags + Roof Carrier',
      tag: 'Most Popular for Mountain Tours',
      dailyRate: 4499,
      perKmRate: 18,
      rateKathgodam: '₹4,499',
      rateDelhi: '₹10,999',
      rateUnit: 'per day + fuel / hill tours',
      features: [
        'Comfortable captain recliner seats with armrests',
        'Powerful hill engine with snow chains available in winter',
        'Dual heating and air conditioning for all passenger rows',
        'Wide windows for scenic Himalayan snow peak views',
        'Large luggage boot and sturdy overhead roof rack',
      ],
      idealFor:
        'Families, temple yatra groups, and multi-day tours across Kainchi Dham, Jageshwar, and Kausani.',
      description:
        'Our most popular mountain vehicle. Spacious, powerful, and comfortable over hill turns, with plenty of room for luggage and family members.',
      isActive: true,
    },
    {
      id: '12-seater',
      title: '12-Seater Luxury Minibus',
      model: 'Force Urbania / Maharaja Tempo Traveller',
      seats: 12,
      luggage: '10–12 Large Bags in Dedicated Luggage Bay',
      tag: 'Best for Groups & Pilgrimage Yatras',
      dailyRate: 7999,
      perKmRate: 26,
      rateKathgodam: '₹7,999',
      rateDelhi: '₹18,500',
      rateUnit: 'per day + fuel / long circuits',
      features: [
        'Plush 2×1 Maharaja pushback reclining seats with headrests',
        'Personal AC vents, phone charging ports, and reading lights',
        'Tall walk-in ceiling so adults can stand and walk comfortably',
        'Smooth air suspension designed for gentle hill road rides',
        'Audio music system and mic for family yatra songs and guidance',
      ],
      idealFor:
        'Family reunions, sacred Chardham yatras, and large groups visiting Jageshwar and Kainchi Dham.',
      description:
        'Travel together in complete comfort. Full-height luxury minibus with pushback seats, smooth suspension, and plenty of space for everyone.',
      isActive: true,
    },
  ],
  destinations: [
    {
      id: 'kainchi-dham',
      name: 'Kainchi Dham Ashram',
      category: 'temple',
      categoryLabel: 'Neem Karoli Baba Ashram',
      saffronTag: '॥ श्री नीब करौरी महाराज धाम ॥',
      kmFromAlmora: 45,
      duration: 'Half Day / Full Day',
      distanceText: '45 km from Almora (~1.5 hrs)',
      description:
        'The world-famous spiritual ashram of Sri Neem Karoli Baba Maharaj beside the quiet Kshipra river. Daily evening aarti and sacred bhandara prasad.',
      highlights: [
        'Hanuman Temple Darshan',
        'Baba Kutiya & Dhyan',
        'Evening Ganga Aarti',
        'Satvik Bhandara Prasad',
      ],
      typicalFareSedan: '₹2,200',
      typicalFareInnova: '₹3,600',
      isActive: true,
    },
    {
      id: 'jageshwar-dham',
      name: 'Jageshwar Mahamrityunjaya Dham',
      category: 'temple',
      categoryLabel: '124 Ancient Shiva Temples',
      saffronTag: '॥ जागेश्वर महामृत्युंजय ज्योतिर्लिंग ॥',
      kmFromAlmora: 35,
      duration: 'Half Day / Full Day',
      distanceText: '35 km from Almora (~1.2 hrs)',
      description:
        'Ancient 8th-century stone temple complex dedicated to Lord Shiva, sheltered in a sacred valley surrounded by towering deodar cedar trees.',
      highlights: [
        'Mahamrityunjaya Lingam',
        '124 Stone Shrines',
        'Ancient Deodar Forest',
        'Kumaon Heritage Museum',
      ],
      typicalFareSedan: '₹2,000',
      typicalFareInnova: '₹3,200',
      isActive: true,
    },
    {
      id: 'kasar-devi',
      name: 'Kasar Devi & Crank’s Ridge',
      category: 'temple',
      categoryLabel: 'Peaceful Energy Ridge',
      saffronTag: '॥ माँ कासार देवी शक्तिपीठ ॥',
      kmFromAlmora: 8,
      duration: 'Local Tour (2–4 hrs)',
      distanceText: '8 km from Almora (~20 mins)',
      description:
        'A peaceful hill ridge where Swami Vivekananda meditated in 1890. Famous for warm sunshine, calm vibes, and wide Himalayan snow peak views.',
      highlights: [
        'Kasar Devi Cave Temple',
        'Swami Vivekananda Rock',
        '180° Snow Peak Horizon',
        'Quiet Pine Walking Trails',
      ],
      typicalFareSedan: '₹800',
      typicalFareInnova: '₹1,400',
      isActive: true,
    },
    {
      id: 'kathgodam-station',
      name: 'Kathgodam Railway Station Pickup',
      category: 'transfer',
      categoryLabel: 'Train Station Transfer',
      saffronTag: '॥ स्टेशन पिकअप एवं ड्रॉप ॥',
      kmFromAlmora: 85,
      duration: 'Direct Transfer (~3 hrs)',
      distanceText: '85 km from Almora (~3 hrs)',
      description:
        'On-time pickup at Kathgodam with your nameboard. Comfortable drive up the pine hills straight to your hotel doorstep.',
      highlights: [
        'Train Meet & Greet',
        'Guest Nameboard',
        'Toll & Green Taxes Included',
        'Scenic Mountain Drive',
      ],
      typicalFareSedan: '₹2,499',
      typicalFareInnova: '₹4,499',
      isActive: true,
    },
    {
      id: 'kausani',
      name: 'Kausani — 300 km Snow Peak View',
      category: 'hillstation',
      categoryLabel: 'Scenic Hill Station',
      saffronTag: '॥ त्रिशूल एवं नन्दा देवी दर्शन ॥',
      kmFromAlmora: 52,
      duration: 'Full Day Sightseeing',
      distanceText: '52 km from Almora (~1.8 hrs)',
      description:
        'Famous for wide 300-km views of Mount Trishul and Nanda Devi peaks, green tea gardens, and Mahatma Gandhi Anasakti Ashram.',
      highlights: [
        '300 km Peak Panorama',
        'Kausani Tea Estate',
        'Mahatma Gandhi Ashram',
        'Rudradhari Waterfall',
      ],
      typicalFareSedan: '₹2,800',
      typicalFareInnova: '₹4,200',
      isActive: true,
    },
    {
      id: 'nainital',
      name: 'Nainital Lake City & Temple',
      category: 'hillstation',
      categoryLabel: 'Lake City Day Tour',
      saffronTag: '॥ माँ नैना देवी शक्तिपीठ ॥',
      kmFromAlmora: 63,
      duration: 'Full Day Sightseeing',
      distanceText: '63 km from Almora (~2 hrs)',
      description:
        'Explore the Lake District of Uttarakhand. Boating on Naini Lake, Maa Naina Devi temple darshan, cable car ride, and mall road shopping.',
      highlights: [
        'Naini Lake Boating',
        'Maa Naina Devi Temple',
        'Snow View Point',
        'Tibetan Market',
      ],
      typicalFareSedan: '₹3,000',
      typicalFareInnova: '₹4,800',
      isActive: true,
    },
  ],
  hotelPolicies: {
    checkInTime: '12:00 PM',
    checkOutTime: '10:00 AM',
    cancellationPolicy:
      'Free cancellation up to 48 hours prior to check-in. Non-refundable within 48 hours.',
    diningHours:
      'Breakfast: 7:30 AM - 10:30 AM | Lunch: 12:30 PM - 3:00 PM | Dinner: 7:30 PM - 10:00 PM',
    amenitiesList: [
      'Silent Electric Room Heaters & Heated Blankets',
      'Private Balconies with 180° Snow Peak Views',
      'High-Speed Fibre WiFi (Ideal for Mountain Workations)',
      'Evening Bonfire with Kumaoni Herbal Tea',
      'Pure Mountain Spring Water with RO Filter',
      '24/7 Power Backup & Hot Geysers in All Suites',
    ],
  },
  travelPolicies: {
    nightChargeAmount: 300,
    driverAllowancePerDay: 500,
    driverShortTripAllowance: 250,
    driverLongDayDropAllowance: 450,
    driverNightHaltCharge: 300,
    driverGuidelines: 'Standard mountain duty hours: 06:00 AM - 09:00 PM. High-altitude Ghat driving safety protocols apply. All chauffeurs receive free food and lodging allowances.',
    driverRoster: [
      {
        id: 'drv-1',
        name: 'Ramesh Bisht',
        phone: '+91 94120 12345',
        experience: '12 Years (Kumaon Hills)',
        vehicleAssigned: 'Maruti Suzuki Dzire',
        rating: 4.9,
        status: 'Available',
      },
      {
        id: 'drv-2',
        name: 'Kailash Tiwari',
        phone: '+91 94120 54321',
        experience: '15 Years (Char Dham & Kumaon)',
        vehicleAssigned: 'Toyota Innova Crysta',
        rating: 5.0,
        status: 'Available',
      },
      {
        id: 'drv-3',
        name: 'Devendra Rawat',
        phone: '+91 94120 98765',
        experience: '18 Years (Highway & Mountains)',
        vehicleAssigned: 'Force Urbania Minibus',
        rating: 4.9,
        status: 'Available',
      },
    ],
    faqs: [
      {
        q: 'How do I book a cab from Kathgodam Railway Station?',
        a: 'You can book easily on WhatsApp or via our online booking form. Provide your train number and arrival time. Our driver will be waiting at the station exit with a nameboard to help with your luggage.',
      },
      {
        q: 'Are tolls, driver allowance, and parking charges included?',
        a: 'Yes, all our quotes are 100% all-inclusive. Fuel, hill driver allowance, state permits, and FastTag tolls are already covered. You only pay the agreed fixed rate.',
      },
      {
        q: 'Can we stop for darshan at Kainchi Dham on the way from Kathgodam?',
        a: 'Yes, absolutely! Kainchi Dham is located directly along the scenic highway between Kathgodam and Almora. Our drivers can easily stop for 1 to 2 hours for temple darshan, prasad, and aarti.',
      },
      {
        q: 'Is it safe to travel on mountain roads during winter and night?',
        a: 'All our drivers are native Pahadi chauffeurs with over 10 years of experience driving in fog, rain, and snow. Our vehicles are equipped with fog lights, heaters, and winter chains when needed.',
      },
      {
        q: 'What if our train or flight is delayed?',
        a: 'We track your train and flight arrival times online. There are no extra waiting charges if your train or flight is delayed. Your driver will be there when you arrive.',
      },
    ],
    safetyStandards: [
      {
        title: 'Friendly Local Pahadi Drivers',
        desc: 'All our drivers were born and raised on these mountain roads. They know every turn, drive carefully, and treat guests with warm hill hospitality.',
        icon: 'Shield',
      },
      {
        title: 'High Clearance & Clean AC Cabs',
        desc: 'Clean, well-maintained vehicles with good ground clearance, working heaters for cold mornings, and snow chains for winter passes.',
        icon: 'Car',
      },
      {
        title: 'Commercial Uttarakhand Permits',
        desc: '100% legal commercial tourist permits, comprehensive passenger travel insurance, and FastTag enabled for smooth toll passage.',
        icon: 'Check',
      },
      {
        title: 'Honest Fixed Prices Guarantee',
        desc: 'Clear upfront prices with driver allowance, fuel, and tolls included. No surprise charges or bargaining at the end of your trip.',
        icon: 'Pricing',
      },
      {
        title: 'Clean Cabs & First Aid Onboard',
        desc: 'Daily sanitized cabins, bottled mountain drinking water, sick bags for curvy roads, and portable oxygen canisters available on request.',
        icon: 'Heart',
      },
      {
        title: 'On-Time Railway & Airport Pickups',
        desc: 'Our driver waits for your arrival at Kathgodam Railway Station or Pantnagar Airport with a nameboard, ready to help with luggage.',
        icon: 'Clock',
      },
    ],
  },
  pricingRules: {
    weekendSurchargePercent: 15,
    seasonalRules: [
      {
        id: 'snowfall-peak',
        title: 'Winter Snowfall Peak Season',
        multiplierPercent: 35,
        startDate: '12-20',
        endDate: '01-10',
        isActive: true,
      },
    ],
  },
};

// ==========================================
// LOCALSTORAGE CACHE (Stale-While-Revalidate)
// ==========================================
const CACHE_KEY = 'kasar_site_settings_cache';
const STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes — only refetch if older than this

const getCachedSettings = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.data && parsed?.timestamp) return parsed;
    }
  } catch (e) { /* ignore */ }
  return null;
};

const setCachedSettings = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) { /* ignore quota errors */ }
};

export const SiteSettingsContext = createContext({
  settings: fallbackSettings,
  loading: false,
  error: null,
  refreshSettings: async () => { },
  updateLocalSettings: () => { },
});

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const cached = getCachedSettings();
    return cached ? cached.data : fallbackSettings;
  });
  const [loading, setLoading] = useState(() => !getCachedSettings());
  const [error, setError] = useState(null);
  const lastFetchRef = useRef(0);

  const fetchSettings = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await apiClient.get('/settings');
      if (res.data?.success && res.data?.data) {
        setSettings(res.data.data);
        setCachedSettings(res.data.data);
        lastFetchRef.current = Date.now();
        setError(null);
      }
    } catch (err) {
      console.warn('SiteSettingsProvider: Could not reach /api/settings. Using resilient fallback.', err.message);
      setError(err.message);
      // Retain current settings (cached or fallback) so the app never breaks
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    await fetchSettings(true); // Fetch silently to avoid unmounting the dashboard
    // Notify all open tabs across Landing, Hotel, and Travel portals instantly
    broadcastUpdate('settings');
  }, [fetchSettings]);

  useEffect(() => {
    // 1. Stale-while-revalidate: if cached data loaded, refresh silently in background
    //    If no cache exists, fetch with loading indicator
    const hasCachedData = !!getCachedSettings();
    fetchSettings(hasCachedData);

    // 2. Real-time broadcast sync with 60-second cross-portal polling fallback
    //    (Bypasses browser cross-origin/port sandboxing between Admin and public portals)
    const unsubscribe = subscribeToUpdates('settings', () => {
      fetchSettings(true);
    }, 60 * 1000);

    // 3. Tab visibility revalidation (refreshes if inactive for >60s)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastFetch = Date.now() - lastFetchRef.current;
        if (timeSinceLastFetch > 60 * 1000) {
          fetchSettings(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchSettings]);

  const updateLocalSettings = useCallback((newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings,
        updateLocalSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export default SiteSettingsContext;
