import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Activity, Cpu } from 'lucide-react';

export const TrendIntelligence: React.FC = () => {
  const { activeTopic, trends, activeTrendHistory } = useTrajectStore();
  const currentTrend = trends.find((t) => t.topic === activeTopic) || trends[0];

  const breakdown = currentTrend?.breakdown || {
    volume_growth: 0,
    engagement_velocity: 0,
    acceleration: 0,
    anomaly: 0,
    sentiment_shift: 0,
    network_propagation: 0,
    composite_score: 0
  };

  const chartData = activeTrendHistory.map((item) => ({
    tick: `Tick ${item.tick}`,
    score: item.composite_score,
    volume: item.volume_growth,
    velocity: item.engagement_velocity
  }));

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case 'SEED': return 'badge-stage-seed';
      case 'EMERGING': return 'badge-stage-emerging';
      case 'EXPANDING': return 'badge-stage-expanding';
      case 'VIRAL': return 'badge-stage-viral';
      case 'SATURATION': return 'badge-stage-saturation';
      case 'DECLINING': return 'badge-stage-declining';
      default: return 'badge-stage-seed';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-borderline pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-brand-emerald font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>MATHEMATICAL TELEMETRY STUDIO</span>
            <span>/</span>
            <span>6-FACTOR DETERMINISTIC ENGINE</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-charcoal-950 tracking-tight mt-1">Trend Intelligence Studio</h1>
          <p className="text-charcoal-400 text-sm mt-1 font-body">
            Algorithmic scoring, volume growth acceleration, and mathematical factor breakdown for {activeTopic}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-charcoal-400 font-bold uppercase">LIFECYCLE STAGE:</span>
          <span className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase shadow-sm ${getStageBadgeClass(currentTrend?.lifecycle_stage || 'SEED')}`}>
            {currentTrend?.lifecycle_stage || 'SEED'}
          </span>
        </div>
      </div>

      {/* Dominant Visual: Telemetry Graph + Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time-Series Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-emerald" />
              <h2 className="font-display font-bold text-xl text-charcoal-950">Trend Score Trajectory</h2>
            </div>
            <span className="font-mono text-xs text-brand-emerald bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-500/30 font-bold">
              CURRENT SCORE: {currentTrend?.trend_score?.toFixed(1) || 0}
            </span>
          </div>

          <div className="w-full h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradientDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
                <XAxis dataKey="tick" stroke="#64748B" fontSize={11} fontFamily="JetBrains Mono" />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} fontFamily="JetBrains Mono" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12151F',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    color: '#F8FAFC',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradientDark)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6-Factor Formula Breakdown Panel */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-borderline">
              <Cpu className="w-4 h-4 text-brand-emerald" />
              <h2 className="font-display font-bold text-xl text-charcoal-950">6-Factor Formula (TRD §7)</h2>
            </div>
            <p className="font-mono text-[10px] text-charcoal-400 mt-2">
              TS = 0.25·Vol + 0.20·Eng + 0.20·Acc + 0.15·Anom + 0.10·Sent + 0.10·Net
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-charcoal-300">
                <span>Volume Growth (25%)</span>
                <span className="font-bold text-charcoal-950">{breakdown.volume_growth.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-emerald h-full rounded-full" style={{ width: `${Math.min(100, breakdown.volume_growth)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-charcoal-300">
                <span>Engagement Velocity (20%)</span>
                <span className="font-bold text-charcoal-950">{breakdown.engagement_velocity.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-indigo h-full rounded-full" style={{ width: `${Math.min(100, breakdown.engagement_velocity)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-charcoal-300">
                <span>Acceleration (20%)</span>
                <span className="font-bold text-charcoal-950">{breakdown.acceleration.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-amber h-full rounded-full" style={{ width: `${Math.min(100, breakdown.acceleration)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-charcoal-300">
                <span>Anomaly Detection (15%)</span>
                <span className="font-bold text-charcoal-950">{breakdown.anomaly.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-crimson h-full rounded-full" style={{ width: `${Math.min(100, breakdown.anomaly)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-charcoal-300">
                <span>Sentiment Shift (10%)</span>
                <span className="font-bold text-charcoal-950">{breakdown.sentiment_shift.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-emerald h-full rounded-full" style={{ width: `${Math.min(100, breakdown.sentiment_shift)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-charcoal-300">
                <span>Network Propagation (10%)</span>
                <span className="font-bold text-charcoal-950">{breakdown.network_propagation.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-gold h-full rounded-full" style={{ width: `${Math.min(100, breakdown.network_propagation)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
