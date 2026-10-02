import { useLocation, Link } from 'react-router-dom';
import { SITE_CONFIG, Container, CheckCircleIcon } from '@shared';

const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <div className="pt-28 pb-24 px-4 min-h-screen flex items-center justify-center bg-ivory font-sans">
      <Container size="sm">
        <div className="w-full text-center bg-ivory-warm p-8 sm:p-12 rounded-3xl border border-gold/35 shadow-xl">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gold/15 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 text-maroon">
            <CheckCircleIcon className="w-10 h-10 text-maroon" />
          </div>

          <span className="text-gold text-xs uppercase tracking-[0.25em] font-semibold block mb-2 font-mono">
            Reservation Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium mb-3">
            Your Mountain Sanctuary Awaits
          </h1>
          <p className="text-charcoal-muted text-sm sm:text-base leading-relaxed mb-6 font-light">
            Thank you for choosing The Kasar Himalayan Heights. We are preparing your warm mountain suite for a peaceful stay.
          </p>

          {/* Booking Card Details */}
          {booking && (
            <div className="bg-ivory rounded-2xl p-6 mb-8 text-left border border-gold/25 text-sm space-y-3 font-sans">
              <div className="flex justify-between items-center pb-2 border-b border-gold/15">
                <span className="text-xs text-charcoal-muted uppercase tracking-wider font-mono">Booking ID</span>
                <span className="font-mono font-semibold text-maroon">{booking.bookingId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted">Suite Reserved:</span>
                <span className="font-medium text-charcoal">{booking.roomName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-charcoal-muted">Guest:</span>
                <span className="font-medium text-charcoal">{booking.guestDetails?.name}</span>
              </div>
              {booking.checkInDate && (
                <div className="flex justify-between items-center">
                  <span className="text-charcoal-muted">Dates:</span>
                  <span className="font-medium text-charcoal">
                    {booking.checkInDate} to {booking.checkOutDate} ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gold/15 text-base font-semibold">
                <span className="text-charcoal">Total Amount:</span>
                <span className="text-maroon font-serif text-xl">₹{booking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-ivory text-xs text-charcoal-muted mb-8 border border-gold/20 flex items-center justify-center gap-2">
            <span>✦</span>
            <span>A detailed confirmation and mountain driving directions have been sent to your contact.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto bg-maroon hover:bg-maroon-dark text-ivory px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Back to Hotel Home
            </Link>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                `Hello Kasar Himalayan Heights Concierge, I have a reservation with ID: ${booking?.bookingId || ''}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-gold/40 text-charcoal hover:bg-gold/10 px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              Contact Concierge on WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BookingConfirmation;
