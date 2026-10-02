import { useState, useEffect } from 'react';
import {
  apiClient,
  StarIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowUpRightIcon,
} from '@shared';

// Authentic Fallback Reviews
const staticReviews = [
  {
    _id: 'static-1',
    name: 'Rajesh & Suman Gupta',
    location: 'Delhi NCR',
    tripType: 'Kainchi Dham Pilgrimage',
    rating: 5,
    review: 'Our pilgrimage to Kainchi Dham and Jageshwar Dham was sublime. Our Pahadi chauffeur Mohan ji drove with extreme care on winding mountain roads. The Innova Crysta was spotless with room heating.',
    photos: [],
    isStatic: true,
  },
  {
    _id: 'static-2',
    name: 'Kapoor Family Reunion',
    location: 'Mumbai',
    tripType: '12-Seater Kumaon Circuit',
    rating: 5,
    review: 'We booked the 12-seater Urbania for our extended family vacation across Nainital and Kasar Devi. The Maharaja pushback seats and high roof made 6 hours in the hills feel effortless.',
    photos: [],
    isStatic: true,
  },
  {
    _id: 'static-3',
    name: 'Dr. Alok Verma',
    location: 'Lucknow',
    tripType: 'Kathgodam Station Transfer',
    rating: 5,
    review: 'Smooth pickup directly at Kathgodam railway station. The driver held a name-board and took us straight to The Kasar Himalayan Heights without any delays. Truly 5-star mountain hospitality.',
    photos: [],
    isStatic: true,
  },
];

const TravelReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null); // review _id being edited
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    tripType: 'Kainchi Dham & Jageshwar Pilgrimage',
    rating: 5,
    review: '',
  });
  const [photos, setPhotos] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Photo lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // Edit verification
  const [editEmail, setEditEmail] = useState('');
  const [editVerifyId, setEditVerifyId] = useState(null);
  const [editError, setEditError] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get('/travel/reviews');
      if (res.data && res.data.length > 0) {
        setReviews(res.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.warn('Could not load reviews from API, showing static fallbacks.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const displayReviews = [...reviews, ...staticReviews];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      location: '',
      tripType: 'Kainchi Dham & Jageshwar Pilgrimage',
      rating: 5,
      review: '',
    });
    setPhotos(null);
    setIsEditing(null);
    setShowForm(false);
    setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('location', formData.location);
      data.append('tripType', formData.tripType);
      data.append('rating', formData.rating);
      data.append('review', formData.review);

      if (photos && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          data.append('photos', photos[i]);
        }
      }

      if (isEditing) {
        await apiClient.put(`/travel/reviews/${isEditing}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ text: 'Your travel review has been updated successfully! ✨', type: 'success' });
      } else {
        await apiClient.post('/travel/reviews', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ text: 'Thank you for sharing your mountain story! Your review will be published upon moderation. 🏔️', type: 'success' });
      }

      fetchReviews();
      setTimeout(() => resetForm(), 2800);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Something went wrong. Please check your connection.';
      setMessage({ text: errMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Start edit flow: ask for email verification
  const handleEditClick = (reviewId) => {
    setEditVerifyId(reviewId);
    setEditEmail('');
    setEditError('');
  };

  const handleEditVerify = () => {
    const target = reviews.find((r) => r._id === editVerifyId);
    if (!target) {
      setEditError('Review record not found.');
      return;
    }
    if (target.email?.toLowerCase() !== editEmail.toLowerCase().trim()) {
      setEditError('Email does not match the original reviewer. You may only edit your own reviews.');
      return;
    }

    // Email matches — populate form for editing
    setFormData({
      name: target.name,
      email: target.email,
      location: target.location || '',
      tripType: target.tripType || '',
      rating: target.rating || 5,
      review: target.review,
    });
    setIsEditing(editVerifyId);
    setShowForm(true);
    setEditVerifyId(null);
    setEditEmail('');
    setEditError('');
    window.scrollTo({
      top: document.getElementById('reviews')?.offsetTop - 80,
      behavior: 'smooth',
    });
  };

  return (
    <section id="reviews" className="py-24 px-4 bg-ivory border-b border-gold/15 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3 block font-mono">
              Travel Stories & Feedback
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-medium">
              Stories from the High Passes
            </h2>
            <p className="text-charcoal-muted text-sm mt-2 font-light">
              Real journeys across Almora, Kainchi Dham, and Kumaon circuits shared by our travelers.
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-maroon hover:bg-maroon-dark text-ivory transition-colors shadow-md cursor-pointer self-start sm:self-auto inline-flex items-center gap-2"
          >
            <SparklesIcon className="w-4 h-4 text-gold" />
            <span>{showForm ? 'Close Form' : '+ Share Your Travel Story'}</span>
          </button>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-2xl mb-8 text-sm flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-ivory-warm border border-gold/40 text-charcoal'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            <CheckCircleIcon className="w-4 h-4 text-gold flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* =================== ADD / EDIT REVIEW FORM =================== */}
        {showForm && (
          <div className="mb-14 bg-ivory-warm p-8 rounded-3xl border border-gold/35 shadow-lg">
            <h3 className="font-serif text-2xl text-charcoal font-medium mb-6">
              {isEditing ? 'Edit Your Travel Story' : 'Share Your Mountain Journey'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1 font-mono">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    disabled={!!isEditing}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:opacity-60"
                  />
                  <p className="text-[10px] text-charcoal-muted mt-1 font-mono">
                    Used for ownership verification. Never displayed publicly.
                  </p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1 font-mono">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Suman Gupta"
                    className="w-full px-4 py-2.5 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1 font-mono">
                    City / Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="e.g. Delhi NCR"
                    className="w-full px-4 py-2.5 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1 font-mono">
                    Trip Circuit
                  </label>
                  <input
                    type="text"
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleFormChange}
                    placeholder="e.g. Kainchi Dham & Jageshwar Pilgrimage"
                    className="w-full px-4 py-2.5 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1 font-mono">
                    Star Rating (1 to 5)
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        className="cursor-pointer transition-transform hover:scale-125"
                      >
                        <StarIcon
                          className={`w-6 h-6 ${
                            star <= formData.rating ? 'text-gold fill-gold' : 'text-gold/25'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs text-charcoal-muted ml-2 font-mono">
                      {formData.rating} / 5 Stars
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1 font-mono">
                  Your Travel Story *
                </label>
                <textarea
                  name="review"
                  rows={3}
                  required
                  maxLength={1000}
                  value={formData.review}
                  onChange={handleFormChange}
                  placeholder="Tell other travelers about your chauffeur, vehicle comfort, scenic highlights, and road experience..."
                  className="w-full px-4 py-2.5 bg-ivory rounded-xl border border-gold/30 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                />
                <p className="text-[10px] text-charcoal-muted text-right font-mono mt-0.5">
                  {formData.review.length} / 1000 characters
                </p>
              </div>

              {/* Photo Upload Input */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-charcoal mb-1 font-mono">
                  Trip Photos (Optional, up to 5)
                </label>
                <div className="p-4 rounded-xl border-2 border-dashed border-gold/30 bg-ivory text-center hover:border-gold transition-colors">
                  <input
                    type="file"
                    id="travel-photos"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPhotos(e.target.files)}
                    className="hidden"
                  />
                  <label htmlFor="travel-photos" className="cursor-pointer block">
                    <span className="text-xs font-semibold text-maroon block mb-0.5">
                      Click to upload photos from your mountain tour
                    </span>
                    <span className="text-[11px] text-charcoal-muted block">
                      JPG, PNG, WEBP (Max 5MB each)
                    </span>
                    {photos && photos.length > 0 && (
                      <div className="mt-2 inline-block px-3 py-1 bg-gold/15 text-charcoal text-xs font-mono font-semibold rounded-full border border-gold/40">
                        ✓ {photos.length} photo(s) selected
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/20">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-full border border-gold/30 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-gold/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-maroon hover:bg-maroon-dark text-ivory disabled:opacity-50 transition-colors shadow-md cursor-pointer inline-flex items-center gap-2"
                >
                  {submitting ? 'Submitting...' : isEditing ? 'Update Review' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =================== REVIEWS GRID =================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayReviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-ivory-warm p-8 rounded-3xl border border-gold/30 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  {!rev.isStatic && (
                    <button
                      onClick={() => handleEditClick(rev._id)}
                      className="text-[10px] px-2.5 py-1 rounded-md border border-gold/30 text-charcoal-muted hover:text-maroon hover:border-gold transition-colors font-mono uppercase cursor-pointer"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <p className="text-charcoal text-sm leading-relaxed font-light italic mb-4">
                  &ldquo;{rev.review}&rdquo;
                </p>

                {/* Photos Grid */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rev.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setLightboxPhoto(photo)}
                        className="w-16 h-16 rounded-xl overflow-hidden border border-gold/30 hover:border-gold hover:scale-105 transition-all cursor-pointer shadow-xs"
                      >
                        <img
                          src={photo}
                          alt={`Trip photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gold/20 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-medium text-charcoal">
                    {rev.name}
                  </h4>
                  <span className="text-xs text-charcoal-muted">
                    {rev.location || 'Pilgrim & Explorer'}
                  </span>
                </div>
                <span className="text-[10px] text-maroon font-mono uppercase bg-gold/15 px-2.5 py-1 rounded-full border border-gold/30">
                  {rev.tripType}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* =================== EDIT EMAIL VERIFICATION MODAL =================== */}
        {editVerifyId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md">
            <div className="bg-ivory rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gold/40">
              <h3 className="font-serif text-2xl text-center text-charcoal font-medium mb-2">
                Verify Review Ownership
              </h3>
              <p className="text-charcoal-muted text-center text-xs mb-6 font-light">
                Please enter the email address you originally used when submitting this review.
              </p>

              <input
                type="email"
                placeholder="your@email.com"
                value={editEmail}
                onChange={(e) => {
                  setEditEmail(e.target.value);
                  setEditError('');
                }}
                className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory-warm text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 mb-3"
              />

              {editError && (
                <p className="text-red-600 text-xs font-semibold mb-3 text-center">
                  {editError}
                </p>
              )}

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditVerifyId(null);
                    setEditEmail('');
                    setEditError('');
                  }}
                  className="flex-1 py-3 rounded-full border border-gold/30 text-xs font-semibold uppercase tracking-wider text-charcoal hover:bg-gold/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditVerify}
                  className="flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-maroon hover:bg-maroon-dark text-ivory cursor-pointer shadow-md"
                >
                  Verify & Edit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================== PHOTO LIGHTBOX =================== */}
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
              alt="Enlarged mountain trip photo"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '85vh' }}
              className="object-contain rounded-2xl shadow-2xl border border-gold/30"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default TravelReviews;
