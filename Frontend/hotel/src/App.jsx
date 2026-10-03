import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  AnnouncementBar,
  BackToTop,
  initAutoScrollReveal,
} from '@shared';
import HotelNavbar from './components/HotelNavbar';
import HotelFooter from './components/HotelFooter';
import HotelHome from './pages/HotelHome';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
  useEffect(() => {
    const cleanup = initAutoScrollReveal();
    return cleanup;
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col selection:bg-gold/25 selection:text-maroon text-base sm:text-lg">
        {/* 1. Top Announcement Bar */}
        <AnnouncementBar
          message="Warm Heated Rooms at 6,942 Feet: 180° Snow Peak Views & Cozy Pine Chalets."
          linkText="Check Room Rates"
          linkHref="/#book"
        />

        {/* 2. Live Luxury Horizontal Hotel Navbar */}
        <HotelNavbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HotelHome />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          </Routes>
        </main>

        {/* 3. Dedicated Luxury Hotel Footer & Back to Top */}
        <HotelFooter />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
