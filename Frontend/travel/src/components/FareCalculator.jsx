import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  apiClient,
  SITE_CONFIG,
  useSiteSettings,
  useRazorpay,
} from '@shared';
import { fleetData, destinationsData, mergeFleetWithSettings, mergeDestinationsWithSettings } from '../data/travelData';

// Sub-components (split from original 52KB monolith for maintainability)
import FleetSelector from './fare/FleetSelector';
import RouteSelector from './fare/RouteSelector';
import TripOptions from './fare/TripOptions';
import MountainAddons from './fare/MountainAddons';
import GuestContactForm from './fare/GuestContactForm';
import FareSummaryPanel from './fare/FareSummaryPanel';

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
  const { initializePayment, isProcessing: paymentProcessing } = useRazorpay();

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
  const [guestEmail, setGuestEmail] = useState('');
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

    // Driver hill & plain allowances: configured dynamically via Admin CMS (travelPolicies)
    const tp = settings?.travelPolicies;
    const driverDailyAllowance = tp?.driverAllowancePerDay !== undefined
      ? Number(tp.driverAllowancePerDay)
      : 500;
    const driverShortTripAllowance = tp?.driverShortTripAllowance !== undefined
      ? Number(tp.driverShortTripAllowance)
      : 250;
    const driverLongDayDropAllowance = tp?.driverLongDayDropAllowance !== undefined
      ? Number(tp.driverLongDayDropAllowance)
      : 450;
    const driverNightHaltCharge = tp?.driverNightHaltCharge !== undefined
      ? Number(tp.driverNightHaltCharge)
      : (tp?.nightChargeAmount !== undefined ? Number(tp.nightChargeAmount) : 300);

    let driverBatta = 0;
    let nightHaltTotal = 0;
    if (isRoundTrip) {
      const baseDailyBatta = driverDailyAllowance * days;
      const nights = Math.max(0, days - 1);
      nightHaltTotal = nights * driverNightHaltCharge;
      driverBatta = baseDailyBatta + nightHaltTotal;
    } else {
      // Terrain & distance differentiation:
      // Short distance (<= 70km, local/plains transfers) vs Long mountain highway drops (> 70km)
      driverBatta = oneWayDistance > 70 ? driverLongDayDropAllowance : driverShortTripAllowance;
    }

    // All add-on halts (Kainchi Dham, Bhowali tea, Roof carrier) are 100% complimentary
    const totalFare = Math.round(distanceFare + driverBatta);
    const perPersonFare = Math.round(totalFare / Math.max(passengerCount, 1));

    return {
      oneWayDistance,
      billableDistance,
      distanceFare,
      driverBatta,
      driverDailyAllowance,
      driverShortTripAllowance,
      driverLongDayDropAllowance,
      driverNightHaltCharge,
      nightHaltTotal,
      totalFare,
      perPersonFare,
      isRoundTrip,
    };
  }, [
    routeInfo.km,
    tripType,
    days,
    currentFleet.perKmRate,
    passengerCount,
    settings?.travelPolicies?.driverAllowancePerDay,
    settings?.travelPolicies?.driverShortTripAllowance,
    settings?.travelPolicies?.driverLongDayDropAllowance,
    settings?.travelPolicies?.driverNightHaltCharge,
    settings?.travelPolicies?.nightChargeAmount,
  ]);

  // Calculate live preview prices for all vehicle types
  const fleetPricePreviews = useMemo(() => {
    const tp = settings?.travelPolicies;
    const driverDailyAllowance = tp?.driverAllowancePerDay !== undefined
      ? Number(tp.driverAllowancePerDay)
      : 500;
    const driverShortTripAllowance = tp?.driverShortTripAllowance !== undefined
      ? Number(tp.driverShortTripAllowance)
      : 250;
    const driverLongDayDropAllowance = tp?.driverLongDayDropAllowance !== undefined
      ? Number(tp.driverLongDayDropAllowance)
      : 450;
    const driverNightHaltCharge = tp?.driverNightHaltCharge !== undefined
      ? Number(tp.driverNightHaltCharge)
      : (tp?.nightChargeAmount !== undefined ? Number(tp.nightChargeAmount) : 300);

    return fleetList.map((v) => {
      let billableKm = 0;
      if (tripType === 'round-trip') {
        billableKm = Math.max(routeInfo.km * 2, 150 * days);
      } else {
        billableKm = routeInfo.km <= 25 ? Math.max(routeInfo.km, 25) : Math.round(routeInfo.km * (routeInfo.km <= 95 ? 1.5 : 1.7));
      }
      let batta = 0;
      if (tripType === 'round-trip') {
        const nights = Math.max(0, days - 1);
        batta = (driverDailyAllowance * days) + (nights * driverNightHaltCharge);
      } else {
        batta = routeInfo.km > 70 ? driverLongDayDropAllowance : driverShortTripAllowance;
      }
      const total = Math.round(billableKm * v.perKmRate + batta);
      return { id: v.id, total, driverBatta: batta, distanceFare: Math.round(billableKm * v.perKmRate) };
    });
  }, [
    routeInfo.km,
    tripType,
    days,
    fleetList,
    settings?.travelPolicies?.driverAllowancePerDay,
    settings?.travelPolicies?.driverShortTripAllowance,
    settings?.travelPolicies?.driverLongDayDropAllowance,
    settings?.travelPolicies?.driverNightHaltCharge,
    settings?.travelPolicies?.nightChargeAmount,
  ]);

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
    if (!guestName || !guestPhone || !guestEmail) {
      setErrorMessage('Please provide your name, phone number, and email to confirm your cab.');
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
      guestEmail,
      specialNotes,
      bookedAt: new Date().toISOString(),
    };

    try {
      const response = await apiClient.post('/travel/bookings', {
        vehicleType: currentFleet.id,
        circuit: `${currentDest.name} (${routeInfo.km} km, ${routeInfo.via})`,
        pickupLocation: pickupPoint,
        pickupTime,
        tripDays: days,
        travelDate,
        travelers: Number(passengerCount),
        totalAmount: pricing.totalFare,
        notes: `Mode: ${tripType}, Distance: ${pricing.billableDistance} km @ ₹${currentFleet.perKmRate}/km (₹${pricing.distanceFare}), Driver Allowance: ₹${pricing.driverBatta}. Add-ons: ${addonsSelected.join(', ')}. ${specialNotes}`,
        guestDetails: {
          name: guestName,
          phone: guestPhone,
          email: guestEmail,
        },
      });

      const dbBookingId = response.data?.booking?._id || bookingId;

      await initializePayment({
        amount: pricing.totalFare,
        receiptId: dbBookingId,
        bookingType: 'travel',
        prefill: {
          name: guestName,
          contact: guestPhone,
          email: guestEmail,
        },
        onSuccess: (paymentResponse) => {
          setSubmitting(false);
          navigate('/booking-confirmation', {
            state: {
              booking: { ...bookingDetails, paymentId: paymentResponse.razorpay_payment_id },
            },
          });
        },
        onFailure: (error) => {
          setErrorMessage('Payment failed or was cancelled. Please try again.');
          setSubmitting(false);
        },
      });
    } catch (err) {
      setErrorMessage('Failed to connect to the booking server. Please try again.');
      setSubmitting(false);
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
      `*📏 Distance Fare:* ${pricing.billableDistance} km × ₹${currentFleet.perKmRate}/km = ₹${pricing.distanceFare.toLocaleString()}\n` +
      `*⛰️ Driver Allowance:* ${pricing.driverBatta > 0 ? `₹${pricing.driverBatta.toLocaleString()} (${tripType === 'round-trip' ? `₹${pricing.driverDailyAllowance || 500}/day × ${days}d` : 'Day transfer'})` : '₹0 (Waived)'}\n` +
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
          <FleetSelector
            fleetList={fleetList}
            selectedFleet={selectedFleet}
            setSelectedFleet={setSelectedFleet}
            fleetPricePreviews={fleetPricePreviews}
            passengerCount={passengerCount}
            currentFleet={currentFleet}
            onSelectFleet={onSelectFleet}
          />

          {/* 2. Dynamic Pickup & Destination Matrix Selection */}
          <RouteSelector
            pickupPoint={pickupPoint}
            setPickupPoint={setPickupPoint}
            selectedDest={selectedDest}
            setSelectedDest={setSelectedDest}
            destinationsList={destinationsList}
            routeInfo={routeInfo}
          />

          {/* 3. Trip Mode, Days & Passengers */}
          <TripOptions
            tripType={tripType}
            setTripType={setTripType}
            days={days}
            setDays={setDays}
            passengerCount={passengerCount}
            setPassengerCount={setPassengerCount}
            currentFleet={currentFleet}
          />

          {/* 4. Interactive Mountain Add-ons & Complimentary Halts */}
          <MountainAddons
            kainchiHalt={kainchiHalt}
            setKainchiHalt={setKainchiHalt}
            roofCarrier={roofCarrier}
            setRoofCarrier={setRoofCarrier}
            bhowaliTeaHalt={bhowaliTeaHalt}
            setBhowaliTeaHalt={setBhowaliTeaHalt}
            seniorAssistance={seniorAssistance}
            setSeniorAssistance={setSeniorAssistance}
          />

          {/* 5. Date, Time & Contact Details */}
          <GuestContactForm
            travelDate={travelDate}
            setTravelDate={setTravelDate}
            pickupTime={pickupTime}
            setPickupTime={setPickupTime}
            guestName={guestName}
            setGuestName={setGuestName}
            guestPhone={guestPhone}
            setGuestPhone={setGuestPhone}
            guestEmail={guestEmail}
            setGuestEmail={setGuestEmail}
            specialNotes={specialNotes}
            setSpecialNotes={setSpecialNotes}
            errorMessage={errorMessage}
          />
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Dynamic Price Receipt & Instant Booking     */}
        {/* ========================================================= */}
        <FareSummaryPanel
          pricing={pricing}
          passengerCount={passengerCount}
          pickupPoint={pickupPoint}
          pickupTime={pickupTime}
          currentFleet={currentFleet}
          currentDest={currentDest}
          routeInfo={routeInfo}
          tripType={tripType}
          days={days}
          kainchiHalt={kainchiHalt}
          bhowaliTeaHalt={bhowaliTeaHalt}
          submitting={submitting || paymentProcessing}
          onOnlineBooking={handleOnlineBooking}
          onWhatsAppBooking={handleWhatsAppBooking}
        />
      </div>
    </div>
  );
};

export default FareCalculator;
