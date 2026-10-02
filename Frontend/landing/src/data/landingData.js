// =========================================================================
// REAL DATA: Transit Distances, Travel Times & Routes
// =========================================================================
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
      highlight: 'Positioned on the geomagnetic belt shared only with Stonehenge and Machu Picchu. Famous for intense meditation quietude.',
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
      recommendedVehicle: 'Dzire Sedan (₹3,800) / Innova Crysta (₹5,500)',
      highlight: 'Platform meet-and-greet by our chauffeured fleet with direct luggage handling and direct hotel drop.',
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
    tariff: '₹8,500',
    unit: 'per night + taxes',
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
    tariff: '₹12,500',
    unit: 'per night + taxes',
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
    tag: 'Contemplative Retreat',
    tariff: '₹7,200',
    unit: 'per night + taxes',
    size: '360 sq ft',
    image: atticSuiteImg,
    features: [
      'Angled pine-sloped roof with sky window for stargazing',
      'Private meditation corner overlooking deodar valley',
      'Dual electric bed warming mats & quiet oil radiator',
      'Quietude sanctuary with zero road traffic sound',
      'Dedicated writer desk with fast high-speed optical Wi-Fi',
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
    tag: 'Most Recommended for Ghat Roads',
    rateKathgodam: '₹5,500',
    rateDelhi: '₹14,500',
    image: innovaImg,
    specs: [
      'Accommodates 6 passengers + 4 large check-in bags comfortably',
      'Individual rear reclining captain seats with AC & heating',
      'High ground clearance ideal for high-altitude Kumaon ghat roads',
      'Driven by licensed native Pahadi chauffeurs with 10+ years experience',
      'Zero hidden ghat charges — fuel, driver allowances & toll included',
    ],
  },
  {
    id: 'sedan',
    name: 'Maruti Suzuki Dzire (Private Mountain Sedan)',
    type: '4+1 Compact Executive Sedan',
    tag: 'Best for Couples & Small Families',
    rateKathgodam: '₹3,800',
    rateDelhi: '₹10,500',
    image: sedanImg,
    specs: [
      'Comfortable seating for 3-4 passengers + 2 medium bags',
      'Clean sanitised interior with phone chargers & water bottles',
      'Smooth hill cornering and economical transfers',
      'Punctual Kathgodam station pickup and luggage assistance',
      'Fixed all-inclusive tariff from Almora base hub',
    ],
  },
  {
    id: 'urbania',
    name: 'Force Urbania Luxury Minibus',
    type: '12+1 Executive Pilgrimage Carrier',
    tag: 'Large Family & Group Darshan',
    rateKathgodam: '₹9,800',
    rateDelhi: '₹22,000',
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
// REAL DATA: Authentic Visitor FAQs
// =========================================================================
export const faqsData = [
  {
    q: 'How do I arrange a darshan at Kainchi Dham Ashram from The Kasar Himalayan Heights?',
    a: 'Kainchi Dham Ashram is located 45 km (approximately 1.5 hours scenic drive) from our resort. Our concierge arranges private chauffeured transfers departing early morning (around 6:30 AM) to reach the ashram for the tranquil morning aarti, bypassing heavy afternoon highway traffic. The ashram remains open daily from 6:00 AM to 7:00 PM for general darshan and prasadam.',
  },
  {
    q: 'Are the suites properly heated during the winter months (November to February)?',
    a: 'Yes, absolutely. Winters at 6,942 FT feature night temperatures ranging from -2°C to 6°C. Every room and suite is equipped with dual-zone electric under-bed heating mats, oil radiators or ceramic blowers, high-pressure 24/7 hot water, and heavy down duvets. Select suites also feature working wood-burning fireplaces stocked with fragrant pine firewood.',
  },
  {
    q: 'Can your chauffeured cabs pick us up directly from Kathgodam Railway Station?',
    a: 'Yes. Our mountain fleet is based in the Almora/Kathgodam corridor. For guests arriving on the Kathgodam Shatabdi Express (12040), Ranikhet Express (15014), or Uttaranchal Sampark Kranti (15036), our chauffeur greets you outside the platform gate with your name board, manages luggage, and drives directly to the resort (85 km, approximately 3 hours) with zero hassle.',
  },
  {
    q: 'What is the geomagnetic significance of Kasar Devi and Crank’s Ridge?',
    a: 'Kasar Devi is scientifically verified to rest on an enormous geomagnetic field formed by the Van Allen Radiation Belt. Globally, this unique high-vibration quietude is shared only with Stonehenge (England) and Machu Picchu (Peru). This distinct natural stillness has historically attracted meditators including Swami Vivekananda (1890), Rabindranath Tagore, Lama Anagarika Govinda, and Buddhist scholars.',
  },
  {
    q: 'What kind of food is served? Is pure Satvik and vegetarian food available?',
    a: 'Our kitchen prepares authentic Kumaoni regional cuisine alongside familiar North Indian homestyle meals. We regularly serve authentic local dishes like Bhatt ki Churkani (slow-cooked black bean broth), Gahat ki Dal, Kumaoni Mustard Raita, Mandua (finger millet) rotis, and fresh Buransh (rhododendron flower) juice. Pure Satvik meals without onion or garlic and fasting food (vrat ka khana) are readily prepared upon advance request.',
  },
  {
    q: 'What is the best season to view the 180° snow peaks of Trishul and Nanda Devi?',
    a: 'The clearest, most crystal-sharp views of Mount Trishul (7,120m) and Nanda Devi (7,816m) occur from October through March, when the skies are deep azure and crisp. During dawn, the first golden-pink light illuminates the peaks right across your private balcony.',
  },
];
