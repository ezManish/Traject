import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

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
      case 'SEED': return '#6C6358';
      case 'EMERGING': return '#2B8A3E';
      case 'EXPANDING': return '#C25E00';
      case 'VIRAL': return '#C92A2A';
      case 'SATURATION': return '#862E9C';
      case 'DECLINING': return '#5C564E';
      default: return '#6C6358';
    }
  };

  const currentStageColor = getStageColor(currentTrend?.lifecycle_stage || 'SEED');

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-hairline pb-4">
        <div>
          <span className="font-mono text-xs text-charcoal-500 uppercase tracking-wider block font-semibold">
            Console 02 / Telemetry Breakdown
          </span>
          <h1 className="font-display font-bold text-3xl text-charcoal-900 tracking-tight mt-1">{activeTopic}</h1>
        </div>
        <div className="text-right font-mono">
          <span className="text-3xl font-bold text-charcoal-900">{currentTrend?.trend_score.toFixed(1) || '0.0'}</span>
          <span className="block text-[10px] text-charcoal-500 uppercase tracking-wider font-semibold">Composite Trend Score</span>
        </div>
      </div>

      {/* Dominant Panel: Heat-Trace Score Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-hairline">
            <div>
              <h2 className="font-display font-semibold text-xl text-charcoal-900">Trend Score & Velocity Heat Trace</h2>
              <p className="text-charcoal-500 text-xs mt-0.5">Chronological score trajectory colored by lifecycle stage intensity</p>
            </div>
            <span className="font-mono text-xs text-charcoal-400 font-semibold">RECHARTS SEISMOGRAPH</span>
          </div>

          <div className="h-72 w-full pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="lightHeatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentStageColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F7F5F0" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="tick" stroke="#8C8479" fontSize={11} fontFamily="IBM Plex Mono" />
                  <YAxis domain={[0, 100]} stroke="#8C8479" fontSize={11} fontFamily="IBM Plex Mono" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2DDD5',
                      color: '#191715',
                      fontFamily: 'IBM Plex Mono',
                      fontSize: '12px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={currentStageColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#lightHeatGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-xs text-charcoal-400 bg-subtle/30 rounded border border-dashed border-hairline">
                Awaiting historical tick telemetry...
              </div>
            )}
          </div>
        </div>

        {/* 6-Factor Deterministic Breakdown Stack */}
        <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-hairline">
            <h2 className="font-display font-semibold text-lg text-charcoal-900">6-Factor Formula Stack</h2>
            <Info className="w-4 h-4 text-charcoal-400" />
          </div>
          <span className="font-mono text-[10px] text-charcoal-500 font-semibold block">
            TS = 0.25·Vol + 0.20·Eng + 0.20·Acc + 0.15·Anom + 0.10·Sent + 0.10·Net
          </span>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span>0.25 · Volume Growth</span>
                <span className="text-charcoal-900 font-bold">{breakdown.volume_growth.toFixed(1)}</span>
              </div>
              <div className="w-full bg-subtle h-2 rounded overflow-hidden border border-hairline">
                <div className="bg-signal-expanding h-full transition-all duration-300" style={{ width: `${breakdown.volume_growth}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span>0.20 · Engagement Velocity</span>
                <span className="text-charcoal-900 font-bold">{breakdown.engagement_velocity.toFixed(1)}</span>
              </div>
              <div className="w-full bg-subtle h-2 rounded overflow-hidden border border-hairline">
                <div className="bg-signal-viral h-full transition-all duration-300" style={{ width: `${breakdown.engagement_velocity}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span>0.20 · Acceleration</span>
                <span className="text-charcoal-900 font-bold">{breakdown.acceleration.toFixed(1)}</span>
              </div>
              <div className="w-full bg-subtle h-2 rounded overflow-hidden border border-hairline">
                <div className="bg-signal-emerging h-full transition-all duration-300" style={{ width: `${breakdown.acceleration}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span>0.15 · Anomaly Detection</span>
                <span className="text-charcoal-900 font-bold">{breakdown.anomaly.toFixed(1)}</span>
              </div>
              <div className="w-full bg-subtle h-2 rounded overflow-hidden border border-hairline">
                <div className="bg-signal-gold h-full transition-all duration-300" style={{ width: `${breakdown.anomaly}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span>0.10 · Sentiment Shift</span>
                <span className="text-charcoal-900 font-bold">{breakdown.sentiment_shift.toFixed(1)}</span>
              </div>
              <div className="w-full bg-subtle h-2 rounded overflow-hidden border border-hairline">
                <div className="bg-signal-saturation h-full transition-all duration-300" style={{ width: `${breakdown.sentiment_shift}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-charcoal-700 mb-1">
                <span>0.10 · Network Propagation</span>
                <span className="text-charcoal-900 font-bold">{breakdown.network_propagation.toFixed(1)}</span>
              </div>
              <div className="w-full bg-subtle h-2 rounded overflow-hidden border border-hairline">
                <div className="bg-signal-teal h-full transition-all duration-300" style={{ width: `${breakdown.network_propagation}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supporting Panel: Tri-Color Sentiment & Emotion Spectrum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tri-Color Sentiment Gauge */}
        <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-hairline">
            <h2 className="font-display font-semibold text-lg text-charcoal-900">Sentiment Temperature</h2>
            <span className="font-mono text-[10px] text-charcoal-500 font-semibold">TRI-COLOR PALETTE</span>
          </div>

          {activeTopicSentiment ? (
            <div className="space-y-4">
              {/* Tri-color Stacked Bar */}
              <div className="w-full h-4 rounded overflow-hidden flex bg-subtle border border-hairline">
                <div
                  style={{ width: `${activeTopicSentiment.sentiment_percentages.negative}%` }}
                  className="bg-signal-viral"
                  title={`Negative: ${activeTopicSentiment.sentiment_percentages.negative}%`}
                />
                <div
                  style={{ width: `${activeTopicSentiment.sentiment_percentages.neutral}%` }}
                  className="bg-charcoal-400"
                  title={`Neutral: ${activeTopicSentiment.sentiment_percentages.neutral}%`}
                />
                <div
                  style={{ width: `${activeTopicSentiment.sentiment_percentages.positive}%` }}
                  className="bg-signal-teal"
                  title={`Positive: ${activeTopicSentiment.sentiment_percentages.positive}%`}
                />
              </div>

              {/* Legend & Percentages */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                <div className="bg-subtle p-2 rounded border border-hairline">
                  <span className="text-signal-viral font-bold block">{activeTopicSentiment.sentiment_percentages.negative}%</span>
                  <span className="text-charcoal-500 text-[10px]">Negative (Agitated)</span>
                </div>
                <div className="bg-subtle p-2 rounded border border-hairline">
                  <span className="text-charcoal-700 font-bold block">{activeTopicSentiment.sentiment_percentages.neutral}%</span>
                  <span className="text-charcoal-500 text-[10px]">Neutral</span>
                </div>
                <div className="bg-subtle p-2 rounded border border-hairline">
                  <span className="text-signal-teal font-bold block">{activeTopicSentiment.sentiment_percentages.positive}%</span>
                  <span className="text-charcoal-500 text-[10px]">Positive (Calm)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs text-charcoal-400 py-6 text-center bg-subtle/30 rounded border border-dashed border-hairline">
              Calibrating sentiment telemetry...
            </div>
          )}
        </div>

        {/* Emotion Spectrum */}
        <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
          <div className="pb-2 border-b border-hairline">
            <h2 className="font-display font-semibold text-lg text-charcoal-900">Emotion Spectrum</h2>
            <span className="font-mono text-[10px] text-charcoal-500 font-semibold block">Classified fine-grained affective states</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {activeTopicSentiment?.emotion_breakdown ? (
              Object.entries(activeTopicSentiment.emotion_breakdown).map(([emotion, count]: [string, any]) => (
                <div
                  key={emotion}
                  className="bg-subtle border border-hairline px-3 py-1.5 rounded font-mono text-xs flex items-center gap-2"
                >
                  <span className="text-charcoal-900 capitalize font-medium">{emotion}</span>
                  <span className="text-signal-gold font-bold">{count}</span>
                </div>
              ))
            ) : (
              <div className="font-mono text-xs text-charcoal-400 py-6 text-center w-full bg-subtle/30 rounded border border-dashed border-hairline">
                Awaiting affective tags...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
