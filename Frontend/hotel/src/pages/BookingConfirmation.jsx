import { useLocation, Link } from 'react-router-dom';
import { SITE_CONFIG, Container, CheckCircleIcon, useSiteSettings } from '@shared';

const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const { settings } = useSiteSettings();
  const company = settings?.company;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;

  return (
    <div className="pt-28 pb-24 px-4 min-h-screen flex items-center justify-center bg-[#FDFBF7] font-sans">
      <Container size="sm">
        <div className="w-full text-center bg-[#FAF6EF]/60 p-8 sm:p-12 rounded-3xl border border-[#C5A059]/35 shadow-xl">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-[#C5A059]/15 border border-[#C5A059]/30 rounded-full flex items-center justify-center mx-auto mb-6 text-[#7C1D23]">
            <CheckCircleIcon className="w-10 h-10 text-[#7C1D23]" />
          </div>

          <span className="text-[#C5A059] text-xs uppercase tracking-[0.2em] font-semibold block mb-2 font-cinzel">
            Booking Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2C2523] font-medium mb-3">
            Your Room is Booked!
          </h1>
          <div className="w-16 h-0.5 bg-[#C5A059]/60 mx-auto my-4"></div>
          <p className="text-[#5C5350] text-sm sm:text-base leading-relaxed mb-6 font-light font-sans">
            Thank you for choosing The Kasar Himalayan Heights. We look forward to welcoming you for a warm and peaceful stay.
          </p>

          {/* Booking Card Details */}
          {booking && (
            <div className="bg-[#FDFBF7] rounded-2xl p-6 mb-8 text-left border border-[#C5A059]/25 text-sm space-y-3 font-sans">
              <div className="flex justify-between items-center pb-2 border-b border-[#C5A059]/15">
                <span className="text-xs text-[#6B615E] uppercase tracking-wider font-cinzel">Booking ID</span>
                <span className="font-mono font-bold text-[#7C1D23]">{booking.bookingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B615E]">Room Booked:</span>
                <span className="font-medium text-[#2C2523]">{booking.roomName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B615E]">Guest Name:</span>
                <span className="font-medium text-[#2C2523]">{booking.guestDetails?.name}</span>
              </div>
              {booking.checkInDate && (
                <div className="flex justify-between items-center">
                  <span className="text-[#6B615E]">Dates:</span>
                  <span className="font-medium text-[#2C2523] font-numeral">
                    {booking.checkInDate} to {booking.checkOutDate} ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[#C5A059]/15 text-base font-semibold">
                <span className="text-[#2C2523]">Total Amount:</span>
                <span className="text-[#7C1D23] font-serif text-2xl font-numeral">₹{booking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-[#FDFBF7] text-xs text-[#6B615E] mb-8 border border-[#C5A059]/20 flex items-center justify-center gap-2">
            <span className="text-[#C5A059]">✦</span>
            <span>A confirmation message and driving directions have been sent to your contact details.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-xs font-sans uppercase tracking-wider bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] shadow-md transition-all hover:scale-102"
            >
              Back to Home
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Hello Kasar Himalayan Heights, I have a booking with ID: ${booking?.bookingId || ''}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-semibold text-xs font-sans uppercase tracking-wider border border-[#C5A059] bg-[#FAF6EF] hover:bg-[#C5A059]/20 text-[#2C2523] hover:text-[#7C1D23] transition-all shadow-xs hover:scale-102"
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
