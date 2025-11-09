// Types for authentication flows

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Tokens = {
  accessToken: string;
  accessExpiresAt: string; // ISO string from backend
  refreshToken: string;
  refreshExpiresAt: string; // ISO string from backend
};

export type ErrorResponse = {
  error: string;
  code?: string;
  details?: any;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
};

export type RefreshResponse = {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
};

// Optional: what we might decode from JWT access token if needed
export type AccessTokenPayload = {
  sub: string;
  iat?: number;
  exp?: number;
  email?: string;
  [key: string]: unknown;
};
