import React from 'react';
import { useTrajectStore } from '../store/useTrajectStore';
import { Play, Pause, RotateCcw, SkipForward, Shield } from 'lucide-react';

export const TopHeader: React.FC = () => {
  const { replayState, activeTopic, trends, setActiveTopic, startReplay, pauseReplay, resetReplay, stepTick } = useTrajectStore();

  const isRunning = replayState?.is_running || false;
  const currentTick = replayState?.current_tick || 0;
  const totalTicks = replayState?.total_ticks || 10;
  const currentTimestamp = replayState?.current_timestamp
    ? replayState.current_timestamp.replace('T', ' ').replace('Z', ' UTC')
    : '2026-08-24 08:15:00 UTC (Calibrated Stream)';

  return (
    <header className="h-16 glass-panel px-6 flex items-center justify-between select-none sticky top-0 z-20 border-b border-borderline">
      {/* Left: Brand Identity + Replay Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="TRAJECT" className="w-8 h-8 rounded-lg object-contain bg-white border border-borderline shadow-sm p-0.5" />
          <div className="hidden md:block">
            <span className="font-display font-bold text-sm text-charcoal-950 block leading-tight">TRAJECT</span>
            <span className="font-mono text-[9px] text-charcoal-400 font-semibold uppercase tracking-wider block">NTRO PS26152</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs bg-pearl/90 px-3.5 py-1.5 rounded-lg border border-borderline shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            {isRunning && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-crimson opacity-75" />}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-brand-crimson' : 'bg-charcoal-400'}`} />
          </span>
          <span className="font-bold text-charcoal-950 uppercase tracking-tight text-[11px]">Replay Mode</span>
          <span className="text-charcoal-300">/</span>
          <span className="text-charcoal-600 font-semibold text-[11px]">{currentTimestamp}</span>
        </div>

        {/* Quick Narrative Switcher Pills */}
        <div className="hidden xl:flex items-center gap-2">
          <span className="font-mono text-[10px] text-charcoal-400 uppercase font-bold tracking-wider">TOPIC FOCUS:</span>
          <div className="flex gap-1.5">
            {trends.map((t) => (
              <button
                key={t.topic}
                onClick={() => setActiveTopic(t.topic)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  activeTopic === t.topic
                    ? 'bg-charcoal-950 text-white font-bold shadow-sm'
                    : 'bg-white/80 hover:bg-white text-charcoal-700 border border-borderline font-medium'
                }`}
              >
                {t.topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Tactile Hardware Deck */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <div className="flex items-center gap-1.5 bg-pearl px-3 py-1.5 rounded-lg border border-borderline text-[11px]">
          <span className="text-charcoal-500 font-semibold">STREAM TICK:</span>
          <span className="font-bold text-charcoal-950">{currentTick} / {totalTicks}</span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1 bg-white border border-borderline p-1 rounded-xl shadow-sm">
          {isRunning ? (
            <button
              onClick={pauseReplay}
              title="Pause Stream"
              className="p-2 bg-brand-crimson text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={startReplay}
              title="Start Playback"
              className="p-2 bg-charcoal-950 hover:bg-charcoal-800 text-white rounded-lg transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={stepTick}
            title="Step 1 Tick Forward"
            className="p-2 hover:bg-pearl text-charcoal-700 hover:text-charcoal-950 rounded-lg transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetReplay}
            title="Reset to Tick 0"
            className="p-2 hover:bg-pearl text-charcoal-400 hover:text-brand-crimson rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-charcoal-700 bg-white/60 px-3 py-1.5 rounded-lg border border-borderline">
          <Shield className="w-3.5 h-3.5 text-brand-amber" />
          <span className="font-semibold">Zero-Hallucination Protocol</span>
        </div>
      </div>
    </header>
  );
};
