import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export const validateQuery = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);

      (req as any).validatedQuery = parsed;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.params);

      (req as any).validatedParams = parsed;

      next();
    } catch (error) {
      next(error);
    }
  };
};
