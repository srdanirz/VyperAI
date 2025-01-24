// src/renderer/src/components/ui/Loader.jsx
const Loader = ({ size = 'default' }) => {
  const sizes = {
    small: 'w-4 h-4',
    default: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-2 border-[#38ff9b] border-t-transparent 
                    rounded-full animate-spin`} />
    </div>
  );
};

export { Loader };