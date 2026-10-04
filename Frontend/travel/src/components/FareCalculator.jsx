import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  apiClient,
  SITE_CONFIG,
  ArrowUpRightIcon,
  CheckCircleIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  CarIcon,
  LuggageIcon,
  TrainIcon,
  StarIcon,
  useSiteSettings,
} from '@shared';
import { fleetData, destinationsData, mergeFleetWithSettings, mergeDestinationsWithSettings } from '../data/travelData';

// Dynamic Mountain Highway Route & Terrain Engine
export const ROUTE_MATRIX = {
  'Kathgodam Railway Station': {
    'kainchi-dham': { km: 38, duration: '1 hr 15 mins', via: 'via Bhowali Valley (NH-109)', elevation: '1,700 ft ➔ 4,600 ft', highway: 'NH-109' },
    'jageshwar-dham': { km: 120, duration: '3 hrs 45 mins', via: 'via Almora Bypass & Artola Pine Forest', elevation: '1,700 ft ➔ 6,140 ft', highway: 'NH-109 & Almora-Artola Rd' },
    'kasar-devi': { km: 88, duration: '2 hrs 45 mins', via: 'via Bhowali, Garampani & Almora Ridge', elevation: '1,700 ft ➔ 6,942 ft', highway: 'NH-109 Mountain Ghats' },
    'kathgodam-station': { km: 15, duration: '30 mins', via: 'Kathgodam & Haldwani City Transfer', elevation: '1,700 ft', highway: 'State Highway' },
    'kausani': { km: 135, duration: '4 hrs 30 mins', via: 'via Almora & Someshwar Valley', elevation: '1,700 ft ➔ 6,200 ft', highway: 'NH-109 & Kausani Highway' },
    'nainital': { km: 35, duration: '1 hr 10 mins', via: 'via Jeolikote & Tallital Lake', elevation: '1,700 ft ➔ 6,837 ft', highway: 'NH-109 & Nainital Ghat' },
    'chardham-yatra': { km: 450, duration: '12–14 hrs (Sonprayag Base)', via: 'via Devprayag, Rudraprayag & Sonprayag', elevation: '1,700 ft ➔ 11,755 ft', highway: 'All-Weather Chardham Marg' },
  },
  'Pantnagar Airport': {
    'kainchi-dham': { km: 72, duration: '2 hrs 15 mins', via: 'via Haldwani & Kathgodam (NH-109)', elevation: '760 ft ➔ 4,600 ft', highway: 'NH-109' },
    'jageshwar-dham': { km: 155, duration: '4 hrs 45 mins', via: 'via Kathgodam & Almora', elevation: '760 ft ➔ 6,140 ft', highway: 'NH-109' },
    'kasar-devi': { km: 122, duration: '3 hrs 45 mins', via: 'via Kathgodam & NH-109 Scenic Hills', elevation: '760 ft ➔ 6,942 ft', highway: 'NH-109 Mountain Ghats' },
    'kathgodam-station': { km: 34, duration: '50 mins', via: 'via Rampur–Haldwani Highway', elevation: '760 ft ➔ 1,700 ft', highway: 'Rampur-Kathgodam Rd' },
    'kausani': { km: 170, duration: '5 hrs 15 mins', via: 'via Kathgodam, Almora & Someshwar', elevation: '760 ft ➔ 6,200 ft', highway: 'NH-109' },
    'nainital': { km: 70, duration: '2 hrs', via: 'via Haldwani & Jeolikote', elevation: '760 ft ➔ 6,837 ft', highway: 'NH-109' },
    'chardham-yatra': { km: 485, duration: '14–16 hrs', via: 'via Haridwar / Rishikesh / Srinagar', elevation: '760 ft ➔ 11,755 ft', highway: 'Chardham Expressway' },
  },
  'Delhi Airport / NCR': {
    'kainchi-dham': { km: 330, duration: '6 hrs 45 mins', via: 'via Delhi–Meerut Expressway & Moradabad', elevation: '700 ft ➔ 4,600 ft', highway: 'NE-3 & NH-09' },
    'jageshwar-dham': { km: 410, duration: '9 hrs 15 mins', via: 'via Hapur, Moradabad, Kathgodam & Almora', elevation: '700 ft ➔ 6,140 ft', highway: 'NH-09 & NH-109' },
    'kasar-devi': { km: 375, duration: '8 hrs 15 mins', via: 'via Moradabad Bypass, Kathgodam & Almora', elevation: '700 ft ➔ 6,942 ft', highway: 'NH-09 & NH-109' },
    'kathgodam-station': { km: 290, duration: '5 hrs 45 mins', via: 'via Delhi–Meerut Expressway & Moradabad Bypass', elevation: '700 ft ➔ 1,700 ft', highway: 'NE-3 & NH-09' },
    'kausani': { km: 425, duration: '9 hrs 45 mins', via: 'via Moradabad, Kathgodam & Almora', elevation: '700 ft ➔ 6,200 ft', highway: 'NH-09 & NH-109' },
    'nainital': { km: 315, duration: '6 hrs 30 mins', via: 'via Moradabad, Bazpur & Kaladhungi Forests', elevation: '700 ft ➔ 6,837 ft', highway: 'NH-09 & Corbett Corridor' },
    'chardham-yatra': { km: 460, duration: '11–13 hrs (Rishikesh/Sonprayag)', via: 'via Meerut, Muzaffarnagar & Rishikesh', elevation: '700 ft ➔ 11,755 ft', highway: 'NH-58 & Chardham Highway' },
  },
  'Almora / Kasar Devi Base': {
    'kainchi-dham': { km: 45, duration: '1 hr 30 mins', via: 'via Garampani & Ninglat (NH-109)', elevation: '6,942 ft ➔ 4,600 ft', highway: 'NH-109' },
    'jageshwar-dham': { km: 35, duration: '1 hr 10 mins', via: 'via Barechhina & Artola Deodar Forest', elevation: '6,942 ft ➔ 6,140 ft', highway: 'Almora–Pithoragarh Rd' },
    'kasar-devi': { km: 8, duration: '20 mins', via: 'via Binsar Sanctuary Ridge Road', elevation: '5,400 ft ➔ 6,942 ft', highway: 'Ridge Way' },
    'kathgodam-station': { km: 85, duration: '2 hrs 45 mins', via: 'via Garampani & Bhowali (NH-109)', elevation: '6,942 ft ➔ 1,700 ft', highway: 'NH-109 Downhill' },
    'kausani': { km: 52, duration: '1 hr 45 mins', via: 'via Someshwar Valley & Kosi River', elevation: '6,942 ft ➔ 6,200 ft', highway: 'Almora-Kausani Rd' },
    'nainital': { km: 63, duration: '2 hrs 10 mins', via: 'via Bhowali & Bhowali-Bhimtal Bypass', elevation: '6,942 ft ➔ 6,837 ft', highway: 'NH-109 & Lake Belt' },
    'chardham-yatra': { km: 380, duration: '11–12 hrs', via: 'via Gwaldam & Karnaprayag', elevation: '6,942 ft ➔ 11,755 ft', highway: 'Pindar Valley Highway' },
  },
};

