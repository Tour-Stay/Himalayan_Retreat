import { useState } from 'react';
import { Container, useSiteSettings } from '@shared';
import { faqsData } from '../data/landingData';

const VisitorFaqSection = () => {
  const { settings } = useSiteSettings();
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const faqs =
    settings?.landingContent?.faqs && settings.landingContent.faqs.length > 0
      ? settings.landingContent.faqs
      : faqsData;

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 bg-[#541508] border-b border-[#3D0F06] text-white relative overflow-hidden">
      <Container size="md">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <p className="font-serif text-sm uppercase tracking-widest text-[#EAA722] font-semibold mb-3">
            ॥ जिज्ञासा एवं समाधान • Pilgrim Guidance ॥
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-tight mb-4">
            Frequently Asked Questions
          </h2>

          <div className="w-20 h-0.5 bg-[#EAA722] mx-auto my-4"></div>

          <p className="font-serif text-lg sm:text-xl text-[#FAF5EC]/90 leading-relaxed font-normal">
            Helpful answers regarding Kainchi Dham darshan timings, room heating in winter, satvik dining, and station cab pickups.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 max-w-3xl mx-auto relative z-10">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;

            return (
              <div
                key={idx}
                className="bg-[#3D0F06] rounded-2xl border border-[#EAA722]/30 overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-7 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-xl sm:text-2xl font-normal text-white">
                    {faq.q}
                  </span>
                  <span className={`text-2xl font-serif text-[#EAA722] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-7 pb-6 pt-1 text-base sm:text-lg text-[#FAF5EC]/85 leading-relaxed border-t border-[#EAA722]/20 font-serif font-normal">
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
