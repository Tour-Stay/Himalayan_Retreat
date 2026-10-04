import React, { useState } from 'react';
import { MapPinIcon, CalendarIcon, UsersIcon, CarIcon, ArrowUpRightIcon, useSiteSettings } from '@shared';
import { mergeDestinationsWithSettings, mergeFleetWithSettings } from '../data/travelData';

const HeroCabBar = ({ onSearch }) => {
  const { settings } = useSiteSettings();

  const [pickup, setPickup] = useState('Kathgodam Railway Station');
  const [destination, setDestination] = useState('kainchi-dham');
  const [date, setDate] = useState(() => {
    const d = new Date(Date.now() + 86400000);
    return d.toISOString().split('T')[0];
  });
  const [vehicle, setVehicle] = useState('6-seater');

  const destinationsList = React.useMemo(() => {
    return mergeDestinationsWithSettings(settings?.destinations);
  }, [settings?.destinations]);

  const fleetList = React.useMemo(() => {
    return mergeFleetWithSettings(settings?.cabFleet);
  }, [settings?.cabFleet]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ pickup, destination, date, vehicle });
    }
    const calcEl = document.getElementById('calculator');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 -mt-12 sm:-mt-16 relative z-30">
      <form
        onSubmit={handleSearchSubmit}
        className="bg-[#FDFBF7] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-[#C5A059]/40 shadow-2xl backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center"
      >
        {/* Field 1: Pickup Location */}
        <div className="lg:col-span-3 p-3 bg-[#FAF6EF] rounded-xl border border-[#C5A059]/25 flex items-center gap-3">
          <MapPinIcon className="w-4 h-4 text-[#C84B0F] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-pickup" className="block text-[10px] font-sans uppercase font-bold text-[#6B615E] tracking-wider">
              Pickup Point
            </label>
            <select
              id="hero-pickup"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#2C2523] focus:outline-none cursor-pointer truncate"
            >
              <option value="Kathgodam Railway Station">Kathgodam Railway Station</option>
              <option value="Pantnagar Airport">Pantnagar Airport</option>
              <option value="Delhi Airport / NCR">Delhi Airport / NCR</option>
              <option value="Almora / Kasar Devi Base">Almora / Kasar Devi Base</option>
            </select>
          </div>
        </div>

        {/* Field 2: Destination */}
        <div className="lg:col-span-3 p-3 bg-[#FAF6EF] rounded-xl border border-[#C5A059]/25 flex items-center gap-3">
          <CarIcon className="w-4 h-4 text-[#C84B0F] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-dest" className="block text-[10px] font-sans uppercase font-bold text-[#6B615E] tracking-wider">
              Destination / Tour
            </label>
            <select
              id="hero-dest"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#2C2523] focus:outline-none cursor-pointer truncate"
            >
              {destinationsList ? (
                destinationsList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.kmFromAlmora ? `(${d.kmFromAlmora} km)` : ''}
                  </option>
                ))
              ) : (
                <>
                  <option value="kainchi-dham">Kainchi Dham Ashram (45 km)</option>
                  <option value="jageshwar-dham">Jageshwar Dham 124 Temples (35 km)</option>
                  <option value="kasar-devi">Kasar Devi Ridge (8 km)</option>
                  <option value="nainital">Nainital Lake & Temples (63 km)</option>
                  <option value="kausani">Kausani 300km Peak View (52 km)</option>
                  <option value="kathgodam-station">Kathgodam Station Drop (85 km)</option>
                  <option value="chardham-yatra">Sacred Chardham Yatra Circuit</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Field 3: Date */}
        <div className="lg:col-span-2 p-3 bg-[#FAF6EF] rounded-xl border border-[#C5A059]/25 flex items-center gap-3">
          <CalendarIcon className="w-4 h-4 text-[#C84B0F] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-date" className="block text-[10px] font-sans uppercase font-bold text-[#6B615E] tracking-wider">
              Travel Date
            </label>
            <input
              id="hero-date"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#2C2523] focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Field 4: Vehicle Type */}
        <div className="lg:col-span-2 p-3 bg-[#FAF6EF] rounded-xl border border-[#C5A059]/25 flex items-center gap-3">
          <UsersIcon className="w-4 h-4 text-[#C84B0F] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <label htmlFor="hero-vehicle" className="block text-[10px] font-sans uppercase font-bold text-[#6B615E] tracking-wider">
              Cab Size
            </label>
            <select
              id="hero-vehicle"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#2C2523] focus:outline-none cursor-pointer truncate"
            >
              {fleetList ? (
                fleetList.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.seats}-Seater ({f.model || f.title})
                  </option>
                ))
              ) : (
                <>
                  <option value="4-seater">4-Seater Sedan (Dzire)</option>
                  <option value="6-seater">6-Seater SUV (Innova)</option>
                  <option value="12-seater">12-Seater Minibus</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] hover:from-[#E05A1B] hover:to-[#9E3304] text-[#FDFBF7] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border border-[#C5A059]/40"
          >
            <span>Check Fare</span>
            <ArrowUpRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroCabBar;
