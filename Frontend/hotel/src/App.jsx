import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  AnnouncementBar,
  BackToTop,
  initAutoScrollReveal,
  SiteSettingsProvider,
  useSiteSettings,
} from '@shared';
import HotelNavbar from './components/HotelNavbar';
import HotelFooter from './components/HotelFooter';
import HotelHome from './pages/HotelHome';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import BookingConfirmation from './pages/BookingConfirmation';

function HotelAppContent() {
  const { settings } = useSiteSettings();
  const announcement = settings?.announcement;

  useEffect(() => {
    const cleanup = initAutoScrollReveal();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col selection:bg-gold/25 selection:text-maroon text-base sm:text-lg">
      {/* 1. Top Announcement Bar */}
      {announcement?.enabled !== false && (
        <AnnouncementBar
          message={announcement?.message || "Warm Heated Rooms at 6,942 Feet: 180° Snow Peak Views & Cozy Pine Chalets."}
          linkText={announcement?.linkText || "Check Room Rates"}
          linkHref={announcement?.linkHref || "/#book"}
        />
      )}

      {/* 2. Live Luxury Horizontal Hotel Navbar */}
      <HotelNavbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HotelHome />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 3. Dedicated Luxury Hotel Footer & Back to Top */}
      <HotelFooter />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <SiteSettingsProvider>
      <Router>
        <HotelAppContent />
      </Router>
    </SiteSettingsProvider>
  );
}

export default App;
