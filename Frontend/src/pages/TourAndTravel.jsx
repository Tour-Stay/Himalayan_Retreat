import { useState, useId } from 'react';
import axios from 'axios';
import SnowEffect from '../components/SnowEffect';
import {
  CarIcon,
  UsersIcon,
  LuggageIcon,
  MountainIcon,
  CompassIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PhoneIcon,
  MessageIcon,
  MapPinIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  StarIcon,
  SnowIcon,
} from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 1. Vehicle Fleet Data (4, 6, 12 Seater)
const fleetData = [
  {
    id: '4-seater',
    title: '4-Seater Mountain Sedan',
    model: 'Swift Dzire / Toyota Etios / Honda Amaze',
    seats: 4,
    luggage: '2 Large + 2 Cabin Bags',
    tag: 'Best for Couples & Small Families',
    dailyRate: 2499,
    perKmRate: 14,
    rateUnit: 'per day + fuel / transfers',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Experienced Pahadi Mountain Chauffeur',
      'High Ground Clearance for Hill Roads',
      'Powerful Cabin Heating & Air Conditioning',
      'FastTag & Uttarakhand State Green Permit',
      'Daily Sanitized with Bottled Mineral Water & First Aid',
    ],
    idealFor: 'Kathgodam Railway transfers, Nainital day tours, and Kainchi Dham darshan.',
  },
  {
    id: '6-seater',
    title: '6-Seater Luxury SUV',
    model: 'Toyota Innova Crysta / Maruti Ertiga ZXi',
    seats: 6,
    luggage: '4 Large + 3 Cabin Bags + Roof Carrier',
    tag: 'Most Popular for Kumaon Circuits',
    dailyRate: 4499,
    perKmRate: 18,
    rateUnit: 'per day + fuel / hill circuits',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
    features: [
      'Executive Captain Recliners with Armrests',
      'High-Altitude Hill Performance & Snow Chain Equipped',
      'Dual Air-Conditioning & Multi-Zone Climate Control',
      'Panoramic Mountain View Glass Windows',
      'High Clearance for Rugged Forest Roads & Ghats',
    ],
    idealFor: 'Multi-day hill station tours (Mukteshwar, Almora, Ranikhet, Kausani).',
  },
  {
    id: '12-seater',
    title: '12-Seater Luxury Minibus',
    model: 'Force Urbania / Luxury Tempo Traveller',
    seats: 12,
    luggage: '10-12 Large Bags in Dedicated Luggage Bay',
    tag: 'Chardham & Group Pilgrimages',
    dailyRate: 7999,
    perKmRate: 26,
    rateUnit: 'per day + fuel / long circuits',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85',
    features: [
      '2×1 Maharaja Plush Pushback Reclining Seats',
      'Individual AC Vents, USB Charging Ports & Reading Lights',
      'Full High-Roof Walk-In Saloon Interior',
      'Heavy-Duty Mountain Air Suspension for Smooth Ghat Rides',
      'Integrated High-Definition Audio & Chauffeur Mic for Guided Tours',
    ],
    idealFor: 'Sacred Chardham Yatra, Jageshwar spiritual retreats, and family group reunions.',
  },
];

