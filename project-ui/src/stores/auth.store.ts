import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AuthStore,
  AuthState,
  LoginRequest,
  SignupRequest,
  DeleteAccountRequest,
  User,
} from "../types/auth";
import { authService } from "../services/auth.service";
import { TokenManager, AuthStorage } from "../lib/token.utils";

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  expiresAt: null,
};

/**
 * Zustand store for authentication state management
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Actions
      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });

        try {
          const authResponse = await authService.login(credentials);
          
          set({
            user: authResponse.user,
            token: authResponse.token,
            expiresAt: authResponse.expiresAt,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Save user data to storage
          AuthStorage.saveUserData(authResponse.user);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Login failed";
          set({
            user: null,
            token: null,
            expiresAt: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      signup: async (data: SignupRequest) => {
        set({ isLoading: true, error: null });

        try {
          const authResponse = await authService.signup(data);
          
          set({
            user: authResponse.user,
            token: authResponse.token,
            expiresAt: authResponse.expiresAt,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Save user data to storage
          AuthStorage.saveUserData(authResponse.user);
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Signup failed";
          set({
            user: null,
            token: null,
            expiresAt: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        try {
          // Clear local state immediately (no need to call backend)
          set({
            ...initialState,
          });

          // Clear storage
          TokenManager.clearTokens();
          AuthStorage.clearAll();
          
        } catch (error) {
          console.error("Logout error:", error);
          // Still clear local state even if there's an error
          set({ ...initialState });
          TokenManager.clearTokens();
          AuthStorage.clearAll();
        }
      },

      deleteAccount: async (data?: DeleteAccountRequest) => {
        set({ isLoading: true, error: null });

        try {
          await authService.deleteAccount(data);
          
          // Clear state after successful deletion
          set({
            ...initialState,
          });

          // Clear storage
          TokenManager.clearTokens();
          AuthStorage.clearAll();
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete account";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkAuthStatus: () => {
        try {
          const token = TokenManager.getToken();
          const userData = AuthStorage.getUserData();

          if (token && !TokenManager.isTokenExpired(token)) {
            // Token is valid
            set({
              user: userData,
              token,
              isAuthenticated: true,
              error: null,
            });
          } else {
            // No valid token, ensure clean state
            get().logout();
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
          get().logout();
        }
      },

      updateUserProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
          AuthStorage.saveUserData(updatedUser);
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Check auth status after hydration
        if (state) {
          state.checkAuthStatus();
        }
      },
    }
  )
);

// Selectors for better performance
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useUserRoles = () => useAuthStore((state) => state.user?.roles || []);

// Action selectors
export const useAuthActions = () => {
  return useAuthStore((state) => ({
    login: state.login,
    signup: state.signup,
    logout: state.logout,
    deleteAccount: state.deleteAccount,
    clearError: state.clearError,
    setLoading: state.setLoading,
    checkAuthStatus: state.checkAuthStatus,
    updateUserProfile: state.updateUserProfile,
  }));
};
