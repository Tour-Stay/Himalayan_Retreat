import { useState, useEffect } from 'react';
import { BedIcon, SnowIcon, FlameIcon, WifiIcon, ArrowUpRightIcon, CheckCircleIcon } from './Icons';

const RoomModal = ({ room, isOpen, onClose, onBookNow }) => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !room) return null;

  const images = room.imageURLs?.length > 0 ? room.imageURLs : ['/placeholder-room.svg'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Frosted Glass Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-primary/70 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/40 my-auto animate-scale-up max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Photo Gallery */}
          <div className="relative h-[280px] sm:h-[380px] rounded-2xl overflow-hidden bg-gray-900 shadow-md">
            <img
              src={images[activeImage]}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="glass-surface-dark text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/20">
                {room.view || '180° Snow Peak View'}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImage === i ? 'border-secondary scale-105 shadow' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Suite Information */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-secondary text-xs uppercase tracking-[0.25em] font-bold block mb-1">
                The Kasar Himalayan Heights Residence
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-text-dark">
                {room.name}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-primary font-heading text-3xl font-bold">
                ₹{room.pricePerNight?.toLocaleString()}
              </span>
              <span className="text-xs text-text-light block">per night • complimentary breakfast</span>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-3 bg-cream p-4 rounded-2xl text-center text-xs sm:text-sm">
            <div>
              <span className="text-text-light block text-xs">Floor Area</span>
              <span className="font-semibold text-text-dark">{room.area || '42 m²'}</span>
            </div>
            <div className="border-x border-gray-200">
              <span className="text-text-light block text-xs">Bed Setup</span>
              <span className="font-semibold text-text-dark">{room.bedType || 'King Bed'}</span>
            </div>
            <div>
              <span className="text-text-light block text-xs">Capacity</span>
              <span className="font-semibold text-text-dark">{room.capacity?.adults || 2} Adults</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-light text-sm sm:text-base leading-relaxed font-light">
            {room.description}
          </p>

          {/* Amenities Grid */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-dark mb-3">
              Included Amenities & Winter Facilities
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(room.amenities || ['Room Heater', 'Geyser', 'Wi-Fi', 'Balcony']).map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-text-dark/80 bg-gray-50 p-2.5 rounded-xl">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-forest flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100">
            <button
              onClick={onClose}
              className="btn-outline-luxury w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onBookNow) onBookNow(room._id);
                const bookEl = document.getElementById('book');
                if (bookEl) bookEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group btn-gold w-full sm:w-auto px-8 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Reserve This Suite</span>
              <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
