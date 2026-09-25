import React from 'react';
import { File, Image as ImageIcon, X, Check } from 'lucide-react';
import { soundEffects } from '../utils/audio';

interface FileObjectViewProps {
  label: string;
  name: string;
  sizeFormatted: string;
  type?: string;
  dimensions?: string;
  previewUrl?: string;
  onRemove?: () => void;
}

export const FileObjectView: React.FC<FileObjectViewProps> = ({
  label,
  name,
  sizeFormatted,
  type,
  dimensions,
  previewUrl,
  onRemove,
}) => {
  return (
    <div className="border border-white/20 bg-[#0C0E14] p-4 flex items-center justify-between gap-4 font-mono text-xs animate-fadeIn">
      <div className="flex items-center gap-3 overflow-hidden">
        {previewUrl ? (
          <div className="w-12 h-12 border border-white/20 bg-black overflow-hidden shrink-0">
            <img src={previewUrl} alt={name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 border border-white/15 bg-white/5 flex items-center justify-center shrink-0">
            <File className="w-5 h-5 text-slate-300" />
          </div>
        )}

        <div className="overflow-hidden space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
            {label}
          </div>
          <p className="text-sm font-bold text-slate-100 truncate">
            {name}
          </p>
          <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
            <span>{sizeFormatted}</span>
            {dimensions && (
              <>
                <span className="text-slate-600">|</span>
                <span>{dimensions}</span>
              </>
            )}
            {type && (
              <>
                <span className="text-slate-600">|</span>
                <span className="truncate max-w-[120px] sm:max-w-[160px]">{type}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={() => {
            soundEffects.playButtonClick();
            onRemove();
          }}
          className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors border border-transparent hover:border-white/10 shrink-0"
          title="Change selection"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
