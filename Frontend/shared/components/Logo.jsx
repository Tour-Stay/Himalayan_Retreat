const Logo = ({ size = 36, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="logoCrestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7E5A9" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#9E7628" />
          </linearGradient>
          <linearGradient id="logoCrestBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A1013" />
            <stop offset="100%" stopColor="#14080A" />
          </linearGradient>
          <linearGradient id="logoPeakLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D9E3EC" />
          </linearGradient>
          <linearGradient id="logoPeakShade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C1D23" />
            <stop offset="100%" stopColor="#3D0E11" />
          </linearGradient>
        </defs>

        {/* Outer Ring with fine luxury gold border */}
        <circle cx="50" cy="50" r="47" fill="url(#logoCrestBg)" stroke="url(#logoCrestGold)" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="43.5" stroke="url(#logoCrestGold)" strokeWidth="0.8" strokeDasharray="2 1.5" strokeOpacity="0.6" />

        {/* Radiant Golden Sunrise behind peaks */}
        <circle cx="50" cy="38" r="10" fill="url(#logoCrestGold)" opacity="0.9" />
        <g stroke="url(#logoCrestGold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
          <line x1="50" y1="23" x2="50" y2="19" />
          <line x1="39" y1="27" x2="36" y2="24" />
          <line x1="61" y1="27" x2="64" y2="24" />
          <line x1="33" y1="38" x2="29" y2="38" />
          <line x1="67" y1="38" x2="71" y2="38" />
        </g>

        {/* Background Mountain Range */}
        <polygon points="18,72 36,46 54,72" fill="#5C151A" opacity="0.85" />
        <polygon points="46,72 64,48 82,72" fill="#3D0E11" opacity="0.85" />

        {/* Primary Majestic Peak (Trishul & Nanda Devi) */}
        <polygon points="50,28 26,72 50,72" fill="url(#logoPeakLeft)" />
        <polygon points="50,28 50,72 74,72" fill="url(#logoPeakShade)" />
        <polygon points="50,28 41,44 50,41" fill="#FFFFFF" />
        <polygon points="50,28 50,41 59,44" fill="#C8D6E2" />

        {/* Secondary Fore peak (Cedar Ridge) */}
        <polygon points="34,48 18,73 34,73" fill="#FFFFFF" opacity="0.95" />
        <polygon points="34,48 34,73 50,73" fill="#7C1D23" />
        <polygon points="34,48 28,58 34,56" fill="#FFFFFF" />
        <polygon points="34,48 34,56 40,58" fill="#BCCEDB" />

        {/* Clean Gold Base Horizon Line */}
        <rect x="16" y="72" width="68" height="2" fill="url(#logoCrestGold)" rx="1" />

        {/* Alpine Star Zenith Sparkle */}
        <path d="M50 11 L51.3 14.8 L55.1 16.1 L51.3 17.4 L50 21.2 L48.7 17.4 L44.9 16.1 L48.7 14.8 Z" fill="url(#logoCrestGold)" />
        <circle cx="27" cy="22" r="1.2" fill="url(#logoCrestGold)" opacity="0.85" />
        <circle cx="73" cy="22" r="1.2" fill="url(#logoCrestGold)" opacity="0.85" />

        {/* Altitude Monogram Rim at Bottom */}
        <path id="logoCurve" d="M 20 81 A 38 38 0 0 0 80 81" fill="transparent" />
        <text fontFamily="'Inter', sans-serif" fontSize="6.5" fontWeight="700" fill="url(#logoCrestGold)" letterSpacing="3">
          <textPath href="#logoCurve" startOffset="50%" textAnchor="middle">
            6,942 FT • KASAR DEVI
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default Logo;
