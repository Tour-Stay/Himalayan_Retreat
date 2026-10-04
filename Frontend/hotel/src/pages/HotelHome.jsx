import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  MountainIcon,
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
  ArrowUpRightIcon,
  WhatsAppIcon,
  CheckCircleIcon,
  apiClient,
  subscribeToUpdates,
  SITE_CONFIG,
  useSiteSettings,
} from '@shared';
import HeroBookingBar from '../components/HeroBookingBar';
import SuiteShowcase from '../components/SuiteShowcase';
import TempleTrails from '../components/TempleTrails';
import SatvikDining from '../components/SatvikDining';
import SanctuaryReviews from '../components/SanctuaryReviews';
import RoomModal from '../components/RoomModal';
import SnowEffect from '../components/SnowEffect';
import { mockRooms } from '../data/mockRooms';

const HotelHome = () => {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const whatsappNumber = settings?.company?.whatsappNumber || SITE_CONFIG.whatsappNumber;

  const [rooms, setRooms] = useState(mockRooms);
  const [modalRoom, setModalRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await apiClient.get('/hotel/rooms');
        if (res.data && res.data.length > 0) {
          setRooms(res.data);
        }
      } catch (error) {
        setRooms(mockRooms);
      }
    };
    fetchRooms();

    const unsubscribe = subscribeToUpdates('rooms', () => {
      fetchRooms();
    });

    const cleanup = initAutoScrollReveal();
    return () => {
      unsubscribe();
      if (cleanup) cleanup();
    };
  }, []);

  const handleOpenQuickView = (room) => {
    setModalRoom(room);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#F8FAF7] text-[#073125] font-sans selection:bg-[#C9F24D] selection:text-[#073125]">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-black text-white overflow-hidden pt-20 pb-24">
        {/* Background Image — Clear, crisp visibility with natural colors */}
        <div className="absolute inset-0 z-0">
          <img
            src={hotelExteriorDay || hotelBestPic}
            alt="The Kasar Himalayan Heights Resort in Kasar Devi"
            className="w-full h-full object-cover opacity-85 scale-100 transition-opacity duration-700"
          />
          {/* Subtle neutral gradient for text legibility without green tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20"></div>
        </div>

        <SnowEffect count={25} />

        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/25 text-[#C9F24D] text-xs sm:text-sm font-mono uppercase tracking-wider mb-5 backdrop-blur-md shadow-md">
            <MountainIcon className="w-4 h-4 text-[#C9F24D]" />
            <span>Kasar Devi, Almora • 6,942 FT</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight leading-tight text-white max-w-4xl drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)]">
            The Kasar Himalayan Heights
          </h1>

          <p className="mt-3 text-xl sm:text-3xl text-[#C9F24D] font-light drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            Warm Rooms • Snow Peak Views • Fresh Food
          </p>

          <p className="mt-4 text-base sm:text-lg text-white/95 max-w-2xl font-light leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
            Heated rooms with room heaters, bed warmers, and private balconies facing Mount Trishul and Nanda Devi peaks. 24-hour hot water, fresh home-cooked meals, and peaceful pine air.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/book"
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider font-bold bg-[#C9F24D] hover:bg-[#b8e23f] text-[#073125] transition-all shadow-md hover:scale-102 flex items-center gap-2"
            >
              <span>Book a Room</span>
              <ArrowUpRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/rooms"
              className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold border border-white/30 bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm hover:scale-102"
            >
              View Rooms &amp; Prices
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Search & Booking Bar */}
      <HeroBookingBar rooms={rooms} />

      {/* 3. Why Stay With Us (Clean 4-Card Bento Grid) */}
      <section id="glance" className="pt-16 pb-16 sm:pt-20 sm:pb-20 px-4 bg-[#F8FAF7] border-b border-[#073125]/10">
        <Container size="full" className="max-w-[1560px]">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 reveal">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-xs font-mono font-bold tracking-widest uppercase mb-2.5">
              WHY GUESTS LOVE STAYING HERE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#073125] font-normal">
              Simple Mountain Comfort
            </h2>
            <p className="mt-2 text-[#073125]/80 text-base sm:text-lg font-light">
              A peaceful stay in the quiet pine hills of Kasar Devi, just 10 minutes from the temple.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 reveal">
            {/* 1 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[360px] sm:h-[390px] lg:h-[410px] shadow-lg hover:shadow-xl hover:border-black/25 transition-all duration-300 border border-black/10 flex flex-col justify-end p-5 sm:p-6">
              <img
                src={trishulPeaksImg}
                alt="Snow peak views"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1.5 leading-tight">
                  Snow Peak Views
                </h3>
                <p className="text-white/90 text-xs sm:text-sm font-light leading-relaxed">
                  See Mount Trishul and Nanda Devi clearly from your bed and private balcony.
                </p>
              </div>
            </div>

            {/* 2 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[360px] sm:h-[390px] lg:h-[410px] shadow-lg hover:shadow-xl hover:border-black/25 transition-all duration-300 border border-black/10 flex flex-col justify-end p-5 sm:p-6">
              <img
                src={chaletFamilyLiving || chaletSuiteImg}
                alt="Warm heated room"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1.5 leading-tight">
                  Warm Heated Rooms
                </h3>
                <p className="text-white/90 text-xs sm:text-sm font-light leading-relaxed">
                  Room heaters and electric bed warmers in every room to keep you warm on cold nights.
                </p>
              </div>
            </div>

            {/* 3 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[360px] sm:h-[390px] lg:h-[410px] shadow-lg hover:shadow-xl hover:border-black/25 transition-all duration-300 border border-black/10 flex flex-col justify-end p-5 sm:p-6">
              <img
                src={kasarTempleTrail || kasarTempleImg}
                alt="Walk to Kasar Devi Temple"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1.5 leading-tight">
                  10 Min Walk to Temple
                </h3>
                <p className="text-white/90 text-xs sm:text-sm font-light leading-relaxed">
                  Easy walk through pine trees to ancient Kasar Devi Temple and Vivekananda caves.
                </p>
              </div>
            </div>

            {/* 4 */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 h-[360px] sm:h-[390px] lg:h-[410px] shadow-lg hover:shadow-xl hover:border-black/25 transition-all duration-300 border border-black/10 flex flex-col justify-end p-5 sm:p-6">
              <img
                src={hotelNightSky || hotelAtNight}
                alt="Starry night sky"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
              <div className="relative z-10">
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1.5 leading-tight">
                  Clean Forest Air
                </h3>
                <p className="text-white/90 text-xs sm:text-sm font-light leading-relaxed">
                  Clean mountain air with zero city noise and bright starry skies at night.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Rooms Showcase (Clean, compact tab preview) */}
      <SuiteShowcase
        rooms={rooms}
        onOpenQuickView={handleOpenQuickView}
      />

      {/* 5. Fresh Pure Veg Food */}
      <SatvikDining />

      {/* 6. Temples & Nearby Sights */}
      <TempleTrails />

      {/* 7. Guest Reviews */}
      <SanctuaryReviews />

      {/* 8. Bottom Reservation Banner */}
      <section className="py-16 sm:py-20 px-4 bg-[#031C15] text-white relative overflow-hidden border-t border-b border-white/10">
        <Container size="md">
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-5 bg-white/[0.04] p-8 sm:p-12 rounded-3xl border border-white/12 shadow-2xl backdrop-blur-sm">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase shadow-xs">
              BOOK DIRECT
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-white">
              Ready for Your Stay in Kasar Devi?
            </h2>

            <p className="text-white/85 text-sm sm:text-base font-light leading-relaxed max-w-lg mx-auto">
              Book directly with us for the best price, free hot breakfast every morning, and free cancellation up to 48 hours before check-in.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/book"
                className="px-7 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold bg-[#C9F24D] hover:bg-[#b8e23f] text-[#073125] transition-all shadow-lg hover:scale-102 flex items-center gap-2 cursor-pointer"
              >
                <span>Book a Room Now</span>
                <ArrowUpRightIcon className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(
                    'Hello, I would like to inquire about booking a room at The Kasar Himalayan Heights.'
                  );
                  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
                }}
                className="px-6 py-3.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold border border-white/30 hover:bg-white/10 text-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#C9F24D]" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>

            {/* Simple Perks */}
            <div className="pt-5 border-t border-white/15 flex flex-wrap items-center justify-center gap-5 text-xs text-white/75">
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span>Best Price Guarantee</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span>Free Hot Breakfast</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5 text-[#C9F24D]" />
                <span>Free 48-Hour Cancellation</span>
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Room Quick View Modal */}
      <RoomModal
        room={modalRoom}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookNow={(roomId) => navigate(`/book?room=${roomId}`)}
      />
    </div>
  );
};

export default HotelHome;
