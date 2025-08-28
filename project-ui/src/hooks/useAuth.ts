import { useCallback, useEffect } from "react";
import {
  useAuthStore,
  useAuthUser,
  useAuthToken as useStoreAuthToken,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useUserRoles,
  useLoginAction,
  useSignupAction,
  useLogoutAction,
  useDeleteAccountAction,
  useClearErrorAction,
  useUpdateProfileAction,
  useCheckAuthStatusAction,
} from "../stores/auth.store";
import type {
  LoginRequest,
  SignupRequest,
  DeleteAccountRequest,
  User,
  UserRole,
} from "../types/auth";
import { TokenManager } from "../lib/token.utils";

/**
 * Main authentication hook
 * Provides comprehensive auth state and actions
 */
export const useAuth = () => {
  const user = useAuthUser();
  const token = useStoreAuthToken();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const error = useAuthError();
  const roles = useUserRoles();
  
  // Individual action selectors to prevent infinite loops
  const login = useLoginAction();
  const signup = useSignupAction();
  const logout = useLogoutAction();
  const deleteAccount = useDeleteAccountAction();
  const clearError = useClearErrorAction();
  const updateProfile = useUpdateProfileAction();
  const checkAuthStatus = useCheckAuthStatusAction();

  // Initialize auth check on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    roles,
    
    // Actions
    login,
    signup,
    logout,
    deleteAccount,
    clearError,
    updateProfile,
    checkAuthStatus,
    
    // Utility methods
    hasRole: (role: UserRole) => roles.includes(role),
    hasAnyRole: (rolesToCheck: UserRole[]) => rolesToCheck.some(role => roles.includes(role)),
    hasAllRoles: (rolesToCheck: UserRole[]) => rolesToCheck.every(role => roles.includes(role)),
    isAdmin: roles.includes("admin" as UserRole),
    isModerator: roles.includes("moderator" as UserRole),
    isUser: roles.includes("user" as UserRole),
  };
};

/**
 * Hook for authentication status only
 * Lightweight hook for components that only need to know if user is authenticated
 */
export const useAuthStatus = () => {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const user = useAuthUser();

  return {
    isAuthenticated,
    isLoading,
    user,
    userId: user?.id || null,
  };
};

/**
 * Hook for user profile information
 */
export const useUserProfile = () => {
  const user = useAuthUser();
  const updateUserProfile = useUpdateProfileAction();
  const isLoading = useAuthLoading();

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      updateUserProfile(updates);
    },
    [updateUserProfile]
  );

  return {
    user,
    isLoading,
    updateProfile,
    
    // User info shortcuts
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar,
    roles: user?.roles || [],
    isEmailVerified: user?.isEmailVerified || false,
    isActive: user?.isActive || false,
    lastLoginAt: user?.lastLoginAt,
  };
};

/**
 * Hook for token management
 */
export const useAuthTokens = () => {
  const token = useAuthStore((state) => state.token);
  const expiresAt = useAuthStore((state) => state.expiresAt);

  const getAuthHeader = useCallback(() => {
    return TokenManager.createAuthHeader(token || undefined);
  }, [token]);

  const isTokenValid = useCallback(() => {
    return token ? !TokenManager.isTokenExpired(token) : false;
  }, [token]);

  const getTimeUntilExpiration = useCallback(() => {
    return token ? TokenManager.getTimeUntilExpiration(token) : 0;
  }, [token]);

  return {
    token,
    expiresAt,
    bearerToken: getAuthHeader(),
    isValid: isTokenValid(),
    timeUntilExpiration: getTimeUntilExpiration(),
  };
};

/**
 * Hook for role-based access control
 */
export const usePermissions = () => {
  const roles = useUserRoles();

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return roles.includes(role);
    },
    [roles]
  );

  const hasAnyRole = useCallback(
    (rolesToCheck: UserRole[]): boolean => {
      return rolesToCheck.some(role => roles.includes(role));
    },
    [roles]
  );

  const hasAllRoles = useCallback(
    (rolesToCheck: UserRole[]): boolean => {
      return rolesToCheck.every(role => roles.includes(role));
    },
    [roles]
  );

  const canAccess = useCallback(
    (requiredRoles: UserRole | UserRole[], requireAll: boolean = false): boolean => {
      if (!Array.isArray(requiredRoles)) {
        return hasRole(requiredRoles);
      }
      
      return requireAll ? hasAllRoles(requiredRoles) : hasAnyRole(requiredRoles);
    },
    [hasRole, hasAllRoles, hasAnyRole]
  );

  return {
    roles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    canAccess,
    
    // Convenience boolean flags
    isAdmin: hasRole("admin" as UserRole),
    isModerator: hasRole("moderator" as UserRole),
    isUser: hasRole("user" as UserRole),
    isGuest: hasRole("guest" as UserRole),
  };
};

/**
 * Hook for authentication actions only
 */
export const useAuthActionsHook = () => {
  const login = useLoginAction();
  const signup = useSignupAction();
  const logout = useLogoutAction();
  const deleteAccount = useDeleteAccountAction();
  const clearError = useClearErrorAction();
  const updateProfile = useUpdateProfileAction();
  const checkAuthStatus = useCheckAuthStatusAction();
  
  return {
    login,
    signup,
    logout,
    deleteAccount,
    clearError,
    updateUserProfile: updateProfile,
    checkAuthStatus,
  };
};

/**
 * Hook for login functionality
 */
export const useLogin = () => {
  const login = useLoginAction();
  const isLoading = useAuthLoading();
  const error = useAuthError();

  const loginUser = useCallback(
    async (credentials: LoginRequest) => {
      try {
        await login(credentials);
        return { success: true, error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Login failed";
        return { success: false, error: errorMessage };
      }
    },
    [login]
  );

  return {
    login: loginUser,
    isLoading,
    error,
  };
};

/**
 * Hook for signup functionality
 */
export const useSignup = () => {
  const signup = useSignupAction();
  const isLoading = useAuthLoading();
  const error = useAuthError();

  const signupUser = useCallback(
    async (data: SignupRequest) => {
      try {
        await signup(data);
        return { success: true, error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Signup failed";
        return { success: false, error: errorMessage };
      }
    },
    [signup]
  );

  return {
    signup: signupUser,
    isLoading,
    error,
  };
};

/**
 * Hook for logout functionality
 */
export const useLogout = () => {
  const logout = useLogoutAction();

  const logoutUser = useCallback(() => {
    logout();
  }, [logout]);

  return {
    logout: logoutUser,
  };
};

/**
 * Hook for account deletion
 */
export const useDeleteAccount = () => {
  const deleteAccount = useDeleteAccountAction();
  const isLoading = useAuthLoading();
  const error = useAuthError();

  const deleteUserAccount = useCallback(
    async (data?: DeleteAccountRequest) => {
      try {
        await deleteAccount(data);
        return { success: true, error: null };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to delete account";
        return { success: false, error: errorMessage };
      }
    },
    [deleteAccount]
  );

  return {
    deleteAccount: deleteUserAccount,
    isLoading,
    error,
  };
};
