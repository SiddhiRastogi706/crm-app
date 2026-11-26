import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore } from './dbStore';
import { SeedTicket, SeedTicketComment } from '../data/seedData';
import { logger } from '../config/logger';

export class TicketRepository {
  async findAll(): Promise<SeedTicket[]> {
    if (isPrismaConnected()) {
      try {
        const tickets = await prisma.ticket.findMany({
          include: { comments: { orderBy: { createdAt: 'asc' } } },
          orderBy: { createdAt: 'desc' },
        });

        if (tickets) {
          return tickets.map((t) => ({
            id: t.id,
            ticketNumber: t.ticketNumber,
            subject: t.subject,
            description: t.description,
            contactId: t.contactId || '',
            contactName: t.contactName || '',
            company: t.company,
            priority: t.priority.toLowerCase() as any,
            status: t.status.toLowerCase() as any,
            assignedToId: t.assignedToId || '',
            assignedToName: t.assignedToName || '',
            comments: t.comments.map((c) => ({
              id: c.id,
              authorId: c.authorId || '',
              authorName: c.authorName,
              authorAvatar: c.authorAvatar || undefined,
              content: c.content,
              isInternal: c.isInternal,
              createdAt: c.createdAt.toISOString(),
            })),
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString(),
          }));
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma ticket findAll fallback');
      }
    }

    return dbStore.tickets;
  }

  async findById(id: string): Promise<SeedTicket | null> {
    if (isPrismaConnected()) {
      try {
        const t = await prisma.ticket.findUnique({
          where: { id },
          include: { comments: { orderBy: { createdAt: 'asc' } } },
        });
        if (t) {
          return {
            id: t.id,
            ticketNumber: t.ticketNumber,
            subject: t.subject,
            description: t.description,
            contactId: t.contactId || '',
            contactName: t.contactName || '',
            company: t.company,
            priority: t.priority.toLowerCase() as any,
            status: t.status.toLowerCase() as any,
            assignedToId: t.assignedToId || '',
            assignedToName: t.assignedToName || '',
            comments: t.comments.map((c) => ({
              id: c.id,
              authorId: c.authorId || '',
              authorName: c.authorName,
              authorAvatar: c.authorAvatar || undefined,
              content: c.content,
              isInternal: c.isInternal,
              createdAt: c.createdAt.toISOString(),
            })),
            createdAt: t.createdAt.toISOString(),
            updatedAt: t.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma ticket findById fallback');
      }
    }

    const found = dbStore.tickets.find((t) => t.id === id);
    return found || null;
  }

  async create(data: Partial<SeedTicket>): Promise<SeedTicket> {
    const id = data.id || `tck-${Date.now()}`;
    const ticketNumber = data.ticketNumber || `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SeedTicket = {
      id,
      ticketNumber,
      subject: data.subject || 'Support Request',
      description: data.description || '',
      contactId: data.contactId || 'cnt-1',
      contactName: data.contactName || 'Sarah Jenkins',
      company: data.company || 'TechFlow Solutions',
      priority: data.priority || 'medium',
      status: data.status || 'open',
      assignedToId: data.assignedToId || 'user-1',
      assignedToName: data.assignedToName || 'Alex Morgan',
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isPrismaConnected()) {
      try {
        await prisma.ticket.create({
          data: {
            id: newTicket.id,
            ticketNumber: newTicket.ticketNumber,
            subject: newTicket.subject,
            description: newTicket.description,
            contactId: newTicket.contactId,
            contactName: newTicket.contactName,
            company: newTicket.company,
            priority: newTicket.priority.toUpperCase() as any,
            status: newTicket.status.toUpperCase() as any,
            assignedToId: newTicket.assignedToId,
            assignedToName: newTicket.assignedToName,
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma create ticket fallback to dbStore');
      }
    }

    dbStore.tickets.unshift(newTicket);
    return newTicket;
  }

  async update(id: string, updates: Partial<SeedTicket>): Promise<SeedTicket | null> {
    if (isPrismaConnected()) {
      try {
        const prismaUpdates: any = { ...updates, updatedAt: new Date() };
        if (updates.priority) prismaUpdates.priority = updates.priority.toUpperCase();
        if (updates.status) prismaUpdates.status = updates.status.toUpperCase();

        await prisma.ticket.update({
          where: { id },
          data: prismaUpdates,
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma update ticket fallback');
      }
    }

    const idx = dbStore.tickets.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    dbStore.tickets[idx] = {
      ...dbStore.tickets[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return dbStore.tickets[idx];
  }

  async addComment(ticketId: string, comment: { authorId: string; authorName: string; content: string; isInternal: boolean }): Promise<SeedTicket | null> {
    const commentId = `cm-${Date.now()}`;
    const newComment: SeedTicketComment = {
      id: commentId,
      authorId: comment.authorId,
      authorName: comment.authorName,
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: comment.content,
      isInternal: comment.isInternal,
      createdAt: new Date().toISOString(),
    };

    if (isPrismaConnected()) {
      try {
        await prisma.ticketComment.create({
          data: {
            id: newComment.id,
            ticketId,
            authorId: newComment.authorId,
            authorName: newComment.authorName,
            content: newComment.content,
            isInternal: newComment.isInternal,
          },
        });
        await prisma.ticket.update({
          where: { id: ticketId },
          data: { updatedAt: new Date() },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma add ticket comment fallback');
      }
    }

    const ticket = dbStore.tickets.find((t) => t.id === ticketId);
    if (!ticket) return null;
    ticket.comments.push(newComment);
    ticket.updatedAt = new Date().toISOString();
    return ticket;
  }
}

export const ticketRepository = new TicketRepository();
