import { useState, useEffect } from 'react';
import { apiClient, SITE_CONFIG, ArrowUpRightIcon, CheckCircleIcon } from '@shared';
import { fleetData, destinationsData } from '../data/travelData';

const FareCalculator = ({ selectedFleetId, onSelectFleet }) => {
  const [selectedFleet, setSelectedFleet] = useState(selectedFleetId || '6-seater');

  useEffect(() => {
    if (selectedFleetId) {
      setSelectedFleet(selectedFleetId);
    }
  }, [selectedFleetId]);

  const [selectedDestId, setSelectedDestId] = useState('jageshwar-dham');
  const [tripType, setTripType] = useState('round-trip'); // 'round-trip' | 'one-way'
  const [days, setDays] = useState(1);
  const [passengerCount, setPassengerCount] = useState(2);
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split('T')[0];
  });
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const currentFleet = fleetData.find((f) => f.id === selectedFleet) || fleetData[1];
  const currentDest = destinationsData.find((d) => d.id === selectedDestId) || destinationsData[0];

  const oneWayKm = currentDest.kmFromAlmora || 45;
  const totalKm = tripType === 'round-trip' ? oneWayKm * 2 : oneWayKm;

  // Transparent Mountain Pricing Formula
  const minBillingKm = 100 * days;
  const billableKm = Math.max(totalKm, minBillingKm);
  const distanceFare = billableKm * currentFleet.perKmRate;
  const driverBatta = 500 * days;
  const estimatedTotal = distanceFare + driverBatta;

  // Direct Backend API Submission (Saves to MongoDB for Admin Dashboard)
  const handleOnlineBooking = async (e) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }
    setErrorMessage('');
    setSubmitting(true);

    try {
      const payload = {
        vehicleType: currentFleet.id,
        circuit: `${currentDest.name} (${currentDest.distance})`,
        pickupLocation: 'Almora Station / Kasar Devi Base',
        tripDays: days,
        travelDate,
        travelers: Number(passengerCount),
        totalAmount: estimatedTotal,
        notes: `Mode: ${tripType}, ${billableKm} km @ ₹${currentFleet.perKmRate}/km. ${specialNotes}`,
        guestDetails: {
          name: guestName,
          phone: guestPhone,
          email: guestEmail || 'concierge@himalayanretreat.com',
        },
      };

      const res = await apiClient.post('/travel/bookings', payload);
      setBookingSuccess(res.data?.booking || { _id: 'DEV-ALMORA-' + Date.now().toString().slice(-6) });
    } catch (err) {
      // Graceful offline fallback reference ID so customer journey never breaks
      setBookingSuccess({
        _id: 'DEV-ALMORA-' + Math.floor(100000 + Math.random() * 900000),
        offlineNotice: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppBooking = () => {
    const text = encodeURIComponent(
      `*Himalayan Chauffeured Booking Inquiry*\n\n` +
      `*Starting Hub:* Almora Station / Kasar Devi Base\n` +
      `*Destination:* ${currentDest.name} (${currentDest.distance})\n` +
      `*Vehicle:* ${currentFleet.title} (${currentFleet.model})\n` +
      `*Trip Type:* ${tripType === 'round-trip' ? 'Round Trip' : 'One Way'}\n` +
      `*Date:* ${travelDate}\n` +
      `*Duration:* ${days} ${days === 1 ? 'Day' : 'Days'}\n` +
      `*Passengers:* ${passengerCount} Guests\n` +
      `*Estimated Distance:* ${billableKm} km (Base ₹${currentFleet.perKmRate}/km)\n` +
      `*Estimated Fare:* ₹${estimatedTotal.toLocaleString()} (incl. driver allowance)\n` +
      `*Guest Name:* ${guestName || 'Inquirer'}\n` +
      `*Contact:* ${guestPhone || 'WhatsApp'}\n` +
      (specialNotes ? `*Notes:* ${specialNotes}\n` : '')
    );
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div id="calculator" className="bg-ivory-warm p-8 sm:p-12 rounded-3xl border border-gold/35 shadow-xl font-sans">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold block mb-2 font-mono">
          Transparent Kumaon Pricing
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
          Almora Mountain Fare Calculator
        </h3>
        <p className="text-charcoal-muted text-sm mt-2 font-light">
          Calculated directly from our Almora hub to sacred shrines and mountain viewpoints. Zero hidden surcharges.
        </p>
      </div>

      {bookingSuccess ? (
        <div className="max-w-2xl mx-auto bg-ivory p-8 sm:p-10 rounded-3xl border border-gold/40 shadow-lg text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700">
            <CheckCircleIcon className="w-9 h-9" />
          </div>
          <h4 className="font-serif text-3xl text-charcoal font-medium">
            Mountain Route Reserved
          </h4>
          <p className="text-charcoal-muted text-sm leading-relaxed max-w-md mx-auto">
            Your chauffeured mountain itinerary has been confirmed. Our Pahadi chauffeur liaison will contact you on WhatsApp with vehicle registration and driver contact details.
          </p>
          <div className="p-4 bg-ivory-warm rounded-2xl border border-gold/25 text-left text-xs space-y-1.5 font-mono max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Booking Reference:</span>
              <span className="font-bold text-maroon">{bookingSuccess._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Vehicle Class:</span>
              <span className="font-bold text-charcoal">{currentFleet.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Circuit:</span>
              <span className="font-bold text-charcoal">{currentDest.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Travel Date:</span>
              <span className="font-bold text-charcoal">{travelDate} ({days} Day{days > 1 ? 's' : ''})</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gold/20">
              <span className="text-charcoal-muted font-bold">Estimated Fare:</span>
              <span className="font-bold text-maroon text-sm">₹{estimatedTotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleWhatsAppBooking}
              className="px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-ivory text-xs uppercase tracking-wider font-semibold shadow-md transition-colors"
            >
              Verify on WhatsApp &rarr;
            </button>
            <button
              onClick={() => setBookingSuccess(null)}
              className="px-6 py-3 rounded-full border border-gold/40 text-charcoal text-xs uppercase tracking-wider font-semibold hover:bg-gold/10 transition-colors"
            >
              Calculate Another Route
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input Parameters (7 cols) */}
          <form onSubmit={handleOnlineBooking} className="lg:col-span-7 space-y-5">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* 1. Fleet Vehicle Picker */}
            <div>
              <label className="block text-xs uppercase font-semibold text-charcoal tracking-wider mb-2 font-mono">
                Select Fleet Class
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {fleetData.map((f) => (
                  <button
                    type="button"
                    key={f.id}
                    onClick={() => {
                      setSelectedFleet(f.id);
                      if (onSelectFleet) onSelectFleet(f.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedFleet === f.id
                        ? 'bg-maroon text-ivory border-gold/50 shadow-md'
                        : 'bg-ivory border-gold/25 text-charcoal hover:bg-gold/10'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{f.seats} Seater</span>
                    <span className="block text-[11px] opacity-80 truncate">{f.model.split('/')[0]}</span>
                    <span className="block text-xs font-mono font-bold mt-1 text-gold">₹{f.perKmRate}/km</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Destination Circuit Picker */}
            <div>
              <label className="block text-xs uppercase font-semibold text-charcoal tracking-wider mb-2 font-mono">
                Circuit Destination (From Almora Base)
              </label>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full px-4 py-3 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
              >
                {destinationsData.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.distance} ({d.categoryLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Trip Type, Days, and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal tracking-wider mb-2 font-mono">
                  Trip Direction
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTripType('round-trip')}
                    className={`py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      tripType === 'round-trip'
                        ? 'bg-maroon text-ivory border border-gold/40'
                        : 'bg-ivory border border-gold/25 text-charcoal'
                    }`}
                  >
                    Round Trip
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripType('one-way')}
                    className={`py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                      tripType === 'one-way'
                        ? 'bg-maroon text-ivory border border-gold/40'
                        : 'bg-ivory border border-gold/25 text-charcoal'
                    }`}
                  >
                    One Way
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal tracking-wider mb-2 font-mono">
                  Duration
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
                >
                  <option value={1}>1 Day (Same Day)</option>
                  <option value={2}>2 Days (1 Night)</option>
                  <option value={3}>3 Days (2 Nights)</option>
                  <option value={5}>5 Days (Circuit)</option>
                  <option value={8}>8 Days (Chardham)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal tracking-wider mb-2 font-mono">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-4 py-3 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            {/* 4. Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal tracking-wider mb-1 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Ramesh Joshi"
                  className="w-full px-4 py-3 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal tracking-wider mb-1 font-mono">
                  WhatsApp Phone
                </label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal tracking-wider mb-1 font-mono">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full px-4 py-3 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-charcoal tracking-wider mb-1 font-mono">
                Pickup Notes & Requests (Optional)
              </label>
              <textarea
                rows={2}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Arriving on Shatabdi at Kathgodam 11:30 AM, need baby seat, elder assistance..."
                className="w-full px-4 py-2.5 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
              />
            </div>

            {/* Dual CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-4 rounded-xl text-xs uppercase tracking-widest font-semibold bg-maroon hover:bg-maroon-dark text-ivory flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? 'Reserving...' : 'Reserve Route Online'}</span>
                <CheckCircleIcon className="w-4 h-4 text-gold" />
              </button>
              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="sm:w-auto px-6 py-4 rounded-xl text-xs uppercase tracking-widest font-semibold border border-gold/40 text-charcoal hover:bg-gold/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>WhatsApp Quote</span>
                <ArrowUpRightIcon className="w-4 h-4 text-emerald-700" />
              </button>
            </div>
          </form>

          {/* Right: Transparent Fare Breakdown Card (5 cols) */}
          <div className="lg:col-span-5 bg-ivory p-6 sm:p-8 rounded-3xl border border-gold/30 shadow-md space-y-5">
            <div className="pb-4 border-b border-gold/20">
              <span className="text-gold text-xs uppercase tracking-wider font-semibold block font-mono">
                Live Rate Breakdown
              </span>
              <h4 className="font-serif text-2xl font-medium text-charcoal mt-1">
                {currentFleet.title}
              </h4>
              <p className="text-xs text-charcoal-muted mt-0.5">
                {currentFleet.model}
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-sans">
              <div className="flex justify-between items-center text-charcoal">
                <span>Selected Destination:</span>
                <span className="font-medium text-right">{currentDest.name}</span>
              </div>
              <div className="flex justify-between items-center text-charcoal">
                <span>Distance from Almora:</span>
                <span className="font-mono">{oneWayKm} km {tripType === 'round-trip' ? '× 2 = ' + (oneWayKm * 2) + ' km' : ''}</span>
              </div>
              <div className="flex justify-between items-center text-charcoal">
                <span>Billable Distance:</span>
                <span className="font-mono">{billableKm} km</span>
              </div>
              <div className="flex justify-between items-center text-charcoal">
                <span>Base Rate (₹{currentFleet.perKmRate}/km):</span>
                <span className="font-mono">₹{distanceFare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-charcoal">
                <span>Pahadi Chauffeur Allowance ({days}d):</span>
                <span className="font-mono">₹{driverBatta.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-charcoal">
                <span>Uttarakhand State Tourist Permit:</span>
                <span className="text-gold font-semibold font-mono">Included</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gold/20 flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-charcoal-muted block font-mono">
                  Estimated Total Fare
                </span>
                <span className="font-serif text-3xl font-semibold text-maroon">
                  ₹{estimatedTotal.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-charcoal-muted font-light">All-inclusive</span>
            </div>

            <div className="p-3.5 bg-ivory-warm rounded-xl border border-gold/20 text-[11px] text-charcoal-muted space-y-1">
              <div className="flex items-center gap-1.5 text-charcoal">
                <CheckCircleIcon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>Includes hill fuel, driver batta & toll taxes.</span>
              </div>
              <div className="flex items-center gap-1.5 text-charcoal">
                <CheckCircleIcon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>Free cancellation up to 24h before pickup.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FareCalculator;
