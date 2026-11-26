import { apiClient } from '@/lib/api/axios';
import { DashboardMetrics } from '@/lib/api/types';

export const dashboardService = {
  getMetrics: async (range = '30d'): Promise<DashboardMetrics> => {
    const res = await apiClient.get<DashboardMetrics>(`/dashboard/metrics?range=${range}`);
    return res.data;
  },
};
