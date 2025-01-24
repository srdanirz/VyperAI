import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Pause, RefreshCw, Trash, Plus, Activity, Clock, Database, AlertTriangle, Settings, GitBranch } from 'lucide-react';

const MetricCard = ({ title, value, change, icon: Icon, chartData }) => (
  <div className="bg-[#1B1B26] rounded-xl p-6 hover:shadow-lg hover:shadow-[#38ff9b]/5 
                 transform hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className="p-2 rounded-lg bg-[#38ff9b]/10">
        <Icon className="w-5 h-5 text-[#38ff9b]" />
      </div>
    </div>
    
    <div className="h-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#38ff9b" 
            strokeWidth={2}
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    
    <p className={`text-sm mt-2 ${
      change > 0 ? 'text-[#38ff9b]' : 'text-red-500'
    }`}>
      {change > 0 ? '+' : ''}{change}% this week
    </p>
  </div>
);

const AgentCard = ({ agent, onAction }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-[#2A2A40] rounded-xl p-6 hover:shadow-lg hover:shadow-[#38ff9b]/10 
                transform hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#38ff9b]/0 via-[#38ff9b]/5 
                    to-[#38ff9b]/0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              agent.status === 'running' ? 'bg-[#38ff9b] animate-pulse' :
              agent.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <h3 className="text-lg font-medium text-white">{agent.name}</h3>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onAction(agent.id, agent.status === 'running' ? 'pause' : 'resume')}
              className="p-2 rounded-lg bg-[#38ff9b]/10 hover:bg-[#38ff9b]/20 text-[#38ff9b] transition-all duration-300"
            >
              {agent.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => onAction(agent.id, 'restart')}
              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onAction(agent.id, 'delete')}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-300"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4">{agent.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-[#38ff9b]">{agent.progress}%</span>
          </div>
          <div className="h-2 bg-[#14141F] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#38ff9b] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${agent.progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {agent.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformanceChart = ({ data }) => (
  <div className="bg-[#1B1B26] rounded-xl p-6">
    <h2 className="text-lg font-medium text-white mb-6">Performance Overview</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A40" />
          <XAxis dataKey="name" stroke="#9A9AB6" />
          <YAxis stroke="#9A9AB6" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2A2A40',
              border: 'none',
              borderRadius: '8px',
              color: 'white'
            }}
          />
          <Bar dataKey="success" fill="#38ff9b" />
          <Bar dataKey="failed" fill="#ff4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AgentDashboard = () => {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "Web Scraper",
      status: "running",
      description: "Monitoring e-commerce prices",
      progress: 65,
      stats: [
        { label: "Tasks", value: "1.2k" },
        { label: "Success", value: "98%" },
        { label: "Uptime", value: "24h" }
      ]
    },
    {
      id: 2,
      name: "Data Processor",
      status: "paused",
      description: "Processing transaction data",
      progress: 42,
      stats: [
        { label: "Processed", value: "847" },
        { label: "Success", value: "95%" },
        { label: "Time", value: "12h" }
      ]
    }
  ]);

  const [performanceData] = useState([
    { name: 'Mon', success: 120, failed: 5 },
    { name: 'Tue', success: 145, failed: 8 },
    { name: 'Wed', success: 132, failed: 3 },
    { name: 'Thu', success: 156, failed: 7 },
    { name: 'Fri', success: 168, failed: 4 },
  ]);

  const [metrics] = useState({
    tasks: {
      title: "Active Tasks",
      value: "1,234",
      change: 12,
      icon: Activity,
      chartData: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 100)
      }))
    },
    uptime: {
      title: "Uptime",
      value: "99.9%",
      change: 0.5,
      icon: Clock,
      chartData: Array.from({ length: 7 }, () => ({
        name: "Hour",
        value: 99 + Math.random()
      }))
    },
    storage: {
      title: "Storage Used",
      value: "45.2GB",
      change: -2.3,
      icon: Database,
      chartData: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: 40 + Math.random() * 10
      }))
    },
    errors: {
      title: "Error Rate",
      value: "0.12%",
      change: -0.5,
      icon: AlertTriangle,
      chartData: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: Math.random()
      }))
    }
  });

  const handleAgentAction = (agentId, action) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => {
        if (agent.id === agentId) {
          switch (action) {
            case 'pause':
              return { ...agent, status: 'paused' };
            case 'resume':
              return { ...agent, status: 'running' };
            case 'delete':
              return null;
            default:
              return agent;
          }
        }
        return agent;
      }).filter(Boolean)
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Agent Dashboard</h1>
          <p className="text-gray-400">Monitor and manage your automation agents</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-2 px-6 py-3 bg-[#38ff9b] text-[#14141F] rounded-xl 
                     hover:bg-[#38ff9b]/90 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            New Agent
          </button>
          <button className="p-2 rounded-lg hover:bg-[#2A2A40] transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {Object.values(metrics).map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Performance Chart */}
      <div className="mb-8">
        <PerformanceChart data={performanceData} />
      </div>

      {/* Active Agents Grid */}
      <div className="grid grid-cols-2 gap-6">
        {agents.map(agent => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onAction={handleAgentAction}
          />
        ))}
        
        {/* Add Agent Card */}
        <button className="bg-[#1B1B26] rounded-xl p-6 border-2 border-dashed border-[#38ff9b]/20 
                         hover:border-[#38ff9b]/40 transition-colors text-center">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="p-4 rounded-full bg-[#38ff9b]/10">
              <GitBranch className="w-8 h-8 text-[#38ff9b]" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Create New Agent</h3>
              <p className="text-gray-400">Start automating with a new agent</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AgentDashboard;