import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient } from '@shared';
import { useToast } from './Toast';

export const RouteManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const { showToast } = useToast();

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
        showToast('Temple and sightseeing route fares updated across websites!', 'success');
        await refreshSettings();
      }
    } catch (err) {
      console.error('Error saving route fares:', err);
      showToast(err.response?.data?.message || 'Failed to update route fares', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FDFBF7] p-5 sm:p-6 rounded-2xl border border-[#C5A059]/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#C5A059]/20">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-cinzel font-semibold block">
              Pilgrimage & Sightseeing Pricing
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523]">
              Temple & Transfer Route Fares
            </h3>
            <p className="text-xs text-[#5C5350] mt-1">
              Set typical Sedan and Innova roundtrip fares for sacred pilgrimage destinations like Kainchi Dham, Jageshwar, and station transfers.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] text-xs font-semibold uppercase tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#FDFBF7] border-t-transparent rounded-full animate-spin" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((route, idx) => (
            <div
              key={route.id || idx}
              className={`p-4 rounded-2xl border transition ${
                route.isActive
                  ? 'bg-white border-[#C5A059]/30 shadow-xs'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[#C5A059]/20">
                <span className="text-[10px] font-cinzel font-bold text-[#7C1D23] uppercase">
                  {route.saffronTag || 'Route'}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleActive(idx)}
                  className={`px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-full transition cursor-pointer ${
                    route.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {route.isActive ? 'Active' : 'Hidden'}
                </button>
              </div>

              <h4 className="font-serif text-base font-medium text-[#2C2523] mb-3">
                {route.name}
              </h4>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#5C5350] mb-0.5">
                      Distance (KM)
                    </label>
                    <input
                      type="number"
                      value={route.kmFromAlmora}
                      onChange={(e) =>
                        handleFieldChange(idx, 'kmFromAlmora', Number(e.target.value))
                      }
                      className="w-full px-2.5 py-1 text-xs bg-stone-50 rounded border border-[#C5A059]/30 font-mono text-[#2C2523]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#5C5350] mb-0.5">
                      Typical Duration
                    </label>
                    <input
                      type="text"
                      value={route.duration}
                      onChange={(e) => handleFieldChange(idx, 'duration', e.target.value)}
                      className="w-full px-2.5 py-1 text-xs bg-stone-50 rounded border border-[#C5A059]/30 text-[#2C2523]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#C5A059]/20">
                    <label className="block text-[9px] font-cinzel font-bold text-[#7C1D23] uppercase mb-0.5">
                      Sedan Fare
                    </label>
                    <input
                      type="text"
                      value={route.typicalFareSedan}
                      onChange={(e) =>
                        handleFieldChange(idx, 'typicalFareSedan', e.target.value)
                      }
                      placeholder="₹2,200"
                      className="w-full px-2 py-0.5 text-xs font-bold font-mono bg-white rounded border border-[#C5A059]/40 text-[#2C2523]"
                    />
                  </div>

                  <div className="p-2 bg-[#FAF7F2] rounded-lg border border-[#C5A059]/20">
                    <label className="block text-[9px] font-cinzel font-bold text-[#7C1D23] uppercase mb-0.5">
                      Innova Fare
                    </label>
                    <input
                      type="text"
                      value={route.typicalFareInnova}
                      onChange={(e) =>
                        handleFieldChange(idx, 'typicalFareInnova', e.target.value)
                      }
                      placeholder="₹3,600"
                      className="w-full px-2 py-0.5 text-xs font-bold font-mono bg-white rounded border border-[#C5A059]/40 text-[#2C2523]"
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
