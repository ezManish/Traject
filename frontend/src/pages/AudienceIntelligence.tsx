import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import type { AudienceData } from '../api/client';
import { Users, ShieldAlert, Globe, MapPin } from 'lucide-react';

export const AudienceIntelligence: React.FC = () => {
  const { activeTopic, trends } = useTrajectStore();
  const [audience, setAudience] = useState<AudienceData | null>(null);

  const currentTrend = trends.find((t) => t.topic === activeTopic);

  useEffect(() => {
    if (activeTopic) {
      api.getTopicAudience(activeTopic).then(setAudience).catch(console.error);
    }
  }, [activeTopic, currentTrend?.tick]);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-ink-border pb-4 flex items-baseline justify-between">
        <div>
          <span className="font-mono text-xs text-mauve-600 uppercase tracking-widest block font-medium">
            Screen 6 · Aggregate Demographics
          </span>
          <h1 className="font-display font-bold text-3xl text-bone tracking-tight mt-1">
            Audience Intelligence
          </h1>
          <p className="text-mauve-400 text-sm mt-1">
            Aggregate demographic distribution and linguistic breakdowns with confidence intervals.
          </p>
        </div>

        {/* Mandatory Responsible-AI Badge */}
        <div className="flex items-center gap-2 font-mono text-xs text-evidence bg-evidence/10 px-3 py-1.5 rounded border border-evidence/40">
          <ShieldAlert className="w-4 h-4 text-evidence" />
          <span>AGGREGATE-ONLY PROTOCOL</span>
        </div>
      </div>

      {/* Mandatory Disclaimer Box (TRD §13) */}
      <div className="bg-ink-surface border-l-4 border-l-evidence border border-ink-border p-4 rounded font-mono text-xs text-mauve-400">
        <strong className="text-evidence uppercase tracking-wider block mb-1">Responsible AI Guardrail:</strong>
        {audience?.disclaimer || "Aggregate statistical estimation from public message metadata — strictly zero individual profiling or sensitive data inference."}
      </div>

      {/* Grid: Age Brackets + Language + Geographic Corridor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Age Brackets */}
        <div className="bg-ink-surface border border-ink-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-bone">Age Demographics</h2>
            <Users className="w-4 h-4 text-stage-expanding" />
          </div>
          <span className="font-mono text-[10px] text-mauve-600 block">Aggregate bracket share with confidence bands</span>

          <div className="space-y-3 font-mono text-xs">
            {audience?.age_brackets.map((b) => (
              <div key={b.bracket} className="space-y-1">
                <div className="flex justify-between text-mauve-400">
                  <span className="truncate">{b.bracket}</span>
                  <span className="text-bone font-semibold">{b.percentage}% <span className="text-mauve-600 text-[10px]">({b.confidence})</span></span>
                </div>
                <div className="w-full bg-ink-base h-2 rounded overflow-hidden border border-ink-border">
                  <div className="bg-stage-expanding h-full" style={{ width: `${b.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-ink-surface border border-ink-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-bone">Language Split</h2>
            <Globe className="w-4 h-4 text-calm" />
          </div>
          <span className="font-mono text-[10px] text-mauve-600 block">Corridor message normalization</span>

          <div className="space-y-4 pt-2">
            {audience?.language_distribution.map((lang) => (
              <div key={lang.language} className="bg-ink-base p-3 rounded border border-ink-border space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-bone font-medium">{lang.language}</span>
                  <span className="text-calm font-semibold">{lang.percentage}%</span>
                </div>
                <div className="w-full bg-ink-raised h-2 rounded overflow-hidden">
                  <div className="bg-calm h-full" style={{ width: `${lang.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Corridors */}
        <div className="bg-ink-surface border border-ink-border p-6 rounded space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-bone">Corridor Geography</h2>
            <MapPin className="w-4 h-4 text-stage-viral" />
          </div>
          <span className="font-mono text-[10px] text-mauve-600 block">Transit line focus areas</span>

          <div className="space-y-3 font-mono text-xs">
            {audience?.geographic_corridor.map((geo) => (
              <div key={geo.corridor} className="bg-ink-base p-2.5 rounded border border-ink-border">
                <div className="flex justify-between text-mauve-400 mb-1">
                  <span className="truncate">{geo.corridor}</span>
                  <span className="text-stage-viral font-semibold">{geo.share}%</span>
                </div>
                <div className="w-full bg-ink-raised h-1.5 rounded overflow-hidden">
                  <div className="bg-stage-viral h-full" style={{ width: `${geo.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
