import Divider from './Divider';

/**
 * Replaces '&' in a string with a clean sans-serif span
 * so Playfair Display's ornate calligraphic ampersand is never shown.
 */
const renderCleanAmpersand = (text) => {
  if (typeof text !== 'string') return text;
  const parts = text.split('&');
  if (parts.length === 1) return text;
  return parts.reduce((acc, part, idx) => {
    if (idx === 0) return [part];
    return [...acc, <span key={idx} className="font-sans font-light">&amp;</span>, part];
  }, []);
};

const SectionHeading = ({
  subtitle,
  title,
  description,
  align = 'center',
  showDivider = true,
  className = '',
  light = false,
}) => {
  const alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align] || 'text-center items-center';

  return (
    <div className={`flex flex-col ${alignmentClass} ${className} max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
      {subtitle && (
        <span className="text-xs sm:text-sm font-cinzel tracking-[0.25em] uppercase text-gold font-semibold mb-2">
          {renderCleanAmpersand(subtitle)}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight leading-tight ${
          light ? 'text-ivory' : 'text-charcoal'
        }`}
      >
        {renderCleanAmpersand(title)}
      </h2>
      {showDivider && <Divider className="w-36 my-4" />}
      {description && (
        <p
          className={`text-base sm:text-lg font-sans font-light leading-relaxed mt-1 ${
            light ? 'text-ivory/80' : 'text-charcoal-muted'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
