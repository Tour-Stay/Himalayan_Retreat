import { useEffect } from 'react';
import {
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

function LandingPageContent() {
  const { settings } = useSiteSettings();

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
