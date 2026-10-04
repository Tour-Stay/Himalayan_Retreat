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
    <section id="faq" className="py-16 sm:py-20 px-4 bg-[#FAF5EC] border-b border-[#EAA722]/30 relative">
      <Container size="md">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 reveal">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAA722] text-[#541508] text-xs font-mono font-bold tracking-widest uppercase mb-2.5 shadow-xs">
            ॥ पावन यात्रा प्रश्नोत्तरी ॥ • MOUNTAIN CAB GUIDE &amp; FAQS
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#541508] font-normal">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-[#541508]/85 text-sm sm:text-base font-light leading-relaxed">
            Everything you need to know about booking private cabs, train station pickups, hill safety, and temple halts.
          </p>
        </div>

        <div className="space-y-3.5 max-w-2xl mx-auto relative z-10 reveal">
          {faqsList.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#EAA722]/25 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-lg sm:text-xl font-medium text-[#541508]">
                    {faq.q}
                  </span>
                  <svg
                    className={`w-5 h-5 text-[#EAA722] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#541508]' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#5C5350] leading-relaxed border-t border-[#EAA722]/20 font-light">
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
