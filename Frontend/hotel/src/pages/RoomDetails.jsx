import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, Loader, Container } from '@shared';
import BookingForm from '../components/BookingForm';
import { mockRooms } from '../data/mockRooms';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await apiClient.get(`/hotel/rooms/${id}`);
        if (res.data) {
          setRoom(res.data);
        } else {
          const fallback = mockRooms.find((r) => r._id === id) || mockRooms[0];
          setRoom(fallback);
        }
      } catch (error) {
        const fallback = mockRooms.find((r) => r._id === id) || mockRooms[0];
        setRoom(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading)
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-ivory">
        <Loader />
      </div>
    );

  if (!room) {
    return (
      <div className="pt-32 pb-20 text-center min-h-screen bg-ivory">
        <h2 className="font-serif text-3xl text-charcoal mb-4">Suite Not Found</h2>
        <Link to="/rooms" className="text-maroon font-semibold hover:underline">
          &larr; Back to All Suites
        </Link>
      </div>
    );
  }

  const images = room.imageURLs?.length > 0 ? room.imageURLs : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-ivory font-sans">
      {/* Breadcrumb & Navigation */}
      <Container size="lg">
        <div className="flex items-center gap-2 text-xs text-charcoal-muted uppercase tracking-wider mb-6 font-mono">
          <Link to="/" className="hover:text-maroon">Home</Link>
          <span>/</span>
          <Link to="/rooms" className="hover:text-maroon">Suites</Link>
          <span>/</span>
          <span className="text-maroon font-semibold">{room.name}</span>
        </div>
      </Container>

      {/* Main Image Gallery */}
      <Container size="lg">
        <div className="rounded-3xl overflow-hidden h-[45vh] sm:h-[55vh] mb-4 shadow-md bg-slate relative">
          <img
            src={images[activeImage]}
            alt={room.name}
            className="w-full h-full object-cover transition-all duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-slate/85 backdrop-blur-md text-ivory text-xs font-semibold px-3 py-1 rounded-full border border-gold/30">
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
                className={`w-24 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${activeImage === i
                    ? 'border-maroon shadow-md scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
              >
                <img
                  src={img}
                  alt={`Suite view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </Container>

      {/* Room Details + Booking Form */}
      <Container size="lg" className="mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase block mb-1 font-mono">
                The Kasar Himalayan Heights • 6,942 FT
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-medium mb-3">
                {room.name}
              </h1>

              {/* Price & Highlight Badges */}
              <div className="flex flex-wrap items-baseline gap-4 pt-2 pb-6 border-b border-gold/20">
                <span className="text-maroon font-serif text-3xl sm:text-4xl font-semibold">
                  ₹{room.pricePerNight?.toLocaleString()}
                </span>
                <span className="text-charcoal-muted text-sm">/ night (excluding taxes)</span>
                <span className="bg-gold/15 text-charcoal text-xs font-semibold px-3 py-1 rounded-full border border-gold/30 font-mono">
                  Complimentary Kumaoni Breakfast Included
                </span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-3 bg-ivory-warm p-4 rounded-2xl border border-gold/25 text-center">
              <div>
                <span className="text-xs text-charcoal-muted block font-mono">Suite Size</span>
                <span className="font-medium text-charcoal text-sm sm:text-base">{room.area || '42 m²'}</span>
              </div>
              <div className="border-x border-gold/25">
                <span className="text-xs text-charcoal-muted block font-mono">Bed Setup</span>
                <span className="font-medium text-charcoal text-sm sm:text-base">{room.bedType || 'King Bed'}</span>
              </div>
              <div>
                <span className="text-xs text-charcoal-muted block font-mono">Capacity</span>
                <span className="font-medium text-charcoal text-sm sm:text-base">
                  {room.capacity?.adults || 2} Adults {room.capacity?.children ? `+ ${room.capacity.children} Child` : ''}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-serif text-2xl text-charcoal font-medium mb-3">
                About This Suite
              </h2>
              <p className="text-charcoal-muted leading-relaxed text-base font-light">
                {room.description}
              </p>
            </div>

            {/* Alpine Winter Heating */}
            <div className="bg-ivory-warm p-6 rounded-2xl border border-gold/30">
              <h3 className="font-serif text-lg font-medium text-maroon mb-2 flex items-center gap-2">
                <span>✦</span> Winter & Snowfall Comfort
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed font-light">
                This suite is winter-ready with heavy-duty room heating, dual electric bed warmers, heavy thermal drapes, and 24/7 instant hot water geysers. 100% generator backup ensures you stay warm even during Himalayan snowfalls.
              </p>
            </div>

            {/* Amenities Grid */}
            {room.amenities?.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl text-charcoal font-medium mb-4">
                  Suite Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="bg-ivory-warm p-3.5 rounded-xl border border-gold/20 text-xs sm:text-sm text-charcoal flex items-center gap-2.5"
                    >
                      <span className="text-gold">✦</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-ivory-warm p-6 sm:p-8 rounded-3xl shadow-xl border border-gold/35 sticky top-28">
              <span className="text-gold text-xs uppercase tracking-wider font-semibold block mb-1 font-mono">
                Direct Reservation
              </span>
              <h3 className="font-serif text-2xl text-charcoal font-medium mb-6">
                Reserve This Suite
              </h3>
              <BookingForm preSelectedRoom={room._id} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RoomDetails;
