'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { useRouter, usePathname } from 'next/navigation';
import {
  ADMIN_LOGIN,
  ADMIN_LOGOUT,
  ADMIN_LOGOUT_ALL,
  REFRESH_TOKEN,
} from '@/lib/graphql/mutations';

// ============================================================================
// TYPES
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthContextType extends AuthState {
  login: (input: LoginInput) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  clearError: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';
const TOKEN_EXPIRY_KEY = 'admin_token_expiry';

// Refresh token 1 minute before expiry
const REFRESH_THRESHOLD_MS = 60 * 1000;

// ============================================================================
// CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const apolloClient = useApolloClient();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // GraphQL mutations
  const [loginMutation] = useMutation(ADMIN_LOGIN);
  const [logoutMutation] = useMutation(ADMIN_LOGOUT);
  const [logoutAllMutation] = useMutation(ADMIN_LOGOUT_ALL);
  const [refreshMutation] = useMutation(REFRESH_TOKEN);

  // ============================================================================
  // STORAGE HELPERS
  // ============================================================================

  const saveToStorage = useCallback((token: string, user: AdminUser, expiresIn: number) => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + expiresIn * 1000));
  }, []);

  const clearStorage = useCallback(() => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }, []);

  const loadFromStorage = useCallback((): {
    token: string;
    user: AdminUser;
    expiry: number;
  } | null => {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!token || !userStr || !expiryStr) return null;

    try {
      const user = JSON.parse(userStr) as AdminUser;
      const expiry = parseInt(expiryStr, 10);
      return { token, user, expiry };
    } catch {
      clearStorage();
      return null;
    }
  }, [clearStorage]);

  // ============================================================================
  // TOKEN REFRESH SCHEDULING
  // ============================================================================

  const scheduleTokenRefresh = useCallback(
    (expiresIn: number) => {
      // Clear any existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Schedule refresh before token expires
      const refreshTime = expiresIn * 1000 - REFRESH_THRESHOLD_MS;

      if (refreshTime > 0) {
        refreshTimeoutRef.current = setTimeout(async () => {
          try {
            const { data } = await refreshMutation();

            if (data?.refreshToken?.success && data.refreshToken.token) {
              const { token, user, expiresIn: newExpiresIn } = data.refreshToken;

              saveToStorage(token, user, newExpiresIn);
              setState((prev) => ({
                ...prev,
                token,
                user,
                isAuthenticated: true,
              }));

              // Schedule next refresh
              scheduleTokenRefresh(newExpiresIn);
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            // Don't logout on refresh failure - let the next request handle it
          }
        }, refreshTime);
      }
    },
    [refreshMutation, saveToStorage]
  );

  // ============================================================================
  // INITIALIZE AUTH STATE
  // ============================================================================

  useEffect(() => {
    const initAuth = async () => {
      const stored = loadFromStorage();

      if (!stored) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const { token, user, expiry } = stored;
      const now = Date.now();

      // Check if token has expired
      if (expiry <= now) {
        // Try to refresh
        try {
          const { data } = await refreshMutation();

          if (data?.refreshToken?.success && data.refreshToken.token) {
            const { token: newToken, user: newUser, expiresIn } = data.refreshToken;

            saveToStorage(newToken, newUser, expiresIn);
            setState({
              user: newUser,
              token: newToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            scheduleTokenRefresh(expiresIn);
            return;
          }
        } catch {
          // Refresh failed, clear auth
        }

        clearStorage();
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Token is still valid
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Schedule refresh
      const remainingTime = Math.floor((expiry - now) / 1000);
      scheduleTokenRefresh(remainingTime);
    };

    initAuth();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [loadFromStorage, clearStorage, saveToStorage, scheduleTokenRefresh, refreshMutation]);

  // ============================================================================
  // AUTH METHODS
  // ============================================================================

  const login = useCallback(
    async (input: LoginInput): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { data } = await loginMutation({
          variables: { input },
        });

        if (!data?.adminLogin?.success) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: data?.adminLogin?.message || 'Login failed',
          }));
          return false;
        }

        const { token, user, expiresIn } = data.adminLogin;

        if (!token || !user) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Invalid response from server',
          }));
          return false;
        }

        // Save to storage and state
        saveToStorage(token, user, expiresIn);
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Schedule token refresh
        scheduleTokenRefresh(expiresIn);

        // Redirect to dashboard
        router.push('/admin/dashboard');

        return true;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An error occurred during login';

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: message,
        }));

        return false;
      }
    },
    [loginMutation, saveToStorage, scheduleTokenRefresh, router]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutMutation();
    } catch {
      // Ignore errors - we're logging out anyway
    } finally {
      // Clear refresh timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Clear storage and state
      clearStorage();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      // Clear Apollo cache
      await apolloClient.clearStore();

      // Redirect to login
      router.push('/admin/login');
    }
  }, [logoutMutation, clearStorage, apolloClient, router]);

  const logoutAll = useCallback(async (): Promise<void> => {
    try {
      await logoutAllMutation();
    } catch {
      // Ignore errors
    } finally {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      clearStorage();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      await apolloClient.clearStore();
      router.push('/admin/login');
    }
  }, [logoutAllMutation, clearStorage, apolloClient, router]);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      const { data } = await refreshMutation();

      if (data?.refreshToken?.success && data.refreshToken.token) {
        const { token, user, expiresIn } = data.refreshToken;

        saveToStorage(token, user, expiresIn);
        setState((prev) => ({
          ...prev,
          token,
          user,
          isAuthenticated: true,
        }));

        scheduleTokenRefresh(expiresIn);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }, [refreshMutation, saveToStorage, scheduleTokenRefresh]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // ============================================================================
  // PROTECTED ROUTE CHECK
  // ============================================================================

  useEffect(() => {
    // Skip during loading
    if (state.isLoading) return;

    const isAdminRoute = pathname?.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';

    if (isAdminRoute && !isLoginPage && !state.isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/admin/login');
    } else if (isLoginPage && state.isAuthenticated) {
      // Redirect to dashboard if already authenticated
      router.push('/admin/dashboard');
    }
  }, [state.isLoading, state.isAuthenticated, pathname, router]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      login,
      logout,
      logoutAll,
      refreshAuth,
      clearError,
    }),
    [state, login, logout, logoutAll, refreshAuth, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// HOOK
// ============================================================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// ============================================================================
// REQUIRE AUTH HOC
// ============================================================================

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/admin/login');
      }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
