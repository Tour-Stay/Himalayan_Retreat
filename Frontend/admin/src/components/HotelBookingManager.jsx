import { useState, useMemo } from 'react';
import { apiClient } from '@shared';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './Toast';
import FolioInvoiceModal from './FolioInvoiceModal';
import GuestIdProofModal from './GuestIdProofModal';

export const HotelBookingManager = ({ bookings = [], setBookings, onRefresh }) => {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // Selected booking for Slip / Receipt Modal
  const [viewSlipBooking, setViewSlipBooking] = useState(null);

  // Selected booking for Folio & Invoicing Modal
  const [folioModalBooking, setFolioModalBooking] = useState(null);

  // Selected booking for Digital Guest ID Proof Modal
  const [idModalBooking, setIdModalBooking] = useState(null);

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Calculate nights
  const calculateNights = (inDate, outDate) => {
    if (!inDate || !outDate) return 1;
    const diff = new Date(outDate) - new Date(inDate);
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  // Is today helper
  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  // Filtered list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const name = b.guestDetails?.name || '';
      const email = b.guestDetails?.email || '';
      const phone = b.guestDetails?.phone || '';
      const roomName = b.room?.name || '';
      const bookingId = b._id || '';

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        phone.includes(search) ||
        roomName.toLowerCase().includes(search.toLowerCase()) ||
        bookingId.toLowerCase().includes(search.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === 'today') {
        matchesStatus = isToday(b.checkInDate);
      } else if (statusFilter !== 'all') {
        matchesStatus = (b.status || 'pending').toLowerCase() === statusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  // Financial summary for office manager
  const summary = useMemo(() => {
    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
    const confirmedRevenue = bookings
      .filter((b) => b.status === 'confirmed' || b.status === 'completed' || b.status === 'checked_in')
      .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
    const pendingCount = bookings.filter((b) => (b.status || 'pending') === 'pending').length;
    const todayArrivals = bookings.filter((b) => isToday(b.checkInDate)).length;
    return { totalRevenue, confirmedRevenue, pendingCount, todayArrivals };
  }, [bookings]);

  // Quick export to CSV for office accounting
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      addToast('No reservations to export.', 'info');
      return;
    }
    const headers = ['Booking ID', 'Guest Name', 'Phone', 'Email', 'Room', 'Check-In', 'Check-Out', 'Nights', 'Total Amount (INR)', 'Status'];
    const rows = filteredBookings.map((b) => [
      b._id,
      `"${(b.guestDetails?.name || '').replace(/"/g, '""')}"`,
      `"${b.guestDetails?.phone || ''}"`,
      `"${b.guestDetails?.email || ''}"`,
      `"${(b.room?.name || '').replace(/"/g, '""')}"`,
      b.checkInDate ? new Date(b.checkInDate).toISOString().split('T')[0] : '',
      b.checkOutDate ? new Date(b.checkOutDate).toISOString().split('T')[0] : '',
      calculateNights(b.checkInDate, b.checkOutDate),
      b.totalAmount || 0,
      b.status || 'pending',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(',')).join('\n')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hotel_reservations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Downloaded reservations CSV spreadsheet.', 'success');
  };

  // Export Daily Police Verification Register (CSV)
  const handleExportPoliceRegister = async () => {
    try {
      addToast('Preparing Uttarakhand Police Guest Register...', 'info');
      const response = await apiClient.get('/hotel/bookings/police-register?date=all', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Uttarakhand_Police_Guest_Register_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addToast('Police verification register downloaded successfully!', 'success');
    } catch (err) {
      addToast('Failed to export police register: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  // Change booking status
  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await apiClient.put(`/hotel/bookings/${bookingId}/status`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      addToast(`Booking marked as ${newStatus.toUpperCase()}`, 'success');
    } catch (err) {
      addToast('Failed to update status: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // WhatsApp quick liaison
  const handleOpenWhatsApp = (booking) => {
    const rawPhone = booking.guestDetails?.phone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const guestName = booking.guestDetails?.name || 'Valued Guest';
    const roomName = booking.room?.name || 'Himalayan Suite';
    const checkIn = formatDate(booking.checkInDate);
    const checkOut = formatDate(booking.checkOutDate);

    const message = `Namaste ${guestName} ji! 🙏 Greetings from The Kasar Himalayan Heights, Kasar Devi.\n\nWe are pleased to confirm your room reservation:\n🏨 Room: *${roomName}*\n📅 Check-in: ${checkIn}\n📅 Check-out: ${checkOut}\n💵 Total Amount: ₹${Number(booking.totalAmount || 0).toLocaleString('en-IN')}\n\nPlease share your expected arrival time so we can keep your heated room and hot tea ready upon arrival! Reach us anytime.`;

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Delete booking
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await apiClient.delete(`/hotel/bookings/${deleteTarget._id}`);
      setBookings((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      addToast('Reservation record deleted.', 'info');
      setDeleteTarget(null);
    } catch (err) {
      addToast('Failed to delete booking: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* ── 1. Executive Metric Strip (Sharp White Cards) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 p-3.5 sm:p-4 bg-white border border-slate-300 shadow-sm">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-slate-500 tracking-wider font-bold">Total Bookings</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-[#0F172A]">{bookings.length}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-3">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-slate-500 tracking-wider font-bold">Today's Arrivals</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-blue-900">{summary.todayArrivals} Guests</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-3">
          <div className="w-10 h-10 bg-amber-50 border border-amber-300 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-slate-500 tracking-wider font-bold">Pending Action</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-800">{summary.pendingCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-3">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-300 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-slate-500 tracking-wider font-bold">Confirmed Revenue</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-800">
              ₹{summary.confirmedRevenue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

      </div>

      {/* ── 2. Search, Status Filter & Export Controls ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 border border-slate-300 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by guest, phone, room, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:bg-white transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A] text-xs cursor-pointer"
            >
              &times;
            </button>
          )}
        </div>

        {/* Status Filters & Export Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none">
          
          <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 text-xs shrink-0 w-max">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 font-cinzel font-semibold transition cursor-pointer shrink-0 whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('today')}
              className={`px-3 py-1 font-cinzel font-semibold transition cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1 ${
                statusFilter === 'today'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-blue-900 hover:bg-blue-100/50'
              }`}
            >
              <span>Today ({summary.todayArrivals})</span>
            </button>
            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
              const count = bookings.filter((b) => (b.status || 'pending').toLowerCase() === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 font-cinzel font-semibold capitalize transition cursor-pointer shrink-0 whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-semibold bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-300 transition cursor-pointer shrink-0 whitespace-nowrap shadow-2xs"
            title="Download CSV spreadsheet for accounting"
          >
            <svg className="w-3.5 h-3.5 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handleExportPoliceRegister}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition cursor-pointer shrink-0 whitespace-nowrap shadow-2xs"
            title="Download Uttarakhand Tourism / Police Verification Register"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-800 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="hidden sm:inline">Police Register</span>
          </button>

        </div>
      </div>

      {/* ── 3. Empty State ── */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-300 text-slate-500">
          <p className="text-sm font-cinzel font-bold text-[#0F172A]">No guest reservations match your filter</p>
          <p className="text-xs text-slate-500 mt-1">Check search keywords or select "All" to view all records.</p>
        </div>
      ) : (
        <>
          {/* ── 4. MOBILE VIEW: Interactive Reservation Cards (NO HORIZONTAL SCROLL) ── */}
          <div className="md:hidden space-y-3">
            {filteredBookings.map((b) => {
              const nights = calculateNights(b.checkInDate, b.checkOutDate);
              const isUpdating = updatingId === b._id;
              const dueAmount = b.balanceDue !== undefined ? b.balanceDue : Math.max(0, (b.totalAmount || 0) - (b.advancePaid || 0));

              return (
                <div
                  key={b._id}
                  className="bg-white border border-slate-300 p-3.5 shadow-xs space-y-3 relative"
                >
                  {/* Top Bar: Guest Name & Status Badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#0F172A]">
                          {b.guestDetails?.name || 'Guest'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        ID: {b._id?.slice(-6)?.toUpperCase()}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <StatusBadge status={b.status} />
                    </div>
                  </div>

                  {/* Room & Stay Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-cinzel text-slate-500 font-bold block">
                        Reserved Suite
                      </span>
                      <span className="font-serif font-bold text-[#0F172A] line-clamp-1">
                        {b.room?.name || 'Himalayan Suite'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {b.roomsBooked || 1} Room(s)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-cinzel text-slate-500 font-bold block">
                        Stay Duration
                      </span>
                      <span className="font-mono text-[#0F172A] font-medium block">
                        {formatDate(b.checkInDate)}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {nights} {nights === 1 ? 'Night' : 'Nights'} → {formatDate(b.checkOutDate)}
                      </span>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase font-cinzel block">Total Bill</span>
                      <span className="font-mono font-bold text-sm text-[#0F172A]">
                        ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      {b.advancePaid > 0 && (
                        <div className="text-[11px] text-emerald-700 font-semibold font-mono">
                          Paid: ₹{Number(b.advancePaid).toLocaleString('en-IN')}
                        </div>
                      )}
                      {dueAmount > 0 && (
                        <div className="text-[11px] text-red-600 font-bold font-mono">
                          Due: ₹{Number(dueAmount).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 1-Tap Touch Action Bar for Phone */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                    
                    {/* Call Guest */}
                    {b.guestDetails?.phone ? (
                      <a
                        href={`tel:${b.guestDetails.phone}`}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1 border border-slate-300 transition"
                        title="Call guest"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>Call</span>
                      </a>
                    ) : null}

                    {/* WhatsApp Guest */}
                    {b.guestDetails?.phone ? (
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(b)}
                        className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                        title="Send WhatsApp confirmation"
                      >
                        <span>WhatsApp</span>
                      </button>
                    ) : null}

                    {/* Quick Confirm when Pending */}
                    {b.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(b._id, 'confirmed')}
                        disabled={isUpdating}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold font-cinzel flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <span>✓ Confirm</span>
                      </button>
                    )}

                    {/* Folio Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => setFolioModalBooking(b)}
                      className="px-3 py-2 bg-white hover:bg-slate-50 text-[#0F172A] border border-slate-300 text-xs font-cinzel font-semibold flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                      title="Open Guest Folio & Incidentals"
                    >
                      <span>Folio</span>
                      {b.folioExtras?.length > 0 && (
                        <span className="px-1 bg-[#0F172A] text-white text-[9px] font-mono flex items-center justify-center font-bold">
                          +{b.folioExtras.length}
                        </span>
                      )}
                    </button>

                    {/* ID Proof Trigger */}
                    <button
                      type="button"
                      onClick={() => setIdModalBooking(b)}
                      className="px-2.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-cinzel font-semibold flex items-center justify-center cursor-pointer shadow-2xs"
                      title="Guest ID Proof"
                    >
                      <span>ID</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(b)}
                      className="p-2 text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer"
                      title="Delete reservation"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                  </div>

                </div>
              );
            })}
          </div>

          {/* ── 5. DESKTOP VIEW: High-Contrast Comprehensive Data Table (hidden on mobile) ── */}
          <div className="hidden md:block overflow-x-auto border border-slate-300 bg-white shadow-sm">
            <table className="w-full text-left text-xs text-[#0F172A] border-collapse">
              <thead className="bg-slate-50 text-[11px] font-cinzel uppercase text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Guest Information</th>
                  <th className="py-3 px-4">Reserved Suite</th>
                  <th className="py-3 px-4">Dates &amp; Nights</th>
                  <th className="py-3 px-4">Billing &amp; Dues</th>
                  <th className="py-3 px-4">Booking Status</th>
                  <th className="py-3 px-4 text-right">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredBookings.map((b) => {
                  const nights = calculateNights(b.checkInDate, b.checkOutDate);
                  const isUpdating = updatingId === b._id;
                  const dueAmount = b.balanceDue !== undefined ? b.balanceDue : Math.max(0, (b.totalAmount || 0) - (b.advancePaid || 0));

                  return (
                    <tr key={b._id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Guest Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-[#0F172A] text-sm">
                            {b.guestDetails?.name || 'Guest'}
                          </span>
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] flex items-center gap-2 mt-0.5">
                          {b.guestDetails?.phone ? (
                            <a
                              href={`tel:${b.guestDetails.phone}`}
                              className="text-blue-900 hover:underline font-semibold flex items-center gap-1"
                              title="Click to call guest"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {b.guestDetails.phone}
                            </a>
                          ) : (
                            <span>No phone</span>
                          )}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate max-w-[200px]">
                          {b.guestDetails?.email || 'No email provided'}
                        </div>
                      </td>

                      {/* Suite Name & Rooms Count */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0F172A] font-serif flex items-center gap-1.5 flex-wrap">
                          <span>{b.room?.name || 'Himalayan Suite'}</span>
                          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-[#073125]/10 text-[#073125] border border-[#073125]/20">
                            {b.roomsBooked || 1} Room(s)
                          </span>
                        </div>
                        <div className="text-slate-400 font-mono text-[10px] mt-0.5">
                          ID: {b._id?.slice(-8)?.toUpperCase()}
                        </div>
                      </td>

                      {/* Dates & Nights */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[#0F172A] font-semibold text-xs">
                          {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 font-sans">
                          <span className="font-semibold text-slate-700">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                        </div>
                      </td>

                      {/* Billing & Settlement */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#0F172A] text-sm">
                          ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                        </div>
                        {b.advancePaid > 0 && (
                          <div className="text-[10px] text-emerald-700 font-semibold font-mono mt-0.5">
                            Adv: ₹{Number(b.advancePaid).toLocaleString('en-IN')}
                          </div>
                        )}
                        {dueAmount > 0 && (
                          <div className="text-[10px] text-red-600 font-bold font-mono">
                            Due: ₹{Number(dueAmount).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={b.status || 'pending'}
                            disabled={isUpdating}
                            onChange={(e) => handleStatusChange(b._id, e.target.value)}
                            className={`px-2.5 py-1 text-[11px] font-cinzel font-semibold uppercase tracking-wider border cursor-pointer focus:outline-none transition shadow-2xs ${
                              b.status === 'confirmed' || b.status === 'checked_in'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : b.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : b.status === 'completed' || b.status === 'checked_out'
                                ? 'bg-sky-50 text-sky-800 border-sky-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="checked_in">Checked In</option>
                            <option value="checked_out">Checked Out</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          {isUpdating && (
                            <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin shrink-0" />
                          )}
                        </div>
                      </td>

                      {/* Desk Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          
                          {/* Quick Confirm when Pending */}
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(b._id, 'confirmed')}
                              disabled={isUpdating}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
                              title="Quickly confirm this reservation"
                            >
                              ✓ Confirm
                            </button>
                          )}

                          {/* WhatsApp Guest */}
                          {b.guestDetails?.phone && (
                            <button
                              onClick={() => handleOpenWhatsApp(b)}
                              className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1"
                              title="Send WhatsApp confirmation message"
                            >
                              <span>💬 WA</span>
                            </button>
                          )}

                          {/* Guest Folio */}
                          <button
                            onClick={() => setFolioModalBooking(b)}
                            className="px-2.5 py-1 text-xs font-cinzel font-semibold bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-300 transition cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1"
                            title="Open Guest Folio & Tax Invoice"
                          >
                            <span>🧾 Folio</span>
                            {b.folioExtras?.length > 0 && (
                              <span className="px-1 bg-[#0F172A] text-white text-[9px] font-mono flex items-center justify-center font-bold">
                                +{b.folioExtras.length}
                              </span>
                            )}
                          </button>

                          {/* ID Proof */}
                          <button
                            onClick={() => setIdModalBooking(b)}
                            className={`px-2 py-1 text-xs font-cinzel font-semibold transition cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1 ${
                              b.idProofUrl || b.idProofNumber
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                            }`}
                            title="Verify Guest ID Document"
                          >
                            <span>🪪 ID</span>
                          </button>

                          {/* Voucher Slip */}
                          <button
                            onClick={() => setViewSlipBooking(b)}
                            className="px-2 py-1 text-xs font-cinzel font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition cursor-pointer shadow-2xs whitespace-nowrap"
                            title="Print Booking Slip"
                          >
                            <span>🖨️ Slip</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(b)}
                            className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
                            title="Delete booking"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── PRINTABLE BOOKING SLIP MODAL (VOUCHER) ── */}
      {viewSlipBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="printable-slip w-full max-w-lg bg-white border border-slate-400 shadow-2xl p-6 sm:p-8 text-[#0F172A]">
            
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-[10px] uppercase font-cinzel tracking-[0.2em] text-[#0F172A] font-bold block mb-1">
                The Kasar Himalayan Heights
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#0F172A]">Guest Reservation Voucher</h3>
              <p className="text-xs text-slate-500 font-sans">Kasar Devi Ridge, Almora (6,942 ft)</p>
            </div>

            <div className="py-4 space-y-2.5 text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Booking ID:</span>
                <span className="font-mono font-bold text-[#0F172A]">{viewSlipBooking._id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Guest Name:</span>
                <span className="font-bold text-[#0F172A]">{viewSlipBooking.guestDetails?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono text-[#0F172A]">{viewSlipBooking.guestDetails?.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Room Category:</span>
                <span className="font-bold text-[#0F172A] font-serif">{viewSlipBooking.room?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Check-In:</span>
                <span className="font-mono">{formatDate(viewSlipBooking.checkInDate)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Check-Out:</span>
                <span className="font-mono">{formatDate(viewSlipBooking.checkOutDate)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Duration:</span>
                <span className="font-bold">{calculateNights(viewSlipBooking.checkInDate, viewSlipBooking.checkOutDate)} Nights</span>
              </div>
              <div className="flex justify-between py-2 bg-slate-50 px-3 border border-slate-300 text-sm font-bold">
                <span>Total Amount:</span>
                <span className="font-mono text-[#0F172A]">₹{Number(viewSlipBooking.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-xs">
                <span className="text-slate-500">Booking Status:</span>
                <span className="uppercase font-bold text-emerald-800">{viewSlipBooking.status || 'Pending'}</span>
              </div>
            </div>

            <div className="no-print flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewSlipBooking(null)}
                className="px-4 py-2 text-xs font-cinzel font-semibold text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 border border-slate-300 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-cinzel font-bold text-white bg-[#0F172A] hover:bg-[#1E293B] border border-[#0F172A] transition cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span>Print Voucher</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM DIALOG ── */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Reservation Record"
        message={`Are you sure you want to remove the booking record for ${deleteTarget?.guestDetails?.name || 'this guest'} (${deleteTarget?.room?.name || 'Suite'})?`}
        confirmText="Delete Record"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ── GUEST FOLIO & CHECKOUT TAX INVOICE MODAL ── */}
      {folioModalBooking && (
        <FolioInvoiceModal
          booking={folioModalBooking}
          isOpen={Boolean(folioModalBooking)}
          onClose={() => setFolioModalBooking(null)}
          onFolioUpdated={(updatedBooking) => {
            setBookings((prev) =>
              prev.map((item) => (item._id === updatedBooking._id ? updatedBooking : item))
            );
            setFolioModalBooking(updatedBooking);
            if (onRefresh) onRefresh();
          }}
        />
      )}

      {/* ── DIGITAL GUEST ID PROOF MODAL ── */}
      {idModalBooking && (
        <GuestIdProofModal
          booking={idModalBooking}
          isOpen={Boolean(idModalBooking)}
          onClose={() => setIdModalBooking(null)}
          onIdProofUpdated={(updatedBooking) => {
            setBookings((prev) =>
              prev.map((item) => (item._id === updatedBooking._id ? updatedBooking : item))
            );
            if (onRefresh) onRefresh();
          }}
        />
      )}

    </div>
  );
};

export default HotelBookingManager;
