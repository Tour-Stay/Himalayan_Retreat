import { useEffect } from 'react';
import {
  AnnouncementBar,
  SiteFooter,
  BackToTop,
  initAutoScrollReveal,
  SiteSettingsProvider,
  useSiteSettings,
} from '@shared';

import LandingNavbar from './components/LandingNavbar';
import HeroMaharajji from './components/HeroMaharajji';
import DevBhoomiSection from './components/DevBhoomiSection';
import ClientCompanySection from './components/ClientCompanySection';
import ThingsToDoSection from './components/ThingsToDoSection';
import VisitorFaqSection from './components/VisitorFaqSection';
import ConciergeEnquirySection from './components/ConciergeEnquirySection';
import MobileActionDock from './components/MobileActionDock';
import { LANDING_CONTENT } from './content/landing.content';

function LandingPageContent() {
  const { settings } = useSiteSettings();
  const announcement = settings?.announcement || LANDING_CONTENT?.announcement || { enabled: false };

  useEffect(() => {
    const cleanup = initAutoScrollReveal();
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200);
      }
    }
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-[#12433B] text-white font-sans flex flex-col selection:bg-[#EAA722] selection:text-[#12433B] overflow-x-hidden w-full max-w-full">
      {/* 1. Optional Notice Bar (Dynamic from CMS) */}
      {announcement?.enabled && (
        <AnnouncementBar
          message={announcement.message || LANDING_CONTENT?.announcement?.message || ''}
          linkText={announcement.linkText || LANDING_CONTENT?.announcement?.linkText || ''}
          linkHref={announcement.linkHref || LANDING_CONTENT?.announcement?.linkHref || '#enquiry'}
          className="bg-[#3D0F06] text-[#FAF5EC] border-b border-[#EAA722]/30 py-2 text-xs sm:text-sm"
        />
      )}

      {/* 2. Top Utility & Main Ashram Navigation */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 3. Hero: Sri Neem Karoli Baba Maharaj & Sacred Carousel */}
        <HeroMaharajji />

        {/* 4. Dev Bhoomi & Crank's Ridge Heritage (Holy Shrines) */}
        <DevBhoomiSection />

        {/* 5. Client Company: The Kasar Himalayan Heights, What They Do & Hotel Showcase */}
        <ClientCompanySection />

        {/* 6. Things to Do & Safe Mountain Expedition (Mandir Mala 3D Diorama) */}
        <ThingsToDoSection />

        {/* 8. Authentic Visitor FAQ Accordion */}
        <VisitorFaqSection />

        {/* 9. Almora Concierge Direct WhatsApp Enquiry */}
        <ConciergeEnquirySection />
      </main>

      {/* 10. Reverent Site Footer & Back to Top */}
      <SiteFooter />
      <MobileActionDock />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
      <LandingPageContent />
    </SiteSettingsProvider>
  );
}

export default App;
