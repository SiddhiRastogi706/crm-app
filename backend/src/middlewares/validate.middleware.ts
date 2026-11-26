import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

interface RequestValidationSchema {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validate = (schema: RequestValidationSchema | AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if ('parse' in schema) {
        // If passed single schema, default to body validation
        req.body = await schema.parseAsync(req.body);
      } else {
        if (schema.params) {
          req.params = (await schema.params.parseAsync(req.params)) as any;
        }
        if (schema.query) {
          req.query = (await schema.query.parseAsync(req.query)) as any;
        }
        if (schema.body) {
          req.body = await schema.body.parseAsync(req.body);
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError('Validation failed', 400, error.errors));
      } else {
        next(error);
      }
    }
  };
};
