import { notificationRepository } from '../../repositories/notification.repository';
import { sseManager } from '../../utils/sse';
import { AppError } from '../../utils/AppError';

export class NotificationService {
  async getNotifications(userId?: string) {
    return notificationRepository.findAll(userId);
  }

  async markAsRead(id: string) {
    const notif = await notificationRepository.markAsRead(id);
    if (!notif) throw new AppError('Notification not found', 404);
    return notif;
  }

  async markAllAsRead(userId?: string) {
    await notificationRepository.markAllAsRead(userId);
    return { success: true };
  }

  async createNotification(data: any, userId?: string) {
    const created = await notificationRepository.create(data, userId);
    // Broadcast via SSE in real time
    if (userId) {
      sseManager.sendToUser(userId, 'notification', created);
    } else {
      sseManager.broadcast('notification', created);
    }
    return created;
  }
}

export const notificationService = new NotificationService();
