const LOGO_SVG = '/logo.svg';

const Logo = ({ size = 40, className = '', src = LOGO_SVG, alt = 'The Kasar Himalayan Heights' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex-shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <img
        src={src || LOGO_SVG}
        alt={alt}
        className="w-full h-full object-contain filter drop-shadow-sm select-none"
        loading="eager"
      />
    </div>
  );
};

export default Logo;
