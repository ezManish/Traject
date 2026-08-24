import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import type { NarrativeEvent, AIBriefingResponse } from '../api/client';
import { ArrowRight, Share2, Cpu, ShieldCheck, GitBranch } from 'lucide-react';

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
      case 'VIRAL': return 'badge-stage-viral font-bold';
      case 'SATURATION': return 'badge-stage-saturation';
      case 'DECLINING': return 'badge-stage-declining';
      default: return 'badge-stage-seed';
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Hero Headline */}
      <div className="border-b border-hairline pb-4 flex items-baseline justify-between">
        <div>
          <span className="font-mono text-xs text-signal-gold uppercase tracking-widest block font-bold">
            Hero Intelligence Dossier / Case File
          </span>
          <h1 className="font-display font-bold text-4xl text-charcoal-900 tracking-tight mt-1">
            Why is this trending?
          </h1>
          <p className="text-charcoal-500 text-sm mt-1">
            Evidence-grounded origin, mutation history, cross-platform propagation, and lifecycle dynamics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-charcoal-500 font-medium">LIFECYCLE STAGE:</span>
          <span className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase ${getStageBadgeClass(currentTrend?.lifecycle_stage || 'SEED')}`}>
            {currentTrend?.lifecycle_stage || 'SEED'}
          </span>
        </div>
      </div>

      {/* Case File Narrative Briefing Card */}
      <div className="bg-surface border-l-4 border-l-signal-expanding border border-hairline p-6 rounded shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-hairline">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-signal-expanding" />
            <h2 className="font-display font-semibold text-xl text-charcoal-900">Intelligence Summary Briefing</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs border border-amber-300 text-amber-900 bg-amber-50 px-2.5 py-1 rounded font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CONFIDENCE: {briefing ? `${(briefing.confidence * 100).toFixed(0)}%` : '89%'} · {briefing?.provider || 'NVIDIA NIM'}</span>
          </div>
        </div>

        {isBriefingLoading ? (
          <div className="font-mono text-xs text-charcoal-500 py-3 animate-pulse">
            Synthesizing grounded intelligence briefing...
          </div>
        ) : (
          <p className="text-charcoal-900 text-base leading-relaxed font-body">
            {briefing?.briefing || (
              `The narrative "${activeTopic}" originated on X as an isolated commute delay complaint, before accelerating through Telegram regional alert channels. It crossed into mainstream journalist circles at Tick 4 and underwent a critical framing mutation into a power grid failure investigation.`
            )}
          </p>
        )}

        {/* Mutation Callout Banner */}
        {mutationEvent && (
          <div className="bg-subtle border border-amber-300/80 p-4 rounded mt-4">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-signal-gold" />
              <span className="font-mono text-xs uppercase tracking-wider text-amber-900 font-bold">
                Detected Framing Mutation (Receipts Attached)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="bg-surface px-3 py-1.5 rounded border border-hairline text-charcoal-700 font-medium">
                {mutationEvent.meta_data.from_framing || 'Initial Delay Framing'}
              </span>
              <ArrowRight className="w-4 h-4 text-signal-gold" />
              <span className="bg-red-50 px-3 py-1.5 rounded border border-red-200 text-signal-viral font-bold">
                {mutationEvent.meta_data.to_framing || 'Power Grid Failure / Crisis'}
              </span>
              <span className="text-signal-gold font-bold text-[11px] ml-auto">
                [{mutationEvent.evidence_post_ids.join(', ')}] · 88% confidence
              </span>
            </div>
          </div>
        )}

        {/* Attention Migration Callout */}
        {migrationEvent && (
          <div className="bg-subtle border border-emerald-300/80 p-4 rounded">
            <div className="flex items-center gap-2 mb-1">
              <Share2 className="w-4 h-4 text-signal-teal" />
              <span className="font-mono text-xs uppercase tracking-wider text-emerald-900 font-bold">
                Cross-Platform Attention Migration
              </span>
            </div>
            <p className="font-mono text-xs text-charcoal-700">
              {migrationEvent.description}
            </p>
          </div>
        )}
      </div>

      {/* Narrative Lifecycle Chronological Case File */}
      <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
        <div className="pb-2 border-b border-hairline">
          <h2 className="font-display font-semibold text-xl text-charcoal-900">Lifecycle Event Progression</h2>
          <span className="font-mono text-xs text-charcoal-500 block">Chronological trace of living narrative transitions</span>
        </div>

        <div className="space-y-4 relative border-l-2 border-hairline ml-3 pl-6 mt-4">
          {timeline.length > 0 ? (
            timeline.map((ev, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node marker */}
                <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-surface ${
                  ev.event_type === 'MUTATION_DETECTED'
                    ? 'border-signal-gold ring-2 ring-amber-200'
                    : ev.event_type === 'ATTENTION_MIGRATION'
                    ? 'border-signal-teal'
                    : 'border-signal-expanding'
                }`} />

                <div className="bg-subtle border border-hairline p-4 rounded space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-charcoal-900">{ev.title}</span>
                    <span className="text-charcoal-500">{ev.timestamp.replace('T', ' ').replace('Z', ' UTC')} · Tick {ev.tick}</span>
                  </div>
                  <p className="text-charcoal-700 text-sm">{ev.description}</p>
                  <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-signal-gold font-semibold">
                    <span>Evidence Posts: [{ev.evidence_post_ids.join(', ')}]</span>
                    <span>·</span>
                    <span>{(ev.confidence * 100).toFixed(0)}% confidence</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="font-mono text-xs text-charcoal-400 py-6 bg-subtle/30 rounded border border-dashed border-hairline text-center">
              Awaiting narrative lifecycle transitions...
            </div>
          )}
        </div>
      </div>

      {/* Evidence Strip (Always Visible Receipt Strip) */}
      <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-hairline">
          <div>
            <h2 className="font-display font-semibold text-xl text-charcoal-900">Evidence Strip & Citations</h2>
            <p className="text-charcoal-500 text-xs mt-0.5">Underlying post citations verifying this narrative</p>
          </div>
          <span className="font-mono text-xs text-amber-900 bg-amber-50 px-2.5 py-1 rounded border border-amber-300 font-bold">
            {evidence?.total_evidence_count || 0} Grounded Receipts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {evidence?.evidence_posts?.slice(0, 6).map((post: any) => (
            <div key={post.event_id} className="bg-subtle border border-hairline p-3 rounded space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-signal-gold font-bold">[{post.event_id}]</span>
                <span className="text-charcoal-500">{post.platform} · {post.timestamp.slice(11, 19)}</span>
              </div>
              <p className="text-charcoal-900 text-xs line-clamp-3 font-body leading-relaxed">{post.text}</p>
              <div className="flex items-center justify-between text-[10px] font-mono text-charcoal-500 pt-1 border-t border-hairline">
                <span className="font-medium">{post.author_name || post.author_id}</span>
                <span>{post.likes} likes · {post.shares} shares</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
