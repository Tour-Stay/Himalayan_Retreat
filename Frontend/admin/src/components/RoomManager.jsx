import { useState, useMemo } from 'react';
import { apiClient } from '@shared';
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

export const RoomManager = ({ rooms, setRooms, onRefresh }) => {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all' | 'active' | 'disabled'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        (filterAvailability === 'disabled' && !room.isAvailable);

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
    const previews = files.map((f) => URL.createObjectURL(f));
    setFilePreviews(previews);
  };

  // Toggle Room Availability
  const handleToggleAvailability = async (room) => {
    const originalStatus = Boolean(room.isAvailable);
    // Optimistic UI update
    setRooms((prev) =>
      prev.map((r) => (r._id === room._id ? { ...r, isAvailable: !originalStatus } : r))
    );

    try {
      const res = await apiClient.put(`/hotel/rooms/${room._id}/toggle`);
      addToast(
        `Suite "${room.name}" is now ${res.data?.room?.isAvailable ? 'Active' : 'Disabled'}`,
        'success'
      );
    } catch (err) {
      // Revert optimistic update
      setRooms((prev) =>
        prev.map((r) => (r._id === room._id ? { ...r, isAvailable: originalStatus } : r))
      );
      addToast('Failed to toggle room availability: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  // Submit Add or Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name.trim());
      formPayload.append('description', formData.description.trim());
      formPayload.append('pricePerNight', Number(formData.pricePerNight));
      formPayload.append('view', formData.view);
      formPayload.append(
        'capacity',
        JSON.stringify({
          adults: Number(formData.adults),
          children: Number(formData.children),
        })
      );
      formPayload.append('amenities', JSON.stringify(formData.amenities));

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formPayload.append('images', file);
        });
      } else if (formData.fallbackImageUrl && !editingRoom) {
        formPayload.append('imageURLs', JSON.stringify([formData.fallbackImageUrl]));
      }

      if (editingRoom) {
        const res = await apiClient.put(`/hotel/rooms/${editingRoom._id}`, formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setRooms((prev) =>
          prev.map((r) => (r._id === editingRoom._id ? (res.data?.room || res.data) : r))
        );
        addToast(`Suite "${formData.name}" updated successfully!`, 'success');
      } else {
        const res = await apiClient.post('/hotel/rooms', formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const createdRoom = res.data?.room || res.data;
        setRooms((prev) => [createdRoom, ...prev]);
        addToast(`New suite "${formData.name}" published!`, 'success');
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      console.error('Room save error:', err);
      addToast(
        err.response?.data?.message || 'Failed to save suite. Please check inputs.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Execute Deletion
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await apiClient.delete(`/hotel/rooms/${deleteTarget._id}`);
      setRooms((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      addToast(`Suite "${deleteTarget.name}" deleted.`, 'info');
      setDeleteTarget(null);
    } catch (err) {
      addToast('Failed to delete room: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FDFBF7] p-3.5 sm:p-4 rounded-2xl border border-[#C5A059]/30 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search bar */}
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
              className="w-full pl-9 pr-3 py-2 bg-[#FAF6EF] border border-[#C5A059]/30 rounded-xl text-xs text-[#2C2523] placeholder-[#66605B] focus:outline-none focus:border-[#7C1D23] transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66605B] hover:text-[#2C2523] text-xs cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#FAF6EF] p-1 rounded-xl border border-[#C5A059]/25 text-xs">
            <button
              onClick={() => setFilterAvailability('all')}
              className={`px-3 py-1 rounded-lg font-cinzel font-semibold transition cursor-pointer ${
                filterAvailability === 'all'
                  ? 'bg-[#7C1D23] text-[#FDFBF7] shadow-2xs'
                  : 'text-[#5C5350] hover:text-[#2C2523]'
              }`}
            >
              All ({rooms.length})
            </button>
            <button
              onClick={() => setFilterAvailability('active')}
              className={`px-3 py-1 rounded-lg font-cinzel font-semibold transition cursor-pointer ${
                filterAvailability === 'active'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-[#5C5350] hover:text-[#2C2523]'
              }`}
            >
              Active ({rooms.filter((r) => r.isAvailable).length})
            </button>
            <button
              onClick={() => setFilterAvailability('disabled')}
              className={`px-3 py-1 rounded-lg font-cinzel font-semibold transition cursor-pointer ${
                filterAvailability === 'disabled'
                  ? 'bg-[#5C5350] text-white shadow-2xs'
                  : 'text-[#5C5350] hover:text-[#2C2523]'
              }`}
            >
              Disabled ({rooms.filter((r) => !r.isAvailable).length})
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Table vs Grid toggle */}
          <div className="flex items-center bg-[#FAF6EF] p-1 rounded-xl border border-[#C5A059]/25">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'table' ? 'bg-[#FDFBF7] text-[#7C1D23] shadow-2xs' : 'text-[#66605B] hover:text-[#2C2523]'
              }`}
              title="Table view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                viewMode === 'cards' ? 'bg-[#FDFBF7] text-[#7C1D23] shadow-2xs' : 'text-[#66605B] hover:text-[#2C2523]'
              }`}
              title="Cards view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          {/* Add Suite Button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-cinzel font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition cursor-pointer shadow-xs border border-[#C5A059]/40 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Suite</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-16 bg-[#FDFBF7] rounded-3xl border border-[#C5A059]/30 text-[#66605B]">
          <svg className="w-12 h-12 mx-auto text-[#C5A059]/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-sm font-cinzel font-semibold text-[#2C2523]">No suites match your criteria</p>
          <p className="text-xs text-[#66605B] mt-1">Try resetting the search filter or publish a new suite.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-[#C5A059]/30 bg-[#FDFBF7] shadow-xs">
          <table className="w-full text-left text-xs text-[#2C2523] border-collapse">
            <thead className="bg-[#FAF6EF] text-[11px] font-cinzel uppercase text-[#2C2523] border-b border-[#C5A059]/30">
              <tr>
                <th className="py-3 px-4">Suite</th>
                <th className="py-3 px-4">View Category</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Price / Night</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Live Toggle</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5A059]/15 font-sans">
              {filteredRooms.map((room) => {
                const thumbnail =
                  room.imageURLs && room.imageURLs.length > 0
                    ? room.imageURLs[0]
                    : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=300&q=80';

                return (
                  <tr key={room._id} className="hover:bg-[#FAF6EF]/60 transition">
                    {/* Thumbnail + Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={thumbnail}
                          alt={room.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#C5A059]/30 shrink-0"
                          loading="lazy"
                        />
                        <div>
                          <div className="font-serif font-bold text-[#2C2523] text-sm line-clamp-1">
                            {room.name}
                          </div>
                          <div className="text-[11px] text-[#66605B] line-clamp-1 max-w-xs">
                            {room.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* View */}
                    <td className="py-3 px-4">
                      <span className="text-[#5C5350] font-medium line-clamp-1 max-w-[200px]" title={room.view}>
                        {room.view || 'Standard Ridge View'}
                      </span>
                    </td>

                    {/* Capacity */}
                    <td className="py-3 px-4 font-mono text-[#2C2523]">
                      <span>{room.capacity?.adults || 2} Adults</span>
                      {room.capacity?.children > 0 && (
                        <span className="text-[#66605B]">, {room.capacity.children} Child</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-bold text-[#7C1D23] text-sm">
                      ₹{Number(room.pricePerNight).toLocaleString('en-IN')}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <StatusBadge status={room.isAvailable} type="availability" />
                    </td>

                    {/* Quick Availability Toggle Switch */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleAvailability(room)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          room.isAvailable ? 'bg-emerald-600' : 'bg-stone-300'
                        }`}
                        title={room.isAvailable ? 'Click to disable' : 'Click to enable'}
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
                          className="px-3 py-1 rounded-lg text-xs font-cinzel font-semibold text-[#2C2523] hover:text-[#7C1D23] bg-[#FAF6EF] hover:bg-white border border-[#C5A059]/40 transition cursor-pointer"
                          title="Edit suite"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(room)}
                          className="p-1 rounded-lg text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => {
            const thumbnail =
              room.imageURLs && room.imageURLs.length > 0
                ? room.imageURLs[0]
                : 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={room._id}
                className="bg-[#FDFBF7] border border-[#C5A059]/30 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
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
                      <StatusBadge status={room.isAvailable} type="availability" />
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 bg-[#FAF6EF]/95 backdrop-blur-xs px-3 py-1 rounded-xl border border-[#C5A059]/40 text-xs font-mono font-bold text-[#7C1D23] shadow-xs">
                      ₹{Number(room.pricePerNight).toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-[#66605B] font-normal">/ night</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-serif font-bold text-base text-[#2C2523]">{room.name}</h4>
                    <p className="text-xs text-[#C5A059] font-cinzel font-semibold mt-0.5 line-clamp-1">
                      {room.view || 'Standard Ridge View'}
                    </p>
                    <p className="text-xs text-[#5C5350] mt-2 line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {(room.amenities || []).slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#FAF6EF] text-[10px] text-[#2C2523] border border-[#C5A059]/30 font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {(room.amenities || []).length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF6EF] text-[10px] text-[#66605B]">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#C5A059]/20 mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#5C5350]">Active</span>
                    <button
                      onClick={() => handleToggleAvailability(room)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        room.isAvailable ? 'bg-emerald-600' : 'bg-stone-300'
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
                      className="px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-semibold text-[#2C2523] bg-[#FAF6EF] hover:bg-white border border-[#C5A059]/40 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(room)}
                      className="p-1.5 rounded-xl text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
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

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FDFBF7] border border-[#C5A059]/40 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-[#2C2523] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#C5A059]/30 mb-6">
              <div>
                <span className="text-[10px] uppercase font-cinzel tracking-[0.2em] text-[#C5A059] font-bold block mb-0.5">
                  Room Management
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2523]">
                  {editingRoom ? 'Edit Suite Details' : 'Publish New Suite'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#66605B] hover:text-[#2C2523] p-2 rounded-xl text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Suite Name */}
              <div>
                <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                  Suite / Room Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cedar Ridge Suite"
                  className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] transition"
                />
              </div>

              {/* View Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                    Himalayan View Orientation *
                  </label>
                  <select
                    value={formData.view}
                    onChange={(e) => setFormData({ ...formData, view: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] transition cursor-pointer"
                  >
                    {VIEW_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                    Price per Night (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    step={100}
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    placeholder="e.g. 5800"
                    className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] font-mono transition"
                  />
                </div>
              </div>

              {/* Capacity Adults & Children */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                    Adults Capacity
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                    Children Capacity
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] font-mono transition"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                  Suite Description & Himalayan Panorama Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the timber architecture, private veranda, heated floors, and mountain vistas..."
                  className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] leading-relaxed transition"
                />
              </div>

              {/* Amenities Checklist */}
              <div>
                <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-2">
                  Included Luxury Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-[#FAF6EF] rounded-2xl border border-[#C5A059]/30">
                  {AMENITY_OPTIONS.map((item) => {
                    const isChecked = formData.amenities.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleAmenity(item)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-left transition cursor-pointer ${
                          isChecked
                            ? 'bg-[#FDFBF7] text-[#7C1D23] border border-[#C5A059]/60 shadow-2xs font-semibold'
                            : 'text-[#5C5350] hover:text-[#2C2523] hover:bg-white border border-transparent'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] shrink-0 border ${
                            isChecked ? 'bg-[#7C1D23] text-white border-[#7C1D23] font-bold' : 'border-[#C5A059]/50'
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

              {/* Image Upload / Fallback URL */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523]">
                  Suite Photos (Cloudinary CDN upload + Base64 fallback)
                </label>

                <div className="p-4 bg-[#FAF6EF] border border-dashed border-[#C5A059]/50 rounded-2xl text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-[#5C5350] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-cinzel file:font-semibold file:bg-[#7C1D23] file:text-[#FDFBF7] hover:file:bg-[#5C151A] file:cursor-pointer"
                  />
                  <p className="text-[11px] text-[#66605B] mt-2">
                    Select up to 10 photos. If editing without selecting new files, existing photos are preserved.
                  </p>
                </div>

                {/* Previews if selected */}
                {filePreviews.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {filePreviews.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-[#C5A059] shrink-0"
                      />
                    ))}
                  </div>
                )}

                {/* Fallback image URL if adding without file */}
                {!editingRoom && selectedFiles.length === 0 && (
                  <div>
                    <label className="block text-[11px] text-[#66605B] mb-1">
                      Or specify an image URL directly:
                    </label>
                    <input
                      type="url"
                      value={formData.fallbackImageUrl}
                      onChange={(e) => setFormData({ ...formData, fallbackImageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-xs text-[#2C2523] font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#C5A059]/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-full text-xs font-cinzel font-semibold text-[#5C5350] hover:text-[#2C2523] hover:bg-[#FAF6EF] border border-[#C5A059]/40 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-cinzel font-semibold text-[#FDFBF7] bg-[#7C1D23] hover:bg-[#5C151A] transition cursor-pointer shadow-xs border border-[#C5A059]/40 disabled:opacity-50"
                >
                  {isSubmitting && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  <span>{editingRoom ? 'Save Changes' : 'Publish Suite'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
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
