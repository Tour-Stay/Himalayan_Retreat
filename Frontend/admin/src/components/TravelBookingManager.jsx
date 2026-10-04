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
      'Booking ID',
      'Traveler Name',
      'Phone',
      'Email',
      'Pickup Point',
      'Circuit/Package',
      'Vehicle',
      'Travel Date',
      'Travelers',
      'Total Fare (INR)',
      'Trip Status',
      'Payment Status',
    ];
    const rows = filteredBookings.map((b) => [
      b._id,
      `"${(b.guestDetails?.name || '').replace(/"/g, '""')}"`,
      `"${b.guestDetails?.phone || ''}"`,
      `"${b.guestDetails?.email || ''}"`,
      `"${(b.pickupLocation || '').replace(/"/g, '""')}"`,
      `"${(b.packageId?.title || b.circuit || '').replace(/"/g, '""')}"`,
      `"${(b.vehicleType || '').replace(/"/g, '""')}"`,
      b.travelDate ? new Date(b.travelDate).toISOString().split('T')[0] : '',
      b.travelers || 2,
      b.totalAmount || 0,
      b.status || 'pending',
      b.paymentStatus || 'pending',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(',')).join('\n')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travel_trips_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Downloaded travel trips CSV spreadsheet.', 'success');
  };

  // Update Trip Status
  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await apiClient.put(`/travel/bookings/${bookingId}/status`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      addToast(`Trip status marked as ${newStatus.toUpperCase()}`, 'success');
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

    const message = `Namaste ${guestName} ji! 🚙 Greetings from The Kasar Himalayan Heights Travel Desk.\n\nWe have received your trip inquiry:\n🎯 Route: *${destination}*\n🚘 Vehicle: ${vehicle}\n📍 Pickup Point: ${pickup}\n📅 Date: ${travelDate}\n👥 Travelers: ${b.travelers || 2} Persons\n💵 Fare: ₹${Number(b.totalAmount || 0).toLocaleString('en-IN')}\n\nOur mountain driver coordinator will call you a day prior with the driver name and vehicle number. For immediate assistance, feel free to call our desk at +91 96906 21247!`;

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
      {/* Office Cab Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FDFBF7] rounded-2xl border border-[#C5A059]/30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] border border-[#EAA722]/40 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#073125]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-[#66605B] tracking-wider font-semibold">Total Trips</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-[#073125]">{summary.totalTrips}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-[#EAA722]/20 sm:pl-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-[#66605B] tracking-wider font-semibold">Today's Pickups</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-800">{summary.todayTrips} Pickups</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-[#EAA722]/20 sm:pl-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-[#66605B] tracking-wider font-semibold">Pending Drivers</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-700">{summary.pendingTrips}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-l sm:border-[#EAA722]/20 sm:pl-3">
          <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[#073125]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-cinzel uppercase text-[#66605B] tracking-wider font-semibold">Total Fare</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-[#073125]">
              ₹{summary.totalFare.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Filters */}
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
            placeholder="Search traveler, pickup point, vehicle, or circuit..."
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

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Trip Status filter */}
          <div className="flex items-center gap-1 bg-[#FAF6EF] p-1 rounded-xl border border-[#C5A059]/25 text-xs overflow-x-auto scrollbar-none">
            <span className="text-[10px] uppercase font-cinzel px-2 text-[#66605B]">Trip:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg capitalize font-cinzel font-semibold transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#7C1D23] text-[#FDFBF7] shadow-2xs'
                  : 'text-[#5C5350] hover:text-[#2C2523]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('today')}
              className={`px-2.5 py-1 rounded-lg font-cinzel font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'today'
                  ? 'bg-[#073125] text-[#EAA722] shadow-2xs font-bold'
                  : 'text-[#073125] hover:bg-[#FAF5EC]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Today ({summary.todayTrips})</span>
            </button>
            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg capitalize font-cinzel font-semibold transition cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#7C1D23] text-[#FDFBF7] shadow-2xs'
                    : 'text-[#5C5350] hover:text-[#2C2523]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Payment Status filter */}
          <div className="flex items-center gap-1 bg-[#FAF6EF] p-1 rounded-xl border border-[#C5A059]/25 text-xs">
            <span className="text-[10px] uppercase font-cinzel px-2 text-[#66605B]">Pay:</span>
            {['all', 'pending', 'paid', 'refunded'].map((pay) => (
              <button
                key={pay}
                onClick={() => setPaymentFilter(pay)}
                className={`px-2.5 py-1 rounded-lg capitalize font-cinzel font-semibold transition cursor-pointer ${
                  paymentFilter === pay
                    ? 'bg-[#7C1D23] text-[#FDFBF7] shadow-2xs'
                    : 'text-[#5C5350] hover:text-[#2C2523]'
                }`}
              >
                {pay}
              </button>
            ))}
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cinzel font-semibold bg-[#FAF6EF] hover:bg-[#FAF0E0] text-[#7C1D23] border border-[#C5A059]/40 transition cursor-pointer shrink-0 shadow-2xs"
            title="Download CSV spreadsheet for cab operations"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-[#FDFBF7] rounded-2xl border border-[#C5A059]/30 text-[#66605B]">
          <p className="text-sm font-cinzel font-semibold text-[#2C2523]">No travel inquiries match your criteria</p>
          <p className="text-xs text-[#66605B] mt-1">Adjust search terms or clear filters to view all trips.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#C5A059]/30 bg-[#FDFBF7] shadow-xs">
          <table className="w-full text-left text-xs text-[#2C2523] border-collapse">
            <thead className="bg-[#FAF6EF] text-[11px] font-cinzel uppercase text-[#2C2523] border-b border-[#C5A059]/30">
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
            <tbody className="divide-y divide-[#C5A059]/15 font-sans">
              {filteredBookings.map((b) => {
                const isUpdating = updatingId === b._id;

                return (
                  <tr key={b._id} className="hover:bg-[#FAF6EF]/60 transition">
                    {/* Traveler */}
                    <td className="py-3.5 px-4">
                      <div className="font-serif font-bold text-[#2C2523] text-sm">
                        {b.guestDetails?.name || 'Traveler'}
                      </div>
                      <div className="text-[#5C5350] font-mono text-[11px] mt-0.5">
                        {b.guestDetails?.phone ? (
                          <a
                            href={`tel:${b.guestDetails.phone}`}
                            className="text-[#7C1D23] hover:underline font-semibold flex items-center gap-1"
                            title="Click to call traveler"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> {b.guestDetails.phone}
                          </a>
                        ) : (
                          <span>No phone</span>
                        )}
                      </div>
                      <div className="text-[#66605B] text-[11px] truncate max-w-[170px]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> {b.guestDetails?.email || 'No email provided'}
                      </div>
                    </td>

                    {/* Route & Vehicle */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#7C1D23] font-cinzel">
                        {b.packageId?.title || b.circuit || 'Custom Hill Route'}
                      </div>
                      <div className="text-[#66605B] text-[11px] mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF6EF] font-mono text-[10px] text-[#2C2523] border border-[#C5A059]/30 inline-flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#7C1D23]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4m-11 0h14m-15-5l2-6h10l2 6m-14 0h14m-15 0v3a1 1 0 001 1h1m12-4v3a1 1 0 01-1 1h-1" /></svg>
                          <span>{b.vehicleType || 'Chauffeur Cab'}</span>
                        </span>
                        <span>• {b.travelers || 2} Pax</span>
                      </div>
                      {b.dispatchDetails?.driverName && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[10px] border border-emerald-300 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <span>{b.dispatchDetails.driverName}</span>
                            {b.dispatchDetails.vehiclePlate && <span>({b.dispatchDetails.vehiclePlate})</span>}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Date & Pickup */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[#2C2523] flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>{formatDate(b.travelDate)}</span>
                      </div>
                      <div className="text-[#66605B] text-[11px] mt-0.5 line-clamp-1 max-w-[170px] flex items-center gap-1" title={b.pickupLocation}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="truncate">{b.pickupLocation || 'Kathgodam / Kasar Devi'}</span>
                      </div>
                    </td>

                    {/* Fare */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#7C1D23] text-sm">
                      ₹{Number(b.totalAmount || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Trip Status */}
                    <td className="py-3.5 px-4">
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
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4">
                      <select
                        value={b.paymentStatus || 'pending'}
                        disabled={isUpdating}
                        onChange={(e) => handlePaymentChange(b._id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-cinzel font-semibold uppercase tracking-wider border cursor-pointer focus:outline-none transition shadow-2xs ${
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
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Confirm Trip */}
                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(b._id, 'confirmed')}
                            disabled={isUpdating}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer shadow-2xs whitespace-nowrap"
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
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white transition cursor-pointer shadow-2xs whitespace-nowrap"
                            title="Mark trip fare as paid"
                          >
                            ₹ Paid
                          </button>
                        )}

                        {/* Assign & Dispatch Command Center */}
                        <button
                          onClick={() => setDispatchModalTrip(b)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-cinzel font-semibold transition cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1.5 ${
                            b.dispatchDetails?.driverName
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                              : 'bg-linear-to-r from-[#7C1D23] to-[#9B232A] text-white hover:brightness-110'
                          }`}
                          title={b.dispatchDetails?.driverName ? 'Manage Driver & Dispatch' : 'Assign Chauffeur & Dispatch'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4m-11 0h14m-15-5l2-6h10l2 6m-14 0h14m-15 0v3a1 1 0 001 1h1m12-4v3a1 1 0 01-1 1h-1" /></svg>
                          <span>{b.dispatchDetails?.driverName ? 'Dispatched' : 'Dispatch'}</span>
                        </button>

                        {/* View Dispatch Slip */}
                        <button
                          onClick={() => setViewSlipTrip(b)}
                          className="px-2.5 py-1 rounded-full text-xs font-cinzel font-semibold bg-[#FAF6EF] hover:bg-white text-[#2C2523] border border-[#C5A059]/40 transition cursor-pointer flex items-center gap-1"
                          title="View & Print Driver Dispatch Slip"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-[#7C1D23]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <span>Slip</span>
                        </button>

                        {/* WhatsApp */}
                        {b.guestDetails?.phone && (
                          <button
                            onClick={() => handleOpenWhatsApp(b)}
                            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition cursor-pointer shadow-2xs"
                            title="Send WhatsApp confirmation to traveler"
                          >
                            <span>WhatsApp</span>
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-1 rounded-lg text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
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
      )}

      {/* PRINTABLE DRIVER TRIP DISPATCH SLIP */}
      {viewSlipTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in">
          <div className="printable-slip w-full max-w-lg bg-[#FDFBF7] border border-[#C5A059]/50 rounded-3xl shadow-2xl p-6 sm:p-8 text-[#2C2523] animate-scale-up">
            {/* Header */}
            <div className="text-center pb-4 border-b border-[#C5A059]/30">
              <span className="text-[10px] uppercase font-cinzel tracking-[0.2em] text-[#C5A059] font-bold block mb-1">
                The Kasar Himalayan Heights
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2C2523]">Chauffeur Trip Dispatch Slip</h3>
              <p className="text-xs text-[#66605B]">Mountain Cab Operations • Almora Hub • Tel: +91 96906 21247</p>
            </div>

            {/* Slip Details */}
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Trip Booking ID:</span>
                <span className="font-mono font-bold text-[#2C2523]">{viewSlipTrip._id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Traveler Name:</span>
                <span className="font-bold text-[#2C2523]">{viewSlipTrip.guestDetails?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Traveler Phone:</span>
                <span className="font-mono text-[#2C2523]">{viewSlipTrip.guestDetails?.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Pickup Point:</span>
                <span className="font-bold text-[#7C1D23]">{viewSlipTrip.pickupLocation || 'Kathgodam / Kasar Devi'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Route / Circuit:</span>
                <span className="font-bold">{viewSlipTrip.packageId?.title || viewSlipTrip.circuit || 'Kumaon Hill Circuit'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Assigned Vehicle Model:</span>
                <span className="font-mono font-bold text-[#2C2523]">{viewSlipTrip.vehicleType || 'SUV Chauffeur'}</span>
              </div>
              {viewSlipTrip.dispatchDetails?.driverName && (
                <>
                  <div className="flex justify-between py-1 border-b border-[#C5A059]/15 bg-emerald-50/50 px-2 rounded-lg">
                    <span className="text-emerald-900 font-semibold">Assigned Chauffeur:</span>
                    <span className="font-bold text-emerald-900">
                      {viewSlipTrip.dispatchDetails.driverName} {viewSlipTrip.dispatchDetails.driverPhone ? `(Tel: ${viewSlipTrip.dispatchDetails.driverPhone})` : ''}
                    </span>
                  </div>
                  {viewSlipTrip.dispatchDetails?.vehiclePlate && (
                    <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                      <span className="text-[#66605B]">Vehicle Reg Plate:</span>
                      <span className="font-mono font-bold text-[#7C1D23]">{viewSlipTrip.dispatchDetails.vehiclePlate}</span>
                    </div>
                  )}
                  {viewSlipTrip.dispatchDetails?.trainNumber && (
                    <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                      <span className="text-[#66605B]">Train / Arrival:</span>
                      <span className="font-medium text-[#2C2523]">
                        {viewSlipTrip.dispatchDetails.trainNumber} {viewSlipTrip.dispatchDetails.trainEta ? `(ETA: ${viewSlipTrip.dispatchDetails.trainEta})` : ''}
                      </span>
                    </div>
                  )}
                  {viewSlipTrip.dispatchDetails?.luggageCount > 0 && (
                    <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                      <span className="text-[#66605B]">Luggage Pieces:</span>
                      <span className="font-mono">{viewSlipTrip.dispatchDetails.luggageCount} Bags</span>
                    </div>
                  )}
                  {viewSlipTrip.dispatchDetails?.fareToCollect > 0 && (
                    <div className="flex justify-between py-1 border-b border-[#C5A059]/15 bg-amber-50/60 px-2 rounded-lg">
                      <span className="text-amber-900 font-semibold">Fare to Collect:</span>
                      <span className="font-mono font-bold text-[#7C1D23]">₹{Number(viewSlipTrip.dispatchDetails.fareToCollect).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Travel Date:</span>
                <span className="font-mono">{formatDate(viewSlipTrip.travelDate)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#C5A059]/15">
                <span className="text-[#66605B]">Passenger Count:</span>
                <span className="font-bold">{viewSlipTrip.travelers || 2} Persons</span>
              </div>
              <div className="flex justify-between py-2 bg-[#FAF6EF] px-3 rounded-xl border border-[#C5A059]/30 text-sm font-bold">
                <span>Total Fare:</span>
                <span className="font-mono text-[#7C1D23]">₹{Number(viewSlipTrip.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-xs">
                <span className="text-[#66605B]">Payment Status:</span>
                <span className="uppercase font-bold text-emerald-800">{viewSlipTrip.paymentStatus || 'Pending'}</span>
              </div>
              {viewSlipTrip.notes && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[#5C5350]">
                  <strong>Special Traveler Notes:</strong> {viewSlipTrip.notes}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="no-print flex items-center justify-end gap-3 pt-4 border-t border-[#C5A059]/30">
              <button
                type="button"
                onClick={() => setViewSlipTrip(null)}
                className="px-4 py-2 rounded-full text-xs font-cinzel font-semibold text-[#5C5350] hover:text-[#2C2523] hover:bg-[#FAF6EF] border border-[#C5A059]/40 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-full text-xs font-cinzel font-semibold text-[#FDFBF7] bg-[#7C1D23] hover:bg-[#5C151A] transition cursor-pointer shadow-xs border border-[#C5A059]/40 flex items-center gap-1.5"
              >
                <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg> Print Dispatch Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRAVEL DISPATCH & DRIVER COMMAND CENTER MODAL */}
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

      {/* DELETE CONFIRM DIALOG */}
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
