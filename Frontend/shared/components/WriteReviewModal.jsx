import React, { useState } from 'react';
import Modal from './Modal';
import apiClient from '../services/apiClient';

const WriteReviewModal = ({ isOpen, onClose, category, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    tripType: '',
    stayedIn: '',
    rating: 5,
    review: '',
  });
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...filesArray]);
      
      // Create preview URLs
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removePhoto = (indexToRemove) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewUrls((prev) => {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(prev[indexToRemove]);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      data.append('category', category || 'general');

      photos.forEach((photo) => {
        data.append('photos', photo);
      });

      // Send to the correct endpoint
      const endpoint = category === 'hotel' ? '/hotel/reviews' : '/travel/reviews';
      await apiClient.post(endpoint, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Clean up object URLs on success
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.data?.message?.includes('Cloudinary')) {
        setError('Image upload failed. The server needs valid Cloudinary credentials in its .env file. For now, you can submit the review without photos.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to submit review');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isHotel = category === 'hotel';

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <svg 
              className={`w-8 h-8 ${star <= formData.rating ? 'text-[#EAA722]' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm font-bold text-gray-700 flex items-center">
          ({formData.rating}/5)
        </span>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Write a Review">
      <div className="p-6 bg-[#FAF5EC] sm:bg-white rounded-b-2xl">
        <p className="text-sm text-[#5C5350] mb-6 font-medium">
          Share your experience with us. Your email is kept private and acts as a secure key to edit your review later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
                placeholder="e.g. Rahul Sharma"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
                placeholder="Securely verify ownership"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Location (City)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
                placeholder="e.g. New Delhi, India"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Rating *</label>
              {renderStars()}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isHotel ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Suite Stayed In</label>
                <input
                  type="text"
                  name="stayedIn"
                  value={formData.stayedIn}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
                  placeholder="e.g. Nanda Devi Suite"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Trip Type</label>
                <input
                  type="text"
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
                  placeholder="e.g. Family Pilgrimage"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Review *</label>
            <textarea
              name="review"
              required
              rows={4}
              value={formData.review}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EAA722]"
              placeholder="Tell us about your experience..."
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Upload Photos (Optional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EAA722]/10 file:text-[#541508] hover:file:bg-[#EAA722]/20"
            />
            
            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                    <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      title="Remove image"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl mt-2">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#073125] text-white rounded-xl text-sm font-bold hover:bg-[#0B2B21] transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default WriteReviewModal;
