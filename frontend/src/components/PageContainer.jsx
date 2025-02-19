const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`container mx-auto px-4 py-20 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default PageContainer; 