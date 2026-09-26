import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { LandingPage } from './components/LandingPage';
import { AboutOverlay, AboutTab } from './components/AboutOverlay';
import { SecretTerminal } from './components/SecretTerminal';
import { ConversationalHide } from './components/ConversationalHide';
import { ConversationalExtract } from './components/ConversationalExtract';
import { CatMascot } from './components/CatMascot';
import { soundEffects } from './utils/audio';
import { bgMusic } from './utils/backgroundMusic';
import { ArrowRight, ArrowLeft, Volume2, VolumeX, Terminal as TerminalIcon } from 'lucide-react';

export default function App() {
  const [isEntered, setIsEntered] = useState<boolean>(false);
  const [stage, setStage] = useState<'CHOICE' | 'HIDE' | 'EXTRACT'>('CHOICE');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [aboutTab, setAboutTab] = useState<AboutTab>('HOW_IT_WORKS');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);

  // Lenis smooth scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret terminal shortcut: Ctrl + Shift + K or Cmd + Shift + K
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
        e.preventDefault();
        soundEffects.playButtonClick();
        setIsTerminalOpen((prev) => !prev);
        return;
      }

      // Help modal shortcut: ?
      if (e.key === '?' && !isAboutOpen && !isTerminalOpen) {
        openAboutModal('HOW_IT_WORKS');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAboutOpen, isTerminalOpen]);

  // Handle entry from landing page & play background music
  const handleEnterApp = () => {
    setIsEntered(true);
    bgMusic.startMusic();
    setTimeout(() => {
      setIsMusicPlaying(bgMusic.getIsPlaying());
    }, 150);
  };

  // Toggle background music on/off
  const handleToggleMusic = () => {
    soundEffects.playButtonClick();
    const playing = bgMusic.toggleMusic();
    setIsMusicPlaying(playing);
  };

  // GSAP state transitions
  useGSAP(
    () => {
      if (!isEntered) return;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        '.conversational-stage',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    },
    { dependencies: [stage, isEntered], scope: stageRef }
  );

  const handleChooseMode = (mode: 'HIDE' | 'EXTRACT') => {
    soundEffects.playModeToggle(mode);
    setStage(mode);
  };

  const handleResetStage = () => {
    soundEffects.playButtonClick();
    setStage('CHOICE');
  };

  const openAboutModal = (tab: AboutTab) => {
    soundEffects.playButtonClick();
    setAboutTab(tab);
    setIsAboutOpen(true);
  };

  return (
    <>
      {!isEntered && <LandingPage onEnter={handleEnterApp} />}

      {isEntered && (
        <div className="min-h-screen bg-[#060709] text-slate-100 flex flex-col justify-between font-mono selection:bg-slate-200 selection:text-slate-950">
          {/* Top Header Navbar */}
          <header className="w-full border-b border-white/10 px-5 lg:px-10 py-4.5">
            <div className="max-w-6xl w-full mx-auto grid grid-cols-2 md:grid-cols-3 items-center font-mono text-sm text-slate-300">
              {/* Left Logo */}
              <div className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playButtonClick();
                    setIsEntered(false);
                  }}
                  className="flex items-center gap-3 hover:text-white transition-all group cursor-pointer"
                  title="Bounce to main gate"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 border border-slate-400/60 group-hover:border-amber-400 bg-[#0C0E14] flex items-center justify-center transition-colors rounded-xs shadow-sm">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 240 240"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="overflow-visible"
                    >
                      <path
                        d="M 50,110 L 30,35 L 90,65 Z"
                        fill="#0D0E14"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        className="text-slate-200 group-hover:text-amber-400 transition-colors"
                      />
                      <path
                        d="M 190,110 L 210,35 L 150,65 Z"
                        fill="#0D0E14"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        className="text-slate-200 group-hover:text-amber-400 transition-colors"
                      />
                      <polygon
                        points="50,110 90,65 150,65 190,110 170,185 120,210 70,185"
                        fill="#12141C"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        className="text-slate-200 group-hover:text-amber-400 transition-colors"
                      />
                      <polygon
                        points="48,102 120,102 120,136 58,136"
                        fill="#050608"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-slate-200 group-hover:text-amber-400 transition-colors"
                      />
                      <polygon
                        points="120,102 192,102 182,136 120,136"
                        fill="#050608"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-slate-200 group-hover:text-amber-400 transition-colors"
                      />
                      <rect
                        x="115"
                        y="102"
                        width="10"
                        height="6"
                        fill="#1A1D28"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-slate-200 group-hover:text-amber-400 transition-colors"
                      />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-100 text-lg sm:text-xl tracking-widest font-mono">
                    VEIL
                  </span>
                </button>
              </div>
  
              {/* Mathematically Centered Navigation Links */}
              <nav className="hidden md:flex items-center justify-center gap-7 sm:gap-8 font-mono text-xs sm:text-sm text-slate-300">
                <button
                  type="button"
                  onClick={() => openAboutModal('HOW_IT_WORKS')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  How it works
                </button>
                <button
                  type="button"
                  onClick={() => openAboutModal('PRIVACY')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Privacy
                </button>
                <button
                  type="button"
                  onClick={() => openAboutModal('ABOUT')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  About
                </button>
              </nav>
  
              {/* Right Controls & Actions */}
              <div className="flex items-center justify-end gap-3">
                {/* Secret Terminal Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playButtonClick();
                    setIsTerminalOpen(true);
                  }}
                  className="p-2 border border-white/15 bg-white/5 hover:border-amber-400/60 hover:bg-white/10 text-slate-300 hover:text-amber-300 transition-all rounded-xs cursor-pointer shadow-xs flex items-center gap-1.5"
                  title="Secret Terminal (Ctrl+Shift+K)"
                  aria-label="Open secret terminal"
                >
                  <TerminalIcon className="w-4 h-4 text-amber-400" />
                </button>
  
                {/* Music ON/OFF Toggle Icon */}
                <button
                  type="button"
                  onClick={handleToggleMusic}
                  className="p-2 border border-white/15 bg-white/5 hover:border-amber-400/60 hover:bg-white/10 text-slate-200 hover:text-amber-300 transition-all rounded-xs cursor-pointer shadow-xs"
                  title={isMusicPlaying ? 'Mute music' : 'Play music'}
                  aria-label="Toggle background music"
                >
                  {isMusicPlaying ? (
                    <Volume2 className="w-4 h-4 text-amber-300" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                </button>
  
                {stage !== 'CHOICE' && (
                  <button
                    type="button"
                    onClick={handleResetStage}
                    className="text-xs sm:text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-bold font-mono tracking-wider"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Start Over</span>
                  </button>
                )}
              </div>
            </div>
          </header>
  
          {/* Main Stage */}
          <main ref={stageRef} className="flex-1 max-w-4xl w-full mx-auto px-4 lg:px-8 py-8 flex flex-col justify-center items-center">
            <div className="conversational-stage w-full">
              {stage === 'CHOICE' && (
                <div className="space-y-10 text-center max-w-xl mx-auto py-6">
                  {/* Cat Mascot Avatar */}
                  <div className="flex flex-col items-center justify-center pt-4">
                    <CatMascot
                      mode="mascot"
                      speechText="Yo, what we pullin off today? We lockin in a hidden file or unmasking one?"
                    />
                  </div>
  
                  <div className="space-y-5 pt-4">
                    <button
                      type="button"
                      onClick={() => handleChooseMode('HIDE')}
                      onMouseEnter={() => soundEffects.playSigilHover()}
                      className="w-full p-6 border border-white/20 hover:border-white/50 bg-[#0C0E14] hover:bg-[#12141C] text-slate-100 font-mono font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-between group cursor-pointer shadow-md"
                    >
                      <span>Lock in a secret file (Conceal)</span>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1.5 transition-all" />
                    </button>
  
                    <button
                      type="button"
                      onClick={() => handleChooseMode('EXTRACT')}
                      onMouseEnter={() => soundEffects.playSigilHover()}
                      className="w-full p-6 border border-white/20 hover:border-white/50 bg-[#0C0E14] hover:bg-[#12141C] text-slate-100 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-between group cursor-pointer shadow-md"
                    >
                      <span>Unmask a hidden file (Recover)</span>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1.5 transition-all" />
                    </button>
                  </div>
                </div>
              )}
  
              {stage === 'HIDE' && <ConversationalHide onReset={handleResetStage} />}
  
              {stage === 'EXTRACT' && <ConversationalExtract onReset={handleResetStage} />}
            </div>
          </main>
  
          {/* About / Info Overlay Modal */}
          <AboutOverlay
            isOpen={isAboutOpen}
            initialTab={aboutTab}
            onClose={() => setIsAboutOpen(false)}
          />
  
          {/* Secret Terminal Overlay */}
          <SecretTerminal
            isOpen={isTerminalOpen}
            onClose={() => setIsTerminalOpen(false)}
          />
  
          {/* Minimal Footer */}
          <footer className="w-full border-t border-white/10 py-4 px-4 text-center text-slate-600 font-mono text-[11px]">
            VEIL · ZERO CAP CRYPTOGRAPHIC INSTRUMENT
          </footer>
        </div>
      )}
    </>
  );
}
