import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const requireRole = (...allowedRoles: Array<'ADMIN' | 'MANAGER' | 'SALES_REP' | 'admin' | 'manager' | 'sales_rep'>) => {
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized: Authentication required', 401));
    }

    const userRole = req.user.role.toUpperCase();
    if (!normalizedAllowed.includes(userRole)) {
      return next(
        new AppError(
          `Forbidden: Insufficient permissions. Required role(s): ${allowedRoles.join(', ')}`,
          403
        )
      );
    }

    next();
  };
};

export const checkOwnership = (getRecordOwnerId: (req: Request) => Promise<string | null | undefined> | string | null | undefined) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401));
    }

    // Admins and Managers have organization-wide visibility
    if (req.user.role === 'ADMIN' || req.user.role === 'MANAGER') {
      return next();
    }

    try {
      const recordOwnerId = await getRecordOwnerId(req);
      if (!recordOwnerId || recordOwnerId !== req.user.id) {
        return next(new AppError('Forbidden: You can only access your own assigned records.', 403));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
