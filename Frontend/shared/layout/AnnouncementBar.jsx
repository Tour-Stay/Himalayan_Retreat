import { useState } from 'react';

const AnnouncementBar = ({
  message = 'Spring & Summer Himalayan Pilgrimages: Special Kumaon & Chardham circuits now open.',
  linkText = 'Plan Your Visit',
  linkHref = '#enquiry',
  onClose,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={`text-[#FDFBF7] text-xs py-2 px-4 border-b border-[#C5A059]/40 relative z-50 ${className || 'bg-[#5C151A]'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center font-sans tracking-wide">
          <span className="font-light">{message}</span>{' '}
          {linkHref && linkText && (
            <a
              href={linkHref}
              className="text-[#C5A059] font-semibold underline underline-offset-4 hover:text-[#DFCA9B] ml-2 transition-colors inline-block"
            >
              {linkText} &rarr;
            </a>
          )}
        </div>
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="text-ivory/70 hover:text-ivory p-1 cursor-pointer transition-colors"
          aria-label="Dismiss notice"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
