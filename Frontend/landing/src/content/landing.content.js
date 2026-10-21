// ===============================================================
// THE KASAR HIMALAYAN HEIGHTS — LANDING PAGE EDITABLE CONTENT
// ===============================================================

export const LANDING_CONTENT = {
  // Top Notice Bar (Dismissible)
  announcement: {
    enabled: true,
    message: 'Visiting Kainchi Dham, Jageshwar, or Kasar Devi? Heated chalet suites & chauffeured mountain cabs are open for booking.',
    linkText: 'Book Stay & Travel ↗',
    linkHref: '#enquiry',
  },

  // Reverent Hero Section
  saintHero: {
    devotionalGreeting: 'The Kasar Himalayan Heights',
    devotionalSubGreeting: 'Boutique Mountain Chalet & Chauffeured Expeditions',
    teachingQuote: 'Where the Himalayas Meet Stillness',
    quoteAttribution: 'Kasar Devi Ridge • Almora • 6,942 FT Elevation',
    portraitAlt: 'Panoramic Himalayan Snow Peaks at Kasar Devi',
    welcomeStatement: 'Perched amidst ancient deodar forests on Crank’s Ridge with 180° views of Mount Trishul and Nanda Devi, we welcome you to intimate chalet hospitality and dependable chauffeured mountain journeys across Uttarakhand.',
  },

  // About Uttarakhand ("Dev Bhoomi") — Appears first before commercial offerings
  aboutUttarakhand: {
    tagline: 'The Sacred Northern Realm',
    title: 'Dev Bhoomi — Land of Temples and the Himalayas',
    description: 'Uttarakhand is the eternal abode of the gods, where ancient stone shrines, Himalayan rivers, and sacred snow peaks have called travelers for thousands of years.',
    places: [
      {
        name: 'Kasar Devi & Crank’s Ridge',
        subtitle: 'Kashyap Hill • 6,942 ft Elevation',
        description: 'Perched on a high ridge dating back to the 2nd century CE, Kasar Devi is celebrated for its peaceful energy and extraordinary stillness. Here Swami Vivekananda meditated in 1890, followed by Lama Govinda and decades of spiritual seekers.',
        highlight: 'Vivekananda Caves & Cosmic Ridge',
        image: '/shared/assets/images/kasar-devi-temple.jpg',
      },
      {
        name: 'Chitai Golu Devta Temple',
        subtitle: 'Almora • 6 km from Kasar Ridge',
        description: 'Celebrated as the revered God of Justice across Kumaon. Devotees tie brass bells and offer heartfelt petitions, filling the sacred pine groves with thousands of chiming temple bells.',
        highlight: 'Revered God of Justice & Temple of Bells',
        image: '/shared/assets/images/Chitai_Golu_devta_Temple.jpg',
      },
      {
        name: 'Jageshwar Mahamrityunjaya Dham',
        subtitle: 'Jata Ganga Valley • 35 km from Almora Base',
        description: 'A sacred cluster of 124 ancient 7th- to 12th-century stone temples dedicated to Lord Shiva, nestled in a dense canopy of towering deodar trees. One of the venerated Jyotirlinga pilgrimage shrines of the Himalayas.',
        highlight: '124 Ancient Shiva Shrines',
        image: '/shared/assets/images/Jageshwar-Mahamrityunjaya-Dham.jpg',
      },
      {
        name: 'Kainchi Dham Ashram',
        subtitle: 'Bhowali Valley • 45 km from Almora Base',
        description: 'The world-revered ashram of Sri Neem Karoli Baba Maharaj, situated by the tranquil Kumaoni stream. A sanctuary of unconditional love, selfless service, and profound spiritual peace that has inspired pilgrims and visionaries from around the globe.',
        highlight: 'Sanctuary of Neem Karoli Baba',
        image: '/shared/assets/images/kainchi-dham.jpg',
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
        description: 'Dedicated fleet of Mountain Sedans (4-seater), Luxury SUVs (6-seater Innova Crysta), and Minibuses (12-seater). Chauffeured sacred temple yatras and station pickups with experienced hill drivers.',
        image: '/shared/assets/images/innova-crysta.jpg',
        features: [
          'Direct circuit transfers from Almora Station Base',
          'Dedicated hill-certified drivers & state passenger permits included',
          'Luggage assistance and unhurried temple halts',
        ],
        ctaText: 'Explore Fleet & Services',
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
        title: 'How does the Tour & Travel booking work?',
        content: 'Our mountain travel service operates across verified road circuits originating from Almora and Kathgodam. You choose your sacred pilgrimage destination and preferred vehicle type (Sedan, SUV, Minibus) with dedicated hill-certified chauffeurs.',
      },
    ],
  },
};
