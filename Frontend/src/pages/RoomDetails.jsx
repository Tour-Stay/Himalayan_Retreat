import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';

const API_URL = 'http://localhost:5000/api';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`${API_URL}/hotel/rooms/${id}`);
        setRoom(res.data);
      } catch (error) {
        console.error('Failed to fetch room:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <div className="pt-28"><Loader /></div>;

  if (!room) {
    return (
      <div className="pt-28 pb-20 text-center min-h-screen">
        <h2 className="font-heading text-3xl text-text-dark">Room not found</h2>
      </div>
    );
  }

  const images = room.imageURLs?.length > 0 ? room.imageURLs : ['/placeholder-room.jpg'];

  return (
    <section className="pt-24 pb-20 min-h-screen">
      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Image */}
        <div className="rounded-2xl overflow-hidden h-[50vh] mb-4">
          <img
            src={images[activeImage]}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activeImage === i ? 'border-secondary' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Room Details + Booking Form */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left - Room Info (2 columns) */}
          <div className="lg:col-span-2">
            <p className="text-secondary text-sm font-medium tracking-[0.2em] uppercase mb-2">
              Devbhoomi Retreat
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl text-text-dark mb-4">
              {room.name}
            </h1>

            {/* Price Badge */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-forest text-3xl font-bold">₹{room.pricePerNight?.toLocaleString()}</span>
              <span className="text-text-light">/ night</span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-heading text-xl text-text-dark mb-3">About this room</h3>
              <p className="text-text-light leading-relaxed">{room.description}</p>
            </div>

            {/* Capacity */}
            <div className="mb-8">
              <h3 className="font-heading text-xl text-text-dark mb-3">Capacity</h3>
              <div className="flex gap-6 text-text-light">
                <span>👤 {room.capacity?.adults || 2} Adults</span>
                {room.capacity?.children > 0 && <span>👶 {room.capacity.children} Children</span>}
              </div>
            </div>

            {/* Amenities */}
            {room.amenities?.length > 0 && (
              <div>
                <h3 className="font-heading text-xl text-text-dark mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {room.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="bg-cream text-text-dark text-sm px-4 py-2 rounded-full border border-gray-100"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Booking Form (1 column) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h3 className="font-heading text-xl text-text-dark mb-6">Book this room</h3>
              <BookingForm preSelectedRoom={room._id} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;
