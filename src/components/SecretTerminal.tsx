import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Copy, Check, ShieldAlert, Sparkles, Clock, Key } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface SecretTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string | React.ReactNode;
}

/**
 * High-Entropy CSPRNG Password Generator using Web Crypto API
 */
function generateCsprngPassword(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const validLength = Math.max(8, Math.min(128, length));
  const array = new Uint8Array(validLength);
  window.crypto.getRandomValues(array);
  
  return Array.from(array)
    .map((byte) => chars[byte % chars.length])
    .join('');
}

export const SecretTerminal: React.FC<SecretTerminalProps> = ({ isOpen, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'VEIL SECRET TERMINAL v2.0.4 [CSPRNG & DIAGNOSTICS ACTIVE]',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Type "help" to list available secret commands. Press ESC or type "exit" to quit.',
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [copiedPass, setCopiedPass] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (isOpen) {
      terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  const appendLog = (type: CommandLog['type'], text: string | React.ReactNode) => {
    setLogs((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type, text }]);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    soundEffects.playButtonClick();
    setCopiedPass(text);
    setTimeout(() => setCopiedPass(null), 2000);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    soundEffects.playButtonClick();

    // Log user input
    appendLog('input', `veil-sh:~# ${cmd}`);
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setInputVal('');

    const lowerCmd = cmd.toLowerCase();

    // Command parser
    if (lowerCmd === 'clear' || lowerCmd === 'cls') {
      setLogs([]);
      return;
    }

    if (lowerCmd === 'exit' || lowerCmd === 'quit') {
      onClose();
      return;
    }

    if (lowerCmd === 'help' || lowerCmd === '?') {
      appendLog(
        'output',
        <div className="space-y-1 text-slate-300 py-1">
          <p className="text-amber-400 font-bold">AVAILABLE SECRET COMMANDS:</p>
          <p><span className="text-emerald-400 font-bold">show time</span> | <span className="text-emerald-400 font-bold">time</span> : Displays high-precision local time & Unix timestamp</p>
          <p><span className="text-emerald-400 font-bold">genpass [length]</span> | <span className="text-emerald-400 font-bold">pass</span> : CSPRNG cryptographic password generator (Default 32 chars)</p>
          <p><span className="text-emerald-400 font-bold">cat</span> | <span className="text-emerald-400 font-bold">mascot</span> : Render ASCII Mascot Sigil</p>
          <p><span className="text-emerald-400 font-bold">veil</span> | <span className="text-emerald-400 font-bold">status</span> : System cryptographic engine diagnostics</p>
          <p><span className="text-emerald-400 font-bold">clear</span> : Clear terminal output logs</p>
          <p><span className="text-emerald-400 font-bold">exit</span> : Close secret terminal session</p>
        </div>
      );
      return;
    }

    if (lowerCmd === 'time' || lowerCmd === 'show time' || lowerCmd === 'date') {
      const now = new Date();
      appendLog(
        'success',
        <div className="p-2.5 bg-black/60 border border-amber-500/30 text-amber-300 space-y-1 my-1">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Clock className="w-4 h-4" />
            <span>SYSTEM CHRONOMETER</span>
          </div>
          <p>Local Time: <strong className="text-white">{now.toString()}</strong></p>
          <p>ISO UTC: <strong className="text-white">{now.toISOString()}</strong></p>
          <p>Unix Epoch: <strong className="text-white">{now.getTime()} ms</strong></p>
          <p>Time Zone Offset: <strong className="text-white">UTC{now.getTimezoneOffset() <= 0 ? '+' : '-'}{Math.abs(now.getTimezoneOffset() / 60)} hours</strong></p>
        </div>
      );
      return;
    }

    if (
      lowerCmd.startsWith('genpass') ||
      lowerCmd.startsWith('pass') ||
      lowerCmd.startsWith('password')
    ) {
      const parts = cmd.split(' ');
      let len = 32;
      if (parts.length > 1 && !isNaN(parseInt(parts[1], 10))) {
        len = parseInt(parts[1], 10);
      }

      const pass = generateCsprngPassword(len);

      appendLog(
        'success',
        <div className="p-3 bg-[#0A0D12] border border-emerald-500/40 text-emerald-300 space-y-2 my-1">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Key className="w-4 h-4" />
              <span>CSPRNG HIGH-ENTROPY PASSKEY ({pass.length} CHARS)</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(pass)}
              className="text-xs bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 px-2 py-0.5 text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedPass === pass ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedPass === pass ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>
          <p className="font-mono text-sm tracking-widest text-amber-300 break-all bg-black/80 p-2 border border-white/10 select-all">
            {pass}
          </p>
          <p className="text-[10px] text-slate-400 italic">
            Entropy: ~{(pass.length * 6.55).toFixed(1)} bits | Generated using Web Crypto CSPRNG (window.crypto.getRandomValues)
          </p>
        </div>
      );
      return;
    }

    if (lowerCmd === 'cat' || lowerCmd === 'mascot') {
      appendLog(
        'output',
        <pre className="text-amber-400 text-[10px] leading-none py-2 font-mono">
{`
       /\\_/\\  
      ( o.o )  [ VEIL MASCOT SIGIL ]
       > ^ <   "NO CAP, ALWAYS CONCEALED"
`}
        </pre>
      );
      return;
    }

    if (lowerCmd === 'veil' || lowerCmd === 'status') {
      appendLog(
        'output',
        <div className="p-2.5 bg-black/60 border border-slate-700 text-slate-200 space-y-1 my-1">
          <p className="text-emerald-400 font-bold">VEIL ENGINE STATUS: 100% OPERATIONAL</p>
          <p>Algorithm: AES-256-GCM + PBKDF2 (100,000 Iterations)</p>
          <p>Carrier Protocol: RGB LSB PNG Matrix</p>
          <p>Hardware Randomness: CSPRNG Active</p>
        </div>
      );
      return;
    }

    // Unrecognized command
    appendLog(
      'error',
      `Command not found: "${cmd}". Type "help" for a list of valid secret commands.`
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          setHistoryIndex(nextIdx);
          setInputVal(history[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#08090C] border border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col h-[520px] max-h-[85vh] font-mono text-xs overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="bg-[#0E1017] border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2.5">
            <TerminalIcon className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-bold text-amber-300 tracking-wider">VEIL SECRET TERMINAL</span>
            <span className="text-[10px] text-slate-500 border border-white/10 px-1.5 py-0.5 rounded-xs">
              Ctrl+Shift+K
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Output Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-slate-200">
          {logs.map((log) => (
            <div key={log.id} className="break-words">
              {log.type === 'input' && (
                <div className="text-amber-400 font-bold">{log.text}</div>
              )}
              {log.type === 'output' && (
                <div className="text-slate-300">{log.text}</div>
              )}
              {log.type === 'error' && (
                <div className="text-rose-400 font-semibold">{log.text}</div>
              )}
              {log.type === 'success' && <div>{log.text}</div>}
            </div>
          ))}
          <div ref={terminalBottomRef} />
        </div>

        {/* Command Line Input */}
        <form
          onSubmit={handleCommandSubmit}
          className="bg-[#0A0C10] border-t border-amber-500/30 px-4 py-3 flex items-center gap-2"
        >
          <span className="text-amber-400 font-bold shrink-0">veil-sh:~#</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help' or 'genpass' or 'time'..."
            className="w-full bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
};
