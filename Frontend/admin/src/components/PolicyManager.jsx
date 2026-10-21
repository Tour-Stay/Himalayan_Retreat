import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient } from '@shared';
import { useToast } from './Toast';

export const PolicyManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const toastContext = useToast();
  const addToast = toastContext.addToast || toastContext.showToast;

  const [hotelPolicies, setHotelPolicies] = useState({
    checkInTime: '',
    checkOutTime: '',
    cancellationPolicy: '',
    diningHours: '',
    amenitiesList: [],
  });

  const [travelPolicies, setTravelPolicies] = useState({
    nightChargeAmount: 300,
    driverAllowancePerDay: 500,
    faqs: [],
  });

  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
  const [newAmenity, setNewAmenity] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.hotelPolicies) {
      setHotelPolicies({
        checkInTime: settings.hotelPolicies.checkInTime || '',
        checkOutTime: settings.hotelPolicies.checkOutTime || '',
        cancellationPolicy: settings.hotelPolicies.cancellationPolicy || '',
        diningHours: settings.hotelPolicies.diningHours || '',
        amenitiesList: settings.hotelPolicies.amenitiesList || [],
      });
    }
    if (settings?.travelPolicies) {
      setTravelPolicies({
        nightChargeAmount: settings.travelPolicies.nightChargeAmount !== undefined ? settings.travelPolicies.nightChargeAmount : 300,
        driverAllowancePerDay: settings.travelPolicies.driverAllowancePerDay !== undefined ? settings.travelPolicies.driverAllowancePerDay : 500,
        faqs: settings.travelPolicies.faqs || [],
      });
    }
  }, [settings]);

  const handleAddFaq = () => {
    if (!newFaq.q.trim() || !newFaq.a.trim()) return;
    setTravelPolicies((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { ...newFaq }],
    }));
    setNewFaq({ q: '', a: '' });
  };

  const handleRemoveFaq = (index) => {
    setTravelPolicies((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    setHotelPolicies((prev) => ({
      ...prev,
      amenitiesList: [...prev.amenitiesList, newAmenity.trim()],
    }));
    setNewAmenity('');
  };

  const handleRemoveAmenity = (index) => {
    setHotelPolicies((prev) => ({
      ...prev,
      amenitiesList: prev.amenitiesList.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.patch('/settings/hotelPolicies', hotelPolicies);
      await apiClient.patch('/settings/travelPolicies', travelPolicies);
      addToast('Hotel policies, operating hours & FAQs updated successfully!', 'success');
      await refreshSettings();
    } catch (err) {
      console.error('Error saving policies:', err);
      addToast(err.response?.data?.message || 'Failed to update policies', 'error');
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
              House Rules &amp; Guest Information
            </span>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#0F172A]">
              Resort Policies, Dining Hours &amp; FAQs
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure front-desk check-in/out hours, kitchen timings, cancellation terms, and travel FAQs displayed across all sites.
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
                <span>Saving Policies...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#0B1118]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save All Policies</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-6 font-sans">
          {/* Hotel Policies Group */}
          <div>
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#0B1118] font-bold mb-3">
              1. Hotel Operating Hours &amp; Rules
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Check-In Time
                </label>
                <input
                  type="text"
                  value={hotelPolicies.checkInTime}
                  onChange={(e) =>
                    setHotelPolicies((prev) => ({ ...prev, checkInTime: e.target.value }))
                  }
                  placeholder="e.g. 12:00 PM"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Check-Out Time
                </label>
                <input
                  type="text"
                  value={hotelPolicies.checkOutTime}
                  onChange={(e) =>
                    setHotelPolicies((prev) => ({ ...prev, checkOutTime: e.target.value }))
                  }
                  placeholder="e.g. 10:00 AM"
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kitchen &amp; Dining Hours
                </label>
                <input
                  type="text"
                  value={hotelPolicies.diningHours}
                  onChange={(e) =>
                    setHotelPolicies((prev) => ({ ...prev, diningHours: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cancellation &amp; Refund Policy
                </label>
                <textarea
                  rows={2}
                  value={hotelPolicies.cancellationPolicy}
                  onChange={(e) =>
                    setHotelPolicies((prev) => ({ ...prev, cancellationPolicy: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Amenities Tag Manager */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#0B1118] font-bold mb-2">
              2. Hotel Highlights &amp; Signature Amenities
            </h4>

            <div className="flex flex-wrap gap-2 mb-3">
              {hotelPolicies.amenitiesList.map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-slate-300 text-xs text-[#0F172A]"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(idx)}
                    className="text-rose-700 hover:text-rose-900 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add new amenity (e.g. Electric Heated Blankets)"
                className="flex-1 px-3 py-1.5 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-3.5 py-1.5 bg-[#FAF8F5] text-[#0B1118] border border-slate-300 text-xs font-cinzel font-bold hover:bg-slate-200 transition cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Travel FAQs Manager */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#0B1118] font-bold mb-3">
              3. Frequently Asked Questions (FAQs)
            </h4>

            <div className="space-y-3 mb-4">
              {travelPolicies.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#FAF8F5] border border-slate-200 text-xs relative"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <strong className="text-[#0F172A] font-medium">Q: {faq.q}</strong>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-rose-700 hover:text-rose-900 font-bold text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-slate-600">A: {faq.a}</p>
                </div>
              ))}
            </div>

            {/* Add New FAQ Card */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#C5A059]/30 text-xs space-y-2">
              <div className="font-cinzel text-[10px] uppercase font-bold text-[#0B1118]">
                + Add New FAQ Question
              </div>
              <input
                type="text"
                value={newFaq.q}
                onChange={(e) => setNewFaq((prev) => ({ ...prev, q: e.target.value }))}
                placeholder="Question (e.g. How far is the resort from Kathgodam?)"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
              />
              <textarea
                rows={2}
                value={newFaq.a}
                onChange={(e) => setNewFaq((prev) => ({ ...prev, a: e.target.value }))}
                placeholder="Answer..."
                className="w-full px-3 py-1.5 bg-white border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B1118] border border-[#D4AF37] font-cinzel font-bold text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Add FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyManager;
