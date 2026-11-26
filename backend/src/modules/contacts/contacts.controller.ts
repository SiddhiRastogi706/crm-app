import { Request, Response, NextFunction } from 'express';
import { contactService } from './contacts.service';
import { AppError } from '../../utils/AppError';

export class ContactController {
  async getContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const options = {
        search: req.query.search as string,
        status: req.query.status as string,
        source: req.query.source as string,
        ownerId: req.query.ownerId as string,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      };

      // Sales rep ownership filter
      if (req.user?.role === 'SALES_REP') {
        options.ownerId = req.user.id;
      }

      const result = await contactService.getContacts(options);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getContactById(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.getContactById(req.params.id);
      res.json(contact);
    } catch (err) {
      next(err);
    }
  }

  async createContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contactData = { ...req.body };
      if (req.user && !contactData.ownerId) {
        contactData.ownerId = req.user.id;
        contactData.ownerName = req.user.name || 'Sales Rep';
      }
      const contact = await contactService.createContact(contactData);
      res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req: Request, res: Response, next: NextFunction) {
    try {
      const contact = await contactService.updateContact(req.params.id, req.body);
      res.json(contact);
    } catch (err) {
      next(err);
    }
  }

  async deleteContact(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await contactService.deleteContact(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async bulkDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await contactService.bulkDelete(req.body.ids);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async exportContacts(req: Request, res: Response, next: NextFunction) {
    try {
      const csv = await contactService.exportContacts();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="pulse_contacts.csv"');
      res.status(200).send(csv);
    } catch (err) {
      next(err);
    }
  }

  async importContacts(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file && !req.body.csvData) {
        throw new AppError('CSV file or csvData content is required', 400);
      }
      const buffer = req.file ? req.file.buffer : Buffer.from(req.body.csvData, 'utf-8');
      const result = await contactService.importContacts(buffer);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const timeline = await contactService.getTimeline(req.params.id);
      res.json(timeline);
    } catch (err) {
      next(err);
    }
  }
}

export const contactController = new ContactController();
