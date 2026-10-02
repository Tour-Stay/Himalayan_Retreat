import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  SectionHeading,
  Button,
  ArchImage,
  apiClient,
  MountainIcon,
  SnowIcon,
  ShieldCheckIcon,
  initAutoScrollReveal,
} from '@shared';
import HeroBookingBar from '../components/HeroBookingBar';
import SuiteShowcase from '../components/SuiteShowcase';
import AmenitiesGrid from '../components/AmenitiesGrid';
import Experiences from '../components/Experiences';
import RoomCard from '../components/RoomCard';
import RoomModal from '../components/RoomModal';
import BookingForm from '../components/BookingForm';
import SnowEffect from '../components/SnowEffect';
import { mockRooms } from '../data/mockRooms';

const HotelHome = () => {
  const [rooms, setRooms] = useState(mockRooms);
  const [selectedRoomId, setSelectedRoomId] = useState(mockRooms[0]._id);
  const [modalRoom, setModalRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await apiClient.get('/hotel/rooms');
        if (res.data && res.data.length > 0) {
          setRooms(res.data);
          setSelectedRoomId(res.data[0]._id);
        }
      } catch (error) {
        setRooms(mockRooms);
      }
    };
    fetchRooms();
    const cleanup = initAutoScrollReveal();
    return cleanup;
  }, []);

  const handleBookNow = (roomId) => {
    setSelectedRoomId(roomId);
    const bookEl = document.getElementById('book');
    if (bookEl) {
      bookEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenQuickView = (room) => {
    setModalRoom(room);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-ivory text-charcoal font-sans selection:bg-gold/20 selection:text-maroon">
      {/* 1. Hero Section with Mountain Ridge Panorama & Snow Atmosphere */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-slate text-ivory overflow-hidden pt-20 pb-24">
        {/* Background Image: Kasar Devi High Ridge Peaks */}
        <div className="absolute inset-0 z-0">
          <img
            src="/resort-exterior.jpg"
            alt="The Kasar Himalayan Heights Resort on Crank's Ridge"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate via-slate/75 to-slate/40"></div>
        </div>

        {/* Snow Effect */}
        <SnowEffect count={45} />

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate/85 border border-gold/40 text-gold text-xs font-mono uppercase tracking-[0.25em] mb-6 shadow-md">
            <MountainIcon className="w-3.5 h-3.5 text-gold" />
            <span>Kasar Devi • 6,942 FT • Almora</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-tight text-ivory max-w-4xl">
            The Kasar Himalayan Heights
          </h1>

          <p className="mt-4 font-serif text-lg sm:text-2xl text-gold/90 italic max-w-2xl font-light">
            Boutique heated chalet living facing the sacred 180° Himalayan snow crests
          </p>

          <p className="mt-4 text-sm sm:text-base text-ivory/75 max-w-2xl font-light leading-relaxed">
            Perched directly on Crank&apos;s Ridge with unbroken panoramas of Trishul (7,120m) and Nanda Devi (7,816m).
            Engineered with deep winter heating, alpine pine wood architecture, and quiet mountain warmth.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#book"
              className="bg-maroon hover:bg-maroon-dark text-ivory font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-colors border border-gold/30"
            >
              Reserve a Suite
            </a>
            <Link
              to="/rooms"
              className="border border-gold/50 hover:bg-gold/15 text-ivory font-semibold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-colors"
            >
              Explore All 12 Suites
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Floating Hero Booking Bar */}
      <HeroBookingBar onSearch={(data) => setSelectedRoomId(data.suiteId)} />

      {/* 3. Editorial Suite Showcase */}
      <SuiteShowcase
        onSelectSuite={(id) => handleBookNow(id)}
        onOpenQuickView={handleOpenQuickView}
      />

      {/* 4. Amenities Grid (Thoughtful Winter Luxury) */}
      <AmenitiesGrid />

      {/* 5. Curated Winter Experiences */}
      <Experiences />

      {/* 6. All Suites Grid Preview */}
      <section className="py-24 px-4 bg-ivory border-b border-gold/15">
        <Container size="lg">
          <SectionHeading
            subtitle="Alpine Accommodations"
            title="Every Suite, Handcrafted & Heated"
            description="Floor-to-ceiling glass balconies, dual bed warmers, 24/7 hot water geysers, and fragrant local cedar pine interiors."
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
            {rooms.slice(0, 3).map((room) => (
              <div key={room._id} className="reveal-stagger">
                <RoomCard room={room} onBookNow={handleBookNow} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/rooms"
              className="inline-block px-8 py-3.5 rounded-full border border-gold/40 text-charcoal hover:bg-gold/10 text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              View All Suites & Pricing &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* 7. Dedicated Booking Section */}
      <section id="book" className="py-24 px-4 bg-ivory-warm">
        <Container size="md">
          <SectionHeading
            subtitle="Direct Reservation"
            title="Book Your Mountain Stay"
            description="Direct reservation provides our best rate guarantee, complimentary organic mountain breakfast, and flexible 48h cancellation."
          />

          <div className="mt-12 bg-ivory p-8 sm:p-12 rounded-3xl border border-gold/35 shadow-xl reveal">
            <BookingForm
              preSelectedRoom={selectedRoomId}
              onSelectRoom={(id) => setSelectedRoomId(id)}
            />
          </div>
        </Container>
      </section>

      {/* Room Quick View Modal */}
      <RoomModal
        room={modalRoom}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookNow={handleBookNow}
      />
    </div>
  );
};

export default HotelHome;
