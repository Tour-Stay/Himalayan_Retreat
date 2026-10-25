import React, { useState, useEffect } from 'react';
import { Container, StarIcon, apiClient, subscribeToUpdates, WriteReviewModal } from '@shared';
import { travelReviewsData } from '../data/travelData';

const TravelReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get('/travel/reviews?category=travel');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setReviews(res.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.warn('Could not load travel reviews from database:', err.message);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();

    // Instant real-time update when reviews are approved, edited, or deleted in Admin
    const unsubscribe = subscribeToUpdates('reviews', () => {
      fetchReviews();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <section id="reviews" className="py-16 sm:py-20 px-4 bg-[#F4F7F3] border-b border-[#D5E0D8] relative">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 reveal">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#073125] text-[#C9F24D] text-xs font-sans font-bold tracking-widest uppercase mb-2.5 shadow-xs">
            REAL TRAVELER FEEDBACK • VERIFIED TOURS
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#073125] font-normal">
            Loved by Pilgrims &amp; Families
          </h2>
          <p className="mt-2 text-[#4A635A] text-sm sm:text-base font-light leading-relaxed mb-6">
            Real guest experiences and verified photos from pilgrims and families who traveled with our mountain chauffeurs.
          </p>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-6 py-2.5 bg-[#C9F24D] text-[#073125] rounded-full text-xs uppercase tracking-wider font-bold hover:bg-[#bde63d] transition-colors shadow-md cursor-pointer"
          >
            Write a Review
          </button>
          {successMessage && (
            <p className="mt-4 text-sm font-medium text-green-700 bg-green-50 py-2 px-4 rounded-xl inline-block border border-green-200">
              {successMessage}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#073125]/20 border-t-[#073125] rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-[#4A635A] bg-white rounded-3xl border border-[#D5E0D8] p-8 max-w-md mx-auto">
            <p className="font-serif text-lg text-[#073125]">No published travel reviews yet.</p>
            <p className="text-xs mt-1 text-[#4A635A]">Book your mountain expedition and share your experience with us.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10 reveal">
            {reviews.map((rev) => (
              <div
                key={rev._id || rev.name}
                className="bg-white p-7 sm:p-8 rounded-3xl border border-[#D5E0D8] hover:border-[#073125]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#073125] mb-4">
                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-[#073125] text-[#073125]" />
                    ))}
                    <span className="text-xs text-[#073125] ml-1.5 font-sans font-bold">
                      {(Number(rev.rating) || 5).toFixed(1)}
                    </span>
                  </div>

                  {/* Review Quote */}
                  <p className="text-sm sm:text-base text-[#4A635A] leading-relaxed mb-5 font-light italic">
                    &ldquo;{rev.review || rev.comment}&rdquo;
                  </p>

                  {/* Traveler Photos Strip */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="mb-5">
                      <span className="text-[10px] uppercase font-sans tracking-wider text-[#4A635A] font-semibold block mb-2">
                        Trip Photos ({rev.photos.length})
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {rev.photos.map((photoUrl, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setPreviewPhoto(photoUrl)}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#D5E0D8] hover:border-[#073125] flex-shrink-0 cursor-pointer transition-transform hover:scale-105 shadow-xs"
                            title="Click to view full photo"
                          >
                            <img
                              src={photoUrl}
                              alt={`Trip photo ${pIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Author & Expedition Details */}
                <div className="pt-4 border-t border-[#D5E0D8]">
                  <h4 className="font-serif text-lg font-medium text-[#073125]">{rev.name}</h4>
                  <div className="flex items-center justify-between text-xs text-[#4A635A] mt-0.5 font-sans">
                    <span>{rev.location || rev.city || 'Pilgrim Guest'}</span>
                    {(rev.tripType || rev.trip) && (
                      <span className="text-[#073125] bg-[#F4F7F3] border border-[#D5E0D8] px-2 py-0.5 rounded font-sans font-semibold truncate max-w-[170px] text-right">
                        {rev.tripType || rev.trip}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Image Preview Modal */}
        {previewPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPreviewPhoto(null)}
          >
            <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden bg-black border border-white/20">
              <img
                src={previewPhoto}
                alt="Traveler full photo"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-3 right-3 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-black"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </Container>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        category="travel"
        onSuccess={() => {
          setSuccessMessage('Thank you! Your travel story has been submitted for approval.');
          setTimeout(() => setSuccessMessage(''), 5000);
        }}
      />
    </section>
  );
};

export default TravelReviews;
