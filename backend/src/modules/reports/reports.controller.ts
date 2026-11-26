import { Request, Response, NextFunction } from 'express';
import { reportsService } from './reports.service';

export class ReportsController {
  async getRepsPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reportsService.getSalesRepPerformance();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getConversion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reportsService.getConversionReport();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async getForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reportsService.getForecastReport();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async exportCsv(req: Request, res: Response, next: NextFunction) {
    try {
      const csv = await reportsService.exportReportCsv();
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="pulse_sales_report.csv"');
      res.status(200).send(csv);
    } catch (err) {
      next(err);
    }
  }
}

export const reportsController = new ReportsController();
