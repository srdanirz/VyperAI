// src/renderer/src/components/NotificationCenter.jsx
import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info } from 'lucide-react';

const NotificationItem = ({ notification, onClose }) => {
  const icons = {
    success: <Check className="w-5 h-5 text-[#38ff9b]" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />
  };

  return (
    <div className="group animate-slide-in-right">
      <div className="bg-[#1B1B26] p-4 rounded-xl mb-2 hover:shadow-lg hover:shadow-[#38ff9b]/5 
                    transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#2A2A40]">
            {icons[notification.type]}
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">{notification.title}</h4>
            <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
            {notification.action && (
              <button 
                onClick={notification.action.onClick}
                className="mt-2 text-[#38ff9b] text-sm hover:underline"
              >
                {notification.action.text}
              </button>
            )}
          </div>
          <button 
            onClick={() => onClose(notification.id)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = (notification) => {
    setNotifications(prev => [
      { id: Date.now(), ...notification },
      ...prev
    ]);
    setUnreadCount(prev => prev + 1);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    // Ejemplo de notificación
    const timer = setTimeout(() => {
      addNotification({
        type: 'success',
        title: 'Flujo completado',
        message: 'El flujo "Monitor de precios" ha finalizado exitosamente',
        action: {
          text: 'Ver resultados',
          onClick: () => console.log('Ver resultados')
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setUnreadCount(0);
          }}
          className="relative p-2 rounded-lg hover:bg-[#2A2A40] transition-colors"
        >
          <Bell className="w-5 h-5 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#38ff9b] text-[#14141F] 
                         rounded-full text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-12 w-96 bg-[#14141F] border border-[#2A2A40] 
                       rounded-xl shadow-xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#14141F] p-4 border-b border-[#2A2A40]">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Notificaciones</h3>
                {notifications.length > 0 && (
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>
            </div>

            <div className="p-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No hay notificaciones</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClose={removeNotification}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export { NotificationCenter };