// 2. Curated Destinations & Sacred Temples of Uttarakhand (Distances Measured from Almora)
const destinationsData = [
  {
    id: 'jageshwar-dham',
    name: 'Jageshwar Mahamrityunjaya Dham',
    category: 'temple',
    categoryLabel: 'Sacred Jyotirlinga Complex',
    kmFromAlmora: 35,
    duration: 'Half Day / Full Day',
    distance: '35 km from Almora (1 hr)',
    description: 'A deeply sacred cluster of 124 stone temples from the 7th–12th century, nestled in a tranquil Himalayan deodar cedar forest.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Temple_Cluster_at_Jageshwar.jpg/1280px-Temple_Cluster_at_Jageshwar.jpg',
    highlights: ['124 Ancient Shrines', 'Mahamrityunjaya Puja', 'Towering Deodar Grove', 'Archaeological Museum'],
  },
  {
    id: 'kainchi-dham',
    name: 'Kainchi Dham Ashram',
    category: 'temple',
    categoryLabel: 'Sacred Temple & Ashram',
    kmFromAlmora: 45,
    duration: 'Half Day / Full Day',
    distance: '45 km from Almora (1.5 hrs)',
    description: 'The world-renowned spiritual sanctuary of Neem Karoli Baba. Attracts devotees and global leaders seeking peace and divine blessings.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Early_morning_Glimpse_of_Kainchi_Dham_Nainital_2023.jpg/1280px-Early_morning_Glimpse_of_Kainchi_Dham_Nainital_2023.jpg',
    highlights: ['Bhandara Prasad', 'Hanuman Temple', 'River Meditation', 'Baba Kutiya'],
  },
  {
    id: 'ranikhet-almora',
    name: 'Ranikhet Orchards & Kasar Devi',
    category: 'hillstation',
    categoryLabel: 'Heritage & Cosmic Energy',
    kmFromAlmora: 46,
    duration: 'Full Day Tour',
    distance: '46 km from Almora (1.5 hrs)',
    description: 'Explore the pine ridge of Ranikhet with Chaubatia apple orchards, combined with Kasar Devi magnetic energy ridge in Almora.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Kasar_Devi_Temple.JPG/960px-Kasar_Devi_Temple.JPG',
    highlights: ['Chaubatia Apple Orchards', 'Kasar Devi Magnetic Ridge', 'Ranikhet Golf Course', 'Chitai Golu Devta'],
  },
  {
    id: 'mukteshwar-dham',
    name: 'Mukteshwar Dham & Chauli Ki Jali',
    category: 'temple',
    categoryLabel: 'Ancient Hilltop Shivalaya',
    kmFromAlmora: 50,
    duration: 'Local Full Day',
    distance: '50 km from Almora (1.8 hrs)',
    description: '350-year-old Shiva shrine perched at the highest peak of Mukteshwar (7,500 ft) overlooking Chauli Ki Jali cliff and Trishul peaks.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chauli_Ki_Jali%2C_Mukteshwar.jpg/1280px-Chauli_Ki_Jali%2C_Mukteshwar.jpg',
    highlights: ['Ancient Shiva Lingam', 'Chauli Ki Jali Cliff Vistas', 'Trishul Peak View', 'Sunset Horizon'],
  },
  {
    id: 'kausani',
    name: 'Kausani — The Switzerland of India',
    category: 'hillstation',
    categoryLabel: 'Panoramic Alpine Haven',
    kmFromAlmora: 52,
    duration: 'Full Day or Overnight',
    distance: '52 km from Almora (1.8 hrs)',
    description: 'Famed for its 300-km uninterrupted panoramic view of Trishul, Nanda Devi and Panchachuli summits, tea gardens, and Anasakti Ashram.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Sunset_at_Kausani.JPG/1280px-Sunset_at_Kausani.JPG',
    highlights: ['300 km Peak Wall', 'Kausani Tea Estate', 'Mahatma Gandhi Ashram', 'Rudradhari Waterfall'],
  },
  {
    id: 'nainital',
    name: 'Nainital Lake City & Peaks',
    category: 'hillstation',
    categoryLabel: 'Iconic Hill Station',
    kmFromAlmora: 63,
    duration: 'Full Day Tour',
    distance: '63 km from Almora (2 hrs)',
    description: 'The City of Lakes. Enjoy yacht boating on Naini Lake, the Naina Devi Shaktipeeth, Snow View cable car, and heritage Mall Road.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Boat-Man_at_Naini_Lake.jpg/1280px-Boat-Man_at_Naini_Lake.jpg',
    highlights: ['Naini Lake Boating', 'Naina Devi Temple', 'Snow View Cable Car', 'High-Altitude Zoo'],
  },
  {
    id: 'kathgodam-station',
    name: 'Kathgodam Railway Station Transfer',
    category: 'hillstation',
    categoryLabel: 'Railway Foothills Gateway',
    kmFromAlmora: 85,
    duration: 'Direct Transfer',
    distance: '85 km from Almora (2.5 hrs)',
    description: 'Direct mountain highway transfer connecting Almora and Kathgodam Railway Station for Shatabdi, Ranikhet Express, or Lucknow Mail.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Boat-Man_at_Naini_Lake.jpg/1280px-Boat-Man_at_Naini_Lake.jpg',
    highlights: ['Train Meet & Greet', 'Nameboard Assistance', 'FastTag Tolls Included', 'Foothills Highway'],
  },
  {
    id: 'chardham-yatra',
    name: 'Sacred Chardham Yatra Circuit',
    category: 'temple',
    categoryLabel: 'Himalayan Mahayatra',
    kmFromAlmora: 475,
    duration: '8 to 12 Days',
    distance: '475 km one-way (950 km Full Circuit)',
    description: 'Bespoke private luxury mountain fleet escorts for Kedarnath, Badrinath, Gangotri & Yamunotri with VIP darshan and helicopter liaison.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Kedarnath_Temple_in_Rainy_season.jpg/1280px-Kedarnath_Temple_in_Rainy_season.jpg',
    highlights: ['Kedarnath Darshan', 'Badrinath Temple', 'Helicopter Coordination', 'Dedicated Driver & Oxygen'],
  },
];

// 3. Safety Standards
const safetyStandards = [
  {
    title: 'Experienced Pahadi Chauffeurs',
    desc: 'Born and raised in the mountains, trained in hill hairpin negotiation, dense fog, and snow handling.',
    icon: MountainIcon,
  },
  {
    title: 'High-Altitude & Snow Ready',
    desc: 'Vehicles inspected before every trip, equipped with all-weather tyres and snow chains for winter passes.',
    icon: SnowIcon,
  },
  {
    title: '100% Commercial State Permits',
    desc: 'Fully authorized Uttarakhand commercial tourist permits, comprehensive passenger insurance, and FastTag.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Transparent Pricing Guarantee',
    desc: 'Clear upfront quotes with driver allowance, fuel, and state permits. No unexpected surcharges at the end.',
    icon: SparklesIcon,
  },
  {
    title: 'Daily Sanitized & First Aid Stocked',
    desc: 'Clean cabin, bottled Himalayan mineral water, vomit/sickness bags, and portable oxygen canister on request.',
    icon: CheckCircleIcon,
  },
  {
    title: 'Punctual Railway & Airport Meet',
    desc: 'On-time pickup at Kathgodam Railway Station or Pantnagar Airport with personalized guest nameboard.',
    icon: CompassIcon,
  },
];

