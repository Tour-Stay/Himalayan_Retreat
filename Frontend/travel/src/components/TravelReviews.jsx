import React, { useState, useEffect } from 'react';
import { Container, StarIcon, apiClient, subscribeToUpdates } from '@shared';

const TravelReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get('/travel/reviews?category=travel');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setReviews(res.data);
      }
    } catch (err) {
      console.warn('Could not load travel reviews from database:', err.message);
    } finally {
      setLoading(false);
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
    <section id="reviews" className="py-20 sm:py-28 px-4 bg-gradient-to-b from-[#FAF6EF]/60 via-[#FFF5EC]/40 to-[#FAF6EF]/60 border-b border-[#C5A059]/20 relative overflow-hidden">
      {/* Subtle sacred symbol watermark */}
      <div className="absolute top-10 right-8 text-[#C84B0F]/[0.025] text-[180px] font-devanagari select-none pointer-events-none leading-none z-0">
        ॐ
      </div>

      <Container size="lg">
        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <span className="text-xs font-sans text-[#C84B0F] uppercase tracking-wider font-semibold block mb-2">
            Real Traveler Feedback • Verified Expeditions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#2C2523] font-medium tracking-tight mb-4">
            Loved by Pilgrims &amp; Families
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#C84B0F] to-transparent mx-auto my-3"></div>
          <p className="text-[#5C5350] text-base leading-relaxed font-normal">
            Real guest experiences and verified photos from pilgrims and families who traveled with our mountain chauffeurs.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#C5A059] border-t-[#C84B0F] rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-[#6B615E] bg-[#FAF6EF] rounded-3xl border border-[#C5A059]/20 p-8 max-w-md mx-auto">
            <p className="font-serif text-lg text-[#2C2523]">No published travel reviews yet.</p>
            <p className="text-xs mt-1">Book your mountain expedition and share your experience with us.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {reviews.map((rev) => (
              <div
                key={rev._id || rev.name}
                className="card-luxury p-7 sm:p-8 rounded-3xl bg-[#FDFBF7] border border-[#C5A059]/30 shadow-xs flex flex-col justify-between transition-all"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#C84B0F] mb-4">
                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-xs text-[#6B615E] ml-1.5 font-semibold">
                      {(Number(rev.rating) || 5).toFixed(1)}
                    </span>
                  </div>

                  {/* Review Quote */}
                  <p className="text-sm sm:text-base text-[#5C5350] leading-relaxed mb-5 font-normal italic">
                    &ldquo;{rev.review}&rdquo;
                  </p>

                  {/* Traveler Photos Strip */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="mb-5">
                      <span className="text-[10px] uppercase font-cinzel tracking-wider text-[#6B615E] font-semibold block mb-2">
                        Trip Photos ({rev.photos.length})
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {rev.photos.map((photoUrl, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setPreviewPhoto(photoUrl)}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#C5A059]/40 hover:border-[#C84B0F] flex-shrink-0 cursor-pointer transition-transform hover:scale-105 shadow-xs"
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
                <div className="pt-4 border-t border-[#C5A059]/20">
                  <h4 className="font-serif text-lg font-medium text-[#2C2523]">{rev.name}</h4>
                  <div className="flex items-center justify-between text-xs text-[#6B615E] mt-0.5 font-sans">
                    <span>{rev.location || 'Pilgrim Guest'}</span>
                    {rev.tripType && (
                      <span className="text-[#C84B0F] font-semibold truncate max-w-[150px] text-right">
                        {rev.tripType.includes('(') ? rev.tripType.split('(')[1].replace(')', '') : rev.tripType}
                      </span>
                    )}
                  </div>
                  {rev.tripType && (
                    <div className="text-[11px] text-[#6B615E]/80 mt-1 line-clamp-1">
                      Circuit: {rev.tripType}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Lightbox Photo Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#C5A059]/50 shadow-2xl">
            <img
              src={previewPhoto}
              alt="Traveler Review Snapshot"
              className="max-w-full max-h-[85vh] object-contain bg-[#1C1817]"
            />
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full border border-white/20 transition-all cursor-pointer font-sans"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default TravelReviews;
