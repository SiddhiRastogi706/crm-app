import { prisma, isPrismaConnected } from '../lib/prisma';
import { dbStore } from './dbStore';
import { SeedNotificationItem } from '../data/seedData';
import { logger } from '../config/logger';

export class NotificationRepository {
  async findAll(userId?: string): Promise<SeedNotificationItem[]> {
    if (isPrismaConnected()) {
      try {
        const where: any = {};
        if (userId) where.userId = userId;

        const items = await prisma.notification.findMany({
          where,
          orderBy: { createdAt: 'desc' },
        });

        if (items) {
          return items.map((n) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type.toLowerCase() as any,
            read: n.read,
            link: n.link || undefined,
            createdAt: n.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        logger.debug({ err }, 'Prisma notification findAll fallback');
      }
    }

    return dbStore.notifications;
  }

  async markAsRead(id: string): Promise<SeedNotificationItem | null> {
    if (isPrismaConnected()) {
      try {
        await prisma.notification.update({
          where: { id },
          data: { read: true },
        });
      } catch {
        // fallback
      }
    }

    const notif = dbStore.notifications.find((n) => n.id === id);
    if (!notif) return null;
    notif.read = true;
    return notif;
  }

  async markAllAsRead(userId?: string): Promise<void> {
    if (isPrismaConnected()) {
      try {
        const where: any = {};
        if (userId) where.userId = userId;
        await prisma.notification.updateMany({
          where,
          data: { read: true },
        });
      } catch {
        // fallback
      }
    }

    dbStore.notifications.forEach((n) => {
      n.read = true;
    });
  }

  async create(data: Partial<SeedNotificationItem>, userId?: string): Promise<SeedNotificationItem> {
    const id = data.id || `notif-${Date.now()}`;
    const newNotif: SeedNotificationItem = {
      id,
      title: data.title || 'Notification',
      message: data.message || '',
      type: data.type || 'system',
      read: false,
      link: data.link,
      createdAt: new Date().toISOString(),
    };

    if (isPrismaConnected()) {
      try {
        await prisma.notification.create({
          data: {
            id: newNotif.id,
            userId,
            title: newNotif.title,
            message: newNotif.message,
            type: newNotif.type.toUpperCase() as any,
            read: false,
            link: newNotif.link,
          },
        });
      } catch (err) {
        logger.debug({ err }, 'Prisma create notification fallback to dbStore');
      }
    }

    dbStore.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const notificationRepository = new NotificationRepository();
