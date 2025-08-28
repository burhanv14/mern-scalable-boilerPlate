import type { AuthConfig } from "../types/auth";

// Authentication configuration constants
export const AUTH_CONFIG: AuthConfig = {
  tokenStorageKey: "auth_token",
  tokenExpirationBuffer: 5, // Check token 5 minutes before expiration
  autoRefreshEnabled: false,
  persistAuth: true,
};

// API endpoint constants
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/profile",
  FORGOT_PASSWORD: "/auth/reset-password",
  RESET_PASSWORD: "/auth/reset-password",
  DELETE_ACCOUNT: "/auth/delete-account", // This endpoint needs to be added to backend
} as const;

// Token configuration
export const TOKEN_CONFIG = {
  BEARER_PREFIX: "Bearer ",
  HEADER_NAME: "Authorization",
  REFRESH_THRESHOLD_MS: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: AUTH_CONFIG.tokenStorageKey,
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  AUTH_STATE: "auth_state",
} as const;

// Cookie configuration
export const COOKIE_CONFIG = {
  TOKEN_COOKIE_NAME: "auth_token",
  DEFAULT_OPTIONS: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    // httpOnly: true, // Note: Can't access via JS if httpOnly is true
  },
} as const;

// Default user permissions based on roles
export const DEFAULT_PERMISSIONS = {
  admin: ["read", "write", "delete", "admin", "moderate", "manage_users", "manage_content"],
  moderator: ["read", "write", "moderate", "manage_content"],
  user: ["read", "write"],
  guest: ["read"],
} as const;

// Auth error messages
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  TOKEN_EXPIRED: "Session expired. Please login again",
  TOKEN_INVALID: "Invalid authentication token",
  ACCOUNT_DISABLED: "Account has been disabled",
  EMAIL_NOT_VERIFIED: "Please verify your email address",
  INSUFFICIENT_PERMISSIONS: "You don't have permission to perform this action",
  RATE_LIMIT_EXCEEDED: "Too many requests. Please try again later",
  UNKNOWN_ERROR: "An unexpected error occurred",
  NETWORK_ERROR: "Network error. Please check your connection",
  SIGNUP_FAILED: "Failed to create account. Please try again",
  LOGIN_FAILED: "Login failed. Please check your credentials",
  DELETE_ACCOUNT_FAILED: "Failed to delete account",
} as const;

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  NAME_PATTERN: /^[a-zA-Z\s'-]{2,50}$/,
} as const;

// Environment variables with defaults
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  APP_ENV: import.meta.env.VITE_APP_ENV || "development",
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;
