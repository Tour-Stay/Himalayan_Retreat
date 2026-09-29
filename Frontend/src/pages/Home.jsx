import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RoomCard from '../components/RoomCard';
import TestimonialCard from '../components/TestimonialCard';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';
import heroImg from '../assets/hero.png';

const API_URL = 'http://localhost:5000/api';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/hotel/rooms`);
        setRooms(res.data.slice(0, 4)); // Show top 4 rooms
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Static testimonials (can be made dynamic later)
  const testimonials = [
    {
      name: 'Ananya Sharma',
      location: 'New Delhi',
      review: 'The most peaceful retreat I have ever been to. Waking up to the Himalayan view was surreal. The rooms were spotless and the staff made us feel like family.',
      rating: 5,
    },
    {
      name: 'Rajesh Gupta',
      location: 'Mumbai',
      review: 'Perfect getaway from the city chaos. The bonfire nights and the local Kumaoni food were highlights of our trip. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Sarah Mitchell',
      location: 'London, UK',
      review: 'A hidden gem in Mukteshwar. The boutique feel, the warmth of the hosts, and those sunrises — absolutely unforgettable.',
      rating: 4,
    },
  ];

  return (
    <>
      {/* ======================== HERO SECTION ======================== */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src={heroImg}
          alt="Devbhoomi Retreat — Mountain View"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="hero-overlay absolute inset-0"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl animate-fade-in">
          <p className="text-secondary text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Mukteshwar, Uttarakhand
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-white font-semibold leading-tight mb-6">
            Experience Luxury in the Heart of the Mountains
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Wake up to panoramic Himalayan views, cozy luxury rooms, and unforgettable mountain sunsets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#book"
              className="bg-secondary text-primary px-8 py-3.5 rounded-full font-semibold hover:bg-secondary/90 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25"
            >
              Book Your Stay
            </a>
            <Link
              to="/rooms"
              className="border border-white/30 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-all duration-300"
            >
              Explore Rooms
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-secondary rounded-full"></div>
          </div>
        </div>
      </section>

      {/* ======================== ABOUT SECTION ======================== */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl text-text-dark mb-6 heading-accent-center">
            A quiet mountain sanctuary
          </h2>
          <p className="text-text-light leading-relaxed text-lg">
            Perched above the pine forests of Mukteshwar, Devbhoomi Retreat is a boutique escape shaped by the rhythm of the Himalayas — where sunrise arrives in gold, days unwind by the fire, and every meal tastes of the mountains.
          </p>
        </div>
      </section>

      {/* ======================== ROOMS PREVIEW SECTION ======================== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl text-text-dark mb-4 heading-accent-center">
              Cozy luxury, framed by mountains
            </h2>
            <p className="text-text-light text-lg max-w-xl mx-auto">
              Every room opens to a view. Natural materials, deep-soaking beds, and quiet corners for coffee at dawn.
            </p>
          </div>

          {loading ? (
            <Loader />
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-light">Rooms coming soon...</p>
          )}

          <div className="text-center mt-12">
            <Link
              to="/rooms"
              className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== GALLERY SECTION ======================== */}
      <section id="gallery" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl text-text-dark mb-4 heading-accent-center">
              Moments from the retreat
            </h2>
            <p className="text-text-light text-lg">
              Rooms, garden, sunrise, bonfire — a look through our windows.
            </p>
          </div>

          {/* Gallery Grid — placeholder images, replace with Cloudinary later */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="img-zoom aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                <img
                  src={heroImg}
                  alt={`Gallery image ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== REVIEWS SECTION ======================== */}
      <section id="reviews" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl text-text-dark mb-4 heading-accent-center">
              Loved by travellers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================== BOOKING SECTION ======================== */}
      <section id="book" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Text */}
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl text-text-dark mb-4 heading-accent">
                Reserve your mountain escape
              </h2>
              <p className="text-text-light text-lg leading-relaxed mb-6">
                Best-rate guarantee when you book direct. Complimentary breakfast, welcome tea, and priority room upgrades.
              </p>
              <div className="space-y-3 text-text-light text-sm">
                <p>✓ Free cancellation up to 48 hours before check-in</p>
                <p>✓ Complimentary breakfast included</p>
                <p>✓ Welcome tea on arrival</p>
                <p>✓ Priority room upgrades</p>
              </div>
            </div>

            {/* Right - Booking Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* ======================== CONTACT SECTION ======================== */}
      <section id="contact" className="py-20 px-4 bg-accent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl text-white mb-4">
            Come, stay a while
          </h2>
          <p className="text-white/60 text-lg mb-10">
            A short drive from Nainital, tucked into the pine forests of Mukteshwar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/919690621247"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-3 rounded-full font-medium hover:bg-[#1ebe5d] transition-all"
            >
              WhatsApp Us
            </a>
            <a
              href="tel:+919690621247"
              className="border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-all"
            >
              Call Now
            </a>
            <a
              href="https://maps.google.com/?q=Mukteshwar"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-all"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
