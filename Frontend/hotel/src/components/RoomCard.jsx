import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BedIcon, SnowIcon, ArrowUpRightIcon, snowViewSuiteImg } from '@shared';

const RoomCard = ({ room, onBookNow }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const images = room.imageURLs && room.imageURLs.length > 0 ? room.imageURLs : [snowViewSuiteImg];

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#073125]/10 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group card-luxury">
      <div>
        {/* Room Image Container with Interactive Image Switcher */}
        <div className="relative h-64 overflow-hidden bg-slate-900">
          <img
            src={images[currentImgIndex]}
            alt={room.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = snowViewSuiteImg;
            }}
          />
          {/* Subtle Gradient Shade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20"></div>

          {/* Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
            <span className="bg-black/65 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-sm">
              <SnowIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
              <span>{room.view || '180° Snow Peak View'}</span>
            </span>
            {room.badge && (
              <span className="bg-[#C9F24D] text-[#073125] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                {room.badge}
              </span>
            )}
          </div>

          {/* Image Dots (if multi image) */}
          {images.length > 1 && (
            <div className="absolute top-3.5 right-3.5 flex gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImgIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentImgIndex === i ? 'bg-[#C9F24D] w-3' : 'bg-white/50 w-1.5'
                  }`}
                  aria-label={`View photo ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Room Specs Tag (Area & Bed) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/15">
              {room.area || '42 m²'}
            </span>
            <span className="bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/15 flex items-center gap-1">
              <BedIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
              <span>{room.bedType || 'King Bed'}</span>
            </span>
          </div>
        </div>

        {/* Room Info */}
        <div className="p-6">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#073125] group-hover:text-[#12433B] transition-colors mb-2">
            {room.name}
          </h3>

          <p className="text-[#4B6358] text-sm leading-relaxed mb-5 line-clamp-2 font-light">
            {room.description}
          </p>

          {/* Amenities preview */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {(room.amenities || ['Room Heater', 'Geyser', 'Snow Balcony']).slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="text-[11px] text-[#073125] bg-[#F1F5F0] px-2.5 py-1 rounded-lg border border-[#073125]/10 font-medium"
              >
                ✦ {amenity}
              </span>
            ))}
            {room.amenities?.length > 3 && (
              <span className="text-[11px] text-[#4B6358] px-1.5 py-1 font-medium">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Price & CTAs */}
      <div className="px-6 pb-6 pt-4 border-t border-[#073125]/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#4B6358] block leading-none mb-1 uppercase tracking-wider font-mono">
            From
          </span>
          <span className="text-[#073125] font-serif text-2xl font-semibold">
            ₹{room.pricePerNight?.toLocaleString()}
          </span>
          <span className="text-xs text-[#4B6358] ml-1">/ night</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/rooms/${room._id}`}
            className="px-3.5 py-2 rounded-full text-xs font-semibold border border-[#073125]/25 text-[#073125] hover:bg-[#EBF2EA] transition-colors"
          >
            Details
          </Link>
          <Link
            to={`/book?room=${room._id}`}
            className="bg-[#073125] hover:bg-[#12433B] text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1 group/btn transition-colors shadow-sm"
          >
            <span>Book</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};


export default RoomCard;
