import { Request, Response, NextFunction } from 'express';
import { taskService } from './tasks.service';

export class TaskController {
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const options = {
        contactId: req.query.contactId as string,
        status: req.query.status as string,
        assignedToId: req.query.assignedToId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };
      const tasks = await taskService.getTasks(options, req.user?.role, req.user?.id);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  }

  async getCalendarEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const options = {
        contactId: req.query.contactId as string,
        status: req.query.status as string,
        assignedToId: req.query.assignedToId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
      };
      const events = await taskService.getCalendarEvents(options);
      res.json(events);
    } catch (err) {
      next(err);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const data = { ...req.body };
      if (req.user && !data.assignedToId) {
        data.assignedToId = req.user.id;
        data.assignedToName = req.user.name || 'Sales Rep';
      }
      const task = await taskService.createTask(data);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (err) {
      next(err);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskService.deleteTask(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const taskController = new TaskController();
