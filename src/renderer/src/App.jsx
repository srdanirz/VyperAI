import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { isAuthenticated as isAuthAtom, licenseAtom } from "./state/jotai";
import { FadeLoader } from "react-spinners";
import { Toaster } from 'react-hot-toast';

// Components
import FlowBuilder from "./routes/FlowBuilder";
import NotFound from "./routes/NotFound";
import Login from "./routes/Login";
import Proxy from "./routes/Proxy";
import Dashboard from "./components/dashboards/Dashboard";
import Profile from "./routes/Profile";
import Settings from "./routes/Settings";
import Home from "./routes/Home";
import Tutorial from "./components/tutorial/Tutorial";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthAtom);
  const [, setLicense] = useAtom(licenseAtom);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  // Demo auth simulation
  useEffect(() => {
    const init = async () => {
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLicense({ email: 'demo@vyper.ai', product: { name: 'Demo Plan' }});
      setIsAuthenticated(true);
      setShowTutorial(!localStorage.getItem('tutorialCompleted'));
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#14141F]">
        <FadeLoader color="#38ff9b" />
      </div>
    );
  }

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('tutorialCompleted', 'true');
  };

  return (
    <div className="w-full h-full bg-[#14141F]">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#14141F',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            duration: 2000,
            style: { border: '1px solid #38ff9b' }
          },
          error: {
            duration: 2000,
            style: { border: '1px solid #FF0B0B' }
          }
        }}
      />

      {showTutorial && isAuthenticated && (
        <Tutorial onComplete={handleTutorialComplete} />
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        
        {isAuthenticated ? (
          <Route path="/" element={<Dashboard />}>
            <Route path="/flows" element={<FlowBuilder />} />
            <Route path="proxy" element={<Proxy />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings/*" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;