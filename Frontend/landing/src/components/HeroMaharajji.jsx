import { useState, useEffect } from 'react';
import { APP_URLS } from '@shared';

import kasarTempleImg from '@shared/assets/images/kasar-devi-temple.jpg';
import goluDevtaImg from '@shared/assets/images/Chitai_Golu_devta_Temple.jpg';
import jageshwarImg from '@shared/assets/images/Jageshwar-Mahamrityunjaya-Dham.jpg';
import kainchiImg from '@shared/assets/images/kainchi-dham.jpg';
import vivekanandaCaveImg from '@shared/assets/images/vivekananda-cave.jpg';

const carouselSlides = [
  {
    id: 1,
    image: kasarTempleImg,
    alt: 'Kasar Devi Temple and Peaceful Meditation Ridge',
    caption: 'Kasar Devi & Crank’s Ridge',
    position: 'object-center',
  },
  {
    id: 2,
    image: goluDevtaImg,
    alt: 'Chitai Golu Devta Temple Almora',
    caption: 'Chitai Golu Devta Temple',
    position: 'object-center',
  },
  {
    id: 3,
    image: jageshwarImg,
    alt: 'Jageshwar Mahamrityunjaya Dham Ancient Stone Temples',
    caption: 'Jageshwar Mahamrityunjaya Dham',
    position: 'object-center',
  },
  {
    id: 4,
    image: kainchiImg,
    alt: 'Kainchi Dham Ashram and Hanuman Temple',
    caption: 'Kainchi Dham Ashram & Mandir',
    position: 'object-center',
  },
];

