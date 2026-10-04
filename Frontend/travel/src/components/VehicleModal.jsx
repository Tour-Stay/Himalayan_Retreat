import React from 'react';
import { UsersIcon, LuggageIcon, CheckCircleIcon, ArrowUpRightIcon, SITE_CONFIG, sedanImg, innovaImg, minibusImg } from '@shared';

const VehicleModal = ({ vehicle, isOpen, onClose, onSelectForBooking }) => {
  const [activeImage, setActiveImage] = React.useState(vehicle?.image);

  React.useEffect(() => {
    if (vehicle?.image) {
      setActiveImage(vehicle.image);
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `*॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥*\n` +
      `*Private Cab Inquiry*\n` +
      `----------------------------------------\n` +
      `*Vehicle:* ${vehicle.title} (${vehicle.model})\n` +
      `*Capacity:* ${vehicle.seats} Passengers | ${vehicle.luggage}\n` +
      `*Base Rate:* ₹${vehicle.dailyRate?.toLocaleString()} / day (₹${vehicle.perKmRate}/km)\n` +
      `*Kathgodam Transfer:* ${vehicle.rateKathgodam || '₹2,499'}\n` +
      `Please share availability and confirm my dates.`
    );
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-[#FAF5EC] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#EAA722]/40 shadow-2xl relative font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[#541508] flex items-center justify-center transition-all shadow-md cursor-pointer border border-[#EAA722]/30 text-lg font-bold"
        >
          &times;
        </button>

        {/* Vehicle Image Header */}
        <div className="relative h-64 sm:h-76 overflow-hidden rounded-t-3xl bg-[#1C1817]">
          <img
            src={activeImage || vehicle.image}
            alt={vehicle.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              if (vehicle.id === '4-seater') e.currentTarget.src = sedanImg;
              else if (vehicle.id === '12-seater') e.currentTarget.src = minibusImg;
              else e.currentTarget.src = innovaImg;
            }}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
          
          <div className="absolute top-4 left-4 bg-[#EAA722] text-[#541508] text-xs font-mono font-bold px-3.5 py-1 rounded-full shadow-md">
            {vehicle.tag} • ॥ पवित्र यात्रा ॥
          </div>

          {/* Photo Gallery Selector Tabs (Exterior vs Interior) */}
          {vehicle.interiorImage && (
            <div className="absolute top-4 right-16 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20">
              <button
                type="button"
                onClick={() => setActiveImage(vehicle.image)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  activeImage === vehicle.image
                    ? 'bg-[#EAA722] text-[#541508] font-bold shadow-xs'
                    : 'text-[#FAF5EC]/80 hover:text-white'
                }`}
              >
                Exterior
              </button>
              <button
                type="button"
                onClick={() => setActiveImage(vehicle.interiorImage)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  activeImage === vehicle.interiorImage
                    ? 'bg-[#EAA722] text-[#541508] font-bold shadow-xs'
                    : 'text-[#FAF5EC]/80 hover:text-white'
                }`}
              >
                Luxury Interior
              </button>
            </div>
          )}

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-tight">
                {vehicle.title}
              </h3>
              <p className="text-xs text-[#EAA722] font-semibold tracking-wider uppercase mt-0.5 font-mono">
                {vehicle.model}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#FAF5EC]/70 uppercase tracking-wider block font-mono">Starting At</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#EAA722] font-numeral">
                ₹{vehicle.dailyRate?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-white border border-[#EAA722]/25 text-center shadow-xs">
              <UsersIcon className="w-4 h-4 text-[#EAA722] mx-auto mb-1" />
              <span className="text-[12px] font-bold text-[#541508] block">{vehicle.seats} Passengers</span>
              <span className="text-[10px] text-[#5C5350]">Comfort Seating</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#EAA722]/25 text-center shadow-xs">
              <LuggageIcon className="w-4 h-4 text-[#EAA722] mx-auto mb-1" />
              <span className="text-[12px] font-bold text-[#541508] block">{vehicle.luggage.split(' ')[0]} Bags</span>
              <span className="text-[10px] text-[#5C5350]">Boot &amp; Roof Rack</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#EAA722]/25 text-center shadow-xs">
              <span className="text-base text-[#EAA722] block">🏔️</span>
              <span className="text-[12px] font-bold text-[#541508] block">Pahadi Driver</span>
              <span className="text-[10px] text-[#5C5350]">10+ Yrs Hill Exp</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#EAA722]/25 text-center shadow-xs">
              <span className="text-base text-[#EAA722] block">❄️</span>
              <span className="text-[12px] font-bold text-[#541508] block">Heater &amp; AC</span>
              <span className="text-[10px] text-[#5C5350]">All-Weather Ready</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#541508] mb-1.5">About This Cab</h4>
            <p className="text-sm sm:text-[15px] text-[#5C5350] leading-relaxed">
              {vehicle.description || vehicle.idealFor}
            </p>
          </div>

          {/* Features Checklist */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#541508] mb-3">Vehicle Features &amp; Inclusions</h4>
            <div className="space-y-2">
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-[#2C2523]">
                  <CheckCircleIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Transfers Reference Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#EAA722]/30 text-xs sm:text-sm text-[#2C2523] space-y-1.5 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#5C5350]">Kathgodam to Kasar Devi / Almora:</span>
              <strong className="text-[#541508] font-numeral text-sm font-bold">{vehicle.rateKathgodam}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5C5350]">Delhi Airport / NCR to Kasar Devi:</span>
              <strong className="text-[#541508] font-numeral text-sm font-bold">{vehicle.rateDelhi}</strong>
            </div>
            <p className="text-[11px] text-[#5C5350] pt-1.5 border-t border-[#EAA722]/20 font-light">
              Rates include fuel, driver allowance, tolls, and parking taxes.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                if (onSelectForBooking) onSelectForBooking(vehicle.id);
              }}
              className="flex-1 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[#EAA722] hover:bg-[#D98E16] text-[#541508] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102"
            >
              <span>Select &amp; Calculate Fare</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5 text-[#541508]" />
            </button>

            <button
              onClick={handleWhatsAppInquiry}
              className="flex-1 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold border border-[#073125]/30 bg-white text-[#073125] hover:bg-[#EBF2EA] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Inquire on WhatsApp ↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;
