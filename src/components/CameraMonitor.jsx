import React, { useState } from 'react';
import {
  Camera, AlertTriangle, ChevronDown, ChevronUp, Volume2, Radio,
  Wind, ShieldCheck, ShieldAlert, Zap, Layers, RefreshCw, EyeOff
} from 'lucide-react';
import { ALL_ROOMS, VENT_ROOMS } from '../game/gameEngine';
import { soundManager } from '../audio/SoundManager';
import { formatGameClock } from '../utils/clock';

export default function CameraMonitor({
  gameState,
  onSelectCam,
  onToggleMonitor,
  onPlayScare,
  cameraGlitch,
  scareSubtitle,
  showMinutes = false,
  onToggleVentMode,
  onSealVent,
  onStartWindingMahadev,
  onStopWindingMahadev,
  ryanPenetratedMessage = null,
  sjinilHackedMessage = null
}) {
  const [switchingStatic, setSwitchingStatic] = useState(false);
  const [isMapMinimized, setIsMapMinimized] = useState(false);
  const [scareToast, setScareToast] = useState(null);

  const isVents = Boolean(gameState.isVentCamMode);
  const activeRooms = gameState.activeCameras || ALL_ROOMS.slice(0, 6);

  // Active Camera reference
  const activeRoom = isVents
    ? VENT_ROOMS.find(v => v.id === gameState.currentVentCam) || VENT_ROOMS[0]
    : activeRooms.find(r => r.id === gameState.currentCam) || activeRooms[0];

  const handleCameraChange = (camId) => {
    const current = isVents ? gameState.currentVentCam : gameState.currentCam;
    if (camId === current) return;

    soundManager.playStaticBurst(0.12, 0.22);
    setSwitchingStatic(true);
    onSelectCam(camId);
    setTimeout(() => {
      setSwitchingStatic(false);
    }, 100);
  };

  const handleScareClick = () => {
    if (gameState.scareCooldown > 0) return;
    if (gameState.maintenance?.sounds === 'ERROR') {
      setScareToast('AUDIO SYSTEM OFFLINE // REBOOT IN MAINTAIN');
      setTimeout(() => setScareToast(null), 2500);
      return;
    }

    if (onPlayScare) {
      const res = onPlayScare(gameState.currentCam);
      setScareToast('AUDIO LURE BROADCASTED');
      setTimeout(() => setScareToast(null), 2500);
    }
  };

  // Determine threat cutouts in the currently viewed room or vent
  const getActiveRoomThreats = () => {
    const threats = [];

    // VENTS MODE: Track Ritul in the vents
    if (isVents) {
      if (gameState.ritul?.enabled && gameState.ritul.pos === activeRoom.id) {
        threats.push({
          name: 'RITUL',
          photo: './Fnak photos/Enemies/ritul.png',
          pose: 'Crawling in Air Duct',
          posClass: 'bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-44 sm:w-60 md:w-72'
        });
      }
      return threats;
    }

    // ROOMS MODE:
    // 1. Abhishek
    if (gameState.ab?.enabled && gameState.ab.location === activeRoom.id) {
      threats.push({
        name: 'AB',
        photo: './assets/images/ab-cutout.png',
        pose: 'Lurking in Room',
        posClass: 'bottom-8 sm:bottom-10 right-[22%] w-36 sm:w-48 md:w-64'
      });
    }

    // 2. Aadesh
    if (gameState.aadesh?.enabled && gameState.aadesh.location === activeRoom.id) {
      threats.push({
        name: 'AADESH',
        photo: './assets/images/aadesh-frontfacing-cutout.png',
        pose: 'Stalking Corridor',
        posClass: 'bottom-8 sm:bottom-10 left-[30%] w-40 sm:w-52 md:w-64'
      });
    }

    // 3. Dipu
    if (gameState.dipu?.enabled) {
      if (gameState.dipu.room === activeRoom.id && gameState.dipu.stage === 0) {
        threats.push({
          name: 'DIPU',
          photo: './assets/images/dipu-frontfacing-cutout.png',
          pose: 'Dormant in Supply Room',
          posClass: 'bottom-8 sm:bottom-10 left-[24%] w-36 sm:w-48 md:w-60'
        });
      } else if (gameState.dipu.room === activeRoom.id && gameState.dipu.stage === 1) {
        threats.push({
          name: 'DIPU',
          photo: './assets/images/dipu-random-cutout.png',
          pose: 'ALERT! Peeking Out!',
          posClass: 'bottom-6 sm:bottom-8 left-[28%] w-44 sm:w-56 md:w-72'
        });
      } else if (activeRoom.id === 'CORRIDOR_A' && gameState.dipu.stage === 2) {
        threats.push({
          name: 'DIPU',
          photo: './assets/images/dipu-jumpscare-cutout.png',
          pose: 'SPRINTING DOWN CORRIDOR!',
          posClass: 'bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 w-48 sm:w-64 md:w-80'
        });
      }
    }

    // 4. Johann
    if (gameState.johann?.enabled && gameState.johann.location === activeRoom.id) {
      threats.push({
        name: 'JOHANN',
        photo: './Fnak photos/Enemies/johann-2.png',
        pose: 'Roaming Facility',
        posClass: 'bottom-6 sm:bottom-8 left-[20%] w-36 sm:w-48 md:w-60'
      });
    }

    // 5. Mahadev
    if (gameState.mahadev?.enabled) {
      // If player is viewing Mahadev's starting room or when counter is winding down
      const mahadevRoom = activeRooms[0]?.id || 'ROOM_A';
      if (activeRoom.id === mahadevRoom || gameState.mahadev.counter < 40) {
        let photo = './Fnak photos/Enemies/mahadev.png';
        if (gameState.mahadev.counter < 25) {
          photo = './Fnak photos/Enemies/mahadev3.png';
        } else if (gameState.mahadev.counter < 60) {
          photo = './Fnak photos/Enemies/mahadev2.png';
        }
        threats.push({
          name: 'MAHADEV',
          photo,
          pose: `Music Box Counter: ${Math.round(gameState.mahadev.counter)}%`,
          posClass: 'bottom-6 sm:bottom-8 left-[35%] w-40 sm:w-52 md:w-64'
        });
      }
    }

    return threats;
  };

  const activeThreats = getActiveRoomThreats();

  const isCamerasBroken = gameState.maintenance?.cameras === 'ERROR';
  const isSoundsBroken = gameState.maintenance?.sounds === 'ERROR';
  const isScareCooldown = gameState.scareCooldown > 0;
  const cooldownSecs = Math.ceil(gameState.scareCooldown);

  // Vents toggle available if Ritul is chosen OR vents maintenance is enabled
  const canSwitchToVents = Boolean(gameState.ritul?.enabled || gameState.maintenance?.vents);

  return (
    <div className="fixed inset-0 z-45 bg-black flex flex-col justify-between overflow-hidden monitor-flip-up select-none font-mono">
      {/* CCTV Viewport Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-neutral-950 flex items-center justify-center">
        {/* Pre-mounted image for current room or vent */}
        {!isCamerasBroken ? (
          <img
            key={activeRoom.id}
            src={activeRoom.image}
            alt={activeRoom.name}
            loading="eager"
            decoding="sync"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.78] contrast-125 transition-opacity duration-75 opacity-100 z-10"
          />
        ) : (
          <div className="absolute inset-0 z-15 bg-black flex flex-col items-center justify-center static-fuzz text-center p-4">
            <EyeOff size={48} className="text-red-500 animate-pulse mb-3" />
            <h2 className="text-red-500 font-bold text-xl sm:text-2xl tracking-widest">
              VIDEO FEED OFFLINE
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              CAMERA SUBSYSTEM FAILURE • REBOOT IN DESK MAINTENANCE PANEL
            </p>
          </div>
        )}

        {/* THREATS DISPLAY */}
        {!isCamerasBroken && activeThreats.map((threat, idx) => (
          <div
            key={idx}
            className={`absolute ${threat.posClass} z-20 flex flex-col items-center pointer-events-none animate-pulse`}
          >
            <div className="relative flex flex-col items-center">
              <img
                src={threat.photo}
                alt={threat.name}
                loading="eager"
                decoding="sync"
                className="max-h-44 sm:max-h-72 md:max-h-96 w-auto object-contain filter contrast-125 saturate-125 drop-shadow-[0_0_25px_rgba(255,0,0,0.85)]"
              />
              <div className="bg-red-800/95 text-white font-mono text-[8px] sm:text-xs font-bold px-2 py-0.5 rounded border border-red-400 mt-1 uppercase tracking-wider shadow whitespace-nowrap">
                ● {threat.name} — {threat.pose}
              </div>
            </div>
          </div>
        ))}

        {/* Fast Camera Static Glitch Flash on Enemy Movement */}
        {cameraGlitch && (
          <div className="absolute inset-0 z-45 pointer-events-none bg-black flex items-center justify-center">
            <div className="absolute inset-0 static-fuzz opacity-80 pointer-events-none" />
            <div className="absolute top-[30%] inset-x-0 h-3 bg-white/40 mix-blend-screen pointer-events-none" />
            <div className="absolute top-[65%] inset-x-0 h-4 bg-red-600/40 mix-blend-color-dodge pointer-events-none" />
          </div>
        )}

        {/* RYAN PENETRATED YOUR COMPUTER BANNER */}
        {ryanPenetratedMessage && (
          <div className="absolute top-20 inset-x-0 z-50 flex justify-center pointer-events-none animate-bounce">
            <div className="bg-red-950/95 border-3 border-red-500 text-yellow-300 px-5 py-2.5 rounded-xl font-black text-sm sm:text-base md:text-lg shadow-[0_0_40px_rgba(239,68,68,1)] flex items-center gap-2">
              <AlertTriangle size={22} className="text-red-500 animate-spin shrink-0" />
              <span className="glitch-text uppercase tracking-widest">{ryanPenetratedMessage}</span>
            </div>
          </div>
        )}

        {/* SJINIL HACKED COMPUTER BANNER */}
        {sjinilHackedMessage && (
          <div className="absolute top-20 inset-x-0 z-50 flex justify-center pointer-events-none animate-bounce">
            <div className="bg-emerald-950/95 border-3 border-emerald-400 text-emerald-200 px-5 py-2.5 rounded-xl font-black text-sm sm:text-base md:text-lg shadow-[0_0_40px_rgba(16,185,129,1)] flex items-center gap-2">
              <Zap size={22} className="text-emerald-400 animate-ping shrink-0" />
              <span className="uppercase tracking-widest">{sjinilHackedMessage}</span>
            </div>
          </div>
        )}

        {/* Abhishek Scare Audio Subtitle in Cameras */}
        {scareSubtitle && (
          <div className="absolute top-28 inset-x-0 z-35 flex justify-center pointer-events-none animate-bounce">
            <div className="bg-red-950/95 border-2 border-red-500 text-yellow-300 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-[0_0_25px_rgba(239,68,68,0.95)] flex items-center gap-2">
              <Volume2 size={16} className="text-yellow-400 shrink-0" />
              <span>&ldquo;{scareSubtitle}&rdquo;</span>
            </div>
          </div>
        )}

        {/* Dipu Sprint Warning */}
        {gameState.dipu?.enabled && gameState.dipu.stage === 2 && (
          <div className="absolute inset-x-0 top-1/3 z-25 text-center pointer-events-none animate-bounce px-2">
            <div className="inline-flex items-center gap-2 bg-red-950/95 border-2 border-red-500 px-4 py-2 rounded-lg text-red-400 font-bold text-xs sm:text-base shadow-[0_0_30px_rgba(239,68,68,0.9)]">
              <AlertTriangle size={20} className="text-red-500 shrink-0" />
              <span>WARNING: DIPU SPRINTING TO OFFICE DOOR! CLOSE DOOR [D]!</span>
            </div>
          </div>
        )}

        {/* Scare Toast Message */}
        {scareToast && (
          <div className="absolute top-16 inset-x-0 z-35 flex justify-center pointer-events-none animate-pulse">
            <div className="bg-emerald-950/95 border-2 border-emerald-400 text-emerald-200 px-4 py-1.5 rounded-lg text-xs font-bold shadow flex items-center gap-2">
              <Radio size={14} className="text-emerald-400 animate-spin" />
              <span>{scareToast}</span>
            </div>
          </div>
        )}

        {/* Switching Noise Static */}
        {switchingStatic && (
          <div className="absolute inset-0 bg-neutral-900 static-fuzz opacity-95 z-30" />
        )}

        {/* CRT Overlays */}
        <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none mix-blend-color" />
        <div className="absolute inset-0 static-fuzz opacity-15 pointer-events-none" />
        <div className="crt-overlay" />
        <div className="crt-vignette" />

        {/* Top Header Bar */}
        <div className="absolute top-2 sm:top-4 inset-x-2 sm:inset-x-6 z-40 flex justify-between items-start pointer-events-none">
          <div className="flex items-center gap-2 bg-black/85 backdrop-blur px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg border border-neutral-700 shadow-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
            <span className="text-[10px] sm:text-sm font-bold text-red-500 tracking-wider">● REC</span>
            <span className="text-gray-200 text-[10px] sm:text-sm font-semibold truncate max-w-[140px] sm:max-w-none">
              {activeRoom.name} ({activeRoom.sub})
            </span>
            {isVents && (
              <span className="bg-cyan-950 border border-cyan-400 text-cyan-300 text-[8px] sm:text-[10px] px-1.5 py-0.2 rounded font-bold">
                VENT DUCT SYSTEM
              </span>
            )}
          </div>

          <div className="bg-black/85 backdrop-blur px-2.5 sm:px-4 py-1 sm:py-2 rounded-lg border border-neutral-700 shadow-xl text-right">
            <div className="text-xs sm:text-xl font-bold text-white">
              {formatGameClock(gameState.time, gameState.timeProgress, showMinutes)}
            </div>
            <div className="text-[8px] sm:text-xs text-red-400 font-bold">ULTIMATE SHIFT</div>
          </div>
        </div>

        {/* MAHADEV MUSIC BOX WIDGET (If Mahadev enabled) */}
        {gameState.mahadev?.enabled && (
          <div className="absolute top-14 sm:top-18 left-2 sm:left-6 z-40 bg-neutral-950/95 border-2 border-yellow-600/80 p-2 sm:p-2.5 rounded-xl shadow-2xl pointer-events-auto flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-[9px] sm:text-xs font-bold text-yellow-400">
              <Wind size={14} className={gameState.mahadev.isWinding ? 'animate-spin' : ''} />
              <span>MAHADEV COUNTER</span>
            </div>

            {/* Circular / Segmented Gauge */}
            <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-700 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  gameState.mahadev.counter > 50
                    ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                    : gameState.mahadev.counter > 25
                    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                    : 'bg-red-600 animate-pulse shadow-[0_0_12px_#ef4444]'
                }`}
                style={{ width: `${Math.max(0, gameState.mahadev.counter)}%` }}
              />
            </div>

            <div className="flex justify-between w-full text-[8px] sm:text-[9px] font-bold">
              <span className={gameState.mahadev.counter < 25 ? 'text-red-500 animate-ping' : 'text-gray-400'}>
                {Math.round(gameState.mahadev.counter)}%
              </span>
              <span className="text-gray-500">HOLD TO WIND</span>
            </div>

            {/* Hold to wind button */}
            <button
              onMouseDown={onStartWindingMahadev}
              onMouseUp={onStopWindingMahadev}
              onTouchStart={onStartWindingMahadev}
              onTouchEnd={onStopWindingMahadev}
              className={`w-full py-1 sm:py-1.5 px-3 rounded text-[9px] sm:text-[10px] font-bold transition active:scale-95 cursor-pointer shadow flex items-center justify-center gap-1.5 select-none ${
                gameState.mahadev.isWinding
                  ? 'bg-yellow-400 text-black shadow-[0_0_15px_#facc15]'
                  : 'bg-yellow-950 hover:bg-yellow-900 border border-yellow-500 text-yellow-200'
              }`}
            >
              <RefreshCw size={11} className={gameState.mahadev.isWinding ? 'animate-spin' : ''} />
              <span>{gameState.mahadev.isWinding ? 'WINDING...' : 'HOLD TO WIND'}</span>
            </button>
          </div>
        )}

        {/* ASYMMETRICAL BUILDING & VENTS FACILITY MAP (Item 7) */}
        <div className="absolute bottom-11 sm:bottom-16 md:bottom-20 right-2 sm:right-6 z-40 bg-neutral-950/95 backdrop-blur-md border border-emerald-500/80 sm:border-2 p-1.5 sm:p-2.5 rounded-xl shadow-2xl pointer-events-auto w-[230px] sm:w-[320px] md:w-[380px]">
          {/* Map Header */}
          <div className="text-[9px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center justify-between border-b border-emerald-900/60 pb-1">
            <div className="flex items-center gap-1.5">
              <Camera size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>{isVents ? 'VENTILATION DUCT MATRIX' : 'CAMPUS FACILITY BLUEPRINT'}</span>
            </div>

            <div className="flex items-center gap-1">
              {/* SWITCH TO VENTS TOGGLE (Item 21) */}
              {canSwitchToVents && (
                <button
                  onClick={onToggleVentMode}
                  className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                    isVents
                      ? 'bg-cyan-700 hover:bg-cyan-600 border-cyan-400 text-white shadow-[0_0_10px_#22d3ee]'
                      : 'bg-neutral-900 hover:bg-cyan-950 border-neutral-700 text-cyan-300'
                  }`}
                  title={isVents ? 'Switch back to Room Cameras' : 'Switch to Vent Cams to monitor vents'}
                >
                  <Layers size={10} />
                  <span>{isVents ? 'ROOM CAMS' : 'VENTS'}</span>
                </button>
              )}

              <button
                onClick={() => setIsMapMinimized(prev => !prev)}
                className="px-1 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-[8px] transition active:scale-95 cursor-pointer"
              >
                {isMapMinimized ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            </div>
          </div>

          {/* SVG Map Showing Uneven Asymmetrical Layout (Item 7) */}
          {!isMapMinimized && (
            <div className="relative w-full h-[125px] sm:h-[180px] md:h-[220px] bg-black/85 rounded border border-emerald-950 p-1 flex items-center justify-center overflow-hidden">
              {!isVents ? (
                /* ASYMMETRICAL BUILDING ARCHITECTURAL BLUEPRINT */
                <svg viewBox="0 0 480 350" className="w-full h-full">
                  {/* Corridors / Pathways between uneven rooms */}
                  {/* North Wing corridor */}
                  <line x1="240" y1="90" x2="240" y2="155" stroke="#064e3b" strokeWidth="5" strokeLinecap="round" />
                  <line x1="240" y1="90" x2="240" y2="155" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Central Spine: Corridor A to Corridor C */}
                  <line x1="240" y1="170" x2="240" y2="235" stroke="#064e3b" strokeWidth="6" strokeLinecap="round" />
                  <line x1="240" y1="170" x2="240" y2="235" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

                  {/* West hallway: Corridor A to Corridor X */}
                  <line x1="190" y1="155" x2="150" y2="155" stroke="#064e3b" strokeWidth="5" />
                  <line x1="190" y1="155" x2="150" y2="155" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />

                  {/* East hallway: Corridor A to Stairs */}
                  <line x1="290" y1="155" x2="320" y2="155" stroke="#064e3b" strokeWidth="5" />
                  <line x1="290" y1="155" x2="320" y2="155" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />

                  {/* Balcony NW link */}
                  <line x1="145" y1="75" x2="195" y2="75" stroke="#064e3b" strokeWidth="4" strokeDasharray="2 2" />

                  {/* Supply Hall Corridor B SW link */}
                  <line x1="140" y1="225" x2="195" y2="235" stroke="#064e3b" strokeWidth="5" />
                  <line x1="140" y1="225" x2="195" y2="235" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />

                  {/* Stairs to B-127 link */}
                  <line x1="365" y1="140" x2="370" y2="90" stroke="#064e3b" strokeWidth="4" strokeDasharray="2 2" />

                  {/* Elevator link */}
                  <line x1="365" y1="170" x2="370" y2="220" stroke="#064e3b" strokeWidth="4" strokeDasharray="2 2" />

                  {/* Corridor C down to Office */}
                  <line x1="240" y1="250" x2="240" y2="295" stroke="#047857" strokeWidth="6" strokeDasharray="3 3" />

                  {/* Interactive Room Nodes for Selected Rooms */}
                  {activeRooms.map(room => {
                    const isSelected = room.id === gameState.currentCam;
                    const rx = room.cx - room.w / 2;
                    const ry = room.cy - room.h / 2;

                    return (
                      <g
                        key={room.id}
                        onClick={() => handleCameraChange(room.id)}
                        className="cursor-pointer group"
                      >
                        {isSelected && (
                          <rect
                            x={rx - 2}
                            y={ry - 2}
                            width={room.w + 4}
                            height={room.h + 4}
                            rx="5"
                            fill="none"
                            stroke="#34d399"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        )}
                        <rect
                          x={rx}
                          y={ry}
                          width={room.w}
                          height={room.h}
                          rx="4"
                          fill={isSelected ? '#064e3b' : '#141414'}
                          stroke={isSelected ? '#10b981' : '#404040'}
                          strokeWidth={isSelected ? '2' : '1'}
                          className="transition group-hover:fill-neutral-800"
                        />
                        <text
                          x={room.cx}
                          y={room.cy - 1}
                          textAnchor="middle"
                          fill={isSelected ? '#a7f3d0' : '#f3f4f6'}
                          fontSize="8.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {room.name}
                        </text>
                        <text
                          x={room.cx}
                          y={room.cy + 9}
                          textAnchor="middle"
                          fill={isSelected ? '#6ee7b7' : '#9ca3af'}
                          fontSize="7"
                          fontFamily="monospace"
                        >
                          {room.sub}
                        </text>
                      </g>
                    );
                  })}

                  {/* Office Marker */}
                  <g transform="translate(240, 312)">
                    <rect x="-50" y="-10" width="100" height="20" rx="4" fill="#022c22" stroke="#059669" strokeWidth="1.5" />
                    <circle cx="-38" cy="0" r="3" fill="#34d399" className="animate-ping" />
                    <circle cx="-38" cy="0" r="1.8" fill="#10b981" />
                    <text x="6" y="3.5" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold" fontFamily="monospace">
                      YOU (OFFICE)
                    </text>
                  </g>
                </svg>
              ) : (
                /* VENTILATION DUCTWORK MAP (Item 21) */
                <svg viewBox="0 0 420 280" className="w-full h-full">
                  {/* Duct Pipes */}
                  <line x1="80" y1="60" x2="200" y2="60" stroke="#083344" strokeWidth="8" strokeLinecap="round" />
                  <line x1="80" y1="60" x2="200" y2="60" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />

                  <line x1="200" y1="60" x2="200" y2="150" stroke="#083344" strokeWidth="8" strokeLinecap="round" />
                  <line x1="200" y1="60" x2="200" y2="150" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />

                  <line x1="200" y1="150" x2="320" y2="150" stroke="#083344" strokeWidth="8" strokeLinecap="round" />
                  <line x1="200" y1="150" x2="320" y2="150" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />

                  <line x1="320" y1="150" x2="320" y2="240" stroke="#083344" strokeWidth="8" strokeLinecap="round" />
                  <line x1="320" y1="150" x2="320" y2="240" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Vent Nodes */}
                  {VENT_ROOMS.map(vent => {
                    const isSelected = vent.id === gameState.currentVentCam;
                    const isSealed = gameState.ritul?.sealedVent === vent.id;
                    const rx = vent.cx - vent.w / 2;
                    const ry = vent.cy - vent.h / 2;

                    return (
                      <g
                        key={vent.id}
                        onClick={() => handleCameraChange(vent.id)}
                        className="cursor-pointer group"
                      >
                        {isSelected && (
                          <rect
                            x={rx - 2}
                            y={ry - 2}
                            width={vent.w + 4}
                            height={vent.h + 4}
                            rx="5"
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        )}
                        <rect
                          x={rx}
                          y={ry}
                          width={vent.w}
                          height={vent.h}
                          rx="4"
                          fill={isSealed ? '#7f1d1d' : isSelected ? '#164e63' : '#111827'}
                          stroke={isSealed ? '#ef4444' : isSelected ? '#06b6d4' : '#374151'}
                          strokeWidth="1.5"
                          className="transition group-hover:fill-neutral-800"
                        />
                        <text
                          x={vent.cx}
                          y={vent.cy - 1}
                          textAnchor="middle"
                          fill={isSealed ? '#fca5a5' : isSelected ? '#a5f3fc' : '#e5e7eb'}
                          fontSize="8.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {vent.name}
                        </text>
                        <text
                          x={vent.cx}
                          y={vent.cy + 9}
                          textAnchor="middle"
                          fill={isSealed ? '#f87171' : isSelected ? '#67e8f9' : '#9ca3af'}
                          fontSize="7"
                          fontFamily="monospace"
                        >
                          {isSealed ? '[SEALED]' : vent.sub}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          )}

          {/* VENT SEAL TOGGLE BUTTON (When in Vents Mode) */}
          {isVents && (
            <div className="pt-1 border-t border-cyan-900/50 mt-1">
              <button
                onClick={() => onSealVent(activeRoom.id)}
                className={`w-full py-1 rounded text-[8px] sm:text-[9.5px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow cursor-pointer ${
                  gameState.ritul?.sealedVent === activeRoom.id
                    ? 'bg-red-700 hover:bg-red-600 text-white border border-red-400'
                    : 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200'
                }`}
              >
                {gameState.ritul?.sealedVent === activeRoom.id ? (
                  <>
                    <ShieldAlert size={12} className="text-yellow-300" />
                    <span>UNSEAL {activeRoom.name}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={12} className="text-cyan-400" />
                    <span>SEAL {activeRoom.name} AGAINST RITUL</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* SCARE AUDIO BUTTON (When in Normal Rooms Mode) */}
          {!isVents && (
            <div className="pt-1 border-t border-emerald-900/50 mt-1">
              <button
                onClick={handleScareClick}
                disabled={isScareCooldown || isSoundsBroken}
                className={`w-full py-1 sm:py-1.5 rounded font-mono text-[8px] sm:text-[9.5px] font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow cursor-pointer ${
                  isSoundsBroken
                    ? 'bg-neutral-900 text-red-400 border border-red-700 cursor-not-allowed'
                    : isScareCooldown
                    ? 'bg-neutral-800 text-neutral-400 border border-neutral-700 cursor-not-allowed'
                    : 'bg-red-700 hover:bg-red-600 text-white border border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse'
                }`}
                title={isSoundsBroken ? 'Sounds subsystem offline' : isScareCooldown ? `Cooldown (${cooldownSecs}s)` : `Play Scare Audio in ${activeRoom.name} [A]`}
              >
                <Volume2 size={12} className={isScareCooldown || isSoundsBroken ? 'text-neutral-500' : 'text-yellow-300'} />
                <span>
                  {isSoundsBroken
                    ? 'SOUNDS OFFLINE (REBOOT IN MAINTAIN)'
                    : isScareCooldown
                    ? `SCARE COOLDOWN (${cooldownSecs}s)`
                    : `🔊 SCARE ABHISHEK IN ${activeRoom.name}`}
                </span>
              </button>
            </div>
          )}

          {/* Quick-Switch Buttons Strip */}
          <div className="flex gap-1 pt-1 border-t border-neutral-800 mt-1 overflow-x-auto pb-0.5">
            {(isVents ? VENT_ROOMS : activeRooms).map(cam => {
              const current = isVents ? gameState.currentVentCam : gameState.currentCam;
              const isSelected = cam.id === current;

              return (
                <button
                  key={cam.id}
                  onClick={() => handleCameraChange(cam.id)}
                  className={`py-0.5 px-1.5 rounded text-[7.5px] sm:text-[8.5px] font-bold transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? isVents
                        ? 'bg-cyan-600 text-white shadow-[0_0_8px_#06b6d4]'
                        : 'bg-emerald-600 text-white shadow-[0_0_8px_#10b981]'
                      : 'bg-black/70 text-gray-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cam.name}
                </button>
              );
            })}
          </div>

          <div className="mt-0.5 text-[7px] sm:text-[8px] text-gray-400 flex justify-between items-center px-0.5">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>ACTIVE: {activeRoom.name}</span>
            </span>
            <span className={gameState.power > 20 ? 'text-emerald-400 font-bold' : 'text-red-500 font-bold'}>
              POWER: {Math.round(gameState.power)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Clickable Close Monitor Trigger */}
      <div className="relative z-45 flex justify-center pb-1 sm:pb-2.5 bg-gradient-to-t from-black via-black/90 to-transparent pt-1 px-3 pointer-events-auto">
        <button
          onClick={onToggleMonitor}
          className="group w-full max-w-[210px] sm:max-w-md py-1.5 sm:py-2.5 bg-neutral-900/95 hover:bg-neutral-800 border sm:border-2 border-neutral-600 hover:border-red-500 rounded-t-lg transition flex items-center justify-center gap-2 shadow-2xl cursor-pointer active:scale-95"
          title="Close Surveillance [SPACE]"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 group-hover:animate-ping" />
          <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wider text-gray-100 group-hover:text-white uppercase font-mono">
            ▼ CLOSE SURVEILLANCE <span className="hidden sm:inline">[SPACE]</span>
          </span>
        </button>
      </div>
    </div>
  );
}