const HeroMaharajji = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  return (
    <section id="maharajji" className="w-full">
      {/* 1. HERO SLIDESHOW / CAROUSEL (Full Width & Sacred) */}
      <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] lg:h-[620px] bg-[#0D332D] overflow-hidden group">
        {carouselSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className={`w-full h-full object-cover ${slide.position || 'object-center'} filter brightness-[0.93] transition-transform duration-[8000ms] ease-out ${currentSlide === idx ? 'scale-105' : 'scale-100'}`}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30"></div>

            {/* Slide Title */}
            <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-10 lg:left-16 right-4 max-w-3xl text-left z-20">
              <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl text-white font-semibold drop-shadow-lg leading-tight sm:leading-snug">
                {slide.caption}
              </h2>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#081E1A]/75 hover:bg-[#EAA722] text-[#EAA722] hover:text-[#0D332D] flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md shadow-xl border border-[#EAA722]/30 hover:scale-105"
        >
          <span className="text-2xl sm:text-3xl font-serif leading-none">&#8249;</span>
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#081E1A]/75 hover:bg-[#EAA722] text-[#EAA722] hover:text-[#0D332D] flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-md shadow-xl border border-[#EAA722]/30 hover:scale-105"
        >
          <span className="text-2xl sm:text-3xl font-serif leading-none">&#8250;</span>
        </button>

        {/* Carousel Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-xs border border-white/10">
          {carouselSlides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentSlide(dotIdx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${currentSlide === dotIdx
                ? 'w-8 h-2 sm:h-2.5 bg-[#EAA722]'
                : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/50 hover:bg-white'
                }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. EDITORIAL ZIG-ZAG STORYTELLING — DISTINCT UNEVEN BACKGROUNDS */}

      {/* CHAPTER 1: REGAL SACRED RED-BROWN (#541508) */}
      <div id="kasar-devi" className="w-full bg-[#541508] py-16 sm:py-24 px-3 sm:px-6 lg:px-8 border-b border-[#3D0F06] text-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto space-y-12 sm:space-y-16">

          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl text-white font-semibold tracking-normal leading-tight sm:leading-snug">
              Kasar Devi &amp; The Sacred Kashyap Ridge
            </h2>
            <div className="w-20 h-0.5 bg-[#EAA722] mx-auto my-3"></div>
          </div>

          {/* CHAPTER 1: SCRIPTURES & HERITAGE (Image Left, Story Right) */}
          {/* Mobile-Only Heading for Chapter 1 */}
          <div className="lg:hidden space-y-3 mb-6 text-left">
            <h3 className="font-heading text-xl sm:text-3xl text-[#EAA722] font-semibold leading-snug">
              The Ancient Sanctuary of Maa Katyayani
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Image Left */}
            <div className="lg:col-span-6 ambient-glow-gold">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#3D0F06] luxury-card group">
                <div className="overflow-hidden">
                  <img
                    src={kasarTempleImg}
                    alt="Maa Kasar Devi Temple Ancient Sanctum"
                    className="w-full h-80 sm:h-96 lg:h-[460px] object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-5 right-5 text-left pointer-events-none">
                  <span className="text-xs sm:text-sm font-serif text-[#FAF5EC] glass-frosted px-3.5 py-1.5 rounded-full border border-[#EAA722]/40 shadow-lg">
                    2nd Century CE Stone Sanctum • Kasar Devi Ridge
                  </span>
                </div>
              </div>
            </div>

            {/* Story Right */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="hidden lg:block space-y-3">
                <h3 className="font-heading text-xl sm:text-3xl lg:text-4xl text-[#EAA722] font-semibold leading-snug">
                  The Ancient Sanctuary of Maa Katyayani
                </h3>
              </div>
              <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/90 leading-[1.8] sm:leading-[1.85] font-normal">
                In the classical scriptures of the <em>Skanda Purana</em>, this high pine ridge is celebrated as <strong>Kashyap Parvat</strong>, named in honor of Maharishi Kashyapa who performed deep meditation here. For centuries, travelers have experienced this ridge as a place of spontaneous stillness and mental clarity.
              </p>
              <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/90 leading-[1.8] sm:leading-[1.85] font-normal">
                According to the <em>Devi Mahatmya</em>, Goddess Durga manifested Her protective sixth form &mdash; <strong>Maa Katyayani</strong> &mdash; upon this mountain peak to overcome turmoil and re-establish universal harmony.
              </p>
              <div className="p-5 sm:p-6 rounded-2xl bg-[#3D0F06]/85 border border-[#EAA722]/35 text-[#FAF5EC] text-sm sm:text-base lg:text-[17px] leading-[1.75] shadow-lg">
                Perched atop Kashyap Parvat framing an uninterrupted 180° panorama of the Greater Himalayan snow peaks, the 2nd-century stone shrine continues to inspire quiet contemplation and peace.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CHAPTER 2: GEOMAGNETISM & CRANK'S RIDGE LEGACY (Dark Green) */}
      <div className="w-full bg-gradient-to-b from-[#081E1A] via-[#0D332D] to-[#081E1A] py-16 sm:py-24 px-3 sm:px-6 lg:px-8 border-b border-[#051713] text-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          {/* Mobile-Only Heading: appears above image on mobile, hidden on desktop */}
          <div className="lg:hidden space-y-3 mb-6 text-left">
            <h3 className="font-heading text-xl sm:text-3xl text-[#EAA722] font-semibold leading-snug">
              The Van Allen Belt &amp; The Silence of Crank’s Ridge
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Image Container: on mobile comes right after heading; on desktop appears on right (order-2) */}
            <div className="lg:col-span-6 lg:order-2 ambient-glow-gold">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#061814] luxury-card group">
                <div className="overflow-hidden">
                  <img
                    src={vivekanandaCaveImg}
                    alt="Swami Vivekananda Meditation Cave and Kasar Devi Ridge"
                    className="w-full h-80 sm:h-96 lg:h-[460px] object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-5 right-5 text-left pointer-events-none">
                  <span className="text-xs sm:text-sm font-serif text-[#FAF5EC] glass-frosted px-3.5 py-1.5 rounded-full border border-[#EAA722]/40 shadow-lg">
                    Swami Vivekananda Rock Cave • August 1890
                  </span>
                </div>
              </div>
            </div>

            {/* Story Left: on desktop appears on left (order-1); on mobile comes after image */}
            <div className="lg:col-span-6 space-y-6 text-left lg:order-1">
              {/* Desktop-Only Heading: shown on desktop, hidden on mobile */}
              <div className="hidden lg:block space-y-3">
                <h3 className="font-heading text-xl sm:text-3xl lg:text-4xl text-[#EAA722] font-semibold leading-snug">
                  The Van Allen Belt &amp; The Silence of Crank’s Ridge
                </h3>
              </div>

              <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/90 leading-[1.8] sm:leading-[1.85] font-normal">
                Kasar Devi holds a unique position on the planet: it is one of only <strong>three major locations</strong> on Earth &mdash; along with <strong>Stonehenge</strong> in the UK and <strong>Machu Picchu</strong> in Peru &mdash; situated under a documented planetary geomagnetic belt that stimulates calming alpha brainwaves.
              </p>

              <div className="border-l-2 border-[#EAA722]/60 pl-4 py-1 italic">
                <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/95 leading-[1.8] font-normal">
                  Drawn by this extraordinary silence, <strong>Swami Vivekananda</strong> meditated in Kasar&rsquo;s natural rock cave in August 1890, experiencing profound cosmic oneness. Over the following decades, Crank&rsquo;s Ridge became a celebrated sanctuary for seekers, scholars, and thinkers from around the globe.
                </p>
              </div>

              {/* Stat Highlights with Luxury Card Hover Lift */}
              <div className="grid grid-cols-3 gap-3.5 pt-2">
                <div className="bg-[#061814] p-4 rounded-2xl border border-[#EAA722]/25 text-center luxury-card shadow-lg">
                  <span className="block font-serif text-2xl sm:text-3xl text-[#EAA722] font-medium">3</span>
                  <span className="text-xs sm:text-sm text-[#FAF5EC]/80 font-medium mt-1 block">Global Sites</span>
                </div>
                <div className="bg-[#061814] p-4 rounded-2xl border border-[#EAA722]/25 text-center luxury-card shadow-lg">
                  <span className="block font-serif text-xl sm:text-2xl text-[#EAA722] font-medium leading-snug">Van Allen</span>
                  <span className="text-xs sm:text-sm text-[#FAF5EC]/80 font-medium mt-1 block">Magnetic Belt</span>
                </div>
                <div className="bg-[#061814] p-4 rounded-2xl border border-[#EAA722]/25 text-center luxury-card shadow-lg">
                  <span className="block font-serif text-2xl sm:text-3xl text-[#EAA722] font-medium">1890</span>
                  <span className="text-xs sm:text-sm text-[#FAF5EC]/80 font-medium mt-1 block">Vivekananda Cave</span>
                </div>
              </div>

              <div className="pt-3">
                <a
                  href="#enquiry"
                  className="btn-nkb-gold btn-shimmer px-8 py-4 text-xs sm:text-sm font-bold tracking-widest uppercase inline-flex items-center gap-2 group shadow-lg"
                >
                  <span>PLAN YOUR VISIT TO KASAR DEVI</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMaharajji;
