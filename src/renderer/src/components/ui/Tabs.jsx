// src/renderer/src/components/ui/Tabs.jsx
const Tabs = ({ value, onChange, className, children }) => (
  <div className={`flex items-center gap-1 bg-[#1B1B26] p-1 rounded-lg ${className}`}>
    {children.map((child) => 
      React.cloneElement(child, { 
        active: value === child.props.value,
        onClick: () => onChange(child.props.value)
      })
    )}
  </div>
);

const Tab = ({ value, children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
      active 
        ? 'bg-[#38ff9b] text-[#14141F]' 
        : 'text-white hover:bg-[#2A2A40]'
    }`}
  >
    {children}
  </button>
);

export { Tabs };