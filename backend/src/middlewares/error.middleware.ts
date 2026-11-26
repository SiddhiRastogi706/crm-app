import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { logger } from '../config/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle Prisma unique constraint error
  if (err.code === 'P2002') {
    statusCode = 409;
    const target = (err.meta?.target as string[]) || ['field'];
    message = `Duplicate entry for ${target.join(', ')}`;
  }

  // Handle Prisma record not found error
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  // Log 500 errors
  if (statusCode >= 500) {
    logger.error({ err, path: req.path, method: req.method }, 'Unhandled Server Error');
  } else {
    logger.warn({ statusCode, message, path: req.path, method: req.method }, 'Operational Request Error');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};
