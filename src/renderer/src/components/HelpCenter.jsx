import { useState } from 'react';
import { Search, Book, Play, MessageSquare, ExternalLink, ChevronRight, ChevronDown, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocItem = ({ doc }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#2A2A40] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-white hover:bg-[#2A2A40] transition-colors"
      >
        <div className="flex items-center gap-3">
          <File className="w-5 h-5 text-[#38ff9b]" />
          <span>{doc.title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-[#1B1B26] text-gray-400">
              {doc.content}
              {doc.link && (
                <a 
                  href={doc.link}
                  className="flex items-center gap-2 text-[#38ff9b] mt-4 hover:underline"
                >
                  Read More <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VideoTutorial = ({ tutorial }) => (
  <div className="bg-[#1B1B26] rounded-xl overflow-hidden group">
    <div className="aspect-video bg-[#2A2A40] relative group-hover:scale-105 transition-transform duration-500">
      <img src={tutorial.thumbnail} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="w-12 h-12 text-white" />
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-white font-medium mb-1">{tutorial.title}</h3>
      <p className="text-gray-400 text-sm">{tutorial.duration}</p>
    </div>
  </div>
);

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState('docs');
  const [searchQuery, setSearchQuery] = useState('');

  const docs = [
    {
      title: "Getting Started with Vyper AI",
      content: "Learn the basics of setting up and using Vyper AI for your automation needs...",
      link: "/docs/getting-started"
    },
    {
      title: "Flow Builder Guide",
      content: "Master the flow builder to create powerful automation workflows...",
      link: "/docs/flow-builder"
    },
    {
      title: "Working with Proxies",
      content: "Learn how to configure and manage proxies for optimal performance...",
      link: "/docs/proxies"
    }
  ];

  const tutorials = [
    {
      title: "Building Your First Flow",
      duration: "5 min",
      thumbnail: "/api/placeholder/400/225"
    },
    {
      title: "Advanced Proxy Configuration",
      duration: "8 min",
      thumbnail: "/api/placeholder/400/225"
    },
    {
      title: "Data Extraction Techniques",
      duration: "12 min",
      thumbnail: "/api/placeholder/400/225"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start gap-8">
        {/* Left Column - Navigation */}
        <div className="w-64 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1B1B26] text-white rounded-xl pl-10 pr-4 py-2 
                       border border-transparent focus:border-[#38ff9b]/30 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('docs')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === 'docs' ? 'bg-[#38ff9b] text-[#14141F]' : 'text-white hover:bg-[#2A2A40]'
              }`}
            >
              <Book className="w-5 h-5" />
              Documentation
            </button>
            <button
              onClick={() => setActiveTab('tutorials')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === 'tutorials' ? 'bg-[#38ff9b] text-[#14141F]' : 'text-white hover:bg-[#2A2A40]'
              }`}
            >
              <Play className="w-5 h-5" />
              Video Tutorials
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === 'support' ? 'bg-[#38ff9b] text-[#14141F]' : 'text-white hover:bg-[#2A2A40]'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Support
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-400 text-sm mb-3">Quick Links</h3>
            <div className="space-y-2">
              {['FAQ', 'API Reference', 'Best Practices', 'Changelog'].map((link) => (
                <button
                  key={link}
                  className="w-full text-left p-2 text-white hover:bg-[#2A2A40] rounded-lg transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'docs' && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#1B1B26] rounded-xl overflow-hidden"
              >
                {docs.map((doc, index) => (
                  <DocItem key={index} doc={doc} />
                ))}
              </motion.div>
            )}

            {activeTab === 'tutorials' && (
              <motion.div
                key="tutorials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 gap-6"
              >
                {tutorials.map((tutorial, index) => (
                  <VideoTutorial key={index} tutorial={tutorial} />
                ))}
              </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div
                key="support"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#1B1B26] rounded-xl p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4">Need Help?</h2>
                <p className="text-gray-400 mb-6">
                  Our support team is here to help you with any questions or issues you might have.
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                  <button className="p-6 bg-[#2A2A40] rounded-xl text-left hover:bg-[#2A2A40]/80 transition-colors">
                    <MessageSquare className="w-8 h-8 text-[#38ff9b] mb-4" />
                    <h3 className="text-white font-medium mb-2">Live Chat</h3>
                    <p className="text-gray-400 text-sm">Get instant help from our support team</p>
                  </button>
                  
                  <button className="p-6 bg-[#2A2A40] rounded-xl text-left hover:bg-[#2A2A40]/80 transition-colors">
                    <MessageSquare className="w-8 h-8 text-[#38ff9b] mb-4" />
                    <h3 className="text-white font-medium mb-2">Email Support</h3>
                    <p className="text-gray-400 text-sm">Send us a message and we'll get back to you</p>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;