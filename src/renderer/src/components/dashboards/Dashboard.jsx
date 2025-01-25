import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Drawer } from '@mui/material';
import { Cpu, GitBranch, Box as BoxIcon, Settings, Layout, Bell, Search, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VyperDashboard = () => {
  const [activeModule, setActiveModule] = useState('flows');
  const [notifications, setNotifications] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { 
      id: 'home',
      icon: Layout,
      label: 'Dashboard',
      path: '/'
    },
    { 
      id: 'flows',
      icon: GitBranch,
      label: 'Flow Builder',
      path: '/flows'
    },
    { 
      id: 'proxies',
      icon: Cpu,
      label: 'Proxies',
      path: '/proxy'
    },
    {
      id: 'marketplace',
      icon: BoxIcon,
      label: 'Marketplace',
      path: '/marketplace'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      path: '/settings'
    }
  ];

  useEffect(() => {
    // Demo notifications
    setNotifications([
      {
        id: 1,
        type: 'success',
        message: 'Flow "Price Monitor" completed successfully',
        time: '2 minutes ago'
      },
      {
        id: 2,
        type: 'warning',
        message: 'Proxy performance degraded',
        time: '5 minutes ago'
      }
    ]);
  }, []);

  const getCurrentRoute = () => {
    return menuItems.find(item => location.pathname === item.path)?.label || 'Dashboard';
  };

  return (
    <Box className="flex h-screen bg-[#14141F]">
      <CssBaseline />
      
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        className="w-72 flex-shrink-0"
        classes={{
          paper: 'w-72 border-r border-[#2A2A40] bg-[#1B1B26]'
        }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layout className="w-8 h-8 text-[#38ff9b]" />
            Vyper AI
          </h1>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id);
                navigate(item.path);
              }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                ${location.pathname === item.path
                  ? 'bg-[#38ff9b] text-[#14141F]' 
                  : 'text-white hover:bg-[#2A2A40]'}`}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {<item.icon className="w-5 h-5" />}
              <span className="font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-auto p-4">
          <div className="p-4 bg-[#2A2A40] rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#38ff9b]/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#38ff9b]" />
              </div>
              <div>
                <p className="text-white font-medium">Pro Plan</p>
                <p className="text-sm text-gray-400">1.2k tasks/day</p>
              </div>
            </div>
            <div className="w-full bg-[#14141F] rounded-full h-2">
              <div 
                className="bg-[#38ff9b] h-2 rounded-full transition-all duration-300"
                style={{ width: '70%' }}
              />
            </div>
            <p className="text-right text-sm text-gray-400 mt-1">70% used</p>
          </div>
        </div>
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-16 border-b border-[#2A2A40] bg-[#1B1B26] flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-white">{getCurrentRoute()}</h2>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <motion.button
              className="p-2 rounded-lg hover:bg-[#2A2A40] transition-colors relative"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="w-5 h-5 text-gray-400" />
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-[#2A2A40] transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#38ff9b] text-[#14141F] text-xs 
                                 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#2A2A40] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#38ff9b]/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-[#38ff9b]" />
                </div>
                <span className="text-white">John Doe</span>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#1B1B26] rounded-xl shadow-lg border border-[#2A2A40]"
                  >
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          navigate('/profile');
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-white hover:bg-[#2A2A40] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button 
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-red-500 hover:bg-[#2A2A40] transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          >
            <div className="container mx-auto max-w-2xl mt-32 p-4">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                className="bg-[#1B1B26] rounded-xl p-4"
              >
                <div className="flex items-center gap-2 bg-[#2A2A40] rounded-lg p-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-transparent border-none outline-none text-white w-full"
                    autoFocus
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default VyperDashboard;