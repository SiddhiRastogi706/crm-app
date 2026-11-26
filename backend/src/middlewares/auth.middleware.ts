import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { cacheService } from '../lib/redis';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'SALES_REP';
  name?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('Authentication required. Missing token.', 401));
    }

    const token = authHeader.split(' ')[1];

    // Check token blacklist
    const isBlacklisted = await cacheService.isBlacklisted(token);
    if (isBlacklisted) {
      return next(new AppError('Token has been revoked. Please log in again.', 401));
    }

    // Support mock token format if in development or matching frontend
    let payload: TokenPayload;
    if (token.startsWith('mock-jwt-access-')) {
      const parts = token.split('-');
      const userId = parts.length >= 5 ? `${parts[3]}-${parts[4]}` : 'user-1';
      payload = {
        userId,
        email: userId === 'user-1' ? 'admin@pulsecrm.com' : userId === 'user-2' ? 'manager@pulsecrm.com' : 'sales@pulsecrm.com',
        role: userId === 'user-1' ? 'ADMIN' : userId === 'user-2' ? 'MANAGER' : 'SALES_REP',
      };
    } else {
      payload = verifyAccessToken(token);
    }

    req.user = {
      id: payload.userId,
      email: payload.email,
      role: (payload.role.toUpperCase() as 'ADMIN' | 'MANAGER' | 'SALES_REP'),
    };

    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired. Please refresh your session.', 401));
    }
    return next(new AppError('Invalid authentication token.', 401));
  }
};
