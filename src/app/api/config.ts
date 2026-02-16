/**
 * API base URL. In production, set VITE_API_BASE_URL in .env
 * e.g. VITE_API_BASE_URL=https://your-api.example.com
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://a0sooos8sko4g0k4o8s08ook.82.25.108.36.sslip.io';

export const API_VERSION = 'v1';
export const API_PREFIX = `${API_BASE_URL}/api/${API_VERSION}`;
