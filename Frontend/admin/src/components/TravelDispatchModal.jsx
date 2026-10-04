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
      const res = await apiClient.put(`/api/travel/bookings/${booking._id}/dispatch`, {
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
Resort Travel Desk: ${settings.company?.conciergePhone || '+91 96906 21247'}`;

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
📞 *Chauffeur Mobile:* ${driverPhone || settings.company?.conciergePhone || '+91 96906 21247'}
📍 *Pickup Point:* ${booking.pickupLocation || 'Kathgodam / Kasar Devi'}
${trainNumber ? `🚆 *Train Monitored:* ${trainNumber} (ETA: ${trainEta || 'On Schedule'})\n` : ''}
${Number(fareToCollect) > 0 ? `💰 *Balance Fare to Settle:* ₹${Number(fareToCollect).toLocaleString('en-IN')}\n` : '💰 *Fare:* Fully Paid / Settlement Handled\n'}
Our driver will greet you with a name board at the meeting point. For any transit assistance on the highway, feel free to contact our round-the-clock desk at ${settings.company?.conciergePhone || '+91 96906 21247'}.

Wishing you a peaceful and scenic journey to the Himalayas! 🌲🏔️`;

    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#FDFBF7] border border-[#C5A059]/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-[#2C2523] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#2C2523] via-[#3D3330] to-[#2C2523] text-white p-5 sm:p-6 border-b border-[#C5A059]/40 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition cursor-pointer text-sm"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Mountain Transit Command Center
            </span>
            <span className="text-xs text-white/50">•</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
              Trip #{booking._id?.slice(-6).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span>Cab & Driver Dispatch Desk</span>
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Assign dedicated mountain chauffeurs, sync train arrivals, calculate net operator margins, and dispatch WhatsApp instructions.
          </p>

          {/* Quick Context Card */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-white/5 border border-white/10 rounded-xl p-3">
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-cinzel block">Guest</span>
              <span className="font-semibold text-white">{booking.guestDetails?.name || 'Guest'}</span>
              <span className="text-stone-300 text-[10px] block font-mono">{booking.guestDetails?.phone}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-cinzel block">Travel Date</span>
              <span className="font-semibold text-white font-mono">{formatDate(booking.travelDate)}</span>
              <span className="text-stone-300 text-[10px] block">{booking.travelers || 2} Passengers</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-cinzel block">Route & Vehicle</span>
              <span className="font-semibold text-[#C5A059] truncate block" title={booking.packageId?.title || booking.circuit}>
                {booking.packageId?.title || booking.circuit || 'Hill Transfer'}
              </span>
              <span className="text-stone-300 text-[10px] block capitalize">{booking.vehicleType || 'Cab'}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[10px] uppercase font-cinzel block">Total Trip Fare</span>
              <span className="font-bold text-white font-mono text-sm">₹{totalFare.toLocaleString('en-IN')}</span>
              <span className={`text-[10px] font-semibold uppercase ${booking.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {booking.paymentStatus || 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSaveDispatch} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs font-sans">
          {/* Section 1: Driver & Vehicle Allocation */}
          <div className="bg-[#FAF6EF] border border-[#C5A059]/25 rounded-2xl p-4">
            <h3 className="text-xs font-cinzel font-bold text-[#7C1D23] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>🚘</span> Chauffeur & Vehicle Allocation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                  Driver Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Puran Chandra Joshi"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                  Driver Mobile Phone <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9411122334"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                  Vehicle Plate Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. UK 04 TA 8892"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs font-mono font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Train Tracking & Transit Details */}
          <div className="bg-[#FAF6EF] border border-[#C5A059]/25 rounded-2xl p-4">
            <h3 className="text-xs font-cinzel font-bold text-[#7C1D23] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>🚆</span> Transit & Pickup Coordination
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                  Train / Transit Details
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12040 Kathgodam Shatabdi"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                  Expected Arrival Time (ETA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 11:40 AM"
                  value={trainEta}
                  onChange={(e) => setTrainEta(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                  Luggage Count
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={luggageCount}
                  onChange={(e) => setLuggageCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs font-mono"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                Special Pickup Instructions / Route Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Meet guest at Platform 1 arrival gate with guest name placard. Assist senior citizen with luggage."
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs resize-none"
              />
            </div>
          </div>

          {/* Section 3: Financial Settlement & Operator Margin */}
          <div className="bg-[#FAF6EF] border border-[#C5A059]/25 rounded-2xl p-4">
            <h3 className="text-xs font-cinzel font-bold text-[#7C1D23] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>💰</span> Trip Settlement & Net Margin Calculator
              </span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${netMargin >= 1000 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                Net Margin: ₹{netMargin.toLocaleString('en-IN')}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                  Fuel Advance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={fuelEstimate}
                  onChange={(e) => setFuelEstimate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs font-mono"
                />
                <span className="text-[10px] text-stone-500 mt-0.5 block">Estimated petrol/diesel cost</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                  Driver Allowance / Bata (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={driverAllowance}
                  onChange={(e) => setDriverAllowance(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs font-mono"
                />
                <span className="text-[10px] text-stone-500 mt-0.5 block">Food & daily hill allowance</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                  Fare to Collect from Guest (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={fareToCollect}
                  onChange={(e) => setFareToCollect(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#7C1D23] font-bold focus:outline-hidden focus:border-[#7C1D23] text-xs font-mono"
                />
                <span className="text-[10px] text-stone-500 mt-0.5 block">
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition cursor-pointer shadow-xs"
                title="Send pickup instructions to driver on WhatsApp"
              >
                <span>💬</span>
                <span>Dispatch Driver via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppGuest}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-black text-white transition cursor-pointer shadow-xs"
                title="Notify passenger with driver & cab plate details"
              >
                <span>📲</span>
                <span>Notify Guest</span>
              </button>
            </div>

            {/* Save & Dismiss */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-cinzel font-semibold bg-[#FAF6EF] hover:bg-stone-200 text-[#2C2523] border border-[#C5A059]/40 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-cinzel font-bold uppercase tracking-wider bg-linear-to-r from-[#7C1D23] to-[#9B232A] hover:brightness-110 text-white shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
