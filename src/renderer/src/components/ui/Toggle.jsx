// src/renderer/src/components/ui/Toggle.jsx
const Toggle = ({ enabled, onChange, size = 'default' }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative rounded-full transition-colors duration-300 ${
      size === 'small' ? 'w-8 h-4' : 'w-12 h-6'
    } ${enabled ? 'bg-[#38ff9b]' : 'bg-[#2A2A40]'}`}
  >
    <span
      className={`absolute top-1 left-1 bg-white rounded-full transition-transform duration-300 ${
        size === 'small' ? 'w-2 h-2' : 'w-4 h-4'
      } ${enabled ? 'translate-x-4' : 'translate-x-0'}`}
    />
  </button>
);

export { Toggle };