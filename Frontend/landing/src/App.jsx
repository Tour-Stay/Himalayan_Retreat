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
import RouteDistancePlanner from './components/RouteDistancePlanner';
import HotelGatewaySection from './components/HotelGatewaySection';
import TravelGatewaySection from './components/TravelGatewaySection';
import PilgrimageItinerary from './components/PilgrimageItinerary';
import VisitorFaqSection from './components/VisitorFaqSection';
import ConciergeEnquirySection from './components/ConciergeEnquirySection';
import { LANDING_CONTENT } from './content/landing.content';

function LandingPageContent() {
  const { settings } = useSiteSettings();
  const announcement = settings?.announcement || LANDING_CONTENT.announcement;

  useEffect(() => {
    const cleanup = initAutoScrollReveal();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col selection:bg-gold/25 selection:text-maroon text-base sm:text-lg">
      {/* 1. Top Announcement Bar (Dynamic from CMS) */}
      {announcement.enabled !== false && (
        <AnnouncementBar
          message={announcement.message || LANDING_CONTENT.announcement.message}
          linkText={announcement.linkText || LANDING_CONTENT.announcement.linkText}
          linkHref={announcement.linkHref || LANDING_CONTENT.announcement.linkHref}
          className="bg-gradient-to-r from-[#9E3304] via-[#B83E0A] to-[#7C1D23] border-b border-[#DFCA9B]/35 shadow-sm"
        />
      )}

      {/* 2. Live Horizontal Navbar (Desktop Bar + Hover/Click Dropdowns + 2 Action Buttons) */}
      <LandingNavbar />

      <main className="flex-1">
        {/* 3. Hero: Sri Neem Karoli Baba Maharaj */}
        <HeroMaharajji />

        {/* 4. Dev Bhoomi & Crank's Ridge Heritage */}
        <DevBhoomiSection />

        {/* 5. Real Route & Distance Guide */}
        <RouteDistancePlanner />

        {/* 6. Client Gateway 1: The Boutique Hotel */}
        <HotelGatewaySection />

        {/* 7. Client Gateway 2: Chauffeured Mountain Expeditions */}
        <TravelGatewaySection />

        {/* 8. Curated 3-Day Pilgrimage Itinerary */}
        <PilgrimageItinerary />

        {/* 9. Authentic Visitor FAQ Accordion */}
        <VisitorFaqSection />

        {/* 10. Almora Concierge Direct WhatsApp Enquiry */}
        <ConciergeEnquirySection />
      </main>

      {/* 11. Reverent Site Footer & Back to Top */}
      <SiteFooter />
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
