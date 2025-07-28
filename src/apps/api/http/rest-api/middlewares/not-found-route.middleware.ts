import type { Request, Response } from 'express';
import status from 'http-status';

export const notFoundRoute = (_req: Request, res: Response): Response => {
  return res.status(status.NOT_FOUND).json({ message: 'Route not found' });
};
