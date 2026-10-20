import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient } from '@shared';
import { useToast } from './Toast';

export const AnnouncementManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const toastContext = useToast();
  const addToast = toastContext.addToast || toastContext.showToast;

  const [announcement, setAnnouncement] = useState({
    enabled: true,
    message: '',
    linkText: '',
    linkHref: '',
  });

  const [landingHero, setLandingHero] = useState({
    devotionalGreeting: '',
    devotionalSubGreeting: '',
    teachingQuote: '',
    quoteAttribution: '',
    welcomeStatement: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.announcement) {
      setAnnouncement({
        enabled: settings.announcement.enabled !== false,
        message: settings.announcement.message || '',
        linkText: settings.announcement.linkText || '',
        linkHref: settings.announcement.linkHref || '',
      });
    }
    if (settings?.landingHero) {
      setLandingHero({
        devotionalGreeting: settings.landingHero.devotionalGreeting || '',
        devotionalSubGreeting: settings.landingHero.devotionalSubGreeting || '',
        teachingQuote: settings.landingHero.teachingQuote || '',
        quoteAttribution: settings.landingHero.quoteAttribution || '',
        welcomeStatement: settings.landingHero.welcomeStatement || '',
      });
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiClient.patch('/settings/announcement', announcement);
      await apiClient.patch('/settings/landingHero', landingHero);
      addToast('Announcement ribbon & devotional hero updated across websites!', 'success');
      await refreshSettings();
    } catch (err) {
      console.error('Error saving announcements:', err);
      addToast(err.response?.data?.message || 'Failed to update announcements', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview Strip */}
      <div className="bg-[#FAF8F5] p-4 border border-[#C5A059]/30">
        <div className="text-[10px] font-cinzel uppercase tracking-wider text-[#C5A059] font-bold mb-2">
          Public Website Live Preview
        </div>
        {announcement.enabled ? (
          <div className="bg-[#0B1118] text-white py-2 px-4 border border-[#C5A059]/40 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <span className="font-serif tracking-wide">{announcement.message}</span>
            {announcement.linkText && (
              <span className="text-[10px] font-cinzel font-bold text-[#D4AF37] underline underline-offset-2">
                {announcement.linkText}
              </span>
            )}
          </div>
        ) : (
          <div className="py-2 px-4 text-xs bg-slate-100 text-slate-500 italic border border-slate-200">
            Announcement Ribbon is currently DISABLED (Hidden from public site visitors)
          </div>
        )}
      </div>

      <div className="bg-white p-4 sm:p-6 border border-[#C5A059]/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-200">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-cinzel font-bold block">
              Website Alerts &amp; Devotional Header
            </span>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#0F172A]">
              Notice Ribbon &amp; Hero Content
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Broadcast seasonal yatra notices, special discounts, or update the spiritual opening greeting.
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
                <span>Saving Notice...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#0B1118]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 font-sans">
          {/* Top Announcement Section */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#0B1118] font-bold">
                1. Top Announcement Ribbon
              </h4>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcement.enabled}
                  onChange={(e) =>
                    setAnnouncement((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                  className="w-4 h-4 text-[#0B1118] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#0F172A]">
                  {announcement.enabled ? 'Ribbon Active' : 'Ribbon Hidden'}
                </span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ribbon Message Text
                </label>
                <textarea
                  rows={2}
                  value={announcement.message}
                  onChange={(e) =>
                    setAnnouncement((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Action Button Label
                  </label>
                  <input
                    type="text"
                    value={announcement.linkText}
                    onChange={(e) =>
                      setAnnouncement((prev) => ({ ...prev, linkText: e.target.value }))
                    }
                    placeholder="e.g. Yatra Booking ↗"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Button Destination Target (Anchor or URL)
                  </label>
                  <input
                    type="text"
                    value={announcement.linkHref}
                    onChange={(e) =>
                      setAnnouncement((prev) => ({ ...prev, linkHref: e.target.value }))
                    }
                    placeholder="e.g. #enquiry or https://..."
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Anchors like <code className="text-[#0B1118] font-bold">#enquiry</code> automatically route to the Landing page when clicked from the Hotel or Travel portals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Devotional Hero Section */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#0B1118] font-bold mb-3">
              2. Baba Neem Karoli Hero &amp; Devotional Quotes
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Devotional Greeting
                </label>
                <input
                  type="text"
                  value={landingHero.devotionalGreeting}
                  onChange={(e) =>
                    setLandingHero((prev) => ({ ...prev, devotionalGreeting: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spiritual Teaching Quote
                </label>
                <input
                  type="text"
                  value={landingHero.teachingQuote}
                  onChange={(e) =>
                    setLandingHero((prev) => ({ ...prev, teachingQuote: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Welcome Reverence Statement
                </label>
                <textarea
                  rows={3}
                  value={landingHero.welcomeStatement}
                  onChange={(e) =>
                    setLandingHero((prev) => ({ ...prev, welcomeStatement: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF8F5] border border-slate-300 text-[#0F172A] focus:outline-none focus:border-[#C5A059] focus:bg-white"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementManager;
