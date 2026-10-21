import { useState, useMemo } from 'react';
import { useSiteSettings, apiClient, calculateStayTariff } from '@shared';
import { useToast } from './Toast';

export default function YieldManager({ rooms = [] }) {
  const toastContext = useToast();
  const addToast = toastContext.addToast || toastContext.showToast;
  const { settings, refreshSettings } = useSiteSettings();

  const currentRules = settings?.pricingRules || {
    weekendSurchargePercent: 15,
    seasonalRules: [
      {
        id: 'snowfall-peak',
        title: 'Winter Snowfall Peak Season',
        multiplierPercent: 35,
        startDate: '12-20',
        endDate: '01-10',
        isActive: true,
      },
    ],
  };

  const [weekendSurcharge, setWeekendSurcharge] = useState(currentRules.weekendSurchargePercent ?? 15);
  const [seasonalRules, setSeasonalRules] = useState(currentRules.seasonalRules || []);
  const [isSaving, setIsSaving] = useState(false);

  // Simulator states
  const [simRoomId, setSimRoomId] = useState(rooms[0]?._id || '');
  const [simCheckIn, setSimCheckIn] = useState('2026-12-24');
  const [simCheckOut, setSimCheckOut] = useState('2026-12-28');

  // Selected sample room for simulation
  const selectedSimRoom = useMemo(() => {
    return rooms.find((r) => r._id === simRoomId) || rooms[0] || { name: 'Luxury Suite', pricePerNight: 3500 };
  }, [rooms, simRoomId]);

  // Dynamic simulation calculation
  const simulationResult = useMemo(() => {
    return calculateStayTariff(
      selectedSimRoom.pricePerNight,
      simCheckIn,
      simCheckOut,
      {
        weekendSurchargePercent: Number(weekendSurcharge) || 0,
        seasonalRules: seasonalRules,
      }
    );
  }, [selectedSimRoom, simCheckIn, simCheckOut, weekendSurcharge, seasonalRules]);

  // Add a new seasonal window
  const handleAddRule = () => {
    const newRule = {
      id: `season-${Date.now()}`,
      title: 'New Seasonal Window',
      multiplierPercent: 25,
      startDate: '05-01',
      endDate: '06-30',
      isActive: true,
    };
    setSeasonalRules((prev) => [...prev, newRule]);
  };

  // Update rule field
  const handleUpdateRule = (index, field, value) => {
    setSeasonalRules((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Remove rule
  const handleRemoveRule = (index) => {
    setSeasonalRules((prev) => prev.filter((_, i) => i !== index));
  };

  // Save all pricing rules to backend
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await apiClient.put('/settings', {
        pricingRules: {
          weekendSurchargePercent: Number(weekendSurcharge) || 0,
          seasonalRules: seasonalRules.map((r) => ({
            id: r.id || `season-${Date.now()}`,
            title: r.title,
            multiplierPercent: Number(r.multiplierPercent) || 0,
            startDate: r.startDate,
            endDate: r.endDate,
            isActive: Boolean(r.isActive),
          })),
        },
      });

      addToast('Dynamic yield & pricing rules saved successfully!', 'success');
      if (refreshSettings) await refreshSettings();
    } catch (err) {
      console.error('Save pricing rules error:', err);
      addToast(err.response?.data?.message || 'Failed to save pricing rules.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-[#0F172A] font-sans">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 border border-[#C5A059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-cinzel tracking-[0.2em] text-[#C5A059] font-bold block mb-1">
            Revenue &amp; Yield Management
          </span>
          <h2 className="text-lg sm:text-2xl font-bold font-serif text-[#0F172A]">
            Dynamic Seasonal Pricing &amp; Weekend Rates
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Configure automated tariff adjustments for peak winter snowfall, long weekends, and sacred festival windows. Public booking calculations update immediately across the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B1118] font-cinzel font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 self-start sm:self-auto shrink-0 border border-[#D4AF37]"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-[#0B1118]/30 border-t-[#0B1118] rounded-full animate-spin shrink-0" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <span>✓</span>
              <span>Save Pricing Rules</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: Left = Rules, Right = Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Weekend & Seasonal Rules */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card 1: Weekend Surcharge */}
          <div className="bg-white p-4 sm:p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-cinzel font-bold text-xs sm:text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Weekend Rate Surcharge (Fri &amp; Sat Nights)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automatically elevates room tariffs on Friday and Saturday nights to capture mountain weekend getaway demand.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 border border-slate-300 font-mono text-sm font-bold text-[#0F172A]">
                <span>+{weekendSurcharge}%</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={weekendSurcharge}
                onChange={(e) => setWeekendSurcharge(Number(e.target.value))}
                className="w-full accent-[#0B1118] cursor-pointer"
              />
              <span className="text-xs font-mono font-semibold text-slate-700 w-12 text-right">
                {weekendSurcharge}%
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0% (Standard)</span>
              <span>+25% (Popular)</span>
              <span>+50% (High Peak)</span>
            </div>
          </div>

          {/* Card 2: Seasonal Date Windows */}
          <div className="bg-white p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel font-bold text-xs sm:text-sm text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Seasonal Peak Date Windows &amp; Surcharges</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Set custom date windows (e.g. Winter Snowfall, Summer Rush, Diwali) with custom multiplier surcharges.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRule}
                className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-slate-200 text-[#0F172A] border border-slate-300 text-xs font-cinzel font-semibold transition cursor-pointer shadow-2xs whitespace-nowrap"
              >
                + Add Window
              </button>
            </div>

            {/* Rules List */}
            {seasonalRules.length === 0 ? (
              <div className="p-8 text-center bg-[#FAF8F5] border border-dashed border-slate-300 text-slate-500 text-xs">
                No active seasonal pricing rules. Click "+ Add Window" to configure peak seasons.
              </div>
            ) : (
              <div className="space-y-3">
                {seasonalRules.map((rule, idx) => (
                  <div
                    key={rule.id || idx}
                    className="p-3.5 sm:p-4 bg-[#FAF8F5] border border-slate-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase font-cinzel text-slate-600 font-bold mb-1">
                          Rule / Season Name
                        </label>
                        <input
                          type="text"
                          value={rule.title}
                          onChange={(e) => handleUpdateRule(idx, 'title', e.target.value)}
                          placeholder="e.g. Winter Snowfall Peak"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <div className="flex items-center gap-2 self-end pb-1">
                        <label className="flex items-center gap-1.5 text-xs text-[#0F172A] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rule.isActive !== false}
                            onChange={(e) => handleUpdateRule(idx, 'isActive', e.target.checked)}
                            className="text-[#0B1118] focus:ring-0 w-4 h-4 cursor-pointer"
                          />
                          <span className="text-[11px] font-medium font-cinzel">Active</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveRule(idx)}
                          className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-1"
                          title="Delete season rule"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] uppercase font-cinzel text-slate-500 mb-1">
                          Start Date (MM-DD)
                        </label>
                        <input
                          type="text"
                          value={rule.startDate}
                          onChange={(e) => handleUpdateRule(idx, 'startDate', e.target.value)}
                          placeholder="12-20"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-cinzel text-slate-500 mb-1">
                          End Date (MM-DD)
                        </label>
                        <input
                          type="text"
                          value={rule.endDate}
                          onChange={(e) => handleUpdateRule(idx, 'endDate', e.target.value)}
                          placeholder="01-10"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 font-mono text-xs focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-cinzel text-slate-500 mb-1">
                          Multiplier Surcharge
                        </label>
                        <div className="flex items-center">
                          <span className="px-2 py-1.5 bg-slate-100 border border-r-0 border-slate-300 text-slate-500 font-mono text-xs">
                            +
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={rule.multiplierPercent}
                            onChange={(e) => handleUpdateRule(idx, 'multiplierPercent', Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-white border border-slate-300 font-mono text-xs text-[#0F172A] font-bold focus:outline-none focus:border-[#C5A059]"
                          />
                          <span className="px-2 py-1.5 bg-slate-100 border border-l-0 border-slate-300 text-slate-500 font-mono text-xs">
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Real-Time Pricing Simulator */}
        <div className="space-y-5">
          <div className="bg-white p-4 sm:p-5 border border-[#C5A059]/40 shadow-xs space-y-4 sticky top-6">
            <div>
              <span className="text-[10px] uppercase font-cinzel tracking-[0.2em] text-[#C5A059] font-bold block mb-1">
                Live Pricing Test Simulator
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#0F172A]">
                Stay Tariff Calculation Preview
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Simulate how public room bookings calculate rates for any specific dates.
              </p>
            </div>

            {/* Simulator Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-cinzel font-bold text-slate-600 mb-1">
                  Sample Suite / Room
                </label>
                <select
                  value={simRoomId}
                  onChange={(e) => setSimRoomId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-slate-300 text-xs text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
                >
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} — Base ₹{Number(r.pricePerNight).toLocaleString('en-IN')}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-cinzel font-bold text-slate-600 mb-1">
                    Check-In
                  </label>
                  <input
                    type="date"
                    value={simCheckIn}
                    onChange={(e) => setSimCheckIn(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[#FAF8F5] border border-slate-300 text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-cinzel font-bold text-slate-600 mb-1">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    value={simCheckOut}
                    onChange={(e) => setSimCheckOut(e.target.value)}
                    className="w-full px-2 py-1.5 bg-[#FAF8F5] border border-slate-300 text-xs font-mono focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="p-3.5 bg-[#FAF8F5] border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Duration:</span>
                <span className="font-mono font-bold text-[#0F172A]">{simulationResult.nights} Nights</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Base Room Rate:</span>
                <span className="font-mono font-medium text-slate-700">₹{selectedSimRoom.pricePerNight?.toLocaleString('en-IN')}/night</span>
              </div>

              {simulationResult.hasSurcharge && (
                <div className="p-2 bg-amber-50 border border-amber-300 text-[11px] text-amber-900 font-medium">
                  ✨ {simulationResult.activeSurchargeReason}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-cinzel font-bold text-[#0F172A]">Avg Nightly Rate:</span>
                <span className="font-mono font-bold text-sm text-[#0F172A]">
                  ₹{simulationResult.avgPricePerNight?.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-2.5 border border-[#C5A059]/40">
                <span className="text-xs font-cinzel font-bold text-[#0F172A]">Total Stay Tariff:</span>
                <span className="font-mono font-bold text-base text-[#0B1118]">
                  ₹{simulationResult.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Per-Night Itemized Breakdown */}
            {simulationResult.breakdown?.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] uppercase font-cinzel font-bold text-slate-500 block">
                  Night-by-Night Breakdown:
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {simulationResult.breakdown.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[11px] bg-[#FAF8F5] p-2 border border-slate-200"
                    >
                      <span className="font-mono text-slate-600">
                        {b.date} ({b.dayName})
                      </span>
                      <span className="font-mono font-bold text-[#0F172A]">
                        ₹{b.appliedRate?.toLocaleString('en-IN')}
                        {b.surchargePercent > 0 && (
                          <span className="text-[9px] text-amber-700 ml-1 font-sans font-normal">
                            (+{b.surchargePercent}%)
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
