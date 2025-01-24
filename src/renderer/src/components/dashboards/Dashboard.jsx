import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Drawer } from '@mui/material';
import { Cpu, GitBranch, Box as BoxIcon, Settings, Layout } from 'lucide-react';

const VyperDashboard = () => {
  const [activeModule, setActiveModule] = useState('flows');
  const navigate = useNavigate();
  
  const menuItems = [
    { 
      id: 'flows',
      icon: <GitBranch className="w-5 h-5" />,
      label: 'Flow Builder',
      path: '/flows'
    },
    { 
      id: 'agents',
      icon: <Cpu className="w-5 h-5" />,
      label: 'Agents',
      path: '/agents'
    },
    {
      id: 'marketplace',
      icon: <BoxIcon className="w-5 h-5" />,
      label: 'Marketplace',
      path: '/marketplace'
    },
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      path: '/settings'
    }
  ];

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
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id);
                navigate(item.path);
              }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors
                ${activeModule === item.id 
                  ? 'bg-[#38ff9b] text-[#14141F]' 
                  : 'text-white hover:bg-[#2A2A40]'}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </Box>
  );
};

export default VyperDashboard;