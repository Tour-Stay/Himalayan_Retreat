import { useState, useMemo } from 'react';
import { apiClient, useSiteSettings } from '@shared';
import { useToast } from './Toast';

export default function FolioInvoiceModal({ booking, isOpen, onClose, onFolioUpdated }) {
  const { addToast } = useToast();
  const { settings } = useSiteSettings();

  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'invoice'
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  // Settlement inputs
  const [settleAmount, setSettleAmount] = useState('');
  const [settleMode, setSettleMode] = useState('UPI');
  const [markCheckedOut, setMarkCheckedOut] = useState(false);

  // Preset charges for quick 1-click addition
  const PRESET_CHARGES = [
    { label: 'Pahadi Thali Dinner', item: 'Pahadi Kumaoni Dinner Thali', amount: 350 },
    { label: 'Evening Bonfire', item: 'Private Evening Bonfire & Wood Log', amount: 500 },
    { label: 'Room Heater (1 Day)', item: 'Oil Radiator Winter Room Heater', amount: 300 },
    { label: 'Kainchi Pooja Thali', item: 'Consecrated Temple Offering Basket', amount: 250 },
    { label: 'Herbal Mountain Tea', item: 'Herbal Himalayan Tea Kettle Service', amount: 150 },
    { label: 'Laundry Service', item: 'Garment Pressing & Laundry', amount: 200 },
  ];

  if (!isOpen || !booking) return null;

  // Nights calculation (plain calculation to prevent React Hook count mismatches)
  let nights = 1;
  if (booking.checkInDate && booking.checkOutDate) {
    try {
      const inDate = new Date(booking.checkInDate);
      const outDate = new Date(booking.checkOutDate);
      const diffTime = outDate.getTime() - inDate.getTime();
      const calcNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (!isNaN(calcNights) && calcNights > 0) {
        nights = calcNights;
      }
    } catch {
      nights = 1;
    }
  }

  // Safe IDs
  const rawId = booking._id ? String(booking._id) : '';
  const folioShortId = rawId ? rawId.slice(-6).toUpperCase() : 'RESRV';
  const invoiceShortId = rawId ? rawId.slice(-8).toUpperCase() : 'INV-001';

  // Base Room Tariff subtotal
  const roomPricePerNight = Number(booking.room?.pricePerNight || 0);
  const baseRoomTotal = roomPricePerNight > 0 ? nights * roomPricePerNight : Number(booking.totalAmount || 0);

  // Folio extras list & total
  const extrasList = Array.isArray(booking.folioExtras) ? booking.folioExtras : [];
  const extrasTotal = extrasList.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // Gross total, advance, balance
  const grossTotal = Number(booking.totalAmount || (baseRoomTotal + extrasTotal));
  const advancePaid = Number(booking.advancePaid || 0);
  const balanceDue = Number(booking.balanceDue !== undefined ? booking.balanceDue : Math.max(0, grossTotal - advancePaid));

  // Date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Add Item to Folio
  const handleAddFolioItem = async (e) => {
    if (e) e.preventDefault();
    const amountNum = Number(newItemAmount);
    if (!newItemDesc.trim() || isNaN(amountNum) || amountNum <= 0) {
      addToast('Please enter a valid item description and positive charge amount.', 'warning');
      return;
    }

    try {
      setIsAdding(true);
      const res = await apiClient.post(`/hotel/bookings/${booking._id}/folio`, {
        item: newItemDesc.trim(),
        amount: amountNum,
      });

      addToast(`Added "${newItemDesc.trim()}" (₹${amountNum}) to guest folio!`, 'success');
      setNewItemDesc('');
      setNewItemAmount('');

      if (onFolioUpdated && res.data?.booking) {
        onFolioUpdated(res.data.booking);
      }
    } catch (err) {
      console.error('Add folio charge error:', err);
      addToast(err.response?.data?.message || 'Failed to add charge to folio.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  // Quick Preset Add
  const handleQuickAdd = async (preset) => {
    try {
      setIsAdding(true);
      const res = await apiClient.post(`/hotel/bookings/${booking._id}/folio`, {
        item: preset.item,
        amount: preset.amount,
      });

      addToast(`Added "${preset.item}" (₹${preset.amount}) to guest folio!`, 'success');
      if (onFolioUpdated && res.data?.booking) {
        onFolioUpdated(res.data.booking);
      }
    } catch (err) {
      console.error('Add preset charge error:', err);
      addToast(err.response?.data?.message || 'Failed to add charge.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  // Remove Item from Folio
  const handleRemoveFolioItem = async (chargeId) => {
    try {
      const res = await apiClient.delete(`/hotel/bookings/${booking._id}/folio/${chargeId}`);
      addToast('Folio charge removed successfully.', 'info');
      if (onFolioUpdated && res.data?.booking) {
        onFolioUpdated(res.data.booking);
      }
    } catch (err) {
      console.error('Remove folio charge error:', err);
      addToast(err.response?.data?.message || 'Failed to remove charge.', 'error');
    }
  };

  // Settle Payment & Checkout
  const handleSettlePayment = async (e) => {
    if (e) e.preventDefault();
    const amountToSettle = Number(settleAmount || balanceDue);

    if (isNaN(amountToSettle) || amountToSettle < 0) {
      addToast('Please enter a valid settlement amount.', 'warning');
      return;
    }

    try {
      setIsSettling(true);
      const res = await apiClient.put(`/hotel/bookings/${booking._id}/settle`, {
        amountPaid: amountToSettle,
        paymentMode: settleMode,
        markCheckedOut: markCheckedOut,
      });

      addToast(
        `Received ₹${amountToSettle.toLocaleString('en-IN')} via ${settleMode}${
          markCheckedOut ? ' • Guest Checked Out' : ''
        }!`,
        'success'
      );
      setSettleAmount('');

      if (onFolioUpdated && res.data?.booking) {
        onFolioUpdated(res.data.booking);
      }
    } catch (err) {
      console.error('Settle payment error:', err);
      addToast(err.response?.data?.message || 'Failed to settle folio.', 'error');
    } finally {
      setIsSettling(false);
    }
  };

  // Share Statement via WhatsApp
  const handleWhatsAppStatement = () => {
    if (!booking.guestDetails?.phone) {
      addToast('Guest has no phone number on file.', 'warning');
      return;
    }

    const cleanPhone = booking.guestDetails.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const itemsSummary = extrasList.length > 0
      ? extrasList.map((x, i) => `${i + 1}. ${x.item}: ₹${Number(x.amount).toLocaleString('en-IN')}`).join('\n')
      : 'No incidental extras charged.';

    const text = `🏔️ *${settings.company?.hotelName || 'The Kasar Himalayan Heights'} - Guest Folio Statement*
────────────────────────
👤 *Guest:* ${booking.guestDetails?.name}
🏠 *Room:* ${booking.room?.name || 'Chalet Suite'} (${nights} Nights)
📅 *Stay:* ${formatDate(booking.checkInDate)} to ${formatDate(booking.checkOutDate)}
────────────────────────
*CHARGES BREAKDOWN:*
🏨 Room Stay (${nights} Nights): ₹${baseRoomTotal.toLocaleString('en-IN')}
*On-Property Extras & Dining:*
${itemsSummary}
────────────────────────
💰 *Total Gross Folio:* ₹${grossTotal.toLocaleString('en-IN')}
💳 *Advance / Payments Received:* -₹${advancePaid.toLocaleString('en-IN')}
💵 *Net Balance Due at Checkout:* ₹${balanceDue.toLocaleString('en-IN')}
────────────────────────
UPI Settlement ID: ${settings.company?.upiId || 'kasarhimalayan@upi'}
Reception Front Desk: ${settings.company?.conciergePhone || '+91 96906 21247'}

Thank you for staying with us at Kasar Devi! 🙏`;

    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // UPI payment link for QR Code
  const company = settings?.company || {};
  const upiId = company.upiId || 'kasarhimalayan@upi';
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    company.brandName || 'The Kasar Himalayan Heights'
  )}&am=${balanceDue}&cu=INR&tn=${encodeURIComponent(`Checkout Folio ${folioShortId}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    upiString
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#FDFBF7] border border-[#C5A059]/40 rounded-3xl shadow-2xl overflow-hidden my-auto text-[#2C2523] flex flex-col max-h-[94vh]">
        {/* Header (Hidden on print) */}
        <div className="no-print bg-linear-to-r from-[#2C2523] via-[#3D3330] to-[#2C2523] text-white p-5 sm:p-6 border-b border-[#C5A059]/40 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition cursor-pointer text-sm"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-cinzel uppercase tracking-[0.2em] text-[#C5A059] font-bold">
              Front-Desk Billing & Invoicing Engine
            </span>
            <span className="text-xs text-white/50">•</span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800">
              Folio #{folioShortId}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Guest Folio & Tax Invoice
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                {booking.guestDetails?.name} • Room: {booking.room?.name || 'Deluxe Suite'} • {nights} Nights ({formatDate(booking.checkInDate)} – {formatDate(booking.checkOutDate)})
              </p>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl self-start sm:self-auto border border-white/15">
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition cursor-pointer ${
                  activeTab === 'ledger'
                    ? 'bg-[#C5A059] text-[#2C2523] shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> Folio Ledger</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('invoice')}
                className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition cursor-pointer ${
                  activeTab === 'invoice'
                    ? 'bg-[#C5A059] text-[#2C2523] shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: FOLIO LEDGER & INCIDENTALS */}
        {activeTab === 'ledger' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs font-sans">
            {/* Live Financial Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#FAF6EF] rounded-2xl border border-[#C5A059]/30">
                <span className="text-[10px] font-cinzel uppercase text-stone-500 block">Room Stay ({nights}N)</span>
                <span className="font-mono text-base font-bold text-[#2C2523]">₹{baseRoomTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3.5 bg-[#FAF6EF] rounded-2xl border border-[#C5A059]/30">
                <span className="text-[10px] font-cinzel uppercase text-stone-500 block">Extras / Dining</span>
                <span className="font-mono text-base font-bold text-[#7C1D23]">+₹{extrasTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-[10px] font-cinzel uppercase text-emerald-800 block">Advance Settled</span>
                <span className="font-mono text-base font-bold text-emerald-800">-₹{advancePaid.toLocaleString('en-IN')}</span>
              </div>
              <div className={`p-3.5 rounded-2xl border ${balanceDue > 0 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'}`}>
                <span className="text-[10px] font-cinzel uppercase font-bold block text-stone-700">Balance Due</span>
                <span className={`font-mono text-lg font-bold ${balanceDue > 0 ? 'text-[#7C1D23]' : 'text-emerald-800'}`}>
                  ₹{balanceDue.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="bg-[#FAF6EF] p-4 rounded-2xl border border-[#C5A059]/25">
              <h4 className="text-[11px] font-cinzel font-bold uppercase tracking-wider text-[#7C1D23] mb-2.5">
                <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#7C1D23]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 1-Click Quick Add Incidentals</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {PRESET_CHARGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAdding}
                    onClick={() => handleQuickAdd(preset)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-[#2C2523] border border-[#C5A059]/40 text-xs font-medium transition cursor-pointer hover:border-[#7C1D23] shadow-2xs flex items-center gap-1.5"
                  >
                    <span>{preset.label}</span>
                    <span className="font-mono text-emerald-800 font-semibold">(₹{preset.amount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Add Custom Charge */}
            <form onSubmit={handleAddFolioItem} className="bg-white p-4 rounded-2xl border border-[#C5A059]/30 shadow-2xs">
              <h4 className="text-[11px] font-cinzel font-bold uppercase tracking-wider text-[#2C2523] mb-3 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#7C1D23]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                <span>Add Custom Charge / Meal / Service</span>
              </h4>
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Item description (e.g. 2x Hot Milk with Almonds & Saffron)"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-[#FAF6EF] border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] text-xs"
                />
                <div className="w-full sm:w-36 flex items-center">
                  <span className="px-2.5 py-2 bg-[#FAF6EF] border border-r-0 border-[#C5A059]/40 rounded-l-xl text-stone-500 font-mono text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Amount"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-r-xl bg-[#FAF6EF] border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23] font-mono text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#7C1D23] hover:bg-[#9B232A] text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-xs transition cursor-pointer whitespace-nowrap"
                >
                  {isAdding ? 'Adding...' : '+ Add Charge'}
                </button>
              </div>
            </form>

            {/* Current Itemized Folio Table */}
            <div className="border border-[#C5A059]/30 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <div className="bg-[#FAF6EF] px-4 py-2.5 border-b border-[#C5A059]/30 flex items-center justify-between font-cinzel text-xs font-bold text-[#2C2523]">
                <span>Itemized Folio Ledger</span>
                <span>{extrasList.length + 1} Line Items</span>
              </div>
              <table className="w-full text-left text-xs border-collapse">
                <thead className="text-[10px] uppercase font-cinzel text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4">Date / Time</th>
                    <th className="py-2.5 px-4 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {/* Base Room Stay Line */}
                  <tr className="bg-stone-50/60">
                    <td className="py-2.5 px-4">
                      <span className="font-semibold text-[#2C2523]">
                        Accommodation: {booking.room?.name || 'Chalet Suite'}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        Base Room Tariff ({nights} Nights × ₹{roomPricePerNight.toLocaleString('en-IN')})
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-stone-500 font-mono text-[11px]">
                      {formatDate(booking.checkInDate)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-[#2C2523]">
                      ₹{baseRoomTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-center text-stone-400 text-[10px]">
                      Standard Stay
                    </td>
                  </tr>

                  {/* Incidentals */}
                  {extrasList.map((extra) => (
                    <tr key={extra._id} className="hover:bg-amber-50/40 transition">
                      <td className="py-2.5 px-4 font-medium text-[#2C2523]">
                        {extra.item}
                      </td>
                      <td className="py-2.5 px-4 text-stone-500 font-mono text-[11px]">
                        {extra.addedAt ? formatDate(extra.addedAt) : 'On Stay'}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-[#7C1D23]">
                        ₹{Number(extra.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveFolioItem(extra._id)}
                          className="text-stone-400 hover:text-rose-600 transition cursor-pointer p-1 text-xs"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Settlement & Checkout Box */}
            <form onSubmit={handleSettlePayment} className="p-4 bg-[#FAF6EF] rounded-2xl border border-[#C5A059]/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-cinzel font-bold uppercase tracking-wider text-[#2C2523] flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#7C1D23]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Front-Desk Payment Settlement & Checkout</span>
                </h4>
                <span className="text-xs font-mono font-bold text-[#7C1D23]">
                  Due: ₹{balanceDue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                    Amount Received Now (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder={`e.g. ${balanceDue}`}
                    value={settleAmount}
                    onChange={(e) => setSettleAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] font-mono text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#2C2523] mb-1">
                    Payment Method
                  </label>
                  <select
                    value={settleMode}
                    onChange={(e) => setSettleMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#C5A059]/40 text-[#2C2523] text-xs focus:outline-hidden font-medium"
                  >
                    <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash at Front Desk</option>
                    <option value="Card">Debit / Credit Card (POS)</option>
                    <option value="Bank Transfer">NEFT / IMPS Bank Transfer</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2 text-xs font-medium text-[#2C2523]">
                    <input
                      type="checkbox"
                      checked={markCheckedOut}
                      onChange={(e) => setMarkCheckedOut(e.target.checked)}
                      className="rounded text-[#7C1D23] focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Mark Guest as Checked Out</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppStatement}
                    className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    <span>Share Statement on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('invoice')}
                    className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-black text-white font-semibold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span>View & Print Tax Invoice</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSettling}
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-[#7C1D23] to-[#9B232A] hover:brightness-110 text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isSettling ? 'Recording...' : '✓ Record Settlement'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: PRINTABLE TAX INVOICE & CHECKOUT STATEMENT */}
        {activeTab === 'invoice' && (
          <div className="p-5 sm:p-8 overflow-y-auto font-serif text-[#2C2523]">
            {/* The Printable Container */}
            <div id="hotel-tax-invoice" className="bg-white border border-[#C5A059]/40 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              {/* Invoice Top Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#C5A059]/30 pb-6">
                <div>
                  <span className="text-[10px] uppercase font-cinzel tracking-[0.25em] text-[#C5A059] font-bold block mb-1">
                    Tax Invoice & Folio Statement
                  </span>
                  <h1 className="text-2xl font-bold font-serif text-[#2C2523]">
                    {company.hotelName || 'The Kasar Himalayan Heights'}
                  </h1>
                  <p className="text-xs font-sans text-stone-500 mt-1 max-w-sm">
                    {company.hotelAddress || "Crank's Ridge, Kasar Devi, Almora, Uttarakhand, India (6,942 ft)"}
                  </p>
                  <p className="text-xs font-sans text-stone-500">
                    Phone: {company.conciergePhone || '+91 96906 21247'} • Email: {company.email || 'concierge@kasarhimalayanheights.com'}
                  </p>
                  <p className="text-[11px] font-mono text-stone-600 mt-0.5">
                    GSTIN: 05AAACH1234F1Z9 • SAC Code: 996311 (Hotel Accommodation)
                  </p>
                </div>

                <div className="text-right sm:text-right font-sans">
                  <div className="inline-block bg-[#FAF6EF] border border-[#C5A059]/40 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-[#7C1D23] mb-1">
                    INVOICE #{invoiceShortId}
                  </div>
                  <div className="text-xs text-stone-500">
                    Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-stone-500 font-semibold uppercase text-emerald-800">
                    Status: {booking.status?.replace('_', ' ')?.toUpperCase() || 'CONFIRMED'}
                  </div>
                </div>
              </div>

              {/* Guest & Stay Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAF6EF]/60 p-4 rounded-xl border border-[#C5A059]/20 font-sans text-xs">
                <div>
                  <span className="text-[10px] uppercase font-cinzel text-stone-500 block">Billed To (Guest)</span>
                  <span className="font-bold text-[#2C2523] block text-sm">{booking.guestDetails?.name}</span>
                  <span className="text-stone-500 font-mono text-[11px]">{booking.guestDetails?.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-cinzel text-stone-500 block">Reserved Room</span>
                  <span className="font-bold text-[#2C2523] block">{booking.room?.name || 'Deluxe Suite'}</span>
                  <span className="text-stone-500 text-[11px]">Room Type: Boutique Mountain Chalet</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-cinzel text-stone-500 block">Check-In Date</span>
                  <span className="font-mono text-[#2C2523] font-semibold">{formatDate(booking.checkInDate)}</span>
                  <span className="text-stone-500 text-[11px] block">Check-in: 12:00 PM</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-cinzel text-stone-500 block">Check-Out Date</span>
                  <span className="font-mono text-[#2C2523] font-semibold">{formatDate(booking.checkOutDate)}</span>
                  <span className="text-stone-500 text-[11px] block">{nights} Nights Stay</span>
                </div>
              </div>

              {/* Itemized Invoice Table */}
              <div className="border border-[#C5A059]/30 rounded-xl overflow-hidden font-sans">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[#FAF6EF] text-[10px] uppercase font-cinzel text-[#2C2523] border-b border-[#C5A059]/30">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">Description & Service Category</th>
                      <th className="py-2.5 px-3 text-center">SAC Code</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                      <th className="py-2.5 px-3 text-center">Qty / Nights</th>
                      <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {/* Line 1: Accommodation */}
                    <tr>
                      <td className="py-2.5 px-3 font-mono text-stone-500">1</td>
                      <td className="py-2.5 px-3 font-semibold text-[#2C2523]">
                        Accommodation: {booking.room?.name || 'Chalet Suite'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-stone-500 text-[11px]">996311</td>
                      <td className="py-2.5 px-3 text-right font-mono">₹{roomPricePerNight.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{nights}N</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#2C2523]">
                        ₹{baseRoomTotal.toLocaleString('en-IN')}
                      </td>
                    </tr>

                    {/* Extras */}
                    {extrasList.map((extra, idx) => (
                      <tr key={extra._id}>
                        <td className="py-2.5 px-3 font-mono text-stone-500">{idx + 2}</td>
                        <td className="py-2.5 px-3 text-[#2C2523]">{extra.item}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-stone-500 text-[11px]">996331</td>
                        <td className="py-2.5 px-3 text-right font-mono">₹{Number(extra.amount).toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-center font-mono">1</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#2C2523]">
                          ₹{Number(extra.amount).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Settlement Totals & UPI QR Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 font-sans">
                {/* Left: Scan & Pay QR */}
                <div className="p-4 bg-[#FAF6EF] rounded-xl border border-[#C5A059]/25 flex items-center gap-4">
                  <img
                    src={qrCodeUrl}
                    alt="UPI Payment QR"
                    className="w-24 h-24 rounded-lg border border-[#C5A059]/40 bg-white p-1"
                  />
                  <div>
                    <span className="text-[10px] font-cinzel uppercase tracking-wider font-bold text-[#7C1D23] block">
                      Direct UPI Settlement
                    </span>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Scan via GPay, PhonePe, or Paytm for instant receipt.
                    </p>
                    <span className="font-mono text-xs text-[#2C2523] font-semibold block mt-1">
                      {upiId}
                    </span>
                  </div>
                </div>

                {/* Right: Calculations Table */}
                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span>Subtotal (Room + Extras):</span>
                    <span className="font-mono font-semibold text-[#2C2523]">₹{grossTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200 text-emerald-800">
                    <span>Less: Advance Payment Received:</span>
                    <span className="font-mono font-semibold">-₹{advancePaid.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b-2 border-[#C5A059] font-bold text-sm text-[#2C2523]">
                    <span>Balance Due at Checkout:</span>
                    <span className={`font-mono text-base ${balanceDue > 0 ? 'text-[#7C1D23]' : 'text-emerald-800'}`}>
                      ₹{balanceDue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-500 pt-1 italic">
                    * Inclusive of all applicable Uttarakhand luxury hotel taxes and service charges.
                  </div>
                </div>
              </div>

              {/* Authorized Signatory Footer */}
              <div className="pt-6 border-t border-stone-200 flex justify-between items-end text-xs font-sans text-stone-500">
                <div>
                  <p className="font-serif italic text-stone-700">"Atithi Devo Bhava • Thank you for choosing Kasar Devi"</p>
                  <p className="text-[10px] text-stone-400 mt-0.5">Computer-generated official tax statement.</p>
                </div>
                <div className="text-center">
                  <div className="w-36 border-b border-stone-400 mb-1"></div>
                  <span className="text-[10px] font-cinzel uppercase tracking-wider block">Authorized Signatory</span>
                  <span className="text-[10px] text-stone-400">The Kasar Himalayan Heights</span>
                </div>
              </div>
            </div>

            {/* Print Action Bar (Hidden on print) */}
            <div className="no-print flex items-center justify-between gap-3 pt-5">
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className="px-4 py-2 rounded-xl text-xs font-cinzel font-semibold bg-[#FAF6EF] hover:bg-stone-200 text-[#2C2523] border border-[#C5A059]/40 transition cursor-pointer"
              >
                ← Back to Ledger
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppStatement}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> WhatsApp Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-2 rounded-xl bg-linear-to-r from-[#7C1D23] to-[#9B232A] hover:brightness-110 text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg> Print Tax Invoice</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
