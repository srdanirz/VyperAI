import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Camera, Settings, Award, Clock, Zap, Activity, Github, Twitter } from 'lucide-react';

const StatsCard = ({ title, value, change, icon: Icon }) => (
  <div className="bg-[#1B1B26] rounded-xl p-6 hover:shadow-lg hover:shadow-[#38ff9b]/5 
                 transform hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className="p-2 rounded-lg bg-[#38ff9b]/10">
        <Icon className="w-5 h-5 text-[#38ff9b]" />
      </div>
    </div>
    <p className={`text-sm mt-2 ${
      change > 0 ? 'text-[#38ff9b]' : 'text-red-500'
    }`}>
      {change > 0 ? '+' : ''}{change}% this week
    </p>
  </div>
);

const AchievementCard = ({ achievement }) => (
  <div className="group bg-[#1B1B26] rounded-xl p-6 hover:shadow-lg hover:shadow-[#38ff9b]/5 
                 transform hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-[#2A2A40] group-hover:bg-[#38ff9b]/10 transition-colors">
        <Award className="w-6 h-6 text-[#38ff9b]" />
      </div>
      <div>
        <h3 className="text-white font-medium mb-1">{achievement.title}</h3>
        <p className="text-gray-400 text-sm">{achievement.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-[#2A2A40] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#38ff9b] transition-all duration-500 ease-out"
              style={{ width: `${achievement.progress}%` }}
            />
          </div>
          <span className="text-sm text-[#38ff9b]">{achievement.progress}%</span>
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const [user, setUser] = useState({
    name: "Sarah Chen",
    role: "Automation Engineer",
    avatar: "/api/placeholder/96/96",
    stats: {
      totalFlows: 24,
      activeAgents: 8,
      successRate: 98.5,
      uptime: 99.9
    },
    achievements: [
      {
        title: "Flow Master",
        description: "Create 50 successful automation flows",
        progress: 75
      },
      {
        title: "Data Pioneer",
        description: "Process over 1M data points",
        progress: 90
      }
    ],
    activityData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      value: Math.floor(Math.random() * 100)
    }))
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="bg-[#1B1B26] rounded-xl p-8 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="group relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden ring-4 ring-[#38ff9b]/20">
                <img 
                  src={user.avatar} 
                  alt="" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" 
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-lg bg-[#38ff9b] 
                             opacity-0 group-hover:opacity-100 transform translate-y-2 
                             group-hover:translate-y-0 transition-all duration-300">
                <Camera className="w-4 h-4 text-[#14141F]" />
              </button>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <div className="px-3 py-1 rounded-full bg-[#38ff9b]/10 text-[#38ff9b] text-sm">
                  Pro User
                </div>
              </div>
              <p className="text-gray-400">{user.role}</p>
              
              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Github className="w-4 h-4" />
                  <span>Github</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="p-2 rounded-lg bg-[#2A2A40] text-white hover:bg-[#2A2A40]/80 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Flows" 
          value={user.stats.totalFlows} 
          change={12} 
          icon={Zap}
        />
        <StatsCard 
          title="Active Agents" 
          value={user.stats.activeAgents} 
          change={5} 
          icon={Activity}
        />
        <StatsCard 
          title="Success Rate" 
          value={`${user.stats.successRate}%`} 
          change={0.5} 
          icon={Award}
        />
        <StatsCard 
          title="Uptime" 
          value={`${user.stats.uptime}%`} 
          change={0.1} 
          icon={Clock}
        />
      </div>

      {/* Activity Chart */}
      <div className="bg-[#1B1B26] rounded-xl p-6 mb-8">
        <h2 className="text-lg font-medium text-white mb-6">Activity Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={user.activityData}>
              <XAxis 
                dataKey="date" 
                stroke="#9A9AB6"
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
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
                dataKey="value" 
                stroke="#38ff9b" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-medium text-white mb-6">Achievements</h2>
        <div className="grid grid-cols-2 gap-6">
          {user.achievements.map((achievement, index) => (
            <AchievementCard key={index} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;