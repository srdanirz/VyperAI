import { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge, 
  Handle,
  Position,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Plus,
  Save,
  Play,
  Settings,
  Box,
  Database,
  Globe,
  ArrowRight,
  Zap,
  Code,
  MessageCircle,
  X,
  Trash2
} from 'lucide-react';

// Custom Node Components
const TriggerNode = ({ data, selected }) => (
  <div className={`min-w-[200px] transition-transform duration-300 ${selected ? 'scale-105' : ''}`}>
    <div className="bg-gradient-to-r from-[#38ff9b]/20 to-[#38ff9b]/10 p-4 rounded-xl border border-[#38ff9b]/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-[#38ff9b]/20">
          <data.icon className="w-4 h-4 text-[#38ff9b]" />
        </div>
        <span className="text-white font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#38ff9b]" />
      {data.description && (
        <p className="text-sm text-gray-400 mt-2">{data.description}</p>
      )}
    </div>
  </div>
);

const ActionNode = ({ data, selected }) => (
  <div className={`min-w-[200px] transition-transform duration-300 ${selected ? 'scale-105' : ''}`}>
    <div className="bg-gradient-to-r from-[#8074E0]/20 to-[#8074E0]/10 p-4 rounded-xl border border-[#8074E0]/30">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#8074E0]" />
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-[#8074E0]/20">
          <data.icon className="w-4 h-4 text-[#8074E0]" />
        </div>
        <span className="text-white font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#8074E0]" />
      {data.description && (
        <p className="text-sm text-gray-400 mt-2">{data.description}</p>
      )}
    </div>
  </div>
);

const OutputNode = ({ data, selected }) => (
  <div className={`min-w-[200px] transition-transform duration-300 ${selected ? 'scale-105' : ''}`}>
    <div className="bg-gradient-to-r from-[#FF6B6B]/20 to-[#FF6B6B]/10 p-4 rounded-xl border border-[#FF6B6B]/30">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#FF6B6B]" />
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-[#FF6B6B]/20">
          <data.icon className="w-4 h-4 text-[#FF6B6B]" />
        </div>
        <span className="text-white font-medium">{data.label}</span>
      </div>
      {data.preview && (
        <div className="mt-3 p-2 bg-[#14141F]/50 rounded-lg">
          <pre className="text-gray-400 text-sm overflow-auto max-h-20">
            {JSON.stringify(data.preview, null, 2)}
          </pre>
        </div>
      )}
    </div>
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  output: OutputNode
};

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const addNode = (type, nodeData) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100, y: nodes.length * 150 },
      data: {
        ...nodeData,
        label: nodeData.label || `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const nodeComponents = {
    triggers: [
      {
        type: 'trigger',
        label: 'Web Scraper',
        icon: Globe,
        description: 'Start a web scraping task',
        color: '#38ff9b'
      },
      {
        type: 'trigger',
        label: 'API Watcher',
        icon: Code,
        description: 'Monitor API endpoints',
        color: '#38ff9b'
      }
    ],
    actions: [
      {
        type: 'action',
        label: 'Data Processor',
        icon: Box,
        description: 'Process and transform data',
        color: '#8074E0'
      },
      {
        type: 'action',
        label: 'Content Filter',
        icon: Database,
        description: 'Filter and clean content',
        color: '#8074E0'
      }
    ],
    outputs: [
      {
        type: 'output',
        label: 'Save to Database',
        icon: Database,
        description: 'Store results in database',
        color: '#FF6B6B'
      },
      {
        type: 'output',
        label: 'Send Notification',
        icon: MessageCircle,
        description: 'Send alerts and notifications',
        color: '#FF6B6B'
      }
    ]
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-[#1B1B26] border-r border-[#2A2A40] flex flex-col">
        {/* Search Components */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2A2A40] text-white rounded-lg pl-10 pr-4 py-2
                     border border-transparent focus:border-[#38ff9b]/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Component Categories */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {Object.entries(nodeComponents).map(([category, components]) => (
            <div key={category}>
              <h3 className="text-gray-400 text-sm mb-2 capitalize">{category}</h3>
              <div className="space-y-2">
                {components
                  .filter(comp => 
                    comp.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    comp.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((component) => (
                    <motion.button
                      key={component.label}
                      onClick={() => addNode(component.type, component)}
                      className="w-full p-3 bg-[#2A2A40] rounded-lg text-left hover:bg-[#2A2A40]/80 
                               transition-colors group"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${component.color}20` }}>
                          <component.icon className="w-4 h-4" style={{ color: component.color }} />
                        </div>
                        <div>
                          <div className="text-white font-medium mb-1">{component.label}</div>
                          <div className="text-gray-400 text-sm">{component.description}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Templates */}
        <div className="p-4 border-t border-[#2A2A40]">
          <button className="w-full p-4 rounded-xl border-2 border-dashed border-[#38ff9b]/20 
                           hover:border-[#38ff9b]/40 transition-colors text-center">
            <Plus className="w-5 h-5 text-[#38ff9b] mx-auto mb-2" />
            <p className="text-white text-sm">Start from Template</p>
          </button>
        </div>
      </div>

      {/* Flow Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 border-b border-[#2A2A40] flex items-center justify-between px-6 bg-[#1B1B26]">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#38ff9b] text-[#14141F] rounded-lg
                             hover:bg-[#38ff9b]/80 transition-colors">
              <Play className="w-4 h-4" />
              Test Flow
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2A2A40] text-white rounded-lg
                             hover:bg-[#2A2A40]/80 transition-colors">
              <Save className="w-4 h-4" />
              Save Flow
            </button>
          </div>
          <button className="p-2 rounded-lg hover:bg-[#2A2A40] transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Flow Canvas */}
        <div className="flex-1 bg-[#14141F]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNode(node)}
            defaultEdgeOptions={{
              style: { stroke: '#38ff9b', strokeWidth: 2 },
              type: 'smoothstep',
              animated: true
            }}
            fitView
          >
            <Background color="#2A2A40" gap={16} />
            <Controls className="bg-[#1B1B26] border-[#2A2A40] rounded-xl p-2" />
            <MiniMap 
              nodeColor={(n) => {
                switch(n.type) {
                  case 'trigger': return '#38ff9b';
                  case 'action': return '#8074E0';
                  case 'output': return '#FF6B6B';
                  default: return '#2A2A40';
                }
              }}
              className="bg-[#1B1B26] border-[#2A2A40] rounded-xl p-2"
            />
          </ReactFlow>
        </div>
      </div>

      {/* Properties Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-64 bg-[#1B1B26] border-l border-[#2A2A40] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-white">Properties</h2>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-lg hover:bg-[#2A2A40] transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Label</label>
                <input
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(e) => {
                    setNodes(nodes.map(node =>
                      node.id === selectedNode.id
                        ? { ...node, data: { ...node.data, label: e.target.value } }
                        : node
                    ));
                  }}
                  className="w-full bg-[#2A2A40] text-white rounded-lg p-2 
                           border border-transparent focus:border-[#38ff9b]/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Description</label>
                <textarea
                  value={selectedNode.data.description}
                  onChange={(e) => {
                    setNodes(nodes.map(node =>
                      node.id === selectedNode.id
                        ? { ...node, data: { ...node.data, description: e.target.value } }
                        : node
                    ));
                  }}
                  className="w-full h-24 bg-[#2A2A40] text-white rounded-lg p-2 
                           border border-transparent focus:border-[#38ff9b]/50 focus:outline-none resize-none"
                />
              </div>

              {selectedNode.type === 'trigger' && (
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Trigger Type</label>
                  <select
                    value={selectedNode.data.triggerType}
                    onChange={(e) => {
                      setNodes(nodes.map(node =>
                        node.id === selectedNode.id
                          ? { ...node, data: { ...node.data, triggerType: e.target.value } }
                          : node
                      ));
                    }}
                    className="w-full bg-[#2A2A40] text-white rounded-lg p-2
                             border border-transparent focus:border-[#38ff9b]/50 focus:outline-none"
                  >
                    <option value="interval">Time Interval</option>
                    <option value="webhook">Webhook</option>
                    <option value="event">Event Based</option>
                  </select>
                </div>
              )}

              {selectedNode.type === 'action' && (
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Action Settings</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="API Endpoint"
                      className="w-full bg-[#2A2A40] text-white rounded-lg p-2
                               border border-transparent focus:border-[#38ff9b]/50 focus:outline-none"
                    />
                    <select
                      className="w-full bg-[#2A2A40] text-white rounded-lg p-2
                               border border-transparent focus:border-[#38ff9b]/50 focus:outline-none"
                    >
                      <option value="get">GET</option>
                      <option value="post">POST</option>
                      <option value="put">PUT</option>
                      <option value="delete">DELETE</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Headers (JSON)"
                      className="w-full bg-[#2A2A40] text-white rounded-lg p-2
                               border border-transparent focus:border-[#38ff9b]/50 focus:outline-none"
                    />
                    <textarea
                      placeholder="Request Body (JSON)"
                      className="w-full h-24 bg-[#2A2A40] text-white rounded-lg p-2
                               border border-transparent focus:border-[#38ff9b]/50 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {selectedNode.type === 'output' && (
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Output Format</label>
                  <select
                    className="w-full bg-[#2A2A40] text-white rounded-lg p-2
                             border border-transparent focus:border-[#38ff9b]/50 focus:outline-none"
                  >
                    <option value="json">JSON</option>
                    <option value="csv">CSV</option>
                    <option value="xml">XML</option>
                  </select>

                  <label className="text-gray-400 text-sm block mt-4 mb-2">Destination</label>
                  <div className="space-y-2">
                    <select
                      className="w-full bg-[#2A2A40] text-white rounded-lg p-2
                               border border-transparent focus:border-[#38ff9b]/50 focus:outline-none"
                    >
                      <option value="database">Database</option>
                      <option value="file">File System</option>
                      <option value="api">External API</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Connection String/Path"
                      className="w-full bg-[#2A2A40] text-white rounded-lg p-2
                               border border-transparent focus:border-[#38ff9b]/50 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-gray-400 text-sm block mb-2">Advanced Options</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Retry on Failure</span>
                    <input type="checkbox" 
                           className="toggle"
                           checked={selectedNode.data.retry}
                           onChange={(e) => {
                             setNodes(nodes.map(node =>
                               node.id === selectedNode.id
                                 ? { ...node, data: { ...node.data, retry: e.target.checked } }
                                 : node
                             ));
                           }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Enable Logging</span>
                    <input type="checkbox" 
                           className="toggle"
                           checked={selectedNode.data.logging}
                           onChange={(e) => {
                             setNodes(nodes.map(node =>
                               node.id === selectedNode.id
                                 ? { ...node, data: { ...node.data, logging: e.target.checked } }
                                 : node
                             ));
                           }}
                    />
                  </div>
                  {selectedNode.data.retry && (
                    <div>
                      <label className="text-gray-400 text-sm block mt-2 mb-1">Retry Attempts</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={selectedNode.data.retryAttempts || 3}
                        onChange={(e) => {
                          setNodes(nodes.map(node =>
                            node.id === selectedNode.id
                              ? { ...node, data: { ...node.data, retryAttempts: parseInt(e.target.value) } }
                              : node
                          ));
                        }}
                        className="w-full bg-[#2A2A40] text-white rounded-lg p-2
                                 border border-transparent focus:border-[#38ff9b]/50 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setNodes(nodes.filter(n => n.id !== selectedNode.id));
                  setSelectedNode(null);
                }}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 
                         rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Node
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlowBuilder;