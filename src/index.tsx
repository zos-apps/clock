import React, { useState, useEffect } from 'react';
import type { ClockProps } from './types';

const ZClock: React.FC<ClockProps> = ({ className, format = '12h' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    if (format === '24h') {
      return date.toLocaleTimeString('en-US', { hour12: false });
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  };

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours * 30) + (minutes * 0.5);
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  return (
    <div className={`flex flex-col items-center justify-center h-full bg-[#1c1c1c] ${className || ''}`}>
      {/* Analog Clock */}
      <div className="relative w-48 h-48 rounded-full bg-white shadow-lg mb-6">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-gray-800 left-1/2 -translate-x-1/2"
            style={{ transform: `rotate(${i * 30}deg) translateY(2px)`, transformOrigin: '50% 96px' }}
          />
        ))}
        {/* Hour hand */}
        <div
          className="absolute w-1.5 h-14 bg-gray-800 rounded-full left-1/2 bottom-1/2 -translate-x-1/2 origin-bottom"
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        {/* Minute hand */}
        <div
          className="absolute w-1 h-20 bg-gray-600 rounded-full left-1/2 bottom-1/2 -translate-x-1/2 origin-bottom"
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        />
        {/* Second hand */}
        <div
          className="absolute w-0.5 h-20 bg-red-500 rounded-full left-1/2 bottom-1/2 -translate-x-1/2 origin-bottom"
          style={{ transform: `rotate(${secondDeg}deg)` }}
        />
        {/* Center dot */}
        <div className="absolute w-3 h-3 bg-red-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Digital Time */}
      <div className="text-4xl font-light text-white font-mono">
        {formatTime(time)}
      </div>
      <div className="text-gray-400 mt-2">
        {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};

export default ZClock;
