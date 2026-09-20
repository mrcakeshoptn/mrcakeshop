// Thin, typed wrapper around window.localStorage. Kept separate from the
// repositories below so the *storage mechanism* (browser localStorage for the
// V1 demo) is isolated from the *repository interfaces* the UI depends on.
// Swapping to a real backend later means rewriting this file and the two
// repository implementations — no UI component needs to change.

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to save "${key}" to this browser's storage.`, err);
    return false;
  }
}

export function removeKey(key: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}

const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;

/**
 * Resizes and compresses an uploaded image in the browser before it is stored
 * as a data URL. Keeps demo catalogue data from bloating localStorage (which
 * has a hard ~5MB ceiling per origin in most browsers).
 */
export function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('That file is not an image. Please upload a JPG, PNG or WEBP.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That image could not be processed.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const scale = MAX_DIMENSION / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('This browser cannot process images.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
