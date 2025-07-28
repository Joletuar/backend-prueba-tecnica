import type { Request, Response } from 'express';
import status from 'http-status';

import {
  type ApiCursorPaginatedResponse,
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from '../contracts/api-contracts';

export class ResponseBuilder {
  static success<T>(props: {
    req: Request;
    res: Response;
    data: T;
    statusCode?: number;
  }): Response {
    const { req, res, data, statusCode = status.OK } = props;

    const response: ApiSuccessResponse<T> = {
      data,
      meta: {
        timestamp: new Date().toUTCString(),
        requestId: (req as any).id ?? 'NO_ID',
      },
    };

    return res.status(statusCode).json(response);
  }

  static successNoContent(props: {
    res: Response;
    statusCode?: number;
  }): Response {
    const { res, statusCode = status.NO_CONTENT } = props;

    return res.status(statusCode).send();
  }

  static cursorPaginated<T>(props: {
    req: Request;
    res: Response;
    data: T[];
    next: string | null;
    prev: string | null;
    statusCode?: number;
  }): Response {
    const { req, res, data, next, prev, statusCode = status.OK } = props;

    const response: ApiCursorPaginatedResponse<T> = {
      data,
      meta: {
        pagination: {
          next,
          prev,
        },
        timestamp: new Date().toUTCString(),
        requestId: (req as any).id ?? 'NO_ID',
      },
    };

    return res.status(statusCode).json(response);
  }

  static error(props: {
    req: Request;
    res: Response;
    message: string;
    statusCode?: number;
  }): Response {
    const {
      req,
      res,
      message,
      statusCode = status.INTERNAL_SERVER_ERROR,
    } = props;

    const response: ApiErrorResponse = {
      error: {
        statusCode,
        message,
        requestId: (req as any).id ?? 'NO_ID',
        timestamp: new Date().toUTCString(),
      },
    };

    return res.status(statusCode).json(response);
  }
}
