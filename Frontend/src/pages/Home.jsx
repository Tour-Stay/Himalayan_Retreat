import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import HeroBookingBar from '../components/HeroBookingBar';
import SuiteShowcase from '../components/SuiteShowcase';
import Experiences from '../components/Experiences';
import AmenitiesGrid from '../components/AmenitiesGrid';
import RoomCard from '../components/RoomCard';
import RoomModal from '../components/RoomModal';
import TestimonialCard from '../components/TestimonialCard';
import BookingForm from '../components/BookingForm';

import {
  CheckCircleIcon,
  ArrowUpRightIcon,
  StarIcon,
  SparklesIcon,
  PhoneIcon,
  MessageIcon,
  MapPinIcon,
  CompassIcon,
  MountainIcon,
  ShieldCheckIcon,
} from '../components/Icons';
import { mockRooms } from '../data/mockRooms';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const [rooms, setRooms] = useState(mockRooms);
  const [selectedRoomId, setSelectedRoomId] = useState(mockRooms[0]._id);
  const [modalRoom, setModalRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/hotel/rooms`);
        if (res.data && res.data.length > 0) {
          setRooms(res.data);
          setSelectedRoomId(res.data[0]._id);
        }
      } catch (error) {
        setRooms(mockRooms);
      }
    };
    fetchRooms();
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

  // High-altitude mountain photography (Zero river, zero low fog — pure mountain summits and snowy ridges)
  const galleryItems = [
    {
      title: 'Winter Snowfall over Himalayan',
      caption: 'Kasar Devi Mountain Ridge • 7,500 ft',
      src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85',
      span: 'md:col-span-2 md:row-span-2',
    },
    {
      title: 'Cozy Heated Suites',
      caption: 'Handcrafted Pine Wood Interiors',
      src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=85',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Himalayan Golden Sunrise',
      caption: 'Unobstructed 180° Snow Peak Vista',
      src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Starlit Evening Bonfire',
      caption: 'Crackling Cedar Fires & Hot Tea',
      src: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=85',
      span: 'md:col-span-1 md:row-span-1',
    },
    {
      title: 'Snow-Dusted Pine Trails',
      caption: 'Deodar Forest Walking Trails',
      src: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1000&q=85',
      span: 'md:col-span-2 md:row-span-1',
    },
  ];

  const testimonials = [
    {
      name: 'Ananya & Vikram Sharma',
      location: 'New Delhi',
      review: 'We were lucky to experience fresh snowfall during our December stay! The room heaters and electric bed warmers kept us delightfully toasty. Waking up to Nanda Devi in the morning was surreal.',
      rating: 5,
    },
    {
      name: 'Rajesh Nair',
      location: 'Bengaluru',
      review: 'Spent a whole week here for a mountain workation. The 100 Mbps fiber Wi-Fi worked without a glitch even during cold rain, and the staff treats you like family. Truly the best retreat in Kasar Devi.',
      rating: 5,
    },
    {
      name: 'Sarah & Michael Mitchell',
      location: 'London, UK',
      review: 'A hidden sanctuary in the Kumaon hills. The crackling outdoor bonfire at night with hot mountain tea, followed by the alpine sunrise, made this the highlight of our India trip.',
      rating: 5,
    },
  ];

  return (
    <>
      {/* ======================== 1. HERO SECTION ======================== */}
      <Hero />

      {/* ======================== 2. SIGNATURE HORIZONTAL BOOKING BAR ======================== */}
      <HeroBookingBar
        onSearch={(searchData) => {
          if (searchData.suiteId) setSelectedRoomId(searchData.suiteId);
        }}
      />

      {/* ======================== 3. ABOUT / SANCTUARY STORY ======================== */}
      <section id="about" className="py-28 px-4 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cream text-secondary text-xs uppercase tracking-[0.25em] font-semibold mb-5 border border-secondary/30 shadow-xs">
            <SparklesIcon className="w-3.5 h-3.5 text-secondary" />
            <span>A High-Altitude Sanctuary</span>
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl text-text-dark font-medium mb-6 leading-tight tracking-tight">
            A quiet mountain sanctuary, <br className="hidden sm:inline" />made for slow mornings.
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto mb-8 rounded-full"></div>
          <p className="text-text-light leading-relaxed text-base sm:text-lg font-light mb-6">
            Perched high above the pine and deodar forests of Kasar Devi at 7,500 feet, The Kasar Himalayan Heights is a luxury boutique escape shaped by the gentle rhythm of the Himalayas — where winter brings crisp snowfall, golden sunrises greet your bedside, and evenings unwind beside a crackling cedar fire.
          </p>
          <p className="text-text-light leading-relaxed text-base sm:text-lg font-light">
            With only 12 exclusive heated suites, every guest experiences personalized warmth, uninterrupted peace, and unhurried mountain luxury.
          </p>
        </div>
      </section>

      {/* ======================== 4. EDITORIAL SUITE SHOWCASE ======================== */}
      <SuiteShowcase
        onSelectSuite={(roomId) => setSelectedRoomId(roomId)}
        onOpenQuickView={handleOpenQuickView}
      />

      {/* ======================== 5. ALL SUITES PREVIEW GRID ======================== */}
      <section className="py-20 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
            <div>
              <span className="text-secondary text-xs uppercase tracking-[0.25em] font-semibold block mb-1">
                Accommodations
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-text-dark">
                Explore All Residences
              </h3>
            </div>
            <Link
              to="/rooms"
              className="btn-outline-luxury px-5 py-2.5 rounded-full inline-flex items-center gap-2 group text-xs uppercase tracking-wider font-semibold"
            >
              <span>View Full Suite Catalog</span>
              <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.slice(0, 4).map((room) => (
              <RoomCard key={room._id} room={room} onBookNow={handleBookNow} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================== 6. CURATED WINTER EXPERIENCES ======================== */}
      <Experiences />

      {/* ======================== 7. AMENITIES GRID ======================== */}
      <AmenitiesGrid />

      {/* ======================== 8. BENTO GALLERY ======================== */}
      <section id="gallery" className="py-28 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-18">
            <span className="inline-block px-3.5 py-1 rounded-full bg-cream text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
              Windows to the Himalayas
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl text-text-dark font-semibold mb-4 tracking-tight">
              Moments from the Retreat
            </h2>
            <p className="text-text-light text-base sm:text-lg font-light leading-relaxed">
              Snow-capped peaks, pine forest trails, cozy suites, and starlit evening bonfires.
            </p>
          </div>

          {/* Bento Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[250px]">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className={`group relative rounded-3xl overflow-hidden shadow-md border border-gray-100 ${item.span} cursor-pointer`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] text-secondary tracking-widest uppercase font-semibold block mb-1">
                    {item.caption}
                  </span>
                  <h3 className="font-heading text-lg sm:text-2xl font-semibold leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== 9. REVIEWS SECTION ======================== */}
      <section id="reviews" className="py-28 px-4 bg-cream relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-18">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
              Guest Testimonials
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl text-text-dark font-semibold mb-4 tracking-tight">
              Loved by Travellers
            </h2>
            <p className="text-text-light text-base sm:text-lg font-light leading-relaxed">
              Read stories from travelers who made The Kasar Himalayan Heights their mountain home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ======================== 10. DIRECT RESERVATION SECTION ======================== */}
      <section id="book" className="py-28 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Info Column (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <span className="inline-block px-3.5 py-1 rounded-full bg-cream text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
                Direct Reservation
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl text-text-dark font-semibold mb-5 leading-tight tracking-tight">
                Reserve Your Mountain Sanctuary
              </h2>
              <p className="text-text-light text-base sm:text-lg leading-relaxed mb-8 font-light">
                Enjoy guaranteed best rates, complimentary mountain breakfast, and flexible cancellations when you reserve direct with us.
              </p>

              {/* Direct Booking Perks */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircleIcon className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-dark">Best Rate Guarantee</h3>
                    <p className="text-xs text-text-light">Guaranteed lowest pricing compared to any online travel portal.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircleIcon className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-dark">Complimentary Kumaoni Breakfast</h3>
                    <p className="text-xs text-text-light">Fresh seasonal ingredients, hot pancakes, farm eggs, and mountain teas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircleIcon className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-dark">Free Cancellation</h3>
                    <p className="text-xs text-text-light">100% refund on cancellations made up to 48 hours before check-in.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-forest/10 text-forest flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircleIcon className="w-4 h-4 text-forest" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-dark">Welcome Mountain Herbal Tea</h3>
                    <p className="text-xs text-text-light">Freshly brewed rhododendron and wild mint tea upon your arrival.</p>
                  </div>
                </div>
              </div>

              {/* Help & Direct Assistance */}
              <div className="glass-surface p-6 rounded-3xl border border-secondary/25 text-xs text-text-dark/85">
                <p className="font-semibold mb-1 text-primary text-sm">Need assistance planning your arrival?</p>
                <p className="text-text-light mb-3 leading-relaxed">Our concierge can organize snow chain vehicles, private pick-ups from Kathgodam, and custom requests.</p>
                <a
                  href="https://wa.me/919690621247"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-forest font-semibold hover:underline"
                >
                  <span>💬</span> Chat with Concierge on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Booking Form Column (7 cols) with 3D Glass Depth */}
            <div className="lg:col-span-7 glass-surface p-6 sm:p-10 rounded-3xl border border-gray-200/90 shadow-2xl shadow-black/5">
              <h3 className="font-heading text-2xl text-text-dark font-semibold mb-6 pb-4 border-b border-gray-100">
                Check Dates & Availability
              </h3>
              <BookingForm preSelectedRoom={selectedRoomId} />
            </div>

          </div>
        </div>
      </section>

      {/* ======================== 11. CONTACT & LOCATION SECTION ======================== */}
      <section id="contact" className="py-28 px-4 bg-gradient-to-b from-[#FAF8F5] via-[#F5F1EB] to-[#ECE6DD] relative overflow-hidden border-t border-secondary/20">
        {/* Soft Ambient Mountain Glow (Warm Golden Stone, Zero Green) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-secondary/15 via-secondary/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
              <SparklesIcon className="w-3.5 h-3.5 text-secondary" />
              <span>Mountain Coordinates & Arrival</span>
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-semibold mb-4 tracking-tight text-text-dark">
              Come, Stay a While
            </h2>
            <p className="text-text-light text-base sm:text-lg leading-relaxed font-light">
              Tucked into the fragrant deodar pine ridges of Kasar Devi at 7,500 ft elevation. Whether you require Kathgodam station transfers, snow-chain 4×4 escorts, or bespoke fireside arrangements, our concierge is at your service 24/7.
            </p>

            {/* Refined Luxury Concierge Action Pills with Proper Hover Response */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
              <a
                href="https://wa.me/919690621247"
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-primary-luxury px-6 py-3.5 rounded-full border border-secondary/40 text-xs uppercase tracking-wider inline-flex items-center gap-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-emerald-300 animate-pulse"></span>
                <MessageIcon className="w-4 h-4 text-secondary group-hover:text-white transition-colors" />
                <span>WhatsApp Concierge (+91 96906 21247)</span>
              </a>

              <a
                href="tel:+919690621247"
                className="group btn-outline-luxury px-6 py-3.5 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-2.5"
              >
                <PhoneIcon className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                <span>Call Front Desk</span>
              </a>

              <a
                href="https://maps.google.com/?q=Kasar Devi,Uttarakhand"
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-outline-luxury px-6 py-3.5 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-2.5"
              >
                <MapPinIcon className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
                <span>Get Driving Directions</span>
              </a>
            </div>
          </div>

          {/* Calm, Stable Luxury Connectivity Cards (No wobbling, with smooth golden accent reveal) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Elevation & Setting */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm hover:border-secondary/60 hover:shadow-[0_12px_36px_rgba(212,163,89,0.14)] transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
              {/* Subtle top golden accent line that expands on hover */}
              <div className="h-1 bg-gradient-to-r from-transparent via-secondary to-transparent w-0 group-hover:w-full transition-all duration-500 mx-auto" />
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-secondary transition-all duration-300 shadow-xs">
                    <MountainIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-secondary bg-cream px-2.5 py-1 rounded-full border border-secondary/20">
                    180° Vista
                  </span>
                </div>
                
                <span className="text-secondary text-xs uppercase tracking-wider font-semibold block mb-1">
                  Elevation & Setting
                </span>
                <h3 className="font-heading text-xl font-semibold text-text-dark mb-2 group-hover:text-primary transition-colors">
                  7,500 FT Altitude
                </h3>
                <p className="text-text-light text-sm leading-relaxed font-light">
                  Perched atop Kasar Devi, overlooking unbroken 180° panoramic vistas of the Trishul, Nanda Devi, and Panchachuli peaks.
                </p>
              </div>

              <div className="px-8 py-4 border-t border-gray-100 bg-[#FAF8F5]/60 text-xs text-text-dark/80 font-medium flex items-center justify-between">
                <span>📍 Kasar Devi, Almora</span>
                <span className="text-secondary font-semibold">2,286m AMSL</span>
              </div>
            </div>

            {/* Card 2: Nearby Transit & Access */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm hover:border-secondary/60 hover:shadow-[0_12px_36px_rgba(212,163,89,0.14)] transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
              {/* Subtle top golden accent line that expands on hover */}
              <div className="h-1 bg-gradient-to-r from-transparent via-secondary to-transparent w-0 group-hover:w-full transition-all duration-500 mx-auto" />

              <div className="p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-secondary transition-all duration-300 shadow-xs">
                    <CompassIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-secondary bg-cream px-2.5 py-1 rounded-full border border-secondary/20">
                    Scenic Route
                  </span>
                </div>

                <span className="text-secondary text-xs uppercase tracking-wider font-semibold block mb-1">
                  Nearby Transit & Access
                </span>
                <h3 className="font-heading text-xl font-semibold text-text-dark mb-2 group-hover:text-primary transition-colors">
                  Effortless Arrival
                </h3>
                <div className="text-text-light text-sm leading-relaxed font-light space-y-1.5">
                  <p className="flex items-center justify-between">
                    <span>• Kathgodam Railway (KGM)</span>
                    <span className="text-xs text-text-dark/70 font-medium">65 km (2.5 hrs)</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>• Pantnagar Airport (PGH)</span>
                    <span className="text-xs text-text-dark/70 font-medium">95 km (3.5 hrs)</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>• Nainital Hill Town</span>
                    <span className="text-xs text-text-dark/70 font-medium">45 km (1.5 hrs)</span>
                  </p>
                </div>
              </div>

              <div className="px-8 py-4 border-t border-gray-100 bg-[#FAF8F5]/60 text-xs text-text-dark/80 font-medium flex items-center justify-between">
                <span>🚗 Private 4×4 Chauffeur</span>
                <span className="text-forest font-semibold">Available 24/7</span>
              </div>
            </div>

            {/* Card 3: Check-In & Mountain Service */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm hover:border-secondary/60 hover:shadow-[0_12px_36px_rgba(212,163,89,0.14)] transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
              {/* Subtle top golden accent line that expands on hover */}
              <div className="h-1 bg-gradient-to-r from-transparent via-secondary to-transparent w-0 group-hover:w-full transition-all duration-500 mx-auto" />

              <div className="p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-secondary transition-all duration-300 shadow-xs">
                    <ShieldCheckIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-secondary bg-cream px-2.5 py-1 rounded-full border border-secondary/20">
                    Bespoke Care
                  </span>
                </div>

                <span className="text-secondary text-xs uppercase tracking-wider font-semibold block mb-1">
                  Check-In & Mountain Service
                </span>
                <h3 className="font-heading text-xl font-semibold text-text-dark mb-2 group-hover:text-primary transition-colors">
                  24/7 Dedicated Host
                </h3>
                <div className="text-text-light text-sm leading-relaxed font-light space-y-1.5">
                  <p className="flex items-center justify-between">
                    <span>• Check-In: 1:00 PM</span>
                    <span className="text-xs text-text-dark/70 font-medium">Herbal Tea Welcome</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>• Check-Out: 11:00 AM</span>
                    <span className="text-xs text-text-dark/70 font-medium">Late upon request</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>• Snow Assistance</span>
                    <span className="text-xs text-text-dark/70 font-medium">Porter & Luggage</span>
                  </p>
                </div>
              </div>

              <div className="px-8 py-4 border-t border-gray-100 bg-[#FAF8F5]/60 text-xs text-text-dark/80 font-medium flex items-center justify-between">
                <span>🕒 Front Desk Concierge</span>
                <span className="text-secondary font-semibold">Round-the-Clock</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================== 12. QUICK VIEW MODAL ======================== */}
      <RoomModal
        room={modalRoom}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookNow={handleBookNow}
      />
    </>
  );
};

export default Home;
