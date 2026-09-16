'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, AuthResponse } from '@/lib/types';
import { getAuthToken, getAuthUser, setAuth, clearAuth, onAuthChange } from '@/lib/auth-storage';
import { apiFetch, ApiClientError } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => getAuthUser());
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronize state with reactive storage events
  useEffect(() => {
    const unsubscribe = onAuthChange(({ token: nextToken, user: nextUser }) => {
      setToken(nextToken);
      setUser(nextUser);
    });

    return unsubscribe;
  }, []);

  // Validate token against /api/auth/me when token changes
  useEffect(() => {
    if (!token) return;
    let active = true;

    apiFetch<{ user: User }>('/api/auth/me', { token })
      .then((data) => {
        if (active) {
          setUser(data.user);
          setAuth(token, data.user);
        }
      })
      .catch(() => {
        if (active) {
          clearAuth();
          setUser(null);
          setToken(null);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const refreshUser = useCallback(async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      return;
    }
    try {
      const data = await apiFetch<{ user: User }>('/api/auth/me', { token: currentToken });
      setUser(data.user);
      setAuth(currentToken, data.user);
    } catch {
      clearAuth();
      setUser(null);
      setToken(null);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuth(data.token, data.user);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Login failed. Please check your credentials.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiFetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      setAuth(data.token, data.user);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Registration failed. Please try again.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      try {
        await login('tarun@example.com', 'password123');
      } catch (loginErr) {
        // If user doesn't exist, create it
        if (loginErr instanceof ApiClientError && loginErr.code === 'INVALID_CREDENTIALS') {
          await register('tarun@example.com', 'password123', 'Tarun (Demo Lead)');
        } else {
          throw loginErr;
        }
      }
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Demo login failed.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    clearAuth();
    setUser(null);
    setToken(null);
  };

  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    error,
    login,
    register,
    demoLogin,
    logout,
    refreshUser,
  };
}
