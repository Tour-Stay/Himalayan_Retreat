import { useState, useEffect } from 'react';
import { Container, APP_URLS } from '@shared';
import ImageLightboxModal from './ImageLightboxModal';

// Overview Carousel Images
import hotelBestPic from '@shared/assets/images/hotel-best-pic.jpg';
import hotelInSnow from '@shared/assets/images/hotel-in-snow.jpg';
import trishulNandaDevi from '@shared/assets/images/Trishul-&-Nanda-Devi.jpg';
import hotelNightSky from '@shared/assets/images/hotel-night-sky.jpg';

// Hotel Stay Slider Images
import chaletBedroomImg from '@shared/assets/images/chalet-family-bedroom.jpg';
import suiteBalconyImg from '@shared/assets/images/suite-nanda-devi-balcony.jpg';
import corridorDayImg from '@shared/assets/images/corridor-at-day.jpg';
import diningSatvikThali from '@shared/assets/images/dining-satvik-thali.jpg';
import chaletLivingImg from '@shared/assets/images/chalet-family-living.jpg';

// Travel Fleet Slider Images
import innovaImg from '@shared/assets/images/innova-crysta.jpg';
import innovaInteriorImg from '@shared/assets/images/innova-interior.jpg';
import mountainSedanImg from '@shared/assets/images/mountain-sedan.jpg';
import luxuryMinibusImg from '@shared/assets/images/luxury-minibus.jpg';
import kathgodamPickupImg from '@shared/assets/images/kathgodam-railway-station-pickup.jpg';

const overviewSlides = [
  {
    image: hotelBestPic,
    alt: 'The Kasar Himalayan Heights Property View',
    caption: 'Crank’s Ridge Sanctuary • 6,942 FT',
    sub: 'Perched in ancient pine groves overlooking snow peaks',
  },
  {
    image: trishulNandaDevi,
    alt: '180 Degree Snow Peak Sunrise over Mount Trishul and Nanda Devi',
    caption: '180° Greater Himalayan Panorama',
    sub: 'Mount Trishul, Nanda Devi & Panchachuli snow peaks',
  },
  {
    image: hotelInSnow,
    alt: 'The Kasar Himalayan Heights in Winter Snow',
    caption: 'Winter Snow Wonderland',
    sub: 'Warm heated suites amidst pristine white snowfalls',
  },
  {
    image: hotelNightSky,
    alt: 'Stargazing at 6,942 FT at Kasar Devi Ridge',
    caption: 'Cosmic Stargazing & Stillness',
    sub: 'Crystal-clear high altitude skies beneath the Milky Way',
  },
];

const hotelSlides = [
  {
    image: chaletBedroomImg,
    alt: 'Heated Chalet Suite Bedroom',
    title: 'Heated Wooden Chalet Suites',
    badge: 'Underfloor Heating & Central Room Warmth',
  },
  {
    image: suiteBalconyImg,
    alt: 'Private Balcony Facing Himalayan Peaks',
    title: 'Private Snow Peak Balconies',
    badge: 'Direct Sunrise Views of Mount Trishul',
  },
  {
    image: corridorDayImg,
    alt: 'Rooftop Mountain View Terrace & Café Lounge',
    title: 'Rooftop Terrace Café & Sunset Deck',
    badge: 'Pergola Lounge Overlooking the Snow Peaks',
  },
  {
    image: diningSatvikThali,
    alt: 'Fresh Satvik Mountain Dining Thali',
    title: 'Pure Satvik Mountain Dining',
    badge: 'Fresh Vegetarian Meals & Herbal Infusions',
  },
  {
    image: chaletLivingImg,
    alt: 'Warm Cedar Wood Living Suite',
    title: 'Warm Wooden Chalet Living',
    badge: 'Handcrafted Pine Ceilings & Large Valley Windows',
  },
];

