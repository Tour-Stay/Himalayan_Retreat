import { useState } from 'react';
import { Container, SectionHeading } from '@shared';
import { faqsData } from '../data/landingData';

const cleanAmp = (text) => {
  if (typeof text !== 'string') return text;
  const parts = text.split('&');
  if (parts.length === 1) return text;
  return parts.reduce((acc, part, idx) => {
    if (idx === 0) return [part];
    return [...acc, <span key={idx} className="font-sans font-light">&amp;</span>, part];
  }, []);
};

const VisitorFaqSection = () => {
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 bg-[#FAF6EF]/60 border-b border-[#C5A059]/20">
      <Container size="md">
        <SectionHeading
          subtitle="Help & Details"
          title="Frequently Asked Questions"
          description="Helpful information on visiting Kasar Devi, traveling to Kainchi Dham, room heating in winter, and cab pickups."
        />

        <div className="mt-10 space-y-3.5 max-w-2xl mx-auto">
          {faqsData.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;

            return (
              <div
                key={idx}
                className="bg-[#FDFBF7] rounded-xl border border-[#C5A059]/30 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-base sm:text-lg font-medium text-[#2C2523]">
                    {cleanAmp(faq.q)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-[#C5A059] transition-transform duration-200 flex-shrink-0 ${
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
                  <div className="px-5 pb-5 pt-2 text-sm sm:text-base text-[#5C5350] leading-relaxed border-t border-[#C5A059]/15 animate-dropdown">
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

export default VisitorFaqSection;
