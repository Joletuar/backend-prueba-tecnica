import type { Request, Response } from 'express';

import type { GetAllStocks } from '../../../../../modules/stock/application/get-all-stocks/get-all-stocks.use-case';
import type { GetBrokerages } from '../../../../../modules/stock/application/get-brokerages/get-brokerages.use-case';
import type { GetStockById } from '../../../../../modules/stock/application/get-stock-by-id/get-stock-by-id.use-case';
import { ResponseBuilder } from '../helpers/response.builder';
import type {
  GetAllStocksQuery,
  GetStockByIdParams,
} from '../schemas/stock/stock.schema';

export class StockController {
  constructor(
    private readonly getAllStocks: GetAllStocks,
    private readonly getBrokerages: GetBrokerages,
    private readonly getStockById: GetStockById
  ) {}

  async getAll(req: Request, res: Response): Promise<Response> {
    const validatedQuery = (req as any).validatedQuery as GetAllStocksQuery;

    const results = await this.getAllStocks.execute({
      cursor: {
        next: validatedQuery.next,
        prev: validatedQuery.prev,
        limit: validatedQuery.limit,
      },
      filters: {
        search: validatedQuery.search,
        brokerage: validatedQuery.brokerage,
      },
      ...(validatedQuery.sortField && validatedQuery.sortOrder
        ? {
            sort: {
              field: validatedQuery.sortField,
              order: validatedQuery.sortOrder,
            },
          }
        : {}),
    });

    return ResponseBuilder.cursorPaginated({
      req,
      res,
      data: results.dtos,
      next: results.next,
      prev: results.prev,
    });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const validatedParams = (req as any).validatedParams as GetStockByIdParams;

    const stock = await this.getStockById.execute({
      id: validatedParams.id,
    });

    return ResponseBuilder.success({
      req,
      res,
      data: stock,
    });
  }

  async getAllBrokerages(req: Request, res: Response): Promise<Response> {
    const brokerages = await this.getBrokerages.execute();

    return ResponseBuilder.success({
      req,
      res,
      data: brokerages,
    });
  }
}
