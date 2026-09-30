import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TravelNavbar from './components/TravelNavbar';
import TravelFooter from './components/TravelFooter';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import AllRooms from './pages/AllRooms';
import RoomDetails from './pages/RoomDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TourAndTravel from './pages/TourAndTravel';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isTravelPage = location.pathname.startsWith('/travel') || location.pathname.startsWith('/tours');
  const isAdminPage = location.pathname.startsWith('/admin');

  // Admin pages have their own dedicated executive navigation & layout
  if (isAdminPage) {
    return <main className="min-h-screen bg-cream">{children}</main>;
  }

  return (
    <>
      {isTravelPage ? <TravelNavbar /> : <Navbar />}
      <main>{children}</main>
      {isTravelPage ? <TravelFooter /> : <Footer />}
      <WhatsAppButton />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<AllRooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/travel" element={<TourAndTravel />} />
            <Route path="/tours" element={<TourAndTravel />} />
            <Route path="/booking-success" element={<BookingConfirmation />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
