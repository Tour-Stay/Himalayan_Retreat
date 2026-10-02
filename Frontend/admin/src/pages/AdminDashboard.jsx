import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthContext,
  apiClient,
  Loader,
  Logo,
  Container,
  SectionHeading,
  CheckCircleIcon,
  StarIcon,
  APP_URLS,
} from '@shared';

const availableAmenities = [
  'WiFi',
  'Mountain View',
  'Balcony',
  'Room Service',
  'Heater',
  'TV',
  'Geyser',
  'Tea/Coffee Maker',
  'Electric Blanket',
  'Bonfire Pit',
];

const viewOptions = [
  '180° Snow Peak View (Trishul & Nanda Devi)',
  'Pine Forest & Chalet Ridge',
  'Attic Cedar Mountain Suite',
  'Sunrise Himalayan Valley Panorama',
];

const AdminDashboard = () => {
  const { isAdminLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' | 'bookings' | 'travel' | 'tours' | 'reviews'
  const [suiteViewMode, setSuiteViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [travelBookings, setTravelBookings] = useState([]);
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state for adding/editing a suite
  const [isSuiteModalOpen, setIsSuiteModalOpen] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    view: '180° Snow Peak View (Trishul & Nanda Devi)',
    adults: '2',
    children: '0',
    amenities: ['WiFi', 'Mountain View', 'Heater', 'Geyser'],
    imageURL: '',
  });
  const [roomPhotos, setRoomPhotos] = useState(null);
  const [suiteSubmitting, setSuiteSubmitting] = useState(false);

  // Form state for adding/editing a tour package
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [editingTourId, setEditingTourId] = useState(null);
  const [tourForm, setTourForm] = useState({
    title: '',
    destination: 'Kainchi Dham & Jageshwar Pilgrimage',
    durationDays: 3,
    durationNights: 2,
    pricePerPerson: 8500,
    itinerary: 'Day 1: Kathgodam pickup & Kainchi Dham. Day 2: Jageshwar Dham & Almora. Day 3: Kasar Devi sunrise & drop.',
    inclusions: 'Heated SUV Chauffeur, Daily Breakfast, Temple Darshan Liaison, Fuel & Tolls',
    imageURL: '',
  });
  const [tourPhotos, setTourPhotos] = useState(null);
  const [tourSubmitting, setTourSubmitting] = useState(false);

  // Lightbox for review photos
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/');
    }
  }, [isAdminLoggedIn, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes, travelRes, toursRes, reviewsRes] = await Promise.all([
        apiClient.get('/hotel/rooms').catch(() => ({ data: [] })),
        apiClient.get('/hotel/bookings').catch(() => ({ data: [] })),
        apiClient.get('/travel/bookings').catch(() => ({ data: [] })),
        apiClient.get('/travel/tours').catch(() => ({ data: [] })),
        apiClient.get('/travel/reviews/admin').catch(() => ({ data: [] })),
      ]);

      setRooms(roomsRes.data || []);
      setBookings(bookingsRes.data || []);
      setTravelBookings(travelRes.data || []);
      setTours(toursRes.data || []);
      setReviews(reviewsRes.data || []);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchData();
    }
  }, [isAdminLoggedIn]);

  // ==========================================
  // SUITE HANDLERS
  // ==========================================
  const handleOpenAddSuite = () => {
    setEditingRoomId(null);
    setRoomForm({
      name: '',
      description: '',
      pricePerNight: '',
      view: '180° Snow Peak View (Trishul & Nanda Devi)',
      adults: '2',
      children: '0',
      amenities: ['WiFi', 'Mountain View', 'Heater', 'Geyser'],
      imageURL: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    });
    setRoomPhotos(null);
    setIsSuiteModalOpen(true);
  };

  const handleOpenEditSuite = (room) => {
    setEditingRoomId(room._id);
    setRoomForm({
      name: room.name,
      description: room.description,
      pricePerNight: room.pricePerNight,
      view: room.view || '180° Snow Peak View (Trishul & Nanda Devi)',
      adults: room.capacity?.adults || 2,
      children: room.capacity?.children || 0,
      amenities: room.amenities || [],
      imageURL: (room.imageURLs && room.imageURLs[0]) || '',
    });
    setRoomPhotos(null);
    setIsSuiteModalOpen(true);
  };

  const handleSuiteFormSubmit = async (e) => {
    e.preventDefault();
    setSuiteSubmitting(true);

    try {
      if (roomPhotos && roomPhotos.length > 0) {
        // Multipart upload
        const data = new FormData();
        data.append('name', roomForm.name);
        data.append('description', roomForm.description);
        data.append('pricePerNight', roomForm.pricePerNight);
        data.append('view', roomForm.view);
        data.append('capacity', JSON.stringify({ adults: Number(roomForm.adults), children: Number(roomForm.children) }));
        data.append('amenities', JSON.stringify(roomForm.amenities));
        for (let i = 0; i < roomPhotos.length; i++) {
          data.append('images', roomPhotos[i]);
        }

        if (editingRoomId) {
          await apiClient.put(`/hotel/rooms/${editingRoomId}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          await apiClient.post('/hotel/rooms', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      } else {
        // JSON payload
        const payload = {
          name: roomForm.name,
          description: roomForm.description,
          pricePerNight: Number(roomForm.pricePerNight),
          view: roomForm.view,
          capacity: {
            adults: Number(roomForm.adults),
            children: Number(roomForm.children),
          },
          amenities: roomForm.amenities,
          imageURLs: roomForm.imageURL
            ? [roomForm.imageURL]
            : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'],
        };

        if (editingRoomId) {
          await apiClient.put(`/hotel/rooms/${editingRoomId}`, payload);
        } else {
          await apiClient.post('/hotel/rooms', payload);
        }
      }

      setIsSuiteModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving suite');
    } finally {
      setSuiteSubmitting(false);
    }
  };

  const handleDeleteSuite = async (id) => {
    if (!window.confirm('Are you sure you want to delete this suite?')) return;
    try {
      await apiClient.delete(`/hotel/rooms/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete suite');
    }
  };

  // ==========================================
  // TOUR PACKAGES HANDLERS
  // ==========================================
  const handleOpenAddTour = () => {
    setEditingTourId(null);
    setTourForm({
      title: '',
      destination: 'Kumaon Pilgrimage Circuit',
      durationDays: 3,
      durationNights: 2,
      pricePerPerson: 8500,
      itinerary: 'Day 1: Kathgodam Station pickup, Bhimtal scenic drive, Kainchi Dham Ashram evening darshan.\nDay 2: Jageshwar 124-temple cluster, Mahamrityunjaya Puja, Almora bazaar.\nDay 3: Sunrise over Trishul & Nanda Devi peaks from Kasar Devi, return transfer.',
      inclusions: 'Heated SUV Chauffeur, Daily Breakfast, Temple Darshan Liaison, Fuel & Tolls',
      imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Early_morning_Glimpse_of_Kainchi_Dham_Nainital_2023.jpg/1280px-Early_morning_Glimpse_of_Kainchi_Dham_Nainital_2023.jpg',
    });
    setTourPhotos(null);
    setIsTourModalOpen(true);
  };

  const handleOpenEditTour = (tour) => {
    setEditingTourId(tour._id);
    setTourForm({
      title: tour.title || '',
      destination: tour.destination || '',
      durationDays: tour.duration?.days || 3,
      durationNights: tour.duration?.nights || 2,
      pricePerPerson: tour.pricePerPerson || 8500,
      itinerary: Array.isArray(tour.itinerary)
        ? tour.itinerary.map((it) => `Day ${it.day}: ${it.description}`).join('\n')
        : tour.itinerary || '',
      inclusions: Array.isArray(tour.inclusions) ? tour.inclusions.join(', ') : tour.inclusions || '',
      imageURL: (tour.imageURLs && tour.imageURLs[0]) || '',
    });
    setTourPhotos(null);
    setIsTourModalOpen(true);
  };

  const handleTourFormSubmit = async (e) => {
    e.preventDefault();
    setTourSubmitting(true);

    try {
      const parsedItinerary = tourForm.itinerary
        .split('\n')
        .filter((line) => line.trim())
        .map((line, idx) => ({ day: idx + 1, description: line.replace(/^Day\s*\d+:\s*/i, '').trim() }));

      const parsedInclusions = tourForm.inclusions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (tourPhotos && tourPhotos.length > 0) {
        const data = new FormData();
        data.append('title', tourForm.title);
        data.append('destination', tourForm.destination);
        data.append('duration', JSON.stringify({ days: Number(tourForm.durationDays), nights: Number(tourForm.durationNights) }));
        data.append('pricePerPerson', tourForm.pricePerPerson);
        data.append('itinerary', JSON.stringify(parsedItinerary));
        data.append('inclusions', JSON.stringify(parsedInclusions));
        for (let i = 0; i < tourPhotos.length; i++) {
          data.append('images', tourPhotos[i]);
        }

        if (editingTourId) {
          await apiClient.put(`/travel/tours/${editingTourId}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          await apiClient.post('/travel/tours', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      } else {
        const payload = {
          title: tourForm.title,
          destination: tourForm.destination,
          duration: { days: Number(tourForm.durationDays), nights: Number(tourForm.durationNights) },
          pricePerPerson: Number(tourForm.pricePerPerson),
          itinerary: parsedItinerary,
          inclusions: parsedInclusions,
          imageURLs: tourForm.imageURL ? [tourForm.imageURL] : [],
        };

        if (editingTourId) {
          await apiClient.put(`/travel/tours/${editingTourId}`, payload);
        } else {
          await apiClient.post('/travel/tours', payload);
        }
      }

      setIsTourModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving tour package');
    } finally {
      setTourSubmitting(false);
    }
  };

  const handleDeleteTour = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour package?')) return;
    try {
      await apiClient.delete(`/travel/tours/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete tour package');
    }
  };

  // ==========================================
  // BOOKING HANDLERS
  // ==========================================
  const handleUpdateHotelBookingStatus = async (id, status) => {
    try {
      await apiClient.put(`/hotel/bookings/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update hotel booking status');
    }
  };

  const handleDeleteHotelBooking = async (id) => {
    if (!window.confirm('Delete this hotel reservation record?')) return;
    try {
      await apiClient.delete(`/hotel/bookings/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete hotel reservation');
    }
  };

  const handleUpdateTravelBookingStatus = async (id, status) => {
    try {
      await apiClient.put(`/travel/bookings/${id}/status`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to update travel booking status');
    }
  };

  const handleDeleteTravelBooking = async (id) => {
    if (!window.confirm('Delete this travel expedition record?')) return;
    try {
      await apiClient.delete(`/travel/bookings/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete travel booking');
    }
  };

  // ==========================================
  // REVIEW MODERATION HANDLERS
  // ==========================================
  const handleToggleReviewApproval = async (id) => {
    try {
      await apiClient.put(`/travel/reviews/${id}/approve`);
      fetchData();
    } catch (err) {
      alert('Failed to toggle review approval');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review record from the ledger?')) return;
    try {
      await apiClient.delete(`/travel/reviews/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const filteredRooms = rooms.filter((r) =>
    (r.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans selection:bg-gold/20 selection:text-maroon">
      {/* Top Staff Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate text-ivory border-b border-gold/20 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <Logo size={36} />
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-medium leading-none">
              The Kasar Himalayan Heights
            </h1>
            <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-mono">
              Staff Command Portal • Port 5176
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-xs text-ivory/70 font-mono">
            <a href={APP_URLS.landing} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
              Landing 5173 ↗
            </a>
            <span>•</span>
            <a href={APP_URLS.hotel} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
              Hotel 5174 ↗
            </a>
            <span>•</span>
            <a href={APP_URLS.travel} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">
              Travel 5175 ↗
            </a>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-maroon hover:bg-maroon-dark text-ivory transition-colors border border-gold/30 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="p-6 sm:p-10 max-w-7xl mx-auto">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="bg-ivory-warm p-5 rounded-2xl border border-gold/30 shadow-xs">
            <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block font-mono">
              Suites Active
            </span>
            <span className="font-serif text-3xl font-semibold text-charcoal mt-1 block">
              {rooms.length}
            </span>
            <span className="text-[10px] text-gold font-mono mt-1 block">
              12 Chalet Cap
            </span>
          </div>

          <div className="bg-ivory-warm p-5 rounded-2xl border border-gold/30 shadow-xs">
            <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block font-mono">
              Hotel Bookings
            </span>
            <span className="font-serif text-3xl font-semibold text-maroon mt-1 block">
              {bookings.length}
            </span>
            <span className="text-[10px] text-charcoal-muted font-mono mt-1 block">
              Guest Ledger
            </span>
          </div>

          <div className="bg-ivory-warm p-5 rounded-2xl border border-gold/30 shadow-xs">
            <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block font-mono">
              Travel Trips
            </span>
            <span className="font-serif text-3xl font-semibold text-charcoal mt-1 block">
              {travelBookings.length}
            </span>
            <span className="text-[10px] text-charcoal-muted font-mono mt-1 block">
              Mountain Chauffeur
            </span>
          </div>

          <div className="bg-ivory-warm p-5 rounded-2xl border border-gold/30 shadow-xs">
            <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block font-mono">
              Tour Packages
            </span>
            <span className="font-serif text-3xl font-semibold text-charcoal mt-1 block">
              {tours.length}
            </span>
            <span className="text-[10px] text-charcoal-muted font-mono mt-1 block">
              Pilgrimage Circuits
            </span>
          </div>

          <div className="bg-ivory-warm p-5 rounded-2xl border border-gold/30 shadow-xs">
            <span className="text-[11px] text-charcoal-muted uppercase tracking-wider block font-mono">
              Guest Reviews
            </span>
            <span className="font-serif text-3xl font-semibold text-gold mt-1 block">
              {reviews.length}
            </span>
            <span className="text-[10px] text-charcoal-muted font-mono mt-1 block">
              {reviews.filter((r) => !r.isApproved).length} Awaiting Approval
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-gold/25 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'rooms', label: 'Suite Inventory' },
            { id: 'bookings', label: 'Hotel Bookings' },
            { id: 'travel', label: 'Travel Expeditions' },
            { id: 'tours', label: 'Tour Packages' },
            { id: 'reviews', label: 'Reviews Moderation' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? 'bg-maroon text-ivory shadow-md border border-gold/40'
                : 'bg-ivory-warm text-charcoal/75 hover:bg-ivory border border-gold/20'
                }`}
            >
              {tab.label}
              {tab.id === 'reviews' && reviews.filter((r) => !r.isApproved).length > 0 && (
                <span className="ml-2 px-1.5 py-0.2 bg-gold text-slate font-bold rounded-full text-[10px]">
                  {reviews.filter((r) => !r.isApproved).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <Loader />
          </div>
        ) : (
          <>
            {/* ======================================================== */}
            {/* TAB 1: SUITE INVENTORY */}
            {/* ======================================================== */}
            {activeTab === 'rooms' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search suites..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory text-charcoal text-xs focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                    <div className="flex items-center gap-1 bg-ivory-warm p-1 rounded-xl border border-gold/25">
                      <button
                        onClick={() => setSuiteViewMode('cards')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer ${suiteViewMode === 'cards' ? 'bg-maroon text-ivory' : 'text-charcoal'
                          }`}
                      >
                        Cards
                      </button>
                      <button
                        onClick={() => setSuiteViewMode('table')}
                        className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer ${suiteViewMode === 'table' ? 'bg-maroon text-ivory' : 'text-charcoal'
                          }`}
                      >
                        Table
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleOpenAddSuite}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-maroon hover:bg-maroon-dark text-ivory transition-colors shadow-md cursor-pointer self-start sm:self-auto"
                  >
                    + Add New Alpine Suite
                  </button>
                </div>

                {suiteViewMode === 'cards' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
                      <div
                        key={room._id}
                        className="bg-ivory-warm rounded-3xl overflow-hidden border border-gold/30 shadow-xs flex flex-col justify-between"
                      >
                        <div className="relative h-48 bg-slate">
                          <img
                            src={(room.imageURLs && room.imageURLs[0]) || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-slate/85 text-ivory text-[10px] px-3 py-1 rounded-full font-mono border border-gold/30">
                            {room.view || '180° Snow Peak View'}
                          </span>
                        </div>
                        <div className="p-6">
                          <h3 className="font-serif text-xl font-medium text-charcoal mb-1">
                            {room.name}
                          </h3>
                          <span className="font-serif text-2xl font-semibold text-maroon block mb-2">
                            ₹{room.pricePerNight?.toLocaleString()} / night
                          </span>
                          <p className="text-xs text-charcoal-muted line-clamp-2 font-light mb-4">
                            {room.description}
                          </p>
                          <div className="flex items-center gap-2 pt-4 border-t border-gold/20">
                            <button
                              onClick={() => handleOpenEditSuite(room)}
                              className="px-4 py-2 rounded-xl text-xs font-semibold uppercase border border-gold/40 text-charcoal hover:bg-gold/10 transition-colors cursor-pointer"
                            >
                              Edit Suite
                            </button>
                            <button
                              onClick={() => handleDeleteSuite(room._id)}
                              className="px-4 py-2 rounded-xl text-xs font-semibold uppercase border border-red-300 text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-ivory-warm rounded-3xl border border-gold/30 overflow-x-auto shadow-xs">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-ivory border-b border-gold/25 font-mono uppercase text-charcoal-muted">
                        <tr>
                          <th className="p-4">Suite Name</th>
                          <th className="p-4">Price/Night</th>
                          <th className="p-4">View</th>
                          <th className="p-4">Capacity</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/15">
                        {filteredRooms.map((room) => (
                          <tr key={room._id} className="hover:bg-ivory/50">
                            <td className="p-4 font-medium text-charcoal">{room.name}</td>
                            <td className="p-4 font-mono font-semibold text-maroon">₹{room.pricePerNight?.toLocaleString()}</td>
                            <td className="p-4 text-charcoal-muted">{room.view}</td>
                            <td className="p-4 font-mono">{room.capacity?.adults || 2} Adults</td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenEditSuite(room)}
                                className="px-3 py-1 rounded-lg border border-gold/40 text-charcoal hover:bg-gold/10 text-xs cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSuite(room._id)}
                                className="px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: HOTEL BOOKINGS */}
            {/* ======================================================== */}
            {activeTab === 'bookings' && (
              <div className="bg-ivory-warm rounded-3xl border border-gold/30 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-ivory border-b border-gold/25 font-mono uppercase text-charcoal-muted">
                    <tr>
                      <th className="p-4">Booking ID</th>
                      <th className="p-4">Guest</th>
                      <th className="p-4">Suite Reserved</th>
                      <th className="p-4">Dates</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/15">
                    {bookings.length > 0 ? (
                      bookings.map((b) => (
                        <tr key={b._id} className="hover:bg-ivory/50">
                          <td className="p-4 font-mono font-bold text-maroon">{b.bookingId || b._id.slice(-6)}</td>
                          <td className="p-4">
                            <div className="font-medium text-charcoal">{b.guestDetails?.name || 'Guest'}</div>
                            <div className="text-[11px] text-charcoal-muted">{b.guestDetails?.phone || b.guestDetails?.email}</div>
                          </td>
                          <td className="p-4 text-charcoal">{b.roomName || 'Suite'}</td>
                          <td className="p-4 text-charcoal-muted font-mono">{b.checkInDate} to {b.checkOutDate}</td>
                          <td className="p-4 font-mono font-semibold text-maroon">₹{b.totalAmount?.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gold/20 text-charcoal border border-gold/30'
                              }`}>
                              {b.status || 'pending'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <select
                              value={b.status || 'pending'}
                              onChange={(e) => handleUpdateHotelBookingStatus(b._id, e.target.value)}
                              className="px-2 py-1 rounded-lg border border-gold/40 bg-ivory text-charcoal text-xs font-mono cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="checked-in">Checked In</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => handleDeleteHotelBooking(b._id)}
                              className="px-2.5 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-charcoal-muted font-light">
                          No hotel reservations recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: TRAVEL EXPEDITIONS */}
            {/* ======================================================== */}
            {activeTab === 'travel' && (
              <div className="bg-ivory-warm rounded-3xl border border-gold/30 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-ivory border-b border-gold/25 font-mono uppercase text-charcoal-muted">
                    <tr>
                      <th className="p-4">Trip Ref</th>
                      <th className="p-4">Guest</th>
                      <th className="p-4">Route Circuit</th>
                      <th className="p-4">Fleet</th>
                      <th className="p-4">Date & Days</th>
                      <th className="p-4">Fare Quote</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/15">
                    {travelBookings.length > 0 ? (
                      travelBookings.map((t) => (
                        <tr key={t._id} className="hover:bg-ivory/50">
                          <td className="p-4 font-mono font-bold text-maroon">{t.bookingId || t._id.slice(-6)}</td>
                          <td className="p-4">
                            <div className="font-medium text-charcoal">{t.guestDetails?.name || t.guestName || 'Traveler'}</div>
                            <div className="text-[11px] text-charcoal-muted">{t.guestDetails?.phone || t.guestPhone}</div>
                          </td>
                          <td className="p-4 text-charcoal font-medium">
                            {Array.isArray(t.circuit) ? t.circuit.join(' • ') : t.circuit || t.destination || 'Kumaon Circuit'}
                          </td>
                          <td className="p-4 text-charcoal-muted font-mono">{t.vehicleType || t.fleetType || '6-Seater'}</td>
                          <td className="p-4 font-mono text-charcoal-muted">
                            {t.travelDate || 'Date TBD'} ({t.tripDays || 1} Day{t.tripDays > 1 ? 's' : ''})
                          </td>
                          <td className="p-4 font-mono font-semibold text-maroon">
                            ₹{(t.totalAmount || t.estimatedTotal || 0).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${t.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-gold/20 text-charcoal'
                              }`}>
                              {t.status || 'pending'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <select
                              value={t.status || 'pending'}
                              onChange={(e) => handleUpdateTravelBookingStatus(t._id, e.target.value)}
                              className="px-2 py-1 rounded-lg border border-gold/40 bg-ivory text-charcoal text-xs font-mono cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => handleDeleteTravelBooking(t._id)}
                              className="px-2.5 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-charcoal-muted font-light">
                          No travel expedition bookings recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: TOUR PACKAGES CRUD */}
            {/* ======================================================== */}
            {activeTab === 'tours' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-charcoal font-medium">
                      Sacred Circuits & Tour Packages
                    </h3>
                    <p className="text-xs text-charcoal-muted mt-0.5">
                      Curated pilgrimage & exploration packages displayed to travelers
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddTour}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-maroon hover:bg-maroon-dark text-ivory transition-colors shadow-md cursor-pointer"
                  >
                    + Add New Tour Package
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <div
                      key={tour._id}
                      className="bg-ivory-warm rounded-3xl overflow-hidden border border-gold/30 shadow-xs flex flex-col justify-between"
                    >
                      <div className="relative h-48 bg-slate">
                        <img
                          src={(tour.imageURLs && tour.imageURLs[0]) || 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Early_morning_Glimpse_of_Kainchi_Dham_Nainital_2023.jpg/1280px-Early_morning_Glimpse_of_Kainchi_Dham_Nainital_2023.jpg'}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 bg-slate/85 text-gold text-[10px] px-3 py-1 rounded-full font-mono border border-gold/30">
                          {tour.duration?.days || 3} Days / {tour.duration?.nights || 2} Nights
                        </span>
                      </div>

                      <div className="p-6">
                        <span className="text-[10px] uppercase tracking-wider text-charcoal-muted block font-mono mb-1">
                          {tour.destination}
                        </span>
                        <h4 className="font-serif text-xl font-medium text-charcoal mb-2">
                          {tour.title}
                        </h4>
                        <span className="font-serif text-2xl font-semibold text-maroon block mb-3">
                          ₹{tour.pricePerPerson?.toLocaleString()} / person
                        </span>

                        <div className="text-xs text-charcoal-muted line-clamp-3 mb-4 font-light">
                          {Array.isArray(tour.itinerary)
                            ? tour.itinerary.map((it) => `Day ${it.day}: ${it.description}`).join(' • ')
                            : tour.itinerary}
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-gold/20">
                          <button
                            onClick={() => handleOpenEditTour(tour)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold uppercase border border-gold/40 text-charcoal hover:bg-gold/10 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTour(tour._id)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold uppercase border border-red-300 text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {tours.length === 0 && (
                    <div className="col-span-3 bg-ivory-warm p-12 rounded-3xl border border-gold/30 text-center text-charcoal-muted">
                      No tour packages created yet. Click "+ Add New Tour Package" above.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 5: REVIEWS MODERATION */}
            {/* ======================================================== */}
            {activeTab === 'reviews' && (
              <div className="bg-ivory-warm rounded-3xl border border-gold/30 overflow-x-auto shadow-xs">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-ivory border-b border-gold/25 font-mono uppercase text-charcoal-muted">
                    <tr>
                      <th className="p-4">Guest</th>
                      <th className="p-4">Circuit</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Review Content</th>
                      <th className="p-4">Photos</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/15">
                    {reviews.length > 0 ? (
                      reviews.map((r) => (
                        <tr key={r._id} className="hover:bg-ivory/50">
                          <td className="p-4">
                            <div className="font-medium text-charcoal">{r.name}</div>
                            <div className="text-[11px] text-charcoal-muted">{r.email}</div>
                            <div className="text-[10px] text-charcoal-muted font-mono">{r.location}</div>
                          </td>
                          <td className="p-4 text-charcoal font-medium">{r.tripType}</td>
                          <td className="p-4 font-mono font-bold text-gold">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: r.rating || 5 }).map((_, i) => (
                                <StarIcon key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                              ))}
                            </div>
                          </td>
                          <td className="p-4 max-w-sm text-charcoal-muted line-clamp-3 font-light leading-relaxed">
                            &ldquo;{r.review}&rdquo;
                          </td>
                          <td className="p-4">
                            {r.photos && r.photos.length > 0 ? (
                              <div className="flex gap-1.5">
                                {r.photos.map((ph, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => setLightboxPhoto(ph)}
                                    className="w-10 h-10 rounded-lg overflow-hidden border border-gold/30 hover:border-gold hover:scale-105 transition-all cursor-pointer"
                                  >
                                    <img src={ph} alt="Review thumb" className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-charcoal-muted italic">None</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${r.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                              {r.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleReviewApproval(r._id)}
                              className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${r.isApproved
                                ? 'border border-amber-300 text-amber-800 hover:bg-amber-50'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                                }`}
                            >
                              {r.isApproved ? 'Unapprove' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleDeleteReview(r._id)}
                              className="px-2.5 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-charcoal-muted font-light">
                          No reviews currently in the ledger.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SUITE */}
      {/* ======================================================== */}
      {isSuiteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-ivory rounded-3xl max-w-xl w-full p-8 border border-gold/35 shadow-2xl relative my-8">
            <h3 className="font-serif text-2xl font-medium text-charcoal mb-4">
              {editingRoomId ? 'Edit Alpine Suite' : 'Add New Alpine Suite'}
            </h3>

            <form onSubmit={handleSuiteFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                  Suite Title
                </label>
                <input
                  type="text"
                  required
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  placeholder="e.g. Himalayan Snow View Suite"
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                    Nightly Rate (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={roomForm.pricePerNight}
                    onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                    placeholder="6942"
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                    Mountain Vista View
                  </label>
                  <select
                    value={roomForm.view}
                    onChange={(e) => setRoomForm({ ...roomForm, view: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
                  >
                    {viewOptions.map((v, i) => (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                  Upload Room Photos (Optional, replaces URL)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setRoomPhotos(e.target.files)}
                  className="w-full px-4 py-2 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-xs"
                />
                {roomPhotos && (
                  <span className="text-[10px] text-maroon font-mono block mt-1">
                    ✓ {roomPhotos.length} photo(s) selected for direct upload
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                  Or Suite Photo URL
                </label>
                <input
                  type="url"
                  value={roomForm.imageURL}
                  onChange={(e) => setRoomForm({ ...roomForm, imageURL: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  placeholder="Handcrafted cedar pine finishes, heated floors, and 180° peak views..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gold/20">
                <button
                  type="button"
                  onClick={() => setIsSuiteModalOpen(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase border border-gold/40 text-charcoal hover:bg-gold/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={suiteSubmitting}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase bg-maroon hover:bg-maroon-dark text-ivory shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {suiteSubmitting ? 'Saving Suite...' : 'Save Alpine Suite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT TOUR PACKAGE */}
      {/* ======================================================== */}
      {isTourModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-ivory rounded-3xl max-w-xl w-full p-8 border border-gold/35 shadow-2xl relative my-8">
            <h3 className="font-serif text-2xl font-medium text-charcoal mb-4">
              {editingTourId ? 'Edit Tour Package' : 'Add New Tour Package'}
            </h3>

            <form onSubmit={handleTourFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                  Tour Title
                </label>
                <input
                  type="text"
                  required
                  value={tourForm.title}
                  onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                  placeholder="e.g. Sacred Kainchi & Jageshwar 3-Day Pilgrimage"
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                    Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={tourForm.durationDays}
                    onChange={(e) => setTourForm({ ...tourForm, durationDays: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                    Nights
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={tourForm.durationNights}
                    onChange={(e) => setTourForm({ ...tourForm, durationNights: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                    Price/Person (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={tourForm.pricePerPerson}
                    onChange={(e) => setTourForm({ ...tourForm, pricePerPerson: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                  Destination Circuit
                </label>
                <input
                  type="text"
                  required
                  value={tourForm.destination}
                  onChange={(e) => setTourForm({ ...tourForm, destination: e.target.value })}
                  placeholder="e.g. Almora • Kainchi Dham • Jageshwar"
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                  Itinerary (1 day per line)
                </label>
                <textarea
                  rows={3}
                  required
                  value={tourForm.itinerary}
                  onChange={(e) => setTourForm({ ...tourForm, itinerary: e.target.value })}
                  placeholder="Day 1: Arrival & Temple Darshan&#10;Day 2: Scenic drive & meditation&#10;Day 3: Sunrise & departure"
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                  Inclusions (comma separated)
                </label>
                <input
                  type="text"
                  value={tourForm.inclusions}
                  onChange={(e) => setTourForm({ ...tourForm, inclusions: e.target.value })}
                  placeholder="Heated SUV, Breakfast, Darshan Liaison"
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-charcoal mb-1 font-mono">
                  Cover Photo URL
                </label>
                <input
                  type="url"
                  value={tourForm.imageURL}
                  onChange={(e) => setTourForm({ ...tourForm, imageURL: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gold/20">
                <button
                  type="button"
                  onClick={() => setIsTourModalOpen(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase border border-gold/40 text-charcoal hover:bg-gold/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={tourSubmitting}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase bg-maroon hover:bg-maroon-dark text-ivory shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {tourSubmitting ? 'Saving Package...' : 'Save Tour Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REVIEW PHOTO LIGHTBOX */}
      {/* ======================================================== */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-charcoal/85 backdrop-blur-md"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ivory text-charcoal flex items-center justify-center text-lg font-bold hover:bg-gold transition-colors shadow-lg cursor-pointer z-10"
          >
            ✕
          </button>
          <img
            src={lightboxPhoto}
            alt="Review attachment"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '85vh' }}
            className="object-contain rounded-2xl shadow-2xl border border-gold/30"
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
