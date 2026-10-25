import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GuestStoriesCarousel from '../components/GuestStoriesCarousel';
import {
  useSiteSettings,
  apiClient,
  subscribeToUpdates,
  SITE_CONFIG,
  trishulPeaksImg,
  chaletFamilyLiving,
  chaletSuiteImg,
  chaletFamilyBedroom,
  hotelInSnow,
  atticSuiteImg,
  suiteNandaDeviBalcony,
  suiteNandaDeviBalcony2,
  sunriseMeditationDeck,
  kasarTempleTrail,
  kasarTempleImg,
  diningSatvikThali,
  diningHearthCafe,
} from '@shared';

// Google Maps Listing URL provided by user
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/place/The+Kasar+Himalyan+Heights+(Satya%E2%80%99s)/@29.6414511,79.6604264,18.2z/data=!4m10!3m9!1s0x39a0b759f096cefd:0xfd1e3780fb315c22!5m3!1s2027-01-11!4m1!1i2!8m2!3d29.641388!4d79.6635582!16s%2Fg%2F11h0ykmn2s';

// Gallery Categories for Interactive Filter Tabs
const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Moments' },
  { id: 'people', label: 'Guests & Moments' },
  { id: 'peaks', label: 'Mountains & Peaks' },
  { id: 'pines', label: 'Kasar Pine Trails' },
  { id: 'retreat', label: 'The Mountain Chalet' },
];

// Curated Authentic Real Photographs from Google Maps, Property Life & Instagram
const GALLERY_ITEMS = [
  {
    id: 'guest-balcony-tea',
    src: suiteNandaDeviBalcony,
    category: 'people',
    badge: 'Guest Morning Moment',
    title: 'Morning Tea Facing Mount Nanda Devi',
    location: "Private Suite Balcony • Crank's Ridge",
    caption: 'Unrushed mornings wrapped in a warm shawl, sipping freshly brewed pahadi ginger tea while the first golden sunlight touches the Nanda Devi peak.',

  },
  {
    id: 'night-lights-deck',
    src: '/images/gallery/night_terrace_lights.jpg',
    category: 'retreat',
    badge: 'Evening Ambiance',
    title: 'Warm Fairy Lights on Mountain Terrace',
    location: 'Resort Terrace & Multi-tier Chalet',
    caption: 'As evening falls over Almora valley, warm fairy lights illuminate the hand-cut stone chalets under a crystal-clear Himalayan sky.',

  },
  {
    id: 'trishul-snow-peaks',
    src: trishulPeaksImg,
    category: 'peaks',
    badge: '180° Himalayan Vista',
    title: 'Mount Trishul (7,120m) & Sacred Peaks',
    location: "Kasar Devi Viewpoint • Crank's Ridge",
    caption: 'An unobstructed 180-degree panorama of the Great Himalayan range—Mount Trishul, Nanda Devi, and Maiktoli standing sentinel above the clouds.',

  },
  {
    id: 'exterior-pines-woods',
    src: '/images/gallery/exterior_pines_view.jpg',
    category: 'pines',
    badge: "Crank's Ridge Pines",
    title: 'Stone Chalets Nestled in Ancient Pines',
    location: 'Deodar Forest Trail, Kasar Devi',
    caption: 'The multi-tiered stone and cedar chalets gracefully hug the hill slopes, submerged in sweet-scented pine air and morning birdsong.',

  },
  {
    id: 'stone-courtyard-terrace',
    src: '/images/gallery/stone_courtyard_terrace.jpg',
    category: 'retreat',
    badge: 'Courtyard Lounge',
    title: 'Slate Stone Courtyard & Outdoor Sit-Out',
    location: 'Property Ground Walkway',
    caption: 'Handcrafted wicker chairs, natural Himalayan slate paving, flowering wall vines, and quiet spots for evening conversations.',

  },
  {
    id: 'suite-window-peaks',
    src: '/images/gallery/suite_snow_peaks_view.jpg',
    category: 'retreat',
    badge: 'Heated Suite Window',
    title: 'Waking Up to Snow Peaks from Bed',
    location: 'Nanda Devi Snow View Suite',
    caption: 'Large picture windows frame the snow-clad peaks directly from your heated bed, complete with electric bed warmers and solid pine wood finishes.',

  },
  {
    id: 'winter-wonderland',
    src: hotelInSnow,
    category: 'peaks',
    badge: 'Winter Snowfall',
    title: 'Winter Snowfall at Crank’s Ridge',
    location: 'The Kasar Himalayan Heights in Snow',
    caption: 'When winter descends upon Kasar Devi, the resort transforms into a serene white wonderland with snow-laden deodar branches.',

  },
  {
    id: 'sunrise-meditation-deck',
    src: sunriseMeditationDeck,
    category: 'people',
    badge: 'Geomagnetic Stillness',
    title: 'Sunrise Meditation & Yoga Deck',
    location: 'Open Mountain Yoga Deck',
    caption: 'Guests beginning the day with quiet meditation on Kasar Devi’s world-renowned geomagnetic energy ridge, bringing profound calm to the mind.',

  },
  {
    id: 'ancient-pine-trail',
    src: kasarTempleTrail,
    category: 'pines',
    badge: 'Forest Trail',
    title: 'Pine Needle Forest Trail to Kasar Devi',
    location: 'Historic Crank’s Ridge Path',
    caption: 'The fragrant pine needle trail leading from the retreat through deodar groves to the 2nd-century temple and Swami Vivekananda’s cave.',

  },
  {
    id: 'kasar-devi-mandir',
    src: kasarTempleImg,
    category: 'pines',
    badge: 'Sacred Heritage',
    title: 'Historic 2nd-Century Kasar Devi Temple',
    location: 'Kalimath / Kasar Devi Ridge',
    caption: 'A 10-minute walk brings you to this ancient hill shrine, home to deep spiritual vibrations that drew Swami Vivekananda and global artists.',

  },
  {
    id: 'dining-satvik-thali',
    src: diningSatvikThali,
    category: 'people',
    badge: 'Pahadi Hearth Table',
    title: 'Fresh Traditional Kumaoni Thali',
    location: "Satya's Mountain Dining",
    caption: 'Savoring home-cooked regional dishes prepared with local mountain herbs, bhatt ki dal, madua rotis, and pure mountain ghee.',

  },
  {
    id: 'quiet-balcony-reading',
    src: suiteNandaDeviBalcony2,
    category: 'people',
    badge: 'Pahadi Solitude',
    title: 'Quiet Hours on Private Balcony',
    location: 'Mountain View Balcony',
    caption: 'Leave time for a good book, sunlit afternoons, and the soothing whisper of wind through the Himalayan pine needles.',

  },
  {
    id: 'day-exterior-chalets',
    src: '/images/gallery/day_exterior_chalets.jpg',
    category: 'retreat',
    badge: 'Mountain Architecture',
    title: 'Daylight Perspective of the Stone Retreat',
    location: "Crank's Ridge, Kasar Devi",
    caption: 'Traditional Pahadi stone masonry and wood architecture designed to blend seamlessly into the mountain landscape.',

  },
  {
    id: 'dining-hearth-cafe',
    src: diningHearthCafe,
    category: 'retreat',
    badge: "Satya's Cafe",
    title: "Satya's Hearth & Rooftop Cafe",
    location: "Satya's Roof Top Cafe",
    caption: 'A cozy sanctuary for travelers to gather around warm beverages, share stories, and take in the panoramic Himalayan views.',

  },
];


