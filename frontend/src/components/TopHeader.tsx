import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { Play, Pause, RotateCcw, SkipForward, Radio } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const {
    replayState,
    startReplay,
    pauseReplay,
    resetReplay,
    stepTick,
    activeTopic,
    setActiveTopic,
    trends
  } = useTrajectStore();

  return (
    <header className="h-14 bg-ink-surface border-b border-ink-border flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Title & Mandatory Honest Mode Label */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-bone tracking-tight">TRAJECT</span>
          <span className="text-mauve-600 font-mono text-xs">·</span>
          <span className="font-mono text-xs text-mauve-400">SIGNAL INTELLIGENCE</span>
        </div>

        {/* Permanent Replay Mode Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-mauve-600/40 bg-ink-raised">
          <Radio className="w-3 h-3 text-evidence animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider text-evidence uppercase font-medium">
            Historical Dataset Replay Mode
          </span>
        </div>
      </div>

      {/* Center Topic Selector */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-mauve-600 uppercase">Focus Narrative:</span>
        <select
          value={activeTopic}
          onChange={(e) => setActiveTopic(e.target.value)}
          className="bg-ink-raised border border-ink-border text-bone text-xs font-mono rounded px-3 py-1 focus:border-evidence focus:outline-none"
        >
          {trends.length > 0 ? (
            trends.map((t) => (
              <option key={t.topic} value={t.topic}>
                {t.topic} ({t.lifecycle_stage} · {t.trend_score.toFixed(0)})
              </option>
            ))
          ) : (
            <option value="Transit System Delay">Transit System Delay (Primary)</option>
          )}
        </select>
      </div>

      {/* Right Replay Controls & Timestamp */}
      <div className="flex items-center gap-4">
        {/* Timestamp Readout */}
        <div className="font-mono text-xs text-mauve-400 flex items-center gap-2 bg-ink-base px-2.5 py-1 rounded border border-ink-border/80">
          <span className="text-mauve-600 text-[10px]">TIME:</span>
          <span>{replayState?.current_timestamp ? replayState.current_timestamp.replace('T', ' ').replace('Z', ' UTC') : 'READY'}</span>
        </div>

        {/* Playback Button Group */}
        <div className="flex items-center gap-1 bg-ink-raised p-1 rounded border border-ink-border">
          {replayState?.is_running ? (
            <button
              onClick={pauseReplay}
              title="Pause Replay"
              className="p-1.5 rounded hover:bg-ink-surface text-bone hover:text-evidence transition-colors"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={startReplay}
              title="Start / Resume Replay"
              className="p-1.5 rounded hover:bg-ink-surface text-stage-expanding hover:text-stage-viral transition-colors"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={stepTick}
            title="Step 1 Tick Forward"
            disabled={replayState?.is_running}
            className="p-1.5 rounded hover:bg-ink-surface text-mauve-400 hover:text-bone disabled:opacity-30 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={resetReplay}
            title="Reset Replay to Tick 0"
            className="p-1.5 rounded hover:bg-ink-surface text-mauve-400 hover:text-stage-viral transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
