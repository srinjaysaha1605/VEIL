export type OperationalMode = 'HIDE' | 'EXTRACT' | 'INSPECT';

export interface FilePayloadInfo {
  file: File;
  name: string;
  sizeBytes: number;
  type: string;
  hashSha256?: string;
}

export interface CarrierImageInfo {
  file: File;
  name: string;
  width: number;
  height: number;
  totalPixels: number;
  maxCapacityBytes: number;
  previewUrl: string;
}

export interface SteganographyResult {
  success: boolean;
  message?: string;
  downloadUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  blob?: Blob;
  entropy?: number;
  executionTimeMs?: number;
  usedBackend?: boolean;
}

export interface BackendHealth {
  status: 'online' | 'offline' | 'checking';
  url: string;
  version?: string;
}
