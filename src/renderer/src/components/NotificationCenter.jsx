import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, AlertTriangle, Info, X, Settings, Filter } from 'lucide-react';

const NotificationItem = ({ notification, onClose, onAction }) => {
  const icons = {
    success: <Check className="w-5 h-5 text-[#38ff9b]" />,
    error: <AlertTriangle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="group bg-[#1B1B26] p-4 rounded-xl mb-2 hover:shadow-lg hover:shadow-[#38ff9b]/5 
                transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#2A2A40]">
          {icons[notification.type]}
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium">{notification.title}</h4>
          <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
          {notification.actions && (
            <div className="flex items-center gap-2 mt-2">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => onAction(notification.id, action.id)}
                  className="text-sm text-[#38ff9b] hover:underline"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">{notification.time}</div>
        </div>
        <button 
          onClick={() => onClose(notification.id)}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Demo notifications
    const demoNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Flow Completed',
        message: 'Price monitor flow completed successfully',
        time: '2 minutes ago',
        actions: [
          { id: 'view', label: 'View Results' },
          { id: 'rerun', label: 'Run Again' }
        ],
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Proxy Performance',
        message: 'High latency detected in proxy pool',
        time: '5 minutes ago',
        actions: [
          { id: 'check', label: 'Check Status' }
        ],
        read: false
      },
      {
        id: 3,
        type: 'error',
        title: 'Flow Error',
        message: 'Data extraction failed for target URL',
        time: '10 minutes ago',
        actions: [
          { id: 'retry', label: 'Retry' },
          { id: 'debug', label: 'Debug' }
        ],
        read: false
      }
    ];
    
    setNotifications(demoNotifications);
    setUnreadCount(demoNotifications.length);
  }, []);

  const handleClose = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleAction = (notificationId, actionId) => {
    console.log(`Action ${actionId} triggered for notification ${notificationId}`);
    // Handle different actions here
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  return (
    <>
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setUnreadCount(0);
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

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-12 w-96 bg-[#14141F] border border-[#2A2A40] 
                       rounded-xl shadow-xl z-50 max-h-[80vh] overflow-hidden"
            >
              <div className="sticky top-0 bg-[#14141F] p-4 border-b border-[#2A2A40]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={markAllAsRead}
                      className="text-sm text-[#38ff9b] hover:text-[#38ff9b]/80 transition-colors"
                    >
                      Mark all as read
                    </button>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAll}
                        className="text-sm text-red-500 hover:text-red-500/80 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {['all', 'success', 'warning', 'error'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                        filter === type 
                          ? 'bg-[#38ff9b] text-[#14141F]' 
                          : 'bg-[#2A2A40] text-gray-400 hover:bg-[#2A2A40]/80'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <AnimatePresence initial={false}>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={handleClose}
                        onAction={handleAction}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No notifications</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="sticky bottom-0 bg-[#14141F] p-4 border-t border-[#2A2A40]">
                <button
                  onClick={() => {}}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm
                           bg-[#2A2A40] text-white rounded-lg hover:bg-[#2A2A40]/80 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Notification Settings
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

export default NotificationCenter;