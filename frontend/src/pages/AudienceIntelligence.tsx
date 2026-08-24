import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import { Users, Shield, Globe, Heart } from 'lucide-react';

export const AudienceIntelligence: React.FC = () => {
  const { activeTopic } = useTrajectStore();
  const [demographics, setDemographics] = useState<any>(null);

  useEffect(() => {
    if (activeTopic) {
      api.getTopicAudience(activeTopic).then(setDemographics).catch(console.error);
    }
  }, [activeTopic]);

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-borderline pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-brand-indigo font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>AUDIENCE DEMOGRAPHICS OBSERVATORY</span>
            <span>/</span>
            <span>PRIVACY-PRESERVING AGGREGATES</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-charcoal-950 tracking-tight mt-1">Audience & Sentiment Insights</h1>
          <p className="text-charcoal-400 text-sm mt-1 font-body">
            Aggregate cohort demographics, geo-spatial concentrations, and emotion spectrums for {activeTopic}.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-brand-emerald bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 font-bold shadow-sm">
          <Shield className="w-4 h-4 text-brand-emerald" />
          <span>DP k-anonymity (k≥50)</span>
        </div>
      </div>

      {/* Aggregate Demographics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Geographic Distribution */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-borderline">
            <Globe className="w-4 h-4 text-brand-indigo" />
            <h3 className="font-display font-bold text-xl text-charcoal-950">Geographic Heat</h3>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {demographics?.locations?.map((loc: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-charcoal-300">
                  <span>{loc.name}</span>
                  <span className="font-bold text-charcoal-950">{loc.percentage}%</span>
                </div>
                <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                  <div className="bg-brand-indigo h-full rounded-full" style={{ width: `${loc.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emotion Spectrum */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-borderline">
            <Heart className="w-4 h-4 text-brand-crimson" />
            <h3 className="font-display font-bold text-xl text-charcoal-950">Emotion Spectrum</h3>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {demographics?.emotions?.map((emo: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-charcoal-300">
                  <span className="capitalize">{emo.emotion}</span>
                  <span className="font-bold text-charcoal-950">{emo.percentage}%</span>
                </div>
                <div className="w-full bg-pearl h-2 rounded-full overflow-hidden border border-borderline">
                  <div 
                    className={`h-full rounded-full ${
                      emo.emotion === 'anger' ? 'bg-brand-crimson' : 
                      emo.emotion === 'anxiety' ? 'bg-brand-amber' : 'bg-brand-emerald'
                    }`} 
                    style={{ width: `${emo.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Cohorts */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-borderline">
            <Users className="w-4 h-4 text-brand-amber" />
            <h3 className="font-display font-bold text-xl text-charcoal-950">Key Cohorts</h3>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {demographics?.cohorts?.map((coh: any, idx: number) => (
              <div key={idx} className="bg-card p-3 rounded-xl border border-borderline space-y-1 shadow-sm">
                <div className="flex justify-between font-bold text-charcoal-950">
                  <span>{coh.name}</span>
                  <span className="text-brand-amber">{coh.share}%</span>
                </div>
                <p className="text-charcoal-400 text-[11px] font-body">{coh.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
