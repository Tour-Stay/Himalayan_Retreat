import React, { useState, useEffect } from 'react';
import { Container, StarIcon, apiClient, subscribeToUpdates } from '@shared';
import { travelReviewsData } from '../data/travelData';

const TravelReviews = () => {
  const [reviews, setReviews] = useState(travelReviewsData);
  const [loading, setLoading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get('/travel/reviews?category=travel');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setReviews(res.data);
      } else {
        setReviews(travelReviewsData);
      }
    } catch (err) {
      console.warn('Could not load travel reviews from database, using verified fallback:', err.message);
      setReviews(travelReviewsData);
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
    <section id="reviews" className="py-16 sm:py-20 px-4 bg-[#FAF5EC] border-b border-[#EAA722]/30 relative">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 reveal">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#EAA722] text-[#541508] text-xs font-mono font-bold tracking-widest uppercase mb-2.5 shadow-xs">
            ॥ पावन यात्रा अनुभव ॥ • REAL TRAVELER FEEDBACK • VERIFIED TOURS
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#541508] font-normal">
            Loved by Pilgrims &amp; Families
          </h2>
          <p className="mt-2 text-[#541508]/85 text-sm sm:text-base font-light leading-relaxed">
            Real guest experiences and verified photos from pilgrims and families who traveled with our mountain chauffeurs.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#541508]/20 border-t-[#541508] rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-[#541508]/70 bg-white rounded-3xl border border-[#EAA722]/30 p-8 max-w-md mx-auto">
            <p className="font-serif text-lg text-[#541508]">No published travel reviews yet.</p>
            <p className="text-xs mt-1">Book your mountain expedition and share your experience with us.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10 reveal">
            {reviews.map((rev) => (
              <div
                key={rev._id || rev.name}
                className="bg-white p-7 sm:p-8 rounded-3xl border border-[#EAA722]/25 hover:border-[#EAA722]/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#EAA722] mb-4">
                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-xs text-[#541508] ml-1.5 font-mono font-bold">
                      {(Number(rev.rating) || 5).toFixed(1)}
                    </span>
                  </div>

                  {/* Review Quote */}
                  <p className="text-sm sm:text-base text-[#5C5350] leading-relaxed mb-5 font-light italic">
                    &ldquo;{rev.review || rev.comment}&rdquo;
                  </p>

                  {/* Traveler Photos Strip */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="mb-5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#541508]/70 font-semibold block mb-2">
                        Trip Photos ({rev.photos.length})
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {rev.photos.map((photoUrl, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setPreviewPhoto(photoUrl)}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#EAA722]/30 hover:border-[#EAA722] flex-shrink-0 cursor-pointer transition-transform hover:scale-105 shadow-xs"
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
                <div className="pt-4 border-t border-[#EAA722]/20">
                  <h4 className="font-serif text-lg font-medium text-[#541508]">{rev.name}</h4>
                  <div className="flex items-center justify-between text-xs text-[#541508]/70 mt-0.5 font-sans">
                    <span>{rev.location || rev.city || 'Pilgrim Guest'}</span>
                    {(rev.tripType || rev.trip) && (
                      <span className="text-[#541508] bg-[#EAA722]/20 border border-[#EAA722]/30 px-2 py-0.5 rounded font-mono font-semibold truncate max-w-[170px] text-right">
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
    </section>
  );
};

export default TravelReviews;
