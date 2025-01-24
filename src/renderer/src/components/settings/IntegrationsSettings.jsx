// src/renderer/src/components/settings/IntegrationsSettings.jsx
import { useState } from 'react';
import { Globe, MessageSquare, Github, Slack, Database, Key } from 'lucide-react';

const IntegrationCard = ({ 
  title, 
  description, 
  icon: Icon, 
  connected, 
  onConnect, 
  onDisconnect,
  apiKey = '',
  loading = false
}) => {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="bg-[#1B1B26] rounded-xl p-6 hover:shadow-lg hover:shadow-[#38ff9b]/5 
                   transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[#2A2A40]">
            <Icon className="w-6 h-6 text-[#38ff9b]" />
          </div>
          <div>
            <h3 className="text-white font-medium">{title}</h3>
            <p className="text-gray-400 text-sm mt-1 max-w-md">{description}</p>
          </div>
        </div>
        <button
          onClick={() => connected ? onDisconnect() : setShowConfig(true)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            connected 
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
              : 'bg-[#38ff9b]/10 text-[#38ff9b] hover:bg-[#38ff9b]/20'
          }`}
        >
          {connected ? 'Desconectar' : 'Conectar'}
        </button>
      </div>

      {showConfig && !connected && (
        <div className="mt-4 pt-4 border-t border-[#2A2A40]">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">API Key</label>
              <div className="relative">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => onConnect(e.target.value)}
                  placeholder="Ingresa tu API Key"
                  className="w-full bg-[#2A2A40] text-white rounded-lg px-4 py-2 pr-10
                           border border-transparent focus:border-[#38ff9b]/30 focus:outline-none"
                />
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 rounded-lg hover:bg-[#2A2A40] text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConnect(apiKey);
                  setShowConfig(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#38ff9b] text-[#14141F] transition-colors
                         hover:bg-[#38ff9b]/80 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!apiKey || loading}
              >
                {loading ? 'Conectando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {connected && (
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#38ff9b] animate-pulse" />
          <span className="text-sm text-[#38ff9b]">Conectado</span>
        </div>
      )}
    </div>
  );
};

const IntegrationsSettings = ({ settings, onChange }) => {
  const [loading, setLoading] = useState({});

  const handleConnect = async (integration, apiKey) => {
    setLoading(prev => ({ ...prev, [integration]: true }));
    try {
      // Simular conexión
      await new Promise(resolve => setTimeout(resolve, 1000));
      onChange({ [integration]: true });
    } finally {
      setLoading(prev => ({ ...prev, [integration]: false }));
    }
  };

  const handleDisconnect = (integration) => {
    onChange({ [integration]: false });
  };

  const integrations = [
    {
      id: 'slack',
      title: 'Slack',
      description: 'Recibe notificaciones y alertas directamente en tus canales de Slack',
      icon: Slack
    },
    {
      id: 'github',
      title: 'GitHub',
      description: 'Sincroniza tus flujos y automatizaciones con repositorios de GitHub',
      icon: Github
    },
    {
      id: 'discord',
      title: 'Discord',
      description: 'Integra Vyper AI con tus servidores de Discord',
      icon: MessageSquare
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Integraciones</h2>
        <p className="text-gray-400">Conecta Vyper AI con tus herramientas favoritas</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {integrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            title={integration.title}
            description={integration.description}
            icon={integration.icon}
            connected={settings[integration.id]}
            onConnect={(apiKey) => handleConnect(integration.id, apiKey)}
            onDisconnect={() => handleDisconnect(integration.id)}
            loading={loading[integration.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default IntegrationsSettings;