// Latest high-res images downloaded directly from Google Maps listing
const HERO_SLIDES = [
  {
    image: '/images/maps/night_exterior_lights.jpg',
    tag: 'Latest on Google Maps • Night Ambiance',
    title: 'The Kasar Himalayan Heights',
    caption: 'Warm fairy lights illuminating the stone chalet architecture and mountain deck at dusk',
    isVideo: false,
  },
  {
    image: '/images/maps/day_exterior_pines.jpg',
    tag: 'Latest on Google Maps • Ridge View',
    title: 'Pine Forest Sanctuary at 6,942 FT',
    caption: 'Charming stone and pine chalets nested peacefully in Kasar Devi’s deodar forest',
    isVideo: false,
  },
  {
    image: '/images/maps/room_snow_peaks.jpg',
    tag: 'Latest on Google Maps • Snow Peak Views',
    title: 'Wake Up to Mount Trishul & Nanda Devi',
    caption: 'Direct 180° Himalayan peak views from your heated suite picture window and balcony',
    isVideo: false,
  },
  {
    image: '/images/maps/video_reel_preview.jpg',
    videoSrc: '/videos/mountain_retreat.mp4',
    tag: 'Resort Video Tour • Crank’s Ridge',
    title: 'Atmospheric Mountain Chalet Video',
    caption: 'Experience the serene stillness, healing pine air, and gentle mountain rhythms',
    isVideo: true,
  },
  {
    image: hotelInSnow,
    tag: 'Winter Snowfall',
    title: 'Winter Wonderland at Crank’s Ridge',
    caption: 'Snow blanketed pines, warm room heaters, electric bed warmers, and cozy fireplaces',
    isVideo: false,
  },
  {
    image: trishulPeaksImg,
    tag: 'Sacred Alpenglow',
    title: '180° Sacred Peak Panorama',
    caption: 'Golden morning light illuminating the Great Himalayan crest from the private terrace',
    isVideo: false,
  },
];

