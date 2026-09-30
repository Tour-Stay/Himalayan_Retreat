import { useState } from 'react';
import SnowEffect from './SnowEffect';
import { MountainIcon, SnowIcon, StarIcon, BedIcon, SparklesIcon, ArrowUpRightIcon } from './Icons';

const Hero = () => {
  const [snowActive, setSnowActive] = useState(true);
  const [activeBg, setActiveBg] = useState(0);

  const heroBackgrounds = [
    {
      name: 'Himalayan Mountain Chalet',
      url: '/hero-hotel.jpg',
      label: 'Luxury Mountain Hotel Resort perched on snow ridge with Himalayan peaks',
    },
    {
      name: 'Winter Snow Resort',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2560&q=90',
      label: 'Kasar Devi Snow Sanctuary',
    },
    {
      name: 'Golden Himalayan Peaks',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=90',
      label: 'Himalayan Ridge Sunrise',
    },
  ];

  return (
    <section id="home" className="relative min-h-[96vh] lg:min-h-screen flex items-center justify-center overflow-hidden pt-36 sm:pt-40 lg:pt-44 pb-20">
      {/* Background Image with Slow 3D Ken-Burns Pan */}
      <div className="absolute inset-0 overflow-hidden bg-primary">
        <img
          src={heroBackgrounds[activeBg].url}
          alt={heroBackgrounds[activeBg].label}
          className="w-full h-full object-cover object-center hero-kenburns transition-opacity duration-1000"
        />
        {/* Balanced Luxury Alpine Glass Overlay: lets hotel building & snow peaks shine through */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/75 via-primary/35 to-primary/90 backdrop-brightness-[0.9]"></div>
      </div>

      {/* 3D Depth Winter Snow Particles */}
      <SnowEffect count={70} active={snowActive} />

      {/* Ambient glowing orbs behind glass cards */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        {/* Top Interactive Controls: Snow Toggle & View Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="shimmer-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-dark text-secondary text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase border border-secondary/30 shadow-lg">
            <SparklesIcon className="w-4 h-4 text-secondary animate-pulse" />
            <span>Luxury Mountain Hotel & Chalet • 7,500 FT Elevation</span>
          </div>

          <button
            onClick={() => setSnowActive(!snowActive)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill-dark text-xs text-white/90 hover:text-secondary border border-white/10 transition-colors shadow-sm cursor-pointer"
            title="Toggle live winter snowfall animation"
          >
            <SnowIcon className="w-3.5 h-3.5 text-secondary" />
            <span>Snowfall: {snowActive ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Main Heading with 3D Depth */}
        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-semibold leading-[1.08] mb-6 tracking-tight drop-shadow-lg">
          Luxury Above The Clouds
        </h1>

        {/* Subtitle */}
        <p className="text-white/95 text-base sm:text-xl font-light leading-relaxed mb-6 max-w-3xl mx-auto drop-shadow-md">
          Wake up to unobstructed 180° Himalayan snow peaks, cedar-wood chalet suites, crackling outdoor fires, and warm Kumaoni hospitality at 7,500 ft.
        </p>

        {/* Alpine Live Climate Pill */}
        <div className="inline-flex items-center flex-wrap justify-center gap-3 sm:gap-4 px-5 py-2.5 rounded-full glass-pill-dark border border-white/15 text-xs text-white/90 mb-10 shadow-xl">
          <span className="flex items-center gap-1.5 text-secondary font-semibold">
            <span>❄️</span> -1°C / 8°C
          </span>
          <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:block"></span>
          <span>Crisp Winter Sunshine</span>
          <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:block"></span>
          <span className="text-secondary font-medium">180° Nanda Devi Visibility</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <a
            href="#book"
            className="group btn-gold w-full sm:w-auto px-8 py-4 rounded-full text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Reserve Your Sanctuary</span>
            <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="#rooms"
            className="group btn-glass-luxury w-full sm:w-auto px-8 py-4 rounded-full text-xs uppercase tracking-widest inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore 12 Heated Suites</span>
            <span className="text-secondary opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">→</span>
          </a>
        </div>

        {/* 4-Metric Elevation Bar with Calm Luxury Glass Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-surface-dark p-5 rounded-2xl text-center border border-white/15 hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
              <MountainIcon className="w-5 h-5" />
            </div>
            <span className="block font-heading text-2xl sm:text-3xl font-bold text-white">
              7,500 ft
            </span>
            <span className="text-secondary/90 text-[11px] tracking-wider uppercase font-medium">
              Altitude Elevation
            </span>
          </div>

          <div className="glass-surface-dark p-5 rounded-2xl text-center border border-white/15 hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
              <SnowIcon className="w-5 h-5" />
            </div>
            <span className="block font-heading text-2xl sm:text-3xl font-bold text-white">
              180°
            </span>
            <span className="text-secondary/90 text-[11px] tracking-wider uppercase font-medium">
              Snow Peak Panorama
            </span>
          </div>

          <div className="glass-surface-dark p-5 rounded-2xl text-center border border-white/15 hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
              <StarIcon className="w-5 h-5 text-secondary" />
            </div>
            <span className="block font-heading text-2xl sm:text-3xl font-bold text-white">
              4.9 ★
            </span>
            <span className="text-secondary/90 text-[11px] tracking-wider uppercase font-medium">
              Guest Satisfaction
            </span>
          </div>

          <div className="glass-surface-dark p-5 rounded-2xl text-center border border-white/15 hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
              <BedIcon className="w-5 h-5" />
            </div>
            <span className="block font-heading text-2xl sm:text-3xl font-bold text-white">
              12
            </span>
            <span className="text-secondary/90 text-[11px] tracking-wider uppercase font-medium">
              Heated Suites
            </span>
          </div>
        </div>

        {/* View Switcher Pill at Bottom */}
        <div className="mt-8 inline-flex items-center gap-2 p-1.5 rounded-full glass-pill-dark border border-white/10 text-xs">
          <span className="text-white/60 pl-2">Atmosphere:</span>
          {heroBackgrounds.map((bg, idx) => (
            <button
              key={bg.name}
              onClick={() => setActiveBg(idx)}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
                activeBg === idx
                  ? 'bg-secondary text-primary font-semibold shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {bg.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
