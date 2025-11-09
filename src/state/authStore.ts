import { create } from 'zustand';
import {
  subscribe as subscribeTokens,
  getTokens,
  clearTokens as clearTokenMgr,
} from '../lib/token.ts';
import * as authApi from '../lib/auth.ts';
import { toast } from 'react-hot-toast';
import type { User, Tokens } from '../types/auth.ts';

type Status =
  | 'idle'
  | 'authenticating'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

type AuthState = {
  user: User | null;
  tokens: Tokens | null;
  status: Status;
  error: string | null;
  // actions
  init: () => Promise<void>;
  signup: (input: authApi.SignUpInput) => Promise<void>;
  signin: (input: authApi.SignInInput) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

let refreshTimer: number | null = null;
let initStarted = false; // Guard StrictMode double-invoke
let welcomedOnce = false; // Avoid duplicate welcome toast per session

function scheduleAutoRefresh(storeSet: (partial: Partial<AuthState>) => void) {
  if (refreshTimer) {
    window.clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  const tokens = getTokens();
  if (!tokens) return;
  const msUntilExpiry = new Date(tokens.accessExpiresAt).getTime() - Date.now();
  const skew = 30_000; // refresh 30s early
  const delay = Math.max(0, msUntilExpiry - skew);
  if (delay === 0) return; // will refresh on next request via 401 anyway
  refreshTimer = window.setTimeout(async () => {
    try {
      await authApi.refresh();
      storeSet({ tokens: getTokens() });
      scheduleAutoRefresh(storeSet);
    } catch (e) {
      // force logout on refresh failure
      await authApi.logout();
      storeSet({ user: null, tokens: null, status: 'unauthenticated' });
    }
  }, delay);
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: getTokens(),
  status: 'idle',
  error: null,

  init: async () => {
    if (initStarted) return;
    initStarted = true;
    const tokens = getTokens();
    if (!tokens) {
      set({ status: 'unauthenticated', user: null, tokens: null });
      return;
    }
    try {
      const user = await authApi.me();
      set({ user, tokens: getTokens(), status: 'authenticated', error: null });
      scheduleAutoRefresh((partial) => set(partial as any));
      if (!welcomedOnce) {
        toast.success(
          `Welcome back${user.firstName ? `, ${user.firstName}` : ''}!`,
        );
        welcomedOnce = true;
      }
    } catch (e) {
      set({ status: 'unauthenticated', user: null, tokens: null });
    }
    // keep Zustand in sync if tokens change elsewhere (e.g., interceptor refresh)
    subscribeTokens((t) => {
      set({ tokens: t });
    });
  },

  signup: async (input) => {
    set({ status: 'authenticating', error: null });
    try {
      const res = await authApi.signup(input);
      const user = res.user;
      set({ user, tokens: getTokens(), status: 'authenticated', error: null });
      scheduleAutoRefresh((partial) => set(partial as any));
      toast.success('Account created');
    } catch (e: any) {
      let msg = e?.response?.data?.error || e?.message || 'Signup failed';
      if (e?.response?.status === 429) {
        const secs = (e as any)?.retryAfterSeconds;
        msg = `Too many attempts. Please try again${secs ? ` in ${secs}s` : ''}.`;
      }
      set({ status: 'error', error: msg });
      toast.error(msg);
      throw e;
    }
  },

  signin: async (input) => {
    set({ status: 'authenticating', error: null });
    try {
      const res = await authApi.signin(input);
      const user = res.user;
      set({ user, tokens: getTokens(), status: 'authenticated', error: null });
      scheduleAutoRefresh((partial) => set(partial as any));
      toast.success('Signed in');
    } catch (e: any) {
      let msg = e?.response?.data?.error || e?.message || 'Signin failed';
      if (e?.response?.status === 429) {
        const secs = (e as any)?.retryAfterSeconds;
        msg = `Too many attempts. Please try again${secs ? ` in ${secs}s` : ''}.`;
      }
      set({ status: 'error', error: msg });
      toast.error(msg);
      throw e;
    }
  },

  refresh: async () => {
    try {
      await authApi.refresh();
      set({ tokens: getTokens() });
      scheduleAutoRefresh((partial) => set(partial as any));
    } catch (e) {
      toast.error('Session refresh failed');
      throw e;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      if (refreshTimer) {
        window.clearTimeout(refreshTimer);
        refreshTimer = null;
      }
      clearTokenMgr();
      set({ user: null, tokens: null, status: 'unauthenticated', error: null });
      toast.success('Logged out');
    }
  },
}));

// Simple hook to initialize auth on app start
export function useAuthInit() {
  const init = useAuthStore((s) => s.init);
  // Avoid React import here by lazily dynamic import? Keep it simple: React is already in app.
  // Consumers should call this in a component.
  return init;
}
