import { useLocation, Link } from 'react-router-dom';

const BookingConfirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <section className="pt-32 pb-24 px-4 min-h-screen flex items-center justify-center bg-cream">
      <div className="max-w-xl w-full mx-auto text-center bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-black/5 animate-fade-in">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="text-secondary text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
          Reservation Confirmed
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl text-text-dark font-semibold mb-3">
          Your Mountain Escape Awaits
        </h1>
        <p className="text-text-light text-sm sm:text-base leading-relaxed mb-6 font-light">
          Thank you for choosing Devbhoomi Retreat. We are preparing your warm mountain suite for a memorable winter stay.
        </p>

        {/* Booking Card Details */}
        {booking && (
          <div className="bg-cream/60 rounded-2xl p-5 mb-8 text-left border border-gray-200/60 text-sm space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
              <span className="text-xs text-text-light uppercase tracking-wider">Booking ID</span>
              <span className="font-mono font-semibold text-primary">{booking.bookingId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-light">Suite Reserved:</span>
              <span className="font-medium text-text-dark">{booking.roomName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-light">Guest:</span>
              <span className="font-medium text-text-dark">{booking.guestDetails?.name}</span>
            </div>
            {booking.checkInDate && (
              <div className="flex justify-between items-center">
                <span className="text-text-light">Dates:</span>
                <span className="font-medium text-text-dark">
                  {booking.checkInDate} to {booking.checkOutDate} ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 text-base font-semibold">
              <span className="text-text-dark">Total Amount:</span>
              <span className="text-forest">₹{booking.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-primary/5 text-xs text-text-dark/80 mb-8 flex items-center justify-center gap-2">
          <span>✉️</span>
          <span>A detailed confirmation and driving directions have been emailed.</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto bg-primary text-white px-8 py-3.5 rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-accent transition-colors"
          >
            Back to Home
          </Link>
          <a
            href="https://wa.me/919690621247"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto border border-gray-200 text-text-dark px-8 py-3.5 rounded-full font-medium text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors"
          >
            Contact Concierge
          </a>
        </div>
      </div>
    </section>
  );
};

export default BookingConfirmation;
