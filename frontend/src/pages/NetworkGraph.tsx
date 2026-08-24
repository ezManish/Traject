import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import type { NetworkGraphData } from '../api/client';
import { Play, Pause, SkipForward, RotateCcw, Share2, Compass, Radio } from 'lucide-react';

export const NetworkGraph: React.FC = () => {
  const {
    activeTopic,
    replayState,
    startReplay,
    pauseReplay,
    resetReplay,
    stepTick
  } = useTrajectStore();

  const [graphData, setGraphData] = useState<NetworkGraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [communities, setCommunities] = useState<any[]>([]);

  useEffect(() => {
    if (activeTopic) {
      api.getTopicNetwork(activeTopic)
        .then((data) => {
          setGraphData(data);
          if (data && data.nodes && data.nodes.length > 0 && !selectedNode) {
            setSelectedNode(data.nodes[0]);
          }
        })
        .catch(console.error);

      api.getTopicCommunities(activeTopic)
        .then(setCommunities)
        .catch(console.error);
    }
  }, [activeTopic, replayState?.current_tick]);

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-borderline pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-brand-amber font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5" />
            <span>TOPOLOGY RADAR LAB</span>
            <span>/</span>
            <span>COMMUNITY INFLUENCE & BRIDGES</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-charcoal-950 tracking-tight mt-1">Information & Network Graph</h1>
          <p className="text-charcoal-400 text-sm mt-1 font-body">
            Community clusters, influence propagation pathways, and cross-platform bridge nodes for {activeTopic}.
          </p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-charcoal-400 bg-card px-4 py-2 rounded-xl border border-borderline shadow-sm">
          <span>NODES: <strong className="text-charcoal-950 font-bold">{graphData?.stats?.total_nodes || 0}</strong></span>
          <span>·</span>
          <span>EDGES: <strong className="text-charcoal-950 font-bold">{graphData?.stats?.total_edges || 0}</strong></span>
          <span>·</span>
          <span>CLUSTERS: <strong className="text-brand-amber font-bold">{graphData?.stats?.communities_count || 0}</strong></span>
        </div>
      </div>

      {/* Dominant Panel: Interactive Graph Canvas + Scrubber */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-panel rounded-2xl p-5 relative min-h-[540px] overflow-hidden flex flex-col justify-between shadow-glass">
          <div className="flex items-center justify-between z-10 font-mono text-xs pb-3 border-b border-borderline">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-emerald" />
              <span className="text-charcoal-950 font-bold">NETWORKX DIRECTED TOPOLOGY</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-charcoal-400 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-emerald shadow-neon-emerald" /> X (Solid)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-brand-indigo" /> Telegram (Dashed)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full ring-2 ring-brand-amber bg-amber-950/40" /> Bridge Account</span>
            </div>
          </div>

          {/* SVG Graph View */}
          <div className="w-full h-[420px] relative flex items-center justify-center bg-[#0C0E17]/90 rounded-xl border border-borderline my-2 shadow-inner overflow-hidden">
            {graphData && graphData.nodes && graphData.nodes.length > 0 ? (
              <svg className="w-full h-full" viewBox="0 0 840 640">
                {/* Concentric radar reference circles */}
                <circle cx="420" cy="320" r="260" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />
                <circle cx="420" cy="320" r="160" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />
                <circle cx="420" cy="320" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4,4" />

                {/* Radar Axis Crosshairs */}
                <line x1="420" y1="40" x2="420" y2="600" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="140" y1="320" x2="700" y2="320" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2,2" />

                {/* Edges */}
                {graphData.edges.map((edge) => {
                  const srcNode = graphData.nodes.find((n) => n.id === edge.source);
                  const tgtNode = graphData.nodes.find((n) => n.id === edge.target);
                  if (!srcNode || !tgtNode) return null;

                  return (
                    <line
                      key={edge.id}
                      x1={srcNode.position.x}
                      y1={srcNode.position.y}
                      x2={tgtNode.position.x}
                      y2={tgtNode.position.y}
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth={edge.style?.strokeWidth || 1.5}
                      strokeDasharray={edge.style?.strokeDasharray}
                      opacity={0.65}
                    />
                  );
                })}

                {/* Nodes */}
                {graphData.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const radius = Math.max(10, Math.min(26, (node.data.influence_score / 100) * 20 + 8));

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer transition-transform hover:scale-110"
                    >
                      {/* Bridge Account Outer Ring */}
                      {node.data.is_bridge && (
                        <circle
                          cx={node.position.x}
                          cy={node.position.y}
                          r={radius + 6}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="2.5"
                          strokeDasharray="4,3"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.position.x}
                        cy={node.position.y}
                        r={radius}
                        fill={node.data.community_color || '#3B82F6'}
                        stroke={isSelected ? '#F8FAFC' : node.data.platform === 'Telegram' ? '#6366F1' : '#12151F'}
                        strokeWidth={isSelected ? '3.5' : '1.5'}
                        style={{ filter: isSelected ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' : 'none' }}
                      />

                      {/* Author Label */}
                      <text
                        x={node.position.x}
                        y={node.position.y + radius + 12}
                        textAnchor="middle"
                        fill="#F1F5F9"
                        fontSize="9.5"
                        fontFamily="JetBrains Mono"
                        fontWeight="700"
                      >
                        {node.data.author_name ? node.data.author_name.split(' ')[0] : node.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="font-mono text-xs text-charcoal-400">Awaiting network propagation telemetry...</div>
            )}
          </div>

          {/* Clean Network Timeline Bar */}
          <div className="border-t border-borderline pt-3 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-charcoal-400 font-bold uppercase">NETWORK TIMELINE:</span>
              <span className="text-brand-emerald font-bold">PROPAGATION TRACE</span>
            </div>

            <div className="flex items-center gap-1 bg-card p-1 rounded-xl border border-borderline">
              {replayState?.is_running ? (
                <button onClick={pauseReplay} className="p-2 text-brand-crimson hover:bg-white/10 rounded-lg">
                  <Pause className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button onClick={startReplay} className="p-2 text-brand-emerald hover:bg-white/10 rounded-lg font-bold">
                  <Play className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={stepTick} className="p-2 hover:bg-white/10 text-charcoal-400 hover:text-white rounded-lg">
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button onClick={resetReplay} className="p-2 hover:bg-white/10 text-charcoal-400 hover:text-brand-crimson rounded-lg">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Supporting Panel: Node Inspector / Community Clusters */}
        <div className="space-y-4">
          {/* Selected Node Inspector */}
          <div className="glass-panel p-5 rounded-2xl shadow-glass space-y-3">
            <div className="pb-2 border-b border-borderline flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-charcoal-950">Account Inspector</h3>
              <Share2 className="w-4 h-4 text-charcoal-400" />
            </div>
            {selectedNode ? (
              <div className="space-y-2.5 font-mono text-xs">
                <div className="font-display font-bold text-charcoal-950 text-base">{selectedNode.data.author_name || selectedNode.id}</div>
                <div className="text-charcoal-400 font-medium">ID: {selectedNode.data.author_id || selectedNode.id}</div>
                <div className="text-charcoal-400 font-medium">Platform: {selectedNode.data.platform || 'X'}</div>
                <div className="text-charcoal-400 font-medium">Community: {selectedNode.data.community || 'General'}</div>
                <div className="flex justify-between border-t border-borderline pt-2">
                  <span className="text-charcoal-400 font-semibold">Influence Score:</span>
                  <span className="text-brand-emerald font-bold text-sm">{selectedNode.data.influence_score}</span>
                </div>
                {selectedNode.data.is_bridge && (
                  <div className="text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 text-[11px] font-bold shadow-sm">
                    Bridge Node connecting distinct community clusters.
                  </div>
                )}
              </div>
            ) : (
              <div className="font-mono text-xs text-charcoal-400 py-6 bg-pearl/40 rounded-xl border border-dashed border-borderline text-center">
                Click any node on the radar to inspect influence metrics.
              </div>
            )}
          </div>

          {/* Communities Summary */}
          <div className="glass-panel p-5 rounded-2xl shadow-glass space-y-3">
            <div className="pb-2 border-b border-borderline">
              <h3 className="font-display font-bold text-lg text-charcoal-950">Louvain Clusters</h3>
            </div>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {communities.map((comm) => (
                <div key={comm.community_id} className="bg-card p-2.5 rounded-xl border border-borderline text-xs font-mono shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: comm.color }} />
                    <span className="text-charcoal-950 font-bold">Cluster #{comm.community_id + 1}</span>
                    <span className="text-charcoal-400 ml-auto font-semibold">{comm.member_count} accounts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
