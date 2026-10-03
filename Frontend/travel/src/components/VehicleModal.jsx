import React from 'react';
import { UsersIcon, LuggageIcon, CheckCircleIcon, ArrowUpRightIcon, SITE_CONFIG } from '@shared';

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
        className="bg-[#FDFBF7] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#C5A059]/40 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#2C2523] flex items-center justify-center transition-all shadow-md cursor-pointer border border-[#C5A059]/30"
        >
          &times;
        </button>

        {/* Vehicle Image Header */}
        <div className="relative h-64 sm:h-76 overflow-hidden rounded-t-3xl bg-[#1C1817]">
          <img
            src={activeImage || vehicle.image}
            alt={vehicle.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
          
          <div className="absolute top-4 left-4 bg-gradient-to-r from-[#9E3304] to-[#7C1D23] text-[#FDFBF7] text-xs font-semibold px-3.5 py-1 rounded-full border border-[#C5A059]/40 shadow-md">
            {vehicle.tag}
          </div>

          {/* Photo Gallery Selector Tabs (Exterior vs Interior) */}
          {vehicle.interiorImage && (
            <div className="absolute top-4 right-16 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20">
              <button
                type="button"
                onClick={() => setActiveImage(vehicle.image)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  activeImage === vehicle.image
                    ? 'bg-[#C84B0F] text-[#FDFBF7] shadow-xs'
                    : 'text-[#FAF6EF]/80 hover:text-white'
                }`}
              >
                Exterior
              </button>
              <button
                type="button"
                onClick={() => setActiveImage(vehicle.interiorImage)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  activeImage === vehicle.interiorImage
                    ? 'bg-[#C84B0F] text-[#FDFBF7] shadow-xs'
                    : 'text-[#FAF6EF]/80 hover:text-white'
                }`}
              >
                Luxury Interior
              </button>
            </div>
          )}

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[#FDFBF7]">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-tight">
                {vehicle.title}
              </h3>
              <p className="text-xs text-[#DFCA9B] font-semibold tracking-wider uppercase mt-0.5">
                {vehicle.model}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#FAF6EF]/80 uppercase block">Starting At</span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#FFD8B3]">
                ₹{vehicle.dailyRate?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#C5A059]/25 text-center">
              <UsersIcon className="w-4 h-4 text-[#C84B0F] mx-auto mb-1" />
              <span className="text-[11px] font-bold text-[#2C2523] block">{vehicle.seats} Passengers</span>
              <span className="text-[10px] text-[#6B615E]">Comfortable Seating</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#C5A059]/25 text-center">
              <LuggageIcon className="w-4 h-4 text-[#C84B0F] mx-auto mb-1" />
              <span className="text-[11px] font-bold text-[#2C2523] block">{vehicle.luggage.split(' ')[0]} Bags</span>
              <span className="text-[10px] text-[#6B615E]">Boot & Roof Carrier</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#C5A059]/25 text-center">
              <span className="text-base text-[#C84B0F] block">🏔️</span>
              <span className="text-[11px] font-bold text-[#2C2523] block">Pahadi Driver</span>
              <span className="text-[10px] text-[#6B615E]">10+ Yrs Hill Exp</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF6EF] border border-[#C5A059]/25 text-center">
              <span className="text-base text-[#C84B0F] block">❄️</span>
              <span className="text-[11px] font-bold text-[#2C2523] block">Heater & AC</span>
              <span className="text-[10px] text-[#6B615E]">All-Weather Ready</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#2C2523] mb-2">About This Cab</h4>
            <p className="text-sm text-[#5C5350] leading-relaxed">
              {vehicle.description || vehicle.idealFor}
            </p>
          </div>

          {/* Features Checklist */}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#2C2523] mb-3">Vehicle Features & Inclusions</h4>
            <div className="space-y-2.5">
              {vehicle.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2C2523]">
                  <CheckCircleIcon className="w-4 h-4 text-[#C84B0F] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Transfers Reference Card */}
          <div className="p-4 rounded-2xl bg-[#FAF6EF] border border-[#C5A059]/30 text-xs text-[#2C2523] space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#6B615E]">Kathgodam to Kasar Devi / Almora:</span>
              <strong className="text-[#C84B0F] font-numeral text-sm font-bold">{vehicle.rateKathgodam}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6B615E]">Delhi Airport / NCR to Kasar Devi:</span>
              <strong className="text-[#2C2523] font-numeral text-sm font-bold">{vehicle.rateDelhi}</strong>
            </div>
            <p className="text-[11px] text-[#6B615E] pt-1.5 border-t border-[#C5A059]/20">
              Rates include fuel, driver allowance, tolls, and parking taxes.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                if (onSelectForBooking) onSelectForBooking(vehicle.id);
                const calcEl = document.getElementById('calculator');
                if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-1 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] hover:from-[#E05A1B] hover:to-[#9E3304] text-[#FDFBF7] shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#C5A059]/30"
            >
              <span>Select & Calculate Fare</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleWhatsAppInquiry}
              className="flex-1 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold border border-[#C84B0F]/40 bg-[#FAF6EF] text-[#2C2523] hover:text-[#C84B0F] hover:bg-[#FFF5EC] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