const travelSlides = [
  {
    image: innovaImg,
    alt: 'Toyota Innova Crysta Mountain Cab',
    title: 'Toyota Innova Crysta Fleet',
    badge: 'Spacious 6+1 Seater for Hill Travel',
  },
  {
    image: innovaInteriorImg,
    alt: 'Innova Crysta Captain Seats Interior',
    title: 'Executive Comfort & Cleanliness',
    badge: 'Reclining Captain Seats with Ample Legroom',
  },
  {
    image: mountainSedanImg,
    alt: '4-Seater Mountain Sedan',
    title: 'Swift Dzire & Mountain Sedans',
    badge: 'Ideal for Couples & Small Family Yatras',
  },
  {
    image: luxuryMinibusImg,
    alt: 'Force Urbania Luxury Minibus',
    title: 'Force Urbania Luxury Minibus',
    badge: '12–17 Seater for Extended Family Groups',
  },
  {
    image: kathgodamPickupImg,
    alt: 'Kathgodam Railway Station Pickup',
    title: 'Guaranteed Railhead Pickups',
    badge: 'Punctual Kathgodam & Pantnagar Transfers',
  },
];

const amenities = [
  { icon: '♨️', title: 'Room Heating', desc: 'Central heat for zero-degree winters' },
  { icon: '🏔️', title: 'Snow Balconies', desc: '180° views of Trishul & Nanda Devi' },
  { icon: '🍲', title: 'Satvik Dining', desc: 'Pure vegetarian & fasting thalis' },
  { icon: '📶', title: 'Fiber Wi-Fi', desc: 'High-speed internet for workcations' },
  { icon: '☕', title: '24/7 Hot Water', desc: 'Constant geysers & herbal brews' },
  { icon: '🛡️', title: 'Elderly Care', desc: 'Easy access & dedicated luggage porter' },
];

const transitCircuits = [
  { name: 'Kainchi Dham', dist: '45 km', time: '~1.5 hrs', tip: 'Scenic drive through pine ridges; direct ghat road with valley views.' },
  { name: 'Jageshwar Dham', dist: '35 km', time: '~1.2 hrs', tip: 'Winding deodar cedar forest descent with sacred riverside halts.' },
  { name: 'Kathgodam Station', dist: '88 km', time: '~3.0 hrs', tip: 'Primary railhead link with punctual chauffeur meet-and-greet.' },
  { name: 'Pantnagar Airport', dist: '120 km', time: '~3.5 hrs', tip: 'Direct air transfer via Haldwani foothills and Bhimtal lake circuit.' },
];

