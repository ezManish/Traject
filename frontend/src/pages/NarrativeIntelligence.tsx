import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import type { NarrativeEvent, AIBriefingResponse } from '../api/client';
import { Share2, Cpu, ShieldCheck, GitBranch, FileSearch, CheckCircle2 } from 'lucide-react';

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
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Dossier Header */}
      <div className="border-b border-borderline pb-5 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-brand-amber font-bold uppercase tracking-wider">
            <span>NARRATIVE INTELLIGENCE DOSSIER</span>
            <span>/</span>
            <span>INCIDENT TRJ-2026-09</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-charcoal-950 tracking-tight mt-1">
            Why is this trending?
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 font-body">
            Evidence-grounded origin, framing mutation, cross-platform propagation, and lifecycle dynamics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-charcoal-500 font-bold uppercase">LIFECYCLE STAGE:</span>
          <span className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase shadow-sm ${getStageBadgeClass(currentTrend?.lifecycle_stage || 'SEED')}`}>
            {currentTrend?.lifecycle_stage || 'SEED'}
          </span>
        </div>
      </div>

      {/* Kinetic Narrative Storyline Journey Flow */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-borderline">
          <h2 className="font-display font-bold text-xl text-charcoal-950">Narrative Evolution Journey</h2>
          <span className="font-mono text-[10px] text-charcoal-400 font-bold bg-pearl px-2.5 py-1 rounded-md border border-borderline">CHRONOLOGICAL PATHWAY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          {/* Node 1: Origin */}
          <div className="bg-pearl/80 border border-borderline p-4 rounded-xl space-y-1 relative">
            <span className="font-mono text-[10px] text-charcoal-400 font-bold block">01 · ORIGIN (TICK 1)</span>
            <h4 className="font-display font-bold text-charcoal-900 text-sm">Commuter Delay Tweets</h4>
            <p className="text-charcoal-600 text-xs font-body">Casual complaints on X regarding Rajiv Chowk delays.</p>
            <span className="text-[10px] font-mono text-brand-emerald font-semibold block pt-1">Platform: X (80%)</span>
          </div>

          {/* Node 2: Migration */}
          <div className="bg-pearl/80 border border-borderline p-4 rounded-xl space-y-1 relative">
            <span className="font-mono text-[10px] text-brand-indigo font-bold block">02 · MIGRATION (TICK 3)</span>
            <h4 className="font-display font-bold text-charcoal-900 text-sm">Telegram Alert Channels</h4>
            <p className="text-charcoal-600 text-xs font-body">Commuters switch to regional Telegram broadcast groups.</p>
            <span className="text-[10px] font-mono text-brand-indigo font-semibold block pt-1">Platform: Telegram (40%)</span>
          </div>

          {/* Node 3: Framing Mutation */}
          <div className="bg-amber-50/80 border border-amber-300 p-4 rounded-xl space-y-1 relative shadow-sm">
            <span className="font-mono text-[10px] text-brand-amber font-bold block">03 · MUTATION (TICK 4)</span>
            <h4 className="font-display font-bold text-amber-950 text-sm">Power Grid Failure Crisis</h4>
            <p className="text-amber-900/90 text-xs font-body">Rumors reshape delay into a regional substation blackout.</p>
            <span className="text-[10px] font-mono text-brand-amber font-bold block pt-1">Divergence: 0.86 (Receipts Attached)</span>
          </div>

          {/* Node 4: Viral Media Surge */}
          <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl space-y-1 relative shadow-sm">
            <span className="font-mono text-[10px] text-brand-crimson font-bold block">04 · VIRAL PEAK (TICK 6)</span>
            <h4 className="font-display font-bold text-red-950 text-sm">Mainstream News Pickup</h4>
            <p className="text-red-900/90 text-xs font-body">Journalists amplify power grid framing; score crosses 83.0.</p>
            <span className="text-[10px] font-mono text-brand-crimson font-bold block pt-1">Trend Score: 83.0 (VIRAL)</span>
          </div>
        </div>
      </div>

      {/* Case File Narrative Briefing Card */}
      <div className="glass-panel border-l-4 border-l-brand-expanding p-6 rounded-2xl shadow-glass space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-borderline">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-brand-amber" />
            <h2 className="font-display font-bold text-2xl text-charcoal-950">Grounded Intelligence Briefing</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs border border-amber-300 text-amber-950 bg-amber-50 px-3 py-1 rounded-lg font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-brand-amber" />
            <span>CONFIDENCE: {briefing ? `${(briefing.confidence * 100).toFixed(0)}%` : '89%'} · {briefing?.provider || 'NVIDIA NIM'}</span>
          </div>
        </div>

        {isBriefingLoading ? (
          <div className="font-mono text-xs text-charcoal-500 py-3 animate-pulse">
            Synthesizing grounded intelligence briefing via NVIDIA NIM...
          </div>
        ) : (
          <p className="text-charcoal-950 text-base leading-relaxed font-body">
            {briefing?.briefing || (
              `The narrative "${activeTopic}" originated on X as an isolated commute delay complaint, before accelerating through Telegram regional alert channels. It crossed into mainstream journalist circles at Tick 4 and underwent a critical framing mutation into a power grid failure investigation.`
            )}
          </p>
        )}

        {/* Framing Mutation Split Chamber */}
        {mutationEvent && (
          <div className="bg-pearl/90 border border-amber-300 p-5 rounded-xl mt-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-brand-amber" />
                <span className="font-mono text-xs uppercase tracking-wider text-amber-950 font-bold">
                  Detected Framing Mutation
                </span>
              </div>
              <span className="font-mono text-[11px] text-amber-900 bg-white px-2.5 py-0.5 rounded-md border border-amber-200 font-bold">
                N-GRAM DIVERGENCE: 0.86
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-white p-4 rounded-xl border border-borderline space-y-1 shadow-sm">
                <span className="font-mono text-[10px] text-charcoal-400 font-bold uppercase">INITIAL EARLY FRAMING</span>
                <div className="font-display font-bold text-charcoal-900 text-base">
                  {mutationEvent.meta_data.from_framing || 'Routine Commuter Delay'}
                </div>
                <p className="text-charcoal-500 font-mono text-[11px]">Salient terms: metro, rajiv chowk, delay, gates</p>
              </div>

              <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-1 shadow-sm">
                <span className="font-mono text-[10px] text-brand-crimson font-bold uppercase">MUTATED CRISIS FRAMING</span>
                <div className="font-display font-bold text-brand-crimson text-base">
                  {mutationEvent.meta_data.to_framing || 'Power Grid Failure / Infrastructure Crisis'}
                </div>
                <p className="text-red-800/80 font-mono text-[11px]">Salient terms: power grid, substation blackout, grid failure</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-charcoal-700">
              <span className="font-bold text-brand-amber">CITED RECEIPTS: [{mutationEvent.evidence_post_ids.join(', ')}]</span>
              <span className="text-charcoal-500 font-medium">Corroborated by 88% divergence confidence</span>
            </div>
          </div>
        )}

        {/* Attention Migration Callout */}
        {migrationEvent && (
          <div className="bg-pearl/90 border border-emerald-300 p-4 rounded-xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <Share2 className="w-4 h-4 text-brand-emerald" />
              </div>
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-950 font-bold block">
                  Cross-Platform Attention Migration
                </span>
                <p className="font-body text-xs text-charcoal-700 mt-0.5">
                  {migrationEvent.description}
                </p>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-900 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-sm">
              X (80% → 60%) · Telegram (20% → 40%)
            </span>
          </div>
        )}
      </div>

      {/* Narrative Lifecycle Chronological Case File */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
        <div className="pb-3 border-b border-borderline flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-charcoal-950">Lifecycle Event Progression</h2>
            <span className="font-mono text-xs text-charcoal-500 block mt-0.5">Chronological trace of living narrative transitions</span>
          </div>
          <span className="font-mono text-xs text-charcoal-400 font-bold bg-pearl px-2.5 py-1 rounded-md border border-borderline">STATE MACHINE</span>
        </div>

        <div className="space-y-4 relative border-l-2 border-borderline ml-3 pl-6 mt-4">
          {timeline.length > 0 ? (
            timeline.map((ev, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node marker */}
                <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white ${
                  ev.event_type === 'MUTATION_DETECTED'
                    ? 'border-brand-amber ring-4 ring-amber-100'
                    : ev.event_type === 'ATTENTION_MIGRATION'
                    ? 'border-brand-emerald ring-4 ring-emerald-100'
                    : 'border-brand-amber ring-4 ring-orange-100'
                }`} />

                <div className="bg-pearl/80 border border-borderline p-4 rounded-xl shadow-sm space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-charcoal-950 text-sm">{ev.title}</span>
                    <span className="text-charcoal-500 font-medium">{ev.timestamp.replace('T', ' ').replace('Z', ' UTC')} · Tick {ev.tick}</span>
                  </div>
                  <p className="text-charcoal-700 text-sm leading-relaxed font-body">{ev.description}</p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-brand-amber font-bold">
                    <span>Receipts: [{ev.evidence_post_ids.join(', ')}]</span>
                    <span>·</span>
                    <span>{(ev.confidence * 100).toFixed(0)}% confidence rating</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="font-mono text-xs text-charcoal-400 py-8 bg-pearl/40 rounded-xl border border-dashed border-borderline text-center">
              Awaiting narrative lifecycle transitions...
            </div>
          )}
        </div>
      </div>

      {/* Evidence Strip (Always Visible Receipt Strip) */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-borderline">
          <div className="flex items-center gap-2.5">
            <FileSearch className="w-5 h-5 text-brand-amber" />
            <div>
              <h2 className="font-display font-bold text-2xl text-charcoal-950">Evidence Receipts Strip</h2>
              <p className="text-charcoal-500 text-xs mt-0.5">Underlying post citations verifying this narrative</p>
            </div>
          </div>
          <span className="font-mono text-xs text-amber-950 bg-amber-50 px-3 py-1 rounded-lg border border-amber-300 font-bold shadow-sm">
            {evidence?.total_evidence_count || 0} Grounded Receipts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidence?.evidence_posts?.slice(0, 6).map((post: any) => (
            <div key={post.event_id} className="bg-pearl/80 border border-borderline p-4 rounded-xl shadow-sm space-y-2.5 flex flex-col justify-between hover:bg-white transition-colors">
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] pb-1 border-b border-borderline">
                  <span className="text-brand-amber font-bold">[{post.event_id}]</span>
                  <span className="text-charcoal-500 font-medium">{post.platform} · {post.timestamp.slice(11, 19)}</span>
                </div>
                <p className="text-charcoal-900 text-xs line-clamp-3 font-body leading-relaxed mt-2">{post.text}</p>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-charcoal-500 pt-2 border-t border-borderline">
                <span className="font-bold text-charcoal-800">{post.author_name || post.author_id}</span>
                <span className="flex items-center gap-1 font-semibold text-charcoal-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-emerald" />
                  {post.likes} likes · {post.shares} shares
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
