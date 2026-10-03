// ===============================================================
// THE KASAR HIMALAYAN HEIGHTS — LANDING PAGE EDITABLE CONTENT
// ===============================================================

export const LANDING_CONTENT = {
  // Top Notice Bar (Dismissible)
  announcement: {
    enabled: true,
    message: '॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥ Visiting Kainchi Dham or Kasar Devi? Consecrated yatra assistance, heated chalet suites & temple cabs are open for booking.',
    linkText: 'Yatra Booking ↗',
    linkHref: '#enquiry',
  },

  // Reverent Hero Section
  saintHero: {
    devotionalGreeting: 'जय श्री बाबा नीम करोली महाराज की',
    devotionalSubGreeting: 'Ram Ram • Jai Sri Hanuman',
    teachingQuote: 'Love. Serve. Remember.',
    quoteAttribution: 'Teachings of Sri Neem Karoli Baba Maharaj',
    portraitAlt: 'Sri Neem Karoli Baba Maharaj',
    welcomeStatement: 'Kasar Devi and the Kumaon Himalayas have welcomed spiritual seekers, mystics, and travelers for centuries. Surrounded by ancient deodar forests and the silent majesty of snow peaks, we welcome you with deep reverence and quiet hospitality.',
  },

  // About Uttarakhand ("Dev Bhoomi") — Appears first before commercial offerings
  aboutUttarakhand: {
    tagline: 'The Sacred Northern Realm',
    title: 'Dev Bhoomi — Land of Temples and the Himalayas',
    description: 'Uttarakhand is the eternal abode of the gods, where ancient stone shrines, Himalayan rivers, and sacred snow peaks have called travelers for thousands of years.',
    places: [
      {
        name: 'Kainchi Dham Ashram',
        subtitle: 'Bhowali Valley • 45 km from Almora Base',
        description: 'The world-revered ashram of Sri Neem Karoli Baba Maharaj, situated by the tranquil Kumaoni stream. A sanctuary of unconditional love, selfless service, and profound spiritual peace that has inspired pilgrims and visionaries from around the globe.',
        highlight: 'Sanctuary of Neem Karoli Baba',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Early_morning_Glimpse_of_Kainchi_Dham_Nainital_2023.jpg/1280px-Early_morning_Glimpse_of_Kainchi_Dham_Nainital_2023.jpg',
      },
      {
        name: 'Jageshwar Mahamrityunjaya Dham',
        subtitle: 'Jata Ganga Valley • 35 km from Almora Base',
        description: 'A sacred cluster of 124 ancient 7th- to 12th-century stone temples dedicated to Lord Shiva, nestled in a dense canopy of towering deodar trees. One of the venerated Jyotirlinga pilgrimage shrines of the Himalayas.',
        highlight: '124 Ancient Shiva Shrines',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Temple_Cluster_at_Jageshwar.jpg/1280px-Temple_Cluster_at_Jageshwar.jpg',
      },
      {
        name: 'Kasar Devi & Crank’s Ridge',
        subtitle: 'Kashyap Hill • 6,942 ft Elevation',
        description: 'Perched on a high ridge dating back to the 2nd century CE, Kasar Devi is celebrated for its geomagnetic quietude and extraordinary stillness. Here Swami Vivekananda meditated in 1890, followed by Lama Govinda and decades of spiritual seekers.',
        highlight: 'Vivekananda Caves & Cosmic Ridge',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Kasar_Devi_Temple.JPG/960px-Kasar_Devi_Temple.JPG',
      },
      {
        name: 'The Sacred Peaks: Trishul & Nanda Devi',
        subtitle: '180° Greater Himalayan Panorama',
        description: 'Front and center across the northern horizon rise Mount Trishul (7,120 m), the trident of Shiva, and Mount Nanda Devi (7,816 m), the sacred goddess mountain of Uttarakhand, alongside the Panchachuli snow range.',
        highlight: '7,000+ Meter Snow Peaks',
        image: '/shared/assets/images/hotel-best-pic.jpg',
      },
    ],
  },

  // The Client's Work Section — Appears second
  clientWork: {
    tagline: 'Quiet Luxury at 6,942 Feet',
    title: 'Sanctuary & Mountain Expeditions',
    description: 'We bring together intimate boutique alpine hospitality with dependable chauffeured mountain travel across Uttarakhand.',
    cards: [
      {
        title: 'Stay at The Kasar Himalayan Heights',
        category: 'High-Altitude Luxury Boutique Chalet',
        elevation: '6,942 FT Elevation',
        description: 'Intimate alpine chalet framing 180° Himalayan snow peaks. Heated suites with electric blankets, authentic Kumaoni regional cuisine, crackling evening bonfires, and sunrise ridge trails.',
        image: '/shared/assets/images/chalet-suite.jpg',
        features: [
          'Heated mountain suites with hot geysers',
          'Private balconies framing Mount Trishul & Nanda Devi',
          'Authentic local cuisine & 24/7 power backup',
        ],
        ctaText: 'Explore Hotel & Suites',
        appTarget: 'hotel',
      },
      {
        title: 'Himalayan Expeditions',
        category: 'Chauffeured Mountain Fleet & Tours',
        elevation: 'Almora Station Hub Origin',
        description: 'Dedicated fleet of Mountain Sedans (4-seater), Luxury SUVs (6-seater Innova Crysta), and Minibuses (12-seater). Real-time distance and vehicle fare calculator with experienced hill chauffeurs.',
        image: '/shared/assets/images/innova-crysta.jpg',
        features: [
          'Direct circuit transfers from Almora Station Base',
          'Transparent per-km mountain tariffs with no hidden charges',
          'Hill-expert chauffeurs & state passenger permits included',
        ],
        ctaText: 'Explore Fleet & Tariffs',
        appTarget: 'travel',
      },
    ],
    valueProps: [
      {
        title: 'Heated Chalet Comfort',
        description: 'Winterized suites with silent room heaters, hot water geysers, and warm hospitality.',
      },
      {
        title: '180° Snow Peak Balconies',
        description: 'Unobstructed morning and golden sunset views of Trishul and Nanda Devi.',
      },
      {
        title: 'Hill-Expert Chauffeurs',
        description: 'Experienced mountain drivers navigating Kumaon ghat roads with safety and calm.',
      },
    ],
  },

  // FAQ Accordion
  faq: {
    tagline: 'Pilgrimage & Mountain Travel Guidance',
    title: 'Frequently Asked Questions',
    items: [
      {
        title: 'How do we reach Kasar Devi and Almora from Delhi or Kathgodam?',
        content: 'The nearest railway terminus is Kathgodam (85 km / 3 hours drive). Trains like the Kathgodam Shatabdi and Ranikhet Express connect directly from New Delhi. Our chauffeured fleet can meet you at Kathgodam station or provide a direct door-to-door transfer from Delhi NCR.',
      },
      {
        title: 'What is the best season to visit for clear Himalayan peak views?',
        content: 'October through April offers crystal-clear, deep blue skies with the most dramatic snow-capped peak views of Trishul and Nanda Devi. The winter months (December–February) feature crisp alpine air and occasional snowfall.',
      },
      {
        title: 'How far is Kainchi Dham and Jageshwar Dham from the hotel?',
        content: 'Jageshwar Mahamrityunjaya Dham is 35 km (approx. 1 hour drive) through pine forests. Kainchi Dham (Neem Karoli Baba Ashram) is 45 km (approx. 1.5 hours drive). We arrange curated day pilgrimages with chauffeur service.',
      },
      {
        title: 'How does the Tour & Travel fare calculator work?',
        content: 'Our fare calculator is based on verified road distances originating from Almora Station Base. You choose your circuit and vehicle type (Sedan at ₹14/km, SUV at ₹18/km, Minibus at ₹26/km). The formula transparently adds fuel, permits, and driver allowance.',
      },
    ],
  },
};
