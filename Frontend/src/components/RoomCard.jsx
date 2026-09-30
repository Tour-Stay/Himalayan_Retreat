import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BedIcon, SnowIcon, ArrowUpRightIcon } from './Icons';

const RoomCard = ({ room, onBookNow }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const images = room.imageURLs && room.imageURLs.length > 0 ? room.imageURLs : ['/placeholder-room.svg'];

  return (
    <div className="card-hover bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group">
        <div>
          {/* Room Image Container with Interactive Image Switcher */}
          <div className="relative h-64 overflow-hidden bg-gray-900">
            <img
              src={images[currentImgIndex]}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-room.svg';
              }}
            />
            {/* Subtle Gradient Shade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20"></div>

            {/* Badges */}
            <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
              <span className="glass-pill-dark text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-sm">
                <SnowIcon className="w-3 h-3 text-secondary" />
                <span>{room.view || '180° Snow Peak View'}</span>
              </span>
              {room.badge && (
                <span className="bg-secondary text-primary text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                  {room.badge}
                </span>
              )}
            </div>

            {/* Image Dots (if multi image) */}
            {images.length > 1 && (
              <div className="absolute top-3.5 right-3.5 flex gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImgIndex(i);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      currentImgIndex === i ? 'bg-secondary w-3' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Room Specs Tag (Area & Bed) */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="glass-pill-dark px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/10">
                📐 {room.area || '42 m²'}
              </span>
              <span className="glass-pill-dark px-2.5 py-1 rounded-lg text-[11px] font-medium border border-white/10 flex items-center gap-1">
                <BedIcon className="w-3 h-3 text-secondary" />
                <span>{room.bedType || 'King Bed'}</span>
              </span>
            </div>
          </div>

          {/* Room Info */}
          <div className="p-6">
            <h3 className="font-heading text-xl font-semibold text-text-dark group-hover:text-primary transition-colors mb-2">
              {room.name}
            </h3>

            <p className="text-text-light text-sm leading-relaxed mb-5 line-clamp-2 font-light">
              {room.description}
            </p>

            {/* Amenities preview with gold checkmarks */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {(room.amenities || ['Room Heater', 'Geyser', 'Snow Balcony']).slice(0, 3).map((amenity, i) => (
                <span
                  key={i}
                  className="text-[11px] text-text-dark/80 bg-cream px-2.5 py-1 rounded-lg border border-gray-200/60 font-medium"
                >
                  ✓ {amenity}
                </span>
              ))}
              {room.amenities?.length > 3 && (
                <span className="text-[11px] text-text-light px-1.5 py-1 font-medium">
                  +{room.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer: Price & CTAs */}
        <div className="px-6 pb-6 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-text-light block leading-none mb-1 uppercase tracking-wider">
              From
            </span>
            <span className="text-primary font-heading text-2xl font-bold">
              ₹{room.pricePerNight?.toLocaleString()}
            </span>
            <span className="text-xs text-text-light ml-1">/ night</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/rooms/${room._id}`}
              className="btn-outline-luxury px-3.5 py-2 rounded-full text-xs font-semibold"
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
              className="btn-primary-luxury text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1 group/btn"
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
