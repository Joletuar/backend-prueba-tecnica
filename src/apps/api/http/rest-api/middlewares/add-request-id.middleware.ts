import crypto from 'node:crypto';

import type { NextFunction, Request, Response } from 'express';

export const addRequestId = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const reqId = crypto.randomUUID();

  (req as any).id = reqId;

  next();
};
