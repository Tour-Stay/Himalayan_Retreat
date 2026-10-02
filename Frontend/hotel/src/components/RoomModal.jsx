import { useState, useEffect } from 'react';
import { BedIcon, SnowIcon, ArrowUpRightIcon, CheckCircleIcon } from '@shared';

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

  const images = room.imageURLs?.length > 0 ? room.imageURLs : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate/75 backdrop-blur-xl transition-opacity"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl bg-ivory rounded-3xl overflow-hidden shadow-2xl z-10 border border-gold/40 my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate/60 hover:bg-slate text-ivory flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Photo */}
          <div className="relative h-[280px] sm:h-[380px] rounded-2xl overflow-hidden bg-slate shadow-md">
            <img
              src={images[activeImage]}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-slate/85 backdrop-blur-md text-ivory text-xs font-semibold px-3.5 py-1.5 rounded-full border border-gold/30 flex items-center gap-1.5">
                <SnowIcon className="w-3.5 h-3.5 text-gold" />
                <span>{room.view || '180° Snow Peak View'}</span>
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
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${activeImage === i ? 'border-maroon scale-105 shadow' : 'border-transparent opacity-60'
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Suite Information */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold/20">
            <div>
              <span className="text-maroon text-xs uppercase tracking-[0.25em] font-bold block mb-1 font-mono">
                The Kasar Himalayan Heights • 6,942 FT
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal">
                {room.name}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-maroon font-serif text-3xl font-semibold">
                ₹{room.pricePerNight?.toLocaleString()}
              </span>
              <span className="text-xs text-charcoal-muted block">per night • complimentary mountain breakfast</span>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-3 bg-ivory-warm p-4 rounded-2xl text-center text-xs sm:text-sm border border-gold/20">
            <div>
              <span className="text-charcoal-muted block text-xs font-mono">Floor Area</span>
              <span className="font-semibold text-charcoal">{room.area || '42 m²'}</span>
            </div>
            <div className="border-x border-gold/20">
              <span className="text-charcoal-muted block text-xs font-mono">Bed Setup</span>
              <span className="font-semibold text-charcoal">{room.bedType || 'King Bed'}</span>
            </div>
            <div>
              <span className="text-charcoal-muted block text-xs font-mono">Capacity</span>
              <span className="font-semibold text-charcoal">{room.capacity?.adults || 2} Adults</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed font-light">
            {room.description}
          </p>

          {/* Amenities Grid */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-3 font-mono">
              Included Amenities & Alpine Heating
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(room.amenities || ['Room Heater', 'Geyser', 'Wi-Fi', 'Balcony']).map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-charcoal bg-ivory-warm p-2.5 rounded-xl border border-gold/15">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gold/20">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider border border-gold/40 text-charcoal hover:bg-gold/10 transition-colors"
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
              className="group w-full sm:w-auto px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-maroon hover:bg-maroon-dark text-ivory flex items-center justify-center gap-2 transition-colors shadow-md"
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
