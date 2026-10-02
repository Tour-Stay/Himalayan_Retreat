const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/50';

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs tracking-wider uppercase',
    md: 'px-6 py-2.5 text-sm tracking-wider uppercase',
    lg: 'px-8 py-3.5 text-base tracking-wider uppercase',
  }[size] || 'px-6 py-2.5 text-sm';

  const variantClasses = {
    primary: 'btn-devotional',
    gold: 'btn-gold',
    outline: 'btn-outline-luxury',
    ghost: 'bg-transparent text-charcoal hover:text-maroon hover:bg-gold/10',
    dark: 'bg-slate-mountain text-ivory hover:bg-slate-deep border border-gold/20 shadow-md',
  }[variant] || 'btn-devotional';

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
