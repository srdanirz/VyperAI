import { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge, 
  Handle,
  Position,
} from 'reactflow';
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
  MessageSquare 
} from 'lucide-react';

// Custom Node Components
const TriggerNode = ({ data, selected }) => (
  <div className={`min-w-[200px] transition-transform duration-300 ${selected ? 'scale-105' : ''}`}>
    <div className="bg-gradient-to-r from-[#38ff9b]/20 to-[#38ff9b]/10 p-4 rounded-xl border border-[#38ff9b]/30">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-[#38ff9b]/20">
          <Zap className="w-4 h-4 text-[#38ff9b]" />
        </div>
        <span className="text-white font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#38ff9b]" />
      {data.config && (
        <div className="space-y-2 mt-3">
          {Object.entries(data.config).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{key}:</span>
              <span className="text-white">{value}</span>
            </div>
          ))}
        </div>
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
          <Box className="w-4 h-4 text-[#8074E0]" />
        </div>
        <span className="text-white font-medium">{data.label}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#8074E0]" />
      {data.config && (
        <div className="mt-3 space-y-2">
          {data.inputs?.map((input, index) => (
            <input
              key={index}
              type="text"
              placeholder={input.placeholder}
              className="w-full bg-[#14141F]/50 text-white rounded-lg p-2 text-sm border border-transparent 
                       focus:border-[#8074E0]/50 focus:outline-none"
            />
          ))}
        </div>
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
          <Database className="w-4 h-4 text-[#FF6B6B]" />
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
  output: OutputNode,
};

const FlowBuilder = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const addNode = (type) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 100, y: nodes.length * 150 },
      data: {
        label: type === 'trigger' ? 'New Trigger' :
               type === 'action' ? 'New Action' : 'Output',
        config: {},
        inputs: type === 'action' ? [{ placeholder: 'Enter parameter' }] : undefined
      }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-[#1B1B26] border-r border-[#2A2A40] p-6">
        <div className="space-y-4">
          <h2 className="text-white font-medium mb-4">Flow Components</h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              className="w-full bg-[#2A2A40] text-white rounded-lg pl-10 pr-4 py-2
                       border border-transparent focus:border-[#38ff9b]/30 focus:outline-none"
            />
          </div>

          {/* Component Categories */}
          <div className="space-y-2">
            {[
              { type: 'trigger', label: 'Triggers', icon: Zap, color: 'text-[#38ff9b]' },
              { type: 'action', label: 'Actions', icon: Box, color: 'text-[#8074E0]' },
              { type: 'output', label: 'Outputs', icon: Database, color: 'text-[#FF6B6B]' }
            ].map(({ type, label, icon: Icon, color }) => (
              <button
                key={type}
                onClick={() => addNode(type)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#2A2A40] 
                         hover:bg-[#2A2A40]/80 text-white transition-all duration-300"
              >
                <Icon className={`w-4 h-4 ${color}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Templates Section */}
          <div className="mt-6">
            <h3 className="text-gray-400 text-sm mb-3">Templates</h3>
            <button className="w-full p-4 rounded-xl border-2 border-dashed border-[#38ff9b]/20 
                           hover:border-[#38ff9b]/40 transition-colors">
              <Plus className="w-5 h-5 text-[#38ff9b] mx-auto mb-2" />
              <p className="text-white text-sm">Start from Template</p>
            </button>
          </div>
        </div>
      </div>

      {/* Flow Canvas */}
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

        {/* Flow Area */}
        <div className="flex-1 bg-[#14141F]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {
              setNodes((nds) =>
                nds.map((node) => {
                  const change = changes.find((c) => c.id === node.id);
                  if (change) {
                    return { ...node, position: change.position || node.position };
                  }
                  return node;
                })
              );
            }}
            onEdgesChange={() => {}}
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
      {selectedNode && (
        <div className="w-64 bg-[#1B1B26] border-l border-[#2A2A40] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium">Properties</h2>
            <button onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-[#2A2A40] rounded-lg transition-colors">
              <ArrowRight className="w-4 h-4 text-gray-400" />
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
                className="w-full bg-[#2A2A40] text-white rounded-lg p-2 border border-transparent 
                         focus:border-[#38ff9b]/50 focus:outline-none"
              />
            </div>
            {/* Add more property fields based on node type */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowBuilder;