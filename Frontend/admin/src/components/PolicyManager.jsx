import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient } from '@shared';
import { useToast } from './Toast';

export const PolicyManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const { showToast } = useToast();

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
        nightChargeAmount: settings.travelPolicies.nightChargeAmount || 300,
        driverAllowancePerDay: settings.travelPolicies.driverAllowancePerDay || 500,
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
      showToast('Hotel policies, operating hours & FAQs updated successfully!', 'success');
      await refreshSettings();
    } catch (err) {
      console.error('Error saving policies:', err);
      showToast(err.response?.data?.message || 'Failed to update policies', 'error');
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
              House Rules & Guest Information
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523]">
              Resort Policies, Dining Hours & FAQs
            </h3>
            <p className="text-xs text-[#5C5350] mt-1">
              Configure front-desk check-in/out hours, kitchen timings, cancellation terms, and travel FAQs displayed across all sites.
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
                <span>Saving Policies...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save All Policies</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Hotel Policies Group */}
          <div>
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold mb-3">
              1. Hotel Operating Hours & Rules
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Check-In Time
                </label>
                <input
                  type="text"
                  value={hotelPolicies.checkInTime}
                  onChange={(e) =>
                    setHotelPolicies((prev) => ({ ...prev, checkInTime: e.target.value }))
                  }
                  placeholder="e.g. 12:00 PM"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Check-Out Time
                </label>
                <input
                  type="text"
                  value={hotelPolicies.checkOutTime}
                  onChange={(e) =>
                    setHotelPolicies((prev) => ({ ...prev, checkOutTime: e.target.value }))
                  }
                  placeholder="e.g. 10:00 AM"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Kitchen & Dining Hours
                </label>
                <input
                  type="text"
                  value={hotelPolicies.diningHours}
                  onChange={(e) =>
                    setHotelPolicies((prev) => ({ ...prev, diningHours: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Cancellation & Refund Policy
                </label>
                <textarea
                  rows={2}
                  value={hotelPolicies.cancellationPolicy}
                  onChange={(e) =>
                    setHotelPolicies((prev) => ({ ...prev, cancellationPolicy: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>
            </div>
          </div>

          {/* Amenities Tag Manager */}
          <div className="pt-4 border-t border-[#C5A059]/20">
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold mb-2">
              2. Hotel Highlights & Signature Amenities
            </h4>

            <div className="flex flex-wrap gap-2 mb-3">
              {hotelPolicies.amenitiesList.map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#C5A059]/30 rounded-full text-xs text-[#2C2523]"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(idx)}
                    className="text-[#7C1D23] hover:text-red-700 font-bold ml-1 cursor-pointer"
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
                className="flex-1 px-3 py-1.5 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523]"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-3.5 py-1.5 bg-[#FAF6EF] text-[#7C1D23] border border-[#C5A059]/40 rounded-xl text-xs font-bold hover:bg-[#C5A059]/20 transition cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Travel FAQs Manager */}
          <div className="pt-4 border-t border-[#C5A059]/20">
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold mb-3">
              3. Frequently Asked Questions (FAQs)
            </h4>

            <div className="space-y-3 mb-4">
              {travelPolicies.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-[#C5A059]/30 text-xs relative group"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <strong className="text-[#2C2523] font-medium">Q: {faq.q}</strong>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(idx)}
                      className="text-red-700 hover:text-red-900 font-bold text-xs cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-[#5C5350]">A: {faq.a}</p>
                </div>
              ))}
            </div>

            {/* Add New FAQ Card */}
            <div className="p-3.5 bg-[#FAF6EF] rounded-xl border border-[#C5A059]/30 text-xs space-y-2">
              <div className="font-cinzel text-[10px] uppercase font-bold text-[#7C1D23]">
                + Add New FAQ Question
              </div>
              <input
                type="text"
                value={newFaq.q}
                onChange={(e) => setNewFaq((prev) => ({ ...prev, q: e.target.value }))}
                placeholder="Question (e.g. How far is the resort from Kathgodam?)"
                className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#C5A059]/30 text-[#2C2523]"
              />
              <textarea
                rows={2}
                value={newFaq.a}
                onChange={(e) => setNewFaq((prev) => ({ ...prev, a: e.target.value }))}
                placeholder="Answer..."
                className="w-full px-3 py-1.5 bg-white rounded-lg border border-[#C5A059]/30 text-[#2C2523]"
              />
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-4 py-1.5 bg-[#7C1D23] text-white rounded-lg text-xs font-semibold hover:bg-[#5C151A] transition cursor-pointer"
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
