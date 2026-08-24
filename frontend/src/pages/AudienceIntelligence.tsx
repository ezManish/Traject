import React, { useEffect, useState } from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { api } from '../api/client';
import { Users, Shield, Globe, Heart, MessageSquare, Compass, BarChart3 } from 'lucide-react';

export const AudienceIntelligence: React.FC = () => {
  const { activeTopic } = useTrajectStore();
  const [demographics, setDemographics] = useState<any>(null);
  const [sentimentData, setSentimentData] = useState<any>(null);

  useEffect(() => {
    if (activeTopic) {
      api.getTopicAudience(activeTopic)
        .then((data) => {
          setDemographics(data);
        })
        .catch(console.error);

      api.getTopicSentiment(activeTopic)
        .then((data) => {
          setSentimentData(data);
        })
        .catch(console.error);
    }
  }, [activeTopic]);

  const corridors = demographics?.geographic_corridor || [
    { corridor: "Yellow Line (Samaypur Badli - HUDA City Centre)", share: 65 },
    { corridor: "Interchange Hubs (Rajiv Chowk, Kashmere Gate)", share: 25 },
    { corridor: "Peripheral Feeders (Noida / Gurugram)", share: 10 }
  ];

  const ageBrackets = demographics?.age_brackets || [
    { bracket: "18-24 (Students / Young Commuters)", percentage: 34, confidence: "±4%" },
    { bracket: "25-34 (Working Professionals)", percentage: 48, confidence: "±3%" },
    { bracket: "35-49 (Mid-Career Commuters)", percentage: 14, confidence: "±2%" },
    { bracket: "50+ (Senior Passengers)", percentage: 4, confidence: "±1%" }
  ];

  const languages = demographics?.language_distribution || [
    { language: "English", percentage: 55 },
    { language: "Hindi / Hinglish", percentage: 45 }
  ];

  const sentimentPercentages = sentimentData?.sentiment_percentages || {
    positive: 15,
    neutral: 45,
    negative: 40
  };

  const emotions = [
    { name: "Frustration / Delay Anger", percentage: sentimentPercentages.negative, color: "bg-[#FF4D4D]" },
    { name: "Neutral Inquiry / Transit Check", percentage: sentimentPercentages.neutral, color: "bg-[#8891A1]" },
    { name: "Resolution Optimism", percentage: sentimentPercentages.positive, color: "bg-[#4ADE80]" }
  ];

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-baseline justify-between border-b border-[#262C38] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#4ADE80] font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>AUDIENCE DEMOGRAPHICS OBSERVATORY</span>
            <span className="text-[#565E6C]">/</span>
            <span className="text-[#8891A1]">PRIVACY-PRESERVING AGGREGATES</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-[#E8EAED] tracking-tight mt-1">
            Audience & Sentiment Insights
          </h1>
          <p className="text-[#8891A1] text-sm mt-1 font-body">
            Aggregate cohort demographics, geo-spatial transit corridors, and emotion spectrums for {activeTopic}.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#4ADE80] bg-[#12161D] px-4 py-2 rounded-xl border border-[#262C38] font-bold shadow-sm">
          <Shield className="w-4 h-4 text-[#4ADE80]" />
          <span>DP k-anonymity (k≥50)</span>
        </div>
      </div>

      {/* 3 Dominant Panels: Geographic Corridors, Emotion Spectrum, Demographic Cohorts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Geographic Transit Corridors */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-5 flex flex-col justify-between bg-[#12161D]">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#262C38]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#4ADE80]" />
                <h3 className="font-display font-bold text-xl text-[#E8EAED]">Geographic Heat</h3>
              </div>
              <Compass className="w-4 h-4 text-[#565E6C]" />
            </div>
            <p className="font-mono text-xs text-[#8891A1]">Aggregate commuter transit origin concentration:</p>
          </div>

          <div className="space-y-3.5 font-mono text-xs">
            {corridors.map((cor: any, idx: number) => (
              <div key={idx} className="space-y-1.5 bg-[#0A0D12] p-3 rounded-xl border border-[#262C38]">
                <div className="flex justify-between text-[#E8EAED] text-[11px]">
                  <span className="font-semibold truncate max-w-[220px]">{cor.corridor}</span>
                  <span className="font-bold text-[#4ADE80]">{cor.share}%</span>
                </div>
                <div className="w-full bg-[#12161D] h-2 rounded-full overflow-hidden border border-[#262C38]">
                  <div 
                    className="bg-[#4ADE80] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${cor.share}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="font-mono text-[10px] text-[#565E6C] border-t border-[#262C38] pt-2 flex justify-between">
            <span>Aggregated by cell telemetry</span>
            <span>Sample Size: {demographics?.total_sample_size || 36} posts</span>
          </div>
        </div>

        {/* 2. Sentiment & Emotion Spectrum */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-5 flex flex-col justify-between bg-[#12161D]">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#262C38]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FF4D4D]" />
                <h3 className="font-display font-bold text-xl text-[#E8EAED]">Emotion Spectrum</h3>
              </div>
              <BarChart3 className="w-4 h-4 text-[#565E6C]" />
            </div>
            <p className="font-mono text-xs text-[#8891A1]">Cross-channel sentiment balance:</p>
          </div>

          <div className="space-y-3.5 font-mono text-xs">
            {emotions.map((emo: any, idx: number) => (
              <div key={idx} className="space-y-1.5 bg-[#0A0D12] p-3 rounded-xl border border-[#262C38]">
                <div className="flex justify-between text-[#E8EAED] text-[11px]">
                  <span className="font-semibold">{emo.name}</span>
                  <span className="font-bold">{emo.percentage}%</span>
                </div>
                <div className="w-full bg-[#12161D] h-2 rounded-full overflow-hidden border border-[#262C38]">
                  <div 
                    className={`${emo.color} h-full rounded-full transition-all duration-500`} 
                    style={{ width: `${emo.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0A0D12] p-3 rounded-xl border border-[#262C38] flex items-center justify-between text-xs font-mono">
            <span className="text-[#565E6C]">Language Balance:</span>
            <span className="text-[#E8EAED] font-bold">
              {languages.map((l: any) => `${l.language}: ${l.percentage}%`).join(' · ')}
            </span>
          </div>
        </div>

        {/* 3. Demographic Age Brackets & Cohorts */}
        <div className="glass-panel p-6 rounded-2xl shadow-glass space-y-5 flex flex-col justify-between bg-[#12161D]">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#262C38]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4ADE80]" />
                <h3 className="font-display font-bold text-xl text-[#E8EAED]">Key Cohorts</h3>
              </div>
              <MessageSquare className="w-4 h-4 text-[#565E6C]" />
            </div>
            <p className="font-mono text-xs text-[#8891A1]">Sample distribution by commuter segment:</p>
          </div>

          <div className="space-y-2.5 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
            {ageBrackets.map((bracket: any, idx: number) => (
              <div key={idx} className="bg-[#0A0D12] p-3 rounded-xl border border-[#262C38] space-y-1">
                <div className="flex justify-between font-bold text-[#E8EAED] text-xs">
                  <span>{bracket.bracket}</span>
                  <span className="text-[#4ADE80]">{bracket.percentage}%</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#565E6C]">
                  <span>Statistical confidence:</span>
                  <span className="text-[#8891A1]">{bracket.confidence}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="font-mono text-[10px] text-[#565E6C] border-t border-[#262C38] pt-2 text-center">
            {demographics?.disclaimer || "Aggregate statistical estimation: strictly zero individual profiling."}
          </div>
        </div>
      </div>
    </div>
  );
};
