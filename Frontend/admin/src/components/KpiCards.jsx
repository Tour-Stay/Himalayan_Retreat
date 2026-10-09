export const KpiCards = ({ stats, onSelectTab }) => {
  const cards = [
    {
      tabId: 'hotel-bookings',
      category: 'Hotel',
      title: 'Room Bookings',
      value: stats.hotelBookingsCount || 0,
      subtext: stats.pendingHotelBookings > 0
        ? `${stats.pendingHotelBookings} Awaiting Confirmation`
        : 'All Confirmed',
      alert: stats.pendingHotelBookings > 0,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      tabId: 'rooms',
      category: 'Hotel',
      title: 'Rooms & Pricing',
      value: stats.totalRooms || 0,
      subtext: `${stats.availableRooms || 0} Open for Booking • ${stats.disabledRooms || 0} Unavailable / Due Date Set`,
      alert: stats.disabledRooms > 0,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      tabId: 'travel-bookings',
      category: 'Cabs',
      title: 'Cab Bookings',
      value: stats.travelBookingsCount || 0,
      subtext: stats.pendingTravelBookings > 0
        ? `${stats.pendingTravelBookings} Driver Dispatch Needed`
        : 'All Cabs Assigned',
      alert: stats.pendingTravelBookings > 0,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
    },
    {
      tabId: 'tours',
      category: 'Cabs',
      title: 'Tour Packages',
      value: stats.toursCount || 0,
      subtext: 'Kumaon & Temple Circuits',
      alert: false,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      tabId: 'reviews',
      category: 'Reviews',
      title: 'Customer Reviews',
      value: stats.reviewsCount || 0,
      subtext: stats.pendingReviewsCount > 0
        ? `${stats.pendingReviewsCount} Awaiting Approval`
        : 'All Reviews Approved',
      alert: stats.pendingReviewsCount > 0,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
      {cards.map((card) => {
        const isAlert = Boolean(card.alert);
        return (
          <div
            key={card.tabId}
            onClick={() => onSelectTab && onSelectTab(card.tabId)}
            className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer group shadow-2xs ${
              isAlert
                ? 'border-amber-400 bg-amber-50/70 hover:border-[#073125]'
                : 'border-[#EAA722]/30 bg-[#FAF5EC] hover:bg-white hover:border-[#073125]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-cinzel font-bold text-[#073125] flex items-center gap-1.5 group-hover:text-amber-800 transition-colors line-clamp-1">
                <span className="px-1.5 py-0.5 rounded bg-white/60 border border-[#EAA722]/30 text-[9px] uppercase tracking-wider text-[#8C7A6B]">
                  {card.category}
                </span>
                <span className="uppercase tracking-wider">{card.title}</span>
              </span>

              <span
                className={`p-1 rounded-lg border transition-all shrink-0 ${
                  isAlert
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-white border-[#EAA722]/30 text-[#073125] group-hover:bg-[#073125] group-hover:text-[#EAA722]'
                }`}
              >
                {card.icon}
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#073125]">
                {card.value}
              </span>
              {card.alert && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold font-cinzel uppercase bg-amber-200 text-amber-900 border border-amber-400 animate-pulse">
                  Action
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#5C5350] font-medium line-clamp-1">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;
