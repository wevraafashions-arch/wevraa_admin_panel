import { tokenCookies, userCookie } from '../cookies';
import type {
  LoginRequest,
  RefreshRequest,
  AuthTokensResponse,
} from '../types/auth';
import { apiClient } from '../client';

export const authService = {
  async login(body: LoginRequest): Promise<AuthTokensResponse> {
    const res = await apiClient<AuthTokensResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
      skipAuth: true,
      skipRefresh: true,
    });
    tokenCookies.setTokens(res.accessToken, res.refreshToken, res.expiresIn);
    userCookie.set(JSON.stringify(res.user));
    return res;
  },

  async refresh(body: RefreshRequest): Promise<AuthTokensResponse> {
    const res = await apiClient<AuthTokensResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(body),
      skipAuth: true,
      skipRefresh: true,
    });
    tokenCookies.setTokens(res.accessToken, res.refreshToken, res.expiresIn);
    userCookie.set(JSON.stringify(res.user));
    return res;
  },
};
