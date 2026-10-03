import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium transition-all duration-200 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-[#FDFBF7] text-emerald-900 border-emerald-400'
                : toast.type === 'error'
                ? 'bg-[#FDFBF7] text-rose-900 border-rose-400'
                : toast.type === 'warning'
                ? 'bg-[#FDFBF7] text-amber-900 border-amber-400'
                : 'bg-[#FDFBF7] text-[#2C2523] border-[#C5A059]/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && (
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  ✓
                </span>
              )}
              {toast.type === 'error' && (
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  ✕
                </span>
              )}
              {toast.type === 'warning' && (
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  !
                </span>
              )}
              {toast.type === 'info' && (
                <span className="w-5 h-5 rounded-full bg-[#FAF6EF] text-[#7C1D23] flex items-center justify-center shrink-0 text-xs font-bold border border-[#C5A059]/40">
                  ℹ
                </span>
              )}
              <span className="leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#66605B] hover:text-[#2C2523] p-1 rounded transition-colors text-base cursor-pointer"
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
