// src/renderer/src/routes/Settings.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Settings as SettingsIcon, Shield, Globe, Bell, Database, 
         Key, Save, AlertCircle, User, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import AdvancedSettings from '../components/settings/AdvancedSettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import IntegrationsSettings from '../components/settings/IntegrationsSettings';
import { useAtom } from 'jotai';
import { licenseAtom } from '../state/jotai';

const SettingsTab = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-4 rounded-lg transition-all duration-300
              ${active 
                ? 'bg-[#38ff9b] text-[#14141F]' 
                : 'text-white hover:bg-[#2A2A40]'}`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [licenseData] = useAtom(licenseAtom);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      theme: 'dark',
      language: 'es',
      autoUpdate: true
    },
    advanced: {
      concurrentTasks: 5,
      retryAttempts: 3,
      timeoutSeconds: 60
    },
    security: {
      twoFactor: false,
      ipWhitelist: [],
      sessionTimeout: 30
    },
    integrations: {
      slack: false,
      discord: false,
      github: false
    }
  });

  const currentPath = location.pathname.split('/').pop();
  
  useEffect(() => {
    if (location.pathname === '/settings') {
      navigate('/settings/general');
    }
  }, [location]);

  const handleSave = async () => {
    try {
      // Aquí iría la lógica para guardar en backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUnsavedChanges(false);
      toast.success('Configuración guardada');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    }
  };

  const updateSettings = (category, updates) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...updates
      }
    }));
    setUnsavedChanges(true);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-[#1B1B26] border-r border-[#2A2A40] p-6">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-6 h-6 text-[#38ff9b]" />
          <h1 className="text-xl font-bold text-white">Configuración</h1>
        </div>

        <div className="space-y-2">
          <SettingsTab
            icon={User}
            label="General"
            active={currentPath === 'general'}
            onClick={() => navigate('/settings/general')}
          />
          <SettingsTab
            icon={Zap}
            label="Avanzado"
            active={currentPath === 'advanced'}
            onClick={() => navigate('/settings/advanced')}
          />
          <SettingsTab
            icon={Shield}
            label="Seguridad"
            active={currentPath === 'security'}
            onClick={() => navigate('/settings/security')}
          />
          <SettingsTab
            icon={Globe}
            label="Integraciones"
            active={currentPath === 'integrations'}
            onClick={() => navigate('/settings/integrations')}
          />
        </div>

        <div className="mt-8 p-4 bg-[#2A2A40] rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-[#38ff9b]" />
            <span className="text-white">{licenseData?.email}</span>
          </div>
          <div className="text-gray-400 text-xs mt-1">
            Plan: {licenseData?.product?.name}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="general" element={
              <GeneralSettings 
                settings={settings.general}
                onChange={updates => updateSettings('general', updates)}
              />
            } />
            <Route path="advanced" element={
              <AdvancedSettings 
                settings={settings.advanced}
                onChange={updates => updateSettings('advanced', updates)}
              />
            } />
            <Route path="security" element={
              <SecuritySettings 
                settings={settings.security}
                onChange={updates => updateSettings('security', updates)}
              />
            } />
            <Route path="integrations" element={
              <IntegrationsSettings 
                settings={settings.integrations}
                onChange={updates => updateSettings('integrations', updates)}
              />
            } />
          </Routes>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {unsavedChanges && (
        <div className="fixed bottom-8 right-8 bg-[#1B1B26] rounded-lg p-4 shadow-lg animate-fade-in">
          <div className="flex items-center gap-4">
            <AlertCircle className="w-5 h-5 text-[#38ff9b]" />
            <span className="text-white">Hay cambios sin guardar</span>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#38ff9b] text-[#14141F] rounded-lg hover:bg-[#38ff9b]/80 
                       transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;