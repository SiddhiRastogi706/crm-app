import { Request, Response, NextFunction } from 'express';
import { dealService } from './deals.service';

export class DealController {
  async getDeals(req: Request, res: Response, next: NextFunction) {
    try {
      const deals = await dealService.getDeals(req.user?.role, req.user?.id);
      res.json(deals);
    } catch (err) {
      next(err);
    }
  }

  async getDealById(req: Request, res: Response, next: NextFunction) {
    try {
      const deal = await dealService.getDealById(req.params.id);
      res.json(deal);
    } catch (err) {
      next(err);
    }
  }

  async createDeal(req: Request, res: Response, next: NextFunction) {
    try {
      const data = { ...req.body };
      if (req.user && !data.ownerId) {
        data.ownerId = req.user.id;
        data.ownerName = req.user.name || 'Sales Rep';
      }
      const deal = await dealService.createDeal(data);
      res.status(201).json(deal);
    } catch (err) {
      next(err);
    }
  }

  async updateDeal(req: Request, res: Response, next: NextFunction) {
    try {
      const deal = await dealService.updateDeal(req.params.id, req.body, req.user?.id);
      res.json(deal);
    } catch (err) {
      next(err);
    }
  }

  async deleteDeal(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dealService.deleteDeal(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getPipelineSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await dealService.getPipelineSummary();
      res.json(summary);
    } catch (err) {
      next(err);
    }
  }
}

export const dealController = new DealController();
