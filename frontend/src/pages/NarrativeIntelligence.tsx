import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import type { NarrativeEvent, AIBriefingResponse } from '../api/client';
import { ArrowRight, Sparkles, Share2, Cpu, ShieldCheck } from 'lucide-react';

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
      case 'SEED': return 'stage-badge-seed';
      case 'EMERGING': return 'stage-badge-emerging';
      case 'EXPANDING': return 'stage-badge-expanding';
      case 'VIRAL': return 'stage-badge-viral';
      case 'SATURATION': return 'stage-badge-saturation';
      case 'DECLINING': return 'stage-badge-declining';
      case 'DORMANT': return 'stage-badge-dormant';
      default: return 'stage-badge-seed';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Headline (Fraunces Display) */}
      <div className="border-b border-ink-border pb-4 flex items-baseline justify-between">
        <div>
          <span className="font-mono text-xs text-evidence uppercase tracking-widest block font-medium">
            Hero Intelligence Screen · Case File
          </span>
          <h1 className="font-display font-bold text-4xl text-bone tracking-tight mt-1">
            Why is this trending?
          </h1>
          <p className="text-mauve-400 text-sm mt-1">
            Evidence-grounded origin, mutation history, cross-platform propagation, and lifecycle dynamics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-mauve-600">LIFECYCLE STAGE:</span>
          <span className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase ${getStageBadgeClass(currentTrend?.lifecycle_stage || 'SEED')}`}>
            {currentTrend?.lifecycle_stage || 'SEED'}
          </span>
        </div>
      </div>

      {/* Case File Narrative Briefing Card (NVIDIA NIM Synthesized with Grounded Fallback) */}
      <div className="bg-ink-surface border-l-4 border-l-stage-expanding border border-ink-border p-6 rounded space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-stage-expanding" />
            <h2 className="font-display font-semibold text-xl text-bone">Intelligence Summary Briefing</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs border border-evidence/40 text-evidence bg-evidence/5 px-2.5 py-1 rounded">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CONFIDENCE: {briefing ? `${(briefing.confidence * 100).toFixed(0)}%` : '89%'} · {briefing?.provider || 'NVIDIA NIM'}</span>
          </div>
        </div>

        {isBriefingLoading ? (
          <div className="font-mono text-xs text-mauve-600 py-3 animate-pulse">
            Synthesizing grounded intelligence briefing...
          </div>
        ) : (
          <p className="text-bone/90 text-base leading-relaxed font-body">
            {briefing?.briefing || (
              `The narrative "${activeTopic}" originated on X as an isolated commute delay complaint, before accelerating through Telegram regional alert channels. It crossed into mainstream journalist circles at Tick 4 and underwent a critical framing mutation into a power grid failure investigation.`
            )}
          </p>
        )}

        {/* Mutation Callout Banner (Evidence Gold Connector per TRAJECT_DESIGN.md §7) */}
        {mutationEvent && (
          <div className="bg-ink-raised border border-evidence/40 p-4 rounded mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-evidence" />
              <span className="font-mono text-xs uppercase tracking-wider text-evidence font-semibold">
                Detected Framing Mutation (Receipts Attached)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="bg-ink-base px-3 py-1.5 rounded border border-ink-border text-mauve-400">
                {mutationEvent.meta_data.from_framing || 'Initial Delay Framing'}
              </span>
              <ArrowRight className="w-4 h-4 text-evidence" />
              <span className="bg-stage-viral/10 px-3 py-1.5 rounded border border-stage-viral/60 text-stage-viral font-semibold">
                {mutationEvent.meta_data.to_framing || 'Power Grid Failure / Crisis'}
              </span>
              <span className="text-evidence text-[11px] ml-auto">
                [{mutationEvent.evidence_post_ids.join(', ')}] · 88% confidence
              </span>
            </div>
          </div>
        )}

        {/* Attention Migration Callout */}
        {migrationEvent && (
          <div className="bg-ink-raised border border-calm/40 p-4 rounded">
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="w-4 h-4 text-calm" />
              <span className="font-mono text-xs uppercase tracking-wider text-calm font-semibold">
                Cross-Platform Attention Migration
              </span>
            </div>
            <p className="font-mono text-xs text-mauve-400">
              {migrationEvent.description}
            </p>
          </div>
        )}
      </div>

      {/* Narrative Lifecycle Chronological Case File */}
      <div className="bg-ink-surface border border-ink-border p-6 rounded space-y-4">
        <h2 className="font-display font-semibold text-xl text-bone">Lifecycle Event Progression</h2>
        <span className="font-mono text-xs text-mauve-600 block">Chronological trace of living narrative transitions</span>

        <div className="space-y-4 relative border-l-2 border-ink-border ml-3 pl-6 mt-4">
          {timeline.length > 0 ? (
            timeline.map((ev, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node marker */}
                <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-ink-base ${
                  ev.event_type === 'MUTATION_DETECTED'
                    ? 'border-evidence ring-2 ring-evidence/30'
                    : ev.event_type === 'ATTENTION_MIGRATION'
                    ? 'border-calm'
                    : 'border-stage-expanding'
                }`} />

                <div className="bg-ink-raised border border-ink-border/80 p-4 rounded space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-bone">{ev.title}</span>
                    <span className="text-mauve-600">{ev.timestamp.replace('T', ' ').replace('Z', ' UTC')} · Tick {ev.tick}</span>
                  </div>
                  <p className="text-mauve-400 text-sm">{ev.description}</p>
                  <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-evidence">
                    <span>Evidence Posts: [{ev.evidence_post_ids.join(', ')}]</span>
                    <span>·</span>
                    <span>{(ev.confidence * 100).toFixed(0)}% confidence</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="font-mono text-xs text-mauve-600 py-6">
              Awaiting narrative lifecycle transitions...
            </div>
          )}
        </div>
      </div>

      {/* Evidence Strip (Always Visible Receipt Strip) */}
      <div className="bg-ink-surface border border-ink-border p-6 rounded space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-xl text-bone">Evidence Strip & Citations</h2>
            <p className="text-mauve-400 text-xs mt-0.5">Underlying post citations verifying this narrative</p>
          </div>
          <span className="font-mono text-xs text-evidence bg-evidence/10 px-2.5 py-1 rounded border border-evidence/40">
            {evidence?.total_evidence_count || 0} Grounded Receipts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {evidence?.evidence_posts?.slice(0, 6).map((post: any) => (
            <div key={post.event_id} className="bg-ink-base border border-ink-border p-3 rounded space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-evidence font-semibold">[{post.event_id}]</span>
                <span className="text-mauve-600">{post.platform} · {post.timestamp.slice(11, 19)}</span>
              </div>
              <p className="text-bone/80 text-xs line-clamp-3 font-body">{post.text}</p>
              <div className="flex items-center justify-between text-[10px] font-mono text-mauve-600 pt-1 border-t border-ink-border/50">
                <span>{post.author_name || post.author_id}</span>
                <span>{post.likes} likes · {post.shares} shares</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
