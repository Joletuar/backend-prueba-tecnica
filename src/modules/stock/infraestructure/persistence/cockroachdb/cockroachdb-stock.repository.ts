import status from 'http-status';

import { AppError } from '../../../../shared/domain/errors/app.error';
import { InfraestructureError } from '../../../../shared/domain/errors/infraestructure.error';
import type { PaginatedEntityWithCursor } from '../../../../shared/domain/paginated-with-cursor';
import { PRISMA_CLIENT } from '../../../../shared/infraestructure/prisma/prisma-client';
import type { StockCursor } from '../../../domain/stock-cursor';
import type { Stock } from '../../../domain/stock.entity';
import type {
  GetAllStocksProps,
  StockRepository,
} from '../../../domain/stock.repository';
import { StockPrismaMapper } from './stock-prisma.mapper';

export class CockroachDBStockRepository implements StockRepository {
  private readonly prismaClient = PRISMA_CLIENT;

  async getAll(
    props: GetAllStocksProps
  ): Promise<PaginatedEntityWithCursor<Stock, StockCursor>> {
    try {
      const limit = props.limit || 10;
      const take = limit + 1;
      const { filters = {}, sort = { field: 'time', order: 'desc' } } = props;

      const where: any = {};

      if (filters.search) {
        where.OR = [
          { ticker: { contains: filters.search, mode: 'insensitive' } },
          { company_name: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      if (filters.brokerage) {
        where.brokerage = { equals: filters.brokerage, mode: 'insensitive' };
      }

      const orderBy: any[] = [];

      if (sort.field === 'time') {
        orderBy.push({ time: sort.order });
      }

      if (sort.field === 'action') {
        orderBy.push({ action: sort.order });
      }

      if (sort.field === 'brokerage') {
        orderBy.push({ brokerage: sort.order });
      }

      orderBy.push({ id: 'asc' });

      let stocks;
      let hasMoreResults;
      let entities;

      if (props.prev) {
        const reverseOrderBy = orderBy.map((order) => {
          const key = Object.keys(order)[0] as string;
          const value = order[key as keyof typeof order];

          return { [key]: value === 'asc' ? 'desc' : 'asc' } as any;
        });

        const tempStocks = await this.prismaClient.stock.findMany({
          where,
          cursor: { id: props.prev.id },
          skip: 1,
          take,
          orderBy: reverseOrderBy,
        });

        stocks = tempStocks.reverse();
        hasMoreResults = stocks.length > limit;
        entities = hasMoreResults ? stocks.slice(-limit) : stocks;
      } else {
        let cursor = undefined;
        let skip = 0;

        if (props.next) {
          cursor = { id: props.next.id };
          skip = 1;
        }

        stocks = await this.prismaClient.stock.findMany({
          where,
          cursor,
          skip,
          take,
          orderBy,
        });

        hasMoreResults = stocks.length > limit;
        entities = hasMoreResults ? stocks.slice(0, limit) : stocks;
      }

      let hasNextPage = false;
      let hasPrevPage = false;

      if (props.next) {
        hasNextPage = hasMoreResults;
        hasPrevPage = true;
      } else if (props.prev) {
        hasPrevPage = hasMoreResults;
        hasNextPage = true;
      } else {
        hasNextPage = hasMoreResults;
        hasPrevPage = false;
      }

      const next = hasNextPage
        ? {
            id: entities[entities.length - 1]!.id,
          }
        : null;

      const prev = hasPrevPage
        ? {
            id: entities[0]!.id,
          }
        : null;

      return {
        entities: StockPrismaMapper.toDomainList(entities),
        next,
        prev,
      };
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async findAll(): Promise<Stock[]> {
    try {
      const stocks = await this.prismaClient.stock.findMany({
        orderBy: [{ time: 'desc' }, { id: 'asc' }],
      });

      return stocks.map(StockPrismaMapper.toDomain);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async getAllBrokerages(): Promise<string[]> {
    try {
      const result = await this.prismaClient.stock.findMany({
        select: { brokerage: true },
        distinct: ['brokerage'],
        orderBy: { brokerage: 'asc' },
      });

      return result.map((item) => item.brokerage);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async findById(id: string): Promise<Stock | null> {
    try {
      const stock = await this.prismaClient.stock.findUnique({
        where: { id },
      });

      return stock ? StockPrismaMapper.toDomain(stock) : null;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: unknown): never {
    if (error instanceof AppError) throw error;

    throw new InfraestructureError({
      message: 'Error in the stock repository.',
      statusCode: status.INTERNAL_SERVER_ERROR,
      isCritical: true,
      originalError: error,
    });
  }
}
