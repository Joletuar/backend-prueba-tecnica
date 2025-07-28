/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import { ZodError } from 'zod';

import { AppError } from '../../../../../modules/shared/domain/errors/app.error';
import { InfraestructureError } from '../../../../../modules/shared/domain/errors/infraestructure.error';
import { NotFoundError } from '../../../../../modules/shared/domain/errors/not-found.error';
import { ResponseBuilder } from '../helpers/response.builder';
import { zodErrorHandler } from './zod-error-handler.middleware';

export const httpErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  if (error instanceof ZodError) {
    return zodErrorHandler(error, req, res);
  }

  if (error instanceof InfraestructureError) {
    const { message, statusCode, isCritical, originalError } = error;

    if (isCritical) {
      console.error('Critical error:', originalError);
    }

    return ResponseBuilder.error({
      req,
      res,
      message,
      statusCode,
    });
  }

  if (error instanceof NotFoundError) {
    return ResponseBuilder.error({
      req,
      res,
      message: error.message || 'Resource not found',
      statusCode: status.NOT_FOUND,
    });
  }

  if (error instanceof AppError) {
    return ResponseBuilder.error({
      req,
      res,
      message: error.message,
      statusCode: status.BAD_REQUEST,
    });
  }

  return ResponseBuilder.error({
    req,
    res,
    message: error.message || 'Unexpected error occurred',
    statusCode: status.INTERNAL_SERVER_ERROR,
  });
};
