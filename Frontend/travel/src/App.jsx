import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnnouncementBar, BackToTop, SiteSettingsProvider, useSiteSettings } from '@shared';
import TravelNavbar from './components/TravelNavbar';
import TravelFooter from './components/TravelFooter';
import TravelHome from './pages/TravelHome';
import AllCabs from './pages/AllCabs';
import TravelBookingConfirmation from './pages/TravelBookingConfirmation';
import FareCalculatorPage from './pages/FareCalculatorPage';

function TravelAppContent() {
  const { settings } = useSiteSettings();
  const announcement = settings?.announcement;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C2523] font-sans flex flex-col selection:bg-[#EAA722]/30 selection:text-[#541508]">
      {/* 1. Top Announcement Bar (like Hotel & Landing) */}
      {announcement?.enabled !== false && (
        <AnnouncementBar
          message={announcement?.message || "Reliable Mountain Cabs at 6,942 Feet: Fixed Honest Fares & Local Pahadi Drivers."}
          linkText={announcement?.linkText || "Check Cab Fares"}
          linkHref={announcement?.linkHref || "/calculator"}
        />
      )}

      {/* 2. Navigation Bar matching Hotel style */}
      <TravelNavbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<TravelHome />} />
          <Route path="/cabs" element={<AllCabs />} />
          <Route path="/calculator" element={<FareCalculatorPage />} />
          <Route path="/fare-calculator" element={<FareCalculatorPage />} />
          <Route path="/booking-confirmation" element={<TravelBookingConfirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Custom Luxury Footer */}
      <TravelFooter />

      {/* Global Utilities */}
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
      <Router>
        <TravelAppContent />
      </Router>
    </SiteSettingsProvider>
  );
}

export default App;
