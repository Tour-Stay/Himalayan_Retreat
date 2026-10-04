import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnowIcon, ArrowUpRightIcon, CheckCircleIcon, snowViewSuiteImg } from '@shared';

const RoomModal = ({ room, isOpen, onClose, onBookNow }) => {
  const navigate = useNavigate();
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

  const images = room.imageURLs?.length > 0 ? room.imageURLs : [snowViewSuiteImg];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#073125]/75 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-4xl bg-[#F8FAF7] rounded-3xl overflow-hidden shadow-2xl z-10 border border-[#073125]/20 my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#073125]/80 hover:bg-[#073125] text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Photo */}
          <div className="relative h-[280px] sm:h-[380px] rounded-2xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={images[activeImage]}
              alt={room.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
                <SnowIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span>{room.view || '180° Snow Peak View'}</span>
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImage === i
                      ? 'border-[#073125] scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Suite Information */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#073125]/10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[10px] uppercase tracking-widest font-mono font-bold mb-1 shadow-xs">
                KASAR DEVI • 6,942 FT
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#073125]">
                {room.name}
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[#073125] font-serif text-3xl font-semibold">
                ₹{room.pricePerNight?.toLocaleString()}
              </span>
              <span className="text-xs text-[#073125]/70 block font-light">per night • complimentary mountain breakfast</span>
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-2xl text-center text-xs sm:text-sm border border-[#073125]/10 shadow-xs">
            <div>
              <span className="text-[#073125]/60 block text-xs font-mono">Floor Area</span>
              <span className="font-semibold text-[#073125]">{room.area || '42 m²'}</span>
            </div>
            <div className="border-x border-[#073125]/10">
              <span className="text-[#073125]/60 block text-xs font-mono">Bed Setup</span>
              <span className="font-semibold text-[#073125]">{room.bedType || 'King Bed'}</span>
            </div>
            <div>
              <span className="text-[#073125]/60 block text-xs font-mono">Capacity</span>
              <span className="font-semibold text-[#073125]">{room.capacity?.adults || 2} Adults</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[#073125]/75 text-sm sm:text-base leading-relaxed font-light">
            {room.description}
          </p>

          {/* Amenities Grid */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#073125] mb-3 font-mono">
              Room Facilities &amp; Heating
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(room.amenities || ['Room Heater', 'Geyser', 'Wi-Fi', 'Balcony']).map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#073125] bg-white p-2.5 rounded-xl border border-[#073125]/10 shadow-xs">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-[#073125] flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#073125]/10">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border border-[#073125]/20 text-[#073125] hover:bg-[#EBF2EA] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onBookNow) {
                  onBookNow(room._id);
                } else {
                  navigate(`/book?room=${room._id}`);
                }
              }}
              className="group w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold bg-[#073125] hover:bg-[#12433B] text-white flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <span>Book This Room</span>
              <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
