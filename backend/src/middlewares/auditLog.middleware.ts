import { Request, Response, NextFunction } from 'express';
import { prisma, isPrismaConnected } from '../lib/prisma';
import { logger } from '../config/logger';

export const auditLog = (action: string, entity: string, getEntityId?: (req: Request) => string | undefined) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run after response finishes to avoid slowing down critical path
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?.id;
        const entityId = getEntityId ? getEntityId(req) : req.params.id;
        const ipAddress = req.ip || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        if (isPrismaConnected()) {
          try {
            await prisma.auditLog.create({
              data: {
                userId,
                action,
                entity,
                entityId,
                details: JSON.stringify({
                  method: req.method,
                  path: req.originalUrl,
                  query: req.query,
                }),
                ipAddress,
                userAgent,
              },
            });
          } catch {
            logger.info({ userId, action, entity, entityId }, 'Audit Log Recorded');
          }
        } else {
          logger.info({ userId, action, entity, entityId }, 'Audit Log Recorded');
        }
      }
    });

    next();
  };
};
