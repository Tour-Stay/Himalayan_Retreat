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
    <section id="faq" className="py-20 sm:py-28 px-3 sm:px-6 bg-gradient-to-b from-[#081E1A] via-[#0D332D] to-[#081E1A] border-b border-[#051713] text-white relative overflow-hidden ambient-glow-forest">
      <Container size="md">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10 space-y-4">
          <p className="editorial-eyebrow">
            Traveler Guidance &bull; Essential Information
          </p>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl text-white font-semibold tracking-normal leading-tight sm:leading-snug">
            Frequently Asked Questions
          </h2>

          <div className="w-20 h-0.5 bg-[#EAA722] mx-auto my-3"></div>

          <p className="text-base sm:text-lg lg:text-[19px] text-[#FAF5EC]/90 leading-[1.8] sm:leading-[1.85] font-normal">
            Helpful answers regarding Kainchi Dham visits, room heating in winter, regional dining, and station cab pickups.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 max-w-3xl mx-auto relative z-10">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;

            return (
              <div
                key={idx}
                className="bg-[#061814] rounded-2xl border border-[#EAA722]/30 hover:border-[#EAA722]/60 overflow-hidden transition-all shadow-md group"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-heading text-lg sm:text-xl font-medium text-white group-hover:text-[#EAA722] transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <span className={`text-2xl text-[#EAA722] transition-transform duration-300 flex-shrink-0 font-light ${isOpen ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 pt-2 text-base sm:text-[17px] text-[#FAF5EC]/90 leading-[1.8] border-t border-[#EAA722]/20 font-normal">
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
