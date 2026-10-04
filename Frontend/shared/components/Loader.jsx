const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="text-charcoal-muted font-body text-sm tracking-wide">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
