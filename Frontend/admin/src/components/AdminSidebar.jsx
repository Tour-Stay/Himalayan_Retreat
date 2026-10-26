import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_URLS, AuthContext } from '@shared';
import { ADMIN_ROUTES } from '../constants/adminRoutes';

export const AdminSidebar = ({
  activeTab,
  onSelectTab,
  stats = {},
  isMobileDrawerOpen,
  onCloseMobileDrawer,
  onOpenMobileDrawer,
  isDesktopSidebarCollapsed,
  onToggleDesktopSidebar,
}) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sections = [
    {
      title: 'Hotel & Stays',
      items: [
        {
          id: 'hotel-bookings',
          label: 'Room Bookings',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          count: stats.hotelBookingsCount,
          alertCount: stats.pendingHotelBookings,
        },
        {
          id: 'rooms',
          label: 'Rooms & Pricing',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
          count: stats.totalRooms,
        },
        {
          id: 'yield',
          label: 'Weekend & Season Rates',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Cabs & Drivers',
      items: [
        {
          id: 'travel-bookings',
          label: 'Cab Bookings',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          ),
          count: stats.travelBookingsCount,
          alertCount: stats.pendingTravelBookings,
        },
        {
          id: 'fleet',
          label: 'Cab Fleet & Rates',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          id: 'drivers',
          label: 'Drivers & Batta',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        },
        {
          id: 'routes',
          label: 'Temple & Route Fares',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        {
          id: 'tours',
          label: 'Tour Packages',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          count: stats.toursCount,
        },
      ],
    },
    {
      title: 'Website Settings',
      items: [
        {
          id: 'landing-cms',
          label: 'Mandir Mala & FAQs',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ),
        },
        {
          id: 'company',
          label: 'Contact & UPI Info',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          ),
        },
        {
          id: 'policies',
          label: 'Hotel & Cab Policies',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          id: 'reviews',
          label: 'Customer Reviews',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ),
          count: stats.reviewsCount,
          alertCount: stats.pendingReviewsCount,
        },
      ],
    },
  ];

  const handleMobileNavSelect = (tabId) => {
    if (onSelectTab) onSelectTab(tabId);
    if (onCloseMobileDrawer) onCloseMobileDrawer();
  };

  return (
    <>
      {/* ── 1. Desktop Sidebar (#073125) - Supports Expanded & Minimized Mode ── */}
      <aside
        className={`hidden lg:flex shrink-0 bg-[#073125] border-r border-[#052219] flex-col justify-between h-full overflow-y-auto z-20 text-[#DCE9E4] transition-all duration-200 ${
          isDesktopSidebarCollapsed ? 'w-16 xl:w-18 p-2' : 'w-64 xl:w-72 p-4'
        }`}
      >
        <div className="space-y-4">
          {/* Top Collapse/Expand Toggle Header on Desktop */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            {!isDesktopSidebarCollapsed ? (
              <>
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#C9F24D] font-bold">
                  Operations Desk
                </span>
                <button
                  type="button"
                  onClick={onToggleDesktopSidebar}
                  className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 text-[#DCE9E4] text-[10px] font-cinzel font-bold border border-white/15 transition cursor-pointer shadow-2xs"
                  title="Minimize Sidebar to icons (Widescreen Mode)"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                  <span>Collapse</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onToggleDesktopSidebar}
                className="w-full flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 text-[#DCE9E4] border border-white/15 transition cursor-pointer shadow-2xs"
                title="Expand Sidebar (Show full titles)"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Section Groups */}
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {/* Section Header (Hidden when collapsed) */}
              {!isDesktopSidebarCollapsed && (
                <div className="flex items-center justify-between px-2.5 py-1 text-[11px] font-cinzel font-bold text-[#C9F24D] uppercase tracking-wider border-b border-white/10">
                  <span>{section.title}</span>
                  {section.badge && (
                    <span className="text-[10px] text-white/50 font-sans font-medium">
                      {section.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const targetRoute = ADMIN_ROUTES[item.id] || `/${item.id}`;

                  if (isDesktopSidebarCollapsed) {
                    // Minimized Icon-Only View
                    return (
                      <Link
                        key={item.id}
                        to={targetRoute}
                        onClick={() => onSelectTab && onSelectTab(item.id)}
                        className={`p-2.5 flex items-center justify-center transition cursor-pointer relative group ${
                          isActive
                            ? 'bg-[#C9F24D] text-[#073125] font-bold shadow-xs border border-[#C9F24D]'
                            : 'text-[#DCE9E4]/80 hover:bg-white/10 hover:text-white'
                        }`}
                        title={`${item.label} (${section.title})`}
                      >
                        <span className={isActive ? 'text-[#073125]' : 'text-[#DCE9E4]'}>
                          {item.icon}
                        </span>

                        {item.alertCount > 0 && (
                          <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </Link>
                    );
                  }

                  // Normal Expanded View
                  return (
                    <Link
                      key={item.id}
                      to={targetRoute}
                      onClick={() => onSelectTab && onSelectTab(item.id)}
                      className={`flex items-center justify-between gap-3 px-3 py-2 text-xs transition cursor-pointer ${
                        isActive
                          ? 'bg-[#C9F24D] text-[#073125] font-bold shadow-xs border border-[#C9F24D]'
                          : 'text-[#DCE9E4]/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-[#073125]' : 'text-[#DCE9E4]'}>
                          {item.icon}
                        </span>
                        <span className="font-medium tracking-wide">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 ml-2">
                        {item.alertCount > 0 && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold ${
                              isActive
                                ? 'bg-[#073125] text-amber-300 border border-[#073125]/20'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                            }`}
                            title={`${item.alertCount} action items`}
                          >
                            {item.alertCount} New
                          </span>
                        )}

                        {item.count !== undefined && (
                          <span
                            className={`px-2 py-0.5 text-[11px] font-mono font-semibold ${
                              isActive
                                ? 'bg-[#073125] text-[#C9F24D] border border-[#073125]/20'
                                : 'bg-white/10 text-white/90 border border-white/15'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}

                        {item.badgeText && item.count === undefined && (
                          <span
                            className={`px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                              isActive
                                ? 'bg-[#073125] text-[#C9F24D]'
                                : 'bg-white/10 text-[#DCE9E4]/80 border border-white/10'
                            }`}
                          >
                            {item.badgeText}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Desktop Property Info Box */}
        {!isDesktopSidebarCollapsed && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="p-3 bg-black/20 border border-white/10 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-cinzel font-bold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9F24D]" />
                  Hotel Operations Desk
                </span>
                <span className="text-[10px] text-[#C9F24D] font-semibold font-mono">Live</span>
              </div>
              <p className="text-[10px] text-[#DCE9E4]/70 mt-0.5 font-sans">
                Kasar Devi, Almora • 2,116m Elevation
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* ── 2. Mobile Fixed Bottom Navigation Bar (#073125) ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#073125] border-t border-[#052219] h-16 flex items-center justify-around px-2 shadow-2xl">
        
        {/* Tab 1: Bookings */}
        <button
          type="button"
          onClick={() => handleMobileNavSelect('hotel-bookings')}
          className={`flex-1 py-1 flex flex-col items-center justify-center transition relative ${
            activeTab === 'hotel-bookings' ? 'text-[#073125] font-bold bg-[#C9F24D]' : 'text-[#DCE9E4]/75 hover:text-white'
          }`}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {stats.pendingHotelBookings > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                {stats.pendingHotelBookings}
              </span>
            )}
          </div>
          <span className="text-[10px] font-cinzel tracking-wider mt-1">Bookings</span>
        </button>

        {/* Tab 2: Rooms */}
        <button
          type="button"
          onClick={() => handleMobileNavSelect('rooms')}
          className={`flex-1 py-1 flex flex-col items-center justify-center transition relative ${
            activeTab === 'rooms' ? 'text-[#073125] font-bold bg-[#C9F24D]' : 'text-[#DCE9E4]/75 hover:text-white'
          }`}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {stats.availableRooms !== undefined && (
              <span className="absolute -top-1 -right-2 px-1 bg-white/20 border border-white/30 text-white text-[8px] font-mono font-bold">
                {stats.availableRooms}
              </span>
            )}
          </div>
          <span className="text-[10px] font-cinzel tracking-wider mt-1">Rooms</span>
        </button>

        {/* Tab 3: Cabs */}
        <button
          type="button"
          onClick={() => handleMobileNavSelect('travel-bookings')}
          className={`flex-1 py-1 flex flex-col items-center justify-center transition relative ${
            activeTab === 'travel-bookings' ? 'text-[#073125] font-bold bg-[#C9F24D]' : 'text-[#DCE9E4]/75 hover:text-white'
          }`}
        >
          <div className="relative">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            {stats.pendingTravelBookings > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {stats.pendingTravelBookings}
              </span>
            )}
          </div>
          <span className="text-[10px] font-cinzel tracking-wider mt-1">Cabs</span>
        </button>

        {/* Tab 4: More / Management Drawer (Fixed Menu Button) */}
        <button
          type="button"
          onClick={() => {
            if (isMobileDrawerOpen) {
              if (onCloseMobileDrawer) onCloseMobileDrawer();
            } else {
              if (onOpenMobileDrawer) onOpenMobileDrawer();
            }
          }}
          className={`flex-1 py-1 flex flex-col items-center justify-center transition relative ${
            isMobileDrawerOpen ? 'text-[#073125] font-bold bg-[#C9F24D]' : 'text-[#DCE9E4]/75 hover:text-white'
          }`}
          title="Open complete navigation menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[10px] font-cinzel tracking-wider mt-1">Menu</span>
        </button>
      </nav>

      {/* ── 3. Mobile Slide-Out Management Drawer (#073125) ── */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          
          {/* Backdrop */}
          <div
            onClick={onCloseMobileDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-sm bg-[#073125] border-l border-[#052219] h-full flex flex-col justify-between p-5 z-10 text-[#DCE9E4] shadow-2xl overflow-y-auto">
            
            <div className="space-y-6">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#C9F24D] font-bold block">
                    Management Desk
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white">All Hotel Modules</h3>
                </div>
                <button
                  type="button"
                  onClick={onCloseMobileDrawer}
                  className="w-8 h-8 bg-white/10 border border-white/20 text-white hover:bg-white/20 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Module Groups */}
              {sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-1.5">
                  <div className="text-[10px] font-cinzel uppercase tracking-widest text-[#C9F24D] font-bold border-b border-white/10 pb-1">
                    {section.title}
                  </div>
                  <div className="flex flex-col gap-1">
                    {section.items.map((item) => {
                      const isActive = activeTab === item.id;
                      const targetRoute = ADMIN_ROUTES[item.id] || `/${item.id}`;

                      return (
                        <Link
                          key={item.id}
                          to={targetRoute}
                          onClick={() => handleMobileNavSelect(item.id)}
                          className={`flex items-center justify-between px-3 py-2.5 text-xs transition ${
                            isActive
                              ? 'bg-[#C9F24D] text-[#073125] font-bold shadow-xs'
                              : 'text-[#DCE9E4]/85 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={isActive ? 'text-[#073125]' : 'text-[#DCE9E4]'}>
                              {item.icon}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          {item.count !== undefined && (
                            <span className={`text-[11px] font-mono ${isActive ? 'text-[#073125] font-bold' : 'opacity-80'}`}>
                              {item.count}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Live Website Links */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-[10px] font-cinzel uppercase tracking-widest text-[#C9F24D] font-bold block">
                  Public Websites
                </span>
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  <a
                    href={APP_URLS.landing}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/10 border border-white/15 text-white hover:bg-white/20 font-medium"
                  >
                    Main ↗
                  </a>
                  <a
                    href={APP_URLS.hotel}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/10 border border-white/15 text-white hover:bg-white/20 font-medium"
                  >
                    Hotel ↗
                  </a>
                  <a
                    href={APP_URLS.travel}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white/10 border border-white/15 text-white hover:bg-white/20 font-medium"
                  >
                    Cabs ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Logout Row in Mobile Drawer */}
            <div className="pt-6 border-t border-white/10 mt-6">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 bg-rose-900/90 hover:bg-rose-900 text-white text-xs font-cinzel font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-rose-700/50"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout from Admin</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
