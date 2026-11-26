import { apiClient } from '@/lib/api/axios';
import { Ticket, TicketComment } from '@/lib/api/types';

export const ticketService = {
  getTickets: async (): Promise<Ticket[]> => {
    const res = await apiClient.get<Ticket[]>('/tickets');
    return res.data;
  },

  getTicketById: async (id: string): Promise<Ticket> => {
    const res = await apiClient.get<Ticket>(`/tickets/${id}`);
    return res.data;
  },

  createTicket: async (data: Partial<Ticket>): Promise<Ticket> => {
    const res = await apiClient.post<Ticket>('/tickets', data);
    return res.data;
  },

  updateTicket: async (id: string, data: Partial<Ticket>): Promise<Ticket> => {
    const res = await apiClient.patch<Ticket>(`/tickets/${id}`, data);
    return res.data;
  },

  addComment: async (
    ticketId: string,
    comment: { authorId: string; authorName: string; content: string; isInternal: boolean }
  ): Promise<Ticket> => {
    const res = await apiClient.post<Ticket>(`/tickets/${ticketId}/comments`, comment);
    return res.data;
  },
};
