import { useState, useEffect } from 'react';
import { APP_URLS, SITE_CONFIG, useSiteSettings } from '@shared';

const MobileActionDock = () => {
  const { settings } = useSiteSettings();
  const company = settings?.company || SITE_CONFIG;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show dock only after scrolling 350px down
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  const whatsappMessage = encodeURIComponent(
    'Namaste! I would like to inquire about rooms and mountain travel at The Kasar Himalayan Heights.'
  );
  const whatsappUrl = `https://wa.me/${company.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <aside 
      aria-label="Quick Actions"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 py-2.5 bg-[#061814]/92 backdrop-blur-xl border-t border-[#EAA722]/35 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] transition-all duration-300 animate-fade-in"
    >
      <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5 items-center">
        {/* WhatsApp Direct Concierge */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-[#0D332D] hover:bg-[#12433B] text-white border border-[#EAA722]/40 text-xs font-semibold tracking-wider transition-all shadow-md active:scale-95"
        >
          <span className="text-emerald-400 text-sm">💬</span>
          <span className="truncate">Concierge</span>
        </a>

        {/* Explore Suites / Tariffs */}
        <a
          href={APP_URLS.hotel}
          target="_blank"
          rel="noreferrer"
          className="btn-nkb-gold btn-shimmer flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold tracking-wider uppercase shadow-md active:scale-95"
        >
          <span className="truncate">Suites &amp; Tariffs</span>
          <span className="text-xs">↗</span>
        </a>
      </div>
    </aside>
  );
};

export default MobileActionDock;
