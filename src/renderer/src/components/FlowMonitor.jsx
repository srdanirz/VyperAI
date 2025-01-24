// src/renderer/src/components/flow/FlowMonitor.jsx
import { useState, useEffect } from 'react';
import { Activity, Server, Clock, AlertTriangle } from 'lucide-react';
import { LineChartComponent } from '../data/Charts';
import { DataCard } from '../data/DataCard';

const FlowMetrics = ({ flow }) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <DataCard
        icon={Activity}
        title="Tasa de éxito"
        value={`${flow.successRate}%`}
        change={2.5}
      />
      <DataCard
        icon={Server}
        title="Requests/min"
        value={flow.requestRate}
        change={-1.2}
      />
      <DataCard
        icon={Clock}
        title="Tiempo promedio"
        value={`${flow.avgTime}ms`}
        change={0.8}
      />
      <DataCard
        icon={AlertTriangle}
        title="Errores"
        value={flow.errors}
        change={-5.3}
      />
    </div>
  );
};

const FlowLogs = ({ logs }) => (
  <div className="bg-[#1B1B26] rounded-xl p-4 h-[300px] overflow-auto">
    <div className="space-y-2">
      {logs.map((log, index) => (
        <div 
          key={index}
          className={`p-2 rounded text-sm ${
            log.type === 'error' ? 'bg-red-500/10 text-red-500' :
            log.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
            'bg-[#2A2A40] text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{log.timestamp}</span>
            <span className="text-gray-400">|</span>
            <span>{log.message}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FlowStatus = ({ status }) => {
  const statusColors = {
    running: 'text-[#38ff9b]',
    paused: 'text-yellow-500',
    error: 'text-red-500',
    completed: 'text-blue-500'
  };

  return (
    <div className={`flex items-center gap-2 ${statusColors[status.toLowerCase()]}`}>
      <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
      <span className="capitalize">{status}</span>
    </div>
  );
};

const FlowMonitor = ({ flowId }) => {
  const [flowData, setFlowData] = useState({
    name: 'Monitor de Precios',
    status: 'running',
    successRate: 98.5,
    requestRate: 45,
    avgTime: 230,
    errors: 2,
    logs: [
      { timestamp: '14:32:45', type: 'info', message: 'Request completado exitosamente' },
      { timestamp: '14:32:30', type: 'warning', message: 'Tasa de requests alta' },
      { timestamp: '14:32:15', type: 'error', message: 'Timeout en solicitud' }
    ],
    metrics: Array.from({ length: 24 }, (_, i) => ({
      name: `${i}h`,
      requests: Math.floor(Math.random() * 100),
      errors: Math.floor(Math.random() * 5)
    }))
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{flowData.name}</h2>
          <FlowStatus status={flowData.status} />
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-[#2A2A40] text-white 
                           hover:bg-[#2A2A40]/80 transition-colors">
            Editar
          </button>
          <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 
                           hover:bg-red-500/20 transition-colors">
            Detener
          </button>
        </div>
      </div>

      {/* Metrics */}
      <FlowMetrics flow={flowData} />

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#1B1B26] rounded-xl p-6">
          <h3 className="text-white font-medium mb-4">Requests</h3>
          <div className="h-64">
            <LineChartComponent 
              data={flowData.metrics}
              dataKey="requests"
            />
          </div>
        </div>
        <div className="bg-[#1B1B26] rounded-xl p-6">
          <h3 className="text-white font-medium mb-4">Errores</h3>
          <div className="h-64">
            <LineChartComponent 
              data={flowData.metrics}
              dataKey="errors"
              stroke="#ef4444"
            />
          </div>
        </div>
      </div>

      {/* Logs */}
      <div>
        <h3 className="text-white font-medium mb-4">Logs</h3>
        <FlowLogs logs={flowData.logs} />
      </div>
    </div>
  );
};

export default FlowMonitor;