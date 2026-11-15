import React, { useState } from 'react';
import { Upload, Folder, Wrench, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DeskMonitor({
  gameState,
  onOpenModal,
  className = '',
  isDisplayFlashing = false,
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!gameState) return null;

  const isBlackout = gameState.isBlackout;
  const isLightOn = gameState.isLightOn && !isBlackout;
  const cooldown = Math.ceil(gameState.omrCooldown || 0);

  const isInternetDown = gameState.maintenance?.internet === 'ERROR';
  const hasMaintError = ['internet', 'cameras', 'sounds', 'vents'].some(s => gameState.maintenance?.[s] === 'ERROR');
  const hasSuspiciousExe = gameState.ryan?.enabled && gameState.ryan.files?.some(f => f.type === 'exe' && !f.deleted);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isBlackout) return;
    onOpenModal();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative select-none cursor-pointer group ${className}`}
      title="Security Desk Terminal: Click to open Upload, Files & Maintain"
    >
      {/* Contact Shadow on Counter Surface */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[72%] h-2.5 bg-black/85 blur-[2.5px] rounded-full pointer-events-none" />

      {/* Outer Monitor Frame (monitor.webp) */}
      <img
        src="./Fnak photos/monitor.webp"
        alt="Security Desk Monitor"
        className={`w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] pointer-events-none transition-all duration-200 group-hover:scale-[1.02] ${
          !isLightOn && !isBlackout ? 'brightness-[0.72] contrast-110' : ''
        } ${isBlackout ? 'brightness-[0.08]' : ''}`}
      />

      {/* Screen Area (Positioned precisely within monitor bezel) */}
      <div
        className={`absolute top-[7.5%] left-[10.5%] w-[79%] h-[62%] rounded-[2px] overflow-hidden flex flex-col justify-between transition-opacity duration-150 ${
          isBlackout ? 'bg-black' : 'bg-neutral-950'
        }`}
      >
        {!isBlackout && (
          <>
            {/* Display pc-wallpaper.jpg from photos directory (Item 11) */}
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none filter brightness-90 contrast-110"
              style={{ backgroundImage: `url('./Fnak photos/pc-wallpaper.jpg')` }}
            />

            {/* Quick screen static flash when an enemy moves */}
            {isDisplayFlashing && (
              <div className="absolute inset-0 z-30 pointer-events-none bg-black flex items-center justify-center">
                <div className="absolute inset-0 static-fuzz opacity-85 pointer-events-none" />
                <div className="absolute top-[35%] inset-x-0 h-1.5 bg-white/50 mix-blend-screen pointer-events-none" />
              </div>
            )}

            {/* Cathode scanlines and vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-black/60 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-70" />

            {/* Desktop Top Status Bar */}
            <div className="relative z-20 bg-black/80 px-1 py-0.5 border-b border-neutral-800 flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-cyan-400">
              <span className="truncate">UNAK-OS v2.0</span>
              <div className="flex items-center gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isInternetDown ? 'bg-red-500 animate-ping' : hasMaintError ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                <span className="text-[6px] sm:text-[7px] text-gray-300">
                  {isInternetDown ? 'NO-NET' : hasMaintError ? 'MAINT!' : 'ONLINE'}
                </span>
              </div>
            </div>

            {/* Center Desktop: 3 Buttons (Upload, Files, Maintain) (Item 11) */}
            <div className="relative z-20 flex-1 flex items-center justify-center p-1 gap-1 sm:gap-2">
              {/* Button 1: Upload */}
              <div className="flex flex-col items-center bg-black/70 hover:bg-cyan-950/80 border border-cyan-500/60 p-1 rounded transition group/btn cursor-pointer">
                <Upload size={14} className="text-cyan-400 group-hover/btn:scale-110" />
                <span className="text-[7px] font-bold text-white mt-0.5 uppercase tracking-tighter">
                  UPLOAD
                </span>
              </div>

              {/* Button 2: Files */}
              <div className="flex flex-col items-center bg-black/70 hover:bg-amber-950/80 border border-amber-500/60 p-1 rounded transition group/btn cursor-pointer relative">
                <Folder size={14} className="text-amber-400 group-hover/btn:scale-110" />
                <span className="text-[7px] font-bold text-white mt-0.5 uppercase tracking-tighter">
                  FILES
                </span>
                {hasSuspiciousExe && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </div>

              {/* Button 3: Maintain */}
              <div className="flex flex-col items-center bg-black/70 hover:bg-emerald-950/80 border border-emerald-500/60 p-1 rounded transition group/btn cursor-pointer relative">
                <Wrench size={14} className="text-emerald-400 group-hover/btn:scale-110" />
                <span className="text-[7px] font-bold text-white mt-0.5 uppercase tracking-tighter">
                  MAINTAIN
                </span>
                {hasMaintError && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </div>
            </div>

            {/* Taskbar at bottom of monitor screen */}
            <div className="relative z-20 bg-black/90 px-1 py-0.5 border-t border-neutral-800 flex items-center justify-between text-[6px] sm:text-[7px] font-mono text-gray-400">
              <span className="text-emerald-400">BATCH #{gameState.omrUploadCount}</span>
              <span className="text-yellow-400 font-bold animate-pulse">CLICK TO OPEN</span>
            </div>
          </>
        )}
      </div>

      {/* Screen Glare Effect */}
      {!isBlackout && (
        <div className="absolute top-[8%] left-[11%] w-[78%] h-[30%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t" />
      )}
    </div>
  );
}
