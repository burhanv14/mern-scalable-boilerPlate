import type { BaseEntity, ID } from "./common";

// User roles
export const UserRole = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
  GUEST: "guest",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// User interface
export interface User extends BaseEntity {
  email: string;
  name: string;
  roles: UserRole[];
  isEmailVerified: boolean;
  lastLoginAt?: string;
  avatar?: string;
  isActive: boolean;
}

// Authentication request DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface DeleteAccountRequest {
  password?: string;
  reason?: string;
}

// Authentication response DTOs
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt: string;
}

export interface LoginResponse extends AuthResponse {}

export interface SignupResponse extends AuthResponse {}

// Auth store state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  expiresAt: string | null;
}

// Auth store actions interface
export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  deleteAccount: (data?: DeleteAccountRequest) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkAuthStatus: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

// Combined auth store interface
export interface AuthStore extends AuthState, AuthActions {}

// Auth context interface for React Context (alternative to Zustand)
export interface AuthContextType extends AuthStore {}

// Permission types
export type Permission = 
  | "read"
  | "write"
  | "delete"
  | "admin"
  | "moderate"
  | "manage_users"
  | "manage_content";

export interface UserPermissions {
  [key: string]: Permission[];
}

// Token payload interface (for JWT decoding)
export interface TokenPayload {
  sub: ID; // user id
  email: string;
  roles: UserRole[];
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
}

// Auth error types
export const AuthErrorType = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type AuthErrorType = typeof AuthErrorType[keyof typeof AuthErrorType];

export interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: any;
}

// Auth configuration
export interface AuthConfig {
  tokenStorageKey: string;
  tokenExpirationBuffer: number; // in minutes
  autoRefreshEnabled: boolean;
  persistAuth: boolean;
}
