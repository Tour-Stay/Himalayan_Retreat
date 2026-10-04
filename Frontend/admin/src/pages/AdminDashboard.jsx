import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthContext, Loader } from '@shared';
import useAdminData from '../hooks/useAdminData';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import KpiCards from '../components/KpiCards';
import RoomManager from '../components/RoomManager';
import HotelBookingManager from '../components/HotelBookingManager';
import TravelBookingManager from '../components/TravelBookingManager';
import TourManager from '../components/TourManager';
import ReviewManager from '../components/ReviewManager';
import CompanyManager from '../components/CompanyManager';
import FleetManager from '../components/FleetManager';
import RouteManager from '../components/RouteManager';
import AnnouncementManager from '../components/AnnouncementManager';
import PolicyManager from '../components/PolicyManager';
import YieldManager from '../components/YieldManager';
import QuickBookingModal from '../components/QuickBookingModal';
import { ADMIN_ROUTES, ADMIN_TAB_TITLES, resolveTabFromLocation } from '../constants/adminRoutes';

const AdminDashboard = ({ tab }) => {
  const { isAdminLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { tabId } = useParams();

  // Resolve current active tab from prop, param, or URL location
  const activeTab =
    tab ||
    (tabId ? resolveTabFromLocation(tabId) : resolveTabFromLocation(location.pathname, location.search));

  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);

  const handleSelectTab = (newTabId) => {
    const target = ADMIN_ROUTES[newTabId] || `/${newTabId}`;
    if (location.pathname !== target) {
      navigate(target);
    }
  };

  // Sync document title with current active section
  useEffect(() => {
    if (ADMIN_TAB_TITLES[activeTab]) {
      document.title = ADMIN_TAB_TITLES[activeTab];
    }
  }, [activeTab]);

  const {
    rooms,
    setRooms,
    hotelBookings,
    setHotelBookings,
    travelBookings,
    setTravelBookings,
    tours,
    setTours,
    reviews,
    setReviews,
    stats,
    loading,
    refreshData,
  } = useAdminData();

  // Redirect if unauthorized
  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/', { state: { from: location } });
    }
  }, [isAdminLoggedIn, navigate, location]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF7F2] text-[#2C2523] flex flex-col font-sans selection:bg-[#C5A059]/25 selection:text-[#7C1D23]">
      {/* Strict Fixed Header */}
      <AdminHeader
        onRefresh={refreshData}
        isRefreshing={loading}
        onNewBooking={() => setIsQuickBookingOpen(true)}
      />

      {/* Strict Workspace: Fixed Sidebar + Scrollable Content Area */}
      <div className="flex-1 w-full overflow-hidden flex flex-col lg:flex-row min-h-0">
        {/* Strict Sticky Sidebar (No left gap) */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          stats={stats}
        />

        {/* Scrollable Middle Content Page ONLY */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-w-0 bg-[#FAF7F2] admin-table-container">
          {/* Top KPI Metrics Strip */}
          <KpiCards stats={stats} onSelectTab={handleSelectTab} />

          {/* Tab Header Banner */}
          <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-[#C5A059]/30">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-cinzel font-semibold block mb-0.5">
                Staff Operations Portal
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#2C2523] tracking-tight">
                {activeTab === 'rooms' && 'Suites & Mountain Rooms'}
                {activeTab === 'hotel-bookings' && 'Hotel Room Reservations'}
                {activeTab === 'travel-bookings' && 'Travel & Mountain Cab Inquiries'}
                {activeTab === 'tours' && 'Curated Tour Packages'}
                {activeTab === 'reviews' && 'Guest Experience Reviews'}
                {activeTab === 'company' && 'Company Profile & Universal Contacts'}
                {activeTab === 'fleet' && 'Cab Fleet Tariffs & Per-KM Matrix'}
                {activeTab === 'routes' && 'Temple & Sightseeing Route Fares'}
                {activeTab === 'announcements' && 'Notice Ribbon & Devotional Hero'}
                {activeTab === 'policies' && 'Resort Policies, Dining Hours & FAQs'}
              </h2>
              <p className="text-xs text-[#5C5350] mt-1">
                {activeTab === 'rooms' && 'Manage suite descriptions, pricing, views, and live availability toggles.'}
                {activeTab === 'hotel-bookings' && 'Monitor reservations, update booking progression, and coordinate via WhatsApp.'}
                {activeTab === 'travel-bookings' && 'Track private cab routes, update traveler statuses, and review payment settlements.'}
                {activeTab === 'tours' && 'Create and edit multi-day pilgrimage and sightseeing packages across Kumaon.'}
                {activeTab === 'reviews' && 'Moderate customer testimonials, inspect submitted photos, and publish to guest sites.'}
                {activeTab === 'company' && 'Update concierge phone, WhatsApp numbers, hotel addresses, and UPI IDs across all sites.'}
                {activeTab === 'fleet' && 'Adjust vehicle daily rental rates, per-kilometer tariffs, and fixed railway station transfers.'}
                {activeTab === 'routes' && 'Manage fixed sightseeing fares for Kainchi Dham, Jageshwar, Kathgodam, and Kumaon.'}
                {activeTab === 'announcements' && 'Broadcast seasonal yatra notices, toggle top ribbons, or update opening greetings.'}
                {activeTab === 'policies' && 'Configure front-desk check-in/out hours, kitchen timings, cancellation terms, and FAQs.'}
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#7C1D23] font-cinzel font-semibold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#7C1D23]" />
                <span>Syncing Database...</span>
              </div>
            )}
          </div>

          {/* Active Tab Component */}
          {loading && rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#5C5350]">
              <Loader />
              <p className="mt-4 text-xs font-cinzel uppercase tracking-wider text-[#C5A059] font-semibold">
                Connecting to MongoDB Atlas...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'rooms' && (
                <RoomManager
                  rooms={rooms}
                  setRooms={setRooms}
                  onRefresh={refreshData}
                />
              )}

              {activeTab === 'hotel-bookings' && (
                <HotelBookingManager
                  bookings={hotelBookings}
                  setBookings={setHotelBookings}
                  onRefresh={refreshData}
                />
              )}

              {activeTab === 'travel-bookings' && (
                <TravelBookingManager
                  bookings={travelBookings}
                  setBookings={setTravelBookings}
                  onRefresh={refreshData}
                />
              )}

              {activeTab === 'tours' && (
                <TourManager
                  tours={tours}
                  setTours={setTours}
                  onRefresh={refreshData}
                />
              )}

              {activeTab === 'reviews' && (
                <ReviewManager
                  reviews={reviews}
                  setReviews={setReviews}
                  onRefresh={refreshData}
                />
              )}

              {activeTab === 'company' && <CompanyManager />}
              {activeTab === 'fleet' && <FleetManager />}
              {activeTab === 'routes' && <RouteManager />}
              {activeTab === 'announcements' && <AnnouncementManager />}
              {activeTab === 'policies' && <PolicyManager />}
              {activeTab === 'yield' && <YieldManager rooms={rooms} />}
            </>
          )}
        </main>
      </div>

      {/* Front-Desk Quick Reservation Modal */}
      <QuickBookingModal
        isOpen={isQuickBookingOpen}
        onClose={() => setIsQuickBookingOpen(false)}
        onBookingCreated={refreshData}
        rooms={rooms}
      />
    </div>
  );
};

export default AdminDashboard;
