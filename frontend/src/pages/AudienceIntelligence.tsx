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
      <div className="border-b border-hairline pb-4 flex items-baseline justify-between">
        <div>
          <span className="font-mono text-xs text-charcoal-500 uppercase tracking-widest block font-semibold">
            Console 06 / Aggregate Demographics
          </span>
          <h1 className="font-display font-bold text-3xl text-charcoal-900 tracking-tight mt-1">
            Audience Intelligence
          </h1>
          <p className="text-charcoal-500 text-sm mt-1">
            Aggregate demographic distribution and linguistic breakdowns with confidence intervals.
          </p>
        </div>

        {/* Mandatory Responsible-AI Badge */}
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-300 font-bold">
          <ShieldAlert className="w-4 h-4 text-signal-teal" />
          <span>AGGREGATE-ONLY PROTOCOL</span>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-surface border-l-4 border-l-signal-gold border border-hairline p-4 rounded font-mono text-xs text-charcoal-700 shadow-subtle">
        <strong className="text-signal-gold uppercase tracking-wider block mb-1 font-bold">Responsible AI Guardrail:</strong>
        {audience?.disclaimer || "Aggregate statistical estimation from public message metadata — strictly zero individual profiling or sensitive data inference."}
      </div>

      {/* Grid: Age Brackets + Language + Geographic Corridor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Age Brackets */}
        <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-hairline">
            <h2 className="font-display font-semibold text-lg text-charcoal-900">Age Demographics</h2>
            <Users className="w-4 h-4 text-signal-expanding" />
          </div>
          <span className="font-mono text-[10px] text-charcoal-500 block font-medium">Aggregate bracket share with confidence bands</span>

          <div className="space-y-3 font-mono text-xs">
            {audience?.age_brackets.map((b) => (
              <div key={b.bracket} className="space-y-1">
                <div className="flex justify-between text-charcoal-700">
                  <span className="truncate">{b.bracket}</span>
                  <span className="text-charcoal-900 font-bold">{b.percentage}% <span className="text-charcoal-400 text-[10px]">({b.confidence})</span></span>
                </div>
                <div className="w-full bg-subtle h-2 rounded overflow-hidden border border-hairline">
                  <div className="bg-signal-expanding h-full" style={{ width: `${b.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-hairline">
            <h2 className="font-display font-semibold text-lg text-charcoal-900">Language Split</h2>
            <Globe className="w-4 h-4 text-signal-teal" />
          </div>
          <span className="font-mono text-[10px] text-charcoal-500 block font-medium">Corridor message normalization</span>

          <div className="space-y-4 pt-2">
            {audience?.language_distribution.map((lang) => (
              <div key={lang.language} className="bg-subtle p-3 rounded border border-hairline space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-charcoal-900 font-medium">{lang.language}</span>
                  <span className="text-signal-teal font-bold">{lang.percentage}%</span>
                </div>
                <div className="w-full bg-surface h-2 rounded overflow-hidden border border-hairline">
                  <div className="bg-signal-teal h-full" style={{ width: `${lang.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Corridors */}
        <div className="bg-surface border border-hairline p-6 rounded shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-hairline">
            <h2 className="font-display font-semibold text-lg text-charcoal-900">Corridor Geography</h2>
            <MapPin className="w-4 h-4 text-signal-viral" />
          </div>
          <span className="font-mono text-[10px] text-charcoal-500 block font-medium">Transit line focus areas</span>

          <div className="space-y-3 font-mono text-xs">
            {audience?.geographic_corridor.map((geo) => (
              <div key={geo.corridor} className="bg-subtle p-2.5 rounded border border-hairline">
                <div className="flex justify-between text-charcoal-700 mb-1">
                  <span className="truncate">{geo.corridor}</span>
                  <span className="text-signal-viral font-bold">{geo.share}%</span>
                </div>
                <div className="w-full bg-surface h-1.5 rounded overflow-hidden border border-hairline">
                  <div className="bg-signal-viral h-full" style={{ width: `${geo.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
