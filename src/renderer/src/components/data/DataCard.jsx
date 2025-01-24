// src/renderer/src/components/data/DataCard.jsx
import { MoreVertical } from 'lucide-react';

const DataCard = ({ 
  title, 
  subtitle, 
  icon: Icon,
  value,
  change,
  menu,
  className = '' 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={`bg-[#1B1B26] rounded-xl p-6 hover:shadow-lg hover:shadow-[#38ff9b]/5 
                   transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="p-3 rounded-lg bg-[#2A2A40]">
              <Icon className="w-6 h-6 text-[#38ff9b]" />
            </div>
          )}
          <div>
            <h3 className="text-white font-medium">{title}</h3>
            {subtitle && (
              <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
            )}
            {value && (
              <div className="mt-2">
                <span className="text-2xl font-bold text-white">{value}</span>
                {change && (
                  <span className={`ml-2 text-sm ${
                    change > 0 ? 'text-[#38ff9b]' : 'text-red-500'
                  }`}>
                    {change > 0 ? '+' : ''}{change}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        {menu && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-[#2A2A40] transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1B1B26] rounded-lg shadow-lg 
                           border border-[#2A2A40] py-1 z-10">
                {menu.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-[#2A2A40] 
                             transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { DataCard };