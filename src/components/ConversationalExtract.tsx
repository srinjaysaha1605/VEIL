import React, { useState, useRef } from 'react';
import { Upload, Unlock, Download, RefreshCw, AlertCircle, CheckCircle2, FileText, Info } from 'lucide-react';
import { SteganographyResult } from '../types/steganography';
import { extractSteganography } from '../api/veilClient';
import { FileObjectView } from './FileObjectView';
import { CatMascot } from './CatMascot';
import { soundEffects } from '../utils/audio';

interface ConversationalExtractProps {
  onReset: () => void;
}

export const ConversationalExtract: React.FC<ConversationalExtractProps> = ({ onReset }) => {
  const [veilFile, setVeilFile] = useState<File | null>(null);
  const [veilPreviewUrl, setVeilPreviewUrl] = useState<string | undefined>(undefined);
  const [passphrase, setPassphrase] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<SteganographyResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [textPreviewContent, setTextPreviewContent] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleVeilFileSelect = (file: File | null) => {
    setResult(null);
    setErrorMsg(null);
    setTextPreviewContent(null);
    if (veilPreviewUrl) {
      URL.revokeObjectURL(veilPreviewUrl);
      setVeilPreviewUrl(undefined);
    }

    if (!file) {
      setVeilFile(null);
      return;
    }

    soundEffects.playButtonClick();
    setVeilFile(file);
    const url = URL.createObjectURL(file);
    setVeilPreviewUrl(url);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const canExecute = veilFile && passphrase.length >= 1 && !isProcessing;

  const handleExecuteExtract = async () => {
    if (!canExecute || !veilFile) return;

    soundEffects.playButtonClick();
    setIsProcessing(true);
    setErrorMsg(null);
    setResult(null);
    setTextPreviewContent(null);

    try {
      const res = await extractSteganography(veilFile, passphrase);
      if (res.success) {
        soundEffects.playSuccess();
        setResult(res);

        if (
          res.blob &&
          (res.mimeType?.startsWith('text/') ||
            res.fileName?.endsWith('.txt') ||
            res.fileName?.endsWith('.json') ||
            res.fileName?.endsWith('.md'))
        ) {
          try {
            const text = await res.blob.text();
            setTextPreviewContent(text.slice(0, 2000));
          } catch {
            // ignore
          }
        }
      } else {
        soundEffects.playError();
        setErrorMsg(res.message || 'Recovery failed.');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Decryption failed. Invalid passkey or non-VEIL image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Dynamic Speech
  const getCatSpeech = () => {
    if (result) return "Caught em! File extracted clean.";
    if (!veilFile) return "Drop the original VEIL PNG image. Do not convert or compress it.";
    if (!passphrase) return "Enter the secret passkey to unmask the file.";
    return "Ready to unmask! Hit the button below.";
  };

  return (
    <div className="space-y-8 max-w-2xl w-full mx-auto font-mono text-sm">
      {/* Mascot Guide */}
      <div className="flex flex-col items-center justify-center pt-2">
        <CatMascot mode="mascot" speechText={getCatSpeech()} />
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/png"
        onChange={(e) => e.target.files?.[0] && handleVeilFileSelect(e.target.files[0])}
        className="hidden"
      />

      {/* Step 1: Select VEIL PNG Image */}
      <div className="space-y-3">
        <p className="text-slate-200 font-bold text-sm tracking-wide">
          1. Original VEIL PNG Image
        </p>

        {!veilFile ? (
          <div
            onClick={() => imageInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleVeilFileSelect(e.dataTransfer.files[0]);
            }}
            className="p-8 border border-white/20 bg-[#0A0C10] hover:border-white/40 hover:bg-[#0E1016] cursor-pointer transition-all text-center space-y-3 shadow-md"
          >
            <Upload className="w-6 h-6 text-slate-400 mx-auto" />
            <div className="space-y-1">
              <p className="text-slate-200 text-sm font-medium">
                Drop original <strong className="text-amber-400 font-bold">VEIL PNG</strong> image here or <span className="underline underline-offset-4 text-slate-100 font-bold">browse PNG file</span>
              </p>
              <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Must be the uncompressed PNG. Do not convert or re-encode image.</span>
              </p>
            </div>
          </div>
        ) : (
          <FileObjectView
            label="VEIL PNG CARRIER"
            name={veilFile.name}
            sizeFormatted={formatBytes(veilFile.size)}
            type={veilFile.type || 'image/png'}
            previewUrl={veilPreviewUrl}
            onRemove={() => handleVeilFileSelect(null)}
          />
        )}
      </div>

      {/* Step 2: Secret Passkey */}
      {veilFile && (
        <div className="space-y-3 animate-fadeIn pt-2 border-t border-white/10">
          <p className="text-slate-300 font-bold text-sm tracking-wide">
            2. Secret Passkey
          </p>

          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Passkey..."
            className="w-full px-4 py-3 bg-[#0C0E14] border border-white/20 text-slate-100 font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-white/50 transition-colors"
          />
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-3 border border-rose-500/30 bg-rose-500/10 text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Execution Button */}
      {veilFile && passphrase.length >= 1 && !result && (
        <div className="pt-2 animate-fadeIn">
          <button
            type="button"
            onClick={handleExecuteExtract}
            disabled={!canExecute}
            className={`w-full py-4 px-6 font-mono font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              canExecute
                ? 'bg-slate-200 text-slate-950 hover:bg-white cursor-pointer shadow-md'
                : 'bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-900" />
                <span>SENDING TO VEIL API & UNMASKING...</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 text-slate-900" />
                <span>UNMASK HIDDEN FILE</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Output Tray */}
      {result && result.success && (
        <div className="p-6 border border-emerald-500/40 bg-[#0A0D12] space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>FILE UNMASKED & RECOVERED</span>
            </div>
            <span className="text-slate-400">
              TIME: <strong className="text-slate-200">{result.executionTimeMs} ms</strong>
            </span>
          </div>

          <div className="text-slate-300 space-y-1">
            <p>Recovered file: <strong className="text-slate-100">{result.fileName}</strong></p>
            <p>File size: <strong className="text-slate-100">{formatBytes(result.fileSizeBytes || 0)}</strong></p>
          </div>

          {textPreviewContent && (
            <div className="p-3 bg-black/60 border border-white/10 space-y-1">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>UNMASKED TEXT PREVIEW</span>
              </div>
              <pre className="text-[11px] text-slate-300 overflow-x-auto max-h-36">
                {textPreviewContent}
              </pre>
            </div>
          )}

          <a
            href={result.downloadUrl}
            download={result.fileName}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD RECOVERED FILE ({result.fileName})
          </a>

          <button
            type="button"
            onClick={onReset}
            className="w-full py-2.5 px-4 border border-white/15 hover:border-white/30 text-slate-300 hover:text-white text-xs uppercase tracking-wider transition-colors"
          >
            Unmask Another File
          </button>
        </div>
      )}
    </div>
  );
};