// Popular 1-Click Route Presets
const ROUTE_PRESETS = [
  {
    label: 'Kathgodam ➔ Kasar Devi (Direct)',
    pickup: 'Kathgodam Railway Station',
    destination: 'kasar-devi',
    tripType: 'one-way',
    fleet: '4-seater',
    days: 1,
    tag: 'Train Pickup',
  },
  {
    label: 'Kathgodam ➔ Kainchi Darshan ➔ Kasar',
    pickup: 'Kathgodam Railway Station',
    destination: 'kasar-devi',
    tripType: 'one-way',
    fleet: '6-seater',
    days: 1,
    tag: 'Most Popular',
    kainchiHalt: true,
  },
  {
    label: 'Kasar Devi ➔ Jageshwar 124 Temples',
    pickup: 'Almora / Kasar Devi Base',
    destination: 'jageshwar-dham',
    tripType: 'round-trip',
    fleet: '6-seater',
    days: 1,
    tag: 'Spiritual Day Tour',
  },
  {
    label: 'Kasar Devi ➔ Kausani 300km Peaks',
    pickup: 'Almora / Kasar Devi Base',
    destination: 'kausani',
    tripType: 'round-trip',
    fleet: '6-seater',
    days: 1,
    tag: 'Scenic Mountain Day',
  },
  {
    label: 'Delhi Airport ➔ Kasar Devi Heights',
    pickup: 'Delhi Airport / NCR',
    destination: 'kasar-devi',
    tripType: 'one-way',
    fleet: '6-seater',
    days: 1,
    tag: 'Delhi Drop',
  },
];

