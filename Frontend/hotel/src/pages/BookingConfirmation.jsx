import { useLocation, Link } from 'react-router-dom';
import { SITE_CONFIG, Container, CheckCircleIcon, useSiteSettings } from '@shared';

const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const { settings } = useSiteSettings();
  const company = settings?.company;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;

  return (
    <div className="pt-28 pb-24 px-4 min-h-screen flex items-center justify-center bg-[#F8FAF7] font-sans">
      <Container size="sm">
        <div className="w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-[#073125]/15 shadow-xl">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-[#EBF2EA] border border-[#073125]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#073125]">
            <CheckCircleIcon className="w-10 h-10 text-[#073125]" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-xs">
            BOOKING CONFIRMED
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#073125] font-normal mb-3">
            Your Room is Reserved!
          </h1>
          <p className="text-[#073125]/80 text-sm sm:text-base leading-relaxed mb-6 font-light font-sans">
            Thank you for choosing The Kasar Himalayan Heights. We look forward to welcoming you for a warm, peaceful retreat in Kasar Devi.
          </p>

          {/* Booking Card Details */}
          {booking && (
            <div className="bg-[#F8FAF7] rounded-2xl p-6 mb-8 text-left border border-[#073125]/10 text-sm space-y-3 font-sans">
              <div className="flex justify-between items-center pb-2 border-b border-[#073125]/10">
                <span className="text-xs text-[#073125]/60 uppercase tracking-wider font-mono">Booking ID</span>
                <span className="font-mono font-bold text-[#073125]">{booking.bookingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#073125]/70">Room Booked:</span>
                <span className="font-medium text-[#073125]">{booking.roomName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#073125]/70">Guest Name:</span>
                <span className="font-medium text-[#073125]">{booking.guestDetails?.name}</span>
              </div>
              {booking.checkInDate && (
                <div className="flex justify-between items-center">
                  <span className="text-[#073125]/70">Dates:</span>
                  <span className="font-medium text-[#073125] font-mono">
                    {booking.checkInDate} to {booking.checkOutDate} ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[#073125]/10 text-base font-semibold">
                <span className="text-[#073125]">Total Amount:</span>
                <span className="text-[#073125] font-serif text-2xl">₹{booking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#EBF2EA] text-xs text-[#073125] mb-8 border border-[#073125]/10 flex items-center justify-center gap-2">
            <span>✦</span>
            <span>A confirmation message and driving directions have been sent to your contact details.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-mono font-bold text-xs uppercase tracking-wider bg-[#073125] hover:bg-[#12433B] text-white shadow-md transition-all hover:scale-102"
            >
              Back to Home
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Hello Kasar Himalayan Heights, I have a booking with ID: ${booking?.bookingId || ''}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-mono font-semibold text-xs uppercase tracking-wider border border-[#073125]/30 bg-white hover:bg-[#EBF2EA] text-[#073125] transition-all shadow-xs hover:scale-102"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BookingConfirmation;
