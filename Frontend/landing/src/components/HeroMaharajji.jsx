import React from 'react';
import { Container, Divider, ArchImage, APP_URLS, babaPortraitImg } from '@shared';

const HeroMaharajji = () => {
  return (
    <section
      id="maharajji"
      className="relative py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FAF6EF] via-[#FDFBF7] to-[#FDFBF7] overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C5A059]/[0.06] rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7C1D23]/[0.04] rounded-full blur-[140px] pointer-events-none"></div>

      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left Column: Devotional Text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Sanskrit Blessing */}
            <div className="mb-5">
              <span className="font-devanagari text-2xl sm:text-3xl md:text-4xl text-[#7C1D23]/90 font-normal tracking-wider block">
                ॥ ॐ श्री नीब करौरी महाराजाय नमः ॥
              </span>
              <p className="text-xs sm:text-sm font-sans tracking-wide text-[#C5A059] font-medium mt-2">
                Kainchi Dham Ashram • Kasar Devi, Almora (6,942 FT)
              </p>
            </div>

            {/* Main Heading — Simple, clear, welcoming */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2523] font-medium tracking-tight leading-[1.15] mb-5">
              A Peaceful Mountain Stay{' '}
              <span className="font-sans font-light">&</span>{' '}
              <br className="hidden sm:inline" />
              <span className="italic text-[#7C1D23]/90 font-light">Scenic Hill Travel</span>
            </h1>

            {/* Sacred Quote */}
            <div className="relative pl-5 border-l-2 border-[#C5A059]/60 my-3 py-3 pr-4 max-w-lg bg-[#FAF6EF]/40 rounded-r-xl">
              <blockquote className="font-serif text-lg sm:text-xl text-[#2C2523]/90 italic leading-relaxed">
                &ldquo;Love everyone, feed everyone, remember God, and tell the truth.&rdquo;
              </blockquote>
              <p className="mt-2 text-xs font-sans text-[#C5A059] font-semibold tracking-wide">
                — Sri Neem Karoli Baba Maharaj
              </p>
            </div>

            <Divider className="w-16 my-4" />

            {/* Welcome Statement — Simple & friendly */}
            <p className="text-base text-[#5C5350] leading-relaxed max-w-lg font-normal">
              Welcome to The Kasar Himalayan Heights in Kasar Devi, Almora. Whether you are visiting Kainchi Dham, exploring ancient Kumaon temples, or traveling with family, enjoy cozy heated rooms, clear Himalayan sunrise views, and trusted local cab services.
            </p>

            {/* Clear CTA Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href={APP_URLS.hotel}
                target="_blank"
                rel="noreferrer"
                className="group px-7 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
              >
                <span>View Rooms & Rates</span>
                <span className="text-[#C5A059] text-sm leading-none group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
              <a
                href={APP_URLS.travel}
                target="_blank"
                rel="noreferrer"
                className="group px-7 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold border border-[#C5A059] bg-[#FDFBF7] text-[#2C2523] hover:text-[#7C1D23] hover:border-[#7C1D23]/40 transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span>Book Cabs & Tours</span>
                <span className="text-[#7C1D23] text-sm leading-none group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            </div>
          </div>

          {/* Right Column: Sacred Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-sm sm:max-w-md w-full">
              <div className="p-3 sm:p-4 rounded-t-full rounded-b-3xl bg-gradient-to-b from-[#FAF6EF] to-[#F5EFE6] border border-[#C5A059]/40 shadow-xl relative">
                <ArchImage
                  src={babaPortraitImg}
                  alt="Sri Neem Karoli Baba Maharaj in Kainchi Dham Ashram"
                  aspectRatio="aspect-[3/4]"
                  priority={true}
                  border={true}
                  caption="Sri Neem Karoli Baba Maharaj • Kainchi Dham Sanctuary"
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
