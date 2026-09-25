import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CapacityMeterProps {
  payloadBytes: number;
  maxCapacityBytes: number;
  carrierWidth?: number;
  carrierHeight?: number;
}

export const CapacityMeter: React.FC<CapacityMeterProps> = ({
  payloadBytes,
  maxCapacityBytes,
  carrierWidth,
  carrierHeight,
}) => {
  const isOverflow = payloadBytes > maxCapacityBytes;
  const percentage = maxCapacityBytes > 0 
    ? Math.min(100, (payloadBytes / maxCapacityBytes) * 100) 
    : 0;

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="p-4 bg-[#0E1015] border border-white/10 space-y-2.5 font-mono text-xs">
      <div className="flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase">LSB DENSITY CAPACITY</span>
        </div>

        {carrierWidth && carrierHeight && (
          <div className="text-slate-400">
            <span>PIXELS: </span>
            <span className="text-slate-200 font-bold tabular-nums">{carrierWidth}×{carrierHeight}</span>
          </div>
        )}
      </div>

      {/* Solid precision gauge bar */}
      <div className="w-full h-1.5 bg-[#1A1D26] overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isOverflow
              ? 'bg-rose-500'
              : percentage > 85
              ? 'bg-amber-400'
              : 'bg-emerald-400'
          }`}
          style={{ width: `${maxCapacityBytes > 0 ? Math.min(100, percentage) : 0}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-slate-400 text-[11px]">
        <div>
          <span>PAYLOAD: </span>
          <span className={`font-semibold tabular-nums ${isOverflow ? 'text-rose-400' : 'text-slate-200'}`}>
            {formatBytes(payloadBytes)}
          </span>
        </div>

        <div>
          <span>MAX: </span>
          <span className="font-semibold text-slate-200 tabular-nums">
            {formatBytes(maxCapacityBytes)}
          </span>
        </div>

        <div>
          <span>UTILIZATION: </span>
          <span
            className={`font-semibold tabular-nums ${
              isOverflow ? 'text-rose-400 font-bold' : percentage > 85 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {isOverflow && (
        <div className="p-2 border border-rose-500/30 bg-rose-500/10 text-rose-300 flex items-center gap-2 text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span>Payload size exceeds carrier LSB capacity. Select a larger carrier.</span>
        </div>
      )}
    </div>
  );
};
