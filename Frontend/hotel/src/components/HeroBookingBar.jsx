import { useState } from 'react';
import { CalendarIcon, BedIcon, ArrowUpRightIcon, CheckCircleIcon } from '@shared';
import { mockRooms } from '../data/mockRooms';

const HeroBookingBar = ({ onSearch }) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [selectedSuite, setSelectedSuite] = useState(mockRooms[0]._id);

  // Calculate nights
  let nights = 1;
  if (checkIn && checkOut) {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const currentSuite = mockRooms.find((r) => r._id === selectedSuite) || mockRooms[0];
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
    const bookEl = document.getElementById('book');
    if (bookEl) {
      bookEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-6 sm:-mt-10 relative z-30 px-3 sm:px-4">
      <form
        onSubmit={handleCheckAvailability}
        className="bg-ivory/95 p-3 sm:p-4 rounded-3xl sm:rounded-full border border-gold/40 shadow-2xl shadow-charcoal/10 backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center"
      >
        {/* Field 1: Check-In (3 cols) */}
        <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-gold/10 transition-colors cursor-pointer border sm:border-0 border-gold/20">
          <label className="text-[10px] text-charcoal-muted uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1 font-mono">
            <CalendarIcon className="w-3.5 h-3.5 text-gold" />
            <span>Check-In</span>
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
            max={maxDateStr}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-charcoal focus:outline-none cursor-pointer"
          />
        </div>

        {/* Field 2: Check-Out (3 cols) */}
        <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-gold/10 transition-colors cursor-pointer border sm:border-0 border-gold/20">
          <label className="text-[10px] text-charcoal-muted uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1 font-mono">
            <CalendarIcon className="w-3.5 h-3.5 text-gold" />
            <span>Check-Out ({nights} {nights === 1 ? 'nt' : 'nts'})</span>
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            max={maxDateStr}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-charcoal focus:outline-none cursor-pointer"
          />
        </div>

        {/* Field 3: Suite Selection (3 cols) */}
        <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-gold/10 transition-colors cursor-pointer border sm:border-0 border-gold/20">
          <label className="text-[10px] text-charcoal-muted uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1 font-mono">
            <BedIcon className="w-3.5 h-3.5 text-gold" />
            <span>Select Room</span>
          </label>
          <select
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-charcoal focus:outline-none cursor-pointer truncate"
          >
            {mockRooms.map((suite) => (
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
            className="group w-full py-3.5 px-6 rounded-2xl sm:rounded-full text-xs uppercase tracking-widest font-semibold bg-maroon hover:bg-maroon-dark text-ivory flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md"
          >
            <span>Check Availability</span>
            <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </form>

      {/* Trust & Live Estimation Pill under bar */}
      <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-between px-4 text-[11px] text-charcoal-muted gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5 text-gold" />
            <span>Best Direct Rate</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5 text-gold" />
            <span>Free Hot Breakfast</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5 text-gold" />
            <span>Free Cancellation 48h Prior</span>
          </span>
        </div>

        <div className="text-right">
          <span className="text-charcoal font-semibold font-mono">
            {nights} {nights === 1 ? 'Night' : 'Nights'} Est:
          </span>{' '}
          <span className="text-maroon font-bold font-serif text-sm">
            ₹{estimatedTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroBookingBar;
