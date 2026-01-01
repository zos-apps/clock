import { useState, useEffect, useCallback } from 'react';
import type { AppProps } from '@zos-apps/config';
import { useTimer } from '@zos-apps/config';

type Tab = 'clock' | 'stopwatch' | 'timer';

const Clock: React.FC<AppProps> = ({ onClose: _onClose }) => {
  const [tab, setTab] = useState<Tab>('clock');
  const [time, setTime] = useState(new Date());

  // Stopwatch state (manual, needs centisecond precision)
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);

  // Countdown timer using shared hook (seconds precision is fine)
  const {
    elapsed: countdownElapsed,
    isRunning: timerRunning,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimerHook,
  } = useTimer(false);

  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
  const [timerInput, setTimerInput] = useState('5:00');
  const timerTime = Math.max(0, timerDuration - countdownElapsed);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Stopwatch logic (needs 10ms precision)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  // Stop timer when it reaches 0
  useEffect(() => {
    if (timerTime === 0 && timerRunning) {
      stopTimer();
    }
  }, [timerTime, timerRunning, stopTimer]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const formatTimerTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTimerInput = (input: string): number => {
    const parts = input.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return parseInt(input) * 60;
  };

  const setTimerFromInput = useCallback(() => {
    const seconds = parseTimerInput(timerInput);
    if (!isNaN(seconds) && seconds > 0) {
      setTimerDuration(seconds);
      resetTimerHook();
    }
  }, [timerInput, resetTimerHook]);

  return (
    <div className="h-full flex flex-col bg-black text-white">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {(['clock', 'stopwatch', 'timer'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors
              ${tab === t ? 'text-orange-500 border-b-2 border-orange-500' : 'text-white/60 hover:text-white/80'}
            `}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {tab === 'clock' && (
          <div className="text-center">
            <div className="text-6xl font-light tabular-nums">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-2xl text-white/50 mt-2 tabular-nums">
              {time.getSeconds().toString().padStart(2, '0')}
            </div>
            <div className="text-white/40 mt-4">
              {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        )}

        {tab === 'stopwatch' && (
          <div className="text-center">
            <div className="text-5xl font-light tabular-nums mb-8">
              {formatTime(stopwatchTime)}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStopwatchRunning(!stopwatchRunning)}
                className={`px-8 py-3 rounded-full font-medium transition-colors
                  ${stopwatchRunning ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}
                `}
              >
                {stopwatchRunning ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={() => { setStopwatchRunning(false); setStopwatchTime(0); }}
                className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {tab === 'timer' && (
          <div className="text-center">
            {!timerRunning && timerTime === timerDuration ? (
              <div className="mb-8">
                <input
                  type="text"
                  value={timerInput}
                  onChange={e => setTimerInput(e.target.value)}
                  onBlur={setTimerFromInput}
                  className="text-5xl font-light tabular-nums bg-transparent text-center w-48 focus:outline-none border-b border-white/20 focus:border-orange-500"
                  placeholder="5:00"
                />
                <div className="text-white/40 text-sm mt-2">minutes:seconds</div>
              </div>
            ) : (
              <div className="text-5xl font-light tabular-nums mb-8">
                {formatTimerTime(timerTime)}
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (!timerRunning && countdownElapsed === 0) {
                    setTimerFromInput();
                  }
                  timerRunning ? stopTimer() : startTimer();
                }}
                className={`px-8 py-3 rounded-full font-medium transition-colors
                  ${timerRunning ? 'bg-red-600 hover:bg-red-500' : 'bg-orange-600 hover:bg-orange-500'}
                `}
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => {
                  resetTimerHook();
                  setTimerDuration(parseTimerInput(timerInput));
                }}
                className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clock;
