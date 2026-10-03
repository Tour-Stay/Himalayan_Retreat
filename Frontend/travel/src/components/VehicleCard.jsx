import React from 'react';
import { UsersIcon, LuggageIcon, CheckCircleIcon, ArrowUpRightIcon } from '@shared';

const VehicleCard = ({ vehicle, onQuickView, onBook }) => {
  return (
    <div className="card-luxury bg-[#FDFBF7] rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-xs flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Vehicle Image */}
        <div className="relative h-60 overflow-hidden bg-[#1C1817]">
          <img
            src={vehicle.image}
            alt={vehicle.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-104"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1817]/75 via-transparent to-transparent"></div>
          
          <span className="absolute top-4 left-4 bg-gradient-to-r from-[#9E3304] to-[#7C1D23] text-[#FDFBF7] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#C5A059]/30 shadow-md">
            {vehicle.tag}
          </span>

          {vehicle.interiorImage && (
            <span className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-[#FAF6EF] text-[10px] font-medium px-2.5 py-1 rounded-full border border-white/25 flex items-center gap-1 shadow-sm">
              <span>📷</span>
              <span>Interior Photos</span>
            </span>
          )}

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[#FDFBF7] text-xs">
            <span className="bg-[#1C1817]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5 font-numeral">
              <UsersIcon className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{vehicle.seats} Passengers</span>
            </span>
            <span className="bg-[#1C1817]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5 font-numeral">
              <LuggageIcon className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{vehicle.luggage.split(' ')[0]} Bags</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          <h3 className="font-serif text-2xl font-medium text-[#2C2523] mb-1">
            {vehicle.title}
          </h3>
          <p className="text-xs uppercase tracking-wider text-[#C84B0F] font-semibold mb-3">
            {vehicle.model}
          </p>
          <p className="text-sm text-[#5C5350] leading-relaxed mb-5">
            {vehicle.idealFor}
          </p>

          <div className="space-y-2 mb-6 pt-4 border-t border-[#C5A059]/20">
            {vehicle.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#2C2523]">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#C84B0F] flex-shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-6 sm:p-7 pt-0 border-t border-[#C5A059]/15 mt-auto">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-[10px] text-[#6B615E] uppercase tracking-wider block font-sans">
              Starting At
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#7C1D23]">
              ₹{vehicle.dailyRate?.toLocaleString()}
            </span>
            <span className="text-xs text-[#6B615E] ml-1">/ day</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-numeral font-bold text-[#C84B0F] bg-[#C84B0F]/10 px-3 py-1 rounded-full border border-[#C84B0F]/25">
              ₹{vehicle.perKmRate}/km
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onQuickView(vehicle)}
            className="py-3 rounded-xl text-xs uppercase tracking-wider font-semibold border border-[#C5A059]/40 bg-[#FAF6EF] text-[#2C2523] hover:text-[#C84B0F] hover:border-[#C84B0F] transition-all cursor-pointer text-center"
          >
            Quick View
          </button>

          <button
            type="button"
            onClick={() => onBook(vehicle.id)}
            className="py-3 rounded-xl text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-[#C84B0F] to-[#7C1D23] hover:from-[#E05A1B] hover:to-[#9E3304] text-[#FDFBF7] flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer border border-[#C5A059]/30"
          >
            <span>Book Cab</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
