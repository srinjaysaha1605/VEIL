import React, { useState, useEffect, useRef } from 'react';
import { soundEffects } from '../utils/audio';

interface CatMascotProps {
  mode?: 'landing' | 'mascot';
  speechText?: string;
  onReveal?: () => void;
  className?: string;
}

export const CatMascot: React.FC<CatMascotProps> = ({
  mode = 'landing',
  speechText: externalSpeechText,
  onReveal,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const targetTextRef = useRef('');
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect function
  const typeText = (text: string, speed = 35) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    targetTextRef.current = text;
    setDisplayedText('');
    let index = 0;

    typingTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      }
    }, speed);
  };

  // External speech text prop (for main page mascot conversation)
  useEffect(() => {
    if (mode === 'mascot' && externalSpeechText) {
      typeText(externalSpeechText, 25);
    }
  }, [externalSpeechText, mode]);

  const handleMouseEnter = () => {
    if (mode === 'landing' && !isClicked) {
      setIsHovered(true);
      soundEffects.playSigilHover();
      typeText('Yo whats the word?', 30);
    }
  };

  const handleMouseLeave = () => {
    if (mode === 'landing' && !isClicked) {
      setIsHovered(false);
      setDisplayedText('');
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    }
  };

  const handleClick = () => {
    if (mode === 'landing' && !isClicked) {
      setIsClicked(true);
      soundEffects.playSigilClick();
      typeText('Bet.', 40);

      setTimeout(() => {
        if (onReveal) onReveal();
      }, 700);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={`relative select-none flex flex-col items-center justify-center pt-10 sm:pt-12 ${
        mode === 'landing' ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Dynamic Floating Chat Bubble - Responsive Wrapping & Centered */}
      {(displayedText || (mode === 'mascot' && externalSpeechText)) && (
        <div className="absolute top-0 z-20 animate-fadeIn pointer-events-none max-w-[88vw] sm:max-w-md w-max left-1/2 -translate-x-1/2">
          <div className="relative bg-[#0E1017] border border-amber-400/50 text-amber-300 font-mono text-xs sm:text-sm font-bold py-2 sm:py-2.5 px-3.5 sm:px-5 shadow-[0_0_25px_rgba(245,158,11,0.2)] flex items-center gap-1.5 text-center justify-center text-wrap break-words">
            <span>{displayedText}</span>
            <span className="w-1.5 h-3.5 sm:w-2 sm:h-4 bg-amber-400 animate-pulse inline-block shrink-0" />
            {/* Bubble Tail Arrow */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0E1017] border-r border-b border-amber-400/50 rotate-45" />
          </div>
        </div>
      )}

      {/* Cat Sigil SVG - Fully Responsive Scale */}
      <div className="relative">
        <svg
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`overflow-visible transition-all duration-300 filter ${
            mode === 'landing'
              ? 'w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] md:w-[240px] md:h-[240px]'
              : 'w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] md:w-[145px] md:h-[145px]'
          } ${
            isHovered || isClicked
              ? 'drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]'
              : 'drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Radar background grid */}
          <circle cx="120" cy="120" r="110" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="120" cy="120" r="85" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />

          {/* Outer Cat Head Silhouette */}
          {/* Left Ear */}
          <path
            d="M 50,110 L 30,35 L 90,65 Z"
            fill="#0D0E14"
            stroke={isHovered || isClicked ? '#F59E0B' : 'rgba(255, 255, 255, 0.3)'}
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />
          {/* Right Ear */}
          <path
            d="M 190,110 L 210,35 L 150,65 Z"
            fill="#0D0E14"
            stroke={isHovered || isClicked ? '#F59E0B' : 'rgba(255, 255, 255, 0.3)'}
            strokeWidth="1.5"
            strokeLinejoin="round"
            className="transition-colors duration-300"
          />

          {/* Head Contour */}
          <polygon
            points="50,110 90,65 150,65 190,110 170,185 120,210 70,185"
            fill="#12141C"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Whiskers */}
          <line x1="60" y1="150" x2="35" y2="155" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="60" y1="162" x2="30" y2="170" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="180" y1="150" x2="205" y2="155" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="180" y1="162" x2="210" y2="170" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Steganographic Crosshair Eyes behind lenses */}
          <g className="opacity-40">
            <circle cx="82" cy="118" r="14" stroke="#06B6D4" strokeWidth="1" fill="#08090C" />
            <circle cx="82" cy="118" r="4" fill="#10B981" />
            <circle cx="158" cy="118" r="14" stroke="#06B6D4" strokeWidth="1" fill="#08090C" />
            <circle cx="158" cy="118" r="4" fill="#10B981" />
          </g>

          {/* Iconic Machined Sunglasses */}
          <g>
            <polygon
              points="48,102 120,102 120,136 58,136"
              fill="#050608"
              stroke={isHovered || isClicked ? '#F59E0B' : 'rgba(255, 255, 255, 0.5)'}
              strokeWidth="1.5"
              className="transition-colors duration-300"
            />
            <polygon
              points="120,102 192,102 182,136 120,136"
              fill="#050608"
              stroke={isHovered || isClicked ? '#F59E0B' : 'rgba(255, 255, 255, 0.5)'}
              strokeWidth="1.5"
              className="transition-colors duration-300"
            />
            <rect x="115" y="102" width="10" height="6" fill="#1A1D28" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            {/* Glare Lines */}
            <line x1="56" y1="130" x2="80" y2="106" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
            <line x1="128" y1="130" x2="152" y2="106" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
          </g>

          {/* Nose/Mouth */}
          <polygon points="120,152 116,145 124,145" fill="rgba(255,255,255,0.4)" />
        </svg>
      </div>

      {/* Subtitle prompt for landing page */}
      {mode === 'landing' && (
        <div className="h-10 mt-6 flex items-center justify-center font-mono text-[11px]">
          <div
            className={`text-slate-500 tracking-[0.2em] uppercase transition-opacity duration-200 flex items-center gap-2 ${
              isHovered || displayedText ? 'opacity-0' : 'opacity-100 group-hover:text-amber-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors" />
            <span>[ LOCK IN ]</span>
          </div>
        </div>
      )}
    </div>
  );
};
