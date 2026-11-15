import React, { useState, useEffect, useRef } from 'react';
import {
  Clock, Zap, Lock, Unlock, Lightbulb, ShieldAlert, Pause,
  ChevronLeft, ChevronRight, Maximize, Minimize, Volume2, AlertTriangle
} from 'lucide-react';
import { soundManager } from '../audio/SoundManager';
import { getUsageBars } from '../game/gameEngine';
import { isAppFullscreen, toggleAppFullscreen } from '../utils/fullscreen';
import DeskFan from './DeskFan';
import DeskMonitor from './DeskMonitor';
import DeskTerminalModal from './DeskTerminalModal';
import WirePuzzleModal from './WirePuzzleModal';
import { formatGameClock } from '../utils/clock';

export default function OfficeView({
  gameState,
  onToggleDoor,
  onToggleLight,
  onToggleMonitor,
  onToggleMask,
  onPlayScare,
  onPause,
  isDoorBanging,
  onOmrComplete,
  scareSubtitle,
  onActivateGenerator,
  showMinutes = false,
  onToggleClockFormat,
  isDisplayFlashing = false,
  ryanPenetratedMessage = null,
  sjinilHackedMessage = null,
  onRefreshState = () => {}
}) {
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState(false);
  const [isWirePuzzleOpen, setIsWirePuzzleOpen] = useState(false);
  const [panX, setPanX] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isAppFullscreen());
  const containerRef = useRef(null);
  const touchStartXRef = useRef(null);
  const currentPanRef = useRef(0);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(isAppFullscreen());
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Detect orientation
  useEffect(() => {
    const handleResize = () => setIsPortrait(window.innerHeight > window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth mouse panning
  const handleMouseMove = (e) => {
    if (gameState.isMonitorOpen) return;
    const width = window.innerWidth;
    const clientX = e.clientX;
    const ratio = (clientX / width) * 2 - 1;
    const maxPan = isPortrait ? 28 : 12;
    setPanX(ratio * maxPan);
  };

  // Touch Panning
  const handleTouchStart = (e) => {
    if (gameState.isMonitorOpen || !e.touches[0]) return;
    touchStartXRef.current = e.touches[0].clientX;
    currentPanRef.current = panX;
  };

  const handleTouchMove = (e) => {
    if (gameState.isMonitorOpen || touchStartXRef.current === null || !e.touches[0]) return;
    const clientX = e.touches[0].clientX;
    const diff = clientX - touchStartXRef.current;
    const maxPan = isPortrait ? 30 : 16;
    const newPan = currentPanRef.current - (diff / window.innerWidth) * (maxPan * 2.2);
    setPanX(Math.max(-maxPan, Math.min(maxPan, newPan)));
  };

  const handleTouchEnd = () => {
    touchStartXRef.current = null;
  };

  const isLightActive = gameState.isLightOn && !gameState.isBlackout;
  const isDoorLocked = gameState.isDoorClosed && !gameState.isBlackout;
  const isScareCooldown = gameState.scareCooldown > 0;
  const scareSecs = Math.ceil(gameState.scareCooldown);
  const isSoundsBroken = gameState.maintenance?.sounds === 'ERROR';

  const usageBars = typeof gameState?.getUsageBars === 'function' ? gameState.getUsageBars() : getUsageBars(gameState);
  const usageColors = ['bg-emerald-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600'];

  // Threat visibility in office
  const showAadeshAtDoor = gameState.aadesh?.enabled && isLightActive && gameState.aadesh.location === 'BLIND_SPOT' && !isDoorLocked;
  const showABAtDoor = gameState.ab?.enabled && isLightActive && gameState.ab.location === 'DOOR' && !isDoorLocked;
  const showJohannAtDoor = gameState.johann?.enabled && gameState.johann.location === 'DOOR';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-screen min-h-[100dvh] h-[100dvh] overflow-hidden bg-black select-none touch-none ${
        isDoorBanging ? 'door-impact-shake' : ''
      }`}
    >
      {/* Blackout overlay */}
      {gameState.isBlackout && (
        <div className="absolute inset-0 bg-black z-35 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-12 flicker-blackout">
              <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_25px_#22d3ee]" />
              <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_25px_#22d3ee]" />
            </div>
            <p className="text-red-600 font-mono tracking-widest text-sm animate-pulse">TOTAL POWER FAILURE</p>
          </div>
        </div>
      )}

      {/* Panoramic Office Room View */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          width: isPortrait ? '230vw' : '120vw',
          left: isPortrait ? '-65vw' : '-10vw',
          transform: `translateX(${-panX}%)`
        }}
      >
        {/* Layer 1: Lights OFF, Door OPEN */}
        <img
          src="./Fnak photos/Rooms/lights-off-door-open.jpg"
          alt="Office Lights Off Door Open"
          loading="eager"
          decoding="sync"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${
            gameState.isBlackout ? 'brightness-[0.04] contrast-200' : ''
          } ${!isDoorLocked && !isLightActive ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none z-0'}`}
        />

        {/* Layer 2: Lights OFF, Door CLOSED */}
        <img
          src="./Fnak photos/Rooms/lights-off-door-closed.jpg"
          alt="Office Lights Off Door Closed"
          loading="eager"
          decoding="sync"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${
            gameState.isBlackout ? 'brightness-[0.04] contrast-200' : ''
          } ${isDoorLocked && !isLightActive ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none z-0'}`}
        />

        {/* Layer 3: Lights ON, Door OPEN */}
        <img
          src="./Fnak photos/Rooms/lights-on-door-open.jpg"
          alt="Office Lights On Door Open"
          loading="eager"
          decoding="sync"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${
            gameState.isBlackout ? 'brightness-[0.04] contrast-200' : ''
          } ${!isDoorLocked && isLightActive ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none z-0'}`}
        />

        {/* Layer 4: Lights ON, Door CLOSED */}
        <img
          src="./Fnak photos/Rooms/lights-on-door-closed.jpg"
          alt="Office Lights On Door Closed"
          loading="eager"
          decoding="sync"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${
            gameState.isBlackout ? 'brightness-[0.04] contrast-200' : ''
          } ${isDoorLocked && isLightActive ? 'opacity-100 z-1' : 'opacity-0 pointer-events-none z-0'}`}
        />

        {/* RED EYES: Enemy banging on door */}
        {isDoorBanging && !isLightActive && isDoorLocked && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-20"
            viewBox="0 0 640 480"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <filter id="red-eye-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g className="animate-pulse" filter="url(#red-eye-glow)">
              <ellipse cx="376" cy="182" rx="4.5" ry="4" fill="#ff1a1a" />
              <circle cx="376" cy="182" r="2" fill="#ffffff" opacity="0.85" />
              <ellipse cx="402" cy="182" rx="4.5" ry="4" fill="#ff1a1a" />
              <circle cx="402" cy="182" r="2" fill="#ffffff" opacity="0.85" />
            </g>
          </svg>
        )}

        {/* JOHANN SEEN THROUGH CLOSED DOOR WINDOW */}
        {showJohannAtDoor && isDoorLocked && (
          <div className="absolute top-[26%] left-[58%] w-28 sm:w-34 md:w-42 pointer-events-none z-20 transition-all duration-150 animate-pulse">
            <div className="relative overflow-hidden rounded-md border border-neutral-700/60 shadow-[0_0_25px_rgba(255,0,0,0.85)]">
              <img
                src="./Fnak photos/Enemies/johann-3.png"
                alt="Johann peering through window"
                loading="eager"
                className={`w-full object-cover filter contrast-125 ${
                  isLightActive ? 'brightness-110 saturate-125' : 'brightness-[0.6] saturate-75'
                }`}
              />
              <div className="absolute inset-0 bg-cyan-900/20 mix-blend-color-dodge pointer-events-none" />
            </div>
            <div className="bg-red-800/90 text-white font-mono text-[7px] sm:text-[9px] font-bold px-1 py-0.5 rounded text-center mt-0.5 border border-red-500 uppercase tracking-widest shadow">
              ● JOHANN AT DOOR (WEAR MASK!)
            </div>
          </div>
        )}

        {/* JOHANN AT OPEN DOORWAY */}
        {showJohannAtDoor && !isDoorLocked && (
          <div className="absolute top-[18%] left-[53%] w-60 sm:w-68 md:w-80 pointer-events-none z-20 transition-all duration-150 animate-pulse">
            <img
              src="./Fnak photos/Enemies/johann-2.png"
              alt="Johann standing at open doorway"
              loading="eager"
              className="w-full object-contain filter contrast-125 drop-shadow-[0_0_35px_rgba(255,0,0,0.9)]"
            />
          </div>
        )}

        {/* AADESH AT DOORWAY */}
        {showAadeshAtDoor && (
          <div className="absolute top-[22%] left-[54%] w-60 sm:w-64 md:w-84 pointer-events-none animate-pulse z-20 transition-all duration-100">
            <img
              src="./assets/images/aadesh-jumpscare-cutout.png"
              alt="Aadesh at Doorway"
              loading="eager"
              decoding="sync"
              className="w-full object-contain filter contrast-125 drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]"
            />
          </div>
        )}

        {/* AB AT OPEN DOORWAY */}
        {showABAtDoor && (
          <div className="absolute bottom-[14%] left-[52%] w-64 sm:w-72 md:w-96 pointer-events-none animate-pulse z-20 transition-all duration-100">
            <img
              src="./assets/images/ab-cutout.png"
              alt="AB at Open Doorway"
              loading="eager"
              decoding="sync"
              className="w-full object-contain filter contrast-125 drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]"
            />
          </div>
        )}

        {/* AB BREAKING THROUGH CLOSED DOOR WARNING */}
        {gameState.ab?.enabled && gameState.ab.location === 'DOOR' && isDoorLocked && (
          <div className="absolute top-[52%] left-[60.5%] -translate-x-1/2 z-30 pointer-events-none animate-bounce">
            <div className="bg-red-950/95 border-2 border-red-500 text-red-300 font-mono text-[9px] sm:text-xs font-bold px-3 py-1.5 rounded-lg shadow-[0_0_25px_rgba(239,68,68,0.95)] flex items-center gap-1.5">
              <ShieldAlert size={15} className="text-red-500 animate-spin" />
              <span>AB BREAKING IN! SCARE HIM AWAY [A]!</span>
            </div>
          </div>
        )}

        {/* DOOR KNOCK BANG IMPACT */}
        {isDoorBanging && (
          <div className="absolute top-[64%] left-[60.5%] -translate-x-1/2 z-30 pointer-events-none animate-bounce">
            <div className="bg-red-600/90 text-white font-mono font-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-yellow-300 shadow-[0_0_30px_rgba(220,38,38,1)] flex items-center gap-2">
              <ShieldAlert size={18} className="text-yellow-300 animate-spin" />
              <span>BANG! BANG! BANG!</span>
            </div>
          </div>
        )}

        {/* RYAN PENETRATED DESK ALERT */}
        {ryanPenetratedMessage && (
          <div className="absolute top-[48%] left-[24%] -translate-x-1/2 z-35 pointer-events-none animate-bounce">
            <div className="bg-red-950/95 border-2 border-red-500 text-yellow-300 font-mono text-[9px] sm:text-xs font-bold px-3 py-1.5 rounded-lg shadow-[0_0_25px_rgba(239,68,68,0.95)] flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-red-500 animate-spin" />
              <span>{ryanPenetratedMessage}</span>
            </div>
          </div>
        )}

        {/* SJINIL HACKED DESK ALERT */}
        {sjinilHackedMessage && (
          <div className="absolute top-[48%] left-[24%] -translate-x-1/2 z-35 pointer-events-none animate-bounce">
            <div className="bg-emerald-950/95 border-2 border-emerald-400 text-emerald-200 font-mono text-[9px] sm:text-xs font-bold px-3 py-1.5 rounded-lg shadow-[0_0_25px_rgba(16,185,129,0.95)] flex items-center gap-1.5">
              <Zap size={15} className="text-emerald-400 animate-ping" />
              <span>{sjinilHackedMessage}</span>
            </div>
          </div>
        )}

        {/* Auxiliary Power Generator */}
        {Boolean(gameState.isGeneratorAvailable) && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!gameState.isGeneratorUsed) setIsWirePuzzleOpen(true);
            }}
            className={`absolute bottom-[45%] sm:bottom-[46%] md:bottom-[46.5%] left-[3.5%] sm:left-[4%] md:left-[4.5%] pointer-events-auto w-20 h-26 sm:w-26 sm:h-30 md:w-30 md:h-34 lg:w-34 lg:h-38 rounded-xl border-2 transition active:scale-95 flex flex-col justify-between p-1.5 sm:p-2 cursor-pointer shadow-2xl ${
              gameState.isBlackout ? 'z-36' : 'z-18'
            } ${
              gameState.isGeneratorUsed
                ? 'bg-neutral-950/90 border-neutral-800 opacity-60 cursor-not-allowed'
                : gameState.isGeneratorPrimed
                ? 'bg-cyan-950/95 border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.7)] animate-pulse'
                : gameState.isBlackout || gameState.power < 20
                ? 'bg-yellow-950/95 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.9)] animate-pulse'
                : 'bg-neutral-900/90 border-neutral-700 hover:border-yellow-400 shadow-[0_0_15px_rgba(0,0,0,0.8)]'
            }`}
            title="Auxiliary Power Generator"
          >
            <div className="h-2 rounded bg-[repeating-linear-gradient(45deg,#ca8a04,#ca8a04_6px,#171717_6px,#171717_12px)] opacity-80" />
            <div className="flex flex-col items-center justify-center my-auto space-y-1">
              <div className="flex items-center gap-1">
                <Zap
                  size={16}
                  className={
                    gameState.isGeneratorUsed
                      ? 'text-gray-600'
                      : gameState.isGeneratorPrimed
                      ? 'text-cyan-400 animate-pulse'
                      : 'text-yellow-500 animate-pulse'
                  }
                />
                <span className="text-[8px] sm:text-[9.5px] font-black font-mono tracking-widest text-white">
                  GEN-01
                </span>
              </div>
            </div>
            <div className="text-center font-mono text-[6.5px] sm:text-[7.5px] text-gray-400 uppercase tracking-tighter border-t border-neutral-800 pt-0.5">
              {gameState.isGeneratorUsed ? 'DEPLETED' : gameState.isGeneratorPrimed ? 'ARMED (0%)' : '+10-15% AT 0%'}
            </div>
          </div>
        )}

        {/* Scare Subtitle */}
        {scareSubtitle && (
          <div className="absolute top-[38%] right-[11%] sm:right-[13%] z-35 pointer-events-none animate-bounce">
            <div className="bg-red-950/95 border-2 border-red-500 text-yellow-300 font-mono text-[9px] sm:text-xs font-bold px-3 py-1.5 rounded-lg shadow-[0_0_25px_rgba(239,68,68,0.95)] flex items-center gap-1.5 max-w-xs">
              <Volume2 size={15} className="text-yellow-300 shrink-0" />
              <span>&ldquo;{scareSubtitle}&rdquo;</span>
            </div>
          </div>
        )}

        {/* Security Desk Monitor (Item 11) */}
        <div className="absolute bottom-[46%] sm:bottom-[47%] md:bottom-[47.5%] left-[8%] sm:left-[9%] md:left-[10%] z-18 pointer-events-auto w-32 h-28 sm:w-38 sm:h-33 md:w-46 md:h-40 lg:w-52 lg:h-45">
          <DeskMonitor
            gameState={gameState}
            onOpenModal={() => setIsTerminalModalOpen(true)}
            isDisplayFlashing={isDisplayFlashing}
            className="w-full h-full"
          />
        </div>

        {/* Security Mask on Desk */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (!gameState.isBlackout && !gameState.isOmrUploading) onToggleMask();
          }}
          className={`absolute bottom-[44%] sm:bottom-[45%] md:bottom-[45.5%] left-[13.8%] sm:left-[14.5%] md:left-[15%] pointer-events-auto cursor-pointer transition-all duration-150 group active:scale-95 flex flex-col items-center ${
            gameState.isBlackout ? 'z-36' : 'z-20'
          } ${gameState.isMaskOn ? 'opacity-45 scale-95' : 'opacity-95 hover:opacity-100 hover:scale-105'}`}
          title={gameState.isMaskOn ? 'Security Mask (Equipped - Click to Remove) [M]' : 'Security Mask (Click to Wear) [M]'}
        >
          <div className="relative w-14 h-13 sm:w-17 sm:h-16 md:w-21 md:h-19 lg:w-25 lg:h-23 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
            <img
              src="./Fnak photos/mask.webp"
              alt="Security Mask on Desk"
              className={`w-full h-full object-contain pointer-events-none transition duration-200 ${
                gameState.isMaskOn ? 'filter grayscale contrast-75 brightness-75' : 'group-hover:brightness-115'
              }`}
              loading="eager"
            />
          </div>
          <div
            className={`mt-0.5 px-1.5 py-0.5 rounded text-[6.5px] sm:text-[7.5px] font-mono font-bold tracking-wider border shadow-md transition ${
              gameState.isMaskOn
                ? 'bg-neutral-900/90 border-neutral-700 text-neutral-400'
                : 'bg-black/85 border-yellow-500/70 text-yellow-300'
            }`}
          >
            {gameState.isMaskOn ? 'MASK: WORN [M]' : 'MASK: WEAR [M]'}
          </div>
        </div>

        {/* Desk Fan */}
        <div className="absolute bottom-6 sm:bottom-8 left-[16%] sm:left-[17%] z-15 pointer-events-none w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-56">
          <DeskFan isBlackout={gameState.isBlackout} className="w-full h-full" />
        </div>

        {/* Wall Controls Panel (Door, Light, Scare) */}
        <div className="absolute top-1/4 right-[11%] sm:right-[13%] z-25 bg-neutral-950/95 border-2 border-neutral-700 rounded-xl p-2 sm:p-3 shadow-2xl flex flex-col items-center gap-2.5 sm:gap-3.5 backdrop-blur-sm">
          <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 font-mono tracking-widest border-b border-neutral-800 pb-1 w-full text-center">
            DEFENSE PANEL
          </div>

          {/* 1. DOOR LOCK BUTTON */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={onToggleDoor}
              disabled={gameState.isBlackout}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 sm:border-4 flex flex-col items-center justify-center font-bold text-xs transition active:scale-90 shadow-xl cursor-pointer ${
                isDoorLocked
                  ? 'bg-red-700 border-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.9)] animate-pulse'
                  : 'bg-emerald-950 border-emerald-600 text-emerald-300 hover:bg-emerald-900'
              }`}
              title="Toggle Security Door [D]"
            >
              {isDoorLocked ? <Lock size={18} /> : <Unlock size={18} />}
              <span className="text-[8px] sm:text-[9.5px] mt-0.5 tracking-wider font-mono">DOOR</span>
            </button>
            <span className={`text-[8px] sm:text-[9px] font-bold font-mono tracking-wider ${isDoorLocked ? 'text-red-400' : 'text-emerald-400'}`}>
              {isDoorLocked ? '● CLOSED' : '○ OPEN'}
            </span>
          </div>

          {/* 2. HALLWAY LIGHT BUTTON */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={onToggleLight}
              disabled={gameState.isBlackout}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 sm:border-4 flex flex-col items-center justify-center font-bold text-xs transition active:scale-90 shadow-xl cursor-pointer ${
                isLightActive
                  ? 'bg-yellow-400 border-white text-black shadow-[0_0_30px_rgba(250,204,21,1)]'
                  : 'bg-neutral-800 border-neutral-600 text-gray-400 hover:bg-neutral-700 hover:text-white'
              }`}
              title="Toggle Hallway Light [L]"
            >
              <Lightbulb size={18} className={isLightActive ? 'text-black' : 'text-gray-400'} />
              <span className="text-[8px] sm:text-[9.5px] mt-0.5 tracking-wider font-mono">LIGHT</span>
            </button>
            <span className={`text-[8px] sm:text-[9px] font-bold font-mono tracking-wider ${isLightActive ? 'text-yellow-400' : 'text-gray-500'}`}>
              {isLightActive ? '● ON' : '○ OFF'}
            </span>
          </div>

          {/* 3. SCARE AUDIO BUTTON */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={onPlayScare}
              disabled={gameState.isBlackout || isScareCooldown || isSoundsBroken}
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 sm:border-4 flex flex-col items-center justify-center font-bold text-xs transition active:scale-90 shadow-xl cursor-pointer ${
                isSoundsBroken
                  ? 'bg-neutral-900 border-neutral-700 text-red-500 cursor-not-allowed'
                  : isScareCooldown
                  ? 'bg-neutral-800 border-neutral-700 text-gray-500 cursor-not-allowed'
                  : 'bg-red-800 hover:bg-red-700 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-pulse'
              }`}
              title={isSoundsBroken ? 'Sounds subsystem offline' : isScareCooldown ? `Cooldown (${scareSecs}s)` : 'Play Scare Audio [A]'}
            >
              <Volume2 size={16} className={isScareCooldown || isSoundsBroken ? 'text-gray-500' : 'text-yellow-300'} />
              <span className="text-[7.5px] sm:text-[9px] mt-0.5 tracking-wider font-mono">
                {isSoundsBroken ? 'ERR' : isScareCooldown ? `${scareSecs}s` : 'SCARE'}
              </span>
            </button>
            <span className={`text-[8px] sm:text-[9px] font-bold font-mono tracking-wider ${isSoundsBroken ? 'text-red-500' : isScareCooldown ? 'text-neutral-500' : 'text-red-400'}`}>
              {isSoundsBroken ? '● OFFLINE' : isScareCooldown ? `● ${scareSecs}s` : '○ READY'}
            </span>
          </div>
        </div>
      </div>

      {/* FULLSCREEN MASK OVERLAY */}
      {gameState.isMaskOn && (
        <div className="fixed inset-0 z-36 pointer-events-none flex items-center justify-center animate-fadeIn select-none">
          <img
            src="./Fnak photos/mask.webp"
            alt="Security Mask Overlay"
            className="w-full h-full object-cover filter contrast-125 opacity-90"
          />
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          <div className="crt-overlay" />
          <div className="crt-vignette" />
        </div>
      )}

      {/* TOP HUD: Clock & Usage & Power */}
      <div className="fixed top-2 sm:top-4 inset-x-2 sm:inset-x-6 z-30 flex justify-between items-start pointer-events-none">
        {/* Left: Clock */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleClockFormat) onToggleClockFormat();
          }}
          className="bg-black/85 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-neutral-700 shadow-xl pointer-events-auto cursor-pointer"
          title="Click to toggle seconds/minutes display"
        >
          <div className="text-sm sm:text-2xl font-black font-mono tracking-widest text-white">
            {formatGameClock(gameState.time, gameState.timeProgress, showMinutes)}
          </div>
          <div className="text-[9px] sm:text-xs font-bold text-red-500 font-mono">ULTIMATE NIGHT</div>
        </div>

        {/* Right: Power & Usage */}
        <div className="bg-black/85 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-neutral-700 shadow-xl text-right font-mono">
          <div className="flex items-center justify-end gap-1.5">
            <Zap size={14} className={gameState.power > 20 ? 'text-emerald-400' : 'text-red-500 animate-pulse'} />
            <span className={`text-xs sm:text-lg font-black ${gameState.power > 20 ? 'text-emerald-400' : 'text-red-500 animate-pulse'}`}>
              POWER: {Math.round(gameState.power)}%
            </span>
          </div>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-[8px] text-gray-400">USAGE:</span>
            <div className="flex gap-0.5">
              {[0, 1, 2, 3, 4].map(idx => (
                <div
                  key={idx}
                  className={`w-2 h-2.5 rounded-xs transition ${
                    idx < usageBars ? usageColors[idx] : 'bg-neutral-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM MONITOR FLIP TRIGGER */}
      <div className="fixed bottom-0 inset-x-0 z-30 flex justify-center pb-1 sm:pb-3 pointer-events-auto">
        <button
          onClick={onToggleMonitor}
          className="group px-6 sm:px-12 py-2 sm:py-3 bg-neutral-900/95 hover:bg-neutral-800 border-2 border-neutral-600 hover:border-red-500 rounded-t-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-2xl cursor-pointer active:scale-95"
          title="Toggle CCTV Surveillance [SPACE]"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 group-hover:animate-ping" />
          <span className="text-xs sm:text-sm font-bold tracking-widest text-gray-100 group-hover:text-white uppercase font-mono">
            ▲ SURVEILLANCE <span className="hidden sm:inline">[SPACE]</span>
          </span>
        </button>
      </div>

      {/* WIRE PUZZLE MODAL (Auxiliary Generator) */}
      <WirePuzzleModal
        isOpen={isWirePuzzleOpen}
        onClose={() => setIsWirePuzzleOpen(false)}
        gameState={gameState}
        onSuccess={() => {
          setIsWirePuzzleOpen(false);
          if (onActivateGenerator) onActivateGenerator();
        }}
      />

      {/* DESK TERMINAL MODAL (Upload, Files, Maintain) (Items 11-18) */}
      <DeskTerminalModal
        isOpen={isTerminalModalOpen}
        onClose={() => setIsTerminalModalOpen(false)}
        gameState={gameState}
        onCompleteUpload={onOmrComplete}
        onRefreshState={onRefreshState}
      />
    </div>
  );
}
