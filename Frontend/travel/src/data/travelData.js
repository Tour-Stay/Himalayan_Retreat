import {
  sedanImg,
  innovaImg,
  minibusImg,
  kainchiWebp,
  jageshwarImg,
  kasarTempleImg,
  trishulPeaksImg,
  innovaInteriorImg,
  urbaniaInteriorImg,
  kathgodamStationImg,
  kathgodamTaxiImg,
  kausaniImg,
  kedarnathImg,
  nainitalLakeImg,
} from '@shared';

// 1. Vehicle Fleet Data (4, 6, 12 Seater)
export const fleetData = [
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
    image: sedanImg,
    images: [sedanImg],
    features: [
      'Local Pahadi driver (10+ yrs hill experience)',
      'High ground clearance for mountain curves',
      'Warm winter heater & clean summer AC',
      'Commercial Uttarakhand permit & FastTag',
      'Bottled drinking water & first aid kit',
    ],
    idealFor: 'Kathgodam station pickup, Kainchi Dham darshan & Almora tours.',
    description: 'Clean sedan with an expert local Pahadi driver for smooth, scenic hill rides.',
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
    image: innovaImg,
    interiorImage: innovaInteriorImg,
    images: [innovaImg, innovaInteriorImg],
    features: [
      'Captain recliner seats with armrests',
      'Powerful hill engine with snow chains',
      'Dual AC & warm cabin heaters for all rows',
      'Panoramic windows for Himalayan snow peaks',
      'Spacious luggage bay & sturdy roof carrier',
    ],
    idealFor: 'Spacious family yatras to Kainchi Dham, Jageshwar & Kausani.',
    description: 'Powerful luxury SUV for families and groups touring winding mountain passes.',
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
    image: minibusImg,
    interiorImage: urbaniaInteriorImg,
    images: [minibusImg, urbaniaInteriorImg],
    features: [
      'Maharaja 2×1 pushback recliner seats',
      'Personal AC vents & phone charging ports',
      'High walk-in roof & smooth hill suspension',
      'Gentle air suspension for curving hill roads',
      'Sound system & mic for family yatra bhajans',
    ],
    idealFor: 'Group yatras, Chardham tours & large family pilgrimages.',
    description: 'Full-height luxury minibus with pushback seats and smooth mountain suspension.',
  },
];

