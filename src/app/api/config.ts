/**
 * API base URL. In production, set VITE_API_BASE_URL in .env
 * e.g. VITE_API_BASE_URL=https://your-api.example.com
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'https://api.wevraa.in';

export const API_VERSION = 'v1';
export const API_PREFIX = `${API_BASE_URL}/api/${API_VERSION}`;
