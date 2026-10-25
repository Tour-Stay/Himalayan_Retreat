import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  BackToTop,
  ScrollManager,
  initAutoScrollReveal,
  SiteSettingsProvider,
} from '@shared';
import HotelNavbar from './components/HotelNavbar';
import HotelFooter from './components/HotelFooter';
import HotelHome from './pages/HotelHome';
import HotelReviews from './pages/HotelReviews';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import BookRoom from './pages/BookRoom';
import BookingConfirmation from './pages/BookingConfirmation';

function HotelAppContent() {
  useEffect(() => {
    const cleanup = initAutoScrollReveal();
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f1] text-[#1d2c28] font-sans flex flex-col selection:bg-[#efb83f]/30 selection:text-[#0b3733]">
      {/* 0. Universal Scroll & Hash Navigation Manager */}
      <ScrollManager />

      {/* 1. Header with reference topline and navigation */}
      <HotelNavbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HotelHome />} />
          <Route path="/reviews" element={<HotelReviews />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/book" element={<BookRoom />} />
          <Route path="/book-room" element={<Navigate to="/book" replace />} />
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
