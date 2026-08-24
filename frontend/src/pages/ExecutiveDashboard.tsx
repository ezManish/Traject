import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { ArrowUpRight, Flame, AlertCircle, Activity, Radio, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExecutiveDashboard: React.FC = () => {
  const { trends, narratives, replayState, activeTopicEvents, setActiveTopic, setActiveTab } = useTrajectStore();

  const totalEvents = replayState?.total_events_in_db || 0;
  const activeNarrativesCount = narratives.length;
  const viralNarrative = trends.find((t) => t.lifecycle_stage === 'VIRAL');
  const mutatedNarrative = narratives.find((n) => n.mutation_detected);
  const weakSignals = narratives.filter((n) => n.is_weak_signal);

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case 'SEED': return 'badge-stage-seed';
      case 'EMERGING': return 'badge-stage-emerging';
      case 'EXPANDING': return 'badge-stage-expanding';
      case 'VIRAL': return 'badge-stage-viral font-bold';
      case 'SATURATION': return 'badge-stage-saturation';
      case 'DECLINING': return 'badge-stage-declining';
      default: return 'badge-stage-seed';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-baseline justify-between border-b border-hairline pb-4">
        <div>
          <span className="font-mono text-xs text-charcoal-500 uppercase tracking-wider block font-semibold">
            Console 01 / Operational Overview
          </span>
          <h1 className="font-display font-bold text-3xl text-charcoal-900 tracking-tight mt-1">
            Executive Intelligence Command
          </h1>
          <p className="text-charcoal-500 text-sm mt-1">
            Multi-platform ingestion telemetry across X and Telegram live streams.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-charcoal-700 bg-surface px-3 py-1.5 rounded border border-hairline shadow-subtle">
          <Activity className="w-3.5 h-3.5 text-signal-teal" />
          <span>REPLAY TICK: <strong className="text-charcoal-900">{replayState?.current_tick || 0} / {replayState?.total_ticks || 10}</strong></span>
        </div>
      </div>

      {/* Critical Signal Alert Banner (Triggers dynamically when a trend hits VIRAL or MUTATION) */}
      <AnimatePresence>
        {(viralNarrative || mutatedNarrative) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-surface border-l-4 border-l-signal-viral border border-hairline p-4 rounded flex items-center justify-between shadow-subtle"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-signal-viral" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-signal-viral uppercase tracking-wide">
                    CRITICAL SIGNAL ESCALATION ALERT
                  </span>
                  <span className="text-charcoal-400 font-mono text-xs">·</span>
                  <span className="font-mono text-xs text-charcoal-900 font-bold">
                    {viralNarrative?.topic || mutatedNarrative?.topic}
                  </span>
                </div>
                <p className="text-charcoal-700 text-xs mt-0.5 font-body">
                  {viralNarrative
                    ? `Narrative crossed VIRAL threshold (Trend Score: ${viralNarrative.trend_score.toFixed(1)}) with accelerated propagation across 2 platforms.`
                    : `Framing mutated from initial delay complaints to infrastructure crisis.`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (viralNarrative) setActiveTopic(viralNarrative.topic);
                setActiveTab('narrative');
              }}
              className="bg-signal-viral hover:bg-red-700 text-surface font-mono text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors shadow-subtle"
            >
              <span>INSPECT CASE FILE</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topline Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-hairline p-4 rounded shadow-subtle">
          <span className="font-mono text-[11px] uppercase tracking-wider text-charcoal-500 font-semibold block">Analyzed Events</span>
          <div className="font-mono text-2xl font-bold text-charcoal-900 mt-1">{totalEvents}</div>
          <span className="font-mono text-[10px] text-charcoal-400 mt-1 block">X + Telegram stream</span>
        </div>

        <div className="bg-surface border border-hairline p-4 rounded shadow-subtle">
          <span className="font-mono text-[11px] uppercase tracking-wider text-charcoal-500 font-semibold block">Active Narratives</span>
          <div className="font-mono text-2xl font-bold text-charcoal-900 mt-1">{activeNarrativesCount}</div>
          <span className="font-mono text-[10px] text-signal-expanding mt-1 block">Living objects tracked</span>
        </div>

        <div className="bg-surface border-l-4 border-l-signal-viral border border-hairline p-4 rounded shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-signal-viral font-semibold block">Critical Spikes</span>
            <Flame className="w-4 h-4 text-signal-viral" />
          </div>
          <div className="font-mono text-2xl font-bold text-signal-viral mt-1">
            {trends.filter((t) => t.lifecycle_stage === 'VIRAL' || t.lifecycle_stage === 'EXPANDING').length}
          </div>
          <span className="font-mono text-[10px] text-charcoal-400 mt-1 block">Threshold &gt; 75.0</span>
        </div>

        <div className="bg-surface border border-hairline p-4 rounded shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-signal-gold font-semibold block">Weak Signals</span>
            <Cpu className="w-4 h-4 text-signal-gold" />
          </div>
          <div className="font-mono text-2xl font-bold text-signal-gold mt-1">{weakSignals.length}</div>
          <span className="font-mono text-[10px] text-charcoal-400 mt-1 block">Early warning clusters</span>
        </div>
      </div>

      {/* Main Grid: Leaderboard + Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dominant Panel: Live Trend Leaderboard */}
        <div className="lg:col-span-2 bg-surface border border-hairline rounded p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline">
            <div>
              <h2 className="font-display font-semibold text-xl text-charcoal-900">Live Trend Leaderboard</h2>
              <p className="text-charcoal-500 text-xs mt-0.5">Ranked by deterministic 6-factor score (TRD §7)</p>
            </div>
            <span className="font-mono text-xs text-charcoal-400 font-medium">SORT: SCORE DESC</span>
          </div>

          {trends.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-hairline rounded font-mono text-xs text-charcoal-400 bg-subtle/40">
              Awaiting replay tick stream to calibrate baseline metrics...
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {trends.map((t, idx) => {
                const narrative = narratives.find((n) => n.topic === t.topic);
                return (
                  <motion.div
                    key={t.topic}
                    layout
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    onClick={() => {
                      setActiveTopic(t.topic);
                      setActiveTab('trend');
                    }}
                    className="py-4 flex items-center justify-between hover:bg-subtle/60 px-3 rounded cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-lg font-bold text-charcoal-400 w-6">#{idx + 1}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-body font-semibold text-charcoal-900 text-base">{t.topic}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${getStageBadgeClass(t.lifecycle_stage)}`}>
                            {t.lifecycle_stage}
                          </span>
                          {narrative?.mutation_detected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-amber-300 text-amber-800 bg-amber-50">
                              MUTATION
                            </span>
                          )}
                          {narrative?.attention_migration && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-emerald-300 text-emerald-800 bg-emerald-50">
                              MIGRATION
                            </span>
                          )}
                          {narrative?.is_weak_signal && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-amber-300 text-amber-800 bg-amber-50">
                              WEAK SIGNAL
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-charcoal-500">
                          <span>{t.event_count} events</span>
                          <span>·</span>
                          <span>Vol: {t.breakdown.volume_growth.toFixed(0)}</span>
                          <span>·</span>
                          <span>Eng: {t.breakdown.engagement_velocity.toFixed(0)}</span>
                          <span>·</span>
                          <span>Platforms: {Object.keys(t.active_platforms).join('+')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right">
                        <span className="font-mono text-2xl font-bold text-charcoal-900">{t.trend_score.toFixed(1)}</span>
                        <span className="block font-mono text-[9px] text-charcoal-400 uppercase tracking-wider font-semibold">COMPOSITE SCORE</span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-charcoal-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Replay Event Ingestion Feed */}
        <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-hairline">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-signal-viral animate-pulse" />
              <h2 className="font-display font-semibold text-lg text-charcoal-900">Live Ingestion Stream</h2>
            </div>
            <span className="font-mono text-[10px] text-charcoal-400 font-semibold">TELEMETRY</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {activeTopicEvents.length > 0 ? (
              activeTopicEvents.slice(0, 5).map((ev: any) => (
                <div key={ev.event_id} className="bg-subtle border border-hairline p-3 rounded space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-signal-gold font-bold">[{ev.event_id}]</span>
                    <span className="text-charcoal-500 font-medium">{ev.platform} · {ev.timestamp.slice(11, 19)}</span>
                  </div>
                  <p className="text-charcoal-900 font-body text-xs leading-relaxed">{ev.text}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-charcoal-500 pt-1 border-t border-hairline/60">
                    <span className="font-medium">{ev.author_name || ev.author_id}</span>
                    <span className={ev.sentiment === 'negative' ? 'text-signal-viral font-semibold' : 'text-signal-teal font-semibold'}>
                      {ev.sentiment}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 font-mono text-xs text-charcoal-400 bg-subtle/30 rounded border border-dashed border-hairline">
                Awaiting incoming streaming events...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
