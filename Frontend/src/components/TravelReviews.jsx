import { useState, useEffect } from 'react';
import axios from 'axios';
import { StarIcon, ArrowUpRightIcon, SparklesIcon, CheckCircleIcon } from './Icons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Static fallback reviews (displayed when no dynamic reviews exist)
const staticReviews = [
  {
    _id: 'static-1',
    name: 'Rajesh & Suman Gupta',
    location: 'Delhi NCR',
    tripType: 'Kainchi Dham Pilgrimage',
    rating: 5,
    review: 'Our trip to Kainchi Dham and Jageshwar Dham was sublime. Our driver Mohan ji drove with extreme care on winding mountain roads. The Innova Crysta was spotless with room heating.',
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
    tripType: '',
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

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/travel/reviews`);
      if (res.data && res.data.length > 0) {
        setReviews(res.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.warn('Could not load reviews from API, showing static reviews.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Combined reviews: dynamic first, then static
  const displayReviews = [...reviews, ...staticReviews];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (star) => {
    setFormData((prev) => ({ ...prev, rating: star }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', location: '', tripType: '', rating: 5, review: '' });
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
        await axios.put(`${API_URL}/travel/reviews/${isEditing}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ text: 'Your review has been updated successfully! 🎉', type: 'success' });
      } else {
        await axios.post(`${API_URL}/travel/reviews`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ text: 'Thank you for sharing your mountain travel story! 🏔️', type: 'success' });
      }

      fetchReviews();
      setTimeout(() => resetForm(), 2500);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage({ text: errMsg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Start edit flow: ask for email first
  const handleEditClick = (reviewId) => {
    setEditVerifyId(reviewId);
    setEditEmail('');
    setEditError('');
  };

  const handleEditVerify = () => {
    const target = reviews.find((r) => r._id === editVerifyId);
    if (!target) {
      setEditError('Review not found.');
      return;
    }
    if (target.email.toLowerCase() !== editEmail.toLowerCase()) {
      setEditError('Email does not match the original reviewer. You can only edit your own reviews.');
      return;
    }

    // Email matches — populate form for editing
    setFormData({
      name: target.name,
      email: target.email,
      location: target.location || '',
      tripType: target.tripType || '',
      rating: target.rating,
      review: target.review,
    });
    setIsEditing(editVerifyId);
    setShowForm(true);
    setEditVerifyId(null);
    setEditEmail('');
    setEditError('');
    window.scrollTo({ top: document.getElementById('travel-reviews-section')?.offsetTop - 80, behavior: 'smooth' });
  };

  return (
    <section id="travel-reviews-section" className="py-24 px-4 bg-cream">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white text-secondary text-xs font-semibold tracking-[0.25em] uppercase mb-4 border border-secondary/30 shadow-xs">
            Travel Stories
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl text-text-dark font-medium tracking-tight mb-4">
            Pilgrims & Explorers Say
          </h2>
          <p className="text-text-light text-sm leading-relaxed font-light">
            Real stories from travelers who explored the Himalayas with us. Share your own experience!
          </p>
        </div>

        {/* Add Review Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="btn-gold px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2.5 cursor-pointer shadow-lg hover:shadow-xl transition-all"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>{showForm ? '✕ Close Form' : '+ Share Your Travel Story'}</span>
          </button>
        </div>

        {/* =================== ADD / EDIT REVIEW FORM =================== */}
        {showForm && (
          <div className="max-w-2xl mx-auto mb-16 bg-white p-6 sm:p-8 rounded-3xl border border-secondary/30 shadow-xl animate-fade-in">
            <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-gray-100">
              <span className="w-8 h-8 rounded-full bg-primary text-secondary flex items-center justify-center text-xs font-mono font-bold">
                {isEditing ? '✎' : '★'}
              </span>
              <h3 className="font-heading text-xl text-text-dark font-semibold">
                {isEditing ? 'Edit Your Travel Review' : 'Share Your Mountain Experience'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email (required first) */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleFormChange}
                  disabled={!!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <p className="text-[11px] text-text-light mt-1">
                  🔒 Your email is used to verify ownership for editing. It will not be displayed publicly.
                </p>
              </div>

              {/* Name + Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                    City / Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Delhi NCR"
                    value={formData.location}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                  />
                </div>
              </div>

              {/* Trip Type */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                  Trip / Circuit Name
                </label>
                <input
                  type="text"
                  name="tripType"
                  placeholder="e.g. Kainchi Dham Pilgrimage"
                  value={formData.tripType}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                />
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-2">
                  Your Rating *
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      <StarIcon
                        className={`w-7 h-7 ${
                          star <= formData.rating
                            ? 'fill-secondary text-secondary'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-text-light ml-2 font-medium">
                    {formData.rating} / 5
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                  Your Travel Story *
                </label>
                <textarea
                  name="review"
                  required
                  rows={4}
                  maxLength={1000}
                  placeholder="Share your experience — the mountain roads, the driver, the vehicle comfort, scenic highlights..."
                  value={formData.review}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary resize-none"
                ></textarea>
                <p className="text-[11px] text-text-light text-right mt-0.5">
                  {formData.review.length} / 1000 characters
                </p>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1.5">
                  Trip Photos (optional, up to 5)
                </label>
                <div className="p-5 rounded-2xl border-2 border-dashed border-gray-200 bg-[#FBF9F5] text-center hover:border-secondary transition-all">
                  <input
                    type="file"
                    id="review-photos"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPhotos(e.target.files)}
                    className="hidden"
                  />
                  <label htmlFor="review-photos" className="cursor-pointer block">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-secondary mx-auto mb-2 flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-xs font-semibold text-primary block mb-0.5">
                      Click to upload trip photos
                    </span>
                    <span className="text-[11px] text-text-light block">
                      JPG, PNG, WEBP — Max 5MB each
                    </span>
                    {photos && photos.length > 0 && (
                      <div className="mt-3 inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                        ✓ {photos.length} photo(s) selected
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Message */}
              {message.text && (
                <div className={`p-3 rounded-xl text-xs font-semibold text-center ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Buttons */}
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
                  disabled={submitting}
                  className="btn-gold px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <span>{isEditing ? 'Update Review' : 'Submit Review'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =================== REVIEWS GRID =================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Star Rating */}
              <div className="flex gap-1 text-secondary mb-4">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
                {[...Array(5 - (rev.rating || 5))].map((_, i) => (
                  <StarIcon key={`empty-${i}`} className="w-4 h-4 fill-gray-200 text-gray-200" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-text-light text-sm italic leading-relaxed mb-4 font-light flex-1">
                "{rev.review}"
              </p>

              {/* Photos Grid */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {rev.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxPhoto(photo)}
                      className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-100 hover:border-secondary/50 hover:scale-105 transition-all cursor-pointer shadow-sm"
                    >
                      <img
                        src={photo}
                        alt={`Trip photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-text-dark text-sm block">{rev.name}</strong>
                  <span className="text-secondary text-xs">
                    {rev.location}{rev.location && rev.tripType ? ' • ' : ''}{rev.tripType}
                  </span>
                </div>

                {/* Edit button (only for dynamic reviews, not static) */}
                {!rev.isStatic && (
                  <button
                    onClick={() => handleEditClick(rev._id)}
                    className="text-[10px] px-2.5 py-1 rounded-lg border border-gray-200 text-text-light hover:text-primary hover:border-secondary/50 font-semibold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* =================== EDIT EMAIL VERIFICATION MODAL =================== */}
        {editVerifyId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-secondary/30">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-secondary flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-heading text-xl text-center text-text-dark font-semibold mb-2">
                Verify Your Identity
              </h3>
              <p className="text-text-light text-center text-xs sm:text-sm mb-6 font-light">
                Enter the email address you used when submitting this review to edit it.
              </p>

              <input
                type="email"
                placeholder="your@email.com"
                value={editEmail}
                onChange={(e) => { setEditEmail(e.target.value); setEditError(''); }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#FBF9F5] text-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary mb-3"
              />

              {editError && (
                <p className="text-red-600 text-xs font-semibold mb-3 text-center">
                  {editError}
                </p>
              )}

              <div className="flex gap-2.5">
                <button
                  onClick={() => { setEditVerifyId(null); setEditEmail(''); setEditError(''); }}
                  className="flex-1 py-3 rounded-full border border-gray-200 text-xs font-semibold uppercase tracking-wider text-text-dark hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditVerify}
                  className="flex-1 btn-gold py-3 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-text-dark flex items-center justify-center text-lg font-bold hover:bg-white shadow-lg cursor-pointer z-10"
            >
              ✕
            </button>
            <img
              src={lightboxPhoto}
              alt="Trip photo"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '90vw', maxHeight: '85vh' }}
              className="object-contain rounded-2xl shadow-2xl"
            />
          </div>
        )}

      </div>
    </section>
  );
};

export default TravelReviews;
