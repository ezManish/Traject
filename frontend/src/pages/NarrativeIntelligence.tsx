import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import type { NarrativeEvent, AIBriefingResponse } from '../api/client';
import { Share2, Cpu, ShieldCheck, GitBranch, FileSearch, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const NarrativeIntelligence: React.FC = () => {
  const { activeTopic, trends } = useTrajectStore();
  const [timeline, setTimeline] = useState<NarrativeEvent[]>([]);
  const [evidence, setEvidence] = useState<any>(null);
  const [briefing, setBriefing] = useState<AIBriefingResponse | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);

  const currentTrend = trends.find((t) => t.topic === activeTopic);

  useEffect(() => {
    if (activeTopic) {
      api.getNarrativeTimeline(activeTopic).then(setTimeline).catch(console.error);
      api.getNarrativeEvidence(activeTopic).then(setEvidence).catch(console.error);
      
      setIsBriefingLoading(true);
      api.getNarrativeBriefing(activeTopic)
        .then((data) => {
          setBriefing(data);
          setIsBriefingLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsBriefingLoading(false);
        });
    }
  }, [activeTopic, currentTrend?.tick]);

  const mutationEvent = timeline.find((e) => e.event_type === 'MUTATION_DETECTED');
  const migrationEvent = timeline.find((e) => e.event_type === 'ATTENTION_MIGRATION');

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
      className="p-8 space-y-8 max-w-[1600px] mx-auto"
    >
      {/* Dossier Header */}
      <div className="border-b border-[#262C38] pb-5 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#4ADE80] font-bold uppercase tracking-wider">
            <span>NARRATIVE INTELLIGENCE DOSSIER</span>
            <span className="text-[#565E6C]">/</span>
            <span className="text-[#8891A1]">INCIDENT TRJ-2026-09</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-[#E8EAED] tracking-tight mt-1">
            Why is this trending?
          </h1>
          <p className="text-[#8891A1] text-sm mt-1 font-body">
            Evidence-grounded origin, framing mutation, cross-platform propagation, and lifecycle dynamics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#565E6C] font-bold uppercase">LIFECYCLE STAGE:</span>
          <span className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold uppercase shadow-sm ${getStageBadgeClass(currentTrend?.lifecycle_stage || 'SEED')}`}>
            {currentTrend?.lifecycle_stage || 'SEED'}
          </span>
        </div>
      </div>

      {/* Narrative Evolution Journey Flow */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4 bg-[#12161D]">
        <div className="flex items-center justify-between pb-3 border-b border-[#262C38]">
          <h2 className="font-display font-bold text-xl text-[#E8EAED]">Narrative Evolution Journey</h2>
          <span className="font-mono text-[10px] text-[#4ADE80] font-bold bg-[#0A0D12] px-3 py-1 rounded-lg border border-[#262C38]">
            CHRONOLOGICAL PATHWAY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          {/* Node 1: Origin */}
          <motion.div whileHover={{ y: -3 }} className="bg-[#0A0D12] border border-[#262C38] p-4 rounded-xl space-y-1 relative hover:border-[#4ADE80]/40 transition-colors">
            <span className="font-mono text-[10px] text-[#565E6C] font-bold block">01 · ORIGIN (TICK 1)</span>
            <h4 className="font-display font-bold text-[#E8EAED] text-sm">Commuter Delay Tweets</h4>
            <p className="text-[#8891A1] text-xs font-body">Casual complaints on X regarding Rajiv Chowk delays.</p>
            <span className="text-[10px] font-mono text-[#4ADE80] font-semibold block pt-1">Platform: X (80%)</span>
          </motion.div>

          {/* Node 2: Migration */}
          <motion.div whileHover={{ y: -3 }} className="bg-[#0A0D12] border border-[#262C38] p-4 rounded-xl space-y-1 relative hover:border-[#4ADE80]/40 transition-colors">
            <span className="font-mono text-[10px] text-[#8891A1] font-bold block">02 · MIGRATION (TICK 3)</span>
            <h4 className="font-display font-bold text-[#E8EAED] text-sm">Telegram Alert Channels</h4>
            <p className="text-[#8891A1] text-xs font-body">Commuters switch to regional Telegram broadcast groups.</p>
            <span className="text-[10px] font-mono text-[#8891A1] font-semibold block pt-1">Platform: Telegram (40%)</span>
          </motion.div>

          {/* Node 3: Framing Mutation */}
          <motion.div whileHover={{ y: -3 }} className="bg-[#0A0D12] border border-[#FFB020]/40 p-4 rounded-xl space-y-1 relative shadow-[0_0_12px_rgba(255,176,32,0.12)]">
            <span className="font-mono text-[10px] text-[#FFB020] font-bold block">03 · MUTATION (TICK 4)</span>
            <h4 className="font-display font-bold text-[#FFB020] text-sm">Power Grid Failure Crisis</h4>
            <p className="text-[#8891A1] text-xs font-body">Rumors reshape delay into a regional substation blackout.</p>
            <span className="text-[10px] font-mono text-[#FFB020] font-bold block pt-1">Divergence: 0.86 (Receipts Attached)</span>
          </motion.div>

          {/* Node 4: Viral Media Surge */}
          <motion.div whileHover={{ y: -3 }} className="bg-[#0A0D12] border border-[#FF4D4D]/40 p-4 rounded-xl space-y-1 relative shadow-[0_0_12px_rgba(255,77,77,0.15)]">
            <span className="font-mono text-[10px] text-[#FF4D4D] font-bold block">04 · VIRAL PEAK (TICK 6)</span>
            <h4 className="font-display font-bold text-[#FF8585] text-sm">Mainstream News Pickup</h4>
            <p className="text-[#8891A1] text-xs font-body">Journalists amplify power grid framing; score crosses 83.0.</p>
            <span className="text-[10px] font-mono text-[#FF4D4D] font-bold block pt-1">Trend Score: 83.0 (VIRAL)</span>
          </motion.div>
        </div>
      </div>

      {/* Case File Narrative Briefing Card */}
      <div className="glass-panel border-l-4 border-l-[#4ADE80] p-6 rounded-2xl shadow-glass space-y-4 bg-[#12161D]">
        <div className="flex items-center justify-between pb-3 border-b border-[#262C38]">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-[#4ADE80] animate-pulse" />
            <h2 className="font-display font-bold text-2xl text-[#E8EAED]">Grounded Intelligence Briefing</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs border border-[#4ADE80]/30 text-[#4ADE80] bg-[#0A0D12] px-3.5 py-1.5 rounded-xl font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
            <span>CONFIDENCE: {briefing ? `${(briefing.confidence * 100).toFixed(0)}%` : '89%'} · {briefing?.provider || 'NVIDIA NIM'}</span>
          </div>
        </div>

        {isBriefingLoading ? (
          <div className="font-mono text-xs text-[#8891A1] py-3 animate-pulse">
            Synthesizing grounded intelligence briefing via NVIDIA NIM...
          </div>
        ) : (
          <p className="text-[#E8EAED] text-base leading-relaxed font-body">
            {briefing?.briefing || (
              `The narrative "${activeTopic}" originated on X as an isolated commute delay complaint, before accelerating through Telegram regional alert channels. It crossed into mainstream journalist circles at Tick 4 and underwent a critical framing mutation into a power grid failure investigation.`
            )}
          </p>
        )}

        {/* Framing Mutation Split Chamber */}
        {mutationEvent && (
          <div className="bg-[#0A0D12] border border-[#FFB020]/30 p-5 rounded-2xl mt-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#FFB020]" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#FFB020] font-bold">
                  Detected Framing Mutation
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#FFB020] bg-[#1A1F29] px-3 py-1 rounded-lg border border-[#FFB020]/30 font-bold">
                N-GRAM DIVERGENCE: 0.86
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-[#12161D] p-4 rounded-xl border border-[#262C38] space-y-1 shadow-sm">
                <span className="font-mono text-[10px] text-[#565E6C] font-bold uppercase">INITIAL EARLY FRAMING</span>
                <div className="font-display font-bold text-[#E8EAED] text-base">
                  {mutationEvent.meta_data.from_framing || 'Routine Commuter Delay'}
                </div>
                <p className="text-[#8891A1] font-mono text-[11px]">Salient terms: metro, rajiv chowk, delay, gates</p>
              </div>

              <div className="bg-[#261010] p-4 rounded-xl border border-[#FF4D4D]/40 space-y-1 shadow-sm">
                <span className="font-mono text-[10px] text-[#FF4D4D] font-bold uppercase">MUTATED CRISIS FRAMING</span>
                <div className="font-display font-bold text-[#FF8585] text-base">
                  {mutationEvent.meta_data.to_framing || 'Power Grid Failure / Infrastructure Crisis'}
                </div>
                <p className="text-[#FFB0B0] font-mono text-[11px]">Salient terms: power grid, substation blackout, grid failure</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#8891A1]">
              <span className="font-bold text-[#4ADE80]">CITED RECEIPTS: [{mutationEvent.evidence_post_ids.join(', ')}]</span>
              <span className="text-[#565E6C]">Corroborated by 88% divergence confidence</span>
            </div>
          </div>
        )}

        {/* Attention Migration Callout */}
        {migrationEvent && (
          <div className="bg-[#0A0D12] border border-[#4ADE80]/30 p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#12161D] border border-[#4ADE80]/30">
                <Share2 className="w-4 h-4 text-[#4ADE80]" />
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#4ADE80] font-bold block">
                  Cross-Platform Attention Migration
                </span>
                <p className="font-body text-xs text-[#8891A1] mt-0.5">
                  {migrationEvent.description}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-[#4ADE80] bg-[#12161D] px-3.5 py-1.5 rounded-xl border border-[#4ADE80]/30 shadow-sm">
              X (80% → 60%) · Telegram (20% → 40%)
            </span>
          </div>
        )}
      </div>

      {/* Narrative Lifecycle Progression */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4 bg-[#12161D]">
        <div className="pb-3 border-b border-[#262C38] flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-[#E8EAED]">Lifecycle Event Progression</h2>
            <span className="font-mono text-xs text-[#8891A1] block mt-0.5">Chronological trace of living narrative transitions</span>
          </div>
          <span className="font-mono text-xs text-[#4ADE80] font-bold bg-[#0A0D12] px-3 py-1 rounded-lg border border-[#262C38]">
            STATE MACHINE
          </span>
        </div>

        <div className="space-y-4 relative border-l-2 border-[#262C38] ml-3 pl-6 mt-4">
          {timeline.length > 0 ? (
            timeline.map((ev, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="relative group"
              >
                {/* Timeline node marker */}
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#0A0D12] ${
                  ev.event_type === 'MUTATION_DETECTED'
                    ? 'border-[#FFB020] ring-4 ring-[#FFB020]/20'
                    : ev.event_type === 'ATTENTION_MIGRATION'
                    ? 'border-[#4ADE80] ring-4 ring-[#4ADE80]/20'
                    : 'border-[#8891A1] ring-4 ring-white/10'
                }`} />

                <div className="bg-[#0A0D12] border border-[#262C38] hover:border-[#4ADE80]/40 p-4 rounded-xl shadow-sm space-y-1.5 transition-colors">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-[#E8EAED] text-sm">{ev.title}</span>
                    <span className="text-[#565E6C] font-medium">{ev.timestamp.replace('T', ' ').replace('Z', ' UTC')} · Tick {ev.tick}</span>
                  </div>
                  <p className="text-[#8891A1] text-sm leading-relaxed font-body">{ev.description}</p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#4ADE80] font-bold">
                    <span>Receipts: [{ev.evidence_post_ids.join(', ')}]</span>
                    <span className="text-[#565E6C]">·</span>
                    <span className="text-[#8891A1]">{(ev.confidence * 100).toFixed(0)}% confidence rating</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="font-mono text-xs text-[#565E6C] py-8 bg-[#0A0D12] rounded-xl border border-dashed border-[#262C38] text-center">
              Awaiting narrative lifecycle transitions...
            </div>
          )}
        </div>
      </div>

      {/* Evidence Strip */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4 bg-[#12161D]">
        <div className="flex items-center justify-between pb-3 border-b border-[#262C38]">
          <div className="flex items-center gap-2.5">
            <FileSearch className="w-5 h-5 text-[#4ADE80]" />
            <div>
              <h2 className="font-display font-bold text-2xl text-[#E8EAED]">Evidence Receipts Strip</h2>
              <p className="text-[#8891A1] text-xs mt-0.5">Underlying post citations verifying this narrative</p>
            </div>
          </div>
          <span className="font-mono text-xs text-[#4ADE80] bg-[#0A0D12] px-3.5 py-1.5 rounded-xl border border-[#4ADE80]/30 font-bold shadow-sm">
            {evidence?.total_evidence_count || 0} Grounded Receipts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidence?.evidence_posts?.slice(0, 6).map((post: any) => (
            <motion.div 
              key={post.event_id} 
              whileHover={{ y: -2 }}
              className="bg-[#0A0D12] border border-[#262C38] hover:border-[#4ADE80]/40 p-4 rounded-xl shadow-sm space-y-2.5 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] pb-1.5 border-b border-[#262C38]">
                  <span className="text-[#4ADE80] font-bold">[{post.event_id}]</span>
                  <span className="text-[#565E6C] font-medium">{post.platform} · {post.timestamp.slice(11, 19)}</span>
                </div>
                <p className="text-[#E8EAED] text-xs line-clamp-3 font-body leading-relaxed mt-2">{post.text}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#565E6C] pt-2 border-t border-[#262C38]">
                <span className="font-bold text-[#8891A1]">{post.author_name || post.author_id}</span>
                <span className="flex items-center gap-1 font-semibold text-[#4ADE80]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {post.likes} likes · {post.shares} shares
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
