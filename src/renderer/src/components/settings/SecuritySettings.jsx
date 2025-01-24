// src/renderer/src/components/settings/SecuritySettings.jsx
import { Shield, Key, Lock, Eye, EyeOff } from 'lucide-react';

const SecuritySettings = ({ settings, onChange }) => {
  const [showToken, setShowToken] = useState(false);

  return (
    <div className="space-y-8">
      {/* 2FA */}
      <div className="bg-[#1B1B26] rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[#2A2A40]">
            <Shield className="w-6 h-6 text-[#38ff9b]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Autenticación de dos factores</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Añade una capa extra de seguridad a tu cuenta
                </p>
              </div>
              <button
                onClick={() => onChange({ twoFactor: !settings.twoFactor })}
                className={`w-12 h-6 rounded-full transition-colors duration-300 
                         ${settings.twoFactor ? 'bg-[#38ff9b]' : 'bg-[#2A2A40]'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300
                           ${settings.twoFactor ? 'translate-x-7' : 'translate-x-1'}`}
                />
              </button>
            </div>
            {settings.twoFactor && (
              <div className="mt-4 p-4 bg-[#2A2A40] rounded-lg">
                <div className="mb-4">
                  <img 
                    src="/qr-placeholder.png" 
                    alt="QR Code"
                    className="w-32 h-32 mx-auto"
                  />
                </div>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value="ABCD-EFGH-IJKL-MNOP"
                    readOnly
                    className="w-full bg-[#1B1B26] text-white rounded-lg px-4 py-2 pr-10"
                  />
                  <button
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-[#1B1B26] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-5 h-5 text-[#38ff9b]" />
          <h2 className="text-lg font-medium text-white">Claves API</h2>
        </div>
        <div className="space-y-4">
          {/* Lista de claves API */}
        </div>
      </div>

      {/* Sesiones */}
      <div className="bg-[#1B1B26] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-[#38ff9b]" />
          <h2 className="text-lg font-medium text-white">Sesiones activas</h2>
        </div>
        <div className="space-y-4">
          {/* Lista de sesiones */}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;