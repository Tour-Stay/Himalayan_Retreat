import { useState, useMemo } from 'react';
import { apiClient } from '@shared';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './Toast';
import FolioInvoiceModal from './FolioInvoiceModal';
import GuestIdProofModal from './GuestIdProofModal';

export const HotelBookingManager = ({ bookings, setBookings, onRefresh }) => {
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

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        phone.includes(search) ||
        roomName.toLowerCase().includes(search.toLowerCase());

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
      .filter((b) => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
    const pendingCount = bookings.filter((b) => b.status === 'pending').length;
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

  // Export Daily Police Verification Register (CSV) for Uttarakhand Tourism
  const handleExportPoliceRegister = async () => {
    try {
      addToast('Preparing Uttarakhand Police Guest Register...', 'info');
      const response = await apiClient.get('/api/hotel/bookings/police-register?date=all', {
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
      console.error('Police register export error:', err);
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
      addToast(
        'Failed to update status: ' + (err.response?.data?.message || err.message),
        'error'
      );
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

    const message = `Namaste ${guestName} ji! 🙏 Greetings from The Kasar Himalayan Heights, Kasar Devi.\n\nWe are pleased to confirm your room reservation:\n🏨 Room: *${roomName}*\n📅 Check-in: ${checkIn}\n📅 Check-out: ${checkOut}\n💵 Total Amount: ₹${Number(booking.totalAmount || 0).toLocaleString('en-IN')}\n\nPlease share your expected arrival time so we can keep your heated room and hot tea ready upon arrival! Reach us anytime at +91 96906 21247.`;

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
      {/* Office Quick Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FDFBF7] rounded-2xl border border-[#C5A059]/30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF6EF] border border-[#C5A059]/40 flex items-center justify-center text-lg shrink-0">
            📋
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-[#66605B] tracking-wider">Total Bookings</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-[#2C2523]">{bookings.length}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-[#C5A059]/20 sm:pl-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-lg shrink-0">
            🛎️
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-[#66605B] tracking-wider">Today's Arrivals</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-purple-800">{summary.todayArrivals} Guests</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-[#C5A059]/20 sm:pl-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-lg shrink-0">
            ⏳
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-[#66605B] tracking-wider">Pending Approval</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-700">{summary.pendingCount}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-[#C5A059]/20 sm:pl-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-lg shrink-0">
            💰
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-[#66605B] tracking-wider">Confirmed Value</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-[#7C1D23]">
              ₹{summary.confirmedRevenue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Top Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#FDFBF7] p-3.5 sm:p-4 rounded-2xl border border-[#C5A059]/30 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="w-4 h-4 text-[#C5A059] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by guest name, phone, room, or booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF6EF] border border-[#C5A059]/30 rounded-xl text-xs text-[#2C2523] placeholder-[#66605B] focus:outline-none focus:border-[#7C1D23] transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66605B] hover:text-[#2C2523] text-xs cursor-pointer"
            >
              &times;
            </button>
          )}
        </div>

        {/* Status Filters & Export */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 bg-[#FAF6EF] p-1 rounded-xl border border-[#C5A059]/25 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg font-cinzel font-semibold capitalize transition cursor-pointer shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-[#7C1D23] text-[#FDFBF7] shadow-2xs'
                  : 'text-[#5C5350] hover:text-[#2C2523]'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('today')}
              className={`px-3 py-1 rounded-lg font-cinzel font-semibold transition cursor-pointer shrink-0 flex items-center gap-1 ${
                statusFilter === 'today'
                  ? 'bg-purple-800 text-white shadow-2xs'
                  : 'text-purple-800 hover:bg-purple-100/60'
              }`}
            >
              <span>🛎️ Today ({summary.todayArrivals})</span>
            </button>
            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => {
              const count = bookings.filter((b) => (b.status || 'pending').toLowerCase() === status).length;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg font-cinzel font-semibold capitalize transition cursor-pointer shrink-0 ${
                    statusFilter === status
                      ? 'bg-[#7C1D23] text-[#FDFBF7] shadow-2xs'
                      : 'text-[#5C5350] hover:text-[#2C2523]'
                  }`}
                >
                  {status} ({count})
                </button>
              );
            })}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-semibold bg-[#FAF6EF] hover:bg-[#FAF0E0] text-[#7C1D23] border border-[#C5A059]/40 transition cursor-pointer shrink-0 shadow-2xs"
            title="Download CSV spreadsheet for office accounting"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPoliceRegister}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition cursor-pointer shrink-0 shadow-2xs"
            title="Download Uttarakhand Tourism / Police Form C verification register CSV"
          >
            <span>👮 Police Register</span>
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-[#FDFBF7] rounded-2xl border border-[#C5A059]/30 text-[#66605B]">
          <p className="text-sm font-cinzel font-semibold text-[#2C2523]">No guest bookings match your filter</p>
          <p className="text-xs text-[#66605B] mt-1">Check search keywords or select "All" to view all records.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#C5A059]/30 bg-[#FDFBF7] shadow-xs">
          <table className="w-full text-left text-xs text-[#2C2523] border-collapse">
            <thead className="bg-[#FAF6EF] text-[11px] font-cinzel uppercase text-[#2C2523] border-b border-[#C5A059]/30">
              <tr>
                <th className="py-3 px-4">Guest Information</th>
                <th className="py-3 px-4">Reserved Room</th>
                <th className="py-3 px-4">Dates & Nights</th>
                <th className="py-3 px-4">Total Bill</th>
                <th className="py-3 px-4">Booking Status</th>
                <th className="py-3 px-4 text-right">Office Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/15 font-sans">
              {filteredBookings.map((b) => {
                const nights = calculateNights(b.checkInDate, b.checkOutDate);
                const isUpdating = updatingId === b._id;

                return (
                  <tr key={b._id} className="hover:bg-[#FAF6EF]/60 transition">
                    {/* Guest Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-[#2C2523] text-sm">
                          {b.guestDetails?.name || 'Guest'}
                        </span>
                        {b.source && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-cinzel font-semibold bg-[#FAF6EF] text-[#7C1D23] border border-[#C5A059]/40">
                            {b.source}
                          </span>
                        )}
                      </div>
                      <div className="text-[#5C5350] font-mono text-[11px] flex items-center gap-2 mt-0.5">
                        {b.guestDetails?.phone ? (
                          <a
                            href={`tel:${b.guestDetails.phone}`}
                            className="text-[#7C1D23] hover:underline font-semibold flex items-center gap-1"
                            title="Click to call guest"
                          >
                            📞 {b.guestDetails.phone}
                          </a>
                        ) : (
                          <span>No phone</span>
                        )}
                      </div>
                      <div className="text-[#66605B] text-[11px] truncate max-w-[180px]">
                        ✉️ {b.guestDetails?.email || 'No email provided'}
                      </div>
                      <div className="mt-1">
                        <button
                          type="button"
                          onClick={() => setIdModalBooking(b)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] border font-medium transition cursor-pointer ${
                            b.idProofUrl || b.idProofNumber
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                          }`}
                          title={b.idProofUrl || b.idProofNumber ? 'View digital guest ID proof' : 'Upload guest ID proof for police register'}
                        >
                          <span>{b.idProofUrl || b.idProofNumber ? `🆔 ${b.idProofType || 'ID'}` : '⚠️ ID Pending'}</span>
                        </button>
                      </div>
                    </td>

                    {/* Suite Name & View */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#7C1D23] font-cinzel">
                        {b.room?.name || 'Himalayan Suite'}
                      </div>
                      {b.room?.view && (
                        <div className="text-[#66605B] text-[11px] line-clamp-1 max-w-[180px]">
                          {b.room.view}
                        </div>
                      )}
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[#2C2523]">
                        {formatDate(b.checkInDate)} → {formatDate(b.checkOutDate)}
                      </div>
                      <div className="text-[#66605B] text-[11px] mt-0.5">
                        <span className="font-semibold text-[#7C1D23]">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                      </div>
                    </td>

                    {/* Amount & Settlement */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-[#7C1D23] text-sm">
                        ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                      </div>
                      {b.advancePaid > 0 ? (
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          Adv: ₹{Number(b.advancePaid).toLocaleString('en-IN')} ({b.paymentMode || 'Paid'})
                        </div>
                      ) : null}
                      {(b.balanceDue > 0 || (b.advancePaid > 0 && b.totalAmount > b.advancePaid)) ? (
                        <div className="text-[10px] text-[#C84B0F] font-semibold">
                          Due: ₹{(b.balanceDue !== undefined ? b.balanceDue : (b.totalAmount - (b.advancePaid || 0))).toLocaleString('en-IN')}
                        </div>
                      ) : null}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={b.status || 'pending'}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-[11px] font-cinzel font-semibold uppercase tracking-wider border cursor-pointer focus:outline-none transition shadow-2xs ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : b.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : b.status === 'completed'
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {isUpdating && (
                          <span className="w-3.5 h-3.5 border-2 border-[#C5A059]/40 border-t-[#C5A059] rounded-full animate-spin shrink-0" />
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Confirm when pending */}
                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(b._id, 'confirmed')}
                            disabled={isUpdating}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer shadow-2xs whitespace-nowrap"
                            title="Quickly confirm this reservation"
                          >
                            ✓ Confirm
                          </button>
                        )}

                        {/* Guest Folio & Invoicing */}
                        <button
                          onClick={() => setFolioModalBooking(b)}
                          className="px-2.5 py-1 rounded-full text-xs font-cinzel font-semibold bg-[#FAF6EF] hover:bg-[#C5A059]/20 text-[#7C1D23] border border-[#C5A059]/50 transition cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1"
                          title="Open Guest Folio, Add Incidentals & Print Tax Invoice"
                        >
                          <span>Folio 🧾</span>
                          {b.folioExtras?.length > 0 && (
                            <span className="w-4 h-4 rounded-full bg-[#7C1D23] text-white text-[9px] font-mono flex items-center justify-center font-bold">
                              {b.folioExtras.length}
                            </span>
                          )}
                        </button>

                        {/* ID Proof Verification */}
                        <button
                          onClick={() => setIdModalBooking(b)}
                          className={`px-2 py-1 rounded-full text-xs font-cinzel font-semibold transition cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1 ${
                            b.idProofUrl || b.idProofNumber
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-[#FAF6EF] text-[#2C2523] border border-[#C5A059]/40 hover:bg-white'
                          }`}
                          title="Verify or Upload Guest Identity Document"
                        >
                          <span>ID 🪪</span>
                        </button>

                        {/* View Slip */}
                        <button
                          onClick={() => setViewSlipBooking(b)}
                          className="px-2.5 py-1 rounded-full text-xs font-cinzel font-semibold bg-[#FAF6EF] hover:bg-white text-[#2C2523] border border-[#C5A059]/40 transition cursor-pointer"
                          title="View & Print Booking Slip"
                        >
                          Slip 📄
                        </button>

                        {/* WhatsApp */}
                        {b.guestDetails?.phone && (
                          <button
                            onClick={() => handleOpenWhatsApp(b)}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition cursor-pointer shadow-2xs"
                            title="Send WhatsApp confirmation message"
                          >
                            <span>WhatsApp</span>
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-1 rounded-lg text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
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
      )}

      {/* PRINTABLE BOOKING SLIP MODAL */}
      {viewSlipBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in">
          <div className="printable-slip w-full max-w-lg bg-[#FDFBF7] border border-[#C5A059]/50 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#2C2523] animate-scale-up">
            {/* Header */}
            <div className="text-center pb-4 border-b border-[#C5A059]/30">
              <span className="text-[10px] uppercase font-cinzel tracking-[0.2em] text-[#C5A059] font-bold block mb-1">
                The Kasar Himalayan Heights
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2C2523]">Guest Reservation Voucher</h3>
              <p className="text-xs text-[#66605B]">Crank's Ridge, Kasar Devi, Almora • Tel: +91 96906 21247</p>
            </div>

            {/* Slip Content */}
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Booking ID:</span>
                <span className="font-mono font-bold text-[#2C2523]">{viewSlipBooking._id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Guest Name:</span>
                <span className="font-bold text-[#2C2523]">{viewSlipBooking.guestDetails?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Phone:</span>
                <span className="font-mono text-[#2C2523]">{viewSlipBooking.guestDetails?.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Email:</span>
                <span className="text-[#2C2523]">{viewSlipBooking.guestDetails?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Room:</span>
                <span className="font-bold text-[#7C1D23] font-cinzel">{viewSlipBooking.room?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Check-in:</span>
                <span className="font-mono">{formatDate(viewSlipBooking.checkInDate)} (From 12:00 PM)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Check-out:</span>
                <span className="font-mono">{formatDate(viewSlipBooking.checkOutDate)} (By 10:00 AM)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Total Duration:</span>
                <span className="font-bold">{calculateNights(viewSlipBooking.checkInDate, viewSlipBooking.checkOutDate)} Nights</span>
              </div>
              <div className="flex justify-between py-2 bg-[#FAF6EF] px-3 rounded-xl border border-[#C5A059]/30 text-sm font-bold">
                <span>Total Amount:</span>
                <span className="font-mono text-[#7C1D23]">₹{Number(viewSlipBooking.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-xs">
                <span className="text-[#66605B]">Current Status:</span>
                <span className="uppercase font-bold text-emerald-800">{viewSlipBooking.status || 'Pending'}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="no-print flex items-center justify-end gap-3 pt-4 border-t border-[#C5A059]/30">
              <button
                type="button"
                onClick={() => setViewSlipBooking(null)}
                className="px-4 py-2 rounded-full text-xs font-cinzel font-semibold text-[#5C5350] hover:text-[#2C2523] hover:bg-[#FAF6EF] border border-[#C5A059]/40 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-full text-xs font-cinzel font-semibold text-[#FDFBF7] bg-[#7C1D23] hover:bg-[#5C151A] transition cursor-pointer shadow-xs border border-[#C5A059]/40 flex items-center gap-1.5"
              >
                <span>Print Voucher 🖨️</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
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

      {/* GUEST FOLIO & CHECKOUT TAX INVOICE MODAL */}
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

      {/* DIGITAL GUEST ID PROOF MODAL */}
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
    </div>
  );
};

export default HotelBookingManager;
