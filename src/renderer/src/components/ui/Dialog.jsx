// src/renderer/src/components/ui/Dialog.jsx
import { X } from 'lucide-react';

const Dialog = ({
  open,
  onClose,
  title,
  children,
  primaryAction,
  secondaryAction
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#14141F] rounded-xl shadow-xl">
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#2A2A40] transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          {title && (
            <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
          )}
          {children}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="border-t border-[#2A2A40] p-4 flex justify-end gap-3">
            {secondaryAction && (
              <button onClick={secondaryAction.onClick} className="px-4 py-2 rounded-lg hover:bg-[#2A2A40] text-white transition-colors">
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button onClick={primaryAction.onClick} className="px-4 py-2 rounded-lg bg-[#38ff9b] text-[#14141F] hover:bg-[#38ff9b]/80 transition-colors">
                {primaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { Dialog };
