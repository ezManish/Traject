import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import type { ScreenTab } from '../store/useTrajectStore';
import { LayoutDashboard, TrendingUp, BookOpen, Share2, Users, FileText, Activity } from 'lucide-react';

const NAV_ITEMS: Array<{ id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'executive', label: 'EXEC', icon: LayoutDashboard },
  { id: 'trend', label: 'TREND', icon: TrendingUp },
  { id: 'narrative', label: 'JOURNEY', icon: BookOpen },
  { id: 'network', label: 'RADAR', icon: Share2 },
  { id: 'audience', label: 'DEMO', icon: Users },
  { id: 'ai_analyst', label: 'ANALYST', icon: FileText },
];

export const PulseRail: React.FC = () => {
  const { activeTab, setActiveTab, activeTrendHistory } = useTrajectStore();

  const points = React.useMemo(() => {
    if (!activeTrendHistory || activeTrendHistory.length === 0) return '';
    const height = 140;
    const width = 48;
    const maxScore = 100;
    const stepY = height / Math.max(1, activeTrendHistory.length - 1);

    return activeTrendHistory
      .map((item, idx) => {
        const x = (item.composite_score / maxScore) * (width - 14) + 7;
        const y = idx * stepY + 6;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [activeTrendHistory]);

  const latestScore = activeTrendHistory.length > 0 
    ? activeTrendHistory[activeTrendHistory.length - 1].composite_score 
    : 0;

  const latestStage = activeTrendHistory.length > 0
    ? activeTrendHistory[activeTrendHistory.length - 1].lifecycle_stage
    : 'SEED';

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'SEED': return '#8891A1';
      case 'EMERGING': return '#4ADE80';
      case 'EXPANDING': return '#4ADE80';
      case 'VIRAL': return '#FF4D4D';
      case 'SATURATION': return '#FFB020';
      case 'DECLINING': return '#565E6C';
      default: return '#4ADE80';
    }
  };

  const currentColor = getStageColor(latestStage);

  return (
    <aside className="w-[84px] min-w-[84px] h-screen glass-panel flex flex-col items-center justify-between py-4 select-none z-30 fixed left-0 top-0 border-r border-[#262C38] bg-[#12161D]">
      {/* Brand Logo */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-12 h-12 rounded-xl bg-[#0A0D12] flex flex-col items-center justify-center p-1.5 border border-[#262C38] shadow-sm cursor-pointer hover:border-[#4ADE80]/40 transition-colors overflow-hidden">
          <img src="/logo.png" alt="TRAJECT Logo" className="w-full h-full object-contain rounded-lg" />
        </div>
        <span className="text-[9px] font-mono text-[#565E6C] font-bold tracking-wider uppercase mt-0.5">TRAJECT</span>
      </div>

      {/* Kinetic Seismograph Wave Chamber */}
      <div className="w-14 flex flex-col items-center py-1">
        <div className="w-full h-[180px] bg-[#0A0D12] rounded-xl p-1.5 flex flex-col justify-between border border-[#262C38] shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between font-mono text-[8px] text-[#565E6C] font-bold px-0.5">
            <span className="tracking-tighter text-[#4ADE80]">PULSE</span>
            <Activity className="w-2.5 h-2.5 text-[#4ADE80] animate-pulse" />
          </div>
          
          <svg className="w-full h-[120px] overflow-visible">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(74,222,128,0.12)" strokeWidth="1" strokeDasharray="2,2" />
            
            {points && (
              <polyline
                fill="none"
                stroke={currentColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: `drop-shadow(0 0 6px ${currentColor}80)` }}
                points={points}
              />
            )}

            {activeTrendHistory.length > 0 && (
              <circle
                cx={(latestScore / 100) * 34 + 7}
                cy={(activeTrendHistory.length - 1) * (120 / Math.max(1, activeTrendHistory.length - 1))}
                r="3.5"
                fill={currentColor}
                stroke="#E8EAED"
                strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 8px ${currentColor})` }}
              />
            )}
          </svg>

          <div className="text-center font-mono text-[10px] font-bold text-[#E8EAED] bg-[#1A1F29] rounded-md py-0.5 border border-[#262C38] shadow-sm">
            {latestScore.toFixed(0)} <span className="text-[7px] text-[#4ADE80] font-semibold">TS</span>
          </div>
        </div>
      </div>

      {/* Navigation Deck */}
      <nav className="flex flex-col items-center gap-1.5 w-full px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-14 h-11 rounded-xl flex flex-col items-center justify-center transition-all duration-200 relative ${
                isActive
                  ? 'bg-[#4ADE80] text-[#0A0D12] font-bold shadow-[0_0_14px_rgba(74,222,128,0.4)] scale-105 border border-[#4ADE80]'
                  : 'text-[#8891A1] hover:text-[#E8EAED] hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-mono text-[8px] uppercase tracking-wider mt-0.5 font-bold">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Clean bottom anchor */}
      <div className="w-12 h-2" />
    </aside>
  );
};
