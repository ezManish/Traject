import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { RadioTower, AlertTriangle, Layers, Flame, Eye, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExecutiveDashboard: React.FC = () => {
  const { trends, narratives, setActiveTopic, setActiveTab, activeTopicEvents } = useTrajectStore();

  const totalIngestedEvents = trends.reduce((acc, t) => acc + t.event_count, 0);
  const activeNarrativesCount = narratives.length;
  const criticalSpikesCount = trends.filter((t) => t.trend_score > 75.0).length;
  const weakSignalsCount = narratives.filter((n) => n.is_weak_signal).length;

  const viralNarrative = narratives.find((n) => n.lifecycle_stage === 'VIRAL');
  const mutatedNarrative = narratives.find((n) => n.mutation_detected);
  const criticalTopic = viralNarrative?.topic || mutatedNarrative?.topic;

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
      <div className="border-b border-borderline pb-5">
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
          <p className="text-charcoal-400 text-sm mt-1 font-body">
            Real-time deterministic narrative telemetry across X and Telegram live streams.
          </p>
        </div>
      </div>

      {/* Critical Escalation Alert Cable */}
      <AnimatePresence>
        {(viralNarrative || mutatedNarrative) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel border-l-4 border-l-brand-crimson p-5 rounded-2xl shadow-neon-crimson flex items-center justify-between bg-red-950/20 border-red-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-900/40 border border-red-500/40">
                <AlertTriangle className="w-5 h-5 text-brand-crimson animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand-crimson">
                    CRITICAL SIGNAL ESCALATION
                  </span>
                  <span className="text-charcoal-400">/</span>
                  <span className="font-display font-bold text-charcoal-900 text-base">
                    {criticalTopic}
                  </span>
                </div>
                <p className="font-body text-xs text-charcoal-300 mt-0.5">
                  {mutatedNarrative
                    ? "Framing mutated from initial delay complaints to infrastructure crisis."
                    : "Rapid velocity threshold breached across cross-platform channels."}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (criticalTopic) setActiveTopic(criticalTopic);
                setActiveTab('narrative');
              }}
              className="bg-brand-crimson hover:bg-red-600 text-white font-mono text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>INSPECT CASE FILE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Precision Matrix HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl shadow-glass flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-charcoal-400">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">INGESTED EVENTS</span>
            <Layers className="w-4 h-4 text-charcoal-400" />
          </div>
          <div className="space-y-1">
            <div className="font-mono font-bold text-3xl text-charcoal-950">{totalIngestedEvents}</div>
            <div className="font-mono text-[10px] text-brand-emerald flex items-center gap-1 font-semibold">
              <span>↑ X + Telegram Stream</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl shadow-glass flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-charcoal-400">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">ACTIVE NARRATIVES</span>
            <RadioTower className="w-4 h-4 text-brand-amber" />
          </div>
          <div className="space-y-1">
            <div className="font-mono font-bold text-3xl text-charcoal-950">{activeNarrativesCount}</div>
            <div className="font-mono text-[10px] text-brand-amber font-semibold">
              Living objects tracked
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl shadow-glass flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-charcoal-400">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-brand-crimson">CRITICAL SPIKES</span>
            <Flame className="w-4 h-4 text-brand-crimson" />
          </div>
          <div className="space-y-1">
            <div className="font-mono font-bold text-3xl text-brand-crimson">{criticalSpikesCount}</div>
            <div className="font-mono text-[10px] text-charcoal-400 font-semibold">Threshold &gt; 75.0</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl shadow-glass flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-charcoal-400">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-brand-gold">WEAK SIGNALS</span>
            <Eye className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="space-y-1">
            <div className="font-mono font-bold text-3xl text-brand-gold">{weakSignalsCount}</div>
            <div className="font-mono text-[10px] text-charcoal-400 font-semibold">Early anomaly clusters</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Ranked Leaderboard + Live Wire Ingestion Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left 2 Cols: Ranked Leaderboard */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shadow-glass space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <div>
              <h2 className="font-display font-bold text-2xl text-charcoal-950">Live Trend Leaderboard</h2>
              <span className="font-mono text-xs text-charcoal-400 block mt-0.5">
                Ranked by deterministic 6-factor score (TRD §7)
              </span>
            </div>
            <div className="font-mono text-[10px] text-charcoal-400 bg-pearl px-2.5 py-1 rounded-md border border-borderline">
              SORT: TS DESC
            </div>
          </div>

          <div className="space-y-3">
            {trends.length > 0 ? (
              trends.map((t, idx) => (
                <motion.div
                  key={t.topic}
                  layout
                  onClick={() => {
                    setActiveTopic(t.topic);
                    setActiveTab('narrative');
                  }}
                  className="bg-card p-4 rounded-xl border border-borderline hover:border-brand-emerald cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-xl text-charcoal-400 group-hover:text-brand-emerald transition-colors w-6">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-display font-bold text-base text-charcoal-950 group-hover:text-brand-emerald transition-colors">
                          {t.topic}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${getStageBadgeClass(t.lifecycle_stage)}`}>
                          {t.lifecycle_stage}
                        </span>
                        {narratives.find((n) => n.topic === t.topic)?.mutation_detected && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-950/40 text-brand-amber border border-amber-500/40 uppercase">
                            MUTATION
                          </span>
                        )}
                        {narratives.find((n) => n.topic === t.topic)?.attention_migration && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-950/40 text-brand-emerald border border-emerald-500/40 uppercase">
                            MIGRATION
                          </span>
                        )}
                        {narratives.find((n) => n.topic === t.topic)?.is_weak_signal && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-950/40 text-brand-gold border border-amber-500/40 uppercase">
                            WEAK SIGNAL
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs text-charcoal-400 mt-1 flex items-center gap-3 font-medium">
                        <span>{t.event_count} events</span>
                        <span>·</span>
                        <span>Vol: {t.breakdown?.volume_growth.toFixed(0) || 0}</span>
                        <span>·</span>
                        <span>Eng: {t.breakdown?.engagement_velocity.toFixed(0) || 0}</span>
                        <span>·</span>
                        <span>Platforms: {Object.keys(t.active_platforms || {}).join('+') || 'X'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="font-mono font-bold text-2xl text-charcoal-950">
                        {t.trend_score.toFixed(1)}
                      </div>
                      <div className="font-mono text-[9px] text-charcoal-400 uppercase font-semibold">COMPOSITE SCORE</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-charcoal-400 group-hover:text-brand-emerald group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="font-mono text-xs text-charcoal-400 py-12 text-center bg-pearl/30 rounded-xl border border-dashed border-borderline">
                Awaiting incoming stream events...
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Live Wire Feed */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-crimson opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-crimson" />
              </span>
              <h3 className="font-display font-bold text-lg text-charcoal-950">Live Wire Stream</h3>
            </div>
            <span className="font-mono text-[10px] text-charcoal-400 bg-pearl px-2 py-0.5 rounded border border-borderline">TELEMETRY</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {activeTopicEvents && activeTopicEvents.length > 0 ? (
              activeTopicEvents.slice(0, 5).map((ev) => (
                <div key={ev.event_id} className="bg-card p-3 rounded-xl border border-borderline space-y-1.5 shadow-sm text-xs font-mono">
                  <div className="flex justify-between text-charcoal-400 text-[10px]">
                    <span className="text-brand-amber font-bold">[{ev.event_id}]</span>
                    <span>{ev.platform} · {ev.timestamp.slice(11, 19)}</span>
                  </div>
                  <p className="text-charcoal-200 text-xs font-body line-clamp-2">{ev.text}</p>
                  <div className="flex justify-between text-[10px] pt-1 text-charcoal-400 border-t border-borderline">
                    <span className="text-charcoal-300 font-semibold">{ev.author_name || ev.author_id}</span>
                    <span className={ev.sentiment === 'negative' ? 'text-brand-crimson font-bold' : 'text-brand-emerald font-bold'}>
                      {ev.sentiment}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="font-mono text-xs text-charcoal-400 py-12 text-center bg-pearl/30 rounded-xl border border-dashed border-borderline">
                Awaiting incoming stream events...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
