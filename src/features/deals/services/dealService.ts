import { apiClient } from '@/lib/api/axios';
import { Deal, DealStage } from '@/lib/api/types';

export const dealService = {
  getDeals: async (): Promise<Deal[]> => {
    const res = await apiClient.get<Deal[]>('/deals');
    return res.data;
  },

  getDealById: async (id: string): Promise<Deal> => {
    const res = await apiClient.get<Deal>(`/deals/${id}`);
    return res.data;
  },

  createDeal: async (data: Partial<Deal>): Promise<Deal> => {
    const res = await apiClient.post<Deal>('/deals', data);
    return res.data;
  },

  updateDeal: async (id: string, data: Partial<Deal>): Promise<Deal> => {
    const res = await apiClient.patch<Deal>(`/deals/${id}`, data);
    return res.data;
  },

  deleteDeal: async (id: string): Promise<void> => {
    await apiClient.delete(`/deals/${id}`);
  },
};
