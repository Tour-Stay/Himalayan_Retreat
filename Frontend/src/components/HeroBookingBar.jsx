import { useState } from 'react';
import { CalendarIcon, UsersIcon, BedIcon, ArrowUpRightIcon, CheckCircleIcon } from './Icons';
import { mockRooms } from '../data/mockRooms';

const HeroBookingBar = ({ onSearch, onBookSuite }) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 2);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [selectedSuite, setSelectedSuite] = useState(mockRooms[0]._id);
  const [guestCount, setGuestCount] = useState('2');
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  // Calculate nights
  let nights = 1;
  if (checkIn && checkOut) {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const currentSuite = mockRooms.find(r => r._id === selectedSuite) || mockRooms[0];
  const estimatedTotal = nights * (currentSuite.pricePerNight || 7500);

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        checkIn,
        checkOut,
        suiteId: selectedSuite,
        guests: guestCount,
        nights,
        estimatedTotal,
      });
    }
    // Smooth scroll to booking section
    const bookEl = document.getElementById('book');
    if (bookEl) {
      bookEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto -mt-6 sm:-mt-10 relative z-30 px-3 sm:px-4">
      {/* Horizontal Floating Glassmorphic Booking Bar */}
      <form
        onSubmit={handleCheckAvailability}
        className="glass-surface p-3 sm:p-4 rounded-3xl sm:rounded-full border border-white/60 shadow-2xl shadow-primary/20 backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center"
      >
        {/* Field 1: Check-In (3 cols) */}
        <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer border sm:border-0 border-gray-100">
          <label className="text-[10px] text-text-light uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1">
            <CalendarIcon className="w-3.5 h-3.5 text-secondary" />
            <span>Check-In</span>
          </label>
          <input
            type="date"
            value={checkIn}
            min={today}
            max={maxDateStr}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-text-dark focus:outline-none cursor-pointer"
          />
        </div>

        {/* Field 2: Check-Out (3 cols) */}
        <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer border sm:border-0 border-gray-100">
          <label className="text-[10px] text-text-light uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1">
            <CalendarIcon className="w-3.5 h-3.5 text-secondary" />
            <span>Check-Out ({nights} {nights === 1 ? 'nt' : 'nts'})</span>
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            max={maxDateStr}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-text-dark focus:outline-none cursor-pointer"
          />
        </div>

        {/* Field 3: Suite Selection (3 cols) */}
        <div className="lg:col-span-3 px-4 py-2 rounded-2xl hover:bg-black/5 transition-colors cursor-pointer border sm:border-0 border-gray-100">
          <label className="text-[10px] text-text-light uppercase tracking-widest font-semibold flex items-center gap-1.5 mb-1">
            <BedIcon className="w-3.5 h-3.5 text-secondary" />
            <span>Suite Category</span>
          </label>
          <select
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-text-dark focus:outline-none cursor-pointer truncate"
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
            className="group btn-gold w-full py-3.5 px-6 rounded-2xl sm:rounded-full text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Check Rates</span>
            <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </form>

      {/* Tiny Trust & Live Estimation Pill under bar */}
      <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-between px-4 text-[11px] text-text-light gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5 text-forest" />
            <span>Best Rate Direct Guarantee</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5 text-forest" />
            <span>Free Kumaoni Breakfast</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1">
            <CheckCircleIcon className="w-3.5 h-3.5 text-forest" />
            <span>100% Free Cancellation 48h</span>
          </span>
        </div>

        <div className="text-right">
          <span className="text-text-dark font-semibold">
            {nights} {nights === 1 ? 'Night' : 'Nights'} Est:
          </span>{' '}
          <span className="text-forest font-bold font-mono">
            ₹{estimatedTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroBookingBar;
