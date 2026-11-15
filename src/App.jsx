import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState } from './game/gameEngine';
import { soundManager } from './audio/SoundManager';
import MainMenu from './components/MainMenu';
import OfficeView from './components/OfficeView';
import CameraMonitor from './components/CameraMonitor';
import NightIntro from './components/NightIntro';
import JumpscareOverlay from './components/JumpscareOverlay';
import NightWinScreen from './components/NightWinScreen';
import GameOverScreen from './components/GameOverScreen';
import StudioIntro from './components/StudioIntro';
import PauseMenu from './components/PauseMenu';
import TutorialGameplay from './components/TutorialGameplay';
import { preloadAllAssets } from './utils/assetLoader';
import { requestAppFullscreen } from './utils/fullscreen';
import { getShowMinutes, setShowMinutes } from './utils/storage';

// Early kickoff of asset preloading
preloadAllAssets().catch(() => {});

export default function App() {
  const [screen, setScreen] = useState('STUDIO_INTRO'); // STUDIO_INTRO, MENU, TUTORIAL, INTRO, PLAYING, JUMPSCARE, GAME_OVER, WIN
  const [gameState, setGameState] = useState(null);
  const [jumpscareTarget, setJumpscareTarget] = useState(null);
  const [isDoorBanging, setIsDoorBanging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cameraGlitch, setCameraGlitch] = useState(false);
  const [scareSubtitle, setScareSubtitle] = useState(null);
  const [ryanPenetratedMessage, setRyanPenetratedMessage] = useState(null);
  const [sjinilHackedMessage, setSjinilHackedMessage] = useState(null);
  const [showMinutes, setShowMinutesState] = useState(() => getShowMinutes());

  const handleToggleClockFormat = useCallback(() => {
    setShowMinutesState(prev => {
      const next = !prev;
      setShowMinutes(next);
      return next;
    });
  }, []);

  const customConfigRef = useRef(null);
  const lastMovementPlayedFootstepsRef = useRef(false);

  // Stable clone of GameState to trigger React re-renders
  const refreshGameState = useCallback((state) => {
    if (!state) return null;
    return Object.assign(Object.create(Object.getPrototypeOf(state)), state);
  }, []);

  // Start game shift with custom configuration
  const handleStartGame = (customConfig) => {
    requestAppFullscreen();
    soundManager.stopMenuBgm();
    soundManager.stopFootstepClip();
    lastMovementPlayedFootstepsRef.current = false;
    setIsPaused(false);
    customConfigRef.current = customConfig;
    setRyanPenetratedMessage(null);
    setSjinilHackedMessage(null);

    const newGame = new GameState(customConfig);
    setGameState(newGame);
    setScreen('INTRO');
  };

  const handleIntroFinish = () => {
    setScreen('PLAYING');
    soundManager.startFan();
  };

  const handleJumpscareEnd = () => {
    setIsPaused(false);
    setScreen('GAME_OVER');
  };

  const handleRetry = () => {
    requestAppFullscreen();
    setIsPaused(false);
    handleStartGame(customConfigRef.current);
  };

  const handleMainMenu = () => {
    soundManager.stopFootstepClip();
    lastMovementPlayedFootstepsRef.current = false;
    soundManager.stopFan();
    soundManager.stopHeartbeat();
    soundManager.stopSprintRunning();
    soundManager.stopBlackoutMusic();
    setIsPaused(false);
    setRyanPenetratedMessage(null);
    setSjinilHackedMessage(null);
    setScreen('MENU');
    soundManager.playMenuBgm();
  };

  const handleTogglePause = useCallback(() => {
    if (screen !== 'PLAYING' || !gameState || gameState.isBlackout || gameState.isGameOver) return;
    setIsPaused(prev => {
      const next = !prev;
      if (next) {
        soundManager.pauseGameAudio();
      } else {
        requestAppFullscreen();
        soundManager.resumeGameAudio();
      }
      return next;
    });
  }, [screen, gameState]);

  const handleResume = useCallback(() => {
    requestAppFullscreen();
    setIsPaused(false);
    soundManager.resumeGameAudio();
  }, []);

  // Event dispatcher
  const handleGameEvent = useCallback((event) => {
    switch (event.type) {
      case 'HOUR_CHANGE':
        soundManager.playStaticBurst(0.1, 0.15);
        break;

      case 'MOVEMENT':
        if (event.animatronic && ['aadesh', 'johann', 'ab'].includes(event.animatronic)) {
          setCameraGlitch(true);
          soundManager.playStaticBurst(0.12, 0.18);
          setTimeout(() => setCameraGlitch(false), 180);

          if (lastMovementPlayedFootstepsRef.current) {
            lastMovementPlayedFootstepsRef.current = false;
          } else {
            if (Math.random() < 0.5) {
              soundManager.playFootstepClip(2, 4);
              lastMovementPlayedFootstepsRef.current = true;
            } else {
              lastMovementPlayedFootstepsRef.current = false;
            }
          }
        }
        break;

      case 'JOHANN_APPEARED':
      case 'JOHANN_RETREAT':
      case 'AB_SCARED':
        setCameraGlitch(true);
        setTimeout(() => setCameraGlitch(false), 180);
        break;

      case 'RYAN_PENETRATED':
        setCameraGlitch(true);
        soundManager.playStaticBurst(0.3, 0.5);
        setRyanPenetratedMessage('RYAN PENETRATED YOUR COMPUTER');
        setTimeout(() => setCameraGlitch(false), 300);
        setTimeout(() => setRyanPenetratedMessage(null), 8000);
        break;

      case 'RYAN_COOKED_COMPUTER':
        setCameraGlitch(true);
        soundManager.playStaticBurst(0.5, 0.8);
        setRyanPenetratedMessage('Sijinil and Ryan cooked your computer.');
        break;

      case 'SJINIL_HACKED_COMPUTER':
        setCameraGlitch(true);
        soundManager.playStaticBurst(0.4, 0.7);
        setSjinilHackedMessage('SJINIL HACKED YOUR SYSTEM! ACCESS DENIED');
        break;

      case 'GENERATOR_PRIMED':
        soundManager.playWireConnect();
        break;

      case 'GENERATOR_ACTIVATED':
        soundManager.playGeneratorRevUp();
        break;

      case 'DIPU_SPRINT':
        soundManager.playSprintRunning();
        break;

      case 'ENEMY_AT_DOOR':
        soundManager.startHeartbeat();
        break;

      case 'DOOR_DEFENSE':
        soundManager.stopSprintRunning();
        soundManager.stopHeartbeat();
        soundManager.playDoorKnock();
        setIsDoorBanging(true);
        setTimeout(() => setIsDoorBanging(false), 1200);
        break;

      case 'JOHANN_BANG':
      case 'AB_BREAKING_IN':
        soundManager.playDoorBang();
        setIsDoorBanging(true);
        setTimeout(() => setIsDoorBanging(false), 1200);
        break;

      case 'MASK_TOGGLE':
        soundManager.playMaskSound(event.isMaskOn);
        break;

      case 'SCARE_AUDIO_PLAYED':
        soundManager.playAbhishekScare();
        break;

      case 'BLACKOUT_START':
        soundManager.stopFootstepClip();
        soundManager.stopFan();
        soundManager.stopHeartbeat();
        soundManager.stopSprintRunning();
        soundManager.playBlackoutMusic();
        break;

      case 'JUMPSCARE':
        setIsPaused(false);
        soundManager.stopFootstepClip();
        soundManager.stopHeartbeat();
        soundManager.stopSprintRunning();
        soundManager.stopBlackoutMusic();
        setJumpscareTarget(event.animatronic);
        setScreen('JUMPSCARE');
        break;

      case 'GAME_WIN':
        setIsPaused(false);
        soundManager.stopFootstepClip();
        soundManager.stopFan();
        soundManager.stopHeartbeat();
        soundManager.stopSprintRunning();
        soundManager.stopBlackoutMusic();
        setScreen('WIN');
        break;

      case 'OMR_UPLOAD_COMPLETE':
        soundManager.playUploadSuccess();
        break;

      default:
        break;
    }
  }, []);

  // Main Active Game Loop
  useEffect(() => {
    if (screen !== 'PLAYING' || !gameState || isPaused) return;

    let lastTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      gameState.tick(dt, handleGameEvent);
      setGameState(prev => (prev ? Object.assign(Object.create(Object.getPrototypeOf(prev)), prev) : prev));
    }, 100);

    return () => clearInterval(interval);
  }, [screen, gameState, isPaused, handleGameEvent]);

  // Action Handlers
  const handleToggleDoor = useCallback(() => {
    if (!gameState || gameState.isBlackout || isPaused) return;
    const willClose = !gameState.isDoorClosed;
    soundManager.playDoorToggle(willClose);

    if (willClose) {
      gameState.toggleDoor(handleGameEvent);
    } else {
      gameState.isDoorClosed = false;
    }
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, handleGameEvent, isPaused]);

  const handleToggleLight = useCallback(() => {
    if (!gameState || gameState.isBlackout || isPaused) return;
    gameState.toggleLight(handleGameEvent);
    soundManager.playLightToggle(gameState.isLightOn);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, handleGameEvent, isPaused]);

  const handleToggleMonitor = useCallback(() => {
    if (!gameState || gameState.isBlackout || isPaused || gameState.isOmrUploading || gameState.isMaskOn) return;
    const newState = !gameState.isMonitorOpen;
    gameState.isMonitorOpen = newState;
    soundManager.playCameraFlip(newState);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, isPaused]);

  const handleToggleMask = useCallback(() => {
    if (!gameState || gameState.isBlackout || isPaused || gameState.isOmrUploading) return;
    const isMaskNow = gameState.toggleMask(handleGameEvent);
    soundManager.playMaskSound(isMaskNow);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, handleGameEvent, isPaused]);

  const handlePlayScare = useCallback((targetCam = null) => {
    if (!gameState || gameState.isBlackout || isPaused) return null;
    const res = gameState.playScareAudio(targetCam, handleGameEvent);
    if (res.success) {
      const played = soundManager.playAbhishekScare();
      if (played && played.subtitle) {
        setScareSubtitle(played.subtitle);
        setTimeout(() => setScareSubtitle(null), 3500);
      }
    }
    setGameState(refreshGameState(gameState));
    return res;
  }, [gameState, refreshGameState, handleGameEvent, isPaused]);

  const handleActivateGenerator = useCallback(() => {
    if (!gameState) return;
    gameState.solveGeneratorWirePuzzle(handleGameEvent);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, handleGameEvent]);

  const handleSelectCam = useCallback((camId) => {
    if (!gameState || isPaused) return;
    if (gameState.isVentCamMode) {
      gameState.currentVentCam = camId;
    } else {
      gameState.currentCam = camId;
    }
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, isPaused]);

  const handleToggleVentMode = useCallback(() => {
    if (!gameState || isPaused) return;
    gameState.toggleVentCamMode();
    soundManager.playStaticBurst(0.1, 0.15);
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, isPaused]);

  const handleSealVent = useCallback((ventId) => {
    if (!gameState || isPaused) return;
    gameState.toggleSealVent(ventId);
    soundManager.playDoorKnock();
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, isPaused]);

  const handleStartWindingMahadev = useCallback(() => {
    if (!gameState || isPaused) return;
    gameState.startWindingMahadev();
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, isPaused]);

  const handleStopWindingMahadev = useCallback(() => {
    if (!gameState || isPaused) return;
    gameState.stopWindingMahadev();
    setGameState(refreshGameState(gameState));
  }, [gameState, refreshGameState, isPaused]);

  const handleOmrComplete = useCallback(() => {
    if (!gameState || gameState.isGameOver) return null;
    const result = gameState.completeOmrUpload(handleGameEvent);
    soundManager.playUploadSuccess();
    setGameState(refreshGameState(gameState));
    return result;
  }, [gameState, refreshGameState, handleGameEvent]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (screen !== 'PLAYING') return;

      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        handleTogglePause();
        return;
      }

      if (isPaused) return;
      if (gameState && gameState.isOmrUploading) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleMonitor();
      } else if (e.code === 'KeyD') {
        e.preventDefault();
        handleToggleDoor();
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        handleToggleLight();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMask();
      } else if (e.code === 'KeyA') {
        e.preventDefault();
        handlePlayScare(gameState.isMonitorOpen ? gameState.currentCam : 'CORRIDOR_C');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, isPaused, gameState, handleTogglePause, handleToggleMonitor, handleToggleDoor, handleToggleLight, handleToggleMask, handlePlayScare]);

  return (
    <main className="w-screen min-h-[100dvh] h-[100dvh] overflow-hidden bg-black select-none font-mono">
      {screen === 'STUDIO_INTRO' && (
        <StudioIntro onFinish={() => {
          setScreen('MENU');
          soundManager.playMenuBgm();
        }} />
      )}

      {screen === 'MENU' && (
        <MainMenu
          onStartGame={handleStartGame}
          onStartTutorial={() => setScreen('TUTORIAL')}
          showMinutes={showMinutes}
          onToggleClockFormat={handleToggleClockFormat}
        />
      )}

      {screen === 'TUTORIAL' && (
        <TutorialGameplay
          onFinish={handleMainMenu}
          onStartNight1={() => handleStartGame(customConfigRef.current)}
        />
      )}

      {screen === 'INTRO' && (
        <NightIntro onFinish={handleIntroFinish} />
      )}

      {screen === 'PLAYING' && gameState && (
        <div className="relative w-full h-full">
          <OfficeView
            gameState={gameState}
            onToggleDoor={handleToggleDoor}
            onToggleLight={handleToggleLight}
            onToggleMonitor={handleToggleMonitor}
            onToggleMask={handleToggleMask}
            onPlayScare={() => handlePlayScare('CORRIDOR_C')}
            onPause={handleTogglePause}
            isDoorBanging={isDoorBanging}
            onOmrComplete={handleOmrComplete}
            scareSubtitle={scareSubtitle}
            onActivateGenerator={handleActivateGenerator}
            showMinutes={showMinutes}
            onToggleClockFormat={handleToggleClockFormat}
            isDisplayFlashing={cameraGlitch}
            ryanPenetratedMessage={ryanPenetratedMessage}
            sjinilHackedMessage={sjinilHackedMessage}
            onRefreshState={() => setGameState(refreshGameState(gameState))}
          />

          {gameState.isMonitorOpen && (
            <CameraMonitor
              gameState={gameState}
              onSelectCam={handleSelectCam}
              onToggleMonitor={handleToggleMonitor}
              onPlayScare={handlePlayScare}
              cameraGlitch={cameraGlitch}
              scareSubtitle={scareSubtitle}
              showMinutes={showMinutes}
              onToggleVentMode={handleToggleVentMode}
              onSealVent={handleSealVent}
              onStartWindingMahadev={handleStartWindingMahadev}
              onStopWindingMahadev={handleStopWindingMahadev}
              ryanPenetratedMessage={ryanPenetratedMessage}
              sjinilHackedMessage={sjinilHackedMessage}
            />
          )}

          {isPaused && (
            <PauseMenu
              gameState={gameState}
              onResume={handleResume}
              onMainMenu={handleMainMenu}
              onRestart={handleRetry}
            />
          )}
        </div>
      )}

      {screen === 'JUMPSCARE' && (
        <JumpscareOverlay
          jumpscareWho={jumpscareTarget}
          onJumpscareEnd={handleJumpscareEnd}
        />
      )}

      {screen === 'GAME_OVER' && (
        <GameOverScreen
          jumpscareWho={jumpscareTarget}
          onRetry={handleRetry}
          onMainMenu={handleMainMenu}
        />
      )}

      {screen === 'WIN' && (
        <NightWinScreen
          onPlayAgain={handleRetry}
          onMainMenu={handleMainMenu}
        />
      )}
    </main>
  );
}
