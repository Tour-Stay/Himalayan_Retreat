import { useState, useMemo } from 'react';
import { apiClient, broadcastUpdate } from '@shared';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './Toast';

export const TourManager = ({ tours, setTours, onRefresh }) => {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    destination: 'Kainchi Dham & Jageshwar Pilgrimage',
    durationDays: 3,
    durationNights: 2,
    pricePerPerson: 8500,
    itineraryText: 'Day 1: Kathgodam pickup & Kainchi Dham Baba Neem Karoli Ashram.\nDay 2: Ancient Jageshwar Dham Shiva Temples & Almora Heritage.\nDay 3: Kasar Devi sunrise contemplation & scenic return drop.',
    inclusionsText: 'Heated SUV Chauffeur, Daily Breakfast, Temple Liaison, Fuel & Mountain Tolls',
    fallbackImageUrl: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered tours
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const title = tour.title || '';
      const dest = tour.destination || '';
      return (
        title.toLowerCase().includes(search.toLowerCase()) ||
        dest.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [tours, search]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingTour(null);
    setFormData({
      title: '',
      destination: 'Kainchi Dham & Jageshwar Pilgrimage',
      durationDays: 3,
      durationNights: 2,
      pricePerPerson: 8500,
      itineraryText: 'Day 1: Kathgodam pickup & Kainchi Dham Baba Neem Karoli Ashram.\nDay 2: Ancient Jageshwar Dham Shiva Temples & Almora Heritage.\nDay 3: Kasar Devi sunrise contemplation & scenic return drop.',
      inclusionsText: 'Heated SUV Chauffeur, Daily Breakfast, Temple Liaison, Fuel & Mountain Tolls',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    });
    setSelectedFiles([]);
    setFilePreviews([]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (tour) => {
    setEditingTour(tour);

    let itinText = '';
    if (Array.isArray(tour.itinerary)) {
      itinText = tour.itinerary
        .map((it) => (typeof it === 'object' ? `Day ${it.day}: ${it.description}` : it))
        .join('\n');
    } else if (typeof tour.itinerary === 'string') {
      itinText = tour.itinerary;
    }

    let inclText = '';
    if (Array.isArray(tour.inclusions)) {
      inclText = tour.inclusions.join(', ');
    } else if (typeof tour.inclusions === 'string') {
      inclText = tour.inclusions;
    }

    setFormData({
      title: tour.title || '',
      destination: tour.destination || '',
      durationDays: tour.duration?.days || 2,
      durationNights: tour.duration?.nights || 1,
      pricePerPerson: tour.pricePerPerson || 4500,
      itineraryText: itinText,
      inclusionsText: inclText,
      fallbackImageUrl: (tour.imageURLs && tour.imageURLs[0]) || '',
    });
    setSelectedFiles([]);
    setFilePreviews([]);
    setIsModalOpen(true);
  };

  // File change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setFilePreviews(previews);
  };

  // Submit Add or Edit
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title.trim());
      formPayload.append('destination', formData.destination.trim());
      formPayload.append('pricePerPerson', Number(formData.pricePerPerson));

      formPayload.append(
        'duration',
        JSON.stringify({
          days: Number(formData.durationDays),
          nights: Number(formData.durationNights),
        })
      );

      const itineraryLines = formData.itineraryText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const parsedItinerary = itineraryLines.map((line, idx) => {
        const match = line.match(/^Day\s*(\d+)[:\-\s]*(.+)$/i);
        if (match) {
          return { day: Number(match[1]), description: match[2].trim() };
        }
        return { day: idx + 1, description: line };
      });
      formPayload.append('itinerary', JSON.stringify(parsedItinerary));

      const parsedInclusions = formData.inclusionsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      formPayload.append('inclusions', JSON.stringify(parsedInclusions));

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formPayload.append('images', file);
        });
      } else if (formData.fallbackImageUrl && !editingTour) {
        formPayload.append('imageURLs', JSON.stringify([formData.fallbackImageUrl]));
      }

      if (editingTour) {
        const res = await apiClient.put(`/travel/tours/${editingTour._id}`, formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const updatedTour = res.data?.tour || res.data;
        setTours((prev) => prev.map((t) => (t._id === editingTour._id ? updatedTour : t)));
        addToast(`Tour package "${formData.title}" updated!`, 'success');
      } else {
        const res = await apiClient.post('/travel/tours', formPayload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const createdTour = res.data?.tour || res.data;
        setTours((prev) => [createdTour, ...prev]);
        addToast(`New tour package "${formData.title}" published!`, 'success');
      }

      setIsModalOpen(false);
      onRefresh();
      broadcastUpdate('tours');
    } catch (err) {
      console.error('Tour save error:', err);
      addToast(
        err.response?.data?.message || 'Failed to save tour package. Check inputs.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await apiClient.delete(`/travel/tours/${deleteTarget._id}`);
      setTours((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      addToast(`Tour "${deleteTarget.title}" deleted.`, 'info');
      setDeleteTarget(null);
      broadcastUpdate('tours');
    } catch (err) {
      addToast('Failed to delete tour: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FDFBF7] p-3.5 sm:p-4 rounded-2xl border border-[#C5A059]/30 shadow-xs">
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
            placeholder="Search tours by circuit, shrine, or destination..."
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

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-cinzel font-semibold bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] transition cursor-pointer shadow-xs border border-[#C5A059]/40 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Tour Package</span>
        </button>
      </div>

      {/* Tours Grid */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-16 bg-[#FDFBF7] rounded-2xl border border-[#C5A059]/30 text-[#66605B]">
          <svg className="w-12 h-12 mx-auto text-[#C5A059]/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-cinzel font-semibold text-[#2C2523]">No tour packages found</p>
          <p className="text-xs text-[#66605B] mt-1">Create your first Kumaon or temple circuit package.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTours.map((tour) => {
            const thumbnail =
              tour.imageURLs && tour.imageURLs.length > 0
                ? tour.imageURLs[0]
                : 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80';

            const days = tour.duration?.days || 1;
            const nights = tour.duration?.nights || 0;

            return (
              <div
                key={tour._id}
                className="bg-[#FDFBF7] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={thumbnail}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#FAF6EF]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 text-[10px] font-mono text-[#2C2523]">
                      📸 {tour.imageURLs?.length || 1} {tour.imageURLs?.length === 1 ? 'Photo' : 'Photos'}
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 bg-[#FAF6EF]/95 backdrop-blur-xs px-3 py-1 rounded-xl border border-[#C5A059]/40 text-xs font-mono font-bold text-[#7C1D23] shadow-xs">
                      ₹{Number(tour.pricePerPerson || 0).toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-[#66605B] font-normal">/ person</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#C5A059] font-cinzel font-semibold mb-1">
                      <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {days}D / {nights}N</span>
                      <span>•</span>
                      <span className="line-clamp-1">{tour.destination}</span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#2C2523] line-clamp-1">
                      {tour.title}
                    </h4>

                    {/* Itinerary Preview */}
                    <div className="mt-3 text-xs text-[#5C5350] space-y-1">
                      {(tour.itinerary || []).slice(0, 2).map((item, idx) => (
                        <div key={idx} className="line-clamp-1">
                          <span className="text-[#2C2523] font-semibold">Day {item.day || idx + 1}:</span>{' '}
                          {item.description || item}
                        </div>
                      ))}
                      {(tour.itinerary || []).length > 2 && (
                        <div className="text-[11px] text-[#C5A059] font-cinzel italic">
                          +{tour.itinerary.length - 2} more days in itinerary
                        </div>
                      )}
                    </div>

                    {/* Inclusions */}
                    {tour.inclusions && tour.inclusions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tour.inclusions.slice(0, 3).map((inc, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#FAF6EF] text-[10px] text-[#2C2523] border border-[#C5A059]/30 font-medium"
                          >
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#C5A059]/20 mt-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-[#66605B] font-mono">
                    ID: {tour._id.slice(-6)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(tour)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-cinzel font-semibold text-[#2C2523] bg-[#FAF6EF] hover:bg-white border border-[#C5A059]/40 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(tour)}
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FDFBF7] border border-[#C5A059]/40 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-[#2C2523] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#C5A059]/30 mb-6">
              <div>
                <span className="text-[10px] uppercase font-cinzel tracking-[0.2em] text-[#C5A059] font-bold block mb-0.5">
                  Package Management
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2C2523]">
                  {editingTour ? 'Edit Tour Package' : 'Create Tour Package'}
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
              {/* Title */}
              <div>
                <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 3-Day Kainchi Dham & Jageshwar Spiritual Expedition"
                  className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] transition"
                />
              </div>

              {/* Destination & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                    Circuit / Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="e.g. Kainchi Dham & Jageshwar"
                    className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                    Price per Person (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    step={100}
                    value={formData.pricePerPerson}
                    onChange={(e) => setFormData({ ...formData, pricePerPerson: e.target.value })}
                    placeholder="e.g. 8500"
                    className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] font-mono transition"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] font-mono transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                    Duration (Nights)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={formData.durationNights}
                    onChange={(e) => setFormData({ ...formData, durationNights: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] font-mono transition"
                  />
                </div>
              </div>

              {/* Itinerary Textarea */}
              <div>
                <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                  Day-by-Day Itinerary (one line per day) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.itineraryText}
                  onChange={(e) => setFormData({ ...formData, itineraryText: e.target.value })}
                  placeholder="Day 1: Kathgodam pickup & Kainchi Dham Baba Neem Karoli Ashram.&#10;Day 2: Jageshwar Dham Shiva Temples.&#10;Day 3: Kasar Devi sunrise & drop."
                  className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] leading-relaxed transition"
                />
              </div>

              {/* Inclusions */}
              <div>
                <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523] mb-1.5">
                  Key Inclusions (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.inclusionsText}
                  onChange={(e) => setFormData({ ...formData, inclusionsText: e.target.value })}
                  placeholder="e.g. Heated SUV Chauffeur, Daily Breakfast, Temple Liaison, Fuel & Tolls"
                  className="w-full px-4 py-2.5 bg-[#FAF6EF] border border-[#C5A059]/35 rounded-xl text-sm text-[#2C2523] focus:outline-none focus:border-[#7C1D23] transition"
                />
              </div>

              {/* Photos Upload */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs uppercase font-cinzel font-semibold text-[#2C2523]">
                  Tour Scenic Photos (Cloudinary CDN upload + Base64 fallback)
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
                    Select high-resolution circuit landscape images.
                  </p>
                </div>

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

                {!editingTour && selectedFiles.length === 0 && (
                  <div>
                    <label className="block text-[11px] text-[#66605B] mb-1">
                      Or image URL directly:
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

              {/* Actions */}
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
                  <span>{editingTour ? 'Save Changes' : 'Publish Tour'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Tour Package"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmText="Delete Tour"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default TourManager;
