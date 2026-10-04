import { useState, useMemo } from 'react';
import { apiClient, broadcastUpdate } from '@shared';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './Toast';

export const ReviewManager = ({ reviews, setReviews, onRefresh }) => {
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'approved'
  const [togglingId, setTogglingId] = useState(null);

  // Lightbox modal for full-size photo inspection
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const name = r.name || r.userName || '';
      const email = r.email || r.userEmail || '';
      const comment = r.review || r.comment || r.text || '';

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        comment.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'approved' && Boolean(r.isApproved)) ||
        (filterStatus === 'pending' && !r.isApproved);

      return matchesSearch && matchesStatus;
    });
  }, [reviews, search, filterStatus]);

  // Toggle review approval
  const handleToggleApproval = async (review) => {
    const originalStatus = Boolean(review.isApproved);
    setTogglingId(review._id);

    // Optimistic UI update
    setReviews((prev) =>
      prev.map((r) => (r._id === review._id ? { ...r, isApproved: !originalStatus } : r))
    );

    try {
      const res = await apiClient.put(`/travel/reviews/${review._id}/approve`);
      const newStatus = res.data?.review?.isApproved;
      broadcastUpdate('reviews');
      addToast(
        `Review by ${review.name || 'Guest'} is now ${newStatus ? 'Approved & Public' : 'Unapproved / Hidden'}`,
        'success'
      );
    } catch (err) {
      // Revert optimistic update
      setReviews((prev) =>
        prev.map((r) => (r._id === review._id ? { ...r, isApproved: originalStatus } : r))
      );
      addToast('Failed to toggle approval: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // Delete review
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await apiClient.delete(`/travel/reviews/${deleteTarget._id}`);
      setReviews((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      broadcastUpdate('reviews');
      addToast('Review deleted from database.', 'info');
      setDeleteTarget(null);
    } catch (err) {
      addToast('Failed to delete review: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FDFBF7] p-3.5 sm:p-4 rounded-2xl border border-[#C5A059]/30 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="w-4 h-4 text-[#C5A059] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search review comments, guest author, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF6EF] border border-[#C5A059]/30 rounded-xl text-xs text-[#2C2523] placeholder-[#66605B] focus:outline-none focus:border-[#7C1D23] transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66605B] hover:text-[#2C2523] text-xs cursor-pointer"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#FAF6EF] p-1 rounded-xl border border-[#C5A059]/25 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-lg font-cinzel font-semibold transition cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-[#7C1D23] text-[#FDFBF7] shadow-2xs'
                : 'text-[#5C5350] hover:text-[#2C2523]'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded-lg font-cinzel font-semibold transition cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                : 'text-[#5C5350] hover:text-[#2C2523]'
            }`}
          >
            Pending ({reviews.filter((r) => !r.isApproved).length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1 rounded-lg font-cinzel font-semibold transition cursor-pointer ${
              filterStatus === 'approved'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-[#5C5350] hover:text-[#2C2523]'
            }`}
          >
            Approved ({reviews.filter((r) => r.isApproved).length})
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-[#FDFBF7] rounded-2xl border border-[#C5A059]/30 text-[#66605B]">
          <svg className="w-12 h-12 mx-auto text-[#C5A059]/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-sm font-cinzel font-semibold text-[#2C2523]">No reviews found</p>
          <p className="text-xs text-[#66605B] mt-1">Guest reviews submitted on the travel frontend will appear here for staff moderation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((review) => {
            const author = review.name || review.userName || 'Anonymous Guest';
            const rating = review.rating || 5;
            const photos = review.photos || [];
            const isToggling = togglingId === review._id;

            return (
              <div
                key={review._id}
                className="bg-[#FDFBF7] border border-[#C5A059]/30 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Top: Author, Stars, Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-[#2C2523] text-sm">{author}</h4>
                        {review.category && (
                          <span className="text-[10px] uppercase font-cinzel font-semibold px-2 py-0.5 rounded-full bg-[#FAF6EF] text-[#7C1D23] border border-[#C5A059]/40">
                            {review.category}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#66605B] font-mono mt-0.5">
                        {(review.email || review.userEmail) && (
                          <span>✉️ {review.email || review.userEmail} • </span>
                        )}
                        <span>📅 {formatDate(review.createdAt)}</span>
                      </div>
                      {(review.stayedIn || review.tripType) && (
                        <div className="text-[11px] text-[#C5A059] font-cinzel font-semibold mt-0.5">
                          {review.stayedIn ? `Suite: ${review.stayedIn}` : `Trip: ${review.tripType}`}
                        </div>
                      )}
                    </div>

                    <StatusBadge status={review.isApproved} type="review" />
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= rating ? 'text-[#C5A059]' : 'text-stone-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs font-mono font-bold text-[#7C1D23] ml-1">
                      {Number(rating).toFixed(1)}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-[#5C5350] leading-relaxed italic bg-[#FAF6EF] p-3 rounded-2xl border border-[#C5A059]/25 mb-3">
                    &ldquo;{review.review || review.comment || review.text || 'No written comment provided.'}&rdquo;
                  </p>

                  {/* Attached Photos thumbnails with click to lightbox */}
                  {photos.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] font-cinzel uppercase tracking-wider text-[#C5A059] font-bold mb-1.5">
                        Guest Photos ({photos.length}) — Click to enlarge
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {photos.map((photoUrl, i) => (
                          <img
                            key={i}
                            src={photoUrl}
                            alt="Guest review photo"
                            onClick={() => setLightboxPhoto(photoUrl)}
                            className="w-14 h-14 object-cover rounded-xl border border-[#C5A059]/40 hover:border-[#7C1D23] transition cursor-pointer shrink-0 shadow-2xs"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls: Approve/Hide toggle + Delete */}
                <div className="flex items-center justify-between pt-3 border-t border-[#C5A059]/20 mt-2">
                  <span className="text-xs text-[#66605B] font-cinzel">
                    {review.isApproved ? 'Public on Guest Site' : 'Pending Verification'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleApproval(review)}
                      disabled={isToggling}
                      className={`px-3 py-1.5 rounded-full text-xs font-cinzel font-semibold border transition cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                        review.isApproved
                          ? 'bg-[#FAF6EF] hover:bg-white text-[#7C1D23] border-[#C5A059]/40'
                          : 'bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] border border-[#C5A059]/40'
                      }`}
                    >
                      {isToggling && (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      )}
                      <span>{review.isApproved ? 'Hide from Guest Site' : 'Approve & Publish'}</span>
                    </button>

                    <button
                      onClick={() => setDeleteTarget(review)}
                      className="p-1.5 rounded-lg text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-transparent hover:border-rose-300 transition cursor-pointer"
                      title="Delete review"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL PHOTO LIGHTBOX */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in cursor-pointer"
          onClick={() => setLightboxPhoto(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] p-2 bg-[#FDFBF7] border border-[#C5A059]/40 rounded-3xl shadow-2xl overflow-hidden">
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full text-sm cursor-pointer z-10"
            >
              &times;
            </button>
            <img
              src={lightboxPhoto}
              alt="Full size review photo"
              className="max-h-[80vh] w-auto object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Guest Review"
        message={`Are you sure you want to permanently delete the review from "${deleteTarget?.name || 'Guest'}"?`}
        confirmText="Delete Review"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ReviewManager;
