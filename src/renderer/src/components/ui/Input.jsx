// src/renderer/src/components/ui/Input.jsx
const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  type = 'text',
  ...props 
}) => (
  <div className="space-y-2">
    {label && (
      <label className="text-sm text-gray-400 block">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        className={`w-full bg-[#2A2A40] text-white rounded-lg px-4 py-2 
                   ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500' : 'border-transparent'}
                   border focus:border-[#38ff9b]/30 focus:outline-none transition-colors`}
        {...props}
      />
    </div>
    {error && (
      <p className="text-red-500 text-sm">{error}</p>
    )}
  </div>
);

export { Input };