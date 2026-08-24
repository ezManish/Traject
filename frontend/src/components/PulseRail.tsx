import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import type { ScreenTab } from '../store/useTrajectStore';
import { LayoutDashboard, TrendingUp, BookOpen, Share2, Users, FileText, Zap } from 'lucide-react';

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
      case 'SEED': return '#64748B';
      case 'EMERGING': return '#10B981';
      case 'EXPANDING': return '#F59E0B';
      case 'VIRAL': return '#EF4444';
      case 'SATURATION': return '#A855F7';
      case 'DECLINING': return '#64748B';
      default: return '#64748B';
    }
  };

  const currentColor = getStageColor(latestStage);

  return (
    <aside className="w-[84px] min-w-[84px] h-screen glass-panel flex flex-col items-center justify-between py-4 select-none z-30 fixed left-0 top-0 border-r border-borderline">
      {/* Brand Icon */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-12 h-12 rounded-xl bg-card flex flex-col items-center justify-center p-1.5 border border-borderline shadow-md cursor-pointer hover:scale-105 transition-transform overflow-hidden">
          <img src="/logo.png" alt="TRAJECT Logo" className="w-full h-full object-contain rounded-lg" />
        </div>
        <span className="text-[9px] font-mono text-charcoal-400 font-bold tracking-wider uppercase mt-0.5">TRAJECT</span>
      </div>

      {/* Kinetic Seismograph Wave Chamber */}
      <div className="w-14 flex flex-col items-center py-1">
        <div className="w-full h-[180px] bg-[#0C0E17]/80 rounded-xl p-1.5 flex flex-col justify-between border border-borderline shadow-inner relative overflow-hidden">
          <div className="flex items-center justify-between font-mono text-[8px] text-charcoal-400 font-bold px-0.5">
            <span className="tracking-tighter">PULSE</span>
            <Zap className="w-2.5 h-2.5 text-brand-emerald animate-pulse" />
          </div>
          
          <svg className="w-full h-[120px] overflow-visible">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2,2" />
            
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
                stroke="#F8FAFC"
                strokeWidth="2"
                style={{ filter: `drop-shadow(0 0 8px ${currentColor})` }}
              />
            )}
          </svg>

          <div className="text-center font-mono text-[10px] font-bold text-charcoal-950 bg-card rounded-md py-0.5 border border-borderline shadow-sm">
            {latestScore.toFixed(0)} <span className="text-[7px] text-charcoal-400 font-normal">TS</span>
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
                  ? 'bg-brand-emerald text-charcoal-950 font-bold shadow-neon-emerald scale-105'
                  : 'text-charcoal-400 hover:text-charcoal-950 hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-mono text-[8px] uppercase tracking-wider mt-0.5">
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
