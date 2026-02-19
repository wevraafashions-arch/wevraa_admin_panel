import { API_PREFIX } from './config';
import { tokenCookies, userCookie } from './cookies';
import type { AuthTokensResponse } from './types/auth';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions extends RequestInit {
  /** If true, do not attach Authorization header (e.g. for login) */
  skipAuth?: boolean;
  /** If true, do not retry on 401 (e.g. for refresh endpoint) */
  skipRefresh?: boolean;
}

let refreshPromise: Promise<AuthTokensResponse> | null = null;

async function doRefresh(): Promise<AuthTokensResponse> {
  if (refreshPromise) return refreshPromise;
  const refreshToken = tokenCookies.getRefreshToken();
  if (!refreshToken) throw new ApiError('No refresh token', 401);
  refreshPromise = fetch(`${API_PREFIX}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new ApiError(data?.message || 'Refresh failed', r.status, data);
    const res = data as AuthTokensResponse;
    tokenCookies.setTokens(res.accessToken, res.refreshToken, res.expiresIn);
    userCookie.set(JSON.stringify(res.user));
    return res;
  });
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth, skipRefresh, headers = {}, ...rest } = options;
  const base = API_PREFIX.replace(/\/$/, '');
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const isFormData = rest.body instanceof FormData;

  const getHeaders = (): HeadersInit => {
    const h: Record<string, string> = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(headers as Record<string, string>),
    };
    if (!skipAuth) {
      const token = tokenCookies.getAccessToken();
      if (token) h.Authorization = `Bearer ${token}`;
    }
    return h;
  };

  let response = await fetch(url, {
    ...rest,
    headers: getHeaders(),
  });

  if (response.status === 401 && !skipRefresh) {
    try {
      await doRefresh();
      response = await fetch(url, {
        ...rest,
        headers: getHeaders(),
      });
    } catch {
      throw new ApiError('Session expired', 401);
    }
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      (data as { message?: string })?.message || `Request failed: ${response.status}`,
      response.status,
      data
    );
  }
  return data as T;
}
