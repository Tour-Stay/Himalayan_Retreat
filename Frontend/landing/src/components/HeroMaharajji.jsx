import { useState, useEffect } from 'react';
import { APP_URLS } from '@shared';

import babaNewImg from '@shared/assets/images/neem-karoli-baba1.jpg';
import kainchiImg from '@shared/assets/images/kainchi-dham.jpg';
import kasarTempleImg from '@shared/assets/images/kasar-devi-temple.jpg';
import jageshwarImg from '@shared/assets/images/Jageshwar-Mahamrityunjaya-Dham.jpg';

const carouselSlides = [
  {
    id: 1,
    image: babaNewImg,
    alt: 'Sri Neem Karoli Baba Maharaj in Divine Peace',
    caption: 'Sri Neem Karoli Baba Maharaj',
    subtitle: 'Kainchi Dham • The Embodiment of Unconditional Love & Grace',
    position: 'object-[center_20%]',
  },
  {
    id: 2,
    image: kainchiImg,
    alt: 'Kainchi Dham Ashram and Hanuman Temple',
    caption: 'Kainchi Dham Ashram & Mandir',
    subtitle: 'Sacred Forest River Valley • Established 1962',
    position: 'object-center',
  },
  {
    id: 3,
    image: kasarTempleImg,
    alt: 'Kasar Devi Temple and Peaceful Meditation Ridge',
    caption: 'Kasar Devi & Crank’s Ridge',
    subtitle: 'Swami Vivekananda Meditation Caves & Divine Himalayan Silence',
    position: 'object-center',
  },
  {
    id: 4,
    image: jageshwarImg,
    alt: 'Jageshwar Mahamrityunjaya Dham Ancient Stone Temples',
    caption: 'Jageshwar Mahamrityunjaya Dham',
    subtitle: '124 Ancient Shiva Stone Shrines in Deodar Cedar Valley',
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
      <div className="relative w-full h-[420px] sm:h-[540px] lg:h-[640px] bg-[#0D332D] overflow-hidden group">
        {carouselSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className={`w-full h-full object-cover ${slide.position || 'object-center'} filter brightness-[0.93]`}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

            {/* Slide Title & Subtitle */}
            <div className="absolute bottom-10 left-6 sm:left-12 lg:left-20 max-w-2xl text-left z-20">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal drop-shadow-md">
                {slide.caption}
              </h2>
              <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/90 mt-1.5 drop-shadow">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        <button
          type="button"
          onClick={goToPrev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#12433B]/70 hover:bg-[#EAA722] text-white hover:text-[#12433B] flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-lg border border-white/20"
        >
          <span className="text-xl sm:text-2xl font-serif leading-none">&#8249;</span>
        </button>

        <button
          type="button"
          onClick={goToNext}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#12433B]/70 hover:bg-[#EAA722] text-white hover:text-[#12433B] flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-lg border border-white/20"
        >
          <span className="text-xl sm:text-2xl font-serif leading-none">&#8250;</span>
        </button>

        {/* Carousel Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {carouselSlides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setCurrentSlide(dotIdx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${currentSlide === dotIdx
                ? 'w-8 h-2.5 bg-[#EAA722]'
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white'
                }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. DEVOTIONAL RED-BROWN RIBBON (Exact like nkbashram.org screenshot #2) */}
      <div className="w-full bg-[#541508] py-4 sm:py-5 border-y border-[#3D0F06] text-center">
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal tracking-wide">
          Jai Sri Baba Neem Karoli Maharaj!
        </h2>
      </div>

      {/* 3. DEEP TEAL-GREEN SACRED DEVOTIONAL TRIBUTE TO MAHARAJ-JI */}
      <div className="w-full bg-[#12433B] py-14 sm:py-20 px-4 sm:px-6 text-center text-white border-b border-[#0D332D]">
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="font-serif text-2xl sm:text-3xl text-[#EAA722] tracking-widest font-normal">
            RAM RAM
          </p>

          <p className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#EAA722] italic font-normal">
            All By His Grace
          </p>

          <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal pt-2">
            Sri Neem Karoli Baba Maharaj
          </h3>

          <p className="font-serif text-lg sm:text-xl text-[#FAF5EC]/90 font-normal">
            Kainchi Dham Ashram &bull; Devbhoomi Uttarakhand
          </p>

          <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/85 leading-relaxed max-w-2xl mx-auto pt-2 font-normal">
            Sri Neem Karoli Baba Maharaj is deeply loved across India and the world for his divine grace and unconditional love. At the holy river valley of Kainchi Dham, his blessings bring enduring peace, quiet faith, and spiritual joy to every heart.
          </p>

          <p className="font-serif text-2xl sm:text-3xl text-[#EAA722] tracking-widest font-normal pt-2">
            ॥ जय श्री नीब करौरी महाराज ॥
          </p>
        </div>
      </div>

      {/* 4. RICH RED-BROWN "LOVE . SERVE . REMEMBER" SECTION (Entirely About Maharaj-ji) */}
      <div id="maharajji-tribute" className="w-full bg-[#541508] py-16 sm:py-22 px-4 sm:px-6 lg:px-8 border-b border-[#3D0F06]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left Column: Love . Serve . Remember & Button & Maharajji Photo */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <h3 className="font-serif text-3xl sm:text-4xl text-[#F3D8B0] font-normal leading-tight">
              Love . Serve . Remember
            </h3>
            <p className="font-serif text-lg sm:text-xl text-[#EAA722] italic mt-1 mb-5">
              ~Sri Neem Karoli Baba
            </p>

            <a
              href="https://nkbashram.org/about-sri-neem-karoli-baba"
              target="_blank"
              rel="noreferrer"
              className="btn-nkb-gold px-8 py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 inline-block shadow-md hover:shadow-xl transition-all"
            >
              LEARN MORE ABOUT MAHARAJ-JI ↗
            </a>

            {/* Maharajji Frame with Golden Aura */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#3D0F06]">
              <img
                src={babaNewImg}
                alt="Sri Neem Karoli Baba Maharaj"
                className="w-full h-80 sm:h-96 object-cover object-[center_20%]"
              />
            </div>
            <p className="font-serif text-sm text-[#FAF5EC]/70 text-center w-full mt-3 italic">
              Sri Neem Karoli Baba Maharaj &bull; Kainchi Dham
            </p>
          </div>

          {/* Right Column: Divine Grace & Teachings of Maharaj-ji */}
          <div className="lg:col-span-7 flex flex-col">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#EAA722] font-normal leading-snug mb-5">
              Sub Ek &mdash; The Divine Grace of Maharaj-ji
            </h2>

            <div className="space-y-4 font-serif text-lg sm:text-xl text-[#FAF5EC]/90 leading-relaxed font-normal mb-8">
              <p>
                Sri Neem Karoli Baba, lovingly known to all as &ldquo;Maharaj-ji&rdquo;, was a revered saint and true devotee of Lord Hanuman. He blessed everyone through pure love, humility, and simple wisdom:
              </p>
              <blockquote className="border-l-4 border-[#EAA722] pl-5 italic text-[#F3D8B0] text-xl sm:text-2xl my-3">
                &ldquo;Love everyone, serve everyone, feed everyone, and remember God.&rdquo;
              </blockquote>
              <p>
                In 1962, Maharaj-ji founded Kainchi Dham beside the sacred Kshipra river in the quiet Kumaon hills. Today, it remains an eternal holy sanctuary of daily prayers, bhandara prasad, and divine peace for pilgrims and families from all over the world.
              </p>
            </div>

            {/* Kainchi Dham Mandir Photo with Golden Aura */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#3D0F06]">
              <img
                src={kainchiImg}
                alt="Kainchi Dham Ashram and Mandir"
                className="w-full h-72 sm:h-84 object-cover"
              />
            </div>
            <p className="font-serif text-sm text-[#FAF5EC]/70 text-center w-full mt-3 italic">
              Kainchi Dham Ashram &amp; Mandir &bull; Established 1962
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroMaharajji;
