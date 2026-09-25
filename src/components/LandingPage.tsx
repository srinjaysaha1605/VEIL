import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CatMascot } from './CatMascot';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    },
    { scope: pageRef }
  );

  return (
    <div
      ref={pageRef}
      className="fixed inset-0 z-50 bg-[#060709] text-slate-200 flex flex-col justify-between items-center p-8 select-none overflow-hidden font-mono"
    >
      {/* Spacer to maintain vertical flex centering */}
      <div className="w-full max-w-4xl h-4" />

      {/* Central Mascot Stage */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto text-center">
        <CatMascot mode="landing" onReveal={onEnter} />

        {/* Project Tagline Quote below Lock In */}
        <div className="mt-3 animate-fadeIn">
          <p className="font-['Syne'] font-bold text-sm sm:text-base md:text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-slate-100 to-amber-400 drop-shadow-[0_2px_12px_rgba(245,158,11,0.2)]">
            “Low-key hidden. High-key encrypted.”
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600 border-t border-white/10 pt-4">
        <span className="font-bold tracking-widest text-slate-400">VEIL</span>
        <span className="text-[10px] text-slate-500">
          CONCEALED IN PLAIN SIGHT · TAP TO LOCK IN
        </span>
      </div>
    </div>
  );
};
