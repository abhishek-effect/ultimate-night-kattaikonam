import React, { useEffect, useState } from 'react';
import { soundManager } from '../audio/SoundManager';

export default function JumpscareOverlay({ jumpscareWho, onJumpscareEnd }) {
  const [showStaticCut, setShowStaticCut] = useState(false);

  useEffect(() => {
    soundManager.playJumpscare();

    const staticTimer = setTimeout(() => {
      setShowStaticCut(true);
      soundManager.playStaticBurst(0.8, 0.4);
    }, 1600);

    const endTimer = setTimeout(() => {
      onJumpscareEnd();
    }, 2400);

    return () => {
      clearTimeout(staticTimer);
      clearTimeout(endTimer);
    };
  }, [onJumpscareEnd]);

  let imageSrc = './Fnak photos/Enemies/AB-jumpscare.jpg';
  let title = 'AB ATTACKED';

  switch (jumpscareWho) {
    case 'dipu':
      imageSrc = './Fnak photos/Enemies/dipu-jumpscare.png';
      title = 'DIPU ATTACKED';
      break;
    case 'aadesh':
      imageSrc = './Fnak photos/Enemies/aadesh-jumpscare.jpg';
      title = 'AADESH ATTACKED';
      break;
    case 'johann':
      imageSrc = './Fnak photos/Enemies/johann-jumpscare.jpg';
      title = 'JOHANN ATTACKED';
      break;
    case 'ritul':
      imageSrc = './Fnak photos/Enemies/ritul2.png';
      title = 'RITUL ATTACKED';
      break;
    case 'mahadev':
      imageSrc = './Fnak photos/Enemies/mahadev3.png';
      title = 'MAHADEV ATTACKED';
      break;
    case 'sijin':
      imageSrc = './Fnak photos/Enemies/sijin-2.png';
      title = 'SJINIL HACKED & ATTACKED';
      break;
    case 'ryan':
      imageSrc = './Fnak photos/Enemies/ryan.png';
      title = 'RYAN PENETRATED & ATTACKED';
      break;
    default:
      imageSrc = './Fnak photos/Enemies/AB-jumpscare.jpg';
      title = 'ANIMATRONIC ATTACKED';
      break;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none font-mono">
      {!showStaticCut ? (
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center jumpscare-anim pointer-events-none">
            <img
              src={imageSrc}
              alt={title}
              loading="eager"
              decoding="sync"
              className="max-h-[90vh] md:max-h-[95vh] w-auto max-w-[95vw] object-contain face-clear rounded-2xl"
            />
          </div>
          <div className="absolute inset-0 bg-red-600/25 mix-blend-screen pointer-events-none animate-ping" />
          <div className="crt-overlay" />
          <div className="crt-vignette" />
        </div>
      ) : (
        <div className="relative w-full h-full bg-neutral-900 static-fuzz flex items-center justify-center">
          <div className="text-center space-y-2">
            <h2 className="text-red-600 text-3xl font-black tracking-widest glitch-text">
              SIGNAL LOST
            </h2>
            <p className="text-gray-400 text-sm tracking-widest uppercase">
              SECURITY SYSTEM DISCONNECTED // {title}
            </p>
          </div>
          <div className="crt-overlay" />
        </div>
      )}
    </div>
  );
}
