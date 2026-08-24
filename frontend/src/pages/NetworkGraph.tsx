import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import type { NetworkGraphData } from '../api/client';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

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
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-hairline pb-4">
        <div>
          <span className="font-mono text-xs text-charcoal-500 uppercase tracking-wider block font-semibold">
            Console 04 / Network Telemetry & Propagation
          </span>
          <h1 className="font-display font-bold text-3xl text-charcoal-900 tracking-tight mt-1">Information & Network Graph</h1>
          <p className="text-charcoal-500 text-sm mt-1">
            Community clusters, influence propagation pathways, and cross-platform bridge nodes.
          </p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-charcoal-500">
          <span>NODES: <strong className="text-charcoal-900">{graphData?.stats.total_nodes || 0}</strong></span>
          <span>·</span>
          <span>EDGES: <strong className="text-charcoal-900">{graphData?.stats.total_edges || 0}</strong></span>
          <span>·</span>
          <span>CLUSTERS: <strong className="text-signal-gold">{graphData?.stats.communities_count || 0}</strong></span>
        </div>
      </div>

      {/* Dominant Panel: Interactive Graph Canvas + Scrubber */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-surface border border-hairline rounded p-4 relative min-h-[520px] overflow-hidden flex flex-col justify-between shadow-subtle">
          <div className="flex items-center justify-between z-10 font-mono text-xs pb-2 border-b border-hairline">
            <span className="text-charcoal-500 font-semibold">CANVAS · NETWORKX DIRECTED TOPOLOGY</span>
            <div className="flex items-center gap-3 text-[11px] text-charcoal-700">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-charcoal-900 bg-charcoal-900" /> X (Solid)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-[#4A7FA6]" /> Telegram (Dashed)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full ring-2 ring-signal-gold" /> Bridge Account</span>
            </div>
          </div>

          {/* SVG Graph View */}
          <div className="w-full h-[400px] relative flex items-center justify-center bg-canvas/50 rounded border border-hairline my-2">
            {graphData && graphData.nodes.length > 0 ? (
              <svg className="w-full h-full" viewBox="150 100 600 450">
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
                      stroke="#8C8479"
                      strokeWidth={edge.style.strokeWidth || 1.5}
                      strokeDasharray={edge.style.strokeDasharray}
                      opacity={0.65}
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
                          r={radius + 5}
                          fill="none"
                          stroke="#975A16"
                          strokeWidth="2"
                          strokeDasharray="3,3"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.position.x}
                        cy={node.position.y}
                        r={radius}
                        fill={node.data.community_color}
                        stroke={node.data.platform === 'Telegram' ? '#4A7FA6' : '#191715'}
                        strokeWidth={isSelected ? '3' : '1.5'}
                      />

                      {/* Author Label */}
                      <text
                        x={node.position.x}
                        y={node.position.y + radius + 12}
                        textAnchor="middle"
                        fill="#3D3833"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                        fontWeight="600"
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
          <div className="border-t border-hairline pt-3 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-charcoal-500 font-medium">SCRUBBER:</span>
              <span className="text-signal-gold font-bold">TICK {replayState?.current_tick || 0} OF {replayState?.total_ticks || 10}</span>
            </div>

            <div className="flex items-center gap-1 bg-subtle p-1 rounded border border-hairline">
              {replayState?.is_running ? (
                <button onClick={pauseReplay} className="p-1 hover:text-signal-viral text-charcoal-900">
                  <Pause className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button onClick={startReplay} className="p-1 hover:text-signal-expanding text-charcoal-900 font-bold">
                  <Play className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={stepTick} className="p-1 hover:text-charcoal-900 text-charcoal-700">
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button onClick={resetReplay} className="p-1 hover:text-signal-viral text-charcoal-500">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Supporting Panel: Node Inspector / Community Clusters */}
        <div className="space-y-4">
          {/* Selected Node Inspector */}
          <div className="bg-surface border border-hairline p-4 rounded shadow-subtle space-y-3">
            <div className="pb-2 border-b border-hairline">
              <h3 className="font-display font-semibold text-base text-charcoal-900">Account Inspector</h3>
            </div>
            {selectedNode ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="font-bold text-charcoal-900 text-sm">{selectedNode.data.author_name}</div>
                <div className="text-charcoal-500">ID: {selectedNode.data.author_id}</div>
                <div className="text-charcoal-500">Platform: {selectedNode.data.platform}</div>
                <div className="text-charcoal-500">Community: {selectedNode.data.community}</div>
                <div className="flex justify-between border-t border-hairline pt-2">
                  <span className="text-charcoal-500">Influence Score:</span>
                  <span className="text-signal-expanding font-bold">{selectedNode.data.influence_score}</span>
                </div>
                {selectedNode.data.is_bridge && (
                  <div className="text-amber-900 bg-amber-50 p-2 rounded border border-amber-300 text-[11px] font-medium">
                    Bridge Node connecting distinct community clusters.
                  </div>
                )}
              </div>
            ) : (
              <div className="font-mono text-xs text-charcoal-400 py-4 bg-subtle/30 rounded border border-dashed border-hairline text-center">
                Click any node on the graph to inspect metrics.
              </div>
            )}
          </div>

          {/* Communities Summary */}
          <div className="bg-surface border border-hairline p-4 rounded shadow-subtle space-y-3">
            <div className="pb-2 border-b border-hairline">
              <h3 className="font-display font-semibold text-base text-charcoal-900">Louvain Communities</h3>
            </div>
            <div className="space-y-2">
              {communities.map((comm) => (
                <div key={comm.community_id} className="bg-subtle p-2.5 rounded border border-hairline text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comm.color }} />
                    <span className="text-charcoal-900 font-semibold">Cluster #{comm.community_id + 1}</span>
                    <span className="text-charcoal-500 ml-auto font-medium">{comm.member_count} accounts</span>
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
