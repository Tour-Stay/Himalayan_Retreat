import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient } from '@shared';
import { useToast } from './Toast';

export const CompanyManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    brandName: '',
    hotelName: '',
    travelName: '',
    tagline: '',
    elevation: '',
    conciergePhone: '',
    whatsappNumber: '',
    whatsappDisplay: '',
    email: '',
    hotelAddress: '',
    travelHubAddress: '',
    instagramUrl: '',
    facebookUrl: '',
    upiId: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.company) {
      setFormData({
        brandName: settings.company.brandName || '',
        hotelName: settings.company.hotelName || '',
        travelName: settings.company.travelName || '',
        tagline: settings.company.tagline || '',
        elevation: settings.company.elevation || '',
        conciergePhone: settings.company.conciergePhone || '',
        whatsappNumber: settings.company.whatsappNumber || '',
        whatsappDisplay: settings.company.whatsappDisplay || '',
        email: settings.company.email || '',
        hotelAddress: settings.company.hotelAddress || '',
        travelHubAddress: settings.company.travelHubAddress || '',
        instagramUrl: settings.company.instagramUrl || '',
        facebookUrl: settings.company.facebookUrl || '',
        upiId: settings.company.upiId || '',
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await apiClient.patch('/settings/company', formData);
      if (res.data?.success) {
        showToast('Company profile & contact details updated across all sites!', 'success');
        await refreshSettings();
      }
    } catch (err) {
      console.error('Error saving company profile:', err);
      showToast(err.response?.data?.message || 'Failed to update company details', 'error');
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
              Universal Platform Identity
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523]">
              Company & Contact Profile
            </h3>
            <p className="text-xs text-[#5C5350] mt-1">
              Changes made here update instantly across all 3 customer websites (Landing, Hotel, Travel) and booking vouchers.
            </p>
          </div>

          <button
            type="submit"
            form="company-form"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#7C1D23] hover:bg-[#5C151A] text-[#FDFBF7] text-xs font-semibold uppercase tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#FDFBF7] border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>

        <form id="company-form" onSubmit={handleSave} className="space-y-6">
          {/* Brand Names Group */}
          <div>
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold mb-3">
              1. Brand Titles & Tagline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Master Umbrella Brand
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Hotel Resort Brand
                </label>
                <input
                  type="text"
                  name="hotelName"
                  value={formData.hotelName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Travel & Fleet Brand
                </label>
                <input
                  type="text"
                  name="travelName"
                  value={formData.travelName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Tagline (Displayed in headers & footers)
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Resort Altitude / Elevation
                </label>
                <input
                  type="text"
                  name="elevation"
                  value={formData.elevation}
                  onChange={handleChange}
                  placeholder="e.g. 6,942 ft"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>
            </div>
          </div>

          {/* Contact Numbers Group */}
          <div className="pt-4 border-t border-[#C5A059]/20">
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold mb-3">
              2. Front Desk Telephony & WhatsApp
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Concierge Phone Number (Caller Link)
                </label>
                <input
                  type="text"
                  name="conciergePhone"
                  value={formData.conciergePhone}
                  onChange={handleChange}
                  required
                  placeholder="+91 96906 21247"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] font-mono focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  WhatsApp Number (Numbers only, e.g. 919690621247)
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] font-mono focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  WhatsApp Display Text
                </label>
                <input
                  type="text"
                  name="whatsappDisplay"
                  value={formData.whatsappDisplay}
                  onChange={handleChange}
                  placeholder="+91 96906 21247"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] font-mono focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  UPI ID for Advance Bookings
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="e.g. kasarhimalayan@upi"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] font-mono focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>
            </div>
          </div>

          {/* Physical Location Group */}
          <div className="pt-4 border-t border-[#C5A059]/20">
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold mb-3">
              3. Addresses & Social Media
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Hotel Resort Physical Address
                </label>
                <input
                  type="text"
                  name="hotelAddress"
                  value={formData.hotelAddress}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Travel Base Hub Address
                </label>
                <input
                  type="text"
                  name="travelHubAddress"
                  value={formData.travelHubAddress}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Instagram Profile Link
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Facebook Page Link
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyManager;
