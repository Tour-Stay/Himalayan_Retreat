import React from 'react';
import { Container, StarIcon } from '@shared';
import { travelReviewsData } from '../data/travelData';

const TravelReviews = () => {
  return (
    <section id="reviews" className="py-20 sm:py-28 px-4 bg-gradient-to-b from-[#FAF6EF]/60 via-[#FFF5EC]/40 to-[#FAF6EF]/60 border-b border-[#C5A059]/20 relative overflow-hidden">
      {/* Subtle sacred symbol watermark */}
      <div className="absolute top-10 right-8 text-[#C84B0F]/[0.025] text-[180px] font-devanagari select-none pointer-events-none leading-none z-0">
        ॐ
      </div>

      <Container size="lg">
        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <span className="text-xs font-sans text-[#C84B0F] uppercase tracking-wider font-semibold block mb-2">
            Real Traveler Feedback • Google 4.9★
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2523] font-medium tracking-tight mb-4">
            Loved by Pilgrims &amp; Families
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C84B0F] to-transparent mx-auto my-3"></div>
          <p className="text-[#5C5350] text-base leading-relaxed font-normal">
            Read what our guests say about our punctual pickups, gentle hill driving, and friendly Pahadi drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {travelReviewsData.map((rev) => (
            <div
              key={rev.id}
              className="card-luxury p-7 sm:p-8 rounded-3xl bg-[#FDFBF7] border border-[#C5A059]/30 shadow-xs flex flex-col justify-between transition-all"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#C84B0F] mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-[#5C5350] leading-relaxed mb-6 font-normal italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#C5A059]/20">
                <h4 className="font-serif text-lg font-medium text-[#2C2523]">{rev.name}</h4>
                <div className="flex items-center justify-between text-xs text-[#6B615E] mt-0.5 font-sans">
                  <span>{rev.city}</span>
                  <span className="text-[#C84B0F] font-semibold">{rev.vehicle.split(' ')[0]} {rev.vehicle.split(' ')[1]}</span>
                </div>
                <div className="text-[11px] text-[#6B615E]/80 mt-1">
                  Trip: {rev.trip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TravelReviews;
