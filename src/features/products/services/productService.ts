import { apiClient } from '@/lib/api/axios';
import { SoldProduct } from '@/lib/api/types';

export const productService = {
  getSoldProducts: async (contactId?: string): Promise<SoldProduct[]> => {
    const res = await apiClient.get<SoldProduct[]>('/products', {
      params: contactId ? { contactId } : undefined,
    });
    return res.data;
  },

  getExpiringProducts: async (): Promise<SoldProduct[]> => {
    const res = await apiClient.get<SoldProduct[]>('/products/expiring');
    return res.data;
  },

  createSoldProduct: async (data: Partial<SoldProduct>): Promise<SoldProduct> => {
    const res = await apiClient.post<SoldProduct>('/products', data);
    return res.data;
  },

  renewSoldProduct: async (id: string, additionalMonths: number = 12): Promise<SoldProduct> => {
    const res = await apiClient.post<SoldProduct>(`/products/${id}/renew`, { additionalMonths });
    return res.data;
  },
};
