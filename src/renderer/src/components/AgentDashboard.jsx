import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Pause, RefreshCw, Trash, Plus, Sparkles, Coffee } from 'lucide-react';

const AgentCard = ({ agent, onAction }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-[#2A2A40] rounded-xl p-6 hover:shadow-lg hover:shadow-[#38ff9b]/10 transform hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-[#38ff9b]/0 via-[#38ff9b]/5 to-[#38ff9b]/0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

      <div className="relative">
        {/* Status indicator */}
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
              title={agent.status === 'running' ? 'Pause Agent' : 'Start Agent'}
            >
              {agent.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => onAction(agent.id, 'restart')}
              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all duration-300"
              title="Restart Agent"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onAction(agent.id, 'delete')}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all duration-300"
              title="Delete Agent"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar with animation */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">{agent.description}</span>
            <span className="text-[#38ff9b]">{agent.progress}%</span>
          </div>
          <div className="h-2 bg-[#14141F] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#38ff9b] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${agent.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
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

const QuickStartCard = ({ onAction }) => (
  <button
    onClick={() => onAction('quickstart')}
    className="group relative bg-gradient-to-br from-[#38ff9b]/5 to-[#38ff9b]/10 rounded-xl p-6 border-2 border-dashed border-[#38ff9b]/20 hover:border-[#38ff9b]/40 transition-all duration-300"
  >
    <div className="flex flex-col items-center justify-center text-center h-full space-y-4">
      <div className="p-4 rounded-full bg-[#38ff9b]/10 group-hover:bg-[#38ff9b]/20 transition-colors">
        <Sparkles className="w-6 h-6 text-[#38ff9b]" />
      </div>
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Quick Start Agent</h3>
        <p className="text-gray-400 text-sm">Get started with a pre-configured agent in seconds</p>
      </div>
    </div>
  </button>
);

const AgentDashboard = () => {
  const [agents] = useState([
    {
      id: 1,
      name: "Flight Scanner",
      status: "running",
      description: "Monitoring flight prices",
      progress: 65,
      stats: [
        { label: "Searches", value: "1.2k" },
        { label: "Alerts", value: "24" },
        { label: "Uptime", value: "99%" }
      ]
    },
    {
      id: 2,
      name: "Product Tracker",
      status: "paused",
      description: "Tracking e-commerce prices",
      progress: 42,
      stats: [
        { label: "Products", value: "847" },
        { label: "Updates", value: "2.1k" },
        { label: "Savings", value: "$1.2k" }
      ]
    }
  ]);

  const handleAction = (agentId, action) => {
    // Implementation
    console.log(`Agent ${agentId}: ${action}`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back! ☕️</h1>
          <p className="text-gray-400 mt-2">Your agents are working hard. Here's what they've been up to.</p>
        </div>
        <button 
          className="flex items-center gap-2 px-6 py-3 bg-[#38ff9b] text-[#14141F] rounded-xl font-medium hover:bg-[#38ff9b]/90 transform hover:-translate-y-0.5 transition-all duration-300"
          onClick={() => handleAction(null, 'new')}
        >
          <Plus className="w-5 h-5" />
          New Agent
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Active Agents", value: "4", icon: Coffee, change: "+2 today" },
          { label: "Tasks Completed", value: "1,234", change: "+12% this week" },
          { label: "Success Rate", value: "98.5%", change: "+0.5% avg" },
          { label: "Data Points", value: "45.2K", change: "+2.1K today" }
        ].map((stat, index) => (
          <div 
            key={index}
            className="bg-[#1B1B26] rounded-xl p-6 hover:bg-[#1B1B26]/80 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-[#38ff9b]/10">
                <stat.icon className="w-5 h-5 text-[#38ff9b]" />
              </div>
            </div>
            <p className="text-[#38ff9b] text-sm mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onAction={handleAction} 
          />
        ))}
        <QuickStartCard onAction={handleAction} />
      </div>
    </div>
  );
};

export default AgentDashboard;