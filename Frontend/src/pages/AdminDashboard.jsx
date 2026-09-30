import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import Logo from '../components/Logo';
import {
  CarIcon,
  UsersIcon,
  MountainIcon,
  SparklesIcon,
  MapPinIcon,
  CalendarIcon,
  MessageIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  StarIcon,
} from '../components/Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const availableAmenities = [
  'WiFi', 'Mountain View', 'Balcony', 'Room Service', 
  'Heater', 'TV', 'Geyser', 'Tea/Coffee Maker', 'Electric Blanket', 'Bonfire Pit'
];

const viewOptions = [
  '180° Snow Peak View (Trishul & Nanda Devi)',
  'Pine Forest & Chalet Ridge',
  'Attic Cedar Mountain Suite',
  'Sunrise Himalayan Valley Panorama',
];

const AdminDashboard = () => {
  const { isAdminLoggedIn, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('rooms');
  const [suiteViewMode, setSuiteViewMode] = useState('cards'); // 'cards' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [travelBookings, setTravelBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxState, setLightboxState] = useState({ open: false, photos: [], index: 0 });

  // Form state for adding/editing a room
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    view: '180° Snow Peak View (Trishul & Nanda Devi)',
    adults: '2',
    children: '0',
    amenities: ['WiFi', 'Mountain View', 'Heater', 'Geyser'],
  });
  const [roomImages, setRoomImages] = useState(null);
  const [addLoading, setAddLoading] = useState(false);

  // Form state for adding/editing a tour package
  const [tours, setTours] = useState([]);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [editingTourId, setEditingTourId] = useState(null);
  const [newTour, setNewTour] = useState({
    title: '',
    destination: 'Chardham & High Himalayas',
    duration: '5 Days / 4 Nights',
    pricePerPerson: '',
    itinerary: '',
    inclusions: 'Comfortable SUV Transport, Breakfast, Premium Stays',
  });
  const [tourImages, setTourImages] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin');
    }
  }, [isAdminLoggedIn, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [roomsRes, bookingsRes, travelRes, reviewsRes, toursRes] = await Promise.all([
        axios.get(`${API_URL}/hotel/rooms`),
        axios.get(`${API_URL}/hotel/bookings`, config),
        axios.get(`${API_URL}/travel/bookings`, config).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/travel/reviews/admin`, config).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/travel/tours`).catch(() => ({ data: [] }))
      ]);
      
      setRooms(roomsRes.data || []);
      setBookings(bookingsRes.data || []);
      setTravelBookings(travelRes.data || []);
      setReviews(reviewsRes.data || []);
      setTours(toursRes.data || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn && token) {
      fetchData();
    }
  }, [isAdminLoggedIn, token]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const resetForm = () => {
    setNewRoom({
      name: '',
      description: '',
      pricePerNight: '',
      view: '180° Snow Peak View (Trishul & Nanda Devi)',
      adults: '2',
      children: '0',
      amenities: ['WiFi', 'Mountain View', 'Heater', 'Geyser'],
    });
    setRoomImages(null);
    setEditingRoomId(null);
    setIsAddingRoom(false);
  };

  const handleEditClick = (room) => {
    setNewRoom({
      name: room.name,
      description: room.description,
      pricePerNight: room.pricePerNight,
      view: room.view || '180° Snow Peak View (Trishul & Nanda Devi)',
      adults: room.capacity?.adults?.toString() || '2',
      children: room.capacity?.children?.toString() || '0',
      amenities: room.amenities || [],
    });
    setEditingRoomId(room._id);
    setIsAddingRoom(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this mountain suite? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/hotel/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Failed to delete room:', error);
      alert('Failed to delete room.');
    }
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', newRoom.name);
      formData.append('description', newRoom.description);
      formData.append('pricePerNight', newRoom.pricePerNight);
      formData.append('view', newRoom.view);
      
      formData.append('capacity', JSON.stringify({ adults: Number(newRoom.adults), children: Number(newRoom.children) }));
      formData.append('amenities', JSON.stringify(newRoom.amenities));

      if (roomImages && roomImages.length > 0) {
        for (let i = 0; i < roomImages.length; i++) {
          formData.append('images', roomImages[i]);
        }
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingRoomId) {
        await axios.put(`${API_URL}/hotel/rooms/${editingRoomId}`, formData, config);
      } else {
        await axios.post(`${API_URL}/hotel/rooms`, formData, config);
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save room:', error);
      const serverMsg = error.response?.data?.error || error.response?.data?.message || 'Check network / server logs.';
      alert(`Failed to save room: ${serverMsg}`);
    } finally {
      setAddLoading(false);
    }
  };

  const resetTourForm = () => {
    setNewTour({
      title: '',
      destination: 'Chardham & High Himalayas',
      duration: '5 Days / 4 Nights',
      pricePerPerson: '',
      itinerary: '',
      inclusions: 'Comfortable SUV Transport, Breakfast, Premium Stays',
    });
    setTourImages(null);
    setEditingTourId(null);
    setIsAddingTour(false);
  };

  const handleEditTourClick = (tour) => {
    setNewTour({
      title: tour.title,
      destination: tour.destination,
      duration: tour.duration,
      pricePerPerson: tour.pricePerPerson,
      itinerary: tour.itinerary,
      inclusions: tour.inclusions,
    });
    setEditingTourId(tour._id);
    setIsAddingTour(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm('Are you sure you want to delete this tour package?')) return;
    try {
      await axios.delete(`${API_URL}/travel/tours/${tourId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Failed to delete tour:', error);
      alert('Failed to delete tour package.');
    }
  };

  const handleSaveTour = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', newTour.title);
      formData.append('destination', newTour.destination);
      formData.append('duration', newTour.duration);
      formData.append('pricePerPerson', newTour.pricePerPerson);
      formData.append('itinerary', newTour.itinerary);
      formData.append('inclusions', newTour.inclusions);

      if (tourImages && tourImages.length > 0) {
        for (let i = 0; i < tourImages.length; i++) {
          formData.append('images', tourImages[i]);
        }
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingTourId) {
        await axios.put(`${API_URL}/travel/tours/${editingTourId}`, formData, config);
      } else {
        await axios.post(`${API_URL}/travel/tours`, formData, config);
      }

      resetTourForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save tour:', error);
      alert('Failed to save tour package.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to permanently delete this guest review?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/travel/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review.');
    }
  };

  const handleToggleReviewApproval = async (reviewId) => {
    try {
      await axios.put(`${API_URL}/travel/reviews/${reviewId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Failed to toggle review approval:', error);
      alert('Failed to update review status.');
    }
  };

  const handleUpdateBookingStatus = async (id, status, type) => {
    try {
      const endpoint = type === 'hotel' ? `/hotel/bookings/${id}/status` : `/travel/bookings/${id}/status`;
      await axios.put(`${API_URL}${endpoint}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Failed to update booking status:', error);
      alert('Failed to update booking status.');
    }
  };

  const handleDeleteBooking = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this booking permanently?')) return;
    try {
      const endpoint = type === 'hotel' ? `/hotel/bookings/${id}` : `/travel/bookings/${id}`;
      await axios.delete(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Failed to delete booking:', error);
      alert('Failed to delete booking.');
    }
  };

  // Filtered rooms based on search
  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.view || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Total revenue estimate
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

  if (!isAdminLoggedIn) return null;
  if (loading) return <div className="pt-32 min-h-screen bg-cream flex items-center justify-center"><Loader /></div>;

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 min-h-screen bg-[#FBF9F5] text-text-dark">
      <div className="max-w-7xl mx-auto">
        
        {/* ========================================================================= */}
        {/* 1. EXECUTIVE LUXURY TOP NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-3xl bg-primary text-white border border-secondary/30 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-white/10 shrink-0">
              <Logo size={42} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Himalayan Operations Command
                </h1>
                <span className="text-[10px] bg-secondary text-primary font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-secondary text-xs font-medium flex items-center gap-2 mt-0.5">
                <span>Kasar Devi (7,500 FT)</span>
                <span>•</span>
                <span>Almora Hub Fleet</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all border border-white/10"
              title="Preview Live Hotel Website"
            >
              <span>🏨 Hotel Site</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5 text-secondary" />
            </Link>

            <Link
              to="/travel"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all border border-white/10"
              title="Preview Live Tour & Travel Page"
            >
              <span>🚕 Travel Site</span>
              <ArrowUpRightIcon className="w-3.5 h-3.5 text-secondary" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold uppercase tracking-wider border border-red-400/30 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. EXECUTIVE METRIC KPI CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-text-light uppercase tracking-wider font-semibold block mb-1">
                Heated Suites Active
              </span>
              <span className="font-heading text-3xl font-bold text-text-dark font-mono">
                {rooms.length}
              </span>
              <span className="text-[11px] text-emerald-600 block mt-1 font-medium">
                ✓ 100% Ready for Booking
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-secondary flex items-center justify-center">
              <MountainIcon className="w-6 h-6 text-secondary" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-text-light uppercase tracking-wider font-semibold block mb-1">
                Hotel Reservations
              </span>
              <span className="font-heading text-3xl font-bold text-primary font-mono">
                {bookings.length}
              </span>
              <span className="text-[11px] text-text-light block mt-1">
                Est. ₹{totalRevenue.toLocaleString('en-IN')} booked
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-primary flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-text-light uppercase tracking-wider font-semibold block mb-1">
                Almora Fleet Inquiries
              </span>
              <span className="font-heading text-3xl font-bold text-emerald-700 font-mono">
                {travelBookings.length}
              </span>
              <span className="text-[11px] text-emerald-700 block mt-1 font-medium">
                4, 6 & 12-Seater Fleet
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CarIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] text-text-light uppercase tracking-wider font-semibold block mb-1">
                Ridge Operations
              </span>
              <span className="font-heading text-lg font-bold text-text-dark flex items-center gap-1.5 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active 7,500 FT</span>
              </span>
              <span className="text-[11px] text-text-light block mt-1">
                Snow Peak Visibility: 100%
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-secondary flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. TABS CONTROLLER WITH SEARCH & VIEW SWITCHER */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'rooms'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-text-dark border border-gray-200 hover:border-secondary'
              }`}
            >
              <MountainIcon className={`w-4 h-4 ${activeTab === 'rooms' ? 'text-secondary' : 'text-gray-400'}`} />
              <span>Mountain Suites</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'rooms' ? 'bg-secondary text-primary' : 'bg-gray-100 text-text-dark'}`}>
                {rooms.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'bookings'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-text-dark border border-gray-200 hover:border-secondary'
              }`}
            >
              <CalendarIcon className={`w-4 h-4 ${activeTab === 'bookings' ? 'text-secondary' : 'text-gray-400'}`} />
              <span>Hotel Reservations</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'bookings' ? 'bg-secondary text-primary' : 'bg-gray-100 text-text-dark'}`}>
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('travel-bookings')}
              className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'travel-bookings'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-text-dark border border-gray-200 hover:border-secondary'
              }`}
            >
              <CarIcon className={`w-4 h-4 ${activeTab === 'travel-bookings' ? 'text-secondary' : 'text-gray-400'}`} />
              <span>Tour Fleet Bookings</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'travel-bookings' ? 'bg-secondary text-primary' : 'bg-gray-100 text-text-dark'}`}>
                {travelBookings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-text-dark border border-gray-200 hover:border-secondary'
              }`}
            >
              <StarIcon className={`w-4 h-4 ${activeTab === 'reviews' ? 'text-secondary' : 'text-gray-400'}`} />
              <span>Guest Reviews</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'reviews' ? 'bg-secondary text-primary' : 'bg-gray-100 text-text-dark'}`}>
                {reviews.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tours')}
              className={`py-3 px-5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                activeTab === 'tours'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-text-dark border border-gray-200 hover:border-secondary'
              }`}
            >
              <MapPinIcon className={`w-4 h-4 ${activeTab === 'tours' ? 'text-secondary' : 'text-gray-400'}`} />
              <span>Tour Packages</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'tours' ? 'bg-secondary text-primary' : 'bg-gray-100 text-text-dark'}`}>
                {tours.length}
              </span>
            </button>
          </div>

          {activeTab === 'rooms' && (
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search suites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs text-text-dark focus:outline-none focus:border-secondary w-48 sm:w-56"
              />
              <div className="bg-white border border-gray-200 p-1 rounded-xl flex items-center">
                <button
                  onClick={() => setSuiteViewMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    suiteViewMode === 'cards' ? 'bg-primary text-white' : 'text-text-light hover:text-text-dark'
                  }`}
                  title="Card Gallery View"
                >
                  Cards
                </button>
                <button
                  onClick={() => setSuiteViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    suiteViewMode === 'table' ? 'bg-primary text-white' : 'text-text-light hover:text-text-dark'
                  }`}
                  title="Data Table View"
                >
                  Table
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. TAB 1: HOTEL SUITES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'rooms' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl text-text-dark font-semibold">
                  Heated Mountain Suites Inventory
                </h2>
                <p className="text-xs text-text-light">
                  Chalet and peak view inventory at 7,500 FT elevation.
                </p>
              </div>
              <button
                onClick={() => (isAddingRoom ? resetForm() : setIsAddingRoom(true))}
                className="btn-gold px-6 py-3 rounded-full text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
              >
                <span>{isAddingRoom ? '✕ Close Form' : '+ Add New Mountain Suite'}</span>
              </button>
            </div>

            {/* Add / Edit Suite Form */}
            {isAddingRoom && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-secondary/40 shadow-xl mb-8 animate-fade-in">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center text-xs font-mono font-bold">
                      {editingRoomId ? '✎' : '+'}
                    </span>
                    <h3 className="font-heading text-xl text-text-dark font-semibold">
                      {editingRoomId ? 'Edit Mountain Suite Details' : 'Add New Heated Mountain Suite'}
                    </h3>
                  </div>
                  <span className="text-[11px] text-text-light">All fields marked * are required</span>
                </div>

                <form onSubmit={handleSaveRoom} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                        Suite Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal Nanda Devi Panoramic Suite"
                        value={newRoom.name}
                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                        Price Per Night (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 4499"
                        value={newRoom.pricePerNight}
                        onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
                        onWheel={(e) => e.target.blur()}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                        Scenic View / Category
                      </label>
                      <select
                        value={newRoom.view}
                        onChange={(e) => setNewRoom({ ...newRoom, view: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                      >
                        {viewOptions.map((v) => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                        Adults Capacity *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="8"
                        value={newRoom.adults}
                        onChange={(e) => setNewRoom({ ...newRoom, adults: e.target.value })}
                        onWheel={(e) => e.target.blur()}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                        Children Capacity
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="6"
                        value={newRoom.children}
                        onChange={(e) => setNewRoom({ ...newRoom, children: e.target.value })}
                        onWheel={(e) => e.target.blur()}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                      Suite Description & Architectural Highlights *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe the alpine wood finish, king-size bed, private balcony peak views, and heating setup..."
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-2">
                      Included Heated Amenities & Features
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {availableAmenities.map((amenity) => {
                        const isChecked = newRoom.amenities.includes(amenity);
                        return (
                          <label
                            key={amenity}
                            className={`flex items-center gap-2 text-xs p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-primary/5 border-secondary text-primary font-bold'
                                : 'bg-gray-50 border-gray-200 text-text-light hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewRoom({ ...newRoom, amenities: [...newRoom.amenities, amenity] });
                                } else {
                                  setNewRoom({ ...newRoom, amenities: newRoom.amenities.filter((a) => a !== amenity) });
                                }
                              }}
                              className="w-4 h-4 text-secondary rounded focus:ring-secondary accent-secondary"
                            />
                            <span>{amenity}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image Upload Area with Custom Preview Box */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                      Suite Photographs {editingRoomId && <span className="text-gray-400 font-normal">(Leave blank to keep existing photos)</span>}
                    </label>
                    <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-[#FBF9F5] text-center hover:border-secondary transition-all">
                      <input
                        type="file"
                        id="suite-images"
                        multiple
                        accept="image/*"
                        onChange={(e) => setRoomImages(e.target.files)}
                        className="hidden"
                        required={!editingRoomId}
                      />
                      <label htmlFor="suite-images" className="cursor-pointer block">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-secondary mx-auto mb-2 flex items-center justify-center">
                          <SparklesIcon className="w-6 h-6 text-secondary" />
                        </div>
                        <span className="text-xs font-semibold text-primary block mb-0.5">
                          Click to browse high-resolution suite images
                        </span>
                        <span className="text-[11px] text-text-light block">
                          Supports JPG, PNG, WEBP • Automatically stored and optimized
                        </span>
                        {roomImages && roomImages.length > 0 && (
                          <div className="mt-3 inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                            ✓ {roomImages.length} image(s) ready to upload
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2.5 rounded-full border border-gray-200 text-xs font-semibold uppercase tracking-wider text-text-dark hover:bg-gray-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={addLoading}
                      className="btn-gold px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {addLoading ? (
                        <span>Saving Suite to Database...</span>
                      ) : (
                        <span>{editingRoomId ? 'Update Suite' : 'Save Suite'}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SUITE CARDS VIEW */}
            {suiteViewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => {
                  const thumb = room.imageURLs?.[0] || '/placeholder-room.svg';
                  return (
                    <div
                      key={room._id}
                      className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                        <img
                          src={thumb}
                          alt={room.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-room.svg';
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-primary/85 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {room.view || 'Snow Peak View'}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-primary font-mono font-bold text-sm px-3 py-1 rounded-full shadow-xs">
                          ₹{Number(room.pricePerNight).toLocaleString('en-IN')} / night
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-heading text-lg font-bold text-text-dark mb-1">
                            {room.name}
                          </h3>
                          <p className="text-xs text-text-light line-clamp-2 mb-3">
                            {room.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-text-light mb-3">
                            <UsersIcon className="w-3.5 h-3.5 text-secondary" />
                            <span>Max {room.capacity?.adults || 2} Adults, {room.capacity?.children || 0} Kids</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {(room.amenities || []).slice(0, 4).map((a) => (
                              <span key={a} className="text-[10px] bg-gray-100 text-text-dark px-2 py-0.5 rounded-md">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleEditClick(room)}
                            className="flex-1 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary hover:text-white text-xs font-semibold transition-all cursor-pointer text-center"
                          >
                            Edit Suite
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room._id)}
                            className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SUITE DATA TABLE VIEW */}
            {suiteViewMode === 'table' && (
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-text-dark uppercase tracking-wider">
                        <th className="px-6 py-4">Suite Details</th>
                        <th className="px-6 py-4">Price / Night</th>
                        <th className="px-6 py-4">Capacity</th>
                        <th className="px-6 py-4">Amenities</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                      {filteredRooms.map((room) => {
                        const thumb = room.imageURLs?.[0] || '/placeholder-room.svg';
                        return (
                          <tr key={room._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3.5">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-xs">
                                  <img
                                    src={thumb}
                                    alt={room.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/placeholder-room.svg';
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-heading text-base font-semibold text-text-dark">{room.name}</p>
                                  <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider block">
                                    {room.view || '180° Himalayan Peak View'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 font-mono font-bold text-primary text-base whitespace-nowrap">
                              ₹{Number(room.pricePerNight).toLocaleString('en-IN')}
                              <span className="text-[11px] font-normal text-text-light font-sans block">per night</span>
                            </td>

                            <td className="px-6 py-4 text-xs text-text-light whitespace-nowrap">
                              <div className="flex items-center gap-1 font-medium text-text-dark">
                                <UsersIcon className="w-3.5 h-3.5 text-secondary" />
                                <span>{room.capacity?.adults || 2} Adults</span>
                                <span>•</span>
                                <span>{room.capacity?.children || 0} Kids</span>
                              </div>
                            </td>

                            <td className="px-6 py-4 text-xs text-text-light">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {(room.amenities || []).slice(0, 3).map((a) => (
                                  <span key={a} className="px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-text-dark font-medium">
                                    {a}
                                  </span>
                                ))}
                                {(room.amenities || []).length > 3 && (
                                  <span className="text-[10px] text-secondary font-bold">
                                    +{room.amenities.length - 3} more
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => handleEditClick(room)}
                                  className="px-3.5 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteRoom(room._id)}
                                  className="px-3.5 py-1.5 rounded-full border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-all cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredRooms.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-200">
                <MountainIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-text-dark font-semibold text-base">No mountain suites found</p>
                <p className="text-text-light text-xs mt-1">Try adjusting your search or click "+ Add New Mountain Suite".</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. TAB 2: HOTEL RESERVATIONS */}
        {/* ========================================================================= */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl text-text-dark font-semibold">
                  Hotel Stay Reservations
                </h2>
                <p className="text-xs text-text-light">
                  Direct online room bookings and check-in schedules for The Kasar Himalayan Heights.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary/15 text-primary self-start sm:self-auto border border-secondary/30">
                Total Stays: {bookings.length}
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-text-dark uppercase tracking-wider">
                      <th className="px-6 py-4">Guest Contact</th>
                      <th className="px-6 py-4">Suite / Room</th>
                      <th className="px-6 py-4">Check-In / Out</th>
                      <th className="px-6 py-4">Total Amount</th>
                      <th className="px-6 py-4">Status & Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                    {bookings.map((booking) => (
                      <tr key={booking._id} className={`hover:bg-gray-50/50 transition-all duration-300 ${booking.status === 'cancelled' ? 'opacity-40 grayscale' : ''}`}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-text-dark">{booking.guestDetails?.name}</p>
                          <p className="text-xs text-text-light">{booking.guestDetails?.email}</p>
                          <p className="text-xs text-text-light">{booking.guestDetails?.phone}</p>
                        </td>

                        <td className="px-6 py-4 text-xs">
                          <p className="font-semibold text-text-dark">{booking.roomName || 'Luxury Suite'}</p>
                          <p className="text-text-light">Ref: {booking.bookingId || booking._id?.slice(-8)}</p>
                        </td>

                        <td className="px-6 py-4 text-xs text-text-light whitespace-nowrap">
                          <p className="font-semibold text-text-dark">
                            {new Date(booking.checkInDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-text-light">
                            to {new Date(booking.checkOutDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <span className="text-[10px] text-secondary font-bold">
                            {booking.nights || 1} Night(s)
                          </span>
                        </td>

                        <td className="px-6 py-4 font-mono font-bold text-primary text-base">
                          ₹{booking.totalAmount?.toLocaleString('en-IN')}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 items-start">
                            <select
                              value={booking.status || 'pending'}
                              onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value, 'hotel')}
                              className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                                booking.status === 'completed'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : booking.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : booking.status === 'cancelled'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              <option value="pending">PENDING</option>
                              <option value="confirmed">CONFIRMED</option>
                              <option value="completed">COMPLETED</option>
                              <option value="cancelled">CANCELLED</option>
                            </select>

                            <div className="flex items-center gap-3 mt-1">
                              {booking.guestDetails?.phone && (
                                <a
                                  href={`https://wa.me/${booking.guestDetails.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${booking.guestDetails.name}! Re: Your reservation at The Kasar Himalayan Heights (${booking.roomName || 'Suite'}):`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
                                >
                                  <span>WhatsApp Guest ↗</span>
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteBooking(booking._id, 'hotel')}
                                className="text-[11px] text-red-500 hover:text-red-700 font-semibold hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-text-light text-sm">
                          No hotel reservations yet. New guest bookings will appear here automatically.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. TAB 3: TOUR & TRAVEL FLEET BOOKINGS */}
        {/* ========================================================================= */}
        {activeTab === 'travel-bookings' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl text-text-dark font-semibold">
                  Tour & Travel Fleet Bookings
                </h2>
                <p className="text-xs text-text-light">
                  Chauffeured mountain travel inquiries, starting from Almora Hub with distance tariffs.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary/15 text-primary self-start sm:self-auto border border-secondary/30">
                Almora & Kumaon Hub
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-text-dark uppercase tracking-wider">
                      <th className="px-6 py-4">Guest Details</th>
                      <th className="px-6 py-4">Fleet & Vehicle</th>
                      <th className="px-6 py-4">Origin & Circuit</th>
                      <th className="px-6 py-4">Travel Date</th>
                      <th className="px-6 py-4">Estimated Fare</th>
                      <th className="px-6 py-4">Status & Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                    {travelBookings.map((tBooking) => (
                      <tr key={tBooking._id} className={`hover:bg-gray-50/50 transition-all duration-300 ${tBooking.status === 'cancelled' ? 'opacity-40 grayscale' : ''}`}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-text-dark">{tBooking.guestDetails?.name}</p>
                          <p className="text-xs text-text-light">{tBooking.guestDetails?.phone}</p>
                          <p className="text-xs text-text-light">{tBooking.guestDetails?.email}</p>
                          {tBooking.notes && (
                            <p className="text-[11px] text-gray-500 italic mt-1 line-clamp-2 max-w-xs">
                              "{tBooking.notes}"
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary">
                            {tBooking.vehicleType}
                          </span>
                          <p className="text-xs text-text-light mt-1">{tBooking.travelers || 2} Travelers</p>
                        </td>

                        <td className="px-6 py-4 text-xs">
                          <p className="font-semibold text-text-dark flex items-center gap-1">
                            <MapPinIcon className="w-3.5 h-3.5 text-secondary" />
                            <span>{tBooking.pickupLocation || 'Almora Base'}</span>
                          </p>
                          <p className="text-text-light line-clamp-2 max-w-xs mt-0.5">{tBooking.circuit}</p>
                          <p className="text-secondary font-medium">{tBooking.tripDays} Day{tBooking.tripDays > 1 ? 's' : ''}</p>
                        </td>

                        <td className="px-6 py-4 text-xs text-text-light whitespace-nowrap">
                          {tBooking.travelDate ? new Date(tBooking.travelDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }) : 'Flexible'}
                        </td>

                        <td className="px-6 py-4 font-bold font-mono text-primary text-base">
                          ₹{tBooking.totalAmount ? tBooking.totalAmount.toLocaleString('en-IN') : 'Custom'}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 items-start">
                            <select
                              value={tBooking.status || 'pending'}
                              onChange={(e) => handleUpdateBookingStatus(tBooking._id, e.target.value, 'travel')}
                              className={`text-xs font-bold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${
                                tBooking.status === 'completed'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : tBooking.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : tBooking.status === 'cancelled'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              <option value="pending">PENDING</option>
                              <option value="confirmed">CONFIRMED</option>
                              <option value="completed">COMPLETED</option>
                              <option value="cancelled">CANCELLED</option>
                            </select>

                            <div className="flex items-center gap-3 mt-1">
                              {tBooking.guestDetails?.phone && (
                                <a
                                  href={`https://wa.me/${tBooking.guestDetails.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${tBooking.guestDetails.name}! Regarding your Himalayan travel booking (${tBooking.vehicleType} from ${tBooking.pickupLocation}):`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
                                >
                                  <MessageIcon className="w-3.5 h-3.5" />
                                  <span>WhatsApp Guest ↗</span>
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteBooking(tBooking._id, 'travel')}
                                className="text-[11px] text-red-500 hover:text-red-700 font-semibold hover:underline"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {travelBookings.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-text-light text-sm">
                          No travel bookings submitted yet. Customer requests from the Tour & Travel page will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* ========================================================================= */}
        {/* 6. TAB 4: GUEST REVIEWS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div>
            <div className="mb-6">
              <h2 className="font-heading text-xl sm:text-2xl text-text-dark font-semibold">
                Guest Reviews Management
              </h2>
              <p className="text-xs text-text-light">
                Manage, approve, or delete travel stories submitted by guests.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-text-dark uppercase tracking-wider">
                      <th className="px-6 py-4">Reviewer Details</th>
                      <th className="px-6 py-4">Trip Info</th>
                      <th className="px-6 py-4">Rating & Story</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {reviews.map((rev) => (
                      <tr key={rev._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-heading text-base font-semibold text-text-dark">{rev.name}</p>
                          <p className="text-xs text-text-light font-medium mt-0.5">{rev.email}</p>
                          <span className="text-[10px] text-secondary mt-1 block">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-xs">
                          <p className="font-semibold text-text-dark">{rev.location || 'N/A'}</p>
                          <p className="text-text-light">{rev.tripType || 'N/A'}</p>
                          {rev.photos && rev.photos.length > 0 && (
                            <button
                              onClick={() => setLightboxState({ open: true, photos: rev.photos, index: 0 })}
                              className="mt-2 text-[10px] bg-secondary/10 text-secondary font-bold px-2 py-0.5 rounded-full hover:bg-secondary/20 transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              📸 {rev.photos.length} Photo{rev.photos.length > 1 ? 's' : ''}
                            </button>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-0.5 text-secondary mb-1.5">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <StarIcon key={i} className="w-3.5 h-3.5 fill-secondary" />
                            ))}
                          </div>
                          <p className="text-xs text-text-light max-w-xs line-clamp-3 italic">
                            "{rev.review}"
                          </p>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleToggleReviewApproval(rev._id)}
                            className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full cursor-pointer transition-all ${
                              rev.isApproved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                            }`}
                          >
                            {rev.isApproved ? 'Approved Live' : 'Hidden Pending'}
                          </button>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-all cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-text-light text-sm">
                          No guest reviews available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================== PHOTO LIGHTBOX =================== */}
        {lightboxState.open && lightboxState.photos.length > 0 && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => setLightboxState({ ...lightboxState, open: false })}
          >
            <button
              onClick={() => setLightboxState({ ...lightboxState, open: false })}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-text-dark flex items-center justify-center text-lg font-bold hover:bg-white shadow-lg cursor-pointer z-10"
            >
              ✕
            </button>

            {lightboxState.photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxState(prev => ({
                    ...prev,
                    index: prev.index === 0 ? prev.photos.length - 1 : prev.index - 1
                  }));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-text-dark flex items-center justify-center text-xl font-bold hover:bg-white shadow-lg cursor-pointer z-10"
              >
                ←
              </button>
            )}

            <img
              src={lightboxState.photos[lightboxState.index]}
              alt={`Review photo ${lightboxState.index + 1}`}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '85vh' }}
              className="object-contain rounded-2xl shadow-2xl"
            />

            {lightboxState.photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxState(prev => ({
                    ...prev,
                    index: prev.index === prev.photos.length - 1 ? 0 : prev.index + 1
                  }));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 text-text-dark flex items-center justify-center text-xl font-bold hover:bg-white shadow-lg cursor-pointer z-10"
              >
                →
              </button>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              {lightboxState.index + 1} / {lightboxState.photos.length}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. TAB 5: TOUR PACKAGES CATALOG */}
        {/* ========================================================================= */}
        {activeTab === 'tours' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl text-text-dark font-semibold">
                  Tour Packages Catalog
                </h2>
                <p className="text-xs text-text-light">
                  Manage fixed itinerary tours displayed on the Travel page.
                </p>
              </div>
              {!isAddingTour && (
                <button
                  onClick={() => setIsAddingTour(true)}
                  className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  <SparklesIcon className="w-4 h-4" />
                  <span>Add New Tour</span>
                </button>
              )}
            </div>

            {isAddingTour ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-xl font-bold text-text-dark">
                    {editingTourId ? 'Edit Tour Package' : 'Create New Tour Package'}
                  </h3>
                  <button
                    onClick={resetTourForm}
                    className="text-text-light hover:text-text-dark font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveTour} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Package Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Grand Chardham Circuit"
                        value={newTour.title}
                        onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-secondary focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Destination / Region</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kedarnath, Badrinath"
                        value={newTour.destination}
                        onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-secondary focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Duration</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 5 Days / 4 Nights"
                        value={newTour.duration}
                        onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-secondary focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Price Per Person (₹)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        value={newTour.pricePerPerson}
                        onChange={(e) => setNewTour({ ...newTour, pricePerPerson: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-secondary focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Short Itinerary / Highlights</label>
                    <textarea
                      required
                      rows="3"
                      value={newTour.itinerary}
                      onChange={(e) => setNewTour({ ...newTour, itinerary: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-secondary focus:bg-white transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Key Inclusions (Comma separated)</label>
                    <input
                      type="text"
                      required
                      value={newTour.inclusions}
                      onChange={(e) => setNewTour({ ...newTour, inclusions: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-secondary focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">Cover Images (Required on New)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setTourImages(e.target.files)}
                      className="block w-full text-sm text-text-light file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 file:cursor-pointer"
                    />
                    <p className="text-[10px] text-text-light mt-1.5">Max 10 images. High quality landscape recommended.</p>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={addLoading}
                      className="px-8 py-3 bg-secondary text-primary font-bold text-sm rounded-2xl hover:bg-[#F2B04A] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addLoading ? 'Saving...' : editingTourId ? 'Update Tour Package' : 'Publish Tour Package'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-text-dark uppercase tracking-wider">
                        <th className="px-6 py-4">Tour / Destination</th>
                        <th className="px-6 py-4">Duration & Price</th>
                        <th className="px-6 py-4">Highlights</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                      {tours.map((tour) => {
                        const thumb = tour.imageURLs?.[0] || '/placeholder-room.svg';
                        return (
                          <tr key={tour._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3.5">
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200 shadow-xs">
                                  <img
                                    src={thumb}
                                    alt={tour.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = '/placeholder-room.svg';
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="font-heading text-base font-semibold text-text-dark">{tour.title}</p>
                                  <span className="text-[10px] text-secondary font-semibold uppercase tracking-wider block">
                                    {tour.destination}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4">
                              <p className="font-semibold text-text-dark">{tour.duration}</p>
                              <p className="font-mono font-bold text-primary text-sm mt-0.5">
                                ₹{Number(tour.pricePerPerson).toLocaleString('en-IN')} <span className="text-[10px] text-text-light font-sans font-normal">/pp</span>
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              <p className="text-xs text-text-light max-w-xs line-clamp-2">
                                {tour.itinerary}
                              </p>
                            </td>

                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  onClick={() => handleEditTourClick(tour)}
                                  className="px-3.5 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteTour(tour._id)}
                                  className="px-3.5 py-1.5 rounded-full border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-all cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {tours.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-text-light text-sm">
                            No tour packages created yet. Click "Add New Tour" to build your catalog.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

export default AdminDashboard;
