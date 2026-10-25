export const KpiCards = ({ stats = {}, onSelectTab }) => {
  const cards = [
    {
      tabId: 'hotel-bookings',
      category: 'Hotel',
      title: 'Room Bookings',
      value: stats.hotelBookingsCount || 0,
      subtext:
        stats.pendingHotelBookings > 0
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
      subtext: `${stats.availableRooms || 0} Open • ${stats.disabledRooms || 0} Blocked`,
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
      subtext:
        stats.pendingTravelBookings > 0
          ? `${stats.pendingTravelBookings} Dispatch Needed`
          : 'All Dispatched',
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
      category: 'Tours',
      title: 'Tour Packages',
      value: stats.toursCount || 0,
      subtext: 'Temple Circuits Active',
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
      title: 'Guest Reviews',
      value: stats.reviewsCount || 0,
      subtext:
        stats.pendingReviewsCount > 0
          ? `${stats.pendingReviewsCount} Awaiting Approval`
          : 'All Approved',
      alert: stats.pendingReviewsCount > 0,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3.5 mb-6">
      {cards.map((card) => {
        const isAlert = Boolean(card.alert);
        return (
          <div
            key={card.tabId}
            onClick={() => onSelectTab && onSelectTab(card.tabId)}
            className={`p-3.5 sm:p-4 border transition-all duration-150 cursor-pointer group shadow-2xs ${
              isAlert
                ? 'border-amber-400 bg-amber-50/70 hover:border-slate-800'
                : 'border-slate-300/80 bg-white hover:border-slate-800 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-cinzel font-bold text-[#0F172A] flex items-center gap-1.5 truncate">
                <span className="px-1.5 py-0.5 bg-[#073125]/10 border border-[#073125]/20 text-[9px] uppercase tracking-wider text-[#073125] font-bold">
                  {card.category}
                </span>
                <span className="uppercase tracking-wider hidden sm:inline text-slate-700">{card.title}</span>
              </span>

              <span
                className={`p-1 border transition-colors shrink-0 ${
                  isAlert
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-slate-100 border-slate-200 text-slate-700 group-hover:bg-[#0F172A] group-hover:text-white group-hover:border-[#0F172A]'
                }`}
              >
                {card.icon}
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#0F172A]">
                {card.value}
              </span>
              {card.alert && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold font-cinzel uppercase bg-amber-200 text-amber-900 border border-amber-400">
                  Action
                </span>
              )}
            </div>

            <p className="text-[10px] sm:text-[11px] text-slate-600 font-medium truncate flex items-center gap-1">
              {!isAlert && <span className="w-1.5 h-1.5 bg-emerald-600 inline-block shrink-0" />}
              <span>{card.subtext}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default KpiCards;
