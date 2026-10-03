import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BedIcon, SnowIcon, ArrowUpRightIcon, snowViewSuiteImg } from '@shared';

const RoomCard = ({ room, onBookNow }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const images = room.imageURLs && room.imageURLs.length > 0 ? room.imageURLs : [snowViewSuiteImg];

  return (
    <div className="bg-ivory rounded-3xl overflow-hidden border border-gold/25 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group card-luxury">
      <div>
        {/* Room Image Container with Interactive Image Switcher */}
        <div className="relative h-64 overflow-hidden bg-slate">
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
            <span className="bg-slate/80 backdrop-blur-md text-ivory text-[11px] font-medium px-3 py-1 rounded-full border border-gold/30 flex items-center gap-1.5 shadow-sm">
              <SnowIcon className="w-3.5 h-3.5 text-gold" />
              <span>{room.view || '180° Snow Peak View'}</span>
            </span>
            {room.badge && (
              <span className="bg-maroon text-ivory text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-gold/30">
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
                    currentImgIndex === i ? 'bg-gold w-3' : 'bg-white/50 w-1.5'
                  }`}
                  aria-label={`View photo ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Room Specs Tag (Area & Bed) */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-ivory text-xs">
            <span className="bg-slate/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/10">
              {room.area || '42 m²'}
            </span>
            <span className="bg-slate/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/10 flex items-center gap-1">
              <BedIcon className="w-3.5 h-3.5 text-gold" />
              <span>{room.bedType || 'King Bed'}</span>
            </span>
          </div>
        </div>

        {/* Room Info */}
        <div className="p-6">
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal group-hover:text-maroon transition-colors mb-2">
            {room.name}
          </h3>

          <p className="text-charcoal-muted text-sm leading-relaxed mb-5 line-clamp-2 font-light">
            {room.description}
          </p>

          {/* Amenities preview */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {(room.amenities || ['Room Heater', 'Geyser', 'Snow Balcony']).slice(0, 3).map((amenity, i) => (
              <span
                key={i}
                className="text-[11px] text-charcoal bg-ivory-warm px-2.5 py-1 rounded-lg border border-gold/20 font-medium"
              >
                ✦ {amenity}
              </span>
            ))}
            {room.amenities?.length > 3 && (
              <span className="text-[11px] text-charcoal-muted px-1.5 py-1 font-medium">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Price & CTAs */}
      <div className="px-6 pb-6 pt-4 border-t border-gold/15 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-charcoal-muted block leading-none mb-1 uppercase tracking-wider font-mono">
            From
          </span>
          <span className="text-maroon font-serif text-2xl font-semibold">
            ₹{room.pricePerNight?.toLocaleString()}
          </span>
          <span className="text-xs text-charcoal-muted ml-1">/ night</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/rooms/${room._id}`}
            className="px-3.5 py-2 rounded-full text-xs font-semibold border border-gold/40 text-charcoal hover:bg-gold/10 transition-colors"
          >
            Details
          </Link>
          <a
            href="#book"
            onClick={(e) => {
              if (onBookNow) {
                e.preventDefault();
                onBookNow(room._id);
              }
            }}
            className="bg-maroon hover:bg-maroon-dark text-ivory text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1 group/btn transition-colors shadow-sm"
          >
            <span>Book</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
