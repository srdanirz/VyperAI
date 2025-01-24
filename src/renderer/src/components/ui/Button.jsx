// src/renderer/src/components/ui/Button.jsx
const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  icon: Icon,
  loading,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-[#38ff9b] hover:bg-[#38ff9b]/80 text-[#14141F]',
    secondary: 'bg-[#2A2A40] hover:bg-[#2A2A40]/80 text-white',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  return (
    <button
      disabled={loading || disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      `}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent 
                     rounded-full animate-spin" />
      ) : Icon && (
        <Icon className={size === 'small' ? 'w-4 h-4' : 'w-5 h-5'} />
      )}
      {children}
    </button>
  );
};

export { Button };