import { apiClient } from '@/lib/api/axios';
import { AutomationRule } from '@/lib/api/types';

export const automationService = {
  getAutomations: async (): Promise<AutomationRule[]> => {
    const res = await apiClient.get<AutomationRule[]>('/automations');
    return res.data;
  },

  createAutomation: async (data: Partial<AutomationRule>): Promise<AutomationRule> => {
    const res = await apiClient.post<AutomationRule>('/automations', data);
    return res.data;
  },

  updateAutomation: async (id: string, data: Partial<AutomationRule>): Promise<AutomationRule> => {
    const res = await apiClient.patch<AutomationRule>(`/automations/${id}`, data);
    return res.data;
  },

  deleteAutomation: async (id: string): Promise<void> => {
    await apiClient.delete(`/automations/${id}`);
  },
};
