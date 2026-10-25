import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, BedIcon, ArrowUpRightIcon, CheckCircleIcon } from '@shared';
import { mockRooms } from '../data/mockRooms';

const HeroBookingBar = ({ onSearch, rooms }) => {
  const navigate = useNavigate();
  const suiteList = (rooms && rooms.length > 0) ? rooms : mockRooms;
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [selectedSuite, setSelectedSuite] = useState(suiteList[0]?._id || '');

  // Synchronize selected room once live backend data arrives
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setSelectedSuite((prev) => {
        if (!prev || prev.startsWith('mock-')) {
          const mockMatch = mockRooms.find((m) => m._id === prev);
          if (mockMatch) {
            const backendMatch = rooms.find(
              (r) => r.name && mockMatch.name && r.name.toLowerCase().includes(mockMatch.name.split(' ')[0].toLowerCase())
            );
            if (backendMatch) return backendMatch._id;
          }
          return rooms[0]._id;
        }
        return prev;
      });
    }
  }, [rooms]);

  const handleCheckInChange = (newVal) => {
    setCheckIn(newVal);
    if (newVal >= checkOut) {
      const nextDay = new Date(new Date(newVal).getTime() + 86400000).toISOString().split('T')[0];
      setCheckOut(nextDay);
    }
  };

  // Calculate nights
  let nights = 1;
  if (checkIn && checkOut) {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const currentSuite = suiteList.find((r) => r._id === selectedSuite) || suiteList[0] || {};
  const estimatedTotal = nights * (currentSuite.pricePerNight || 6942);

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        checkIn,
        checkOut,
        suiteId: selectedSuite,
        nights,
        estimatedTotal,
      });
    }
    navigate(`/book?room=${selectedSuite}&checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-6 sm:-mt-10 relative z-30 px-3 sm:px-4">
      <form
        onSubmit={handleCheckAvailability}
        className="bg-[#E2E6E8] p-3 sm:p-4 rounded-3xl sm:rounded-full border border-[#CBD2D7] shadow-2xl backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center"
      >
        {/* Field 1: Check-In (3 cols) */}
        <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-[#EBF2EA] transition-colors cursor-pointer border sm:border-0 border-[#073125]/15">
          <label className="text-xs text-[#073125]/75 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1 font-mono">
            <CalendarIcon className="w-4 h-4 text-[#073125]" />
            <span>Check-In</span>
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
            max={maxDateStr}
            onChange={(e) => handleCheckInChange(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#073125] focus:outline-none cursor-pointer"
          />
        </div>

        {/* Field 2: Check-Out (3 cols) */}
        <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-[#EBF2EA] transition-colors cursor-pointer border sm:border-0 border-[#073125]/15">
          <label className="text-xs text-[#073125]/75 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1 font-mono">
            <CalendarIcon className="w-4 h-4 text-[#073125]" />
            <span>Check-Out ({nights} {nights === 1 ? 'nt' : 'nts'})</span>
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            max={maxDateStr}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#073125] focus:outline-none cursor-pointer"
          />
        </div>

        {/* Field 3: Suite Selection (3 cols) */}
        <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-[#EBF2EA] transition-colors cursor-pointer border sm:border-0 border-[#073125]/15">
          <label className="text-xs text-[#073125]/75 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1 font-mono">
            <BedIcon className="w-4 h-4 text-[#073125]" />
            <span>Select Room</span>
          </label>
          <select
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#073125] focus:outline-none cursor-pointer truncate"
          >
            {suiteList.map((suite) => (
              <option key={suite._id} value={suite._id}>
                {suite.name} (₹{suite.pricePerNight?.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Field 4: Search & Check CTA (3 cols) */}
        <div className="lg:col-span-3 sm:col-span-2">
          <button
            type="submit"
            className="group w-full py-3.5 px-6 rounded-2xl sm:rounded-full text-xs sm:text-sm uppercase tracking-wider font-bold bg-[#073125] hover:bg-[#12433B] text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md"
          >
            <span>Book Your Stay</span>
            <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </form>

      {/* Trust & Live Estimation Pill under bar */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-between px-4 text-xs sm:text-sm text-[#073125]/75 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4 text-[#073125]" />
            <span>Best Price Guarantee</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4 text-[#073125]" />
            <span>Free Hot Breakfast</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4 text-[#073125]" />
            <span>Free Cancellation 48h Prior</span>
          </span>
        </div>

        <div className="text-right">
          <span className="text-[#073125] font-semibold font-mono text-xs sm:text-sm">
            {nights} {nights === 1 ? 'Night' : 'Nights'} Est:
          </span>{' '}
          <span className="text-[#073125] font-bold font-serif text-base sm:text-lg">
            ₹{estimatedTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroBookingBar;
