'use client';

import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/lib/constants';
import { STORAGE_BUCKET, SUPABASE_ANON_KEY, SUPABASE_URL, storagePublicUrl } from '@/lib/env';
import { getBrowserSupabase } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';

export interface UploadResult {
  path: string;
  url: string;
  width: number;
  height: number;
}

/** Lengste side et opplastet bilde skaleres ned til før opplasting. */
const MAX_DIMENSION = 2200;
const WEBP_QUALITY = 0.82;

interface PreparedImage {
  blob: Blob;
  width: number;
  height: number;
  extension: string;
  contentType: string;
}

function readableSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return 'Filtypen støttes ikke. Bruk JPG, PNG, WEBP eller AVIF.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `Bildet er ${readableSize(file.size)}. Maks størrelse er ${readableSize(MAX_UPLOAD_BYTES)}.`;
  }
  return null;
}

async function loadBitmap(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; cleanup: () => void }> {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file);
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      cleanup: () => bitmap.close(),
    };
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = 'async';

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Klarte ikke å lese bildefilen.'));
    image.src = objectUrl;
  });

  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    cleanup: () => URL.revokeObjectURL(objectUrl),
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

/**
 * Skalerer ned og komprimerer bildet i nettleseren før opplasting.
 * Det gir mindre filer i Storage, raskere opplasting og raskere nettside.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  const { source, width, height, cleanup } = await loadBitmap(file);

  try {
    if (!width || !height) {
      throw new Error('Klarte ikke å lese størrelsen på bildet.');
    }

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      // Uten canvas laster vi opp originalen som den er.
      return {
        blob: file,
        width,
        height,
        extension: file.name.split('.').pop()?.toLowerCase() || 'jpg',
        contentType: file.type,
      };
    }

    context.imageSmoothingQuality = 'high';
    context.drawImage(source, 0, 0, targetWidth, targetHeight);

    let blob = await canvasToBlob(canvas, 'image/webp', WEBP_QUALITY);
    let contentType = 'image/webp';
    let extension = 'webp';

    if (!blob || blob.size === 0) {
      blob = await canvasToBlob(canvas, 'image/jpeg', 0.85);
      contentType = 'image/jpeg';
      extension = 'jpg';
    }

    if (!blob) {
      return {
        blob: file,
        width,
        height,
        extension: file.name.split('.').pop()?.toLowerCase() || 'jpg',
        contentType: file.type,
      };
    }

    // Hvis komprimeringen ikke ga gevinst og bildet ikke ble skalert,
    // beholder vi originalfilen.
    if (scale === 1 && blob.size >= file.size) {
      return {
        blob: file,
        width,
        height,
        extension: file.name.split('.').pop()?.toLowerCase() || 'jpg',
        contentType: file.type,
      };
    }

    return { blob, width: targetWidth, height: targetHeight, extension, contentType };
  } finally {
    cleanup();
  }
}

/**
 * Laster opp en fil til Supabase Storage med ekte fremdriftsvisning.
 *
 * supabase-js har ingen progress-callback, så vi snakker direkte med
 * Storage sitt REST-endepunkt via XMLHttpRequest. Forespørselen sendes med
 * brukerens eget access token, slik at Storage-policyene fortsatt gjelder —
 * kun eier får lov til å laste opp.
 */
export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const supabase = getBrowserSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Du er ikke lenger innlogget. Logg inn på nytt og prøv igjen.');
  }

  onProgress?.(1);
  const prepared = await prepareImage(file);
  onProgress?.(5);

  const baseName = slugify(file.name.replace(/\.[^.]+$/, '')) || 'bilde';
  const unique = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
  const path = `${folder}/${unique}-${baseName}.${prepared.extension}`;

  const endpoint = `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`;

  await new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', endpoint, true);
    request.setRequestHeader('Authorization', `Bearer ${session.access_token}`);
    request.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    request.setRequestHeader('Content-Type', prepared.contentType);
    request.setRequestHeader('cache-control', 'max-age=31536000');
    request.setRequestHeader('x-upsert', 'false');

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 90) + 5;
      onProgress?.(Math.min(95, percent));
    };

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve();
        return;
      }
      if (request.status === 403 || request.status === 401) {
        reject(new Error('Ingen tilgang til å laste opp. Sjekk at brukeren din har rollen "owner".'));
        return;
      }
      if (request.status === 413) {
        reject(new Error('Filen er for stor for Storage-bucketen.'));
        return;
      }
      let detail = '';
      try {
        const parsed = JSON.parse(request.responseText) as { message?: string; error?: string };
        detail = parsed.message ?? parsed.error ?? '';
      } catch {
        detail = '';
      }
      reject(new Error(detail || 'Opplastingen feilet. Prøv igjen.'));
    };

    request.onerror = () => reject(new Error('Nettverksfeil under opplasting. Sjekk internettforbindelsen.'));
    request.onabort = () => reject(new Error('Opplastingen ble avbrutt.'));

    request.send(prepared.blob);
  });

  onProgress?.(100);

  return {
    path,
    url: storagePublicUrl(path),
    width: prepared.width,
    height: prepared.height,
  };
}
