import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext, Logo, APP_URLS } from '@shared';

export const AdminHeader = ({
  onRefresh,
  isRefreshing,
  onNewBooking,
  onOpenMobileDrawer,
  isDesktopSidebarCollapsed,
  onToggleDesktopSidebar,
}) => {
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
    <header className="w-full shrink-0 z-30 bg-[#ACC5A6] border-b border-[#92AD8B] text-[#0F172A] shadow-xs">
      <div className="w-full px-3.5 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
        
        {/* Left: Brand Crest & Desk Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
          <Link
            to="/hotel-bookings"
            className="flex items-center gap-2.5 sm:gap-3 hover:opacity-95 transition group min-w-0"
          >
            <div className="p-1 sm:p-1.5 bg-[#0F172A] border border-[#AEAC78]/50 shadow-xs flex items-center justify-center shrink-0">
              <Logo size={32} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base lg:text-lg tracking-tight text-[#0F172A] group-hover:text-black transition-colors truncate">
                  The Kasar Himalayan Heights
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[9px] font-cinzel font-bold uppercase bg-white/80 text-[#0F172A] border border-[#233A26]/30 shrink-0">
                  (Satya’s)
                </span>
              </div>
              <div className="hidden xs:flex items-center gap-2 text-[11px] text-[#233A26] truncate">
                <span className="flex items-center gap-1 font-medium truncate">
                  <svg className="w-3 h-3 text-[#233A26] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">Kasar Devi, Almora</span>
                </span>
                <span>•</span>
                <span className="text-[#0F172A] font-semibold flex items-center gap-1 font-mono shrink-0">
                  <span>{currentDate || 'Today'}</span>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Live Websites Fast Jump Links with Distinct Separators & Cards (Desktop Only) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-white/60 border border-[#233A26]/25 shadow-2xs">
          <span className="text-[10px] font-cinzel text-[#1E3020] font-bold tracking-widest uppercase flex items-center gap-1.5 mr-1">
            <span className="w-1.5 h-1.5 bg-emerald-600 animate-pulse" />
            Live Sites:
          </span>

          <div className="flex items-center gap-2">
            <a
              href={APP_URLS.landing}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#0F172A] hover:text-white border border-[#233A26]/30 transition shadow-2xs"
              title="Open Main Landing Website in new tab"
            >
              <span>Main</span>
              <span className="text-[10px] opacity-70 font-mono">↗</span>
            </a>

            <span className="text-[#233A26]/40 text-xs select-none">|</span>

            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#0F172A] hover:text-white border border-[#233A26]/30 transition shadow-2xs"
              title="Open Hotel Rooms Website in new tab"
            >
              <span>Hotel</span>
              <span className="text-[10px] opacity-70 font-mono">↗</span>
            </a>

            <span className="text-[#233A26]/40 text-xs select-none">|</span>

            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0F172A] bg-white hover:bg-[#0F172A] hover:text-white border border-[#233A26]/30 transition shadow-2xs"
              title="Open Cabs & Tours Website in new tab"
            >
              <span>Cabs</span>
              <span className="text-[10px] opacity-70 font-mono">↗</span>
            </a>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Create Booking Button */}
          <button
            type="button"
            onClick={onNewBooking}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-2 text-xs font-cinzel font-bold bg-[#0F172A] hover:bg-[#1E293B] text-white transition-all cursor-pointer shadow-sm border border-[#0F172A] active:scale-95 shrink-0"
            title="Add a walk-in or phone reservation"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="whitespace-nowrap sm:hidden">Book</span>
            <span className="whitespace-nowrap hidden sm:inline">New Booking</span>
          </button>

          {/* Refresh Button (Desktop only; on mobile, available in bottom nav drawer) */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-cinzel font-semibold bg-white/70 hover:bg-white text-[#0F172A] border border-[#233A26]/25 transition cursor-pointer disabled:opacity-50 shrink-0"
            title="Reload latest bookings and updates"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0F172A]' : 'text-[#0F172A]'}`}
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
            <span className="hidden md:inline">{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>

          {/* Logout Button (Desktop only; on mobile, available in bottom nav drawer) */}
          <button
            type="button"
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-cinzel font-semibold bg-white/80 hover:bg-rose-50 text-rose-800 hover:text-rose-900 border border-rose-300 transition cursor-pointer shadow-2xs shrink-0"
            title="Sign out from admin panel"
          >
            <svg className="w-3.5 h-3.5 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>

        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
