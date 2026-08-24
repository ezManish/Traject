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
    <header className="h-12 px-6 flex items-center justify-between select-none sticky top-0 z-20 border-b border-[#262C38]/60 bg-[#12161D]/80 backdrop-blur-sm">
      {/* Left: Discreet Timestamp */}
      <div className="flex items-center gap-2 font-mono text-[10.5px] text-[#565E6C]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]/80" />
        <span className="text-[#8891A1]">{currentTimestamp}</span>
      </div>

      {/* Right: Ultra-Minimal Ghost Controls */}
      <div className="flex items-center gap-1 text-[#565E6C]">
        {isRunning ? (
          <button
            onClick={pauseReplay}
            title="Pause"
            className="p-1.5 hover:text-[#FF4D4D] transition-colors rounded"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={startReplay}
            title="Stream"
            className="p-1.5 hover:text-[#E8EAED] transition-colors rounded"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        <button
          onClick={stepTick}
          title="Step Forward (1 Tick)"
          className="p-1.5 hover:text-[#E8EAED] transition-colors rounded"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={resetReplay}
          title="Reset"
          className="p-1.5 hover:text-[#E8EAED] transition-colors rounded"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
