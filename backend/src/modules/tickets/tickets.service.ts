import { ticketRepository } from '../../repositories/ticket.repository';
import { AppError } from '../../utils/AppError';

export class TicketService {
  async getTickets() {
    return ticketRepository.findAll();
  }

  async getTicketById(id: string) {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) throw new AppError('Ticket not found', 404);
    return ticket;
  }

  async createTicket(data: any) {
    return ticketRepository.create(data);
  }

  async updateTicket(id: string, updates: any) {
    const existing = await ticketRepository.findById(id);
    if (!existing) throw new AppError('Ticket not found', 404);

    const updated = await ticketRepository.update(id, updates);
    return updated;
  }

  async addComment(ticketId: string, comment: { authorId: string; authorName: string; content: string; isInternal: boolean }) {
    const existing = await ticketRepository.findById(ticketId);
    if (!existing) throw new AppError('Ticket not found', 404);

    const updated = await ticketRepository.addComment(ticketId, comment);
    return updated;
  }
}

export const ticketService = new TicketService();
