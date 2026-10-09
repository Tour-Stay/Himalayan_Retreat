import { useState, useEffect } from 'react';
import { APP_URLS } from '@shared';

import kasarTempleImg from '@shared/assets/images/kasar-devi-temple.jpg';
import goluDevtaImg from '@shared/assets/images/Chitai_Golu_devta_Temple.jpg';
import jageshwarImg from '@shared/assets/images/Jageshwar-Mahamrityunjaya-Dham.jpg';
import kainchiImg from '@shared/assets/images/kainchi-dham.jpg';
import vivekanandaCaveImg from '@shared/assets/images/vivekananda-cave.jpg';
import kasarTempleTrailImg from '@shared/assets/images/kasar-temple-trail.jpg';

const carouselSlides = [
  {
    id: 1,
    image: kasarTempleImg,
    alt: 'Kasar Devi Temple and Peaceful Meditation Ridge',
    caption: 'Kasar Devi & Crank’s Ridge',
    subtitle: 'Swami Vivekananda Meditation Caves & Divine Himalayan Silence',
    position: 'object-center',
  },
  {
    id: 2,
    image: goluDevtaImg,
    alt: 'Chitai Golu Devta Temple Almora',
    caption: 'Chitai Golu Devta Temple',
    subtitle: 'Revered God of Justice • Sacred Temple of Bells & Divine Blessings',
    position: 'object-center',
  },
  {
    id: 3,
    image: jageshwarImg,
    alt: 'Jageshwar Mahamrityunjaya Dham Ancient Stone Temples',
    caption: 'Jageshwar Mahamrityunjaya Dham',
    subtitle: '124 Ancient Shiva Stone Shrines in Deodar Cedar Valley',
    position: 'object-center',
  },
  {
    id: 4,
    image: kainchiImg,
    alt: 'Kainchi Dham Ashram and Hanuman Temple',
    caption: 'Kainchi Dham Ashram & Mandir',
    subtitle: 'Sacred Forest River Valley • Established 1962',
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

      {/* 2. SACRED DEVOTIONAL RIBBON — MAA KASAR DEVI SHAKTI */}
      <div className="w-full bg-[#3D0F06] py-4 sm:py-5 border-y border-[#270904] text-center">
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal tracking-wide">
          ॥ ॐ ह्रीं श्रीं क्लीं माँ कासार देव्यै नमः • जय माँ कात्यायनी शक्तिपीठ ॥
        </h2>
      </div>

      {/* 3. EDITORIAL ZIG-ZAG STORYTELLING — DISTINCT UNEVEN BACKGROUNDS */}

      {/* CHAPTER 1 & GRAND HEADER: REGAL SACRED RED-BROWN (#541508) */}
      <div id="kasar-devi" className="w-full bg-[#541508] py-16 sm:py-22 px-4 sm:px-6 lg:px-8 border-b border-[#3D0F06] text-white relative">
        <div className="max-w-7xl mx-auto space-y-14 sm:space-y-18">

          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <span className="inline-block px-4 py-1 rounded-full text-xs sm:text-sm font-serif font-medium bg-[#3D0F06] text-[#EAA722] border border-[#EAA722]/40 tracking-wider">
              ॥ स्कन्दपुराण मानसखण्ड • श्रीदुर्गासप्तशती ॥
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-tight">
              Maa Kasar Devi &amp; The Sacred Kashyap Parvat
            </h2>
            <div className="w-24 h-0.5 bg-[#EAA722] mx-auto my-3"></div>
            <p className="font-serif text-lg sm:text-xl text-[#FAF5EC]/90 leading-relaxed font-normal">
              6,942 Feet &bull; Crank’s Ridge, Almora &bull; Sacred Seat of Navadurga Katyayani &bull; Est. 2nd Century CE
            </p>
            <p className="font-serif text-lg sm:text-xl text-[#EAA722] tracking-wide italic font-normal pt-1">
              ॥ चन्द्रहासोज्ज्वलकरा शार्दूलवरवाहना । कात्यायनी शुभं दद्याद् देवी दानवघातिनी ॥
            </p>
          </div>

          {/* CHAPTER 1: PURANIC SCRIPTURES (Image Left, Story Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Image Left */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#3D0F06] group">
                <img
                  src={kasarTempleImg}
                  alt="Maa Kasar Devi Temple Ancient Sanctum"
                  className="w-full h-80 sm:h-96 lg:h-[440px] object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <span className="font-serif text-xs sm:text-sm font-medium bg-[#3D0F06]/95 text-[#F3D8B0] px-3.5 py-1.5 rounded-full border border-[#EAA722]/40 backdrop-blur-xs">
                    Ancient Rock-Cut Sanctum &bull; 2nd Century CE Inscriptions
                  </span>
                  <p className="font-serif text-sm text-[#FAF5EC]/80 mt-2 italic">
                    Perched atop Kashyap Parvat framing the 180° Greater Himalayan snow range
                  </p>
                </div>
              </div>
            </div>

            {/* Story Right */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#3D0F06] text-[#EAA722] text-xs font-serif uppercase tracking-widest border border-[#EAA722]/30">
                <span>अध्याय १</span>
                <span>•</span>
                <span>Puranic Scripture</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#EAA722] font-normal leading-snug">
                The Divine Manifestation of Maa Katyayani
              </h3>
              <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/90 leading-relaxed font-normal">
                In the sacred pages of the <em>Skanda Purana (Manaskhanda)</em>, this lofty pine ridge is glorified as <strong>Kashyap Parvat</strong>, named in honor of Maharishi Kashyapa, who performed supreme tapasya here. The scriptures declare that merely walking this hill bestows purification and spiritual merit.
              </p>
              <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/90 leading-relaxed font-normal">
                According to the <em>Durga Saptashati</em> (Devi Mahatmya), when the cosmos trembled before the demon kings Shumbha and Nishumbha, Goddess Durga manifested Her ferocious yet protective sixth avatar &mdash; <strong>Maa Katyayani (Kaushiki)</strong> &mdash; right upon this mountain peak to vanquish evil and re-establish universal Dharma.
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-[#3D0F06] border border-[#EAA722]/30 text-[#F3D8B0] font-serif text-sm sm:text-base italic leading-relaxed">
                &ldquo;सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥&rdquo;
                <span className="block text-xs font-sans not-italic text-[#FAF5EC]/70 mt-1">
                  Daily Chandi Path invocation chanted at Maa Kasar Devi Sanctum
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CHAPTER 2: DEEP COSMIC MIDNIGHT PINE GRADIENT (#081E1A to #0D332D) */}
      <div className="w-full bg-gradient-to-b from-[#081E1A] via-[#0D332D] to-[#081E1A] py-16 sm:py-22 px-4 sm:px-6 lg:px-8 border-b border-[#051713] text-white relative">
        <div className="max-w-7xl mx-auto">
          {/* Story Left, Image Right — Zig-Zag! */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Story Left */}
            <div className="lg:col-span-6 space-y-5 text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#061814] text-[#EAA722] text-xs font-serif uppercase tracking-widest border border-[#EAA722]/30">
                <span>अध्याय २</span>
                <span>•</span>
                <span>Cosmic Energy &amp; Science</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#EAA722] font-normal leading-snug">
                The Van Allen Geomagnetic Belt
              </h3>
              <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/90 leading-relaxed font-normal">
                Beyond its ancient Puranic fame, Kasar Devi holds a documented position in modern geomagnetism. Scientific research and NASA studies established that this ridge sits directly beneath an extraordinary planetary electromagnetic belt.
              </p>
              <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/90 leading-relaxed font-normal">
                Remarkably, the earth possesses only <strong>three major locations</strong> with this unique natural geomagnetic pull: <strong>Stonehenge</strong> in the United Kingdom, <strong>Machu Picchu</strong> in Peru, and <strong>Kasar Devi</strong> in Almora.
              </p>
              <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/85 leading-relaxed font-normal">
                This electromagnetic phenomenon stimulates restorative alpha brainwaves, soothing the nervous system and enabling even first-time visitors to slip effortlessly into deep mental silence and stillness.
              </p>

              {/* Stat Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-[#061814] p-3 rounded-xl border border-[#EAA722]/25 text-center">
                  <span className="block font-serif text-xl sm:text-2xl text-[#EAA722] font-medium">3</span>
                  <span className="text-[11px] sm:text-xs text-[#FAF5EC]/75 font-serif">Global Sites</span>
                </div>
                <div className="bg-[#061814] p-3 rounded-xl border border-[#EAA722]/25 text-center">
                  <span className="block font-serif text-xl sm:text-2xl text-[#EAA722] font-medium">6,942′</span>
                  <span className="text-[11px] sm:text-xs text-[#FAF5EC]/75 font-serif">High Ridge</span>
                </div>
                <div className="bg-[#061814] p-3 rounded-xl border border-[#EAA722]/25 text-center">
                  <span className="block font-serif text-xl sm:text-2xl text-[#EAA722] font-medium">NASA</span>
                  <span className="text-[11px] sm:text-xs text-[#FAF5EC]/75 font-serif">Magnetic Belt</span>
                </div>
              </div>
            </div>

            {/* Image Right */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#061814] group">
                <img
                  src={kasarTempleTrailImg}
                  alt="Kasar Devi Ridge Cosmic Energy Trail"
                  className="w-full h-80 sm:h-96 lg:h-[440px] object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <span className="font-serif text-xs sm:text-sm font-medium bg-[#061814]/95 text-[#F3D8B0] px-3.5 py-1.5 rounded-full border border-[#EAA722]/40 backdrop-blur-xs">
                    Stonehenge &bull; Machu Picchu &bull; Kasar Devi
                  </span>
                  <p className="font-serif text-sm text-[#FAF5EC]/80 mt-2 italic">
                    Pine-scented ridge trails where visitors experience spontaneous mental calm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHAPTER 3: WARM ANCIENT EARTHY MAHOGANY (#481207) */}
      <div className="w-full bg-[#481207] py-16 sm:py-22 px-4 sm:px-6 lg:px-8 border-b border-[#340D05] text-white relative">
        <div className="max-w-7xl mx-auto">
          {/* Image Left, Story Right — Zig-Zag! */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Image Left */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#340D05] group">
                <img
                  src={vivekanandaCaveImg}
                  alt="Swami Vivekananda Meditation Cave at Kasar Devi"
                  className="w-full h-80 sm:h-96 lg:h-[440px] object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 text-left">
                  <span className="font-serif text-xs sm:text-sm font-medium bg-[#340D05]/95 text-[#F3D8B0] px-3.5 py-1.5 rounded-full border border-[#EAA722]/40 backdrop-blur-xs">
                    Swami Vivekananda Rock Cave &bull; August 1890
                  </span>
                  <p className="font-serif text-sm text-[#FAF5EC]/80 mt-2 italic">
                    The natural rock cavern beneath Kasar deodars where Swamiji attained deep dhyana
                  </p>
                </div>
              </div>
            </div>

            {/* Story Right */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#340D05] text-[#EAA722] text-xs font-serif uppercase tracking-widest border border-[#EAA722]/30">
                <span>अध्याय ३</span>
                <span>•</span>
                <span>The Enlightened Cave</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#EAA722] font-normal leading-snug">
                Where The Universe Revealed Itself in an Atom
              </h3>
              <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/90 leading-relaxed font-normal">
                In August 1890, <strong>Swami Vivekananda</strong> walked up to Kasar Devi from Almora and entered this natural rock cave for solitary dhyana. It was here that he experienced profound spiritual oneness, noting in his diary:
              </p>
              <blockquote className="border-l-4 border-[#EAA722] pl-5 italic text-[#F3D8B0] text-lg sm:text-xl my-3 bg-[#340D05] py-3 pr-4 rounded-r-xl border border-[#EAA722]/20">
                &ldquo;Here under the silent Himalayas, in the cosmic stillness of Kasar Devi, the universe revealed itself in an atom &mdash; the microcosm and the macrocosm are one.&rdquo;
                <span className="block text-xs font-sans not-italic text-[#FAF5EC]/75 mt-1.5">
                  &mdash; Swami Vivekananda, Diary Note (August 1890)
                </span>
              </blockquote>
              <p className="font-serif text-base sm:text-lg text-[#FAF5EC]/90 leading-relaxed font-normal">
                Over the following decades, this magnetic ridge &mdash; celebrated globally as <em>Crank&rsquo;s Ridge</em> &mdash; became a sanctuary for Buddhist scholar Lama Anagarika Govinda, Walter Evans-Wentz, poets, and seekers longing for authentic peace and transcendence.
              </p>
              <div className="pt-2">
                <a
                  href="#enquiry"
                  className="btn-nkb-gold px-8 py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase inline-block shadow-md hover:shadow-xl transition-all"
                >
                  PLAN YOUR VISIT TO KASAR DEVI ↗
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
