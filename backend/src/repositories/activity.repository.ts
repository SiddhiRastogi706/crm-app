import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore } from './dbStore';
import { SeedActivity } from '../data/seedData';
import { logger } from '../config/logger';

export class ActivityRepository {
  async findAll(contactId?: string): Promise<SeedActivity[]> {
    if (isPrismaConnected()) {
      try {
        const where: any = {};
        if (contactId) where.contactId = contactId;

        const activities = await prisma.activity.findMany({
          where,
          orderBy: { date: 'desc' },
        });

        if (activities) {
          return activities.map((a) => ({
            id: a.id,
            type: a.type.toLowerCase() as any,
            contactId: a.contactId || undefined,
            contactName: a.contactName || undefined,
            title: a.title,
            description: a.description,
            performedBy: a.performedBy,
            performedById: a.performedById || undefined,
            date: a.date.toISOString(),
            durationMinutes: a.durationMinutes || undefined,
            outcome: a.outcome || undefined,
          }));
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma activity findAll fallback');
      }
    }

    if (contactId) {
      return dbStore.activities.filter((a) => a.contactId === contactId);
    }
    return dbStore.activities;
  }

  async create(data: Partial<SeedActivity>): Promise<SeedActivity> {
    const id = data.id || `act-${Date.now()}`;
    const newActivity: SeedActivity = {
      id,
      type: data.type || 'note',
      contactId: data.contactId,
      contactName: data.contactName,
      title: data.title || 'Logged Activity',
      description: data.description || '',
      performedBy: data.performedBy || 'Alex Morgan',
      performedById: data.performedById || 'user-1',
      date: data.date || new Date().toISOString(),
      durationMinutes: data.durationMinutes,
      outcome: data.outcome,
    };

    if (isPrismaConnected()) {
      try {
        await prisma.activity.create({
          data: {
            id: newActivity.id,
            type: newActivity.type.toUpperCase() as any,
            contactId: newActivity.contactId,
            contactName: newActivity.contactName,
            title: newActivity.title,
            description: newActivity.description,
            performedBy: newActivity.performedBy,
            performedById: newActivity.performedById,
            date: new Date(newActivity.date),
            durationMinutes: newActivity.durationMinutes,
            outcome: newActivity.outcome,
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma create activity fallback to dbStore');
      }
    }

    dbStore.activities.unshift(newActivity);
    return newActivity;
  }
}

export const activityRepository = new ActivityRepository();
