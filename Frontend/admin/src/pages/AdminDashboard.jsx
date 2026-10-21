import { useState, useEffect, useContext, lazy, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '@shared';
import { useAdminData } from '../hooks/useAdminData';
import { AdminHeader } from '../components/AdminHeader';
import { AdminSidebar } from '../components/AdminSidebar';
import { KpiCards } from '../components/KpiCards';
import { QuickBookingModal } from '../components/QuickBookingModal';
import { ADMIN_ROUTES, ADMIN_TAB_TITLES } from '../constants/adminRoutes';

// Lazy-loaded management panels for instant code-splitting
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

const Loader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 rounded-full border-2 border-[#0F172A]/30 border-t-[#0F172A] animate-spin" />
  </div>
);

export const AdminDashboard = () => {
  const { isAdminLoggedIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Find active tab from current route path
  const currentPath = location.pathname;
  const activeTabEntry = Object.entries(ADMIN_ROUTES).find(
    ([, route]) => route === currentPath
  );
  const activeTab = activeTabEntry ? activeTabEntry[0] : 'hotel-bookings';

  const [siteScope, setSiteScope] = useState('all'); // 'all' | 'hotel' | 'travel'
  const [isQuickBookingOpen, setIsQuickBookingOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

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


  return (
    <div className="h-screen w-screen overflow-hidden bg-[#97D7FF] text-[#0F172A] flex flex-col font-sans selection:bg-[#0F172A]/20 selection:text-[#0F172A]">
      {/* Top Navbar (#ACC5A6) */}
      <AdminHeader
        onRefresh={refreshData}
        isRefreshing={loading}
        onNewBooking={() => setIsQuickBookingOpen(true)}
        siteScope={siteScope}
        onSelectScope={setSiteScope}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        onToggleDesktopSidebar={() => setIsDesktopSidebarCollapsed((prev) => !prev)}
      />

      {/* Strict Workspace: Fixed Sidebar (#AEAC78) + Scrollable Content Area (#97D7FF) */}
      <div className="flex-1 w-full overflow-hidden flex flex-col lg:flex-row min-h-0">
        {/* Desktop Sidebar & Mobile Bottom Navigation Bar / Management Drawer */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          stats={stats}
          siteScope={siteScope}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
          isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
          onToggleDesktopSidebar={() => setIsDesktopSidebarCollapsed((prev) => !prev)}
        />

        {/* Scrollable Middle Content Page ONLY (#97D7FF Background) */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 min-w-0 bg-[#97D7FF] admin-table-container pb-24 lg:pb-8">
          {/* Top KPI Metrics Strip */}
          <KpiCards stats={stats} onSelectTab={handleSelectTab} />

          {/* Tab Header Banner (Clean White Architectural Card on #97D7FF) */}
          <div className="bg-white p-4 sm:p-5 border border-slate-300 shadow-sm mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#242A10] font-cinzel font-bold inline-block px-2 py-0.5 bg-[#AEAC78]/25 border border-[#AEAC78]/50 mb-1">
                The Kasar Himalayan Heights • Operations Desk
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
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
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
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
              <div className="flex items-center gap-2 text-xs text-[#0F172A] font-cinzel font-bold animate-pulse self-start sm:self-center bg-slate-100 px-3 py-1.5 border border-slate-300 shrink-0 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Syncing Database...</span>
              </div>
            )}
          </div>

          {/* Active Tab Component */}
          {loading && rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-700 bg-white/70 border border-sky-300/60 p-8 shadow-xs">
              <Loader />
              <p className="mt-4 text-xs font-cinzel uppercase tracking-wider text-[#0F172A] font-semibold">
                Connecting to MongoDB Atlas...
              </p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center py-16 text-slate-700 bg-white/70 border border-sky-300/60 p-8 shadow-xs">
                  <Loader />
                  <p className="mt-3 text-xs font-cinzel uppercase tracking-wider text-[#0F172A] font-semibold">
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
