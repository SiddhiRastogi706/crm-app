import { apiClient } from '@/lib/api/axios';
import { Task } from '@/lib/api/types';

export const taskService = {
  getTasks: async (params?: { contactId?: string; status?: string; assignedToId?: string }): Promise<Task[]> => {
    const res = await apiClient.get<Task[]>('/tasks', { params });
    return res.data;
  },

  createTask: async (data: Partial<Task>): Promise<Task> => {
    const res = await apiClient.post<Task>('/tasks', data);
    return res.data;
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const res = await apiClient.patch<Task>(`/tasks/${id}`, data);
    return res.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
