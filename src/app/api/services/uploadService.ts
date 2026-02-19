import { API_PREFIX } from '../config';
import { tokenCookies } from '../cookies';

/** POST /api/v1/upload/image - use returned URL in product media[].url */
const UPLOAD_IMAGE_PATH = '/upload/image';

/** Response from upload endpoint - returns public URL of uploaded file */
export interface UploadResponse {
  url: string;
}

/**
 * Upload an image for product media. POSTs to /upload/image as multipart/form-data.
 * Use the returned URL in product payload media[].url.
 * Backend returns { url: string } (public URL for the stored file).
 */
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const base = API_PREFIX.replace(/\/$/, '');
  const url = `${base}${UPLOAD_IMAGE_PATH.startsWith('/') ? '' : '/'}${UPLOAD_IMAGE_PATH}`;

  const headers: HeadersInit = {};
  const token = tokenCookies.getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { message?: string })?.message || `Upload failed: ${response.status}`);
  }

  const result = data as UploadResponse;
  if (!result?.url) throw new Error('Upload response missing url');
  return result.url;
}
