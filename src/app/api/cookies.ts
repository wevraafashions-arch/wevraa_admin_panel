import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'wevraa_access_token';
const REFRESH_TOKEN_KEY = 'wevraa_refresh_token';
const USER_KEY = 'wevraa_user';

/** Access token expiry in days (from API expiresIn seconds) */
function expiresInDays(expiresInSeconds: number): number {
  return Math.max(1, Math.ceil(expiresInSeconds / 86400));
}

export const tokenCookies = {
  getAccessToken(): string | undefined {
    return Cookies.get(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const days = expiresInDays(expiresIn);
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: days, sameSite: 'lax' });
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: days, sameSite: 'lax' });
  },

  clear(): void {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
};

export const userCookie = {
  get(): string | undefined {
    return Cookies.get(USER_KEY);
  },

  set(value: string): void {
    Cookies.set(USER_KEY, value, { expires: 7, sameSite: 'lax' });
  },

  clear(): void {
    Cookies.remove(USER_KEY);
  },
};

/** Clear all cookies (auth, user, sidebar state, and any others). Use on logout. */
export function clearAllCookies(): void {
  tokenCookies.clear();
  userCookie.clear();
  const all = Cookies.get();
  Object.keys(all).forEach((name) => {
    Cookies.remove(name, { path: '/' });
  });
}
