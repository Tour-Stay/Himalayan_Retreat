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
        className="bg-[#F8FAF7] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#D5E0D8] shadow-2xl relative font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-[#073125] flex items-center justify-center transition-all shadow-md cursor-pointer border border-[#D5E0D8] text-lg font-bold"
        >
          &times;
        </button>

        {/* Vehicle Image Header */}
        <div className="relative h-64 sm:h-76 overflow-hidden rounded-t-3xl bg-[#073125]">
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

          <div className="absolute top-4 left-4 bg-[#C9F24D] text-[#073125] text-xs font-sans font-bold px-3.5 py-1 rounded-full shadow-md">
            {vehicle.tag}
          </div>

          {/* Photo Gallery Selector Tabs (Exterior vs Interior) */}
          {vehicle.interiorImage && (
            <div className="absolute top-4 right-16 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20">
              <button
                type="button"
                onClick={() => setActiveImage(vehicle.image)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${activeImage === vehicle.image
                  ? 'bg-[#C9F24D] text-[#073125] font-bold shadow-xs'
                  : 'text-white/80 hover:text-white'
                  }`}
              >
                Exterior
              </button>
              <button
                type="button"
                onClick={() => setActiveImage(vehicle.interiorImage)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${activeImage === vehicle.interiorImage
                  ? 'bg-[#C9F24D] text-[#073125] font-bold shadow-xs'
                  : 'text-white/80 hover:text-white'
                  }`}
              >
                Luxury Interior
              </button>
            </div>
          )}

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-tight text-white">
                {vehicle.title}
              </h3>
              <p className="text-xs text-[#C9F24D] font-semibold tracking-wider uppercase mt-0.5 font-sans">
                {vehicle.model}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/70 uppercase tracking-wider block font-sans">Starting At</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#C9F24D] font-numeral">
                ₹{vehicle.dailyRate?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-white border border-[#D5E0D8] text-center shadow-xs">
              <UsersIcon className="w-4 h-4 text-[#073125] mx-auto mb-1" />
              <span className="text-[12px] font-bold text-[#073125] block">{vehicle.seats} Passengers</span>
              <span className="text-[10px] text-[#4A635A]">Comfort Seating</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#D5E0D8] text-center shadow-xs">
              <LuggageIcon className="w-4 h-4 text-[#073125] mx-auto mb-1" />
              <span className="text-[12px] font-bold text-[#073125] block">{vehicle.luggage.split(' ')[0]} Bags</span>
              <span className="text-[10px] text-[#4A635A]">Boot &amp; Roof Rack</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#D5E0D8] text-center shadow-xs">
              <span className="text-base text-[#073125] block">🏔️</span>
              <span className="text-[12px] font-bold text-[#073125] block">Pahadi Driver</span>
              <span className="text-[10px] text-[#4A635A]">10+ Yrs Hill Exp</span>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-[#D5E0D8] text-center shadow-xs">
              <span className="text-base text-[#073125] block">❄️</span>
              <span className="text-[12px] font-bold text-[#073125] block">Heater &amp; AC</span>
              <span className="text-[10px] text-[#4A635A]">All-Weather Ready</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#073125] mb-1.5">About This Cab</h4>
            <p className="text-sm sm:text-[15px] text-[#4A635A] leading-relaxed">
              {vehicle.description || vehicle.idealFor}
            </p>
          </div>

          {/* Features Checklist */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#073125] mb-3">Vehicle Features &amp; Inclusions</h4>
            <div className="space-y-2">
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-[#073125]">
                  <CheckCircleIcon className="w-4 h-4 text-[#073125] flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Transfers Reference Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#D5E0D8] text-xs sm:text-sm text-[#073125] space-y-1.5 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[#4A635A]">Kathgodam to Kasar Devi / Almora:</span>
              <strong className="text-[#073125] font-numeral text-sm font-bold">{vehicle.rateKathgodam}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#4A635A]">Delhi Airport / NCR to Kasar Devi:</span>
              <strong className="text-[#073125] font-numeral text-sm font-bold">{vehicle.rateDelhi}</strong>
            </div>
            <p className="text-[11px] text-[#4A635A] pt-1.5 border-t border-[#D5E0D8] font-light">
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
              className="flex-1 py-3.5 rounded-full text-xs font-sans uppercase tracking-wider font-bold bg-[#C9F24D] hover:bg-[#bde63d] text-[#073125] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102"
            >
              <span>Select &amp; Calculate Fare</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5 text-[#073125]" />
            </button>

            <button
              onClick={handleWhatsAppInquiry}
              className="flex-1 py-3.5 rounded-full text-xs font-sans uppercase tracking-wider font-bold border border-[#073125]/30 bg-white text-[#073125] hover:bg-[#EDF2EC] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
