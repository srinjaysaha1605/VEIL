/**
 * VEIL Image & Payload Utility Engine
 * Provides SHA-256 hash calculation, carrier image loader, and LSB capacity calculations
 */

/**
 * Compute SHA-256 hash of a file for verification telemetry
 */
export async function computeSha256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Load image file into HTMLImageElement
 */
export function loadImage(file: File): Promise<{ img: HTMLImageElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () =>
      reject(
        new Error('Failed to decode carrier image file. Ensure it is a valid PNG, JPG, or WebP.')
      );
    img.src = url;
  });
}

/**
 * Calculate carrier image capacity in bytes
 */
export function calculateCapacity(width: number, height: number): number {
  // We use 1 bit per RGB channel (3 bits per pixel) to preserve high visual fidelity
  // 1 pixel = 3 bits of data
  // Capacity = (width * height * 3) / 8 bytes - overhead
  const totalBits = width * height * 3;
  const rawBytes = Math.floor(totalBits / 8);
  // Reserve ~500 bytes for metadata overhead (header, salt, IV, filename, MAC tag)
  return Math.max(0, rawBytes - 500);
}
