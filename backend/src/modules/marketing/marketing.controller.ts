import { Request, Response, NextFunction } from 'express';
import { marketingService } from './marketing.service';

export class MarketingController {
  async getCampaigns(req: Request, res: Response, next: NextFunction) {
    try {
      const campaigns = await marketingService.getCampaigns();
      res.json(campaigns);
    } catch (err) {
      next(err);
    }
  }

  async createCampaign(req: Request, res: Response, next: NextFunction) {
    try {
      const campaign = await marketingService.createCampaign(req.body);
      res.status(201).json(campaign);
    } catch (err) {
      next(err);
    }
  }

  async getSegments(req: Request, res: Response, next: NextFunction) {
    try {
      const segments = await marketingService.getSegments();
      res.json(segments);
    } catch (err) {
      next(err);
    }
  }
}

export const marketingController = new MarketingController();
