import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Container, CheckCircleIcon, WhatsAppIcon, PhoneIcon, MapPinIcon, CalendarIcon, UsersIcon, SITE_CONFIG } from '@shared';

const TravelBookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*॥ ॐ नमः शिवाय • जय श्री नीब करौरी महाराज ॥*\n` +
      `*Confirmed Cab Booking Voucher*\n` +
      `----------------------------------------\n` +
      `*Booking ID:* ${booking.bookingId}\n` +
      `*Guest Name:* ${booking.guestName}\n` +
      `*Phone:* ${booking.guestPhone}\n` +
      `*Pickup Point:* ${booking.pickupPoint}\n` +
      `*Destination:* ${booking.destination?.name || 'Kasar Devi Tour'}\n` +
      `*Vehicle:* ${booking.vehicle?.title} (${booking.vehicle?.model})\n` +
      `*Date:* ${booking.travelDate}\n` +
      `*Passengers:* ${booking.passengers} Guests\n` +
      `*Trip Mode:* ${booking.tripType === 'round-trip' ? 'Round Trip' : 'One Way'} (${booking.days} Days)\n` +
      `*Estimated Fare:* ₹${booking.totalAmount?.toLocaleString()} (All-Inclusive)\n` +
      (booking.specialNotes ? `*Notes:* ${booking.specialNotes}\n` : '') +
      `----------------------------------------\n` +
      `Please assign our local Pahadi driver and send vehicle number.`
    );
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="py-16 sm:py-24 px-4 bg-[#FDFBF7] min-h-[85vh] flex items-center justify-center font-sans">
      <Container size="md">
        <div className="bg-[#FAF6EF]/80 rounded-3xl p-6 sm:p-10 border border-[#C5A059]/40 shadow-xl text-center relative overflow-hidden">
          {/* Subtle watermark */}
          <div className="absolute top-4 right-4 text-[#C84B0F]/[0.035] text-[160px] font-devanagari select-none pointer-events-none leading-none z-0">
            ॐ
          </div>

          {/* Success Checkmark Badge */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C84B0F] to-[#7C1D23] text-[#FDFBF7] flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg border border-[#C5A059]/40 relative z-10">
            ✓
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#C84B0F]/10 border border-[#C84B0F]/30 text-[#C84B0F] text-xs font-semibold uppercase tracking-wider mb-2 relative z-10">
            <span className="text-amber-500 animate-pulse">🪔</span>
            <span>॥ बुकिंग अनुरोध स्वीकृत • Booking Confirmed ॥</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C2523] font-medium mb-2 relative z-10">
            Your Mountain Cab is Reserved!
          </h1>

          <p className="text-sm text-[#5C5350] max-w-md mx-auto mb-8 relative z-10">
            Thank you, <strong>{booking.guestName}</strong>. Our Almora cab desk has received your trip request. Our driver details and vehicle number will be sent to your WhatsApp.
          </p>

          {/* Booking Voucher Card */}
          <div className="bg-[#FDFBF7] p-6 sm:p-7 rounded-2xl border border-[#C5A059]/30 text-left max-w-lg mx-auto shadow-sm space-y-4 relative z-10">
            <div className="flex justify-between items-center border-b border-[#C5A059]/20 pb-3">
              <div>
                <span className="text-[10px] text-[#6B615E] uppercase tracking-wider block">Booking Reference</span>
                <strong className="text-base font-numeral text-[#C84B0F]">{booking.bookingId}</strong>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#C84B0F]/10 text-[#C84B0F] text-xs font-semibold border border-[#C84B0F]/20">
                Driver Being Assigned
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-[#2C2523]">
              <div className="flex items-start gap-2.5">
                <MapPinIcon className="w-4 h-4 text-[#C84B0F] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6B615E] block text-[10px] uppercase">Route</span>
                  <span className="font-semibold">{booking.pickupPoint} &rarr; {booking.destination?.name}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CalendarIcon className="w-4 h-4 text-[#C84B0F] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6B615E] block text-[10px] uppercase">Travel Date & Duration</span>
                  <span className="font-semibold">{booking.travelDate} • {booking.days} {booking.days === 1 ? 'Day' : 'Days'} ({booking.tripType === 'round-trip' ? 'Round Trip' : 'One Way'})</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <UsersIcon className="w-4 h-4 text-[#C84B0F] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6B615E] block text-[10px] uppercase">Vehicle & Passengers</span>
                  <span className="font-semibold">{booking.vehicle?.title} ({booking.passengers} Passengers)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#C5A059]/20 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#6B615E] uppercase block">Total Agreed Fare</span>
                <span className="text-xs text-[#6B615E]">Tolls & Driver Allowance Included</span>
              </div>
              <span className="font-serif text-2xl font-bold text-[#7C1D23] font-numeral">
                ₹{booking.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10 max-w-lg mx-auto">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#C5A059]/30"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#C5A059]" />
              <span>Confirm on WhatsApp ↗</span>
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold border border-[#C5A059]/60 bg-[#FDFBF7] text-[#2C2523] hover:text-[#C84B0F] hover:bg-[#FFF5EC] transition-all flex items-center justify-center gap-2 text-center"
            >
              <span>Back to Cab Hub &rarr;</span>
            </Link>
          </div>

          <div className="mt-6 text-xs text-[#6B615E] relative z-10">
            For urgent pickup modifications, call our 24/7 Almora desk at{' '}
            <a href={`tel:${SITE_CONFIG.conciergePhone}`} className="text-[#C84B0F] font-bold font-numeral">
              {SITE_CONFIG.conciergePhone}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TravelBookingConfirmation;
