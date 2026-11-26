import { apiClient } from '@/lib/api/axios';
import { User } from '@/lib/api/types';

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const res = await apiClient.get<User[]>('/users');
    return res.data;
  },

  createUser: async (data: Partial<User>): Promise<User> => {
    const res = await apiClient.post<User>('/users', data);
    return res.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await apiClient.patch<User>(`/users/${id}`, data);
    return res.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  resetDatabase: async (): Promise<void> => {
    await apiClient.post('/reset-db');
  },
};
