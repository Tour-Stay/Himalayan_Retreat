import { useEffect } from 'react';

const ImageLightboxModal = ({ isOpen, onClose, image, title, caption }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Image Preview'}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-2xl animate-fade-in cursor-zoom-out"
    >
      {/* Top Bar with Close Button */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo preview"
          className="w-11 h-11 rounded-full bg-[#061814]/80 text-[#EAA722] hover:bg-[#EAA722] hover:text-[#0D332D] border border-[#EAA722]/40 flex items-center justify-center text-xl transition-all duration-300 shadow-xl cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Main Image Frame (stops propagation so clicking inside doesn't immediately close) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center rounded-3xl overflow-hidden border border-[#EAA722]/35 bg-[#061814] shadow-2xl cursor-default"
      >
        <img
          src={image}
          alt={title || 'Full screen preview'}
          className="max-h-[75vh] w-auto max-w-full object-contain"
        />

        {(title || caption) && (
          <div className="w-full p-4 sm:p-5 bg-gradient-to-t from-black via-[#061814] to-transparent text-center border-t border-[#EAA722]/20">
            {title && (
              <h4 className="font-heading text-lg sm:text-2xl text-white font-semibold leading-snug">
                {title}
              </h4>
            )}
            {caption && (
              <p className="text-xs sm:text-sm text-[#FAF5EC]/80 mt-1 font-sans">
                {caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageLightboxModal;
