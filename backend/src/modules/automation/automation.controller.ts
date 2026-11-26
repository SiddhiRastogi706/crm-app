import { Request, Response, NextFunction } from 'express';
import { automationService } from './automation.service';

export class AutomationController {
  async getAutomations(req: Request, res: Response, next: NextFunction) {
    try {
      const automations = await automationService.getAutomations();
      res.json(automations);
    } catch (err) {
      next(err);
    }
  }

  async createAutomation(req: Request, res: Response, next: NextFunction) {
    try {
      const automation = await automationService.createAutomation(req.body);
      res.status(201).json(automation);
    } catch (err) {
      next(err);
    }
  }

  async updateAutomation(req: Request, res: Response, next: NextFunction) {
    try {
      const automation = await automationService.updateAutomation(req.params.id, req.body);
      res.json(automation);
    } catch (err) {
      next(err);
    }
  }

  async deleteAutomation(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await automationService.deleteAutomation(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const automationController = new AutomationController();
