import { Request, Response, NextFunction } from 'express';
import { activityRepository } from '../../repositories/activity.repository';

export class ActivityController {
  async getActivities(req: Request, res: Response, next: NextFunction) {
    try {
      const contactId = req.query.contactId as string;
      const activities = await activityRepository.findAll(contactId);
      res.json(activities);
    } catch (err) {
      next(err);
    }
  }

  async createActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const data = { ...req.body };
      if (req.user && !data.performedById) {
        data.performedById = req.user.id;
        data.performedBy = req.user.name || 'Sales Rep';
      }
      const activity = await activityRepository.create(data);
      res.status(201).json(activity);
    } catch (err) {
      next(err);
    }
  }
}

export const activityController = new ActivityController();
