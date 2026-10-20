import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient } from '@shared';
import { useToast } from './Toast';

export const RouteManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const toastContext = useToast();
  const addToast = toastContext.addToast || toastContext.showToast;

  const [destinations, setDestinations] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.destinations && Array.isArray(settings.destinations)) {
      setDestinations(JSON.parse(JSON.stringify(settings.destinations)));
    }
  }, [settings]);

  const handleFieldChange = (index, field, value) => {
    setDestinations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleToggleActive = (index) => {
    setDestinations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isActive: !updated[index].isActive };
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await apiClient.patch('/settings/destinations', destinations);
      if (res.data?.success) {
        addToast('Temple and sightseeing route fares updated across websites!', 'success');
        await refreshSettings();
      }
    } catch (err) {
      console.error('Error saving route fares:', err);
      addToast(err.response?.data?.message || 'Failed to update route fares', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 border border-[#C5A059]/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-cinzel font-bold block">
              Pilgrimage &amp; Sightseeing Pricing
            </span>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#0F172A]">
              Temple &amp; Transfer Route Fares
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Set typical Sedan and Innova roundtrip fares for sacred pilgrimage destinations like Kainchi Dham, Jageshwar, and station transfers.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B1118] text-xs font-cinzel font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 shadow-sm border border-[#D4AF37] whitespace-nowrap"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#0B1118]/30 border-t-[#0B1118] rounded-full animate-spin" />
                <span>Saving Routes...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Route Fares</span>
              </>
            )}
          </button>
        </div>

        {/* Route Cards Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {destinations.map((route, idx) => (
            <div
              key={route.id || idx}
              className={`p-4 border transition ${
                route.isActive
                  ? 'bg-white border-[#C5A059]/35 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-slate-200">
                <span className="text-[10px] font-cinzel font-bold text-[#0B1118] uppercase bg-[#C5A059]/20 px-2 py-0.5 border border-[#C5A059]/35">
                  {route.saffronTag || 'Route'}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(idx)}
                  className={`px-2 py-0.5 text-[10px] font-cinzel font-bold uppercase tracking-wider border transition cursor-pointer ${
                    route.isActive
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {route.isActive ? 'Active' : 'Hidden'}
                </button>
              </div>

              <h4 className="font-serif text-base font-bold text-[#0F172A] mb-3">
                {route.name}
              </h4>

              <div className="space-y-3 text-xs font-sans">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Distance (KM)
                    </label>
                    <input
                      type="number"
                      value={route.kmFromAlmora}
                      onChange={(e) =>
                        handleFieldChange(idx, 'kmFromAlmora', Number(e.target.value))
                      }
                      className="w-full px-2.5 py-1 text-xs bg-[#FAF8F5] border border-slate-300 font-mono text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">
                      Typical Duration
                    </label>
                    <input
                      type="text"
                      value={route.duration}
                      onChange={(e) => handleFieldChange(idx, 'duration', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 bg-[#FAF8F5] border border-slate-200">
                    <label className="block text-[9px] font-cinzel font-bold text-[#0B1118] uppercase mb-0.5">
                      Sedan Fare
                    </label>
                    <input
                      type="text"
                      value={route.typicalFareSedan}
                      onChange={(e) =>
                        handleFieldChange(idx, 'typicalFareSedan', e.target.value)
                      }
                      placeholder="₹2,200"
                      className="w-full px-2 py-1 text-xs font-bold font-mono bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="p-2 bg-[#FAF8F5] border border-slate-200">
                    <label className="block text-[9px] font-cinzel font-bold text-[#0B1118] uppercase mb-0.5">
                      Innova Fare
                    </label>
                    <input
                      type="text"
                      value={route.typicalFareInnova}
                      onChange={(e) =>
                        handleFieldChange(idx, 'typicalFareInnova', e.target.value)
                      }
                      placeholder="₹3,600"
                      className="w-full px-2 py-1 text-xs font-bold font-mono bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteManager;
