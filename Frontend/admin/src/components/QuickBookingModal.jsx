import { useState, useEffect, useMemo } from 'react';
import { apiClient, calculateStayTariff, useSiteSettings } from '@shared';

export const QuickBookingModal = ({ isOpen, onClose, onBookingCreated, rooms = [] }) => {
  const { settings } = useSiteSettings();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [roomsBooked, setRoomsBooked] = useState(1);
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
  const [availableRoomsMap, setAvailableRoomsMap] = useState({});
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
          if (isMounted && res.data) {
            if (Array.isArray(res.data.occupiedRoomIds)) {
              setOccupiedRoomIds(res.data.occupiedRoomIds);
            }
            if (res.data.availableRoomsByRoomId) {
              setAvailableRoomsMap(res.data.availableRoomsByRoomId);
            }
          }
        } catch (err) {
          if (isMounted) {
            setOccupiedRoomIds([]);
            setAvailableRoomsMap({});
          }
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
  const maxAvailable = availableRoomsMap[selectedRoomId] !== undefined
    ? availableRoomsMap[selectedRoomId]
    : (Number(selectedRoom?.totalRooms) || 1);

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
  const pricePerRoom = pricingResult.totalAmount || (nights * (selectedRoom?.pricePerNight || 0));
  const standardTotal = pricePerRoom * (Number(roomsBooked) || 1);
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
      roomsBooked: Number(roomsBooked) || 1,
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full sm:max-w-2xl bg-white border border-[#C5A059]/40 shadow-2xl overflow-hidden my-0 sm:my-8 max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#0B1118] px-5 sm:px-6 py-4 text-white flex items-center justify-between border-b border-[#C5A059]/40 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-cinzel text-[#C5A059] tracking-widest block font-bold">
              Front Desk Quick Reservation
            </span>
            <h2 className="font-cinzel text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>+ New Guest Booking</span>
            </h2>
          </div>
          <button
            onClick={resetForm}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer text-sm font-bold border border-white/10"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Confirmation Success View */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-400">
              ✓
            </div>
            <div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#0F172A]">Reservation Confirmed</h3>
              <p className="text-xs text-slate-500 mt-1 font-sans">
                Suite dates locked successfully in resort calendar.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-[#C5A059]/30 text-left text-xs space-y-2.5 max-w-md mx-auto font-sans">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-cinzel font-semibold">Booking ID:</span>
                <span className="font-mono font-bold text-[#0B1118] bg-[#C5A059]/15 px-2 py-0.5 border border-[#C5A059]/30">{confirmedBooking.bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guest:</span>
                <span className="font-semibold text-[#0F172A]">{confirmedBooking.guestDetails.name} ({confirmedBooking.guestDetails.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room:</span>
                <span className="font-semibold text-[#0F172A]">{confirmedBooking.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dates:</span>
                <span className="font-semibold text-[#0F172A]">{confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Tariff:</span>
                <span className="font-semibold text-[#0F172A]">₹{confirmedBooking.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Advance Paid ({confirmedBooking.paymentMode}):</span>
                <span>₹{confirmedBooking.advancePaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-[#0B1118]">
                <span>Balance Due at Checkout:</span>
                <span className="text-[#0B1118] font-mono">₹{confirmedBooking.balanceDue.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
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
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-cinzel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm border border-emerald-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>1-Click WhatsApp Voucher</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0B1118] hover:bg-[#111827] text-[#D4AF37] border border-[#C5A059]/50 font-cinzel text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto font-sans flex-1">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Source Tags */}
            <div>
              <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1.5">
                Inquiry Source
              </label>
              <div className="flex flex-wrap gap-2">
                {['Phone Inquiry', 'Direct Walk-in', 'WhatsApp Direct', 'Travel Agent'].map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSource(src)}
                    className={`px-3 py-1.5 text-xs font-cinzel font-semibold transition cursor-pointer border ${
                      source === src
                        ? 'bg-[#0B1118] text-[#D4AF37] border-[#D4AF37] shadow-xs'
                        : 'bg-[#FAF8F5] text-slate-700 border-slate-300 hover:border-[#C5A059]'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {/* Stay Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-[#FAF8F5] border border-slate-200">
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1">
                  Check-In Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1">
                  Check-Out Date ({nights} {nights === 1 ? 'Night' : 'Nights'})
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            {/* Room Selector with Live Conflict Warning & Rooms Count */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Select Suite</span>
                  {checkingAvailability && (
                    <span className="text-[10px] text-amber-700 animate-pulse font-sans">Checking dates...</span>
                  )}
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  required
                  className={`w-full px-3 py-2 border text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isSelectedRoomOccupied
                      ? 'border-rose-400 bg-rose-50 text-rose-900 ring-1 ring-rose-400'
                      : 'border-slate-300 bg-white text-[#0F172A] focus:outline-none focus:border-[#C5A059]'
                  }`}
                >
                  {rooms.map((r) => {
                    const isOccupied = occupiedRoomIds.includes(r._id);
                    const avail = availableRoomsMap[r._id];
                    return (
                      <option key={r._id} value={r._id}>
                        {r.name} — ₹{r.pricePerNight?.toLocaleString()}/nt {isOccupied ? '[OCCUPIED]' : (avail !== undefined ? `✓ [${avail} Available]` : '✓ [Available]')}
                      </option>
                    );
                  })}
                </select>
                {isSelectedRoomOccupied && (
                  <p className="mt-1 text-xs text-rose-700 font-semibold flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>This room already has an active reservation for these dates. Please choose another suite.</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                  <span>Rooms Count</span>
                  <span className="text-[10px] text-slate-500 font-mono">{maxAvailable > 0 ? `${maxAvailable} avail` : '0 left'}</span>
                </label>
                <select
                  value={roomsBooked}
                  onChange={(e) => setRoomsBooked(Number(e.target.value))}
                  disabled={maxAvailable <= 0}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-[#0F172A] text-center focus:outline-none focus:border-[#C5A059]"
                >
                  {Array.from({ length: Math.max(1, maxAvailable || 1) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Room' : 'Rooms'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guest Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1">
                  Guest Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1">
                  Guest Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1">
                  Guest Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="guest@gmail.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1">
                  Guests Count
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-xs font-semibold text-[#0F172A] cursor-pointer focus:outline-none focus:border-[#C5A059]"
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
            <div className="p-4 bg-[#FAF8F5] border border-[#C5A059]/30 space-y-3">
              <span className="text-[10px] font-cinzel uppercase font-bold text-[#0B1118] block tracking-wider">
                Billing &amp; Payment Settlement
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                    Total Tariff (₹)
                  </label>
                  <input
                    type="number"
                    value={customTariff !== '' ? customTariff : standardTotal}
                    onChange={(e) => setCustomTariff(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                  />
                  <span className="text-[10px] text-slate-500">Base: ₹{standardTotal.toLocaleString()}</span>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-emerald-800 mb-1">
                    Advance Collected (₹)
                  </label>
                  <input
                    type="number"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-emerald-400 text-xs font-bold text-emerald-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-xs font-semibold text-[#0F172A] cursor-pointer focus:outline-none focus:border-[#C5A059]"
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
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span className="font-semibold text-slate-600">Balance Due at Checkout:</span>
                <span className="font-mono text-base font-bold text-[#0B1118]">
                  ₹{balanceDue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Special Requests / Arrival Note */}
            <div>
              <label className="block text-[10px] font-cinzel uppercase font-bold text-slate-600 mb-1">
                Desk Notes / Train Number / Special Requests
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Kathgodam Shatabdi arrival, requested room heater on prior to arrival..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-2.5 pb-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 bg-[#FAF8F5] hover:bg-slate-200 text-slate-800 font-cinzel text-xs font-bold uppercase tracking-wider transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isSelectedRoomOccupied}
                className="px-6 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B1118] font-cinzel text-xs font-bold uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm border border-[#D4AF37] flex items-center gap-1.5"
              >
                {loading && (
                  <span className="w-3.5 h-3.5 border-2 border-[#0B1118]/30 border-t-[#0B1118] rounded-full animate-spin shrink-0" />
                )}
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
