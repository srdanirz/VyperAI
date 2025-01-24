import { useState } from 'react';
import { Settings, Shield, Database, Globe, Key, Bell, Clock, Save, Info } from 'lucide-react';

const ToggleSwitch = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-white font-medium">{label}</h3>
      {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300
                ${enabled ? 'bg-[#38ff9b]' : 'bg-[#2A2A40]'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transform transition-transform
                  ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  </div>
);

const RangeSlider = ({ value, onChange, min, max, step, label, suffix = '' }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-white font-medium">{label}</label>
      <span className="text-[#38ff9b]">{value}{suffix}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full appearance-none bg-[#2A2A40] h-2 rounded-full outline-none
               [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
               [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
               [&::-webkit-slider-thumb]:bg-[#38ff9b] [&::-webkit-slider-thumb]:cursor-pointer"
    />
  </div>
);

const SettingsCard = ({ title, icon: Icon, children }) => (
  <div className="bg-[#1B1B26] rounded-xl p-6 hover:shadow-lg hover:shadow-[#38ff9b]/5 transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-lg bg-[#2A2A40]">
        <Icon className="w-5 h-5 text-[#38ff9b]" />
      </div>
      <h2 className="text-lg font-medium text-white">{title}</h2>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const AdvancedSettings = () => {
  const [settings, setSettings] = useState({
    security: {
      twoFactor: true,
      ipWhitelist: false,
      sessionTimeout: 30
    },
    performance: {
      concurrentTasks: 5,
      retryAttempts: 3,
      timeoutSeconds: 60
    },
    notifications: {
      email: true,
      desktop: true,
      slack: false
    },
    proxy: {
      enabled: true,
      rotationInterval: 15,
      customProxies: false
    }
  });

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSave = () => {
    // Simular guardado
    setUnsavedChanges(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Configuración Avanzada</h1>
          <p className="text-gray-400">Personaliza el comportamiento de Vyper AI</p>
        </div>

        {unsavedChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#38ff9b] text-[#14141F] rounded-lg
                    hover:bg-[#38ff9b]/80 transition-colors"
          >
            <Save className="w-5 h-5" />
            Guardar Cambios
          </button>
        )}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Security Settings */}
        <SettingsCard title="Seguridad" icon={Shield}>
          <ToggleSwitch
            label="Autenticación de dos factores"
            description="Añade una capa extra de seguridad"
            enabled={settings.security.twoFactor}
            onChange={(value) => updateSetting('security', 'twoFactor', value)}
          />
          <ToggleSwitch
            label="Lista blanca de IPs"
            description="Restringe el acceso a IPs específicas"
            enabled={settings.security.ipWhitelist}
            onChange={(value) => updateSetting('security', 'ipWhitelist', value)}
          />
          <RangeSlider
            label="Tiempo de sesión"
            value={settings.security.sessionTimeout}
            onChange={(value) => updateSetting('security', 'sessionTimeout', value)}
            min={5}
            max={120}
            step={5}
            suffix=" min"
          />
        </SettingsCard>

        {/* Performance Settings */}
        <SettingsCard title="Rendimiento" icon={Globe}>
          <RangeSlider
            label="Tareas concurrentes"
            value={settings.performance.concurrentTasks}
            onChange={(value) => updateSetting('performance', 'concurrentTasks', value)}
            min={1}
            max={20}
            step={1}
          />
          <RangeSlider
            label="Intentos de reintento"
            value={settings.performance.retryAttempts}
            onChange={(value) => updateSetting('performance', 'retryAttempts', value)}
            min={0}
            max={10}
            step={1}
          />
          <RangeSlider
            label="Tiempo de espera"
            value={settings.performance.timeoutSeconds}
            onChange={(value) => updateSetting('performance', 'timeoutSeconds', value)}
            min={10}
            max={300}
            step={10}
            suffix="s"
          />
        </SettingsCard>

        {/* Notification Settings */}
        <SettingsCard title="Notificaciones" icon={Bell}>
          <ToggleSwitch
            label="Notificaciones por email"
            description="Recibe actualizaciones importantes por correo"
            enabled={settings.notifications.email}
            onChange={(value) => updateSetting('notifications', 'email', value)}
          />
          <ToggleSwitch
            label="Notificaciones de escritorio"
            description="Recibe alertas en tu ordenador"
            enabled={settings.notifications.desktop}
            onChange={(value) => updateSetting('notifications', 'desktop', value)}
          />
          <ToggleSwitch
            label="Integracion con Slack"
            description="Recibe notificaciones en tu canal de Slack"
            enabled={settings.notifications.slack}
            onChange={(value) => updateSetting('notifications', 'slack', value)}
          />
        </SettingsCard>

        {/* Proxy Settings */}
        <SettingsCard title="Configuración de Proxies" icon={Database}>
          <ToggleSwitch
            label="Usar proxies"
            description="Habilita el uso de proxies para las tareas"
            enabled={settings.proxy.enabled}
            onChange={(value) => updateSetting('proxy', 'enabled', value)}
          />
          <RangeSlider
            label="Intervalo de rotación"
            value={settings.proxy.rotationInterval}
            onChange={(value) => updateSetting('proxy', 'rotationInterval', value)}
            min={5}
            max={60}
            step={5}
            suffix=" min"
          />
          <ToggleSwitch
            label="Proxies personalizados"
            description="Usa tu propia lista de proxies"
            enabled={settings.proxy.customProxies}
            onChange={(value) => updateSetting('proxy', 'customProxies', value)}
          />
        </SettingsCard>
        
              </div>
        
              {/* System Status */}
              <div className="bg-[#1B1B26] rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#38ff9b]" />
                    <h2 className="text-lg font-medium text-white">Estado del Sistema</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#38ff9b]/10 text-[#38ff9b] text-sm">
                    Operativo
                  </span>
                </div>
        
                <div className="grid grid-cols-4 gap-6 mt-6">
                  {[
                    { label: 'Uptime', value: '99.9%' },
                    { label: 'Latencia', value: '45ms' },
                    { label: 'Tareas Activas', value: '12' },
                    { label: 'Memoria Usada', value: '45%' }
                  ].map((stat, index) => (
                    <div key={index} className="bg-[#2A2A40] rounded-lg p-4">
                      <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>
        
                {/* Resource Usage Graph */}
                <div className="mt-6">
                  <div className="space-y-4">
                    {[
                      { label: 'CPU', value: 65 },
                      { label: 'Memoria', value: 45 },
                      { label: 'Almacenamiento', value: 30 }
                    ].map((resource, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{resource.label}</span>
                          <span className="text-[#38ff9b]">{resource.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#2A2A40] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#38ff9b] rounded-full transition-all duration-500"
                            style={{ width: `${resource.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
        
              {/* API Keys Section */}
              <div className="bg-[#1B1B26] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="w-5 h-5 text-[#38ff9b]" />
                  <h2 className="text-lg font-medium text-white">Claves API</h2>
                </div>
        
                <div className="space-y-4">
                  {[
                    { name: 'Clave Principal', value: 'vyp_1234...5678', status: 'active' },
                    { name: 'Clave Secundaria', value: 'vyp_8765...4321', status: 'inactive' }
                  ].map((key, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#2A2A40] rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white">{key.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            key.status === 'active' 
                              ? 'bg-[#38ff9b]/10 text-[#38ff9b]' 
                              : 'bg-gray-500/10 text-gray-500'
                          }`}>
                            {key.status === 'active' ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                          {key.value}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-[#38ff9b]/10 text-[#38ff9b] transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
        
                <button className="mt-4 flex items-center gap-2 px-4 py-2 border border-[#38ff9b] text-[#38ff9b] rounded-lg
                               hover:bg-[#38ff9b]/10 transition-colors">
                  <Plus className="w-4 h-4" />
                  Generar Nueva Clave
                </button>
              </div>
        
              {/* Save Changes Button - Fixed at bottom */}
              {unsavedChanges && (
                <div className="fixed bottom-8 right-8 bg-[#1B1B26] rounded-lg p-4 shadow-lg">
                  <div className="flex items-center gap-4">
                    <Info className="w-5 h-5 text-[#38ff9b]" />
                    <span className="text-white">Hay cambios sin guardar</span>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#38ff9b] text-[#14141F] rounded-lg hover:bg-[#38ff9b]/80 transition-colors"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        };
        
        export default AdvancedSettings;