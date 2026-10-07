import {
  CarIcon,
} from '@shared';

const FleetSelector = ({
  fleetList,
  selectedFleet,
  setSelectedFleet,
  fleetPricePreviews,
  passengerCount,
  currentFleet,
  onSelectFleet,
}) => {
  return (
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
  );
};

export default FleetSelector;
