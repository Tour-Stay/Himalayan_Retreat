import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '@shared';
import { ADMIN_ROUTES } from '../constants/adminRoutes';

export const AdminSidebar = ({ activeTab, onSelectTab, stats }) => {
  const sections = [
    {
      title: 'Hotel & Stays',
      badge: 'Rooms',
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
          badgeText: `${stats.availableRooms || 0} Open`,
        },
        {
          id: 'yield',
          label: 'Weekend & Season Rates',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ),
          badgeText: 'Tariffs',
        },
      ],
    },
    {
      title: 'Cabs & Drivers',
      badge: 'Fleet',
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
          badgeText: 'Per-KM',
        },
        {
          id: 'drivers',
          label: 'Drivers & Batta',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
          badgeText: 'Batta',
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
          badgeText: 'Fares',
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
      badge: 'Manage',
      items: [
        {
          id: 'announcements',
          label: 'Notice Banner',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          ),
          badgeText: 'Top Bar',
        },
        {
          id: 'landing-cms',
          label: 'Main Page Content',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ),
          badgeText: 'Hero & FAQs',
        },
        {
          id: 'company',
          label: 'Phone & WhatsApp',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          ),
          badgeText: 'Contacts',
        },
        {
          id: 'policies',
          label: 'Hotel & Cab Policies',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          badgeText: 'Rules',
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

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 bg-[#FAF7F2] border-b lg:border-b-0 lg:border-r border-[#EAA722]/30 p-3 lg:p-4 flex flex-col justify-between h-full overflow-y-auto z-20">
      <div className="space-y-5">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {/* Section Header */}
            <div className="flex items-center justify-between px-3 py-1 text-xs font-cinzel font-bold text-[#073125] uppercase tracking-wider border-b border-[#EAA722]/20">
              <span>{section.title}</span>
              <span className="text-[10px] text-[#8C7A6B] font-sans font-medium">
                {section.badge}
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 scrollbar-none">
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                const targetRoute = ADMIN_ROUTES[item.id] || `/${item.id}`;

                return (
                  <Link
                    key={item.id}
                    to={targetRoute}
                    onClick={() => onSelectTab && onSelectTab(item.id)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs transition cursor-pointer whitespace-nowrap shrink-0 lg:shrink ${
                      isActive
                        ? 'bg-[#073125] text-white font-bold border border-[#EAA722]/40 shadow-sm'
                        : 'text-[#2C2523] hover:text-[#073125] hover:bg-[#FAF5EC] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#EAA722]' : 'text-[#073125]'}>
                        {item.icon}
                      </span>
                      <span className="font-medium tracking-wide">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-2">
                      {item.alertCount > 0 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-amber-400 text-[#073125]'
                              : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                          }`}
                          title={`${item.alertCount} new action needed`}
                        >
                          {item.alertCount} New
                        </span>
                      )}

                      {item.count !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                            isActive
                              ? 'bg-[#0C2B22] text-[#EAA722] border border-[#EAA722]/30'
                              : 'bg-[#FAF5EC] text-[#2C2523] border border-[#EAA722]/30'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}

                      {item.badgeText && item.count === undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                            isActive
                              ? 'bg-[#0C2B22] text-[#EAA722] border border-[#EAA722]/30'
                              : 'bg-[#FAF5EC] text-[#073125] border border-[#EAA722]/30'
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

      {/* Front Desk Support Quick Info Box (Desktop) */}
      <div className="hidden lg:block mt-6 pt-4 border-t border-[#EAA722]/20">
        <div className="p-3 bg-[#FAF5EC] rounded-2xl border border-[#EAA722]/30 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-cinzel font-bold text-[#073125] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Front Desk Helpline
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold font-mono">Online</span>
          </div>
          <p className="text-[11px] text-[#5C5350]">
            Phone: <strong className="text-[#073125] font-mono">{SITE_CONFIG.conciergePhone}</strong>
          </p>
          <p className="text-[10px] text-[#8C7A6B] mt-0.5">
            Kasar Devi, Almora (6,942 ft)
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
