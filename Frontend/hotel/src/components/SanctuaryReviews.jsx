import { useState, useEffect } from 'react';
import { Container, SparklesIcon, apiClient, subscribeToUpdates, WriteReviewModal } from '@shared';

const SanctuaryReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await apiClient.get('/hotel/reviews');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setReviews(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch hotel reviews from database:', err.message);
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
    <section id="reviews" className="py-14 sm:py-18 px-4 bg-[#F8FAF7] border-b border-[#073125]/10 relative">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 reveal">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C9F24D] text-[#073125] text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-xs">
            GUEST REVIEWS
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#073125] font-normal">
            What Our Guests Say
          </h2>
          <p className="mt-2 text-[#073125]/75 text-sm sm:text-base font-light leading-relaxed mb-6">
            Real feedback from guests who stayed with us in Kasar Devi.
          </p>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="px-6 py-2.5 bg-[#073125] text-[#C9F24D] rounded-full text-sm font-semibold hover:bg-[#0a4232] transition-colors shadow-md cursor-pointer"
          >
            Write a Review
          </button>
          {successMessage && (
            <p className="mt-4 text-sm font-medium text-green-700 bg-green-50 py-2 px-4 rounded-xl inline-block">
              {successMessage}
            </p>
          )}
        </div>

        {/* Dynamic Reviews Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#073125]/20 border-t-[#073125] rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-[#073125]/70 bg-white rounded-3xl border border-[#073125]/10 p-8 max-w-md mx-auto">
            <p className="font-serif text-lg text-[#073125]">No published reviews yet.</p>
            <p className="text-xs mt-1">Be among the first to experience The Kasar Himalayan Heights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 reveal">
            {reviews.map((rev) => (
              <div
                key={rev._id || rev.name}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-[#073125]/10 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-[#073125]/30 transition-all duration-300"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#073125] mb-4">
                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                    <span className="text-[11px] text-[#073125]/70 ml-2 font-mono font-semibold">
                      {(Number(rev.rating) || 5).toFixed(1)}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="font-serif italic text-sm sm:text-base text-[#073125] leading-relaxed mb-5">
                    &ldquo;{rev.review}&rdquo;
                  </p>

                  {/* Guest Photos Strip */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="mb-5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#073125]/60 font-semibold block mb-2">
                        Guest Photos ({rev.photos.length})
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {rev.photos.map((photoUrl, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setPreviewPhoto(photoUrl)}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#073125]/20 hover:border-[#073125] flex-shrink-0 cursor-pointer transition-transform hover:scale-105 shadow-xs"
                            title="Click to view full photo"
                          >
                            <img
                              src={photoUrl}
                              alt={`Guest photo ${pIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Author & Stay Information */}
                <div className="pt-4 border-t border-[#073125]/10">
                  <h3 className="font-serif font-semibold text-sm text-[#073125]">
                    {rev.name}
                  </h3>
                  {rev.location && (
                    <span className="text-xs text-[#073125]/70 block font-sans">
                      {rev.location}
                    </span>
                  )}
                  {rev.stayedIn && (
                    <span className="text-[11px] text-[#073125] font-mono font-medium block mt-1">
                      Suite: {rev.stayedIn}
                    </span>
                  )}
                  {rev.tripType && !rev.stayedIn && (
                    <span className="text-[11px] text-[#073125] font-mono font-medium block mt-1">
                      {rev.tripType}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sanctuary Trust Strip */}
        <div className="mt-12 text-center text-xs text-[#073125]/70 font-mono flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[#073125]/10">
          <span className="flex items-center gap-1.5 text-[#073125] font-semibold">
            <SparklesIcon className="w-3.5 h-3.5 text-[#073125]" />
            <span>4.9 / 5 Guest Satisfaction</span>
          </span>
          <span className="hidden sm:inline text-[#073125]/40">•</span>
          <span>100% Genuine Devotee &amp; Traveler Experiences</span>
          <span className="hidden sm:inline text-[#073125]/40">•</span>
          <span>Heated Mountain Retreats at 6,942 FT</span>
        </div>
      </Container>

      {/* Lightbox Photo Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              src={previewPhoto}
              alt="Guest Review Snapshot"
              className="max-w-full max-h-[85vh] object-contain bg-[#073125]"
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

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        category="hotel"
        onSuccess={() => {
          setSuccessMessage('Thank you! Your review has been submitted for approval.');
          setTimeout(() => setSuccessMessage(''), 5000);
        }}
      />
    </section>
  );
};

export default SanctuaryReviews;
