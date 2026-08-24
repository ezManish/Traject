import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { ArrowUpRight, Flame, Sparkles, AlertOctagon, Activity, Radio } from 'lucide-react';
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
      case 'SEED': return 'stage-badge-seed';
      case 'EMERGING': return 'stage-badge-emerging';
      case 'EXPANDING': return 'stage-badge-expanding';
      case 'VIRAL': return 'stage-badge-viral font-bold';
      case 'SATURATION': return 'stage-badge-saturation';
      case 'DECLINING': return 'stage-badge-declining';
      case 'DORMANT': return 'stage-badge-dormant';
      default: return 'stage-badge-seed';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-baseline justify-between border-b border-ink-border pb-4">
        <div>
          <span className="font-mono text-xs text-mauve-600 uppercase tracking-wider block font-medium">
            Screen 1 · Command Overview
          </span>
          <h1 className="font-display font-bold text-3xl text-bone tracking-tight mt-1">
            Executive Intelligence
          </h1>
          <p className="text-mauve-400 text-sm mt-1">
            Deterministic narrative telemetry across X and Telegram live ingestion streams.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-mauve-400 bg-ink-surface px-3 py-1.5 rounded border border-ink-border">
          <Activity className="w-3.5 h-3.5 text-calm" />
          <span>REPLAY TICK: <strong className="text-bone">{replayState?.current_tick || 0} / {replayState?.total_ticks || 10}</strong></span>
        </div>
      </div>

      {/* Critical Signal Alert Banner (Triggers dynamically when a trend hits VIRAL or MUTATION) */}
      <AnimatePresence>
        {(viralNarrative || mutatedNarrative) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-ink-raised border-l-4 border-l-stage-viral border border-ink-border p-4 rounded flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-stage-viral/10 border border-stage-viral/30">
                <AlertOctagon className="w-5 h-5 text-stage-viral" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-stage-viral uppercase tracking-wide">
                    CRITICAL SIGNAL ESCALATION ALERT
                  </span>
                  <span className="text-mauve-600 font-mono text-xs">·</span>
                  <span className="font-mono text-xs text-bone font-semibold">
                    {viralNarrative?.topic || mutatedNarrative?.topic}
                  </span>
                </div>
                <p className="text-mauve-400 text-xs mt-0.5 font-body">
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
              className="bg-stage-viral hover:bg-stage-viral/90 text-ink-base font-mono text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 transition-colors"
            >
              <span>INSPECT CASE FILE</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topline Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-ink-surface border border-ink-border p-4 rounded">
          <span className="font-mono text-[11px] uppercase tracking-wider text-mauve-600 block">Analyzed Events</span>
          <div className="font-mono text-2xl font-semibold text-bone mt-1">{totalEvents}</div>
          <span className="font-mono text-[10px] text-mauve-400 mt-1 block">X + Telegram stream</span>
        </div>

        <div className="bg-ink-surface border border-ink-border p-4 rounded">
          <span className="font-mono text-[11px] uppercase tracking-wider text-mauve-600 block">Active Narratives</span>
          <div className="font-mono text-2xl font-semibold text-bone mt-1">{activeNarrativesCount}</div>
          <span className="font-mono text-[10px] text-stage-expanding mt-1 block">Living objects tracked</span>
        </div>

        <div className="bg-ink-surface border-l-4 border-l-stage-viral border border-ink-border p-4 rounded">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-stage-viral font-semibold block">Critical Spikes</span>
            <Flame className="w-4 h-4 text-stage-viral" />
          </div>
          <div className="font-mono text-2xl font-semibold text-stage-viral mt-1">
            {trends.filter((t) => t.lifecycle_stage === 'VIRAL' || t.lifecycle_stage === 'EXPANDING').length}
          </div>
          <span className="font-mono text-[10px] text-mauve-400 mt-1 block">Threshold &gt; 75.0</span>
        </div>

        <div className="bg-ink-surface border border-ink-border p-4 rounded">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-evidence font-semibold block">Weak Signals</span>
            <Sparkles className="w-4 h-4 text-evidence" />
          </div>
          <div className="font-mono text-2xl font-semibold text-evidence mt-1">{weakSignals.length}</div>
          <span className="font-mono text-[10px] text-mauve-400 mt-1 block">Early warning clusters</span>
        </div>
      </div>

      {/* Main Grid: Leaderboard + Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dominant Panel: Live Trend Leaderboard */}
        <div className="lg:col-span-2 bg-ink-surface border border-ink-border rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-xl text-bone">Live Trend Leaderboard</h2>
              <p className="text-mauve-400 text-xs mt-0.5">Ranked by deterministic 6-factor score (TRD §7)</p>
            </div>
            <span className="font-mono text-xs text-mauve-600">SORT: SCORE DESC</span>
          </div>

          {trends.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-ink-border rounded font-mono text-xs text-mauve-600">
              Awaiting the next replay tick to calibrate baseline metrics...
            </div>
          ) : (
            <div className="divide-y divide-ink-border">
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
                    className="py-4 flex items-center justify-between hover:bg-ink-raised/60 px-3 rounded cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-lg font-bold text-mauve-600 w-6">#{idx + 1}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-body font-semibold text-bone text-base">{t.topic}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${getStageBadgeClass(t.lifecycle_stage)}`}>
                            {t.lifecycle_stage}
                          </span>
                          {narrative?.mutation_detected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border border-evidence text-evidence bg-evidence/10">
                              MUTATION
                            </span>
                          )}
                          {narrative?.attention_migration && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border border-calm text-calm bg-calm/10">
                              MIGRATION
                            </span>
                          )}
                          {narrative?.is_weak_signal && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium border border-evidence text-evidence bg-evidence/10">
                              WEAK SIGNAL
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-mauve-400">
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
                        <span className="font-mono text-2xl font-bold text-bone">{t.trend_score.toFixed(1)}</span>
                        <span className="block font-mono text-[9px] text-mauve-600">COMPOSITE SCORE</span>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-mauve-600" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live Replay Event Ingestion Feed */}
        <div className="bg-ink-surface border border-ink-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-stage-expanding animate-pulse" />
              <h2 className="font-display font-semibold text-lg text-bone">Live Event Stream</h2>
            </div>
            <span className="font-mono text-[10px] text-mauve-600">TELEMETRY</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {activeTopicEvents.length > 0 ? (
              activeTopicEvents.slice(0, 5).map((ev: any) => (
                <div key={ev.event_id} className="bg-ink-base border border-ink-border p-3 rounded space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-evidence font-semibold">[{ev.event_id}]</span>
                    <span className="text-mauve-600">{ev.platform} · {ev.timestamp.slice(11, 19)}</span>
                  </div>
                  <p className="text-bone/90 line-clamp-2 font-body text-xs">{ev.text}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-mauve-600 pt-1">
                    <span>{ev.author_name || ev.author_id}</span>
                    <span className={ev.sentiment === 'negative' ? 'text-stage-viral' : 'text-calm'}>
                      {ev.sentiment}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 font-mono text-xs text-mauve-600">
                Awaiting incoming streaming events...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
