import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, subscribeToUpdates, WriteReviewModal } from '@shared';
import GuestStoriesCarousel from '../components/GuestStoriesCarousel';

const ratingFilters = [
  { value: 'all', label: 'All reviews · 3+ stars' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
];

function StarRating({ rating, light = false, large = false }) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${large ? 'text-lg' : 'text-sm'} ${light ? 'text-[#E8C879]' : 'text-[#C99A3D]'}`}
      role="img"
      aria-label={`${Number(rating || 0).toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className={`h-[1em] w-[1em] ${star <= roundedRating ? 'opacity-100' : 'opacity-25'}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function formatReviewDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function getInitials(name = 'Guest') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'G';
}

export default function HotelReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchReviews = async () => {
      try {
        // This public endpoint returns hotel reviews approved in the Admin portal.
        const response = await apiClient.get('/hotel/reviews');
        if (!isActive) return;
        const approvedReviews = Array.isArray(response.data) ? response.data : [];
        setReviews(approvedReviews.filter((review) => Number(review.rating) >= 3));
        setError('');
      } catch (requestError) {
        if (!isActive) return;
        setError(requestError.response?.data?.message || 'Guest stories are temporarily unavailable. Please try again shortly.');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void fetchReviews();
    // Admin runs on a separate local port, so keep a gentle visible-tab refresh as a fallback.
    const unsubscribe = subscribeToUpdates('reviews', fetchReviews, 60 * 1000);

    return () => {
      isActive = false;
      unsubscribe?.();
    };
  }, []);

  const visibleReviews = useMemo(() => {
    if (ratingFilter === 'all') return reviews;
    return reviews.filter((review) => Math.round(Number(review.rating) || 0) === Number(ratingFilter));
  }, [reviews, ratingFilter]);

  const summary = useMemo(() => {
    const count = reviews.length;
    const average = count
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / count
      : 0;
    const counts = [5, 4, 3].map((rating) => ({
      rating,
      count: reviews.filter((review) => Math.round(Number(review.rating) || 0) === rating).length,
    }));
    return { count, average, counts };
  }, [reviews]);

  return (
    <main className="hotel-reviews-page min-h-screen bg-[#F8FAF7] text-[#12362B]">
      <section className="relative isolate overflow-hidden bg-[#08271F] text-white">
        <div className="hotel-reviews-hero-glow" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid w-[min(1180px,calc(100%-36px))] gap-10 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D8C17E]/35 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8D9AA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9C27E]" /> Guest stories · Kasar Devi
            </span>
            <h1 className="mt-5 max-w-xl font-serif text-4xl font-normal leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.8rem]">
              The moments guests take home.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Quiet mornings, warm hospitality, and the Himalayas at the window. Read notes shared by guests after their stay.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(true)}
                className="rounded-full bg-[#D9C27E] px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#17352B] shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#E8D9AA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8D9AA]"
              >
                Share your stay
              </button>
              <Link
                to="/"
                className="rounded-full border border-white/25 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/90 no-underline transition hover:border-white/60 hover:bg-white/5"
              >
                Back to the stay
              </Link>
            </div>
            {submitted && (
              <p className="mt-4 text-sm text-[#E8D9AA]" role="status">
                Thank you. Your review is with our team for approval before it appears here.
              </p>
            )}
          </div>

          <aside className="rounded-[1.75rem] border border-white/15 bg-white/[0.07] p-6 shadow-2xl shadow-black/15 backdrop-blur-sm sm:p-8" aria-label="Guest review summary">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">Published guest rating</p>
            <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2">
              <span className="font-serif text-6xl leading-none text-white">{summary.count ? summary.average.toFixed(1) : '—'}</span>
              <div className="pb-1">
                <StarRating rating={summary.average} light large />
                <p className="mt-1 text-xs text-white/60">From {summary.count} published {summary.count === 1 ? 'story' : 'stories'}</p>
              </div>
            </div>
            <div className="my-6 h-px bg-white/12" />
            <div className="space-y-3">
              {summary.counts.map(({ rating, count }) => (
                <div key={rating} className="grid grid-cols-[3.5rem_1fr_2rem] items-center gap-3 text-xs">
                  <span className="text-white/75">{rating} stars</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-[#D9C27E] transition-[width] duration-500"
                      style={{ width: `${summary.count ? (count / summary.count) * 100 : 0}%` }}
                    />
                  </span>
                  <span className="text-right tabular-nums text-white/55">{count}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[11px] leading-5 text-white/45">Only reviews approved by our team are shown. Ratings below 3 stars are excluded from this guest-story collection.</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto w-[min(1180px,calc(100%-36px))] py-12 sm:py-16 lg:py-20" aria-labelledby="published-reviews-heading">
        <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8D713A]">A little kindness, remembered</p>
            <h2 id="published-reviews-heading" className="font-serif text-3xl font-normal tracking-tight text-[#12362B] sm:text-4xl">Notes from the mountain</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#60746A]">Every story here has been reviewed and published by our guest-care team.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label="Filter reviews by rating">
            {ratingFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setRatingFilter(filter.value)}
                aria-pressed={ratingFilter === filter.value}
                className={`rounded-full border px-3.5 py-2 text-[11px] font-semibold transition ${ratingFilter === filter.value ? 'border-[#12362B] bg-[#12362B] text-white shadow-sm' : 'border-[#D9E2DC] bg-white text-[#52695E] hover:border-[#9FB4A7] hover:text-[#12362B]'}`}
              >
                {filter.label}
              </button>
            ))}
            {/* Add Reviews CTA button */}
            <button
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              id="add-reviews-btn"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D9C27E] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#17352B] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#E8D9AA] hover:shadow-md active:scale-95"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M10 5v10M5 10h10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add Reviews
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-[#E6C9B8] bg-[#FFF8F2] px-4 py-3 text-sm text-[#754A34]" role="status">
            {error}
          </div>
        )}

        <GuestStoriesCarousel
          reviews={visibleReviews}
          theme="light"
          loading={loading}
          error={error}
          onWriteReview={() => setIsWriteModalOpen(true)}
          emptyTitle="No published stories in this rating yet"
          emptySubtitle="Approved guest reviews rated 3 stars and above will appear here. You can share your own stay while our team reviews the latest submissions."
        />
      </section>


      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        category="hotel"
        onSuccess={() => {
          setSubmitted(true);
          window.setTimeout(() => setSubmitted(false), 6500);
        }}
      />
    </main>
  );
}
