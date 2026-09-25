import React, { useState, useRef } from 'react';
import { Upload, KeyRound, Lock, Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CarrierImageInfo, FilePayloadInfo, SteganographyResult } from '../types/steganography';
import { calculateCapacity, computeSha256, loadImage } from '../utils/steganographyEngine';
import { hideSteganography } from '../api/veilClient';
import { FileObjectView } from './FileObjectView';
import { CapacityMeter } from './CapacityMeter';
import { CatMascot } from './CatMascot';
import { soundEffects } from '../utils/audio';

interface ConversationalHideProps {
  onReset: () => void;
}

export const ConversationalHide: React.FC<ConversationalHideProps> = ({ onReset }) => {
  const [secretFile, setSecretFile] = useState<FilePayloadInfo | null>(null);
  const [carrierImage, setCarrierImage] = useState<CarrierImageInfo | null>(null);
  const [passphrase, setPassphrase] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<SteganographyResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const carrierInputRef = useRef<HTMLInputElement>(null);

  const handleSecretFileSelect = async (file: File | null) => {
    setResult(null);
    setErrorMsg(null);
    if (!file) {
      setSecretFile(null);
      return;
    }

    try {
      soundEffects.playButtonClick();
      const hashSha256 = await computeSha256(file);
      setSecretFile({
        file,
        name: file.name,
        sizeBytes: file.size,
        type: file.type || 'binary/raw',
        hashSha256,
      });
    } catch {
      setSecretFile({
        file,
        name: file.name,
        sizeBytes: file.size,
        type: file.type || 'binary/raw',
      });
    }
  };

  const handleCarrierImageSelect = async (file: File | null) => {
    setResult(null);
    setErrorMsg(null);
    if (!file) {
      setCarrierImage(null);
      return;
    }

    try {
      soundEffects.playButtonClick();
      const { img, url } = await loadImage(file);
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const totalPixels = width * height;
      const maxCapacityBytes = calculateCapacity(width, height);

      setCarrierImage({
        file,
        name: file.name,
        width,
        height,
        totalPixels,
        maxCapacityBytes,
        previewUrl: url,
      });
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Invalid carrier image.');
      setCarrierImage(null);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const isOverflow =
    secretFile && carrierImage ? secretFile.sizeBytes > carrierImage.maxCapacityBytes : false;

  const canExecute = secretFile && carrierImage && passphrase.length >= 4 && !isOverflow && !isProcessing;

  const handleExecuteHide = async () => {
    if (!canExecute || !secretFile || !carrierImage) return;

    soundEffects.playButtonClick();
    setIsProcessing(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await hideSteganography(secretFile, carrierImage, passphrase);
      if (res.success) {
        soundEffects.playSuccess();
        setResult(res);
      } else {
        soundEffects.playError();
        setErrorMsg(res.message || 'Embedding failed.');
      }
    } catch (err: any) {
      soundEffects.playError();
      setErrorMsg(err?.message || 'Encryption error.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Dynamic Cat Speech depending on state
  const getCatSpeech = () => {
    if (result) return "File secured in plain sight! Real ones won't even notice.";
    if (!secretFile) return "Drop your secret file here. Don't let em catch you slippin.";
    if (!carrierImage) return "Solid file choice. Now pick a cover image — PNG or JPG!";
    if (passphrase.length < 4) return "Set a secret passkey. No cap, don't forget it!";
    return "Ready to cook! Hit the button below to lock it in.";
  };

  return (
    <div className="space-y-8 max-w-2xl w-full mx-auto font-mono text-sm">
      {/* Cat Mascot Guide */}
      <div className="flex flex-col items-center justify-center pt-2">
        <CatMascot mode="mascot" speechText={getCatSpeech()} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => e.target.files?.[0] && handleSecretFileSelect(e.target.files[0])}
        className="hidden"
      />
      <input
        ref={carrierInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => e.target.files?.[0] && handleCarrierImageSelect(e.target.files[0])}
        className="hidden"
      />

      {/* Step 1: Secret File Selection */}
      <div className="space-y-3">
        <p className="text-slate-200 font-bold text-sm tracking-wide">
          1. Secret File
        </p>

        {!secretFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleSecretFileSelect(e.dataTransfer.files[0]);
            }}
            className="p-8 border border-white/20 bg-[#0A0C10] hover:border-white/40 hover:bg-[#0E1016] cursor-pointer transition-all text-center space-y-3 shadow-md"
          >
            <Upload className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-slate-200 text-sm font-medium">
              Drop secret file here or <span className="underline underline-offset-4 text-slate-100 font-bold">browse file</span>
            </p>
          </div>
        ) : (
          <FileObjectView
            label="SECRET FILE"
            name={secretFile.name}
            sizeFormatted={formatBytes(secretFile.sizeBytes)}
            type={secretFile.type}
            onRemove={() => setSecretFile(null)}
          />
        )}
      </div>

      {/* Step 2: Cover Image Selection */}
      {secretFile && (
        <div className="space-y-3 animate-fadeIn pt-2 border-t border-white/10">
          <p className="text-slate-300 font-bold text-sm tracking-wide">
            2. Cover Image Carrier
          </p>

          {!carrierImage ? (
            <div
              onClick={() => carrierInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleCarrierImageSelect(e.dataTransfer.files[0]);
              }}
              className="p-8 border border-white/20 bg-[#0A0C10] hover:border-white/40 hover:bg-[#0E1016] cursor-pointer transition-all text-center space-y-3 shadow-md"
            >
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-slate-200 text-sm font-medium">
                Drop PNG, JPG, or WebP image or <span className="underline underline-offset-4 text-slate-100 font-bold">browse cover image</span>
              </p>
            </div>
          ) : (
            <FileObjectView
              label="COVER CARRIER"
              name={carrierImage.name}
              sizeFormatted={formatBytes(carrierImage.file.size)}
              dimensions={`${carrierImage.width}×${carrierImage.height}px`}
              previewUrl={carrierImage.previewUrl}
              onRemove={() => setCarrierImage(null)}
            />
          )}

          {carrierImage && (
            <CapacityMeter
              payloadBytes={secretFile.sizeBytes}
              maxCapacityBytes={carrierImage.maxCapacityBytes}
              carrierWidth={carrierImage.width}
              carrierHeight={carrierImage.height}
            />
          )}
        </div>
      )}

      {/* Step 3: Secret Passkey */}
      {secretFile && carrierImage && (
        <div className="space-y-3 animate-fadeIn pt-2 border-t border-white/10">
          <p className="text-slate-300 font-bold text-sm tracking-wide">
            3. Secret Passkey
          </p>

          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Min 4 characters..."
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
      {secretFile && carrierImage && passphrase.length >= 4 && !result && (
        <div className="pt-2 animate-fadeIn">
          <button
            type="button"
            onClick={handleExecuteHide}
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
                <span>LOCKING IT IN...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-slate-900" />
                <span>LOCK IT IN & CONCEAL FILE</span>
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
              <span>FILE LOCKED & CONCEALED</span>
            </div>
            <span className="text-slate-400">
              TIME: <strong className="text-slate-200">{result.executionTimeMs} ms</strong>
            </span>
          </div>

          <div className="text-slate-300 space-y-1">
            <p>Cover image output: <strong className="text-slate-100">{result.fileName}</strong></p>
            <p>File size: <strong className="text-slate-100">{formatBytes(result.fileSizeBytes || 0)}</strong></p>
          </div>

          <a
            href={result.downloadUrl}
            download={result.fileName}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            DOWNLOAD CONCEALED PNG
          </a>

          <button
            type="button"
            onClick={onReset}
            className="w-full py-2.5 px-4 border border-white/15 hover:border-white/30 text-slate-300 hover:text-white text-xs uppercase tracking-wider transition-colors"
          >
            Lock In Another Secret File
          </button>
        </div>
      )}
    </div>
  );
};
