import { apiClient } from '@/lib/api/axios';
import { Lead, Contact, Deal, DealStage } from '@/lib/api/types';

export const leadService = {
  getLeads: async (): Promise<Lead[]> => {
    const res = await apiClient.get<Lead[]>('/leads');
    return res.data;
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const res = await apiClient.get<Lead>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: Partial<Lead>): Promise<Lead> => {
    const res = await apiClient.post<Lead>('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: Partial<Lead>): Promise<Lead> => {
    const res = await apiClient.patch<Lead>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  convertLead: async (
    id: string,
    dealData?: { title?: string; value?: number; stage?: DealStage }
  ): Promise<{ contact: Contact; deal?: Deal }> => {
    const res = await apiClient.post<{ contact: Contact; deal?: Deal }>(`/leads/${id}/convert`, dealData || {});
    return res.data;
  },
};
