import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SiteHeader, SiteFooter, WhatsAppButton, BackToTop } from '@shared';
import HotelHome from './pages/HotelHome';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col selection:bg-gold/20 selection:text-maroon">
        <SiteHeader currentApp="hotel" />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HotelHome />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          </Routes>
        </main>
        <SiteFooter />
        <WhatsAppButton />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
