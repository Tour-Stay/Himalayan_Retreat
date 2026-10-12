import { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthContext, Loader } from '@shared';
import useAdminData from '../hooks/useAdminData';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import KpiCards from '../components/KpiCards';
import QuickBookingModal from '../components/QuickBookingModal';
import { ADMIN_ROUTES, ADMIN_TAB_TITLES, resolveTabFromLocation } from '../constants/adminRoutes';

// Lazy-loaded tab panels — only downloaded when the admin navigates to that tab
const RoomManager = lazy(() => import('../components/RoomManager'));
const HotelBookingManager = lazy(() => import('../components/HotelBookingManager'));
const TravelBookingManager = lazy(() => import('../components/TravelBookingManager'));
const TourManager = lazy(() => import('../components/TourManager'));
const ReviewManager = lazy(() => import('../components/ReviewManager'));
const CompanyManager = lazy(() => import('../components/CompanyManager'));
const FleetManager = lazy(() => import('../components/FleetManager'));
const DriverManager = lazy(() => import('../components/DriverManager'));
const RouteManager = lazy(() => import('../components/RouteManager'));
const AnnouncementManager = lazy(() => import('../components/AnnouncementManager'));
const LandingCmsManager = lazy(() => import('../components/LandingCmsManager'));
const PolicyManager = lazy(() => import('../components/PolicyManager'));
const YieldManager = lazy(() => import('../components/YieldManager'));

const AdminDashboard = ({ tab }) => {
  const { isAdminLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { tabId } = useParams();

  // Multi-Site Active Scope Filter ('all' | 'landing' | 'hotel' | 'travel')
  const [siteScope, setSiteScope] = useState('all');

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
    <div className="h-screen w-screen overflow-hidden bg-[#FAF7F2] text-[#2C2523] flex flex-col font-sans selection:bg-[#EAA722]/30 selection:text-[#073125]">
      {/* Strict Fixed Header */}
      <AdminHeader
        onRefresh={refreshData}
        isRefreshing={loading}
        onNewBooking={() => setIsQuickBookingOpen(true)}
        siteScope={siteScope}
        onSelectScope={setSiteScope}
      />

      {/* Strict Workspace: Fixed Sidebar + Scrollable Content Area */}
      <div className="flex-1 w-full overflow-hidden flex flex-col lg:flex-row min-h-0">
        {/* Strict Sticky Sidebar (No left gap) */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          stats={stats}
          siteScope={siteScope}
        />

        {/* Scrollable Middle Content Page ONLY */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-w-0 bg-[#FAF7F2] admin-table-container">
          {/* Top KPI Metrics Strip */}
          <KpiCards stats={stats} onSelectTab={handleSelectTab} />

          {/* Tab Header Banner */}
          <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-[#EAA722]/30">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#073125] font-cinzel font-bold block mb-0.5">
                The Kasar Himalayan Heights • Management Desk
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#073125] tracking-tight">
                {activeTab === 'hotel-bookings' && 'Hotel Room Reservations'}
                {activeTab === 'rooms' && 'Rooms & Nightly Rates'}
                {activeTab === 'yield' && 'Weekend & Seasonal Rates'}
                {activeTab === 'travel-bookings' && 'Cab Bookings & Driver Dispatch'}
                {activeTab === 'fleet' && 'Cab Fleet & Rates'}
                {activeTab === 'drivers' && 'Driver Batta, Plain vs Mountain Tariffs & Roster'}
                {activeTab === 'routes' && 'Temple & Sightseeing Fares'}
                {activeTab === 'tours' && 'Tour Packages'}
                {activeTab === 'announcements' && 'Website Notice Banner'}
                {activeTab === 'landing-cms' && 'Main Website Page Content'}
                {activeTab === 'company' && 'Phone Numbers, WhatsApp & Addresses'}
                {activeTab === 'policies' && 'Hotel Rules, Timings & FAQs'}
                {activeTab === 'reviews' && 'Guest Testimonials & Reviews'}
              </h2>
              <p className="text-xs text-[#5C5350] mt-1">
                {activeTab === 'hotel-bookings' && 'View new guest room bookings, confirm reservations, message guests on WhatsApp, and print bills.'}
                {activeTab === 'rooms' && 'Change room prices, update photos or details, and turn rooms ON or OFF when booked.'}
                {activeTab === 'yield' && 'Set extra charges for busy weekends (Friday & Saturday) or winter peak holiday dates.'}
                {activeTab === 'travel-bookings' && 'View incoming taxi pickup requests, assign your drivers, and track trip status.'}
                {activeTab === 'fleet' && 'Set vehicle daily rates and per-kilometer charges for Swift Dzire, Innova, and Minibus.'}
                {activeTab === 'drivers' && 'Set daily driver hill allowances, short-trip plain vs mountain rates, night halt charges, guidelines, and manage your chauffeur roster.'}
                {activeTab === 'routes' && 'Set fixed taxi fares for trips to Kainchi Dham, Jageshwar, Kathgodam Station, and Nainital.'}
                {activeTab === 'tours' && 'Create and edit multi-day pilgrimage and sightseeing packages across Kumaon.'}
                {activeTab === 'announcements' && 'Write a notice or alert message that will display across the top of your websites.'}
                {activeTab === 'landing-cms' && 'Edit the welcome message, Neem Karoli Baba quote, 3-day pilgrimage itinerary, and visitor FAQs.'}
                {activeTab === 'company' && 'Update your hotel phone number, WhatsApp link, UPI ID, and property address.'}
                {activeTab === 'policies' && 'Set check-in time, check-out time, restaurant meal hours, and cancellation terms.'}
                {activeTab === 'reviews' && 'Approve guest reviews so they appear on your website, or hide unapproved comments.'}
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#073125] font-cinzel font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#EAA722]" />
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
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center py-16 text-[#5C5350]">
                  <Loader />
                  <p className="mt-3 text-xs font-cinzel uppercase tracking-wider text-[#C5A059] font-semibold">
                    Loading Module...
                  </p>
                </div>
              }
            >
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
              {activeTab === 'drivers' && <DriverManager />}
              {activeTab === 'routes' && <RouteManager />}
              {activeTab === 'announcements' && <AnnouncementManager />}
              {activeTab === 'landing-cms' && <LandingCmsManager />}
              {activeTab === 'policies' && <PolicyManager />}
              {activeTab === 'yield' && <YieldManager rooms={rooms} />}
            </Suspense>
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