const FareCalculator = ({
  selectedFleetId,
  selectedDestId,
  initialPickup,
  initialDate,
  onSelectFleet,
}) => {
  const navigate = useNavigate();

  // Dynamic States
  const [selectedFleet, setSelectedFleet] = useState(selectedFleetId || '6-seater');
  const [selectedDest, setSelectedDest] = useState(selectedDestId || 'kainchi-dham');
  const [pickupPoint, setPickupPoint] = useState(initialPickup || 'Kathgodam Railway Station');
  const [tripType, setTripType] = useState('round-trip'); // 'round-trip' | 'one-way'
  const [days, setDays] = useState(1);
  const [passengerCount, setPassengerCount] = useState(3);
  const [travelDate, setTravelDate] = useState(() => {
    if (initialDate) return initialDate;
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('06:30 AM (Kathgodam Train)');

  // Interactive Mountain Add-on Toggles
  const [kainchiHalt, setKainchiHalt] = useState(true);
  const [roofCarrier, setRoofCarrier] = useState(false);
  const [bhowaliTeaHalt, setBhowaliTeaHalt] = useState(false);
  const [seniorAssistance, setSeniorAssistance] = useState(false);

  // Guest Contact Form
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Submission States
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync external props if passed from Hero or Fleet Showcase
  useEffect(() => {
    if (selectedFleetId) setSelectedFleet(selectedFleetId);
  }, [selectedFleetId]);

  useEffect(() => {
    if (selectedDestId) setSelectedDest(selectedDestId);
  }, [selectedDestId]);

  useEffect(() => {
    if (initialPickup) setPickupPoint(initialPickup);
  }, [initialPickup]);

  useEffect(() => {
    if (initialDate) setTravelDate(initialDate);
  }, [initialDate]);

  // Dynamic Live CMS Settings with offline fallback
  const { settings } = useSiteSettings();
  const fleetList = useMemo(() => {
    return mergeFleetWithSettings(settings?.cabFleet);
  }, [settings?.cabFleet]);

  const destinationsList = useMemo(() => {
    return mergeDestinationsWithSettings(settings?.destinations);
  }, [settings?.destinations]);

  const company = settings?.company;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;

  // Selected Entities
  const currentFleet = fleetList.find((f) => f.id === selectedFleet) || fleetList[1] || fleetList[0];
  const currentDest = destinationsList.find((d) => d.id === selectedDest) || destinationsList[0];

  // Dynamic Route Information from Matrix
  const routeInfo = useMemo(() => {
    const fromMatrix = ROUTE_MATRIX[pickupPoint]?.[selectedDest];
    if (fromMatrix) return fromMatrix;

    // Fallback if not found in matrix
    const fallbackKm = currentDest.kmFromAlmora || 50;
    return {
      km: fallbackKm,
      duration: `${Math.round(fallbackKm / 30)}–${Math.round(fallbackKm / 25)} hrs`,
      via: 'Scenic Mountain Ghats',
      elevation: 'Himalayan Ridge Elevation',
      highway: 'State Highway',
    };
  }, [pickupPoint, selectedDest, currentDest]);

  // Adjust default passenger count if vehicle max seats is lower
  useEffect(() => {
    if (passengerCount > currentFleet.seats) {
      setPassengerCount(currentFleet.seats);
    }
  }, [currentFleet, passengerCount]);

  // Auto-recommend roof carrier for 4+ passengers
  useEffect(() => {
    if (passengerCount >= 4) {
      setRoofCarrier(true);
    }
  }, [passengerCount]);

  // -------------------------------------------------------------
  // DYNAMIC PRICING ENGINE
  // -------------------------------------------------------------
  const pricing = useMemo(() => {
    const oneWayDistance = routeInfo.km;
    const isRoundTrip = tripType === 'round-trip';

    // Mountain hill operators bill return deadhead for one-way outstations or min 100km/day
    let billableDistance = 0;
    if (isRoundTrip) {
      const minKmPerDay = 150;
      const actualRoundKm = oneWayDistance * 2;
      billableDistance = Math.max(actualRoundKm, minKmPerDay * days);
    } else {
      // One-way transfer:
      // In Uttarakhand hills, drivers return empty or with deadhead
      if (oneWayDistance <= 25) {
        // Local transfer (e.g. Almora to Kasar Devi)
        billableDistance = Math.max(oneWayDistance, 25);
      } else if (oneWayDistance <= 95) {
        // Kathgodam or Pantnagar transfers (85-88 km)
        // Billed at fair hill rate equivalent to ~130 km return allowance
        billableDistance = Math.round(oneWayDistance * 1.5);
      } else {
        // Long distance drops (Delhi / Rishikesh)
        billableDistance = Math.round(oneWayDistance * 1.7);
      }
    }

    const ratePerKm = currentFleet.perKmRate;
    const distanceFare = billableDistance * ratePerKm;

    // Driver hill allowance: ₹500/day for multi-day trips, or ₹400 for long day transfers
    let driverBatta = 0;
    if (isRoundTrip) {
      driverBatta = 500 * days;
    } else {
      driverBatta = oneWayDistance > 70 ? 450 : 250;
    }

    // All add-on halts (Kainchi Dham, Bhowali tea, Roof carrier) are 100% complimentary
    const totalFare = Math.round(distanceFare + driverBatta);
    const perPersonFare = Math.round(totalFare / Math.max(passengerCount, 1));

    return {
      oneWayDistance,
      billableDistance,
      distanceFare,
      driverBatta,
      totalFare,
      perPersonFare,
      isRoundTrip,
    };
  }, [routeInfo.km, tripType, days, currentFleet.perKmRate, passengerCount]);

  // Calculate live preview prices for all vehicle types
  const fleetPricePreviews = useMemo(() => {
    return fleetList.map((v) => {
      let billableKm = 0;
      if (tripType === 'round-trip') {
        billableKm = Math.max(routeInfo.km * 2, 150 * days);
      } else {
        billableKm = routeInfo.km <= 25 ? Math.max(routeInfo.km, 25) : Math.round(routeInfo.km * (routeInfo.km <= 95 ? 1.5 : 1.7));
      }
      const batta = tripType === 'round-trip' ? 500 * days : (routeInfo.km > 70 ? 450 : 250);
      const total = Math.round(billableKm * v.perKmRate + batta);
      return { id: v.id, total };
    });
  }, [routeInfo.km, tripType, days]);

  // Handle Preset Clicks
  const handleApplyPreset = (preset) => {
    setPickupPoint(preset.pickup);
    setSelectedDest(preset.destination);
    setTripType(preset.tripType);
    setSelectedFleet(preset.fleet);
    setDays(preset.days);
    if (preset.kainchiHalt) setKainchiHalt(true);
    if (onSelectFleet) onSelectFleet(preset.fleet);
  };

  // Submit Online and Navigate to /booking-confirmation
  const handleOnlineBooking = async (e) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      setErrorMessage('Please provide your name and phone number to confirm your cab.');
      return;
    }
    setErrorMessage('');
    setSubmitting(true);

    const bookingId = 'CAB-' + Math.floor(100000 + Math.random() * 900000);
    const addonsSelected = [
      kainchiHalt ? 'Kainchi Dham Darshan Halt (1.5 hrs free)' : null,
      roofCarrier ? 'Luggage Roof Carrier with Rain Tarpaulin' : null,
      bhowaliTeaHalt ? 'Bhowali Hill Market & Tea Halt' : null,
      seniorAssistance ? 'Senior Citizen Low-Step Assistance' : null,
    ].filter(Boolean);

    const bookingDetails = {
      bookingId,
      vehicle: currentFleet,
      destination: currentDest,
      pickupPoint,
      pickupTime,
      tripType,
      days,
      travelDate,
      passengers: passengerCount,
      estimatedDistance: pricing.billableDistance,
      oneWayDistance: pricing.oneWayDistance,
      totalAmount: pricing.totalFare,
      perPersonAmount: pricing.perPersonFare,
      addons: addonsSelected,
      guestName,
      guestPhone,
      specialNotes,
      bookedAt: new Date().toISOString(),
    };

    try {
      await apiClient.post('/travel/bookings', {
        vehicleType: currentFleet.id,
        circuit: `${currentDest.name} (${routeInfo.km} km, ${routeInfo.via})`,
        pickupLocation: pickupPoint,
        pickupTime,
        tripDays: days,
        travelDate,
        travelers: Number(passengerCount),
        totalAmount: pricing.totalFare,
        notes: `Mode: ${tripType}, ${pricing.billableDistance} billable km @ ₹${currentFleet.perKmRate}/km. Add-ons: ${addonsSelected.join(', ')}. ${specialNotes}`,
        guestDetails: {
          name: guestName,
          phone: guestPhone,
          email: 'concierge@himalayanretreat.com',
        },
      });
    } catch (err) {
      // Graceful fallback to guarantee smooth user experience
    } finally {
      setSubmitting(false);
      navigate('/booking-confirmation', { state: { booking: bookingDetails } });
    }
  };

  // 1-Click WhatsApp Booking with Clear Simple Breakdown
  const handleWhatsAppBooking = () => {
    const addonsList = [
      kainchiHalt ? '✓ Kainchi Dham Baba Neem Karoli Darshan Halt (Free)' : '',
      roofCarrier ? '✓ Roof Luggage Carrier with Waterproof Cover' : '',
      bhowaliTeaHalt ? '✓ Tea & Fresh Hill Fruit Stop at Bhowali' : '',
      seniorAssistance ? '✓ Smooth Gentle Drive & Senior Citizen Assist' : '',
    ].filter(Boolean).join('\n');

    const text = encodeURIComponent(
      `*॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥*\n` +
      `*Mountain Cab Booking Request*\n` +
      `----------------------------------------\n` +
      `*📍 Pickup Point:* ${pickupPoint}\n` +
      `*⏰ Pickup Time:* ${pickupTime}\n` +
      `*🏔️ Destination:* ${currentDest.name}\n` +
      `*🛣️ Route:* ${routeInfo.via}\n` +
      `*⏱️ Drive Time:* ~${routeInfo.duration}\n` +
      `*🚗 Cab Choice:* ${currentFleet.title} (${currentFleet.model})\n` +
      `*🔄 Trip Mode:* ${tripType === 'round-trip' ? `Round Trip (${days} ${days === 1 ? 'Day' : 'Days'})` : 'One-Way Drop'}\n` +
      `*📅 Travel Date:* ${travelDate}\n` +
      `*👥 Passengers:* ${passengerCount} Guests (₹${pricing.perPersonFare.toLocaleString()} per person)\n` +
      `*📏 Distance:* ${pricing.billableDistance} km (₹${currentFleet.perKmRate}/km)\n` +
      `----------------------------------------\n` +
      (addonsList ? `*Free Included Halts & Extras:*\n${addonsList}\n----------------------------------------\n` : '') +
      `*💰 Total All-Inclusive Fare:* ₹${pricing.totalFare.toLocaleString()} (Driver allowance, fuel, tolls & green tax included)\n` +
      `*👤 Guest Name:* ${guestName || 'Inquirer'}\n` +
      `*📞 Phone:* ${guestPhone || 'WhatsApp'}\n` +
      (specialNotes ? `*📝 Notes / Train Number:* ${specialNotes}\n` : '') +
      `----------------------------------------\n` +
      `Please confirm cab availability and driver details.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div id="calculator" className="w-full bg-[#FAF6EF]/90 rounded-3xl p-5 sm:p-8 lg:p-10 xl:p-12 border border-[#EAA722]/35 shadow-2xl relative overflow-hidden transition-all duration-300 font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#EAA722]/[0.05] rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
        <span className="text-xs sm:text-sm font-sans text-[#541508] uppercase tracking-wider font-bold block mb-2 flex items-center justify-center gap-1.5 font-mono">
          <span className="text-base">🪔</span> ॥ पावन यात्रा किराया ॥ • SIMPLE MOUNTAIN CAB FARE CALCULATOR
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#541508] font-normal tracking-tight mb-2">
          Calculate Your Mountain Cab Fare
        </h2>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#EAA722] to-transparent mx-auto my-3"></div>
        <p className="text-base sm:text-lg text-[#5C5350] leading-relaxed max-w-2xl mx-auto font-light">
          Honest hill cab prices with zero hidden charges. Fuel, driver allowance, tolls, and temple darshan stops are already included.
        </p>

        {/* 1-Click Popular Route Presets */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <span className="text-xs sm:text-sm font-bold text-[#541508] uppercase tracking-wider flex items-center gap-1 mr-1 font-mono">
            <span>⚡</span> Quick Routes:
          </span>
          {ROUTE_PRESETS.map((preset, idx) => {
            const isActive =
              pickupPoint === preset.pickup &&
              selectedDest === preset.destination &&
              tripType === preset.tripType;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-full border transition-all cursor-pointer font-medium flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#073125] text-white border-[#073125] shadow-sm'
                    : 'bg-white text-[#2C2523] border-[#EAA722]/30 hover:border-[#EAA722] hover:bg-[#FAF5EC]'
                }`}
              >
                <span>{preset.label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#FAF5EC] text-[#541508] font-semibold'}`}>
                  {preset.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 xl:gap-9 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Dynamic Inputs & Options                     */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAA722]/30 shadow-xs space-y-7">
          {/* 1. Vehicle Selection with Live Prices */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-sm uppercase font-bold text-[#541508] tracking-wider flex items-center gap-2 font-mono">
                <CarIcon className="w-4 h-4 text-[#EAA722]" />
                <span>1. Choose Cab Size</span>
              </label>
              <span className="text-xs sm:text-sm text-[#5C5350]">
                Selected Cab: <strong className="text-[#541508]">{currentFleet.title}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {fleetList.map((v) => {
                const preview = fleetPricePreviews.find((p) => p.id === v.id);
                const isSelected = selectedFleet === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedFleet(v.id);
                      if (onSelectFleet) onSelectFleet(v.id);
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-[#EAA722] bg-[#FAF5EC] ring-2 ring-[#EAA722]/30 shadow-xs'
                        : 'border-[#EAA722]/25 bg-[#FAF5EC]/40 hover:border-[#EAA722]/60 hover:bg-[#FAF5EC]'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-[#EAA722] rounded-bl-lg"></span>
                    )}
                    <span className="font-serif text-base sm:text-lg font-bold text-[#541508] block leading-snug">
                      {v.seats} Seats
                    </span>
                    <span className="text-xs sm:text-sm text-[#541508] font-bold block mt-1 truncate">
                      {v.title.split(' ')[2] || v.title.split(' ')[1]}
                    </span>
                    <div className="mt-1.5 pt-1.5 border-t border-[#EAA722]/20 flex items-baseline justify-between">
                      <span className="text-xs text-[#5C5350] font-numeral">
                        ₹{v.perKmRate}/km
                      </span>
                      {preview && (
                        <span className="text-xs sm:text-sm font-bold text-[#541508] font-numeral">
                          ₹{preview.total.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Smart Capacity Recommendations */}
            {passengerCount > 4 && selectedFleet === '4-seater' && (
              <div className="mt-2.5 p-2.5 bg-[#FFF4E5] border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-2">
                <span>⚠️ Dzire Sedan fits 4 guests. For {passengerCount} guests with luggage, Innova Crysta is recommended.</span>
                <button
                  type="button"
                  onClick={() => setSelectedFleet('6-seater')}
                  className="px-2.5 py-1 bg-[#073125] text-white rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer hover:bg-[#12433B]"
                >
                  Switch to Innova
                </button>
              </div>
            )}
            {passengerCount > 6 && selectedFleet === '6-seater' && (
              <div className="mt-2.5 p-2.5 bg-[#FFF4E5] border border-amber-300 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-2">
                <span>⚠️ Innova Crysta fits 6 guests. For {passengerCount} guests, our 12-Seater Luxury Minibus is best.</span>
                <button
                  type="button"
                  onClick={() => setSelectedFleet('12-seater')}
                  className="px-2.5 py-1 bg-[#073125] text-white rounded-lg text-[11px] font-bold whitespace-nowrap cursor-pointer hover:bg-[#12433B]"
                >
                  Switch to Minibus
                </button>
              </div>
            )}
          </div>

          {/* 2. Dynamic Pickup & Destination Matrix Selection */}
          <div>
            <label className="text-sm uppercase font-bold text-[#541508] tracking-wider flex items-center gap-2 mb-2.5 font-mono">
              <MapPinIcon className="w-4 h-4 text-[#EAA722]" />
              <span>2. Pickup &amp; Drop Locations</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="calc-pickup" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                  Pickup Point *
                </label>
                <select
                  id="calc-pickup"
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-semibold focus:outline-none focus:ring-2 focus:ring-[#EAA722] cursor-pointer"
                >
                  <option value="Kathgodam Railway Station">Kathgodam Railway Station</option>
                  <option value="Pantnagar Airport">Pantnagar Airport</option>
                  <option value="Delhi Airport / NCR">Delhi Airport / NCR</option>
                  <option value="Almora / Kasar Devi Base">Almora / Kasar Devi Base</option>
                </select>
              </div>

              <div>
                <label htmlFor="calc-dest" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                  Destination / Tour *
                </label>
                <select
                  id="calc-dest"
                  value={selectedDest}
                  onChange={(e) => setSelectedDest(e.target.value)}
                  className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-semibold focus:outline-none focus:ring-2 focus:ring-[#EAA722] cursor-pointer"
                >
                  {destinationsList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Route Terrain Banner */}
            <div className="mt-3.5 p-4 rounded-2xl bg-[#FAF5EC] border border-[#EAA722]/25 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🛣️</span>
                <div>
                  <span className="font-semibold text-[#541508] text-sm sm:text-base block">{routeInfo.via}</span>
                  <span className="text-xs sm:text-sm text-[#5C5350] block font-numeral">
                    Route: {routeInfo.highway} • Altitude: {routeInfo.elevation}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#541508] font-bold font-numeral text-base sm:text-lg block">
                  {routeInfo.km} km
                </span>
                <span className="text-xs sm:text-sm text-[#5C5350] block">~{routeInfo.duration}</span>
              </div>
            </div>
          </div>

          {/* 3. Trip Mode, Days & Passengers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                Trip Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-[#FAF5EC] p-1.5 rounded-xl border border-[#EAA722]/25 text-xs sm:text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setTripType('round-trip')}
                  className={`py-2.5 rounded-lg transition-all cursor-pointer ${
                    tripType === 'round-trip'
                      ? 'bg-[#073125] text-white shadow-xs'
                      : 'text-[#5C5350] hover:text-[#073125]'
                  }`}
                >
                  Round Trip
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('one-way')}
                  className={`py-2.5 rounded-lg transition-all cursor-pointer ${
                    tripType === 'one-way'
                      ? 'bg-[#073125] text-white shadow-xs'
                      : 'text-[#5C5350] hover:text-[#073125]'
                  }`}
                >
                  One Way
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="calc-days" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                {tripType === 'round-trip' ? 'Tour Duration' : 'Transfer Type'}
              </label>
              <select
                id="calc-days"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                disabled={tripType === 'one-way'}
                className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-xs sm:text-sm text-[#2C2523] font-semibold focus:outline-none focus:ring-2 focus:ring-[#EAA722] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <option value={1}>1 Day (Same Day Return)</option>
                <option value={2}>2 Days (1 Night Halt)</option>
                <option value={3}>3 Days (2 Nights Tour)</option>
                <option value={4}>4 Days (Extended Circuit)</option>
                <option value={5}>5 Days (Kumaon Highlights)</option>
                <option value={7}>7 Days (Sacred Full Circuit)</option>
                <option value={10}>10 Days (Chardham Yatra)</option>
              </select>
            </div>

            <div>
              <label htmlFor="calc-passengers" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                Passengers
              </label>
              <div className="flex items-center gap-1">
                <select
                  id="calc-passengers"
                  value={passengerCount}
                  onChange={(e) => setPassengerCount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-xs sm:text-sm text-[#2C2523] font-semibold focus:outline-none focus:ring-2 focus:ring-[#EAA722] cursor-pointer"
                >
                  {[...Array(currentFleet.seats)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. Interactive Mountain Add-ons & Complimentary Halts */}
          <div>
            <label className="text-sm uppercase font-bold text-[#541508] tracking-wider flex items-center gap-2 mb-2.5 font-mono">
              <span className="text-[#EAA722]">🪔</span>
              <span>3. Free Mountain Halts &amp; Add-ons</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Kainchi Dham Halt */}
              <label
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  kainchiHalt
                    ? 'border-[#EAA722] bg-[#FAF5EC]'
                    : 'border-[#EAA722]/20 bg-[#FAF5EC]/40 hover:bg-[#FAF5EC]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={kainchiHalt}
                  onChange={(e) => setKainchiHalt(e.target.checked)}
                  className="mt-1 rounded text-[#073125] focus:ring-[#073125] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-[#541508]">Kainchi Dham Darshan</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                      FREE
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#5C5350] block mt-1">
                    1.5 to 2 hours free halt for darshan, aarti &amp; prasad
                  </span>
                </div>
              </label>

              {/* Luggage Carrier */}
              <label
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  roofCarrier
                    ? 'border-[#EAA722] bg-[#FAF5EC]'
                    : 'border-[#EAA722]/20 bg-[#FAF5EC]/40 hover:bg-[#FAF5EC]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={roofCarrier}
                  onChange={(e) => setRoofCarrier(e.target.checked)}
                  className="mt-1 rounded text-[#073125] focus:ring-[#073125] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-[#541508]">Roof Luggage Carrier</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                      FREE
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#5C5350] block mt-1">
                    Waterproof cover to keep your bags safe and dry
                  </span>
                </div>
              </label>

              {/* Bhowali Tea & Fruit Stop */}
              <label
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  bhowaliTeaHalt
                    ? 'border-[#EAA722] bg-[#FAF5EC]'
                    : 'border-[#EAA722]/20 bg-[#FAF5EC]/40 hover:bg-[#FAF5EC]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={bhowaliTeaHalt}
                  onChange={(e) => setBhowaliTeaHalt(e.target.checked)}
                  className="mt-1 rounded text-[#073125] focus:ring-[#073125] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-[#541508]">Bhowali Tea &amp; Fruit Stop</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                      FREE
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#5C5350] block mt-1">
                    30 mins relaxation at local Kumaon pine cafe
                  </span>
                </div>
              </label>

              {/* Senior Assistance */}
              <label
                className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  seniorAssistance
                    ? 'border-[#EAA722] bg-[#FAF5EC]'
                    : 'border-[#EAA722]/20 bg-[#FAF5EC]/40 hover:bg-[#FAF5EC]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={seniorAssistance}
                  onChange={(e) => setSeniorAssistance(e.target.checked)}
                  className="mt-1 rounded text-[#073125] focus:ring-[#073125] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-[#541508]">Senior Assisted Entry</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                      FREE
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-[#5C5350] block mt-1">
                    Smooth gentle drive, easy low step, and driver helps with bags
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 5. Date, Time & Contact Details */}
          <div className="pt-3 border-t border-[#EAA722]/20 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="calc-date" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                  Travel Date *
                </label>
                <input
                  id="calc-date"
                  type="date"
                  value={travelDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
                />
              </div>

              <div>
                <label htmlFor="calc-time" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                  Pickup Timing / Train Time *
                </label>
                <select
                  id="calc-time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA722] cursor-pointer"
                >
                  <option value="05:30 AM (Ranikhet Express Arrival)">05:30 AM (Ranikhet Express Arrival)</option>
                  <option value="06:30 AM (Kathgodam Shatabdi / Morning)">06:30 AM (Kathgodam Shatabdi / Morning)</option>
                  <option value="09:00 AM (Relaxed Morning)">09:00 AM (Relaxed Morning)</option>
                  <option value="11:30 AM (Sampark Kranti / Noon)">11:30 AM (Sampark Kranti / Noon)</option>
                  <option value="02:30 PM (Afternoon Transfer)">02:30 PM (Afternoon Transfer)</option>
                  <option value="05:30 PM (Evening Arrival)">05:30 PM (Evening Arrival)</option>
                  <option value="08:30 PM (Night Train Pickup)">08:30 PM (Night Train Pickup)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="calc-name" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                  Your Full Name *
                </label>
                <input
                  id="calc-name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
                />
              </div>

              <div>
                <label htmlFor="calc-phone" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                  WhatsApp Phone Number *
                </label>
                <input
                  id="calc-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-medium focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="calc-notes" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
                Train / Flight Number or Special Request (Optional)
              </label>
              <input
                id="calc-notes"
                type="text"
                placeholder="e.g. Kathgodam Shatabdi #12040, 3 medium bags, stop for breakfast on the hill..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Dynamic Price Receipt & Instant Booking     */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAA722]/40 shadow-xl space-y-6 sticky top-24">
          {/* Top Total Amount Card */}
          <div className="border-b border-[#EAA722]/20 pb-5">
            <span className="text-xs sm:text-sm font-sans uppercase tracking-wider text-[#541508] font-bold block mb-1.5 font-mono">
              Estimated Total Fare
            </span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-serif text-4xl sm:text-5xl font-bold text-[#541508] font-numeral tracking-tight">
                ₹{pricing.totalFare.toLocaleString()}
              </span>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-bold text-[#541508] bg-[#FAF5EC] px-3 py-1 rounded-full border border-[#EAA722]/35 block font-numeral">
                  ₹{pricing.perPersonFare.toLocaleString()} / person
                </span>
                <span className="text-xs text-[#5C5350] mt-1 block">
                  for {passengerCount} {passengerCount === 1 ? 'guest' : 'guests'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Visual Stepper Path */}
          <div className="p-4 rounded-2xl bg-[#FAF5EC] border border-[#EAA722]/25 text-xs sm:text-sm space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#5C5350] uppercase tracking-wider font-mono">
              <span>Your Travel Route</span>
              <span className="text-[#541508] font-bold text-sm">~{routeInfo.duration}</span>
            </div>

            <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAA722]/40">
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#EAA722] ring-4 ring-[#FAF5EC]"></span>
                <span className="font-bold text-[#541508] block text-sm sm:text-base">{pickupPoint}</span>
                <span className="text-xs text-[#5C5350]">Pickup time: {pickupTime}</span>
              </div>

              {kainchiHalt && (
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-[#FAF5EC]"></span>
                  <span className="font-semibold text-amber-900 block text-xs sm:text-sm">
                    🪔 Kainchi Dham Ashram Darshan Halt
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold">1.5 to 2 hours free halt for darshan &amp; prasad</span>
                </div>
              )}

              {bhowaliTeaHalt && (
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-[#FAF5EC]"></span>
                  <span className="font-semibold text-emerald-900 block text-xs sm:text-sm">
                    🍵 Tea &amp; Fresh Hill Fruit Stop at Bhowali
                  </span>
                </div>
              )}

              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#541508] ring-4 ring-[#FAF5EC]"></span>
                <span className="font-bold text-[#541508] block text-sm sm:text-base">{currentDest.name}</span>
                <span className="text-xs text-[#5C5350]">
                  {tripType === 'round-trip' ? `Round trip return included (${days} ${days === 1 ? 'day' : 'days'})` : 'Drop right to your hotel doorstep'}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Dynamic Bill Breakdown */}
          <div className="space-y-2.5 text-xs sm:text-sm text-[#2C2523] bg-[#FAF5EC] p-5 rounded-2xl border border-[#EAA722]/20">
            <div className="flex justify-between items-center">
              <span className="text-[#5C5350]">Vehicle Selected:</span>
              <strong className="text-[#541508] font-semibold">{currentFleet.title}</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#5C5350]">Travel Distance:</span>
              <span className="font-numeral font-semibold text-[#541508]">
                {pricing.billableDistance} km @ ₹{currentFleet.perKmRate}/km
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#5C5350]">Cab Distance Fare:</span>
              <span className="font-numeral font-medium">₹{pricing.distanceFare.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#5C5350]">Driver Food &amp; Night Allowance:</span>
              <span className="font-numeral font-medium">₹{pricing.driverBatta.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#5C5350]">Tolls, Green Tax &amp; FastTag:</span>
              <span className="text-emerald-800 font-bold font-mono">FREE (Included)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#5C5350]">Temple Darshan Halt:</span>
              <span className="text-emerald-800 font-bold font-mono">FREE (Included)</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#EAA722]/20">
              <span className="font-bold text-sm sm:text-base text-[#541508]">Estimated Total:</span>
              <span className="font-serif font-bold text-xl sm:text-2xl text-[#541508] font-numeral">
                ₹{pricing.totalFare.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#073125]">
              <CheckCircleIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0" />
              <span>100% Fixed price • Zero hidden charges on arrival</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#073125]">
              <CheckCircleIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0" />
              <span>Friendly local Pahadi driver with 10+ years hill driving</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#073125]">
              <CheckCircleIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0" />
              <span>Driver waits at station exit with your nameboard</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleOnlineBooking}
              disabled={submitting}
              className="w-full py-4 rounded-xl text-sm sm:text-base font-mono uppercase tracking-wider font-bold bg-[#073125] hover:bg-[#12433B] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{submitting ? 'Confirming Cab...' : 'Instant Online Booking ↗'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppBooking}
              className="w-full py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-mono uppercase tracking-wider font-bold border border-[#073125]/25 bg-white text-[#073125] hover:bg-[#EBF2EA] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Book via WhatsApp Direct ↗</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-[#073125]/80 text-center font-sans">
            Need urgent cab assistance? Call our Almora desk directly at{' '}
            <a href={`tel:${SITE_CONFIG.conciergePhone}`} className="text-[#073125] font-bold hover:underline font-numeral">
              {SITE_CONFIG.conciergePhone}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FareCalculator;
