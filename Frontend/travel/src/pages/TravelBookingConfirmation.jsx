import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Container, CheckCircleIcon, WhatsAppIcon, PhoneIcon, MapPinIcon, CalendarIcon, UsersIcon, SITE_CONFIG, useSiteSettings } from '@shared';

const TravelBookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const { settings } = useSiteSettings();
  const company = settings?.company;
  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;

  if (!booking) {
    return <Navigate to="/" replace />;
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
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
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="pt-28 pb-24 px-4 min-h-[85vh] flex items-center justify-center bg-[#FAF5EC] font-sans">
      <Container size="md">
        <div className="w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-[#EAA722]/30 shadow-xl">
          {/* Success Checkmark Badge */}
          <div className="w-20 h-20 bg-[#FAF5EC] border-2 border-[#EAA722]/40 rounded-full flex items-center justify-center mx-auto mb-6 text-[#541508]">
            <CheckCircleIcon className="w-10 h-10 text-[#541508]" />
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAA722] text-[#541508] text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-xs">
            BOOKING CONFIRMED • SAFE MOUNTAIN TRAVEL
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#541508] font-normal mb-3">
            Your Mountain Cab is Reserved!
          </h1>

          <p className="text-[#541508]/85 text-sm sm:text-base leading-relaxed mb-6 font-light font-sans max-w-lg mx-auto">
            Thank you, <strong>{booking.guestName}</strong>. Our Almora cab desk has received your sacred yatra / mountain trip request. Driver details and vehicle registration number will be sent to your WhatsApp.
          </p>

          {/* Booking Voucher Card */}
          <div className="bg-[#FAFDF9] rounded-2xl p-6 sm:p-7 text-left border border-[#EAA722]/25 text-sm space-y-3 font-sans max-w-lg mx-auto mb-8 shadow-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-[#EAA722]/20">
              <div>
                <span className="text-[10px] text-[#541508]/60 uppercase tracking-wider block font-mono">Booking ID</span>
                <span className="font-mono font-bold text-base text-[#541508]">{booking.bookingId}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#EAA722]/20 text-[#541508] text-xs font-semibold border border-[#EAA722]/30 font-mono">
                Driver Being Assigned
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-[#541508]">
              <div className="flex items-start gap-2.5">
                <MapPinIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#541508]/60 block text-[10px] uppercase font-mono">Route</span>
                  <span className="font-medium text-sm text-[#541508]">{booking.pickupPoint} &rarr; {booking.destination?.name}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CalendarIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#541508]/60 block text-[10px] uppercase font-mono">Travel Date &amp; Duration</span>
                  <span className="font-medium text-[#541508] font-mono">{booking.travelDate} • {booking.days} {booking.days === 1 ? 'Day' : 'Days'} ({booking.tripType === 'round-trip' ? 'Round Trip' : 'One Way'})</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <UsersIcon className="w-4 h-4 text-[#EAA722] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#541508]/60 block text-[10px] uppercase font-mono">Vehicle &amp; Passengers</span>
                  <span className="font-medium text-[#541508]">{booking.vehicle?.title} ({booking.passengers} Passengers)</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAA722]/20 flex justify-between items-center text-base font-semibold">
              <div>
                <span className="text-[10px] text-[#541508]/60 uppercase block font-mono">Total Agreed Fare</span>
                <span className="text-xs text-[#541508]/70 font-normal">Tolls, Parking &amp; Driver Allowance Included</span>
              </div>
              <span className="font-serif text-2xl font-bold text-[#541508] font-numeral">
                ₹{booking.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF5EC] text-xs text-[#541508] mb-8 border border-[#EAA722]/30 flex items-center justify-center gap-2 max-w-lg mx-auto">
            <span>✦</span>
            <span>A confirmation voucher with pickup meeting directions has been logged.</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[#EAA722] hover:bg-[#D98E16] text-[#541508] shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#541508]" />
              <span>Confirm on WhatsApp ↗</span>
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border border-[#541508]/25 text-[#541508] hover:bg-[#FAF0E6] transition-all text-center"
            >
              <span>Back to Cab Hub &rarr;</span>
            </Link>
          </div>

          <div className="mt-6 text-xs text-[#541508]/70">
            For urgent pickup modifications, call our 24/7 Almora desk at{' '}
            <a href={`tel:${conciergePhone}`} className="text-[#541508] font-bold font-numeral hover:underline">
              {conciergePhone}
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TravelBookingConfirmation;
