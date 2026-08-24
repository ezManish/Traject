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
      case 'SEED': return '#8C6B84';
      case 'EMERGING': return '#B4508A';
      case 'EXPANDING': return '#D42E82';
      case 'VIRAL': return '#FF3D97';
      case 'SATURATION': return '#A61E6B';
      case 'DECLINING': return '#6B4A63';
      case 'DORMANT': return '#3A2E39';
      default: return '#8C6B84';
    }
  };

  const currentStageColor = getStageColor(currentTrend?.lifecycle_stage || 'SEED');

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-ink-border pb-4">
        <div>
          <span className="font-mono text-xs text-mauve-600 uppercase tracking-wider block font-medium">
            Screen 2 · Telemetry Breakdown
          </span>
          <h1 className="font-display font-bold text-3xl text-bone tracking-tight mt-1">{activeTopic}</h1>
        </div>
        <div className="text-right font-mono">
          <span className="text-3xl font-bold text-bone">{currentTrend?.trend_score.toFixed(1) || '0.0'}</span>
          <span className="block text-[10px] text-mauve-600 uppercase tracking-wider">Composite Trend Score</span>
        </div>
      </div>

      {/* Dominant Panel: Heat-Trace Score Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-ink-surface border border-ink-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-xl text-bone">Trend Score & Velocity Heat Trace</h2>
              <p className="text-mauve-400 text-xs mt-0.5">Chronological score trajectory colored by lifecycle stage intensity</p>
            </div>
            <span className="font-mono text-xs text-mauve-600">RECHARTS SEISMOGRAPH</span>
          </div>

          <div className="h-72 w-full pt-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="heatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentStageColor} stopOpacity={0.85} />
                      <stop offset="95%" stopColor="#150F18" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="tick" stroke="#7C6B7E" fontSize={11} fontFamily="IBM Plex Mono" />
                  <YAxis domain={[0, 100]} stroke="#7C6B7E" fontSize={11} fontFamily="IBM Plex Mono" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F1722',
                      borderColor: '#3A2C3F',
                      fontFamily: 'IBM Plex Mono',
                      fontSize: '12px',
                      borderRadius: '4px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={currentStageColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#heatGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center font-mono text-xs text-mauve-600">
                Awaiting historical tick telemetry...
              </div>
            )}
          </div>
        </div>

        {/* 6-Factor Deterministic Breakdown Stack */}
        <div className="bg-ink-surface border border-ink-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-bone">6-Factor Formula Stack</h2>
            <Info className="w-4 h-4 text-mauve-600" />
          </div>
          <span className="font-mono text-[10px] text-mauve-600 block">
            TS = 0.25·Vol + 0.20·Eng + 0.20·Acc + 0.15·Anom + 0.10·Sent + 0.10·Net
          </span>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-mauve-400 mb-1">
                <span>0.25 · Volume Growth</span>
                <span className="text-bone font-semibold">{breakdown.volume_growth.toFixed(1)}</span>
              </div>
              <div className="w-full bg-ink-base h-2 rounded overflow-hidden border border-ink-border">
                <div className="bg-stage-expanding h-full transition-all duration-300" style={{ width: `${breakdown.volume_growth}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-mauve-400 mb-1">
                <span>0.20 · Engagement Velocity</span>
                <span className="text-bone font-semibold">{breakdown.engagement_velocity.toFixed(1)}</span>
              </div>
              <div className="w-full bg-ink-base h-2 rounded overflow-hidden border border-ink-border">
                <div className="bg-stage-viral h-full transition-all duration-300" style={{ width: `${breakdown.engagement_velocity}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-mauve-400 mb-1">
                <span>0.20 · Acceleration</span>
                <span className="text-bone font-semibold">{breakdown.acceleration.toFixed(1)}</span>
              </div>
              <div className="w-full bg-ink-base h-2 rounded overflow-hidden border border-ink-border">
                <div className="bg-stage-emerging h-full transition-all duration-300" style={{ width: `${breakdown.acceleration}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-mauve-400 mb-1">
                <span>0.15 · Anomaly Detection</span>
                <span className="text-bone font-semibold">{breakdown.anomaly.toFixed(1)}</span>
              </div>
              <div className="w-full bg-ink-base h-2 rounded overflow-hidden border border-ink-border">
                <div className="bg-evidence h-full transition-all duration-300" style={{ width: `${breakdown.anomaly}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-mauve-400 mb-1">
                <span>0.10 · Sentiment Shift</span>
                <span className="text-bone font-semibold">{breakdown.sentiment_shift.toFixed(1)}</span>
              </div>
              <div className="w-full bg-ink-base h-2 rounded overflow-hidden border border-ink-border">
                <div className="bg-stage-saturation h-full transition-all duration-300" style={{ width: `${breakdown.sentiment_shift}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-mauve-400 mb-1">
                <span>0.10 · Network Propagation</span>
                <span className="text-bone font-semibold">{breakdown.network_propagation.toFixed(1)}</span>
              </div>
              <div className="w-full bg-ink-base h-2 rounded overflow-hidden border border-ink-border">
                <div className="bg-calm h-full transition-all duration-300" style={{ width: `${breakdown.network_propagation}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supporting Panel: Tri-Color Sentiment & Emotion Spectrum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tri-Color Sentiment Gauge (TRAJECT_DESIGN.md §8) */}
        <div className="bg-ink-surface border border-ink-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-bone">Sentiment Temperature</h2>
            <span className="font-mono text-[10px] text-mauve-600">TRI-COLOR PALETTE</span>
          </div>

          {activeTopicSentiment ? (
            <div className="space-y-4">
              {/* Tri-color Stacked Bar */}
              <div className="w-full h-4 rounded overflow-hidden flex bg-ink-base border border-ink-border">
                <div
                  style={{ width: `${activeTopicSentiment.sentiment_percentages.negative}%` }}
                  className="bg-stage-viral"
                  title={`Negative: ${activeTopicSentiment.sentiment_percentages.negative}%`}
                />
                <div
                  style={{ width: `${activeTopicSentiment.sentiment_percentages.neutral}%` }}
                  className="bg-mauve-400"
                  title={`Neutral: ${activeTopicSentiment.sentiment_percentages.neutral}%`}
                />
                <div
                  style={{ width: `${activeTopicSentiment.sentiment_percentages.positive}%` }}
                  className="bg-calm"
                  title={`Positive: ${activeTopicSentiment.sentiment_percentages.positive}%`}
                />
              </div>

              {/* Legend & Percentages */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                <div className="bg-ink-base p-2 rounded border border-ink-border">
                  <span className="text-stage-viral font-semibold block">{activeTopicSentiment.sentiment_percentages.negative}%</span>
                  <span className="text-mauve-600 text-[10px]">Negative (Hot)</span>
                </div>
                <div className="bg-ink-base p-2 rounded border border-ink-border">
                  <span className="text-mauve-400 font-semibold block">{activeTopicSentiment.sentiment_percentages.neutral}%</span>
                  <span className="text-mauve-600 text-[10px]">Neutral</span>
                </div>
                <div className="bg-ink-base p-2 rounded border border-ink-border">
                  <span className="text-calm font-semibold block">{activeTopicSentiment.sentiment_percentages.positive}%</span>
                  <span className="text-mauve-600 text-[10px]">Positive (Calm)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="font-mono text-xs text-mauve-600 py-6 text-center">Calibrating sentiment telemetry...</div>
          )}
        </div>

        {/* Emotion Spectrum */}
        <div className="bg-ink-surface border border-ink-border p-6 rounded space-y-4">
          <h2 className="font-display font-semibold text-lg text-bone">Emotion Spectrum</h2>
          <span className="font-mono text-[10px] text-mauve-600 block">Classified fine-grained affective states</span>

          <div className="flex flex-wrap gap-2 pt-2">
            {activeTopicSentiment?.emotion_breakdown ? (
              Object.entries(activeTopicSentiment.emotion_breakdown).map(([emotion, count]: [string, any]) => (
                <div
                  key={emotion}
                  className="bg-ink-base border border-ink-border px-3 py-1.5 rounded font-mono text-xs flex items-center gap-2"
                >
                  <span className="text-bone capitalize">{emotion}</span>
                  <span className="text-evidence font-semibold">{count}</span>
                </div>
              ))
            ) : (
              <div className="font-mono text-xs text-mauve-600">Awaiting affective tags...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
