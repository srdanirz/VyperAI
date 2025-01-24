import { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, addEdge, useNodesState, useEdgesState } from 'reactflow';
import { Play, Save, Plus, Settings, Sparkles, Box, Database, Globe, ArrowRight } from 'lucide-react';

const NodeTypes = {
  trigger: ({ data, selected }) => (
    <div className={`min-w-[180px] transition-all duration-300 transform ${selected ? 'scale-105' : ''}`}>
      <div className="bg-gradient-to-r from-[#38ff9b]/20 to-[#38ff9b]/10 backdrop-blur-sm p-4 rounded-xl border border-[#38ff9b]/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-[#38ff9b]/20">
            <Sparkles className="w-4 h-4 text-[#38ff9b]" />
          </div>
          <span className="text-white font-medium">{data.label}</span>
        </div>
        <div className="space-y-2">
          {data.fields?.map((field, index) => (
            <div key={index} className="group relative">
              <input
                type="text"
                placeholder={field.label}
                className="w-full bg-[#14141F]/50 text-white rounded-lg p-2 text-sm border border-transparent 
                         focus:border-[#38ff9b]/50 focus:outline-none transition-colors"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#38ff9b]/0 via-[#38ff9b]/5 to-[#38ff9b]/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  
  action: ({ data, selected }) => (
    <div className={`min-w-[180px] transition-all duration-300 transform ${selected ? 'scale-105' : ''}`}>
      <div className="bg-gradient-to-r from-[#8074E0]/20 to-[#8074E0]/10 backdrop-blur-sm p-4 rounded-xl border border-[#8074E0]/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-[#8074E0]/20">
            <Box className="w-4 h-4 text-[#8074E0]" />
          </div>
          <span className="text-white font-medium">{data.label}</span>
        </div>
        <select className="w-full bg-[#14141F]/50 text-white rounded-lg p-2 text-sm border border-transparent 
                        focus:border-[#8074E0]/50 focus:outline-none transition-colors">
          {data.options?.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </div>
  ),
  
  output: ({ data, selected }) => (
    <div className={`min-w-[180px] transition-all duration-300 transform ${selected ? 'scale-105' : ''}`}>
      <div className="bg-gradient-to-r from-[#FF6B6B]/20 to-[#FF6B6B]/10 backdrop-blur-sm p-4 rounded-xl border border-[#FF6B6B]/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-[#FF6B6B]/20">
            <Database className="w-4 h-4 text-[#FF6B6B]" />
          </div>
          <span className="text-white font-medium">{data.label}</span>
        </div>
        <div className="text-gray-400 text-sm">{data.description}</div>
      </div>
    </div>
  )
};

const FlowBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const addNewNode = (type) => {
    const position = { x: 100, y: nodes.length * 100 };
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: getNodeData(type),
    };
    setNodes(nodes => [...nodes, newNode]);
  };

  const getNodeData = (type) => {
    switch(type) {
      case 'trigger':
        return {
          label: 'Monitor Website',
          fields: [
            { label: 'URL to monitor' },
            { label: 'Check interval (mins)' }
          ]
        };
      case 'action':
        return {
          label: 'Process Data',
          options: [
            { label: 'Filter results', value: 'filter' },
            { label: 'Transform data', value: 'transform' },
            { label: 'Validate content', value: 'validate' }
          ]
        };
      case 'output':
        return {
          label: 'Save Results',
          description: 'Store processed data in database'
        };
      default:
        return {};
    }
  };

  return (
    <div className="flex h-full">
      {/* Tools Panel */}
      <div className="w-64 bg-[#1B1B26] border-r border-[#2A2A40] p-6">
        <h2 className="text-white font-medium mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#38ff9b]" />
          Flow Components
        </h2>
        <div className="space-y-3">
          {[
            { type: 'trigger', label: 'Trigger', color: 'text-[#38ff9b]' },
            { type: 'action', label: 'Action', color: 'text-[#8074E0]' },
            { type: 'output', label: 'Output', color: 'text-[#FF6B6B]' }
          ].map(({ type, label, color }) => (
            <button
              key={type}
              onClick={() => addNewNode(type)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#2A2A40] hover:bg-[#2A2A40]/80 
                       text-white transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <Plus className={`w-4 h-4 ${color}`} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-gray-400 text-sm mb-3">Quick Templates</h3>
          <button 
            className="w-full p-4 rounded-xl border-2 border-dashed border-[#38ff9b]/20 
                     hover:border-[#38ff9b]/40 transition-colors group"
          >
            <div className="text-center">
              <Sparkles className="w-5 h-5 text-[#38ff9b] mx-auto mb-2 
                                transform group-hover:scale-110 transition-transform" />
              <p className="text-white text-sm">Start with a template</p>
              <p className="text-gray-400 text-xs mt-1">Get started quickly</p>
            </div>
          </button>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 border-b border-[#2A2A40] flex items-center justify-between px-6 bg-[#1B1B26]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#38ff9b] text-[#14141F] 
                       hover:bg-[#38ff9b]/80 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4" />
              {isPreviewMode ? 'Stop Preview' : 'Preview Flow'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2A2A40] text-white 
                           hover:bg-[#2A2A40]/80 transition-all duration-300">
              <Save className="w-4 h-4" />
              Save Flow
            </button>
          </div>
          <button className="p-2 rounded-lg bg-[#2A2A40] text-white hover:bg-[#2A2A40]/80 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Flow Area */}
        <div className="flex-1 bg-[#14141F]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={NodeTypes}
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
              className="bg-[#1B1B26] border-[#2A2A40] rounded-xl p-2"
              nodeColor={n => {
                switch(n.type) {
                  case 'trigger': return '#38ff9b';
                  case 'action': return '#8074E0';
                  case 'output': return '#FF6B6B';
                  default: return '#2A2A40';
                }
              }}
            />
          </ReactFlow>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <div className="w-64 bg-[#1B1B26] border-l border-[#2A2A40] p-6">
          <h2 className="text-white font-medium mb-4">Properties</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-2">Node Label</label>
              <input
                type="text"
                value={selectedNode.data.label}
                onChange={(e) => {
                  const newNodes = nodes.map(node =>
                    node.id === selectedNode.id
                      ? { ...node, data: { ...node.data, label: e.target.value } }
                      : node
                  );
                  setNodes(newNodes);
                }}
                className="w-full bg-[#2A2A40] text-white rounded-lg p-2 border border-transparent 
                         focus:border-[#38ff9b]/50 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowBuilder;