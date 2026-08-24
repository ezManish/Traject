import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import type { ScreenTab } from '../store/useTrajectStore';
import { LayoutDashboard, TrendingUp, BookOpen, Share2, Users, FileText } from 'lucide-react';

const NAV_ITEMS: Array<{ id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'executive', label: 'EXEC', icon: LayoutDashboard },
  { id: 'trend', label: 'TREND', icon: TrendingUp },
  { id: 'narrative', label: 'STORY', icon: BookOpen },
  { id: 'network', label: 'GRAPH', icon: Share2 },
  { id: 'audience', label: 'AUDIENCE', icon: Users },
  { id: 'ai_analyst', label: 'ANALYST', icon: FileText },
];

export const PulseRail: React.FC = () => {
  const { activeTab, setActiveTab, activeTrendHistory, replayState } = useTrajectStore();

  const points = React.useMemo(() => {
    if (!activeTrendHistory || activeTrendHistory.length === 0) return '';
    const height = 180;
    const width = 44;
    const maxScore = 100;
    const stepY = height / Math.max(1, activeTrendHistory.length - 1);

    return activeTrendHistory
      .map((item, idx) => {
        const x = (item.composite_score / maxScore) * (width - 12) + 6;
        const y = idx * stepY + 10;
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

  const getStageStrokeColor = (stage: string) => {
    switch (stage) {
      case 'SEED': return '#6C6358';
      case 'EMERGING': return '#2B8A3E';
      case 'EXPANDING': return '#C25E00';
      case 'VIRAL': return '#C92A2A';
      case 'SATURATION': return '#862E9C';
      case 'DECLINING': return '#5C564E';
      default: return '#6C6358';
    }
  };

  return (
    <aside className="w-[72px] min-w-[72px] h-screen bg-surface border-r border-hairline flex flex-col items-center justify-between py-4 select-none z-30 fixed left-0 top-0 shadow-subtle">
      {/* Brand Monogram */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-8 h-8 rounded bg-charcoal-900 flex items-center justify-center text-surface font-bold text-sm font-mono tracking-tighter">
          TR
        </div>
        <span className="font-mono text-[9px] text-charcoal-500 font-semibold tracking-wider">NTRO</span>
      </div>

      {/* Seismograph Instrument Trace */}
      <div className="w-12 flex flex-col items-center my-auto py-2">
        <div className="w-full h-[190px] bg-subtle border border-hairline rounded p-1 flex flex-col justify-between">
          <span className="font-mono text-[8px] text-charcoal-500 font-medium tracking-tight">INTENSITY</span>
          
          <svg className="w-full h-[140px] overflow-visible">
            {/* Center reference grid line */}
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#D5CFC6" strokeWidth="1" strokeDasharray="2,2" />
            
            {points && (
              <polyline
                fill="none"
                stroke={getStageStrokeColor(latestStage)}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            )}

            {activeTrendHistory.length > 0 && (
              <circle
                cx={(latestScore / 100) * 32 + 6}
                cy={(activeTrendHistory.length - 1) * (140 / Math.max(1, activeTrendHistory.length - 1))}
                r="3.5"
                fill={getStageStrokeColor(latestStage)}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            )}
          </svg>

          <div className="text-center font-mono text-[10px] font-bold text-charcoal-900">
            {latestScore.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Navigation Notches */}
      <nav className="flex flex-col items-center gap-1 w-full px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-12 h-10 rounded flex flex-col items-center justify-center transition-colors relative ${
                isActive
                  ? 'bg-subtle text-charcoal-900 font-semibold border-l-2 border-charcoal-900'
                  : 'text-charcoal-500 hover:text-charcoal-900 hover:bg-subtle/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="font-mono text-[8px] uppercase tracking-tight mt-0.5">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Tick Readout */}
      <div className="text-center pt-2 border-t border-hairline w-12">
        <span className="font-mono text-[8px] text-charcoal-400 block font-medium">TICK</span>
        <span className="font-mono text-xs font-bold text-signal-gold">
          {replayState ? `${replayState.current_tick}/${replayState.total_ticks}` : '0/10'}
        </span>
      </div>
    </aside>
  );
};
