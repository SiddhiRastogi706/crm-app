import { contactRepository, GetContactsOptions } from '../../repositories/contact.repository';
import { AppError } from '../../utils/AppError';
import { generateCsv, parseCsvBuffer } from '../../utils/csv';
import { createContactSchema } from './contacts.schemas';
import { dbStore } from '../../repositories/dbStore';
import { prisma } from '../../lib/prisma';

export class ContactService {
  async getContacts(options: GetContactsOptions) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const { data, total } = await contactRepository.findAll(options);
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getContactById(id: string) {
    const contact = await contactRepository.findById(id);
    if (!contact) {
      throw new AppError('Contact not found', 404);
    }
    return contact;
  }

  async createContact(data: any) {
    return contactRepository.create(data);
  }

  async updateContact(id: string, updates: any) {
    const existing = await contactRepository.findById(id);
    if (!existing) {
      throw new AppError('Contact not found', 404);
    }
    const updated = await contactRepository.update(id, updates);
    return updated;
  }

  async deleteContact(id: string) {
    const existing = await contactRepository.findById(id);
    if (!existing) {
      throw new AppError('Contact not found', 404);
    }
    await contactRepository.softDelete(id);
    return { success: true };
  }

  async bulkDelete(ids: string[]) {
    await contactRepository.bulkSoftDelete(ids);
    return { success: true };
  }

  async exportContacts(): Promise<string> {
    const { data } = await contactRepository.findAll({ limit: 10000 });
    const formatted = data.map((c) => ({
      ID: c.id,
      Name: c.name,
      Email: c.email,
      Phone: c.phone,
      Company: c.company,
      Title: c.title,
      Status: c.status,
      Source: c.source,
      Owner: c.ownerName,
      Value: c.value,
      Tags: c.tags.join('; '),
      CreatedAt: c.createdAt,
    }));
    return generateCsv(formatted);
  }

  async importContacts(buffer: Buffer) {
    const rawRows = await parseCsvBuffer(buffer);
    const validRows: any[] = [];
    const errors: Array<{ row: number; errors: string[] }> = [];

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const parsedTags = row.Tags || row.tags ? (row.Tags || row.tags).split(';').map((t: string) => t.trim()) : [];
      const candidate = {
        name: row.Name || row.name,
        email: row.Email || row.email,
        phone: row.Phone || row.phone || '',
        company: row.Company || row.company || 'Unknown',
        title: row.Title || row.title || '',
        status: (row.Status || row.status || 'lead').toLowerCase(),
        source: (row.Source || row.source || 'website').toLowerCase(),
        value: Number(row.Value || row.value || 0),
        tags: parsedTags,
      };

      const result = createContactSchema.safeParse(candidate);
      if (result.success) {
        const created = await contactRepository.create(result.data);
        validRows.push(created);
      } else {
        errors.push({
          row: i + 1,
          errors: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`),
        });
      }
    }

    return {
      success: true,
      importedCount: validRows.length,
      errorCount: errors.length,
      errors,
    };
  }

  async getTimeline(contactId: string) {
    const contact = await contactRepository.findById(contactId);
    if (!contact) throw new AppError('Contact not found', 404);

    let activities: any[] = [];
    let deals: any[] = [];
    let tasks: any[] = [];

    try {
      activities = await prisma.activity.findMany({ where: { contactId }, orderBy: { date: 'desc' } });
      deals = await prisma.deal.findMany({ where: { contactId, deletedAt: null } });
      tasks = await prisma.task.findMany({ where: { contactId } });
    } catch {
      // fallback
      activities = dbStore.activities.filter((a) => a.contactId === contactId);
      deals = dbStore.deals.filter((d) => d.contactId === contactId && !(d as any).deletedAt);
      tasks = dbStore.tasks.filter((t) => t.contactId === contactId);
    }

    return {
      contact,
      activities,
      deals,
      tasks,
    };
  }
}

export const contactService = new ContactService();
