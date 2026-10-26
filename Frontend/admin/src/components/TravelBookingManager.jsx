import { useState, useMemo } from 'react';
import { apiClient } from '@shared';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './Toast';
import TravelDispatchModal from './TravelDispatchModal';

export const TravelBookingManager = ({ bookings, setBookings, onRefresh }) => {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  // Selected trip for Dispatch Slip Modal
  const [viewSlipTrip, setViewSlipTrip] = useState(null);

  // Selected trip for Command Center Dispatch Modal
  const [dispatchModalTrip, setDispatchModalTrip] = useState(null);

  // Delete state
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

  // Filtered travel bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const name = b.guestDetails?.name || '';
      const phone = b.guestDetails?.phone || '';
      const email = b.guestDetails?.email || '';
      const vehicle = b.vehicleType || '';
      const circuit = b.circuit || '';
      const pickup = b.pickupLocation || '';
      const packageTitle = b.packageId?.title || '';

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        phone.includes(search) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.toLowerCase().includes(search.toLowerCase()) ||
        circuit.toLowerCase().includes(search.toLowerCase()) ||
        pickup.toLowerCase().includes(search.toLowerCase()) ||
        packageTitle.toLowerCase().includes(search.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === 'today') {
        matchesStatus = isToday(b.travelDate);
      } else if (statusFilter !== 'all') {
        matchesStatus = (b.status || 'pending').toLowerCase() === statusFilter;
      }

      const matchesPayment =
        paymentFilter === 'all' || (b.paymentStatus || 'pending').toLowerCase() === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, search, statusFilter, paymentFilter]);

  // Financial summary for cab desk
  const summary = useMemo(() => {
    const totalTrips = bookings.length;
    const pendingTrips = bookings.filter((b) => b.status === 'pending').length;
    const todayTrips = bookings.filter((b) => isToday(b.travelDate)).length;
    const totalFare = bookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
    return { totalTrips, pendingTrips, todayTrips, totalFare };
  }, [bookings]);

  // Export to CSV for travel desk accounting
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) {
      addToast('No travel bookings to export.', 'info');
      return;
    }

    const headers = [
      'Trip ID',
      'Traveler Name',
      'Traveler Phone',
      'Traveler Email',
      'Vehicle Type',
      'Route / Package',
      'Travel Date',
      'Pickup Location',
      'Total Fare',
      'Status',
      'Payment Status',
      'Chauffeur Name',
      'Vehicle Plate',
    ];

    const rows = filteredBookings.map((b) => [
      b._id,
      b.guestDetails?.name || '',
      b.guestDetails?.phone || '',
      b.guestDetails?.email || '',
      b.vehicleType || '',
      b.packageId?.title || b.circuit || '',
      formatDate(b.travelDate),
      b.pickupLocation || '',
      b.totalAmount || 0,
      b.status || 'pending',
      b.paymentStatus || 'pending',
      b.dispatchDetails?.driverName || '',
      b.dispatchDetails?.vehiclePlate || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((cell) => `"${cell}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Kasar_Himalayan_Cab_Trips_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Exported ${filteredBookings.length} travel bookings to CSV!`, 'success');
  };

  // Update Trip Status
  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await apiClient.put(`/travel/bookings/${bookingId}/status`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      addToast(`Trip status updated to ${newStatus.toUpperCase()}`, 'success');
    } catch (err) {
      addToast(
        'Failed to update trip status: ' + (err.response?.data?.message || err.message),
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Update Payment Status
  const handlePaymentChange = async (bookingId, newPaymentStatus) => {
    setUpdatingId(bookingId);
    try {
      await apiClient.put(`/travel/bookings/${bookingId}/payment`, { paymentStatus: newPaymentStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, paymentStatus: newPaymentStatus } : b))
      );
      addToast(`Payment updated to ${newPaymentStatus.toUpperCase()}`, 'success');
    } catch (err) {
      addToast(
        'Failed to update payment status: ' + (err.response?.data?.message || err.message),
        'error'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // 1-Click WhatsApp liaison
  const handleOpenWhatsApp = (b) => {
    const rawPhone = b.guestDetails?.phone || '';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const guestName = b.guestDetails?.name || 'Valued Traveler';
    const vehicle = b.vehicleType || 'SUV Chauffeur';
    const destination = b.packageId?.title || b.circuit || 'Kumaon Hill Circuit';
    const travelDate = formatDate(b.travelDate);
    const pickup = b.pickupLocation || 'Kathgodam / Kasar Devi';

    const message = `Namaste ${guestName} ji! 🚙 Greetings from The Kasar Himalayan Heights Travel Desk.\n\nWe have received your trip inquiry:\n🎯 Route: *${destination}*\n🚘 Vehicle: ${vehicle}\n📍 Pickup Point: ${pickup}\n📅 Date: ${travelDate}\n👥 Travelers: ${b.travelers || 2} Persons\n💵 Fare: ₹${Number(b.totalAmount || 0).toLocaleString('en-IN')}\n\nOur mountain driver coordinator will call you a day prior with the driver name and vehicle number. For immediate assistance, feel free to call our desk at +91 88999 33339!`;

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await apiClient.delete(`/travel/bookings/${deleteTarget._id}`);
      setBookings((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      addToast('Travel booking removed.', 'info');
      setDeleteTarget(null);
    } catch (err) {
      addToast('Failed to delete travel booking: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ── 1. Cab Desk Financial Summary Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 sm:p-4 bg-white border border-[#C5A059]/30 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-[#FAF8F5] border border-[#C5A059]/40 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0B1118]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-slate-500 tracking-wider font-semibold">Total Trips</div>
            <div className="text-base sm:text-lg font-bold font-mono text-[#0F172A]">{summary.totalTrips}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-200 sm:pl-3">
          <div className="w-9 h-9 bg-emerald-50 border border-emerald-300 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-slate-500 tracking-wider font-semibold">Today's Pickups</div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-800">{summary.todayTrips} Pickups</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-200 sm:pl-3">
          <div className="w-9 h-9 bg-amber-50 border border-amber-300 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-slate-500 tracking-wider font-semibold">Pending Drivers</div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-700">{summary.pendingTrips}</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-200 sm:pl-3">
          <div className="w-9 h-9 bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0B1118]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-slate-500 tracking-wider font-semibold">Total Fare</div>
            <div className="text-base sm:text-lg font-bold font-mono text-[#0F172A]">
              ₹{summary.totalFare.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Controls & Search & Filter Bar ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 border border-[#C5A059]/30 shadow-xs">
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
            placeholder="Search traveler, pickup point, vehicle, or circuit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-slate-300 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
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

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 lg:pb-0 scrollbar-none">
          {/* Trip Status filter */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 border border-slate-200 text-xs shrink-0 w-max">
            <span className="text-[10px] uppercase font-cinzel px-2 text-slate-500 font-semibold shrink-0">Trip:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 capitalize font-cinzel font-semibold transition cursor-pointer shrink-0 whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-[#0B1118] text-[#D4AF37] shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('today')}
              className={`px-2.5 py-1 font-cinzel font-semibold transition cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === 'today'
                  ? 'bg-[#0B1118] text-[#D4AF37] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-[#C5A059] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Today ({summary.todayTrips})</span>
            </button>
            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 capitalize font-cinzel font-semibold transition cursor-pointer shrink-0 whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-[#0B1118] text-[#D4AF37] shadow-xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Payment Status filter */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 border border-slate-200 text-xs shrink-0 w-max">
            <span className="text-[10px] uppercase font-cinzel px-2 text-slate-500 font-semibold shrink-0">Pay:</span>
            {['all', 'pending', 'paid', 'refunded'].map((pay) => (
              <button
                key={pay}
                onClick={() => setPaymentFilter(pay)}
                className={`px-2.5 py-1 capitalize font-cinzel font-semibold transition cursor-pointer shrink-0 whitespace-nowrap ${
                  paymentFilter === pay
                    ? 'bg-[#0B1118] text-[#D4AF37] shadow-xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                {pay}
              </button>
            ))}
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-semibold bg-[#FAF8F5] hover:bg-slate-200 text-[#0F172A] border border-slate-300 transition cursor-pointer shrink-0 whitespace-nowrap shadow-2xs"
            title="Download CSV spreadsheet for cab operations"
          >
            <svg className="w-3.5 h-3.5 text-[#C5A059] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── 3. Content Area: Mobile Cards & Desktop Table ── */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#C5A059]/30 text-slate-500">
          <svg className="w-12 h-12 mx-auto text-[#C5A059]/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <p className="text-sm font-cinzel font-bold text-[#0F172A]">No travel inquiries match your criteria</p>
          <p className="text-xs text-slate-500 mt-1">Adjust search terms or clear filters to view all trips.</p>
        </div>
      ) : (
        <>
          {/* ── MOBILE VIEW: Touch-Friendly Cab Booking Cards (Zero Horizontal Scrolling) ── */}
          <div className="md:hidden space-y-3">
            {filteredBookings.map((b) => {
              const isUpdating = updatingId === b._id;

              return (
                <div
                  key={b._id}
                  className="bg-white border border-[#C5A059]/35 p-3.5 shadow-xs space-y-3 relative"
                >
                  {/* Top Bar: Traveler Name & Trip Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#0F172A] leading-tight">
                        {b.guestDetails?.name || 'Traveler'}
                      </h4>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        Trip #{b._id?.slice(-6).toUpperCase()}
                      </div>
                    </div>

                    {/* Trip Status Select */}
                    <select
                      value={b.status || 'pending'}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className={`px-2.5 py-1 text-[10px] font-cinzel font-bold uppercase tracking-wider border cursor-pointer focus:outline-none transition ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                          : b.status === 'cancelled'
                          ? 'bg-rose-50 text-rose-800 border-rose-400'
                          : b.status === 'completed'
                          ? 'bg-sky-50 text-sky-800 border-sky-400'
                          : 'bg-amber-50 text-amber-800 border-amber-400'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Trip Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#FAF8F5] p-2.5 border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-cinzel text-slate-500 block">Date & Pickup</span>
                      <span className="font-mono font-semibold text-[#0F172A] block">{formatDate(b.travelDate)}</span>
                      <span className="text-slate-600 text-[11px] block truncate" title={b.pickupLocation}>
                        📍 {b.pickupLocation || 'Kathgodam / Kasar Devi'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-cinzel text-slate-500 block">Vehicle & Route</span>
                      <span className="font-bold text-[#0B1118] block truncate">
                        {b.vehicleType || 'SUV Cab'} ({b.travelers || 2} Pax)
                      </span>
                      <span className="text-slate-600 text-[11px] block truncate">
                        {b.packageId?.title || b.circuit || 'Hill Transfer'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-cinzel text-slate-500 block">Trip Fare</span>
                      <span className="font-mono font-bold text-sm text-[#0F172A]">
                        ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-cinzel text-slate-500 block">Payment</span>
                      <select
                        value={b.paymentStatus || 'pending'}
                        disabled={isUpdating}
                        onChange={(e) => handlePaymentChange(b._id, e.target.value)}
                        className={`text-[10px] font-cinzel font-semibold uppercase tracking-wider px-2 py-0.5 border cursor-pointer focus:outline-none ${
                          b.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : b.paymentStatus === 'refunded'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="pending">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>
                  </div>

                  {/* Driver Allocation Bar */}
                  <div className="flex items-center justify-between gap-2 p-2 border border-[#C5A059]/30 bg-white">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#C5A059] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {b.dispatchDetails?.driverName ? (
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-emerald-800 block truncate">
                            {b.dispatchDetails.driverName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 block truncate">
                            {b.dispatchDetails.vehiclePlate || 'Commercial Permit'} {b.dispatchDetails.driverPhone ? `• ${b.dispatchDetails.driverPhone}` : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-700 font-semibold">Driver: Unassigned</span>
                      )}
                    </div>

                    <button
                      onClick={() => setDispatchModalTrip(b)}
                      className={`px-3 py-1.5 text-xs font-cinzel font-bold uppercase tracking-wider border cursor-pointer whitespace-nowrap shadow-2xs ${
                        b.dispatchDetails?.driverName
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-400 hover:bg-emerald-100'
                          : 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B1118] border-[#D4AF37]'
                      }`}
                    >
                      {b.dispatchDetails?.driverName ? 'Edit Driver' : 'Assign Cab'}
                    </button>
                  </div>

                  {/* Quick Action Touch Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {/* Call Passenger */}
                    {b.guestDetails?.phone && (
                      <a
                        href={`tel:${b.guestDetails.phone}`}
                        className="flex-1 min-w-[70px] flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold bg-[#FAF8F5] hover:bg-slate-200 text-[#0F172A] border border-slate-300"
                        title="Call guest"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>Call</span>
                      </a>
                    )}

                    {/* WhatsApp */}
                    {b.guestDetails?.phone && (
                      <button
                        onClick={() => handleOpenWhatsApp(b)}
                        className="flex-1 min-w-[90px] flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600 cursor-pointer shadow-2xs"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>WhatsApp</span>
                      </button>
                    )}

                    {/* Dispatch Slip */}
                    <button
                      onClick={() => setViewSlipTrip(b)}
                      className="flex-1 min-w-[70px] flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-cinzel font-semibold bg-[#FAF8F5] hover:bg-slate-200 text-[#0F172A] border border-slate-300 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Slip</span>
                    </button>

                    {/* Quick Confirm */}
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(b._id, 'confirmed')}
                        disabled={isUpdating}
                        className="px-3 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600 cursor-pointer"
                        title="Confirm trip"
                      >
                        ✓ Confirm
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(b)}
                      className="p-2 text-rose-700 hover:bg-rose-50 border border-slate-300 hover:border-rose-400 cursor-pointer"
                      title="Delete trip"
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

          {/* ── DESKTOP VIEW: Full Data Table with Zero Border-Radius ── */}
          <div className="hidden md:block overflow-x-auto border border-[#C5A059]/30 bg-white shadow-xs">
            <table className="w-full text-left text-xs text-[#0F172A] border-collapse">
              <thead className="bg-[#FAF8F5] text-[10px] font-cinzel uppercase text-[#0F172A] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Traveler Contact</th>
                  <th className="py-3 px-4">Route & Vehicle</th>
                  <th className="py-3 px-4">Date & Pickup Point</th>
                  <th className="py-3 px-4">Trip Fare</th>
                  <th className="py-3 px-4">Trip Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Office Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredBookings.map((b) => {
                  const isUpdating = updatingId === b._id;

                  return (
                    <tr key={b._id} className="hover:bg-[#FAF8F5]/60 transition">
                      {/* Traveler */}
                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-[#0F172A] text-sm">
                          {b.guestDetails?.name || 'Traveler'}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                          {b.guestDetails?.phone ? (
                            <a
                              href={`tel:${b.guestDetails.phone}`}
                              className="text-[#0B1118] hover:text-[#C5A059] font-semibold flex items-center gap-1"
                              title="Click to call traveler"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#C5A059] inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              {b.guestDetails.phone}
                            </a>
                          ) : (
                            <span>No phone</span>
                          )}
                        </div>
                        <div className="text-slate-400 text-[10px] truncate max-w-[170px]">
                          {b.guestDetails?.email || 'No email provided'}
                        </div>
                      </td>

                      {/* Route & Vehicle */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0B1118] font-cinzel">
                          {b.packageId?.title || b.circuit || 'Custom Hill Route'}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-[#FAF8F5] font-mono text-[10px] text-[#0F172A] border border-slate-200 inline-flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4m-11 0h14m-15-5l2-6h10l2 6m-14 0h14m-15 0v3a1 1 0 001 1h1m12-4v3a1 1 0 01-1 1h-1" />
                            </svg>
                            <span>{b.vehicleType || 'Chauffeur Cab'}</span>
                          </span>
                          <span>• {b.travelers || 2} Pax</span>
                          {b.tripType && (
                            <span className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase border ${
                              b.tripType === 'round-trip' ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {b.tripType === 'round-trip' ? 'Round-Trip' : 'One-Way'}
                            </span>
                          )}
                        </div>
                        {b.dispatchDetails?.driverName && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 font-mono text-[10px] border border-emerald-300 font-medium">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{b.dispatchDetails.driverName}</span>
                              {b.dispatchDetails.vehiclePlate && <span>({b.dispatchDetails.vehiclePlate})</span>}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Date & Pickup */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-[#0F172A] flex items-center gap-1.5 font-semibold">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(b.travelDate)}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 line-clamp-1 max-w-[170px] flex items-center gap-1" title={b.pickupLocation}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{b.pickupLocation || 'Kathgodam / Kasar Devi'}</span>
                        </div>
                      </td>

                      {/* Fare */}
                      <td className="py-3 px-4 font-mono font-bold text-[#0F172A] text-sm">
                        ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Trip Status */}
                      <td className="py-3 px-4">
                        <select
                          value={b.status || 'pending'}
                          disabled={isUpdating}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className={`px-2.5 py-1 text-[11px] font-cinzel font-semibold uppercase tracking-wider border cursor-pointer focus:outline-none transition shadow-2xs ${
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
                      </td>

                      {/* Payment Status */}
                      <td className="py-3 px-4">
                        <select
                          value={b.paymentStatus || 'pending'}
                          disabled={isUpdating}
                          onChange={(e) => handlePaymentChange(b._id, e.target.value)}
                          className={`px-2 py-1 text-[11px] font-cinzel font-semibold uppercase tracking-wider border cursor-pointer focus:outline-none transition shadow-2xs ${
                            b.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : b.paymentStatus === 'refunded'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="pending">Unpaid</option>
                          <option value="paid">Paid</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Confirm Trip */}
                          {b.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(b._id, 'confirmed')}
                              disabled={isUpdating}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer shadow-2xs whitespace-nowrap border border-emerald-600"
                              title="Quickly confirm this trip"
                            >
                              ✓ Confirm
                            </button>
                          )}

                          {/* Quick Paid */}
                          {b.paymentStatus === 'pending' && (
                            <button
                              onClick={() => handlePaymentChange(b._id, 'paid')}
                              disabled={isUpdating}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer shadow-2xs whitespace-nowrap border border-amber-500"
                              title="Mark trip fare as paid"
                            >
                              ₹ Paid
                            </button>
                          )}

                          {/* Assign & Dispatch Command Center */}
                          <button
                            onClick={() => setDispatchModalTrip(b)}
                            className={`px-2.5 py-1 text-[11px] font-cinzel font-semibold transition cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5 border ${
                              b.dispatchDetails?.driverName
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B1118] border-[#D4AF37]'
                            }`}
                            title={b.dispatchDetails?.driverName ? 'Manage Driver & Dispatch' : 'Assign Chauffeur & Dispatch'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4m-11 0h14m-15-5l2-6h10l2 6m-14 0h14m-15 0v3a1 1 0 001 1h1m12-4v3a1 1 0 01-1 1h-1" />
                            </svg>
                            <span>{b.dispatchDetails?.driverName ? 'Dispatched' : 'Dispatch'}</span>
                          </button>

                          {/* View Dispatch Slip */}
                          <button
                            onClick={() => setViewSlipTrip(b)}
                            className="px-2 py-1 text-xs font-cinzel font-semibold bg-[#FAF8F5] hover:bg-slate-200 text-[#0F172A] border border-slate-300 transition cursor-pointer flex items-center gap-1"
                            title="View & Print Driver Dispatch Slip"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Slip</span>
                          </button>

                          {/* WhatsApp */}
                          {b.guestDetails?.phone && (
                            <button
                              onClick={() => handleOpenWhatsApp(b)}
                              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition cursor-pointer shadow-2xs"
                              title="Send WhatsApp confirmation to traveler"
                            >
                              <span>WhatsApp</span>
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteTarget(b)}
                            className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
                            title="Delete trip booking"
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

      {/* ── 4. PRINTABLE DRIVER TRIP DISPATCH SLIP ── */}
      {viewSlipTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="printable-slip w-full max-w-lg bg-white border border-[#C5A059]/50 shadow-2xl p-5 sm:p-7 text-[#0F172A] animate-scale-up my-auto max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center pb-3.5 border-b border-slate-200">
              <span className="text-[10px] uppercase font-cinzel tracking-[0.2em] text-[#C5A059] font-bold block mb-1">
                The Kasar Himalayan Heights
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">Chauffeur Trip Dispatch Slip</h3>
              <p className="text-xs text-slate-500">Mountain Cab Operations • Almora Hub • Tel: +91 88999 33339</p>
            </div>

            {/* Slip Details */}
            <div className="py-3.5 space-y-2.5 text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Trip Booking ID:</span>
                <span className="font-mono font-bold text-[#0F172A]">{viewSlipTrip._id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Traveler Name:</span>
                <span className="font-bold text-[#0F172A]">{viewSlipTrip.guestDetails?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Traveler Phone:</span>
                <span className="font-mono text-[#0F172A]">{viewSlipTrip.guestDetails?.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pickup Point:</span>
                <span className="font-bold text-[#0B1118]">{viewSlipTrip.pickupLocation || 'Kathgodam / Kasar Devi'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Route / Circuit:</span>
                <span className="font-bold text-[#0F172A]">{viewSlipTrip.packageId?.title || viewSlipTrip.circuit || 'Kumaon Hill Circuit'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Assigned Vehicle Model:</span>
                <span className="font-mono font-bold text-[#0F172A]">{viewSlipTrip.vehicleType || 'SUV Chauffeur'}</span>
              </div>
              {viewSlipTrip.dispatchDetails?.driverName && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 bg-emerald-50/60 px-2">
                    <span className="text-emerald-900 font-semibold">Assigned Chauffeur:</span>
                    <span className="font-bold text-emerald-900">
                      {viewSlipTrip.dispatchDetails.driverName} {viewSlipTrip.dispatchDetails.driverPhone ? `(Tel: ${viewSlipTrip.dispatchDetails.driverPhone})` : ''}
                    </span>
                  </div>
                  {viewSlipTrip.dispatchDetails?.vehiclePlate && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Vehicle Reg Plate:</span>
                      <span className="font-mono font-bold text-[#0B1118]">{viewSlipTrip.dispatchDetails.vehiclePlate}</span>
                    </div>
                  )}
                  {viewSlipTrip.dispatchDetails?.trainNumber && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Train / Arrival:</span>
                      <span className="font-medium text-[#0F172A]">
                        {viewSlipTrip.dispatchDetails.trainNumber} {viewSlipTrip.dispatchDetails.trainEta ? `(ETA: ${viewSlipTrip.dispatchDetails.trainEta})` : ''}
                      </span>
                    </div>
                  )}
                  {viewSlipTrip.dispatchDetails?.luggageCount > 0 && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Luggage Pieces:</span>
                      <span className="font-mono">{viewSlipTrip.dispatchDetails.luggageCount} Bags</span>
                    </div>
                  )}
                  {viewSlipTrip.dispatchDetails?.fareToCollect > 0 && (
                    <div className="flex justify-between py-1.5 border-b border-slate-100 bg-amber-50/70 px-2">
                      <span className="text-amber-900 font-semibold">Fare to Collect:</span>
                      <span className="font-mono font-bold text-[#0B1118]">₹{Number(viewSlipTrip.dispatchDetails.fareToCollect).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Travel Date:</span>
                <span className="font-mono">{formatDate(viewSlipTrip.travelDate)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Passenger Count:</span>
                <span className="font-bold">{viewSlipTrip.travelers || 2} Persons</span>
              </div>
              <div className="flex justify-between py-2 bg-[#FAF8F5] px-3 border border-slate-200 text-sm font-bold">
                <span>Total Fare:</span>
                <span className="font-mono text-[#0B1118]">₹{Number(viewSlipTrip.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-xs">
                <span className="text-slate-500">Payment Status:</span>
                <span className="uppercase font-bold text-emerald-800">{viewSlipTrip.paymentStatus || 'Pending'}</span>
              </div>
              {viewSlipTrip.notes && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-slate-700">
                  <strong>Special Traveler Notes:</strong> {viewSlipTrip.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="no-print flex items-center justify-end gap-2.5 pt-3.5 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setViewSlipTrip(null)}
                className="px-4 py-2 text-xs font-cinzel font-semibold text-slate-700 hover:text-[#0F172A] bg-[#FAF8F5] hover:bg-slate-200 border border-slate-300 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-cinzel font-semibold text-[#0B1118] bg-[#C5A059] hover:bg-[#D4AF37] transition cursor-pointer shadow-xs border border-[#D4AF37] flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print Dispatch Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. TRAVEL DISPATCH & DRIVER COMMAND CENTER MODAL ── */}
      {dispatchModalTrip && (
        <TravelDispatchModal
          booking={dispatchModalTrip}
          isOpen={Boolean(dispatchModalTrip)}
          onClose={() => setDispatchModalTrip(null)}
          onDispatched={(updatedBooking) => {
            setBookings((prev) =>
              prev.map((item) => (item._id === updatedBooking._id ? updatedBooking : item))
            );
            if (onRefresh) onRefresh();
          }}
        />
      )}

      {/* ── 6. DELETE CONFIRM DIALOG ── */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Travel Booking"
        message={`Are you sure you want to remove the cab / tour reservation for ${deleteTarget?.guestDetails?.name || 'this traveler'}?`}
        confirmText="Delete Trip Record"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default TravelBookingManager;
