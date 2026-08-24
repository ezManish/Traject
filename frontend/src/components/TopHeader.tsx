import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { Play, Pause, RotateCcw, SkipForward, Radio, Shield } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { replayState, startReplay, pauseReplay, resetReplay, stepTick } = useTrajectStore();

  const isRunning = replayState?.is_running || false;
  const currentTick = replayState?.current_tick || 0;
  const totalTicks = replayState?.total_ticks || 10;
  const currentTimestamp = replayState?.current_timestamp
    ? replayState.current_timestamp.replace('T', ' ').replace('Z', ' UTC')
    : 'Baseline Calibration (Tick 0)';

  return (
    <header className="h-14 bg-surface border-b border-hairline px-6 flex items-center justify-between select-none sticky top-0 z-20 shadow-subtle">
      {/* Left: Replay Status & Mode Guarantee */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 font-mono text-xs text-charcoal-700 bg-subtle px-3 py-1 rounded border border-hairline">
          <Radio className={`w-3.5 h-3.5 ${isRunning ? 'text-signal-viral animate-pulse' : 'text-charcoal-400'}`} />
          <span className="font-semibold text-charcoal-900">Historical Dataset Replay Mode</span>
          <span className="text-charcoal-400">|</span>
          <span className="text-charcoal-500 font-medium">NTRO PS26152</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-charcoal-500">
          <span>STREAM TIME:</span>
          <span className="text-charcoal-900 font-medium">{currentTimestamp}</span>
        </div>
      </div>

      {/* Right: Tactile Playback Controls */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 bg-subtle px-2.5 py-1 rounded border border-hairline">
          <span className="text-charcoal-500">TICK PROGRESS:</span>
          <span className="font-bold text-charcoal-900">{currentTick} / {totalTicks}</span>
        </div>

        <div className="flex items-center gap-1 bg-surface border border-hairline p-0.5 rounded shadow-subtle">
          {isRunning ? (
            <button
              onClick={pauseReplay}
              title="Pause Replay"
              className="p-1.5 bg-subtle hover:bg-hairline text-charcoal-900 rounded transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={startReplay}
              title="Start Playback"
              className="p-1.5 bg-charcoal-900 hover:bg-charcoal-700 text-surface rounded transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={stepTick}
            title="Step 1 Tick Forward"
            className="p-1.5 hover:bg-subtle text-charcoal-700 hover:text-charcoal-900 rounded transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={resetReplay}
            title="Reset Replay"
            className="p-1.5 hover:bg-subtle text-charcoal-500 hover:text-signal-viral rounded transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-charcoal-500 border-l border-hairline pl-3">
          <Shield className="w-3.5 h-3.5 text-signal-gold" />
          <span>Zero Hallucination Telemetry</span>
        </div>
      </div>
    </header>
  );
};
