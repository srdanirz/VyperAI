import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toaster from "../components/Toaster";
import { login, whopLogo } from "../utils/Images";
import { FadeLoader } from "react-spinners";
import { useAtom, useSetAtom } from "jotai/index";
import { isAuthenticated, licenseAtom } from "../state/jotai";
import CustomizedTooltips from "../components/CustomizedTooltips";


const Login = () => {
  const [licenseKey, setLicenseKey] = useState("");
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterVariant, setToasterVariant] = useState("");
  const [showToaster, setShowToaster] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setLicense = useSetAtom(licenseAtom)
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const setIsLicenseValid = useSetAtom(isAuthenticated);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const validateAndStoreLicense = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const result = await window.api.validateLicense(licenseKey);


      if (result.success) {

        setToasterMessage("La licencia se ha validado correctamente");
        setToasterVariant("success");
        setShowToaster(true);
        navigate("/");
        setLicense(result.result)
        setIsLicenseValid(true)
      } else {
        setToasterMessage(result.message || "La validación de la licencia ha fallado");
        setToasterVariant("error");
        setShowToaster(true)
        return
      }
      setIsLoading(false);
    } catch (error) {
      setToasterMessage("Ocurrió un error");
      setToasterVariant("error");
      setShowToaster(true);
      setIsLoading(false);
    } finally {
      setTimeout(() => setShowToaster(false), 4000);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      validateAndStoreLicense(event);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[#14141F] overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[#14141F]" />
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green/30 rounded-full filter blur-[100px] animate-blob" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full filter blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-[100px] animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      </div>

      {isLoading ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <FadeLoader color="#00FF77" />
        </div>
      ) : (
        <div className="relative w-full max-w-xl mx-auto p-8">
          {/* Card de login */}
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-black/5 shadow-2xl border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
            
            <div className="relative p-8 space-y-8">
              {/* Logo con efecto hover */}
              <div className="flex flex-col items-center space-y-2">
                <div className="relative group">
                  {/* Brillo verde que se intensifica en hover */}
                  <div className="absolute -inset-4 bg-green/20 blur-xl rounded-full transition-all duration-300 ease-in-out group-hover:bg-green/40 group-hover:scale-110" />
                  <img 
                    src={login} 
                    alt="Vyper Logo" 
                    className="relative w-24 h-24 object-contain transition-transform duration-300"
                  />
                </div>
                <h1 className="text-4xl font-bold text-white">
                  Vyper Bot
                </h1>
                <p className="text-gray-400 text-center">
                  Nunca más pierdas una fila virtual.
                </p>
              </div>


              {/* Formulario */}
              <div className="space-y-6">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={licenseKey}
                    onChange={(e) => setLicenseKey(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 bg-black/40 rounded-lg border border-white/10 text-white placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent
                      transition-all duration-300"
                    placeholder="Ingrese la clave de licencia (License Key)"
                  />
                  <CustomizedTooltips 
                    title={
                      <div className="text-sm">
                        Para obtener tu clave de licencia:
                        <br/>
                        1. Ingresa a tu panel de Whop
                        <br/>
                        2. Dirígete a Bot (Descarga)
                        <br/>
                        3. Tu clave estará en la parte superior.
                      </div>
                    }
                    placement="top"
                  >
                    <div className="absolute right-3 cursor-help">
                      <div className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          className="w-5 h-5"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    </div>
                  </CustomizedTooltips>
                </div>

                <button
                  onClick={validateAndStoreLicense}
                  className="w-full relative group overflow-hidden rounded-lg bg-green 
                    text-black py-3 px-4 font-semibold shadow-lg
                    transition-all duration-300 hover:shadow-green/30 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center gap-3">
                    <img
                      src={whopLogo}
                      alt="Whop Logo"
                      className="w-8 h-8 object-contain group-hover:rotate-12 transition-transform duration-300"
                    />
                    <span className="text-lg">Iniciar sesión</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Vyper Bot. All Rights Reserved.
            </p>
          </div>
        </div>
      )}

      {/* Barra de estado inferior */}
      <div className="fixed bottom-6 w-full flex justify-between items-center px-6">
        {/* Version */}
        <div className="text-white/50 text-sm bg-[#2A2A40] px-3 py-1.5 rounded-full">
          Versión 9.0
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 bg-[#2A2A40] px-3 py-1.5 rounded-full">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green' : 'bg-red-500'} animate-pulse`} />
            <span className="text-white/50 text-sm">
              {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {showToaster && (
        <Toaster
          message={toasterMessage}
          variant={toasterVariant}
          show={showToaster}
        />
      )}
    </div>
  );
};

export default Login;