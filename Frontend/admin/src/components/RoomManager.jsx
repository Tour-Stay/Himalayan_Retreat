import { useState, useMemo } from 'react';
import { apiClient, broadcastUpdate } from '@shared';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './Toast';

const AMENITY_OPTIONS = [
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
  'Panoramic Deck',
  'Fireplace',
];

const VIEW_OPTIONS = [
  '180° Snow Peak View (Trishul & Nanda Devi)',
  'Pine Forest & Chalet Ridge',
  'Attic Cedar Mountain Suite',
  'Sunrise Himalayan Valley Panorama',
  'Zero-Point Ridge View',
];

export const RoomManager = ({ rooms = [], setRooms, onRefresh }) => {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all' | 'active' | 'unavailable'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unavailability Modal State
  const [unavailTarget, setUnavailTarget] = useState(null);
  const [unavailUntil, setUnavailUntil] = useState('');
  const [unavailReason, setUnavailReason] = useState('');
  const [isTogglingAvail, setIsTogglingAvail] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    view: VIEW_OPTIONS[0],
    adults: 2,
    children: 0,
    amenities: ['WiFi', 'Mountain View', 'Heater', 'Geyser'],
    fallbackImageUrl: '',
    totalRooms: 1,
    location: 'Kasar Devi, Almora',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  // Confirm Dialog State for Deleting
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        (room.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (room.view && room.view.toLowerCase().includes(search.toLowerCase())) ||
        (room.description && room.description.toLowerCase().includes(search.toLowerCase()));

      const matchesFilter =
        filterAvailability === 'all' ||
        (filterAvailability === 'active' && Boolean(room.isAvailable)) ||
        (filterAvailability === 'unavailable' && !room.isAvailable);

      return matchesSearch && matchesFilter;
    });
  }, [rooms, search, filterAvailability]);

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      name: '',
      description: '',
      pricePerNight: '',
      view: VIEW_OPTIONS[0],
      adults: 2,
      children: 0,
      amenities: ['WiFi', 'Mountain View', 'Heater', 'Geyser'],
      fallbackImageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      totalRooms: 1,
      location: 'Kasar Devi, Almora',
    });
    setSelectedFiles([]);
    setFilePreviews([]);
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name || '',
      description: room.description || '',
      pricePerNight: room.pricePerNight || '',
      view: room.view || VIEW_OPTIONS[0],
      adults: room.capacity?.adults || 2,
      children: room.capacity?.children || 0,
      amenities: room.amenities || [],
      fallbackImageUrl: (room.imageURLs && room.imageURLs[0]) || '',
      totalRooms: room.totalRooms || 1,
      location: room.location || 'Kasar Devi, Almora',
    });
    setSelectedFiles([]);
    setFilePreviews([]);
    setIsModalOpen(true);
  };

  // Handle Amenity Toggle
  const toggleAmenity = (item) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== item)
          : [...prev.amenities, item],
      };
    });
  };

  // Handle File Input Selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  // Toggle Room Availability
  const handleToggleAvailability = async (room) => {
    if (room.isAvailable) {
      setUnavailTarget(room);
      setUnavailUntil(room.unavailableUntil ? new Date(room.unavailableUntil).toISOString().split('T')[0] : '');
      setUnavailReason(room.unavailableReason || 'All rooms booked for the season');
    } else {
      setIsTogglingAvail(true);
      try {
        await apiClient.put(`/hotel/rooms/${room._id}/availability`, {
          isAvailable: true,
          unavailableUntil: null,
          unavailableReason: '',
        });
        setRooms((prev) =>
          prev.map((r) =>
            r._id === room._id
              ? { ...r, isAvailable: true, unavailableUntil: null, unavailableReason: '' }
              : r
          )
        );
        addToast(`"${room.name}" is now OPEN for booking!`, 'success');
        broadcastUpdate('ROOMS_UPDATED');
      } catch (err) {
        addToast('Failed to update room availability: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        setIsTogglingAvail(false);
      }
    }
  };

  // Confirm Marking Room Unavailable
  const handleConfirmUnavailable = async () => {
    if (!unavailTarget) return;
    setIsTogglingAvail(true);
    try {
      await apiClient.put(`/hotel/rooms/${unavailTarget._id}/availability`, {
        isAvailable: false,
        unavailableUntil: unavailUntil || null,
        unavailableReason: unavailReason || '',
      });
      setRooms((prev) =>
        prev.map((r) =>
          r._id === unavailTarget._id
            ? { ...r, isAvailable: false, unavailableUntil: unavailUntil || null, unavailableReason: unavailReason || '' }
            : r
        )
      );
      addToast(
        `"${unavailTarget.name}" marked unavailable${unavailUntil ? ` until ${new Date(unavailUntil).toLocaleDateString('en-IN')}` : ''}.`,
        'info'
      );
      broadcastUpdate('ROOMS_UPDATED');
      setUnavailTarget(null);
      setUnavailUntil('');
      setUnavailReason('');
    } catch (err) {
      addToast('Failed to mark room unavailable: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsTogglingAvail(false);
    }
  };

  // Submit Add/Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let response;
      if (selectedFiles.length > 0) {
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('description', formData.description);
        payload.append('pricePerNight', formData.pricePerNight);
        payload.append('view', formData.view);
        payload.append('adults', formData.adults);
        payload.append('children', formData.children);
        payload.append('totalRooms', formData.totalRooms);
        payload.append('location', formData.location);
        formData.amenities.forEach((amenity) => payload.append('amenities', amenity));
        selectedFiles.forEach((file) => payload.append('images', file));

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        if (editingRoom) {
          response = await apiClient.put(`/hotel/rooms/${editingRoom._id}`, payload, config);
        } else {
          response = await apiClient.post('/hotel/rooms', payload, config);
        }
      } else {
        const payload = {
          name: formData.name,
          description: formData.description,
          pricePerNight: Number(formData.pricePerNight),
          view: formData.view,
          capacity: {
            adults: Number(formData.adults),
            children: Number(formData.children),
          },
          amenities: formData.amenities,
          totalRooms: Number(formData.totalRooms),
          location: formData.location,
        };

        if (!editingRoom && formData.fallbackImageUrl) {
          payload.imageURLs = [formData.fallbackImageUrl];
        }

        if (editingRoom) {
          response = await apiClient.put(`/hotel/rooms/${editingRoom._id}`, payload);
        } else {
          response = await apiClient.post('/hotel/rooms', payload);
        }
      }

      if (editingRoom) {
        setRooms((prev) =>
          prev.map((r) => (r._id === editingRoom._id ? response.data.room || response.data : r))
        );
        addToast(`Suite "${formData.name}" updated successfully!`, 'success');
      } else {
        setRooms((prev) => [response.data.room || response.data, ...prev]);
        addToast(`Suite "${formData.name}" published to website!`, 'success');
      }

      broadcastUpdate('ROOMS_UPDATED');
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      addToast('Error saving suite: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Room Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await apiClient.delete(`/hotel/rooms/${deleteTarget._id}`);
      setRooms((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      addToast(`Suite "${deleteTarget.name}" deleted.`, 'info');
      broadcastUpdate('ROOMS_UPDATED');
      setDeleteTarget(null);
    } catch (err) {
      addToast('Failed to delete suite: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* ── 1. Search, Availability Filter, View Mode & Add Suite Controls ── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 border border-[#C5A059]/30 shadow-xs">
        
        {/* Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <svg
              className="w-4 h-4 text-[#C5A059] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search suites by name, view, or amenity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 text-xs text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#0F172A] focus:bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A] text-xs cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 text-xs shrink-0">
            <button
              onClick={() => setFilterAvailability('all')}
              className={`px-3 py-1 font-cinzel font-semibold transition cursor-pointer ${
                filterAvailability === 'all'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              All ({rooms.length})
            </button>
            <button
              onClick={() => setFilterAvailability('active')}
              className={`px-3 py-1 font-cinzel font-semibold transition cursor-pointer ${
                filterAvailability === 'active'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Active ({rooms.filter((r) => r.isAvailable).length})
            </button>
            <button
              onClick={() => setFilterAvailability('unavailable')}
              className={`px-3 py-1 font-cinzel font-semibold transition cursor-pointer ${
                filterAvailability === 'unavailable'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              Blocked ({rooms.filter((r) => !r.isAvailable).length})
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          
          {/* Table vs Grid toggle (Desktop) */}
          <div className="hidden md:flex items-center bg-slate-50 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 transition cursor-pointer ${
                viewMode === 'table' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-500 hover:text-[#0F172A]'
              }`}
              title="Table view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 transition cursor-pointer ${
                viewMode === 'cards' ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-500 hover:text-[#0F172A]'
              }`}
              title="Cards view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          {/* Add Suite Button (Dark Slate & Emerald Plus) */}
          <button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-cinzel font-bold bg-[#0F172A] hover:bg-[#1E293B] text-white transition cursor-pointer shadow-sm border border-[#0F172A] whitespace-nowrap active:scale-95"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Suite</span>
          </button>
        </div>
      </div>

      {/* ── 2. Content Area ── */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-300 text-slate-500">
          <svg className="w-12 h-12 mx-auto text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-sm font-cinzel font-bold text-[#0F172A]">No suites match your criteria</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the search filter or publish a new suite.</p>
        </div>
      ) : (
        <>
          {/* ── MOBILE VIEW: 1-Tap Room Occupancy Management Cards ── */}
          <div className="md:hidden space-y-3">
            {filteredRooms.map((room) => {
              const thumbnail =
                room.imageURLs && room.imageURLs.length > 0
                  ? room.imageURLs[0]
                  : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80';

              return (
                <div
                  key={room._id}
                  className="bg-white border border-[#C5A059]/35 p-3.5 shadow-xs space-y-3 relative"
                >
                  {/* Top Bar: Room Thumbnail + Name + View */}
                  <div className="flex items-start gap-3">
                    <img
                      src={thumbnail}
                      alt={room.name}
                      className="w-16 h-16 object-cover border border-[#C5A059]/30 shrink-0"
                      loading="lazy"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-base text-[#0F172A] line-clamp-1">
                          {room.name}
                        </h4>
                        <StatusBadge
                          status={room.isAvailable}
                          type="availability"
                          dueDate={room.unavailableUntil}
                          reason={room.unavailableReason}
                        />
                      </div>

                      <p className="text-[11px] text-[#8C6D2D] font-cinzel font-semibold mt-0.5 line-clamp-1">
                        {room.view || 'Mountain Panorama'}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
                        <span>₹{Number(room.pricePerNight).toLocaleString('en-IN')}/night</span>
                        <span>•</span>
                        <span>{room.capacity?.adults || 2} Adults</span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Tactile Availability Switch Bar */}
                  <div className="bg-[#FAF8F5] p-2.5 border border-[#C5A059]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-cinzel font-bold text-slate-500 block">
                        Live Website Status
                      </span>
                      <span className={`text-xs font-bold ${room.isAvailable ? 'text-emerald-700' : 'text-amber-800'}`}>
                        {room.isAvailable ? '🟢 Open for Booking' : '🔴 Blocked / Sold Out'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(room)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        room.isAvailable ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                      title={room.isAvailable ? 'Tap to mark Unavailable' : 'Tap to mark Available'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          room.isAvailable ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(room)}
                      className="flex-1 py-2 bg-[#FAF8F5] hover:bg-white text-[#0F172A] border border-[#C5A059]/40 text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Edit Rates & Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(room)}
                      className="px-3 py-2 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center justify-center cursor-pointer"
                      title="Delete suite"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* ── DESKTOP VIEW: Table or Cards Grid ── */}
          {viewMode === 'table' ? (
            /* TABLE VIEW */
            <div className="hidden md:block overflow-x-auto border border-slate-300 bg-white shadow-sm">
              <table className="w-full text-left text-xs text-[#0F172A] border-collapse">
                <thead className="bg-slate-50 text-[11px] font-cinzel uppercase text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Suite</th>
                    <th className="py-3 px-4">View Category</th>
                    <th className="py-3 px-4">Capacity</th>
                    <th className="py-3 px-4">Price / Night</th>
                    <th className="py-3 px-4">Live Status</th>
                    <th className="py-3 px-4 text-center">Instant Switch</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredRooms.map((room) => {
                    const thumbnail =
                      room.imageURLs && room.imageURLs.length > 0
                        ? room.imageURLs[0]
                        : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80';

                    return (
                      <tr key={room._id} className="hover:bg-slate-50/80 transition">
                        
                        {/* Thumbnail + Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={thumbnail}
                              alt={room.name}
                              className="w-12 h-12 object-cover border border-[#C5A059]/30 shrink-0"
                              loading="lazy"
                            />
                            <div>
                              <div className="font-serif font-bold text-[#0F172A] text-sm line-clamp-1">
                                {room.name}
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs">
                                {room.description}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* View */}
                        <td className="py-3 px-4">
                          <span className="text-[#8C6D2D] font-cinzel font-semibold line-clamp-1 max-w-[200px]" title={room.view}>
                            {room.view || 'Mountain View'}
                          </span>
                        </td>

                        {/* Capacity */}
                        <td className="py-3 px-4 font-mono text-[#0F172A]">
                          <span>{room.capacity?.adults || 2} Adults</span>
                          {room.capacity?.children > 0 && (
                            <span className="text-slate-500">, {room.capacity.children} Child</span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-mono font-bold text-[#0F172A] text-sm">
                          ₹{Number(room.pricePerNight).toLocaleString('en-IN')}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4">
                          <StatusBadge
                            status={room.isAvailable}
                            type="availability"
                            dueDate={room.unavailableUntil}
                            reason={room.unavailableReason}
                          />
                        </td>

                        {/* Quick Availability Toggle Switch */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleAvailability(room)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              room.isAvailable ? 'bg-emerald-600' : 'bg-slate-400'
                            }`}
                            title={room.isAvailable ? 'Click to set Unavailable' : 'Click to make Available'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                room.isAvailable ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(room)}
                              className="px-3 py-1 text-xs font-cinzel font-semibold text-[#0F172A] hover:bg-[#FAF8F5] border border-slate-300 transition cursor-pointer"
                              title="Edit suite"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(room)}
                              className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
                              title="Delete suite"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* CARDS GRID VIEW */
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => {
                const thumbnail =
                  room.imageURLs && room.imageURLs.length > 0
                    ? room.imageURLs[0]
                    : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80';

                return (
                  <div
                    key={room._id}
                    className="bg-white border border-[#C5A059]/30 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={thumbnail}
                          alt={room.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 right-2.5">
                          <StatusBadge
                            status={room.isAvailable}
                            type="availability"
                            dueDate={room.unavailableUntil}
                            reason={room.unavailableReason}
                          />
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 bg-white/95 px-3 py-1 border border-[#C5A059]/40 text-xs font-mono font-bold text-[#0F172A] shadow-xs">
                          ₹{Number(room.pricePerNight).toLocaleString('en-IN')}{' '}
                          <span className="text-[10px] text-slate-500 font-normal">/ night</span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h4 className="font-serif font-bold text-base text-[#0F172A]">{room.name}</h4>
                        <p className="text-xs text-[#8C6D2D] font-cinzel font-semibold mt-0.5 line-clamp-1">
                          {room.view || 'Mountain Panorama'}
                        </p>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {room.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {(room.amenities || []).slice(0, 4).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-[#FAF8F5] text-[10px] text-[#0F172A] border border-slate-200 font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                          {(room.amenities || []).length > 4 && (
                            <span className="px-2 py-0.5 bg-[#FAF8F5] text-[10px] text-slate-500">
                              +{room.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">{room.isAvailable ? 'Active' : 'Unavailable'}</span>
                        <button
                          onClick={() => handleToggleAvailability(room)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            room.isAvailable ? 'bg-emerald-600' : 'bg-slate-400'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              room.isAvailable ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(room)}
                          className="px-3 py-1 text-xs font-cinzel font-semibold text-[#0F172A] bg-[#FAF8F5] hover:bg-white border border-slate-300 transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(room)}
                          className="p-1 text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── 3. ADD / EDIT SUITE MODAL (Sharp White Card, Champagne Gold Accents) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-[#C5A059]/50 shadow-2xl overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="bg-[#0B1118] px-6 py-4 text-white flex items-center justify-between border-b border-[#C5A059]/40">
              <div>
                <span className="text-[10px] uppercase font-cinzel text-[#DFCA9B] tracking-widest block font-bold">
                  {editingRoom ? 'Modify Inventory' : 'New Resort Inventory'}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                  {editingRoom ? `Edit "${editingRoom.name}"` : 'Add New Luxury Suite'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-[#111827] border border-[#C5A059]/40 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs font-sans">
              
              {/* Name */}
              <div>
                <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                  Suite / Room Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cedar Ridge Suite"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#C5A059]/40 text-sm text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white transition"
                />
              </div>

              {/* View Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                    Himalayan View Orientation *
                  </label>
                  <select
                    value={formData.view}
                    onChange={(e) => setFormData({ ...formData, view: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#C5A059]/40 text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white transition cursor-pointer"
                  >
                    {VIEW_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                    Price per Night (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    placeholder="e.g. 5800"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#C5A059]/40 text-sm text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white font-mono transition"
                  />
                </div>
              </div>

              {/* Capacity Adults & Children */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                    Adults Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#C5A059]/40 text-sm text-[#0F172A] focus:outline-none focus:border-[#C5A059] font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                    Children Capacity
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#C5A059]/40 text-sm text-[#0F172A] focus:outline-none focus:border-[#C5A059] font-mono transition"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                  Suite Description & Panorama Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the timber architecture, private veranda, heated floors, and mountain vistas..."
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#C5A059]/40 text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white leading-relaxed transition"
                />
              </div>

              {/* Amenities Checklist */}
              <div>
                <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-2">
                  Included Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#FAF8F5] border border-slate-200">
                  {AMENITY_OPTIONS.map((item) => {
                    const isChecked = formData.amenities.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleAmenity(item)}
                        className={`flex items-center gap-2 p-2 text-xs font-medium text-left transition cursor-pointer ${
                          isChecked
                            ? 'bg-white text-[#0B1118] border border-[#C5A059] shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-[#0F172A] hover:bg-white border border-transparent'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 flex items-center justify-center text-[10px] shrink-0 border ${
                            isChecked ? 'bg-[#C5A059] text-[#0B1118] border-[#C5A059] font-bold' : 'border-slate-300'
                          }`}
                        >
                          {isChecked ? '✓' : ''}
                        </span>
                        <span className="truncate">{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A]">
                  Suite Photographs
                </label>

                <div className="p-4 bg-[#FAF8F5] border border-dashed border-[#C5A059]/50 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-cinzel file:font-bold file:bg-[#0B1118] file:text-[#D4AF37] hover:file:bg-[#16202E] file:cursor-pointer"
                  />
                </div>

                {filePreviews.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {filePreviews.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="Preview"
                        className="w-16 h-16 object-cover border border-[#C5A059] shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Total Rooms & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                    Total Rooms (Inventory Count)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#C5A059]/40 text-sm text-[#0F172A] focus:outline-none focus:border-[#C5A059] font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                    Property Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Kasar Devi, Almora"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#C5A059]/40 text-sm text-[#0F172A] focus:outline-none focus:border-[#C5A059] transition"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-cinzel font-semibold text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 border border-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-cinzel font-bold text-[#0B1118] bg-[#C5A059] hover:bg-[#D4AF37] border border-[#D4AF37] transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting && (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0B1118]/30 border-t-[#0B1118] animate-spin" />
                  )}
                  <span>{editingRoom ? 'Save Suite Updates' : 'Publish Suite'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── 4. UNAVAILABILITY MODAL (Zero-Radius White Card) ── */}
      {unavailTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs">
          <div className="w-full max-w-md bg-white border border-[#C5A059] shadow-2xl p-6 sm:p-7 text-[#0F172A]">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-[#C5A059]/30 mb-4">
              <div>
                <span className="text-[10px] uppercase font-cinzel tracking-[0.2em] text-[#8C6D2D] font-bold block mb-0.5">
                  Inventory Lock
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0F172A]">
                  Mark "{unavailTarget.name}" Unavailable
                </h3>
              </div>
              <button
                onClick={() => { setUnavailTarget(null); setUnavailUntil(''); setUnavailReason(''); }}
                className="text-slate-400 hover:text-[#0F172A] p-1 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 leading-relaxed">
                <strong>Notice:</strong> This suite will show as <strong>"Sold Out / Unavailable"</strong> on the website so customers know it is booked.
              </div>

              <div>
                <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                  Available Again On (Due Date)
                </label>
                <input
                  type="date"
                  value={unavailUntil}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setUnavailUntil(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059] transition cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-cinzel font-bold text-[#0F172A] mb-1.5">
                  Reason Displayed to Guests
                </label>
                <select
                  value={unavailReason}
                  onChange={(e) => setUnavailReason(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF8F5] border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059] transition cursor-pointer"
                >
                  <option value="">Select a reason...</option>
                  <option value="All rooms booked for the season">All rooms booked for the season</option>
                  <option value="Fully booked">Fully booked</option>
                  <option value="Under renovation">Under renovation</option>
                  <option value="Seasonal maintenance">Seasonal maintenance</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setUnavailTarget(null); setUnavailUntil(''); setUnavailReason(''); }}
                  disabled={isTogglingAvail}
                  className="px-4 py-2 text-xs font-cinzel font-semibold text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 border border-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUnavailable}
                  disabled={isTogglingAvail}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-cinzel font-bold text-white bg-amber-700 hover:bg-amber-800 border border-amber-800 transition cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isTogglingAvail && (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  )}
                  <span>Lock Suite</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── 5. DELETE CONFIRM DIALOG ── */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Suite"
        message={`Are you sure you want to permanently remove "${deleteTarget?.name}"? Guests will no longer be able to view or reserve this suite.`}
        confirmText="Delete Suite"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};

export default RoomManager;
