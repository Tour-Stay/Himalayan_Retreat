import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext, Logo, APP_URLS, SITE_CONFIG } from '@shared';

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
    <header className="w-full shrink-0 z-30 bg-[#FDFBF7] border-b border-[#C5A059]/30 text-[#2C2523] shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Crest & Office Title */}
        <Link to="/rooms" className="flex items-center gap-3 hover:opacity-90 transition group">
          <Logo size={38} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-bold text-base sm:text-lg tracking-tight text-[#2C2523] group-hover:text-[#7C1D23] transition-colors">
                The Kasar Himalayan Heights
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-cinzel font-semibold uppercase bg-[#FAF6EF] text-[#7C1D23] border border-[#C5A059]/40">
                Resort Office Desk
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#66605B]">
              <span>📍 Kasar Devi, Almora</span>
              <span>•</span>
              <span className="font-medium text-[#2C2523]">📅 {currentDate || 'Today'}</span>
            </div>
          </div>
        </Link>

        {/* Action Controls & Live Portals */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick links to live guest website */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#FAF6EF] p-1 rounded-full border border-[#C5A059]/30 text-xs shadow-2xs">
            <span className="text-[10px] uppercase font-cinzel px-2.5 text-[#66605B] font-semibold">
              Guest Sites:
            </span>
            <a
              href={APP_URLS.landing}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-full text-[#2C2523] hover:text-[#7C1D23] hover:bg-white transition font-medium"
              title="Open main landing page"
            >
              Main Website ↗
            </a>
            <a
              href={APP_URLS.hotel}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-full text-[#2C2523] hover:text-[#7C1D23] hover:bg-white transition font-medium"
              title="Open room stay website"
            >
              Rooms & Stay ↗
            </a>
            <a
              href={APP_URLS.travel}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-full text-[#2C2523] hover:text-[#7C1D23] hover:bg-white transition font-medium"
              title="Open cabs and tours website"
            >
              Cabs & Tours ↗
            </a>
          </div>

          {/* Front Desk + New Booking Quick Button */}
          <button
            onClick={onNewBooking}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold bg-gradient-to-r from-[#7C1D23] to-[#9E3304] hover:from-[#5C151A] hover:to-[#7C1D23] text-[#FDFBF7] border border-[#DFCA9B]/50 transition cursor-pointer shadow-md hover:scale-102"
            title="Book walk-in or phone reservation immediately"
          >
            <span className="text-sm leading-none">+</span>
            <span>New Booking</span>
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel font-semibold bg-[#FAF6EF] hover:bg-white text-[#2C2523] hover:text-[#7C1D23] border border-[#C5A059]/40 transition cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Refresh bookings and rooms from database"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C5A059]' : 'text-[#7C1D23]'}`}
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
            <span className="hidden sm:inline">{isRefreshing ? 'Updating...' : 'Refresh List'}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-cinzel font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] border border-[#C5A059]/40 transition cursor-pointer shadow-xs"
            title="Sign out from office portal"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
