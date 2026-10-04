import { useState, useEffect } from 'react';
import { Container, SparklesIcon, apiClient, subscribeToUpdates } from '@shared';

const SanctuaryReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPhoto, setPreviewPhoto] = useState(null);

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
    <section id="reviews" className="py-12 sm:py-16 px-4 bg-[#FDFBF7] border-b border-[#C5A059]/20 relative">
      <Container size="lg">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 reveal">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#FAF6EF] text-[#7C1D23] text-xs font-semibold tracking-[0.2em] uppercase mb-3 border border-[#C5A059]/30 font-cinzel">
            Guest Chronicles
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2523] font-medium leading-tight">
            What Our Guests Say
          </h2>
          <div className="w-16 h-0.5 bg-[#C5A059]/60 mx-auto my-4"></div>
          <p className="text-[#5C5350] text-sm sm:text-base font-normal leading-relaxed">
            Real guest experiences and verified photos from travelers, seekers, and families who stayed at our Kasar Devi mountain retreat.
          </p>
        </div>

        {/* Dynamic Reviews Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-2 border-[#C5A059] border-t-[#7C1D23] rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-[#6B615E] bg-[#FAF6EF] rounded-3xl border border-[#C5A059]/20 p-8 max-w-md mx-auto">
            <p className="font-serif text-lg text-[#2C2523]">No published reviews yet.</p>
            <p className="text-xs mt-1">Be among the first to experience The Kasar Himalayan Heights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 reveal">
            {reviews.map((rev) => (
              <div
                key={rev._id || rev.name}
                className="bg-[#FAF6EF] p-6 sm:p-7 rounded-3xl border border-[#C5A059]/30 shadow-xs flex flex-col justify-between hover:shadow-lg hover:border-[#7C1D23]/35 transition-all duration-300"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-[#C5A059] mb-4">
                    {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                    <span className="text-[11px] text-[#6B615E] ml-2 font-cinzel font-semibold">
                      {(Number(rev.rating) || 5).toFixed(1)}
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="font-serif italic text-sm sm:text-base text-[#2C2523] leading-relaxed mb-5">
                    &ldquo;{rev.review}&rdquo;
                  </p>

                  {/* Guest Photos Strip */}
                  {rev.photos && rev.photos.length > 0 && (
                    <div className="mb-5">
                      <span className="text-[10px] uppercase font-cinzel tracking-wider text-[#6B615E] font-semibold block mb-2">
                        Guest Photos ({rev.photos.length})
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {rev.photos.map((photoUrl, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setPreviewPhoto(photoUrl)}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#C5A059]/40 hover:border-[#7C1D23] flex-shrink-0 cursor-pointer transition-transform hover:scale-105 shadow-xs"
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
                <div className="pt-4 border-t border-[#C5A059]/20">
                  <h3 className="font-serif font-semibold text-sm text-[#7C1D23]">
                    {rev.name}
                  </h3>
                  {rev.location && (
                    <span className="text-xs text-[#6B615E] block font-sans">
                      {rev.location}
                    </span>
                  )}
                  {rev.stayedIn && (
                    <span className="text-[11px] text-[#C5A059] font-cinzel font-semibold block mt-1">
                      Suite: {rev.stayedIn}
                    </span>
                  )}
                  {rev.tripType && !rev.stayedIn && (
                    <span className="text-[11px] text-[#C5A059] font-cinzel font-semibold block mt-1">
                      {rev.tripType}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sanctuary Trust Strip */}
        <div className="mt-12 text-center text-xs text-[#6B615E] font-cinzel flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[#C5A059]/20">
          <span className="flex items-center gap-1.5 text-[#2C2523] font-semibold">
            <SparklesIcon className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>4.9 / 5 Guest Satisfaction</span>
          </span>
          <span className="hidden sm:inline text-[#C5A059]">•</span>
          <span>100% Genuine Devotee &amp; Traveler Experiences</span>
          <span className="hidden sm:inline text-[#C5A059]">•</span>
          <span>Heated Winter Retreats at 6,942 FT</span>
        </div>
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
              alt="Guest Review Snapshot"
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

export default SanctuaryReviews;
