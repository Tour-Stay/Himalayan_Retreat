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
      <div className="pt-32 min-h-screen flex items-center justify-center bg-[#F8FAF7]">
        <Loader />
      </div>
    );

  if (!room) {
    return (
      <div className="pt-32 pb-20 text-center min-h-screen bg-[#F8FAF7]">
        <h2 className="font-serif text-3xl text-[#073125] mb-4">Suite Not Found</h2>
        <Link to="/rooms" className="text-[#073125] font-semibold hover:underline">
          &larr; Back to All Suites
        </Link>
      </div>
    );
  }

  const images = room.imageURLs?.length > 0 ? room.imageURLs : [snowViewSuiteImg];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-[#F8FAF7] font-sans">
      {/* Breadcrumb & Navigation */}
      <Container size="lg">
        <div className="flex items-center gap-2 text-xs text-[#073125]/70 uppercase tracking-wider mb-6 font-mono">
          <Link to="/" className="hover:text-[#073125] transition-colors">Home</Link>
          <span className="text-[#073125]/30">/</span>
          <Link to="/rooms" className="hover:text-[#073125] transition-colors">Suites</Link>
          <span className="text-[#073125]/30">/</span>
          <span className="text-[#073125] font-bold">{room.name}</span>
        </div>
      </Container>

      {/* Main Image Gallery */}
      <Container size="lg">
        <div className="rounded-3xl overflow-hidden h-[45vh] sm:h-[55vh] mb-4 shadow-md bg-[#073125] relative border border-[#073125]/15">
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
            <span className="bg-[#073125]/90 backdrop-blur-md text-white text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
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
                    ? 'border-[#073125] shadow-md scale-102'
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
      <Container size="lg" className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-7">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-2.5">
                KASAR DEVI • 6,942 FT
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#073125] font-normal mb-3">
                {room.name}
              </h1>

              {/* Price & Highlight Badges */}
              <div className="flex flex-wrap items-baseline gap-4 pt-2 pb-5 border-b border-[#073125]/10">
                <span className="text-[#073125] font-serif text-3xl sm:text-4xl font-semibold">
                  ₹{room.pricePerNight?.toLocaleString()}
                </span>
                <span className="text-[#073125]/70 text-sm font-sans">/ night</span>
                <span className="bg-[#EBF2EA] text-[#073125] text-xs font-semibold px-3.5 py-1 rounded-full border border-[#073125]/15">
                  Hot Breakfast Included
                </span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-[#073125]/10 text-center shadow-xs">
              <div>
                <span className="text-xs text-[#073125]/60 block font-mono">Room Size</span>
                <span className="font-medium text-[#073125] text-sm sm:text-base">{room.area || '42 m²'}</span>
              </div>
              <div className="border-x border-[#073125]/10">
                <span className="text-xs text-[#073125]/60 block font-mono">Bed Setup</span>
                <span className="font-medium text-[#073125] text-sm sm:text-base">{room.bedType || 'King Bed'}</span>
              </div>
              <div>
                <span className="text-xs text-[#073125]/60 block font-mono">Capacity</span>
                <span className="font-medium text-[#073125] text-sm sm:text-base">
                  {room.capacity?.adults || 2} Adults {room.capacity?.children ? `+ ${room.capacity.children} Child` : ''}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-serif text-2xl text-[#073125] font-medium mb-3">
                About This Room
              </h2>
              <p className="text-[#073125]/75 leading-relaxed text-base font-light">
                {room.description}
              </p>
            </div>

            {/* Alpine Winter Heating */}
            <div className="bg-[#EBF2EA]/60 p-6 rounded-2xl border border-[#073125]/15">
              <h3 className="font-serif text-lg font-medium text-[#073125] mb-2 flex items-center gap-2">
                <span>✦</span> Winter Warmth &amp; Comfort
              </h3>
              <p className="text-[#073125]/75 text-sm leading-relaxed font-light">
                This room is kept warm and cozy with powerful room heaters, electric bed warmers, and 24-hour instant hot water. Generator backup keeps you comfortable even during cold mountain nights.
              </p>
            </div>

            {/* Amenities Grid */}
            {room.amenities?.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl text-[#073125] font-medium mb-4">
                  Room Facilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {room.amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="bg-white p-3.5 rounded-xl border border-[#073125]/10 text-xs sm:text-sm text-[#073125] flex items-center gap-2.5 shadow-xs"
                    >
                      <span className="text-[#073125]">✦</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#073125]/15 sticky top-28">
              <span className="text-[#073125]/60 text-xs uppercase tracking-wider font-semibold block mb-1 font-mono">
                Direct Reservation
              </span>
              <h3 className="font-serif text-2xl text-[#073125] font-medium mb-6">
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
