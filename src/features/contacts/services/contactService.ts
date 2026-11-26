import { apiClient } from '@/lib/api/axios';
import { Contact, PaginatedResponse } from '@/lib/api/types';

export interface GetContactsParams {
  search?: string;
  status?: string;
  source?: string;
  ownerId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const contactService = {
  getContacts: async (params?: GetContactsParams): Promise<PaginatedResponse<Contact>> => {
    const res = await apiClient.get<PaginatedResponse<Contact>>('/contacts', { params });
    return res.data;
  },

  getContactById: async (id: string): Promise<Contact> => {
    const res = await apiClient.get<Contact>(`/contacts/${id}`);
    return res.data;
  },

  createContact: async (data: Partial<Contact>): Promise<Contact> => {
    const res = await apiClient.post<Contact>('/contacts', data);
    return res.data;
  },

  updateContact: async (id: string, data: Partial<Contact>): Promise<Contact> => {
    const res = await apiClient.patch<Contact>(`/contacts/${id}`, data);
    return res.data;
  },

  deleteContact: async (id: string): Promise<void> => {
    await apiClient.delete(`/contacts/${id}`);
  },

  bulkDeleteContacts: async (ids: string[]): Promise<void> => {
    await apiClient.post('/contacts/bulk-delete', { ids });
  },
};
