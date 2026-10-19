import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Container,
  apiClient,
  MountainIcon,
  BedIcon,
  PhoneIcon,
  WhatsAppIcon,
  CheckCircleIcon,
  SITE_CONFIG,
  useSiteSettings,
  snowViewSuiteImg,
  chaletSuiteImg,
} from '@shared';
import mountainViewImg from '@shared/assets/images/mountain-view.jpg';
import BookingForm from '../components/BookingForm';
import { mockRooms } from '../data/mockRooms';

const BookRoom = () => {
  const [searchParams] = useSearchParams();
  const roomIdParam = searchParams.get('room');
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const [rooms, setRooms] = useState(mockRooms);
  const [selectedRoomId, setSelectedRoomId] = useState(roomIdParam || mockRooms[0]._id);

  const { settings } = useSiteSettings();
  const company = settings?.company;
  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchRooms = async () => {
      try {
        const res = await apiClient.get('/hotel/rooms');
        if (res.data && res.data.length > 0) {
          setRooms(res.data);
          if (roomIdParam) {
            const directMatch = res.data.find((r) => r._id === roomIdParam);
            if (directMatch) {
              setSelectedRoomId(directMatch._id);
            } else {
              const mock = mockRooms.find((m) => m._id === roomIdParam);
              const nameMatch = res.data.find(
                (r) => mock && r.name && r.name.toLowerCase().includes(mock.name.split(' ')[0].toLowerCase())
              );
              setSelectedRoomId(nameMatch ? nameMatch._id : res.data[0]._id);
            }
          } else {
            setSelectedRoomId(res.data[0]._id);
          }
        }
      } catch (e) {
        setRooms(mockRooms);
      }
    };
    fetchRooms();
  }, [roomIdParam]);

  // Preload all room preview images into browser cache for instantaneous swapping
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      rooms.forEach((room) => {
        if (room.imageURLs && Array.isArray(room.imageURLs)) {
          room.imageURLs.slice(0, 2).forEach((url) => {
            if (url) {
              const img = new Image();
              img.src = url;
            }
          });
        }
      });
    }
  }, [rooms]);

  const selectedRoom = rooms.find((r) => r._id === selectedRoomId) || rooms[0];
  const currentImageSrc = selectedRoom?.imageURLs?.[0] || chaletSuiteImg || snowViewSuiteImg;
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [currentImageSrc]);

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#073125] font-sans">
      {/* 1. Mountain View Header Banner */}
      <section className="relative text-white pt-28 pb-14 px-4 border-b border-white/10 overflow-hidden bg-[#073125]">
        {/* Mountain View Background Image & Ambient Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src={mountainViewImg}
            alt="Himalayan Mountain View at Kasar Devi"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.06]"
          />
          {/* Delicate hint of brand green while keeping mountain peaks clear */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#073125]/45 via-black/15 to-[#073125]/50"></div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <Container size="lg" className="relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#073125]/75 border border-[#C9F24D]/40 text-[#C9F24D] text-xs font-mono uppercase tracking-wider mb-3 backdrop-blur-xs shadow-md">
              <MountainIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
              <span>KASAR DEVI • 6,942 FT</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white mb-2 drop-shadow-md">
              Book Your Room
            </h1>

            <p className="text-[#FAF5EC]/90 text-sm sm:text-base font-light leading-relaxed drop-shadow">
              Book directly with us for the best price, free hot breakfast, and free 48-hour cancellation.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Booking Form & Selected Room Details */}
      <section className="py-12 sm:py-16 px-4">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#073125]/10 shadow-md">
              <div className="border-b border-[#073125]/10 pb-3 mb-5">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#073125]/60">
                  RESERVATION FORM
                </span>
                <h2 className="font-serif text-2xl text-[#073125] font-normal mt-0.5">
                  Guest &amp; Date Details
                </h2>
              </div>

              <BookingForm
                preSelectedRoom={selectedRoomId}
                initialCheckIn={checkInParam}
                initialCheckOut={checkOutParam}
                onSelectRoom={(id) => setSelectedRoomId(id)}
              />
            </div>

            {/* Right Column: Selected Room Preview & Contact */}
            <div className="lg:col-span-5 space-y-5">
              {selectedRoom && (
                <div className="bg-white rounded-3xl overflow-hidden border border-[#073125]/10 shadow-sm">
                  <div className="relative h-48 overflow-hidden bg-[#073125]">
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-[#0B2B21] animate-pulse flex items-center justify-center z-0">
                        <span className="text-[#C9F24D]/60 text-xs font-mono">Loading Suite View...</span>
                      </div>
                    )}
                    <img
                      key={currentImageSrc}
                      src={currentImageSrc}
                      alt={selectedRoom.name}
                      onLoad={() => setImageLoaded(true)}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="bg-[#073125]/85 px-2.5 py-0.5 rounded-full border border-white/20 font-medium text-[11px]">
                        {selectedRoom.view || '180° Snow Peak View'}
                      </span>
                      <span className="bg-[#073125]/85 px-2.5 py-0.5 rounded-full border border-white/20 font-mono text-[11px]">
                        {selectedRoom.area || '42 m²'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#073125]/60 font-bold block">
                          SELECTED ROOM
                        </span>
                        <h3 className="font-serif text-xl text-[#073125] font-medium">
                          {selectedRoom.name}
                        </h3>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-serif text-xl font-bold text-[#073125]">
                          ₹{selectedRoom.pricePerNight?.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-[#073125]/60 block font-light">/ night</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#073125]/75 font-light leading-relaxed mb-4 line-clamp-2">
                      {selectedRoom.description}
                    </p>

                    <div className="pt-3 border-t border-[#073125]/10 flex items-center justify-between text-xs">
                      <span className="text-[#073125] font-medium flex items-center gap-1.5">
                        <BedIcon className="w-3.5 h-3.5 text-[#073125]" />
                        <span>{selectedRoom.bedType || 'King Bed'}</span>
                      </span>
                      <Link
                        to={`/room/${selectedRoom._id}`}
                        className="text-[#073125] hover:underline font-semibold"
                      >
                        View Room Details ↗
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct Booking Perks */}
              <div className="bg-white p-5 rounded-3xl border border-[#073125]/10 shadow-xs space-y-2.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#073125]/60 font-bold block mb-1">
                  DIRECT BOOKING BENEFITS
                </span>
                <div className="flex items-center gap-2 text-xs text-[#073125]">
                  <CheckCircleIcon className="w-4 h-4 text-[#073125] flex-shrink-0" />
                  <span>Best Price Guarantee (No middleman fees)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#073125]">
                  <CheckCircleIcon className="w-4 h-4 text-[#073125] flex-shrink-0" />
                  <span>Free Hot Breakfast Included Daily</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#073125]">
                  <CheckCircleIcon className="w-4 h-4 text-[#073125] flex-shrink-0" />
                  <span>Free Cancellation up to 48 Hours Before Check-in</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#073125]">
                  <CheckCircleIcon className="w-4 h-4 text-[#073125] flex-shrink-0" />
                  <span>Room Heaters &amp; 24-Hour Hot Water</span>
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-[#EBF2EA] p-5 rounded-3xl border border-[#073125]/10 text-xs text-[#073125] flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold block mb-0.5">Need Help with Your Booking?</span>
                  <span className="text-[#073125]/75">Call our Kasar Devi reception anytime.</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`tel:${conciergePhone}`}
                    className="p-2.5 rounded-full bg-white text-[#073125] hover:bg-[#073125] hover:text-white transition-colors shadow-xs"
                    title="Call Reception"
                  >
                    <PhoneIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      'Hello, I would like assistance booking a room at The Kasar Himalayan Heights.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-[#073125] text-white hover:bg-[#12433B] transition-colors shadow-xs"
                    title="Chat on WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default BookRoom;
