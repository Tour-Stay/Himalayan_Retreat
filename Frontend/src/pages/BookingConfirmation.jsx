import { Link } from 'react-router-dom';

const BookingConfirmation = () => {
  return (
    <section className="pt-28 pb-20 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl text-text-dark mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-text-light text-lg leading-relaxed mb-4">
          Thank you for choosing Devbhoomi Retreat. Your mountain escape is reserved.
        </p>
        <p className="text-text-light text-sm mb-10">
          ✉️ A confirmation email has been sent to your inbox with all the booking details.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="bg-secondary text-primary px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-all duration-300"
          >
            Back to Home
          </Link>
          <Link
            to="/rooms"
            className="border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-all duration-300"
          >
            Explore More Rooms
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookingConfirmation;
