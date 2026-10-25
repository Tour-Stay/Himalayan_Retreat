// =========================================================================
// REAL DATA: Transit Distances, Travel Times & Routes
// =========================================================================
import { APP_URLS } from '@shared';

export const routeData = {
  dhams: [
    {
      name: 'Kainchi Dham Ashram',
      dedication: 'Sri Neem Karoli Baba Maharaj Sanctuary',
      distance: '45 km',
      time: '1.5 hrs',
      route: 'Via Almora - Khairna - Bhowali Road (NH 109)',
      roadCondition: 'Smooth Paved Hill Highway',
      recommendedVehicle: 'Sedan / Innova Crysta',
      highlight: 'Established in 1962 on the banks of the Kshipra river. Daily evening aarti and Hanuman Chalisa recitation.',
    },
    {
      name: 'Jageshwar Mahamrityunjaya Dham',
      dedication: '124 Ancient 8th-Century Jyotirlinga Stone Shrines',
      distance: '35 km',
      time: '1.2 hrs',
      route: 'Via Barechhina - Artola - Jageshwar Deodar Valley',
      roadCondition: 'Scenic Deodar Forest Road',
      recommendedVehicle: 'Innova Crysta / Sedan',
      highlight: 'Cluster of 124 Nagara-style stone temples surrounded by towering deodar trees. Dedicated priest puja liaison available.',
    },
    {
      name: "Kasar Devi Temple & Crank's Ridge",
      dedication: '2nd Century Devi Shrine & Van Allen Geomagnetic Belt',
      distance: '800 meters',
      time: '5 min walk',
      route: 'Direct walking ridge trail from resort',
      roadCondition: 'Pine Needle Footpath & Stone Steps',
      recommendedVehicle: 'Walking / Resort Shuttle',
      highlight: 'Positioned on the geomagnetic belt shared only with Stonehenge and Machu Picchu. Famous for its natural peace and meditation calm.',
    },
    {
      name: 'Baijnath Temple Complex',
      dedication: '12th Century Katyuri Dynasty Shiva-Parvati Temple',
      distance: '72 km',
      time: '2.5 hrs',
      route: 'Via Kausani - Garur Highway along Gomti river',
      roadCondition: 'Scenic Valley Road',
      recommendedVehicle: 'Innova Crysta / Urbania',
      highlight: 'Ancient stone temple complex on the banks of Gomti river with sacred fish pools and panoramic Himalayan foothills.',
    },
  ],
  transit: [
    {
      name: 'Kathgodam Railway Station (KGM)',
      dedication: 'Primary Railhead for Shatabdi, Ranikhet & Kathgodam Express',
      distance: '85 km',
      time: '3 hrs',
      route: 'Via Kathgodam - Bhimtal - Bhowali - Khairna - Almora',
      roadCondition: 'Well-maintained National Highway 109',
      recommendedVehicle: 'Dzire Sedan / Innova Crysta SUV',
      highlight: 'Platform meet-and-greet by our friendly local drivers with luggage assistance and direct hotel drop.',
    },
    {
      name: 'Pantnagar Airport (PGH)',
      dedication: 'Nearest Domestic Airport (Daily Flights from Delhi & Dehradun)',
      distance: '120 km',
      time: '4.0 hrs',
      route: 'Via Rudrapur - Haldwani - Kathgodam - Almora',
      roadCondition: 'Highway transition to Ghat roads',
      recommendedVehicle: 'Innova Crysta / High-Clearance Fleet',
      highlight: 'Punctual flight reception with complimentary bottled water and hill refreshment halt at Bhowali.',
    },
    {
      name: 'New Delhi / NCR (Indira Gandhi Airport)',
      dedication: 'Capital Road Corridor via Moradabad & Rampur',
      distance: '375 km',
      time: '8.5 - 9 hrs',
      route: 'Via Delhi - Hapur Bypass - Moradabad - Rampur - Kathgodam - Almora',
      roadCondition: 'Expressway transition to Kumaon hills',
      recommendedVehicle: 'Toyota Innova Crysta / Luxury Urbania',
      highlight: 'Comfortable long-haul private chauffeur with scheduled highway sanitised rest stops and direct mountain ascent.',
    },
  ],
  excursions: [
    {
      name: 'Binsar Wildlife Sanctuary (Zero Point)',
      dedication: 'Dense Oak-Rhododendron Forest & 300 km Snow Crests',
      distance: '22 km',
      time: '45 mins',
      route: 'Via Binsar Forest Gate & Upper Ridge',
      roadCondition: 'Sanctuary Forest Road (Forest Entry Fee Applicable)',
      recommendedVehicle: 'High-Clearance SUV / Innova',
      highlight: 'Uninterrupted panoramic views of Kedarnath, Chaukhamba, Trishul, Nanda Devi and Panchachuli peaks.',
    },
    {
      name: 'Mukteshwar Dham & Chauli ki Jali',
      dedication: '350-Year-Old Shiva Temple & Overhanging Cliffs',
      distance: '48 km',
      time: '1.8 hrs',
      route: 'Via Bhowali - Ramgarh Apple Belt - Mukteshwar',
      roadCondition: 'Winding Ridge Roads through Fruit Orchards',
      recommendedVehicle: 'Innova Crysta / Sedan',
      highlight: 'Dramatic cliff views over the Ramgarh valley and ancient stone shrine at 6,942 ft elevation.',
    },
    {
      name: 'Ranikhet Army Cantonment & Chaubatia Orchards',
      dedication: 'Kumaon Regimental Centre & British Heritage Greens',
      distance: '46 km',
      time: '1.5 hrs',
      route: 'Via Almora - Kosi - Ranikhet Road',
      roadCondition: 'Gentle Hill Road',
      recommendedVehicle: 'Sedan / Innova Crysta',
      highlight: 'Historic pine forests, high-altitude golf course, apple research orchards, and serene cantonment architecture.',
    },
  ],
};

