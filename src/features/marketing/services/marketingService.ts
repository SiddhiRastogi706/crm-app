import { apiClient } from '@/lib/api/axios';
import { Campaign } from '@/lib/api/types';

export const marketingService = {
  getCampaigns: async (): Promise<Campaign[]> => {
    const res = await apiClient.get<Campaign[]>('/campaigns');
    return res.data;
  },

  createCampaign: async (data: Partial<Campaign>): Promise<Campaign> => {
    const res = await apiClient.post<Campaign>('/campaigns', data);
    return res.data;
  },
};
