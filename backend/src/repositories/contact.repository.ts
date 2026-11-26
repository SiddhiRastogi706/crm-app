import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore } from './dbStore';
import { SeedContact } from '../data/seedData';
import { logger } from '../config/logger';

export interface GetContactsOptions {
  search?: string;
  status?: string;
  source?: string;
  ownerId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class ContactRepository {
  async findAll(options: GetContactsOptions = {}): Promise<{ data: SeedContact[]; total: number }> {
    const {
      search,
      status,
      source,
      ownerId,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = options;

    if (isPrismaConnected()) {
      try {
        const where: any = { deletedAt: null };
        if (status) where.status = status.toUpperCase();
        if (source) where.source = source.toUpperCase();
        if (ownerId) where.ownerId = ownerId;
        if (search) {
          where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { company: { contains: search, mode: 'insensitive' } },
          ];
        }

        const total = await prisma.contact.count({ where });
        const contacts = await prisma.contact.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit,
        });

        if (contacts) {
          return {
            data: contacts.map((c) => ({
              id: c.id,
              name: c.name,
              email: c.email,
              phone: c.phone || '',
              company: c.company,
              title: c.title || '',
              status: c.status.toLowerCase() as any,
              source: c.source.toLowerCase() as any,
              ownerId: c.ownerId || '',
              ownerName: c.ownerName || '',
              value: c.value,
              tags: c.tags,
              notes: c.notes || undefined,
              createdAt: c.createdAt.toISOString(),
              updatedAt: c.updatedAt.toISOString(),
            })),
            total,
          };
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma contact findAll fallback');
      }
    }

    let filtered = dbStore.contacts.filter((c) => !(c as any).deletedAt);

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q)
      );
    }

    if (status) {
      filtered = filtered.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    if (source) {
      filtered = filtered.filter((c) => c.source.toLowerCase() === source.toLowerCase());
    }

    if (ownerId) {
      filtered = filtered.filter((c) => c.ownerId === ownerId);
    }

    filtered.sort((a: any, b: any) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return { data, total };
  }

  async findById(id: string): Promise<SeedContact | null> {
    if (isPrismaConnected()) {
      try {
        const c = await prisma.contact.findFirst({ where: { id, deletedAt: null } });
        if (c) {
          return {
            id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone || '',
            company: c.company,
            title: c.title || '',
            status: c.status.toLowerCase() as any,
            source: c.source.toLowerCase() as any,
            ownerId: c.ownerId || '',
            ownerName: c.ownerName || '',
            value: c.value,
            tags: c.tags,
            notes: c.notes || undefined,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma findById fallback');
      }
    }
    const found = dbStore.contacts.find((c) => c.id === id && !(c as any).deletedAt);
    return found || null;
  }

  async create(data: Partial<SeedContact>): Promise<SeedContact> {
    const id = data.id || `cnt-${Date.now()}`;
    const newContact: SeedContact = {
      id,
      name: data.name || 'New Contact',
      email: data.email || `contact-${Date.now()}@example.com`,
      phone: data.phone || '+1 (555) 000-0000',
      company: data.company || 'New Company',
      title: data.title || 'Representative',
      status: data.status || 'lead',
      source: data.source || 'website',
      ownerId: data.ownerId || 'user-1',
      ownerName: data.ownerName || 'Alex Morgan',
      value: data.value || 0,
      tags: data.tags || [],
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isPrismaConnected()) {
      try {
        await prisma.contact.create({
          data: {
            id: newContact.id,
            name: newContact.name,
            email: newContact.email,
            phone: newContact.phone,
            company: newContact.company,
            title: newContact.title,
            status: newContact.status.toUpperCase() as any,
            source: newContact.source.toUpperCase() as any,
            ownerId: newContact.ownerId,
            ownerName: newContact.ownerName,
            value: newContact.value,
            tags: newContact.tags,
            notes: newContact.notes,
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma create contact fallback to dbStore');
      }
    }

    dbStore.contacts.unshift(newContact);
    return newContact;
  }

  async update(id: string, updates: Partial<SeedContact>): Promise<SeedContact | null> {
    if (isPrismaConnected()) {
      try {
        const prismaUpdates: any = { ...updates, updatedAt: new Date() };
        if (updates.status) prismaUpdates.status = updates.status.toUpperCase();
        if (updates.source) prismaUpdates.source = updates.source.toUpperCase();

        await prisma.contact.update({
          where: { id },
          data: prismaUpdates,
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma update contact fallback');
      }
    }

    const idx = dbStore.contacts.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    dbStore.contacts[idx] = {
      ...dbStore.contacts[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return dbStore.contacts[idx];
  }

  async softDelete(id: string): Promise<boolean> {
    if (isPrismaConnected()) {
      try {
        await prisma.contact.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma delete contact fallback');
      }
    }

    const contact = dbStore.contacts.find((c) => c.id === id);
    if (!contact) return false;
    (contact as any).deletedAt = new Date().toISOString();
    return true;
  }

  async bulkSoftDelete(ids: string[]): Promise<number> {
    if (isPrismaConnected()) {
      try {
        await prisma.contact.updateMany({
          where: { id: { in: ids } },
          data: { deletedAt: new Date() },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma bulk delete fallback');
      }
    }

    let count = 0;
    dbStore.contacts.forEach((c) => {
      if (ids.includes(c.id)) {
        (c as any).deletedAt = new Date().toISOString();
        count++;
      }
    });
    return count;
  }
}

export const contactRepository = new ContactRepository();
