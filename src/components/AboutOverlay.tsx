import React, { useState, useEffect } from 'react';
import { X, Shield, EyeOff, Info, Lock } from 'lucide-react';
import { CatMascot } from './CatMascot';

export type AboutTab = 'HOW_IT_WORKS' | 'PRIVACY' | 'ABOUT';

interface AboutOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AboutTab;
}

export const AboutOverlay: React.FC<AboutOverlayProps> = ({
  isOpen,
  onClose,
  initialTab = 'HOW_IT_WORKS',
}) => {
  const [activeTab, setActiveTab] = useState<AboutTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Header title depending on topic
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'HOW_IT_WORKS':
        return "HOW IT WORKS";
      case 'PRIVACY':
        return "PRIVACY & SECURITY";
      case 'ABOUT':
        return "ABOUT VEIL";
    }
  };

  // Unique Mascot Speech for each topic
  const getMascotSpeech = () => {
    switch (activeTab) {
      case 'HOW_IT_WORKS':
        return "We hide your secret file inside regular image pixels. Looks like a normal pic, but holds the vault!";
      case 'PRIVACY':
        return "Your files and passkey travel through secure, end-to-end encrypted cryptographic streams.";
      case 'ABOUT':
        return "Low-key hidden. High-key encrypted. Simple, clean, zero-cap steganography tool.";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0C0E14] border border-white/20 p-6 space-y-5 text-slate-200 font-mono text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-slate-100 uppercase tracking-widest">
              {getHeaderTitle()}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mascot Avatar & Dynamic Speech */}
        <div className="flex flex-col items-center justify-center py-2">
          <CatMascot mode="mascot" speechText={getMascotSpeech()} />
        </div>

        {/* Dynamic Content based on Active Topic */}
        <div className="space-y-3 leading-relaxed text-slate-300 min-h-[160px]">
          {activeTab === 'HOW_IT_WORKS' && (
            <div className="p-4 bg-white/5 border border-white/10 space-y-3 animate-fadeIn">
              <div className="text-amber-400 font-bold uppercase text-[11px] flex items-center gap-2">
                <EyeOff className="w-4 h-4" />
                HOW STEGANOGRAPHY WORKS
              </div>
              <ul className="space-y-2 text-slate-300 text-xs">
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">1.</span>
                  <span>Select any secret file and set a password.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">2.</span>
                  <span>VEIL encrypts your file and weaves the secret data into the subtle color values of image pixels.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400 font-bold">3.</span>
                  <span>Download the generated PNG image. To anyone else it looks like a regular picture — only your password can unmask it.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'PRIVACY' && (
            <div className="p-4 bg-white/5 border border-white/10 space-y-3 animate-fadeIn">
              <div className="text-emerald-400 font-bold uppercase text-[11px] flex items-center gap-2">
                <Shield className="w-4 h-4" />
                PRIVACY & SECURITY GUARANTEE
              </div>
              <ul className="space-y-2 text-slate-300 text-xs">
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong className="text-slate-100">Encrypted Transport:</strong> All requests travel securely over TLS encrypted HTTPS directly to the VEIL Cloud API service.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong className="text-slate-100">Stream Processing:</strong> Cryptographic embedding and extraction operations are executed via dedicated server-side cryptographic pipelines.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong className="text-slate-100">Authenticated Access:</strong> File contents are protected using standard PBKDF2 key derivation and AES-256-GCM encryption.</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'ABOUT' && (
            <div className="p-4 bg-white/5 border border-white/10 space-y-3 animate-fadeIn">
              <div className="text-slate-200 font-bold uppercase text-[11px] flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                ABOUT VEIL
              </div>
              <p className="text-slate-300 text-xs">
                VEIL is a modern, zero-cap steganography tool designed for privacy-conscious users.
                Instead of sending obviously encrypted attachment files, VEIL lets you conceal secret files inside unassuming PNG images.
              </p>
              <p className="text-slate-400 text-[11px] italic">
                “Low-key hidden. High-key encrypted.”
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-white/10 text-slate-500 text-[11px] flex justify-between items-center">
          <span>PRESS ESC TO CLOSE</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white underline underline-offset-4 cursor-pointer"
          >
            SAY LESS
          </button>
        </div>
      </div>
    </div>
  );
};
