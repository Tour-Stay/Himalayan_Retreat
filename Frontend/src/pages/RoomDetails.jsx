import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';
import { mockRooms } from '../data/mockRooms';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`${API_URL}/hotel/rooms/${id}`);
        if (res.data) {
          setRoom(res.data);
        } else {
          const fallback = mockRooms.find(r => r._id === id) || mockRooms[0];
          setRoom(fallback);
        }
      } catch (error) {
        const fallback = mockRooms.find(r => r._id === id) || mockRooms[0];
        setRoom(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <div className="pt-32 min-h-screen flex items-center justify-center"><Loader /></div>;

  if (!room) {
    return (
      <div className="pt-32 pb-20 text-center min-h-screen bg-cream">
        <h2 className="font-heading text-3xl text-text-dark mb-4">Suite Not Found</h2>
        <Link to="/rooms" className="text-secondary font-semibold hover:underline">
          ← Back to All Suites
        </Link>
      </div>
    );
  }

  const images = room.imageURLs?.length > 0 ? room.imageURLs : ['/placeholder-room.svg'];

  return (
    <section className="pt-28 pb-24 min-h-screen bg-cream">
      {/* Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-text-light uppercase tracking-wider">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/rooms" className="hover:text-primary">Suites</Link>
          <span>/</span>
          <span className="text-primary font-semibold">{room.name}</span>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl overflow-hidden h-[45vh] sm:h-[55vh] mb-4 shadow-md bg-gray-900 relative">
          <img
            src={images[activeImage]}
            alt={room.name}
            className="w-full h-full object-cover transition-all duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-room.svg';
            }}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-primary/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
              {room.view || '180° Snow Peak View'}
            </span>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-24 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImage === i
                    ? 'border-secondary shadow-md scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Suite view ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-room.svg';
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Room Details + Booking Form */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-secondary text-xs font-semibold tracking-[0.25em] uppercase block mb-1">
                Devbhoomi Retreat • 7,500 FT
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-text-dark font-semibold mb-3">
                {room.name}
              </h1>

              {/* Price & Highlight Badges */}
              <div className="flex flex-wrap items-baseline gap-4 pt-2 pb-6 border-b border-gray-200">
                <span className="text-primary font-heading text-3xl sm:text-4xl font-bold">
                  ₹{room.pricePerNight?.toLocaleString()}
                </span>
                <span className="text-text-light text-sm">/ night (excluding taxes)</span>
                <span className="bg-forest/10 text-forest text-xs font-semibold px-3 py-1 rounded-full">
                  Free Kumaoni Breakfast Included
                </span>
              </div>
            </div>

            {/* Quick Specs Pill Row */}
            <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-gray-100 text-center">
              <div>
                <span className="text-xs text-text-light block">Suite Size</span>
                <span className="font-medium text-text-dark text-sm sm:text-base">{room.area || '42 m²'}</span>
              </div>
              <div className="border-x border-gray-100">
                <span className="text-xs text-text-light block">Bed Setup</span>
                <span className="font-medium text-text-dark text-sm sm:text-base">{room.bedType || 'King Bed'}</span>
              </div>
              <div>
                <span className="text-xs text-text-light block">Capacity</span>
                <span className="font-medium text-text-dark text-sm sm:text-base">
                  {room.capacity?.adults || 2} Adults {room.capacity?.children ? `+ ${room.capacity.children} Child` : ''}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-heading text-xl text-text-dark font-semibold mb-3">
                About This Suite
              </h2>
              <p className="text-text-light leading-relaxed text-base font-light">
                {room.description}
              </p>
            </div>

            {/* Winter Comfort & Heating Highlight */}
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <h3 className="font-heading text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                <span>🔥</span> Winter & Snowfall Comfort
              </h3>
              <p className="text-text-dark/80 text-sm leading-relaxed font-light">
                This suite is winter-ready with heavy-duty room heating, dual electric bed warmers, heavy thermal drapes, and 24/7 instant hot water geysers. Uninterrupted power backup ensures you stay warm even during Himalayan snowfalls.
              </p>
            </div>

            {/* Amenities Grid */}
            {room.amenities?.length > 0 && (
              <div>
                <h3 className="font-heading text-xl text-text-dark font-semibold mb-4">
                  Suite Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="bg-white p-3.5 rounded-xl border border-gray-100 text-xs sm:text-sm text-text-dark flex items-center gap-2.5 shadow-2xs"
                    >
                      <span className="text-secondary text-base">✦</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-black/5 border border-gray-200 sticky top-28">
              <span className="text-secondary text-xs uppercase tracking-wider font-semibold block mb-1">
                Direct Booking
              </span>
              <h3 className="font-heading text-2xl text-text-dark font-semibold mb-6">
                Reserve This Suite
              </h3>
              <BookingForm preSelectedRoom={room._id} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
