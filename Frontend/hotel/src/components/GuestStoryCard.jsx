import React from 'react';

/**
 * GuestStoryCard - Luxury testimonial card for Kasar Devi resort stories.
 * Elegantly adapts to 1, 2, 3, or multiple photos with professional aspect-ratio grids.
 */
export default function GuestStoryCard({
  review,
  theme = 'dark',
  onPhotoClick,
  dataAttribute = 'data-review-card',
}) {
  if (!review) return null;

  const name = review.name || 'Kasar Devi guest';
  const rating = Math.max(3, Math.min(5, Number(review.rating) || 5));
  const reviewText = review.review || review.comment || review.text || 'A peaceful, unforgettable mountain pause.';
  const location = review.location || (review.stayedIn ? `Stayed in ${review.stayedIn}` : 'Kasar Devi, Almora');
  const stayedIn = review.stayedIn || (review.category === 'hotel' ? 'Mountain Sanctuary Stay' : null);

  // Parse photos safely (supports string or array)
  const photos = Array.isArray(review.photos)
    ? review.photos.filter(Boolean)
    : review.photo
    ? [review.photo]
    : [];

  // Helper for initials
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'G';

  // Helper for formatted date
  const formattedDate = review.createdAt
    ? (() => {
        const d = new Date(review.createdAt);
        return Number.isNaN(d.getTime())
          ? ''
          : d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      })()
    : 'Verified Stay';

  const isDark = theme === 'dark';

  return (
    <article
      {...{ [dataAttribute]: true }}
      className={`hotel-review-card group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-[#12362B] transition-all duration-300 ease-out select-none border ${
        isDark
          ? 'bg-gradient-to-b from-[#FFFFFF] via-[#FDFDFC] to-[#F5F8F5] border-white/30 shadow-[0_18px_50px_rgba(0,0,0,0.22)] hover:shadow-[0_28px_65px_rgba(0,0,0,0.35)] hover:-translate-y-2'
          : 'bg-gradient-to-b from-white via-[#FCFDFC] to-[#F7FAF7] border-[#DFE7E1] shadow-[0_14px_38px_rgba(18,54,43,0.06)] hover:shadow-[0_24px_55px_rgba(18,54,43,0.13)] hover:border-[#BED4C6] hover:-translate-y-2'
      }`}
    >
      {/* Decorative Top Accent Gradient Bar */}
      <div
        className={`absolute top-0 left-6 right-6 h-[3px] rounded-full ${
          isDark
            ? 'bg-gradient-to-r from-[#144939] via-[#C9F24D] to-[#144939]'
            : 'bg-gradient-to-r from-[#D9C27E] via-[#8D713A] to-[#12362B]'
        }`}
        aria-hidden="true"
      />

      {/* Decorative Soft Watermark Quote */}
      <span
        className="pointer-events-none absolute top-4 right-6 font-serif text-6xl leading-none text-[#073125]/[0.08] select-none transition-transform duration-300 group-hover:scale-110 group-hover:text-[#073125]/[0.13]"
        aria-hidden="true"
      >
        “
      </span>

      {/* Card Header: Stars & Verified Badge */}
      <div>
        <div className="flex items-center justify-between gap-3">
          {/* Star Rating with Numeric Badge */}
          <div className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-0.5 text-[#F59E0B]"
              role="img"
              aria-label={`${rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 drop-shadow-2xs ${star <= rating ? 'opacity-100 fill-[#F59E0B]' : 'opacity-20 fill-[#D1D5DB]'}`}
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
            <span className="rounded-md border border-[#F3E2B3] bg-[#FFF9EA] px-2 py-0.5 font-sans text-[11px] font-bold text-[#9A701A]">
              {rating.toFixed(1)} ★
            </span>
          </div>

          {/* Verified Stay Badge */}
          <div className="flex items-center gap-1 rounded-full border border-[#CFE2D4] bg-[#EAF4ED] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1B4D3C] shadow-2xs">
            <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current" aria-hidden="true">
              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
            <span>Verified Stay</span>
          </div>
        </div>

        {/* Stay Details Tag (if room info exists) */}
        {stayedIn && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#EDF3EE] px-2.5 py-0.5 text-[11px] font-medium text-[#446252]">
            <svg viewBox="0 0 20 20" className="h-3 w-3 text-[#446252]" fill="currentColor" aria-hidden="true">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="truncate max-w-[260px]">{stayedIn}</span>
          </div>
        )}

        {/* Story Quote Body */}
        <p className="mt-4 font-serif text-[1.08rem] sm:text-[1.14rem] font-normal italic leading-[1.68] text-[#1C4435]">
          “{reviewText}”
        </p>

        {/* ============================================================== */}
        {/* MULTI-PHOTO GALLERY DISPLAY (Handles 1, 2, 3, or 4+ photos)  */}
        {/* ============================================================== */}
        {photos.length > 0 && (
          <div className="mt-4">
            {/* SINGLE PHOTO LAYOUT */}
            {photos.length === 1 && (
              <div
                onClick={() => onPhotoClick?.(0, photos, name)}
                className="group/photo relative overflow-hidden rounded-xl sm:rounded-2xl border border-[#073125]/10 shadow-xs cursor-pointer aspect-[16/10] bg-[#073125]/5"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onPhotoClick?.(0, photos, name);
                }}
                aria-label={`View photo from ${name}`}
              >
                <img
                  src={photos[0]}
                  alt={`Guest moment by ${name}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/photo:scale-106"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100" />
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-sans font-medium text-white backdrop-blur-md transition-all group-hover/photo:bg-black/80">
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 8V4m0 0h4M4 4l5 5m7-1V4m0 0h-4m4 0l-5 5M4 12v4m0 0h4m-4 0l5-5m7 1v4m0 0h-4m4 0l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>View photo</span>
                </div>
              </div>
            )}

            {/* TWO PHOTOS LAYOUT */}
            {photos.length === 2 && (
              <div className="grid grid-cols-2 gap-2">
                {photos.map((photo, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => onPhotoClick?.(pIdx, photos, name)}
                    className="group/photo relative overflow-hidden rounded-xl border border-[#073125]/10 shadow-xs cursor-pointer aspect-[4/3] bg-[#073125]/5"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') onPhotoClick?.(pIdx, photos, name);
                    }}
                    aria-label={`View photo ${pIdx + 1} from ${name}`}
                  >
                    <img
                      src={photo}
                      alt={`Guest moment ${pIdx + 1} by ${name}`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/photo:scale-108"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100" />
                    <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-sans font-medium text-white backdrop-blur-md">
                      <span>{pIdx + 1}/2</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* THREE PHOTOS LAYOUT */}
            {photos.length === 3 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => onPhotoClick?.(pIdx, photos, name)}
                    className="group/photo relative overflow-hidden rounded-xl border border-[#073125]/10 shadow-xs cursor-pointer aspect-square bg-[#073125]/5"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') onPhotoClick?.(pIdx, photos, name);
                    }}
                    aria-label={`View photo ${pIdx + 1} from ${name}`}
                  >
                    <img
                      src={photo}
                      alt={`Guest moment ${pIdx + 1} by ${name}`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/photo:scale-108"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100" />
                  </div>
                ))}
              </div>
            )}

            {/* FOUR OR MORE PHOTOS LAYOUT (+N OVERLAY) */}
            {photos.length >= 4 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.slice(0, 3).map((photo, pIdx) => {
                  const isLast = pIdx === 2;
                  const remainingCount = photos.length - 2;

                  return (
                    <div
                      key={pIdx}
                      onClick={() => onPhotoClick?.(pIdx, photos, name)}
                      className="group/photo relative overflow-hidden rounded-xl border border-[#073125]/10 shadow-xs cursor-pointer aspect-square bg-[#073125]/5"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') onPhotoClick?.(pIdx, photos, name);
                      }}
                      aria-label={`View photo ${pIdx + 1} from ${name}`}
                    >
                      <img
                        src={photo}
                        alt={`Guest moment ${pIdx + 1} by ${name}`}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/photo:scale-108"
                        loading="lazy"
                      />
                      {isLast ? (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white transition-colors group-hover/photo:bg-black/75">
                          <span className="font-serif text-base font-bold">+{remainingCount}</span>
                          <span className="text-[9px] font-sans font-medium uppercase tracking-wider text-white/85">Photos</span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Guest Profile Details */}
      <div className="mt-5 flex items-center gap-3.5 border-t border-[#E8EEEA] pt-4">
        {/* Luxury Dual-tone Avatar */}
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#073125] to-[#1E5743] font-serif text-sm font-bold text-[#C9F24D] shadow-sm ring-2 ring-[#C9F24D]/35"
          aria-hidden="true"
        >
          {initials}
        </span>

        {/* Guest Details */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-sans text-sm font-bold text-[#0D3426] tracking-tight">
            {name}
          </h3>
          <p className="flex items-center gap-1 truncate font-sans text-xs text-[#637C70] mt-0.5">
            <svg viewBox="0 0 20 20" className="h-3 w-3 shrink-0 text-[#637C70]/80" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{location}</span>
          </p>
        </div>

        {/* Date / Verified Season */}
        {formattedDate && (
          <time
            className="shrink-0 font-sans text-[10px] font-semibold uppercase tracking-wider text-[#8A9C91]"
            dateTime={review.createdAt || undefined}
          >
            {formattedDate}
          </time>
        )}
      </div>
    </article>
  );
}
