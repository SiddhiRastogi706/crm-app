import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';

export class DashboardController {
  async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const range = (req.query.range as string) || '30d';
      const metrics = await dashboardService.getMetrics(range);
      res.json(metrics);
    } catch (err) {
      next(err);
    }
  }
}

export const dashboardController = new DashboardController();
