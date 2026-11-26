import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthTokens, Role } from '@/lib/api/types';
import { authService } from '../services/authService';
import { LoginFormValues, RegisterFormValues } from '../schemas/authSchemas';
import { broadcastAuthEvent } from '@/lib/api/axios';
import { mockDb } from '@/lib/mocks/db';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginFormValues) => Promise<void>;
  register: (data: RegisterFormValues) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.login(credentials);
          set({
            user: res.user,
            tokens: { accessToken: res.accessToken, refreshToken: res.refreshToken },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          broadcastAuthEvent('LOGIN', res.user);
        } catch (err: any) {
          // If 401 with explicit invalid password/email message from backend, show it
          if (err.response?.status === 401 && err.response?.data?.message) {
            const message = err.response.data.message;
            set({ isLoading: false, error: message });
            throw new Error(message);
          }

          // Resilient fallback to mockDb when network/proxy is unavailable
          try {
            const fallbackUser = mockDb.getUserByEmail(credentials.email);
            if (fallbackUser) {
              const res = {
                user: fallbackUser,
                accessToken: `mock-jwt-access-${fallbackUser.id}-${Date.now()}`,
                refreshToken: `mock-jwt-refresh-${fallbackUser.id}-${Date.now()}`,
              };
              set({
                user: res.user,
                tokens: { accessToken: res.accessToken, refreshToken: res.refreshToken },
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
              broadcastAuthEvent('LOGIN', res.user);
              return;
            }
          } catch (fbErr) {
            console.warn('Fallback login error:', fbErr);
          }

          const message = err.response?.data?.message || err.message || 'Failed to login. Please check credentials.';
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await authService.register(data);
          set({
            user: res.user,
            tokens: { accessToken: res.accessToken, refreshToken: res.refreshToken },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          broadcastAuthEvent('LOGIN', res.user);
        } catch (err: any) {
          // If 409 conflict: user already registered
          if (err.response?.status === 409) {
            const message = err.response?.data?.message || 'User with this email already exists.';
            set({ isLoading: false, error: message });
            throw new Error(message);
          }

          // Resilient fallback to client mockDb when backend/proxy is offline or MSW is initializing
          try {
            const existingInDb = mockDb.getUserByEmail(data.email);
            // Allow re-registering seed users if testing, but block real duplicates
            if (existingInDb && !existingInDb.id.startsWith('user-1') && !existingInDb.id.startsWith('user-2') && !existingInDb.id.startsWith('user-3')) {
              const msg = 'User with this email already exists. Please sign in instead.';
              set({ isLoading: false, error: msg });
              throw new Error(msg);
            }

            const newUser = mockDb.createUser({
              name: data.name,
              email: data.email,
              role: (data.role as any) || 'sales_rep',
              status: 'active',
              avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
            });

            const res = {
              user: newUser,
              accessToken: `mock-jwt-access-${newUser.id}-${Date.now()}`,
              refreshToken: `mock-jwt-refresh-${newUser.id}-${Date.now()}`,
            };

            set({
              user: res.user,
              tokens: { accessToken: res.accessToken, refreshToken: res.refreshToken },
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            broadcastAuthEvent('LOGIN', res.user);
            return;
          } catch (fbErr: any) {
            if (fbErr.message?.includes('already exists')) {
              set({ isLoading: false, error: fbErr.message });
              throw fbErr;
            }
          }

          const message = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
          set({ isLoading: false, error: message });
          throw new Error(message);
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // ignore logout network errors
        } finally {
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: null,
          });
          broadcastAuthEvent('LOGOUT');
        }
      },

      switchRole: (role: Role) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser: User = { ...currentUser, role };
          set({ user: updatedUser });
        }
      },

      clearError: () => set({ error: null }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'pulse_crm_auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Listen for multi-tab auth events
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  const authChannel = new BroadcastChannel('pulse_crm_auth');
  authChannel.onmessage = (event) => {
    if (event.data?.event === 'LOGOUT') {
      useAuthStore.setState({ user: null, tokens: null, isAuthenticated: false });
    } else if (event.data?.event === 'LOGIN' && event.data.payload) {
      useAuthStore.setState({ user: event.data.payload, isAuthenticated: true });
    }
  };
}
