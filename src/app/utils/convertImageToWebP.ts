export interface ConvertImageToWebPOptions {
  /** 0–1, default 0.85 */
  quality?: number;
  /** If set, scales down so width does not exceed this (preserves aspect ratio). */
  maxWidth?: number;
}

function sanitizeBaseName(name: string): string {
  const base = name.replace(/\.[^.]+$/, '').trim() || 'image';
  return base.replace(/[^\w.-]+/g, '_').slice(0, 120);
}

function loadImageBitmap(file: File): Promise<ImageBitmap> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file);
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      createImageBitmap(img).then(resolve, reject);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image'));
    };
    img.src = url;
  });
}

function canvasToWebPBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('WebP encoding is not supported in this browser'));
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Converts raster uploads to WebP in the browser via Canvas.
 * Already-WebP files are returned unchanged (no re-encode).
 */
export async function convertImageFileToWebP(
  file: File,
  options: ConvertImageToWebPOptions = {}
): Promise<File> {
  if (file.type === 'image/webp') {
    const name = file.name.toLowerCase().endsWith('.webp') ? file.name : `${sanitizeBaseName(file.name)}.webp`;
    return new File([file], name, { type: 'image/webp' });
  }

  const quality = options.quality ?? 0.85;
  const maxWidth = options.maxWidth;

  const bitmap = await loadImageBitmap(file);
  try {
    let width = bitmap.width;
    let height = bitmap.height;
    if (maxWidth && width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await canvasToWebPBlob(canvas, quality);
    const outName = `${sanitizeBaseName(file.name)}.webp`;
    return new File([blob], outName, { type: 'image/webp' });
  } finally {
    bitmap.close?.();
  }
}
