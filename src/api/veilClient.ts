import { BackendHealth, CarrierImageInfo, FilePayloadInfo, SteganographyResult } from '../types/steganography';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Check health status of the Render backend (/health)
 */
export async function checkBackendHealth(): Promise<BackendHealth> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for Render wake-up

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        status: 'online',
        url: API_BASE_URL,
        version: data?.version || '1.0.0',
      };
    }
  } catch {
    // Health check failed or timed out
  }

  return { status: 'offline', url: API_BASE_URL };
}

/**
 * Parse human readable error message from response
 */
async function parseErrorMessage(response: Response, defaultMessage: string): Promise<string> {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await response.json();
      return json.detail || json.message || json.error || defaultMessage;
    }
    const text = await response.text();
    if (text && text.length < 200) return text;
  } catch {
    // ignore
  }
  return defaultMessage;
}

/**
 * HIDE operation
 * Sends multipart/form-data to POST /hide with fields: file, carrier, password
 */
export async function hideSteganography(
  secretFile: FilePayloadInfo,
  carrierImage: CarrierImageInfo,
  passphrase: string
): Promise<SteganographyResult> {
  const startTime = performance.now();

  try {
    const formData = new FormData();
    formData.append('file', secretFile.file);
    formData.append('carrier', carrierImage.file);
    formData.append('password', passphrase);

    // Browser automatically sets Content-Type header with multipart boundary
    const response = await fetch(`${API_BASE_URL}/hide`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const contentDisposition = response.headers.get('content-disposition');

      let fileName = 'veil.png';
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) fileName = match[1];
      }

      return {
        success: true,
        message: 'VEIL API: File successfully concealed inside carrier image.',
        downloadUrl,
        fileName,
        fileSizeBytes: blob.size,
        mimeType: 'image/png',
        blob,
        executionTimeMs: Math.round(performance.now() - startTime),
        usedBackend: true,
      };
    } else {
      const errorMsg = await parseErrorMessage(
        response,
        `Backend request failed with status ${response.status}`
      );
      return {
        success: false,
        message: errorMsg,
        executionTimeMs: Math.round(performance.now() - startTime),
      };
    }
  } catch (error: any) {
    console.error('Backend network error during /hide:', error);
    return {
      success: false,
      message: 'Unable to connect to VEIL API backend. Please check your connection or try again.',
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }
}

/**
 * EXTRACT operation
 * Sends multipart/form-data to POST /extract with fields: image, password
 */
export async function extractSteganography(
  veilImageFile: File,
  passphrase: string
): Promise<SteganographyResult> {
  const startTime = performance.now();

  try {
    const formData = new FormData();
    formData.append('image', veilImageFile);
    formData.append('password', passphrase);

    // Browser automatically sets Content-Type header with multipart boundary
    const response = await fetch(`${API_BASE_URL}/extract`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const contentDisposition = response.headers.get('content-disposition');

      let fileName = 'recovered-file';
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) fileName = match[1];
      }

      return {
        success: true,
        message: 'VEIL API: File successfully recovered from image.',
        downloadUrl,
        fileName,
        fileSizeBytes: blob.size,
        mimeType: blob.type || 'application/octet-stream',
        blob,
        executionTimeMs: Math.round(performance.now() - startTime),
        usedBackend: true,
      };
    } else {
      const errorMsg = await parseErrorMessage(
        response,
        'Decryption failed. Invalid password or invalid VEIL PNG image.'
      );
      return {
        success: false,
        message: errorMsg,
        executionTimeMs: Math.round(performance.now() - startTime),
      };
    }
  } catch (error: any) {
    console.error('Backend network error during /extract:', error);
    return {
      success: false,
      message: 'Unable to connect to VEIL API backend. Please check your connection or try again.',
      executionTimeMs: Math.round(performance.now() - startTime),
    };
  }
}
