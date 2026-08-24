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
      <div className="flex items-baseline justify-between border-b border-ink-border pb-4">
        <div>
          <span className="font-mono text-xs text-mauve-600 uppercase tracking-wider block font-medium">
            Screen 4 · Network Telemetry & Propagation
          </span>
          <h1 className="font-display font-bold text-3xl text-bone tracking-tight mt-1">Information & Network Graph</h1>
          <p className="text-mauve-400 text-sm mt-1">
            Community clusters, influence propagation pathways, and cross-platform bridge nodes.
          </p>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-mauve-400">
          <span>NODES: <strong className="text-bone">{graphData?.stats.total_nodes || 0}</strong></span>
          <span>·</span>
          <span>EDGES: <strong className="text-bone">{graphData?.stats.total_edges || 0}</strong></span>
          <span>·</span>
          <span>CLUSTERS: <strong className="text-evidence">{graphData?.stats.communities_count || 0}</strong></span>
        </div>
      </div>

      {/* Dominant Panel: Interactive Graph Canvas + Scrubber */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-ink-surface border border-ink-border rounded p-4 relative min-h-[520px] overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between z-10 font-mono text-xs pb-2 border-b border-ink-border/50">
            <span className="text-mauve-600">CANVAS · NETWORKX DIRECTED TOPOLOGY</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-bone" /> X (Solid)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-[#4A7FA6]" /> Telegram (Dashed)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full ring-2 ring-evidence" /> Bridge Account</span>
            </div>
          </div>

          {/* SVG Graph View */}
          <div className="w-full h-[400px] relative flex items-center justify-center">
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
                      stroke={edge.style.stroke}
                      strokeWidth={edge.style.strokeWidth}
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
                      {/* Bridge Account Outer Ring (Evidence Gold per TRAJECT_DESIGN.md §2.4) */}
                      {node.data.is_bridge && (
                        <circle
                          cx={node.position.x}
                          cy={node.position.y}
                          r={radius + 5}
                          fill="none"
                          stroke="#E3A542"
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
                        stroke={node.data.platform === 'Telegram' ? '#4A7FA6' : '#F4EBF1'}
                        strokeWidth={isSelected ? '3' : '1.5'}
                      />

                      {/* Author Label */}
                      <text
                        x={node.position.x}
                        y={node.position.y + radius + 12}
                        textAnchor="middle"
                        fill="#B7A2B8"
                        fontSize="9"
                        fontFamily="IBM Plex Mono"
                      >
                        {node.data.author_name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="font-mono text-xs text-mauve-600">Awaiting network propagation telemetry...</div>
            )}
          </div>

          {/* Time Scrubber / Replay Control Bar at Bottom (PRD Screen 4) */}
          <div className="border-t border-ink-border pt-3 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-mauve-600">SCRUBBER:</span>
              <span className="text-evidence font-semibold">TICK {replayState?.current_tick || 0} OF {replayState?.total_ticks || 10}</span>
            </div>

            <div className="flex items-center gap-1 bg-ink-base p-1 rounded border border-ink-border">
              {replayState?.is_running ? (
                <button onClick={pauseReplay} className="p-1 hover:text-evidence text-bone">
                  <Pause className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button onClick={startReplay} className="p-1 hover:text-stage-viral text-stage-expanding">
                  <Play className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={stepTick} className="p-1 hover:text-bone text-mauve-400">
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button onClick={resetReplay} className="p-1 hover:text-stage-viral text-mauve-400">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Supporting Panel: Node Inspector / Community Clusters */}
        <div className="space-y-4">
          {/* Selected Node Inspector */}
          <div className="bg-ink-surface border border-ink-border p-4 rounded space-y-3">
            <h3 className="font-display font-semibold text-base text-bone">Account Inspector</h3>
            {selectedNode ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="font-semibold text-bone">{selectedNode.data.author_name}</div>
                <div className="text-mauve-400">ID: {selectedNode.data.author_id}</div>
                <div className="text-mauve-400">Platform: {selectedNode.data.platform}</div>
                <div className="text-mauve-400">Community: {selectedNode.data.community}</div>
                <div className="flex justify-between border-t border-ink-border pt-2">
                  <span className="text-mauve-600">Influence Score:</span>
                  <span className="text-stage-expanding font-bold">{selectedNode.data.influence_score}</span>
                </div>
                {selectedNode.data.is_bridge && (
                  <div className="text-evidence bg-evidence/10 p-2 rounded border border-evidence/40 text-[11px]">
                    Bridge Node connecting distinct community clusters.
                  </div>
                )}
              </div>
            ) : (
              <div className="font-mono text-xs text-mauve-600 py-4">Click any node on the graph to inspect metrics.</div>
            )}
          </div>

          {/* Communities Summary */}
          <div className="bg-ink-surface border border-ink-border p-4 rounded space-y-3">
            <h3 className="font-display font-semibold text-base text-bone">Louvain Communities</h3>
            <div className="space-y-2">
              {communities.map((comm) => (
                <div key={comm.community_id} className="bg-ink-base p-2.5 rounded border border-ink-border text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comm.color }} />
                    <span className="text-bone font-medium">Cluster #{comm.community_id + 1}</span>
                    <span className="text-mauve-600 ml-auto">{comm.member_count} accounts</span>
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
