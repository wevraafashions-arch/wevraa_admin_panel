import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { clearAllCookies, tokenCookies, userCookie } from '../api/cookies';
import { authService } from '../api/services/authService';
import type { ApiUser } from '../api/types/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: ApiUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseUser(): ApiUser | null {
  try {
    const raw = userCookie.get();
    if (!raw) return null;
    return JSON.parse(raw) as ApiUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(() => parseUser());
  const [error, setError] = useState<string | null>(null);

  const hasTokens =
    !!tokenCookies.getAccessToken() || !!tokenCookies.getRefreshToken();
  const isAuthenticated = hasTokens || !!user;

  const logout = useCallback(() => {
    clearAllCookies();
    setUser(null);
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const res = await authService.login({ email, password });
      setUser(res.user);
    } catch (e: unknown) {
      const message =
        e && typeof e === 'object' && 'message' in e
          ? String((e as { message: string }).message)
          : 'Login failed. Please check your credentials.';
      setError(message);
      throw e;
    }
  }, []);

  useEffect(() => {
    if (!hasTokens && user) setUser(null);
    if (hasTokens && !user) setUser(parseUser());
  }, [hasTokens, user]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        error,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
