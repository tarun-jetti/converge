import { User } from './types';

const TOKEN_KEY = 'converge_token';
const USER_KEY = 'converge_user';
export const AUTH_CHANGE_EVENT = 'converge:auth-change';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getAuthUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: User): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { token, user } }));
  } catch (err) {
    console.error('Failed to save auth state:', err);
  }
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { token: null, user: null } }));
  } catch (err) {
    console.error('Failed to clear auth state:', err);
  }
}

export function onAuthChange(callback: (auth: { token: string | null; user: User | null }) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    callback({
      token: getAuthToken(),
      user: getAuthUser(),
    });
  };

  window.addEventListener(AUTH_CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
