import { apiClient } from '@/lib/api/axios';
import { AuthResponse, User, AuthTokens } from '@/lib/api/types';
import { LoginFormValues, RegisterFormValues, ForgotPasswordFormValues, ResetPasswordFormValues } from '../schemas/authSchemas';

export const authService = {
  login: async (data: LoginFormValues): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterFormValues): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const res = await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken });
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordFormValues): Promise<{ message: string }> => {
    const res = await apiClient.post<{ message: string }>('/auth/forgot-password', data);
    return res.data;
  },

  resetPassword: async (data: ResetPasswordFormValues & { token?: string }): Promise<{ message: string }> => {
    const res = await apiClient.post<{ message: string }>('/auth/reset-password', data);
    return res.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const res = await apiClient.get<{ user: User }>('/auth/me');
    return res.data;
  },
};
