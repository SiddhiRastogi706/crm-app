import { contactRepository } from '../../repositories/contact.repository';
import { dealRepository } from '../../repositories/deal.repository';
import { ticketRepository } from '../../repositories/ticket.repository';

export class SearchService {
  async globalSearch(query: string) {
    if (!query || query.trim().length === 0) {
      return { contacts: [], deals: [], tickets: [] };
    }

    const q = query.toLowerCase().trim();

    const { data: allContacts } = await contactRepository.findAll({ limit: 1000 });
    const allDeals = await dealRepository.findAll();
    const allTickets = await ticketRepository.findAll();

    const matchedContacts = allContacts
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      )
      .slice(0, 5);

    const matchedDeals = allDeals
      .filter((d) => d.title.toLowerCase().includes(q) || d.company.toLowerCase().includes(q))
      .slice(0, 5);

    const matchedTickets = allTickets
      .filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q)
      )
      .slice(0, 5);

    return {
      contacts: matchedContacts,
      deals: matchedDeals,
      tickets: matchedTickets,
    };
  }
}

export const searchService = new SearchService();
