import { useState } from "react";
import { Cpu, Zap, AlertTriangle, Cloud } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, change, icon: Icon, chartData }) => (
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
    
    <p className={`text-sm mt-2 ${change > 0 ? 'text-[#38ff9b]' : 'text-red-500'}`}>
      {change > 0 ? '+' : ''}{change}% this week
    </p>
  </div>
);

const PerformanceChart = ({ data }) => (
  <div className="bg-[#1B1B26] rounded-xl p-6">
    <h2 className="text-lg font-medium text-white mb-6">Performance Overview</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
          <Line 
            type="monotone" 
            dataKey="success" 
            stroke="#38ff9b" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="failed" 
            stroke="#ff4444" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const TaskList = ({ tasks }) => (
  <div className="bg-[#1B1B26] rounded-xl p-6">
    <h2 className="text-lg font-medium text-white mb-6">Recent Tasks</h2>
    <div className="space-y-4">
      {tasks.map((task, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-[#2A2A40] rounded-lg">
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${
              task.status === 'completed' ? 'bg-[#38ff9b]' :
              task.status === 'running' ? 'bg-blue-500 animate-pulse' :
              'bg-red-500'
            }`} />
            <div>
              <h3 className="text-white font-medium">{task.name}</h3>
              <p className="text-sm text-gray-400">{task.description}</p>
            </div>
          </div>
          <span className="text-gray-400 text-sm">{task.time}</span>
        </div>
      ))}
    </div>
  </div>
);

const Home = () => {
  const [stats] = useState({
    activeAgents: {
      title: "Active Agents",
      value: "24",
      change: 12,
      icon: Cpu,
      chartData: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: Math.floor(Math.random() * 30) + 10
      }))
    },
    taskSuccess: {
      title: "Task Success Rate",
      value: "98.5%",
      change: 0.5,
      icon: Zap,
      chartData: Array.from({ length: 7 }, () => ({
        name: "Hour",
        value: 95 + Math.random() * 5
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
    },
    resourceUsage: {
      title: "Resource Usage",
      value: "45.2%",
      change: 2.3,
      icon: Cloud,
      chartData: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        value: 40 + Math.random() * 10
      }))
    }
  });

  const [performanceData] = useState(
    Array.from({ length: 14 }, (_, i) => ({
      name: `${i + 1}`,
      success: 85 + Math.random() * 10,
      failed: Math.random() * 5
    }))
  );

  const [recentTasks] = useState([
    {
      name: "Price Monitor",
      description: "Monitoring product prices across e-commerce sites",
      status: "running",
      time: "2m ago"
    },
    {
      name: "Data Extraction",
      description: "Extracting user reviews from multiple sources",
      status: "completed",
      time: "15m ago"
    },
    {
      name: "API Integration",
      description: "Syncing data with external APIs",
      status: "failed",
      time: "1h ago"
    }
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back! 👋</h1>
        <p className="text-gray-400">Here's what's happening with your automation flows</p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {Object.values(stats).map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <PerformanceChart data={performanceData} />
        </div>
        <div className="col-span-1">
          <TaskList tasks={recentTasks} />
        </div>
      </div>
    </div>
  );
};

export default Home;