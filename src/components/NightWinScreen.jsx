import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../audio/SoundManager';
import { Trophy, RefreshCw, Home } from 'lucide-react';
import { requestAppFullscreen } from '../utils/fullscreen';

export default function NightWinScreen({ onPlayAgain, onMainMenu }) {
  const [displayedTime, setDisplayedTime] = useState('5:59 AM');

  useEffect(() => {
    soundManager.play6AMChimes();

    const rollTimer = setTimeout(() => {
      setDisplayedTime('6:00 AM');
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (_) {}
    }, 1200);

    return () => clearTimeout(rollTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center p-3 sm:p-6 select-none font-mono">
      <div className="text-center space-y-4 sm:space-y-6 max-w-md w-full max-h-[90dvh] overflow-y-auto bg-neutral-950/80 border-2 border-emerald-500 p-5 sm:p-8 rounded-xl backdrop-blur shadow-[0_0_50px_rgba(16,185,129,0.35)]">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]">
          <Trophy size={28} className="sm:w-8 sm:h-8" />
        </div>

        <div>
          <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-widest text-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.8)]">
            {displayedTime}
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-widest text-white uppercase mt-2">
            SHIFT SURVIVED!
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">
            You survived the Ultimate Night at Kattaikonam.
          </p>
        </div>

        <div className="pt-2 sm:pt-4 space-y-2.5 sm:space-y-3">
          <button
            onClick={() => {
              requestAppFullscreen();
              onPlayAgain();
            }}
            className="w-full py-3 sm:py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded tracking-widest uppercase text-xs sm:text-sm transition shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <RefreshCw size={16} />
            <span>PLAY AGAIN WITH SAME CONFIG</span>
          </button>

          <button
            onClick={onMainMenu}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 font-bold rounded tracking-wider uppercase text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Home size={15} />
            <span>MAIN MENU // CUSTOMIZE</span>
          </button>
        </div>
      </div>

      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
