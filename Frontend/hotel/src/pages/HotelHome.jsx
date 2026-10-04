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
  hotelBestPic,
  hotelExteriorDay,
  trishulPeaksImg,
  chaletSuiteImg,
  chaletFamilyLiving,
  kasarTempleImg,
  kasarTempleTrail,
  hotelAtNight,
  hotelNightSky,
  sunriseMeditationDeck,
  ArrowUpRightIcon,
  subscribeToUpdates,
} from '@shared';
import HeroBookingBar from '../components/HeroBookingBar';
import SuiteShowcase from '../components/SuiteShowcase';
import AmenitiesGrid from '../components/AmenitiesGrid';
import Experiences from '../components/Experiences';
import TempleTrails from '../components/TempleTrails';
import SatvikDining from '../components/SatvikDining';
import SanctuaryReviews from '../components/SanctuaryReviews';
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

    // Instant real-time sync when rooms or availability change in Admin
    const unsubscribe = subscribeToUpdates('rooms', () => {
      fetchRooms();
    });

    const cleanup = initAutoScrollReveal();
    return () => {
      unsubscribe();
      if (cleanup) cleanup();
    };
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
      <section className="relative min-h-[90vh] flex items-center justify-center bg-[#1C1817] text-[#FDFBF7] overflow-hidden pt-24 pb-28">
        {/* Background Image: Kasar Devi High Ridge Peaks */}
        <div className="absolute inset-0 z-0">
          <img
            src={hotelExteriorDay || hotelBestPic}
            alt="The Kasar Himalayan Heights Resort on Crank's Ridge"
            className="w-full h-full object-cover opacity-60 scale-102"
          />
          {/* Multi-layered cinematic gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1817] via-[#1C1817]/60 to-[#1C1817]/40"></div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#1C1817]/70"></div>
        </div>

        {/* Snow Effect */}
        <SnowEffect count={45} />

        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1C1817]/85 border border-[#C5A059]/40 text-[#C5A059] text-xs font-cinzel uppercase tracking-[0.2em] mb-6 shadow-xl backdrop-blur-md">
            <MountainIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Kasar Devi, Almora • 6,942 FT Elevation</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-tight text-[#FDFBF7] max-w-5xl drop-shadow-md">
            The Kasar Himalayan Heights
          </h1>

          <p className="mt-4 font-serif text-xl sm:text-3xl text-[#C5A059] italic max-w-3xl font-light tracking-wide">
            Peace, Warmth &amp; 180° Snow Peak Views
          </p>

          <p className="mt-5 text-base sm:text-lg text-[#FDFBF7]/85 max-w-2xl font-light leading-relaxed font-sans">
            Warm heated rooms with private balconies facing Mount Trishul and Nanda Devi peaks. A peaceful stay with 24-hour hot water, room heaters, electric bed warmers, and fresh home-style pure veg food.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#book"
              className="px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition-all shadow-md border border-[#C5A059]/40 hover:scale-102"
            >
              Book Your Room
            </a>
            <a
              href="#rooms"
              className="px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-widest font-semibold border border-[#C5A059] bg-[#FAF6EF]/10 hover:bg-[#C5A059]/20 text-[#FDFBF7] transition-all backdrop-blur-sm hover:scale-102"
            >
              View Rooms &amp; Prices
            </a>
          </div>
        </div>
      </section>

      {/* 2. Floating Hero Booking Bar */}
      <HeroBookingBar rooms={rooms} onSearch={(data) => setSelectedRoomId(data.suiteId)} />

      {/* 2.5 Kumaon At A Glance */}
      <section id="glance" className="pt-14 pb-10 sm:pt-16 sm:pb-12 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 reveal">
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.2em] font-bold block mb-2 font-cinzel">
              Kasar Devi, Almora • 6,942 Ft
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2C2523] font-medium leading-tight">
              Why You Will Love Staying With Us
            </h2>
            <div className="w-16 h-0.5 bg-[#C5A059]/60 mx-auto my-3"></div>
            <p className="mt-3 text-[#5C5350] text-sm sm:text-base font-light leading-relaxed font-sans">
              Located in the quiet pine hills of Kasar Devi at 6,942 feet. Enjoy clear morning views of snow peaks from your bed, fresh forest air, warm rooms in winter, and delicious hot meals.
            </p>
          </div>

          {/* 4-Item Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 reveal">
            {/* Bento Item 1 */}
            <div className="group relative rounded-3xl overflow-hidden bg-slate h-80 sm:h-96 shadow-md border border-[#C5A059]/30 flex flex-col justify-end p-5">
              <img
                src={trishulPeaksImg}
                alt="Trishul and Nanda Devi peaks"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[#C5A059] text-[11px] uppercase font-cinzel font-semibold tracking-widest block mb-1">
                  Private Balcony View
                </span>
                <h3 className="font-serif text-xl text-ivory font-medium mb-1">
                  Snow Peak Views
                </h3>
                <p className="text-ivory/80 text-xs font-light line-clamp-2 font-sans">
                  Clear 180° views of Mount Trishul and Nanda Devi peaks right from your bed and private balcony.
                </p>
              </div>
            </div>

            {/* Bento Item 2 */}
            <div className="group relative rounded-3xl overflow-hidden bg-slate h-80 sm:h-96 shadow-md border border-[#C5A059]/30 flex flex-col justify-end p-5">
              <img
                src={chaletFamilyLiving || chaletSuiteImg}
                alt="Cedar Alpine Chalet Interiors"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[#C5A059] text-[11px] uppercase font-cinzel font-semibold tracking-widest block mb-1">
                  Cozy In Winter
                </span>
                <h3 className="font-serif text-xl text-ivory font-medium mb-1">
                  Warm Heated Rooms
                </h3>
                <p className="text-ivory/80 text-xs font-light line-clamp-2 font-sans">
                  Room heaters and electric bed warmers in every room to keep you warm and comfortable on cold nights.
                </p>
              </div>
            </div>

            {/* Bento Item 3 */}
            <div className="group relative rounded-3xl overflow-hidden bg-slate h-80 sm:h-96 shadow-md border border-[#C5A059]/30 flex flex-col justify-end p-5">
              <img
                src={kasarTempleTrail || kasarTempleImg}
                alt="Kasar Devi ancient ridge"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[#C5A059] text-[11px] uppercase font-cinzel font-semibold tracking-widest block mb-1">
                  10 Min Walk
                </span>
                <h3 className="font-serif text-xl text-ivory font-medium mb-1">
                  Temple &amp; Nature Walks
                </h3>
                <p className="text-ivory/80 text-xs font-light line-clamp-2 font-sans">
                  Walk through peaceful pine trails to the ancient Kasar Devi Temple and Swami Vivekananda caves.
                </p>
              </div>
            </div>

            {/* Bento Item 4 */}
            <div className="group relative rounded-3xl overflow-hidden bg-slate h-80 sm:h-96 shadow-md border border-[#C5A059]/30 flex flex-col justify-end p-5">
              <img
                src={hotelNightSky || hotelAtNight}
                alt="Dark sky stargazing at Kasar"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
              <div className="relative z-10">
                <span className="text-[#C5A059] text-[11px] uppercase font-cinzel font-semibold tracking-widest block mb-1">
                  Zero Pollution
                </span>
                <h3 className="font-serif text-xl text-ivory font-medium mb-1">
                  Starlit Night Skies
                </h3>
                <p className="text-ivory/80 text-xs font-light line-clamp-2 font-sans">
                  Clean mountain air with zero city light pollution, full of bright stars and peaceful silence at night.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Quote Banner */}
          <div className="mt-8 sm:mt-10 text-center border-t border-b border-[#C5A059]/25 py-4 sm:py-5 reveal">
            <p className="font-serif text-xl sm:text-2xl text-[#2C2523] italic font-light max-w-2xl mx-auto">
              &ldquo;A peaceful mountain home where your mind and body find true rest.&rdquo;
            </p>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A059] font-cinzel block mt-1.5 font-semibold">
              The Kasar Himalayan Heights • Kasar Devi, Almora • 6,942 FT
            </span>
          </div>
        </Container>
      </section>

      {/* 3. Editorial Suite Showcase */}
      <SuiteShowcase
        rooms={rooms}
        onSelectSuite={(id) => handleBookNow(id)}
        onOpenQuickView={handleOpenQuickView}
      />

      {/* 3.5 Our Story & History of Kasar Devi */}
      <section id="philosophy" className="py-10 sm:py-14 px-4 bg-[#FAF6EF]/60 border-b border-[#C5A059]/20">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Image */}
            <div className="lg:col-span-5 reveal">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#C5A059]/35 bg-slate group">
                <img
                  src={sunriseMeditationDeck || kasarTempleImg}
                  alt="Kasar Devi ridge and ancient pine groves"
                  className="w-full h-[400px] sm:h-[440px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1817]/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-ivory">
                  <span className="text-[#C5A059] text-[11px] uppercase font-cinzel font-semibold tracking-widest block mb-1">
                    Spiritual Heritage
                  </span>
                  <h4 className="font-serif text-xl font-medium text-[#FDFBF7]">
                    The Ancient Pine Ridge of Kasar Devi
                  </h4>
                  <p className="text-xs text-ivory/80 mt-1 font-light font-sans">
                    Kasar Devi, Almora • 6,942 FT Height
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Story */}
            <div className="lg:col-span-7 space-y-5 reveal">
              <div>
                <span className="text-[#C5A059] text-xs uppercase tracking-[0.2em] font-bold block mb-2 font-cinzel">
                  Our Story
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#2C2523] font-medium leading-tight">
                  The Peace &amp; History of Kasar Devi
                </h2>
                <div className="w-16 h-0.5 bg-[#C5A059]/60 my-3"></div>
              </div>

              <p className="text-[#5C5350] text-sm sm:text-base font-normal leading-relaxed font-sans">
                In 1890, Swami Vivekananda traveled to Kasar Devi for deep meditation in the quiet hill caves. Over the years, many travelers, writers, and pilgrims have visited this sacred hill to experience its quiet energy and pure mountain air.
              </p>

              <p className="text-[#5C5350] text-sm sm:text-base font-normal leading-relaxed font-sans">
                We built The Kasar Himalayan Heights to give you that same peace in warm, modern comfort. Made with natural mountain stone and pine wood, our rooms give you wide views of the snow peaks, warm beds on cold nights, and friendly local hospitality.
              </p>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#C5A059]/20">
                <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#C5A059]/25 shadow-xs">
                  <span className="text-[#7C1D23] font-serif text-2xl font-bold block mb-0.5 font-numeral">180°</span>
                  <span className="text-xs font-bold text-[#2C2523] block font-cinzel">Snow Peak View</span>
                  <span className="text-[11px] text-[#6B615E] font-sans">Trishul &amp; Nanda Devi</span>
                </div>
                <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#C5A059]/25 shadow-xs">
                  <span className="text-[#7C1D23] font-serif text-2xl font-bold block mb-0.5 font-numeral">6,942′</span>
                  <span className="text-xs font-bold text-[#2C2523] block font-cinzel">Mountain Height</span>
                  <span className="text-[11px] text-[#6B615E] font-sans">Clean pine forest air</span>
                </div>
                <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#C5A059]/25 shadow-xs">
                  <span className="text-[#7C1D23] font-serif text-2xl font-bold block mb-0.5 font-numeral">100%</span>
                  <span className="text-xs font-bold text-[#2C2523] block font-cinzel">Warm Rooms</span>
                  <span className="text-[11px] text-[#6B615E] font-sans">Heaters &amp; bed warmers</span>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href="#book"
                  className="px-6 py-3 rounded-full text-xs font-sans uppercase tracking-widest font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition-all shadow-md inline-flex items-center gap-2 border border-[#C5A059]/40 hover:scale-102"
                >
                  <span>Book Your Stay in Kasar Devi</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3.6 Dev Bhoomi Shrines at Our Doorstep */}
      <TempleTrails />

      {/* 3.7 The Kumaoni Hearth & Fresh Satvik Dining */}
      <SatvikDining />

      {/* 4. Amenities Grid (Thoughtful Winter Luxury) */}
      <AmenitiesGrid />

      {/* 5. Curated Winter Experiences */}
      <Experiences />

      {/* 5.5 Guest Sanctuary Chronicles */}
      <SanctuaryReviews />

      {/* 6. All Suites Grid Preview */}
      <section className="py-10 sm:py-14 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20">
        <Container size="lg">
          <SectionHeading
            subtitle="Warm Heated Rooms"
            title="Rooms Built for Mountain Warmth"
            description="Private balconies with snow peak views, room heaters, electric bed warmers, and 24-hour hot water."
          />

          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 reveal">
            {rooms.slice(0, 3).map((room) => (
              <div key={room._id} className="reveal-stagger">
                <RoomCard room={room} onBookNow={handleBookNow} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/rooms"
              className="px-8 py-3.5 rounded-full text-xs font-sans uppercase tracking-wider font-semibold border border-[#C5A059] bg-[#FAF6EF] hover:bg-[#C5A059]/20 text-[#2C2523] hover:text-[#7C1D23] transition-all shadow-xs inline-flex items-center gap-2 hover:scale-102"
            >
              <span>View All Rooms &amp; Rates</span>
              <span className="text-[#7C1D23] text-sm">&rarr;</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* 7. Dedicated Booking Section */}
      <section id="book" className="py-10 sm:py-14 px-4 bg-[#FAF6EF]/60">
        <Container size="md">
          <SectionHeading
            subtitle="Book Direct"
            title="Book Your Room"
            description="Booking directly gets you our best rate, free hot breakfast every morning, and free cancellation up to 48 hours before check-in."
          />

          <div className="mt-8 bg-[#FDFBF7] p-6 sm:p-10 rounded-3xl border border-[#C5A059]/35 shadow-xl reveal">
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
