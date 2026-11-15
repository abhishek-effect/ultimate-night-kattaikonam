import React, { useEffect } from 'react';
import { soundManager } from '../audio/SoundManager';

export default function NightIntro({ onFinish }) {
  useEffect(() => {
    soundManager.playStaticBurst(0.2, 0.2);

    const timer = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center p-4 select-none">
      <div className="text-center space-y-3 sm:space-y-4 animate-pulse">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-mono tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
          12:00 AM
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono tracking-widest text-red-500 uppercase">
          ULTIMATE NIGHT // SURVIVE UNTIL 6:00 AM
        </h2>
      </div>

      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
