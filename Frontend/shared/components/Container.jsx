const Container = ({ children, className = '', size = 'lg' }) => {
  const maxWidths = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-[1440px]',
    xl: 'max-w-[1560px]',
    full: 'max-w-full',
  }[size] || 'max-w-[1440px]';

  return (
    <div className={`mx-auto px-3 sm:px-6 lg:px-8 ${maxWidths} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
