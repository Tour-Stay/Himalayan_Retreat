const SiteSettings = require('../models/SiteSettings');

// Default initial data for seeding if database collection is empty
const defaultSeedData = {
  company: {
    brandName: 'The Kasar Himalayan Heights & Expeditions',
    hotelName: 'The Kasar Himalayan Heights',
    travelName: 'Himalayan Expeditions',
    tagline: 'High-Altitude Luxury Boutique Chalet & Chauffeured Mountain Expeditions',
    elevation: '6,942 ft',
    conciergePhone: '+91 88999 33339',
    whatsappNumber: '918899933339',
    whatsappDisplay: '+91 88999 33339',
    email: 'concierge@kasarhimalayanheights.com',
    hotelAddress: "Crank's Ridge, Kasar Devi, Almora, Uttarakhand, India (6,942 ft)",
    travelHubAddress: 'Almora Station Base, Uttarakhand, India',
    instagramUrl: 'https://instagram.com/kasarhimalayanheights',
    facebookUrl: 'https://facebook.com/kasarhimalayanheights',
    upiId: 'kasarhimalayan@upi',
    googleMapsEmbedUrl: '',
  },
  announcement: {
    enabled: true,
    message:
      '॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥ Visiting Kainchi Dham or Kasar Devi? Consecrated yatra assistance, heated chalet suites & temple cabs are open for booking.',
    linkText: 'Yatra Booking ↗',
    linkHref: '#enquiry',
  },
  landingHero: {
    devotionalGreeting: 'जय श्री बाबा नीम करोली महाराज की',
    devotionalSubGreeting: 'Ram Ram • Jai Sri Hanuman',
    teachingQuote: 'Love. Serve. Remember.',
    quoteAttribution: 'Teachings of Sri Neem Karoli Baba Maharaj',
    welcomeStatement:
      'Kasar Devi and the Kumaon Himalayas have welcomed spiritual seekers, mystics, and travelers for centuries. Surrounded by ancient deodar forests and the silent majesty of snow peaks, we welcome you with deep reverence and quiet hospitality.',
  },
  landingContent: {
    itinerary: [
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
    ],
    faqs: [
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
    ],
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
      image: '/shared/assets/images/sedan.jpg',
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
      image: '/shared/assets/images/innova-crysta.jpg',
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
      image: '/shared/assets/images/minibus.jpg',
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
      image: '/shared/assets/images/kainchi-dham.webp',
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
      image: '/shared/assets/images/jageshwar.jpg',
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
      image: '/shared/assets/images/kasar-devi-temple.jpg',
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
      image: '/shared/assets/images/kathgodam-station.jpg',
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
      image: '/shared/assets/images/kausani.jpg',
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
      image: '/shared/assets/images/nainital.jpg',
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
// 1. GET SETTINGS (Public, Fast Read & Auto-Seed)
// ==========================================
exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    // Auto-seed if database collection is empty
    if (!settings) {
      settings = await SiteSettings.create(defaultSeedData);
    } else if (
      !settings.landingContent ||
      !settings.landingContent.itinerary ||
      settings.landingContent.itinerary.length === 0
    ) {
      settings.landingContent = defaultSeedData.landingContent;
      settings.markModified('landingContent');
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve site settings',
      error: error.message,
    });
  }
};

// ==========================================
// 2. UPDATE FULL SETTINGS (Protected, Admin)
// ==========================================
exports.updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Site settings updated successfully',
      data: settings,
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update site settings',
      error: error.message,
    });
  }
};

// ==========================================
// 3. PATCH SPECIFIC SECTION (Protected, Admin)
// ==========================================
exports.patchSection = async (req, res) => {
  try {
    const { section } = req.params;
    const allowedSections = [
      'company',
      'announcement',
      'landingHero',
      'landingContent',
      'cabFleet',
      'destinations',
      'hotelPolicies',
      'travelPolicies',
      'pricingRules',
    ];

    if (!allowedSections.includes(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid section '${section}'. Allowed sections: ${allowedSections.join(', ')}`,
      });
    }

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(defaultSeedData);
    }

    settings[section] = req.body;
    await settings.save();

    res.status(200).json({
      success: true,
      message: `Section '${section}' updated successfully`,
      data: settings[section],
    });
  } catch (error) {
    console.error(`Error patching section ${req.params.section}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to patch section ${req.params.section}`,
      error: error.message,
    });
  }
};
