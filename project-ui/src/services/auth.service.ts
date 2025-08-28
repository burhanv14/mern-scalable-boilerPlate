import axios from "axios";
import type { AxiosResponse } from "axios";
import type {
  LoginRequest,
  SignupRequest,
  DeleteAccountRequest,
  AuthResponse,
} from "../types/auth";
import type { ApiResponse } from "../types/api";
import { AUTH_ENDPOINTS, ENV, AUTH_ERROR_MESSAGES } from "../config/auth.config";
import { TokenManager } from "../lib/token.utils";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
  private static instance: AuthService;
  private baseURL: string;

  private constructor() {
    this.baseURL = ENV.API_BASE_URL;
  }

  /**
   * Get singleton instance
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Create axios instance with base configuration
   */
  private createAxiosInstance() {
    const instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    instance.interceptors.request.use(
      (config) => {
        const token = TokenManager.getToken();
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = TokenManager.createAuthHeader(token);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle token expiration by clearing tokens and redirecting
        if (error.response?.status === 401) {
          TokenManager.clearTokens();
          window.location.href = "/login";
        }

        return Promise.reject(this.handleError(error));
      }
    );

    return instance;
  }

  /**
   * Handle API errors and convert them to user-friendly messages
   */
  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data?.message || AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
        case 401:
          return new Error(AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS);
        case 403:
          return new Error(AUTH_ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS);
        case 404:
          return new Error(AUTH_ERROR_MESSAGES.USER_NOT_FOUND);
        case 409:
          return new Error(AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
        case 429:
          return new Error(AUTH_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        case 500:
        default:
          return new Error(data?.message || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR);
      }
    } else if (error.request) {
      return new Error(AUTH_ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      return new Error(error.message || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const api = this.createAxiosInstance();
      const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post(
        AUTH_ENDPOINTS.LOGIN,
        credentials
      );

      if (response.data.success && response.data.data) {
        const authData = response.data.data;
        
        // Store both tokens
        TokenManager.setToken(authData.token, authData.refreshToken);
        
        return authData;
      }

      throw new Error(response.data.message || AUTH_ERROR_MESSAGES.LOGIN_FAILED);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Sign up new user
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const api = this.createAxiosInstance();
      const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post(
        AUTH_ENDPOINTS.SIGNUP,
        data
      );

      if (response.data.success && response.data.data) {
        const authData = response.data.data;
        
        // Store both tokens
        TokenManager.setToken(authData.token, authData.refreshToken);
        
        return authData;
      }

      throw new Error(response.data.message || AUTH_ERROR_MESSAGES.SIGNUP_FAILED);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(data?: DeleteAccountRequest): Promise<void> {
    try {
      const api = this.createAxiosInstance();
      const response: AxiosResponse<ApiResponse<void>> = await api.delete(
        AUTH_ENDPOINTS.DELETE_ACCOUNT,
        { data }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || AUTH_ERROR_MESSAGES.DELETE_ACCOUNT_FAILED);
      }

      // Clear tokens after successful account deletion
      TokenManager.clearTokens();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate current token
   */
  async validateToken(): Promise<boolean> {
    try {
      const token = TokenManager.getToken();
      if (!token) return false;

      if (TokenManager.isTokenExpired(token)) {
        return false;
      }

      // Verify with server by getting profile
      const api = this.createAxiosInstance();
      const response = await api.get(AUTH_ENDPOINTS.PROFILE);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const api = this.createAxiosInstance();
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Even if server logout fails, clear local tokens
      console.warn('Server logout failed:', error);
    } finally {
      // Always clear tokens on logout
      TokenManager.clearTokens();
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<any> {
    try {
      const api = this.createAxiosInstance();
      const response: AxiosResponse<ApiResponse<any>> = await api.get(AUTH_ENDPOINTS.PROFILE);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to get profile');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: any): Promise<any> {
    try {
      const api = this.createAxiosInstance();
      const response: AxiosResponse<ApiResponse<any>> = await api.put(AUTH_ENDPOINTS.UPDATE_PROFILE, data);

      if (response.data.success && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to update profile');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      const api = this.createAxiosInstance();
      const response: AxiosResponse<ApiResponse<void>> = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to send reset email');
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(resetToken: string, password: string): Promise<void> {
    try {
      const api = this.createAxiosInstance();
      const response: AxiosResponse<ApiResponse<void>> = await api.post(
        `${AUTH_ENDPOINTS.RESET_PASSWORD}/${resetToken}`, 
        { password }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const api = this.createAxiosInstance();
      const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post(
        AUTH_ENDPOINTS.REFRESH, 
        { refreshToken }
      );

      if (response.data.success && response.data.data) {
        const authData = response.data.data;
        
        // Store new token
        TokenManager.setToken(authData.token);
        
        return authData;
      }

      throw new Error(response.data.message || 'Failed to refresh token');
    } catch (error) {
      // Clear tokens on refresh failure
      TokenManager.clearTokens();
      throw this.handleError(error);
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const token = TokenManager.getToken();
    if (!token) return false;

    const payload = TokenManager.decodeToken(token);
    return payload?.roles?.includes(role as any) || false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  /**
   * Check if user has all specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.hasRole(role));
  }

  /**
   * Get current user's roles
   */
  getCurrentUserRoles(): string[] {
    const token = TokenManager.getToken();
    if (!token) return [];

    const payload = TokenManager.decodeToken(token);
    return payload?.roles || [];
  }

  /**
   * Get current user's ID
   */
  getCurrentUserId(): string | null {
    const token = TokenManager.getToken();
    if (!token) return null;

    const payload = TokenManager.decodeToken(token);
    return payload?.sub?.toString() || null;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
