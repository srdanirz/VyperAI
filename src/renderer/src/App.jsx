import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Routes, Navigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { useAtom } from "jotai";
import { isAuthenticated, licenseAtom } from "./state/jotai";
import { useSetAtom } from "jotai/index";
import NotFound from "./routes/NotFound";
import Login from "./routes/Login";
import Proxy from "./routes/Proxy";
import Dashboard from "./components/dashboards/Dashboard";
import UserDashboard from "./routes/UserDashboard";
import Storage from "./routes/Storage";
import Home from "./routes/Home";
import TopBar from "./components/TopBar";
import { Toaster } from 'react-hot-toast';
import useOnTasksEvent from "./hooks/useOnTasksEvent";

function App() {
  const navigate = useNavigate();
  const [isLicenseValid, setIsLicenseValid] = useAtom(isAuthenticated);
  const setLicense = useSetAtom(licenseAtom);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  useOnTasksEvent(); 

  useEffect(() => {
    const run = async () => {
      const licenseValidationResponse = await window.api.isAuthenticated();
      if (licenseValidationResponse) {
        setLicense(licenseValidationResponse.result);
        setIsLicenseValid(true);
      } else {
        setIsLicenseValid(false);
        setLoading(false);
        navigate("/login");
      }
    };
    run();
  }, []);

  useEffect(() => {
    const handleWebSocketStatus = (_, status) => {
      setWsConnected(status.connected);
      if (status.connected && isLicenseValid) {
        setLoading(false);
        navigate("/");
      }
    };

    window.api.onWebSocketStatus(handleWebSocketStatus);

    return () => {
      window.api.clearListeners('websocket-status');
    };
  }, [isLicenseValid]);

  useEffect(() => {
    window.api.onLogout(() => {
      setIsLicenseValid(false);
      navigate('/login');
    });
    return () => {
      window.api.clearListeners('logout-event');
    };
  }, []);

  if (loading || (isLicenseValid && !wsConnected)) {
    return (
      <div className="absolute left-0 right-0 top-10 bottom-0 flex justify-center items-center bg-[#14141F]">
        <FadeLoader color="#38ff9b" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#14141F]">
      <TopBar/>
            <Toaster
        position="top-center" 
        toastOptions={{
          style: {
            background: '#14141F',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '8px',
            maxWidth: '400px', 
            textAlign: 'center', 
            margin: '0 auto',
          },
          success: {
            duration: 1000,
            style: {
              border: '1px solid #38ff9b',
            },
          },
          error: {
            duration: 1000,
            style: {
              border: '1px solid #FF0B0B',
            },
          },
          loading: {
            duration: 1000,
            style: {
              border: '1px solid #8074E0',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login/>}/>
        {isLicenseValid && (
          <Route path="/" element={<Dashboard />}>
          <Route path="/" element={<Home />} />
          <Route path="/proxy" element={<Proxy />} />
          <Route path="/profile" element={<UserDashboard />} />
          <Route path="/storage" element={<Storage />} /> {/* Nueva ruta */}
          <Route path="*" element={<NotFound />} />
        </Route>
        )}
        {!isLicenseValid && (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
}

export default App;