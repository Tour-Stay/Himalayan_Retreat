import React, { useState } from 'react';
import { Container, useSiteSettings } from '@shared';
import { travelFaqs } from '../data/travelData';

const TravelFaqSection = () => {
  const [openIdx, setOpenIdx] = useState(0);
  const { settings } = useSiteSettings();

  const faqsList = (settings?.travelPolicies?.faqs && Array.isArray(settings.travelPolicies.faqs) && settings.travelPolicies.faqs.length > 0)
    ? settings.travelPolicies.faqs
    : travelFaqs;

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20 relative overflow-hidden">
      {/* Subtle sacred symbol watermark */}
      <div className="absolute top-10 left-6 text-[#C84B0F]/[0.025] text-[180px] font-devanagari select-none pointer-events-none leading-none z-0">
        🔱
      </div>

      <Container size="md">
        <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
          <span className="text-xs font-sans text-[#C84B0F] uppercase tracking-wider font-semibold block mb-2">
            ॥ 🪔 Mountain Cab Guide &amp; FAQs 🪔 ॥
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2523] font-medium tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C84B0F] to-transparent mx-auto my-3"></div>
          <p className="text-[#5C5350] text-base leading-relaxed font-normal">
            Everything you need to know about booking private cabs, train station pickups, hill safety, and temple halts.
          </p>
        </div>

        <div className="space-y-3.5 max-w-2xl mx-auto relative z-10">
          {faqsList.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#FAF6EF]/70 rounded-2xl border border-[#C5A059]/30 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-lg sm:text-xl font-medium text-[#2C2523]">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#C84B0F] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#7C1D23]' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#5C5350] leading-relaxed border-t border-[#C5A059]/15">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default TravelFaqSection;
