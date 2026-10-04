import { useState, useEffect } from 'react';
import { useSiteSettings, apiClient } from '@shared';
import { useToast } from './Toast';

export const AnnouncementManager = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const { showToast } = useToast();

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
      showToast('Announcement ribbon & devotional hero updated across websites!', 'success');
      await refreshSettings();
    } catch (err) {
      console.error('Error saving announcements:', err);
      showToast(err.response?.data?.message || 'Failed to update announcements', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Preview Strip */}
      <div className="bg-[#FAF6EF] p-4 rounded-2xl border border-[#C5A059]/30">
        <div className="text-[10px] font-cinzel uppercase tracking-wider text-[#C5A059] font-bold mb-2">
          Public Website Live Preview
        </div>
        {announcement.enabled ? (
          <div className="bg-[#7C1D23] text-[#FDFBF7] py-2 px-4 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <span className="font-serif tracking-wide">{announcement.message}</span>
            {announcement.linkText && (
              <span className="text-[10px] font-bold text-[#DFCA97] underline underline-offset-2">
                {announcement.linkText}
              </span>
            )}
          </div>
        ) : (
          <div className="py-2 px-4 rounded-xl text-xs bg-stone-200 text-stone-600 italic">
            Announcement Ribbon is currently DISABLED (Hidden from public site visitors)
          </div>
        )}
      </div>

      <div className="bg-[#FDFBF7] p-5 sm:p-6 rounded-2xl border border-[#C5A059]/30 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#C5A059]/20">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-cinzel font-semibold block">
              Website Alerts & Devotional Header
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#2C2523]">
              Notice Ribbon & Hero Content
            </h3>
            <p className="text-xs text-[#5C5350] mt-1">
              Broadcast seasonal yatra notices, special discounts, or update the spiritual opening greeting.
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
                <span>Saving Notice...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Top Announcement Section */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold">
                1. Top Announcement Ribbon
              </h4>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcement.enabled}
                  onChange={(e) =>
                    setAnnouncement((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                  className="w-4 h-4 text-[#7C1D23] rounded focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#2C2523]">
                  {announcement.enabled ? 'Ribbon Active' : 'Ribbon Hidden'}
                </span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Ribbon Message Text
                </label>
                <textarea
                  rows={2}
                  value={announcement.message}
                  onChange={(e) =>
                    setAnnouncement((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2C2523] mb-1">
                    Action Button Label
                  </label>
                  <input
                    type="text"
                    value={announcement.linkText}
                    onChange={(e) =>
                      setAnnouncement((prev) => ({ ...prev, linkText: e.target.value }))
                    }
                    placeholder="e.g. Yatra Booking ↗"
                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2C2523] mb-1">
                    Button Destination Target (Anchor or URL)
                  </label>
                  <input
                    type="text"
                    value={announcement.linkHref}
                    onChange={(e) =>
                      setAnnouncement((prev) => ({ ...prev, linkHref: e.target.value }))
                    }
                    placeholder="e.g. #enquiry or https://..."
                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Devotional Hero Section */}
          <div className="pt-4 border-t border-[#C5A059]/20">
            <h4 className="text-xs font-cinzel uppercase tracking-wider text-[#7C1D23] font-bold mb-3">
              2. Baba Neem Karoli Hero & Devotional Quotes
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Primary Devotional Greeting
                </label>
                <input
                  type="text"
                  value={landingHero.devotionalGreeting}
                  onChange={(e) =>
                    setLandingHero((prev) => ({ ...prev, devotionalGreeting: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Spiritual Teaching Quote
                </label>
                <input
                  type="text"
                  value={landingHero.teachingQuote}
                  onChange={(e) =>
                    setLandingHero((prev) => ({ ...prev, teachingQuote: e.target.value }))
                  }
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#C5A059]/40 text-[#2C2523] focus:outline-hidden focus:border-[#7C1D23]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#2C2523] mb-1">
                  Welcome Reverence Statement
                </label>
                <textarea
                  rows={3}
                  value={landingHero.welcomeStatement}
                  onChange={(e) =>
                    setLandingHero((prev) => ({ ...prev, welcomeStatement: e.target.value }))
                  }
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

export default AnnouncementManager;
