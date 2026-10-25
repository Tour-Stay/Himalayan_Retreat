import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GuestStoryCard from './GuestStoryCard';

/**
 * GuestStoriesCarousel - Continuous animated auto-movement guest stories carousel.
 * Features 60fps frame-independent smooth gliding animation, silent pause-on-hover,
 * seamless infinite wrapping, manual arrow controls, and a multi-photo lightbox gallery.
 */
export default function GuestStoriesCarousel({
  reviews = [],
  theme = 'dark',
  loading = false,
  error = null,
  onWriteReview = null,
  emptyTitle = 'Guest stories are on their way.',
  emptySubtitle = 'Once a guest review is approved by our team, it will appear here.',
}) {
  const trackRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isInteractingRef = useRef(false);
  const interactTimeoutRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // Multi-photo Lightbox state: { photos: [], activeIndex: 0, authorName: '' }
  const [lightbox, setLightbox] = useState(null);

  const isDark = theme === 'dark';

  // Extended repeating list to guarantee an infinite seamless ribbon
  const displayReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    if (reviews.length >= 8) return [...reviews, ...reviews];
    if (reviews.length >= 4) return [...reviews, ...reviews, ...reviews];
    // For 1, 2, or 3 reviews, repeat 4 times so there's plenty of smooth looping track
    return [...reviews, ...reviews, ...reviews, ...reviews];
  }, [reviews]);

  // Card slide distance calculator
  const getSlideStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 380;
    const card = track.querySelector('[data-review-card]');
    if (!card) return 380;
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 20;
    return card.getBoundingClientRect().width + gap;
  }, []);

  // Continuous 60fps frame-independent animated auto-movement
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reviews.length < 2) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    let animId;
    let lastTime = performance.now();
    const pixelsPerSecond = 36; // Luxurious, calming glide speed

    const animate = (currentTime) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // cap max delta to avoid frame jumps
      lastTime = currentTime;

      if (!isHoveredRef.current && !isInteractingRef.current && track) {
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          if (track.scrollLeft >= halfWidth) {
            track.scrollLeft -= halfWidth;
          }
          track.scrollLeft += pixelsPerSecond * delta;
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [reviews.length]);

  // Pause temporary animation when user clicks arrows or swipes
  const markInteraction = useCallback(() => {
    isInteractingRef.current = true;
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    interactTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 1800);
  }, []);

  // Move carousel manually in a given direction
  const moveSlide = useCallback(
    (direction = 1) => {
      const track = trackRef.current;
      if (!track) return;
      markInteraction();

      const step = getSlideStep();
      const halfWidth = track.scrollWidth / 2;

      if (direction > 0) {
        if (track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
        track.scrollBy({ left: step, behavior: 'smooth' });
      } else {
        if (track.scrollLeft <= 4) {
          track.scrollLeft += halfWidth;
        }
        track.scrollBy({ left: -step, behavior: 'smooth' });
      }
    },
    [getSlideStep, markInteraction]
  );

  // Jump to specific review dot index
  const jumpToIndex = useCallback(
    (index) => {
      const track = trackRef.current;
      if (!track) return;
      markInteraction();

      const step = getSlideStep();
      track.scrollTo({ left: index * step, behavior: 'smooth' });
      setActiveIndex(index);
    },
    [getSlideStep, markInteraction]
  );

  // Track active index based on scroll position
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || reviews.length === 0) return;
    const step = getSlideStep();
    const currentPos = track.scrollLeft;
    const calculatedIndex = Math.round(currentPos / step) % reviews.length;
    setActiveIndex(calculatedIndex);
  }, [getSlideStep, reviews.length]);

  // Keyboard navigation for multi-photo Lightbox
  useEffect(() => {
    if (!lightbox) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightbox(null);
      } else if (e.key === 'ArrowRight') {
        setLightbox((prev) =>
          prev
            ? { ...prev, activeIndex: (prev.activeIndex + 1) % prev.photos.length }
            : null
        );
      } else if (e.key === 'ArrowLeft') {
        setLightbox((prev) =>
          prev
            ? {
                ...prev,
                activeIndex:
                  (prev.activeIndex - 1 + prev.photos.length) % prev.photos.length,
              }
            : null
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading guest stories">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className={`h-72 animate-pulse rounded-2xl sm:rounded-3xl border ${
              isDark ? 'border-white/10 bg-white/[0.08]' : 'border-[#E2E9E3] bg-white'
            }`}
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (reviews.length === 0) {
    return (
      <div
        className={`rounded-2xl sm:rounded-3xl border p-8 sm:p-12 text-center ${
          isDark
            ? 'border-white/15 bg-white/[0.05] text-white'
            : 'border-[#E2E9E3] bg-white text-[#12362B] shadow-sm'
        }`}
      >
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            isDark ? 'bg-white/10 text-[#C9F24D]' : 'bg-[#F0F5F1] text-[#12362B]'
          }`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M7 10h10M7 14h6M5 20l1.3-3.2A8 8 0 1 1 9 18.4L5 20Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-4 font-serif text-2xl font-normal">
          {error ? 'Guest stories are taking a quiet moment.' : emptyTitle}
        </h3>
        <p className={`mx-auto mt-2 max-w-lg text-sm leading-6 ${isDark ? 'text-white/70' : 'text-[#62776D]'}`}>
          {error
            ? 'Please visit again shortly to see the latest published guest reviews from Kasar Devi.'
            : emptySubtitle}
        </p>
        {onWriteReview && (
          <button
            type="button"
            onClick={onWriteReview}
            className="mt-6 inline-flex rounded-full bg-[#12362B] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-[#C9F24D] transition hover:bg-[#1C4E3D] hover:scale-102"
          >
            Write a review
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onTouchStart={() => {
        isHoveredRef.current = true;
      }}
      onTouchEnd={() => {
        isHoveredRef.current = false;
      }}
      aria-roledescription="carousel"
      aria-label="Published guest stories carousel"
    >
      {/* Cards Continuous Ribbon Track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="hotel-reviews-track flex gap-5 overflow-x-auto pb-4 pt-2 select-none"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {displayReviews.map((review, idx) => {
          const key = `${review._id || review.id || review.name}-${idx}`;
          return (
            <GuestStoryCard
              key={key}
              review={review}
              theme={theme}
              onPhotoClick={(photoIdx, photos, authorName) => {
                isHoveredRef.current = true;
                setLightbox({ photos, activeIndex: photoIdx, authorName });
              }}
              dataAttribute="data-review-card"
            />
          );
        })}
      </div>

      {/* Clean, Minimalist Navigation Bar */}
      <div className="mt-5 flex items-center justify-between gap-4">
        {/* Left: Refined Story Count Label */}
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs font-semibold uppercase tracking-[0.16em] ${
              isDark ? 'text-white/60' : 'text-[#60776C]'
            }`}
          >
            Story {String(activeIndex + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}
          </span>
        </div>

        {/* Right: Dot Indicators & Directional Navigation */}
        <div className="flex items-center gap-3">
          {/* Story dot indicators */}
          {reviews.length > 1 && (
            <div className="flex items-center gap-1.5" aria-label="Review pagination dots">
              {reviews.slice(0, Math.min(reviews.length, 6)).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => jumpToIndex(i)}
                  aria-label={`Jump to review ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? isDark
                        ? 'w-6 bg-[#C9F24D]'
                        : 'w-6 bg-[#163D2E]'
                      : isDark
                      ? 'w-2 bg-white/25 hover:bg-white/50'
                      : 'w-2 bg-[#CAD6CE] hover:bg-[#8FA899]'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              aria-label="Previous story card"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition shadow-sm hover:scale-105 active:scale-95 ${
                isDark
                  ? 'border border-white/25 bg-white/10 text-white hover:border-[#C9F24D]/70 hover:bg-white/20'
                  : 'border border-[#D2DDD6] bg-white text-[#12362B] hover:border-[#12362B] hover:bg-[#F2F6F3]'
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => moveSlide(1)}
              aria-label="Next story card"
              className={`flex h-10 w-10 items-center justify-center rounded-full transition shadow-sm hover:scale-105 active:scale-95 ${
                isDark
                  ? 'bg-[#C9F24D] text-[#073125] hover:bg-[#D9FF66]'
                  : 'bg-[#12362B] text-[#C9F24D] hover:bg-[#1B4B3D]'
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MULTI-PHOTO LIGHTBOX MODAL WITH GALLERY NAVIGATION             */}
      {/* ============================================================== */}
      {lightbox && lightbox.photos?.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/92 p-4 sm:p-6 backdrop-blur-md transition-opacity"
          role="dialog"
          aria-modal="true"
          aria-label="Guest photo gallery modal"
          onClick={() => {
            setLightbox(null);
            isHoveredRef.current = false;
          }}
        >
          {/* Top Bar: Caption & Close Button */}
          <div
            className="w-full max-w-4xl flex items-center justify-between pb-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9F24D]">
                ✦ Guest Snapshot
              </span>
              <span className="text-xs text-white/60">·</span>
              <span className="text-xs text-white/80">
                {lightbox.authorName} ({lightbox.activeIndex + 1} of {lightbox.photos.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLightbox(null);
                isHoveredRef.current = false;
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
              aria-label="Close photo preview"
            >
              ✕
            </button>
          </div>

          {/* Main Photo View with Left/Right Arrows */}
          <div
            className="relative flex items-center justify-center max-h-[75vh] max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Photo Arrow (if multiple) */}
            {lightbox.photos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightbox((prev) => ({
                    ...prev,
                    activeIndex:
                      (prev.activeIndex - 1 + prev.photos.length) % prev.photos.length,
                  }))
                }
                className="absolute left-2 sm:-left-12 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md transition hover:bg-black/90 hover:scale-105 active:scale-95"
                aria-label="Previous photo"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {/* Photo Image */}
            <img
              src={lightbox.photos[lightbox.activeIndex]}
              alt={`Guest stay moment ${lightbox.activeIndex + 1}`}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/15"
            />

            {/* Next Photo Arrow (if multiple) */}
            {lightbox.photos.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightbox((prev) => ({
                    ...prev,
                    activeIndex: (prev.activeIndex + 1) % prev.photos.length,
                  }))
                }
                className="absolute right-2 sm:-right-12 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-md transition hover:bg-black/90 hover:scale-105 active:scale-95"
                aria-label="Next photo"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip (if multiple photos) */}
          {lightbox.photos.length > 1 && (
            <div
              className="mt-4 flex items-center gap-2 overflow-x-auto py-1 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.photos.map((photo, tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  onClick={() =>
                    setLightbox((prev) => ({ ...prev, activeIndex: tIdx }))
                  }
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    lightbox.activeIndex === tIdx
                      ? 'border-[#C9F24D] scale-105 shadow-md'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Select photo ${tIdx + 1}`}
                >
                  <img src={photo} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
