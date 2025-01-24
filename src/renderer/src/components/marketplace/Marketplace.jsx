import { useState } from 'react';
import { Search, Filter, Star, Package, Download, GitBranch, ArrowRight, Heart, MessageCircle } from 'lucide-react';

const FlowCard = ({ flow, onInstall, onPreview }) => (
  <div className="group bg-[#1B1B26] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-[#38ff9b]/5 transition-all duration-300">
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
          onClick={onInstall}
          className="flex items-center gap-2 px-4 py-2 bg-[#38ff9b]/10 text-[#38ff9b] rounded-lg
                   hover:bg-[#38ff9b] hover:text-[#14141F] transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          <span>Install</span>
        </button>
      </div>
    </div>
  </div>
);

const TrendingCard = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="group relative bg-gradient-to-br from-[#38ff9b]/5 to-[#38ff9b]/10 rounded-xl p-8
             hover:shadow-xl hover:shadow-[#38ff9b]/5 transition-all duration-300"
  >
    <div className="absolute top-0 right-0 p-4">
      <Star className="w-6 h-6 text-[#38ff9b] animate-pulse" />
    </div>
    
    <div className="mb-6">
      <GitBranch className="w-12 h-12 text-[#38ff9b] mb-4" />
      <h3 className="text-xl font-medium text-white mb-2">Trending Flows</h3>
      <p className="text-gray-400">Discover what's popular in the community</p>
    </div>
    
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-[#2A2A40] flex items-center justify-center text-[#38ff9b]">
            #{i}
          </div>
          <div className="flex-1">
            <div className="text-white">Top Flow {i}</div>
            <div className="text-gray-400">{1200 - (i * 200)} installs this week</div>
          </div>
        </div>
      ))}
    </div>
  </button>
);

const CategoryTag = ({ category, count, selected, onClick }) => (
  <button
    onClick={() => onClick(category)}
    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-300
             ${selected 
               ? 'bg-[#38ff9b] text-[#14141F]'
               : 'bg-[#2A2A40] text-white hover:bg-[#2A2A40]/80'
             }`}
  >
    {category}
    <span className="ml-2 px-2 py-0.5 rounded bg-black/20 text-xs">
      {count}
    </span>
  </button>
);

const MarketplaceFilters = ({ onSearch, activeFilters, onFilterChange }) => (
  <div className="flex items-center justify-between mb-8">
    <div className="relative group">
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search flows..."
        onChange={(e) => onSearch(e.target.value)}
        className="bg-[#1B1B26] text-white rounded-lg pl-10 pr-4 py-2 w-64 
                 border border-transparent focus:border-[#38ff9b]/30 focus:outline-none
                 transition-all duration-300"
      />
      <div className="absolute inset-0 -m-1 rounded-lg bg-[#38ff9b]/0 
                    group-hover:bg-[#38ff9b]/5 pointer-events-none transition-colors" />
    </div>
    
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {Object.entries(activeFilters).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onFilterChange(key, !value)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors
                     ${value 
                       ? 'bg-[#38ff9b] text-[#14141F]' 
                       : 'bg-[#2A2A40] text-gray-400'
                     }`}
          >
            {key}
          </button>
        ))}
      </div>
      
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2A40] 
                       text-white hover:bg-[#2A2A40]/80 transition-all duration-300">
        <Filter className="w-4 h-4" />
        More Filters
      </button>
    </div>
  </div>
);

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState({
    "Popular": true,
    "New": false,
    "Pro": false
  });

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
      description: "Track prices across multiple e-commerce sites with automated alerts",
      category: "Web Scraping",
      rating: 4.8,
      downloads: "2.3k",
      likes: 456,
      comments: 23,
      author: {
        name: "Sarah Chen",
        role: "Flow Developer",
        avatar: "/api/placeholder/32/32"
      }
    },
    {
      id: 2,
      name: "Social Media Scheduler",
      description: "Schedule and automate posts across multiple social platforms",
      category: "Automation",
      rating: 4.5,
      downloads: "1.8k",
      likes: 342,
      comments: 18,
      author: {
        name: "Alex Kim",
        role: "Automation Expert",
        avatar: "/api/placeholder/32/32"
      }
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-[#38ff9b]" />
            Marketplace
          </h1>
          <p className="text-gray-400 mt-2">
            Discover and install pre-built automation flows
          </p>
        </div>
      </div>

      <MarketplaceFilters 
        onSearch={setSearchQuery}
        activeFilters={activeFilters}
        onFilterChange={(key, value) => 
          setActiveFilters(prev => ({ ...prev, [key]: value }))}
      />

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <CategoryTag
            key={category.id}
            category={category.name}
            count={category.count}
            selected={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <TrendingCard onClick={() => {}} />
        {sampleFlows.map(flow => (
          <FlowCard 
            key={flow.id} 
            flow={flow}
            onInstall={() => {}}
            onPreview={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;