// 2. Curated Destinations & Sacred Temples of Uttarakhand (Distances from Almora)
export const destinationsData = [
  {
    id: 'kainchi-dham',
    name: 'Kainchi Dham Ashram',
    category: 'temple',
    categoryLabel: 'Neem Karoli Baba Ashram',
    saffronTag: '॥ श्री नीब करौरी महाराज धाम ॥',
    kmFromAlmora: 45,
    duration: 'Half Day / Full Day',
    distance: '45 km from Almora (~1.5 hrs)',
    description: 'The world-famous spiritual ashram of Sri Neem Karoli Baba Maharaj beside the quiet Kshipra river. Daily evening aarti and sacred bhandara prasad.',
    image: kainchiWebp,
    highlights: ['Hanuman Temple Darshan', 'Baba Kutiya & Dhyan', 'Evening Ganga Aarti', 'Satvik Bhandara Prasad'],
    typicalFareSedan: '₹2,200',
    typicalFareInnova: '₹3,600',
  },
  {
    id: 'jageshwar-dham',
    name: 'Jageshwar Mahamrityunjaya Dham',
    category: 'temple',
    categoryLabel: '124 Ancient Shiva Temples',
    saffronTag: '॥ जागेश्वर महामृत्युंजय ज्योतिर्लिंग ॥',
    kmFromAlmora: 35,
    duration: 'Half Day / Full Day',
    distance: '35 km from Almora (~1.2 hrs)',
    description: 'Ancient 8th-century stone temple complex dedicated to Lord Shiva, sheltered in a sacred valley surrounded by towering deodar cedar trees.',
    image: jageshwarImg,
    highlights: ['Mahamrityunjaya Lingam', '124 Stone Shrines', 'Ancient Deodar Forest', 'Kumaon Heritage Museum'],
    typicalFareSedan: '₹2,000',
    typicalFareInnova: '₹3,200',
  },
  {
    id: 'kasar-devi',
    name: 'Kasar Devi & Crank’s Ridge',
    category: 'temple',
    categoryLabel: 'Peaceful Energy Ridge',
    saffronTag: '॥ माँ कासार देवी शक्तिपीठ ॥',
    kmFromAlmora: 8,
    duration: 'Local Tour (2–4 hrs)',
    distance: '8 km from Almora (~20 mins)',
    description: 'A peaceful hill ridge where Swami Vivekananda meditated in 1890. Famous for warm sunshine, calm vibes, and wide Himalayan snow peak views.',
    image: kasarTempleImg,
    highlights: ['Kasar Devi Cave Temple', 'Swami Vivekananda Rock', '180° Snow Peak Horizon', 'Quiet Pine Walking Trails'],
    typicalFareSedan: '₹800',
    typicalFareInnova: '₹1,400',
  },
  {
    id: 'kathgodam-station',
    name: 'Kathgodam Railway Station Pickup',
    category: 'transfer',
    categoryLabel: 'Train Station Transfer',
    saffronTag: '॥ स्टेशन पिकअप एवं ड्रॉप ॥',
    kmFromAlmora: 85,
    duration: 'Direct Transfer (~3 hrs)',
    distance: '85 km from Almora (~3 hrs)',
    description: 'On-time pickup at Kathgodam with your nameboard. Comfortable drive up the pine hills straight to your hotel doorstep.',
    image: kathgodamTaxiImg || kathgodamStationImg,
    highlights: ['Train Meet & Greet', 'Guest Nameboard', 'Toll & Green Taxes Included', 'Scenic Mountain Drive'],
    typicalFareSedan: '₹2,499',
    typicalFareInnova: '₹4,499',
  },
  {
    id: 'kausani',
    name: 'Kausani — 300 km Snow Peak View',
    category: 'hillstation',
    categoryLabel: 'Scenic Hill Station',
    saffronTag: '॥ त्रिशूल एवं नन्दा देवी दर्शन ॥',
    kmFromAlmora: 52,
    duration: 'Full Day Sightseeing',
    distance: '52 km from Almora (~1.8 hrs)',
    description: 'Famous for wide 300-km views of Mount Trishul and Nanda Devi peaks, green tea gardens, and Mahatma Gandhi Anasakti Ashram.',
    image: kausaniImg,
    highlights: ['300 km Peak Panorama', 'Kausani Tea Estate', 'Mahatma Gandhi Ashram', 'Rudradhari Waterfall'],
    typicalFareSedan: '₹2,800',
    typicalFareInnova: '₹4,200',
  },
  {
    id: 'nainital',
    name: 'Nainital Lake City & Temple',
    category: 'hillstation',
    categoryLabel: 'Lake City Day Tour',
    saffronTag: '॥ माँ नैना देवी शक्तिपीठ ॥',
    kmFromAlmora: 63,
    duration: 'Full Day Sightseeing',
    distance: '63 km from Almora (~2 hrs)',
    description: 'Explore the Lake District of Uttarakhand. Boating on Naini Lake, Maa Naina Devi temple darshan, cable car ride, and mall road shopping.',
    image: nainitalLakeImg,
    highlights: ['Naini Lake Boating', 'Maa Naina Devi Temple', 'Snow View Point', 'Tibetan Market'],
    typicalFareSedan: '₹3,000',
    typicalFareInnova: '₹4,800',
  },
  {
    id: 'chardham-yatra',
    name: 'Sacred Chardham Yatra Circuit',
    category: 'temple',
    categoryLabel: 'Kedarnath & Badrinath Tour',
    saffronTag: '॥ श्री केदारनाथ एवं बद्रीनाथ यात्रा ॥',
    kmFromAlmora: 475,
    duration: '8 to 12 Days',
    distance: 'Complete Uttarakhand Circuit',
    description: 'Private cab service for Kedarnath, Badrinath, Gangotri, and Yamunotri with experienced local hill drivers and oxygen support on request.',
    image: kedarnathImg,
    highlights: ['Kedarnath Darshan', 'Badrinath Temple', 'Helicopter Liaison', 'Oxygen Support & Experienced Driver'],
    typicalFareSedan: 'On Request',
    typicalFareInnova: 'On Request',
  },
];