import { snowViewSuiteImg, chaletSuiteImg, atticSuiteImg, innovaImg, sedanImg, minibusImg } from '@shared';

// =========================================================================
// REAL DATA: Suite Showcase (The Boutique Hotel)
// =========================================================================
export const suitesData = [
  {
    id: 'nanda-devi',
    name: 'Nanda Devi Panoramic Heated Suite',
    tag: 'Signature Sunrise Suite',
    tariff: 'Available on Request',
    unit: 'includes Satvik breakfast',
    size: '420 sq ft',
    image: snowViewSuiteImg,
    features: [
      'Dual-zone electric under-bed blankets for winter comfort',
      'Private cedar wood balcony facing Trishul & Nanda Devi peaks',
      'Handcrafted Kumaoni stone fireplace with pine firewood',
      '24/7 continuous high-pressure heated water & heater',
      'King bed with premium down duvets & organic cotton linens',
    ],
  },
  {
    id: 'cedar-chalet',
    name: 'Cedar Alpine Family Chalet',
    tag: 'Two-Bedroom Residence',
    tariff: 'Available on Request',
    unit: 'includes Satvik breakfast',
    size: '680 sq ft',
    image: chaletSuiteImg,
    features: [
      'Two interconnected private bedrooms with en-suite baths',
      'Spacious living lounge with wood burning fireplace & books',
      'Private panoramic garden deck with morning tea seating',
      'Satvik in-room tea & coffee bar with hill herbal infusions',
      'Accommodates up to 4 adults comfortably + 2 children',
    ],
  },
  {
    id: 'attic-sanctuary',
    name: "Crank's Ridge Attic Glass Suite",
    tag: 'Peaceful Mountain Retreat',
    tariff: 'Available on Request',
    unit: 'includes Satvik breakfast',
    size: '360 sq ft',
    image: atticSuiteImg,
    features: [
      'Angled pine wood roof with glass ceiling for stargazing',
      'Private meditation corner overlooking deodar valley',
      'Electric bed warming blankets & warm room heater',
      'Completely quiet with zero road traffic noise',
      'Dedicated work desk with fast high-speed Wi-Fi',
    ],
  },
];

