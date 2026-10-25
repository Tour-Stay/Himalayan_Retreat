import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient } from '@shared';
import { useToast } from './Toast';

export const DriverManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const toastContext = useToast();
  const addToast = toastContext.addToast || toastContext.showToast;

  // Allowance States
  const [allowancePerDay, setAllowancePerDay] = useState(500);
  const [shortTripAllowance, setShortTripAllowance] = useState(250);
  const [longDayDropAllowance, setLongDayDropAllowance] = useState(450);
  const [nightHaltCharge, setNightHaltCharge] = useState(300);
  const [guidelines, setGuidelines] = useState(
    'Standard mountain duty hours: 06:00 AM - 09:00 PM. Local Pahadi drivers ensure safe driving across high-altitude Ghats. All chauffeurs receive free food and lodging allowances.'
  );

  // Driver Roster State
  const [driverRoster, setDriverRoster] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // New Driver Modal / Form State
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    vehicleAssigned: 'Maruti Suzuki Dzire (Sedan)',
    experience: '10+ Years (Kumaon Hills)',
    rating: 4.9,
    status: 'Available',
  });

  useEffect(() => {
    const tp = settings?.travelPolicies;
    if (tp) {
      if (tp.driverAllowancePerDay !== undefined) setAllowancePerDay(tp.driverAllowancePerDay);
      if (tp.driverShortTripAllowance !== undefined) setShortTripAllowance(tp.driverShortTripAllowance);
      if (tp.driverLongDayDropAllowance !== undefined) setLongDayDropAllowance(tp.driverLongDayDropAllowance);
      if (tp.driverNightHaltCharge !== undefined) setNightHaltCharge(tp.driverNightHaltCharge);
      if (tp.nightChargeAmount !== undefined && tp.driverNightHaltCharge === undefined) setNightHaltCharge(tp.nightChargeAmount);
      if (tp.driverGuidelines) setGuidelines(tp.driverGuidelines);
      if (Array.isArray(tp.driverRoster) && tp.driverRoster.length > 0) {
        setDriverRoster(JSON.parse(JSON.stringify(tp.driverRoster)));
      } else {
        // Fallback seed drivers
        setDriverRoster([
          {
            id: 'drv-1',
            name: 'Ramesh Bisht',
            phone: '+91 94120 12345',
            experience: '12 Years (Kumaon Hills)',
            vehicleAssigned: 'Maruti Suzuki Dzire',
            rating: 4.9,
            status: 'Available',
          },
          {
            id: 'drv-2',
            name: 'Kailash Tiwari',
            phone: '+91 94120 54321',
            experience: '15 Years (Char Dham & Kumaon)',
            vehicleAssigned: 'Toyota Innova Crysta',
            rating: 5.0,
            status: 'Available',
          },
          {
            id: 'drv-3',
            name: 'Devendra Rawat',
            phone: '+91 94120 98765',
            experience: '18 Years (Highway & Mountains)',
            vehicleAssigned: 'Force Urbania Minibus',
            rating: 4.9,
            status: 'Available',
          },
        ]);
      }
    }
  }, [settings]);

  const handleDriverFieldChange = (index, field, value) => {
    setDriverRoster((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleToggleDriverStatus = (index) => {
    setDriverRoster((prev) => {
      const updated = [...prev];
      const current = updated[index].status || 'Available';
      const nextStatus = current === 'Available' ? 'On Trip' : current === 'On Trip' ? 'Off Duty' : 'Available';
      updated[index] = { ...updated[index], status: nextStatus };
      return updated;
    });
  };

  const handleDeleteDriver = (index) => {
    setDriverRoster((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddDriverSubmit = (e) => {
    e.preventDefault();
    if (!newDriver.name.trim() || !newDriver.phone.trim()) {
      addToast('Please provide a driver name and contact phone number', 'error');
      return;
    }
    const created = {
      ...newDriver,
      id: `drv-${Date.now()}`,
    };
    setDriverRoster((prev) => [...prev, created]);
    setNewDriver({
      name: '',
      phone: '',
      vehicleAssigned: 'Maruti Suzuki Dzire (Sedan)',
      experience: '10+ Years (Kumaon Hills)',
      rating: 4.9,
      status: 'Available',
    });
    setIsAddingDriver(false);
    addToast('New chauffeur added to roster! Click Save to apply.', 'success');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const currentPolicies = settings?.travelPolicies || {};
      const payload = {
        ...currentPolicies,
        driverAllowancePerDay: allowancePerDay === '' ? 0 : Math.max(0, Number(allowancePerDay)),
        driverShortTripAllowance: shortTripAllowance === '' ? 0 : Math.max(0, Number(shortTripAllowance)),
        driverLongDayDropAllowance: longDayDropAllowance === '' ? 0 : Math.max(0, Number(longDayDropAllowance)),
        driverNightHaltCharge: nightHaltCharge === '' ? 0 : Math.max(0, Number(nightHaltCharge)),
        nightChargeAmount: nightHaltCharge === '' ? 0 : Math.max(0, Number(nightHaltCharge)),
        driverGuidelines: guidelines,
        driverRoster,
      };

      await apiClient.patch('/settings/travelPolicies', payload);
      addToast('Driver Tariffs, Mountain Batta & Chauffeur Roster Saved!', 'success');
      await refreshSettings();
    } catch (err) {
      console.error('Error saving driver policies:', err);
      addToast(err.response?.data?.message || 'Failed to save driver policies', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Save Action */}
      <div className="bg-white p-5 sm:p-6 border border-slate-300 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#073125] font-cinzel font-bold inline-block px-2 py-0.5 bg-[#073125]/10 border border-[#073125]/20 mb-1">
              Travel Logistics &amp; Driver Authority Desk
            </span>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#0F172A]">
              Driver Tariffs, Hill Batta &amp; Chauffeur Directory
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Decide the exact food &amp; lodging costs paid to drivers across high-altitude mountain trips, short-distance transfers in plains, and overnight outstations.
            </p>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-cinzel font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 shadow-sm border border-[#0F172A] whitespace-nowrap active:scale-95"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Driver Rates...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save All Driver Settings</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Multi-Tier Allowance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
          {/* 1. Mountain Daily Batta */}
          <div className="p-4 bg-slate-50/90 border border-slate-200 hover:border-slate-400 flex flex-col justify-between shadow-2xs transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xl">⛰️</span>
                <span className="text-[10px] font-mono uppercase text-[#073125] font-bold bg-[#073125]/10 px-2 py-0.5 border border-[#073125]/20">
                  High Altitude
                </span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#0F172A]">
                Mountain Daily Batta
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Round-trip tours &amp; multi-day hill trips. Set to <strong className="text-[#0F172A]">0</strong> to waive driver fee in calculator.
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center gap-2 bg-white px-3 py-2 border border-slate-300">
              <span className="text-xs font-semibold text-slate-700 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={allowancePerDay}
                onChange={(e) => setAllowancePerDay(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                className="w-full bg-transparent text-sm font-bold font-mono text-[#0F172A] focus:outline-none"
                placeholder="500"
              />
              <span className="text-[11px] text-slate-500 whitespace-nowrap">/ day</span>
            </div>
          </div>

          {/* 2. Short Distance / Local Transfer */}
          <div className="p-4 bg-slate-50/90 border border-slate-200 hover:border-slate-400 flex flex-col justify-between shadow-2xs transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xl">📍</span>
                <span className="text-[10px] font-mono uppercase text-emerald-900 font-bold bg-emerald-100/70 px-2 py-0.5 border border-emerald-300">
                  ≤ 70 km Local
                </span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#0F172A]">
                Short Trip / Plains Batta
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                One-way local drop (e.g. Almora, Kainchi, or plains short transfer). Set to <strong className="text-[#0F172A]">0</strong> to waive.
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center gap-2 bg-white px-3 py-2 border border-slate-300">
              <span className="text-xs font-semibold text-slate-700 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={shortTripAllowance}
                onChange={(e) => setShortTripAllowance(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                className="w-full bg-transparent text-sm font-bold font-mono text-[#0F172A] focus:outline-none"
                placeholder="250"
              />
              <span className="text-[11px] text-slate-500 whitespace-nowrap">/ drop</span>
            </div>
          </div>

          {/* 3. Long Day Transfer Drop */}
          <div className="p-4 bg-slate-50/90 border border-slate-200 hover:border-slate-400 flex flex-col justify-between shadow-2xs transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xl">🛣️</span>
                <span className="text-[10px] font-mono uppercase text-sky-900 font-bold bg-sky-100/70 px-2 py-0.5 border border-sky-300">
                  &gt; 70 km Highway
                </span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#0F172A]">
                Long Highway Drop Batta
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                One-way long station transfers (e.g. Kathgodam Station, Pantnagar Airport, Delhi NCR drops).
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center gap-2 bg-white px-3 py-2 border border-slate-300">
              <span className="text-xs font-semibold text-slate-700 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={longDayDropAllowance}
                onChange={(e) => setLongDayDropAllowance(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                className="w-full bg-transparent text-sm font-bold font-mono text-[#0F172A] focus:outline-none"
                placeholder="450"
              />
              <span className="text-[11px] text-slate-500 whitespace-nowrap">/ drop</span>
            </div>
          </div>

          {/* 4. Night Halt Charge */}
          <div className="p-4 bg-slate-50/90 border border-slate-200 hover:border-slate-400 flex flex-col justify-between shadow-2xs transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xl">🌙</span>
                <span className="text-[10px] font-mono uppercase text-purple-900 font-bold bg-purple-100/70 px-2 py-0.5 border border-purple-300">
                  Overnight Stay
                </span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#0F172A]">
                Driver Night Halt Charge
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                Fixed night charge when vehicles and chauffeurs halt away from headquarters overnight.
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center gap-2 bg-white px-3 py-2 border border-slate-300">
              <span className="text-xs font-semibold text-slate-700 font-mono">₹</span>
              <input
                type="number"
                min="0"
                step="50"
                value={nightHaltCharge}
                onChange={(e) => setNightHaltCharge(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                className="w-full bg-transparent text-sm font-bold font-mono text-[#0F172A] focus:outline-none"
                placeholder="300"
              />
              <span className="text-[11px] text-slate-500 whitespace-nowrap">/ night</span>
            </div>
          </div>
        </div>

        {/* Driver Guidelines & Standard Policies */}
        <div className="p-4 bg-slate-50/90 border border-slate-200 shadow-2xs mb-6">
          <label className="block text-xs font-cinzel uppercase tracking-wider text-[#0F172A] font-bold mb-1.5">
            📜 Chauffeur Mountain Guidelines &amp; Rest Policies
          </label>
          <textarea
            rows={2}
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            className="w-full p-3 bg-white border border-slate-300 text-xs text-[#0F172A] leading-relaxed focus:outline-none focus:border-[#0F172A]"
            placeholder="Specify duty hours, rest intervals, and driving safety standards..."
          />
        </div>

        {/* Chauffeur Roster Section */}
        <div>
          <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#0F172A]">
                Trusted Local Pahadi Chauffeurs ({driverRoster.length})
              </h4>
              <p className="text-xs text-slate-500">
                Active verified drivers available for instant booking dispatch and guest pickups.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingDriver(!isAddingDriver)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-cinzel font-bold uppercase tracking-wider bg-[#0F172A] text-white hover:bg-[#1E293B] border border-[#0F172A] transition cursor-pointer shadow-xs active:scale-95"
            >
              <span>{isAddingDriver ? '✕ Cancel' : '+ Add Driver'}</span>
            </button>
          </div>

          {/* Add Driver Inline Form */}
          {isAddingDriver && (
            <form
              onSubmit={handleAddDriverSubmit}
              className="mb-6 p-4 bg-slate-50 border border-slate-300 space-y-3.5 shadow-xs"
            >
              <h5 className="font-serif text-sm font-bold text-[#0F172A]">
                Register New Mountain Chauffeur
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Driver Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    placeholder="e.g. Anand Pandey"
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    placeholder="+91 94120 00000"
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Assigned Vehicle
                  </label>
                  <input
                    type="text"
                    value={newDriver.vehicleAssigned}
                    onChange={(e) => setNewDriver({ ...newDriver, vehicleAssigned: e.target.value })}
                    placeholder="e.g. Maruti Suzuki Dzire"
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Driving Experience
                  </label>
                  <input
                    type="text"
                    value={newDriver.experience}
                    onChange={(e) => setNewDriver({ ...newDriver, experience: e.target.value })}
                    placeholder="e.g. 12 Years (Kumaon Hills)"
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingDriver(false)}
                  className="px-4 py-1.5 text-xs font-cinzel font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 text-xs font-cinzel font-bold uppercase tracking-wider bg-[#0F172A] text-white hover:bg-[#1E293B] border border-[#0F172A] cursor-pointer shadow-xs active:scale-95"
                >
                  Add to Roster
                </button>
              </div>
            </form>
          )}

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {driverRoster.map((driver, idx) => (
              <div
                key={driver.id || idx}
                className="p-4 bg-white border border-slate-300 hover:border-slate-800 shadow-2xs flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-xs text-[#0F172A]">
                        👨‍✈️
                      </span>
                      <div>
                        <h5 className="font-serif text-sm font-bold text-[#0F172A]">
                          {driver.name}
                        </h5>
                        <span className="text-[10px] text-slate-500 block">
                          ⭐ {driver.rating || 4.9} Rating • {driver.experience || 'Experienced'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleDriverStatus(idx)}
                      className={`px-2 py-0.5 text-[10px] font-cinzel font-bold uppercase tracking-wider border cursor-pointer transition ${
                        driver.status === 'Available'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : driver.status === 'On Trip'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                      }`}
                    >
                      {driver.status || 'Available'}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Contact Phone:</span>
                      <a
                        href={`tel:${driver.phone}`}
                        className="font-mono font-bold text-[#0F172A] hover:text-blue-700"
                      >
                        {driver.phone}
                      </a>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 block">Assigned Vehicle:</span>
                      <input
                        type="text"
                        value={driver.vehicleAssigned || ''}
                        onChange={(e) => handleDriverFieldChange(idx, 'vehicleAssigned', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-300 text-xs text-[#0F172A] mt-0.5 focus:outline-none focus:border-[#0F172A]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                  <a
                    href={`https://wa.me/${(driver.phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                  >
                    <span>💬 WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDeleteDriver(idx)}
                    className="text-rose-700 hover:text-rose-900 text-[11px] font-medium cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverManager;
