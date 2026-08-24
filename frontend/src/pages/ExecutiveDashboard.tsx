import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { ArrowUpRight, Flame, AlertOctagon, Activity, Radio, Cpu, ArrowUp, Layers, RadioTower } from 'lucide-react';
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
      case 'VIRAL': return 'badge-stage-viral';
      case 'SATURATION': return 'badge-stage-saturation';
      case 'DECLINING': return 'badge-stage-declining';
      default: return 'badge-stage-seed';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Console Header */}
      <div className="flex items-baseline justify-between border-b border-borderline pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-brand-amber font-bold uppercase tracking-wider">
            <RadioTower className="w-3.5 h-3.5" />
            <span>EXECUTIVE INTELLIGENCE COMMAND</span>
            <span>/</span>
            <span>NTRO PS26152 SITREP</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-charcoal-950 tracking-tight mt-1">
            Global Situation Matrix
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 font-body">
            Real-time deterministic narrative telemetry across X and Telegram live streams.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-950 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-300 font-bold shadow-sm">
          <Activity className="w-4 h-4 text-brand-emerald animate-pulse" />
          <span>LIVE TELEMETRY STREAM</span>
        </div>
      </div>

      {/* Critical Escalation Alert Cable */}
      <AnimatePresence>
        {(viralNarrative || mutatedNarrative) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel border-l-4 border-l-brand-crimson p-5 rounded-2xl shadow-glass flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertOctagon className="w-6 h-6 text-brand-crimson" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-crimson uppercase tracking-wider bg-red-100/60 px-2 py-0.5 rounded">
                    CRITICAL SIGNAL ESCALATION
                  </span>
                  <span className="text-charcoal-300 font-mono">/</span>
                  <span className="font-display text-lg text-charcoal-950 font-bold">
                    {viralNarrative?.topic || mutatedNarrative?.topic}
                  </span>
                </div>
                <p className="text-charcoal-700 text-xs mt-1 font-body leading-relaxed max-w-3xl">
                  {viralNarrative
                    ? `Narrative crossed VIRAL threshold (Trend Score: ${viralNarrative.trend_score.toFixed(1)}) with acute acceleration across X and Telegram.`
                    : `Framing mutated from initial delay complaints to infrastructure crisis.`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (viralNarrative) setActiveTopic(viralNarrative.topic);
                setActiveTab('narrative');
              }}
              className="bg-charcoal-950 hover:bg-charcoal-800 text-white font-mono text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:scale-105"
            >
              <span>INSPECT CASE FILE</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Topline Kinetic Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Card 1: Ingested Events */}
        <div className="glass-panel p-5 rounded-2xl glass-card-hover space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal-500 font-bold">Ingested Events</span>
            <Layers className="w-4 h-4 text-charcoal-400" />
          </div>
          <div className="font-mono text-3xl font-bold text-charcoal-950">{totalEvents}</div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-emerald font-semibold">
            <ArrowUp className="w-3 h-3" />
            <span>X + Telegram Stream</span>
          </div>
        </div>

        {/* Card 2: Active Narratives */}
        <div className="glass-panel p-5 rounded-2xl glass-card-hover space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal-500 font-bold">Active Narratives</span>
            <Activity className="w-4 h-4 text-brand-amber" />
          </div>
          <div className="font-mono text-3xl font-bold text-charcoal-950">{activeNarrativesCount}</div>
          <span className="font-mono text-[10px] text-brand-amber font-semibold block">Living objects tracked</span>
        </div>

        {/* Card 3: Critical Spikes */}
        <div className="glass-panel border-l-4 border-l-brand-crimson p-5 rounded-2xl glass-card-hover space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-brand-crimson font-bold">Critical Spikes</span>
            <Flame className="w-4 h-4 text-brand-crimson" />
          </div>
          <div className="font-mono text-3xl font-bold text-brand-crimson">
            {trends.filter((t) => t.lifecycle_stage === 'VIRAL' || t.lifecycle_stage === 'EXPANDING').length}
          </div>
          <span className="font-mono text-[10px] text-charcoal-500 font-semibold block">Threshold &gt; 75.0</span>
        </div>

        {/* Card 4: Weak Signals */}
        <div className="glass-panel p-5 rounded-2xl glass-card-hover space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-brand-gold font-bold">Weak Signals</span>
            <Cpu className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="font-mono text-3xl font-bold text-brand-gold">{weakSignals.length}</div>
          <span className="font-mono text-[10px] text-charcoal-500 font-semibold block">Early anomaly clusters</span>
        </div>
      </div>

      {/* Main Grid: Leaderboard + Live Wire Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dominant Panel: Live Trend Leaderboard */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <div>
              <h2 className="font-display font-bold text-2xl text-charcoal-950">Live Trend Leaderboard</h2>
              <p className="text-charcoal-500 text-xs mt-0.5">Ranked by deterministic 6-factor score (TRD §7)</p>
            </div>
            <span className="font-mono text-xs text-charcoal-500 font-bold bg-pearl px-3 py-1 rounded-lg border border-borderline">
              SORT: TS DESC
            </span>
          </div>

          {trends.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-borderline rounded-xl font-mono text-xs text-charcoal-400 bg-pearl/40">
              Awaiting replay stream to calibrate baseline metrics...
            </div>
          ) : (
            <div className="divide-y divide-borderline">
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
                    className="py-4 flex items-center justify-between hover:bg-pearl/60 px-4 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xl font-bold text-charcoal-400 w-7">#{idx + 1}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-charcoal-950 text-lg">{t.topic}</span>
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase ${getStageBadgeClass(t.lifecycle_stage)}`}>
                            {t.lifecycle_stage}
                          </span>
                          {narrative?.mutation_detected && (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border border-amber-300 text-amber-900 bg-amber-50">
                              MUTATION
                            </span>
                          )}
                          {narrative?.attention_migration && (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border border-emerald-300 text-emerald-900 bg-emerald-50">
                              MIGRATION
                            </span>
                          )}
                          {narrative?.is_weak_signal && (
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border border-amber-300 text-amber-900 bg-amber-50">
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
                        <span className="font-mono text-2xl font-bold text-charcoal-950">{t.trend_score.toFixed(1)}</span>
                        <span className="block font-mono text-[9px] text-charcoal-400 uppercase font-bold tracking-wider">COMPOSITE SCORE</span>
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
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-crimson animate-pulse" />
              <h2 className="font-display font-bold text-xl text-charcoal-950">Live Wire Stream</h2>
            </div>
            <span className="font-mono text-[10px] text-charcoal-500 font-bold bg-pearl px-2.5 py-1 rounded-md border border-borderline">TELEMETRY</span>
          </div>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
            {activeTopicEvents.length > 0 ? (
              activeTopicEvents.slice(0, 5).map((ev: any) => (
                <div key={ev.event_id} className="bg-pearl/80 border border-borderline p-3.5 rounded-xl space-y-2 text-xs shadow-sm">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-brand-amber font-bold">[{ev.event_id}]</span>
                    <span className="text-charcoal-500 font-medium">{ev.platform} · {ev.timestamp.slice(11, 19)}</span>
                  </div>
                  <p className="text-charcoal-900 font-body text-xs leading-relaxed">{ev.text}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-charcoal-500 pt-1.5 border-t border-borderline">
                    <span className="font-bold text-charcoal-800">{ev.author_name || ev.author_id}</span>
                    <span className={ev.sentiment === 'negative' ? 'text-brand-crimson font-bold' : 'text-brand-emerald font-bold'}>
                      {ev.sentiment}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 font-mono text-xs text-charcoal-400 bg-pearl/40 rounded-xl border border-dashed border-borderline">
                Awaiting incoming stream events...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
