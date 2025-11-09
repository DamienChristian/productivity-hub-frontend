import { api } from './axios.ts';
import { setTokens, clearTokens, getTokens } from './token.ts';
import type { AuthResponse, RefreshResponse, User } from '../types/auth.ts';

export type SignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type SignInInput = {
  email: string;
  password: string;
};

export async function signup(input: SignUpInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', input);
  setTokens({
    accessToken: data.accessToken,
    accessExpiresAt: data.accessExpiresAt,
    refreshToken: data.refreshToken,
    refreshExpiresAt: data.refreshExpiresAt,
  });
  return data;
}

export async function signin(input: SignInInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signin', input);
  setTokens({
    accessToken: data.accessToken,
    accessExpiresAt: data.accessExpiresAt,
    refreshToken: data.refreshToken,
    refreshExpiresAt: data.refreshExpiresAt,
  });
  return data;
}

export async function refresh(): Promise<RefreshResponse> {
  const tokens = getTokens();
  if (!tokens?.refreshToken) throw new Error('No refresh token');
  const { data } = await api.post<RefreshResponse>('/auth/refresh', {
    refreshToken: tokens.refreshToken,
  });
  setTokens({
    accessToken: data.accessToken,
    accessExpiresAt: data.accessExpiresAt,
    refreshToken: data.refreshToken,
    refreshExpiresAt: data.refreshExpiresAt,
  });
  return data;
}

export async function me(): Promise<User> {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
}

export async function logout(): Promise<void> {
  const tokens = getTokens();
  try {
    await api.post(
      '/auth/logout',
      tokens?.refreshToken ? { refreshToken: tokens.refreshToken } : undefined,
    );
  } finally {
    clearTokens();
  }
}

// Forgot password: request reset link
export async function requestPasswordReset(
  email: string,
): Promise<{ message: string }> {
  const res = await api.post('/auth/forgot-password', { email });
  return res.data;
}

// Reset password: consume token and set new password
export async function resetPassword(
  token: string,
  password: string,
): Promise<{ message: string }> {
  const res = await api.post('/auth/reset-password', {
    token,
    newPassword: password,
  });
  return res.data;
}
