import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore } from './dbStore';
import { SeedLead, SeedContact, SeedDeal } from '../data/seedData';
import { logger } from '../config/logger';

export class LeadRepository {
  async findAll(): Promise<SeedLead[]> {
    if (isPrismaConnected()) {
      try {
        const leads = await prisma.lead.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        });
        if (leads) {
          return leads.map((l) => ({
            id: l.id,
            name: l.name,
            email: l.email,
            phone: l.phone || '',
            company: l.company,
            title: l.title || undefined,
            status: l.status.toLowerCase() as any,
            source: l.source.toLowerCase() as any,
            score: l.score,
            ownerId: l.ownerId || '',
            ownerName: l.ownerName || '',
            estimatedValue: l.estimatedValue,
            notes: l.notes || undefined,
            createdAt: l.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma lead findAll fallback');
      }
    }
    return dbStore.leads.filter((l) => !(l as any).deletedAt);
  }

  async findById(id: string): Promise<SeedLead | null> {
    if (isPrismaConnected()) {
      try {
        const l = await prisma.lead.findFirst({ where: { id, deletedAt: null } });
        if (l) {
          return {
            id: l.id,
            name: l.name,
            email: l.email,
            phone: l.phone || '',
            company: l.company,
            title: l.title || undefined,
            status: l.status.toLowerCase() as any,
            source: l.source.toLowerCase() as any,
            score: l.score,
            ownerId: l.ownerId || '',
            ownerName: l.ownerName || '',
            estimatedValue: l.estimatedValue,
            notes: l.notes || undefined,
            createdAt: l.createdAt.toISOString(),
          };
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma lead findById fallback');
      }
    }
    const found = dbStore.leads.find((l) => l.id === id && !(l as any).deletedAt);
    return found || null;
  }

  async create(data: Partial<SeedLead>): Promise<SeedLead> {
    const id = data.id || `lead-${Date.now()}`;
    const newLead: SeedLead = {
      id,
      name: data.name || 'New Lead',
      email: data.email || `lead-${Date.now()}@example.com`,
      phone: data.phone || '+1 (555) 000-0000',
      company: data.company || 'Enterprise Corp',
      title: data.title || 'Director',
      status: data.status || 'new',
      source: data.source || 'organic',
      score: data.score !== undefined ? data.score : 50,
      ownerId: data.ownerId || 'user-3',
      ownerName: data.ownerName || 'Sam Rivera',
      estimatedValue: data.estimatedValue || 25000,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    if (isPrismaConnected()) {
      try {
        await prisma.lead.create({
          data: {
            id: newLead.id,
            name: newLead.name,
            email: newLead.email,
            phone: newLead.phone,
            company: newLead.company,
            title: newLead.title,
            status: newLead.status.toUpperCase() as any,
            source: newLead.source.toUpperCase() as any,
            score: newLead.score,
            ownerId: newLead.ownerId,
            ownerName: newLead.ownerName,
            estimatedValue: newLead.estimatedValue,
            notes: newLead.notes,
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma create lead fallback to dbStore');
      }
    }

    dbStore.leads.unshift(newLead);
    return newLead;
  }

  async update(id: string, updates: Partial<SeedLead>): Promise<SeedLead | null> {
    if (isPrismaConnected()) {
      try {
        const prismaUpdates: any = { ...updates };
        if (updates.status) prismaUpdates.status = updates.status.toUpperCase();
        if (updates.source) prismaUpdates.source = updates.source.toUpperCase();

        await prisma.lead.update({
          where: { id },
          data: prismaUpdates,
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma update lead fallback');
      }
    }

    const idx = dbStore.leads.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    dbStore.leads[idx] = { ...dbStore.leads[idx], ...updates };
    return dbStore.leads[idx];
  }

  async softDelete(id: string): Promise<boolean> {
    if (isPrismaConnected()) {
      try {
        await prisma.lead.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma delete lead fallback');
      }
    }

    const lead = dbStore.leads.find((l) => l.id === id);
    if (!lead) return false;
    (lead as any).deletedAt = new Date().toISOString();
    return true;
  }

  async convertLead(
    leadId: string,
    dealData?: { title?: string; value?: number; stage?: string }
  ): Promise<{ contact: SeedContact; deal?: SeedDeal } | null> {
    const lead = await this.findById(leadId);
    if (!lead) return null;

    if (isPrismaConnected()) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          const newContact = await tx.contact.create({
            data: {
              name: lead.name,
              email: lead.email,
              phone: lead.phone,
              company: lead.company,
              title: lead.title || 'Decision Maker',
              status: 'CUSTOMER',
              source: (lead.source.toUpperCase() as any),
              ownerId: lead.ownerId,
              ownerName: lead.ownerName,
              value: lead.estimatedValue,
              tags: ['Converted Lead', `Score: ${lead.score}`],
              notes: `Converted from lead (${lead.id}). Original notes: ${lead.notes || 'None'}`,
            },
          });

          let newDeal: any = null;
          if (dealData?.title || lead.estimatedValue > 0) {
            newDeal = await tx.deal.create({
              data: {
                title: dealData?.title || `${lead.company} - Initial Engagement`,
                contactId: newContact.id,
                contactName: newContact.name,
                company: newContact.company,
                value: dealData?.value || lead.estimatedValue,
                stage: (dealData?.stage ? dealData.stage.toUpperCase() : 'PROPOSAL') as any,
                probability: 50,
                expectedCloseDate: new Date(Date.now() + 30 * 86400000),
                ownerId: lead.ownerId,
                ownerName: lead.ownerName,
                priority: lead.score >= 75 ? 'HIGH' : 'MEDIUM',
                notes: `Deal generated from converted lead ${lead.id}`,
              },
            });

            await tx.dealStageHistory.create({
              data: {
                dealId: newDeal.id,
                toStage: newDeal.stage,
                changedById: lead.ownerId,
              },
            });
          }

          await tx.lead.update({
            where: { id: leadId },
            data: {
              deletedAt: new Date(),
              convertedAt: new Date(),
              convertedContactId: newContact.id,
              convertedDealId: newDeal ? newDeal.id : null,
            },
          });

          await tx.activity.create({
            data: {
              type: 'STATUS_CHANGE',
              contactId: newContact.id,
              contactName: newContact.name,
              title: 'Lead Converted to Contact & Opportunity',
              description: `Converted lead ${lead.name} (${lead.company}) with score ${lead.score}.`,
              performedBy: 'System Automation',
            },
          });

          return {
            contact: {
              id: newContact.id,
              name: newContact.name,
              email: newContact.email,
              phone: newContact.phone || '',
              company: newContact.company,
              title: newContact.title || '',
              status: newContact.status.toLowerCase() as any,
              source: newContact.source.toLowerCase() as any,
              ownerId: newContact.ownerId || '',
              ownerName: newContact.ownerName || '',
              value: newContact.value,
              tags: newContact.tags,
              notes: newContact.notes || undefined,
              createdAt: newContact.createdAt.toISOString(),
              updatedAt: newContact.updatedAt.toISOString(),
            },
            deal: newDeal
              ? {
                  id: newDeal.id,
                  title: newDeal.title,
                  contactId: newDeal.contactId,
                  contactName: newDeal.contactName,
                  company: newDeal.company,
                  value: newDeal.value,
                  stage: newDeal.stage.toLowerCase() as any,
                  probability: newDeal.probability,
                  expectedCloseDate: newDeal.expectedCloseDate ? newDeal.expectedCloseDate.toISOString().split('T')[0] : '',
                  ownerId: newDeal.ownerId,
                  ownerName: newDeal.ownerName,
                  priority: newDeal.priority.toLowerCase() as any,
                  notes: newDeal.notes,
                  createdAt: newDeal.createdAt.toISOString(),
                  updatedAt: newDeal.updatedAt.toISOString(),
                }
              : undefined,
          };
        });

        return result;
      } catch (err) {
        logger.debug({ err }, 'Prisma transaction fallback');
      }
    }

    // In-memory atomic fallback
    const contactId = `cnt-${Date.now()}`;
    const newContact: SeedContact = {
      id: contactId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      title: lead.title || 'Decision Maker',
      status: 'customer',
      source: lead.source as any,
      ownerId: lead.ownerId,
      ownerName: lead.ownerName,
      value: lead.estimatedValue,
      tags: ['Converted Lead', `Score: ${lead.score}`],
      notes: `Converted from lead (${lead.id}). Original notes: ${lead.notes || 'None'}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dbStore.contacts.unshift(newContact);

    let newDeal: SeedDeal | undefined;
    if (dealData?.title || lead.estimatedValue > 0) {
      newDeal = {
        id: `deal-${Date.now()}`,
        title: dealData?.title || `${lead.company} - Initial Engagement`,
        contactId: newContact.id,
        contactName: newContact.name,
        company: newContact.company,
        value: dealData?.value || lead.estimatedValue,
        stage: (dealData?.stage || 'proposal') as any,
        probability: 50,
        expectedCloseDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        ownerId: lead.ownerId,
        ownerName: lead.ownerName,
        priority: lead.score >= 75 ? 'high' : 'medium',
        notes: `Deal generated from converted lead ${lead.id}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dbStore.deals.unshift(newDeal);
    }

    // Soft delete lead
    (lead as any).deletedAt = new Date().toISOString();

    // Create activity
    dbStore.activities.unshift({
      id: `act-${Date.now()}`,
      type: 'status_change',
      contactId: newContact.id,
      contactName: newContact.name,
      title: 'Lead Converted to Contact & Opportunity',
      description: `Converted lead ${lead.name} (${lead.company}) with score ${lead.score}.`,
      performedBy: 'System Automation',
      date: new Date().toISOString(),
    });

    return { contact: newContact, deal: newDeal };
  }
}

export const leadRepository = new LeadRepository();
