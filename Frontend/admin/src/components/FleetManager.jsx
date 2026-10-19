import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings, apiClient } from '@shared';
import { useToast } from './Toast';

export const FleetManager = () => {
  const navigate = useNavigate();
  const { settings, refreshSettings } = useSiteSettings();
  const { showToast } = useToast();

  const [fleet, setFleet] = useState([]);
  const [driverAllowance, setDriverAllowance] = useState(500);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.cabFleet && Array.isArray(settings.cabFleet)) {
      setFleet(JSON.parse(JSON.stringify(settings.cabFleet)));
    }
    if (settings?.travelPolicies?.driverAllowancePerDay !== undefined) {
      setDriverAllowance(settings.travelPolicies.driverAllowancePerDay);
    }
  }, [settings]);

  const handleFieldChange = (index, field, value) => {
    setFleet((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleToggleActive = (index) => {
    setFleet((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isActive: !updated[index].isActive };
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiClient.patch('/settings/cabFleet', fleet);
      const currentPolicies = settings?.travelPolicies || {};
      const numericAllowance = driverAllowance === '' ? 0 : Math.max(0, Number(driverAllowance));
      await apiClient.patch('/settings/travelPolicies', {
        ...currentPolicies,
        driverAllowancePerDay: isNaN(numericAllowance) ? 0 : numericAllowance,
      });
      showToast('Cab fleet pricing & Driver Hill Allowance updated across Travel site!', 'success');
      await refreshSettings();
    } catch (err) {
      console.error('Error saving fleet tariffs:', err);
      showToast(err.response?.data?.message || 'Failed to update fleet tariffs', 'error');
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
              Travel Logistics & Rental Matrix
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523]">
              Cab Fleet Tariffs & Per-KM Rates
            </h3>
            <p className="text-xs text-[#5C5350] mt-1">
              Adjust vehicle rental prices, per-kilometer mountain rates, and fixed railway station transfer fares.
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
                <span>Saving Tariffs...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save All Tariffs</span>
              </>
            )}
          </button>
        </div>

        {/* Global Driver Allowance Configuration Card */}
        <div className="mb-6 p-4.5 bg-[#FAF5EC] rounded-2xl border border-[#C5A059]/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">⛰️</span>
              <h4 className="font-serif text-base font-bold text-[#2C2523]">
                Daily Driver Hill Allowance / Batta
              </h4>
            </div>
            <p className="text-xs text-[#5C5350] mt-1 max-w-2xl leading-relaxed">
              Standard mountain allowance covering the local driver's food &amp; lodging during high-altitude trips. Set to <code className="text-[#7C1D23] font-bold font-mono">0</code> to completely waive or disable driver allowance in the live Fare Calculator.
            </p>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => navigate('/settings/drivers')}
                className="text-[11px] font-semibold text-[#7C1D23] hover:text-[#5C151A] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>👨‍✈️ Manage Plain vs Mountain Rates &amp; Chauffeur Roster in Drivers &amp; Batta Tab ↗</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center bg-white px-3.5 py-2 rounded-xl border border-[#C5A059]/40 shadow-xs">
            <span className="text-xs font-semibold text-[#541508] font-mono">₹</span>
            <input
              type="number"
              min="0"
              step="50"
              value={driverAllowance}
              onChange={(e) => setDriverAllowance(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
              className="w-24 bg-transparent text-sm font-bold font-mono text-[#541508] focus:outline-none"
              placeholder="500"
            />
            <span className="text-xs font-medium text-[#5C5350]">/ day</span>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {fleet.map((vehicle, idx) => (
            <div
              key={vehicle.id || idx}
              className={`p-5 rounded-2xl border transition ${
                vehicle.isActive
                  ? 'bg-white border-[#C5A059]/40 shadow-xs'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              {/* Header with Active Toggle */}
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#C5A059]/20">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#7C1D23] font-bold">
                    Vehicle Type {idx + 1}
                  </span>
                  <h4 className="font-serif text-lg font-medium text-[#2C2523]">
                    {vehicle.title}
                  </h4>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleActive(idx)}
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full transition cursor-pointer ${
                    vehicle.isActive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {vehicle.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-[#5C5350] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={vehicle.title}
                    onChange={(e) => handleFieldChange(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-50 rounded-lg border border-[#C5A059]/30 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#5C5350] mb-1">
                    Car Models / Make
                  </label>
                  <input
                    type="text"
                    value={vehicle.model}
                    onChange={(e) => handleFieldChange(idx, 'model', e.target.value)}
                    className="w-full px-3 py-1.5 bg-stone-50 rounded-lg border border-[#C5A059]/30 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                  />
                </div>

                {/* Rates Row */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#C5A059]/20">
                    <label className="block text-[10px] font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold mb-1">
                      Per-KM Rate
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-[#2C2523]">₹</span>
                      <input
                        type="number"
                        value={vehicle.perKmRate}
                        onChange={(e) =>
                          handleFieldChange(idx, 'perKmRate', Number(e.target.value))
                        }
                        className="w-full px-2 py-1 text-sm font-bold font-mono bg-white rounded border border-[#C5A059]/40 text-[#2C2523]"
                      />
                      <span className="text-[10px] text-[#5C5350]">/km</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#C5A059]/20">
                    <label className="block text-[10px] font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold mb-1">
                      Daily Rental
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-[#2C2523]">₹</span>
                      <input
                        type="number"
                        value={vehicle.dailyRate}
                        onChange={(e) =>
                          handleFieldChange(idx, 'dailyRate', Number(e.target.value))
                        }
                        className="w-full px-2 py-1 text-sm font-bold font-mono bg-white rounded border border-[#C5A059]/40 text-[#2C2523]"
                      />
                      <span className="text-[10px] text-[#5C5350]">/day</span>
                    </div>
                  </div>
                </div>

                {/* Fixed Route Transfer Fares */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5C5350] mb-1">
                      Kathgodam Transfer
                    </label>
                    <input
                      type="text"
                      value={vehicle.rateKathgodam}
                      onChange={(e) => handleFieldChange(idx, 'rateKathgodam', e.target.value)}
                      placeholder="e.g. ₹2,499"
                      className="w-full px-3 py-1.5 bg-stone-50 rounded-lg border border-[#C5A059]/30 text-[#2C2523] font-mono focus:outline-hidden focus:border-[#7C1D23]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#5C5350] mb-1">
                      Delhi Transfer
                    </label>
                    <input
                      type="text"
                      value={vehicle.rateDelhi}
                      onChange={(e) => handleFieldChange(idx, 'rateDelhi', e.target.value)}
                      placeholder="e.g. ₹7,499"
                      className="w-full px-3 py-1.5 bg-stone-50 rounded-lg border border-[#C5A059]/30 text-[#2C2523] font-mono focus:outline-hidden focus:border-[#7C1D23]"
                    />
                  </div>
                </div>

                {/* Capacity Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5C5350] mb-1">
                      Passenger Seats
                    </label>
                    <input
                      type="number"
                      value={vehicle.seats}
                      onChange={(e) => handleFieldChange(idx, 'seats', Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-stone-50 rounded-lg border border-[#C5A059]/30 text-[#2C2523] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#5C5350] mb-1">
                      Luggage Capacity
                    </label>
                    <input
                      type="text"
                      value={vehicle.luggage}
                      onChange={(e) => handleFieldChange(idx, 'luggage', e.target.value)}
                      className="w-full px-3 py-1.5 bg-stone-50 rounded-lg border border-[#C5A059]/30 text-[#2C2523]"
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

export default FleetManager;
