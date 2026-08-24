import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import type { ScreenTab } from '../store/useTrajectStore';
import { LayoutDashboard, TrendingUp, BookOpen, Share2, Users, Sparkles } from 'lucide-react';

const NAV_ITEMS: Array<{ id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'executive', label: 'EXEC', icon: LayoutDashboard },
  { id: 'trend', label: 'TREND', icon: TrendingUp },
  { id: 'narrative', label: 'STORY', icon: BookOpen },
  { id: 'network', label: 'GRAPH', icon: Share2 },
  { id: 'audience', label: 'AUDIENCE', icon: Users },
  { id: 'ai_analyst', label: 'ANALYST', icon: Sparkles },
];

export const PulseRail: React.FC = () => {
  const { activeTab, setActiveTab, activeTrendHistory, replayState } = useTrajectStore();

  const points = React.useMemo(() => {
    if (!activeTrendHistory || activeTrendHistory.length === 0) return '';
    const height = 240;
    const width = 48;
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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'SEED': return '#8C6B84';
      case 'EMERGING': return '#B4508A';
      case 'EXPANDING': return '#D42E82';
      case 'VIRAL': return '#FF3D97';
      case 'SATURATION': return '#A61E6B';
      case 'DECLINING': return '#6B4A63';
      case 'DORMANT': return '#3A2E39';
      default: return '#8C6B84';
    }
  };

  return (
    <aside className="w-[72px] min-w-[72px] h-screen bg-ink-surface border-r border-ink-border flex flex-col items-center justify-between py-3 select-none z-30 fixed left-0 top-0">
      {/* Top Logo / Brandmark */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-8 h-8 rounded bg-stage-expanding/20 border border-stage-expanding/50 flex items-center justify-center">
          <span className="font-display font-bold text-stage-expanding text-base leading-none">T</span>
        </div>
        <span className="font-mono text-[8px] text-mauve-600 tracking-widest uppercase">TRJCT</span>
      </div>

      {/* Seismograph Mini Trace */}
      <div className="w-12 flex flex-col items-center my-auto py-1">
        <div className="w-full h-[180px] bg-ink-base/80 border border-ink-border/70 rounded relative overflow-hidden flex flex-col justify-between p-1">
          <span className="font-mono text-[8px] text-mauve-600 tracking-tighter">SCORE</span>
          
          <svg className="w-full h-[130px] overflow-visible">
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#3A2C3F" strokeWidth="1" strokeDasharray="2,2" />
            
            {points && (
              <polyline
                fill="none"
                stroke={getStageColor(latestStage)}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            )}

            {activeTrendHistory.length > 0 && (
              <circle
                cx={(latestScore / 100) * 36 + 6}
                cy={(activeTrendHistory.length - 1) * (130 / Math.max(1, activeTrendHistory.length - 1))}
                r="3"
                fill={getStageColor(latestStage)}
                stroke="#F4EBF1"
                strokeWidth="1"
              />
            )}
          </svg>

          <div className="text-center font-mono text-[10px] font-semibold text-bone">
            {latestScore.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Navigation Notches */}
      <nav className="flex flex-col items-center gap-1.5 w-full px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`w-11 h-10 rounded flex flex-col items-center justify-center transition-all duration-150 relative ${
                isActive
                  ? 'bg-ink-raised text-stage-expanding border-l-2 border-stage-expanding'
                  : 'text-mauve-600 hover:text-mauve-400 hover:bg-ink-raised/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="font-mono text-[7px] uppercase tracking-tighter mt-0.5 font-medium">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute right-1 w-1 h-1 rounded-full bg-stage-expanding" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Tick Indicator at Bottom */}
      <div className="text-center pt-1">
        <span className="font-mono text-[8px] text-mauve-600 block">TICK</span>
        <span className="font-mono text-xs font-semibold text-evidence">
          {replayState ? `${replayState.current_tick}/${replayState.total_ticks}` : '0/10'}
        </span>
      </div>
    </aside>
  );
};
