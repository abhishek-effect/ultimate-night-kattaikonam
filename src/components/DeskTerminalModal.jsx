import React, { useState, useEffect, useRef } from 'react';
import {
  X, Upload, Folder, Wrench, AlertTriangle, CheckCircle2, RefreshCw,
  Trash2, ArrowRight, ShieldAlert, Wifi, Camera, Volume2, Wind,
  FileText, Check, HelpCircle, Lock, Radio
} from 'lucide-react';
import { soundManager } from '../audio/SoundManager';

export default function DeskTerminalModal({
  isOpen,
  onClose,
  gameState,
  onCompleteUpload,
  onRefreshState
}) {
  const [activeTab, setActiveTab] = useState('UPLOAD'); // 'UPLOAD' | 'FILES' | 'MAINTAIN'

  // --- UPLOAD STATE ---
  const [uploadStep, setUploadStep] = useState('CONFIRM'); // 'CONFIRM' | 'QUESTION' | 'PROMPT_DANNY_1' | 'UPLOADING' | 'PROMPT_DANNY_2' | 'COMPLETE'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCooldownMsg, setUploadCooldownMsg] = useState(null);

  // Vijitha PCM state
  const [pcmQuestion, setPcmQuestion] = useState(null);
  const [pcmSelectedAnswer, setPcmSelectedAnswer] = useState(null);
  const [pcmError, setPcmError] = useState(false);

  // Danny Vibrant state
  const [dannyGreetingInput, setDannyGreetingInput] = useState('');
  const [dannyGreetingWarning, setDannyGreetingWarning] = useState(null);
  const [dannyVibrantInput, setDannyVibrantInput] = useState('');
  const [dannyVibrantWarning, setDannyVibrantWarning] = useState(null);

  const uploadTimerRef = useRef(null);

  // Reset or initialize state when opening modal
  useEffect(() => {
    if (isOpen) {
      setUploadStep('CONFIRM');
      setUploadProgress(0);
      setPcmSelectedAnswer(null);
      setPcmError(false);
      setDannyGreetingInput('');
      setDannyGreetingWarning(null);
      setDannyVibrantInput('');
      setDannyVibrantWarning(null);
      setUploadCooldownMsg(null);

      // Pick a random PCM question for Vijitha
      const questions = [
        { q: "What is d/dx(x^2)?", options: ["2x", "x", "x^2", "2"], answer: "2x" },
        { q: "What is the value of Planck's constant (h)?", options: ["6.626 x 10^-34 J s", "3 x 10^8 m/s", "1.6 x 10^-19 C", "9.8 m/s^2"], answer: "6.626 x 10^-34 J s" },
        { q: "What is the derivative of sin(x)?", options: ["cos(x)", "-cos(x)", "sin(x)", "tan(x)"], answer: "cos(x)" },
        { q: "What is the SI unit of electric resistance?", options: ["Ohm", "Volt", "Ampere", "Tesla"], answer: "Ohm" },
        { q: "What is the formula for kinetic energy?", options: ["(1/2)mv^2", "mgh", "ma", "mv"], answer: "(1/2)mv^2" },
      ];
      setPcmQuestion(questions[Math.floor(Math.random() * questions.length)]);
    } else {
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current);
        uploadTimerRef.current = null;
      }
      if (gameState) gameState.isOmrUploading = false;
    }
  }, [isOpen, gameState]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
    };
  }, []);

  if (!isOpen || !gameState) return null;

  const isInternetDown = gameState.maintenance?.internet === 'ERROR';
  const cooldown = Math.ceil(gameState.omrCooldown || 0);
  const taskType = gameState.uploadTask || 'ligin';

  // --- UPLOAD HANDLERS ---
  const handleStartUploadProcess = () => {
    if (isInternetDown) {
      setUploadCooldownMsg('INTERNET OFFLINE // CANNOT UPLOAD');
      setTimeout(() => setUploadCooldownMsg(null), 2500);
      return;
    }
    if (cooldown > 0) {
      setUploadCooldownMsg(`Terminal cooling down (${cooldown}s remaining)`);
      setTimeout(() => setUploadCooldownMsg(null), 2500);
      return;
    }

    if (taskType === 'vijitha') {
      setUploadStep('QUESTION');
    } else if (taskType === 'danny') {
      setUploadStep('PROMPT_DANNY_1');
    } else {
      // Ligin or Sreekala: standard upload
      runProgressBar(8000);
    }
  };

  const handlePCMAnswer = (option) => {
    setPcmSelectedAnswer(option);
    if (option === pcmQuestion.answer) {
      setPcmError(false);
      setTimeout(() => {
        runProgressBar(4000); // Vijitha is faster (~4s)
      }, 350);
    } else {
      setPcmError(true);
      setTimeout(() => setPcmError(false), 2000);
    }
  };

  const handleDannyGreetingSubmit = () => {
    const trimmed = dannyGreetingInput.trim();
    // Rule: "if they type at least 1 letter (not including whitespace or numbers) danny should say 'Hey, say it energetically.'"
    // Energetic = ALL CAPS! If any lowercase letters:
    if (/[a-z]/.test(dannyGreetingInput)) {
      setDannyGreetingWarning("Hey, say it energetically.");
      return;
    }
    if (trimmed !== 'GOOD EVENING SIR') {
      setDannyGreetingWarning('Type "GOOD EVENING SIR" in all caps!');
      return;
    }

    setDannyGreetingWarning(null);
    runProgressBar(4000, () => {
      setUploadStep('PROMPT_DANNY_2');
    });
  };

  const handleDannyVibrantSubmit = () => {
    const trimmed = dannyVibrantInput.trim();
    if (trimmed !== 'VIBRANT') {
      setDannyVibrantWarning('Type "VIBRANT" in all caps!');
      return;
    }

    setDannyVibrantWarning(null);
    finalizeUpload();
  };

  const runProgressBar = (durationMs, onFinishedCallback = null) => {
    setUploadStep('UPLOADING');
    setUploadProgress(0);
    gameState.isOmrUploading = true;

    const intervalMs = 80;
    const increment = (intervalMs / durationMs) * 100;
    let current = 0;

    uploadTimerRef.current = setInterval(() => {
      current += increment + (Math.random() * 0.4);
      if (current >= 100) {
        current = 100;
        setUploadProgress(100);
        clearInterval(uploadTimerRef.current);
        uploadTimerRef.current = null;
        gameState.isOmrUploading = false;

        if (onFinishedCallback) {
          onFinishedCallback();
        } else {
          finalizeUpload();
        }
      } else {
        setUploadProgress(current);
      }
    }, intervalMs);
  };

  const finalizeUpload = () => {
    setUploadStep('COMPLETE');
    if (onCompleteUpload) onCompleteUpload();
    setTimeout(() => {
      onClose();
    }, 2200);
  };

  // --- RYAN FILES HANDLERS ---
  const handleTransferFile = (fileName) => {
    gameState.transferFile(fileName);
    onRefreshState();
  };

  const handleDeleteFile = (fileName) => {
    gameState.deleteFile(fileName);
    onRefreshState();
  };

  const handleRunExeFile = (fileName) => {
    gameState.runFile(fileName);
    onRefreshState();
  };

  // --- MAINTENANCE HANDLERS ---
  const handleReboot = (system) => {
    gameState.rebootMaintenanceSystem(system);
    soundManager.playWireConnect();
    onRefreshState();
  };

  const handleRebootAll = () => {
    gameState.rebootAllMaintenanceSystems();
    soundManager.playWireConnect();
    onRefreshState();
  };

  // Images for confirmation prompts
  const uploadImageSrc =
    taskType === 'sreekala'
      ? './Fnak photos/upload-sreekala.png'
      : taskType === 'vijitha'
      ? './Fnak photos/upload-vijitha.png'
      : taskType === 'danny'
      ? './Fnak photos/upload-danny.png'
      : './Fnak photos/upload-confirmation.png';

  const taskTitle =
    taskType === 'sreekala'
      ? 'SREEKALA ASSIGNMENT UPLINK'
      : taskType === 'vijitha'
      ? 'VIJITHA FAST-TRACK PCM TERMINAL'
      : taskType === 'danny'
      ? 'DANNY VIBRANT UPLINK'
      : 'LIGIN OMR EVALUATION TERMINAL';

  return (
    <div
      onClick={(e) => {
        if (uploadStep === 'UPLOADING') return;
        onClose();
      }}
      className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-fadeIn font-mono"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-neutral-950 border-2 border-neutral-700 rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92dvh]"
      >
        {/* Retro OS Window Titlebar */}
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-b border-neutral-800 px-3 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-gray-200 tracking-wider">
              CAMPUS TERMINAL OS // {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Status alerts */}
            {isInternetDown && (
              <span className="bg-red-950 border border-red-500 text-red-300 text-[9px] px-2 py-0.5 rounded animate-pulse font-bold">
                INTERNET OFFLINE
              </span>
            )}
            {gameState.sijin?.enabled && isInternetDown && (
              <span className="bg-yellow-950 border border-yellow-500 text-yellow-300 text-[9px] px-2 py-0.5 rounded font-bold">
                SJINIL BREACH: {Math.max(0, Math.ceil(gameState.sijin.maxWait - gameState.sijin.offlineTimer))}s
              </span>
            )}

            {uploadStep !== 'UPLOADING' && (
              <button
                onClick={onClose}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* 3 Main Desktop Mode Navigation Tabs (Upload, Files, Maintain) */}
        <div className="flex bg-neutral-900/90 border-b border-neutral-800 p-1 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('UPLOAD')}
            disabled={uploadStep === 'UPLOADING'}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'UPLOAD'
                ? 'bg-cyan-700 text-white shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            <Upload size={14} />
            <span>UPLOAD ({gameState.uploadTask?.toUpperCase() || 'LIGIN'})</span>
          </button>

          <button
            onClick={() => setActiveTab('FILES')}
            disabled={uploadStep === 'UPLOADING'}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer relative ${
              activeTab === 'FILES'
                ? 'bg-amber-600 text-white shadow-[0_0_12px_rgba(217,119,6,0.6)]'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            <Folder size={14} />
            <span>FILES (RYAN)</span>
            {gameState.ryan?.enabled && gameState.ryan.files.some(f => f.type === 'exe' && !f.deleted) && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-1 right-2" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('MAINTAIN')}
            disabled={uploadStep === 'UPLOADING'}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer relative ${
              activeTab === 'MAINTAIN'
                ? 'bg-emerald-700 text-white shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                : 'bg-black/40 text-gray-400 hover:text-white'
            }`}
          >
            <Wrench size={14} />
            <span>MAINTAIN (FNAF 3)</span>
            {['internet', 'cameras', 'sounds', 'vents'].some(s => gameState.maintenance?.[s] === 'ERROR') && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute top-1 right-2" />
            )}
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {/* ============================================================== */}
          {/* TAB 1: UPLOAD (Ligin, Sreekala, Vijitha, Danny)                  */}
          {/* ============================================================== */}
          {activeTab === 'UPLOAD' && (
            <div className="space-y-3">
              {uploadCooldownMsg && (
                <div className="p-2 bg-red-950/80 border border-red-500 text-red-200 text-xs font-bold rounded flex items-center gap-2 animate-bounce">
                  <AlertTriangle size={15} />
                  <span>{uploadCooldownMsg}</span>
                </div>
              )}

              {/* STEP 1: CONFIRMATION PROMPT (Uses upload image from photos dir) */}
              {uploadStep === 'CONFIRM' && (
                <div className="space-y-3 text-center">
                  <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-black max-h-52 sm:max-h-60 flex items-center justify-center p-2">
                    <img
                      src={uploadImageSrc}
                      alt={taskTitle}
                      className="max-h-48 sm:max-h-56 w-auto object-contain filter contrast-105"
                    />
                  </div>

                  <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-2.5 space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-white uppercase">
                      {taskTitle}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Upload count: <span className="text-emerald-400 font-bold">{gameState.omrUploadsInCycle}/{gameState.omrQuota}</span>. Every {gameState.omrQuota} uploads advances 1 in-game hour.
                    </p>
                    {taskType === 'vijitha' && (
                      <p className="text-[11px] text-cyan-300">
                        ⚡ High-speed upload enabled. Requires answering a Class 11 PCM question.
                      </p>
                    )}
                    {taskType === 'danny' && (
                      <p className="text-[11px] text-yellow-300">
                        🔥 Vibrant uplink protocol. Requires typing energetic greeting & response in ALL CAPS.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={handleStartUploadProcess}
                      disabled={isInternetDown || cooldown > 0}
                      className={`py-2.5 px-4 font-bold rounded-lg text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow cursor-pointer ${
                        isInternetDown || cooldown > 0
                          ? 'bg-neutral-800 text-gray-500 cursor-not-allowed border border-neutral-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-400 active:scale-95'
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      <span>{cooldown > 0 ? `WAIT ${cooldown}s` : 'START UPLOAD'}</span>
                    </button>

                    <button
                      onClick={onClose}
                      className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-gray-300 font-bold rounded-lg text-xs sm:text-sm border border-neutral-700 transition cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: VIJITHA PCM QUESTION */}
              {uploadStep === 'QUESTION' && pcmQuestion && (
                <div className="space-y-4 text-center p-3 bg-neutral-900 border-2 border-cyan-500/80 rounded-xl">
                  <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold text-sm">
                    <HelpCircle size={18} />
                    <span>VIJITHA CLASS 11 PCM VERIFICATION</span>
                  </div>

                  <div className="bg-black/60 p-3 rounded-lg border border-neutral-800">
                    <p className="text-sm sm:text-base font-bold text-yellow-300 font-mono">
                      &ldquo;{pcmQuestion.q}&rdquo;
                    </p>
                  </div>

                  {pcmError && (
                    <div className="text-red-400 font-bold text-xs animate-bounce">
                      Incorrect answer! Review your PCM formula and try again.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {pcmQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePCMAnswer(opt)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition cursor-pointer active:scale-95 ${
                          pcmSelectedAnswer === opt
                            ? opt === pcmQuestion.answer
                              ? 'bg-emerald-600 border-emerald-400 text-white'
                              : 'bg-red-700 border-red-500 text-white'
                            : 'bg-neutral-950 hover:bg-neutral-800 border-neutral-700 text-gray-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: DANNY ENERGETIC GREETING */}
              {uploadStep === 'PROMPT_DANNY_1' && (
                <div className="space-y-4 p-4 bg-neutral-900 border-2 border-yellow-500/80 rounded-xl text-center">
                  <div className="text-yellow-400 font-bold text-sm">
                    DANNY VIBRANT GREETING PROTOCOL
                  </div>
                  <p className="text-xs text-gray-300">
                    Before starting, please say <strong className="text-white">&quot;Good Evening Sir&quot;</strong> energetically in ALL CAPS:
                  </p>

                  <div className="max-w-sm mx-auto space-y-2">
                    <input
                      type="text"
                      value={dannyGreetingInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDannyGreetingInput(val);
                        // If typed at least 1 lowercase letter (not whitespace or numbers)
                        if (/[a-z]/.test(val)) {
                          setDannyGreetingWarning("Hey, say it energetically.");
                        } else {
                          setDannyGreetingWarning(null);
                        }
                      }}
                      placeholder="TYPE IN ALL CAPS..."
                      className="w-full py-2 px-3 bg-black border-2 border-neutral-700 focus:border-yellow-400 text-center text-sm font-bold text-white rounded uppercase tracking-wider"
                    />

                    {dannyGreetingWarning && (
                      <div className="bg-red-950/80 border border-red-500 text-yellow-300 text-xs font-bold p-1.5 rounded animate-bounce">
                        Danny: &ldquo;{dannyGreetingWarning}&rdquo;
                      </div>
                    )}

                    <button
                      onClick={handleDannyGreetingSubmit}
                      className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs rounded transition cursor-pointer uppercase"
                    >
                      SUBMIT ENERGETIC GREETING
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: UPLOADING BAR (Animated 20-segment replica) */}
              {uploadStep === 'UPLOADING' && (
                <div className="p-4 bg-neutral-900 text-emerald-400 space-y-4 rounded-xl border border-neutral-700 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Radio size={20} className="animate-spin text-emerald-400" />
                    <h4 className="text-sm sm:text-base font-bold text-white uppercase">
                      TRANSMITTING DATA PACKETS ({Math.round(uploadProgress)}%)...
                    </h4>
                  </div>

                  {/* 20 Segments Bar */}
                  <div className="w-full h-8 bg-neutral-950 border-2 border-neutral-700 rounded p-0.5 flex gap-1 items-center overflow-hidden">
                    {Array.from({ length: 20 }).map((_, idx) => {
                      const isFilled = idx < Math.floor((uploadProgress / 100) * 20);
                      return (
                        <div
                          key={idx}
                          className={`h-full flex-1 rounded-[1px] transition-all duration-75 ${
                            isFilled
                              ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                              : 'bg-neutral-900 border border-neutral-800'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-gray-400">
                    Do not close the terminal during transmission.
                  </p>
                </div>
              )}

              {/* STEP 5: DANNY FINISHING "WE ARE..? VIBRANT" */}
              {uploadStep === 'PROMPT_DANNY_2' && (
                <div className="space-y-4 p-4 bg-neutral-900 border-2 border-emerald-500/80 rounded-xl text-center">
                  <div className="text-emerald-400 font-bold text-base">
                    TRANSMISSION FINISHED!
                  </div>
                  <p className="text-sm font-bold text-white">
                    Screen displays: <span className="text-yellow-400 text-lg">&ldquo;We are..?&rdquo;</span>
                  </p>
                  <p className="text-xs text-gray-300">
                    Type response in ALL CAPS before shift progresses:
                  </p>

                  <div className="max-w-sm mx-auto space-y-2">
                    <input
                      type="text"
                      value={dannyVibrantInput}
                      onChange={(e) => {
                        setDannyVibrantInput(e.target.value);
                        setDannyVibrantWarning(null);
                      }}
                      placeholder="TYPE RESPONSE IN ALL CAPS..."
                      className="w-full py-2 px-3 bg-black border-2 border-neutral-700 focus:border-emerald-400 text-center text-sm font-bold text-white rounded uppercase tracking-wider"
                    />

                    {dannyVibrantWarning && (
                      <div className="bg-red-950/80 border border-red-500 text-yellow-300 text-xs font-bold p-1 rounded animate-bounce">
                        {dannyVibrantWarning}
                      </div>
                    )}

                    <button
                      onClick={handleDannyVibrantSubmit}
                      className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded transition cursor-pointer uppercase"
                    >
                      CONFIRM RESPONSE
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: COMPLETE CELEBRATION */}
              {uploadStep === 'COMPLETE' && (
                <div className="p-5 bg-emerald-950/80 border-2 border-emerald-500 rounded-xl text-center space-y-2 animate-bounce">
                  <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white uppercase">
                    UPLOAD VERIFIED & ACCEPTED
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Hour shift calculated successfully!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: FILES (Ryan File Management & Trojan .exe defense)        */}
          {/* ============================================================== */}
          {activeTab === 'FILES' && (
            <div className="space-y-3">
              <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-400">RYAN FILE REPOSITORY // Files-Ryan</span>
                  <div className="text-[10px] text-gray-400">
                    Click each file to Transfer. <strong className="text-red-400">WARNING:</strong> Delete any .exe files before 3:00 AM!
                  </div>
                </div>
              </div>

              {/* File List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {gameState.ryan?.files.map((file, idx) => {
                  const isExe = file.type === 'exe';
                  const isDeleted = Boolean(file.deleted);

                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border flex flex-col justify-between transition ${
                        isDeleted
                          ? 'bg-neutral-950/50 border-neutral-900 opacity-40'
                          : isExe
                          ? 'bg-red-950/40 border-red-600/80 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                          : file.transferred
                          ? 'bg-emerald-950/40 border-emerald-600/60'
                          : 'bg-neutral-900/80 border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded overflow-hidden bg-black shrink-0 border border-neutral-700 flex items-center justify-center">
                          {isExe ? (
                            <AlertTriangle size={18} className="text-red-500 animate-pulse" />
                          ) : (
                            <img src={file.src} alt={file.name} className="w-full h-full object-cover" />
                          )}
                        </div>

                        <div className="overflow-hidden flex-1">
                          <div className={`text-xs font-bold truncate ${isExe ? 'text-red-300' : 'text-gray-200'}`}>
                            {file.name}
                          </div>
                          <div className="text-[9px] text-gray-500">
                            {file.size} • {isDeleted ? 'DELETED' : file.transferred ? 'TRANSFERRED' : 'PENDING'}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 pt-1 border-t border-neutral-800">
                        {isExe ? (
                          !isDeleted ? (
                            <>
                              <button
                                onClick={() => handleDeleteFile(file.name)}
                                className="flex-1 py-1 bg-red-700 hover:bg-red-600 text-white font-bold text-[10px] rounded transition flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={11} />
                                <span>DELETE FILE</span>
                              </button>
                              <button
                                onClick={() => handleRunExeFile(file.name)}
                                className="py-1 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-400 text-[10px] rounded cursor-pointer"
                                title="Run Executable"
                              >
                                RUN
                              </button>
                            </>
                          ) : (
                            <span className="text-[9px] text-neutral-500 font-bold w-full text-center py-1">
                              SAFE // FILE PURGED
                            </span>
                          )
                        ) : (
                          <button
                            onClick={() => handleTransferFile(file.name)}
                            disabled={file.transferred}
                            className={`w-full py-1 rounded text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                              file.transferred
                                ? 'bg-emerald-950 border border-emerald-600 text-emerald-300 cursor-default'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-gray-200 border border-neutral-600 active:scale-95'
                            }`}
                          >
                            {file.transferred ? <Check size={11} /> : <ArrowRight size={11} />}
                            <span>{file.transferred ? 'TRANSFERRED' : 'TRANSFER'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: MAINTAIN (FNAF 3 Maintenance System)                     */}
          {/* ============================================================== */}
          {activeTab === 'MAINTAIN' && (
            <div className="space-y-3">
              <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-400">FACILITY SUBSYSTEM DIAGNOSTICS</span>
                  <div className="text-[10px] text-gray-400">
                    Reboot failing subsystems before animatronics exploit the vulnerability.
                  </div>
                </div>

                <button
                  onClick={handleRebootAll}
                  disabled={Boolean(gameState.maintenance?.rebootingSystem)}
                  className="py-1 px-3 bg-emerald-700 hover:bg-emerald-600 disabled:bg-neutral-800 disabled:text-gray-500 text-white font-bold text-xs rounded transition flex items-center gap-1 cursor-pointer active:scale-95 shadow"
                >
                  <RefreshCw size={12} className={gameState.maintenance?.rebootingSystem ? 'animate-spin' : ''} />
                  <span>REBOOT ALL</span>
                </button>
              </div>

              {/* 4 Systems Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'internet', name: 'INTERNET LINK', desc: 'Sjinil hacks computer if offline for >10-30s.', icon: Wifi },
                  { id: 'cameras', name: 'SECURITY CAMERAS', desc: 'Feeds cut to video loss static when offline.', icon: Camera },
                  { id: 'sounds', name: 'AUDIO SUBSYSTEM', desc: 'Scare audio unusable while broken.', icon: Volume2 },
                  { id: 'vents', name: 'VENTILATION UNIT', desc: 'Increases power drain; Ritul moves faster.', icon: Wind },
                ].map(sys => {
                  const status = gameState.maintenance?.[sys.id] || 'OK';
                  const isRebooting = status === 'REBOOTING';
                  const isError = status === 'ERROR';
                  const Icon = sys.icon;

                  return (
                    <div
                      key={sys.id}
                      className={`p-3 rounded-xl border-2 flex flex-col justify-between transition ${
                        isError
                          ? 'bg-red-950/60 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                          : isRebooting
                          ? 'bg-yellow-950/50 border-yellow-500'
                          : 'bg-neutral-900/80 border-neutral-800'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon size={18} className={isError ? 'text-red-400 animate-pulse' : 'text-emerald-400'} />
                          <div>
                            <div className="text-xs font-bold text-white">{sys.name}</div>
                            <div className="text-[9px] text-gray-400">{sys.desc}</div>
                          </div>
                        </div>

                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          isError
                            ? 'bg-red-950 border-red-500 text-red-300 animate-ping'
                            : isRebooting
                            ? 'bg-yellow-950 border-yellow-500 text-yellow-300 animate-pulse'
                            : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        }`}>
                          {status}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-neutral-800">
                        {isError ? (
                          <button
                            onClick={() => handleReboot(sys.id)}
                            disabled={Boolean(gameState.maintenance?.rebootingSystem)}
                            className="w-full py-1.5 bg-red-700 hover:bg-red-600 disabled:bg-neutral-800 disabled:text-gray-500 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow"
                          >
                            <RefreshCw size={12} />
                            <span>REBOOT {sys.name}</span>
                          </button>
                        ) : isRebooting ? (
                          <div className="text-center text-yellow-400 text-xs font-bold py-1 animate-pulse">
                            REBOOT IN PROGRESS...
                          </div>
                        ) : (
                          <div className="text-center text-emerald-400 text-xs font-semibold py-1">
                            ● OPERATIONAL
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
