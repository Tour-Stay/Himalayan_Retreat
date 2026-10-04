import React from 'react';
import { UsersIcon, LuggageIcon, CheckCircleIcon, ArrowUpRightIcon, sedanImg, innovaImg, minibusImg } from '@shared';

const VehicleCard = ({ vehicle, onQuickView, onBook }) => {
  return (
    <div className="bg-[#3D0F06] rounded-3xl overflow-hidden border border-[#EAA722]/30 hover:border-[#EAA722]/70 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between text-white group">
      <div>
        {/* Vehicle Image */}
        <div className="relative h-60 overflow-hidden bg-slate-900">
          <img
            src={vehicle.image}
            alt={vehicle.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              if (vehicle.id === '4-seater') e.currentTarget.src = sedanImg;
              else if (vehicle.id === '12-seater') e.currentTarget.src = minibusImg;
              else e.currentTarget.src = innovaImg;
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>
          
          <span className="absolute top-4 left-4 bg-[#EAA722] text-[#541508] text-[11px] font-mono font-bold px-3 py-1 rounded-full shadow-md">
            {vehicle.tag} • ॥ पवित्र यात्रा ॥
          </span>

          {vehicle.interiorImage && (
            <span className="absolute top-4 right-4 bg-black/65 backdrop-blur-md text-[#FAF5EC] text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-sm">
              <span>📷</span>
              <span>Interior Photos</span>
            </span>
          )}

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
            <span className="bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 flex items-center gap-1.5 font-numeral">
              <UsersIcon className="w-3.5 h-3.5 text-[#EAA722]" />
              <span>{vehicle.seats} Passengers</span>
            </span>
            <span className="bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 flex items-center gap-1.5 font-numeral">
              <LuggageIcon className="w-3.5 h-3.5 text-[#EAA722]" />
              <span>{vehicle.luggage.split(' ')[0]} Bags</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7">
          <h3 className="font-serif text-2xl font-medium text-white mb-1">
            {vehicle.title}
          </h3>
          <p className="text-xs sm:text-[13px] uppercase tracking-wider text-[#EAA722] font-bold mb-3 font-mono">
            {vehicle.model}
          </p>
          <p className="text-[15px] sm:text-base text-[#FAF5EC] leading-relaxed mb-4 font-normal">
            {vehicle.idealFor}
          </p>

          <div className="space-y-2.5 mb-6 pt-4 border-t border-white/10">
            {vehicle.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm sm:text-[15px] text-[#FAF5EC] font-normal">
                <CheckCircleIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-6 sm:p-7 pt-0 border-t border-white/10 mt-auto">
        <div className="flex items-baseline justify-between mb-4 pt-4">
          <div>
            <span className="text-[10px] text-[#FAF5EC]/65 uppercase tracking-wider block font-mono">
              Starting At
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-white font-numeral">
              ₹{vehicle.dailyRate?.toLocaleString()}
            </span>
            <span className="text-xs text-[#FAF5EC]/65 ml-1">/ day</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-numeral font-bold text-[#541508] bg-[#EAA722] px-3 py-1 rounded-full shadow-xs">
              ₹{vehicle.perKmRate}/km
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onQuickView(vehicle)}
            className="py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold border border-[#EAA722]/30 bg-white/5 hover:bg-white/15 text-[#FAF5EC] transition-all cursor-pointer text-center"
          >
            Quick View
          </button>

          <button
            type="button"
            onClick={() => onBook(vehicle.id)}
            className="py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold bg-[#EAA722] hover:bg-[#D98E16] text-[#541508] flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer hover:scale-102"
          >
            <span>Book Cab</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5 text-[#541508]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
