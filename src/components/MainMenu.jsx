import React, { useState, useEffect } from 'react';
import {
  Volume2, VolumeX, Sparkles, Play, Settings, HelpCircle, Users,
  Maximize, Minimize, ShieldAlert, Zap, Lock, Lightbulb, Camera,
  Upload, AlertTriangle, Check, RefreshCw, Layers, Skull, FileText, Download
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
  const [activeTab, setActiveTab] = useState('CUSTOMIZE'); // 'CUSTOMIZE' | 'PRESETS'

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

  // --- ROOM SELECTION HANDLERS ---
  const handleToggleRoom = (roomId) => {
    setErrorMessage(null);
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

        // Variant check: If this room belongs to a group (e.g. ENTRANCE or STAFF_ROOM),
        // automatically deselect the other variant!
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

  // --- ENEMY SELECTION HANDLERS ---
  const handleToggleEnemy = (enemyId) => {
    setErrorMessage(null);
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

  // --- UPLOAD TASK HANDLER ---
  const handleSelectUploadTask = (taskId) => {
    setConfig(prev => {
      const updated = { ...prev, uploadTask: taskId };
      saveCustomConfig(updated);
      return updated;
    });
  };

  // --- PRESETS ---
  const applyPreset = (presetName) => {
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
  };

  // --- START GAME ---
  const handlePlayClick = () => {
    // Validate selections
    if (!config.selectedRooms || config.selectedRooms.length < 6 || config.selectedRooms.length > 13) {
      setErrorMessage(`Please select between 6 and 13 rooms (currently selected: ${config.selectedRooms?.length || 0}).`);
      return;
    }
    if (!config.selectedEnemies || config.selectedEnemies.length < 3 || config.selectedEnemies.length > 5) {
      setErrorMessage(`Please select between 3 and 5 enemies (currently selected: ${config.selectedEnemies?.length || 0}).`);
      return;
    }
    if (!config.uploadTask) {
      setErrorMessage('Please choose one uploading task.');
      return;
    }

    setErrorMessage(null);
    saveCustomConfig(config);
    requestAppFullscreen();
    soundManager.stopMenuBgm();
    onStartGame(config);
  };

  const roomCount = config.selectedRooms?.length || 0;
  const enemyCount = config.selectedEnemies?.length || 0;

  return (
    <div className="relative w-screen min-h-[100dvh] h-[100dvh] overflow-hidden bg-black flex flex-col justify-between p-2 sm:p-4 md:p-6 select-none font-mono">
      {/* Background alternating menu image with CRT glitch */}
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
      <div className="relative z-20 flex justify-between items-center w-full pb-1 border-b border-red-950/80">
        <div className="flex items-center space-x-2 bg-black/80 backdrop-blur border border-red-600/60 px-2.5 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
          <span className="text-red-500 font-bold tracking-widest text-[10px] sm:text-xs uppercase">
            ULTIMATE NIGHT // CUSTOM SETUP
          </span>
        </div>

        <div className="flex items-center space-x-2">
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

      {/* Game Title: Ultimate Night @ Kattaikonam */}
      <div className="relative z-20 text-center my-1 pointer-events-none">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-widest text-red-600 glitch-text drop-shadow-[0_2px_20px_rgba(255,0,0,0.9)]">
          ULTIMATE NIGHT
        </h1>
        <h2 className="text-sm sm:text-lg md:text-xl font-extrabold tracking-[0.25em] text-gray-200 uppercase drop-shadow">
          @ KATTAIKONAM
        </h2>
      </div>

      {/* Main Interactive Customization Workspace */}
      <div className="relative z-20 flex-1 w-full max-w-6xl mx-auto overflow-hidden flex flex-col bg-black/85 backdrop-blur-md border-2 border-neutral-800 rounded-xl shadow-2xl p-2 sm:p-3 my-1">
        {/* Navigation / Mode Pill */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('CUSTOMIZE')}
              className={`px-3 py-1 rounded text-[10px] sm:text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'CUSTOMIZE'
                  ? 'bg-red-700 text-white shadow-[0_0_12px_rgba(220,38,38,0.7)]'
                  : 'bg-neutral-900 text-gray-400 hover:text-white'
              }`}
            >
              <Settings size={13} />
              <span>CUSTOMIZE SHIFT</span>
            </button>

            <button
              onClick={() => setActiveTab('PRESETS')}
              className={`px-3 py-1 rounded text-[10px] sm:text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PRESETS'
                  ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(217,119,6,0.7)]'
                  : 'bg-neutral-900 text-gray-400 hover:text-white'
              }`}
            >
              <Layers size={13} />
              <span>QUICK PRESETS</span>
            </button>
          </div>

          {/* Counts Overview Badges */}
          <div className="flex items-center gap-2 text-[9px] sm:text-xs">
            <span className={`px-2 py-0.5 rounded font-bold border ${
              roomCount >= 6 && roomCount <= 13
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
            }`}>
              ROOMS: {roomCount}/13 (6–13)
            </span>

            <span className={`px-2 py-0.5 rounded font-bold border ${
              enemyCount >= 3 && enemyCount <= 5
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
            }`}>
              ENEMIES: {enemyCount}/5 (3–5)
            </span>

            <span className="px-2 py-0.5 rounded font-bold border bg-cyan-950/80 border-cyan-500 text-cyan-300 uppercase">
              UPLOAD: {config.uploadTask}
            </span>
          </div>
        </div>

        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="bg-red-950/90 border-2 border-red-500 text-red-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between gap-2 mb-2 animate-bounce">
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

        {/* Preset Selector Banner */}
        {activeTab === 'PRESETS' && (
          <div className="p-3 bg-neutral-900/90 border border-neutral-700 rounded-lg mb-2 space-y-2 animate-fadeIn">
            <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5 uppercase">
              <Sparkles size={14} />
              <span>Select a Preconfigured Shift</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => applyPreset('CLASSIC')}
                className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500 rounded text-left transition cursor-pointer"
              >
                <div className="font-bold text-emerald-400 text-xs">CLASSIC 4 (ORIENTATION)</div>
                <div className="text-[10px] text-gray-400 mt-1">6 Classic Rooms • Abhishek, Aadesh, Dipu, Johann (AI 10) • Ligin OMR</div>
              </button>

              <button
                onClick={() => applyPreset('NEWCOMERS')}
                className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500 rounded text-left transition cursor-pointer"
              >
                <div className="font-bold text-cyan-400 text-xs">NEW THREATS (7 ROOMS)</div>
                <div className="text-[10px] text-gray-400 mt-1">7 Rooms • Ritul, Mahadev, Sjinil, Ryan (AI 12) • Danny Vibrant</div>
              </button>

              <button
                onClick={() => applyPreset('ALL_OUT_20')}
                className="p-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 hover:border-red-500 rounded text-left transition cursor-pointer"
              >
                <div className="font-bold text-red-400 text-xs">ALL-OUT 20/20/20 (NIGHTMARE)</div>
                <div className="text-[10px] text-gray-400 mt-1">8 Rooms • 5 Lethal Threats at Max AI 20 • Vijitha PCM Fast Upload</div>
              </button>
            </div>
          </div>
        )}

        {/* Customization Body: 3 Sections in Scrollable View */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* SECTION 1: MAP LOCATIONS (6 to 13 rooms) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300 border-b border-neutral-800 pb-1">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Camera size={14} />
                <span>1. SELECT MAP LOCATIONS ({roomCount}/13 selected — choose 6 to 13)</span>
              </span>
              <span className="text-[10px] text-gray-500">
                ★ Entrance and Staff Room have 2 variants (max 1 each)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
              {ALL_ROOMS.map(room => {
                const isSelected = config.selectedRooms.includes(room.id);
                const isVariant = Boolean(room.group);

                return (
                  <div
                    key={room.id}
                    onClick={() => handleToggleRoom(room.id)}
                    className={`relative p-1.5 rounded border transition cursor-pointer active:scale-95 flex flex-col justify-between overflow-hidden group ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                        : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-600 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <div className="relative w-full h-14 sm:h-16 rounded overflow-hidden bg-black mb-1">
                      <img
                        src={room.image}
                        alt={room.name}
                        className={`w-full h-full object-cover filter contrast-110 transition duration-150 ${
                          isSelected ? 'brightness-105' : 'brightness-75 grayscale-25'
                        }`}
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow">
                          <Check size={11} />
                        </div>
                      )}
                      {isVariant && (
                        <div className="absolute bottom-1 left-1 bg-black/80 text-amber-300 text-[8px] px-1 rounded border border-amber-500/50">
                          VARIANT
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] font-bold text-white truncate">{room.name}</div>
                    <div className="text-[8px] text-gray-400 truncate">{room.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: ENEMIES & AI LEVELS (3 to 5 enemies) */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300 border-b border-neutral-800 pb-1">
              <span className="flex items-center gap-1.5 text-red-400">
                <Skull size={14} />
                <span>2. SELECT ENEMIES & SET AI LEVELS ({enemyCount}/5 chosen — choose 3 to 5)</span>
              </span>
              <span className="text-[10px] text-gray-500">
                Slider: 0 (dormant) to 20 (nightmare)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {ALL_ENEMIES.map(enemy => {
                const isSelected = config.selectedEnemies.includes(enemy.id);
                const aiLevel = config.enemyLevels[enemy.id] ?? 10;

                return (
                  <div
                    key={enemy.id}
                    className={`p-2 rounded-lg border transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-red-950/60 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.35)]'
                        : 'bg-neutral-950/80 border-neutral-800 opacity-60'
                    }`}
                  >
                    <div
                      onClick={() => handleToggleEnemy(enemy.id)}
                      className="cursor-pointer flex items-center gap-2 mb-2"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-700">
                        <img
                          src={enemy.photo}
                          alt={enemy.name}
                          className={`w-full h-full object-cover ${isSelected ? 'brightness-110' : 'brightness-60 grayscale'}`}
                        />
                        {isSelected && (
                          <div className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5">
                            <Check size={9} />
                          </div>
                        )}
                      </div>

                      <div className="overflow-hidden flex-1">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                          {enemy.name}
                        </div>
                        <div className="text-[8px] text-gray-400 line-clamp-2 leading-tight">
                          {enemy.desc}
                        </div>
                      </div>
                    </div>

                    {/* AI Level Slider */}
                    <div className="bg-black/60 p-1.5 rounded border border-neutral-800 space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold">
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

          {/* SECTION 3: UPLOAD TASK SELECTION (1 per session) */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-300 border-b border-neutral-800 pb-1">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Upload size={14} />
                <span>3. CHOOSE UPLOADING TASK (Select 1 task for the shift)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {UPLOAD_TASKS.map(task => {
                const isSelected = config.uploadTask === task.id;

                return (
                  <div
                    key={task.id}
                    onClick={() => handleSelectUploadTask(task.id)}
                    className={`p-2 rounded-lg border transition cursor-pointer active:scale-95 flex items-center gap-2 ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-neutral-950/80 border-neutral-800 opacity-65 hover:opacity-100 hover:border-neutral-600'
                    }`}
                  >
                    <div className="w-12 h-12 rounded overflow-hidden bg-black shrink-0 border border-neutral-700 flex items-center justify-center">
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
                        {isSelected && <Check size={12} className="text-cyan-400" />}
                      </div>
                      <div className="text-[9px] text-gray-400 truncate">{task.label}</div>
                      <div className="text-[8px] text-gray-500 line-clamp-1">{task.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Play Action Bar */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3 mt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartTutorial && onStartTutorial()}
              className="py-2 px-3 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 hover:text-emerald-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <HelpCircle size={14} className="text-emerald-400" />
              <span>HOW TO PLAY</span>
            </button>

            <button
              onClick={() => setShowCredits(true)}
              className="py-2 px-3 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-cyan-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Users size={14} />
              <span>CREDITS</span>
            </button>

            <button
              onClick={handleInstallPWA}
              className="hidden sm:flex py-2 px-3 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 text-xs font-bold transition items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download size={14} />
              <span>INSTALL APP</span>
            </button>
          </div>

          {/* MAIN PLAY BUTTON */}
          <button
            onClick={handlePlayClick}
            className="py-3 px-8 bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-black tracking-widest text-sm sm:text-base rounded-lg border-2 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.8)] transition active:scale-95 cursor-pointer flex items-center gap-3 animate-pulse"
          >
            <Play size={20} className="fill-white" />
            <span>PLAY SHIFT</span>
          </button>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="relative z-20 flex justify-between items-center text-[9px] sm:text-[10px] text-gray-500 px-2 pt-1">
        <span>CONTROLS: [SPACE] Cameras • [D] Blast Door • [L] Hallway Light • [M] Security Mask • [A] Scare Audio</span>
        <span>IIT Chanthavila Computer Entertainment • v2.0</span>
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
                  <span className="text-gray-400 block text-[10px] uppercase">Enemies</span>
                  <div className="text-yellow-300 font-semibold mt-0.5 space-y-0.5">
                    <p>Aadesh • Abhishek • Devkrishna • Johann • Ritul • Ryan • Sijinil</p>
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
