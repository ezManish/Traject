import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import type { NetworkGraphData } from '../api/client';
import { Play, Pause, SkipForward, RotateCcw, Share2, Compass, Radio } from 'lucide-react';

export const NetworkGraph: React.FC = () => {
  const {
    activeTopic,
    trends,
    replayState,
    startReplay,
    pauseReplay,
    resetReplay,
    stepTick
  } = useTrajectStore();

  const [graphData, setGraphData] = useState<NetworkGraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [communities, setCommunities] = useState<any[]>([]);

  const currentTrend = trends.find((t) => t.topic === activeTopic);

  useEffect(() => {
    if (activeTopic) {
      api.getTopicNetwork(activeTopic).then(setGraphData).catch(console.error);
      api.getTopicCommunities(activeTopic).then(setCommunities).catch(console.error);
    }
  }, [activeTopic, currentTrend?.tick]);

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
          <p className="text-charcoal-600 text-sm mt-1 font-body">
            Community clusters, influence propagation pathways, and cross-platform bridge nodes.
          </p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-charcoal-700 bg-white/90 px-4 py-2 rounded-xl border border-borderline shadow-sm">
          <span>NODES: <strong className="text-charcoal-950">{graphData?.stats.total_nodes || 0}</strong></span>
          <span>·</span>
          <span>EDGES: <strong className="text-charcoal-950">{graphData?.stats.total_edges || 0}</strong></span>
          <span>·</span>
          <span>CLUSTERS: <strong className="text-brand-amber font-bold">{graphData?.stats.communities_count || 0}</strong></span>
        </div>
      </div>

      {/* Dominant Panel: Interactive Graph Canvas + Scrubber */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-panel rounded-2xl p-5 relative min-h-[540px] overflow-hidden flex flex-col justify-between shadow-glass">
          <div className="flex items-center justify-between z-10 font-mono text-xs pb-3 border-b border-borderline">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-amber" />
              <span className="text-charcoal-950 font-bold">NETWORKX DIRECTED TOPOLOGY</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-charcoal-700 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-charcoal-900 border border-charcoal-950" /> X (Solid)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-brand-indigo" /> Telegram (Dashed)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full ring-2 ring-brand-amber bg-amber-100" /> Bridge Account</span>
            </div>
          </div>

          {/* SVG Graph View */}
          <div className="w-full h-[400px] relative flex items-center justify-center bg-pearl/60 rounded-xl border border-borderline my-2 shadow-inner overflow-hidden">
            {graphData && graphData.nodes.length > 0 ? (
              <svg className="w-full h-full" viewBox="150 100 600 450">
                {/* Concentric radar reference circles */}
                <circle cx="450" cy="325" r="180" fill="none" stroke="#D5CFC5" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="450" cy="325" r="100" fill="none" stroke="#D5CFC5" strokeWidth="1" strokeDasharray="3,3" />

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
                      stroke="#8C8478"
                      strokeWidth={edge.style.strokeWidth || 1.5}
                      strokeDasharray={edge.style.strokeDasharray}
                      opacity={0.7}
                    />
                  );
                })}

                {/* Nodes */}
                {graphData.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const radius = Math.max(10, Math.min(26, (node.data.influence_score / 100) * 22 + 8));

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
                          stroke="#C98A0C"
                          strokeWidth="2"
                          strokeDasharray="4,3"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.position.x}
                        cy={node.position.y}
                        r={radius}
                        fill={node.data.community_color}
                        stroke={node.data.platform === 'Telegram' ? '#3B5BDB' : '#0F0E0D'}
                        strokeWidth={isSelected ? '3' : '1.5'}
                      />

                      {/* Author Label */}
                      <text
                        x={node.position.x}
                        y={node.position.y + radius + 12}
                        textAnchor="middle"
                        fill="#1A1816"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                        fontWeight="700"
                      >
                        {node.data.author_name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="font-mono text-xs text-charcoal-400">Awaiting network propagation telemetry...</div>
            )}
          </div>

          {/* Time Scrubber */}
          <div className="border-t border-borderline pt-3 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-charcoal-500 font-bold uppercase">REPLAY SCRUBBER:</span>
              <span className="text-brand-amber font-bold">TICK {replayState?.current_tick || 0} OF {replayState?.total_ticks || 10}</span>
            </div>

            <div className="flex items-center gap-1 bg-pearl p-1 rounded-xl border border-borderline">
              {replayState?.is_running ? (
                <button onClick={pauseReplay} className="p-2 hover:text-brand-crimson text-charcoal-950">
                  <Pause className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button onClick={startReplay} className="p-2 hover:text-brand-amber text-charcoal-950 font-bold">
                  <Play className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={stepTick} className="p-2 hover:text-charcoal-950 text-charcoal-700">
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button onClick={resetReplay} className="p-2 hover:text-brand-crimson text-charcoal-400">
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
                <div className="font-display font-bold text-charcoal-950 text-base">{selectedNode.data.author_name}</div>
                <div className="text-charcoal-600 font-medium">ID: {selectedNode.data.author_id}</div>
                <div className="text-charcoal-600 font-medium">Platform: {selectedNode.data.platform}</div>
                <div className="text-charcoal-600 font-medium">Community: {selectedNode.data.community}</div>
                <div className="flex justify-between border-t border-borderline pt-2">
                  <span className="text-charcoal-500 font-semibold">Influence Score:</span>
                  <span className="text-brand-amber font-bold text-sm">{selectedNode.data.influence_score}</span>
                </div>
                {selectedNode.data.is_bridge && (
                  <div className="text-amber-950 bg-amber-50 p-2.5 rounded-xl border border-amber-300 text-[11px] font-bold shadow-sm">
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
            <div className="space-y-2">
              {communities.map((comm) => (
                <div key={comm.community_id} className="bg-pearl/80 p-2.5 rounded-xl border border-borderline text-xs font-mono shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: comm.color }} />
                    <span className="text-charcoal-950 font-bold">Cluster #{comm.community_id + 1}</span>
                    <span className="text-charcoal-500 ml-auto font-semibold">{comm.member_count} accounts</span>
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
