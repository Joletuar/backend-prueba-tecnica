import type { Request, Response } from 'express';
import status from 'http-status';
import type { ZodError } from 'zod';

import { ResponseBuilder } from '../helpers/response.builder';

export const zodErrorHandler = (
  error: ZodError,
  req: Request,
  res: Response
): Response => {
  const formattedErrors = error.issues.map((issue) => {
    if (issue.code === 'custom') return issue.message;

    const field = issue.path.length > 0 ? String(issue.path[0]) : 'field';

    return `${field}: ${issue.message}`;
  });

  const message =
    formattedErrors.length === 1
      ? formattedErrors[0]!
      : `Multiple validation errors - ${formattedErrors.join('; ')}`;

  return ResponseBuilder.error({
    req,
    res,
    message,
    statusCode: status.BAD_REQUEST,
  });
};