// =========================================================================
// REAL DATA: Fleet Showcase (Chauffeured Mountain Fleet)
// =========================================================================
export const fleetData = [
  {
    id: 'innova',
    name: 'Toyota Innova Crysta (Heated Cabin)',
    type: '6+1 Luxury High-Clearance MPV',
    tag: 'Most Recommended for Hill Roads',
    rateKathgodam: 'Station Transfer',
    rateDelhi: 'Delhi NCR Pickup',
    image: innovaImg,
    specs: [
      'Accommodates 6 passengers + 4 large check-in bags comfortably',
      'Individual rear reclining captain seats with AC & heating',
      'High ground clearance ideal for high-altitude Kumaon hill roads',
      'Driven by licensed native Pahadi chauffeurs with 10+ years experience',
      'Dedicated temple halts at Kainchi Dham and Jageshwar',
    ],
  },
  {
    id: 'sedan',
    name: 'Maruti Suzuki Dzire (Private Mountain Sedan)',
    type: '4+1 Compact Executive Sedan',
    tag: 'Best for Couples & Small Families',
    rateKathgodam: 'Station Transfer',
    rateDelhi: 'Delhi NCR Pickup',
    image: sedanImg,
    specs: [
      'Comfortable seating for 3-4 passengers + 2 medium bags',
      'Clean sanitised interior with phone chargers & water bottles',
      'Smooth hill cornering and economical transfers',
      'Punctual Kathgodam station pickup and luggage assistance',
      'Dedicated hill-expert chauffeur for temple circuits',
    ],
  },
  {
    id: 'urbania',
    name: 'Force Urbania Luxury Minibus',
    type: '12+1 Executive Pilgrimage Carrier',
    tag: 'Large Family & Group Darshan',
    rateKathgodam: 'Station Transfer',
    rateDelhi: 'Delhi NCR Pickup',
    image: minibusImg,
    specs: [
      '12 plush individual pushback reclining leather seats',
      'Extra-large panoramic glass windows for mountain sight-seeing',
      'Dedicated rear luggage hold for 12+ large suitcases',
      'Ideal for joint family pilgrimages to Kainchi Dham & Jageshwar',
      'Hill-certified driver and co-driver support on long circuits',
    ],
  },
];

