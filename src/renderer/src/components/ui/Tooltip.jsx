// src/renderer/src/components/ui/Tooltip.jsx
const Tooltip = ({ children, content, position = 'top' }) => {
  return (
    <div className="relative group">
      {children}
      <div className={`absolute ${
        position === 'top' ? 'bottom-full mb-2' :
        position === 'bottom' ? 'top-full mt-2' :
        position === 'left' ? 'right-full mr-2' :
        'left-full ml-2'
      } px-2 py-1 bg-[#38ff9b] text-[#14141F] rounded-lg text-sm whitespace-nowrap
      opacity-0 invisible group-hover:opacity-100 group-hover:visible
      transition-all duration-200 z-50`}>
        {content}
      </div>
    </div>
  );
};

export { Tooltip };

