const ArchImage = ({
  src,
  alt = '',
  className = '',
  aspectRatio = 'aspect-[3/4]',
  priority = false,
  caption,
  border = true,
}) => {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div
        className={`relative w-full ${aspectRatio} arch-frame overflow-hidden bg-ivory-surface shadow-xl transition-all duration-500 hover:shadow-2xl ${
          border ? 'p-1.5 bg-gradient-to-b from-gold/50 via-gold/20 to-transparent' : ''
        }`}
      >
        <div className="w-full h-full arch-frame overflow-hidden bg-slate-mountain/10">
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>
      </div>
      {caption && (
        <p className="mt-3 text-xs tracking-wider uppercase text-charcoal-muted font-sans text-center">
          {caption}
        </p>
      )}
    </div>
  );
};

export default ArchImage;
