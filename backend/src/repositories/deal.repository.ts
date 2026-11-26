import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore } from './dbStore';
import { SeedDeal } from '../data/seedData';
import { logger } from '../config/logger';

export class DealRepository {
  async findAll(): Promise<SeedDeal[]> {
    if (isPrismaConnected()) {
      try {
        const deals = await prisma.deal.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        });
        if (deals) {
          return deals.map((d) => ({
            id: d.id,
            title: d.title,
            contactId: d.contactId || '',
            contactName: d.contactName || '',
            company: d.company,
            value: d.value,
            stage: d.stage.toLowerCase() as any,
            probability: d.probability,
            expectedCloseDate: d.expectedCloseDate ? d.expectedCloseDate.toISOString().split('T')[0] : '',
            ownerId: d.ownerId || '',
            ownerName: d.ownerName || '',
            priority: d.priority.toLowerCase() as any,
            notes: d.notes || undefined,
            createdAt: d.createdAt.toISOString(),
            updatedAt: d.updatedAt.toISOString(),
          }));
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma deal findAll fallback');
      }
    }
    return dbStore.deals.filter((d) => !(d as any).deletedAt);
  }

  async findById(id: string): Promise<SeedDeal | null> {
    if (isPrismaConnected()) {
      try {
        const d = await prisma.deal.findFirst({ where: { id, deletedAt: null } });
        if (d) {
          return {
            id: d.id,
            title: d.title,
            contactId: d.contactId || '',
            contactName: d.contactName || '',
            company: d.company,
            value: d.value,
            stage: d.stage.toLowerCase() as any,
            probability: d.probability,
            expectedCloseDate: d.expectedCloseDate ? d.expectedCloseDate.toISOString().split('T')[0] : '',
            ownerId: d.ownerId || '',
            ownerName: d.ownerName || '',
            priority: d.priority.toLowerCase() as any,
            notes: d.notes || undefined,
            createdAt: d.createdAt.toISOString(),
            updatedAt: d.updatedAt.toISOString(),
          };
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma deal findById fallback');
      }
    }
    const found = dbStore.deals.find((d) => d.id === id && !(d as any).deletedAt);
    return found || null;
  }

  async create(data: Partial<SeedDeal>): Promise<SeedDeal> {
    const id = data.id || `deal-${Date.now()}`;
    const newDeal: SeedDeal = {
      id,
      title: data.title || 'New Opportunity',
      contactId: data.contactId || 'cnt-1',
      contactName: data.contactName || 'Primary Contact',
      company: data.company || 'Enterprise Partner',
      value: data.value || 30000,
      stage: data.stage || 'new',
      probability: data.probability !== undefined ? data.probability : 20,
      expectedCloseDate: data.expectedCloseDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      ownerId: data.ownerId || 'user-3',
      ownerName: data.ownerName || 'Sam Rivera',
      priority: data.priority || 'medium',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isPrismaConnected()) {
      try {
        await prisma.deal.create({
          data: {
            id: newDeal.id,
            title: newDeal.title,
            contactId: newDeal.contactId,
            contactName: newDeal.contactName,
            company: newDeal.company,
            value: newDeal.value,
            stage: newDeal.stage.toUpperCase() as any,
            probability: newDeal.probability,
            expectedCloseDate: newDeal.expectedCloseDate ? new Date(newDeal.expectedCloseDate) : null,
            ownerId: newDeal.ownerId,
            ownerName: newDeal.ownerName,
            priority: newDeal.priority.toUpperCase() as any,
            notes: newDeal.notes,
          },
        });

        await prisma.dealStageHistory.create({
          data: {
            dealId: newDeal.id,
            fromStage: null,
            toStage: newDeal.stage.toUpperCase() as any,
            changedById: newDeal.ownerId,
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma create deal fallback to dbStore');
      }
    }

    dbStore.deals.unshift(newDeal);
    dbStore.stageHistories.push({
      id: `dsh-${Date.now()}`,
      dealId: newDeal.id,
      fromStage: null,
      toStage: newDeal.stage,
      createdAt: new Date().toISOString(),
    });

    return newDeal;
  }

  async update(id: string, updates: Partial<SeedDeal>, changedById?: string): Promise<SeedDeal | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const fromStage = existing.stage;
    const toStage = updates.stage;

    if (isPrismaConnected()) {
      try {
        const prismaUpdates: any = { ...updates, updatedAt: new Date() };
        if (updates.stage) prismaUpdates.stage = updates.stage.toUpperCase();
        if (updates.priority) prismaUpdates.priority = updates.priority.toUpperCase();
        if (updates.expectedCloseDate) prismaUpdates.expectedCloseDate = new Date(updates.expectedCloseDate);

        await prisma.deal.update({
          where: { id },
          data: prismaUpdates,
        });

        if (toStage && toStage !== fromStage) {
          await prisma.dealStageHistory.create({
            data: {
              dealId: id,
              fromStage: fromStage.toUpperCase() as any,
              toStage: toStage.toUpperCase() as any,
              changedById,
            },
          });
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma update deal fallback');
      }
    }

    const idx = dbStore.deals.findIndex((d) => d.id === id);
    if (idx !== -1) {
      dbStore.deals[idx] = {
        ...dbStore.deals[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      if (toStage && toStage !== fromStage) {
        dbStore.stageHistories.push({
          id: `dsh-${Date.now()}`,
          dealId: id,
          fromStage,
          toStage,
          createdAt: new Date().toISOString(),
        });
      }
      return dbStore.deals[idx];
    }
    return null;
  }

  async softDelete(id: string): Promise<boolean> {
    if (isPrismaConnected()) {
      try {
        await prisma.deal.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma delete deal fallback');
      }
    }

    const deal = dbStore.deals.find((d) => d.id === id);
    if (!deal) return false;
    (deal as any).deletedAt = new Date().toISOString();
    return true;
  }

  async getPipelineSummary(): Promise<Array<{ stage: string; count: number; totalValue: number }>> {
    const all = await this.findAll();
    const stages = ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];

    return stages.map((stage) => {
      const dealsInStage = all.filter((d) => d.stage === stage);
      return {
        stage,
        count: dealsInStage.length,
        totalValue: dealsInStage.reduce((sum, d) => sum + d.value, 0),
      };
    });
  }
}

export const dealRepository = new DealRepository();
