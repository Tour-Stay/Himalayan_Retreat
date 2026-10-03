import { SITE_CONFIG } from '@shared';

export const AdminSidebar = ({ activeTab, onSelectTab, stats }) => {
  const tabs = [
    {
      id: 'rooms',
      label: 'Rooms & Chalets',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      count: stats.totalRooms,
      badgeText: `${stats.availableRooms} Live`,
    },
    {
      id: 'hotel-bookings',
      label: 'Guest Room Bookings',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      count: stats.hotelBookingsCount,
      alertCount: stats.pendingHotelBookings,
    },
    {
      id: 'travel-bookings',
      label: 'Cab & Driver Trips',
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
      id: 'tours',
      label: 'Tour Packages',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      count: stats.toursCount,
    },
    {
      id: 'reviews',
      label: 'Guest Reviews',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      count: stats.reviewsCount,
      alertCount: stats.pendingReviewsCount,
    },
  ];

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 bg-[#FDFBF7] border-b lg:border-b-0 lg:border-r border-[#C5A059]/30 p-3 lg:p-4 flex flex-col justify-between h-full overflow-y-auto z-20">
      <div>
        <div className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#C5A059] font-bold px-3 mb-3 hidden lg:block">
          Office Management
        </div>
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap shrink-0 lg:shrink ${
                  isActive
                    ? 'bg-[#7C1D23] text-[#FDFBF7] font-semibold shadow-xs'
                    : 'text-[#2C2523] hover:text-[#7C1D23] hover:bg-[#FAF6EF] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#DFCA97]' : 'text-[#7C1D23]'}>
                    {tab.icon}
                  </span>
                  <span className="font-cinzel tracking-wide">{tab.label}</span>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  {tab.alertCount > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse ${
                        isActive
                          ? 'bg-[#5C151A] text-[#DFCA97]'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                      title={`${tab.alertCount} new action needed`}
                    >
                      {tab.alertCount} New
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold ${
                      isActive
                        ? 'bg-[#5C151A] text-[#FDFBF7]'
                        : 'bg-[#FAF6EF] text-[#2C2523] border border-[#C5A059]/30'
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Office Quick Info Banner (desktop) */}
      <div className="hidden lg:block mt-auto pt-6">
        <div className="p-3 bg-[#FAF6EF] rounded-2xl border border-[#C5A059]/30 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-cinzel font-bold text-[#7C1D23] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Front Desk Portal
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold">Active Shift</span>
          </div>
          <p className="text-[11px] text-[#5C5350]">
            Concierge: <strong className="text-[#2C2523] font-mono">{SITE_CONFIG.conciergePhone}</strong>
          </p>
          <p className="text-[10px] text-[#66605B] mt-0.5">
            Crank's Ridge, Kasar Devi, Almora
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
