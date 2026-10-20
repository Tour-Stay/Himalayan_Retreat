export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#C5A059]/40 shadow-2xl p-6 text-[#0F172A] animate-scale-up">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 flex items-center justify-center shrink-0 border ${
              isDestructive
                ? 'bg-rose-50 text-rose-700 border-rose-300'
                : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}
          >
            {isDestructive ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#0F172A]">{title}</h3>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-cinzel font-semibold text-slate-700 hover:text-[#0F172A] bg-[#FAF8F5] hover:bg-slate-200 border border-slate-300 transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-cinzel font-semibold text-white transition cursor-pointer flex items-center gap-2 shadow-xs ${
              isDestructive
                ? 'bg-rose-700 hover:bg-rose-800 border border-rose-600'
                : 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B1118] border border-[#D4AF37]'
            } disabled:opacity-50`}
          >
            {isLoading && (
              <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
