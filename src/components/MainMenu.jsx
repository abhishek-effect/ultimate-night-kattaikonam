import React, { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Sparkles, Play, Settings, HelpCircle, Users,
  Maximize, Minimize, ShieldAlert, Zap, Lock, Lightbulb, Camera,
  Upload, AlertTriangle, Check, RefreshCw, Layers, Skull, FileText, Download,
  ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, ArrowUpRight, Award
} from 'lucide-react';
import { soundManager } from '../audio/SoundManager';
import {
  ALL_ROOMS, ALL_ENEMIES, UPLOAD_TASKS, DEFAULT_CONFIG
} from '../game/gameEngine';
import RulesModal from './RulesModal';
import { isAppFullscreen, toggleAppFullscreen, requestAppFullscreen } from '../utils/fullscreen';
import {
  getCustomConfig, saveCustomConfig, getTutorialAnswered, setTutorialAnswered
} from '../utils/storage';

export default function MainMenu({
  onStartGame,
  onStartTutorial,
  showMinutes = false,
  onToggleClockFormat
}) {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [showCredits, setShowCredits] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isAppFullscreen());
  const [activeMenuImg, setActiveMenuImg] = useState(0);
  const [isSwitchGlitching, setIsSwitchGlitching] = useState(false);
  const [canInstallPWA, setCanInstallPWA] = useState(Boolean(window.deferredPWAInstallPrompt));
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // setupStep:
  // 0 = Initial Title Screen (PLAY button, Presets, How To Play, Credits)
  // 1 = Step 1: Select Enemies & AI Levels
  // 2 = Step 2: Select Rooms & Map Locations
  // 3 = Step 3: Choose Upload Task & Start Shift
  const [setupStep, setSetupStep] = useState(0);

  // Load saved configuration or fall back to default
  const [config, setConfig] = useState(() => {
    const saved = getCustomConfig();
    if (saved && Array.isArray(saved.selectedRooms) && Array.isArray(saved.selectedEnemies)) {
      return { ...DEFAULT_CONFIG, ...saved };
    }
    return { ...DEFAULT_CONFIG };
  });

  const [errorMessage, setErrorMessage] = useState(null);

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

  // PWA readiness
  useEffect(() => {
    const handlePwaReady = () => setCanInstallPWA(true);
    window.addEventListener('pwa-installable', handlePwaReady);
    return () => window.removeEventListener('pwa-installable', handlePwaReady);
  }, []);

  const handleInstallPWA = async (e) => {
    e?.stopPropagation();
    if (window.deferredPWAInstallPrompt) {
      window.deferredPWAInstallPrompt.prompt();
      const choiceResult = await window.deferredPWAInstallPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        window.deferredPWAInstallPrompt = null;
        setCanInstallPWA(false);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  // Alternating CRT image glitch effect every 1.5 seconds
  useEffect(() => {
    let glitchTimer = null;
    const interval = setInterval(() => {
      setIsSwitchGlitching(true);
      setActiveMenuImg(prev => (prev === 0 ? 1 : 0));
      glitchTimer = setTimeout(() => {
        setIsSwitchGlitching(false);
      }, 180);
    }, 1500);

    return () => {
      clearInterval(interval);
      if (glitchTimer) clearTimeout(glitchTimer);
    };
  }, []);

  // Play Main Menu BGM on mount
  useEffect(() => {
    soundManager.playMenuBgm();
    return () => soundManager.stopMenuBgm();
  }, []);

  const handleToggleFullscreen = (e) => {
    e.stopPropagation();
    toggleAppFullscreen();
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playMenuBgm();
  };

  // --- STEP VALIDATION & NAVIGATION ---
  const validateStep1 = () => {
    const count = config.selectedEnemies?.length || 0;
    if (count < 3 || count > 5) {
      setErrorMessage(`Please select between 3 and 5 enemies before proceeding (currently selected: ${count}).`);
      soundManager.playBlip?.();
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const count = config.selectedRooms?.length || 0;
    if (count < 6 || count > 13) {
      setErrorMessage(`Please select between 6 and 13 rooms before proceeding (currently selected: ${count}).`);
      soundManager.playBlip?.();
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!config.uploadTask) {
      setErrorMessage('Please choose an uploading task to begin your shift.');
      soundManager.playBlip?.();
      return false;
    }
    return true;
  };

  const goToStep = (targetStep) => {
    setErrorMessage(null);

    // If moving forward from Step 1, must validate enemies
    if (setupStep === 1 && targetStep > 1) {
      if (!validateStep1()) return;
    }
    // If moving forward from Step 2, must validate rooms
    if (setupStep === 2 && targetStep > 2) {
      if (!validateStep2()) return;
    }

    soundManager.playBlip?.();
    setSetupStep(targetStep);
  };

  const handleNextStep = () => {
    if (setupStep === 1) {
      if (validateStep1()) goToStep(2);
    } else if (setupStep === 2) {
      if (validateStep2()) goToStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    soundManager.playBlip?.();
    if (setupStep === 1) {
      setSetupStep(0);
    } else if (setupStep === 2) {
      setSetupStep(1);
    } else if (setupStep === 3) {
      setSetupStep(2);
    }
  };

  // --- ENEMY SELECTION HANDLERS ---
  const handleToggleEnemy = (enemyId) => {
    setErrorMessage(null);
    soundManager.playBlip?.();
    setConfig(prev => {
      const current = [...prev.selectedEnemies];
      const isSelected = current.includes(enemyId);

      if (isSelected) {
        if (current.length <= 3) {
          setErrorMessage('You must choose at least 3 enemies (allowed: 3 to 5 enemies).');
          return prev;
        }
        const updated = current.filter(id => id !== enemyId);
        saveCustomConfig({ ...prev, selectedEnemies: updated });
        return { ...prev, selectedEnemies: updated };
      } else {
        if (current.length >= 5) {
          setErrorMessage('You can choose at most 5 enemies (allowed: 3 to 5 enemies).');
          return prev;
        }
        const updated = [...current, enemyId];
        saveCustomConfig({ ...prev, selectedEnemies: updated });
        return { ...prev, selectedEnemies: updated };
      }
    });
  };

  const handleAILevelChange = (enemyId, level) => {
    const val = Math.max(0, Math.min(20, parseInt(level, 10) || 0));
    setConfig(prev => {
      const updatedLevels = { ...prev.enemyLevels, [enemyId]: val };
      const updated = { ...prev, enemyLevels: updatedLevels };
      saveCustomConfig(updated);
      return updated;
    });
  };

  // --- ROOM SELECTION HANDLERS ---
  const handleToggleRoom = (roomId) => {
    setErrorMessage(null);
    soundManager.playBlip?.();
    const room = ALL_ROOMS.find(r => r.id === roomId);
    if (!room) return;

    setConfig(prev => {
      const current = [...prev.selectedRooms];
      const isSelected = current.includes(roomId);

      if (isSelected) {
        // Deselect
        if (current.length <= 6) {
          setErrorMessage('You must choose at least 6 rooms (allowed: 6 to 13 rooms).');
          return prev;
        }
        const updated = current.filter(id => id !== roomId);
        saveCustomConfig({ ...prev, selectedRooms: updated });
        return { ...prev, selectedRooms: updated };
      } else {
        // Select
        if (current.length >= 13) {
          setErrorMessage('You can choose at most 13 rooms (allowed: 6 to 13 rooms).');
          return prev;
        }

        // Variant check: Entrance and Staff Room mutual exclusivity
        let updated = current;
        if (room.group) {
          const otherVariant = ALL_ROOMS.find(r => r.group === room.group && r.id !== roomId);
          if (otherVariant && current.includes(otherVariant.id)) {
            updated = updated.filter(id => id !== otherVariant.id);
          }
        }

        updated = [...updated, roomId];
        saveCustomConfig({ ...prev, selectedRooms: updated });
        return { ...prev, selectedRooms: updated };
      }
    });
  };

  // --- UPLOAD TASK HANDLER ---
  const handleSelectUploadTask = (taskId) => {
    setErrorMessage(null);
    soundManager.playBlip?.();
    setConfig(prev => {
      const updated = { ...prev, uploadTask: taskId };
      saveCustomConfig(updated);
      return updated;
    });
  };

  // --- PRESETS ---
  const applyPreset = (presetName, autoStart = false) => {
    let newConfig = { ...config };
    if (presetName === 'CLASSIC') {
      newConfig = {
        ...config,
        selectedRooms: ['ROOM_A', 'CORRIDOR_A', 'CORRIDOR_B', 'CORRIDOR_C', 'STAIRS', 'BALCONY'],
        selectedEnemies: ['ab', 'aadesh', 'dipu', 'johann'],
        uploadTask: 'ligin',
        enemyLevels: { ab: 10, aadesh: 10, dipu: 10, johann: 10, ritul: 10, mahadev: 10, sijin: 10, ryan: 10 }
      };
    } else if (presetName === 'NEWCOMERS') {
      newConfig = {
        ...config,
        selectedRooms: ['ROOM_A', 'CORRIDOR_A', 'CORRIDOR_X', 'B_127', 'ELEVATOR', 'GEOTECH', 'CORRIDOR_C'],
        selectedEnemies: ['ritul', 'mahadev', 'sijin', 'ryan'],
        uploadTask: 'danny',
        enemyLevels: { ab: 10, aadesh: 10, dipu: 10, johann: 10, ritul: 12, mahadev: 12, sijin: 12, ryan: 12 }
      };
    } else if (presetName === 'ALL_OUT_20') {
      newConfig = {
        ...config,
        selectedRooms: ['ROOM_A', 'CORRIDOR_A', 'CORRIDOR_B', 'CORRIDOR_C', 'STAIRS', 'BALCONY', 'B_127', 'ALLEY'],
        selectedEnemies: ['ab', 'johann', 'mahadev', 'ritul', 'sijin'],
        uploadTask: 'vijitha',
        enemyLevels: { ab: 20, aadesh: 20, dipu: 20, johann: 20, ritul: 20, mahadev: 20, sijin: 20, ryan: 20 }
      };
    }
    setConfig(newConfig);
    saveCustomConfig(newConfig);
    setErrorMessage(null);
    soundManager.playBlip?.();

    if (autoStart) {
      launchShift(newConfig);
    } else {
      setSetupStep(1);
    }
  };

  // --- START SHIFT ---
  const launchShift = (targetConfig = config) => {
    if (!targetConfig.selectedEnemies || targetConfig.selectedEnemies.length < 3 || targetConfig.selectedEnemies.length > 5) {
      setErrorMessage(`Please select between 3 and 5 enemies (currently: ${targetConfig.selectedEnemies?.length || 0}).`);
      setSetupStep(1);
      return;
    }
    if (!targetConfig.selectedRooms || targetConfig.selectedRooms.length < 6 || targetConfig.selectedRooms.length > 13) {
      setErrorMessage(`Please select between 6 and 13 rooms (currently: ${targetConfig.selectedRooms?.length || 0}).`);
      setSetupStep(2);
      return;
    }
    if (!targetConfig.uploadTask) {
      setErrorMessage('Please choose 1 upload task.');
      setSetupStep(3);
      return;
    }

    setErrorMessage(null);
    saveCustomConfig(targetConfig);
    requestAppFullscreen();
    soundManager.stopMenuBgm();
    onStartGame(targetConfig);
  };

  const enemyCount = config.selectedEnemies?.length || 0;
  const roomCount = config.selectedRooms?.length || 0;
  const currentTask = UPLOAD_TASKS.find(t => t.id === config.uploadTask) || UPLOAD_TASKS[0];

  return (
    <div className="relative w-screen min-h-[100dvh] h-[100dvh] overflow-hidden bg-black flex flex-col justify-between p-2 sm:p-4 select-none font-mono">
      {/* Background alternating CRT glitch */}
      <div
        className={`absolute inset-0 bg-cover bg-center pointer-events-none transition-none ${
          isSwitchGlitching ? 'translate-x-3 -translate-y-2 scale-105 filter contrast-175 brightness-135 saturate-150 skew-x-1' : 'menu-bg-shaky filter contrast-115'
        } ${activeMenuImg === 0 ? 'opacity-35 z-0' : 'opacity-0 z-0'}`}
        style={{ backgroundImage: `url('./assets/images/main-menu.jpg')` }}
      />
      <div
        className={`absolute inset-0 bg-cover bg-center pointer-events-none transition-none ${
          isSwitchGlitching ? '-translate-x-3 translate-y-2 scale-105 filter contrast-175 brightness-135 saturate-150 -skew-x-1' : 'menu-bg-shaky filter contrast-115'
        } ${activeMenuImg === 1 ? 'opacity-35 z-0' : 'opacity-0 z-0'}`}
        style={{ backgroundImage: `url('./Fnak photos/main-menu-new.png')` }}
      />

      {/* CRT Scanline & static overlay */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
      <div className="absolute inset-0 static-fuzz opacity-20 pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-20 flex justify-between items-center w-full pb-1.5 border-b border-red-950/80">
        <div className="flex items-center space-x-2 bg-black/80 backdrop-blur border border-red-600/60 px-2.5 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
          <span className="text-red-500 font-bold tracking-widest text-[10px] sm:text-xs uppercase">
            {setupStep === 0 ? 'KATTAIKONAM TERMINAL // ONLINE' : `SHIFT CONFIGURATION // STEP ${setupStep} OF 3`}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onToggleClockFormat && (
            <button
              onClick={onToggleClockFormat}
              className="px-2 py-1 rounded bg-black/70 hover:bg-neutral-800 border border-neutral-700 text-gray-300 text-[10px] sm:text-xs font-bold transition cursor-pointer"
              title="Toggle Clock Format (12h / 24h)"
            >
              {showMinutes ? '12-HOUR [MINUTES ON]' : '12-HOUR [HOURS ONLY]'}
            </button>
          )}

          <button
            onClick={handleToggleFullscreen}
            className="p-1 sm:p-1.5 rounded bg-black/70 hover:bg-yellow-950 border border-yellow-600/50 text-yellow-300 text-[10px] sm:text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
            <span className="hidden sm:inline">{isFullscreen ? 'WINDOWED' : 'FULLSCREEN'}</span>
          </button>

          <button
            onClick={handleToggleMute}
            className="p-1 sm:p-1.5 rounded bg-black/70 hover:bg-neutral-800 border border-neutral-700 text-gray-300 text-[10px] sm:text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} className="text-emerald-400" />}
            <span className="hidden sm:inline">{isMuted ? 'MUTED' : 'BGM ON'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SCREEN 0: CLASSIC ATMOSPHERIC MAIN MENU (Clean initial screen with PLAY)
          ========================================================================= */}
      {setupStep === 0 && (
        <div className="relative z-20 flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto w-full px-3 py-4 animate-fadeIn">
          {/* Game Title: Ultimate Night @ Kattaikonam */}
          <div className="text-center mb-6 pointer-events-none">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-red-600 glitch-text drop-shadow-[0_2px_25px_rgba(255,0,0,0.95)]">
              ULTIMATE NIGHT
            </h1>
            <h2 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-[0.3em] text-gray-200 uppercase drop-shadow mt-1">
              @ KATTAIKONAM
            </h2>
            <p className="text-[10px] sm:text-xs text-red-400/80 tracking-widest uppercase mt-2">
              SURVIVE THE NIGHT • CONFIGURE ROOMS & ENEMIES • PREVENT THE BREACH
            </p>
          </div>

          {/* Primary Action Panel */}
          <div className="w-full max-w-md bg-black/85 backdrop-blur-md border-2 border-neutral-800 rounded-2xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-3">
            {/* BIG PLAY BUTTON */}
            <button
              onClick={() => {
                soundManager.playBlip?.();
                setSetupStep(1);
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-black tracking-[0.2em] text-base sm:text-lg rounded-xl border-2 border-red-400 shadow-[0_0_35px_rgba(239,68,68,0.85)] transition active:scale-95 cursor-pointer flex items-center justify-center gap-3 group animate-pulse"
            >
              <Play size={22} className="fill-white group-hover:scale-110 transition-transform" />
              <span>PLAY</span>
            </button>

            {/* Quick Presets Row */}
            <div className="pt-2 border-t border-neutral-800">
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Sparkles size={12} />
                  <span>Quick Shift Presets</span>
                </span>
                <span className="text-[9px] text-gray-500">Instant Launch</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => applyPreset('CLASSIC', true)}
                  className="p-2 bg-neutral-950/90 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500 rounded text-center transition cursor-pointer group"
                  title="6 Rooms, 4 Enemies (AI 10), Ligin OMR"
                >
                  <div className="text-[10px] font-bold text-emerald-400 group-hover:underline">CLASSIC 4</div>
                  <div className="text-[8px] text-gray-400 mt-0.5">Easy • 6 Cams</div>
                </button>

                <button
                  onClick={() => applyPreset('NEWCOMERS', true)}
                  className="p-2 bg-neutral-950/90 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500 rounded text-center transition cursor-pointer group"
                  title="7 Rooms, Ritul, Mahadev, Sjinil, Ryan (AI 12), Danny Vibrant"
                >
                  <div className="text-[10px] font-bold text-cyan-400 group-hover:underline">NEW THREATS</div>
                  <div className="text-[8px] text-gray-400 mt-0.5">Medium • 7 Cams</div>
                </button>

                <button
                  onClick={() => applyPreset('ALL_OUT_20', true)}
                  className="p-2 bg-neutral-950/90 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 rounded text-center transition cursor-pointer group"
                  title="8 Rooms, 5 Enemies (AI 20), Vijitha PCM"
                >
                  <div className="text-[10px] font-bold text-red-400 group-hover:underline">ALL-OUT 20</div>
                  <div className="text-[8px] text-gray-400 mt-0.5">Hard • AI 20</div>
                </button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => onStartTutorial && onStartTutorial()}
                className="py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 hover:text-emerald-400 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <HelpCircle size={15} className="text-emerald-400" />
                <span>HOW TO PLAY</span>
              </button>

              <button
                onClick={() => setShowCredits(true)}
                className="py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-cyan-400 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Users size={15} />
                <span>CREDITS</span>
              </button>
            </div>

            {canInstallPWA && (
              <button
                onClick={handleInstallPWA}
                className="w-full py-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download size={14} />
                <span>INSTALL APP TO DESKTOP / HOMESCREEN</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEPS 1, 2, 3: STEP-BY-STEP CUSTOM SHIFT SETUP WIZARD
          ========================================================================= */}
      {setupStep > 0 && (
        <div className="relative z-20 flex-1 w-full max-w-5xl mx-auto overflow-hidden flex flex-col bg-black/90 backdrop-blur-md border-2 border-neutral-800 rounded-2xl shadow-2xl p-2.5 sm:p-4 my-1 animate-fadeIn">
          {/* STEP HEADER & PROGRESS INDICATOR */}
          <div className="border-b border-neutral-800 pb-2 mb-2">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToStep(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    setupStep === 1
                      ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.8)]'
                      : enemyCount >= 3 && enemyCount <= 5
                      ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                      : 'bg-neutral-900 text-gray-400 hover:text-white'
                  }`}
                >
                  <Skull size={13} />
                  <span>1. ENEMIES ({enemyCount}/5)</span>
                  {enemyCount >= 3 && enemyCount <= 5 && <Check size={12} className="text-emerald-400" />}
                </button>

                <ChevronRight size={14} className="text-gray-600" />

                <button
                  onClick={() => goToStep(2)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    setupStep === 2
                      ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                      : roomCount >= 6 && roomCount <= 13
                      ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                      : 'bg-neutral-900 text-gray-400 hover:text-white'
                  }`}
                >
                  <Camera size={13} />
                  <span>2. ROOMS ({roomCount}/13)</span>
                  {roomCount >= 6 && roomCount <= 13 && <Check size={12} className="text-emerald-400" />}
                </button>

                <ChevronRight size={14} className="text-gray-600" />

                <button
                  onClick={() => goToStep(3)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    setupStep === 3
                      ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                      : config.uploadTask
                      ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300'
                      : 'bg-neutral-900 text-gray-400 hover:text-white'
                  }`}
                >
                  <Upload size={13} />
                  <span>3. UPLOAD TASK</span>
                  {config.uploadTask && <Check size={12} className="text-cyan-400" />}
                </button>
              </div>

              {/* Step info pill */}
              <div className="text-[10px] text-gray-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                STEP {setupStep} OF 3 • CLICK 'NEXT' TO ADVANCE
              </div>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="bg-red-950/95 border-2 border-red-500 text-red-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between gap-2 mt-2 animate-bounce">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-gray-400 hover:text-white text-sm p-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* STEP 1: SELECT ENEMIES & AI LEVELS */}
          {setupStep === 1 && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-red-400 flex items-center gap-2">
                    <Skull size={16} />
                    <span>STEP 1: SELECT ENEMIES & AI LEVELS</span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                    Choose between <strong className="text-white">3 and 5 enemies</strong>. Adjust AI difficulty from 0 (dormant) to 20 (lethal nightmare).
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  enemyCount >= 3 && enemyCount <= 5
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                    : 'bg-red-950/90 border-red-500 text-red-300 animate-pulse'
                }`}>
                  {enemyCount} / 5 Selected (Min: 3)
                </span>
              </div>

              {/* Enemies Grid */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {ALL_ENEMIES.map(enemy => {
                  const isSelected = config.selectedEnemies.includes(enemy.id);
                  const aiLevel = config.enemyLevels[enemy.id] ?? 10;

                  return (
                    <div
                      key={enemy.id}
                      className={`p-2.5 rounded-xl border-2 transition flex flex-col justify-between ${
                        isSelected
                          ? 'bg-red-950/50 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                          : 'bg-neutral-950/80 border-neutral-800 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div
                        onClick={() => handleToggleEnemy(enemy.id)}
                        className="cursor-pointer flex items-center gap-2.5 mb-2"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-700">
                          <img
                            src={enemy.photo}
                            alt={enemy.name}
                            className={`w-full h-full object-cover transition ${
                              isSelected ? 'brightness-110' : 'brightness-50 grayscale'
                            }`}
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow">
                              <Check size={10} />
                            </div>
                          )}
                        </div>

                        <div className="overflow-hidden flex-1">
                          <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                            {enemy.name}
                          </div>
                          <div className="text-[9px] text-gray-400 line-clamp-2 leading-tight mt-0.5">
                            {enemy.desc}
                          </div>
                        </div>
                      </div>

                      {/* AI Level Slider */}
                      <div className="bg-black/60 p-2 rounded-lg border border-neutral-800 space-y-1.5 mt-auto">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-gray-400">AI LEVEL:</span>
                          <span className={isSelected ? 'text-red-400 font-mono text-xs' : 'text-gray-600'}>
                            {isSelected ? aiLevel : 'DISABLED'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          disabled={!isSelected}
                          value={aiLevel}
                          onChange={(e) => handleAILevelChange(enemy.id, e.target.value)}
                          className={`w-full h-1.5 rounded appearance-none cursor-pointer ${
                            isSelected ? 'accent-red-600 bg-neutral-800' : 'accent-neutral-700 bg-neutral-900 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT ROOMS & MAP LOCATIONS */}
          {setupStep === 2 && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-2">
                    <Camera size={16} />
                    <span>STEP 2: SELECT SURVEILLANCE ROOMS</span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                    Choose between <strong className="text-white">6 and 13 camera rooms</strong>. Note: Entrance and Staff Room variants are mutually exclusive.
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  roomCount >= 6 && roomCount <= 13
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                    : 'bg-red-950/90 border-red-500 text-red-300 animate-pulse'
                }`}>
                  {roomCount} / 13 Selected (Min: 6)
                </span>
              </div>

              {/* Rooms Grid */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {ALL_ROOMS.map(room => {
                  const isSelected = config.selectedRooms.includes(room.id);
                  const isVariant = Boolean(room.group);

                  return (
                    <div
                      key={room.id}
                      onClick={() => handleToggleRoom(room.id)}
                      className={`relative p-2 rounded-xl border-2 transition cursor-pointer active:scale-95 flex flex-col justify-between overflow-hidden group ${
                        isSelected
                          ? 'bg-emerald-950/70 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                          : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="relative w-full h-16 sm:h-20 rounded-lg overflow-hidden bg-black mb-1.5">
                        <img
                          src={room.image}
                          alt={room.name}
                          className={`w-full h-full object-cover filter contrast-110 transition duration-150 ${
                            isSelected ? 'brightness-105' : 'brightness-60 grayscale-25'
                          }`}
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5 shadow">
                            <Check size={12} />
                          </div>
                        )}
                        {isVariant && (
                          <div className="absolute bottom-1 left-1 bg-black/85 text-amber-300 text-[8px] px-1.5 py-0.5 rounded border border-amber-500/60 font-bold">
                            VARIANT
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] font-bold text-white truncate">{room.name}</div>
                      <div className="text-[9px] text-gray-400 truncate">{room.sub}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE UPLOAD TASK & LAUNCH */}
          {setupStep === 3 && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/80">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-cyan-400 flex items-center gap-2">
                    <Upload size={16} />
                    <span>STEP 3: CHOOSE UPLOADING TASK & LAUNCH</span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                    Select <strong className="text-white">1 upload protocol</strong> to complete during your shift on your desk terminal.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-cyan-950/90 border-cyan-500 text-cyan-300 uppercase">
                  ACTIVE: {currentTask.name}
                </span>
              </div>

              {/* Task Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mb-3">
                {UPLOAD_TASKS.map(task => {
                  const isSelected = config.uploadTask === task.id;

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleSelectUploadTask(task.id)}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer active:scale-95 flex items-center gap-3 ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'bg-neutral-950/80 border-neutral-800 opacity-60 hover:opacity-100 hover:border-neutral-600'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-700 flex items-center justify-center">
                        <img
                          src={task.image}
                          alt={task.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-gray-300'}`}>
                            {task.name}
                          </span>
                          {isSelected && <Check size={14} className="text-cyan-400" />}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate mt-0.5">{task.label}</div>
                        <div className="text-[8.5px] text-gray-500 line-clamp-2 mt-0.5">{task.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Final Shift Manifest Review Card */}
              <div className="flex-1 bg-neutral-950/90 border border-neutral-800 rounded-xl p-3 sm:p-4 overflow-y-auto font-mono text-xs space-y-2">
                <div className="text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-800 pb-1 flex items-center justify-between">
                  <span>SHIFT MANIFEST SUMMARY</span>
                  <span className="text-emerald-400">READY TO ENGAGE</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <span className="text-red-400 font-bold block mb-1">
                      ENEMIES ({enemyCount}):
                    </span>
                    <div className="text-gray-300 space-y-0.5 text-[10px]">
                      {config.selectedEnemies.map(id => {
                        const enemy = ALL_ENEMIES.find(e => e.id === id);
                        return (
                          <div key={id} className="flex justify-between">
                            <span>{enemy?.name || id}</span>
                            <span className="text-red-400 font-bold">AI {config.enemyLevels[id] ?? 10}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <span className="text-emerald-400 font-bold block mb-1">
                      ROOMS ({roomCount}):
                    </span>
                    <div className="text-gray-300 text-[10px] line-clamp-6 leading-relaxed">
                      {config.selectedRooms.map(id => ALL_ROOMS.find(r => r.id === id)?.name || id).join(', ')}
                    </div>
                  </div>

                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <span className="text-cyan-400 font-bold block mb-1">
                      DESK TASK:
                    </span>
                    <div className="text-white font-bold text-xs">{currentTask.name}</div>
                    <div className="text-cyan-300 text-[10px] mt-0.5">{currentTask.label}</div>
                    <div className="text-gray-400 text-[9px] mt-1">{currentTask.desc}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM STEP NAVIGATION BAR (Back / Next / Start Shift) */}
          <div className="pt-2.5 border-t border-neutral-800 flex items-center justify-between gap-3 mt-2">
            {/* BACK BUTTON */}
            <button
              onClick={handlePrevStep}
              className="py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 hover:text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ArrowLeft size={16} />
              <span>{setupStep === 1 ? 'MAIN MENU' : 'BACK'}</span>
            </button>

            <div className="flex items-center gap-2">
              {/* NEXT BUTTON (Steps 1 & 2) */}
              {setupStep < 3 && (
                <button
                  onClick={handleNextStep}
                  className="py-2.5 px-6 rounded-xl bg-red-700 hover:bg-red-600 text-white text-xs sm:text-sm font-bold border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] transition flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>NEXT: {setupStep === 1 ? 'SELECT ROOMS' : 'UPLOAD TASK'}</span>
                  <ArrowRight size={16} />
                </button>
              )}

              {/* FINAL START SHIFT BUTTON (Step 3) */}
              {setupStep === 3 && (
                <button
                  onClick={() => launchShift()}
                  className="py-3 px-8 bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-black tracking-widest text-sm sm:text-base rounded-xl border-2 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.85)] transition active:scale-95 cursor-pointer flex items-center gap-3 animate-pulse"
                >
                  <Play size={20} className="fill-white" />
                  <span>START SHIFT</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer controls & info */}
      <div className="relative z-20 flex justify-between items-center text-[9px] sm:text-[10px] text-gray-500 px-2 pt-1 border-t border-neutral-900">
        <span>CONTROLS: [SPACE] Cameras • [D] Blast Door • [L] Hallway Light • [M] Security Mask • [A] Scare Audio</span>
        <span>Ultimate Night @ Kattaikonam • v2.1</span>
      </div>

      {/* CREDITS MODAL */}
      {showCredits && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-neutral-950 border-2 border-cyan-500/80 rounded-xl max-w-md w-full p-4 sm:p-6 text-gray-200 space-y-4 shadow-[0_0_50px_rgba(6,182,212,0.35)]">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2 font-mono">
                <Users size={18} />
                PRODUCTION CREDITS
              </h3>
              <button
                onClick={() => setShowCredits(false)}
                className="text-gray-400 hover:text-white font-mono text-base cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs font-mono space-y-3 leading-relaxed">
              <div className="p-2.5 bg-neutral-900/80 border border-neutral-800 rounded text-center">
                <p className="text-gray-300 font-semibold italic">
                  Inspired by Five Nights at Freddy's and Ultimate Custom Night by Scott Cawthon
                </p>
              </div>

              <div className="space-y-2">
                <div className="border-l-2 border-red-500 pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase">Lead Developer</span>
                  <span className="text-red-400 font-bold text-sm">Pinky</span>
                </div>
                <div className="border-l-2 border-orange-500 pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase">Creative Head</span>
                  <span className="text-orange-400 font-bold text-sm">Dip-u</span>
                </div>
                <div className="border-l-2 border-yellow-500 pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase">Enemies & Antagonists</span>
                  <div className="text-yellow-300 font-semibold mt-0.5 space-y-0.5">
                    <p>Aadesh • Abhishek • Devkrishna • Johann • Mahadev • Ritul • Ryan • Sijinil</p>
                  </div>
                </div>
                <div className="border-l-2 border-cyan-500 pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase">Audio & Assets</span>
                  <span className="text-cyan-300 font-semibold">Pixabay, Classroom Recordings & Wallpaper Clan</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCredits(false)}
              className="w-full py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-mono font-bold text-xs rounded tracking-wider uppercase cursor-pointer"
            >
              CLOSE CREDITS
            </button>
          </div>
        </div>
      )}

      {/* HOW TO PLAY PROTOCOL MANUAL */}
      {showHowToPlay && <RulesModal onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
}
