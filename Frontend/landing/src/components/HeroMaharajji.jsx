import React from 'react';
import { Container, Divider, ArchImage, APP_URLS, babaPortraitImg } from '@shared';

const HeroMaharajji = () => {
  return (
    <section
      id="maharajji"
      className="relative py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FFF5EC] via-[#FAF6EF]/80 to-[#FDFBF7] overflow-hidden"
    >
      {/* Ambient background glow — enriched with warm saffron and temple gold */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E05A1B]/[0.09] rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#C5A059]/[0.07] rounded-full blur-[140px] pointer-events-none"></div>

      {/* Subtle sacred devotional watermarks (understated & serene) */}
      <div className="absolute top-8 right-8 sm:right-20 text-[#C84B0F]/[0.04] text-[160px] sm:text-[220px] font-devanagari select-none pointer-events-none leading-none z-0">
        ॐ
      </div>
      <div className="absolute -bottom-4 left-6 text-[#C84B0F]/[0.035] text-[130px] font-devanagari select-none pointer-events-none leading-none z-0">
        🔱
      </div>

      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left Column: Devotional Text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Sacred Kesariya Devotional Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C84B0F]/10 border border-[#C84B0F]/30 text-[#C84B0F] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
              <span className="text-sm animate-diya inline-block">🪔</span>
              <span className="font-devanagari text-sm">॥ पावन कैंची धाम • देवभूमि उत्तराखण्ड ॥</span>
            </div>

            {/* Sanskrit Blessing Header */}
            <div className="mb-5">
              <span className="font-devanagari text-2xl sm:text-3xl md:text-4xl text-[#7C1D23] font-normal tracking-wider block">
                ॥ ॐ श्री नीब करौरी महाराजाय नमः ॥
              </span>
              <p className="text-xs sm:text-sm font-sans tracking-wide text-[#C84B0F] font-semibold mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E05A1B] inline-block"></span>
                <span>Kainchi Dham Darshan &bull; Kasar Devi, Almora (6,942 FT)</span>
              </p>
            </div>

            {/* Main Heading — Simple, clear, welcoming */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2523] font-medium tracking-tight leading-[1.15] mb-5">
              A Peaceful Mountain Stay{' '}
              <span className="font-sans font-light">&</span>{' '}
              <br className="hidden sm:inline" />
              <span className="italic text-[#C84B0F] font-light">Scenic Hill Travel</span>
            </h1>

            {/* Sacred Quote with Kesariya Saffron Accent */}
            <div className="relative pl-5 border-l-3 border-[#E05A1B] my-3 py-3 pr-4 max-w-lg bg-gradient-to-r from-[#FFF3EB] to-[#FAF6EF]/50 rounded-r-2xl shadow-xs">
              <blockquote className="font-serif text-lg sm:text-xl text-[#2C2523] italic leading-relaxed">
                &ldquo;Love everyone, feed everyone, remember God, and tell the truth.&rdquo;
              </blockquote>
              <p className="mt-2 text-xs font-sans text-[#C84B0F] font-bold tracking-wide flex items-center gap-1.5">
                <span>— Sri Neem Karoli Baba Maharaj</span>
                <span className="text-sm">🔱</span>
              </p>
            </div>

            <div className="w-16 h-0.5 bg-[#E05A1B]/60 my-4"></div>

            {/* Welcome Statement — Simple & friendly */}
            <p className="text-base text-[#5C5350] leading-relaxed max-w-lg font-normal">
              Welcome to The Kasar Himalayan Heights in Kasar Devi, Almora. Whether you are visiting Kainchi Dham, exploring ancient Kumaon temples, or traveling with family, enjoy cozy heated rooms, clear Himalayan sunrise views, and trusted local cab services.
            </p>

            {/* Clear CTA Action Buttons with Saffron Glow */}
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href={APP_URLS.hotel}
                target="_blank"
                rel="noreferrer"
                className="group px-7 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold btn-saffron cursor-pointer flex items-center gap-2"
              >
                <span>View Rooms &amp; Rates</span>
                <span className="text-[#FFD8B3] text-sm leading-none group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
              <a
                href={APP_URLS.travel}
                target="_blank"
                rel="noreferrer"
                className="group px-7 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold border-1.5 border-[#C84B0F]/50 bg-[#FFFDF9] text-[#2C2523] hover:text-[#C84B0F] hover:border-[#C84B0F] hover:bg-[#FFF3EB] transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <span>Book Cabs &amp; Tours</span>
                <span className="text-[#C84B0F] text-sm leading-none group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Sacred Portrait with Divine Aarti Halo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-sm sm:max-w-md w-full">
              {/* Radiating Saffron Halo */}
              <div className="absolute -inset-6 sm:-inset-8 saffron-halo rounded-full blur-2xl pointer-events-none animate-diya"></div>

              {/* Arch Frame with Kesariya-Gold trim */}
              <div className="relative p-3.5 sm:p-4 rounded-t-full rounded-b-3xl bg-gradient-to-b from-[#FFF5EC] via-[#FAF6EF] to-[#F5EFE6] border-2 border-[#E05A1B]/40 shadow-2xl">
                <ArchImage
                  src={babaPortraitImg}
                  alt="Sri Neem Karoli Baba Maharaj in Kainchi Dham Ashram"
                  aspectRatio="aspect-[3/4]"
                  priority={true}
                  border={true}
                  caption="॥ जय श्री राम ॥ • Sri Neem Karoli Baba Maharaj • Kainchi Dham"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HeroMaharajji;
