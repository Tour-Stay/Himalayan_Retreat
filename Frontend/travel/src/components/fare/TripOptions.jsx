const TripOptions = ({
  tripType,
  setTripType,
  days,
  setDays,
  passengerCount,
  setPassengerCount,
  currentFleet,
}) => {
  return (
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
  );
};

export default TripOptions;