// 3. Safety & Mountain Reliability Standards (6 Pillars)
export const safetyStandards = [
  {
    title: 'Friendly Local Pahadi Drivers',
    desc: 'Born in Kumaon with 10+ years driving on winding Himalayan roads.',
    icon: 'Shield',
  },
  {
    title: 'High Clearance & Clean AC Cabs',
    desc: 'High ground clearance, warm hill heaters, and winter snow chains.',
    icon: 'Car',
  },
  {
    title: 'Commercial Uttarakhand Permits',
    desc: '100% legal tourist permits, passenger travel insurance, and FastTag.',
    icon: 'Check',
  },
  {
    title: 'Honest Fixed Prices Guarantee',
    desc: 'All-inclusive upfront rates with zero surprise charges or bargaining.',
    icon: 'Pricing',
  },
  {
    title: 'Clean Cabs & First Aid Onboard',
    desc: 'Sanitized cabins with fresh drinking water, sick bags, and first-aid.',
    icon: 'Heart',
  },
  {
    title: 'On-Time Railway & Airport Pickups',
    desc: 'On-time arrival at Kathgodam Station or Pantnagar Airport with nameboard.',
    icon: 'Clock',
  },
];

// 4. Authentic Traveler Reviews
export const travelReviewsData = [
  {
    id: 'rev-1',
    name: 'Sunil & Sunita Sharma',
    city: 'New Delhi',
    trip: 'Kathgodam to Kainchi Dham & Kasar Devi',
    vehicle: 'Toyota Innova Crysta',
    rating: 5,
    date: 'February 2026',
    comment:
      'We booked the Innova for our family trip to Kainchi Dham. Our driver Ramesh ji was very polite and knew the best time for the evening aarti so we did not face rush. The cab was spotless and warm on cold mountain mornings. Truly trusted service!',
  },
  {
    id: 'rev-2',
    name: 'Dr. Anand Verma',
    city: 'Lucknow',
    trip: 'Jageshwar Dham & Kasar Sunrise Tour',
    vehicle: 'Swift Dzire Sedan',
    rating: 5,
    date: 'January 2026',
    comment:
      'Best cab service in Almora. Fixed transparent price without any bargaining. The driver drove very gently on hill turns, which was great since my mother gets motion sickness. Highly recommend for any temple tour in Uttarakhand.',
  },
  {
    id: 'rev-3',
    name: 'Pooja Agarwal & Friends',
    city: 'Bengaluru',
    trip: '3-Day Kumaon Circuit (Kasar, Kausani, Nainital)',
    vehicle: 'Force Urbania Minibus',
    rating: 5,
    date: 'December 2025',
    comment:
      'We traveled in a group of 10 people in the luxury Urbania. The pushback seats and wide windows gave us incredible views of Trishul and Nanda Devi snow peaks. Driver was punctual and very helpful with luggage.',
  },
];

// 5. Frequently Asked Questions
export const travelFaqs = [
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
];

// 6. Resilient Asset & Settings Resolvers
export const mergeFleetWithSettings = (cabFleetSettings) => {
  if (!cabFleetSettings || !Array.isArray(cabFleetSettings) || cabFleetSettings.length === 0) {
    return fleetData;
  }
  return cabFleetSettings
    .filter((f) => f.isActive !== false)
    .map((f) => {
      const defaultItem = fleetData.find((d) => d.id === f.id) || {};
      const isRemote =
        typeof f.image === 'string' &&
        (f.image.startsWith('http://') || f.image.startsWith('https://') || f.image.startsWith('data:'));
      const resolvedImage = isRemote ? f.image : (defaultItem.image || f.image || innovaImg);
      return {
        ...defaultItem,
        ...f,
        image: resolvedImage,
        interiorImage: f.interiorImage || defaultItem.interiorImage,
        images:
          Array.isArray(f.images) && f.images.length > 0
            ? f.images
            : defaultItem.images || [resolvedImage],
      };
    });
};

export const mergeDestinationsWithSettings = (destinationsSettings) => {
  if (!destinationsSettings || !Array.isArray(destinationsSettings) || destinationsSettings.length === 0) {
    return destinationsData;
  }
  return destinationsSettings
    .filter((d) => d.isActive !== false)
    .map((d) => {
      const defaultDest = destinationsData.find((item) => item.id === d.id) || {};
      const isRemote =
        typeof d.image === 'string' &&
        (d.image.startsWith('http://') || d.image.startsWith('https://') || d.image.startsWith('data:'));
      const resolvedImage = isRemote ? d.image : (defaultDest.image || d.image || kainchiWebp);
      return {
        ...defaultDest,
        ...d,
        distance: d.distance || d.distanceText || defaultDest.distance || `${d.kmFromAlmora || 50} km from Almora`,
        image: resolvedImage,
      };
    });
};

