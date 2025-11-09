import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import { getTokens, setTokens, clearTokens } from './token.ts';
import type { ErrorResponse, RefreshResponse } from '../types/auth.ts';

// Use env override if provided; otherwise use relative base and leverage Vite proxy in development
const BASE_URL: string = (import.meta as any)?.env?.VITE_API_BASE_URL ?? '';

// Bare instance without interceptors for internal calls (e.g., refreshing)
const bare: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Main API instance used by the app
export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach Authorization header from current access token
api.interceptors.request.use((config) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// Response interceptor: handle 401 refresh and 429 throttle info
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ErrorResponse>) => {
    const { response, config } = error;
    if (!response || !config) {
      return Promise.reject(error);
    }

    // Handle 429: attach retryAfterSeconds for UI
    if (response.status === 429) {
      const retryAfter = response.headers?.['retry-after'];
      const retryAfterSeconds = retryAfter ? Number(retryAfter) : undefined;
      (error as any).retryAfterSeconds = Number.isFinite(retryAfterSeconds)
        ? retryAfterSeconds
        : undefined;
      return Promise.reject(error);
    }

    // Handle 401: attempt a single refresh + retry
    if (response.status === 401 && !(config as any)._retry) {
      (config as any)._retry = true;
      try {
        const tokens = getTokens();
        const refreshToken = tokens?.refreshToken;
        if (!refreshToken) throw new Error('NO_REFRESH_TOKEN');
        const { data } = await bare.post<RefreshResponse>('/auth/refresh', {
          refreshToken,
        });
        // rotate tokens
        setTokens({
          accessToken: data.accessToken,
          accessExpiresAt: data.accessExpiresAt,
          refreshToken: data.refreshToken,
          refreshExpiresAt: data.refreshExpiresAt,
        });
        // retry original request with new token
        const tokensAfter = getTokens();
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization =
          `Bearer ${tokensAfter?.accessToken ?? ''}`;
        return api(config);
      } catch (err) {
        // Refresh failed: force logout
        clearTokens();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export type ApiError = AxiosError<ErrorResponse> & {
  retryAfterSeconds?: number;
};