// =========================================================================
// REAL DATA: Authentic Visitor FAQs (Enriched Concierge Knowledge Base)
// =========================================================================
export const faqsData = [
  {
    id: 'kainchi-dham',
    category: 'kainchi',
    categoryLabel: 'Kainchi Dham & Shrines',
    icon: '🛕',
    badge: '45 km • 1.5 hrs Scenic Drive',
    q: 'How do I arrange a darshan at Kainchi Dham Ashram from The Kasar Himalayan Heights?',
    a: 'Kainchi Dham Ashram (dedicated to Sri Neem Karoli Baba Maharaj) is located 45 km (~1.5 hours scenic drive) via NH 109 from our retreat. We arrange dedicated chauffeured mountain cabs that depart early morning (around 7:00 AM) so you reach comfortably for the tranquil morning aarti, avoid highway congestion, and offer sacred prashad. Your private cab waits on-site while you spend peaceful time in meditation before continuing back or touring Almora.',
    highlights: [
      'Scenic 45 km route along Almora - Khairna - Bhowali road (NH 109)',
      'Recommended 7:00 AM early morning departure for serene darshan & aarti',
      'Chauffeur waits on-site with luggage security throughout your visit',
      'Return to heated suites with complimentary hot mountain tea'
    ],
    actionText: 'Book Kainchi Darshan Cab ↗',
    actionHref: '#enquiry',
    actionType: 'enquiry',
  },
  {
    id: 'room-heating',
    category: 'heating',
    categoryLabel: 'Winter Heating & Suites',
    icon: '🔥',
    badge: 'Dual Heating + 24/7 Geysers',
    q: 'Are the suites properly heated during the winter months (November to February)?',
    a: 'Yes, full winter warmth is guaranteed across all rooms. Kasar Devi sits at 6,942 FT where night temperatures can drop to 0°C - 4°C in peak winter. Every suite is equipped with dual-zone electric under-bed heating blankets (switched on in advance to keep your bed cozy), silent oil-filled radiators / room heaters, heavy Siberian down duvets, and 24/7 continuous high-pressure running hot water. Select signature chalets also feature authentic hand-chiseled stone fireplaces with fragrant deodar & pine firewood.',
    highlights: [
      'Dual-zone electric bed warmers pre-heated before sleep',
      'Silent oil-filled radiators and blower heating in all suites',
      'Continuous 24x7 high-pressure running geyser hot water',
      'Traditional stone wood-burning fireplaces in luxury chalets'
    ],
    actionText: 'Explore Heated Suites ↗',
    actionHref: `${APP_URLS.hotel}/#rooms`,
    actionType: 'hotel',
  },
  {
    id: 'station-cabs',
    category: 'cabs',
    categoryLabel: 'Station Cabs & Transfers',
    icon: '🚕',
    badge: 'Kathgodam Platform Meet & Greet',
    q: 'Can your chauffeured cabs pick us up directly from Kathgodam Railway Station or Airport?',
    a: 'Yes. Our mountain expedition fleet provides guaranteed platform meet-and-greet at Kathgodam Railway Station (85 km, ~3 hours scenic mountain drive) and Pantnagar Domestic Airport (120 km, ~4 hours). Your hill-certified driver monitors your train schedule (Shatabdi Express, Ranikhet Express, Kathgodam Express) in real time, meets you with a personalized nameboard right at the station exit, assists with heavy luggage, and provides direct drop to the retreat.',
    highlights: [
      'Punctual platform reception with nameboard & luggage assistance',
      'Choice of Innova Crysta, Swift Dzire, or 12-seater Urbania',
      'Fixed transparent rates with no hill tolls or hidden charges',
      'Experienced hill drivers with verified 10+ years mountain driving'
    ],
    actionText: 'Reserve Station Cab ↗',
    actionHref: '#enquiry',
    actionType: 'enquiry',
  },
  {
    id: 'regional-dining',
    category: 'dining',
    categoryLabel: 'Regional & Satvik Dining',
    icon: '🍲',
    badge: 'Pure Satvik & Organic Kumaoni',
    q: 'What kind of regional food is served? Is pure Satvik (no onion, no garlic) available?',
    a: 'We serve wholesome, freshly cooked regional Kumaoni specialties alongside homestyle North Indian food. Our kitchen features authentic local recipes made from organic indigenous grains, including Mandua (finger millet) rotis, Bhatt ki Churkani (black soybean slow-cooked curry), Gahat (horse gram) dal, and refreshing Pahadi cucumber raita seasoned with bhang seeds and mustard. For pilgrims and fasting guests, 100% pure Satvik meals cooked strictly without onion and garlic are prepared in dedicated cookware upon request.',
    highlights: [
      'Authentic Kumaoni pahadi delicacies & traditional copper cookware',
      '100% Pure Satvik (No Onion, No Garlic) prepared on advance request',
      'Fresh organic ingredients sourced from local high-altitude farmsteads',
      'Complimentary hot mountain breakfast included with direct stays'
    ],
    actionText: 'Inquire for Satvik Dining ↗',
    actionHref: '#enquiry',
    actionType: 'enquiry',
  },
  {
    id: 'kasar-meditation',
    category: 'kainchi',
    categoryLabel: 'Kainchi Dham & Shrines',
    icon: '✨',
    badge: 'Van Allen Geomagnetic Belt',
    q: 'What makes Kasar Devi and Crank’s Ridge so special for peace and meditation?',
    a: 'Kasar Devi is world-famous for its natural spiritual calm, deep silence, and unique geomagnetic field on the Van Allen radiation belt—a rare phenomenon shared globally only with Machu Picchu in Peru and Stonehenge in England. This electromagnetic stillness attracts meditators, seekers, and artists from across the world. The historic 2nd-century Kasar Devi Temple and Swami Vivekananda Rock Cave are an easy 800-meter pine forest walk (approx. 7 minutes) from our gates.',
    highlights: [
      '800 meters (7-min pine footpath walk) to ancient Kasar Devi Temple',
      'One of three global locations positioned on the geomagnetic energy belt',
      'Historic meditation grounds of Swami Vivekananda, Lama Govinda & Bob Dylan',
      'Pure deodar & pine-filtered air at 6,942 ft elevation'
    ],
    actionText: 'View Temple Walk Route ↗',
    actionHref: '#kasar-devi',
    actionType: 'section',
  },
  {
    id: 'snow-peaks',
    category: 'peaks',
    categoryLabel: 'Himalayan Vistas & Weather',
    icon: '🏔️',
    badge: '180° Trishul & Nanda Devi Panorama',
    q: 'What is the best season to view the 180° snow peaks of Mount Trishul and Nanda Devi?',
    a: 'The Great Himalayan snow peaks are directly visible from our private balconies, open-air sun deck, and rooftop. October through March provides the crispest, crystal-clear azure skies with breathtaking golden sunrises over Mount Trishul (7,120 m), Nanda Devi (7,816 m), and Panchachuli. During spring and early summer (April-June), mornings offer clear peak vistas accompanied by pleasant 18°C-24°C daytime temperatures.',
    highlights: [
      'Unobstructed 180° panoramic view of Mount Trishul, Nanda Devi & Maiktoli',
      'Private sunrise viewing decks and floor-to-ceiling suite windows',
      'Golden dawn alpenglow every clear morning between 6:00 AM - 6:45 AM',
      'Telescope and binoculars available for mountain ridge viewing'
    ],
    actionText: 'Check Peak View Suites ↗',
    actionHref: `${APP_URLS.hotel}/#rooms`,
    actionType: 'hotel',
  },
  {
    id: 'wifi-workation',
    category: 'heating',
    categoryLabel: 'Winter Heating & Suites',
    icon: '💻',
    badge: 'High-Speed Fiber & Power Backup',
    q: 'Is high-speed internet available for remote work and quiet mountain workations?',
    a: 'Yes. High-speed optical fiber Wi-Fi covers all suites, dining lounges, and panoramic garden decks. Inverter power backup is maintained on the property so your Zoom video calls and digital work proceed uninterrupted amidst pure pine air and mountain silence.',
    highlights: [
      'High-speed optical fiber Wi-Fi across suites and private balconies',
      'Seamless power backup for uninterrupted connectivity',
      'Ergonomic wooden work desks in Himalayan Attic Suites',
      'Peaceful pine terraces for creative focus and writing'
    ],
    actionText: 'Inquire for Workation Stay ↗',
    actionHref: '#enquiry',
    actionType: 'enquiry',
  },
  {
    id: 'parking-access',
    category: 'cabs',
    categoryLabel: 'Station Cabs & Transfers',
    icon: '🚗',
    badge: 'Direct Motorable Road & Free Parking',
    q: 'Can we drive our personal vehicle to the property? Is safe on-site parking available?',
    a: 'Yes. The Kasar Himalayan Heights is directly accessible via a wide, well-tarred motorable road on Crank’s Ridge above Almora. We provide free secure on-site private parking for guest cars, with overnight driver resting quarters and washrooms available upon advance notice.',
    highlights: [
      'Direct motorable tarmac road all the way to resort entrance',
      'Complimentary secure on-site parking for cars and SUVs',
      'Overnight driver dormitory accommodation available on request',
      'EV charging assistance and vehicle washing support'
    ],
    actionText: 'Get Driving Directions ↗',
    actionHref: 'https://www.google.com/maps/dir/?api=1&destination=29.641388,79.6635582',
    actionType: 'external',
  },
];
