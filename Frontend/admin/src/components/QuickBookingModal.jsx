import { useState, useEffect, useMemo } from 'react';
import { apiClient, calculateStayTariff, useSiteSettings } from '@shared';

export const QuickBookingModal = ({ isOpen, onClose, onBookingCreated, rooms = [] }) => {
  const { settings } = useSiteSettings();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [source, setSource] = useState('Phone Inquiry');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestsCount, setGuestsCount] = useState('2');
  const [customTariff, setCustomTariff] = useState('');
  const [advancePaid, setAdvancePaid] = useState('0');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [specialNotes, setSpecialNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [occupiedRoomIds, setOccupiedRoomIds] = useState([]);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Default selected room when rooms load
  useEffect(() => {
    if (rooms && rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0]._id);
    }
  }, [rooms, selectedRoomId]);

  // Real-time server availability check
  useEffect(() => {
    let isMounted = true;
    const verifyAvailability = async () => {
      if (checkIn && checkOut && new Date(checkIn) < new Date(checkOut)) {
        setCheckingAvailability(true);
        setErrorMsg('');
        try {
          const res = await apiClient.get('/hotel/rooms/check-availability', {
            params: { checkIn, checkOut },
          });
          if (isMounted && res.data && Array.isArray(res.data.occupiedRoomIds)) {
            setOccupiedRoomIds(res.data.occupiedRoomIds);
          }
        } catch (err) {
          if (isMounted) setOccupiedRoomIds([]);
        } finally {
          if (isMounted) setCheckingAvailability(false);
        }
      }
    };
    verifyAvailability();
    return () => { isMounted = false; };
  }, [checkIn, checkOut]);

  // Selected room calculation
  const selectedRoom = rooms.find((r) => r._id === selectedRoomId) || rooms[0];
  const isSelectedRoomOccupied = occupiedRoomIds.includes(selectedRoomId);

  // Dynamic pricing calculation
  const pricingResult = useMemo(() => {
    return calculateStayTariff(
      selectedRoom?.pricePerNight,
      checkIn,
      checkOut,
      settings?.pricingRules
    );
  }, [selectedRoom, checkIn, checkOut, settings?.pricingRules]);

  const nights = pricingResult.nights || 1;
  const standardTotal = pricingResult.totalAmount || (nights * (selectedRoom?.pricePerNight || 0));
  const finalTotal = customTariff !== '' ? Number(customTariff) : standardTotal;
  const numAdvance = Number(advancePaid) || 0;
  const balanceDue = Math.max(0, finalTotal - numAdvance);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      setErrorMsg('Please enter guest name and phone number.');
      return;
    }

    if (isSelectedRoomOccupied) {
      setErrorMsg('Selected room is occupied for these dates. Please choose an available room.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const payload = {
      room: selectedRoomId,
      roomName: selectedRoom?.name || 'Resort Suite',
      guestDetails: {
        name: guestName,
        phone: guestPhone,
        email: guestEmail || 'frontdesk@kasarhimalayanheights.com',
      },
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: guestsCount,
      totalAmount: finalTotal,
      advancePaid: numAdvance,
      balanceDue,
      paymentMode,
      source,
      specialNotes,
      status: 'confirmed',
    };

    try {
      const res = await apiClient.post('/hotel/bookings', payload);
      setConfirmedBooking({
        ...payload,
        bookingId: res.data?.booking?.bookingId || ('KHH-' + Math.floor(100000 + Math.random() * 900000)),
      });
      if (onBookingCreated) {
        onBookingCreated();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create booking. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setConfirmedBooking(null);
    setGuestName('');
    setGuestPhone('');
    setGuestEmail('');
    setCustomTariff('');
    setAdvancePaid('0');
    setSpecialNotes('');
    setErrorMsg('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FDFBF7] rounded-3xl border border-[#C5A059]/40 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1C1817] via-[#2C2523] to-[#7C1D23] px-6 py-4.5 text-[#FDFBF7] flex items-center justify-between border-b border-[#C5A059]/30">
          <div>
            <span className="text-[10px] uppercase font-cinzel text-[#DFCA9B] tracking-widest block font-bold">
              Front Desk Quick Reservation
            </span>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>+ New Guest Booking</span>
            </h2>
          </div>
          <button
            onClick={resetForm}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Confirmation Success View */}
        {confirmedBooking ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-300">
              ✓
            </div>
            <div>
              <h3 className="font-cinzel text-2xl font-bold text-[#2C2523]">Reservation Confirmed!</h3>
              <p className="text-sm text-[#66605B] mt-1 font-sans">
                Suite dates locked successfully in resort calendar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#C5A059]/30 text-left text-xs space-y-2 max-w-md mx-auto font-sans">
              <div className="flex justify-between border-b border-[#C5A059]/20 pb-2">
                <span className="text-[#66605B]">Booking ID:</span>
                <span className="font-mono font-bold text-[#7C1D23]">{confirmedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66605B]">Guest:</span>
                <span className="font-semibold text-[#2C2523]">{confirmedBooking.guestDetails.name} ({confirmedBooking.guestDetails.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66605B]">Room:</span>
                <span className="font-semibold text-[#2C2523]">{confirmedBooking.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66605B]">Dates:</span>
                <span className="font-semibold text-[#2C2523]">{confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#66605B]">Total Tariff:</span>
                <span className="font-semibold text-[#2C2523]">₹{confirmedBooking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Advance Paid ({confirmedBooking.paymentMode}):</span>
                <span className="font-semibold">₹{confirmedBooking.advancePaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#C5A059]/20 font-bold text-sm text-[#7C1D23]">
                <span>Balance Due at Checkout:</span>
                <span>₹{confirmedBooking.balanceDue.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  const msg = encodeURIComponent(
                    `*॥ The Kasar Himalayan Heights — Reservation Confirmation ॥*\n` +
                    `Dear ${confirmedBooking.guestDetails.name},\n` +
                    `Your stay has been confirmed at 6,942 ft elevation!\n\n` +
                    `*Booking ID:* ${confirmedBooking.bookingId}\n` +
                    `*Suite:* ${confirmedBooking.roomName}\n` +
                    `*Check-In:* ${confirmedBooking.checkInDate}\n` +
                    `*Check-Out:* ${confirmedBooking.checkOutDate}\n` +
                    `*Advance Paid:* ₹${confirmedBooking.advancePaid.toLocaleString()} (${confirmedBooking.paymentMode})\n` +
                    `*Balance Due at Check-in:* ₹${confirmedBooking.balanceDue.toLocaleString()}\n\n` +
                    `📍 Kasar Devi, Crank's Ridge, Almora\n` +
                    `We look forward to welcoming you!`
                  );
                  window.open(`https://wa.me/${confirmedBooking.guestDetails.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-cinzel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>1-Click WhatsApp Voucher</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#7C1D23] hover:bg-[#5C151A] text-white font-cinzel text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto font-sans">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Source Tags */}
            <div>
              <label className="block text-[11px] font-cinzel uppercase font-bold text-[#66605B] mb-1.5">
                Inquiry Source
              </label>
              <div className="flex flex-wrap gap-2">
                {['Phone Inquiry', 'Direct Walk-in', 'WhatsApp Direct', 'Travel Agent'].map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSource(src)}
                    className={`px-3 py-1.5 rounded-full text-xs font-cinzel font-semibold transition cursor-pointer ${
                      source === src
                        ? 'bg-[#7C1D23] text-white shadow-xs'
                        : 'bg-[#FAF6EF] text-[#2C2523] border border-[#C5A059]/30 hover:border-[#7C1D23]'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {/* Stay Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FAF6EF] rounded-2xl border border-[#C5A059]/30">
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#66605B] mb-1">
                  Check-In Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/30 text-xs font-semibold text-[#2C2523] focus:outline-none focus:ring-1 focus:ring-[#7C1D23]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#66605B] mb-1">
                  Check-Out Date ({nights} {nights === 1 ? 'Night' : 'Nights'})
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/30 text-xs font-semibold text-[#2C2523] focus:outline-none focus:ring-1 focus:ring-[#7C1D23]"
                />
              </div>
            </div>

            {/* Room Selector with Live Conflict Warning */}
            <div>
              <label className="block text-[11px] font-cinzel uppercase font-bold text-[#66605B] mb-1.5 flex items-center justify-between">
                <span>Select Suite</span>
                {checkingAvailability && (
                  <span className="text-[10px] text-amber-600 animate-pulse font-sans">Checking dates...</span>
                )}
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isSelectedRoomOccupied
                    ? 'border-red-400 bg-red-50/60 text-red-900 ring-1 ring-red-400'
                    : 'border-[#C5A059]/40 bg-white text-[#2C2523]'
                }`}
              >
                {rooms.map((r) => {
                  const isOccupied = occupiedRoomIds.includes(r._id);
                  return (
                    <option key={r._id} value={r._id}>
                      {r.name} — ₹{r.pricePerNight?.toLocaleString()}/nt {isOccupied ? '[OCCUPIED ON SELECTED DATES]' : '✓ [Available]'}
                    </option>
                  );
                })}
              </select>
              {isSelectedRoomOccupied && (
                <p className="mt-1 text-xs text-red-600 font-semibold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>This room already has an active reservation for these dates. Please choose another suite.</span>
                </p>
              )}
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#66605B] mb-1">
                  Guest Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C5A059]/30 text-xs font-semibold text-[#2C2523] focus:outline-none focus:ring-1 focus:ring-[#7C1D23]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#66605B] mb-1">
                  Guest Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C5A059]/30 text-xs font-semibold text-[#2C2523] focus:outline-none focus:ring-1 focus:ring-[#7C1D23]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#66605B] mb-1">
                  Guest Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="guest@gmail.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C5A059]/30 text-xs text-[#2C2523] focus:outline-none focus:ring-1 focus:ring-[#7C1D23]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-[#66605B] mb-1">
                  Guests Count
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#C5A059]/30 text-xs font-semibold text-[#2C2523] cursor-pointer"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults (Family)</option>
                  <option value="5">5+ Group</option>
                </select>
              </div>
            </div>

            {/* Financial Settlement & Advance */}
            <div className="p-4 bg-[#FAF6EF] rounded-2xl border border-[#C5A059]/35 space-y-3">
              <span className="text-[11px] font-cinzel uppercase font-bold text-[#7C1D23] block">
                Billing &amp; Payment Settlement
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#66605B] mb-1">
                    Total Tariff (₹)
                  </label>
                  <input
                    type="number"
                    value={customTariff !== '' ? customTariff : standardTotal}
                    onChange={(e) => setCustomTariff(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/30 text-xs font-bold text-[#2C2523]"
                  />
                  <span className="text-[10px] text-[#66605B]">Base: ₹{standardTotal.toLocaleString()}</span>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald-700 mb-1">
                    Advance Collected (₹)
                  </label>
                  <input
                    type="number"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#66605B] mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/30 text-xs font-semibold text-[#2C2523] cursor-pointer"
                  >
                    <option value="UPI">UPI / GPay / QR</option>
                    <option value="Cash">Cash at Desk</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Card">Card Swipe</option>
                    <option value="Pending">Pay at Check-in</option>
                  </select>
                </div>
              </div>

              {/* Balance Due Display */}
              <div className="flex items-center justify-between pt-2 border-t border-[#C5A059]/20 text-xs">
                <span className="font-semibold text-[#66605B]">Balance Due at Checkout:</span>
                <span className="font-cinzel text-base font-bold text-[#7C1D23]">
                  ₹{balanceDue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Special Requests / Arrival Note */}
            <div>
              <label className="block text-[10px] font-cinzel uppercase font-bold text-[#66605B] mb-1">
                Desk Notes / Train Number / Special Requests
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Kathgodam Shatabdi arrival, requested room heater on prior to arrival..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#C5A059]/30 text-xs text-[#2C2523] focus:outline-none focus:ring-1 focus:ring-[#7C1D23]"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-[#C5A059]/40 bg-white hover:bg-[#FAF6EF] text-[#2C2523] font-cinzel text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isSelectedRoomOccupied}
                className="px-6 py-2.5 rounded-xl bg-[#7C1D23] hover:bg-[#5C151A] text-white font-cinzel text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <span>{loading ? 'Confirming...' : 'Lock Room & Confirm'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuickBookingModal;