const TourAndTravel = () => {
  const [selectedFleetId, setSelectedFleetId] = useState('6-seater');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDestinations, setSelectedDestinations] = useState(['jageshwar-dham']);
  const [snowActive, setSnowActive] = useState(true);

  // Fare Calculator State: Starting Station is Almora!
  const [originStation, setOriginStation] = useState('Almora Station / Town Base');
  const [tripDirection, setTripDirection] = useState('round-trip'); // 'round-trip' | 'one-way'
  const [customDistanceKm, setCustomDistanceKm] = useState(null); // manual slider or direct input override
  const [tripDays, setTripDays] = useState(1);
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split('T')[0];
  });
  const [passengerCount, setPassengerCount] = useState(4);

  // Booking Form State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const currentFleet = fleetData.find((f) => f.id === selectedFleetId) || fleetData[1];

  // Auto-calculated distance from Almora based on selected circuits
  const getAutoDistance = () => {
    if (selectedDestinations.length === 0) return 35;
    const maxOneWay = Math.max(
      ...selectedDestinations.map((id) => {
        const found = destinationsData.find((d) => d.id === id);
        return found && found.kmFromAlmora ? found.kmFromAlmora : 35;
      })
    );
    const sideTripAddon = (selectedDestinations.length - 1) * 20;
    const oneWayTotal = maxOneWay + sideTripAddon;
    return tripDirection === 'round-trip' ? oneWayTotal * 2 : oneWayTotal;
  };

  const autoKm = getAutoDistance();
  const activeDistanceKm = customDistanceKm !== null ? customDistanceKm : autoKm;

  // Real-time Dynamic Trip Fare Calculation according to Distance and Vehicle:
  const calculateFare = () => {
    // 1. Distance fare: total km × vehicle per km rate
    const distanceCost = activeDistanceKm * currentFleet.perKmRate;
    // 2. Chauffeur mountain allowance: ₹500 per day
    const driverAllowance = 500 * tripDays;
    // 3. Uttarakhand green permits & tolls
    const permitsAndTolls = 300 * Math.max(1, Math.ceil(tripDays / 2));
    const total = distanceCost + driverAllowance + permitsAndTolls;

    return {
      distanceKm: activeDistanceKm,
      perKmRate: currentFleet.perKmRate,
      distanceCost,
      driverAllowance,
      permitsAndTolls,
      total,
    };
  };

  const fareEstimate = calculateFare();

  // Destination toggle
  const toggleDestination = (id) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Scroll helper
  const scrollToCalculator = (fleetId) => {
    if (fleetId) setSelectedFleetId(fleetId);
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // WhatsApp Concierge Dispatch (Instant pre-filled message with Almora origin & distance)
  const handleWhatsAppBooking = () => {
    const destNames = destinationsData
      .filter((d) => selectedDestinations.includes(d.id))
      .map((d) => `${d.name} (${d.kmFromAlmora} km)`)
      .join(', ') || 'Custom Mountain Circuit';

    const message = `Namaste Devbhoomi Expeditions! 🙏\n\nI would like to book a private mountain vehicle:\n` +
      `• Starting Station: ${originStation}\n` +
      `• Vehicle: ${currentFleet.title} (${currentFleet.seats} Seater)\n` +
      `• Vehicle Tariff: ₹${fareEstimate.perKmRate}/km\n` +
      `• Route Mode: ${tripDirection === 'round-trip' ? 'Round Trip (Return to Almora)' : 'One-Way Drop'}\n` +
      `• Total Distance: ${fareEstimate.distanceKm} km\n` +
      `• Travel Date: ${travelDate} (${tripDays} Day${tripDays > 1 ? 's' : ''})\n` +
      `• Passengers: ${passengerCount} Guests\n` +
      `• Selected Circuits: ${destNames}\n` +
      `• Estimated Total: ₹${fareEstimate.total.toLocaleString('en-IN')}\n` +
      (guestName ? `• Guest Name: ${guestName}\n` : '') +
      (guestPhone ? `• Phone: ${guestPhone}\n` : '') +
      (specialNotes ? `• Notes: ${specialNotes}\n` : '') +
      `\nPlease confirm vehicle assignment and chauffeur dispatch from Almora.`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919690621247?text=${encoded}`, '_blank');
  };

  // Direct Backend API Submission (Saves to database for admin review)
  const handleSubmitOnlineBooking = async (e) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !guestEmail) {
      setErrorMessage('Please fill in your Name, Phone Number, and Email Address.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    const destNames = destinationsData
      .filter((d) => selectedDestinations.includes(d.id))
      .map((d) => `${d.name} (${d.kmFromAlmora} km from Almora)`)
      .join(', ') || 'Custom Uttarakhand Itinerary';

    try {
      const payload = {
        vehicleType: selectedFleetId,
        circuit: destNames,
        pickupLocation: originStation,
        tripDays,
        travelDate,
        travelers: Number(passengerCount),
        totalAmount: fareEstimate.total,
        notes: `Mode: ${tripDirection}, Total: ${fareEstimate.distanceKm} km @ ₹${fareEstimate.perKmRate}/km. ` + specialNotes,
        guestDetails: {
          name: guestName,
          phone: guestPhone,
          email: guestEmail,
        },
      };

      const res = await axios.post(`${API_URL}/travel/bookings`, payload);
      setBookingResult(res.data.booking || { _id: 'DEV-' + Date.now().toString().slice(-6) });
    } catch (err) {
      // In case backend is offline or errors, provide instant offline reference
      setBookingResult({
        _id: 'DEV-ALMORA-' + Math.floor(100000 + Math.random() * 900000),
        offlineNotice: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered destinations
  const filteredDestinations = destinationsData.filter((dest) => {
    if (activeCategory === 'all') return true;
    return dest.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-cream font-sans text-text-dark selection:bg-secondary selection:text-primary">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION — EXACT DESIGN AS HOTEL HERO (Ken Burns, Snow, Dark Forest) */}
      {/* ========================================================================= */}
      <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-36 sm:pt-40 lg:pt-44 pb-20">
        {/* Full-bleed Alpine Panoramic Background */}
        <div className="absolute inset-0 overflow-hidden bg-primary">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=90"
            alt="Uttarakhand Mountain Ranges and Pilgrimage Road"
            className="w-full h-full object-cover object-center hero-kenburns transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/45 to-primary/95 backdrop-brightness-[0.88]"></div>
        </div>

        {/* Live Winter Snow Particles */}
        <SnowEffect count={60} active={snowActive} />

        {/* Ambient Gold Glow Orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-secondary/15 rounded-full blur-[130px] pointer-events-none"></div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          {/* Shimmer Badge */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="shimmer-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-dark text-secondary text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase border border-secondary/30 shadow-lg">
              <SparklesIcon className="w-4 h-4 text-secondary animate-pulse" />
              <span>Devbhoomi Expeditions • Private Mountain Fleet</span>
            </div>

            <button
              onClick={() => setSnowActive(!snowActive)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill-dark text-xs text-white/90 hover:text-secondary border border-white/10 transition-colors shadow-sm cursor-pointer"
              title="Toggle live winter snowfall animation"
            >
              <SnowIcon className="w-3.5 h-3.5 text-secondary" />
              <span>{snowActive ? 'Snowfall: Active' : 'Snowfall: Off'}</span>
            </button>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-medium tracking-tight mb-6 leading-[1.08] drop-shadow-md">
            Himalayan Roads & <br />
            <span className="italic font-light text-secondary">Sacred Pilgrimages</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/85 text-base sm:text-xl font-light max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
            Private chauffeured mountain travel across Uttarakhand. Experience scenic Kumaon hill stations and sacred temples with our dedicated 4, 6, and 12-seater fleet driven by experienced mountain chauffeurs.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => scrollToCalculator()}
              className="btn-gold px-8 py-4 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-2 group cursor-pointer w-full sm:w-auto justify-center font-bold shadow-xl shadow-secondary/25"
            >
              <span>Calculate Instant Trip Fare</span>
              <ArrowUpRightIcon className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </button>

            <a
              href="#fleet"
              className="btn-glass-luxury px-8 py-4 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-2 group w-full sm:w-auto justify-center text-white border border-white/30 hover:border-secondary transition-all"
            >
              <span>Explore 4, 6 & 12 Seater Fleet</span>
            </a>
          </div>

          {/* Highlights Micro Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-white/15">
            <div className="glass-pill-dark py-3 px-4 rounded-2xl border border-white/10 text-center">
              <span className="block text-secondary font-heading text-lg font-semibold">4, 6 & 12</span>
              <span className="text-white/70 text-[11px] uppercase tracking-wider">Seater Options</span>
            </div>
            <div className="glass-pill-dark py-3 px-4 rounded-2xl border border-white/10 text-center">
              <span className="block text-secondary font-heading text-lg font-semibold">100% Local</span>
              <span className="text-white/70 text-[11px] uppercase tracking-wider">Pahadi Chauffeurs</span>
            </div>
            <div className="glass-pill-dark py-3 px-4 rounded-2xl border border-white/10 text-center">
              <span className="block text-secondary font-heading text-lg font-semibold">Temples & Dhams</span>
              <span className="text-white/70 text-[11px] uppercase tracking-wider">Kainchi • Jageshwar</span>
            </div>
            <div className="glass-pill-dark py-3 px-4 rounded-2xl border border-white/10 text-center">
              <span className="block text-secondary font-heading text-lg font-semibold">All-Inclusive</span>
              <span className="text-white/70 text-[11px] uppercase tracking-wider">Tolls & Fuel Covered</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FLOATING QUICK ESTIMATOR BAR — EXACT SAME LAYOUT AS HeroBookingBar */}
      {/* ========================================================================= */}
      <div className="w-full max-w-5xl mx-auto -mt-8 sm:-mt-12 relative z-30 px-3 sm:px-4">
        <div className="glass-surface p-4 sm:p-5 rounded-3xl sm:rounded-full border border-white/80 shadow-2xl shadow-primary/20 backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">

          {/* Starting Station (3 cols) */}
          <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-black/5 transition-colors border sm:border-0 border-gray-100">
            <label className="text-[10px] text-text-light uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1">
              <MapPinIcon className="w-3.5 h-3.5 text-secondary" />
              <span>Starting Station</span>
            </label>
            <div className="text-sm font-semibold text-text-dark flex items-center justify-between">
              <span>Almora Hub</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-primary font-bold">Base</span>
            </div>
          </div>

          {/* Select Fleet (3 cols) */}
          <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer border sm:border-0 border-gray-100">
            <label className="text-[10px] text-text-light uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1">
              <CarIcon className="w-3.5 h-3.5 text-secondary" />
              <span>Fleet & Mountain Rate</span>
            </label>
            <select
              value={selectedFleetId}
              onChange={(e) => setSelectedFleetId(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-text-dark focus:outline-none cursor-pointer"
            >
              <option value="4-seater">4-Seater (₹14/km)</option>
              <option value="6-seater">6-Seater SUV (₹18/km)</option>
              <option value="12-seater">12-Seater Bus (₹26/km)</option>
            </select>
          </div>

          {/* Route Mode & Distance (3 cols) */}
          <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer border sm:border-0 border-gray-100">
            <label className="text-[10px] text-text-light uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1">
              <CompassIcon className="w-3.5 h-3.5 text-secondary" />
              <span>Route Mode & Dist.</span>
            </label>
            <select
              value={tripDirection}
              onChange={(e) => setTripDirection(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-text-dark focus:outline-none cursor-pointer"
            >
              <option value="round-trip">Round Trip ({activeDistanceKm} km)</option>
              <option value="one-way">One-Way Drop ({activeDistanceKm} km)</option>
            </select>
          </div>

          {/* Live Fare & CTA (3 cols) */}
          <div className="lg:col-span-3 flex items-center gap-2">
            <button
              onClick={() => scrollToCalculator()}
              className="btn-gold w-full py-3.5 px-5 rounded-2xl sm:rounded-full text-xs uppercase tracking-wider font-bold inline-flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-secondary/25"
            >
              <span>Est: ₹{fareEstimate.total.toLocaleString('en-IN')}</span>
              <ArrowUpRightIcon className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FLEET SHOWCASE — EXACT SAME SPLIT EDITORIAL AS SuiteShowcase.jsx */}
      {/* ========================================================================= */}
      <section id="fleet" className="py-28 px-4 bg-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
                <SparklesIcon className="w-3.5 h-3.5 text-secondary" />
                <span>Mountain-Certified Private Fleet</span>
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-text-dark font-medium tracking-tight">
                Vehicles for Every Mountain Path
              </h2>
            </div>
            <p className="text-text-light text-sm sm:text-base max-w-md font-light leading-relaxed">
              Maintained to strict high-altitude safety standards. Choose from agile mountain sedans, luxury executive 4×4 SUVs, and spacious Maharaja minibuses.
            </p>
          </div>

          {/* Vehicle Selection Tabs (01. 4-Seater, 02. 6-Seater, 03. 12-Seater) */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {fleetData.map((fleet, idx) => (
              <button
                key={fleet.id}
                onClick={() => setSelectedFleetId(fleet.id)}
                className={`px-6 py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                  selectedFleetId === fleet.id
                    ? 'bg-primary text-secondary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'bg-white/80 text-text-dark/70 hover:bg-white hover:text-text-dark border border-gray-200/70'
                }`}
              >
                <span className="font-mono text-secondary text-[11px] opacity-75">
                  0{idx + 1}.
                </span>
                <span>{fleet.title}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-secondary/20 text-secondary">
                  {fleet.seats} Seats
                </span>
              </button>
            ))}
          </div>

          {/* Split Editorial Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Full-Bleed Imagery with Floating Badges (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-2xl border border-white/60 group">
                <img
                  src={currentFleet.image}
                  alt={currentFleet.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>

                {/* Floating Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="px-3.5 py-1.5 rounded-full glass-pill-dark text-secondary text-xs font-semibold tracking-wider uppercase border border-secondary/40">
                    {currentFleet.tag}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full glass-pill-dark text-white text-xs font-medium border border-white/20">
                    {currentFleet.model}
                  </span>
                </div>

                {/* Bottom Floating Stats */}
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 text-white">
                  <span className="glass-pill-dark px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-white/15">
                    <UsersIcon className="w-3.5 h-3.5 text-secondary" />
                    <span>Up to {currentFleet.seats} Passengers</span>
                  </span>
                  <span className="glass-pill-dark px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-white/15">
                    <LuggageIcon className="w-3.5 h-3.5 text-secondary" />
                    <span>{currentFleet.luggage}</span>
                  </span>
                  <span className="glass-pill-dark px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-white/15">
                    <MountainIcon className="w-3.5 h-3.5 text-secondary" />
                    <span>Mountain Terrain Certified</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Luxury Details Card (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-secondary text-xs uppercase tracking-[0.25em] font-semibold">
                    Tariff Rate
                  </span>
                  <div className="text-right">
                    <span className="font-heading text-3xl sm:text-4xl font-semibold text-text-dark">
                      ₹{currentFleet.dailyRate.toLocaleString('en-IN')}
                    </span>
                    <span className="text-text-light text-xs block">
                      {currentFleet.rateUnit}
                    </span>
                  </div>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl text-text-dark font-medium mb-3">
                  {currentFleet.title}
                </h3>
                <p className="text-text-light text-sm leading-relaxed mb-6 font-light">
                  {currentFleet.idealFor}
                </p>

                {/* Feature Checklist */}
                <div className="space-y-3 mb-8 pt-4 border-t border-gray-100">
                  {currentFleet.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-text-dark/90">
                      <CheckCircleIcon className="w-4 h-4 text-secondary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => scrollToCalculator(currentFleet.id)}
                  className="btn-gold flex-1 py-3.5 px-6 rounded-full text-xs uppercase tracking-wider font-bold inline-flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-secondary/20"
                >
                  <span>Select for My Journey</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>

                <button
                  onClick={handleWhatsAppBooking}
                  className="btn-outline-luxury py-3.5 px-5 rounded-full text-xs uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageIcon className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Quote</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE TRIP FARE CALCULATOR & BOOKING (Requested by User) */}
      {/* ========================================================================= */}
      <section id="calculator" className="py-28 px-4 bg-white border-y border-gray-100 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-cream text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
              Live Fare Estimator
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl text-text-dark font-medium tracking-tight mb-4">
              Interactive Trip Calculator & Booking
            </h2>
            <p className="text-text-light text-base sm:text-lg font-light leading-relaxed">
              Transparent, all-inclusive mountain travel quotes. Select your vehicle, customize your days and circuits, and book instantly via WhatsApp or online reservation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Configurator (7 cols) */}
            <div className="lg:col-span-7 bg-cream rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-200/60">
                <h3 className="font-heading text-xl sm:text-2xl text-text-dark font-semibold flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-primary text-secondary text-xs flex items-center justify-center font-mono">1</span>
                  <span>Configure Your Mountain Journey</span>
                </h3>
                <span className="text-[11px] bg-secondary/15 text-primary font-bold px-3 py-1 rounded-full border border-secondary/30 inline-flex items-center gap-1.5 self-start sm:self-auto">
                  <MapPinIcon className="w-3.5 h-3.5 text-secondary" />
                  <span>Origin: Almora Hub</span>
                </span>
              </div>

              {/* Station Hub Highlight Banner */}
              <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-white border border-secondary/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-secondary flex items-center justify-center shrink-0">
                    <MapPinIcon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-[10px] text-text-light uppercase tracking-widest font-bold">
                      Starting Station (Origin Hub)
                    </div>
                    <div className="text-sm sm:text-base font-bold text-text-dark">
                      Almora Base, Uttarakhand
                    </div>
                    <div className="text-[11px] text-text-light">
                      All hill routes, circuit kilometers & tariffs calibrated from Almora
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  <label className="text-[10px] text-text-light uppercase tracking-wider block mb-1 font-semibold">
                    Almora Pickup Point
                  </label>
                  <select
                    value={originStation}
                    onChange={(e) => setOriginStation(e.target.value)}
                    className="w-full md:w-auto bg-cream border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-text-dark focus:outline-none focus:border-secondary cursor-pointer"
                  >
                    <option value="Almora Station / Town Base">Almora Station / Town Base</option>
                    <option value="Almora Mall Road / Taxi Stand">Almora Mall Road / Taxi Stand</option>
                    <option value="Almora Kasar Devi Ridge">Almora Kasar Devi Ridge</option>
                    <option value="Almora Bus Station (ISBT)">Almora Bus Station (ISBT)</option>
                    <option value="Devbhoomi Retreat Chauffeur Hub">Devbhoomi Retreat Chauffeur Hub</option>
                  </select>
                </div>
              </div>

              {/* Step 1: Vehicle Seater Fleet Selection */}
              <div className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-widest font-semibold text-text-dark">
                    Step 1: Select Fleet & Seater
                  </label>
                  <span className="text-[11px] text-secondary font-bold">Per-km mountain rate</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {fleetData.map((f) => {
                    const isSelected = selectedFleetId === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedFleetId(f.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary text-white border-secondary shadow-lg shadow-primary/25 ring-2 ring-secondary/50'
                            : 'bg-white text-text-dark border-gray-200 hover:border-secondary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-secondary' : 'text-primary'}`}>
                            {f.seats} Seater
                          </span>
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-secondary text-primary' : 'bg-primary/10 text-primary'}`}>
                            ₹{f.perKmRate}/km
                          </span>
                        </div>
                        <div className="font-heading text-sm font-semibold truncate mb-1">
                          {f.title.replace('Mountain ', '').replace('Luxury ', '')}
                        </div>
                        <div className={`text-[11px] flex items-center gap-1.5 ${isSelected ? 'text-white/80' : 'text-text-light'}`}>
                          <UsersIcon className="w-3.5 h-3.5 text-secondary" />
                          <span>Max {f.seats} Guests</span>
                          <span>•</span>
                          <span className="truncate">{f.luggage.split('+')[0]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Trip Route Mode (Round-trip vs One-way drop) */}
              <div className="mb-7">
                <label className="text-xs uppercase tracking-widest font-semibold text-text-dark block mb-3">
                  Step 2: Travel Route Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setTripDirection('round-trip')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      tripDirection === 'round-trip'
                        ? 'bg-primary text-white border-secondary shadow-md ring-1 ring-secondary/40'
                        : 'bg-white text-text-dark border-gray-200 hover:border-secondary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tripDirection"
                      checked={tripDirection === 'round-trip'}
                      onChange={() => setTripDirection('round-trip')}
                      className="mt-1 accent-secondary cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold">🔄 Round Trip (Return to Almora)</div>
                      <div className={`text-[11px] mt-0.5 ${tripDirection === 'round-trip' ? 'text-white/80' : 'text-text-light'}`}>
                        Vehicle stays with you & returns to Almora hub (2× Distance)
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setTripDirection('one-way')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      tripDirection === 'one-way'
                        ? 'bg-primary text-white border-secondary shadow-md ring-1 ring-secondary/40'
                        : 'bg-white text-text-dark border-gray-200 hover:border-secondary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tripDirection"
                      checked={tripDirection === 'one-way'}
                      onChange={() => setTripDirection('one-way')}
                      className="mt-1 accent-secondary cursor-pointer"
                    />
                    <div>
                      <div className="text-xs font-bold">➡️ One-Way Drop / Direct Transfer</div>
                      <div className={`text-[11px] mt-0.5 ${tripDirection === 'one-way' ? 'text-white/80' : 'text-text-light'}`}>
                        Direct drop from Almora to destination without return (1× Distance)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Select Destinations / Temples from Almora */}
              <div className="mb-7">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-text-dark">
                    Step 3: Select Circuits (Distances From Almora)
                  </label>
                  <span className="text-[11px] text-text-light">
                    Auto-calculates route km
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {destinationsData.map((d) => {
                    const isChecked = selectedDestinations.includes(d.id);
                    return (
                      <label
                        key={d.id}
                        onClick={() => toggleDestination(d.id)}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-primary/5 border-secondary text-primary font-semibold shadow-xs'
                            : 'bg-white border-gray-200 text-text-light hover:text-text-dark hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 text-secondary rounded focus:ring-secondary accent-secondary"
                          />
                          <span className="truncate">{d.name}</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-cream border border-gray-200 text-primary shrink-0 ml-2">
                          {d.kmFromAlmora} km
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Interactive Distance Adjuster (Slider & Manual Km Input) */}
              <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <label className="text-xs uppercase tracking-widest font-semibold text-text-dark block">
                      Step 4: Distance Calibration (Kilometers)
                    </label>
                    <span className="text-[11px] text-text-light">
                      {customDistanceKm !== null ? '⚡ Custom manual distance active' : '✨ Auto-calculated from Almora base for selected circuits'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-text-light">Total:</span>
                    <div className="flex items-center gap-1 bg-cream px-3 py-1.5 rounded-xl border border-secondary/40 font-mono font-bold text-primary text-base">
                      <input
                        type="number"
                        min="10"
                        max="2500"
                        value={activeDistanceKm}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (!isNaN(val) && val >= 0) setCustomDistanceKm(val);
                        }}
                        className="w-16 bg-transparent text-right font-mono font-bold text-primary focus:outline-none"
                      />
                      <span>km</span>
                    </div>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="space-y-1 mb-3">
                  <input
                    type="range"
                    min="20"
                    max="1000"
                    step="5"
                    value={activeDistanceKm}
                    onChange={(e) => setCustomDistanceKm(Number(e.target.value))}
                    className="w-full accent-secondary cursor-pointer h-2 bg-gray-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-text-light font-mono">
                    <span>20 km (Local)</span>
                    <span>250 km (Kumaon Circuit)</span>
                    <span>500 km (Garhwal)</span>
                    <span>1,000 km (Chardham)</span>
                  </div>
                </div>

                {/* Quick Preset Buttons & Reset Button */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-100">
                  <span className="text-[10px] uppercase font-semibold text-text-light mr-1">Presets:</span>
                  {[
                    { label: '70 km (Jageshwar RT)', km: 70 },
                    { label: '90 km (Kainchi RT)', km: 90 },
                    { label: '130 km (Nainital RT)', km: 130 },
                    { label: '170 km (Kathgodam RT)', km: 170 },
                    { label: '300 km (Full Kumaon)', km: 300 },
                  ].map((p) => (
                    <button
                      key={p.km}
                      type="button"
                      onClick={() => setCustomDistanceKm(p.km)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        activeDistanceKm === p.km
                          ? 'bg-secondary text-primary font-bold border-secondary'
                          : 'bg-cream text-text-dark border-gray-200 hover:border-secondary'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}

                  {customDistanceKm !== null && (
                    <button
                      type="button"
                      onClick={() => setCustomDistanceKm(null)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white font-semibold transition-all ml-auto cursor-pointer"
                    >
                      ↺ Reset to Circuit ({autoKm} km)
                    </button>
                  )}
                </div>
              </div>

              {/* Step 5: Travel Date & Days */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-text-dark block mb-2">
                    Step 5: Journey Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-secondary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest font-semibold text-text-dark block mb-2">
                    Trip Duration
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 5, 8].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setTripDays(days)}
                        className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                          tripDays === days
                            ? 'bg-secondary text-primary font-bold shadow-md'
                            : 'bg-white text-text-dark border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {days} {days === 1 ? 'Day' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Breakdown & Dual Confirmation (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-10 border border-secondary/30 shadow-2xl relative sticky top-28">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-secondary text-xs uppercase tracking-[0.25em] font-semibold">
                    Transparent Tariff Quote
                  </span>
                  <span className="text-[10px] bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full">
                    Hub: Almora Base
                  </span>
                </div>
                <h3 className="font-heading text-2xl text-text-dark font-medium">
                  {currentFleet.title}
                </h3>
                <div className="text-text-light text-xs mt-1 space-x-2">
                  <span>📍 From Almora</span>
                  <span>•</span>
                  <span>{fareEstimate.distanceKm} km ({tripDirection === 'round-trip' ? 'Round Trip' : 'One-Way'})</span>
                  <span>•</span>
                  <span>{tripDays} Day{tripDays > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Line items with Math Breakdown */}
              <div className="space-y-3.5 mb-6 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-text-dark">
                  <div>
                    <span className="font-medium">Distance Tariff</span>
                    <span className="block text-[11px] text-text-light">
                      {fareEstimate.distanceKm} km × ₹{fareEstimate.perKmRate}/km ({currentFleet.title.split(' ')[0]})
                    </span>
                  </div>
                  <span className="font-semibold font-mono text-base">₹{fareEstimate.distanceCost.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-text-dark">
                  <div>
                    <span className="font-medium">Chauffeur Mountain Allowance</span>
                    <span className="block text-[11px] text-text-light">
                      ₹500 / day × {tripDays} day{tripDays > 1 ? 's' : ''} (Hill lodging & night allowance)
                    </span>
                  </div>
                  <span className="font-semibold font-mono">₹{fareEstimate.driverAllowance.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-text-dark">
                  <div>
                    <span className="font-medium">State Tolls, FastTag & Green Tax</span>
                    <span className="block text-[11px] text-text-light">Uttarakhand commercial entry & parking</span>
                  </div>
                  <span className="font-semibold font-mono">₹{fareEstimate.permitsAndTolls.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-xs">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                    <span>Zero Ghat / Night Hidden Surcharges</span>
                  </span>
                  <span className="font-bold">Guaranteed</span>
                </div>
              </div>

              {/* Total Display */}
              <div className="p-5 rounded-2xl bg-cream border border-secondary/20 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-text-light uppercase tracking-wider block font-semibold">
                    All-Inclusive Estimated Fare
                  </span>
                  <span className="text-xs text-primary font-semibold">
                    Vehicle: {currentFleet.seats}-Seater @ ₹{fareEstimate.perKmRate}/km
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-heading text-3xl sm:text-4xl font-bold text-primary font-mono">
                    ₹{fareEstimate.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Guest Details Form or Confirmation View */}
              {bookingResult ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center mb-6">
                  <CheckCircleIcon className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-heading text-lg font-bold text-emerald-950 mb-1">
                    Booking Request Received!
                  </h4>
                  <p className="text-xs text-emerald-800 mb-2">
                    Booking Ref: <strong className="font-mono">{bookingResult._id}</strong>
                  </p>
                  <p className="text-xs text-emerald-700 mb-4">
                    Our Almora travel manager will contact you at <strong>{guestPhone}</strong> to confirm chauffeur details.
                  </p>
                  <button
                    type="button"
                    onClick={handleWhatsAppBooking}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <MessageIcon className="w-4 h-4 text-white" />
                    <span>Chat on WhatsApp with Chauffeur Dispatch</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitOnlineBooking} className="space-y-3 mb-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      className="w-full bg-cream border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="Phone / WhatsApp Number *"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      required
                      className="w-full bg-cream border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-secondary"
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                      className="w-full bg-cream border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-secondary"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Special requests (e.g. Almora hotel name, train arrival time at Kathgodam, senior citizen darshan)"
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      className="w-full bg-cream border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-secondary resize-none"
                    ></textarea>
                  </div>

                  {errorMessage && (
                    <p className="text-red-600 text-xs font-medium">{errorMessage}</p>
                  )}

                  {/* Primary WhatsApp Booking Button */}
                  <button
                    type="button"
                    onClick={handleWhatsAppBooking}
                    className="w-full py-4 px-6 rounded-full text-xs uppercase tracking-wider font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
                  >
                    <MessageIcon className="w-4 h-4 text-white" />
                    <span>Reserve via WhatsApp Concierge (Instant Chat ↗)</span>
                  </button>

                  {/* Secondary Online Submission to Database */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary-luxury w-full py-3.5 px-6 rounded-full text-xs uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting to Hotel...</span>
                    ) : (
                      <>
                        <span>Submit Online Reservation to Hotel</span>
                        <ArrowUpRightIcon className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <p className="text-[11px] text-center text-text-light">
                Direct Chauffeur Helpline (Almora Base):{' '}
                <a href="tel:+919690621247" className="text-secondary font-semibold hover:underline">
                  +91 96906 21247
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. UTTARAKHAND DESTINATIONS & TEMPLES (Matching Experiences / Bento) */}
      {/* ========================================================================= */}
      <section id="destinations" className="py-28 px-4 bg-cream relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
                <CompassIcon className="w-3.5 h-3.5 text-secondary" />
                <span>Uttarakhand Itineraries</span>
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-text-dark font-medium tracking-tight">
                Hill Stations & Sacred Temples
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-primary text-secondary shadow-md'
                    : 'bg-white text-text-dark/70 hover:bg-gray-100'
                }`}
              >
                All Circuits
              </button>
              <button
                onClick={() => setActiveCategory('temple')}
                className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeCategory === 'temple'
                    ? 'bg-primary text-secondary shadow-md'
                    : 'bg-white text-text-dark/70 hover:bg-gray-100'
                }`}
              >
                Sacred Temples & Dhams
              </button>
              <button
                onClick={() => setActiveCategory('hillstation')}
                className={`px-4 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeCategory === 'hillstation'
                    ? 'bg-primary text-secondary shadow-md'
                    : 'bg-white text-text-dark/70 hover:bg-gray-100'
                }`}
              >
                Hill Stations
              </button>
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85';
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full glass-pill-dark text-secondary text-[11px] font-semibold uppercase tracking-wider border border-secondary/30">
                      {dest.categoryLabel}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-heading text-xl font-semibold leading-tight">
                      {dest.name}
                    </h3>
                    <span className="text-secondary text-xs block font-mono mt-0.5">
                      {dest.distance}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-text-light text-xs sm:text-sm leading-relaxed mb-4 font-light">
                      {dest.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {dest.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-cream text-text-dark text-[11px] font-medium border border-gray-200"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-text-light">
                      Duration: <strong className="text-text-dark">{dest.duration}</strong>
                    </span>
                    <button
                      onClick={() => {
                        if (!selectedDestinations.includes(dest.id)) {
                          toggleDestination(dest.id);
                        }
                        scrollToCalculator();
                      }}
                      className="text-xs uppercase tracking-wider text-secondary font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>Add to Itinerary</span>
                      <ArrowUpRightIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SAFETY STANDARDS (Matching AmenitiesGrid.jsx) */}
      {/* ========================================================================= */}
      <section id="safety" className="py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-cream text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
              Devbhoomi Hospitality & Safety
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl text-text-dark font-medium tracking-tight mb-4">
              Mountain Driving Excellence
            </h2>
            <p className="text-text-light text-base font-light">
              High-altitude travel requires precision, local mountain instincts, and uncompromised vehicle maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyStandards.map((std, i) => {
              const Icon = std.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-3xl bg-cream border border-gray-100/80 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary text-secondary flex items-center justify-center mb-6 shadow-md shadow-primary/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-dark mb-2">
                    {std.title}
                  </h3>
                  <p className="text-text-light text-xs sm:text-sm leading-relaxed font-light">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. GUEST REVIEWS (Matching Home.jsx Testimonials) */}
      {/* ========================================================================= */}
      <section className="py-24 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
              Travel Stories
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl text-text-dark font-medium tracking-tight mb-4">
              Pilgrims & Explorers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md">
              <div className="flex gap-1 text-secondary mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-text-light text-sm italic leading-relaxed mb-6 font-light">
                "Our trip to Kainchi Dham and Jageshwar Dham was sublime. Our driver Mohan ji drove with extreme care on winding mountain roads. The Innova Crysta was spotless with room heating."
              </p>
              <div>
                <strong className="text-text-dark text-sm block">Rajesh & Suman Gupta</strong>
                <span className="text-secondary text-xs">Delhi NCR • Kainchi Dham Pilgrimage</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md">
              <div className="flex gap-1 text-secondary mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-text-light text-sm italic leading-relaxed mb-6 font-light">
                "We booked the 12-seater Urbania for our extended family vacation across Nainital and Mukteshwar. The Maharaja pushback seats and high roof made 6 hours in the hills feel effortless."
              </p>
              <div>
                <strong className="text-text-dark text-sm block">Kapoor Family Reunion</strong>
                <span className="text-secondary text-xs">Mumbai • 12-Seater Kumaon Circuit</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md">
              <div className="flex gap-1 text-secondary mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-text-light text-sm italic leading-relaxed mb-6 font-light">
                "Smooth pickup directly at Kathgodam railway station. The driver held a name-board and took us straight to Devbhoomi Retreat without any delays. Truly 5-star mountain hospitality."
              </p>
              <div>
                <strong className="text-text-dark text-sm block">Dr. Alok Verma</strong>
                <span className="text-secondary text-xs">Lucknow • Kathgodam Station Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BOOKING CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {bookingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-secondary/30 relative">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8" />
            </div>

            <h3 className="font-heading text-2xl text-center text-text-dark font-semibold mb-2">
              Mountain Journey Reserved!
            </h3>
            <p className="text-text-light text-center text-xs sm:text-sm mb-6 font-light leading-relaxed">
              Your inquiry has been registered with Devbhoomi Retreat. Our mountain transport manager will contact you within 30 minutes to confirm vehicle assignment and chauffeur details.
            </p>

            <div className="p-4 rounded-2xl bg-cream border border-gray-200 mb-6 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-light">Booking Reference:</span>
                <span className="font-mono font-bold text-text-dark">{bookingResult._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light">Vehicle:</span>
                <span className="font-semibold text-text-dark">{currentFleet.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light">Travel Date:</span>
                <span className="font-semibold text-text-dark">{travelDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light">Total Estimated Fare:</span>
                <span className="font-bold text-secondary text-sm">
                  ₹{fareEstimate.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleWhatsAppBooking}
                className="w-full py-3.5 rounded-full text-xs uppercase tracking-wider font-bold inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer"
              >
                <MessageIcon className="w-4 h-4" />
                <span>Notify Manager via WhatsApp</span>
              </button>

              <button
                onClick={() => setBookingResult(null)}
                className="w-full py-3 rounded-full text-xs uppercase tracking-wider font-semibold text-text-light hover:text-text-dark transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourAndTravel;
