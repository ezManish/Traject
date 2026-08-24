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
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-8 space-y-6 max-w-[1600px] mx-auto"
    >
      {/* Console Header */}
      <div className="border-b border-[#262C38] pb-5 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#4ADE80] font-bold uppercase tracking-wider">
            <RadioTower className="w-3.5 h-3.5 animate-pulse text-[#4ADE80]" />
            <span>EXECUTIVE INTELLIGENCE COMMAND</span>
            <span className="text-[#565E6C]">/</span>
            <span className="text-[#8891A1]">NTRO PS26152 SITREP</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-[#E8EAED] tracking-tight mt-1">
            Global Situation Matrix
          </h1>
          <p className="text-[#8891A1] text-sm mt-1 font-body">
            Real-time deterministic narrative telemetry across X and Telegram live streams.
          </p>
        </div>
      </div>

      {/* Critical Escalation Alert Cable */}
      <AnimatePresence>
        {(viralNarrative || mutatedNarrative) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            className="glass-panel border-l-4 border-l-[#FF4D4D] p-5 rounded-2xl flex items-center justify-between bg-[#12161D] border-[#262C38] shadow-sm"
          >
            <div className="flex items-center gap-3.5 z-10">
              <div className="p-2.5 rounded-xl bg-[#0A0D12] border border-[#FF4D4D]/50 shadow-[0_0_12px_rgba(255,77,77,0.25)]">
                <AlertTriangle className="w-5 h-5 text-[#FF4D4D] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF4D4D]">
                    CRITICAL SIGNAL ESCALATION
                  </span>
                  <span className="text-[#565E6C]">/</span>
                  <span className="font-display font-bold text-[#E8EAED] text-base">
                    {criticalTopic}
                  </span>
                </div>
                <p className="font-body text-xs text-[#8891A1] mt-0.5">
                  {mutatedNarrative
                    ? "Framing mutated from initial delay complaints to infrastructure crisis."
                    : "Rapid velocity threshold breached across cross-platform channels."}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                if (criticalTopic) setActiveTopic(criticalTopic);
                setActiveTab('narrative');
              }}
              className="bg-[#FF4D4D] hover:bg-[#E03A3A] text-[#0A0D12] font-mono text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              <span>INSPECT CASE FILE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Precision Matrix HUD Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="glass-panel p-5 rounded-2xl shadow-glass flex flex-col justify-between space-y-4 hover:border-[#4ADE80]/50 transition-colors bg-[#12161D]"
        >
          <div className="flex items-center justify-between text-[#565E6C]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">INGESTED EVENTS</span>
            <Layers className="w-4 h-4 text-[#8891A1]" />
          </div>
          <div className="space-y-1">
            <div className="font-mono font-bold text-3xl text-[#E8EAED]">{totalIngestedEvents}</div>
            <div className="font-mono text-[10px] text-[#4ADE80] flex items-center gap-1 font-semibold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
              <span>X + Telegram Live Stream</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="glass-panel p-5 rounded-2xl shadow-glass flex flex-col justify-between space-y-4 hover:border-[#4ADE80]/50 transition-colors bg-[#12161D]"
        >
          <div className="flex items-center justify-between text-[#565E6C]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">ACTIVE NARRATIVES</span>
            <RadioTower className="w-4 h-4 text-[#4ADE80]" />
          </div>
          <div className="space-y-1">
            <div className="font-mono font-bold text-3xl text-[#E8EAED]">{activeNarrativesCount}</div>
            <div className="font-mono text-[10px] text-[#8891A1] font-semibold">
              Living objects tracked
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="glass-panel p-5 rounded-2xl shadow-glass flex flex-col justify-between space-y-4 hover:border-[#FF4D4D]/50 transition-colors bg-[#12161D]"
        >
          <div className="flex items-center justify-between text-[#565E6C]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[#FF4D4D]">CRITICAL SPIKES</span>
            <Flame className="w-4 h-4 text-[#FF4D4D]" />
          </div>
          <div className="space-y-1">
            <div className="font-mono font-bold text-3xl text-[#FF4D4D]">{criticalSpikesCount}</div>
            <div className="font-mono text-[10px] text-[#565E6C] font-semibold">Threshold &gt; 75.0</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="glass-panel p-5 rounded-2xl shadow-glass flex flex-col justify-between space-y-4 hover:border-[#FFB020]/50 transition-colors bg-[#12161D]"
        >
          <div className="flex items-center justify-between text-[#565E6C]">
            <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[#FFB020]">WEAK SIGNALS</span>
            <Eye className="w-4 h-4 text-[#FFB020]" />
          </div>
          <div className="space-y-1">
            <div className="font-mono font-bold text-3xl text-[#FFB020]">{weakSignalsCount}</div>
            <div className="font-mono text-[10px] text-[#565E6C] font-semibold">Early anomaly clusters</div>
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Ranked Leaderboard + Live Wire Ingestion Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left 2 Cols: Ranked Leaderboard */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shadow-glass space-y-5 bg-[#12161D]">
          <div className="flex items-center justify-between pb-3 border-b border-[#262C38]">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#E8EAED]">Live Trend Leaderboard</h2>
              <span className="font-mono text-xs text-[#8891A1] block mt-0.5">
                Ranked by deterministic 6-factor score (TRD §7)
              </span>
            </div>
            <div className="font-mono text-[10px] text-[#4ADE80] bg-[#0A0D12] px-3 py-1 rounded-lg border border-[#262C38] font-bold">
              SORT: TS DESC
            </div>
          </div>

          <div className="space-y-3">
            {trends.length > 0 ? (
              trends.map((t, idx) => (
                <motion.div
                  key={t.topic}
                  layout
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setActiveTopic(t.topic);
                    setActiveTab('narrative');
                  }}
                  className="bg-[#0A0D12] p-4 rounded-xl border border-[#262C38] hover:border-[#4ADE80]/50 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-xl text-[#565E6C] group-hover:text-[#4ADE80] transition-colors w-6">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-display font-bold text-base text-[#E8EAED] group-hover:text-[#4ADE80] transition-colors">
                          {t.topic}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${getStageBadgeClass(t.lifecycle_stage)}`}>
                          {t.lifecycle_stage}
                        </span>
                        {narratives.find((n) => n.topic === t.topic)?.mutation_detected && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30 uppercase">
                            MUTATION
                          </span>
                        )}
                        {narratives.find((n) => n.topic === t.topic)?.attention_migration && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/30 uppercase">
                            MIGRATION
                          </span>
                        )}
                        {narratives.find((n) => n.topic === t.topic)?.is_weak_signal && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-[#FFB020]/15 text-[#FFB020] border border-[#FFB020]/30 uppercase">
                            WEAK SIGNAL
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs text-[#8891A1] mt-1 flex items-center gap-3 font-medium">
                        <span>{t.event_count} events</span>
                        <span className="text-[#565E6C]">·</span>
                        <span>Vol: {t.breakdown?.volume_growth.toFixed(0) || 0}</span>
                        <span className="text-[#565E6C]">·</span>
                        <span>Eng: {t.breakdown?.engagement_velocity.toFixed(0) || 0}</span>
                        <span className="text-[#565E6C]">·</span>
                        <span className="text-[#8891A1]">Platforms: {Object.keys(t.active_platforms || {}).join('+') || 'X'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3.5">
                    <div>
                      <div className="font-mono font-bold text-2xl text-[#E8EAED]">
                        {t.trend_score.toFixed(1)}
                      </div>
                      <div className="font-mono text-[9px] text-[#565E6C] uppercase font-semibold">COMPOSITE SCORE</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#12161D] border border-[#262C38] group-hover:border-[#4ADE80]/40 transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-[#8891A1] group-hover:text-[#4ADE80] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="font-mono text-xs text-[#8891A1] py-12 text-center bg-[#0A0D12] rounded-xl border border-dashed border-[#262C38] space-y-1">
                <p className="text-[#E8EAED] font-semibold">Stream Inactive at Tick 0</p>
                <p className="text-[11px] text-[#565E6C]">Click 'Stream' in the header to ingest real-time events.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Live Wire Feed */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4 flex flex-col justify-between bg-[#12161D]">
          <div className="flex items-center justify-between pb-3 border-b border-[#262C38]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ADE80]" />
              </span>
              <h3 className="font-display font-bold text-lg text-[#E8EAED]">Live Wire Stream</h3>
            </div>
            <span className="font-mono text-[10px] text-[#4ADE80] bg-[#0A0D12] px-2.5 py-0.5 rounded-lg border border-[#262C38] font-bold">TELEMETRY</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {activeTopicEvents && activeTopicEvents.length > 0 ? (
              activeTopicEvents.slice(0, 5).map((ev) => (
                <div key={ev.event_id} className="bg-[#0A0D12] p-3 rounded-xl border border-[#262C38] space-y-1.5 shadow-sm text-xs font-mono hover:border-[#4ADE80]/40 transition-colors">
                  <div className="flex justify-between text-[#565E6C] text-[10px]">
                    <span className="text-[#4ADE80] font-bold">[{ev.event_id}]</span>
                    <span>{ev.platform} · {ev.timestamp.slice(11, 19)}</span>
                  </div>
                  <p className="text-[#E8EAED] text-xs font-body line-clamp-2">{ev.text}</p>
                  <div className="flex justify-between text-[10px] pt-1 text-[#565E6C] border-t border-[#262C38]">
                    <span className="text-[#8891A1] font-semibold">{ev.author_name || ev.author_id}</span>
                    <span className={ev.sentiment === 'negative' ? 'text-[#FF4D4D] font-bold' : 'text-[#4ADE80] font-bold'}>
                      {ev.sentiment}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="font-mono text-xs text-[#8891A1] py-12 text-center bg-[#0A0D12] rounded-xl border border-dashed border-[#262C38] space-y-1">
                <p className="text-[#E8EAED] font-semibold">Stream Inactive at Tick 0</p>
                <p className="text-[11px] text-[#565E6C]">Click 'Stream' in the header to ingest real-time events.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
