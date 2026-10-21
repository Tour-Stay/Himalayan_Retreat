import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, ArrowUpRightIcon, WhatsAppIcon, SITE_CONFIG, useSiteSettings, calculateStayTariff, useRazorpay } from '@shared';
import { mockRooms } from '../data/mockRooms';

const BookingForm = ({ preSelectedRoom = null, initialCheckIn = '', initialCheckOut = '', onSelectRoom }) => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const { initializePayment, isProcessing: paymentProcessing } = useRazorpay();
  const policies = settings?.hotelPolicies;
  const company = settings?.company;

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const checkInTime = policies?.checkInTime || '12:00 PM';
  const checkOutTime = policies?.checkOutTime || '10:00 AM';
  const cancellationPolicy = policies?.cancellationPolicy || 'Free cancellation up to 48 hours prior to check-in';
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;

  const [rooms, setRooms] = useState(mockRooms);
  const [formData, setFormData] = useState({
    room: preSelectedRoom || mockRooms[0]._id,
    roomsBooked: 1,
    name: '',
    email: '',
    phone: '',
    checkInDate: initialCheckIn || today,
    checkOutDate: initialCheckOut || tomorrow,
    guests: '2',
    specialRequest: '',
  });
  const [loading, setLoading] = useState(false);
  const [occupiedRoomIds, setOccupiedRoomIds] = useState([]);
  const [availableRoomsMap, setAvailableRoomsMap] = useState({});
  const [isRoomUnavailable, setIsRoomUnavailable] = useState(false);
  const [paymentPending, setPaymentPending] = useState(false);
  const [pendingBookingPayload, setPendingBookingPayload] = useState(null);
  const [conflictError, setConflictError] = useState('');
  const [holdExpiresAt, setHoldExpiresAt] = useState(null);
  const [holdSecondsLeft, setHoldSecondsLeft] = useState(0);

  // 15-minute countdown timer for temporary room hold
  useEffect(() => {
    if (!holdExpiresAt) {
      setHoldSecondsLeft(0);
      return;
    }

    const updateRemaining = () => {
      const now = Date.now();
      const expiry = new Date(holdExpiresAt).getTime();
      const diffSec = Math.max(0, Math.floor((expiry - now) / 1000));
      setHoldSecondsLeft(diffSec);
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Synchronize initial check-in & check-out dates from query parameters
  useEffect(() => {
    if (initialCheckIn || initialCheckOut) {
      setFormData((prev) => ({
        ...prev,
        ...(initialCheckIn ? { checkInDate: initialCheckIn } : {}),
        ...(initialCheckOut ? { checkOutDate: initialCheckOut } : {}),
      }));
    }
  }, [initialCheckIn, initialCheckOut]);

  // Real-time server availability check to prevent double bookings
  useEffect(() => {
    let isMounted = true;
    const verifyAvailability = async () => {
      if (formData.checkInDate && formData.checkOutDate && new Date(formData.checkInDate) < new Date(formData.checkOutDate)) {
        try {
          const res = await apiClient.get('/hotel/rooms/check-availability', {
            params: {
              checkIn: formData.checkInDate,
              checkOut: formData.checkOutDate,
            },
          });
          if (isMounted && res.data) {
            if (Array.isArray(res.data.occupiedRoomIds)) {
              setOccupiedRoomIds(res.data.occupiedRoomIds);
              const occupied = res.data.occupiedRoomIds.includes(formData.room);
              setIsRoomUnavailable(occupied);
            }
            if (res.data.availableRoomsByRoomId) {
              setAvailableRoomsMap(res.data.availableRoomsByRoomId);
            }
          }
        } catch (err) {
          // Graceful fallback: do not block if network check fails
          if (isMounted) {
            setOccupiedRoomIds([]);
            setAvailableRoomsMap({});
            setIsRoomUnavailable(false);
          }
        }
      } else {
        if (isMounted) {
          setOccupiedRoomIds([]);
          setAvailableRoomsMap({});
          setIsRoomUnavailable(false);
        }
      }
    };
    verifyAvailability();
    return () => { isMounted = false; };
  }, [formData.checkInDate, formData.checkOutDate, formData.room]);

  // Load rooms from backend, fallback to mockRooms if empty or offline
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await apiClient.get('/hotel/rooms');
        if (res.data && res.data.length > 0) {
          setRooms(res.data);
          if (!preSelectedRoom) {
            setFormData((prev) => ({ ...prev, room: res.data[0]._id }));
          } else {
            const exists = res.data.some((r) => r._id === preSelectedRoom);
            if (!exists) {
              const mock = mockRooms.find((m) => m._id === preSelectedRoom);
              const nameMatch = res.data.find(
                (r) => mock && r.name && r.name.toLowerCase().includes(mock.name.split(' ')[0].toLowerCase())
              );
              if (nameMatch) {
                setFormData((prev) => ({ ...prev, room: nameMatch._id }));
                if (onSelectRoom) onSelectRoom(nameMatch._id);
              }
            }
          }
        }
      } catch (error) {
        setRooms(mockRooms);
      }
    };
    fetchRooms();
  }, [preSelectedRoom, onSelectRoom]);

  useEffect(() => {
    if (preSelectedRoom) {
      setFormData((prev) => ({ ...prev, room: preSelectedRoom }));
    }
  }, [preSelectedRoom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'checkInDate' && value >= prev.checkOutDate) {
        const nextDay = new Date(new Date(value).getTime() + 86400000).toISOString().split('T')[0];
        updated.checkOutDate = nextDay;
      }
      return updated;
    });
    if (name === 'room' && onSelectRoom) {
      onSelectRoom(value);
    }
    setConflictError('');
  };

  // Find selected room for pricing calculation
  const selectedRoomObj = rooms.find((r) => r._id === formData.room) || rooms[0];

  // Calculate max available rooms for currently selected room and dates
  const maxAvailableForRoom = useMemo(() => {
    if (availableRoomsMap[formData.room] !== undefined) {
      return availableRoomsMap[formData.room];
    }
    return Number(selectedRoomObj?.totalRooms) || 1;
  }, [availableRoomsMap, formData.room, selectedRoomObj]);

  // Clamp roomsBooked if inventory decreased or room changed
  useEffect(() => {
    if (maxAvailableForRoom > 0 && Number(formData.roomsBooked) > maxAvailableForRoom) {
      setFormData((prev) => ({ ...prev, roomsBooked: maxAvailableForRoom }));
    }
  }, [maxAvailableForRoom, formData.roomsBooked]);

  // Dynamic yield & seasonal pricing calculation
  const pricingResult = useMemo(() => {
    if (!selectedRoomObj || !formData.checkInDate || !formData.checkOutDate) {
      return { totalAmount: 0, avgPricePerNight: selectedRoomObj?.pricePerNight || 0, nights: 0, hasSurcharge: false, activeSurchargeReason: '' };
    }
    return calculateStayTariff(
      selectedRoomObj.pricePerNight,
      formData.checkInDate,
      formData.checkOutDate,
      settings?.pricingRules
    );
  }, [selectedRoomObj, formData.checkInDate, formData.checkOutDate, settings?.pricingRules]);

  const nights = pricingResult.nights;
  const pricePerRoom = pricingResult.totalAmount;
  const totalPrice = pricePerRoom * (Number(formData.roomsBooked) || 1);

  const handleRetryPayment = async () => {
    if (!pendingBookingPayload) return;
    if (holdSecondsLeft <= 0) {
      setPaymentPending(false);
      setPendingBookingPayload(null);
      setHoldExpiresAt(null);
      setConflictError('The 15-minute room hold has expired. Please select your room and dates again.');
      return;
    }
    setLoading(true);
    try {
      await initializePayment({
        bookingId: pendingBookingPayload.dbBookingId,
        receiptId: pendingBookingPayload.dbBookingId,
        bookingType: 'hotel',
        prefill: {
          name: pendingBookingPayload.guestDetails.name,
          contact: pendingBookingPayload.guestDetails.phone,
          email: pendingBookingPayload.guestDetails.email,
        },
        onOrderCreated: ({ holdExpiresAt: serverHoldExpires }) => {
          if (serverHoldExpires) {
            setHoldExpiresAt(serverHoldExpires);
          }
        },
        onSuccess: (paymentResponse) => {
          setLoading(false);
          setPaymentPending(false);
          setHoldExpiresAt(null);
          navigate('/booking-confirmation', {
            state: {
              booking: { ...pendingBookingPayload, paymentId: paymentResponse.razorpay_payment_id },
            },
          });
        },
        onFailure: (error) => {
          setLoading(false);
          const msg = error?.response?.data?.message || error?.message || '';
          if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('timeout')) {
            setPaymentPending(false);
            setPendingBookingPayload(null);
            setHoldExpiresAt(null);
            setConflictError('The 15-minute reservation hold has expired. Please choose your dates again.');
          }
        },
      });
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || '';
      if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('timeout')) {
        setPaymentPending(false);
        setPendingBookingPayload(null);
        setHoldExpiresAt(null);
        setConflictError('The 15-minute reservation hold has expired. Please choose your dates again.');
      } else {
        alert('Failed to initialize payment. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConflictError('');
    setLoading(true);

    const roomsCount = Math.max(1, Number(formData.roomsBooked) || 1);
    const bookingPayload = {
      room: formData.room,
      roomsBooked: roomsCount,
      roomName: selectedRoomObj?.name || 'Himalayan Snow View Suite',
      guestDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      guests: formData.guests,
      specialRequest: formData.specialRequest,
      nights: nights || 1,
      totalAmount: totalPrice || ((selectedRoomObj?.pricePerNight || 6942) * roomsCount),
      bookingId: 'KHH-' + Math.floor(100000 + Math.random() * 900000),
    };

    try {
      const response = await apiClient.post('/hotel/bookings', bookingPayload);
      const dbBookingId = response.data?.booking?._id || bookingPayload.bookingId;
      const initialHoldExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      setHoldExpiresAt(initialHoldExpires);

      await initializePayment({
        bookingId: dbBookingId,
        receiptId: dbBookingId,
        bookingType: 'hotel',
        prefill: {
          name: bookingPayload.guestDetails.name,
          contact: bookingPayload.guestDetails.phone,
          email: bookingPayload.guestDetails.email,
        },
        onOrderCreated: ({ holdExpiresAt: serverHoldExpires }) => {
          if (serverHoldExpires) {
            setHoldExpiresAt(serverHoldExpires);
          }
        },
        onSuccess: (paymentResponse) => {
          setLoading(false);
          setHoldExpiresAt(null);
          navigate('/booking-confirmation', {
            state: {
              booking: { ...bookingPayload, paymentId: paymentResponse.razorpay_payment_id },
            },
          });
        },
        onFailure: (error) => {
          setLoading(false);
          const msg = error?.response?.data?.message || error?.message || '';
          if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('timeout')) {
            setPaymentPending(false);
            setPendingBookingPayload(null);
            setHoldExpiresAt(null);
            setConflictError('The 15-minute reservation hold has expired. Please choose your dates again.');
          } else {
            setPaymentPending(true);
            setPendingBookingPayload({ ...bookingPayload, dbBookingId });
          }
        },
      });
    } catch (err) {
      console.warn('Backend unavailable or error occurred.', err.message);
      setLoading(false);
      const errorMsg = err.response?.data?.message || '';
      if (err.response?.status === 409 || errorMsg.toLowerCase().includes('already reserved') || errorMsg.toLowerCase().includes('already booked') || errorMsg.toLowerCase().includes('only')) {
        setConflictError(errorMsg || "We're sorry, the requested number of suites is not available for these dates. Please choose different dates or fewer rooms.");
      } else {
        alert('Failed to connect to the booking server. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {/* Room Selector & Room Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#073125] mb-1.5 font-mono">
            Select Suite
          </label>
          <select
            name="room"
            value={formData.room}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#073125]/20 bg-[#FBFDFB] text-[#073125] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#073125]/30 transition cursor-pointer"
          >
            {rooms.map((room) => {
              const isOccupied = occupiedRoomIds.includes(room._id);
              const avail = availableRoomsMap[room._id];
              return (
                <option key={room._id} value={room._id} disabled={isOccupied}>
                  {room.name} — ₹{room.pricePerNight?.toLocaleString()}/night
                  {isOccupied ? ' [Sold Out for Selected Dates]' : (avail !== undefined ? ` (${avail} available)` : '')}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#073125] mb-1.5 font-mono flex items-center justify-between">
            <span>Rooms</span>
            <span className="text-[11px] text-[#073125]/70 font-sans font-normal">
              {maxAvailableForRoom > 0 ? `${maxAvailableForRoom} left` : 'Sold out'}
            </span>
          </label>
          <select
            name="roomsBooked"
            value={formData.roomsBooked}
            onChange={handleChange}
            disabled={maxAvailableForRoom <= 0}
            className="w-full px-4 py-3 rounded-xl border border-[#073125]/20 bg-[#FBFDFB] text-[#073125] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#073125]/30 transition cursor-pointer disabled:bg-gray-100 disabled:text-gray-400 font-semibold text-center"
          >
            {Array.from({ length: Math.max(1, maxAvailableForRoom || 1) }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Room' : 'Rooms'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Conflict Warning Banner */}
      {isRoomUnavailable && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-red-700 font-semibold shadow-xs">
          <span className="text-base">⚠️</span>
          <span>This room is already reserved for the selected dates. Please choose another suite or alternative dates.</span>
        </div>
      )}

      {conflictError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-red-700 font-semibold shadow-xs">
          <span className="text-base">⚠️</span>
          <span>{conflictError}</span>
        </div>
      )}

      {/* Date Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#073125] mb-1.5 font-mono flex items-center justify-between">
            <span>Check-In</span>
            <span className="text-xs text-[#073125]/60 lowercase font-normal font-sans">({checkInTime})</span>
          </label>
          <input
            type="date"
            name="checkInDate"
            value={formData.checkInDate}
            onChange={handleChange}
            min={today}
            max={maxDateStr}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#073125]/20 bg-[#FBFDFB] text-[#073125] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#073125]/30 transition cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#073125] mb-1.5 font-mono flex items-center justify-between">
            <span>Check-Out</span>
            <span className="text-xs text-[#073125]/60 lowercase font-normal font-sans">({checkOutTime})</span>
          </label>
          <input
            type="date"
            name="checkOutDate"
            value={formData.checkOutDate}
            onChange={handleChange}
            min={formData.checkInDate || today}
            max={maxDateStr}
            required
            className="w-full px-4 py-3 rounded-xl border border-[#073125]/20 bg-[#FBFDFB] text-[#073125] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#073125]/30 transition cursor-pointer"
          />
        </div>
      </div>

      {/* Guest Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#073125] mb-1.5 font-mono">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Anand Sharma"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#073125]/20 bg-[#FBFDFB] text-[#073125] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#073125]/30 transition"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#073125] mb-1.5 font-mono">
            Guests
          </label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-[#073125]/20 bg-[#FBFDFB] text-[#073125] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#073125]/30 transition cursor-pointer"
          >
            <option value="1">1 Adult</option>
            <option value="2">2 Adults</option>
            <option value="3">3 Adults</option>
            <option value="4">4 Adults</option>
            <option value="5">5 Adults</option>
            <option value="6">6 Adults</option>
            <option value="8">8 Adults</option>
            <option value="10+">10+ Adults (Group / Family)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#073125] mb-1.5 font-mono">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="anand@example.com"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#073125]/20 bg-[#FBFDFB] text-[#073125] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#073125]/30 transition"
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#073125] mb-1.5 font-mono">
            WhatsApp / Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            required
            className="w-full px-4 py-3 rounded-xl border border-[#073125]/20 bg-[#FBFDFB] text-[#073125] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#073125]/30 transition"
          />
        </div>
      </div>

      {/* Live Price Summary if Dates Picked */}
      {nights > 0 && selectedRoomObj && (
        <div className="p-4 bg-[#EBF2EA]/70 rounded-xl border border-[#073125]/15 flex items-center justify-between text-sm sm:text-base">
          <div>
            <span className="font-semibold text-[#073125] block">
              {selectedRoomObj.name}
            </span>
            <span className="text-xs sm:text-sm text-[#073125]/70 block mt-0.5">
              ₹{pricingResult.avgPricePerNight?.toLocaleString()} × {nights} {nights === 1 ? 'night' : 'nights'}
              {Number(formData.roomsBooked) > 1 && (
                <span className="font-semibold text-[#073125]"> × {formData.roomsBooked} rooms</span>
              )}
            </span>
            {pricingResult.hasSurcharge && (
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#C9F24D]/30 text-[#073125] border border-[#073125]/20 text-xs font-semibold">
                ✨ {pricingResult.activeSurchargeReason}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs text-[#073125]/60 block font-mono">Estimated Total</span>
            <span className="font-serif text-2xl font-bold text-[#073125]">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button or Retry State */}
      {paymentPending ? (
        <div className="p-6 bg-yellow-50/80 border border-yellow-200/80 rounded-2xl text-center space-y-4 shadow-sm">
          <div className="text-3xl mb-1">
            {holdSecondsLeft > 0 ? '⏳' : '⏰'}
          </div>
          <h3 className="text-xl font-serif text-[#073125] font-bold">
            {holdSecondsLeft > 0 ? 'Room Hold Active — Complete Payment' : 'Room Hold Expired'}
          </h3>

          {holdSecondsLeft > 0 ? (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs sm:text-sm font-bold">
                <span>Hold expires in:</span>
                <span className="text-base text-red-600 font-extrabold">{formatTimer(holdSecondsLeft)}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#073125]/80 max-w-md mx-auto">
                Your suite is temporarily held for <span className="font-semibold">{formatTimer(holdSecondsLeft)}</span>. Please complete payment before the timer expires to secure your reservation.
              </p>
              <button
                type="button"
                onClick={handleRetryPayment}
                disabled={loading || holdSecondsLeft <= 0}
                className="w-full py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold bg-[#C9F24D] text-[#073125] hover:bg-[#b8e23f] transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Pay ₹${totalPrice.toLocaleString()} Now (${formatTimer(holdSecondsLeft)})`}
              </button>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-300 font-medium text-xs">
                <span>Hold expired at 00:00</span>
              </div>
              <p className="text-xs sm:text-sm text-red-700 max-w-md mx-auto font-medium">
                The 15-minute temporary hold on this suite has expired and the room has been released. Please re-select your dates to book.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPaymentPending(false);
                  setPendingBookingPayload(null);
                  setHoldExpiresAt(null);
                }}
                className="w-full py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold bg-[#073125] text-white hover:bg-[#12433B] transition-all shadow-md cursor-pointer"
              >
                Select Dates & Re-Book
              </button>
            </>
          )}

          {holdSecondsLeft > 0 && (
            <button
              type="button"
              onClick={() => {
                setPaymentPending(false);
                setPendingBookingPayload(null);
                setHoldExpiresAt(null);
              }}
              className="text-xs text-[#073125]/60 hover:underline pt-2 cursor-pointer block mx-auto"
            >
              Cancel and edit details
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5 pt-2">
          <button
            type="submit"
            disabled={loading || isRoomUnavailable}
            className="w-full py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold bg-[#073125] hover:bg-[#12433B] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transition-all duration-300 shadow-md cursor-pointer"
          >
            <span>
              {loading
                ? 'Confirming Booking...'
                : isRoomUnavailable
                ? 'Dates Unavailable — Select Alternative Room'
                : 'Book Your Room Now'}
            </span>
            {!loading && !isRoomUnavailable && (
              <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              const text = encodeURIComponent(
                `Hello Kasar Himalayan Heights! I would like to book ${selectedRoomObj?.name || 'a room'} from ${formData.checkInDate || 'upcoming dates'} for ${formData.guests} guest(s).`
              );
              window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
            }}
            className="w-full py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-bold border border-[#073125]/30 hover:bg-[#EBF2EA] text-[#073125] flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#073125]" />
            <span>Book on WhatsApp</span>
          </button>
        </div>
      )}

      <p className="text-center text-xs text-[#073125]/65 pt-1">
        Best price guaranteed • {cancellationPolicy} • Free hot breakfast included
      </p>
    </form>
  );
};

export default BookingForm;
