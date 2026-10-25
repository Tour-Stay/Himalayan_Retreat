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

const PERKS = [
  { icon: '🏔️', title: 'Best Price Guarantee', desc: 'No commission fees when booking direct' },
  { icon: '🍵', title: 'Free Hot Breakfast', desc: 'Fresh Pahadi breakfast served every morning' },
  { icon: '✨', title: 'Free Cancellation', desc: '48-hour flexible cancellation, no questions' },
  { icon: '🔥', title: 'Heated Rooms', desc: 'Room heaters & 24-hour mountain-hot water' },
];

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
    <div className="min-h-screen bg-[#F4F7F4] text-[#073125] font-sans">

      {/* ═══════════════════════════════════════════════════ */}
      {/* HERO — Immersive full-bleed mountain panorama       */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '75vh' }}>
        {/* Background panorama */}
        <div className="absolute inset-0 z-0">
          <img
            src={mountainViewImg}
            alt="Himalayan Mountain View at Kasar Devi"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.70) saturate(1.1)', transform: 'scale(1.05)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#051B12]/65 via-transparent to-[#073125]/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#073125]/25 via-transparent to-transparent" />
        </div>

        {/* Ambient dot grid */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-15"
          style={{ backgroundImage: 'radial-gradient(circle, #C9F24D 1px, transparent 1px)', backgroundSize: '55px 55px' }} />

        {/* Back nav */}
        <div className="relative z-10 pt-5 px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/65 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors group"
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 10H5M10 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to the Stay
          </Link>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-14 pb-36">
          {/* Eyebrow badge */}


          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[5.5rem] font-normal tracking-tight text-white mb-5 leading-[1.04]"
            style={{ textShadow: '0 4px 40px rgba(0,0,0,0.4)' }}>
            Reserve Your<br />
            <em className="not-italic text-[#C9F24D]">Mountain Retreat</em>
          </h1>

          <p className="text-white/72 text-sm sm:text-base font-light max-w-lg leading-relaxed mb-10">
            Wake to Himalayan peaks, breathe pine-fresh air, and let the mountains do the rest.
            Booking direct gives you the best rate — always.
          </p>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7">
            {['Best Rate Guarantee', 'Free Hot Breakfast', 'Free 48-hr Cancellation'].map((label) => (
              <div key={label} className="flex items-center gap-2 text-white/75 text-xs font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9F24D] flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full" style={{ height: '70px' }}>
            <path d="M0,80 C360,0 1080,60 1440,20 L1440,80 Z" fill="#F4F7F4" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* MAIN CONTENT — Form + Sidebar                      */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="relative z-10 -mt-1 pb-20 px-4">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">

            {/* ─── Left: Booking Form Card ─── */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[2rem] border border-[#073125]/8 shadow-[0_8px_60px_rgba(7,49,37,0.10)] overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#073125] to-[#0E4B37] px-7 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9F24D]/15 border border-[#C9F24D]/25 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 20 20" className="w-5 h-5 text-[#C9F24D]" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M6 2v3m8-3v3M3 8h14M5 4h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#C9F24D] text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Reservation Form</p>
                    <h2 className="font-serif text-xl text-white font-normal mt-0.5">Guest & Date Details</h2>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-[10px] text-white/50 font-mono shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#C9F24D] animate-pulse" />
                    LIVE
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-8">
                  <BookingForm
                    preSelectedRoom={selectedRoomId}
                    initialCheckIn={checkInParam}
                    initialCheckOut={checkOutParam}
                    onSelectRoom={(id) => setSelectedRoomId(id)}
                  />
                </div>
              </div>
            </div>

            {/* ─── Right: Sidebar ─── */}
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-6">

              {/* Selected Room Preview */}
              {selectedRoom && (
                <div className="bg-white rounded-[2rem] overflow-hidden border border-[#073125]/8 shadow-[0_8px_40px_rgba(7,49,37,0.09)]">
                  <div className="relative h-52 overflow-hidden bg-[#0D2B20]">
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0B2B21] to-[#1B4B3D] animate-pulse flex items-center justify-center">
                        <span className="text-[#C9F24D]/40 text-xs font-mono">Loading Suite View…</span>
                      </div>
                    )}
                    <img
                      key={currentImageSrc}
                      src={currentImageSrc}
                      alt={selectedRoom.name}
                      onLoad={() => setImageLoaded(true)}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#073125]/90 via-black/10 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="bg-black/55 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/20">
                        {selectedRoom.view || '180° Snow Peak View'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <p className="text-[9px] font-mono text-white/55 uppercase tracking-wider mb-0.5">Selected Room</p>
                        <h3 className="font-serif text-base font-medium leading-tight">{selectedRoom.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="font-serif text-2xl font-bold text-[#C9F24D]">₹{selectedRoom.pricePerNight?.toLocaleString()}</span>
                        <p className="text-[10px] text-white/55 font-light">/ night</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-[#4A6557] font-light leading-relaxed line-clamp-2 mb-4">
                      {selectedRoom.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#073125]/8 text-xs">
                      <span className="flex items-center gap-1.5 text-[#073125] font-medium">
                        <BedIcon className="w-3.5 h-3.5" />
                        {selectedRoom.bedType || 'King Bed'}
                      </span>
                      <span className="font-mono text-[10px] text-[#073125]/50">{selectedRoom.area || '42 m²'}</span>
                      <Link
                        to={`/room/${selectedRoom._id}`}
                        className="text-[#073125] hover:text-[#C9A72E] font-semibold transition-colors underline underline-offset-2"
                      >
                        View Details ↗
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Perks — Dark Green Card */}
              <div className="bg-gradient-to-br from-[#073125] to-[#0E4B37] p-6 rounded-[2rem] border border-white/10 shadow-lg">
                <p className="text-[#C9F24D] text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-5">
                  ✦ Direct Booking Benefits
                </p>
                <div className="space-y-4">
                  {PERKS.map((perk) => (
                    <div key={perk.title} className="flex items-start gap-3.5 group">
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-base flex-shrink-0 group-hover:bg-[#C9F24D]/15 transition-colors duration-200">
                        {perk.icon}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold leading-tight">{perk.title}</p>
                        <p className="text-white/52 text-xs font-light mt-0.5 leading-relaxed">{perk.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-white p-5 rounded-[2rem] border border-[#073125]/8 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                      <span className="text-[10px] font-mono font-bold text-[#073125]/50 uppercase tracking-wider">Reception Available</span>
                    </div>
                    <p className="font-serif text-base text-[#073125] font-medium leading-snug">Need help with your booking?</p>
                    <p className="text-[#4A6557] text-xs font-light mt-1">Our Kasar Devi team is here for you.</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <a
                      href={`tel:${conciergePhone}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#073125] text-white hover:bg-[#0E4B37] transition-all text-xs font-semibold shadow-sm"
                    >
                      <PhoneIcon className="w-3.5 h-3.5" />
                      Call Us
                    </a>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I would like assistance booking a room at The Kasar Himalayan Heights.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#1ebe5a] transition-all text-xs font-semibold shadow-sm"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Altitude tag */}
              <div className="flex items-center justify-center gap-3 py-2 opacity-50">
                <div className="h-px flex-1 bg-[#073125]/20" />
                <span className="text-[10px] font-mono text-[#073125]/60 uppercase tracking-[0.18em] whitespace-nowrap">🏔 6,942 ft · Kasar Devi</span>
                <div className="h-px flex-1 bg-[#073125]/20" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* BOTTOM STRIP — Why book direct                     */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="bg-[#073125] py-10 px-4 border-t border-white/5">
        <Container size="lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[#C9F24D] text-[11px] font-mono uppercase tracking-[0.2em] mb-1">The Direct Difference</p>
              <h3 className="font-serif text-xl text-white font-normal">Everything included. Nothing hidden.</h3>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {['No booking fees', 'No OTA markup', 'Priority support', 'Flexible changes'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/70 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-[#C9F24D] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default BookRoom;
