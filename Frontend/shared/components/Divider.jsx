const Divider = ({ className = '', ornament = true }) => {
  return (
    <div className={`divider-sacred my-6 ${className}`}>
      {ornament && (
        <span className="flex-shrink-0 text-gold flex items-center justify-center">
          <svg className="w-5 h-5 fill-current opacity-85" viewBox="0 0 24 24">
            <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
          </svg>
        </span>
      )}
    </div>
  );
};

export default Divider;
