import React from 'react';
import { Container, APP_URLS } from '@shared';

import hotelBestPic from '@shared/assets/images/hotel-best-pic.jpg';
import chaletSuiteImg from '@shared/assets/images/chalet-suite.jpg';
import diningSatvikThali from '@shared/assets/images/dining-satvik-thali.jpg';
import innovaImg from '@shared/assets/images/innova-crysta.jpg';

const ClientCompanySection = () => {
  return (
    <section
      id="about-retreat"
      className="w-full bg-[#541508] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#3D0F06] text-white relative overflow-hidden"
    >
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
          <p className="font-serif text-sm uppercase tracking-widest text-[#EAA722] font-semibold mb-2">
            ॥ अतिथि देवो भव &bull; DEV BHOOMI HOSPITALITY ॥
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#EAA722] font-normal tracking-tight leading-tight mb-3">
            The Kasar Himalayan Heights
          </h2>

          <p className="font-serif text-lg sm:text-xl text-[#FAF5EC]/90 font-normal">
            Boutique Mountain Stay &amp; Chauffeured Pilgrimage Fleet &bull; Crank&apos;s Ridge, Almora (6,942 FT)
          </p>

          <div className="w-16 h-0.5 bg-[#EAA722] mx-auto mt-4"></div>
        </div>

        {/* Two-Column Showcase (Styled like Maharaj-ji Section) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative z-10">

          {/* Left Column: What We Do & Hotel Photo Frame */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#F3D8B0] font-normal leading-snug">
              Peaceful Mountain Stay &amp; Pilgrim Care
            </h3>

            {/* Concise Offerings */}
            <div className="space-y-4 font-serif text-base sm:text-lg">
              <div className="border-l-2 border-[#EAA722] pl-4">
                <span className="text-[#EAA722] font-semibold text-lg sm:text-xl block">
                  Heated Wooden Rooms &amp; Chalets
                </span>
                <span className="text-[#FAF5EC]/85 text-base block mt-0.5">
                  Warm wooden rooms, central room heating, and open sunrise views of snow-covered Mount Trishul.
                </span>
              </div>

              <div className="border-l-2 border-[#EAA722] pl-4">
                <span className="text-[#EAA722] font-semibold text-lg sm:text-xl block">
                  Pure Satvik Dining
                </span>
                <span className="text-[#FAF5EC]/85 text-base block mt-0.5">
                  Freshly prepared vegetarian food and mountain tea, cooked with pure water and desi ghee for pilgrims.
                </span>
              </div>

              <div className="border-l-2 border-[#EAA722] pl-4">
                <span className="text-[#EAA722] font-semibold text-lg sm:text-xl block">
                  Trusted Pilgrimage Cabs
                </span>
                <span className="text-[#FAF5EC]/85 text-base block mt-0.5">
                  Clean Toyota Innova Crysta &amp; hill cabs with polite local drivers for Kainchi Dham and station pickups.
                </span>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={APP_URLS.hotel}
                target="_blank"
                rel="noreferrer"
                className="btn-nkb-gold px-7 py-3 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-md hover:shadow-xl transition-all"
              >
                EXPLORE RETREAT ROOMS ↗
              </a>
              <a
                href={APP_URLS.travel}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3 text-xs sm:text-sm font-bold tracking-widest uppercase border-2 border-[#EAA722] text-[#EAA722] hover:bg-[#EAA722] hover:text-[#541508] transition-all"
              >
                BOOK YATRA CABS ↗
              </a>
            </div>

            {/* Framed Image 1: Chalet Room / Balcony */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#3D0F06]">
              <img
                src={chaletSuiteImg}
                alt="Heated Alpine Chalet Suite with Himalayan Views"
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
            <p className="font-serif text-sm text-[#FAF5EC]/70 text-center italic -mt-2">
              Heated Wooden Alpine Chalets &bull; Trishul Sunrise Balconies
            </p>
          </div>

          {/* Right Column: Hotel Image Showcase & Hospitality Details */}
          <div className="lg:col-span-6 flex flex-col space-y-6">

            {/* Framed Image 2: Hotel Exterior */}
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#EAA722]/40 bg-[#3D0F06]">
              <img
                src={hotelBestPic}
                alt="The Kasar Himalayan Heights Property View"
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
            <p className="font-serif text-sm text-[#FAF5EC]/70 text-center italic -mt-2">
              The Kasar Himalayan Heights &bull; Crank&apos;s Ridge Elevation (6,942 FT)
            </p>

            {/* Pilgrimage Transit Distances */}
            <div className="bg-[#3D0F06]/90 border border-[#EAA722]/30 rounded-xl p-5 sm:p-6 space-y-3">
              <h3 className="font-serif text-lg sm:text-xl text-[#EAA722] font-normal">
                Pilgrimage Driving Distances
              </h3>

              <div className="grid grid-cols-2 gap-3 text-sm font-serif">
                <div className="border-l border-[#EAA722]/30 pl-2.5">
                  <span className="text-[#EAA722] font-semibold block">Kainchi Dham</span>
                  <span className="text-[#FAF5EC]/80">45 km &bull; ~1.5 hrs</span>
                </div>
                <div className="border-l border-[#EAA722]/30 pl-2.5">
                  <span className="text-[#EAA722] font-semibold block">Jageshwar Dham</span>
                  <span className="text-[#FAF5EC]/80">35 km &bull; ~1.2 hrs</span>
                </div>
                <div className="border-l border-[#EAA722]/30 pl-2.5">
                  <span className="text-[#EAA722] font-semibold block">Kathgodam Station</span>
                  <span className="text-[#FAF5EC]/80">88 km &bull; ~3.0 hrs</span>
                </div>
                <div className="border-l border-[#EAA722]/30 pl-2.5">
                  <span className="text-[#EAA722] font-semibold block">Pantnagar Airport</span>
                  <span className="text-[#FAF5EC]/80">120 km &bull; ~3.5 hrs</span>
                </div>
              </div>
            </div>

            {/* Mini Photo Grid: Dining & Travel */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-[#EAA722]/30 bg-[#3D0F06]">
                <img
                  src={diningSatvikThali}
                  alt="Satvik Mountain Dining"
                  className="w-full h-32 sm:h-36 object-cover"
                />
                <p className="p-2 text-center text-xs text-[#FAF5EC]/70 italic">
                  Pure Satvik Dining
                </p>
              </div>

              <div className="rounded-xl overflow-hidden border border-[#EAA722]/30 bg-[#3D0F06]">
                <img
                  src={innovaImg}
                  alt="Pilgrimage Innova Crysta Cab"
                  className="w-full h-32 sm:h-36 object-cover"
                />
                <p className="p-2 text-center text-xs text-[#FAF5EC]/70 italic">
                  Chauffeured Mountain Fleet
                </p>
              </div>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
};

export default ClientCompanySection;
