import { Request, Response, NextFunction } from 'express';
import { notificationService } from './notifications.service';
import { sseManager } from '../../utils/sse';

export class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await notificationService.getNotifications(req.user?.id);
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await notificationService.markAsRead(req.params.id);
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.markAllAsRead(req.user?.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async streamNotifications(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const clientId = `sse-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const userId = req.user?.id;

    sseManager.addClient(clientId, res, userId);

    req.on('close', () => {
      sseManager.removeClient(clientId);
    });
  }
}

export const notificationController = new NotificationController();
