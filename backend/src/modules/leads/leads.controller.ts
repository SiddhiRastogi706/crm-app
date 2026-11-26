import { Request, Response, NextFunction } from 'express';
import { leadService } from './leads.service';

export class LeadController {
  async getLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const leads = await leadService.getLeads(req.user?.role, req.user?.id);
      res.json(leads);
    } catch (err) {
      next(err);
    }
  }

  async getLeadById(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.getLeadById(req.params.id);
      res.json(lead);
    } catch (err) {
      next(err);
    }
  }

  async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const data = { ...req.body };
      if (req.user && !data.ownerId) {
        data.ownerId = req.user.id;
        data.ownerName = req.user.name || 'Sales Rep';
      }
      const lead = await leadService.createLead(data);
      res.status(201).json(lead);
    } catch (err) {
      next(err);
    }
  }

  async updateLead(req: Request, res: Response, next: NextFunction) {
    try {
      const lead = await leadService.updateLead(req.params.id, req.body);
      res.json(lead);
    } catch (err) {
      next(err);
    }
  }

  async deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await leadService.deleteLead(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async convertLead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await leadService.convertLead(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const leadController = new LeadController();
