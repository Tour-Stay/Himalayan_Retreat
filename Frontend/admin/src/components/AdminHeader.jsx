import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext, Logo, APP_URLS } from '@shared';

export const AdminHeader = ({ onRefresh, isRefreshing, onNewBooking }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    setCurrentDate(formatted);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full shrink-0 z-30 bg-[#073125] border-b border-[#EAA722]/30 text-white shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Crest & Desk Title */}
        <Link to="/hotel-bookings" className="flex items-center gap-3 hover:opacity-95 transition group shrink-0">
          <div className="p-1.5 rounded-xl bg-[#0C2B22] border border-[#EAA722]/40 shadow-xs">
            <Logo size={38} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-[#EAA722] transition-colors">
                The Kasar Himalayan Heights
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-cinzel font-bold uppercase bg-[#EAA722]/20 text-[#EAA722] border border-[#EAA722]/40">
                Manager Desk
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#FAF5EC]/75">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-[#EAA722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Kasar Devi, Almora</span>
              </span>
              <span>•</span>
              <span className="text-[#EAA722] font-medium flex items-center gap-1">
                <svg className="w-3 h-3 text-[#EAA722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{currentDate || 'Today'}</span>
              </span>
            </div>
          </div>
        </Link>

        {/* Center: Live Websites Fast Jump Links with SVG Icons */}
        <div className="hidden lg:flex items-center gap-2 bg-[#0C2B22] px-3 py-1.5 rounded-2xl border border-[#EAA722]/30 text-xs shadow-inner">
          <span className="text-[11px] font-cinzel text-[#EAA722] font-bold tracking-wide mr-1">
            View Websites:
          </span>

          <a
            href={APP_URLS.landing}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium"
            title="Open Main Landing Website in new tab"
          >
            <svg className="w-3.5 h-3.5 text-[#EAA722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Main Website</span>
            <span className="text-[#EAA722] text-[10px] font-mono">↗</span>
          </a>

          <a
            href={APP_URLS.hotel}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium"
            title="Open Hotel Rooms Website in new tab"
          >
            <svg className="w-3.5 h-3.5 text-[#EAA722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Hotel Website</span>
            <span className="text-[#EAA722] text-[10px] font-mono">↗</span>
          </a>

          <a
            href={APP_URLS.travel}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition font-medium"
            title="Open Cabs & Tours Website in new tab"
          >
            <svg className="w-3.5 h-3.5 text-[#EAA722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
            <span>Cab Website</span>
            <span className="text-[#EAA722] text-[10px] font-mono">↗</span>
          </a>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Create Booking Button */}
          <button
            type="button"
            onClick={onNewBooking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-cinzel font-bold bg-[#EAA722] hover:bg-[#D4951B] text-[#073125] transition cursor-pointer shadow-md hover:scale-102"
            title="Add a walk-in or phone reservation"
          >
            <svg className="w-4 h-4 text-[#073125]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Booking</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-cinzel font-semibold bg-[#0C2B22] hover:bg-[#12433B] text-white border border-[#EAA722]/30 transition cursor-pointer disabled:opacity-50"
            title="Reload latest bookings and updates"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#EAA722]' : 'text-[#EAA722]'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="hidden sm:inline">{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-cinzel font-semibold bg-[#541508] hover:bg-[#721C0B] text-white border border-[#EAA722]/30 transition cursor-pointer shadow-xs"
            title="Sign out from admin panel"
          >
            <svg className="w-3.5 h-3.5 text-[#EAA722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