export default function HotelHome() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const company = settings?.company;
  const whatsappNumber = company?.whatsappNumber || SITE_CONFIG.whatsappNumber;
  const conciergePhone = company?.conciergePhone || SITE_CONFIG.conciergePhone;
  const email = company?.email || SITE_CONFIG.email;

  // Background carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const slideTimerRef = useRef(null);

  // The API returns only admin-published hotel reviews.
  const [publishedReviews, setPublishedReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsLoadError, setReviewsLoadError] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchPublishedReviews = async () => {
      try {
        const response = await apiClient.get('/hotel/reviews');
        if (!isActive) return;
        const reviews = Array.isArray(response.data) ? response.data : [];
        setPublishedReviews(reviews.filter((review) => Number(review.rating) >= 3));
        setReviewsLoadError(false);
      } catch {
        if (isActive) setReviewsLoadError(true);
      } finally {
        if (isActive) setReviewsLoading(false);
      }
    };

    void fetchPublishedReviews();
    const unsubscribe = subscribeToUpdates('reviews', fetchPublishedReviews, 60 * 1000);

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, []);

  // Hash anchor scrolling listener (e.g. for #story, #rooms, #experiences)
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
  }, []);

  // Video Reel Modal state
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (isCarouselHovered || videoModalOpen) return;
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(slideTimerRef.current);
  }, [isCarouselHovered, videoModalOpen]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  // Booking Form State
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [roomPreference, setRoomPreference] = useState('No preference');
  const [guestMessage, setGuestMessage] = useState('');

  // Confirmation state
  const [enquirySummary, setEnquirySummary] = useState('');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy enquiry');

  // Gallery interactive states
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Filtered gallery items based on active tab
  const filteredGallery = activeGalleryTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeGalleryTab);

  // Keyboard navigation for gallery lightbox (Escape, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredGallery.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < filteredGallery.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredGallery.length]);

  // Today's date ISO
  const now = new Date();
  const minDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  const getDepartureMin = () => {
    if (!arrivalDate) return minDate;
    const date = new Date(arrivalDate + 'T12:00:00');
    date.setDate(date.getDate() + 1);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  };

  const handleArrivalChange = (val) => {
    setArrivalDate(val);
    if (departureDate && departureDate <= val) {
      setDepartureDate('');
    }
  };

  const handleQuickBookingSubmit = (e) => {
    e.preventDefault();
    const bookingSec = document.getElementById('booking');
    if (bookingSec) {
      bookingSec.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      const nameInput = document.getElementById('guest-name');
      if (nameInput) nameInput.focus();
    }, 500);
  };

  const handleSelectRoom = (roomName) => {
    setRoomPreference(roomName);
    const bookingSec = document.getElementById('booking');
    if (bookingSec) {
      bookingSec.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      const nameInput = document.getElementById('guest-name');
      if (nameInput) nameInput.focus();
    }, 500);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (departureDate && arrivalDate && departureDate <= arrivalDate) {
      alert('Check-out date must be after check-in date.');
      return;
    }

    const summary = [
      'Stay enquiry for The Kasar Himalayan Heights (Satya’s)',
      '',
      `Name: ${guestName || ''}`,
      `Reply to: ${guestContact || ''}`,
      `Check-in: ${arrivalDate || 'Not specified'}`,
      `Check-out: ${departureDate || 'Not specified'}`,
      `Guests: ${guests || '2'}`,
      `Room preference: ${roomPreference || 'No preference'}`,
      `Notes: ${guestMessage || 'None'}`,
    ].join('\n');

    setEnquirySummary(summary);
    setIsConfirmationVisible(true);
    setCopyStatus('');
    setCopyButtonText('Copy enquiry');
  };

  const handleCopyEnquiry = async () => {
    try {
      await navigator.clipboard.writeText(enquirySummary);
      setCopyStatus('Enquiry copied to clipboard.');
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy enquiry'), 3000);
    } catch {
      setCopyStatus('Please select and copy the enquiry text above.');
    }
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(enquirySummary);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-[#F8FAF7] text-[#073125] font-sans selection:bg-[#C9F24D]/40 selection:text-[#073125]">
      {/* 1. HERO SECTION WITH GOOGLE MAPS BACKGROUND CAROUSEL & VIDEO */}
      <section
        className="relative min-h-[640px] sm:min-h-[760px] h-[min(88vh,920px)] flex items-center overflow-hidden text-white bg-[#052219] select-none"
        id="top"
        aria-labelledby="hero-title"
        onMouseEnter={() => setIsCarouselHovered(true)}
        onMouseLeave={() => setIsCarouselHovered(false)}
      >
        {/* Carousel Slides */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
          >
            {slide.isVideo ? (
              <video
                src={slide.videoSrc}
                poster={slide.image}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                className="w-full h-full object-cover object-[center_50%] scale-100 transition-transform duration-10000 ease-out"
                src={slide.image}
                alt={slide.title}
              />
            )}
          </div>
        ))}

        {/* Shading overlay inspired by kumaoncollective.com */}
        <div
          className="absolute inset-0 w-full h-full z-15 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(7,49,37,0.88) 0%, rgba(11,43,33,0.76) 45%, rgba(11,43,33,0.35) 100%), linear-gradient(0deg, rgba(5,34,25,0.7) 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />

        {/* Hero Content */}
        <div className="relative z-20 w-[min(1240px,calc(100%-36px))] mx-auto py-16 sm:py-20 pb-28">


          <h1
            id="hero-title"
            className="max-w-[850px] my-3 sm:my-5 font-serif font-normal text-white text-[clamp(2.75rem,6.8vw,5.8rem)] leading-[1.02] tracking-tight drop-shadow-md text-balance"
          >
            A little closer
            <br />
            to stillness.
          </h1>

          <p className="max-w-[590px] m-0 text-white/95 text-[clamp(0.95rem,1.35vw,1.15rem)] leading-[1.75] font-sans font-light drop-shadow">
            A softer rhythm for your time in the Himalayas—made for rest, reflection, and the moments that bring you back to yourself. Heated pine suites facing Mount Trishul &amp; Nanda Devi.
          </p>

          <div className="flex items-center flex-wrap gap-3 sm:gap-4 mt-7 sm:mt-8">
            <a
              href="#rooms"
              className="btn-concept-saffron"
            >
              <span>Explore the stay</span>
              <span aria-hidden="true">&nbsp;↓</span>
            </a>

            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="btn-concept-secondary flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#C9F24D]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Watch Video Reel</span>
            </button>

            <a
              href="#booking"
              className="px-6 py-3.5 rounded-full border border-white/25 text-white/90 hover:text-white hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-all"
            >
              Request a stay ↗
            </a>
          </div>

          {/* Carousel Slide Tag & Live Badge */}
          <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#C9F24D] font-sans">
            <span className="px-3 py-1 bg-[#073125]/90 border border-[#C9F24D]/40 rounded-full backdrop-blur-sm shadow-xs font-semibold">
              {HERO_SLIDES[currentSlide].tag}
            </span>
            <span className="text-white/80 hidden md:inline text-[0.82rem]">
              {HERO_SLIDES[currentSlide].caption}
            </span>
          </div>
        </div>

        {/* Carousel Prev / Next Controls (Mobile-Friendly) */}
        <div className="absolute right-4 sm:right-10 bottom-6 sm:bottom-10 z-25 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            className="w-11 h-11 rounded-full bg-black/40 hover:bg-[#C9F24D] text-white hover:text-[#073125] border border-white/20 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md shadow-md active:scale-95"
          >
            &larr;
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 px-1.5">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${idx === currentSlide
                  ? 'w-7 h-2 bg-[#C9F24D]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                  }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextSlide}
            aria-label="Next slide"
            className="w-11 h-11 rounded-full bg-black/40 hover:bg-[#C9F24D] text-white hover:text-[#073125] border border-white/20 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md shadow-md active:scale-95"
          >
            &rarr;
          </button>
        </div>
      </section>

      {/* 2. QUICK BOOKING BAR (Floating overlap with Mobile Responsive Stacking) */}
      <div className="relative z-30 w-[min(1120px,calc(100%-32px))] mx-auto -mt-10 sm:-mt-12">
        <form
          className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end gap-4 bg-[#E2E6E8] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(7,49,37,0.14)] border border-[#CBD2D7]"
          id="quick-booking"
          aria-label="Start a stay enquiry"
          onSubmit={handleQuickBookingSubmit}
        >
          <div className="grid gap-1.5">
            <label
              htmlFor="quick-arrival"
              className="text-[#3B524A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
            >
              Arrive
            </label>
            <input
              type="date"
              id="quick-arrival"
              name="arrival"
              min={minDate}
              value={arrivalDate}
              onChange={(e) => handleArrivalChange(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-[#073125] bg-white border border-[#CBD5E1] rounded-xl text-sm focus:outline-none focus:border-[#073125] shadow-xs font-sans"
            />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="quick-departure"
              className="text-[#3B524A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
            >
              Depart
            </label>
            <input
              type="date"
              id="quick-departure"
              name="departure"
              min={getDepartureMin()}
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-[#073125] bg-white border border-[#CBD5E1] rounded-xl text-sm focus:outline-none focus:border-[#073125] shadow-xs font-sans"
            />
          </div>

          <div className="grid gap-1.5">
            <label
              htmlFor="quick-guests"
              className="text-[#3B524A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
            >
              Guests
            </label>
            <select
              id="quick-guests"
              name="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full min-h-[48px] px-3.5 py-2.5 text-[#073125] bg-white border border-[#CBD5E1] rounded-xl text-sm focus:outline-none focus:border-[#073125] shadow-xs font-sans"
            >
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
              <option value="5+">5+ guests</option>
            </select>
          </div>

          <button
            className="btn-concept-saffron w-full justify-center text-center shadow-md active:scale-95"
            type="submit"
          >
            <span>Check availability</span>
            <span aria-hidden="true">&nbsp;→</span>
          </button>
        </form>

        <p className="mt-3 text-[#4A635A] text-[0.74rem] text-center sm:text-left px-2 font-sans">
          Choose your dates and we’ll prepare a direct enquiry. Instant confirmation by our team in Almora.
        </p>
      </div>

      {/* 3. VALUES RIBBON */}
      <div
        className="w-[min(1240px,calc(100%-36px))] mx-auto my-14 sm:my-20 grid grid-cols-1 md:grid-cols-3 border-y border-[#D5E0D8]"
        aria-label="Stay values"
      >
        <div className="min-h-[82px] p-4 sm:p-5 flex items-center justify-center gap-3 text-center border-b md:border-b-0 border-[#D5E0D8]">
          <svg className="w-6 h-6 text-[#541508] flex-none" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 21s-8-4.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.5-8 11-8 11Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M6 12h3l1.2-2.4 2.2 5 1.2-2.6H18" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="font-serif text-[1.2rem] text-[#073125]">Room to breathe</span>
        </div>

        <div className="min-h-[82px] p-4 sm:p-5 flex items-center justify-center gap-3 text-center border-b md:border-b-0 md:border-l border-[#D5E0D8]">
          <svg className="w-6 h-6 text-[#541508] flex-none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v18M4 8c2.5 2 5.2 2 8 0s5.5-2 8 0M4 16c2.5-2 5.2-2 8 0s5.5 2 8 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="font-serif text-[1.2rem] text-[#073125]">Rooted in Pahadi spirit</span>
        </div>

        <div className="min-h-[82px] p-4 sm:p-5 flex items-center justify-center gap-3 text-center md:border-l border-[#D5E0D8]">
          <svg className="w-6 h-6 text-[#541508] flex-none" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 14.6 9.4 21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="font-serif text-[1.2rem] text-[#073125]">Peace, faith &amp; renewal</span>
        </div>
      </div>

      {/* 4. OUR SPIRIT (STORY) SECTION WITH LATEST GOOGLE MAPS NIGHT EXTERIOR */}
      <section className="py-16 sm:py-24 relative" id="spirit">
        <span id="our-spirit" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
        <div className="w-[min(1120px,calc(100%-36px))] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20">
          <div className="relative min-h-[420px] sm:min-h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#073125]/10 group">
            <img
              src="/images/maps/night_exterior_lights.jpg"
              alt="The Kasar Himalayan Heights resort at night with warm lights"
              className="w-full h-[420px] sm:h-[540px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 border border-[#C9F24D]/40 text-[#C9F24D] rounded-full text-xs font-sans font-bold uppercase tracking-wider backdrop-blur-md">
              Google Maps Verified Photo
            </div>
            <div className="story-stamp shadow-2xl" aria-hidden="true">
              <span className="font-serif text-[1.2rem] sm:text-[1.3rem] leading-tight text-[#073125] font-semibold">
                Find your<br />own peace
              </span>
              <span className="text-[9px] uppercase tracking-[0.16em] font-sans font-bold text-[#073125]/75 mt-1 block">
                Kasar Devi • 6,942 FT
              </span>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            <span className="eyebrow">A stay with space for you</span>
            <h2 className="font-serif font-normal text-[clamp(2.3rem,4.5vw,4.2rem)] leading-[1.08] tracking-[-0.01em] text-[#073125]">
              Let the mountains set a gentler pace.
            </h2>
            <p className="text-[#4A635A] text-base leading-relaxed font-sans">
              Some journeys are for seeing more. Others are for arriving, exhaling, and noticing what matters. The Kasar Himalayan Heights (Satya’s) is a place to make room for that quieter kind of time.
            </p>
            <p className="text-[#4A635A] text-base leading-relaxed font-sans">
              Located on Crank’s Ridge at 6,942 FT elevation, our heated rooms, natural stone chalets, and home-cooked satvik food offer a warm sanctuary 10 minutes from ancient Kasar Devi Temple.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#booking"
                className="btn-concept-dark"
              >
                <span>Plan a stay</span>
                <span aria-hidden="true">&nbsp;→</span>
              </a>
              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="px-6 py-3.5 rounded-full border border-[#073125]/20 text-[#073125] hover:bg-[#073125]/5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>🎥 Watch Video Reel</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY STAY HERE SECTION */}
      <section className="py-16 sm:py-24 bg-[#F4F7F3]" id="why">
        <div className="w-[min(1120px,calc(100%-36px))] mx-auto">
          <div className="max-w-[720px] mb-10 sm:mb-14">
            <span className="eyebrow mb-2 sm:mb-3">Why stay here</span>
            <h2 className="font-serif font-normal text-[clamp(2.3rem,4.5vw,4.2rem)] leading-[1.08] tracking-[-0.01em] text-[#073125]">
              A meaningful pause, shaped by the hills.
            </h2>
            <p className="mt-2 text-[#4A635A] text-base font-sans">
              Choose a mountain stay that gives you permission to slow down, be present, and make the days your own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <article className="p-7 sm:p-9 bg-white rounded-2xl border border-[#D5E0D8] shadow-sm hover:shadow-md transition-shadow">
              <span className="w-10 h-10 rounded-full border border-[#541508]/30 text-[#541508] bg-[#541508]/5 font-serif text-[1rem] flex items-center justify-center font-bold">
                01
              </span>
              <h3 className="my-4 font-serif font-medium text-[1.45rem] leading-[1.2] text-[#073125]">
                Ease into the day
              </h3>
              <p className="m-0 text-[#4A635A] text-[0.92rem] leading-relaxed font-sans">
                Leave a little more room for rest, unhurried mornings, electric bed warmers, and the simple pleasure of snow peaks glowing at sunrise.
              </p>
            </article>

            <article className="p-7 sm:p-9 bg-white rounded-2xl border border-[#D5E0D8] shadow-sm hover:shadow-md transition-shadow">
              <span className="w-10 h-10 rounded-full border border-[#541508]/30 text-[#541508] bg-[#541508]/5 font-serif text-[1rem] flex items-center justify-center font-bold">
                02
              </span>
              <h3 className="my-4 font-serif font-medium text-[1.45rem] leading-[1.2] text-[#073125]">
                Feel the Pahadi spirit
              </h3>
              <p className="m-0 text-[#4A635A] text-[0.92rem] leading-relaxed font-sans">
                Taste fresh regional meals cooked with local mountain ingredients, warm ginger tea on the deck, and genuine Kumaoni care.
              </p>
            </article>

            <article className="p-7 sm:p-9 bg-white rounded-2xl border border-[#D5E0D8] shadow-sm hover:shadow-md transition-shadow">
              <span className="w-10 h-10 rounded-full border border-[#541508]/30 text-[#541508] bg-[#541508]/5 font-serif text-[1rem] flex items-center justify-center font-bold">
                03
              </span>
              <h3 className="my-4 font-serif font-medium text-[1.45rem] leading-[1.2] text-[#073125]">
                Reconnect in your own way
              </h3>
              <p className="m-0 text-[#4A635A] text-[0.92rem] leading-relaxed font-sans">
                Take the pine forest trail to Kasar Devi Temple or Kainchi Dham, or spend quiet hours on your balcony immersed in books and mountain air.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 6. THE ROOMS SECTION WITH GOOGLE MAPS REAL ROOM PHOTOS */}
      <section className="py-16 sm:py-24 bg-[#F8FAF7]" id="rooms">
        <div className="w-[min(1120px,calc(100%-36px))] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
            <div className="max-w-[720px]">
              <span className="eyebrow mb-2">The rooms</span>
              <h2 className="font-serif font-normal text-[clamp(2.3rem,4.5vw,4.2rem)] leading-[1.08] tracking-[-0.01em] text-[#073125]">
                Find your kind of stay.
              </h2>
              <p className="mt-2 text-[#4A635A] text-base font-sans">
                Every suite at The Kasar Himalayan Heights is crafted with natural wood, warm room heaters, and private views of the Great Himalayan range.
              </p>
            </div>
            <div className="max-w-md p-4 bg-[#F4F7F3] border-l-4 border-[#C9F24D] rounded-r-xl text-[#073125] text-[0.8rem] leading-[1.55] font-sans shadow-xs">
              <strong>All Suites Feature:</strong> Electric bed warmers, 24/7 hot geyser water, free high-speed Wi-Fi, mountain view balconies, and fresh home-style breakfast.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Room Card 01 with latest Google Maps room view */}
            <article className="bg-white rounded-2xl border border-[#D5E0D8] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-[250px] bg-[#DCE9E4] overflow-hidden">
                  <img
                    src="/images/maps/room_snow_peaks.jpg"
                    alt="Nanda Devi Snow View Suite"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#073125]/90 text-[#C9F24D] text-[0.62rem] font-bold tracking-wider uppercase font-sans rounded-full backdrop-blur-sm">
                    Google Maps Room Photo
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-[#541508] text-[0.65rem] font-bold tracking-[0.14em] uppercase font-sans">
                    Room option 01
                  </span>
                  <h3 className="my-2 font-serif font-medium text-[1.55rem] leading-[1.2] text-[#073125]">
                    Nanda Devi Snow View Suite
                  </h3>
                  <p className="m-0 text-[#4A635A] text-[0.88rem] min-h-[48px] leading-relaxed font-sans">
                    Heated bedroom with private balcony directly facing Mount Trishul and Nanda Devi peaks. Includes electric bed warmer and tea maker.
                  </p>
                  <div className="my-4 py-2 border-y border-[#D5E0D8] flex justify-between items-center text-xs text-[#4A635A] font-sans">
                    <span>Starting Rate</span>
                    <strong className="text-[#073125] text-sm font-bold">₹3,499 / night</strong>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <button
                  type="button"
                  onClick={() => navigate('/book?room=nanda-devi')}
                  className="w-full py-3 rounded-full bg-[#073125] hover:bg-[#052219] text-white text-[0.76rem] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer font-sans group"
                >
                  <svg viewBox="0 0 20 20" className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v3m8-3v3M3 8h14M5 4h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>Book</span>
                </button>
              </div>
            </article>

            {/* Room Card 02 */}
            <article className="bg-white rounded-2xl border border-[#D5E0D8] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-[250px] bg-[#DCE9E4] overflow-hidden">
                  <img
                    src={chaletFamilyLiving || chaletFamilyBedroom}
                    alt="Cedar Family Mountain Chalet"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#073125]/90 text-[#C9F24D] text-[0.62rem] font-bold tracking-wider uppercase font-sans rounded-full backdrop-blur-sm">
                    Family Chalet • Pine Wood
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-[#541508] text-[0.65rem] font-bold tracking-[0.14em] uppercase font-sans">
                    Room option 02
                  </span>
                  <h3 className="my-2 font-serif font-medium text-[1.55rem] leading-[1.2] text-[#073125]">
                    Cedar Family Mountain Chalet
                  </h3>
                  <p className="m-0 text-[#4A635A] text-[0.88rem] min-h-[48px] leading-relaxed font-sans">
                    Spacious multi-guest suite panelled in natural cedar wood with separate sitting lounge, heated blankets, and pine forest vistas.
                  </p>
                  <div className="my-4 py-2 border-y border-[#D5E0D8] flex justify-between items-center text-xs text-[#4A635A] font-sans">
                    <span>Starting Rate</span>
                    <strong className="text-[#073125] text-sm font-bold">₹4,999 / night</strong>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <button
                  type="button"
                  onClick={() => navigate('/book?room=cedar-chalet')}
                  className="w-full py-3 rounded-full bg-[#073125] hover:bg-[#052219] text-white text-[0.76rem] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer font-sans group"
                >
                  <svg viewBox="0 0 20 20" className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v3m8-3v3M3 8h14M5 4h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>Book</span>
                </button>
              </div>
            </article>

            {/* Room Card 03 */}
            <article className="bg-white rounded-2xl border border-[#D5E0D8] shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-[250px] bg-[#DCE9E4] overflow-hidden">
                  <img
                    src={atticSuiteImg || chaletSuiteImg}
                    alt="Crank's Ridge Attic Glass Suite"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-[#073125]/90 text-[#C9F24D] text-[0.62rem] font-bold tracking-wider uppercase font-sans rounded-full backdrop-blur-sm">
                    Attic Glass • Stargazing
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-[#541508] text-[0.65rem] font-bold tracking-[0.14em] uppercase font-sans">
                    Room option 03
                  </span>
                  <h3 className="my-2 font-serif font-medium text-[1.55rem] leading-[1.2] text-[#073125]">
                    Crank&apos;s Ridge Attic Suite
                  </h3>
                  <p className="m-0 text-[#4A635A] text-[0.88rem] min-h-[48px] leading-relaxed font-sans">
                    Romantic upper-floor wooden attic with sloping cedar gables, cozy bedside heaters, reading desk, and ridge panorama.
                  </p>
                  <div className="my-4 py-2 border-y border-[#D5E0D8] flex justify-between items-center text-xs text-[#4A635A] font-sans">
                    <span>Starting Rate</span>
                    <strong className="text-[#073125] text-sm font-bold">₹3,999 / night</strong>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-0">
                <button
                  type="button"
                  onClick={() => navigate('/book?room=attic-suite')}
                  className="w-full py-3 rounded-full bg-[#073125] hover:bg-[#052219] text-white text-[0.76rem] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer font-sans group"
                >
                  <svg viewBox="0 0 20 20" className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v3m8-3v3M3 8h14M5 4h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>Book</span>
                </button>
              </div>
            </article>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EAA722] hover:bg-[#D98E16] text-[#073125] text-[0.76rem] font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 font-sans"
            >
              <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2v3m8-3v3M3 8h14M5 4h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>Book a Room — Best Rates Direct</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. PUBLISHED GUEST REVIEWS ("Let the place tell its story") */}
      <section className="relative overflow-hidden py-16 sm:py-24 text-white bg-[#073125]" id="story">
        <span id="experiences" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
        <span id="guest-stories" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
        <div
          className="absolute -right-24 -top-36 w-[460px] h-[460px] rounded-full border border-white/10 pointer-events-none"
          style={{
            boxShadow:
              '0 0 0 48px rgba(255,255,255,0.025), 0 0 0 96px rgba(255,255,255,0.015), 0 0 0 144px rgba(255,255,255,0.01)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-[min(1120px,calc(100%-36px))] mx-auto">
          <div className="mb-9 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[720px]">
              <span className="eyebrow text-[#C9F24D] before:bg-[#C9F24D] mb-3">
                Published guest stories
              </span>
              <h2 className="font-serif font-normal text-[clamp(2.3rem,4.5vw,4.2rem)] leading-[1.08] tracking-[-0.01em] text-white">
                Let the place tell its story.
              </h2>
              <p className="mt-3 text-white/80 text-base font-sans">
                Real words from guests who found their own quiet corner in Kasar Devi. Every story here has been approved by our team.
              </p>
            </div>
            <Link
              to="/reviews"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/25 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white no-underline transition hover:border-[#C9F24D]/70 hover:bg-white/5 sm:self-auto"
            >
              All guest reviews <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <GuestStoriesCarousel
            reviews={publishedReviews}
            theme="dark"
            loading={reviewsLoading}
            error={reviewsLoadError}
          />
        </div>
      </section>


      {/* 8. GALLERY SECTION WITH AUTHENTIC RESORT PHOTOGRAPHY & MOMENTS */}
      <section className="py-20 sm:py-28 bg-[#F8FAF7]" id="gallery">
        <div className="w-[min(1240px,calc(100%-36px))] mx-auto">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14">
            <div className="max-w-[760px]">
              <span className="eyebrow mb-2.5">A glimpse of the feeling</span>
              <h2 className="font-serif font-normal text-[clamp(2.3rem,4.5vw,4.2rem)] leading-[1.08] tracking-[-0.01em] text-[#073125]">
                Bring the mountains a little closer.
              </h2>
              <p className="mt-3 text-[#4A635A] text-base sm:text-lg font-sans leading-relaxed">
                Authentic moments captured at The Kasar Himalayan Heights, Crank’s Ridge pine forests, and the sacred peaks of Nanda Devi &amp; Mount Trishul.
              </p>
            </div>

            {/* Verified real photos badge */}
            <div className="flex items-center gap-2.5 px-4 py-2 bg-[#EDF2EC] border border-[#073125]/15 rounded-full text-xs text-[#073125] font-sans font-medium self-start lg:self-end shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#073125]" />
              <span>100% Real Property &amp; Himalayan Photography</span>
            </div>
          </div>

          {/* Filter Category Pills */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10 pb-2">
            {GALLERY_CATEGORIES.map((cat) => {
              const count = cat.id === 'all'
                ? GALLERY_ITEMS.length
                : GALLERY_ITEMS.filter((i) => i.category === cat.id).length;
              const isActive = activeGalleryTab === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveGalleryTab(cat.id);
                    setLightboxIndex(null);
                  }}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${isActive
                    ? 'bg-[#073125] text-[#C9F24D] shadow-md scale-102 ring-2 ring-[#073125]/20'
                    : 'bg-white text-[#4A635A] hover:text-[#073125] hover:bg-white/80 border border-[#D5E0D8]'
                    }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-[#C9F24D]/25 text-[#C9F24D]' : 'bg-[#EDF2EC] text-[#4A635A]'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredGallery.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative rounded-2xl overflow-hidden bg-[#EDF2EC] border border-[#073125]/10 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col min-h-[360px] sm:min-h-[400px]"
              >
                {/* Image Container with Hover Zoom */}
                <div className="relative w-full h-[260px] sm:h-[280px] overflow-hidden bg-[#DCE9E4]">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  {/* Subtle Top & Bottom Gradients */}
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#073125]/90 to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#073125]/90 text-[#C9F24D] text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-xs">
                      {item.badge}
                    </span>
                  </div>

                  {/* Expand Icon Button */}
                  <div className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-black/40 group-hover:bg-[#C9F24D] text-white group-hover:text-[#073125] flex items-center justify-center transition-all duration-300 backdrop-blur-md">
                    <span className="text-sm font-bold">⤢</span>
                  </div>

                  {/* Location Pin Tag on Bottom of Image */}
                  <div className="absolute bottom-3 left-3.5 z-10 flex items-center gap-1.5 text-white/95 text-[11px] font-sans drop-shadow-md">
                    <span className="text-[#C9F24D]">📍</span>
                    <span className="font-medium tracking-wide">{item.location}</span>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-5 sm:p-6 bg-white flex-1 flex flex-col justify-between border-t border-[#073125]/5">
                  <div>
                    <h3 className="font-serif font-medium text-[1.28rem] leading-snug text-[#073125] group-hover:text-[#18624e] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[#4A635A] text-[0.84rem] leading-relaxed font-sans line-clamp-2 m-0">
                      {item.caption}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#EDF2EC] flex items-center justify-between text-[11px] text-[#4A635A] font-sans">
                    <span className="text-[#073125]/80 font-medium">Source: {item.source}</span>
                    <span className="text-[#073125] font-bold group-hover:translate-x-0.5 transition-transform">
                      View photo →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery Footer Note */}
          <div className="mt-12 p-6 rounded-2xl bg-white border border-[#073125]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📸</span>
              <p className="text-[#4A635A] text-xs sm:text-sm font-sans m-0">
                Are you staying with us? Share your moments with <strong className="text-[#073125]">#TheKasarHimalayanHeights</strong> or tag <a href="https://www.instagram.com/the_kasar_himalyan_heights/" target="_blank" rel="noopener noreferrer" className="text-[#073125] font-bold underline hover:text-[#C9F24D]">@the_kasar_himalyan_heights</a> to be featured.
              </p>
            </div>
            <Link
              to="/reviews"
              className="btn-concept-secondary text-xs py-2.5 px-5 flex-shrink-0"
            >
              Read guest stories
            </Link>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-concept-secondary text-xs py-2.5 px-5 flex-shrink-0"
            >
              <span>Explore 1,300+ Reviews &amp; Photos on Google Maps</span>
              <span aria-hidden="true">&nbsp;↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8.1 FULLSCREEN GALLERY LIGHTBOX MODAL */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] bg-[#073125] rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 text-white bg-[#052219]">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] font-bold text-[10px] uppercase tracking-wider">
                  {filteredGallery[lightboxIndex].badge}
                </span>
                <span className="text-xs text-white/70 font-sans hidden sm:inline">
                  📍 {filteredGallery[lightboxIndex].location}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-white/60">
                  {lightboxIndex + 1} / {filteredGallery.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg cursor-pointer transition-colors"
                  aria-label="Close photo view"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Lightbox Main Image & Prev/Next Controls */}
            <div className="relative flex-1 bg-black/60 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[460px]">
              <img
                src={filteredGallery[lightboxIndex].src}
                alt={filteredGallery[lightboxIndex].title}
                className="max-h-[60vh] sm:max-h-[66vh] w-auto max-w-full object-contain select-none"
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredGallery.length - 1))}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#C9F24D] text-white hover:text-[#073125] flex items-center justify-center text-2xl font-bold cursor-pointer transition-all shadow-lg backdrop-blur-sm"
                aria-label="Previous photo"
              >
                ‹
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev < filteredGallery.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#C9F24D] text-white hover:text-[#073125] flex items-center justify-center text-2xl font-bold cursor-pointer transition-all shadow-lg backdrop-blur-sm"
                aria-label="Next photo"
              >
                ›
              </button>
            </div>

            {/* Lightbox Caption & Details Footer */}
            <div className="p-5 sm:p-6 bg-[#073125] text-white border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
              <div className="max-w-[680px]">
                <h4 className="font-serif text-xl sm:text-2xl text-white font-medium mb-1">
                  {filteredGallery[lightboxIndex].title}
                </h4>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed m-0">
                  {filteredGallery[lightboxIndex].caption}
                </p>
                <div className="mt-2 text-[11px] text-[#C9F24D] font-mono">
                  Verified authentic photo from {filteredGallery[lightboxIndex].source}
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <a
                  href="#booking"
                  onClick={() => setLightboxIndex(null)}
                  className="px-5 py-2.5 rounded-full bg-[#C9F24D] text-[#073125] font-bold text-xs uppercase tracking-wider hover:bg-[#bde63d] transition-all no-underline shadow-md"
                >
                  Book this stay ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. BOOKING SECTION */}
      <section className="py-16 sm:py-24 bg-[#F4F7F3]" id="booking">
        <div className="w-[min(1120px,calc(100%-36px))] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 p-6 sm:p-12 lg:p-14 bg-white rounded-3xl shadow-[0_24px_70px_rgba(7,49,37,0.1)] border border-[#073125]/10">
            {/* Left copy */}
            <div className="lg:col-span-5 space-y-4">
              <span className="eyebrow">Your mountain pause</span>
              <h2 className="font-serif font-normal text-[clamp(2.3rem,4.2vw,3.6rem)] leading-tight text-[#073125]">
                Start with a simple enquiry.
              </h2>
              <p className="text-[#4A635A] text-base leading-relaxed font-sans">
                Share your dates and the kind of stay you’re looking for. Our team in Kasar Devi will confirm availability, suggest the best suite, and share live photos.
              </p>
              <div className="mt-5 p-4 bg-[#F8FAF7] border-l-4 border-[#C9F24D] rounded-r-xl text-[#073125] text-[0.82rem] leading-relaxed font-sans">
                Book direct with us for complimentary hot mountain breakfast, best rate guarantee, and free cancellation up to 48 hours before check-in.
              </div>
            </div>

            {/* Right form */}
            <div className="lg:col-span-7">
              <form
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                id="booking-form"
                onSubmit={handleBookingSubmit}
              >
                <div className="grid gap-1.5">
                  <label
                    htmlFor="guest-name"
                    className="text-[#4A635A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
                  >
                    Your name *
                  </label>
                  <input
                    id="guest-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-2.5 text-[#073125] bg-[#F8FAF7] border border-[#D5E0D8] rounded-xl text-sm focus:outline-none focus:border-[#073125] font-sans"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="guest-contact"
                    className="text-[#4A635A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
                  >
                    Email or phone *
                  </label>
                  <input
                    id="guest-contact"
                    name="contact"
                    type="text"
                    required
                    placeholder="How our team can reply"
                    value={guestContact}
                    onChange={(e) => setGuestContact(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-2.5 text-[#073125] bg-[#F8FAF7] border border-[#D5E0D8] rounded-xl text-sm focus:outline-none focus:border-[#073125] font-sans"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="arrival"
                    className="text-[#4A635A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
                  >
                    Check-in *
                  </label>
                  <input
                    id="arrival"
                    name="arrival"
                    type="date"
                    required
                    min={minDate}
                    value={arrivalDate}
                    onChange={(e) => handleArrivalChange(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-2.5 text-[#073125] bg-[#F8FAF7] border border-[#D5E0D8] rounded-xl text-sm focus:outline-none focus:border-[#073125] font-sans"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="departure"
                    className="text-[#4A635A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
                  >
                    Check-out *
                  </label>
                  <input
                    id="departure"
                    name="departure"
                    type="date"
                    required
                    min={getDepartureMin()}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-2.5 text-[#073125] bg-[#F8FAF7] border border-[#D5E0D8] rounded-xl text-sm focus:outline-none focus:border-[#073125] font-sans"
                  />
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="guest-count"
                    className="text-[#4A635A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
                  >
                    Guests
                  </label>
                  <select
                    id="guest-count"
                    name="guests"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-2.5 text-[#073125] bg-[#F8FAF7] border border-[#D5E0D8] rounded-xl text-sm focus:outline-none focus:border-[#073125] font-sans"
                  >
                    <option value="1">1 guest</option>
                    <option value="2">2 guests</option>
                    <option value="3">3 guests</option>
                    <option value="4">4 guests</option>
                    <option value="5+">5+ guests</option>
                  </select>
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="room-type"
                    className="text-[#4A635A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
                  >
                    Room preference
                  </label>
                  <select
                    id="room-type"
                    name="room"
                    value={roomPreference}
                    onChange={(e) => setRoomPreference(e.target.value)}
                    className="w-full min-h-[48px] px-4 py-2.5 text-[#073125] bg-[#F8FAF7] border border-[#D5E0D8] rounded-xl text-sm focus:outline-none focus:border-[#073125] font-sans"
                  >
                    <option value="No preference">No preference</option>
                    <option value="Nanda Devi Snow View Suite">Nanda Devi Snow View Suite</option>
                    <option value="Cedar Family Mountain Chalet">Cedar Family Mountain Chalet</option>
                    <option value="Crank's Ridge Attic Suite">Crank&apos;s Ridge Attic Suite</option>
                  </select>
                </div>

                <div className="sm:col-span-2 grid gap-1.5">
                  <label
                    htmlFor="guest-message"
                    className="text-[#4A635A] text-[0.65rem] font-bold uppercase tracking-wider font-sans"
                  >
                    Anything else our team should know?
                  </label>
                  <textarea
                    id="guest-message"
                    name="message"
                    rows={4}
                    placeholder="e.g. Extra bed heater, fireplace wood, Kathgodam pickup cab, dietary preference..."
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    className="w-full px-4 py-3 text-[#073125] bg-[#F8FAF7] border border-[#D5E0D8] rounded-xl text-sm focus:outline-none focus:border-[#073125] resize-y font-sans"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 flex flex-wrap items-center gap-3">
                  <button
                    className="btn-concept-saffron"
                    type="submit"
                  >
                    <span>Prepare my enquiry</span>
                    <span aria-hidden="true">&nbsp;→</span>
                  </button>

                  <Link
                    to="/book"
                    className="px-6 py-3.5 rounded-full border border-[#073125]/20 text-[#073125] hover:bg-[#073125]/5 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 font-sans"
                  >
                    <span>Or Book Online Instantly</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                {/* Form Confirmation Box */}
                {isConfirmationVisible && (
                  <div
                    className="sm:col-span-2 mt-4 p-5 rounded-2xl border border-[#073125]/20 text-[#073125] bg-[#EDF2EC]"
                    role="status"
                    aria-live="polite"
                  >
                    <h3 className="m-0 mb-1.5 font-serif font-medium text-[1.25rem]">
                      Your enquiry is ready to share
                    </h3>
                    <p className="m-0 mb-3 text-[0.82rem] text-[#073125]/85 font-sans">
                      Copy the text below and send it using the hotel’s confirmed booking contact, or send it directly on WhatsApp.
                    </p>
                    <textarea
                      readOnly
                      rows={8}
                      aria-label="Prepared enquiry"
                      value={enquirySummary}
                      className="w-full p-3 font-mono text-[0.78rem] border border-[#D5E0D8] bg-white text-[#073125] rounded-xl"
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-3 font-sans">
                      <button
                        type="button"
                        onClick={handleCopyEnquiry}
                        className="px-5 py-2.5 bg-[#073125] hover:bg-[#052219] text-white text-[0.74rem] font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors"
                      >
                        {copyButtonText}
                      </button>
                      <button
                        type="button"
                        onClick={handleSendWhatsApp}
                        className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[0.74rem] font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Send on WhatsApp</span>
                        <span aria-hidden="true">↗</span>
                      </button>
                      {copyStatus && (
                        <span className="text-xs text-[#073125] font-medium font-sans">
                          {copyStatus}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 10. LOCATION SECTION WITH LIVE GOOGLE MAPS EMBED */}
      <section className="py-16 sm:py-24 bg-[#EDF2EC]" id="location">
        <div className="w-[min(1120px,calc(100%-36px))] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Location details card */}
          <div className="lg:col-span-5 p-7 sm:p-10 bg-white rounded-3xl border border-[#073125]/10 shadow-sm flex flex-col justify-between">
            <div>
              <span className="eyebrow mb-2">Find your way</span>
              <h2 className="font-serif font-normal text-[clamp(2.3rem,4vw,3.4rem)] leading-tight text-[#073125] mb-3">
                We’ll meet you in the hills.
              </h2>
              <p className="text-[#4A635A] text-sm leading-relaxed mb-6 font-sans">
                Located on the historic Crank’s Ridge above Almora, blessed with pure pine air and 180° Himalayan views.
              </p>

              <div className="space-y-4 border-t border-[#D5E0D8] pt-4 font-sans">
                <div className="text-sm">
                  <strong className="block text-[#073125] text-[0.68rem] tracking-[0.14em] uppercase font-bold mb-0.5">
                    Property address
                  </strong>
                  <span className="text-[#4A635A]">
                    The Kasar Himalayan Heights, Crank&apos;s Ridge, Kasar Devi, Almora, Uttarakhand 263601
                  </span>
                </div>

                <div className="border-t border-[#D5E0D8] pt-3 text-sm">
                  <strong className="block text-[#073125] text-[0.68rem] tracking-[0.14em] uppercase font-bold mb-0.5">
                    Directions &amp; Distances
                  </strong>
                  <span className="text-[#4A635A]">
                    Kathgodam Railway Station (90 km • 3 hrs) • Pantnagar Airport (125 km) • Almora City (8 km) • Kainchi Dham (48 km)
                  </span>
                </div>

                <div className="border-t border-[#D5E0D8] pt-3 text-sm">
                  <strong className="block text-[#073125] text-[0.68rem] tracking-[0.14em] uppercase font-bold mb-0.5">
                    Direct Contact
                  </strong>
                  <span className="text-[#4A635A]">
                    Phone: {conciergePhone || '+91 94101 41144'} • WhatsApp: {whatsappNumber || '+91 94101 41144'} • Email: {email || 'info@thekasar.com'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#D5E0D8] flex flex-wrap gap-2.5">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-concept-saffron text-xs py-3 px-5 shadow-xs"
              >
                <span>Open in Google Maps</span>
                <span aria-hidden="true">&nbsp;↗</span>
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=29.641388,79.6635582"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full border border-[#073125]/25 text-[#073125] hover:bg-[#073125]/5 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>Get Directions 🚗</span>
              </a>
            </div>
          </div>

          {/* Proper Google Maps Interactive Iframe */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#073125]/15 shadow-xl bg-slate-100 flex flex-col min-h-[420px] sm:min-h-[480px]">
            <iframe
              title="The Kasar Himalyan Heights (Satya's) Google Map"
              src="https://maps.google.com/maps?q=The+Kasar+Himalyan+Heights+(Satya's)+Almora&t=&z=17&ie=UTF8&iwloc=&output=embed"
              className="w-full flex-1 border-0 min-h-[360px] sm:min-h-[420px]"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-3.5 sm:p-4 bg-[#073125] text-white flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9F24D] animate-ping" />
                <span className="font-semibold text-white">4.8 ★ on Google Maps</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80">Kasar Devi, Almora</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-[#C9F24D] text-[#073125] font-bold text-xs uppercase tracking-wider hover:bg-[#bde63d] transition-all flex items-center gap-1 shadow-xs"
                >
                  <span>View Photos &amp; Reviews</span>
                  <span aria-hidden="true">&nbsp;↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. VIDEO REEL MODAL (Google Maps Uploaded Video Showcase) */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#073125] rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 text-white">
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-medium text-white">
                  The Kasar Himalayan Heights Video Tour
                </h3>
                <p className="text-xs text-[#C9F24D] font-sans">
                  Stone Chalets &amp; Panoramic Ridge • Kasar Devi, Almora
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <video
                src="/videos/mountain_retreat.mp4"
                poster="/images/maps/video_reel_preview.jpg"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 bg-[#052219] text-xs text-white/80 font-sans">
              <span>Shot on location at Crank&apos;s Ridge, Kasar Devi</span>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-[#C9F24D] text-[#073125] font-bold uppercase tracking-wider hover:bg-[#bde63d] transition-all flex items-center gap-1.5"
              >
                <span>Open in Google Maps</span>
                <span aria-hidden="true">&nbsp;↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 12. PHONE-OPTIMIZED FLOATING ACTION BAR (Mobile View Excellence) */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-[#073125]/95 border border-white/20 rounded-full py-2 px-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-2">
        <a
          href={`tel:${conciergePhone || '+919410141144'}`}
          className="flex-1 py-2 text-center text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:text-[#C9F24D]"
        >
          <span>📞 Call</span>
        </a>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello! I would like to inquire about booking a room at The Kasar Himalayan Heights.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 text-center text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:text-[#C9F24D]"
        >
          <span>💬 WhatsApp</span>
        </a>
        <a
          href="#booking"
          className="flex-1 py-2.5 px-3 rounded-full bg-[#C9F24D] text-[#073125] text-center text-[11px] font-bold uppercase tracking-wider shadow-sm active:scale-95"
        >
          <span>Book ↗</span>
        </a>
      </div>
    </div>
  );
}
