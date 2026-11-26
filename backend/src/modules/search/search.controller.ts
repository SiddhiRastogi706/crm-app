import { Request, Response, NextFunction } from 'express';
import { searchService } from './search.service';

export class SearchController {
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const q = (req.query.q as string) || '';
      const results = await searchService.globalSearch(q);
      res.json(results);
    } catch (err) {
      next(err);
    }
  }
}

export const searchController = new SearchController();
