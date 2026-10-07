import {
  MapPinIcon,
} from '@shared';

const RouteSelector = ({
  pickupPoint,
  setPickupPoint,
  selectedDest,
  setSelectedDest,
  destinationsList,
  routeInfo,
}) => {
  return (
    <div>
      <label className="text-sm uppercase font-bold text-[#541508] tracking-wider flex items-center gap-2 mb-2.5 font-mono">
        <MapPinIcon className="w-4 h-4 text-[#EAA722]" />
        <span>2. Pickup &amp; Drop Locations</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="calc-pickup" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
            Pickup Point *
          </label>
          <select
            id="calc-pickup"
            value={pickupPoint}
            onChange={(e) => setPickupPoint(e.target.value)}
            className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-semibold focus:outline-none focus:ring-2 focus:ring-[#EAA722] cursor-pointer"
          >
            <option value="Kathgodam Railway Station">Kathgodam Railway Station</option>
            <option value="Pantnagar Airport">Pantnagar Airport</option>
            <option value="Delhi Airport / NCR">Delhi Airport / NCR</option>
            <option value="Almora / Kasar Devi Base">Almora / Kasar Devi Base</option>
          </select>
        </div>

        <div>
          <label htmlFor="calc-dest" className="block text-xs sm:text-sm font-bold text-[#5C5350] uppercase tracking-wider mb-1.5 font-mono">
            Destination / Tour *
          </label>
          <select
            id="calc-dest"
            value={selectedDest}
            onChange={(e) => setSelectedDest(e.target.value)}
            className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/30 text-sm sm:text-base text-[#2C2523] font-semibold focus:outline-none focus:ring-2 focus:ring-[#EAA722] cursor-pointer"
          >
            {destinationsList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Route Terrain Banner */}
      <div className="mt-3.5 p-4 rounded-2xl bg-[#FAF5EC] border border-[#EAA722]/25 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🛣️</span>
          <div>
            <span className="font-semibold text-[#541508] text-sm sm:text-base block">{routeInfo.via}</span>
            <span className="text-xs sm:text-sm text-[#5C5350] block font-numeral">
              Route: {routeInfo.highway} • Altitude: {routeInfo.elevation}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[#541508] font-bold font-numeral text-base sm:text-lg block">
            {routeInfo.km} km
          </span>
          <span className="text-xs sm:text-sm text-[#5C5350] block">~{routeInfo.duration}</span>
        </div>
      </div>
    </div>
  );
};

export default RouteSelector;
