import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { logo } from "../../utils/Images"; // Solo mantenemos el logo
import ListButton from "../../components/ListButton";
import CustomisedDialog from "../Dialog";
import CustomizedTooltips from "../CustomizedTooltips";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/appSlice";
import axios from "axios";
import { FadeLoader } from "react-spinners";
import {useAtom} from "jotai";
import {licenseAtom} from "../../state/jotai";

const drawerWidth = 90;

function Dashboard(props) {
  const { window: windowProp } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [licenseData, setLicenseData] = useAtom(licenseAtom);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(true);
  const [customAvatar, setCustomAvatar] = useState(localStorage.getItem('customAvatar'));
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const HomeIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none"
      className="text-[#38ff9b]"  // Cambio aquí
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
  
  const ProxyIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none"
      className="text-[#38ff9b]"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
  
  const ProfileIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none"
      className="text-[#38ff9b]"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
  
  const StorageIcon = () => (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none"
      className="text-[#38ff9b]"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
  
  const LogoutIcon = () => (
    <svg 
      width="18" 
      height="18" 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
  

  useEffect(() => {
    if (!licenseData && !isLoggingOut) {
      navigate('/login', { replace: true });
    }
  }, [licenseData, isLoggingOut, navigate]);

  useEffect(() => {
    if (!licenseData) {
      setProduct(null);
      setLoading(false);
    }
  }, [licenseData]);

  useEffect(() => {
    const handleWebSocketStatus = (event, status) => {
      console.debug('WebSocket status changed:', status);
      setIsConnected(status.connected);
    };
  
    window.api.onWebSocketStatus(handleWebSocketStatus);
  
    // Cleanup
    return () => {
      window.api.clearListeners('websocket-status');
    };
  }, []);

  useEffect(() => {
    if (licenseData?.product) {
      const fetchProductData = async () => {
        try {
          const response = await axios.get(
            `https://api.whop.com/v2/products/${licenseData.product}`,
            {
              headers: {
                Authorization: "Bearer p1UA4RWjHUMO-_1S5E9ksiQLxmKzTDTtZ4gj1Rgjf7s",
              },
            },
          );
          setProduct(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching product data:", error);
          setError("Failed to fetch product data");
          setLoading(false);
        }
      };

      fetchProductData();
    }
  }, [licenseData?.product]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'customAvatar') {
        setCustomAvatar(localStorage.getItem('customAvatar'));
      }
    };
  
    const handleAvatarUpdate = () => {
      setCustomAvatar(localStorage.getItem('customAvatar'));
    };
  
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('avatarUpdate', handleAvatarUpdate);
  
    setCustomAvatar(localStorage.getItem('customAvatar'));
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarUpdate', handleAvatarUpdate);
    };
  }, []);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const StatusIndicator = ({ className = "" }) => (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="relative flex h-2 w-2">
        <span 
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isConnected 
              ? 'bg-[#38ff9b] animate-slow-ping' 
              : 'bg-red-500 animate-pulse'
          }`}
        />
        <span 
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isConnected 
              ? 'bg-[#38ff9b]' 
              : 'bg-red-500'
          }`}
        />
      </span>
    </div>
  );

  const handleExternalLink = async (url) => {
    try {
      const success = await window.api.openExternal(url);
      if (!success) {
        console.error('No se pudo abrir el enlace');
      }
    } catch (error) {
      console.error('Error al abrir el enlace:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setProduct(null);
      setLicenseData(null);
      localStorage.clear();
      navigate("/login", { replace: true });
      await window.api.logout();
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoggingOut(false);
    }
  };
  
  if (!licenseData) {
    navigate('/login', { replace: true });
    return null;
  }

  if (!product && licenseData?.product) {
    return (
      <div className="absolute left-0 right-0 top-10 bottom-0 flex justify-center items-center bg-[#14141F]">
        <FadeLoader color="#38ff9b" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const drawer = (
    <div className="bg-[#14141F] min-h-[100vh] flex flex-col justify-between">
      <div className="flex flex-col">
      {/* Logo con animación de serpiente */}
      <div className="bg-[#14141F] p-2 relative">
        <div 
          onClick={() => {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1500);
          }}
          className="flex gap-2 items-center group cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          <div className="relative" style={{ zIndex: isAnimating ? 9999 : 1 }}>
            <img 
              src={logo} 
              alt="Vyper Logo" 
              className={`w-8 h-8 transition-all duration-300 
                hover:drop-shadow-[0_0_8px_rgba(56,255,155,0.6)]
                ${isAnimating ? 'animate-snake-attack' : ''}`}
              style={{ transform: isAnimating ? 'none' : undefined }}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="font-Jakarta700 text-[10px] bg-clip-text text-transparent 
              bg-gradient-to-r from-green via-[#43faa9] to-green
              animate-gradient-x transition-all duration-300 ease-in-out leading-tight">
              Vyper
            </span>
            <span className="font-Jakarta700 text-[10px] bg-clip-text text-transparent 
              bg-gradient-to-r from-green via-[#43faa9] to-green
              animate-gradient-x transition-all duration-300 ease-in-out leading-tight">
              Bot
            </span>
          </div>
        </div>
      </div>

        {/* Profile Quick Access */}
        <div className="px-4 mt-2 relative">
          <CustomizedTooltips title={licenseData.email.split('@')[0]} placement="right">
            <button 
              onClick={() => navigate('/profile')}
              className="w-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              {customAvatar ? (
                <img 
                  src={customAvatar}
                  alt="Custom Profile" 
                  className="w-12 h-12 rounded-full border-2 border-[#38ff9b] object-cover"
                />
              ) : licenseData.avatar_url ? (
                <img 
                  src={licenseData.avatar_url}
                  alt="Whop Profile" 
                  className="w-12 h-12 rounded-full border-2 border-[#38ff9b] object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#2A2A40] flex items-center justify-center border-2 border-[#38ff9b]">
                  <span className="text-base text-[#38ff9b]">
                    {licenseData.email[0].toUpperCase()}
                  </span>
                </div>
              )}
            </button>
          </CustomizedTooltips>
        </div>

        {/* Navigation */}
        <div className="pt-14">
          <div className="px-4 space-y-1">
            <ListButton
              to={"/"}
              primaryItemText={"Home"}
              open={mobileOpen}
              location={location}
              inactiveIcon={<HomeIcon />}
              activeIcon={<HomeIcon />}
              className="w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 
                        bg-[#1B1B26] hover:bg-[#2A2A40]
                        text-[#9A9AB6] hover:text-[#38ff9b]"
            />
            <ListButton
              to={"/proxy"}
              primaryItemText={"Proxy"}
              open={mobileOpen}
              location={location}
              inactiveIcon={<ProxyIcon />}
              activeIcon={<ProxyIcon />}
              className="w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300
                        bg-[#1B1B26] hover:bg-[#2A2A40]
                        text-[#9A9AB6] hover:text-[#38ff9b]"
            />
            <ListButton
              to={"/profile"}
              primaryItemText={"Mi Perfil"}
              open={mobileOpen}
              location={location}
              inactiveIcon={<ProfileIcon />}
              activeIcon={<ProfileIcon />}
              className="w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300
                        bg-[#1B1B26] hover:bg-[#2A2A40]
                        text-[#9A9AB6] hover:text-[#38ff9b]"
            />
            <ListButton
              to={"/storage"}
              primaryItemText={"Storage"}
              open={mobileOpen}
              location={location}
              inactiveIcon={<StorageIcon />}
              activeIcon={<StorageIcon />}
              className="w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300
                        bg-[#1B1B26] hover:bg-[#2A2A40]
                        text-[#9A9AB6] hover:text-[#38ff9b]"
            />
          </div>
        </div>
      </div>

      {/* Footer Section - Adjusted spacing */}
      <div className="px-4 pb-6">
        {/* Empty flex-grow div to push content to bottom */}
        <div className="flex-grow" />
        
        {/* Logout Button */}
        <div className="flex flex-col items-center mb-4">
          <CustomizedTooltips title={"Logout"} placement={"right"}>
            <button
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center transition-all duration-300 text-[#ff3856] hover:text-[#ff3856]/80"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </CustomizedTooltips>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-2 mb-14">
          <CustomizedTooltips title="Instagram" placement="right">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 text-[#9A9AB6] hover:text-white">
              <button 
                onClick={() => handleExternalLink('https://www.instagram.com/vyperbot')}
                className="flex items-center justify-center w-full h-full"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </button>
            </div>
          </CustomizedTooltips>
            
          <CustomizedTooltips title="Discord" placement="right">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 text-[#9A9AB6] hover:text-white">
              <button 
                onClick={() => handleExternalLink('https://discord.gg/hhGM6KsMjd')}
                className="flex items-center justify-center w-full h-full"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </button>
            </div>
          </CustomizedTooltips>
        </div>

        {/* Version with Status Indicator */}
        <div className="flex justify-center">
          <div className="text-white/50 text-xs px-2 py-1 rounded-full flex items-center gap-2 whitespace-nowrap">
            <StatusIndicator />
            <span className="leading-none">V 9.0</span>
          </div>
        </div>
      </div>
    </div>
  );


  const container = windowProp !== undefined ? () => windowProp().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          border: "none",
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        }}
        aria-label="mailbox folders"
      >
        {/* Drawer móvil */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { 
              boxSizing: "border-box", 
              width: 240,
              backgroundColor: '#14141F',
              borderRight: '1px solid rgba(255,255,255,0.05)'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: '#14141F',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#14141F',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#2A2A40',
                borderRadius: '4px',
              },
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "95vh",
          backgroundColor: "#14141F",
          color: "white",
          border: "none",
          overflow: "hidden",
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#14141F',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#2A2A40',
            borderRadius: '4px',
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

Dashboard.propTypes = {
  window: PropTypes.func,
};

export default Dashboard;