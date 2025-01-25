import { useState } from 'react';
import { Search, Filter, Star, Package, Download, GitBranch, ArrowRight, Heart, MessageCircle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '../components/ui/Dialog';

const FlowPreview = ({ flow, onClose }) => (
  <div className="bg-[#1B1B26] rounded-xl p-6 max-w-4xl w-full">
    <div className="aspect-video bg-[#2A2A40] rounded-xl mb-6 p-8 flex items-center justify-center">
      <GitBranch className="w-24 h-24 text-[#38ff9b] opacity-50" />
    </div>
    <div className="grid grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{flow.name}</h3>
        <p className="text-gray-400 mb-4">{flow.description}</p>
        <div className="space-y-4">
          <div>
            <h4 className="text-white font-medium mb-2">Capabilities</h4>
            <ul className="space-y-2">
              {flow.capabilities.map((cap, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-400">
                  <ArrowRight className="w-4 h-4 mt-1 text-[#38ff9b]" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Requirements</h4>
            <ul className="space-y-2">
              {flow.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-400">
                  <ArrowRight className="w-4 h-4 mt-1 text-[#38ff9b]" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="bg-[#2A2A40] rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src={flow.author.avatar} alt="" className="w-10 h-10 rounded-full ring-2 ring-[#38ff9b]/20" />
              <div>
                <div className="text-white font-medium">{flow.author.name}</div>
                <div className="text-gray-400 text-sm">{flow.author.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1B1B26]">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-medium">{flow.rating}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-[#1B1B26] p-3 rounded-lg">
              <div className="text-gray-400">Downloads</div>
              <div className="text-white font-medium">{flow.downloads}</div>
            </div>
            <div className="bg-[#1B1B26] p-3 rounded-lg">
              <div className="text-gray-400">Last Updated</div>
              <div className="text-white font-medium">2 days ago</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#38ff9b] text-[#14141F] rounded-xl
                         font-medium hover:bg-[#38ff9b]/80 transition-colors">
            <Download className="w-5 h-5" />
            Install Flow
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#2A2A40] text-white rounded-xl
                         font-medium hover:bg-[#2A2A40]/80 transition-colors">
            <Play className="w-5 h-5" />
            Try Demo
          </button>
        </div>
      </div>
    </div>
  </div>
);

const FlowCard = ({ flow, onPreview }) => (
  <motion.div 
    className="group bg-[#1B1B26] rounded-xl overflow-hidden"
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    }}
    whileHover={{ y: -5 }}
  >
    <div 
      className="aspect-video bg-[#2A2A40] p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500"
      onClick={onPreview}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2A2A40]/80" />
      <div className="h-full relative flex items-center justify-center">
        {flow.preview || (
          <div className="p-6 rounded-xl bg-[#38ff9b]/10 flex items-center justify-center">
            <GitBranch className="w-12 h-12 text-[#38ff9b]" />
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center bg-[#38ff9b]/10 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300">
        <button className="px-4 py-2 bg-[#38ff9b] text-[#14141F] rounded-lg transform -translate-y-2 
                         group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          Preview Flow
        </button>
      </div>
    </div>

    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-white mb-2 group-hover:text-[#38ff9b] transition-colors">
            {flow.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Package className="w-4 h-4" />
            <span>{flow.category}</span>
            <span>•</span>
            <span>{flow.downloads} downloads</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#2A2A40]">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-medium">{flow.rating}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Heart className="w-4 h-4" />
            <span>{flow.likes}</span>
            <MessageCircle className="w-4 h-4 ml-2" />
            <span>{flow.comments}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-6">{flow.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={flow.author.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-[#38ff9b]/20" />
          <div>
            <div className="text-white text-sm">{flow.author.name}</div>
            <div className="text-gray-400 text-xs">{flow.author.role}</div>
          </div>
        </div>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 bg-[#38ff9b]/10 text-[#38ff9b] rounded-lg
                   hover:bg-[#38ff9b] hover:text-[#14141F] transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          <span>Install</span>
        </button>
      </div>
    </div>
  </motion.div>
);

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFlow, setSelectedFlow] = useState(null);
  
  const categories = [
    { id: "all", name: "All Flows", count: 124 },
    { id: "scraping", name: "Web Scraping", count: 45 },
    { id: "automation", name: "Automation", count: 38 },
    { id: "data", name: "Data Processing", count: 29 },
    { id: "apis", name: "API Integration", count: 12 }
  ];

  const sampleFlows = [
    {
      id: 1,
      name: "E-commerce Price Tracker",
      description: "Track prices across multiple e-commerce sites with automated alerts and notifications.",
      category: "Web Scraping",
      rating: 4.8,
      downloads: "2.3k",
      likes: 456,
      comments: 23,
      capabilities: [
        "Multi-site price tracking",
        "Real-time price alerts",
        "Historical price analysis",
        "Export to CSV/Excel",
        "Customizable monitoring intervals"
      ],
      requirements: [
        "Active proxy subscription",
        "Minimum 2GB RAM",
        "Storage space for historical data"
      ],
      author: {
        name: "Sarah Chen",
        role: "Flow Developer",
        avatar: "/api/placeholder/32/32"
      }
    },
    {
      id: 2,
      name: "Social Media Scheduler",
      description: "Schedule and automate posts across multiple social platforms with advanced targeting.",
      category: "Automation",
      rating: 4.5,
      downloads: "1.8k",
      likes: 342,
      comments: 18,
      capabilities: [
        "Multi-platform posting",
        "Content calendar",
        "Analytics tracking",
        "Hashtag suggestions",
        "Media library"
      ],
      requirements: [
        "Social media API keys",
        "Active internet connection",
        "Storage for media files"
      ],
      author: {
        name: "Alex Kim",
        role: "Automation Expert",
        avatar: "/api/placeholder/32/32"
      }
    },
    {
      id: 3,
      name: "Data Scraping Suite",
      description: "Comprehensive data extraction toolkit with support for multiple sources and formats.",
      category: "Web Scraping",
      rating: 4.9,
      downloads: "3.1k",
      likes: 567,
      comments: 42,
      capabilities: [
        "Multi-source extraction",
        "Custom parsing rules",
        "Proxy rotation",
        "Rate limiting",
        "Export options"
      ],
      requirements: [
        "Proxy configuration",
        "Python runtime",
        "Database connection"
      ],
      author: {
        name: "Maria Garcia",
        role: "Data Engineer",
        avatar: "/api/placeholder/32/32"
      }
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-[#38ff9b]" />
            Marketplace
          </h1>
          <p className="text-gray-400 mt-2">
            Discover and install pre-built automation flows
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search flows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1B1B26] text-white rounded-lg pl-10 pr-4 py-2 w-64 
                       border border-transparent focus:border-[#38ff9b]/30 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2A2A40] text-white rounded-lg
                         hover:bg-[#2A2A40]/80 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </motion.div>

      <motion.div 
        className="flex items-center gap-2 mb-8 overflow-x-auto pb-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category.id 
                ? 'bg-[#38ff9b] text-[#14141F]'
                : 'bg-[#2A2A40] text-white hover:bg-[#2A2A40]/80'
            }`}
          >
            {category.name}
            <span className="ml-2 px-2 py-0.5 rounded bg-black/20 text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </motion.div>

      <motion.div 
        className="grid grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        {sampleFlows.map(flow => (
          <FlowCard 
            key={flow.id} 
            flow={flow}
            onPreview={() => setSelectedFlow(flow)}
          />
        ))}
      </motion.div>

      <Dialog
        open={!!selectedFlow}
        onClose={() => setSelectedFlow(null)}
      >
        {selectedFlow && <FlowPreview flow={selectedFlow} onClose={() => setSelectedFlow(null)} />}
      </Dialog>

      {/* Features Grid */}
      <div className="mt-12 grid grid-cols-3 gap-6">
        <div className="bg-[#1B1B26] p-6 rounded-xl">
          <div className="w-12 h-12 bg-[#2A2A40] rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-[#38ff9b]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Verified Flows</h3>
          <p className="text-gray-400">All flows are tested and verified for quality and security</p>
        </div>

        <div className="bg-[#1B1B26] p-6 rounded-xl">
          <div className="w-12 h-12 bg-[#2A2A40] rounded-xl flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-[#38ff9b]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">One-Click Install</h3>
          <p className="text-gray-400">Install and run flows with a single click</p>
        </div>

        <div className="bg-[#1B1B26] p-6 rounded-xl">
          <div className="w-12 h-12 bg-[#2A2A40] rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-[#38ff9b]" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Community Support</h3>
          <p className="text-gray-400">Get help and share tips with the community</p>
        </div>
      </div>

      {/* Community Stats */}  
      <div className="mt-12 bg-[#1B1B26] p-6 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-4">Community Stats</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-2xl font-bold text-[#38ff9b]">124+</div>
            <div className="text-gray-400">Total Flows</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#38ff9b]">2.4k+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#38ff9b]">98%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#38ff9b]">12k+</div>
            <div className="text-gray-400">Tasks Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;