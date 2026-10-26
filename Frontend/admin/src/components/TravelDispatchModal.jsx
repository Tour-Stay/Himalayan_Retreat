import { useState, useMemo } from 'react';
import { apiClient, useSiteSettings } from '@shared';
import { useToast } from './Toast';

export default function TravelDispatchModal({ booking, isOpen, onClose, onDispatched }) {
  const { addToast } = useToast();
  const { settings } = useSiteSettings();

  const existingDispatch = booking?.dispatchDetails || {};

  // Form states
  const [driverName, setDriverName] = useState(existingDispatch.driverName || '');
  const [driverPhone, setDriverPhone] = useState(existingDispatch.driverPhone || '');
  const [vehiclePlate, setVehiclePlate] = useState(existingDispatch.vehiclePlate || '');
  const [trainNumber, setTrainNumber] = useState(existingDispatch.trainNumber || '');
  const [trainEta, setTrainEta] = useState(existingDispatch.trainEta || '');
  const [luggageCount, setLuggageCount] = useState(existingDispatch.luggageCount || 2);
  const [fuelEstimate, setFuelEstimate] = useState(existingDispatch.fuelEstimate || 1200);
  const [driverAllowance, setDriverAllowance] = useState(existingDispatch.driverAllowance || 500);
  const [fareToCollect, setFareToCollect] = useState(
    existingDispatch.fareToCollect !== undefined
      ? existingDispatch.fareToCollect
      : booking?.paymentStatus === 'paid'
      ? 0
      : booking?.totalAmount || 0
  );
  const [dispatchNotes, setDispatchNotes] = useState(existingDispatch.dispatchNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial margin calculation
  const totalFare = Number(booking?.totalAmount || 0);
  const netMargin = useMemo(() => {
    return totalFare - Number(fuelEstimate || 0) - Number(driverAllowance || 0);
  }, [totalFare, fuelEstimate, driverAllowance]);

  if (!isOpen || !booking) return null;

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Submit dispatch to backend
  const handleSaveDispatch = async (e) => {
    if (e) e.preventDefault();
    if (!driverName.trim()) {
      addToast('Please provide a Chauffeur / Driver name.', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await apiClient.put(`/travel/bookings/${booking._id}/dispatch`, {
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim(),
        vehiclePlate: vehiclePlate.trim(),
        trainNumber: trainNumber.trim(),
        trainEta: trainEta.trim(),
        luggageCount: Number(luggageCount) || 0,
        fuelEstimate: Number(fuelEstimate) || 0,
        driverAllowance: Number(driverAllowance) || 0,
        fareToCollect: Number(fareToCollect) || 0,
        dispatchNotes: dispatchNotes.trim(),
      });

      addToast('Cab & Driver allocated and dispatched successfully!', 'success');
      if (onDispatched) {
        onDispatched(res.data?.booking || { ...booking, dispatchDetails: res.data?.booking?.dispatchDetails });
      }
      onClose();
    } catch (err) {
      console.error('Dispatch error:', err);
      addToast(err.response?.data?.message || 'Failed to dispatch cab booking.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1-Click WhatsApp for Driver
  const handleWhatsAppDriver = () => {
    if (!driverPhone) {
      addToast('Please enter the driver mobile number first.', 'warning');
      return;
    }

    const cleanPhone = driverPhone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const text = `🏔️ *KASAR HIMALAYAN HEIGHTS - DRIVER DISPATCH SLIP*
────────────────────────
🚘 *Vehicle Plate:* ${vehiclePlate || 'Assigned Cab'}
👤 *Assigned Driver:* ${driverName || 'Driver'}

👤 *Passenger:* ${booking.guestDetails?.name || 'Traveler'} (${booking.travelers || 2} Pax)
📞 *Passenger Phone:* ${booking.guestDetails?.phone || 'N/A'}
📍 *Pickup Location:* ${booking.pickupLocation || 'Kathgodam'}
📅 *Date of Travel:* ${formatDate(booking.travelDate)}
${trainNumber ? `🚆 *Train / Transit:* ${trainNumber} (ETA: ${trainEta || 'As scheduled'})\n` : ''}🧳 *Luggage Pieces:* ${luggageCount} Bags
🏔️ *Circuit / Route:* ${booking.packageId?.title || booking.circuit || 'Mountain Transfer'}

💰 *Fare to Collect from Guest:* ₹${Number(fareToCollect).toLocaleString('en-IN')}
⛽ *Fuel Advance:* ₹${Number(fuelEstimate).toLocaleString('en-IN')}
🍽️ *Driver Allowance:* ₹${Number(driverAllowance).toLocaleString('en-IN')}
${dispatchNotes ? `📝 *Special Instructions:* ${dispatchNotes}\n` : ''}
⚠️ *Mandatory Instructions:*
1. Hold guest name placard at the arrival exit.
2. Drive carefully on mountain hairpins & ghat roads.
3. Keep complimentary mineral water inside cab.
────────────────────────
Resort Travel Desk: ${settings.company?.conciergePhone || '+91 88999 33339'}`;

    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // 1-Click WhatsApp Notification for Guest
  const handleWhatsAppGuest = () => {
    if (!booking.guestDetails?.phone) {
      addToast('Traveler has no phone number recorded.', 'warning');
      return;
    }

    const cleanPhone = booking.guestDetails.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const text = `🏔️ *${settings.company?.brandName || 'The Kasar Himalayan Heights'} - Cab Allocation*

Namaste ${booking.guestDetails?.name || 'Traveler'} ji! 🙏

Your chauffeured mountain cab for *${formatDate(booking.travelDate)}* has been assigned:

🚘 *Vehicle:* ${booking.vehicleType || 'Hill Cab'} (${vehiclePlate ? `Reg: ${vehiclePlate}` : 'Commercial Tourist Permit'})
👤 *Dedicated Chauffeur:* ${driverName || 'Experienced Pahadi Chauffeur'}
📞 *Chauffeur Mobile:* ${driverPhone || settings.company?.conciergePhone || '+91 88999 33339'}
📍 *Pickup Point:* ${booking.pickupLocation || 'Kathgodam / Kasar Devi'}
${trainNumber ? `🚆 *Train Monitored:* ${trainNumber} (ETA: ${trainEta || 'On Schedule'})\n` : ''}
${Number(fareToCollect) > 0 ? `💰 *Balance Fare to Settle:* ₹${Number(fareToCollect).toLocaleString('en-IN')}\n` : '💰 *Fare:* Fully Paid / Settlement Handled\n'}
Our driver will greet you with a name board at the meeting point. For any transit assistance on the highway, feel free to contact our round-the-clock desk at ${settings.company?.conciergePhone || '+91 88999 33339'}.

Wishing you a peaceful and scenic journey to the Himalayas! 🌲🏔️`;

    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="w-full sm:max-w-2xl bg-white border border-[#C5A059]/40 shadow-2xl overflow-hidden my-0 sm:my-auto text-[#0F172A] flex flex-col max-h-[95vh] sm:max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0B1118] text-white p-4 sm:p-5 border-b border-[#C5A059]/40 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 flex items-center justify-center transition cursor-pointer text-sm border border-white/10"
            title="Close"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Mountain Transit Command Center
            </span>
            <span className="text-xs text-white/50">•</span>
            <span className="text-[10px] font-mono text-[#D4AF37] bg-[#C5A059]/15 px-2 py-0.5 border border-[#C5A059]/30">
              Trip #{booking._id?.slice(-6).toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
            <span>Cab & Driver Dispatch Desk</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 pr-6 sm:pr-0">
            Assign dedicated mountain chauffeurs, sync train arrivals, calculate net operator margins, and dispatch WhatsApp instructions.
          </p>

          {/* Quick Context Card */}
          <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white/5 border border-white/10 p-2.5 sm:p-3">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Guest</span>
              <span className="font-semibold text-white block truncate">{booking.guestDetails?.name || 'Guest'}</span>
              <span className="text-slate-300 text-[10px] block font-mono">{booking.guestDetails?.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Travel Date</span>
              <span className="font-semibold text-white font-mono block">{formatDate(booking.travelDate)}</span>
              <span className="text-slate-300 text-[10px] block">{booking.travelers || 2} Passengers</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Route & Vehicle</span>
              <span className="font-semibold text-[#D4AF37] truncate block" title={booking.packageId?.title || booking.circuit}>
                {booking.packageId?.title || booking.circuit || 'Hill Transfer'}
              </span>
              <span className="text-slate-300 text-[10px] block capitalize">{booking.vehicleType || 'Cab'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-cinzel block">Total Trip Fare</span>
              <span className="font-bold text-white font-mono text-sm block">₹{totalFare.toLocaleString('en-IN')}</span>
              <span className={`text-[10px] font-semibold uppercase ${booking.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {booking.paymentStatus || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSaveDispatch} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs font-sans flex-1">
          {/* Section 1: Driver & Vehicle Allocation */}
          <div className="bg-[#FAF8F5] border border-slate-200 p-3.5 sm:p-4 space-y-3">
            <h3 className="text-xs font-cinzel font-bold text-[#0B1118] uppercase tracking-wider flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100-4 2 2 0 000 4zm8 0a2 2 0 100-4 2 2 0 000 4m-11 0h14m-15-5l2-6h10l2 6m-14 0h14m-15 0v3a1 1 0 001 1h1m12-4v3a1 1 0 01-1 1h-1" /></svg>
              <span>Chauffeur &amp; Vehicle Allocation</span>
            </h3>

            {settings?.travelPolicies?.driverRoster?.length > 0 && (
              <div className="p-2.5 bg-white border border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-[#0B1118]">
                  ⚡ 1-Click Pick from Driver Roster:
                </span>
                <select
                  onChange={(e) => {
                    const selected = settings.travelPolicies.driverRoster.find((d) => d.id === e.target.value);
                    if (selected) {
                      setDriverName(selected.name);
                      setDriverPhone(selected.phone);
                    }
                  }}
                  defaultValue=""
                  className="text-xs px-2.5 py-1 border border-slate-300 bg-white text-[#0F172A] font-medium focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="" disabled>-- Select Verified Driver --</option>
                  {settings.travelPolicies.driverRoster.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.vehicleAssigned || 'Cab'} • {d.phone})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Driver Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Puran Chandra Joshi"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Driver Mobile Phone <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9411122334"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Vehicle Plate Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. UK 04 TA 8892"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] text-xs font-mono font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Train Tracking & Transit Details */}
          <div className="bg-[#FAF8F5] border border-slate-200 p-3.5 sm:p-4 space-y-3">
            <h3 className="text-xs font-cinzel font-bold text-[#0B1118] uppercase tracking-wider flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              <span>Transit &amp; Pickup Coordination</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Train / Transit Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12040 Kathgodam Shatabdi"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Expected Arrival Time (ETA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 11:40 AM"
                  value={trainEta}
                  onChange={(e) => setTrainEta(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Luggage Count
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={luggageCount}
                  onChange={(e) => setLuggageCount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                Special Pickup Instructions / Route Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Meet guest at Platform 1 arrival gate with guest name placard. Assist senior citizen with luggage."
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] text-xs resize-none"
              />
            </div>
          </div>

          {/* Section 3: Financial Settlement & Operator Margin */}
          <div className="bg-[#FAF8F5] border border-slate-200 p-3.5 sm:p-4 space-y-3">
            <h3 className="text-xs font-cinzel font-bold text-[#0B1118] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Trip Settlement &amp; Net Margin</span>
              </span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 border ${netMargin >= 1000 ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                Net Margin: ₹{netMargin.toLocaleString('en-IN')}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Fuel Advance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={fuelEstimate}
                  onChange={(e) => setFuelEstimate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Estimated fuel advance</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Driver Allowance / Bata (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={driverAllowance}
                  onChange={(e) => setDriverAllowance(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Daily hill allowance</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#0F172A] mb-1">
                  Fare to Collect from Guest (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={fareToCollect}
                  onChange={(e) => setFareToCollect(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0B1118] font-bold focus:outline-none focus:border-[#C5A059] text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {booking.paymentStatus === 'paid' ? 'Marked as already paid' : 'Cash/UPI collected by driver'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* WhatsApp Quick Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleWhatsAppDriver}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer shadow-xs border border-emerald-600"
                title="Send pickup instructions to driver on WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span>Dispatch Driver via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppGuest}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#0B1118] hover:bg-[#111827] text-white transition cursor-pointer shadow-xs border border-[#C5A059]/40"
                title="Notify passenger with driver & cab plate details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                <span>Notify Guest</span>
              </button>
            </div>

            {/* Save & Dismiss */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-cinzel font-semibold bg-[#FAF8F5] hover:bg-slate-200 text-[#0F172A] border border-slate-300 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-cinzel font-bold uppercase tracking-wider bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B1118] shadow-sm transition cursor-pointer disabled:opacity-50 border border-[#D4AF37]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#0B1118]/30 border-t-[#0B1118] rounded-full animate-spin shrink-0" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>Save & Dispatch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
