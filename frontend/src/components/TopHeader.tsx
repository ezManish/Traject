import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const {
    replayState,
    startReplay,
    pauseReplay,
    resetReplay,
    stepTick
  } = useTrajectStore();

  const isRunning = replayState?.is_running || false;
  const currentTimestamp = replayState?.current_timestamp
    ? replayState.current_timestamp.replace('T', ' ').replace('Z', ' UTC')
    : '2026-08-24 08:15:00 UTC';

  return (
    <header className="h-16 glass-panel px-6 flex items-center justify-between select-none sticky top-0 z-20 border-b border-borderline">
      {/* Left: Clean Live Timestamp */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 font-mono text-xs bg-pearl/90 px-3.5 py-1.5 rounded-lg border border-borderline shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-emerald shadow-neon-emerald" />
          </span>
          <span className="font-bold text-charcoal-950 uppercase tracking-tight text-[11px]">
            Live Stream
          </span>
          <span className="text-charcoal-400">/</span>
          <span className="text-charcoal-400 font-semibold text-[11px]">{currentTimestamp}</span>
        </div>
      </div>

      {/* Right: Clean Playback Controls */}
      <div className="flex items-center gap-1 bg-card border border-borderline p-1 rounded-xl shadow-sm">
        {isRunning ? (
          <button
            onClick={pauseReplay}
            title="Pause Stream"
            className="p-2 bg-brand-crimson text-white rounded-lg hover:bg-red-600 transition-colors shadow-neon-crimson"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={startReplay}
            title="Start Stream"
            className="p-2 bg-brand-emerald text-charcoal-950 hover:bg-emerald-400 rounded-lg transition-colors font-bold shadow-neon-emerald"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        <button
          onClick={stepTick}
          title="Step Forward"
          className="p-2 hover:bg-white/10 text-charcoal-300 hover:text-white rounded-lg transition-colors"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={resetReplay}
          title="Reset Stream"
          className="p-2 hover:bg-white/10 text-charcoal-400 hover:text-brand-crimson rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
