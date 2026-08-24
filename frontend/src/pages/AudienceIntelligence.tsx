import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import type { AudienceData } from '../api/client';
import { Users, ShieldAlert, Globe, MapPin, CheckCircle } from 'lucide-react';

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
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="border-b border-borderline pb-5 flex items-baseline justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-brand-amber font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>AGGREGATE DEMOGRAPHICS STUDIO</span>
            <span>/</span>
            <span>PRIVACY-PRESERVING CORRIDOR</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-charcoal-950 tracking-tight mt-1">
            Audience Intelligence
          </h1>
          <p className="text-charcoal-600 text-sm mt-1 font-body">
            Aggregate demographic distribution and linguistic breakdowns with confidence intervals.
          </p>
        </div>

        {/* Mandatory Responsible-AI Badge */}
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-950 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-300 font-bold shadow-sm">
          <ShieldAlert className="w-4 h-4 text-brand-emerald" />
          <span>AGGREGATE-ONLY PROTOCOL</span>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="glass-panel border-l-4 border-l-brand-gold p-5 rounded-2xl font-mono text-xs text-charcoal-700 shadow-glass space-y-1">
        <div className="flex items-center gap-2 text-brand-gold font-bold uppercase tracking-wider text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Responsible AI Guardrail:</span>
        </div>
        <p className="text-charcoal-600 leading-relaxed font-body text-xs">
          {audience?.disclaimer || "Aggregate statistical estimation from public message metadata — strictly zero individual profiling or sensitive data inference."}
        </p>
      </div>

      {/* Grid: Age Brackets + Language + Geographic Corridor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Age Brackets */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <h2 className="font-display font-bold text-xl text-charcoal-950">Age Demographics</h2>
            <Users className="w-5 h-5 text-brand-amber" />
          </div>
          <span className="font-mono text-[10px] text-charcoal-500 block font-semibold">Aggregate bracket share with confidence bands</span>

          <div className="space-y-3 font-mono text-xs pt-1">
            {audience?.age_brackets.map((b) => (
              <div key={b.bracket} className="space-y-1">
                <div className="flex justify-between text-charcoal-700 font-medium">
                  <span className="truncate">{b.bracket}</span>
                  <span className="text-charcoal-950 font-bold">{b.percentage}% <span className="text-charcoal-400 text-[10px]">({b.confidence})</span></span>
                </div>
                <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                  <div className="bg-brand-amber h-full" style={{ width: `${b.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language Distribution */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <h2 className="font-display font-bold text-xl text-charcoal-950">Language Split</h2>
            <Globe className="w-5 h-5 text-brand-emerald" />
          </div>
          <span className="font-mono text-[10px] text-charcoal-500 block font-semibold">Corridor message normalization</span>

          <div className="space-y-4 pt-1">
            {audience?.language_distribution.map((lang) => (
              <div key={lang.language} className="bg-pearl/80 p-3.5 rounded-xl border border-borderline space-y-2 shadow-sm">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-charcoal-950 font-bold">{lang.language}</span>
                  <span className="text-brand-emerald font-bold">{lang.percentage}%</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-borderline">
                  <div className="bg-brand-emerald h-full" style={{ width: `${lang.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Corridors */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-borderline">
            <h2 className="font-display font-bold text-xl text-charcoal-950">Corridor Geography</h2>
            <MapPin className="w-5 h-5 text-brand-crimson" />
          </div>
          <span className="font-mono text-[10px] text-charcoal-500 block font-semibold">Transit line focus areas</span>

          <div className="space-y-3 font-mono text-xs pt-1">
            {audience?.geographic_corridor.map((geo) => (
              <div key={geo.corridor} className="bg-pearl/80 p-3 rounded-xl border border-borderline shadow-sm space-y-1.5">
                <div className="flex justify-between text-charcoal-700 font-medium">
                  <span className="truncate">{geo.corridor}</span>
                  <span className="text-brand-crimson font-bold">{geo.share}%</span>
                </div>
                <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-borderline">
                  <div className="bg-brand-crimson h-full" style={{ width: `${geo.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