const ClientCompanySection = () => {
  // Step 1: Overview Carousel state
  const [overviewIdx, setOverviewIdx] = useState(0);

  // Step 2: Hotel Slider state
  const [hotelIdx, setHotelIdx] = useState(0);

  // Step 3: Travel Slider state
  const [travelIdx, setTravelIdx] = useState(0);

  // Interactive Transit Circuit Selection
  const [selectedTransit, setSelectedTransit] = useState(0);

  // Photo Lightbox Modal State
  const [lightbox, setLightbox] = useState({ isOpen: false, image: null, title: '', caption: '' });

  const openLightbox = (image, title, caption) => {
    setLightbox({ isOpen: true, image, title, caption });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, image: null, title: '', caption: '' });
  };

  // Auto-advance overview carousel every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setOverviewIdx((prev) => (prev + 1) % overviewSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance hotel carousel every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setHotelIdx((prev) => (prev + 1) % hotelSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance travel carousel every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setTravelIdx((prev) => (prev + 1) % travelSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevHotel = () => {
    setHotelIdx((prev) => (prev - 1 + hotelSlides.length) % hotelSlides.length);
  };
  const nextHotel = () => {
    setHotelIdx((prev) => (prev + 1) % hotelSlides.length);
  };

  const prevTravel = () => {
    setTravelIdx((prev) => (prev - 1 + travelSlides.length) % travelSlides.length);
  };
  const nextTravel = () => {
    setTravelIdx((prev) => (prev + 1) % travelSlides.length);
  };

  return (
    <section
      id="about-retreat"
      className="w-full bg-gradient-to-b from-[#081E1A] via-[#0D332D] to-[#081E1A] py-16 sm:py-24 px-3 sm:px-6 lg:px-8 border-b border-[#051713] text-white relative overflow-hidden"
    >
      <Container size="lg">

        {/* Section Header: Client Name Centered at Top */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-16 relative z-10 space-y-3 sm:space-y-4">
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl text-[#EAA722] font-semibold tracking-normal leading-tight sm:leading-snug">
            The Kasar Himalayan Heights
          </h2>

          <div className="w-20 h-0.5 bg-[#EAA722] mx-auto my-3"></div>
        </div>

        {/* =========================================================================
            PART 1: THE RETREAT SANCTUARY OVERVIEW (Content Left | Carousel Right)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10 mb-20 sm:mb-24">
          {/* Content Left */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/90 leading-[1.8] sm:leading-[1.85] font-normal">
              Perched on the ancient pine crest of Crank’s Ridge with an uninterrupted 180° panorama of the Greater Himalayan snow peaks, we welcome travelers to warm heated chalet hospitality, pure satvik mountain food, and reliable chauffeured mountain travel across Kumaon.
            </p>

            <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/85 leading-[1.8] sm:leading-[1.85] font-normal">
              Whether you are undertaking a sacred darshan to Kainchi Dham, meditating in the ancient caves of Kasar Devi, or seeking peaceful sanctuary with family, our team ensures every moment is enveloped in stillness and care.
            </p>

            {/* 3 Quick Highlight Badges with Luxury Card Lift */}
            <div className="grid grid-cols-3 gap-3.5 pt-2">
              <div className="bg-[#061814] p-3.5 sm:p-4 rounded-2xl border border-[#EAA722]/25 text-center luxury-card shadow-lg">
                <span className="block font-serif text-2xl sm:text-3xl text-[#EAA722] font-medium">6,942′</span>
                <span className="text-xs sm:text-sm text-[#FAF5EC]/80 font-medium mt-0.5 block">High Ridge</span>
              </div>
              <div className="bg-[#061814] p-3.5 sm:p-4 rounded-2xl border border-[#EAA722]/25 text-center luxury-card shadow-lg">
                <span className="block font-serif text-2xl sm:text-3xl text-[#EAA722] font-medium">180°</span>
                <span className="text-xs sm:text-sm text-[#FAF5EC]/80 font-medium mt-0.5 block">Snow Peaks</span>
              </div>
              <div className="bg-[#061814] p-3.5 sm:p-4 rounded-2xl border border-[#EAA722]/25 text-center luxury-card shadow-lg">
                <span className="block font-serif text-2xl sm:text-3xl text-[#EAA722] font-medium">800m</span>
                <span className="text-xs sm:text-sm text-[#FAF5EC]/80 font-medium mt-0.5 block">Temple Walk</span>
              </div>
            </div>
          </div>

          {/* Carousel Right */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-80 sm:h-96 lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#061814] luxury-card group">
              {overviewSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    overviewIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    onClick={() => openLightbox(slide.image, slide.caption, slide.sub)}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out cursor-zoom-in"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                  {/* Floating Caption */}
                  <div className="absolute bottom-5 left-5 right-5 text-left z-20">
                    <span className="glass-frosted text-[#EAA722] text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full border border-[#EAA722]/40 inline-block mb-1.5 shadow-md">
                      {slide.caption}
                    </span>
                    <p className="text-xs sm:text-sm text-[#FAF5EC]/90 font-normal">
                      {slide.sub}
                    </p>
                  </div>
                </div>
              ))}

              {/* Morphing Dot Indicators */}
              <div className="absolute bottom-3 right-5 z-30 flex items-center gap-1.5">
                {overviewSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setOverviewIdx(dotIdx)}
                    className={`transition-all duration-500 rounded-full cursor-pointer ${
                      overviewIdx === dotIdx
                        ? 'w-7 h-2 bg-[#EAA722] shadow-[0_0_10px_rgba(234,167,34,0.7)]'
                        : 'w-2 h-2 bg-white/40 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#EAA722]/30 to-transparent my-16 sm:my-20"></div>

        {/* =========================================================================
            PART 2: THE BOUTIQUE CHALET (Interactive Slider Left | Content Right)
            ========================================================================= */}
        {/* Mobile-Only Heading for Part 2 */}
        <div className="lg:hidden text-left mb-6">
          <h3 className="font-heading text-xl sm:text-3xl text-[#F3D8B0] font-semibold leading-snug">
            Heated Wooden Suites &amp; Alpine Comforts
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10 mb-20 sm:mb-24">
          {/* Interactive Hotel Slider Left (with Move Buttons) */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-80 sm:h-96 lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#061814] luxury-card group">
              {hotelSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    hotelIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    onClick={() => openLightbox(slide.image, slide.title, slide.badge)}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out cursor-zoom-in"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                  {/* Slide Title & Badge */}
                  <div className="absolute bottom-5 left-5 right-5 text-left z-20">
                    <h4 className="font-heading text-lg sm:text-2xl text-white font-semibold leading-snug drop-shadow-md">
                      {slide.title}
                    </h4>
                    <span className="glass-frosted text-xs sm:text-sm text-[#EAA722] font-normal px-2.5 py-0.5 rounded-full inline-block mt-1">
                      ✦ {slide.badge}
                    </span>
                  </div>
                </div>
              ))}

              {/* Prev / Next Move Buttons */}
              <button
                type="button"
                onClick={prevHotel}
                aria-label="Previous Hotel Room Image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#061814]/80 hover:bg-[#EAA722] text-[#EAA722] hover:text-[#0D332D] flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md shadow-lg border border-[#EAA722]/30 hover:scale-105"
              >
                <span className="text-2xl sm:text-3xl font-serif leading-none">&#8249;</span>
              </button>

              <button
                type="button"
                onClick={nextHotel}
                aria-label="Next Hotel Room Image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#061814]/80 hover:bg-[#EAA722] text-[#EAA722] hover:text-[#0D332D] flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md shadow-lg border border-[#EAA722]/30 hover:scale-105"
              >
                <span className="text-2xl sm:text-3xl font-serif leading-none">&#8250;</span>
              </button>

              {/* Morphing Dot Indicators */}
              <div className="absolute bottom-4 right-5 z-30 flex items-center gap-1.5">
                {hotelSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setHotelIdx(dotIdx)}
                    className={`transition-all duration-500 rounded-full cursor-pointer ${
                      hotelIdx === dotIdx
                        ? 'w-7 h-2 bg-[#EAA722] shadow-[0_0_10px_rgba(234,167,34,0.7)]'
                        : 'w-2 h-2 bg-white/40 hover:bg-white'
                    }`}
                    aria-label={`Go to hotel photo ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Hotel Content & Facilities Right */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="hidden lg:block">
              <h3 className="font-heading text-xl sm:text-3xl lg:text-4xl text-[#F3D8B0] font-semibold leading-snug">
                Heated Wooden Suites &amp; Alpine Comforts
              </h3>
            </div>

            <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/90 leading-[1.8] sm:leading-[1.85] font-normal">
              Designed specifically for sub-zero Himalayan winters, our heated chalets feature warm cedar and pine paneling, plush duvets, continuous running hot water, and large private glass balconies framing majestic sunrise vistas of Mount Trishul.
            </p>

            {/* 6 High-Altitude Comfort Amenities with Luxury Card Hover */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
              {amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#061814] p-3.5 sm:p-4 rounded-2xl border border-[#EAA722]/20 hover:border-[#EAA722]/50 luxury-card shadow-md transition-all group"
                >
                  <div className="text-xl sm:text-2xl mb-1.5 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <div className="text-xs sm:text-sm font-semibold text-white leading-snug">{item.title}</div>
                  <div className="text-[11px] sm:text-xs text-[#FAF5EC]/75 mt-1 leading-normal">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Direct CTA to Hotel Portal */}
            <div className="pt-3">
              <a
                href={APP_URLS.hotel}
                target="_blank"
                rel="noreferrer"
                className="btn-nkb-gold btn-shimmer px-8 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 group shadow-lg cursor-pointer"
              >
                <span>EXPLORE SUITES &amp; TARIFFS</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#EAA722]/30 to-transparent my-16 sm:my-20"></div>

        {/* =========================================================================
            PART 3: THE CHAUFFEURED TRAVEL FLEET (Content Left | Fleet Slider Right)
            ========================================================================= */}
        {/* Mobile-Only Heading for Part 3 */}
        <div className="lg:hidden text-left mb-6">
          <h3 className="font-heading text-xl sm:text-3xl text-[#F3D8B0] font-semibold leading-snug">
            Safe, Punctual &amp; Dedicated Hill Expeditions
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          {/* Fleet Slider & Transit Card Right: on desktop appears on right (lg:order-2); on mobile comes right after heading */}
          <div className="lg:col-span-6 space-y-6 lg:order-2">
            <div className="relative w-full h-80 sm:h-96 lg:h-[420px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#061814] luxury-card group">
              {travelSlides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    travelIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    onClick={() => openLightbox(slide.image, slide.title, slide.badge)}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out cursor-zoom-in"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>

                  {/* Slide Title & Badge */}
                  <div className="absolute bottom-5 left-5 right-5 text-left z-20">
                    <h4 className="font-heading text-lg sm:text-2xl text-white font-semibold leading-snug drop-shadow-md">
                      {slide.title}
                    </h4>
                    <span className="glass-frosted text-xs sm:text-sm text-[#EAA722] font-normal px-2.5 py-0.5 rounded-full inline-block mt-1">
                      ✦ {slide.badge}
                    </span>
                  </div>
                </div>
              ))}

              {/* Prev / Next Move Buttons */}
              <button
                type="button"
                onClick={prevTravel}
                aria-label="Previous Vehicle Image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#061814]/80 hover:bg-[#EAA722] text-[#EAA722] hover:text-[#0D332D] flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md shadow-lg border border-[#EAA722]/30 hover:scale-105"
              >
                <span className="text-2xl sm:text-3xl font-serif leading-none">&#8249;</span>
              </button>

              <button
                type="button"
                onClick={nextTravel}
                aria-label="Next Vehicle Image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#061814]/80 hover:bg-[#EAA722] text-[#EAA722] hover:text-[#0D332D] flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md shadow-lg border border-[#EAA722]/30 hover:scale-105"
              >
                <span className="text-2xl sm:text-3xl font-serif leading-none">&#8250;</span>
              </button>

              {/* Morphing Dot Indicators */}
              <div className="absolute bottom-4 right-5 z-30 flex items-center gap-1.5">
                {travelSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setTravelIdx(dotIdx)}
                    className={`transition-all duration-500 rounded-full cursor-pointer ${
                      travelIdx === dotIdx
                        ? 'w-7 h-2 bg-[#EAA722] shadow-[0_0_10px_rgba(234,167,34,0.7)]'
                        : 'w-2 h-2 bg-white/40 hover:bg-white'
                    }`}
                    aria-label={`Go to vehicle photo ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Quick Transit Distances Card with Interactive Selector */}
            <div className="bg-[#061814] border border-[#EAA722]/30 rounded-2xl p-5 sm:p-6 shadow-xl luxury-card">
              <div className="border-b border-[#EAA722]/20 pb-3 mb-4">
                <span className="text-xs uppercase tracking-widest text-[#EAA722] font-semibold">
                  Pilgrimage Transit Distances from Kasar Devi
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                {transitCircuits.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedTransit(idx)}
                    className={`p-3 rounded-xl border transition-all duration-300 text-center cursor-pointer ${
                      selectedTransit === idx
                        ? 'bg-[#0D332D] border-[#EAA722] shadow-[0_0_12px_rgba(234,167,34,0.35)] scale-102'
                        : 'bg-[#081E1A] border-[#EAA722]/20 hover:border-[#EAA722]/50'
                    }`}
                  >
                    <span className="block text-xs sm:text-sm font-semibold text-white truncate">{item.name}</span>
                    <span className="block font-serif text-base sm:text-lg font-bold text-[#EAA722] mt-0.5">
                      {item.dist}
                    </span>
                    <span className="block text-xs text-[#FAF5EC]/70">{item.time}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Route Highlight / Tip */}
              {transitCircuits[selectedTransit] && (
                <div className="mt-4 pt-3 border-t border-[#EAA722]/15 flex items-start gap-2.5 text-xs sm:text-sm text-[#FAF5EC]/90 text-left bg-[#0D332D]/40 p-3 rounded-xl border border-[#EAA722]/20">
                  <span className="text-[#EAA722] font-bold">✦ Route:</span>
                  <span>{transitCircuits[selectedTransit].tip}</span>
                </div>
              )}
            </div>
          </div>

          {/* Travel Content Left: on desktop appears on left (lg:order-1); on mobile comes after slider */}
          <div className="lg:col-span-6 space-y-6 text-left lg:order-1">
            <div className="hidden lg:block">
              <h3 className="font-heading text-xl sm:text-3xl lg:text-4xl text-[#F3D8B0] font-semibold leading-snug">
                Safe, Punctual &amp; Dedicated Hill Expeditions
              </h3>
            </div>

            <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/90 leading-[1.8] sm:leading-[1.85] font-normal">
              Navigating mountain ghats requires disciplined local expertise and impeccably maintained hill vehicles. Our private fleet provides personalized station transfers, sacred temple circuits, and customized excursions across Kumaon.
            </p>

            {/* 3 Pilgrimage Travel Guarantees */}
            <div className="space-y-4 text-sm sm:text-base lg:text-[17px] text-[#FAF5EC]/85 font-normal leading-[1.75]">
              <div className="border-l-2 border-[#EAA722] pl-4">
                <strong className="text-white block font-medium">Station &amp; Airport Meet-and-Greet</strong>
                <span>Direct on-time pickup from Kathgodam Railway Station (88 km) and Pantnagar Airport (120 km).</span>
              </div>
              <div className="border-l-2 border-[#EAA722] pl-4">
                <strong className="text-white block font-medium">Kainchi Dham &amp; Jageshwar Circuits</strong>
                <span>Chauffeured day excursions with relaxed halts for aarti, temple darshan, and river walks.</span>
              </div>
              <div className="border-l-2 border-[#EAA722] pl-4">
                <strong className="text-white block font-medium">Veteran Local Pahadi Drivers</strong>
                <span>Polite, non-smoking, mountain-tested drivers with transparent fixed rates and zero hidden charges.</span>
              </div>
            </div>

            {/* Direct CTA to Travel Portal */}
            <div className="pt-3">
              <a
                href={APP_URLS.travel}
                target="_blank"
                rel="noreferrer"
                className="btn-outline-gold btn-shimmer px-8 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 group shadow-lg cursor-pointer"
              >
                <span>CALCULATE FARE &amp; BOOK CABS</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
              </a>
            </div>
          </div>
        </div>

      </Container>

      {/* Interactive Photo Lightbox Preview */}
      <ImageLightboxModal
        isOpen={lightbox.isOpen}
        onClose={closeLightbox}
        image={lightbox.image}
        title={lightbox.title}
        caption={lightbox.caption}
      />
    </section>
  );
};

export default ClientCompanySection;
