import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnnouncementBar, BackToTop } from '@shared';
import TravelNavbar from './components/TravelNavbar';
import TravelFooter from './components/TravelFooter';
import TravelHome from './pages/TravelHome';
import AllCabs from './pages/AllCabs';
import TravelBookingConfirmation from './pages/TravelBookingConfirmation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FAF7F2] text-[#2C2523] font-sans flex flex-col selection:bg-[#C5A059]/25 selection:text-[#7C1D23]">
        {/* 1. Top Announcement Bar (like Hotel & Landing) */}
        <AnnouncementBar
          message="Reliable Mountain Cabs at 6,942 Feet: Fixed Honest Fares & Local Pahadi Drivers."
          linkText="Check Cab Fares"
          linkHref="/#calculator"
        />

        {/* 2. Navigation Bar matching Hotel style */}
        <TravelNavbar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<TravelHome />} />
            <Route path="/cabs" element={<AllCabs />} />
            <Route path="/booking-confirmation" element={<TravelBookingConfirmation />} />
          </Routes>
        </main>

        {/* Custom Luxury Footer */}
        <TravelFooter />

        {/* Global Utilities */}
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
