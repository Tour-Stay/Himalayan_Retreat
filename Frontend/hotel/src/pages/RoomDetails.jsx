import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, Loader, Container, snowViewSuiteImg } from '@shared';
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

  const images = room.imageURLs?.length > 0 ? room.imageURLs : [snowViewSuiteImg];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#FDFBF7] font-sans">
      {/* Breadcrumb & Navigation */}
      <Container size="lg">
        <div className="flex items-center gap-2 text-xs text-[#6B615E] uppercase tracking-wider mb-6 font-cinzel">
          <Link to="/" className="hover:text-[#7C1D23] transition-colors">Home</Link>
          <span className="text-[#C5A059]/50">/</span>
          <Link to="/rooms" className="hover:text-[#7C1D23] transition-colors">Suites</Link>
          <span className="text-[#C5A059]/50">/</span>
          <span className="text-[#7C1D23] font-semibold">{room.name}</span>
        </div>
      </Container>

      {/* Main Image Gallery */}
      <Container size="lg">
        <div className="rounded-3xl overflow-hidden h-[45vh] sm:h-[55vh] mb-4 shadow-xl bg-slate relative border border-[#C5A059]/30">
          <img
            src={images[activeImage]}
            alt={room.name}
            className="w-full h-full object-cover transition-all duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = snowViewSuiteImg;
            }}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-[#1C1817]/85 backdrop-blur-md text-[#FDFBF7] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#C5A059]/40 flex items-center gap-1.5">
              <span>{room.view || '180° Snow Peak View'}</span>
            </span>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-24 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                  activeImage === i
                    ? 'border-[#7C1D23] shadow-md scale-102'
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
              <span className="text-[#C5A059] text-xs font-cinzel font-semibold tracking-[0.2em] uppercase block mb-1">
                The Kasar Himalayan Heights • 6,942 FT
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2C2523] font-medium mb-3">
                {room.name}
              </h1>

              {/* Price & Highlight Badges */}
              <div className="flex flex-wrap items-baseline gap-4 pt-2 pb-6 border-b border-[#C5A059]/20">
                <span className="text-[#7C1D23] font-serif text-3xl sm:text-4xl font-semibold font-numeral">
                  ₹{room.pricePerNight?.toLocaleString()}
                </span>
                <span className="text-[#6B615E] text-sm font-sans">/ night</span>
                <span className="bg-[#C5A059]/15 text-[#2C2523] text-xs font-semibold px-3.5 py-1 rounded-full border border-[#C5A059]/30 font-cinzel">
                  Free Breakfast Included
                </span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-3 bg-ivory-warm p-4 rounded-2xl border border-gold/25 text-center">
              <div>
                <span className="text-xs text-charcoal-muted block font-mono">Room Size</span>
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
                About This Room
              </h2>
              <p className="text-charcoal-muted leading-relaxed text-base font-light">
                {room.description}
              </p>
            </div>

            {/* Alpine Winter Heating */}
            <div className="bg-ivory-warm p-6 rounded-2xl border border-gold/30">
              <h3 className="font-serif text-lg font-medium text-maroon mb-2 flex items-center gap-2">
                <span>✦</span> Winter Warmth &amp; Comfort
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed font-light">
                This room is kept warm and cozy with powerful room heaters, electric bed warmers, and 24-hour instant hot water. Generator backup keeps you comfortable even during cold mountain nights.
              </p>
            </div>

            {/* Amenities Grid */}
            {room.amenities?.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl text-charcoal font-medium mb-4">
                  Room Facilities
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
                Book Your Stay
              </span>
              <h3 className="font-serif text-2xl text-charcoal font-medium mb-6">
                Book This Room
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
