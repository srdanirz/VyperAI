import { useState } from 'react';
import { Search, Filter, Star, Download, Sparkles, TreePine, Package, GitBranch } from 'lucide-react';

const FlowCard = ({ flow, onInstall, onPreview }) => (
  <div className="group bg-[#1B1B26] rounded-xl overflow-hidden hover:shadow-xl hover:shadow-[#38ff9b]/5 transition-all duration-300">
    {/* Preview Section */}
    <div 
      className="aspect-video bg-[#2A2A40] p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500"
      onClick={onPreview}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2A2A40]/80" />
      <div className="h-full relative">
        {flow.preview}
      </div>
      
      {/* Preview overlay */}
      <div className="absolute inset-0 bg-[#38ff9b]/10 opacity-0 group-hover:opacity-100 
                    flex items-center justify-center transition-opacity duration-300">
        <button className="px-4 py-2 bg-[#38ff9b] text-[#14141F] rounded-lg transform -translate-y-2 
                         group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          Preview Flow
        </button>
      </div>
    </div>

    {/* Content Section */}
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
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#2A2A40]">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-white font-medium">{flow.rating}</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-6">{flow.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={flow.author.avatar} alt="" className="w-8 h-8 rounded-full ring-2 ring-[#38ff9b]/20" />
          <div>
            <div className="text-white text-sm">{flow.author.name}</div>
            <div className="text-gray-400 text-xs">Flow Creator</div>
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
      <Sparkles className="w-6 h-6 text-[#38ff9b] animate-pulse" />
    </div>
    
    <div className="mb-6">
      <TreePine className="w-12 h-12 text-[#38ff9b] mb-4" />
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
            <div className="text-white">Top Trending Flow {i}</div>
            <div className="text-gray-400">1.2k installs this week</div>
          </div>
        </div>
      ))}
    </div>
  </button>
);

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [view, setView] = useState('grid');

  const categories = [
    { id: 'all', name: 'All Flows', count: 124 },
    { id: 'scraping', name: 'Web Scraping', count: 45 },
    { id: 'automation', name: 'Automation', count: 38 },
    { id: 'data', name: 'Data Processing', count: 29 },
    { id: 'apis', name: 'API Integration', count: 12 }
  ];

  const sampleFlows = [
    {
      id: 1,
      name: 'E-commerce Price Tracker',
      description: 'Track prices across multiple e-commerce sites with automated alerts',
      preview: (
        <div className="h-full rounded-lg bg-[#38ff9b]/10 flex items-center justify-center p-4">
          <GitBranch className="w-12 h-12 text-[#38ff9b]" />
        </div>
      ),
      rating: 4.8,
      downloads: '2.3k',
      category: 'Web Scraping',
      author: {
        name: 'Sarah Chen',
        avatar: '/api/placeholder/32/32'
      }
    },
    // Add more sample flows...
  ];

  const filteredFlows = sampleFlows.filter(flow => 
    (selectedCategory === 'all' || flow.category.toLowerCase() === selectedCategory) &&
    flow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Package className="w-8 h-8 text-[#38ff9b]" />
            Marketplace
          </h1>
          <p className="text-gray-400 mt-2">Discover and install pre-built automation flows</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search flows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1B1B26] text-white rounded-lg pl-10 pr-4 py-2 w-64 
                       border border-transparent focus:border-[#38ff9b]/30 focus:outline-none
                       transition-all duration-300"
            />
            <div className="absolute inset-0 -m-1 rounded-lg bg-[#38ff9b]/0 
                          group-hover:bg-[#38ff9b]/5 pointer-events-none transition-colors" />
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2A40] 
                         text-white hover:bg-[#2A2A40]/80 transition-all duration-300">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-300
                     ${selectedCategory === category.id
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
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        <TrendingCard onClick={() => {}} />
        {filteredFlows.map(flow => (
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