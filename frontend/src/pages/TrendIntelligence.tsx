import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, BarChart2, Activity } from 'lucide-react';

export const TrendIntelligence: React.FC = () => {
  const { activeTopic, trends, activeTrendHistory, activeTopicSentiment } = useTrajectStore();
  const currentTrend = trends.find((t) => t.topic === activeTopic) || trends[0];

  const breakdown = currentTrend?.breakdown || {
    volume_growth: 0,
    engagement_velocity: 0,
    acceleration: 0,
    anomaly: 0,
    sentiment_shift: 0,
    network_propagation: 0,
    composite_score: 0,
  };

  const chartData = activeTrendHistory.map((h) => ({
    tick: `Tick ${h.tick}`,
    score: h.composite_score,
    volume: h.volume_growth,
    engagement: h.engagement_velocity,
    stage: h.lifecycle_stage,
  }));

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'SEED': return '#5C564E';
      case 'EMERGING': return '#2F9E44';
      case 'EXPANDING': return '#E67700';
      case 'VIRAL': return '#E03131';
      case 'SATURATION': return '#9C36B5';
      case 'DECLINING': return '#5C564E';
      default: return '#5C564E';
    }
  };

  const currentStageColor = getStageColor(currentTrend?.lifecycle_stage || 'SEED');

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-borderline pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-brand-amber font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>MATHEMATICAL TELEMETRY STUDIO</span>
            <span>/</span>
            <span>6-FACTOR DETERMINISTIC DECK</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-charcoal-950 tracking-tight mt-1">{activeTopic}</h1>
        </div>
        <div className="text-right font-mono bg-white/90 px-5 py-2.5 rounded-2xl border border-borderline shadow-glass">
          <span className="text-3xl font-bold text-charcoal-950">{currentTrend?.trend_score.toFixed(1) || '0.0'}</span>
          <span className="block text-[10px] text-charcoal-500 uppercase tracking-wider font-bold">Composite Trend Score</span>
        </div>
      </div>

      {/* Dominant Panel: Heat-Trace Score Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <div>
              <h2 className="font-display font-bold text-2xl text-charcoal-950">Trend Velocity & Trajectory Trace</h2>
              <p className="text-charcoal-500 text-xs mt-0.5 font-body">Chronological score trajectory colored by lifecycle stage intensity</p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-charcoal-600 font-bold bg-pearl px-3 py-1.5 rounded-lg border border-borderline">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>SEISMOGRAPH STUDIO</span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="lightHeatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentStageColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FBFBFA" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="tick" stroke="#8C8478" fontSize={11} fontFamily="IBM Plex Mono" />
                  <YAxis domain={[0, 100]} stroke="#8C8478" fontSize={11} fontFamily="IBM Plex Mono" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: 'rgba(25, 23, 21, 0.08)',
                      color: '#1A1816',
                      fontFamily: 'IBM Plex Mono',
                      fontSize: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={currentStageColor}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#lightHeatGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-xs text-charcoal-400 bg-pearl/40 rounded-xl border border-dashed border-borderline">
                Awaiting historical tick telemetry...
              </div>
            )}
          </div>
        </div>

        {/* 6-Factor Deterministic Breakdown Stack */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <h2 className="font-display font-bold text-xl text-charcoal-950">6-Factor Formula Stack</h2>
            <Info className="w-4 h-4 text-charcoal-400" />
          </div>
          <span className="font-mono text-[10px] text-charcoal-600 font-bold block bg-pearl p-2.5 rounded-lg border border-borderline">
            TS = 0.25·Vol + 0.20·Eng + 0.20·Acc + 0.15·Anom + 0.10·Sent + 0.10·Net
          </span>

          <div className="space-y-3 font-mono text-xs pt-1">
            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span className="font-semibold">0.25 · Volume Growth</span>
                <span className="text-charcoal-950 font-bold">{breakdown.volume_growth.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-amber h-full transition-all duration-300" style={{ width: `${breakdown.volume_growth}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span className="font-semibold">0.20 · Engagement Velocity</span>
                <span className="text-charcoal-950 font-bold">{breakdown.engagement_velocity.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-crimson h-full transition-all duration-300" style={{ width: `${breakdown.engagement_velocity}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span className="font-semibold">0.20 · Acceleration</span>
                <span className="text-charcoal-950 font-bold">{breakdown.acceleration.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-emerald h-full transition-all duration-300" style={{ width: `${breakdown.acceleration}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span className="font-semibold">0.15 · Anomaly Detection</span>
                <span className="text-charcoal-950 font-bold">{breakdown.anomaly.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-gold h-full transition-all duration-300" style={{ width: `${breakdown.anomaly}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span className="font-semibold">0.10 · Sentiment Shift</span>
                <span className="text-charcoal-950 font-bold">{breakdown.sentiment_shift.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-indigo h-full transition-all duration-300" style={{ width: `${breakdown.sentiment_shift}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span className="font-semibold">0.10 · Network Propagation</span>
                <span className="text-charcoal-950 font-bold">{breakdown.network_propagation.toFixed(1)}</span>
              </div>
              <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                <div className="bg-brand-cyan h-full transition-all duration-300" style={{ width: `${breakdown.network_propagation}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supporting Panel: Tri-Color Sentiment & Emotion Spectrum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tri-Color Sentiment Gauge */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <h2 className="font-display font-bold text-xl text-charcoal-950">Sentiment Temperature</h2>
            <span className="font-mono text-[10px] text-charcoal-500 font-bold bg-pearl px-2.5 py-1 rounded-md border border-borderline">TRI-COLOR PALETTE</span>
          </div>

          {activeTopicSentiment ? (
            <div className="space-y-4">
              {/* Tri-color Stacked Bar */}
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-pearl border border-borderline shadow-inner">
                <div
                  style={{ width: `${activeTopicSentiment.sentiment_percentages.negative}%` }}
                  className="bg-brand-crimson"
                  title={`Negative: ${activeTopicSentiment.sentiment_percentages.negative}%`}
                />
                <div
                  style={{ width: `${activeTopicSentiment.sentiment_percentages.neutral}%` }}
                  className="bg-charcoal-400"
                  title={`Neutral: ${activeTopicSentiment.sentiment_percentages.neutral}%`}
                />
                <div
                  style={{ width: `${activeTopicSentiment.sentiment_percentages.positive}%` }}
                  className="bg-brand-emerald"
                  title={`Positive: ${activeTopicSentiment.sentiment_percentages.positive}%`}
                />
              </div>

              {/* Legend & Percentages */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
                <div className="bg-pearl/80 p-3 rounded-xl border border-borderline shadow-sm">
                  <span className="text-brand-crimson font-bold text-sm block">{activeTopicSentiment.sentiment_percentages.negative}%</span>
                  <span className="text-charcoal-500 text-[10px] font-semibold">Negative (Agitated)</span>
                </div>
                <div className="bg-pearl/80 p-3 rounded-xl border border-borderline shadow-sm">
                  <span className="text-charcoal-700 font-bold text-sm block">{activeTopicSentiment.sentiment_percentages.neutral}%</span>
                  <span className="text-charcoal-500 text-[10px] font-semibold">Neutral</span>
                </div>
                <div className="bg-pearl/80 p-3 rounded-xl border border-borderline shadow-sm">
                  <span className="text-brand-emerald font-bold text-sm block">{activeTopicSentiment.sentiment_percentages.positive}%</span>
                  <span className="text-charcoal-500 text-[10px] font-semibold">Positive (Calm)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs text-charcoal-400 py-6 text-center bg-pearl/40 rounded-xl border border-dashed border-borderline">
              Calibrating sentiment telemetry...
            </div>
          )}
        </div>

        {/* Emotion Spectrum */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="pb-3 border-b border-borderline">
            <h2 className="font-display font-bold text-xl text-charcoal-950">Emotion Spectrum</h2>
            <span className="font-mono text-[10px] text-charcoal-500 font-semibold block mt-0.5">Classified fine-grained affective states</span>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {activeTopicSentiment?.emotion_breakdown ? (
              Object.entries(activeTopicSentiment.emotion_breakdown).map(([emotion, count]: [string, any]) => (
                <div
                  key={emotion}
                  className="bg-pearl/80 border border-borderline px-3.5 py-2 rounded-xl font-mono text-xs flex items-center gap-2 shadow-sm"
                >
                  <span className="text-charcoal-950 capitalize font-bold">{emotion}</span>
                  <span className="text-brand-amber font-bold bg-white px-2 py-0.5 rounded-md border border-borderline">{count}</span>
                </div>
              ))
            ) : (
              <div className="font-mono text-xs text-charcoal-400 py-6 text-center w-full bg-pearl/40 rounded-xl border border-dashed border-borderline">
                Awaiting affective tags...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
